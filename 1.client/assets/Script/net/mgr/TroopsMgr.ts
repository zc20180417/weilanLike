import BaseNetHandler from "../socket/handler/BaseNetHandler";
import { ActorProp, CMD_ROOT, GOODS_ID, GOODS_TYPE, GS_PLAZA_MSGID } from "../socket/handler/MessageEnum";
import { GS_PLAZA_TROOPS_MSG, GS_TroopsInfo, GS_TroopsListData, GS_TroopsAddNew, GS_TroopsRetUpGradeStar, GS_TroopsTips, GS_TroopsInfo_TroopsInfoItem, GS_TroopsListData_ActiveTroopsItem, GS_TroopsUpGradeStar, GS_TroopsActive, GS_TroopsRetActive, GS_TroopsInfo_Level, GS_SkillInfo, GS_SkillInfo_SkillInfoItem, GS_SkillInfo_SkillLevel, GS_TroopsGoodsActive, GS_TroopsEquipInfo, GS_TroopsEquipInfo_EquipItem, GS_TroopsEquipData, GS_TroopsUpEquipData, GS_TroopsUpEquipLv, GS_TroopsActiveEquip, GS_TroopsEquipData_ActiveEquipItem, GS_TroopsStarInfo, GS_TroopsStarInfo_TroopUpStarItem, GS_TroopsSwitchCard, GS_TroopsStarInfo_TroopsBase, GS_TroopsStarExtraConfig, GS_TroopsStarExtraConfig_TroopsStarExtraLevel, GS_TroopsStarExtraConfig_TroopsStarExtraItem } from "../proto/DMSG_Plaza_Sub_Troops";
import { Handler } from "../../utils/Handler";
import SystemTipsMgr from "../../utils/SystemTipsMgr";
import { EventEnum } from "../../common/EventEnum";
import { UiManager } from "../../utils/UiMgr";
import { EResPath } from "../../common/EResPath";
import Game from "../../Game";
import { SystemGuideTriggerType } from "../../ui/guide/SystemGuideCtrl";
import { EVENT_REDPOINT } from "../../redPoint/RedPointSys";
import { GS_GoodsInfoReturn_GoodsInfo } from "../proto/DMSG_Plaza_Sub_Goods";
import Debug from "../../debug";
import { Towertype, TowerTypeName } from "../../common/AllEnum";
import { BI_TYPE, MISSION_LEVEL, MISSION_NAME, MISSION_STATE, MISSION_TYPE } from "../../sdk/CKSdkEventListener";
import GlobalVal from "../../GlobalVal";
import { MathUtils } from "../../utils/MathUtils";
import SceneMgr from "../../common/SceneMgr";
import { GameEvent } from "../../utils/GameEvent";
const TOWER_TAG = "炮塔";
let TypeArr = null;
export interface BookWeaponCfg {
    id: string;
    hurtPer: number;
    attackRange: number;
    ctrl: number;
    attackSpeed: number;
    dot: number;
    buildcost: number;
}

export interface BookTowerCfg {
    id: number;
    science: Array<any>;
}

/**炮塔数据管理 */
export default class TroopsMgr extends BaseNetHandler {

    static EQUIP_INFO_LIST1: string[] = [
        "%s攻击伤害提升%s%",
        "%s攻击距离提升%s%",
        "%s攻击速度提升%s%",
    ];

    static EQUIP_INFO_LIST2: string[] = [
        "增加“%s” %s% 攻击伤害",
        "增加“%s” %s% 攻击距离",
        "增加“%s” %s% 攻击速度",
    ];

    static PROP_TYPE: string[] = [
        "攻击伤害：",
        "攻击距离：",
        "攻击速度：",
    ];

    static PROP_TYPE2: string[] = [
        "攻击 +%s%",
        "射程 +%s%",
        "攻速 +%s%",
    ];

    private _troopsInfo: GS_TroopsInfo = null;
    private _troopsDic: { [key: string]: GS_TroopsInfo_TroopsInfoItem; } = {};
    private _troopsLevelDic: any = {};
    private _activelist: GS_TroopsListData_ActiveTroopsItem[] = [];
    private _activeDic: { [key: string]: GS_TroopsListData_ActiveTroopsItem; } = {};
    private _skillDic: { [key: string]: GS_SkillInfo_SkillInfoItem; } = {};
    private _skillLevelDic: any = {};
    private _fightDic: any = {};
    private _starData: GS_TroopsStarInfo;
    private _starDataDic: { [key: string]: GS_TroopsStarInfo_TroopUpStarItem; } = {};
    private _starLevelDic: { [key: string]: number; } = {};

    private _towerStarPageData: Array<any> = [];
    private _allTowerStarPageData:GS_TroopsInfo_TroopsInfoItem[] = [];

    /**指引激活的炮塔id */
    private _guideActiveTowerID: number = 0;

    private _isTroopInfoInit: boolean = false;
    private _isTroopsListDataInit: boolean = false;

    private _bookWeaponCfg: object = null;
    private _bookTowerCfg: object = null;

    private _newActiveTowerMap: Map<number, boolean> = new Map();

    private _towerTypeDes: any;
    private _towerScienceDesDic:Record<string , any> = {};

    constructor() {
        super(CMD_ROOT.CMDROOT_PLAZA_MSG, GS_PLAZA_MSGID.GS_PLAZA_MSGID_TROOPS);
        this.initScienceDes();
        
    }

    register() {
        this.registerAnaysis(GS_PLAZA_TROOPS_MSG.PLAZA_TROOPS_INFO, Handler.create(this.onTroopsInfo, this), GS_TroopsInfo);
        this.registerAnaysis(GS_PLAZA_TROOPS_MSG.PLAZA_TROOPS_LISTDATA, Handler.create(this.onTroopsListData, this), GS_TroopsListData);
        this.registerAnaysis(GS_PLAZA_TROOPS_MSG.PLAZA_TROOPS_ADDNEW, Handler.create(this.onTroopsAddNew, this), GS_TroopsAddNew);
        this.registerAnaysis(GS_PLAZA_TROOPS_MSG.PLAZA_TROOPS_RETUPGRADESTAR, Handler.create(this.onTroopsUpgrade, this), GS_TroopsRetUpGradeStar);
        this.registerAnaysis(GS_PLAZA_TROOPS_MSG.PLAZA_TROOPS_TIPS, Handler.create(this.onTroopsTips, this), GS_TroopsTips);
        this.registerAnaysis(GS_PLAZA_TROOPS_MSG.PLAZA_TROOPS_RETACTIVE, Handler.create(this.onRetActive, this), GS_TroopsRetActive);
        this.registerAnaysis(GS_PLAZA_TROOPS_MSG.PLAZA_TROOPS_SKILLCONFIG, Handler.create(this.onSkillInfo, this), GS_SkillInfo);
        this.registerAnaysis(GS_PLAZA_TROOPS_MSG.PLAZA_TROOPS_EQUIPINFO, Handler.create(this.onEquipInfo, this), GS_TroopsEquipInfo);
        this.registerAnaysis(GS_PLAZA_TROOPS_MSG.PLAZA_TROOPS_EQUIPDATA, Handler.create(this.onEquipData, this), GS_TroopsEquipData);
        this.registerAnaysis(GS_PLAZA_TROOPS_MSG.PLAZA_TROOPS_UPEQUIPDATA, Handler.create(this.onUpEquipData, this), GS_TroopsUpEquipData);
        this.registerAnaysis(GS_PLAZA_TROOPS_MSG.PLAZA_TROOPS_ACTIVETROOPSEQUIP, Handler.create(this.onActiveEquip, this), GS_TroopsActiveEquip);
        this.registerAnaysis(GS_PLAZA_TROOPS_MSG.PLAZA_TROOPS_STARINFO, Handler.create(this.onStarInfo, this), GS_TroopsStarInfo);
        this.registerAnaysis(GS_PLAZA_TROOPS_MSG.PLAZA_TROOPS_SWITCHCARD, Handler.create(this.onSwitchCard, this), GS_TroopsSwitchCard);
        this.registerAnaysis(GS_PLAZA_TROOPS_MSG.PLAZA_TROOPS_STAR_EXTRA, Handler.create(this.onExtraConfig, this), GS_TroopsStarExtraConfig);

        GameEvent.on(EventEnum.ITEM_COUNT_CHANGE, this.onItemChange, this);
        GameEvent.on(EventEnum.ON_GETED_CARD, this.checkCanGuide, this);
        GameEvent.on(EventEnum.ON_SELECT_CAT_BAB, this.onSelectCatTab, this);
    }

