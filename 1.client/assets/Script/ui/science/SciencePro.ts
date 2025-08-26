import Game from "../../Game";
import { GS_StrengConfig_LevelItem, GS_StrengConfig_StrengItem, GS_StrengData_StrengData } from "../../net/proto/DMSG_Plaza_Sub_Streng";
import { STRENG_TYPE } from "../../net/socket/handler/MessageEnum";
import { Encryption } from "../../utils/EncryptionValue";

export class StrengBuffPro {
    /**强化类型 */
    type:number = 0;
    /**强化概率 */
    per:number = 0;
    /**强化时间 */
    time:number = 0;
    /**强化效果值 */
    value:number = 0;
    /**强化伤害值 */
    atkValue:number = 0;
    /**被加强需要的状态类型 */
    beNeededBuffType:number = -1;

    constructor() {
        Encryption.wrapIntProp(this , ['atkValue' , 'value'])
    }
}


export class SciencePro {

    /**针对目标类型伤害增强 */
    hurtTargetType:number = 0;
    /**针对目标类型伤害增强 - 值 */
    hurtTargetTypeValue:number = 0;

    /** 针对目标血量伤害增强 - 类型 0：高于 1：低于 */
    hurtTargrtHighType:number = 0;
    /**针对目标血量伤害增强 */
    hurtTargrtHighHp:number = 0;
    /**针对目标血量伤害增强 - 值 */
    hurtTargrtHighValue:number = 0;

    /**次数百分比附加状态 */
    addStatusTime:number = 0;
    /**次数百分比附加状态 - 状态id */
    addStatusID:number = 0;
    addStatusLevel:number = 0;

    /**针对自身等级伤害增强-等级 */
    hurtSelfLevel:number = 0;
    /**针对自身等级伤害增强-值 */
    hurtSelfLevelValue:number = 0;

    /**集火伤害增强 - 值*/
    focusHurtValue:number = 0;

    /**穿透伤害增强-值 */
    penetrateHurtValue:number = 0;

    /**群攻伤害增强-数量 */
    groupHurtNum:number = 0;
    /**群攻伤害增强-数值 */
    groupHurtValue:number = 0;

    /**增加攻击距离 */
    addAttackDis:number = 0;

    /**增加攻击速度 */
    addAttackSpeed:number = 0;

    /**攻击力转攻速 */
    attackToSpeed:number = 0;

    /**概率附加新状态 */
    perAddNewStatus:number = 0;
    perAddStatusID:number = 0;
    perAStatusLevel:number = 0;

    /**攻击概率伤害提升 */
    addHurtPer:number = 0;
    addHurtRate:number = 0;

    /**附加二段技能 */
    addSkill2:number = 0;
    addSkill2Per:number = 0;
    addSkill2HurtRate:number = 0;

    /**次数附加二段技能（技能等级跟当前技能一致） */
    addSkill2Time:number = 0;

    /**金币消耗降低 */
    reduceGold:number = 0;

    /**等级范围内全塔类型射速增强 */
    rangeAttackSpeedSelfLevel:number = 0;
    /**等级范围内全塔类型射速增强 -值 */
    rangeAttackSpeedSelfValue:number = 0;
    rangeAttackSpeedSelfRange:number = 0;

    /**等级范围内全塔类型伤害增强 */
    rangeDeepenHurtSelfLevel:number = 0;
    /**等级范围内全塔类型伤害增强 -值*/
    rangeDeepenHurtSelfValue:number = 0;
    rangeDeepenHurtSelfRange:number = 0;

    /**等级范围内全塔类型攻击距离增强 */
    rangeDistSelfLevel:number = 0;
    /**等级范围内全塔类型攻击距离增强-值 */
    rangeDistSelfValue:number = 0;
    rangeDistSelfRange:number = 0;

    /**百分百附加新状态 */
    addNewStatusID:number = 0;
    addNewStatusLevel:number = 0;

    /**范围内全塔类型自带效果数值加强 */
    rangeStatus:number = 0;

    /**概率替换技能ID */
    rangeSwitchSkill:number = 0;
    rangeSwitchRate:number = 0;

    /**全范围内全塔类型伤害增强 */
    deepenHurtSelfLevel:number = 0;
    /**等级全范围内全塔类型伤害增强 -值*/
    deepenHurtSelfValue:number = 0;
    /** 等级全范围内全塔类型*/
    deepenHurtSelfType:number = 0;

