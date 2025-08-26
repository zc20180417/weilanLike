import { CreatureState, E_CAREER, E_CAREER_NAME, ECamp, ETargetType, FLOAT_DAMAGE_TYPE, PropertyId, SkillHitRangeType, StrengthSkillType, TriggerSkillType } from "../../common/AllEnum";
import { MonsterConfig, SkillAmmoDataConfig, SkillBlinkAtkDataConfig, SkillBuffConfig, SkillTriggerConfig, TrapConfig } from "../../common/ConfigInterface";
import { EResPath } from "../../common/EResPath";
import { EventEnum } from "../../common/EventEnum";
import Debug, { TAG } from "../../debug";
import Game from "../../Game";
import GlobalVal from "../../GlobalVal";
import { EActType } from "../../logic/actMach/ActMach";
import { EComponentType } from "../../logic/comps/AllComp";
import { HitHighLightComp } from "../../logic/comps/skill/HitHighLightComp";
import Creature from "../../logic/sceneObjs/Creature";
import { Monster } from "../../logic/sceneObjs/Monster";
import SceneObject from "../../logic/sceneObjs/SceneObject";
import { SommonObj } from "../../logic/sceneObjs/SommonObj";
import { SoType } from "../../logic/sceneObjs/SoType";
import { GS_StatusInfo_StautsItem } from "../../net/proto/DMSG_Plaza_Sub_Status";
import { SKILLTYPE } from "../../net/socket/handler/MessageEnum";
import { GameEvent } from "../../utils/GameEvent";
import { RotationRect, MathUtils, Rect } from "../../utils/MathUtils";
import { StringUtils } from "../../utils/StringUtils";
import { HeroBuilding } from "../tower/HeroBuilding";
import { HeroTable } from "../tower/HeroTable";
import BuffContainerComp from "./buff/BuffContainerComp";
import { HeroHurtData } from "./HeroHurtData";
import { PassiveSkillRegistry } from "./passive/PassiveSkillRegister";
import { SkillCfg } from "./SkillCfg";
import { TriggerSkillCtrl } from "./TriggerSkillCtrl";


export interface LDSkillBase { 
    skillID: number,             //技能ID(英雄ID*10+英雄等级)
    skillMainID?: number,          //技能主ID(英雄ID)
    emptyTarget?: number,           //是否不需要目标
    targetType: number,          //目标类型(0敌1自己人2友方）
    findTargetType?: number,       //寻找目标类型（0血量最少1血量最多2随机3距离最近）
    skillName?: string,           //技能名称
    des?: string,                 //描述 
    cd?: number,                  //冷却时间
    rangeType?: number,           //攻击距离类型
    range?: number,               //攻击距离
    rangeToCityWall?: number,     //攻击城墙距离
    skillType: number,           //技能类型
    damageRate: number,          //伤害系数
    actionName?: string,          //施法动作
    releaseTime?:number,          //施法时间
    releaseEffect?: string,       //施法特效资源
    releaseEffectLoop?: number,  //施法特效是否循环播放
    buffs?: Array<any>,           //触发buff列表
    soundEft?:string,             //音效特效资源
    hitEft?: string,              //命中特效资源
    hitTime?:number,              //命中时间
    hitInterval?:number,          //命中间隔时间
    hitTotalTime?:number,         //命中总时间
    hitRangeValue1?:number,        //命中特效范围值1
    hitRangeValue2?:number,        //命中特效范围值2
    hitCount?:number,              //命中次数
    releaseTimes?: number,         //施法次数
    actionLoop?: number,            //动作是否循环播放
    actionTime?:number,            //动作持续时间
    ammoID?: number,                //子弹ID
    blinkID?: number,                //闪现ID
    actionScale?:number,            //动作缩放
    targetCount?:number,              //目标数量上限
    hitRangeType?: number,         //命中范围类型0.没有【单体】；1.以目标为中心的圆形；2.以自身为中心的圆形，3.扇形；4.矩形5.自身为起点的矩形
    hitRangeEft?:string,            //命中范围特效资源

}


export interface LDSkillStrengthBase { 
    skillID: number,                 //技能ID
    skillName: string,               //技能名称
    heroId: number,                  //所属英雄ID
    isUltimate: number,              //是否是大招
    preStrengthID: number,           //前置强化技能ID
    baseWeight: number,              //基础权重
    baseProbability: number,         //基础概率
    strengthType: number[],            //增益类型(1伤害2持续时间3范围4受击目标数量)
    strengthSkillID: number,         //强化的技能主ID
    strengthValue: number[],           //强化值
    strengthLimit: number[],           //强化限制值
    triggerSkillType: number,        //触发技能类型（1击中时概率2攻击次数）
    triggerSkillID: number,          //概率触发技能ID
    triggerValue: number,            //概率
    probabilityBuffID: number,        //命中时概率触发buffId
    buffProbability: number,          //触发buff概率
    lastSkillID?: number,              //最后一个受击单位触发的技能ID
    newEft: string,                 //特效替换
    newAmmo: string,                 //特效替换
    ultimateSkillId?: number,        //大招ID
    newHitRangeEft?: string,          //命中范围特效替换
    strengthMaxHero:number,            //是否只强化最高星英雄

    des: string,                     //描述 
}

/**
 * 释放技能数据
 */
export interface ReleaseSkillData { 
    skillID:number,                 //技能ID
    sx:number,                      //施法坐标x
    sy:number,                      //施法坐标y
    tx?:number,                     //目标坐标x
    ty?:number,                     //目标坐标y
    baseDamage: number,             //基础伤害
    damageRate: number,             //伤害系数
    deepeningDamage: number,        //伤害加深万分比
    crirate:number,                 //暴击率
    criDamage: number,              //暴击伤害
    heroId: number,                 //英雄ID
    career:number,                  //职业

    heroUid:number,                 //英雄UID
    releaseUid:number,                //技能释放者UID
    uid: number,                    //技能UID
    excludeHurtId?:number,          //排除伤害单位ID
    isCritical?:boolean,            //是否暴击
    targetId?: number,              //目标ID
    triggerCreatureId?: number,      //触发技能单位ID
    campId:ECamp,
    skill?:LDSkillBase | SkillTriggerConfig,                 //技能配置
}


export interface CampHurtData {
    list:HeroHurtData[],
    totalHurt:number,
    dic:{[keyof:number]:HeroHurtData},

}



export default class LdSkillMgr {

    private _skillCfg:SkillCfg;
    private _trapCfg:any;
    private _magicSkillCfg: any;
    private _tempVec2: cc.Vec2 = cc.Vec2.ZERO;
    private _tempVec2_1: cc.Vec2 = cc.Vec2.ZERO;
    private _global_skill_id: number = 0;
    private _rotationRect: RotationRect = new RotationRect;
    private _tempVertices: any;
    private _magicSkillList: any[] = [];
    private _groupHitList: any;
    private _releaseSkillDataDic:{[keyof:number]:ReleaseSkillData} = {};
    private _addTargetCount:number = 0;

    //伤害统计
    private _blueHurtData: CampHurtData = {list:[],totalHurt:0,dic:{}};
    private _redHurtData: CampHurtData = {list:[],totalHurt:0,dic:{}};

