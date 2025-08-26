// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Shader from "../Shader";

const { ccclass, property, executeInEditMode } = cc._decorator;

@ccclass
@executeInEditMode
export default class OutLine extends Shader {
    @property
    private _offsetX: number = 0.01;

    @property
    get offsetX(): number {
        return this._offsetX;
    }
    set offsetX(value: number) {
        this._offsetX = value;
        this.updateOffsetX();
    }
    
    @property
    private _offsetY: number = 0.01;

    @property
    get offsetY(): number {
        return this._offsetY;
    }
    set offsetY(value: number) {
        this._offsetY = value;
        this.updateOffsetY();
    }

    @property
    private _waveSpeed: number = 0.05;

    @property
    get waveSpeed(): number {
        return this._waveSpeed;
    }
    set waveSpeed(value: number) {
        this._waveSpeed = value;
        this.updateWaveSpeed();
    }

    // @property
    // private _time: number = 0;
    // @property
    // get time(): number {
    //     return this._time;
    // }
    // set time(value: number) {
    //     this._time = value;
    //     this.updateTime();
    // }

    // protected update(dt: number): void {
    //     this.time = cc.director.getTotalTime() * 0.001;
    //     // this.updateTime();
    // }

    public updateOffsetX() {
        this.material.setProperty("offsetX", this._offsetX);
    }

    public updateOffsetY() {
        this.material.setProperty("offsetY", this._offsetY);
    }

    public updateWaveSpeed() {
        this.material.setProperty("waveSpeed", this._waveSpeed);
    }

    // public updateTime() {
    //     this.material.setProperty("time", this._time);
    // }
}
