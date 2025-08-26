import { ECamp, StrengthSkillType, TriggerSkillType } from "../../common/AllEnum";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { GameEvent } from "../../utils/GameEvent";
import { StringUtils } from "../../utils/StringUtils";
import { HeroUltimateSkillCtrl } from "../skill/HeroUltimateSkillCtrl";
import { LDSkillStrengthBase } from "../skill/LdSkillManager";
import { HeroUltimateSkillBase } from "../skill/skillComps/HeroUltimateSkillBase";


// 通用强化属性类
export class CommonStrengthProp {
    type:StrengthSkillType;
    value:number = 0;
    limit:number = 0;

    constructor(type:StrengthSkillType , value:number = 0) {
        this.type = type;
        this.value = value;
    }
}

// 英雄强化属性类
export class HeroStrengthProps {
    propDic:Record<number , CommonStrengthProp> = {};
}

export class HitTriggerSkill {
    // 命中触发buff结构体
    // 强化技能ID
    skillId:number = 0;
    // 概率增加buffID
    probability:number = 0;
}

export class ReleaseTriggerSkill {
    // 强化技能ID
    skillId:number = 0;
    // 释放次数
    times:number = 0;
}

// 英雄技能构建类
export class HeroBuilding {
    //已激活的强化技能数组
    strengthSkillList:LDSkillStrengthBase[] = [];

    private _maxLevelHeroUid:number = 0;

    //已激活的强化技能字典
    private _activeStrengthSkillDic: Record<number , boolean> = {};
    //可激活的强化技能数组
    private _canActiveStrengthSkillList: LDSkillStrengthBase[] = [];
    //所有强化技能数组
    private _allStrengthSkillList: LDSkillStrengthBase[] = [];
    //英雄ID
    private _heroId: number;
    //英雄强化属性字典
    private _commonStrengthDic:Record<number , HeroStrengthProps> = {};
    //特殊强化技能数组（如大招强化）
    private _specialStrengthSkills: LDSkillStrengthBase[] = [];

    //释放技能次数触发的技能
    private _releaseTriggerSkillList:Record<number, ReleaseTriggerSkill[]> = {};
    private _releaseTriggerSkillDic:Record<number , ReleaseTriggerSkill> = {};


    //击中目标时触发的buff列表
    private _hitBuffList:Record<number, HitTriggerSkill[]> = {};
    private _hitBuffDic:Record<number , HitTriggerSkill> = {};

    private _lastHitTriggerSkillDic:Record<number , number> = {};
    private _newEftDic:Record<number , string> = {};
    private _newAmmoDic:Record<number , string> = {};
    private _newMaxAmmoDic:Record<number , string> = {};
    private _newHitRangeEftDic:Record<number , string> = {};
    private _ultimateSkillBase:HeroUltimateSkillBase;
    // newEft:string = "";

    //最高星级释放技能次数触发技能列表
    private _maxReleaseTriggerSkillList:Record<number, ReleaseTriggerSkill[]> = {};
    private _maxReleaseTriggerSkillDic:Record<number , ReleaseTriggerSkill> = {};

    private _maxCommonStrengthDic:Record<number , HeroStrengthProps> = {};

    private _triggerSkillList:Record<string, HitTriggerSkill[]> = {};
    private _triggerSkillDic:Record<string, HitTriggerSkill> = {};
    private _maxTriggerSkillList:Record<string , HitTriggerSkill[]> = {};
    private _maxTriggerSkillDic:Record<string, HitTriggerSkill> = {};
    private _camp:ECamp = ECamp.BLUE;


    //初始化英雄技能构建类
    constructor() {

    }

    get heroId():number {
        return this._heroId;
    }

    get campId():ECamp {
        return this._camp;
    }

    /**
     * 获取剩余可激活技能数量
     */
    getBeLeftCanActiveSkillCount():number {
        return this._allStrengthSkillList.length - this.strengthSkillList.length;
    }

    set maxLevelHeroUid(value:number) {
        this._maxLevelHeroUid = value;
    }
    get maxLevelHeroUid():number {
        return this._maxLevelHeroUid ;
    }

    getUltimateSkill():HeroUltimateSkillBase {
        return this._ultimateSkillBase;
    }

    getNewEft(skillId:number):string {
        return this._newEftDic[skillId] || null;
    }

    getAmmoEft(skillId:number , heroUId:number):string {
        let newAmmo = null;
        if (heroUId == this._maxLevelHeroUid) {
            newAmmo = this._newMaxAmmoDic[skillId] || null;
        }
        return newAmmo || this._newAmmoDic[skillId] || null;
    }

