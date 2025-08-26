// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { EventEnum } from "../common/EventEnum";
import SysMgr from "../common/SysMgr";
import { NodeParticleSystem } from "../libs/particle/NodeParticleSystem";
import { GameEvent } from "./GameEvent";



const { ccclass, property } = cc._decorator;

@ccclass
export default class NodeParticleSystemEx extends NodeParticleSystem {
    private _isPause: boolean = false;
    private _timeSpeed: number = 1;

    protected onEnable(): void {
        super.onEnable?.();
        GameEvent.on(EventEnum.TIME_SPEED, this.updateTimeSpeed, this);
        GameEvent.on(EventEnum.GAME_PAUSE, this.updatePause, this);
        this.updateTimeSpeed();
        this.updatePause();
    }

    protected onDisable(): void {
        GameEvent.off(EventEnum.TIME_SPEED, this.updateTimeSpeed, this);
        GameEvent.off(EventEnum.GAME_PAUSE, this.updatePause, this);
        super.onDisable?.();
    }
    
    lateUpdate(dt) {
        if (this._isPause) return;
        super.lateUpdate(dt * this._timeSpeed);
    }

    private updateTimeSpeed() {
        this._timeSpeed = SysMgr.instance.warSpeed;
    }

    private updatePause() {
        SysMgr.instance.pause ? this.pause() : this.resume();
    }

    public pause(): void {
        this._isPause = true;
    }

    public resume(): void {
        this._isPause = false;
    }
}
