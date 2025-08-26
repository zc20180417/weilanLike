import { BaseAction } from "./BaseAction";
import { EActionName } from "../comps/animation/AnimationComp";
import SysMgr from "../../common/SysMgr";
import { Handler } from "../../utils/Handler";
import { EventEnum } from "../../common/EventEnum";
import { EActType } from "./ActMach";

export class IdleAction extends BaseAction {

    private static DY_TIME: number = 4000;
    private _timerHandler: Handler;

    init() {
        this._timerHandler = new Handler(this.doIdle2Action, this);
        
    }

    start() {
        this.owner.on(EventEnum.ACTION_PLAY_END, this.onPlayEnd, this);
        this.playIdle();
    }

    end() {
        this.owner.off(EventEnum.ACTION_PLAY_END, this.onPlayEnd, this);
        super.end();
        this.clearTimer();
    }

    cancel() {
        this.owner.off(EventEnum.ACTION_PLAY_END, this.onPlayEnd, this);
        this.clearTimer();
    }

    dispose() {
        this.owner.off(EventEnum.ACTION_PLAY_END, this.onPlayEnd, this);
        this.clearTimer();
        Handler.dispose(this);
    }

    private doIdle2Action() {
        this.owner.changeTo(EActType.IDLE2);
    }

    private playIdle() {
        this.owner.animationComp.playAction(EActionName.IDLE, true);
        SysMgr.instance.doOnce(this._timerHandler, IdleAction.DY_TIME);
    }

    private clearTimer() {
        SysMgr.instance.clearTimer(this._timerHandler);
    }

    private onPlayEnd(actName: string) {
        if (actName == EActionName.IDLE2) {
            this.playIdle();
        }
    }
}