    initCampHurtData(campId:ECamp , heroIds:number[]) {
        const campHurtData = campId == ECamp.BLUE ? this._blueHurtData : this._redHurtData;
        campHurtData.list.length = 0;
        campHurtData.totalHurt = 0;
        campHurtData.dic = {};
        heroIds.forEach(heroId => {
            let heroHurtData = {
                heroId:heroId,
                hurt:0,
            }
            campHurtData.list.push(heroHurtData);
            campHurtData.dic[heroId] = heroHurtData;
        });

        let leadingHeroHurtData = {
            heroId:604,
            hurt:0,
        }

        campHurtData.list.push(leadingHeroHurtData);
        campHurtData.dic[leadingHeroHurtData.heroId] = leadingHeroHurtData;
    }

    //获取伤害数据
    getCampHurtData(campId:ECamp):CampHurtData {
        return campId == ECamp.BLUE ? this._blueHurtData : this._redHurtData;
    }

    getCampHurtTotal(campId:ECamp):number {
        return (campId == ECamp.BLUE ? this._blueHurtData.totalHurt : this._redHurtData.totalHurt) || 1;
    }


    //

    graph: cc.Graphics = null;
    graphMoveLine: cc.Graphics = null;
    constructor() {
        this.init();
    }

    private init() {
        this._skillCfg = new SkillCfg;
        this.initCfgs();
        PassiveSkillRegistry.registerAll();
    }



    getSkillCfg(skillId:number):LDSkillBase {
        return this._skillCfg.getSkill(skillId)
    }

    getTriggerSkill(skillId:number):SkillTriggerConfig {
        return this._skillCfg.getTriggerSkill(skillId);
    }

    getReleaseSkillData(skillUid:number):ReleaseSkillData {
        return this._releaseSkillDataDic[skillUid] || null;
    }

    getHeroStrengthSkills(heroId:number):LDSkillStrengthBase[] {
        return this._skillCfg.getHeroStrengthSkills(heroId);
    }

    getStrengthSkill(skillId:number):LDSkillStrengthBase {
        return this._skillCfg.getSkillStrength(skillId);
    }

    getAmmoDataConfig(ammoId:number):SkillAmmoDataConfig {
        return this._skillCfg.getAmmoDataConfig(ammoId);
    }

    getBlinkAtkDataConfig(blinkId:number):SkillBlinkAtkDataConfig {
        return this._skillCfg.getBlinkAtkData(blinkId);
    }


    clearReleaseSkill() {

    }

    getBuff(id: number): SkillBuffConfig {
        return this._skillCfg.getBuff(id);
    }

    getBuffEftValue(buff:GS_StatusInfo_StautsItem , level:number):number {
        let num = buff.unum;
        let addLevel:number = level - 1;
        if (buff.ulvaddnum > 0) {
            num += buff.ulvaddnum * addLevel;
        } else if (buff.ulvaddpernum > 0) {
            num *= 1 + (buff.ulvaddpernum * addLevel / 10000);
        }
        return num;
    }

    getBuffTime(buff:GS_StatusInfo_StautsItem , level:number):number {
        let times = buff.utimes;
        let addLevel:number = level - 1;
        if (buff.ulvaddtimes > 0) {
            times += buff.ulvaddtimes * addLevel;
        } else if (buff.ulvaddtimesper > 0) {
            times *= 1 + (buff.ulvaddtimesper * addLevel / 10000);
        }
        return times;
    }

    getTrap(id: number): TrapConfig {
        return this._skillCfg.getTrap[id];
        return null;
    }

    getMagicSkill(id: number): any {
        return this._magicSkillCfg[id];
    }

    /**释放技能 */
    releaseSkill(release: Creature, target:Creature, tx: number,ty:number, skill: LDSkillBase) {
        if (!StringUtils.isNilOrEmpty(skill.soundEft)) {                                                             
            Game.soundMgr.playSound(EResPath.GUNEFFECT_DIR + skill.soundEft, false);
        }
        this._global_skill_id ++;
        
        const heroId = SoType.isSommon(release) ? (release as SommonObj).ownerHeroId : release.cfg.ntroopsid;


        const releaseSkillData = {
            skillID:skill.skillID,                          //技能ID
            skill:skill,                                     //技能配置
            sx:release.x,                                    //施法坐标x
            sy:release.y,                                    //施法坐标y
            tx:tx,                                          //目标坐标x
            ty:ty,                                          //目标坐标y
            baseDamage: release.prop.getPropertyValue(PropertyId.ATTACK),             //基础伤害
            damageRate: skill.damageRate * 0.0001,                   //伤害系数
            heroId:heroId,                   //英雄ID
            career:SoType.isSommon(release) ? Game.gameConfigMgr.getHeroConfig(heroId).bttype : release.cfg.bttype,                  //职业
            uid:this._global_skill_id,
            targetId:target?.id || 0,                        //目标ID
            heroUid:SoType.isSommon(release) ? (release as SommonObj).ownerHeroUId : release.id,
            crirate:release.prop.getPropertyValue(PropertyId.CRI_RATE),                     //暴击率
            criDamage:release.prop.getPropertyValue(PropertyId.CRI_DAMAGE),                //暴击伤害
            deepeningDamage:release.prop.getPropertyValue(PropertyId.DEEPENING_DAMAGE),                //伤害加深万分比
            releaseUid:release.id,                          //技能释放者UID
            campId:release.camp,
        };

        if (skill.skillType == SKILLTYPE.SKILLTYPE_BLINK_TARGET) {
            const blinkSkill = Game.ldSkillMgr.getBlinkAtkDataConfig(skill['blinkID'] || 0);
            if (blinkSkill) {
                const blinkX = MathUtils.randomInt(1 , blinkSkill.blinkX);
                const blinkY = MathUtils.randomInt(1 , blinkSkill.blinkY);
                releaseSkillData.sx = tx > release.x ? tx - blinkX : tx + blinkX;
                releaseSkillData.sy = Math.max(ty - blinkY , 70);
            }
        }

        this._releaseSkillDataDic[this._global_skill_id] = releaseSkillData;

        release.changeTo(EActType.ATTACK, releaseSkillData);
    }

    //怪物释放技能
    monsterReleaseSkill(release:Monster, target:HeroTable | Monster, skill:LDSkillBase) {
        if (!StringUtils.isNilOrEmpty(skill.soundEft)) {                                                             
            Game.soundMgr.playSound(EResPath.GUNEFFECT_DIR + skill.soundEft, false);
        }
        this._global_skill_id ++;
        const releaseSkillData = {
            skillID:skill.skillID,                              //技能ID
            sx:release.x,                                       //施法坐标x
            sy:release.y,                                       //施法坐标y
            tx:target?.x || 0,                                      //目标坐标x
            ty:target?.y || 0,                                      //目标坐标y
            baseDamage: (release.cfg as MonsterConfig).attack,             //基础伤害
            damageRate: skill.damageRate * 0.0001,                       //伤害系数
            heroId: release.cfg.ntroopsid,                      //英雄ID
            career:0,                                           //职业
            uid:this._global_skill_id,
            targetId:target?.id || 0,                           //目标ID
            skill:skill,                                      //技能
            heroUid:release.id,
            crirate:release.prop.getPropertyValue(PropertyId.CRI_RATE),                     //暴击率
            criDamage:release.prop.getPropertyValue(PropertyId.CRI_DAMAGE),                //暴击伤害
            deepeningDamage:release.prop.getPropertyValue(PropertyId.DEEPENING_DAMAGE),                //伤害加深万分比
            releaseUid:release.id,
            campId:release.camp,

        };
        if (releaseSkillData.targetId == 0 && skill.hitRangeType == SkillHitRangeType.NONE) {
            Debug.log(TAG.SKILL , '怪物释放技能目标为空' , releaseSkillData);
        }
        this._releaseSkillDataDic[this._global_skill_id] = releaseSkillData;
        release.changeTo(EActType.ATTACK, releaseSkillData);
    }

