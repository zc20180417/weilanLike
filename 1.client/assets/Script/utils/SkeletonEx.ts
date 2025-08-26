import { EventEnum } from "../common/EventEnum";
import GlobalVal from "../GlobalVal";
import { GameEvent } from "./GameEvent";

const { ccclass, inspector } = cc._decorator;
/**
 * spine扩展，支持倍速
 */
@ccclass
@inspector('packages://inspector/inspectors/comps/skeleton2d.js')
export default class SkeletonEx extends sp.Skeleton {
    private _timeSpeed: number = 1;
    public get timeSpeed(): number {
        return this._timeSpeed;
    }
    public set timeSpeed(value: number) {
        this._timeSpeed = value;
    }

    private _enableSpeed: boolean = true;
    get enableSpeed(): boolean {
        return this._enableSpeed;
    }
    set enableSpeed(value: boolean) {
        this._enableSpeed = value;
        this.updateTimeSpeed(GlobalVal.warSpeed);
    }

    protected onLoad(): void {
        super.onLoad?.();
        if (!cc.sys.isNative) {
            this.update = this.h5Update;
        }
    }

    protected onEnable(): void {
        super.onEnable?.();
        GameEvent.on(EventEnum.TIME_SPEED, this.updateTimeSpeed, this);
        this.updateTimeSpeed(GlobalVal.warSpeed);
    }

    protected onDisable(): void {
        GameEvent.off(EventEnum.TIME_SPEED, this.updateTimeSpeed, this);
        super.onDisable?.();
    }

    private h5Update(dt) {
        super.update(dt * this._timeSpeed);
    }

    private updateTimeSpeed(speed:number) {
        // if (cc.sys.isNative && this["_nativeSkeleton"] && this["_nativeSkeleton"].timeSpeed !== undefined) {
        //     this._timeSpeed = this._enableSpeed ? speed : 1;
        //     this["_nativeSkeleton"].timeSpeed = this._timeSpeed;
        // } else {
        //     this._timeSpeed = this._enableSpeed ? speed : 1;
        // }
    }
}
