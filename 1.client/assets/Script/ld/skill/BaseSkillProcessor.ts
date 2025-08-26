import { SkillTriggerConfig } from "../../common/ConfigInterface";
import { EventEnum } from "../../common/EventEnum";
import SysMgr from "../../common/SysMgr";
import Game from "../../Game";
import { AttackAction } from "../../logic/actMach/AttackAction";
import { RecyclableObj } from "../../logic/Recyclable/RecyclableObj";
import Creature from "../../logic/sceneObjs/Creature";
import { GameEvent } from "../../utils/GameEvent";
import { HeroBuilding } from "../tower/HeroBuilding";
import { LDSkillBase, ReleaseSkillData } from "./LdSkillManager";

export class BaseSkillProcessor extends RecyclableObj {

    action:AttackAction;
    protected _releaseSkillData:ReleaseSkillData;
    protected _skillMainId:number;
    protected _heroBuilding:HeroBuilding;
    protected _skill:LDSkillBase | SkillTriggerConfig;

    constructor() {
        super();        
    }

    setData(releaseSkillData:ReleaseSkillData , target?:Creature) {
        this._releaseSkillData = releaseSkillData;
        if (!this._releaseSkillData.skill) {
            this._skill = Game.ldSkillMgr.getSkillCfg(releaseSkillData.skillID);
            if (!this._skill) {
                this._skill = Game.ldSkillMgr.getTriggerSkill(releaseSkillData.skillID);
                if (!this._skill) {
                    cc.error("技能触发配置不存在", releaseSkillData.skillID);
                    return;
                }
            }
            releaseSkillData.skill = this._skill;
        } else {
            this._skill = releaseSkillData.skill;
        }
        this._skillMainId = releaseSkillData.skill['skillMainID'] || releaseSkillData.skill.skillID;
        this._heroBuilding = Game.curLdGameCtrl.getHeroBuildingCtrl(releaseSkillData.campId).getHeroBuilding(releaseSkillData.heroId);
        GameEvent.on(EventEnum.EXIT_GAME_SCENE , this.onExitGameScene , this);
        this.doSkillStart();

    }

    protected doSkillStart() {
        
    }

    protected onExitGameScene() {
        this.doSkillEnd();
    }

    doSkillEnd() {
        if (this.action) {
            this.action.onSkillProcessorEnd(this);    
            this.action = null;
        }
        SysMgr.instance.clearTimerByTarget(this);
        GameEvent.targetOff(this);
        this.dispose();
    }

}