    private initScienceDes() {
        this._towerScienceDesDic = {};
        const cfgs = Game.gameConfigMgr.getCfg(EResPath.TOWER_SCIENCE_DES);
        for (const key in cfgs) {
            if (Object.prototype.hasOwnProperty.call(cfgs, key)) {
                const element = cfgs[key];
                this._towerScienceDesDic[element.towerId + '_' + element.level] = element;
            }
        }

        cc.log('initScienceDes:' , this._towerScienceDesDic);
    }

    getTowerScienceDes(towerId: number, level: number): any {
        return this._towerScienceDesDic[towerId + '_' + level] || {des:'未知描述' , name:'未命名'};
    }

    protected onSocketError() {
        this.exitGame();
    }

    protected exitGame() {
        //this._troopsDic = {};
        //this._skillDic = {};
        //this._activelist = [];
        //this._activeDic = {};
        //this._fightDic = {};
        //this._towerStarPageData = [];
        this._equipDataDic = {};
        this._guideActiveTowerID = 0;
        this._isTroopInfoInit = false;
        this._isTroopsListDataInit = false;
        this._newActiveTowerMap.clear();
        // GameEvent.targetOffAll(this);
    }

    private onItemChange(id: number, num: number, oldNum: number) {
        if (id === Game.towerMgr.getSharegoodsid()) {//能量
            this.refreshCanupRedPoints();
        } else if (id >= 101 && id <= 804) {//获得炮塔卡片
            let towerCfg: GS_TroopsInfo_TroopsInfoItem = Game.towerMgr.getTroopBaseInfo(id);
            if (towerCfg) {
                if (id >= 801 && id <= 804 && this.enableUnlock(id)) {
                    //超能系猫需要自动激活
                    this.requestActiveNewTower(id);
                } else {
                    //当前出战炮塔可以升星，添加升星红点
                    if (this._fightDic[towerCfg.bttype] && towerCfg.ntroopsid == this._fightDic[towerCfg.bttype].ntroopsid) {
                        let maxCards = Game.towerMgr.getPrivateGoodsNums(towerCfg.ntroopsid);
                        let energy = Game.containerMgr.getItemCount(Game.towerMgr.getSharegoodsid());
                        let costEnergy = Game.towerMgr.getShareGoodsNums(towerCfg.ntroopsid);
                        let stars = Game.towerMgr.getStar(towerCfg.ntroopsid);
                        if (stars < this.getStarMax(towerCfg.btquality) && oldNum < maxCards && num >= maxCards && oldNum < num && costEnergy <= energy) {
                            GameEvent.emit(EVENT_REDPOINT.YONGBING_CANACTIVE, 1);
                            //GameEvent.emit(EventEnum.SYSTEM_GUIDE_TRIGGER, SystemGuideTriggerType.TOWER_CAN_UPGRADE, towerCfg.ntroopsid);
                        }
                    }

                    //炮塔可以激活，添加新卡红点
                    if (!this.isTowerUnlock(id) && oldNum < towerCfg.nactiveneedcardcount && num >= towerCfg.nactiveneedcardcount) {
                        GameEvent.emit("yongbing-" + id, 1);
                        //GameEvent.emit(EventEnum.SYSTEM_GUIDE_TRIGGER, SystemGuideTriggerType.TOWER_CAN_ACTIVE, towerCfg.ntroopsid);
                    }
                }
            }
        } else {
            let goodsInfo: GS_GoodsInfoReturn_GoodsInfo = Game.goodsMgr.getGoodsInfo(id);
            if (goodsInfo.lgoodstype == GOODS_TYPE.GOODSTYPE_CARD_TROOPSEQUIP && num > 0) {
                let towerID = goodsInfo.lparam[0];
                let equipID = goodsInfo.lparam[1];
                if (this.isTowerUnlock(towerID) && !this.checkEquipActive(equipID)) {
                    this.reqUpgradeEquipLv(equipID);
                }
            }
        }
    }

    /**
     * 更新可升星炮塔红点
     */
    private refreshCanupRedPoints() {
        if (!this._isTroopInfoInit || !this._isTroopsListDataInit) return;
        let redPointsNum = this.getCanupTowerNums(this.getFightTowers());
        let node = Game.redPointSys.findRedPointNode(EVENT_REDPOINT.YONGBING_CANACTIVE);
        if (node) {
            node.setRedPointNum(redPointsNum);
        }
    }

    /**
     * 更新可激活的炮塔红点
     * @returns 
     */
    private refreshCanactiveRedPoints() {
        if (!this._isTroopInfoInit || !this._isTroopsListDataInit) return;
        let towers = this.getTroopDir();
        let towerCfg: GS_TroopsInfo_TroopsInfoItem = null;
        for (let k in towers) {
            towerCfg = towers[k];
            if (this.enableUnlock(towerCfg.ntroopsid)) {
                GameEvent.emit(EVENT_REDPOINT.YONGBING + "-" + towerCfg.ntroopsid, 1);
            }
        }
    }

    getStarMax(quality: number): number {
        return this._starLevelDic[quality] || 30;
    }

    getModelUrl(towerid: number, cfg?: GS_TroopsInfo_TroopsInfoItem): string {
        if (!cfg) {
            cfg = this.getTroopBaseInfo(towerid);
        }
        return EResPath.CREATURE_TOWER + cfg.szskeletonres;
    }

    getUiModelUrl(towerid: number, cfg?: GS_TroopsInfo_TroopsInfoItem): string {
        return this.getFashionModelUrl(towerid, cfg);
    }


    getFashionModelUrl(towerid: number, cfg?: GS_TroopsInfo_TroopsInfoItem): string {
        let fashionItem = Game.fashionMgr.getTowerUseFashionInfo(towerid);
        if (!fashionItem && !cfg) {
            cfg = this.getTroopBaseInfo(towerid);
        }
        return EResPath.CREATURE_TOWER + (fashionItem ? fashionItem.szskeletonres : cfg.szskeletonres);
    }

    getFashionModelUrlTest(towerid: number, cfg?: GS_TroopsInfo_TroopsInfoItem): string {
        const fashionItems = Game.fashionMgr.getTowerFashionInfos(towerid);
        const fashionItem = fashionItems && fashionItems.length > 0 ? fashionItems[0] : null;
        if (!fashionItem && !cfg) {
            cfg = this.getTroopBaseInfo(towerid);
        }
        return EResPath.CREATURE_TOWER + (fashionItem ? fashionItem.szskeletonres : cfg.szskeletonres);
    }

