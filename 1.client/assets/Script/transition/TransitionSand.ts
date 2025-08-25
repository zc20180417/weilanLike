/*
 * @Author: BMIU 
 * @Date: 2021-01-08 20:08:15 
 * @Last Modified by: BMIU
 * @Last Modified time: 2021-01-20 18:14:49
 */


import TransitionBase from "./TransitionBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TransitionSand extends TransitionBase {

    @property(cc.Animation)
    cloudAni: cc.Animation = null;

    @property(cc.Node)
    mask: cc.Node = null;

    @property(cc.ParticleSystem)
    particle: cc.ParticleSystem = null;

    start() {
        this.mask.width = cc.winSize.width;
        this.mask.height = cc.winSize.height;
        this.onStart();
        // GameEvent.on(EventEnum.CP_TASK_VIEW_SHOWED, this.onCpTaskViewShowed, this));
    }
    
    /**
     * 过渡动画开始
     */
    protected onStart() {
        this.playHideTransitionAni();
        super.onStart();
    }

    protected stopParticle() {
        this.particle.stopSystem();
    }

    protected afterSceneLaunch() {
        this.playShowTransitionAni();
    }

    playHideTransitionAni() {
        this.cloudAni.play("sandHide");

    }

    playShowTransitionAni() {
        this.cloudAni.play("sandOpen");
    }

    private changeParticleColor() {
        this.particle.endColor = cc.color(255, 255, 255, 0);
    }
}
