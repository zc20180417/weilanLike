

import { EventEnum } from "../../common/EventEnum";
import { GameEvent } from "../GameEvent";

const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu('Game/SystemTip')
export default class SystemTip extends cc.Component {
    @property({
        type: cc.Node,
        tooltip: 'brush'
    })
    brush: cc.Node = null;

    @property(cc.Node)
    bgNode: cc.Node = null;

    @property({
        type: cc.Label,
        tooltip: '内容Label'
    })
    contentText: cc.Label = null;

    @property(cc.Node)
    content: cc.Node = null;


    private brushStartPos: cc.Vec2 = null;
    private bgWidth: number = 0;

    show(info: string) {
        this.bgWidth = this.bgNode.width;
        this.brush.opacity = 255;
        this.brush.x = -this.bgWidth * 0.5;
        this.brushStartPos = this.brush.getPosition();
        this.content.opacity = 255;
        this.content.width = 0;
        this.contentText.string = info;
        // this.content.y = 0;
        // this.setData(info);
        //SysMgr.instance.doOnce(Handler.create(this.startMove , this) , 500 , true);
        // this.startMove();
        cc.Tween.stopAllByTarget(this.brush);
        cc.tween(this.brush).by(0.4, { x: this.bgWidth }, { easing: "cubicOut" }).delay(0.1).to(0.5, { opacity: 0 }).call(this.onBrushHided, this).start();
    }

    lateUpdate(dt: number) {
        let range = (this.brush.x - this.brushStartPos.x);
        this.content.width = range;
    }

    onBrushHided() {
        cc.Tween.stopAllByTarget(this.content);
        cc.tween(this.content).delay(0.7).to(0.5, { opacity: 0 }).call(this.onTipsEnd, this).start();
    }

    onTipsEnd() {
        GameEvent.emit(EventEnum.SYSTEM_TIPS_HIDE, this);
    }

    // public moveTo(y: number) {
    //     this.node.stopAllActions();
    //     cc.tween(this.content).to(0.15, { y: y }).start();
    // }

    // public startMove() {
    //     let self = this;
    //     this._tween = cc.tween(this.content)
    //         .to(0.8, { y: this.content.y + 120 })
    //         .call(function () {
    //             self.startHide();
    //         })
    //         .start();
    // }

    // public startHide() {
    //     let self = this;
    //     this._tween = cc.tween(this.content)
    //         .to(0.5, { opacity: 0 })
    //         .call(function () {
    //             self.hide();
    //         })
    //         .start();
    // }

}