import { EventEnum } from "../common/EventEnum";
import SysMgr from "../common/SysMgr";
import { GameEvent } from "./GameEvent";


const { ccclass, property, inspector } = cc._decorator;
/**
 * 粒子系统扩展，支持暂停、倍速
 */
@ccclass
export default class ParticleSystemEx extends cc.ParticleSystem {
    private _timeSpeed: number = 1;
    private _isPause: boolean = false;

    onLoad() {
        super.onLoad?.();
        if (!cc.sys.isNative) {
            this.lateUpdate = this.h5Lateupdate;
        }
    }

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

    private h5Lateupdate(dt) {
        if (this._isPause) return;
        super.lateUpdate(dt * this._timeSpeed);
    }

    private updateTimeSpeed() {
        if (cc.sys.isNative) {
            if (this["_simulator"] && this["_simulator"].timeSpeed !== undefined) {
                this["_simulator"].timeSpeed = SysMgr.instance.warSpeed;
            }
        } else {
            this._timeSpeed = SysMgr.instance.warSpeed;
        }
    }

    private updatePause() {
        SysMgr.instance.pause ? this.pause() : this.resume();
    }

    public pause(): void {
        this._isPause = true;
        if (cc.sys.isNative && this["_simulator"] && this["_simulator"].pause !== undefined) {
            this["_simulator"].pause = true;
        }
    }

    public resume(): void {
        this._isPause = false;
        if (cc.sys.isNative && this["_simulator"] && this["_simulator"].pause !== undefined) {
            this["_simulator"].pause = false;
        }
    }
}
