// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import RedLineBase from "./RedLineBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DoubleRedLine extends RedLineBase {
    @property(cc.Node)
    lineOne: cc.Node = null;

    @property(cc.Node)
    lineTwo: cc.Node = null;

    @property
    lineAngle: number = 60;

    @property
    lineTime: number = 2;

    @property(cc.Node)
    redPoint: cc.Node = null;

    _animationFinished: boolean = true;

    start() {
        this.hide();
        // this.startAim(AIM_TYPE.TWO_LINE);
    }

    /**
     * 隐藏红点和激光
     */
    protected hide() {
        this.lineOne.active = false;
        this.lineTwo.active = false;
        this.redPoint.active = false;
    }

    /**
     * 显示红点和激光
     */
    protected show() {
        this.lineOne.active = true;
        this.lineTwo.active = true;
        this.redPoint.active = true;
    }

    startAim() {
        this.show();
        this.playAni();
    }

    stopAim() {
        this.hide();
        this.lineOne.stopAllActions();
        this.lineTwo.stopAllActions();
    }

    /**
     * 瞄准目标
     * @param target 
     */
    aimAt(selfPos: cc.Vec2, angle: number,length:number) {
        /*
        let pos = cc.v2(0, 0);
        // let localPos = cc.v2(0, 0);

        if (this.node.parent) {
            pos = this.node.parent.convertToNodeSpaceAR(selfPos);
        }
        */
        this.node.setPosition(selfPos);
        this.node.angle = angle;
    }

    playAni() {
        this.lineOne.width = cc.winSize.width + cc.winSize.height;
        this.lineOne.angle = this.lineAngle;
        this.lineTwo.width = cc.winSize.width + cc.winSize.height;
        this.lineTwo.angle = -this.lineAngle;

        let one = cc.rotateTo(1, 0);
        let two = one.clone();

        this.lineOne.runAction(cc.sequence(one, cc.callFunc(this.animationCompleted, this)));
        this.lineTwo.runAction(two);


        // cc.tween(this.lineOne).to(2, { angle: 0 }).call(this.animationCompleted.bind(this)).start();
        // cc.tween(this.lineTwo).to(2, { angle: 0 }).start();
    }

    animationCompleted() {
        cc.log("animationCompleted");
    }

    pause() {
        this.lineOne.pauseAllActions();
        this.lineTwo.pauseAllActions();
    }

    resume() {
        this.lineOne.resumeAllActions();
        this.lineTwo.resumeAllActions();
    }
}
