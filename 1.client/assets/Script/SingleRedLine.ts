// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import RedLineBase from "./RedLineBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SingleRedLine extends RedLineBase {
    @property(cc.Node)
    lineOne: cc.Node = null;

    @property(cc.Node)
    redPoint: cc.Node = null;

    start() {
        this.hide();
        // this.startAim(AIM_TYPE.TWO_LINE);
    }

    /**
     * 隐藏红点和激光
     */
    protected hide() {
        this.lineOne.active = false;
        this.redPoint.active = false;
    }

    /**
     * 显示红点和激光
     */
    protected show() {
        this.lineOne.active = true;
        this.redPoint.active = true;
    }

    startAim() {
        this.show();
        this.playAni();
    }

    stopAim() {
        this.hide();
    }

    /**
     * 瞄准目标
     * @param target 
     */
    aimAt(selfPos: cc.Vec2, angle: number, length: number) {
        /*
        let pos = cc.v2(0, 0);
        // let localPos = cc.v2(0, 0);
        if (this.node.parent) {
            pos = this.node.parent.convertToNodeSpaceAR(selfPos);
            // localPos = this.node.parent.convertToNodeSpaceAR(target);
            // cc.log("枪口坐标", pos.x, pos.y);
        }
        */
        this.node.setPosition(selfPos);

        // cc.log(this.node.convertToNodeSpaceAR(cc.Vec2.ZERO));
        // cc.log("原始点", target.x, target.y);
        // cc.log("目标点", localPos.x, localPos.y);
        // let angle = cc.v2(1, 0).signAngle(localPos.sub(pos)) / Math.PI * 180;
        this.node.angle = angle;
        this.lineOne.width = length;
        this.redPoint.x = length;
    }

    playAni() {
        this.lineOne.width = 0;
        this.lineOne.angle = 0;
    }

    animationCompleted() {
        cc.log("animationCompleted");
    }
}
