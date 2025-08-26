// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


import { EventEnum } from "../common/EventEnum";
import Game from "../Game";
import { GameEvent } from "../utils/GameEvent";
import { StringUtils } from "../utils/StringUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TransitionBase extends cc.Component {

    _data: any = null;
    openSound:string = null;
    setData(data) {
        this._data = data;
    }

    onLoad() {
        GameEvent.on(EventEnum.EVENT_AFTER_SCENE_LAUNCH, this.afterSceneLaunch, this);
        GameEvent.on(EventEnum.INIT_MAP_DATA_END, this.afterSceneLaunch, this);
    }

    onDestroy() {
        GameEvent.off(EventEnum.EVENT_AFTER_SCENE_LAUNCH, this.afterSceneLaunch, this);
        GameEvent.off(EventEnum.INIT_MAP_DATA_END, this.afterSceneLaunch, this);
    }

    /**
     * 过渡动画开始
     */
    protected onStart() {
        GameEvent.emit(EventEnum.TRANSITION_START);
    }

    /**
     * 过渡动画进行了一半
     */
    protected onMid() {
        GameEvent.emit(EventEnum.TRANSITION_MID);
        if (!StringUtils.isNilOrEmpty(this.openSound)) {
            Game.soundMgr.playSound(this.openSound);
        }
    }

    /**
     * 过渡动画结束
     */
    protected onEnd() {
        GameEvent.emit(EventEnum.TRANSITION_END);
    }

    /**
     * 过渡动画隐藏到一半
     */
    protected onHideHalf() {
        GameEvent.emit(EventEnum.TRANSITION_HIDE_HALF);
    }

    /**
     * 过渡动画显示到一半
     */
    protected onShowHalf() {
        GameEvent.emit(EventEnum.TRANSITION_SHOW_HALF);
    }


    protected afterSceneLaunch() {

    }

}