    monsterSkillHit(releaseData:ReleaseSkillData) {
        let target:HeroTable | Monster = Game.soMgr.getHeroTabelByGuid(releaseData.targetId , releaseData.campId) || Game.soMgr.getSommonByGuid(releaseData.targetId);
        let hitList:HeroTable[];
        let isHeroTable = false;
        if (releaseData.skill.targetType == ETargetType.ENEMY) {
            switch (releaseData.skill['hitRangeType']) {
                case SkillHitRangeType.NONE:
                    if (!target) {
                        Debug.log(TAG.SKILL , '怪物释放技能目标为空' , releaseData);
                    }
                    isHeroTable = target ? SoType.isHeroTable(target) || SoType.isSceneItem(target) : false;
                    this.damageHeroTable(target , releaseData.baseDamage , releaseData.damageRate , releaseData.uid , isHeroTable , releaseData.releaseUid);
                    return;
                    break;
                case SkillHitRangeType.CIRCLE_TARGET:
                    hitList = this.getHeroTables(target.x , target.y , SkillHitRangeType.CIRCLE_TARGET , releaseData.campId, releaseData.skill.hitRangeValue1);
                    break;
                case SkillHitRangeType.CIRCLE_SELF:
                    hitList = this.getHeroTables(releaseData.sx , releaseData.sy , SkillHitRangeType.CIRCLE_SELF ,releaseData.campId, releaseData.skill.hitRangeValue1);
                    break;
                case SkillHitRangeType.SECTOR:
                case SkillHitRangeType.RECT:
                case SkillHitRangeType.SELF_RECT:
                case SkillHitRangeType.ALL:
                    GlobalVal.temp3Vec2.x = target.x || releaseData.tx;
                    GlobalVal.temp3Vec2.y = target.y || releaseData.ty;
                    hitList = this.getHeroTables(releaseData.sx , releaseData.sy , SkillHitRangeType.SECTOR ,releaseData.campId, releaseData.skill.hitRangeValue1 , releaseData.skill.hitRangeValue2);
                    break;            
                default:
                    break;
            }
        }

        if (hitList && hitList.length > 0) {
            let hitTableCount = 0;
            
            hitList.forEach(element => {
                isHeroTable = SoType.isHeroTable(element) || SoType.isSceneItem(element);

                this.damageHeroTable(element , releaseData.baseDamage , (isHeroTable && hitTableCount > 0) ? 0 : releaseData.damageRate , releaseData.uid , isHeroTable , releaseData.releaseUid);
                if (isHeroTable) {
                    hitTableCount ++;
                }
            });
        }
    }

    damageHeroTable(target:HeroTable | Monster , attackValue:number , damageRate:number , skillUid:number , isCityWall:boolean , releaseUid:number) {
        let deepeningDamageToCw = 0;
        if (isCityWall) {
            const monster = Game.soMgr.getMonsterByGuid(releaseUid);
            deepeningDamageToCw = 1 + ( monster ? monster.prop.getPropertyValue(PropertyId.DEEPENING_DAMAGE_TO_CW) : 0);
            if (deepeningDamageToCw !== 1) {
                cc.log('怪物伤害对城墙伤害加深：' , deepeningDamageToCw , monster.cfg.szname);

            }
        }
        const damage = Math.floor(attackValue * damageRate * deepeningDamageToCw);


        if (target) {
            const isSommon = SoType.isSommon(target);
            const isHeroTable = SoType.isHeroTable(target);
            const isCityWall = SoType.isSceneItem(target)


            if (isSommon) {
                this.onHit(target as Monster, attackValue , skillUid);
            } else if (isHeroTable || isCityWall) {
                if (isHeroTable) {
                    const heroTableHurt = target.getAddComponent(EComponentType.LD_HERO_TABLE_HURT);
                    heroTableHurt.start();
                } else {
                    let comp:HitHighLightComp = target.getAddComponent(EComponentType.HIT_HIGH_LIGHT);
                    comp.start();
                }
                if (damageRate > 0) {
                    GameEvent.emit(EventEnum.LD_CITY_WALL_HURT , -damage , target.camp);
                }
            }
        }
    }

    saveDeleteDamage(blood:number , attackValue:number , target:Monster) {
        // this._saveDeleteDamageFunc(blood, attackValue, target);
    }
    
    resetReleaseData() {
        this._releaseSkillDataDic = {};
    }
    


