// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class BtnUpEffect extends cc.Component {

    @property(cc.Node)
    icon: cc.Node = null;

    YOffset: number = 0;

    originY: number = 0;

    onLoad() {
        this.YOffset = 10;
        this.originY = this.icon.y;
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd, this);
    }

    touchStart() {
        cc.Tween.stopAllByTarget(this.icon);
        this.icon.y = this.originY;
        cc.tween(this.icon).by(0.2, { y: this.YOffset }, { easing: "quadOut" }).start();
    }

    touchMove() {

    }

    touchEnd() {
        cc.Tween.stopAllByTarget(this.icon);
        // this.icon.y = this.originY;
        cc.tween(this.icon).to(0.2, { y: this.originY }, { easing: "quadIn" }).start();
    }

    onDisable() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd, this);
    }
}
