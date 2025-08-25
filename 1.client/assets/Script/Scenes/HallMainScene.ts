import { MissionMainConfig } from "../common/ConfigInterface";
import Game from "../Game";
import SoundManager from "../utils/SoundManaget";

const { ccclass, property ,menu} = cc._decorator;

@ccclass
@menu("Game/scenes/HallMainScene")
export class HallMainScene extends cc.Component {


    @property(cc.Label)
    warNameLable: cc.Label = null;

    @property(cc.Node)
    nextBtn:cc.Node = null;

    @property(cc.Node)
    prevBtn:cc.Node = null;

    private _warId:number = 1;
    private _warCfg:MissionMainConfig = null;
    private _maxWarId:number = 0;

    protected start(): void {
        this._warId = Game.ldGameMgr.curWarId;
        this._maxWarId = Game.gameConfigMgr.getMaxWarId();
        SoundManager.instance.stopMusic();
        this.refreshWar();
    }


    onStartClick() {
        Game.ldGameMgr.reqEnterWar(this._warId);
    }

    onPrevClick() {
        if (this._warId > 1) {
            this._warId--;
            this.refreshWar();
        }
    }

    onNextClick() {
        if (this._warId < this._maxWarId) {
            this._warId++;
            this.refreshWar();
        }
    }

    private refreshWar() {
        this._warCfg = Game.gameConfigMgr.getMissionMainConfig(this._warId);
        if (this._warCfg) {
            this.warNameLable.string = this._warCfg.szname;
        }
        this.refreshArrowNode();
    }

    private refreshArrowNode() {
        if (this._warId == 1) {
            this.prevBtn.active = false;
        } else {
            this.prevBtn.active = true;
        }

        if (this._warId == this._maxWarId) {
            this.nextBtn.active = false;
        } else {
            this.nextBtn.active = true;
        }
    }

    private onPvpClick() {
        Game.ldGameMgr.reqEnterPvp();
    }
    
    private onCooperateClick() {
        Game.ldGameMgr.reqEnterCooperate();
    }


}