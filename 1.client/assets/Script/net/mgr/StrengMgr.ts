import BaseNetHandler from "../socket/handler/BaseNetHandler";
import { CMD_ROOT, GOODS_ID, GS_PLAZA_MSGID, STATUS_TYPE, STRENG_TYPE } from "../socket/handler/MessageEnum";
import { GS_PLAZA_STRENG_MSG, GS_StrengConfig, GS_StrengData, GS_StrengRetActive, GS_StrengTips, GS_StrengRetUpLevel, GS_StrengUpLevel, GS_StrengActive, GS_StrengConfig_StrengItem, GS_StrengData_StrengData, GS_StrengConfig_LevelItem, GS_StrengReset, GS_StrengRetReset } from "../proto/DMSG_Plaza_Sub_Streng";
import { Handler } from "../../utils/Handler";
import SystemTipsMgr from "../../utils/SystemTipsMgr";
import Game from "../../Game";
import { EventEnum } from "../../common/EventEnum";
import { SciencePro } from "../../ui/science/SciencePro";
import { GS_TroopsInfo_TroopsInfoItem, GS_TroopsStarExtraConfig, GS_TroopsStarExtraConfig_TroopsStarExtraItem, GS_TroopsStarExtraConfig_TroopsStarExtraLevel } from "../proto/DMSG_Plaza_Sub_Troops";
import SysMgr from "../../common/SysMgr";
import { EVENT_REDPOINT } from "../../redPoint/RedPointSys";
import { BuryingPointMgr, EBuryingPoint } from "../../buryingPoint/BuryingPointMgr";
import { MISSION_LEVEL, MISSION_NAME, MISSION_TYPE } from "../../sdk/CKSdkEventListener";
import { TowerTypeName } from "../../common/AllEnum";
import { GameEvent } from "../../utils/GameEvent";

/**
 * 科技
 */
export class StrengMgr extends BaseNetHandler {

    private _strengConfigDic: { [key: string]: GS_StrengConfig_StrengItem; } = {};
    private _strengConfigListDic: { [key: string]: GS_StrengConfig_StrengItem[]; } = {};
    private _config: GS_StrengConfig = null;

    private _strengDataDic: { [key: string]: GS_StrengData_StrengData; } = {};
    private _strengDataTypeDic: { [key: string]: GS_StrengData_StrengData[]; } = {};
    private _data: GS_StrengData = null;
    private _scienceProDic: { [key: string]: SciencePro; } = {};
    private _countDic: any = {};
    private strengInitialized: boolean = false;
    constructor() {
        super(CMD_ROOT.CMDROOT_PLAZA_MSG, GS_PLAZA_MSGID.GS_PLAZA_MSGID_STRENG);

        this.initRedPoint();
    }

    register() {
        this.registerAnaysis(GS_PLAZA_STRENG_MSG.PLAZA_STRENG_CONFIG, Handler.create(this.onStrengConfig, this), GS_StrengConfig);
        this.registerAnaysis(GS_PLAZA_STRENG_MSG.PLAZA_STRENG_DATA, Handler.create(this.onStrengData, this), GS_StrengData);
        this.registerAnaysis(GS_PLAZA_STRENG_MSG.PLAZA_STRENG_RETUPLEVEL, Handler.create(this.onStrengRetUpLevel, this), GS_StrengRetUpLevel);
        this.registerAnaysis(GS_PLAZA_STRENG_MSG.PLAZA_STRENG_RETACTIVE, Handler.create(this.onStrengRetActive, this), GS_StrengRetActive);
        this.registerAnaysis(GS_PLAZA_STRENG_MSG.PLAZA_STRENG_TIPS, Handler.create(this.onStrengTips, this), GS_StrengTips);
        this.registerAnaysis(GS_PLAZA_STRENG_MSG.PLAZA_STRENG_RETRESET, Handler.create(this.onStrengRetReset, this), GS_StrengRetReset);
        GameEvent.on(EventEnum.ITEM_COUNT_CHANGE, this.onItemChange, this);
        GameEvent.on(EventEnum.UP_STAR_SUCC, this.onUpStarSucc, this);
    }

    protected onSocketError() {
        this.exitGame();
    }

    protected exitGame() {
        this._strengDataDic = {};
        this._strengDataTypeDic = {};
        this._data = null;
        this._scienceProDic = {};
        this._countDic = {};
        this.strengInitialized = false;
    }