    getHitRangeEft(skillId:number):string {
        return this._newHitRangeEftDic[skillId] || null;
    }


    getReleaseTriggerSkillList(skillId:number , heroUId:number):ReleaseTriggerSkill[] | null {
        let skills:ReleaseTriggerSkill[] = null;
        if (heroUId == this._maxLevelHeroUid) {
            skills = this._maxReleaseTriggerSkillList[skillId] || null;
        }
        return skills || this._releaseTriggerSkillList[skillId] || null;
    }


    getTriggerSkillList(skillID:number , triggerType:TriggerSkillType , heroUId:number):HitTriggerSkill[] | null {
        let skills:HitTriggerSkill[] = null;
        if (heroUId == this._maxLevelHeroUid) {
            skills = this._maxTriggerSkillList[skillID + '_' + triggerType] || null;
        }
        return skills || this._triggerSkillList[skillID + '_' + triggerType];
    }

    /**
     * 获取命中增益列表
     * @returns 返回命中增益列表
     */
    getHitBuffList(skillID:number):HitTriggerSkill[] | null {
        return this._hitBuffList[skillID];
    }

    /**
     * 获取通用的强化属性列表
     */
    getCommonStrengthPropValue(skillId:number , strengthType:StrengthSkillType , heroUId:number) : number {
        let maxValue = 0;
        if (heroUId == this._maxLevelHeroUid) {
            const maxProps:HeroStrengthProps = this._maxCommonStrengthDic[skillId];
            if (maxProps && maxProps.propDic[strengthType]) {
                maxValue =  maxProps.propDic[strengthType].value;
            }
        }

        let value = 0;
        const props:HeroStrengthProps = this._commonStrengthDic[skillId];
        if (props && props.propDic[strengthType]) {
            value =  props.propDic[strengthType].value;
        }
        return maxValue + value;
    }

    /**
     * 获取通用的强化属性列表
     */
    getCommonStrengthPropLimit(skillId:number , strengthType:StrengthSkillType , heroUId:number) : number {
        let maxValue = 0;
        if (heroUId == this._maxLevelHeroUid) {
            const maxProps:HeroStrengthProps = this._maxCommonStrengthDic[skillId];
            if (maxProps && maxProps.propDic[strengthType]) {
                maxValue =  maxProps.propDic[strengthType].limit;
            }
        }

        let value = 0;
        const props:HeroStrengthProps = this._commonStrengthDic[skillId];
        if (props && props.propDic[strengthType]) {
            value =  props.propDic[strengthType].limit;
        }
        return Math.max(maxValue , value);
    }

    getLastHitTriggerSkillID(skillId:number):number {
        return this._lastHitTriggerSkillDic[skillId] || 0;
    }

    init(heroId: number , campId:ECamp) {
        this._camp = campId;
        this._heroId = heroId;
        this._allStrengthSkillList = Game.ldSkillMgr.getHeroStrengthSkills(heroId);
        this.initCanActiveStrengthSkillList();
        GameEvent.on(EventEnum.LD_ACTIVE_STRENGTH_SKILL , this.onActiveStrengthSkill , this);

    }

    clear() {
        this.strengthSkillList.length = 0;
        this._canActiveStrengthSkillList.length = 0;
        this._specialStrengthSkills.length = 0;
        this._activeStrengthSkillDic = {};
        this._commonStrengthDic = {};
        this._newEftDic = {};
        this._newAmmoDic = {};
        this._newMaxAmmoDic = {};
        this._hitBuffList = {};
        this._hitBuffDic = {};
        this._newHitRangeEftDic = {};
        this._maxReleaseTriggerSkillList = {};
        this._maxReleaseTriggerSkillDic = {};
        this._maxCommonStrengthDic = {};
        this._maxTriggerSkillList = {};
        this._maxTriggerSkillDic = {};
        this._triggerSkillList = {};
        this._triggerSkillDic = {};
        if (this._ultimateSkillBase) {
            this._ultimateSkillBase.disposeUltimateSkill();
            this._ultimateSkillBase = null;
        }

        this._lastHitTriggerSkillDic = {};
        GameEvent.off(EventEnum.LD_ACTIVE_STRENGTH_SKILL , this.onActiveStrengthSkill , this);
    }

    getReadyActiveStrengthSkillList():LDSkillStrengthBase[] {
        return this._canActiveStrengthSkillList;
    }

    private initCanActiveStrengthSkillList() {
        const len = this._allStrengthSkillList.length;
        this._canActiveStrengthSkillList = [];
        for (let i = 0 ; i < len ; i++) {
            const skill = this._allStrengthSkillList[i];
            if ((skill.preStrengthID == 0 || this._activeStrengthSkillDic[skill.preStrengthID]) && this._activeStrengthSkillDic[skill.skillID] != true) {
                this._canActiveStrengthSkillList.push(skill);
            } 
        }
    }

