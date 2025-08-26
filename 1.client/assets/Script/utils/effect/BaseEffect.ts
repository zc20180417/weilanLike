import { EventEnum } from "../../common/EventEnum";
import { GameEvent } from "../GameEvent";
import { Handler } from "../Handler";

const {ccclass, property} = cc._decorator;

/**
 * 对话框
 */
@ccclass
export class BaseEffect extends cc.Component {

    @property
    needPause:boolean = false;

    protected _playEndHandler:Handler = null;
    start() {
        GameEvent.on(EventEnum.GAME_PAUSE , this.onGamePause , this);
    }

    play() {
    }

    stop() {

    }

    set playEndHandler(value:Handler) {
        this._playEndHandler = value;
    }

    get playEndHandler():Handler {
        return this._playEndHandler;
    }

    private onGamePause(boo:boolean) {
        if (this.needPause) {
            this.doGamePause(boo);
        }
    }

    protected doGamePause(boo:boolean) {

    }

    onDestroy() {
        GameEvent.off(EventEnum.GAME_PAUSE , this.onGamePause , this);
    }
}