    /**
     * 初始化科技红点
     */
    private initRedPoint() {
        //需要等待炮塔配置下发
        if (Game.towerMgr.isTroopInfoInit()) {
            this.onTroopInfoInit();
        } else {
            GameEvent.on(EventEnum.TOWER_DATA_INIT, this.onTroopInfoInit, this);
        }
    }

    private onTroopInfoInit() {
        //等待科技配置下发
        if (this.isStrengInit()) {
            this.onStrengInit();
        } else {
            GameEvent.once(EventEnum.ON_STRENTH_PRIVATEDATA, this.onStrengInit, this);
        }
    }

    private onStrengInit() {
        this.updateRedPoint();
    }


    private onItemChange(id: number, num: number, oldNum: number) {
        if (id !== GOODS_ID.LINGDANG) return;
        this.updateRedPoint();
    }

    private onUpStarSucc() {
        this.updateRedPoint();
    }

    private updateRedPoint() {
        // let num =0;
        let len = Object.keys(this._strengConfigListDic).length;
        for (let i = 1; i <= len; i++) {
            let num = this.getRedPointNumByType(i);
            let node = Game.redPointSys.findRedPointNode(EVENT_REDPOINT.SCIENCE + "-" + i);
            if (node) {
                node.setRedPointNum(num);
            }
        }
    }

    public isStrengInit(): boolean {
        return this.strengInitialized;
    }

    /**
     * 获取公共消耗物品
     */
    getUpgradeGoodsid(): number {
        return this._config ? 0 : 0;
    }

    /**
     * 重置消耗
     */
    getResetCost(): number {
        return this._config ? 0 : 0;
    }

    /**
     * 通过科技id获取一个科技配置
     * @param id 
     */
    getStrengItem(id: number): GS_StrengConfig_StrengItem {
        return this._strengConfigDic[id];
    }

    /**
     * 通过科技id获取一个科技数据
     * @param id 
     */
    getStrengData(id: number): GS_StrengData_StrengData {
        return this._strengDataDic[id];
    }

    /**获取所有科技数据 */
    getStrengDataDic(): { [key: string]: GS_StrengData_StrengData; } {
        return this._strengDataDic;
    }

    /**
     * 通过类型获取激活的科技数量
     * @param type 
     */
    getActivityCount(type: number): number {
        return this._countDic[type] || 0;
    }

    /**
     * 获取某类型下所有的科技配置
     * @param type 
     */
    getStrengItemList(type: number): GS_StrengConfig_StrengItem[] {
        return this._strengConfigListDic[type];
    }

    getStrengItemCount(type: number): number {
        let list = this.getStrengItemList(type);
        return list ? list.length : 0;
    }

    /**
     * 可否激活状态
     * @param id 
     * @param isDelete 
     */
    canActive(id: number): boolean {
        let cfg = this.getStrengItem(id);
        if (!cfg) return false;
        if (cfg["sortIndex"] == 1) return true;
        let m_preIsActive = this.preIsActive(cfg);
        let list = this.getStrengItemList(cfg.btrolecardtype);
        let index = list.indexOf(cfg);
        let needStarCount = 0;
        let curStarCount = Game.towerMgr.getTypeAllStar(cfg.btrolecardtype);

        return m_preIsActive && needStarCount <= curStarCount;
    }

    getActiveStarCount(index: number): number {
        if (this._config) {
            return 0;
        }
        return 0;
    }

    getActiveStarCountById(id: number): number {
        let cfg = this.getStrengItem(id);
        if (!cfg) return 0;
        let list = this.getStrengItemList(cfg.btrolecardtype);
        let index = list.indexOf(cfg);
        if (index == -1) return 0;
        return 0;
    }

    getTypeStr(type: number): string {
        return "被动特质"
    }

    /**
     * 能否升级科技
     * @param id 
     * @returns 
     */
    canUpStreng(id: number): boolean {
        let strengItem = this.getStrengItem(id);
        let scienceData = Game.strengMgr.getStrengData(id);
        let currLv = scienceData ? scienceData.nlevel : 0;
        let nextLevelData = Game.strengMgr.getLevelCfg(strengItem, currLv + 1);
        if (nextLevelData && Game.containerMgr.isEnough(Game.strengMgr.getUpgradeGoodsid(), nextLevelData.nupgradegoodsnums)) {
            //材料足够
            return true;
        }
        return false;
    }