    getHeadName(towerid: number): string {
        return towerid.toString();
    }

    getFashionHeadName(towerid: number): string {
        let fashionItem = Game.fashionMgr.getTowerUseFashionInfo(towerid);
        return fashionItem ? fashionItem.szheadres : towerid.toString();
    }

    getTowerName(towerid: number, cfg?: GS_TroopsInfo_TroopsInfoItem): string {
        if (!cfg) {
            cfg = this.getTroopBaseInfo(towerid);
        }
        let fashionItem = Game.fashionMgr.getTowerUseFashionInfo(towerid);
        return fashionItem ? fashionItem.szname : cfg.szname;
    }

    get3dpicres(towerid: number, cfg?: GS_TroopsInfo_TroopsInfoItem): string {
        if (!cfg) {
            cfg = this.getTroopBaseInfo(towerid);
        }
        let fashionItem = Game.fashionMgr.getTowerUseFashionInfo(towerid);
        return fashionItem ? fashionItem.sz3dpicres : cfg.sz3dpicres;
    }

    getActiveByType(type: number): boolean {
        for (let i = 1; i < 5; i++) {
            if (this.isTowerUnlock(type * 100 + i)) {
                return true;
            }
        }
        return false;
    }

    /**升星需要的公共物品ID */
    getSharegoodsid(): number {
        return this._troopsInfo ? this._troopsInfo.nsharegoodsid : 0;
    }

    /**
     * 获取炮塔配置
     */
    getTroopInfo(): GS_TroopsInfo {
        return this._troopsInfo;
    }

    /**获取一个炮塔配置 */
    getTroopBaseInfo(towerID: number): GS_TroopsInfo_TroopsInfoItem {
        return this._troopsDic[towerID];
    }

    /**获取一个已激活的炮塔数据 */
    getTroopData(towerID: number) {
        return this._activeDic[towerID];
    }

    /**获取所有激活炮塔的数据 */
    getTroopDic(): { [key: string]: GS_TroopsListData_ActiveTroopsItem; } {
        return this._activeDic;
    }

    /**获取某类型激活的炮塔配置 */
    getFightTower(type: number): GS_TroopsInfo_TroopsInfoItem {
        return this._troopsDic[this.getFightTowerID(type)];
    }

    /**获取 */
    getFightTowerID(type: number): number {
        let id = this._fightDic[type];
        if (id) {
            return id;
        }

        for (let i = 1; i < 5; i++) {
            if (this.isTowerUnlock(type * 100 + i)) {
                return type * 100 + i;
            }
        }

        return type * 100 + 1;
    }

    /**获取星级 */
    getStar(towerID: number): number {
        let item = this._activeDic[towerID];
        return item ? item.nstarlevel : 1;
    }

    /** */
    getTypeAllStar(type: number): number {
        let list: GS_TroopsInfo_TroopsInfoItem[] = this._towerStarPageData[type - 1];
        if (!list) return 0;
        let len = list.length;
        let star = 0;
        let item: GS_TroopsInfo_TroopsInfoItem;
        for (let i = 0; i < len; i++) {
            item = list[i];
            if (this._activeDic[item.ntroopsid]) {
                star += this._activeDic[item.ntroopsid].nstarlevel;
            }
        }
        return star;
    }

    /**
     * 获取星星总数
     */
    getAllStar(): number {
        let starNum: number = 0;
        this._towerStarPageData.forEach((value, key) => {
            starNum += this.getTypeAllStar(key + 1);
        });
        return starNum;
    }

    /**获取某一类型的所有炮台 */
    getTowerInfoListByType(type: number): GS_TroopsInfo_TroopsInfoItem[] {
        return this._towerStarPageData[type] || [];
    }

    getLevelData(info: GS_TroopsInfo_TroopsInfoItem, level: number): GS_TroopsInfo_Level {
        if (!this._troopsLevelDic[info.ntroopsid]) {
            let levelList = {}
            if (info.levellist) {
                info.levellist.forEach(element => {
                    levelList[element.btlevel] = element;
                });
            }
            this._troopsLevelDic[info.ntroopsid] = levelList;
        }
        return this._troopsLevelDic[info.ntroopsid][level];
    }

    getSkillInfo(skillID: number): GS_SkillInfo_SkillInfoItem {
        return this._skillDic[skillID];
    }

    getSkillLevelData(info: GS_SkillInfo_SkillInfoItem, level: number): GS_SkillInfo_SkillLevel {
        if (!this._skillLevelDic[info.nskillid]) {
            let levelList = {};
            if (info.levellist) {
                info.levellist.forEach(element => {
                    levelList[element.btlevel] = element;
                });
            }
            this._skillLevelDic[info.nskillid] = levelList;
        }
        return this._skillLevelDic[info.nskillid][level];
    }

    /**获取某系战力最高的猫咪id */
    getStrongestTowerid(type: number): number {
        let list: GS_TroopsInfo_TroopsInfoItem[] = this._towerStarPageData[type - 1];
        if (!list) return 0;
        let len = list.length;

        let maxPower: number = 0;
        let towerId: number = 0;
        let tempPower: number = 0;
        let tempId: number = 0;
        for (let i = 0; i < len; i++) {
            tempId = list[i] ? list[i].ntroopsid : 0;
            if (this._activeDic[tempId]) {
                tempPower = this.getPower(tempId, this._activeDic[tempId].nstarlevel);
                if (tempPower > maxPower) {
                    maxPower = tempPower;
                    towerId = tempId;
                }
            }
        }
        return towerId;
    }

    /**获取某系战力最高的猫咪id */
    getQualityMaxTowerid(type: number): number {
        let list: GS_TroopsInfo_TroopsInfoItem[] = this._towerStarPageData[type - 1];
        if (!list) return 0;
        let len = list.length;

        let maxPower: number = 0;
        let towerId: number = 0;
        let tempPower: number = 0;
        let tempId: number = 0;
        for (let i = 0; i < len; i++) {
            tempId = list[i] ? list[i].ntroopsid : 0;
            if (this._activeDic[tempId]) {
                tempPower = list[i].btquality;
                if (tempPower > maxPower) {
                    maxPower = tempPower;
                    towerId = tempId;
                }
            }
        }
        return towerId;
    }

    /**
     * 获取所有系战力最强的战力
     */
    getAllStrongestTowerPower(): number[] {
        let powers: number[] = [];
        for (let i = 0, len = this._towerStarPageData.length; i < len; i++) {
            let list: GS_TroopsInfo_TroopsInfoItem[] = this._towerStarPageData[i];
            if (!list) {
                powers.push(0);
            } else {
                let len = list.length;

                let maxPower: number = 0;
                let tempPower: number = 0;
                let tempId: number = 0;
                for (let i = 0; i < len; i++) {
                    tempId = list[i] ? list[i].ntroopsid : 0;
                    if (this._activeDic[tempId]) {
                        tempPower = this.getPower(tempId, this._activeDic[tempId].nstarlevel);
                        if (tempPower > maxPower) {
                            maxPower = tempPower;
                        }
                    }
                }

                powers.push(maxPower);
            }
        }
        return powers;
    }

    private checkCanGuide() {
        if (!SceneMgr.instance.isInHall()) return;
        let id = this.calcCanActiveTower(true);
        if (id == -1) {
            this.checkCanGuideUpgrade();
        }
    }

