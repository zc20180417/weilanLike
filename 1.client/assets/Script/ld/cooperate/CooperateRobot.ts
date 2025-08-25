import { ECamp } from "../../common/AllEnum";
import { EventEnum } from "../../common/EventEnum";
import SysMgr from "../../common/SysMgr";
import Game from "../../Game";
import { GameEvent } from "../../utils/GameEvent";
import { Handler } from "../../utils/Handler";
import { GamePlayerLogicInfo } from "../GamePlayerLogicInfo";
import { LdCooperateCtrl } from "../LdCooperateCtrl";

export class CooperateRobot {

    private _gameCtrl:LdCooperateCtrl;
    private _robotLogicInfo:GamePlayerLogicInfo;
    private _callHeroTimers:number = 0;
    private _isPlaying:boolean = false;


    constructor(ctrl:LdCooperateCtrl) {
        this._gameCtrl = ctrl;
    }
   

    enterMap(robotLogicInfo:GamePlayerLogicInfo) {
        this._robotLogicInfo = robotLogicInfo;
        this._callHeroTimers = 0;
        GameEvent.on(EventEnum.LD_START_GAME , this.onStartGame , this);
        GameEvent.on(EventEnum.NEW_HERO_CREATE , this.onHeroCreate , this);
        // GameEvent.on(EventEnum.LD_COIN_CHANGE , this.onCoinChange , this);
        GameEvent.on(EventEnum.LD_ACTIVE_MAX_STRENGTH_SKILL , this.onActiveMaxStrengthSkill , this);
    }

    private onHeroCreate(campId:ECamp) {
            if(campId != ECamp.COOPERATE) return;
            if (this._robotLogicInfo.checkHaveConflate() && this._robotLogicInfo.checkHeroTableFull()) {
                this._robotLogicInfo.tryAutoConflate();
            }
        }
    
    exitMap() {
        this._isPlaying = false;
        SysMgr.instance.clearTimer(Handler.create(this.checkAction , this));
        GameEvent.targetOff(this);
    }

    private onStartGame() {
        this._isPlaying = true;
        SysMgr.instance.doLoop(Handler.create(this.checkAction , this) , 500);
    }

    /*
    private onCoinChange(value:number , camp:ECamp = ECamp.BLUE) {
        if(camp == ECamp.BLUE || this._isPlaying == false) return;
        this.checkAction();
    }
    */

    private checkAction() {
        const strengthenSkillCoinEnough = this._robotLogicInfo.checkStrengthenSkillCoinEnough();
        if (this._callHeroTimers == 5 && this._robotLogicInfo.strengthenSkillCoin < 400) {
            if (strengthenSkillCoinEnough) {
                this.tryStrengthenSkill();
            }
            return;
        }
        const callHeroCoinEnough = this._robotLogicInfo.checkCallHeroCoinEnough();
        const heroTableFull = this._robotLogicInfo.checkHeroTableFull();

        if (callHeroCoinEnough && !heroTableFull) {
            this.tryCallHero();
        } else if (strengthenSkillCoinEnough) {
            this.tryStrengthenSkill();
        }
    } 

    private tryCallHero() {
        this._callHeroTimers ++;
        GameEvent.emit(EventEnum.TRY_CALL_TOWER , ECamp.COOPERATE);
    }

    private tryStrengthenSkill() {
        GameEvent.emit(EventEnum.TRY_STRENGTHEN , ECamp.COOPERATE);
        const skills = Game.curLdGameCtrl.getHeroBuildingCtrl(ECamp.COOPERATE).getReadyStrengthSkills();
        if(skills.length == 0) return;
        GameEvent.emit(EventEnum.LD_ACTIVE_STRENGTH_SKILL , skills[0].heroId , skills[0].skillID , ECamp.COOPERATE);
    }

    private onActiveMaxStrengthSkill(heroId:number , campId:ECamp) {
        if (campId != ECamp.COOPERATE) return;
        const skills = Game.curLdGameCtrl.getHeroBuildingCtrl(ECamp.COOPERATE).getReadyStrengthSkills(heroId);
        if(skills.length == 0) return;
        GameEvent.emit(EventEnum.LD_ACTIVE_STRENGTH_SKILL , skills[0].heroId , skills[0].skillID , ECamp.COOPERATE);
    }
    
}