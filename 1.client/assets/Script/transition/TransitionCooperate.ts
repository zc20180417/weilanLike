import { EventEnum } from "../common/EventEnum";
import { GameEvent } from "../utils/GameEvent";
import Sugar from "./Sugar";
import TransitionBase from "./TransitionBase";

const { ccclass, property , menu} = cc._decorator;

@ccclass
@menu('Game/transition/TransitionCooperate')
export class TransitionCooperate extends TransitionBase {
    @property(cc.Node)
    sugarNode: cc.Node = null;

    onLoad(): void {
        // cc.log(111);
    }

    start() {
        this.onStart();
        GameEvent.on(EventEnum.NETWORK_GAME_START, this.playShowTransitionAni, this);
    }

    onDestroy(): void {
        GameEvent.off(EventEnum.NETWORK_GAME_START, this.playShowTransitionAni, this);
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