    private calcCanActiveTower(triggerGuide: boolean = false): number {
        let list = Object.values(this._troopsDic);
        let len = list.length;
        let item: GS_TroopsInfo_TroopsInfoItem;
        for (let i = 0; i < len; i++) {
            item = list[i] as GS_TroopsInfo_TroopsInfoItem;
            if (!this.isTowerUnlock(item.ntroopsid) && Game.containerMgr.getItemCount(item.ntroopsid) >= item.nactiveneedcardcount) {
                if (triggerGuide) {
                    GameEvent.emit(EventEnum.SYSTEM_GUIDE_TRIGGER, SystemGuideTriggerType.TOWER_CAN_ACTIVE, item.ntroopsid);
                }
                return item.ntroopsid;
            }
        }
        return -1;
    }

    private checkCanGuideUpgrade() {
        if (Game.systemGuideCtrl.isGuideComplete(SystemGuideTriggerType.TOWER_CAN_UPGRADE)) {
            return false;
        }

        let len = this._activelist.length;
        let troopid = -1;
        let data: GS_TroopsListData_ActiveTroopsItem;
        for (let i = 0; i < len; i++) {
            data = this._activelist[i];
            let troopInfo = this.getTroopBaseInfo(data.ntroopsid);
            if (troopInfo && data.nstarlevel < this.getStarMax(troopInfo.btquality)) {
                let maxCards = this.getPrivateGoodsNums(data.ntroopsid);
                let currCards = Game.containerMgr.getItemCount(troopInfo.ncardgoodsid);

                let energy = Game.containerMgr.getItemCount(this.getSharegoodsid());
                let costEnergy = this.getShareGoodsNums(data.ntroopsid);

                if (maxCards <= currCards && costEnergy <= energy) {
                    troopid = data.ntroopsid;
                    break;
                }
            }
        }

        if (troopid > 0) {
            GameEvent.emit(EventEnum.SYSTEM_GUIDE_TRIGGER, SystemGuideTriggerType.TOWER_CAN_UPGRADE, troopid);
            return true;
        }
        return false;
    }

    ///////////////////////////////////////////////////////

    /**请求升级炮塔 */
    requestUpgrade(ntroopsid: number) {
        let data: GS_TroopsUpGradeStar = new GS_TroopsUpGradeStar();
        data.ntroopsid = ntroopsid;
        this.send(GS_PLAZA_TROOPS_MSG.PLAZA_TROOPS_UPGRADESTAR, data);
    }

    /**请求激活 */
    requestActive(ntroopsid: number) {
        let data: GS_TroopsActive = new GS_TroopsActive();
        data.ntroopsid = ntroopsid;
        this.send(GS_PLAZA_TROOPS_MSG.PLAZA_TROOPS_ACTIVE, data);
    }

    /**
     * 手动激活新炮塔
     * @param ntroopsid 
     */
    requestActiveNewTower(ntroopsid: number) {
        let data: GS_TroopsGoodsActive = new GS_TroopsGoodsActive();
        data.ntroopsid = ntroopsid;
        this.send(GS_PLAZA_TROOPS_MSG.PLAZA_TROOPS_GOODSACTIVE, data);
    }

    /**
     * 获取炮塔类型数组
     */
    public getTowerTypeArr(): Array<any> {
        if (!TypeArr) {
            TypeArr = [];
            for (let i = 0; i < TowerTypeName.length; i++) {
                TypeArr.push({
                    type: i + 1,
                    name: TowerTypeName[i]
                })
            }
        }
        return TypeArr;
    }

    /**
     * 获取炮塔升星系统的页面数据
     */
    public getTowerStarPageData(): Array<Array<GS_TroopsInfo_TroopsInfoItem>> {
        return this._towerStarPageData || [];
    }

    /**
     * 炮塔是否解锁
     * @param towerId 
     */
    public isTowerUnlock(towerId: number) {
        return this._activeDic[towerId] ? true : false;
    }

    /**
     * 炮塔是否激活
     * @param towerId 
     */
    public isTowerActive(towerId: number) {
        let towerCfg = this._troopsDic[towerId];
        return this.getFightTowerID(towerCfg.bttype) == towerId;
    }

    private _tempFightTroops:Record<number , number> = {};

    public initTempFightTroops() {
        for (let i = 1; i < 8; i++) {
            this._tempFightTroops[i] = this.getFightTowerID(i);
        }
    }

    public isTowerTempFight(towerId: number):boolean {
        let towerCfg = this._troopsDic[towerId];
        return this._tempFightTroops[towerCfg.bttype] == towerId;
    }

    public setTowerTempFight(towerId: number) {
        let towerCfg = this._troopsDic[towerId];
        this._tempFightTroops[towerCfg.bttype] = towerId;
        GameEvent.emit(EventEnum.TROOPS_TEMP_FIGHT_CHANGE, towerId);
    }

    public getTempFightByType(type:number):number {
        return this._tempFightTroops[type];
    }

    public saveTempFightTroops() {
        for (let i = 1; i < 8; i++) {
            const prev = this.getFightTowerID(i);
            const now = this._tempFightTroops[i];
            if (now !== prev && prev > 0) {
                this.requestActive(now);
            }
        }
    }

    public oneKeySetTempFightTroops() {
        let flag = false;
        for (let i = 1; i < 8; i++) {
            const prev = this.getTempFightByType(i);
            const towerId = this.getQualityMaxTowerid(i);
            if (towerId !== prev) {
                let towerCfg = this._troopsDic[towerId];
                this._tempFightTroops[towerCfg.bttype] = towerId;
                flag = true;
            }
        }

        if (flag) {
            GameEvent.emit(EventEnum.TROOPS_TEMP_FIGHT_CHANGE);
        }
    }

    public oneKeyRemoveTempFightTroops() {
        let flag = true;
        for (let i = 1; i < 8; i++) {
            this._tempFightTroops[i] = 0;
        }

        if (flag) {
            GameEvent.emit(EventEnum.TROOPS_TEMP_FIGHT_CHANGE);
        }
    }

    public checkOneKeySetTempFightTroops():boolean {
        let flag = false;
        for (let i = 1; i < 8; i++) {
            const prev = this.getTempFightByType(i);
            const towerId = this.getQualityMaxTowerid(i);
            if (towerId !== prev) {
                flag = true;
                break;
            }
        }

        return flag;
    }

    /**
     * 获取升星消耗的公共资源数量
     * @param towerId 
     */
    public getShareGoodsNums(towerId: number): number {
        let towerCfg = this._troopsDic[towerId];
        let level = this.getStar(towerId);

        if (towerCfg && this._starDataDic[this.getStarIndex(towerCfg.btquality, level)]) {
            return this._starDataDic[this.getStarIndex(towerCfg.btquality, level)].nsharegoodsnum;
        }

        return 9999999;
    }

    /**
     * 获取升星消耗的私有资数量
     * @param towerId 
     */
    public getPrivateGoodsNums(towerId: number): number {
        let towerCfg = this._troopsDic[towerId];
        let level = this.getStar(towerId);
        if (towerCfg && this._starDataDic[this.getStarIndex(towerCfg.btquality, level)]) {
            return this._starDataDic[this.getStarIndex(towerCfg.btquality, level)].nprivategoodsnum;
        }

        return 9999999;
    }

