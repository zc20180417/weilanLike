// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class BoxInScreen extends cc.Component {
    @property
    paddingTop: number = 0;
    @property
    paddingBottom: number = 0;
    @property
    paddingLeft: number = 0;
    @property
    paddingRight: number = 0;

    public updateLayout() {
        let worldBox = this.node.getBoundingBoxToWorld();
        let topOffset = worldBox.yMax + this.paddingTop - cc.winSize.height;
        let bottomOffset = worldBox.yMin - this.paddingBottom;
        let leftOffset = worldBox.xMin - this.paddingLeft;
        let rightOffset = worldBox.xMax + this.paddingRight - cc.winSize.width;
        if (topOffset > 0) {
            this.node.y -= topOffset;
        } else if (bottomOffset < 0) {
            this.node.y -= bottomOffset;
        }

        if (rightOffset > 0) {
            this.node.x -= rightOffset;
        } else if (leftOffset < 0) {
            this.node.x -= leftOffset;
        }
    }
}
