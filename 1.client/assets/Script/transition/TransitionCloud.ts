// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import TransitionBase from "./TransitionBase";


const { ccclass, property } = cc._decorator;

@ccclass
export default class TransitionCloud extends TransitionBase {

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
        this.cloudAni.play("cloudHide");

    }

    playShowTransitionAni() {
        this.cloudAni.play("cloudOpen");
    }

    private changeParticleColor(){
        this.particle.endColor=cc.color(255,255,255,0);
    }
}