    /**
     * 获取炮塔的战斗力
     * @param towerId 
     * @param level 
     */
    public getPower(towerId: number, level: number, excludeIndexs?: number[]): number {

        let towerCfg = this._troopsDic[towerId];
        if (!towerCfg) return 0;
        let basefightscore = 0;
        if (towerCfg && this._starDataDic[this.getStarIndex(towerCfg.btquality, level)]) {
            basefightscore = this._starDataDic[this.getStarIndex(towerCfg.btquality, level)].nfightscore;
        }

        let count = basefightscore;
        let excludeIndex1: boolean = false;
        let excludeIndex2: boolean = false;
        let excludeIndex3: boolean = false;
        if (excludeIndexs && excludeIndexs.length > 0) {
            excludeIndex1 = excludeIndexs.indexOf(0) != -1;
            excludeIndex2 = excludeIndexs.indexOf(1) != -1;
            excludeIndex3 = excludeIndexs.indexOf(2) != -1;
        }
        let addProp1 = excludeIndex1 ? 0 : this.getEquipAddProp(towerCfg.nequipid1);
        let addProp2 = excludeIndex2 ? 0 : this.getEquipAddProp(towerCfg.nequipid2);
        let addProp3 = excludeIndex3 ? 0 : this.getEquipAddProp(towerCfg.nequipid3);
        let fashionAddProp = Game.fashionMgr.getTowerFashionAddHurtPer(towerId);
        fashionAddProp = fashionAddProp ? fashionAddProp / 10000 : 0;
        count = Math.floor(Math.floor(count) * (1 + addProp1) * (1 + addProp2) * (1 + addProp3) * (1 + fashionAddProp));
        //加上科技附加的战力
        count += Game.strengMgr.getScienceProData(towerId).addBattleValue;

        return count;
    }

    /**
     * 获取所有解锁炮塔总战力
     */
    public getAllUnlockTowerPower(): number {
        let totalPower: number = 0;
        for (let k in this._activeDic) {
            totalPower += this.getPower(this._activeDic[k].ntroopsid, this._activeDic[k].nstarlevel);
        }
        return totalPower;
    }

    public getAllFightTowerPower(): number {
        let totalPower: number = 0;
        for (let k in this._activeDic) {
            if (this._activeDic[k].btuse) {
                totalPower += this.getPower(this._activeDic[k].ntroopsid, this._activeDic[k].nstarlevel);
            }
        }
        return totalPower;
    }

    /**
     * 获取炮塔攻击力
     * @param towerId 
     * @param star 
     */
    public getAttack(towerId: number, star: number) {
        let towerCfg = this._troopsDic[towerId];
        let attack = 0;
        if (towerCfg && this._starDataDic[this.getStarIndex(towerCfg.btquality, star)]) {
            attack = this._starDataDic[this.getStarIndex(towerCfg.btquality, star)].nattack;
        }
        return attack;
    }

    /**
     * 获取升星加成后的攻击速度
     * @param towerId 
     * @param star 
     * @param towerLv 
     */
    public getUpStarSpeed(towerId: number, star: number, towerLv: number): number {
        let towerCfg = this._troopsDic[towerId];
        let levelData = this.getLevelData(towerCfg, towerLv);
        let baseSpeed = levelData.nattackspeed;
        return baseSpeed;
    }

    /**
     * 获取升星加成后的攻击距离
     * @param towerId 
     * @param star 
     * @param towerLv 
     */
    public getUpStarDis(towerId: number, star: number, towerLv: number): number {
        let towerCfg = this._troopsDic[towerId];
        let levelData = this.getLevelData(towerCfg, towerLv);
        let baseDis = levelData.nattackdist;
        return baseDis;
    }

    /**炮台配置 */
    private onTroopsInfo(data: GS_TroopsInfo) {
        if (data.btstate == 0) {
            this._troopsLevelDic = {};
            this._troopsDic = {};
        }
        if (data.infolist && data.infolist.length > 0) {
            data.infolist.forEach(element => {
                this._troopsDic[element.ntroopsid] = element;
            });
        }
        this._troopsInfo = data;
        this._allTowerStarPageData = [];
        if (data.btstate == 2) {
            let pageData = [];
            for (const key in this._troopsDic) {
                if (Object.prototype.hasOwnProperty.call(this._troopsDic, key)) {
                    const element = this._troopsDic[key];
                    pageData[element.bttype - 1] = pageData[element.bttype - 1] || [];
                    pageData[element.bttype - 1].push(element);
                    this._allTowerStarPageData.push(element);

                }
            }
            pageData.forEach((element) => {
                element.sort((element1, element2) => {
                    return element1.btquality - element2.btquality;
                });
            });
            this._towerStarPageData = pageData;

            if (GlobalVal.hideSuperTower) this._towerStarPageData.splice(Towertype.SUPER - 1, 1);

            cc.log("炮塔配置", data);

            this._isTroopInfoInit = true;
            this.refreshCanactiveRedPoints();
            this.refreshCanupRedPoints();
            this._isTroopsListDataInit && (GameEvent.emit(EventEnum.TOWER_DATA_INIT));
            GameEvent.emit(EventEnum.MODULE_INIT, GS_PLAZA_MSGID.GS_PLAZA_MSGID_TROOPS);
        }

    }

    /**炮台解锁的个人数据 */
    private onTroopsListData(data: GS_TroopsListData) {
        cc.log("炮台解锁的个人数据", data);
        this._activelist = [];
        this._activeDic = {};
        this._fightDic = {};
        this._activelist = data.activelist;
        this._activelist.sort(this.sortTroops);

        data.activelist.forEach(element => {
            this._activeDic[element.ntroopsid] = element;

            if (element.btuse == 1) {
                let item: GS_TroopsInfo_TroopsInfoItem = this.getTroopBaseInfo(element.ntroopsid);
                this._fightDic[item.bttype] = element.ntroopsid;
            }
        });

        this._isTroopsListDataInit = true;
        this.sortAllData();
        this.initAllTowerScience();
        this.refreshCanactiveRedPoints();
        this.refreshCanupRedPoints();
        this._isTroopInfoInit && (GameEvent.emit(EventEnum.TOWER_DATA_INIT));
    }

    /**解锁新炮塔 */
    private onTroopsAddNew(data: GS_TroopsAddNew) {
        Debug.log("炮塔：", "解锁新炮塔", data);
        let item: GS_TroopsListData_ActiveTroopsItem = new GS_TroopsListData_ActiveTroopsItem();
        item.ntroopsid = data.ntroopsid;
        item.nstarlevel = 1;
        item.btuse = data.btuse;
        let infoItem: GS_TroopsInfo_TroopsInfoItem = this.getTroopBaseInfo(data.ntroopsid);
        if (data.btuse == 1) {
            this._fightDic[infoItem.bttype] = data.ntroopsid;
        } else if (infoItem.btquality > 0 && this._guideActiveTowerID == 0) {
            this._guideActiveTowerID = infoItem.ntroopsid;
        }
        this._activelist.push(item);
        this._activelist.sort(this.sortTroops);
        this._activeDic[data.ntroopsid] = item;

        if (this._guideActiveTowerID == 0) {
            this._guideActiveTowerID = item.ntroopsid;
        }

        //超能猫是自动激活的，没有增加红点，所以不需要减少红点
        if (!(data.ntroopsid >= 801 && data.ntroopsid <= 804)) {
            GameEvent.emit("yongbing-" + data.ntroopsid, -1);
        }

        this.sortAllData();
        GameEvent.emit(EventEnum.UNLOCK_NEW_TOWER, data.ntroopsid);

        //显示新炮塔界面
        UiManager.showDialog(EResPath.TOWER_STAR_NEW_CARDS_VIEW, data.ntroopsid);

        //假如
        if (this._fightDic[infoItem.bttype] == 0 || !this._fightDic[infoItem.bttype]) {
            this.requestActive(data.ntroopsid);
        }

        if (infoItem) {
            this.biPost(MISSION_TYPE.ACTIVE_TOWER, MISSION_LEVEL.NORMAL, MISSION_NAME.ACTIVE_TOWER, infoItem.szname);
        }

        let towerCfg = this._troopsDic[data.ntroopsid];
        this._newActiveTowerMap.set(towerCfg.btquality, true);
        this.initOneTowerScience(data.ntroopsid , 1 , true);
        this.refreshBookRedpoint();
    }