    onSkillHit(target:Monster , releaseData:ReleaseSkillData):boolean {
        //计算是否暴击
        const heroBuild:HeroBuilding = Game.curLdGameCtrl.getHeroBuildingCtrl(releaseData.campId).getHeroBuilding(releaseData.heroId);
        let skillMainId = 0;
        if (heroBuild) {
            skillMainId = releaseData.skill['skillMainID'] || releaseData.skillID;
            const buildAddCritRate = (heroBuild.getCommonStrengthPropValue(skillMainId , StrengthSkillType.CRITICAL , releaseData.heroUid) || 0) * 0.0001;
            releaseData.isCritical = MathUtils.seedRandomConst() <= buildAddCritRate + releaseData.crirate ? true : false;
            this._addTargetCount = heroBuild.getCommonStrengthPropValue(skillMainId , StrengthSkillType.HIT_COUNT_MAX_ADD , releaseData.heroUid);
        }

        let skill:LDSkillBase =  releaseData.skill || this.getSkillCfg(releaseData.skillID) || this.getTriggerSkill(releaseData.skillID);
        switch (skill.hitRangeType) {
            case SkillHitRangeType.NONE:
                if (target) {
                    this._tempVec2.x = target.x;
                    this._tempVec2.y = target.y;
                    this.onHit(target , releaseData.baseDamage , releaseData.uid);
                } else {
                    this._tempVec2.x = releaseData.tx;
                    this._tempVec2.y = releaseData.ty;
                }
                break;
            case SkillHitRangeType.SECTOR:
                this._tempVec2.x = releaseData.sx;
                this._tempVec2.y = releaseData.sy;
                const angle1 = MathUtils.getAngle(releaseData.sx , releaseData.sy ,  releaseData.tx ,  releaseData.ty);
                this.checkSector(this._tempVec2 , skill.hitRangeValue1 ,angle1, skill.hitRangeValue2 , releaseData);
                break;
            case SkillHitRangeType.CIRCLE_SELF:
                this._tempVec2.x = releaseData.sx;
                this._tempVec2.y = releaseData.sy;
                this.checkHitCircle(this._tempVec2 , skill , releaseData);
                break;
            case SkillHitRangeType.CIRCLE_TARGET:
                this._tempVec2.x = releaseData.tx;
                this._tempVec2.y = releaseData.ty;
                this.checkHitCircle(this._tempVec2 , skill , releaseData);
                break;
            case SkillHitRangeType.RECT:
            case SkillHitRangeType.SELF_RECT:
            case SkillHitRangeType.RANDOM_ANGLE_RECT:
                this._tempVec2.x = releaseData.sx;
                this._tempVec2.y = releaseData.sy;
                const angle = MathUtils.getAngle(releaseData.sx , releaseData.sy ,  releaseData.tx ,  releaseData.ty);
                this.checkHitLine(this._tempVec2, skill.hitRangeValue2 , skill.hitRangeValue1 , MathUtils.angle2Radian(angle) , releaseData);
                break;
        
            default:
                break;
        }

        this._addTargetCount = 0;
        if (heroBuild) {

            let triggerSkills = heroBuild.getTriggerSkillList(skillMainId , TriggerSkillType.RANGE_HIT_PROBABILITY, releaseData.heroUid);
            if (triggerSkills) {
                for (let i = 0; i < triggerSkills.length; i++) {
                    if (MathUtils.randomInt(1, 100) <= triggerSkills[i].probability) {
                        this.onHitTriggerSkill(this._tempVec2.x , this._tempVec2.y , triggerSkills[i].skillId , releaseData  , 0 , releaseData.baseDamage );
                    }
                }
            }
    
            if (releaseData.isCritical) {
                //检查一下暴击是否会触发技能
                const skillList = heroBuild.getTriggerSkillList(skillMainId , TriggerSkillType.CRITICAL , releaseData.heroUid);
                if (skillList && skillList.length > 0) {
                    skillList.forEach(element => {
                        if (MathUtils.randomInt(1 , 100) <= element.probability) {
                            this.onHitTriggerSkill(this._tempVec2.x , this._tempVec2.y , element.skillId , 
                            releaseData
                            ,
                            0,
                            releaseData.baseDamage);
                        }
                    });
                }
            }
        }
        return releaseData.isCritical;
    }

    /**
     * 受击(最终所有受击都会调用这个接口) 
     * @param target  目标
     * @param skill   技能
     * @param attackValue 基础攻击值 
     * @param skillUid  技能uid
     */
    onHit(target: Monster, attackValue: number, skillUid: number) {
        // attackValue *= 100;
        if (!target || target.isDied || !target.cfg) {
            cc.log("error hit die monster：" + target.id);
            return;
        }

        const releaseData = this._releaseSkillDataDic[skillUid];
        if (releaseData.excludeHurtId && releaseData.excludeHurtId == target.id) return;
        if ((GlobalVal.checkSkillCamp && releaseData.campId !== target.camp) || target.inState(CreatureState.INVINCIBLE)) return;
        let skill = this.getSkillCfg(releaseData.skillID) || this.getTriggerSkill(releaseData.skillID);
        this.playHitEft(skill, target);
        if (!Game.curLdGameCtrl) { //阵营不同，不受伤
            return;
        }

        const dodge = this.getDodgeToCareer(releaseData.career , target);
        if (dodge != 0) {
            cc.log(target.cfg.szname + '对职业:' + E_CAREER_NAME[E_CAREER[releaseData.career]] + ',闪避系数:' + dodge );
            if (MathUtils.seedRandomConst() <= dodge) {
                //闪避成功
                GlobalVal.tempVec2.x = target.centerPos.x;
                GlobalVal.tempVec2.y = target.y + target.size.height;
                GameEvent.emit(EventEnum.ON_DAMAGE , attackValue , FLOAT_DAMAGE_TYPE.DODGE , target.camp);
                return;
            }
        }


        const skillMainID = skill['skillMainID'] || skill.skillID;
        const heroBuild = Game.curLdGameCtrl.getHeroBuildingCtrl(releaseData.campId).getHeroBuilding(releaseData.heroId);
        //技能强化伤害加深系数
        let strengthHurtRate = 0;
        if (heroBuild) {
            //技能强化后的伤害加深
            strengthHurtRate = heroBuild.getCommonStrengthPropValue(skillMainID, StrengthSkillType.HURT , releaseData.heroUid);
        }
        //伤害减免系数
        let reductionDamage = target.prop.getPropertyValue(PropertyId.REDUCTION_DAMAGE);
        let criDamage = 1.0;
        if (releaseData.isCritical) {
            criDamage = 1.5 + releaseData.criDamage;
        }
        //职业伤害加深系数
        let careerDeepeningDamage = 1 + this.getDeepeningDamageToCareer(releaseData.career , target);
        //职业伤害减免系数
        let careerReductionDamage = 1 - this.getReducitionDamageToCareer(releaseData.career  , target);

        if (careerDeepeningDamage !== 1 || careerReductionDamage !== 1) {
            cc.log(target.cfg.szname + '对职业:' + E_CAREER_NAME[E_CAREER[releaseData.career]] + ',职业伤害加深系数:' + careerDeepeningDamage + " 职业伤害减免系数:" + careerReductionDamage );
        }


        let damage = (attackValue * (releaseData.damageRate) * (1 + strengthHurtRate * 0.0001 + releaseData.deepeningDamage) ) * (1 - reductionDamage) * criDamage * careerDeepeningDamage * careerReductionDamage;

        attackValue = Math.floor(damage);
        if (attackValue <= 0) {
            attackValue = 1;
        }

        //计算伤害反弹
        this.calcReboundDamage(target , releaseData, attackValue);
        this.tryTriggerHitBuff(heroBuild , releaseData , target , attackValue , skillMainID);
        target.emit(EventEnum.ON_HIT);
        let isDied = this.deleteDamage(target, attackValue, skillUid , releaseData.isCritical);
        if (!isDied) {
            this.tryAddSkillBuff(skill, target , skillMainID , attackValue , skillUid);
        } 
    }



    private calcReboundDamage(target:Monster ,releaseData:ReleaseSkillData , attackValue:number) {
        if (SoType.isSommon(target)) {
            const reboundDamage = target.prop.getPropertyValue(PropertyId.DAMAGE_REBOUND);
            if (reboundDamage <= 0) return;

            const release:Monster = Game.soMgr.getMonsterByGuid(releaseData.releaseUid) as Monster;
            if (!release || SoType.isBossOrElite(release)) return;
            //按当前生命的百分比反弹伤害
            const value = Math.floor(release.blood * reboundDamage) || 1;
            this.deleteDamage(release , value, 0  , false);
        }
    }

    private tryAddSkillBuff(skill:LDSkillBase | SkillTriggerConfig, target:Monster , skillId:number , attackValue:number , skillUid:number) {
        if (!skill || !skill.buffs) return;
        const len = skill.buffs.length;
        for (let i = 0; i < len; i++) {
            this.addBuff(target, skill.buffs[i], attackValue, skillUid);
        }
    }