    //激活强化技能
    private onActiveStrengthSkill(heroId:number , strengthSkillId: number , campId:ECamp = ECamp.BLUE) {
        if (this._heroId != heroId || this._camp != campId) return;
        this._activeStrengthSkillDic[strengthSkillId] = true;
        this.initCanActiveStrengthSkillList();
        //处理强化的逻辑
        const strengthSkillCfg = this.getStrengthSkillCfg(strengthSkillId);
        if (strengthSkillCfg) {
            this.onStrengthSkill(strengthSkillCfg);
        }
        GameEvent.emit(EventEnum.LD_STRENGTH_SKILL_CHANGE , heroId , this._camp);

    }

    private initHeroStrengthProps(strengthSkillCfg:LDSkillStrengthBase) {
        const dic = strengthSkillCfg.strengthMaxHero == 1 ? this._maxCommonStrengthDic : this._commonStrengthDic;
        let strengthProps : HeroStrengthProps = dic[strengthSkillCfg.strengthSkillID];
        if (!strengthProps) {
            strengthProps = new HeroStrengthProps();
            dic[strengthSkillCfg.strengthSkillID] = strengthProps;
        }
        return strengthProps;
    }

    //强化技能逻辑处理
    private onStrengthSkill(strengthSkillCfg:LDSkillStrengthBase) {
        this.strengthSkillList.push(strengthSkillCfg);
        let strengthProps : HeroStrengthProps = this.initHeroStrengthProps(strengthSkillCfg);
        
        //通用的强化属性
        if (strengthSkillCfg.strengthType.length > 0) {
            const len = strengthSkillCfg.strengthType.length;
            for (let i = 0 ; i < len ; i++) {
                const type = strengthSkillCfg.strengthType[i];
                const value = strengthSkillCfg.strengthValue[i];
                const limit = strengthSkillCfg.strengthLimit[i] || 0;
                let strengthProp:CommonStrengthProp = strengthProps.propDic[type];
                if (!strengthProp) {
                    strengthProp = new CommonStrengthProp(type , value);
                    strengthProps.propDic[type] = strengthProp;
                } else {
                    strengthProp.value += value;
                }
                strengthProp.limit = limit;
                //特殊的强化输赢，合成同类型英雄的权重变化
                if (type == StrengthSkillType.CONFLATE_WEIGHT) {
                    GameEvent.emit(EventEnum.LD_CONFLATE_WEIGHT_CHANGE , this._heroId , value , this._camp);
                }

            }
        } else {
            this._specialStrengthSkills.push(strengthSkillCfg);
        }

        if (!StringUtils.isNilOrEmpty(strengthSkillCfg.newEft)) {
            this._newEftDic[strengthSkillCfg.strengthSkillID] = strengthSkillCfg.newEft;
        }
        if (!StringUtils.isNilOrEmpty(strengthSkillCfg.newAmmo)) {
            const dic = strengthSkillCfg.strengthMaxHero == 1 ? this._newMaxAmmoDic : this._newAmmoDic;
            dic[strengthSkillCfg.strengthSkillID] = strengthSkillCfg.newAmmo;
        }
        if (!StringUtils.isNilOrEmpty(strengthSkillCfg.newHitRangeEft)) {
            this._newHitRangeEftDic[strengthSkillCfg.strengthSkillID] = strengthSkillCfg.newHitRangeEft;
        }

        this.tryAddTriggerSkill(strengthSkillCfg);
        //攻击时触发的buff
        const probabilityBuffID = strengthSkillCfg.probabilityBuffID;
        if (probabilityBuffID > 0) {
            let hitBuff = this._hitBuffDic[probabilityBuffID];
            if (!hitBuff) {
                hitBuff = new HitTriggerSkill();
                hitBuff.skillId = probabilityBuffID;
                this._hitBuffDic[probabilityBuffID] = hitBuff;
                if (!this._hitBuffList[strengthSkillCfg.strengthSkillID]) {
                    this._hitBuffList[strengthSkillCfg.strengthSkillID] = [];
                }

                this._hitBuffList[strengthSkillCfg.strengthSkillID].push(hitBuff);
            }
            hitBuff.probability += strengthSkillCfg.buffProbability;
        }

        if (strengthSkillCfg.lastSkillID > 0) {
            this._lastHitTriggerSkillDic[strengthSkillCfg.strengthSkillID] = strengthSkillCfg.lastSkillID;
        }

        if (strengthSkillCfg.isUltimate == 1) {
            this._ultimateSkillBase = HeroUltimateSkillCtrl.getUltimateSkill(this._heroId);
            if (this._ultimateSkillBase) {
                this._ultimateSkillBase.heroBuild = this;
                if (this._ultimateSkillBase) {
                    this._ultimateSkillBase.onActiveSkill(strengthSkillCfg);
                }
            }
        }
    }