    /**升级返回 */
    private onTroopsUpgrade(data: GS_TroopsRetUpGradeStar) {
        let item = this._activeDic[data.ntroopsid];
        if (item) {
            item.nstarlevel = data.nstarlevel;
        }
        this.initOneTowerScience(data.ntroopsid , data.nstarlevel , true);
        GameEvent.emit(EventEnum.UP_STAR_SUCC, data);
        let towerCfg: GS_TroopsInfo_TroopsInfoItem = this._troopsDic[data.ntroopsid];
        if (towerCfg) {
            this.biPost(MISSION_TYPE.UPGRADE_TOWER, MISSION_LEVEL.NORMAL, MISSION_NAME.UPGRADE_TOWER, towerCfg.szname + "_" + data.nstarlevel.toString() + "星");
            let maxCards = Game.towerMgr.getPrivateGoodsNums(towerCfg.ntroopsid);
            let currCards = Game.containerMgr.getItemCount(towerCfg.ncardgoodsid);
            let stars = Game.towerMgr.getStar(towerCfg.ntroopsid);
            if (stars >= this.getStarMax(towerCfg.btquality) || currCards < maxCards) {
                GameEvent.emit(EVENT_REDPOINT.YONGBING_CANACTIVE, -1);
            }
        }
    }

    

    //上报事件
    private biPost(mission_type: MISSION_TYPE, mission_level: MISSION_LEVEL, event_name: string, event_ID: string) {
        GameEvent.emit(EventEnum.CK_BI_REPORT_EVENT, mission_type, mission_level, event_name, event_ID);
    }

    /**操作提示 */
    private onTroopsTips(data: GS_TroopsTips) {
        cc.log("炮塔提示");
        if (data.bttype == 0) { //成功
            //SystemTipsMgr.instance.notice(data.szdes);
        }
        SystemTipsMgr.instance.notice(data.szdes);
    }

    /**出战返回 */
    private onRetActive(data: GS_TroopsRetActive) {
        cc.log("出战返回");
        if (data.ncanceltroopsid > 0) {
            let cancelItem = this._activeDic[data.ncanceltroopsid];
            if (cancelItem)
                cancelItem.btuse = 0;
        }

        let activeItem = this._activeDic[data.ntroopsid];
        if (activeItem) {
            activeItem.btuse = 1;
        }

        let infoItem: GS_TroopsInfo_TroopsInfoItem = this.getTroopBaseInfo(data.ntroopsid);
        this._fightDic[infoItem.bttype] = data.ntroopsid;
        this.sortAllData();
        GameEvent.emit(EventEnum.ACTIVATE_TOWER, data);
    }

    /**技能配置 */
    private onSkillInfo(data: GS_SkillInfo) {
        cc.log('技能配置：', data);
        data.infolist.forEach(element => {
            this._skillLevelDic[element.nskillid] = null;
            this._skillDic[element.nskillid] = element;
        });
    }

    /**
     * 获取所有激活的炮塔信息
     */
    public getAllUnlockTowerCfgs(): Array<any> {
        return this._activelist;
    }

    private sortTroops(a: GS_TroopsListData_ActiveTroopsItem, b: GS_TroopsListData_ActiveTroopsItem): number {
        return a.ntroopsid - b.ntroopsid;
    }


    public getCardPicid(cardId: number): string {
        let infos = this._troopsInfo.infolist;
        if (infos) {
            for (let i = 0; i < infos.length; i++) {
                if (cardId === infos[i].ncardgoodsid) {
                    return infos[i].sz3dpicres;
                }
            }
        }
        return null;
    }

    /**
     * 获取所有出战炮塔可以升星数量
     */
    public getCanupTowerNums(ids: number[]): number {
        let num = 0;
        if (ids) {
            for (let v of ids) {
                if (this.isTowerCanUpStar(v)) {
                    num++;
                }
            }
        }
        return num;
    }

    public isTowerCanUpStar(id: number): boolean {
        let energy = Game.containerMgr.getItemCount(Game.towerMgr.getSharegoodsid());
        let towerCfg: GS_TroopsInfo_TroopsInfoItem = this._troopsDic[id];
        let maxCards = Game.towerMgr.getPrivateGoodsNums(towerCfg.ntroopsid);
        let currCards = Game.containerMgr.getItemCount(towerCfg.ncardgoodsid);
        let stars = Game.towerMgr.getStar(towerCfg.ntroopsid);
        let costEnergy = Game.towerMgr.getShareGoodsNums(towerCfg.ntroopsid);
        if (stars < this.getStarMax(towerCfg.btquality) && currCards >= maxCards && costEnergy <= energy) {
            return true;
        }
        return false;
    }

    /**
     * 获取出战炮塔第一个可升星炮塔下标
     */
    public getFightCanupTowerIndex(ids: number[]): number {
        let troopid = this.calcCanActiveTower();
        if (troopid != -1) {
            return this.getTroopBaseInfo(troopid).bttype - 1;
        }
        let index = 0;
        for (let v of ids) {
            if (this.isTowerCanUpStar(v)) {
                index = this.getTroopBaseInfo(v).bttype - 1;
                break;
            }
        }
        return index;
    }

    /**
     * 获取出战炮塔第一个可升星炮塔下标
     */
    getFightCanupTower(ids: number[]): GS_TroopsInfo_TroopsInfoItem {

        for (let v of ids) {
            if (this.isTowerCanUpStar(v)) {
                let tower: GS_TroopsInfo_TroopsInfoItem = this.getTroopBaseInfo(v);
                if (tower) {
                    return tower;
                }

            }
        }

        return null;
    }


    getFirstCanupTower(): GS_TroopsInfo_TroopsInfoItem {
        let troopid = this.calcCanActiveTower();
        if (troopid != -1) {
            return this.getTroopBaseInfo(troopid);
        }
        return null;
    }

    public getFightTowers(): number[] {
        let ids = [];
        for (let k in this._fightDic) {
            ids.push(this._fightDic[k]);
        }
        return ids;
    }

    public isTroopInfoInit(): boolean {
        return this._isTroopInfoInit && this._isTroopsListDataInit;
    }

    /**
     * 能否解锁炮塔
     * @param troopid 
     */
    public enableUnlock(troopid: number): boolean {
        let currCards = Game.containerMgr.getItemCount(troopid);
        return !this.isTowerUnlock(troopid) && currCards >= this._troopsDic[troopid].nactiveneedcardcount;
    }

    /**
     * 获取炮塔字典
     */
    public getTroopDir(): any {
        return this._troopsDic;
    }

    ///////////////////////////////////////////////////////////////equip
    ///////////////////////////////////////////////////////////////public 

