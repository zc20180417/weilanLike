
import { EventEnum } from "../../../common/EventEnum";
import SysMgr from "../../../common/SysMgr";
import { BaseEffect } from "../../../utils/effect/BaseEffect";
import { GameEvent } from "../../../utils/GameEvent";




const { ccclass, property, menu } = cc._decorator;

@ccclass()
@menu("effect/SpineEffect")
export class SpineEffect extends BaseEffect {
    @property(sp.Skeleton)
    skeleton:sp.Skeleton = null;

    @property
    animation:string = "";

    private _timeScale:number = 1;
    start() {
        let self = this;
        this.skeleton.setCompleteListener(()=> {
            self.dragonEventHandler();
        });
        this._timeScale = this.skeleton.timeScale;
        GameEvent.on(EventEnum.TIME_SPEED, this.onTimeSpeedChange, this);
        this.onTimeSpeedChange(SysMgr.instance.warSpeed);
        this.tryPlay();
    }

    private dragonEventHandler() {
        if (this._playEndHandler != null) {
            this._playEndHandler.execute();
        }
    }

    private tryPlay() {
        this.skeleton.animation = this.animation;
    }

    play() {
        this.skeleton.animation = this.animation;
    }

    pause() {
        this.skeleton.paused = true;
    }

    resume() {
        this.skeleton.paused = false;
    }

    protected doGamePause(boo:Boolean) {
        if (boo) {
            this.pause();
        } else {
            this.resume();
        }
    }
    
    private onTimeSpeedChange(value: number) {
        this.skeleton.timeScale = value * this._timeScale;
    }

    onDestroy() {
        GameEvent.off(EventEnum.TIME_SPEED, this.onTimeSpeedChange, this);
    }
}