    /**
     * 尝试触发命中Buff
     * @param heroBuild 英雄建筑信息
     * @param releaseData 技能释放数据
     * @param target 目标怪物
     * @param attackValue 攻击力
     * @param skillMainID 主技能ID
     */
    private tryTriggerHitBuff(heroBuild:HeroBuilding , releaseData:ReleaseSkillData , target:Monster, attackValue:number ,skillMainID:number  ) {
        if (!heroBuild) return;
        //计算触发buff
        let probabilitySkills = heroBuild.getTriggerSkillList(skillMainID , TriggerSkillType.HIT_PROBABILITY , releaseData.heroUid);
        let len = probabilitySkills ? probabilitySkills.length : 0;
        if (len > 0) {
            for (let i = 0; i < len; i++) {
                if (MathUtils.randomInt(1, 100) <= probabilitySkills[i].probability) {
                    this.onHitTriggerSkill(target.centerPos.x , target.centerPos.y , probabilitySkills[i].skillId , releaseData ,target.id ,attackValue);
                }
            }
        }

        let probabilityBuffs = heroBuild.getHitBuffList(skillMainID);
        len = probabilityBuffs ? probabilityBuffs.length : 0;
        if (len > 0) {
            for (let i = 0; i < len; i++) {
                if (MathUtils.randomInt(1, 100) <= probabilityBuffs[i].probability) {
                    this.addBuff(target , probabilityBuffs[i].skillId , attackValue , releaseData.uid);
                }
            }
        }
    }

    /**
     * 当触发技能命中时调用
     * @param sx 触发位置的 x 坐标
     * @param sy 触发位置的 y 坐标
     * @param skillId 技能ID
     * @param heroId 英雄ID
     * @param baseDamage 基础伤害值
     */
    onHitTriggerSkill(sx:number , 
        sy:number , 
        skillId:number , 
        releaseData:ReleaseSkillData | {heroId:number ,career:number, heroUid:number , crirate:number , criDamage:number , tx:number , ty:number ,campId:number, deepeningDamage:number , releaseUid?:number } , 
        triggerCreatureId:number , baseDamage:number) {
        this._global_skill_id ++;
        const skill:SkillTriggerConfig | LDSkillBase = this.getTriggerSkill(skillId) || this.getSkillCfg(skillId);
        if (!skill) return;
        let releaseSkillData =  {
            skillID:skillId,                            //技能ID
            sx:sx,                                      //施法坐标x
            sy:sy,                                      //施法坐标y
            tx:releaseData.tx,                                      //目标坐标x
            ty:releaseData.ty,                                      //目标坐标y
            baseDamage: baseDamage,             //基础伤害
            damageRate: skill.damageRate * 0.0001,               //伤害系数
            heroId: releaseData.heroId,                   //英雄ID
            career:releaseData.career,                  //职业

            uid:this._global_skill_id,
            excludeHurtId:skill['excludeTrigger'] ? triggerCreatureId : 0,
            triggerCreatureId:triggerCreatureId,
            targetId:0,                        //目标ID
            skill:skill,
            heroUid:releaseData.heroUid,
            crirate:releaseData.crirate,                         //暴击率
            criDamage:releaseData.criDamage,                     //暴击率
            deepeningDamage:releaseData.deepeningDamage,                                //伤害加深万分比
            releaseUid:releaseData.releaseUid,
            campId:releaseData.campId,
        };

        this._releaseSkillDataDic[this._global_skill_id] = releaseSkillData;
        TriggerSkillCtrl.onHitTriggerSkill(releaseSkillData);
    }

    /**检测圆形伤害 */
    checkHitCircle(pos: cc.Vec2, skill: LDSkillBase | SkillTriggerConfig , releaseSkillData:ReleaseSkillData) {
        const heroBuild = releaseSkillData.heroId > 0 ? Game.curLdGameCtrl.getHeroBuildingCtrl(releaseSkillData.campId).getHeroBuilding(releaseSkillData.heroId) : null;
        let range = skill.hitRangeValue1;
        const skillMainID = skill['skillMainID'] || skill.skillID;
        if (heroBuild) {
            range *= (1 + heroBuild.getCommonStrengthPropValue(skillMainID , StrengthSkillType.DAMAGE_SCOPE , releaseSkillData.heroUid) * 0.0001);
        }
        let hitObjs: Monster[] = this.getCircleMonsters(pos, range , releaseSkillData.campId);
        this.hitMonsters(hitObjs, releaseSkillData.baseDamage, releaseSkillData.uid, skill);
    }

    /**检测矩形伤害 */
    checkHitLine(pos: cc.Vec2, wid: number, range: number, rotation: number, releaseSkillData:ReleaseSkillData) {
        let hitObjs: Monster[] = this.getRotationRectMonsters(pos, wid, range, rotation , releaseSkillData.campId);
        this.hitMonsters(hitObjs, releaseSkillData.baseDamage, releaseSkillData.uid, releaseSkillData.skill);
    }

    /**检测扇形伤害 */
    checkSector(pos: cc.Vec2, range: number, angle: number, angleTotal: number, releaseSkillData:ReleaseSkillData) {

        let halfTotal: number = angleTotal * 0.5;
        let angle1: number = angle + halfTotal;
        let angle2: number = angle - halfTotal;

        let minAngle: number = Math.min(angle1, angle2);
        let maxAngle: number = Math.max(angle1, angle2);

        let hitObjs: Monster[] = this.getSectorMonsters(pos, range, minAngle, maxAngle , releaseSkillData.campId);
        this.hitMonsters(hitObjs, releaseSkillData.baseDamage, releaseSkillData.uid, releaseSkillData.skill);
    }


    hitOnBuff(target:Monster , damageValue:number , skillUid:number , buffCfg:SkillBuffConfig) {
        this.deleteDamage(target, Math.floor(damageValue) , skillUid);
    }
        
    /**
     * 扣血
     * @param target 目标
     * @param skill 技能
     * @param attackValue 伤害值
     * @param skillUid 技能uid
     */
     deleteDamage(target: Monster, attackValue: number, skillUid: number = 0 , isCritical:boolean = false) {
        if (!target || !Game.curLdGameCtrl ) return false;
        if (target.isDied) return true;
        if (!target.isValid) {
            cc.log("!!!!!!!!!!!!!!!:" + target.id);
            return true;
        }
        GlobalVal.tempVec2.x = target.centerPos.x;
        GlobalVal.tempVec2.y = target.y + target.size.height;
        this._tempVec2_1.x = target.centerPos.x;
        this._tempVec2_1.y = target.y + target.size.height + 30;
        GameEvent.emit(EventEnum.ON_DAMAGE , attackValue , isCritical ? FLOAT_DAMAGE_TYPE.CRIT : FLOAT_DAMAGE_TYPE.NORMAL , target.camp);

        if (SoType.isMonster(target)) {
            this.cacheHurtData(target.camp , attackValue , skillUid);
        }
        target.deleteBlood(attackValue);
        if (target.blood <= 0 && !target.inState(CreatureState.DEATH_RECOVER)) {
            this.creatureDie(target, skillUid);
            return true;
        }
        return false;
    }


    private cacheHurtData(campId:ECamp , value:number , skillUid:number) {
        const hurtData = campId == ECamp.BLUE ? this._blueHurtData : this._redHurtData;
        hurtData.totalHurt += value;
        const releaseData = this.getReleaseSkillData(skillUid);
        if (releaseData && releaseData.heroId) {

            hurtData.dic[releaseData.heroId].hurt += value;
        }
    }