    /**炮台装备升级 */
    reqUpgradeEquipLv(id: number) {
        let data: GS_TroopsUpEquipLv = new GS_TroopsUpEquipLv();
        data.nid = id;
        this.send(GS_PLAZA_TROOPS_MSG.PLAZA_TROOPS_UPGRADEEQUIPLV, data);
    }

    /**获取一个装备配置 */
    getEquipItem(id: number): GS_TroopsEquipInfo_EquipItem {
        return this._equipItemDic[id];
    }

    /**获取个人某一装备的数据 */
    getEquipData(id: number): GS_TroopsEquipData_ActiveEquipItem {
        return this._equipDataDic[id];
    }

    /**装备是否激活 */
    checkEquipActive(id: number): boolean {
        return this._equipDataDic[id] ? true : false;
    }

    /**获取装备加的属性值 */
    getEquipAddProp(nequipid: number): number {
        let activeItem: GS_TroopsEquipData_ActiveEquipItem = this._equipDataDic[nequipid];
        return activeItem ? activeItem.naddprop / 10000 : 0;
    }

    /**获取所有装备数据 */
    getEquipDataDic(): { [key: string]: GS_TroopsEquipData_ActiveEquipItem } {
        return this._equipDataDic;
    }



    ////////////////////////////////////////////////////////////////private
    private _equipItemDic: { [key: string]: GS_TroopsEquipInfo_EquipItem };
    private _equipDataDic: { [key: string]: GS_TroopsEquipData_ActiveEquipItem };

    /**装备配置 */
    private onEquipInfo(data: GS_TroopsEquipInfo) {
        Debug.log(TOWER_TAG, "装备配置", data);
        if (data.btstate == 0 || !this._equipItemDic) {
            this._equipItemDic = {};
        }

        if (data.uitemcount > 0) {
            data.infolist.forEach(element => {
                this._equipItemDic[element.nid] = element;
            });
        }

        if (data.btstate == 2) {
            GameEvent.emit(EventEnum.EQUIP_ITEM_DATA_END);
        }
    }

    /**个人装备数据 */
    private onEquipData(data: GS_TroopsEquipData) {
        Debug.log(TOWER_TAG, "个人装备数据", data);
        this._equipDataDic = {};
        if (data.uitemcount > 0) {
            data.activelist.forEach(element => {
                this._equipDataDic[element.nid] = element;
            });
        }

        GameEvent.emit(EventEnum.EQUIP_DATA);
    }

    /**下发更新炮台数据 */
    private onUpEquipData(data: GS_TroopsUpEquipData) {
        Debug.log(TOWER_TAG, "更新炮塔数据", data);
        this.refreshEquipData(data);
        GameEvent.emit(EventEnum.EQUIP_UPGRADE, data.nid);
    }

    /**炮台装备被激活 */
    private onActiveEquip(data: GS_TroopsActiveEquip) {
        this.refreshEquipData(data);

        let equioInfo = this.getEquipItem(data.nid);
        let goodsInfo = Game.goodsMgr.getGoodsInfo(equioInfo.nactivegoodsid);
        if (goodsInfo) {
            let towerInfo = this.getTroopBaseInfo(goodsInfo.lparam[0]);
            if (towerInfo) {
                let index = 0;
                let flag = false;
                while (!flag && index < 4) {
                    index++;
                    if (towerInfo['nequipid' + index] && towerInfo['nequipid' + index] == data.nid) {
                        flag = true;
                    }
                }
                UiManager.showTopDialog(EResPath.NEW_EQUIP_VIEW, { towerid: towerInfo.ntroopsid, equipIndex: index - 1, addProp: equioInfo.nlv1addprop / 100 });
            }

            this.biPost(MISSION_TYPE.ACTIVE_EQUIP, MISSION_LEVEL.NORMAL, MISSION_NAME.ACTIVE_EQUIP, goodsInfo.szgoodsname);
        }
        GameEvent.emit(EventEnum.EQUIP_ACTIVE, data.nid);
    }

    private onStarInfo(data: GS_TroopsStarInfo) {
        this._starData = data;
        this._starDataDic = {};
        if (this._starData.uupstaritemcount > 0) {
            let quality = -1;
            let item: GS_TroopsStarInfo_TroopUpStarItem;
            let preLevel: number = 1;

            for (let i = 0; i < this._starData.uupstaritemcount; i++) {
                item = this._starData.data2[i];
                if (item.btlevel == 1) {
                    quality++;
                    if (quality > 0) {
                        this._starLevelDic[quality - 1] = preLevel;
                    }
                }
                this._starDataDic[this.getStarIndex(quality, item.btlevel)] = item;
                preLevel = item.btlevel;
            }
            this._starLevelDic[quality] = preLevel;
        }

    }

    /**
     * 获取多余卡片转换信息
     * @param quality 
     * @returns 
     */
    public getCardConvertInfo(quality: number): GS_TroopsStarInfo_TroopsBase {
        if (this._starData && this._starData.data1) {
            quality = MathUtils.clamp(quality, 0, this._starData.data1.length - 1);
            return this._starData.data1[quality];
        }
        return null;
    }

    private onSwitchCard(data: GS_TroopsSwitchCard) {

    }

    // { [key: string]: GS_TroopsListData_ActiveTroopsItem; }
    private _sciencesDic:{ [key:string] : GS_TroopsStarExtraConfig_TroopsStarExtraLevel[][],}= {};
    private _sciencesNormalListDic:{ [key:string] : GS_TroopsStarExtraConfig_TroopsStarExtraLevel[] }= {};
    private _sciencesSpecailListDic:{ [key:string] : GS_TroopsStarExtraConfig_TroopsStarExtraLevel[][] }= {};
    private onExtraConfig(data:GS_TroopsStarExtraConfig) {
        console.log(data);
        this._sciencesDic = {};
        this._sciencesNormalListDic = {};
        this._sciencesSpecailListDic = {};
        if (data.uitemcount > 0) {
            data.data.forEach(element => {
                let temp = this._sciencesDic[element.ntroopid] || [];
                let temp2 = this._sciencesNormalListDic[element.ntroopid] || [];
                let temp3 = this._sciencesSpecailListDic[element.ntroopid] || [];
                const len = element.slevels.length;
                let levelItem:GS_TroopsStarExtraConfig_TroopsStarExtraLevel;
                let tempDic = {};
                let tempDic2 = {};
                for (let i = 0 ; i < len ; i++) {
                    levelItem = element.slevels[i];
                    let tempArray = tempDic[levelItem.nstrengthid] || [];
                    tempArray.push(levelItem);

                    tempDic[levelItem.nstrengthid] = tempArray;

                    if (tempArray.length == 1) {
                        temp.push(tempArray);
                    }

                    if (levelItem.btspecaillevel == 1) {
                        const index = tempDic2[levelItem.nstrengthid] || temp3.length + 1;
                        const arr = temp3[index - 1] || [];
                        arr.push(levelItem);
                        temp3[index - 1] = arr;
                        tempDic2[levelItem.nstrengthid] = index;

                    } 
                    temp2.push(levelItem);
                    
                }
                this._sciencesDic[element.ntroopid] = temp;
                this._sciencesNormalListDic[element.ntroopid] = temp2;
                this._sciencesSpecailListDic[element.ntroopid] = temp3;
            });
            console.log('this._sciencesDic:' , this._sciencesDic);
        }
        this.initAllTowerScience();
    }