    /**当前状态ID */
    exchangeCurBuffid:number = 0;
    /**替换新状态ID */
    exchangeToBuffid:number = 0;
    /**新状态等级 */
    exchangeToBuffLevel:number = 0;
    /**累计附加次数 */
    buffCumulation:number = 0;

    /**添加弹道数量 */
    addBulletCount:number = 0;
    /**添加弹道数量方式0：随机，1固定 */
    addBulletType:number = 0;
    /**添加弹道针对的技能id */
    addBulletSkillId:number = 0;
    
    /**科技增加的战斗力 */
    addBattleValue:number = 0;
    /**范围 */
    //range:number = 0;

    /**全范围内相同猫咪伤害增强 */
    deepenHurtSelfTowerId:number = 0;
    /**全范围内相同猫咪伤害增强 -值*/
    deepenHurtSelfTowerValue:number = 0;
    /**全范围内相同猫咪伤害增强 -值上限*/
    deepenHurtSelfTowerValueMax:number = 0;

    /**全范围内相同猫咪buff增强 */
    deepenBuffSelfTowerId:number = 0;
    /**全范围内相同猫咪buff增强 - buffid */
    deepenBuffSelfTowerBuffId:number = 0;
    /**全范围内相同猫咪buff增强 -值*/
    deepenBuffSelfTowerValue:number = 0;
    /**全范围内相同猫咪buff增强 -值上限*/
    deepenBuffSelfTowerValueMax:number = 0;


    private _troopid:number = 0;
    private _quality:number = 0;
    private _strengDataList:GS_StrengData_StrengData[];
    private _strengBuffProList:any = {};

    constructor() {
        Encryption.wrapIntProp(this , [
            'hurtTargetTypeValue' ,
            'hurtTargrtHighValue' , 
            'addBulletCount' , 
            'buffCumulation' , 
            // 'deepenHurtSelfValue' , 
            // 'rangeDistSelfValue' , 
            'rangeDeepenHurtSelfValue' , 
            // 'rangeAttackSpeedSelfValue' , 
            // 'addHurtPer' , 
            // 'addHurtRate' , 
            // 'perAddNewStatus' , 
            'groupHurtValue' , 
            'penetrateHurtValue' , 
            'focusHurtValue' , 
            'hurtSelfLevelValue' , 
            'addStatusTime'])
    }

    ////////////////////////////////////////////////////////////////////////////////function

    /**初始化 */
    init(troopID:number , strengDataList:GS_StrengData_StrengData[]) {
        this.reset();
        this._troopid = troopID;
        let towerInfo = Game.towerMgr.getTroopBaseInfo(this._troopid);
        if (towerInfo) {
            this._quality = towerInfo.btquality;
            this._strengDataList = strengDataList;
            if (this._strengDataList && this._strengDataList.length > 0) {
                this.calcAllPro();
            }
        }
    }

    

    /**获取一个强化buff的科技 */
    getStrengBuffPro(buffType:number):StrengBuffPro {
        return this._strengBuffProList[buffType + 1] || this._strengBuffProList[0];
    }

    getStrengBuffProById(id:number):StrengBuffPro {
        return this._strengBuffProList[id];
    }

