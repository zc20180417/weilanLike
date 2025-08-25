import { WarEventType } from "../common/AllEnum";
import { EResPath } from "../common/EResPath";
import Game from "../Game";

export class WarEventCtrl {


    private _warCfg:any;
    initCfg() {
        this._warCfg = Game.gameConfigMgr.getCfg(EResPath.WAR_EVENT_CFG);
    }

    getData(id:number):any {
        return this._warCfg[id];
    }

    isCreateTower(info:any):boolean {
        return info && info.type == WarEventType.CREATE_TOWER;
    }
}