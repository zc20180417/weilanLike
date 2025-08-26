// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import TransitionBase from "./TransitionBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TransitionMarsh extends TransitionBase {
    @property(cc.Animation)
    cloudAni: cc.Animation = null;

    @property(cc.Node)
    mask: cc.Node = null;

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

    protected afterSceneLaunch() {
        this.playShowTransitionAni();
    }

    playHideTransitionAni() {
        this.cloudAni.play("marshHide");

    }

    playShowTransitionAni() {
        this.cloudAni.play("marshOpen");
    }

}