    ///////////////////////////////////////////////////////////////////////////////////
    /**
     * 重置
     */
    private reset() {
        this.hurtTargetType = 0;
        this.hurtTargetTypeValue = 0;
        this.hurtTargrtHighType = 0;
        this.hurtTargrtHighHp = 0;
        this.hurtTargrtHighValue = 0;
        this.addStatusTime = 0;
        this.addStatusID = 0;
        this.addStatusLevel = 0;
        this.hurtSelfLevel = 0;
        this.hurtSelfLevelValue = 0;
        this.focusHurtValue = 0;
        this.penetrateHurtValue = 0;
        this.groupHurtNum = 0;
        this.groupHurtValue = 0;
        this.addAttackDis = 0;
        this.addAttackSpeed = 0;
        this.attackToSpeed = 0;
        //this.modStatusPer = 0;

        this.perAddNewStatus = 0;
        this.addHurtPer = 0;
        this.addSkill2 = 0;
        this.addSkill2Time = 0;
        this.reduceGold = 0;
        this.rangeAttackSpeedSelfLevel = 0;
        this.rangeAttackSpeedSelfValue = 0;
        this.rangeDeepenHurtSelfLevel = 0;
        this.rangeDeepenHurtSelfValue = 0;
        this.rangeDistSelfLevel = 0;
        this.rangeDistSelfValue = 0;
        this.addNewStatusID = 0;
        this.addNewStatusLevel = 0;
        this.rangeStatus = 0;
        this.rangeSwitchSkill = 0;
        this.perAddStatusID = 0;
        this.perAStatusLevel = 0;
        this.addHurtRate = 0;
        this.addSkill2Per = 0;
        this.addSkill2HurtRate = 0;
        this.rangeSwitchRate = 0;
        this.rangeAttackSpeedSelfRange = 0;
        this.rangeDeepenHurtSelfRange = 0;
        this.rangeDistSelfRange = 0;
        this.deepenHurtSelfLevel = 0;
        this.deepenHurtSelfValue = 0;
        this.deepenHurtSelfType = 0;

        /**当前状态ID */
        this.exchangeCurBuffid = 0;
        /**替换新状态ID */
        this.exchangeToBuffid = 0;
        /**新状态等级 */
        this.exchangeToBuffLevel = 0;
        /**累计附加次数 */
        this.buffCumulation = 0;

        /**添加弹道数量 */
        this.addBulletCount = 0;
        /**添加弹道数量方式0：随机，1固定 */
        this.addBulletType = 0;
        /**添加弹道针对的技能id */
        this.addBulletSkillId = 0;


        this.deepenHurtSelfTowerId = 0;
        this.deepenHurtSelfTowerValueMax = 0;
        this.deepenHurtSelfTowerValue = 0;

        this.deepenBuffSelfTowerId = 0;
        this.deepenBuffSelfTowerBuffId = 0;
        this.deepenBuffSelfTowerValueMax = 0;
        this.deepenBuffSelfTowerValue = 0;

        this._strengBuffProList = {};
        this.addBattleValue = 0;
    }

    private calcAllPro() {
        this._strengDataList.forEach(element => {
            this.calcPro(element);
        });
    }