    addHp(target: Monster , addValue:number) {
        if (target.isDied) return true;
        if (!target.isValid) {
            cc.log("!!!!!!!!!!!!!!!:" + target.id);
            return true;
        }
        target.deleteBlood(-addValue);

        GlobalVal.tempVec2.x = target.centerPos.x;
        GlobalVal.tempVec2.y = target.y + target.size.height;
        GameEvent.emit(EventEnum.ON_DAMAGE , -addValue , FLOAT_DAMAGE_TYPE.NORMAL , target.camp);
    }

    getMagicSkillList(): any[] {
        return this._magicSkillList;
    }

    getCircleMonsterList(pos: cc.Vec2, range: number , campId:ECamp) {
        return this.getCircleMonsters(pos, range ,campId);
    }

    boomTower(creature:Creature,rect:number,effect:string) {
        let centerPos = creature.centerPos;
        Game.soMgr.createEffect(effect, centerPos.x, centerPos.y, false);
        let gx = GlobalVal.toGridPos(creature.x);
        let gy = GlobalVal.toGridPos(creature.y);
        Game.soMgr.monsterDie(creature as Monster, false , -1);
        for (let i = gx - rect; i <= gx + rect; i++) {
            for (let j = gy - rect; j <= gy + rect; j++) {
                if (i != gx || j != gy) {

                    let tower = Game.soMgr.getGridTower(i, j);
                    if (tower) {
                        Game.soMgr.removeTower(tower);
                    }
                    
                }
            }
        }

    }

    private initCfgs() {
        this._magicSkillCfg = (Game.gameConfigMgr.getCfg(EResPath.MAGIC_SKILL_CFG)) || {};
        this._trapCfg = (Game.gameConfigMgr.getCfg(EResPath.TRAP_CFG) ) || {};
        for (const key in this._magicSkillCfg) {
            if (this._magicSkillCfg.hasOwnProperty(key)) {
                const element = this._magicSkillCfg[key];
                this._magicSkillList.push(element);
            }
        }
        
    }

    /**是否与该怪物相交 */
    private checkCircleDis(target: Creature, pos: cc.Vec2, range: number): boolean {
        let dis = MathUtils.p2RectDis(target.rect, pos);
        return dis <= range;
    }

    /**添加buff */
    addBuff(target: Monster, buffID: number, attackValue: number, skillUid: number) {
        let buffCfg = this.getBuff(buffID);
        if (!buffCfg) return;


        if (target.isDied) {
            return;
        }

        let buffComp: BuffContainerComp = target.getAddComponent(EComponentType.BUFF);
        buffComp.addBuff(buffID,  attackValue, skillUid);
        
    }

    /**获得圆形范围内所有怪物 */
    getCircleMonsters(pos: cc.Vec2, range: number , campId:ECamp): Monster[] {
        GlobalVal.tempRect.init(pos.x - range, pos.y - range, range * 2, range * 2);
        let monsters: Monster[] = Game.soMgr.getRectMonsters(GlobalVal.tempRect , campId);
        let len: number = monsters.length;
        let monster: Monster;
        let all: Monster[] = [];
        for (let i = 0; i < len; i++) {
            monster = monsters[i];
            if (this.checkCircleDis(monster, pos, range)) {
                all.push(monster);
            }
        }
        return all;
    }

    /**获取扇形伤害 */
    getSectorMonsters(pos: cc.Vec2, range: number, angleMin: number, angleMax: number , campId:ECamp): Monster[] {

        /*
        this.graph.clear();
        this.graph.moveTo(pos.x , pos.y);
        this.graph.lineTo(pos.x + Math.cos(MathUtils.angle2Radian(angleMin)) * range, pos.y + Math.sin(MathUtils.angle2Radian(angleMin)) * range );
        this.graph.arc(pos.x , pos.y , range , MathUtils.angle2Radian(angleMin) , MathUtils.angle2Radian(angleMax) , true);
        this.graph.lineTo(pos.x , pos.y );
        this.graph.close();
        this.graph.fill();
        */
        
        let allCircle: Monster[] = this.getCircleMonsters(pos, range , campId);
        let all: Monster[] = [];
        let len: number = allCircle.length;
        let monster: Monster;
        let angles: number[][];

        let list: number[][] = [[angleMin, angleMax]];
        if (angleMin < 0) {
            list[0] = [0, angleMax];
            list[1] = [angleMin + 360, 360];
        }

        for (let i = 0; i < len; i++) {
            monster = allCircle[i];

            angles = MathUtils.getAngleP2Rect(pos, monster.rect);

            if (this.checkAngleCoincide(list, angles)) {
                all.push(monster);
            }
        }
        return all;
    }

    private checkAngleCoincide(list: number[][], list2: number[][]) {
        let len2 = list2.length;
        let len = list.length;

        let a1, a2, b1, b2;
        for (let j = 0; j < len2; j++) {
            a1 = list2[j][0];
            a2 = list2[j][1];
            for (let i = 0; i < len; i++) {
                b1 = list[i][0];
                b2 = list[i][1];
                if ((a1 >= b1 && a1 <= b2) || (a2 >= b1 && a2 <= b2) ||
                    (b1 >= a1 && b1 <= a2) || (b2 >= a1 && b2 <= a2)) {
                    return true;
                }
            }
        }

        return false;
    }

    //用于SAT检测的矩形
    private _tempRotationRectVertices: cc.Vec2[];
    private _tempAxes: cc.Vec2[];


    /**获得矩形范围内所有怪物 */
    getRotationRectMonsters(pos: cc.Vec2, wid: number, range: number, rotation: number , campId:ECamp): Monster[] {
        let halfWid = wid * 0.5;
        GlobalVal.tempRect.init(pos.x - halfWid, pos.y, wid, range);
        this._rotationRect.setRect(GlobalVal.tempRect, rotation - (Math.PI * 0.5));
        GlobalVal.tempRect.init(this._rotationRect.x, this._rotationRect.y, this._rotationRect.width, this._rotationRect.height);
        this.initTempVertices();
        // this._tempVertices = this.getVertices1(this._rotationRect); 
        // this.graph.moveTo(this._rotationRect.p1.x , this._rotationRect.p1.y);
        // this.graph.lineTo(this._rotationRect.p2.x , this._rotationRect.p2.y);
        // this.graph.lineTo(this._rotationRect.p3.x , this._rotationRect.p3.y);
        // this.graph.lineTo(this._rotationRect.p4.x , this._rotationRect.p4.y);
        // this.graph.lineTo(this._rotationRect.p1.x , this._rotationRect.p1.y);
        // this.graph.fillColor = cc.Color.BLACK;
        // this.graph.close();
        // this.graph.fill();
        // this.graph.fillColor = cc.Color.RED;
        // this.graph.fillRect(this._rotationRect.x, this._rotationRect.y , this._rotationRect.width , this._rotationRect.height);
        let monsters: Monster[] = Game.soMgr.getRectMonsters(GlobalVal.tempRect , campId);
        let all: Monster[] = [];
        let len: number = monsters.length;
        let monster: Monster;
        for (let i = 0; i < len; i++) {
            monster = monsters[i];
            if (this.doRectanglesCollideSAT(monster.rect)) {
                all.push(monster);
            }
        }
        return all;
    }

