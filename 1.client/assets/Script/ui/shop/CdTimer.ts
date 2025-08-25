// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

export default class CdTimer {
    private _cd: number = 0;
    private _timeLimit: number = 0;

    constructor(timeLimit: number) {
        this._timeLimit = timeLimit;
    }

    update(dt) {
        if (this._cd > 0) {
            this._cd -= dt;
            if (this._cd <= 0) this._cd = 0;
        }
    }

    reset() {
        this._cd = this._timeLimit;
    }

    isDone() {
        return this._cd <= 0;
    }

    getCd() {
        return this._cd;
    }

    stop() {
        this._cd = 0;
    }
}
