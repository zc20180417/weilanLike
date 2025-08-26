// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import TransitionBase from "./TransitionBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TransitionWave extends TransitionBase {
    @property(cc.Animation)
    cloudAni: cc.Animation = null;

    @property(cc.Node)
    particle: cc.Node = null;

    @property(cc.Node)
    hideNode: cc.Node = null;

    @property(cc.Node)
    bubbleParticle: cc.Node = null;

    @property(cc.Node)
    bg: cc.Node = null;

    start() {
        this.bg.width = cc.winSize.width;
        this.onStart();
    }

    /**
     * 过渡动画开始
     */
    protected onStart() {
        this.playHideTransitionAni();
        super.onStart();
    }

    protected afterSceneLaunch() {
        this.playShowTransitionAni();
    }

    playHideTransitionAni() {
        this.cloudAni.play("wave-hide");

    }

    playShowTransitionAni() {
        // this.cloudAni.play("wave-open");
        if (this.particle && this.particle.isValid) {
            this.particle.active = true;
        }
        if (this.bubbleParticle && this.bubbleParticle.isValid) {
            this.bubbleParticle.active = false;
        }
        cc.tween(this.hideNode).delay(0.5).to(1.5, { opacity: 0 }).start();
        this.scheduleOnce(this.onShowHalf, 1.8);
        this.scheduleOnce(this.onEnd, 2.5);
    }
}
