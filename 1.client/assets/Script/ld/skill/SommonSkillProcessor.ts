
import { ECamp, PropertyId, StrengthSkillType, TriggerSkillType } from "../../common/AllEnum";
import { MonsterConfig } from "../../common/ConfigInterface";
import { EResPath } from "../../common/EResPath";
import { EventEnum } from "../../common/EventEnum";
import SysMgr from "../../common/SysMgr";
import Game from "../../Game";
import GlobalVal from "../../GlobalVal";
import { EActType } from "../../logic/actMach/ActMach";
import { ERecyclableType } from "../../logic/Recyclable/ERecyclableType";
import { Monster } from "../../logic/sceneObjs/Monster";
import SceneObject from "../../logic/sceneObjs/SceneObject";
import { SommonObj } from "../../logic/sceneObjs/SommonObj";
import { Tower } from "../../logic/sceneObjs/Tower";
import { GameEvent } from "../../utils/GameEvent";
import { Handler } from "../../utils/Handler";
import { StringUtils } from "../../utils/StringUtils";
import { HitTriggerSkill } from "../tower/HeroBuilding";
import { BaseSkillProcessor } from "./BaseSkillProcessor";

export class SommonSkillProcessor extends BaseSkillProcessor {
    
    ///////////////////////////////////////////////////////////////

    private _effect:SceneObject;
    private _monster:SommonObj;
    private _releasedTriggerSkill:boolean = false;
    private _curSommonId:number = 0;
    private _addBlood:number = 0;
    private _reductionDamage:number = 0;
    private _reboundDamage:number = 0;

    constructor() {
        super();        
        this.key = ERecyclableType.LD_SOMMON_PROCESSOR;
    }

    resetData() {
        this._skill = null;
        this._releaseSkillData = null;
        this._heroBuilding = null;
        this._releasedTriggerSkill = false;
        this._curSommonId = 0;
        this._addBlood = 0;
        // this._reductionDamage =
        super.resetData();
    }

    protected doSkillStart() {
        this.createReleaseEffect();
        GameEvent.on(EventEnum.LD_STRENGTH_SKILL_CHANGE , this.onStrengthSkill , this);
        SysMgr.instance.doOnce(Handler.create(this.onHitTimer , this) , this._skill.hitTime);
    }

    private onStrengthSkill(heroId:number , campId:ECamp = ECamp.BLUE) {
        if (this._releaseSkillData.heroId != heroId || campId !== this._releaseSkillData.campId) return;
        this.refreshSommonProp();
    }

   
    private onHitTimer() {
        const newAmmo = this._heroBuilding.getAmmoEft(this._skillMainId , this._releaseSkillData.heroUid);
        const ammo = newAmmo ? parseInt(newAmmo) : this._skill.ammoID;
        this._monster = Game.soMgr.createSommonCreature(ammo , this._skill.damageRate * 0.0001 , this._releaseSkillData.campId);
        this._curSommonId = ammo;
        this._monster.once(EventEnum.ON_SELF_REMOVE , this.onMonsterRemove , this);
        this.refreshSommonProp();

        const hero:Tower = Game.soMgr.getTowerByGuid(this._releaseSkillData.heroUid);
        if (hero) {
            hero.sommonUid = this._monster.id;
        }

        this._monster.ownerHeroId = this._releaseSkillData.heroId;
        this._monster.ownerHeroUId = this._releaseSkillData.heroUid;
        this._monster.setPosNow(this._releaseSkillData.tx , this._releaseSkillData.ty);
        this._monster.lifeTime = this._skill.hitTotalTime;
        this._monster.createTime = GlobalVal.now;
        this._monster.setDieFunc(Handler.create(this.onSommonReadyDied, this));
        SysMgr.instance.doOnce(Handler.create(this.onMonsterTimeOver , this) , this._monster.lifeTime);
        GameEvent.emit(EventEnum.LD_SOMMON_BE_BORN , this._monster);
        GameEvent.on(EventEnum.LD_TRY_RELEASE_ANNI_ULTIMATE_SKILL , this.tryReleaseAnniUltimateSkill , this);
        GameEvent.on(EventEnum.LD_SOMMON_OBJ_DIE , this.onSommonObjDied , this);
    }

    private onSommonReadyDied() {
        this._monster.changeTo(EActType.DIE , { time : 600});
    }

    private onSommonObjDied(obj:SommonObj) {
        if (obj === this._monster) {
            const triggerSkills = this._heroBuilding.getTriggerSkillList(this._skillMainId , TriggerSkillType.DIED , this._releaseSkillData.heroUid);
            if (triggerSkills && triggerSkills.length > 0) {
                Game.ldSkillMgr.onHitTriggerSkill(this._monster.x , 
                    this._monster.y , 
                    triggerSkills[0].skillId , 
                    this._releaseSkillData , 
                    this._monster.id , 
                    this._releaseSkillData.baseDamage);
            }
        }
    }


