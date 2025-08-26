/*
 * @Author: BMIU 
 * @Date: 2021-01-08 20:08:15 
 * @Last Modified by: BMIU
 * @Last Modified time: 2021-01-20 16:18:13
 */

import { EventEnum } from "../common/EventEnum";
import { GameEvent } from "../utils/GameEvent";
import TransitionBase from "./TransitionBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TransitionFire extends TransitionBase {

    @property(cc.Animation)
    cloudAni: cc.Animation = null;

    @property(cc.Node)
    mask: cc.Node = null;

    @property(cc.Node)
    maskTwo: cc.Node = null;

    @property(cc.ParticleSystem)
    particle: cc.ParticleSystem = null;

    start() {
        this.maskTwo.active = false;
        this.maskTwo.setContentSize(cc.winSize);
        this.mask.width = cc.winSize.width;
        this.mask.height = cc.winSize.height;
        this.onStart();
        GameEvent.on(EventEnum.CP_TASK_VIEW_SHOWED, this.onCpTaskViewShowed, this);
    }

    onDestroy() {
        GameEvent.targetOff(this);
        super.onDestroy();
    }

    onCpTaskViewShowed() {
        this.maskTwo.active = false;
    }

    /**
     * 过渡动画开始
     */
    protected onStart() {
        this.playHideTransitionAni();
        super.onStart();
    }

    /**
     * 过渡动画显示到一半
     */
    protected onShowHalf() {
        let scene = cc.director.getScene();
        if (scene.name == "MainScene") {
            this.mask.active = false;
            this.maskTwo.active = true;
        }
        super.onShowHalf();
    }

    protected stopParticle() {
        this.particle.stopSystem();
    }

    protected afterSceneLaunch() {
        this.playShowTransitionAni();
    }

    playHideTransitionAni() {
        this.cloudAni.play("fireHide");

    }

    playShowTransitionAni() {
        this.cloudAni.play("fireOpen");
    }

    private changeParticleColor() {
        this.particle.endColor = cc.color(255, 255, 255, 0);
    }
}