    /**
     * 根据强化技能ID获取力量技能配置
     * @param strengthSkillId 力量技能ID
     * @returns 返回对应的力量技能配置对象，如果不存在则返回null
     */
    private getStrengthSkillCfg(strengthSkillId:number):LDSkillStrengthBase {
        const len = this._allStrengthSkillList.length;
        for (let i = 0 ; i < len ; i++) {
            const skill = this._allStrengthSkillList[i];
            if (skill.skillID == strengthSkillId) {
                return skill;
            } 
        }
        return null;
    }

    private tryAddTriggerSkill(strengthSkillCfg:LDSkillStrengthBase) {
        //攻击时触发的技能
        const probabilitySkillID = strengthSkillCfg.triggerSkillID;
        if (probabilitySkillID <= 0 || !strengthSkillCfg.triggerSkillType) return;
        switch (strengthSkillCfg.triggerSkillType) {
            case TriggerSkillType.RELEASE_SKILL_TIMES:
                this.addTriggerSkill(
                    strengthSkillCfg,
                    strengthSkillCfg.strengthMaxHero == 1 ? this._maxReleaseTriggerSkillDic : this._releaseTriggerSkillDic,
                    strengthSkillCfg.strengthMaxHero == 1 ? this._maxReleaseTriggerSkillList : this._releaseTriggerSkillList,
                    () => new ReleaseTriggerSkill(),
                    (item) => { item.times  += strengthSkillCfg.triggerValue; }
                );
                break;
            case TriggerSkillType.DIED:
            case TriggerSkillType.NOW:
            case TriggerSkillType.HIT_PROBABILITY:
            case TriggerSkillType.CRITICAL:
            case TriggerSkillType.RANGE_HIT_PROBABILITY:
                this.addTriggerSkill2(
                    strengthSkillCfg,
                    strengthSkillCfg.strengthMaxHero == 1 ? this._maxTriggerSkillDic : this._triggerSkillDic,
                    strengthSkillCfg.strengthMaxHero == 1 ? this._maxTriggerSkillList : this._triggerSkillList,
                    () => new HitTriggerSkill(),
                    (item) => { item.probability  += strengthSkillCfg.triggerValue; }
                );
                break;
        
            default:
                break;
        }
    }

    /**
     * 向触发技能字典和列表中添加触发技能
     *
     * @param strengthSkillCfg 技能配置对象
     * @param dic 触发技能字典，key为技能ID，value为触发技能对象
     * @param list 触发技能列表，key为技能强度ID，value为触发技能数组
     * @param createFn 创建触发技能的函数
     * @param updateFn 更新触发技能的函数
     */
    private addTriggerSkill<T extends HitTriggerSkill | ReleaseTriggerSkill>(
        strengthSkillCfg:LDSkillStrengthBase,
        dic: Record<number, T>,
        list: Record<number, T[]>,
        createFn: () => T,
        updateFn: (item: T) => void
    )  {
        let item = dic[strengthSkillCfg.triggerSkillID];
        if (!item) {
            item = createFn();
            item.skillId = strengthSkillCfg.triggerSkillID;
            dic[strengthSkillCfg.triggerSkillID] = item;
            
            if (!list[strengthSkillCfg.strengthSkillID]) {
                list[strengthSkillCfg.strengthSkillID] = [];
            }
            list[strengthSkillCfg.strengthSkillID].push(item);
        }
        updateFn(item);
    };

    private addTriggerSkill2<T extends HitTriggerSkill | ReleaseTriggerSkill>(
        strengthSkillCfg:LDSkillStrengthBase,
        dic: Record<string, T>,
        list: Record<string, T[]>,
        createFn: () => T,
        updateFn: (item: T) => void
    )  {
        const key1 = strengthSkillCfg.triggerSkillID + '_' + strengthSkillCfg.triggerSkillType;
        const key2 = strengthSkillCfg.strengthSkillID + '_' + strengthSkillCfg.triggerSkillType;
        let item = dic[key1];
        if (!item) {
            item = createFn();
            item.skillId = strengthSkillCfg.triggerSkillID;
            dic[key1] = item;
            
            if (!list[key2]) {
                list[key2] = [];
            }
            list[key2].push(item);
        }
        updateFn(item);
    };






}