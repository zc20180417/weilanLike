import { SkillAmmoDataConfig, SkillBlinkAtkDataConfig, SkillBuffConfig, SkillLightningConfig, SkillLightningStrengthConfig, SkillMonsterNormalConfig, SkillTriggerConfig, TrapConfig } from "../../common/ConfigInterface";
import Game from "../../Game";
import { LDSkillBase, LDSkillStrengthBase } from "./LdSkillManager";

export class SkillCfg {
    //闪电链
    private _lightningSkills:Record<number , SkillLightningConfig> = {};
    //闪电链强化技能配置表
    private _lightningStrengths:Record<number , SkillLightningStrengthConfig> = {};
    //技能buff配置表
    private _skillBuffs:Record<number , SkillBuffConfig> = {};
    //陷阱配置表
    private _traps:Record<number , TrapConfig> = {};
    //触发技能配置表
    private _triggerSkills:Record<number , SkillTriggerConfig> = {};
    //所有强化技能配置表(包含闪电链和陷阱)
    private _allStrengths:Record<number , LDSkillStrengthBase> = {};
    //英雄强化技能表(包含闪电链和陷阱)
    private _heroStrengths:Record<number , LDSkillStrengthBase[]> = {};
    // //弹道技能配置表
    // private _ammoSkills:Record<number , SkillAmmoConfig> = {};

    private _allSkillCfgs:Record<number , LDSkillBase> = {};
    //怪物普攻技能
    private _monsterSkillNormal:Record<number , SkillMonsterNormalConfig> = {};
    private _ammoDataConfig:Record<number , SkillAmmoDataConfig> = {};
    private _blinkAtkDataConfig:Record<number , SkillBlinkAtkDataConfig> = {};


    constructor() {
        this.init();
    }

    //初始化
    private init() {
        this._lightningSkills = Game.gameConfigMgr.getCfg('skill_lightning');
        // this._ammoSkills = Game.gameConfigMgr.getCfg('skill_ammo');
        this._lightningStrengths = Game.gameConfigMgr.getCfg('skill_lightning_strength');
        this._skillBuffs = Game.gameConfigMgr.getCfg('skill_buff');
        this._triggerSkills = Game.gameConfigMgr.getCfg('skill_trigger');
        this._traps = Game.gameConfigMgr.getCfg('trap');
        this._monsterSkillNormal = Game.gameConfigMgr.getCfg('skill_monster_normal');
        this._ammoDataConfig = Game.gameConfigMgr.getCfg('skill_ammo_data');
        this._blinkAtkDataConfig = Game.gameConfigMgr.getCfg('skill_blink_atk_data');

        for(let key in this._lightningSkills) {
            this._allSkillCfgs[key] = this._lightningSkills[key];
        }

        // for(let key in this._ammoSkills) {
        //     this._allSkillCfgs[key] = this._ammoSkills[key];
        // }

        for(let key in this._monsterSkillNormal) {
            this._allSkillCfgs[key] = this._monsterSkillNormal[key];
        }

        for(let key in this._lightningStrengths) {
            this._allStrengths[key] = this._lightningStrengths[key];
        }

        for (const key in this._allStrengths) {
            if (Object.prototype.hasOwnProperty.call(this._allStrengths, key)) {
                const element = this._allStrengths[key];
                const list:LDSkillStrengthBase[] = this._heroStrengths[element.heroId] || [];
                list.push(element);
                this._heroStrengths[element.heroId] = list;
            }
        }
    }

    getAmmoDataConfig(ammoId:number):SkillAmmoDataConfig {
        return this._ammoDataConfig[ammoId];
    }
    
    getBlinkAtkData(blinkID:number):SkillBlinkAtkDataConfig {
        return this._blinkAtkDataConfig[blinkID];
    }
    
    /**
     * 获取指定ID的技能配置信息
     * @param skillId 技能ID
     * @returns 返回指定ID的技能配置信息对象
     */
    getSkill(skillId:number):LDSkillBase {
        return this._allSkillCfgs[skillId];
    }

    /**
     * 根据技能ID获取触发器配置
     * @param skillId 技能ID
     * @returns 技能触发器配置对象
     */
    getTriggerSkill(skillId:number):SkillTriggerConfig {
        return this._triggerSkills[skillId];
    }

    getSkillStrength(strengthId:number):SkillLightningStrengthConfig {
        return this._lightningStrengths[strengthId];
    }

    getBuff(buffId:number):SkillBuffConfig {
        return this._skillBuffs[buffId];
    }

    getTrap(trapId:number):TrapConfig {
        return this._traps[trapId];
    }

    getHeroStrengthSkills(heroId:number):LDSkillStrengthBase[] {
        return this._heroStrengths[heroId] || [];
    }







}