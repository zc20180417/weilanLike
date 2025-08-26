

import { EventEnum } from "../../../common/EventEnum";
import SysMgr from "../../../common/SysMgr";
import { BaseEffect } from "../../../utils/effect/BaseEffect";
import { GameEvent } from "../../../utils/GameEvent";

const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("effect/DbEftComp")
export class DbEftComp extends BaseEffect {
    @property(dragonBones.ArmatureDisplay)
    dragon: dragonBones.ArmatureDisplay = null;

    private _armature: any;
    private _curAnimationState: dragonBones.AnimationState;
    private _animationNames:any[] = [];

    onLoad() {

    }

    start() {
        this.dragon.on(dragonBones.EventObject.COMPLETE, this.dragonEventHandler, this);
        this.dragon.on(dragonBones.EventObject.LOOP_COMPLETE, this.dragonEventHandler, this);
        
        GameEvent.on(EventEnum.TIME_SPEED, this.onTimeSpeedChange, this);
        this._armature = this.dragon.armature();
        this._animationNames = this.dragon.getAnimationNames(this._armature.name);
        this.onTimeSpeedChange(SysMgr.instance.warSpeed);
        this.tryPlay();
    }

    private dragonEventHandler(event: any) {
        if (this._playEndHandler != null) {
            this._playEndHandler.execute();
        }
    }

    private tryPlay() {
        if (this._animationNames.length > 0) {
            this._curAnimationState = this.dragon.playAnimation(this._animationNames[0], 0);
        }
    }

    play() {
        if (this._curAnimationState) {
            this._curAnimationState.play();
        }
    }

    pause() {
        if (this._curAnimationState) {
            this._curAnimationState.stop();
        }
    }

    resume() {
        if (this._curAnimationState) {
            this._curAnimationState.play();
        }
    }

    protected doGamePause(boo:Boolean) {
        if (boo) {
            this.pause();
        } else {
            this.resume();
        }
    }
    
    private onTimeSpeedChange(value: number) {
        this.dragon.timeScale = value;
    }

    onDestroy() {
        GameEvent.off(EventEnum.TIME_SPEED, this.onTimeSpeedChange, this);
    }


}