    /**
     * 获取等级数据
     * @param item 
     * @param level 
     */
    getLevelCfg(item: GS_StrengConfig_StrengItem, level: number): GS_StrengConfig_LevelItem {
        return item['levelDic'][level];
    }

    /**
     * 获取激活所需星数
     * @param activeCount 
     */
    getStarCount(activeCount: number): number {
        return 0;
    }

    /**获取升级数值 */
    getEftValueStr(item: GS_StrengConfig_StrengItem, levelItem: GS_StrengConfig_LevelItem) {
        if (!item || !levelItem) return '';
        return this.getEftValueString(item, levelItem);
    }

    getScienceProData(troopsid: number): SciencePro {
        return this.getSciencePro(troopsid);
    }

    getBuildCoinRate(troopsid: number): number {
        return 1 - this.getScienceProData(troopsid).reduceGold;
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * 请求升级
     * @param id 科技id
     */
    reqUpLevel(id: number) {
        let data: GS_StrengUpLevel = new GS_StrengUpLevel();
        data.nid = id;
        this.send(GS_PLAZA_STRENG_MSG.PLAZA_STRENG_UPLEVEL, data);

    }

    /**
     * 请求激活
     * @param id 科技id
     */
    reqActive(id: number) {
        let data: GS_StrengActive = new GS_StrengActive();
        data.nid = id;
        this.send(GS_PLAZA_STRENG_MSG.PLAZA_STRENG_ACTIVE, data);
    }

    reqReset(type: number) {
        let data: GS_StrengReset = new GS_StrengReset();
        data.bttype = type;
        this.send(GS_PLAZA_STRENG_MSG.PLAZA_STRENG_RESET, data);
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /**
     * 科技配置
     * @param data 
     */
    private onStrengConfig(data: GS_StrengConfig) {
        cc.log("科技配置", data);
        this._config = data;
        // this._strengConfigListDic = {};
        if (this._config.uitemcount > 0) {
            this._config.strenglist.forEach(element => {
                this._strengConfigDic[element.nid] = element;
                element['levelDic'] = {};
                let levelDic = element['levelDic'];
                element.level.forEach(element2 => {
                    levelDic[element2.btlevel] = element2;
                });

                if (!this._strengConfigListDic[element.btrolecardtype]) {
                    this._strengConfigListDic[element.btrolecardtype] = [element];
                } else {
                    this._strengConfigListDic[element.btrolecardtype].push(element);
                }
            });
        }

        let list: GS_StrengConfig_StrengItem[];
        for (let i = 1; i <= 8; i++) {
            list = this._strengConfigListDic[i];
            if (list) {
                this.sortStrengItem(list);
            }
        }

        data.strenglist.sort((a: GS_StrengConfig_StrengItem, b: GS_StrengConfig_StrengItem): number => {
            return a.bttype - b.bttype;
        });
        GameEvent.emit(EventEnum.ON_STRENTH_INIT, data.nopenwarid);
        GameEvent.emit(EventEnum.MODULE_INIT, GS_PLAZA_MSGID.GS_PLAZA_MSGID_STRENG);
        cc.log("科技配置", this._strengConfigListDic);
    }

    /**
     * 科技个人数据
     * @param data 
     */
    private onStrengData(data: GS_StrengData) {
        cc.log("科技个人数据", data);
        this._data = data;
        this._countDic = {};


        if (this._data.uitemcount > 0) {
            this._data.strengdatalist.forEach(element => {
                this.insterStrengData(element);
            });
        }


        /*
        //test data
        Object.values(this._strengConfigListDic).forEach((v:GS_StrengConfig_StrengItem[]) => {
            v.forEach(element => {
                let testData:GS_StrengData_StrengData = new GS_StrengData_StrengData();
                testData.nid = element.nid;
                testData.nlevel = 1;
                this.insterStrengData(testData);
            });
        })
        */
        this.strengInitialized = true;
        GameEvent.emit(EventEnum.ON_STRENTH_PRIVATEDATA);
        SysMgr.instance.doOnce(new Handler(this.calcAllPro, this), 2000);
    }

    private insterStrengData(element: GS_StrengData_StrengData) {
        this._strengDataDic[element.nid] = element;
        let item = this.getStrengItem(element.nid);
        if (item) {
            if (!this._countDic[item.btrolecardtype]) {
                this._countDic[item.btrolecardtype] = 1;
            } else {
                this._countDic[item.btrolecardtype]++;
            }

            let list = this._strengDataTypeDic[item.btrolecardtype] || [];
            list.push(element);
            this._strengDataTypeDic[item.btrolecardtype] = list;
        }
    }

    /**
     * 激活返回
     * @param data 
     */
    private onStrengRetActive(data: GS_StrengRetActive) {
        cc.log("激活返回", data);
        let strengData: GS_StrengData_StrengData = new GS_StrengData_StrengData();
        strengData.nid = data.nid;
        strengData.nlevel = data.nlevel;

        this.insterStrengData(strengData);

        let item: GS_StrengConfig_StrengItem = this.getStrengItem(data.nid);
        this.calcTypePro(item.btrolecardtype);

        this.updateRedPoint();
        this.refreshSciencePower();
        GameEvent.emit(EventEnum.SCIENCE_UPGRADE, data.nid, data.nlevel, item.btrolecardtype);

        if (item) {
            GameEvent.emit(EventEnum.CK_BI_REPORT_EVENT, MISSION_TYPE.ACTIVE_SCIENCE, MISSION_LEVEL.NORMAL, MISSION_NAME.ACTIVE_SCIENCE, item.szname);
        }
    }

    /**
     * 升级返回
     * @param data 
     */
    private onStrengRetUpLevel(data: GS_StrengRetUpLevel) {
        cc.log("升级返回", data);
        let strengData = this.getStrengData(data.nid);
        if (!strengData) {
            cc.log('科技升级出错了！');
            strengData = new GS_StrengData_StrengData();
            this._strengDataDic[data.nid] = strengData;
        }
        strengData.nid = data.nid;
        strengData.nlevel = data.nlevel;

        let item: GS_StrengConfig_StrengItem = this.getStrengItem(data.nid);
        this.calcTypePro(item.btrolecardtype);

        this.updateRedPoint();
        this.refreshSciencePower();
        GameEvent.emit(EventEnum.SCIENCE_UPGRADE, data.nid, data.nlevel, item.btrolecardtype);
        if (item) {
            GameEvent.emit(EventEnum.CK_BI_REPORT_EVENT, MISSION_TYPE.UPGRADE_SCIENCE, MISSION_LEVEL.NORMAL, MISSION_NAME.UPGRADE_SCIENCE, item.szname + "_" + data.nlevel + "级");
        }
    }

    /**
     * 提示
     * @param data 
     */
    private onStrengTips(data: GS_StrengTips) {
        cc.log("科技提示", data);
        if (data.bttype == 1) {
            SystemTipsMgr.instance.notice(data.szdes);
        }
    }

    private onStrengRetReset(data: GS_StrengRetReset) {
        cc.log("科技重置")
        let list = this.getStrengItemList(data.bttype);
        if (list) {
            let len = list.length;
            for (let i = 0; i < len; i++) {
                this._strengDataDic[list[i].nid] = null;
                delete this._strengDataDic[list[i].nid];
            }
        }
        this._countDic[data.bttype] = 0;
        this._strengDataTypeDic[data.bttype] = null;
        delete this._strengDataTypeDic[data.bttype];
        this.resetTypePro(data.bttype);

        this.updateRedPoint();//更新红点
        GameEvent.emit(EventEnum.SCIENCE_RESET, data.bttype);
        BuryingPointMgr.post(EBuryingPoint.SCIENCE_RESET);
        GameEvent.emit(EventEnum.CK_BI_REPORT_EVENT, MISSION_TYPE.RESET_SCIENCE, MISSION_LEVEL.NORMAL, MISSION_NAME.RESET_SCIENCE, TowerTypeName[data.bttype]);
    }

    /////////////////////////////////////////////////////////////////////////////////////////
    private getEftValueString(item: GS_StrengConfig_StrengItem, levelItem: GS_StrengConfig_LevelItem): string {
        let value = levelItem.nvalue;
        switch (item.bttype) {
            case STRENG_TYPE.STRENGTYPE_ADDNEWSTATUS:
                let buffCfg = Game.skillMgr.getBuff(item.nparams[0]);
                let buffLevel = levelItem.nvalue;
                if (buffCfg) {
                    if (buffCfg.bttype == STATUS_TYPE.STATUS_ADDDROPMONEY) {
                        value = Math.ceil((Game.skillMgr.getBuffEftValue(buffCfg, buffLevel) - 1) * 10000);
                    } else {
                        value = Game.skillMgr.getBuffEftValue(buffCfg, buffLevel);
                    }
                }
                break;
            case STRENG_TYPE.STRENGTYPE_MODSTATUSTIME:
                return Math.abs(value / 1000) + '秒';
                break;
            case STRENG_TYPE.STRENGTYPE_MODSTATUSVALUE:
                if (item.btrolecardtype == 7) {
                    return value.toString();
                }
                break;
            case STRENG_TYPE.STRENGTYPE_STATUSSWITCH:
                let buffCfg2 = Game.skillMgr.getBuff(item.nparams[2]);
                let buffLevel2 = levelItem.nvalue;
                if (buffCfg2) {
                    return Math.abs(Game.skillMgr.getBuffTime(buffCfg2, buffLevel2) / 1000) + '秒';
                }

                break;
            case STRENG_TYPE.STRENGTYPE_STATUSVALUEADD:
                return levelItem.nvalue.toString();
                break;
            case STRENG_TYPE.STRENGTYPE_ADDSKILL2_TIME:
                if (value < 0) {
                    value += 10000;
                }
                break;

            default:
                break;
        }


        return Math.floor(value / 100) + "%";
    }

    getEftSuffixString(bttype: number): string {
        if (bttype == STRENG_TYPE.STRENGTYPE_MODSTATUSTIME || bttype == STRENG_TYPE.STRENGTYPE_STATUSSWITCH) {
            return "秒";
        }

        if (bttype == STRENG_TYPE.STRENGTYPE_STATUSVALUEADD) {
            return "";
        }
        return "%";
    }

    private sortStrengItem(list: GS_StrengConfig_StrengItem[]) {
        let dic: any = {};
        list.sort((a: GS_StrengConfig_StrengItem, b: GS_StrengConfig_StrengItem): number => {
            return a.nid - b.nid;
        })
    }

    private setSortIndex(list: GS_StrengConfig_StrengItem[], preID: number, index: number, dic: any) {
        let len = list.length;
        let item: GS_StrengConfig_StrengItem;
        for (let i = 0; i < len; i++) {
            item = list[i];
            if (item['sortIndex']) {
                continue;
            }
            if (item.nfrontstrengid[0] == preID) {
                item['sortIndex'] = dic[preID] ? index * dic[preID] * 10 : index;
                if (!dic[preID]) {
                    dic[preID] = 1;
                } else {
                    dic[preID]++;
                }
                this.setSortIndex(list, item.nid, item['sortIndex'] + 1, dic);
            }
        }
    }


    // private calcActiveState(id: number): number {
    //     let scienceData: GS_StrengData_StrengData = this.getStrengData(id);
    //     let flag = 0;
    //     let tipInfo;
    //     if (scienceData) {
    //         flag = 1;
    //         tipInfo = "已激活";
    //     }

    //     let cfg: GS_StrengConfig_StrengItem = this.getStrengItem(id);
    //     if (flag == 0) {
    //         if (!cfg) {
    //             flag = 2;
    //             tipInfo = "科技id 错误";
    //         }
    //     }

    //     if (flag == 0) {
    //         if (!this.preIsActive(cfg)) {
    //             flag = 3;
    //             tipInfo = "前置科技尚未激活";
    //         }
    //     }

    //     let count = this.getActivityCount(cfg.btrolecardtype);
    //     if (count >= 5) {
    //         flag = 6;
    //         tipInfo = "激活数量达到上限";
    //     }

    //     if (flag == 0) {
    //         let needStarCount = this.getStarCount(count + 1);
    //         let curStarCount = Game.towerMgr.getTypeAllStar(cfg.btrolecardtype);
    //         if (curStarCount < needStarCount) {
    //             flag = 4;
    //             tipInfo = "星级不足";
    //         }
    //     }

    //     if (flag == 0) {
    //         let levelCfg = this.getLevelCfg(cfg, 1);

    //         if (!Game.containerMgr.isEnough(this._config.nupgradegoodsid, levelCfg.nupgradegoodsnums, false)) {
    //             flag = 5;
    //         }
    //     }

    //     return flag;
    // }

    private preIsActive(item: GS_StrengConfig_StrengItem): boolean {
        let id: number = 0;
        let len = item.nfrontstrengid.length;
        let flag = true;
        for (let i = 0; i < len; i++) {
            id = item.nfrontstrengid[i];
            if (id > 0) {
                if (this.getStrengData(id)) {
                    return true;
                }
                flag = false;
            }
        }
        return flag;
    }

    private calcAllPro() {
        Object.keys(this._strengDataTypeDic).forEach((element: string) => {
            this.calcTypePro(Number(element));
        })

        this.refreshSciencePower();
    }

    private calcTypePro(type: number) {
        return;
        let strengDataList: GS_StrengData_StrengData[] = this._strengDataTypeDic[type];
        if (!strengDataList || strengDataList.length <= 0) return;
        let troopList: GS_TroopsInfo_TroopsInfoItem[] = Game.towerMgr.getTowerInfoListByType(type - 1);
        if (!troopList) return;
        troopList.forEach(element => {
            let pro: SciencePro = this.getSciencePro(element.ntroopsid);
            pro.init(element.ntroopsid, strengDataList);
        });
    }

    private resetTypePro(type: number) {
        return;
        let strengDataList: GS_StrengData_StrengData[] = this._strengDataTypeDic[type];
        let troopList: GS_TroopsInfo_TroopsInfoItem[] = Game.towerMgr.getTowerInfoListByType(type - 1);
        if (!troopList) return;
        troopList.forEach(element => {
            let pro: SciencePro = this.getSciencePro(element.ntroopsid);
            pro.init(element.ntroopsid, strengDataList);
        });

        this.refreshSciencePower();
    }


    initTowerSciencePro(troopsid:number , troopsStarExtraConfigs:GS_TroopsStarExtraConfig_TroopsStarExtraLevel[] , emitEvt:boolean = true) {
        const len = troopsStarExtraConfigs.length;
        let strengDataList: GS_StrengData_StrengData[] = [];
        for (let i = 0; i < len; i++) {
            let cfg = troopsStarExtraConfigs[i];
            if (cfg.nstrengthid > 0) {
                let item = new GS_StrengData_StrengData();
                item.nid = cfg.nstrengthid;
                item.nlevel = cfg.nlevel;
                strengDataList.push(item);
            }
        }
        let pro: SciencePro = this.getSciencePro(troopsid);
        pro.init(troopsid, strengDataList);

        if (emitEvt) {
            this.refreshSciencePower();
        }
    }


    private getSciencePro(troopid: number): SciencePro {
        let pro: SciencePro = this._scienceProDic[troopid];
        if (!pro) {
            pro = new SciencePro();
            this._scienceProDic[troopid] = pro;
        }
        return pro;
    }

    private refreshSciencePower() {
        GameEvent.emit(EventEnum.REFRESH_POWER);
    }

    /**
     * 获取科技开启的关卡数
     */
    public getOpenWarId(): number {
        return this._config.nopenwarid;
    }

    /**
     * 获取可升级，可激活科技的数量
     */
    private getRedPointNumByType(type: number): number {
        let num = 0;
        let items = this._strengConfigListDic[type];
        let itemData: GS_StrengConfig_StrengItem = null;
        for (let j = 0, len = items.length; j < len; j++) {
            itemData = items[j];
            //科技满级
            // let scienceData = Game.strengMgr.getStrengData(itemData.nid);
            // let currLv = scienceData ? scienceData.nlevel : 0;
            if (Game.strengMgr.canActive(itemData.nid) && this.canUpStreng(itemData.nid)) {
                num++;
            }
        }
        // cc.log("科技红点数量", num);
        return num;
    }

    /**
     * 某系猫咪是否存在可激活或可升级的科技
     * @param type 
     */
    public canActiveOrUpStreng(type: number): number {
        let items = this._strengConfigListDic[type];
        let itemData: GS_StrengConfig_StrengItem = null;
        for (let j = 0, len = items.length; j < len; j++) {
            itemData = items[j];
            if (Game.strengMgr.canActive(itemData.nid) && this.canUpStreng(itemData.nid)) {
                return itemData.nid;
            }
        }
        return 0;
    }
}
