// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import TransitionBase from "./TransitionBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Transition_7 extends TransitionBase {

    @property(dragonBones.ArmatureDisplay)
    dragon: dragonBones.ArmatureDisplay = null;

    start() {
        this.dragon.on(dragonBones.EventObject.COMPLETE, this.onComplete, this);
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
        this.dragon.playAnimation("hide", 1);
    }

    playShowTransitionAni() {
        this.dragon.playAnimation("open", 1);
    }

    private onComplete(event) {
        let animationState = event.animationState;
        switch (animationState.name) {
            case "open":
                this.onShowHalf();
                this.onEnd();
                break;
            case "hide":
                this.onMid();
                break;
        }
    }
}
