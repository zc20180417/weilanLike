// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EResPath } from "../common/EResPath";
import Game from "../Game";
import MathUtil from "../logic/map/MathUtil";
import { Handler } from "../utils/Handler";
import { MathUtils } from "../utils/MathUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MultiPageView extends cc.Component {
    @property(cc.Node)
    preNode: cc.Node = null;

    @property(cc.Node)
    nextNode: cc.Node = null;

    private _refreshHandler: Handler = null;

    private _data: Array<any> = null;

    private _currIndex: number = -1;
    private _musicPath: string = null;

    setRefreshHandler(handler: Handler) {
        this._refreshHandler = handler;
    }

    setData(data: Array<any>) {
        if (!data || data.length == 0) return;
        this.preNode.on("click", this.clickPre, this);
        this.nextNode.on("click", this.clickNext, this);
        this._data = data;
        // this.selectPage(0);
    }

    setMusicPath(path: string) {
        this._musicPath = path;
    }

    clickPre(playSound: boolean = true) {
        if (!this._data) return;
        this._musicPath && Game.soundMgr.playSound(this._musicPath);
        this.selectPage(MathUtils.clamp(this._currIndex - 1, 0, this._data.length - 1));
    }

    clickNext(playSound: boolean = true) {
        if (!this._data) return;
        playSound && this._musicPath && Game.soundMgr.playSound(this._musicPath);
        this.selectPage(MathUtils.clamp(this._currIndex + 1, 0, this._data.length - 1));
    }

    selectPage(index: number) {
        if (this._currIndex == index) return;
        this._currIndex = index;
        if (this._refreshHandler && this._data && this._data[this._currIndex]) {
            this._refreshHandler.executeWith(this._currIndex, this._data[this._currIndex]);
        }
        this.refreshBtnState();
    }

    refreshCurrPage() {
        if (this._refreshHandler && this._data && this._data[this._currIndex]) {
            this._refreshHandler.executeWith(this._currIndex, this._data[this._currIndex]);
        }
    }

    getCurrIndex(): number {
        return this._currIndex;
    }

    private refreshBtnState() {
        this.preNode.active = this._currIndex != 0;
        this.nextNode.active = this._data && this._currIndex != this._data.length - 1;
    }
}