    private tryReleaseAnniUltimateSkill(heroUId:number) {
        if (this._releaseSkillData.heroUid == heroUId && this._monster) {
            const dy = this._releaseSkillData.campId == ECamp.RED ? -1 : 1;
            Game.ldSkillMgr.releaseSkill(this._monster , null ,this._monster.x , this._monster.y + dy , 
                this._heroBuilding.getUltimateSkill().getSkill());
        }

    }

    private onMonsterTimeOver() {
        if (this._monster) {
            Game.soMgr.monsterDie(this._monster , false , -1);
        }
    }

    /**刷新强化召唤物的属性 */
    private refreshSommonProp() {
        if (!this._monster) return;
        const addBlood = this._heroBuilding.getCommonStrengthPropValue(this._skillMainId , StrengthSkillType.BLOOD_MAX , this._releaseSkillData.heroUid);
        const reductionDamage = this._heroBuilding.getCommonStrengthPropValue(this._skillMainId , StrengthSkillType.REDUCTION_DAMAGE , this._releaseSkillData.heroUid);
        const reboundDamage = this._heroBuilding.getCommonStrengthPropValue(this._skillMainId , StrengthSkillType.DAMAGE_REBOUND , this._releaseSkillData.heroUid);
        if (addBlood > 0 && addBlood > this._addBlood) {//万分比血量
            this._monster.prop.addPropertyValue(PropertyId.MAX_HP_RATIO , addBlood - this._addBlood);
            this._addBlood = addBlood;
        }

        if (reductionDamage > 0) { //伤害减免
            this._monster.prop.setPropertyBase(PropertyId.REDUCTION_DAMAGE , reductionDamage);
        }

        if (reboundDamage > 0) { //伤害反弹
            this._monster.prop.setPropertyBase(PropertyId.DAMAGE_REBOUND , reboundDamage);
        }

        if (!this._releasedTriggerSkill) {
            const skillTriggers:HitTriggerSkill[] = this._heroBuilding.getTriggerSkillList(this._skillMainId , TriggerSkillType.NOW , this._releaseSkillData.heroUid);
            if (skillTriggers && skillTriggers.length > 0) {
                this._releasedTriggerSkill = true;
                Game.ldSkillMgr.onHitTriggerSkill(this._monster.x , 
                    this._monster.y , 
                    skillTriggers[0].skillId , 
                    this._releaseSkillData , 
                    this._monster.id ,
                    Math.floor(this._releaseSkillData.baseDamage * this._skill.damageRate * 0.0001));
            }
        }

        const newAmmo = this._heroBuilding.getAmmoEft(this._skillMainId , this._releaseSkillData.heroUid);
        if (!StringUtils.isNilOrEmpty(newAmmo) && this._curSommonId != parseInt(newAmmo)) {
            this._curSommonId = parseInt(newAmmo);

            let cfg: MonsterConfig = Game.monsterManualMgr.getMonsterCfg(this._curSommonId);
            if (!cfg) {
                cc.error("not found monster:" + this._curSommonId);
                return;
            }

            this._monster.setModelUrl(EResPath.CREATURE_MONSTER + cfg.resName);
        }
    }

    private onMonsterRemove() {
        this._monster.off(EventEnum.ON_SELF_REMOVE , this.onMonsterRemove , this)
        this._monster = null;
        this.onSkillEnd();
    }

    //假结束
    doSkillEnd() {
        
    }

    /**真结束 */
    private onSkillEnd() {
        if (this._monster) {
            this._monster.off(EventEnum.ON_SELF_REMOVE , this.onMonsterRemove , this);
            this._monster = null;
        }

        const hero:Tower = Game.soMgr.getTowerByGuid(this._releaseSkillData.heroUid);
        if (hero) {
            hero.sommonUid = 0;
        }

        if (this._effect) {
            this._effect.off(EventEnum.ON_SELF_REMOVE , this.onEftRemove , this);
            Game.soMgr.removeEffect(this._effect);
            this._effect = null;
        }
        GameEvent.off(EventEnum.LD_STRENGTH_SKILL_CHANGE , this.onStrengthSkill , this);
        super.doSkillEnd();
    }
        
    private createReleaseEffect() {
        if (!StringUtils.isNilOrEmpty(this._skill.hitRangeEft)) {
            this._effect = Game.soMgr.createEffect(this._skill.hitRangeEft , this._releaseSkillData.tx, this._releaseSkillData.ty , false);
            this._effect.once(EventEnum.ON_SELF_REMOVE , this.onEftRemove , this);
        }
    }

    private onEftRemove() {
        this._effect = null;
    }


    protected onExitGameScene() {
        this.onSkillEnd();
    }
   




}