    private initTempVertices() {
        if (!this._tempRotationRectVertices) {
            this._tempRotationRectVertices = [new cc.Vec2(), new cc.Vec2(), new cc.Vec2(), new cc.Vec2()];
            this._tempAxes = [];
            // 前4个轴用于技能区，后4个轴用于怪物
            for (let i = 0; i < 8; i++) {
                this._tempAxes.push(new cc.Vec2());
            }
        }
        this._tempRotationRectVertices[0].x = this._rotationRect.p1.x;
        this._tempRotationRectVertices[0].y = this._rotationRect.p1.y;
        this._tempRotationRectVertices[1].x = this._rotationRect.p2.x;
        this._tempRotationRectVertices[1].y = this._rotationRect.p2.y;
        this._tempRotationRectVertices[2].x = this._rotationRect.p3.x;
        this._tempRotationRectVertices[2].y = this._rotationRect.p3.y;
        this._tempRotationRectVertices[3].x = this._rotationRect.p4.x;
        this._tempRotationRectVertices[3].y = this._rotationRect.p4.y;

    }

    private doRectanglesCollideSAT(rect:Rect) {
        const axes: cc.Vec2[] = this._tempAxes;
        for (let i = 0; i < 4; i++) {
            let edge = this._tempRotationRectVertices[(i + 1) % 4].sub(this._tempRotationRectVertices[i]);
            const axis = axes[i];
            axis.x = -edge.y;
            axis.y = edge.x;
            axis.normalize();
        }
        return this.isRectanglesCollideSAT(this._tempRotationRectVertices , rect.getVertices());
    }

    //分离轴定理检测碰撞
    private isRectanglesCollideSAT(verticesA: cc.Vec2[] , verticesB: cc.Vec2[]): boolean {
        const axes: cc.Vec2[] = this._tempAxes;
        for (let i = 0; i < 4; i++) {
            let edge = verticesB[(i + 1) % 4].sub(verticesB[i]);
            const axis = axes[i + 4];
            axis.x = -edge.y;
            axis.y = edge.x;
            axis.normalize();
        }
        for (let axis of axes) {
            let [minA, maxA] = this.projectPolygon(verticesA, axis);
            let [minB, maxB] = this.projectPolygon(verticesB, axis);
            if (maxA < minB || maxB < minA) {
                return false;
            }
        }
        return true;
    }

    private projectPolygon(vertices: cc.Vec2[], axis: cc.Vec2): [number, number] {
        let min = vertices[0].dot(axis);
        let max = min;
        for (let i = 1; i < vertices.length; i++) {
            let p = vertices[i].dot(axis);
            if (p < min) min = p;
            if (p > max) max = p;
        }
        return [min, max];
    }

    private doRectanglesCollide(rectangle2: Rect): boolean {
        // 计算旋转后矩形1和矩形2的边框信息
        const p1Vertices = this._tempVertices;
        const p2Vertices = this.getVertices2(rectangle2);
        // 检查边框信息是否有重叠
        if (
            !this.checkOverlap(p1Vertices.xValues, p2Vertices.xValues) ||
            !this.checkOverlap(p1Vertices.yValues, p2Vertices.yValues)
        ) {
            return false;
        }
        // 检查矩形1和矩形2是否真正相交
        for (let i = 0; i < p1Vertices.vertices.length; i++) {
            const edge1 = {
                p1: p1Vertices.vertices[i],
                p2: p1Vertices.vertices[(i + 1) % 4],
            };
            for (let j = 0; j < p2Vertices.vertices.length; j++) {
                const edge2 = {
                    p1: p2Vertices.vertices[j],
                    p2: p2Vertices.vertices[(j + 1) % 4],
                };
                if (this.checkLineIntersection(edge1.p1, edge1.p2, edge2.p1, edge2.p2)) {
                    return true;
                }
            }
        }
        return false;
    }

    // 计算矩形的4个顶点坐标
    private getVertices1(rectangle: RotationRect) {
        const vertices = [
            { x: rectangle.p1.x, y: rectangle.p1.y },
            { x: rectangle.p2.x, y: rectangle.p2.y },
            { x: rectangle.p3.x, y: rectangle.p3.y },
            { x: rectangle.p4.x, y: rectangle.p4.y },
        ];
        const xValues = vertices.map((v) => v.x);
        const yValues = vertices.map((v) => v.y);
        return { vertices, xValues, yValues };
    }

    private getVertices2(rectangle: Rect) {
        const vertices = [
            { x: rectangle.x, y: rectangle.y },
            { x: rectangle.xMax, y: rectangle.y },
            { x: rectangle.xMax, y: rectangle.yMax },
            { x: rectangle.x, y: rectangle.yMax },
        ];
        const xValues = vertices.map((v) => v.x);
        const yValues = vertices.map((v) => v.y);
        return { vertices, xValues, yValues };
    }

