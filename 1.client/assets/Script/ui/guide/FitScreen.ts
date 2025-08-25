// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

/**
 * 在父节点坐标变化时，始终保持当前节点大小和屏幕大小一致
 */

@ccclass
export default class FitScreen extends cc.Component {
    private screenCenterPos: cc.Vec2 = null;
    private _v1: cc.Vec2 = cc.v2();

    protected onLoad(): void {
        this.node.setContentSize(cc.winSize);
        this.screenCenterPos = cc.v2(cc.winSize.width, cc.winSize.height).multiplyScalar(0.5);
        this.onParentPositionChanged();
        if (this.node.parent) {
            this.node.parent.on(cc.Node.EventType.POSITION_CHANGED, this.onParentPositionChanged, this);
        }
    }

    private onParentPositionChanged() {
        this.node.parent.convertToNodeSpaceAR(this.screenCenterPos, this._v1);
        this.node.setPosition(this._v1);
    }

    protected onDestroy(): void {
        if (this.node.parent) {
            this.node.parent.off(cc.Node.EventType.POSITION_CHANGED, this.onParentPositionChanged, this);
        }
    }
}