    getTowerScienceNormals(troopsId):GS_TroopsStarExtraConfig_TroopsStarExtraLevel[] {
        return this._sciencesNormalListDic[troopsId];
    }

    getTowerScienceSpecail(troopsId):GS_TroopsStarExtraConfig_TroopsStarExtraLevel[][] {
        return this._sciencesSpecailListDic[troopsId];
    }

    private _activeScienceDic:{ [key:string] : GS_TroopsStarExtraConfig_TroopsStarExtraLevel[] } = {};

    private initAllTowerScience() {
        const list = Object.values(this._activeDic);
        this._activeScienceDic = {};
        if (list && list.length > 0 ) {
            list.forEach(element => {
                this.initOneTowerScience(element.ntroopsid , element.nstarlevel , false);
            });
        }
    }

    private initOneTowerScience(troopsid:number , level:number , emitEvt = true) {
        this._activeScienceDic[troopsid] = [];
        const levelItems:GS_TroopsStarExtraConfig_TroopsStarExtraLevel[][] = this._sciencesDic[troopsid];
        if (levelItems) {
            const len2 = levelItems.length;
            for (let i = 0 ; i < len2 ; i++) {
                const tempArray:GS_TroopsStarExtraConfig_TroopsStarExtraLevel[] = levelItems[i];
                if (tempArray) {
                    const len = tempArray.length;
                    for (let j = len - 1 ; j >= 0 ; j--) {
                        if (tempArray[j].ntrooplevel <= level) {
                            this._activeScienceDic[troopsid].push(tempArray[j]);
                            break;
                        }
                    }
                }
            }
        }
        Game.strengMgr.initTowerSciencePro(troopsid , this._activeScienceDic[troopsid] , emitEvt);
    }

    getTowerScience(troopsid:number , level:number ):GS_TroopsStarExtraConfig_TroopsStarExtraLevel[] {
        let datas:GS_TroopsStarExtraConfig_TroopsStarExtraLevel[] = [];
        const levelItems:GS_TroopsStarExtraConfig_TroopsStarExtraLevel[][] = this._sciencesDic[troopsid];
        if (levelItems) {
            const len2 = levelItems.length;
            for (let i = 0 ; i < len2 ; i++) {
                const tempArray:GS_TroopsStarExtraConfig_TroopsStarExtraLevel[] = levelItems[i];
                if (tempArray) {
                    const len = tempArray.length;
                    for (let j = len - 1 ; j >= 0 ; j--) {
                        if (tempArray[j].ntrooplevel <= level) {
                            datas.push(tempArray[j]);
                            break;
                        }
                    }
                }
            }
        }
        return datas;
    }

    private STAR_FLAG: number = 1000;
    private getStarIndex(quality: number, level: number) {
        return (quality * this.STAR_FLAG) + level;
    }

    private refreshEquipData(data: GS_TroopsUpEquipData | GS_TroopsActiveEquip) {
        let activeEquipItem: GS_TroopsEquipData_ActiveEquipItem = this.getEquipData(data.nid) || new GS_TroopsEquipData_ActiveEquipItem();
        activeEquipItem.nid = data.nid;
        activeEquipItem.nlv = data.nlv;
        activeEquipItem.naddprop = data.naddprop;
        activeEquipItem.nupneedgoodsid1 = data.nupneedgoodsid1;
        activeEquipItem.nupneedgoodsid2 = data.nupneedgoodsid2;
        activeEquipItem.nupneedgoodsnum1 = data.nupneedgoodsnum1;
        activeEquipItem.nupneedgoodsnum2 = data.nupneedgoodsnum2;
        activeEquipItem.nnextaddprop = data.nnextaddprop;
        this._equipDataDic[data.nid] = activeEquipItem;
    }

    public readConfig() {
        this._bookTowerCfg = Game.gameConfigMgr.getCfg(EResPath.BOOK_TOWER_CFG);
        this._bookWeaponCfg = Game.gameConfigMgr.getCfg(EResPath.BOOK_WEAPON_CFG);
    }

    /**
     * 获取炮塔生效科技
     * @param towerId 
     * @returns
     */
    public getBookTowerCfg(towerId: number): BookTowerCfg {
        return this._bookTowerCfg[towerId];
    }

    /**
     * 获取武器描述
     * @param weaponKey 
     * @returns
     */
    public getBookWeaponCfg(weaponKey: string): BookWeaponCfg {
        return this._bookWeaponCfg[weaponKey];
    }

    /**
     * 获取第一个可以购买的装备信息
     * @param towerId 
     * @returns 
     */
    public getFirstCanbuyEquipInfo(towerIds: number[]): number[] {
        if (Game.actorMgr.getProp(ActorProp.ACTOR_PROP_SOPRTSPOINT) > 3600) {
            for (const id of towerIds) {
                let towerInfo = this.getTroopBaseInfo(id);

                let equipId = (!this.getEquipData(towerInfo.nequipid1) && towerInfo.nequipid1) ||
                    (!this.getEquipData(towerInfo.nequipid2) && towerInfo.nequipid2) ||
                    (!this.getEquipData(towerInfo.nequipid3) && towerInfo.nequipid3);

                if (equipId) {
                    return [id, equipId];
                }
            }
        }
        return null;
    }

    private refreshBookRedpoint() {
        let node = Game.redPointSys.findRedPointNode(EVENT_REDPOINT.TUJIAN_NEWCAT);
        if (node) {
            node.setRedPointNum(this._newActiveTowerMap.size);
        }
    }

    private onSelectCatTab(index: number) {
        this._newActiveTowerMap.delete(index);
        this.refreshBookRedpoint();
    }

    public getNewCatMap() {
        return this._newActiveTowerMap;
    }

    public getTowerTypeDesCfg(towerType: number) {
        if (!this._towerTypeDes) {
            this._towerTypeDes = Game.gameConfigMgr.getCfg(EResPath.TOWER_TYPE_DES);
        }
        // let des = "";
        // if (this._towerTypeDes && this._towerTypeDes[towerType]) {
        //     des = this._towerTypeDes[towerType].des;
        // }
        return this._towerTypeDes && this._towerTypeDes[towerType];
    }

    public getNextOrPrevTower(troopsInfo:GS_TroopsInfo_TroopsInfoItem , isNext:boolean = true) {
        let index = this._allTowerStarPageData.indexOf(troopsInfo);
        index += isNext ? 1 : -1;
        index = (index + this._allTowerStarPageData.length) % this._allTowerStarPageData.length;
        return this._allTowerStarPageData[index];
    }

    private sortAllData() {
        this.sortData(this._allTowerStarPageData);
    }

    private sortData(datas:GS_TroopsInfo_TroopsInfoItem[]) {
        return datas.sort((a, b) => {
            const afight = Game.towerMgr.isTowerActive(a.ntroopsid);
            const bfight = Game.towerMgr.isTowerActive(b.ntroopsid);

            if (afight && !bfight) return -1;
            else if (!afight && bfight) return 1;

            const alock = Game.towerMgr.isTowerUnlock(a.ntroopsid);
            const block = Game.towerMgr.isTowerUnlock(b.ntroopsid);

            if (alock && !block) return -1;
            else if (!alock && block) return 1;

            if (a.btquality < b.btquality) return 1;
            else if (a.btquality > b.btquality) return -1;

            if (a.bttype != b.bttype) return a.bttype - b.bttype;
            if (a.ntroopsid != b.ntroopsid) return a.ntroopsid - b.ntroopsid;

            return 0;
        });
    }
}