    // 检查两个值域是否有重叠
    private checkOverlap(aValues: number[], bValues: number[]) {
        const minA = Math.min(...aValues);
        const maxA = Math.max(...aValues);
        const minB = Math.min(...bValues);
        const maxB = Math.max(...bValues);
        return maxA >= minB && minA <= maxB;
    }
    // 检查两条线段是否相交
    private checkLineIntersection(
        p1: { x: number; y: number },
        p2: { x: number; y: number },
        p3: { x: number; y: number },
        p4: { x: number; y: number }
    ): boolean {
        const denominator =
            (p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y);
        const ua =
            ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) /
            denominator;
        const ub =
            ((p2.x - p1.x) * (p1.y - p3.y) - (p2.y - p1.y) * (p1.x - p3.x)) /
            denominator;
        return ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1;
    }


    /**一群怪受击 */
    private hitMonsters(hitObjs: Monster[], attackValue: number, skillUid: number, skill: LDSkillBase) {
        let hitCountMax = (skill.targetCount || 100) + this._addTargetCount;
        let len = hitObjs.length;
        let groupID = 0;
        let hitCount = 0;
        this._groupHitList = {};
        for (let i = 0; i < len; i++) {
            if (!hitObjs[i].isDied) {
                groupID = hitObjs[i].groupID;
                if (groupID > 0) {
                    if (this._groupHitList[groupID]) {
                        continue;
                    }
                    this._groupHitList[groupID] = true;
                }
                hitCount ++;
                if (hitCount >= hitCountMax) return;
                this.onHit(hitObjs[i], attackValue, skillUid);
            }
        }
    }

    creatureDie(target: Monster, skillUid: number) {
        let cfg = target.cfg;
        let x = target.x;
        let y = target.y;
        let dieEft: string = "";

        if (SoType.isMonster(target)) {
            let floatValue = Math.floor(cfg.udropgold * target.coinRatio);

            if (floatValue > 0) {
                GameEvent.emit(EventEnum.FLOAT_GOLD, x , y, floatValue , target.camp);
            }
            if (cfg.dropsId > 0) {
                GameEvent.emit(EventEnum.LD_MONSTER_DROPS , cfg.dropsId , x , y , target.camp);
            }
        }

        //死亡后爆炸
        if (SoType.isBomb(target, cfg)) {
            dieEft = 'boom';
        } else if (SoType.isGoldItem(target, cfg)) {
            dieEft = 'gold';
        }

        if (dieEft != "") {
            let centerPos = target.centerPos;
        }

        if (SoType.isSommon(target)) {
            GameEvent.emit(EventEnum.LD_SOMMON_OBJ_DIE , target);
        } 
        Game.soMgr.monsterDie(target, dieEft == "" , skillUid);
    }

    /**创建陷阱 */
    createTrap(x: number, y: number, trapID: number, skillUid: number) {
        // let trapCfg = this.getTrap(trapID);
        // if (MathUtils.seedRandomConst() * 10000 <= trapCfg.rate) {
        //     this._trapCtrl.createTarp(x, y, this.getTrap(trapID), skillUid);
        // }
    }



    private enemyFunc() {

    }

    playHitEft(skill: LDSkillBase, target: Monster) {
        let comp:HitHighLightComp = target.getAddComponent(EComponentType.HIT_HIGH_LIGHT);
        comp.start();
        if (!StringUtils.isNilOrEmpty(skill.hitEft) && skill.skillType !== SKILLTYPE.SKILLTYPE_FIXEDBOMB) {
            //如果有受击特效并且目标是景物或者是带溅射的目标弹道或者带溅射的方向弹道
            Game.soMgr.playBindSoEffect(target , skill.hitEft);
            return;
        }
    }

    /**获取到目标的角度 */
    getToTargetAngle(a:SceneObject , b:SceneObject):number {
        let pos:cc.Vec2 = a.pos;
        let toPos:cc.Vec2 = b.centerPos;
        let angle:number = MathUtils.getAngle(pos.x , pos.y , toPos.x , toPos.y);
        return angle;
    }

    //////////////////////////////////////////////////////////////////////////////////
    
    /**
     * 获取圆形范围内的英雄表格
     * @param allList 所有英雄表格列表
     * @param rangeValue1 圆形范围半径
     * @param list 存储满足条件的英雄表格列表
     */
    private getCircleHeroTables(allList:HeroTable[] | Monster[] , rangeValue1:number , list:SceneObject[]) {
        allList.forEach(element => {
            // Game.ldSkillMgr.graph.fillRect(element.rect.x , element.rect.y , element.rect.width , element.rect.height);
            let dis = MathUtils.p2RectDis(element.rect , GlobalVal.tempVec2);
            if (dis <= rangeValue1) {
                list.push(element);
            }
        });
    }

    /**
     * 获取扇形范围内的英雄表格
     * @param allList 所有英雄表格数组
     * @param rangeValue1 半径范围值
     * @param rangeValue2 角度范围值
     * @param list 存储符合条件的英雄表格数组
     */
    private getSectorHeroTables(allList:HeroTable[] | Monster[] , rangeValue1:number , rangeValue2:number , list:SceneObject[]) {
        let circleList = [];
        this.getCircleHeroTables(allList , rangeValue1 , circleList);
        const angle = MathUtils.getAngle(GlobalVal.tempVec2.x, GlobalVal.tempVec2.y, GlobalVal.temp3Vec2.x, GlobalVal.temp3Vec2.y);
        const angleMin = angle - rangeValue2 * 0.5;
        const angleMax = angle + rangeValue2 * 0.5;
        let angles: number[][];
        let angleList: number[][] = [[angleMin, angleMax]];
        if (angleMin < 0) {
            angleList[0] = [0, angleMax];
            angleList[1] = [angleMin + 360, 360];
        }
        circleList.forEach(element => {
            angles = MathUtils.getAngleP2Rect(GlobalVal.tempVec2, element.rect);
            if (MathUtils.checkAngleCoincide(angleList, angles)) {
                list.push(element);
            }
        });
    }

    /**获得矩形范围内所有英雄 */
    private getRotationRectHeroTables(allList:HeroTable[] | Monster[]  , wid: number, range: number, rotation: number , list:SceneObject[]) {
        let halfWid = wid * 0.5;
        GlobalVal.tempRect.init(GlobalVal.tempVec2.x - halfWid, GlobalVal.tempVec2.y, wid, range);
        this._rotationRect.setRect(GlobalVal.tempRect, rotation - (Math.PI * 0.5));
        GlobalVal.tempRect.init(this._rotationRect.x, this._rotationRect.y, this._rotationRect.width, this._rotationRect.height);
        this._tempVertices = this.getVertices1(this._rotationRect); 

        let len: number = allList.length;
        let heroTable: HeroTable | Monster;
        for (let i = 0; i < len; i++) {
            heroTable = allList[i];
            if (this.doRectanglesCollide(heroTable.rect)) {
                list.push(heroTable);
            }
        }

    }

    private getHeroTables(x:number ,y:number , type:SkillHitRangeType ,campId:ECamp, rangeValue1:number , rangeValue2:number = 0):any[] {
        GlobalVal.tempVec2.x = x;
        GlobalVal.tempVec2.y = y;
        let allList:HeroTable[] = Game.soMgr.getAllHeroTables(campId);
        let allSommonList:Monster[] = Game.soMgr.getAllSommons();
        const allTargets:any[] = [];

        for (let i = 0; i < allList.length; i++) { allTargets.push(allList[i]); }
        for (let i = 0; i < allSommonList.length; i++) { allTargets.push(allSommonList[i]); }


        let list:SceneObject[] = [];
        switch (type) {
            case SkillHitRangeType.CIRCLE_TARGET:
            case SkillHitRangeType.CIRCLE_SELF:
                this.getCircleHeroTables(allTargets , rangeValue1 , list);
                break;
            case SkillHitRangeType.SECTOR:
                this.getSectorHeroTables(allTargets , rangeValue1 , rangeValue2 , list);
                break;
            case SkillHitRangeType.RECT:
            case SkillHitRangeType.SELF_RECT:
                let angle = MathUtils.getAngle(x , y , GlobalVal.temp3Vec2.x , GlobalVal.temp3Vec2.y);
                this.getRotationRectHeroTables(allTargets , rangeValue1 , rangeValue2 , MathUtils.angle2Radian(angle) , list);
                break;
            case SkillHitRangeType.ALL:
                list = allTargets;
                break;

            default:
                break;
        }
        return list;
    }


    private getDeepeningDamageToCareer(career:number , monster:Monster) {
        return monster.prop.getPropertyValue(PropertyId.DEEPENING_DAMAGE_TO_CAREER_1 + career - 1);
    }

    private getReducitionDamageToCareer(career:number , monster:Monster) {
        return monster.prop.getPropertyValue(PropertyId.REDUCTION_DAMAGE_TO_CAREER_1 + career - 1);
    }

    private getDodgeToCareer(career:number , monster:Monster) {
        return monster.prop.getPropertyValue(PropertyId.DODGE_TO_CAREER_1 + career - 1);
    }


    private getCareerResistanceReduction(career:number , monster:Monster) {
        return monster.prop.getPropertyValue(PropertyId.CAREER_RESISRANCE_REDUCTION_1 + career - 1);
    }




}