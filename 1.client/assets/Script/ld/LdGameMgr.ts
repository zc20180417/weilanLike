import { EMODULE } from "../common/AllEnum";
import { EResPath } from "../common/EResPath";
import Game from "../Game";
import GlobalVal from "../GlobalVal";
import { GameDataCtrl } from "../logic/gameData/GameDataCtrl";
import { UiManager } from "../utils/UiMgr";

export class LdGameMgr extends GameDataCtrl {


    private _curWarId: number;
    private _writeData = {
        curWarId: 1,
        cooperateWarId:1,
    }

    constructor() {
        super();
        this.module = EMODULE.LD_GAME;
    }

    read() {
        this._writeData = this.readData() ;
        if (!this._writeData) { 
            this._writeData = {
                curWarId: 1,
                cooperateWarId:1,
            }

            this.write();
        }

        this._curWarId = this._writeData.curWarId;
        this._writeData.cooperateWarId = this._writeData.cooperateWarId || 1;

    }

    write(): void {
        this.writeData(this._writeData);
    }

    get curWarId() {
        return this._writeData.curWarId;
    }

    get cooperateWarId() {
        return this._writeData.cooperateWarId;
    }



    
    reqEnterWar(id:number) {
        const missionCfg = Game.gameConfigMgr.getMissionMainConfig(id);
        if (missionCfg) {
            GlobalVal.curMapCfg = missionCfg;
            Game.ldNormalGameCtrl.loadGameScene();
        }
    }

    reqSuccess(id:number) {
        if (id >= this._curWarId) {
            this._curWarId = id + 1;
            this._writeData.curWarId = this._curWarId;
            this.write();
        }
        UiManager.showDialog(EResPath.GAME_SUCCESS_VIEW);
    }


    reqEnterPvp() {
        const missionCfg = Game.gameConfigMgr.getPvpMainConfig(GlobalVal.getServerTime());
        if (missionCfg) {
            GlobalVal.curMapCfg = missionCfg;
            Game.ldPvpGameCtrl.loadGameScene();
        }
    }

    reqEnterCooperate() {
        const missionCfg = Game.gameConfigMgr.getCooperateMainConfig(this.cooperateWarId);
        if (missionCfg) {
            GlobalVal.curMapCfg = missionCfg;
            Game.ldCooperateCtrl.loadGameScene();
        }
    }


    reqSuccessPvp() {
        UiManager.showDialog(EResPath.GAME_SUCCESS_VIEW);
    }

    reqCooperateSuccess() {
        this._writeData.cooperateWarId += 1;
        this.write();
        UiManager.showDialog(EResPath.GAME_SUCCESS_VIEW);
    }




}