    private calcPro(data:GS_StrengData_StrengData) {
        let strengItem:GS_StrengConfig_StrengItem = Game.strengMgr.getStrengItem(data.nid);
        if (strengItem.ntroopsid != this._troopid && strengItem.ntroopsid != 0) {
            //cc.log('strengItem.ntroopsid != this._troopid:' , strengItem.ntroopsid , this._troopid);
            return;
        }
        if (!strengItem) return cc.log('calc streng pro error , not found strengitem:' , data.nid);
        let levelItem:GS_StrengConfig_LevelItem = Game.strengMgr.getLevelCfg(strengItem , data.nlevel);
        if (!levelItem) return cc.log('calc streng pro error , not found GS_StrengConfig_LevelItem:' , data.nid , data.nlevel);
        this.addBattleValue += levelItem.nfightscore[this._quality];
        switch (strengItem.bttype) {
            case STRENG_TYPE.STRENGTYPE_DEEPENHURT_TARGETTYPE:
                this.hurtTargetType = strengItem.nparams[0];
                this.hurtTargetTypeValue = levelItem.nvalue;
                break;
            case STRENG_TYPE.STRENGTYPE_DEEPENHURT_TARGETHIGHHP:
                this.hurtTargrtHighType = strengItem.nparams[0];
                this.hurtTargrtHighHp = strengItem.nparams[1] / 10000;
                this.hurtTargrtHighValue = levelItem.nvalue;
                break;
            case STRENG_TYPE.STRENGTYPE_ADDNEWSTATUS_TIME:
                this.addStatusTime = strengItem.nparams[1];
                this.addStatusID = strengItem.nparams[0];
                this.addStatusLevel = levelItem.nvalue;
                break;
            case STRENG_TYPE.STRENGTYPE_DEEPENHURT_SELFLEVEL:
                /**针对自身等级伤害增强-等级 */
                this.hurtSelfLevel = strengItem.nparams[0];
                /**针对自身等级伤害增强-值 */
                this.hurtSelfLevelValue = levelItem.nvalue;
                break;
            case STRENG_TYPE.STRENGTYPE_FOCUSHURT:
                /**集火伤害增强 - 值*/
                this.focusHurtValue = levelItem.nvalue;
                break;
            case STRENG_TYPE.STRENGTYPE_PENETRATEHURT:
                /**穿透伤害增强 - 值*/
                this.penetrateHurtValue = levelItem.nvalue;
                break;
            case STRENG_TYPE.STRENGTYPE_GROUPHURT:
                /**群攻伤害增强-数量 */
                this.groupHurtNum = strengItem.nparams[0];
                /**群攻伤害增强-数值 */
                this.groupHurtValue = levelItem.nvalue;
                break;
            case STRENG_TYPE.STRENGTYPE_ATTACKDIST:
                /**攻击距离 */
                this.addAttackDis = levelItem.nvalue / 10000;
                break;
            case STRENG_TYPE.STRENGTYPE_ATTACKSPEED:
                /**攻击速度 */
                this.addAttackSpeed = levelItem.nvalue / 10000;
                break;
            case STRENG_TYPE.STRENGTYPE_ATTACKTOSPEED:
                /**攻击力转攻击速度 */
                this.attackToSpeed = levelItem.nvalue / 10000;
                break;
            case STRENG_TYPE.STRENGTYPE_MODSTATUSPER:
            case STRENG_TYPE.STRENGTYPE_MODSTATUSVALUE:
            case STRENG_TYPE.STRENGTYPE_MODSTATUSTIME:
                this.addStrengBuffPro(strengItem , levelItem);
                break;
            case STRENG_TYPE.STRENGTYPE_PERADDNEWSTATUS:
                /**概率附加新状态 */
                this.perAddNewStatus = levelItem.nvalue / 10000;
                this.perAddStatusID = strengItem.nparams[0];
                this.perAStatusLevel = strengItem.nparams[1];
                break;
            case STRENG_TYPE.STRENGTYPE_ADDHURT_PER:
                /**攻击概率伤害提升 */
                this.addHurtPer = strengItem.nparams[0];
                this.addHurtRate = levelItem.nvalue / 10000;
                break;
            case STRENG_TYPE.STRENGTYPE_ADDSKILL2:
                //main-param0:二段技能ID(等级使用原技能本身等级)		main-param1:释放概率				level-param0:伤害系数百分比
                /**附加二段技能 */
                this.addSkill2 = strengItem.nparams[0];
                this.addSkill2Per = strengItem.nparams[1] / 10000;
                this.addSkill2HurtRate = levelItem.nvalue;
                break;
            case STRENG_TYPE.STRENGTYPE_ADDSKILL2_TIME:
                //main-param0:二段技能ID(等级使用原技能本身等级)		main-param1:次数				level-param0:伤害系数百分比
                /**附加二段技能 */
                this.addSkill2 = strengItem.nparams[0];
                this.addSkill2Time = strengItem.nparams[1];
                this.addSkill2HurtRate = levelItem.nvalue;
                break;
            case STRENG_TYPE.STRENGTYPE_REDUCEGOLD:
                /**金币消耗降低 */
                this.reduceGold = levelItem.nvalue / 10000;
                break;
            case STRENG_TYPE.STRENGTYPE_RANGEATTACKSPEED_SELFLEVEL:
                /**等级范围内全塔类型射速增强 */
                this.rangeAttackSpeedSelfRange = strengItem.nparams[0];
                this.rangeAttackSpeedSelfLevel = strengItem.nparams[1];
                this.rangeAttackSpeedSelfValue = levelItem.nvalue / 10000;
                break;
            case STRENG_TYPE.STRENGTYPE_RANGEDEEPENHURT_SELFLEVEL:
                /**等级范围内全塔类型伤害增强 */
                this.rangeDeepenHurtSelfRange = strengItem.nparams[0];
                this.rangeDeepenHurtSelfLevel = strengItem.nparams[1];
                this.rangeDeepenHurtSelfValue = levelItem.nvalue;
                break;
            case STRENG_TYPE.STRENGTYPE_RANGEDIST_SELFLEVEL:
                /**等级范围内全塔类型攻击距离增强 */
                this.rangeDistSelfRange = strengItem.nparams[0];
                this.rangeDistSelfLevel = strengItem.nparams[1];
                this.rangeDistSelfValue = levelItem.nvalue / 10000;
                break;
            case STRENG_TYPE.STRENGTYPE_ADDNEWSTATUS:
                /**百分百附加新状态 */
                this.addNewStatusID = strengItem.nparams[0];
                this.addNewStatusLevel = levelItem.nvalue;
                break;
            case STRENG_TYPE.STRENGTYPE_RANGESTATUS:
                /**范围内全塔类型自带效果数值加强 */
                this.addNewStatusID = strengItem.nparams[0];
                this.addNewStatusLevel = levelItem.nvalue;
                break;
            case STRENG_TYPE.STRENGTYPE_RANGSWITCHSKILL:
                /**概率替换技能ID */
                this.rangeSwitchSkill = strengItem.nparams[0];
                this.rangeSwitchRate = levelItem.nvalue / 10000;
                break;
            case STRENG_TYPE.STRENGTYPE_GROUPHURTADDPER:
                /**炮台集体伤害提升 */
                this.deepenHurtSelfType = strengItem.nparams[0];
                this.deepenHurtSelfLevel = strengItem.nparams[1];
                this.deepenHurtSelfValue = levelItem.nvalue / 10000;
                break;
            case STRENG_TYPE.STRENGTYPE_STATUSHURTADDPER:
                /**状态伤害加强 */
                let buffId = strengItem.nparams[0];
                let strengBuffItem:StrengBuffPro = this._strengBuffProList[buffId] ||  new StrengBuffPro();
                strengBuffItem.atkValue += levelItem.nvalue;
                strengBuffItem.beNeededBuffType = strengItem.nparams[1];
                this._strengBuffProList[buffId] = strengBuffItem;
                break;
            case STRENG_TYPE.STRENGTYPE_STATUSSWITCH:
                /**状态附加次数转换新状态 */
                this.exchangeCurBuffid = strengItem.nparams[0];
                this.buffCumulation = strengItem.nparams[1];
                this.exchangeToBuffid = strengItem.nparams[2];
                this.exchangeToBuffLevel = levelItem.nvalue;
                break;
            case STRENG_TYPE.STRENGTYPE_STATUSVALUEADD:
                /**添加弹道数量 */
                this.addBulletCount = levelItem.nvalue;
                /**添加弹道数量方式0：随机，1固定 */
                this.addBulletType = strengItem.nparams[1];
                /**添加弹道针对的技能id */
                this.addBulletSkillId = strengItem.nparams[0];
                break;
            case STRENG_TYPE.STRENGTYPE_ADDSKILL2_RATE:
                this.addSkill2 = strengItem.nparams[0];
                this.addSkill2Per = levelItem.nvalue / 10000;
                break;
            case STRENG_TYPE.STRENGTYPE_GROUPHURTADDPER2:
                this.deepenHurtSelfTowerId = strengItem.nparams[0];
                this.deepenHurtSelfTowerValueMax = strengItem.nparams[1] * 0.0001;
                this.deepenHurtSelfTowerValue = levelItem.nvalue * 0.0001;
                break;
            case STRENG_TYPE.STRENGTYPE_GROUPSTATUSADDPER:
                this.deepenBuffSelfTowerId = strengItem.nparams[0];
                this.deepenBuffSelfTowerBuffId = strengItem.nparams[1];
                this.deepenBuffSelfTowerValueMax = strengItem.nparams[2] * 0.0001;
                this.deepenBuffSelfTowerValue = levelItem.nvalue * 0.0001;
                break;
            default:
                break;
        }
    }

    private addStrengBuffPro(item:GS_StrengConfig_StrengItem,levelItem:GS_StrengConfig_LevelItem) {
        let type = item.nparams[0];
        let strengBuffItem = this._strengBuffProList[type] ||  new StrengBuffPro();
        strengBuffItem.type = type
        if (item.bttype == STRENG_TYPE.STRENGTYPE_MODSTATUSPER) {
            strengBuffItem.per += levelItem.nvalue;
        }
        if (item.bttype == STRENG_TYPE.STRENGTYPE_MODSTATUSTIME) {
            strengBuffItem.time += levelItem.nvalue;
        }
        if (item.bttype == STRENG_TYPE.STRENGTYPE_MODSTATUSVALUE) {
            strengBuffItem.value += levelItem.nvalue;
        }
        this._strengBuffProList[type] = strengBuffItem;
    }
   
}
