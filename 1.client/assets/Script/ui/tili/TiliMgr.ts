import { GameDataCtrl } from "../../logic/gameData/GameDataCtrl";
import { EMODULE, ItemMoneyType } from "../../common/AllEnum";
import SysMgr from "../../common/SysMgr";
import { Handler } from "../../utils/Handler";
import Game from "../../Game";
import { LocalStorageMgr } from "../../utils/LocalStorageMgr";
import { EventEnum } from "../../common/EventEnum";
import { GameEvent } from "../../utils/GameEvent";

export class TiliMgr extends GameDataCtrl {

    private _addCountOnce:number = 1;
    private _addTimeDy:number = 60000;
    private _preAddTime:number = -1;
    private _tiliMax:number = 0;
    private _timer:Handler;
    private _isAddTimer:boolean = false;
    private _cfg:any = {};
    
    constructor() {
        super();
        this.module = EMODULE.TILI;
        this._timer = new Handler(this.onTimer , this);
        GameEvent.on(EventEnum.ITEM_COUNT_CHANGE, this.itemChange, this);

        this._cfg = [
            {count:1 , price:0 , leftBuyCount:100 , ico:'ico_yu_s'},
            {count:1 , price:25 , leftBuyCount:0 , ico:'ico_yu_m'},
            {count:5 , price:100 , leftBuyCount:0 , ico:'ico_guant'},
            {count:10 , price:188 , leftBuyCount:0 , ico:'img_guant_m'},
        ];
    }

    init() {
        this._tiliMax = Game.itemMgr.getItemCfg(ItemMoneyType.TILI).maxCount;
        let time:number = cc.sys.now();
        this.read();
        if (this._preAddTime == -1) {
            this._preAddTime = time;
            this.addTili(this._tiliMax);
            //SysMgr.instance.doOnce(new Handler(this.onInitTime , this) , this._addTimeDy ,true);
            return;
        }

        let curTili = Game.itemMgr.getItemCount(ItemMoneyType.TILI);
        if (curTili < this._tiliMax) {
            let dyTime = time - this._preAddTime;
            let count = Math.floor(dyTime / this._addTimeDy) * this._addCountOnce;
            
            let temp:number = (dyTime % this._addTimeDy)
            this._preAddTime = time - temp;
            SysMgr.instance.doOnce(new Handler(this.onInitTime , this) , this._addTimeDy - temp , true);
            this._isAddTimer = true;
            this.addTili(count);
        }

        
        //this.addTili(10);
    }

    private onTimer() {
        this._preAddTime = cc.sys.now();
        this.addTili(this._addCountOnce);
    }

    private onInitTime() {
        this._isAddTimer = false;
        this.addTimer();
        this.addTili(this._addCountOnce);
    }

    private addTili(count:number) {
        Game.itemMgr.addItem(ItemMoneyType.TILI , count);
        this.write();
    }

    private itemChange(id: number, count: number) {
        if (id == ItemMoneyType.TILI) {
            if (count == this._tiliMax) {
                this._isAddTimer = false;
                SysMgr.instance.clearTimer(this._timer , true);
            } else if (!this._isAddTimer) {
                this.addTimer();
            }
        }
    }

    private addTimer() {
        if (this._isAddTimer) {
            return;
        }
        this._isAddTimer = true;
        this._preAddTime = cc.sys.now();
        SysMgr.instance.doLoop(this._timer , this._addTimeDy , 0 ,true);
    }

    getLeftTime():number {
        let time = cc.sys.now() - this._preAddTime;
        return  this._addTimeDy - time;
    }

    getMaxTili():number {
        return this._tiliMax;
    }
    
    write() {
        this.writeData(this._preAddTime);
    }

    read() {
        let saveData = this.readData();
        this._preAddTime = saveData ? Number(saveData) : -1; 
    }

    readData():number {
        return Number(LocalStorageMgr.getItem(this.module));
    }

    getCfg():any[] {
        return this._cfg;
    }

}