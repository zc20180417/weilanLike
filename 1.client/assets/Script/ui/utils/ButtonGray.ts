// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class ButtonGray extends cc.Component {
    @property(cc.Node)
    grayNodes: cc.Node[] = [];

    @property(cc.Color)
    grayColor: cc.Color = cc.color(244, 244, 244, 255);

    @property(cc.Color)
    normalColor: cc.Color = cc.color(255, 255, 255, 255);

    onEnable() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchBegin, this, true);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this, true);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this, true);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd, this, true);
    }



    onDisable() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchBegin, true);
        this.node.off(cc.Node.EventType.TOUCH_END, this.touchEnd, true);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touchMove, true);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd, true);
    }

    private touchBegin() {
        if (this.grayNodes[0]) {
            if (!this.grayNodes[0].parent.getComponent(cc.Button).interactable) return;
        }
        this.grayNodes.forEach((v) => {
            v.color = this.grayColor;
            v.y -= 2;
        });
    }

    private touchMove() {

    }

    private touchEnd() {
        if (this.grayNodes[0]) {
            if (!this.grayNodes[0].parent.getComponent(cc.Button).interactable) return;
        }
        this.grayNodes.forEach((v) => {
            v.color = this.normalColor;
            v.y += 2;
        });
    }
}
