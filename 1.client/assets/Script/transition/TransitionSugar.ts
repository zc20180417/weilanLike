// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Sugar from "./Sugar";
import TransitionBase from "./TransitionBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TransitionSugar extends TransitionBase {
    @property(cc.Node)
    sugarNode: cc.Node = null;

    start() {
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
        let children = this.sugarNode.children;
        children.forEach((node) => {
            let sugarCom = node.getComponent(Sugar);
            sugarCom.playStartAni();
        });
        this.scheduleOnce(this.onMid, 1.1);
    }

    playShowTransitionAni() {
        let children = this.sugarNode.children;
        children.forEach((node) => {
            let sugarCom = node.getComponent(Sugar);
            sugarCom.playEndAni();
        });
        this.scheduleOnce(this.onShowHalf, 0.7);
        this.scheduleOnce(this.onEnd, 0.9);
    }
}
