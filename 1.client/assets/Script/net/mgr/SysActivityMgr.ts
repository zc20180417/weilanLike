
import { BuryingPointMgr, EBuryingPoint } from "../../buryingPoint/BuryingPointMgr";
import { EResPath } from "../../common/EResPath";
import { EventEnum } from "../../common/EventEnum";
import SysMgr from "../../common/SysMgr";
import Debug from "../../debug";
import Game from "../../Game";
import GlobalVal, { ServerType } from "../../GlobalVal";
import { TimerItem } from "../../libs/timer/Timer";
import { EVENT_REDPOINT } from "../../redPoint/RedPointSys";
import { GameEvent } from "../../utils/GameEvent";
import { Handler } from "../../utils/Handler";
import Utils from "../../utils/Utils";
import { GS_PLAZA_SYSACTIVITY_MSG, GS_SysActivityClose, GS_SysActivityConfig, GS_SysActivityConfig_SysActivityItem, GS_SysActivityConfig_SysActivityTaskItem, GS_SysActivityFVOrder, GS_SysActivityGetReward, GS_SysActivityJoin, GS_SysActivityNew, GS_SysActivityNew_SysActivityNewTaskItem, GS_SysActivityOrder, GS_SysActivityPrivate, GS_SysActivityPrivate_SysActivityData, GS_SysActivityRef, GS_SysactivityReset, GS_SysActivityUpData } from "../proto/DMSG_Plaza_Sub_SysActivity";
import BaseNetHandler from "../socket/handler/BaseNetHandler";
import { ACTIVE_TYPE, CMD_ROOT, GOODS_TYPE, GS_PLAZA_MSGID, SYSACTIVITY_FALG } from "../socket/handler/MessageEnum";

export interface ActiveInfo {
    item: GS_SysActivityConfig_SysActivityItem;
    taskList: GS_SysActivityNew_SysActivityNewTaskItem[];
}

const ACTIVE_TAG = "活动：";

export class SysActivityMgr extends BaseNetHandler {

    private _sysActivityInfoItem: { [key: string]: any } = {};
    private _sysActivityInfoList: any[] = [];

    private _privateData: GS_SysActivityPrivate;
    private _privateDataMap: Map<number, GS_SysActivityPrivate_SysActivityData> = null;
    private _curJoinActivityId: number = 0;
    //private _sysActivityInfoTask:{[key:string] : GS_SysActivityConfig_SysActivityTaskItem} = {};
    private _isActiveInfoInit: boolean = false;
    private _isPrivateDataInit: boolean = false;
    private _doubleRechargeStart: string = "2021-7-1";
    private _doubleRechargeEnd: string = "2021-8-1";
    private _localActiveCfg: any = null;

    constructor() {
        super(CMD_ROOT.CMDROOT_PLAZA_MSG, GS_PLAZA_MSGID.GS_PLAZA_MSGID_SYSACTIVITY);
    }

    register() {
        this.registerAnaysis(GS_PLAZA_SYSACTIVITY_MSG.PLAZA_SYSACTIVITY_CONFIG, Handler.create(this.onSysActivityConfig, this), GS_SysActivityConfig);
        this.registerAnaysis(GS_PLAZA_SYSACTIVITY_MSG.PLAZA_SYSACTIVITY_PRIVATE, Handler.create(this.onSysActivityPrivate, this), GS_SysActivityPrivate);
        this.registerAnaysis(GS_PLAZA_SYSACTIVITY_MSG.PLAZA_SYSACTIVITY_NEW, Handler.create(this.onSysActivityNew, this), GS_SysActivityNew);
        this.registerAnaysis(GS_PLAZA_SYSACTIVITY_MSG.PLAZA_SYSACTIVITY_CLOSE, Handler.create(this.onSysActivityClose, this), GS_SysActivityClose);
        this.registerAnaysis(GS_PLAZA_SYSACTIVITY_MSG.PLAZA_SYSACTIVITY_ORDER, Handler.create(this.onSysActivityOrder, this), GS_SysActivityOrder);
        this.registerAnaysis(GS_PLAZA_SYSACTIVITY_MSG.PLAZA_SYSACTIVITY_FVORDER, Handler.create(this.onSysActivityFVOrder, this), GS_SysActivityFVOrder);
        this.registerAnaysis(GS_PLAZA_SYSACTIVITY_MSG.PLAZA_SYSACTIVITY_UPDATA, Handler.create(this.onSysActivityUpdata, this), GS_SysActivityUpData);
        GameEvent.on(EventEnum.ACROSS_DAY, this.refreshDoubleRechargeRedpoints, this);
    }

    init() {
        this.refreshDoubleRechargeRedpoints();
        this._localActiveCfg = Game.gameConfigMgr.getCfg(EResPath.LOCAL_ACTIVE_CFG);
    }

    protected onSocketError() {
        this.exitGame();
    }

    exitGame() {
        this._isActiveInfoInit = false;
        this._isPrivateDataInit = false;

        this._sysActivityInfoItem = null;
        this._sysActivityInfoList = null;

        this._privateData = null;
        this._privateDataMap = null;
        this._curJoinActivityId = 0;
    }

    private refreshRedPoint(nid: number = -1) {
        if (!this._isActiveInfoInit || !this._isPrivateDataInit) return;
        switch (nid) {
            case ACTIVE_TYPE.CONTINUE_RECHARGE:
                this.rpContinueRecharge();
                break;
            case ACTIVE_TYPE.WEEK_RECHARGE:
                this.rpWeekRecharge();
                break;
            case ACTIVE_TYPE.DAY_LOGIN:
                this.refreshDayLoginRedPoint();
                break;
            case ACTIVE_TYPE.ONLINE_TIME:
                this.refreshOnLineTime();
                break;
            case ACTIVE_TYPE.DAILY_GIFT:
                this.refreshDailyGiftRedPoint();
                break;
            case -1:
                this.rpContinueRecharge();
                this.rpWeekRecharge();
                this.refreshOnLineTime();
                this.refreshDayLoginRedPoint();
                this.refreshDailyGiftRedPoint();
                // this.rpLeishen();
                break;
            default:
                break;
        }
    }

    private rpWeekRecharge() {
        let redNum = 0;
        if (!Game.sysActivityMgr.isActivityFinished(ACTIVE_TYPE.WEEK_RECHARGE)) {
            let cfg = Game.sysActivityMgr.getActivityInfo(ACTIVE_TYPE.WEEK_RECHARGE);
            let privateData = Game.sysActivityMgr.getPrivateData(ACTIVE_TYPE.WEEK_RECHARGE);
            let taskList = cfg.taskList;

            if (taskList && taskList.length > 0 && cfg && privateData) {
                let len = taskList.length;
                for (let i = 0; i < len; i++) {
                    const element = taskList[i];
                    let flag = Utils.checkBitFlag(privateData.nflag, element.btindex);
                    if (!flag
                        && privateData.nmainprogress >= element.nparam1) {
                        redNum = 1;
                        break;
                    }
                }
            }
        }
        let redPoint = Game.redPointSys.findRedPointNode(EVENT_REDPOINT.WEEK_RECHARGE);
        if (redPoint) {
            redPoint.setRedPointNum(redNum);
        }
    }

    private rpContinueRecharge() {
        let redNum = 0;
        if (!Game.sysActivityMgr.isActivityFinished(ACTIVE_TYPE.CONTINUE_RECHARGE)) {

            let cfg = Game.sysActivityMgr.getActivityInfo(ACTIVE_TYPE.CONTINUE_RECHARGE);
            let privateData = Game.sysActivityMgr.getPrivateData(ACTIVE_TYPE.CONTINUE_RECHARGE);
            let taskList = cfg.taskList;

            if (taskList && taskList.length > 0 && cfg && privateData) {
                let len = taskList.length;
                for (let i = 0; i < len; i++) {
                    const element = taskList[i];
                    let flag = Utils.checkBitFlag(privateData.nflag, element.btindex);
                    if (!flag
                        && (privateData.nmainprogress > element.btindex
                            || (privateData.nmainprogress == element.btindex
                                && privateData.nsubprogress >= element.nparam1))
                    ) {
                        redNum = 1;
                        break;
                    }

                }
            }
        }

        let redPoint = Game.redPointSys.findRedPointNode(EVENT_REDPOINT.CONTINUE_RECHARGE);
        if (redPoint) {
            redPoint.setRedPointNum(redNum);
        }
    }

    /**
     * 参加活动
     * @param nid 活动ID
     * @param index 参与活动的具体某个任务（从0开始）
     * @param btMode 购买活动指定的完成方式（0：RMB 1：钻石）
     */
    public joinSysActivity(nid: number, index: number, btMode: number = 0) {
        let data: GS_SysActivityJoin = new GS_SysActivityJoin();
        data.nid = nid;
        data.btindex = index;
        data.btmode = btMode;
        this._curJoinActivityId = nid;
        this.send(GS_PLAZA_SYSACTIVITY_MSG.PLAZA_SYSACTIVITY_JOIN, data);
    }


    /**
     * 手动领取奖励（签到连登类活动需要）
     * @param nid 
     * @param index 
     */
    public getReward(nid: number, index: number) {
        let data = new GS_SysActivityGetReward();
        data.nid = nid;
        data.btindex = index;
        this.send(GS_PLAZA_SYSACTIVITY_MSG.PLAZA_SYSACTIVITY_GETREWARD, data);
    }

    //////////////////////////////////////////////// s---->c
    /**
     * 用户进行中的活动任务配置
     * @param data 
     */
    private onSysActivityConfig(data: GS_SysActivityConfig) {
        Debug.log(ACTIVE_TAG, "活动任务配置", data);
        this._sysActivityInfoItem = {};
        this._sysActivityInfoList = [];
        if (data.data1 && data.data1.length > 0) {
            let len = data.data1.length;
            let item: GS_SysActivityConfig_SysActivityItem;
            let obj;
            let taskList: GS_SysActivityConfig_SysActivityTaskItem[] = data.data2 ? data.data2.slice() : [];
            for (let i = 0; i < len; i++) {
                item = data.data1[i];
                obj = { item: item, taskList: item.bttaskcount > 0 ? taskList.splice(0, item.bttaskcount) : [] };
                this._sysActivityInfoItem[item.nid] = obj;
                this._sysActivityInfoList.push(obj);
            }
        }
        //购买特惠				nParam1:快充ID
        //充值赠送				nParam1:充值额度(元)	nParam2:赠送物品ID		nParam3:赠送物品数量
        //连登赠送				nParam1:连登次数		nParam2:赠送物品ID		nParam3:赠送物品数量
        //连签赠送				nParam1:签到次数		nParam2:赠送物品ID		nParam3:赠送物品数量
        //钻石消耗赠送			nParam1:消耗数量		nParam2:赠送物品ID		nParam3:赠送物品数量
        this._isActiveInfoInit = true;
        this.refreshRedPoint();
        if (this._isPrivateDataInit) {
            GameEvent.emit(EventEnum.ACTIVE_INIT);
        }
    }

    /**
     * 用户活动数据(用户的非全部完成的活动）
     * @param data 
     */
    private onSysActivityPrivate(data: GS_SysActivityPrivate) {
        Debug.log(ACTIVE_TAG, "用户活动数据", data);
        this._privateData = data;
        if (!this._privateDataMap) this._privateDataMap = new Map();
        if (data.data) {
            data.data.forEach(element => {
                this._privateDataMap.set(element.nid, element);
            });
        }
        this._isPrivateDataInit = true;
        this.refreshRedPoint();
        GameEvent.emit(EventEnum.ACTIVE_INIT);
    }

    /**
     * 激活新的活动
     * @param data 
     */
    private onSysActivityNew(data: GS_SysActivityNew) {
        Debug.log(ACTIVE_TAG, "激活新的活动", data);
        let activeIds = [];
        if (data.usysactivitycount) {
            let tasks = data.data2 || [];
            let startIndex = 0;
            for (let activeItem of data.data1) {
                let item: GS_SysActivityConfig_SysActivityItem = new GS_SysActivityConfig_SysActivityItem();
                Object.assign(item, activeItem);
                let taskList = tasks.slice(startIndex, startIndex + activeItem.bttaskcount);
                startIndex += activeItem.bttaskcount;

                let obj = { item: item, taskList: taskList };
                this._sysActivityInfoItem[item.nid] = obj;
                let index = -1;

                for (let i = 0, len = this._sysActivityInfoList.length; i < len; i++) {
                    if (this._sysActivityInfoList[i].item.nid == item.nid) {
                        index = i;
                        break;
                    }
                }

                if (index == -1) {
                    this._sysActivityInfoList.push(obj);
                } else {
                    this._sysActivityInfoList[index] = obj;
                }

                activeIds.push(item.nid);
            }
        }

        // this.refreshRedPoint();
        for (let v of activeIds) {
            GameEvent.emit(EventEnum.NEW_ACTIVE, v);
            this.refreshRedPoint(v);
        }


        // GameEvent.emit(EventEnum.NEW_ACTIVE, data.nid);
    }

    /**
     * 活动关闭(后台刷新关闭某个活动）
     * @param data 
     */
    private onSysActivityClose(data: GS_SysActivityClose) {
        Debug.log(ACTIVE_TAG, "活动关闭", data);
        // this._sysActivityInfoItem[data.nid] = null;
        // delete this._sysActivityInfoItem[data.nid];

        // let len = this._sysActivityInfoList.length;
        // for (let i = 0; i < len; i++) {
        //     if (this._sysActivityInfoList[i].item.nid == data.nid) {
        //         this._sysActivityInfoList.splice(i, 1);
        //         break;
        //     }
        // }
        // this._privateDataMap.delete(data.nid);
        let privateData = this._privateDataMap.get(data.nid);
        if (privateData) {
            privateData.nflag = SYSACTIVITY_FALG.CLOSE;
        }

        this.refreshRedPoint(data.nid);

        GameEvent.emit(EventEnum.ACTIVE_CLOSE, data.nid);
    }

    /**
     * 活动订充值单（充值类活动下发）
     * @param data 
     */
    private onSysActivityOrder(data: GS_SysActivityOrder) {
        Debug.log(ACTIVE_TAG, "活动充值定单", data);
        let buryingPoint: EBuryingPoint;
        switch (this._curJoinActivityId) {
            case ACTIVE_TYPE.DISCOUNT_SKIN:
                buryingPoint = EBuryingPoint.PAY_FASHION_ACTIVE;
                break;
            case ACTIVE_TYPE.GANGTIEXIA:
                buryingPoint = EBuryingPoint.PAY_AON_MAN;
                break;
            case ACTIVE_TYPE.DAILY_ZHADANREN:
                buryingPoint = EBuryingPoint.PAY_DAILY_ZHADANREN;
                break;
            case ACTIVE_TYPE.DAILY_LEISHEN:
                buryingPoint = EBuryingPoint.PAY_DAILY_LEISHEN;
                break;
            case ACTIVE_TYPE.DAILY_GANGTIEXIA:
                buryingPoint = EBuryingPoint.PAY_DAILY_GANGTIEXIA;
                break;

            default:
                break;
        }

        if (buryingPoint) {
            BuryingPointMgr.post(buryingPoint, JSON.stringify({ order: data.szorder }));
        }

        Game.mallProto.payOrder(data.szorder);
    }

    /**
     * 活动视频订单(签到类活动下发啊）
     * @param data 
     */
    private onSysActivityFVOrder(data: GS_SysActivityFVOrder) {
        Debug.log(ACTIVE_TAG, "活动视频订单", data);
        Game.nativeApi.showRewardAd(Game.actorMgr.nactordbid.toString(), data.szorder, data.szsdkkey);
    }

    /**
     * 更新某个活动的个人数据(客户端通过此数据处理某个活动是否全部完成）
     * @param data 
     */
    private onSysActivityUpdata(data: GS_SysActivityUpData) {
        Debug.log(ACTIVE_TAG, "更新活动的个人数据", data);
        let pirvateData: GS_SysActivityPrivate_SysActivityData = this._privateDataMap.get(data.nid);
        if (!pirvateData) {
            pirvateData = new GS_SysActivityPrivate_SysActivityData();
            this._privateDataMap.set(data.nid, pirvateData);
        }

        Object.assign(pirvateData, data);
        this.refreshRedPoint(data.nid);

        if (data.nid == ACTIVE_TYPE.DAY_LOGIN) {

            for (let i = 0; i < data.nmainprogress; i++) {
                if (!Utils.checkBitFlag(data.nflag, i)) {
                    this.getReward(ACTIVE_TYPE.DAY_LOGIN, i);
                }
            }

        }

        GameEvent.emit(EventEnum.UPDATE_ACTIVE_DATA, data.nid);
    }

    /**
     * 获取活动配置
     * @param nid 
     * @returns 
     */
    public getActivityInfo(nid: number): ActiveInfo {
        return this._sysActivityInfoItem ? this._sysActivityInfoItem[nid] : null;
    }

    getActivityListByClientParam(param:number):ActiveInfo[] {
        if (this._sysActivityInfoItem) {
            let list:ActiveInfo[] = [];
            for (const key in this._sysActivityInfoItem) {
                if (Object.prototype.hasOwnProperty.call(this._sysActivityInfoItem, key)) {
                    const element = this._sysActivityInfoItem[key];
                    if ((element as ActiveInfo).item.nclientparam == param) {

                        let chargeCfg = Game.actorMgr.getChargeConifg(element.taskList[0].nparam1);
                        if (chargeCfg) {
                            let goodInfo = Game.goodsMgr.getGoodsInfo(chargeCfg.ngoodsid);
                            if (goodInfo && (goodInfo.lgoodstype != GOODS_TYPE.GOODSTYPE_RES_SKIN || !Game.fashionMgr.getFashionData(goodInfo.lparam[1]))) {
                                list.push(element);
                            }
                        }

                    }
                }
            }

            // let len = list.length;
            // if (len > 0) {
            //     let element:ActiveInfo;
            //     for (let i = len - 1 ; i >= 0 ; i--) {
            //         element = list[i];
            //         if (!this.isSubTaskFinished(element.item.nid , 0)) {
            //             return element;
            //         }
            //     }

            return list;
            // }
        }
        return null;
    }

    public getActivityByClientParam(param:number):ActiveInfo {
        if (this._sysActivityInfoItem) {
            let list:ActiveInfo[] = [];
            for (const key in this._sysActivityInfoItem) {
                if (Object.prototype.hasOwnProperty.call(this._sysActivityInfoItem, key)) {
                    const element = this._sysActivityInfoItem[key];
                    if ((element as ActiveInfo).item.nclientparam == param) {
                        list.push(element);
                    }
                }
            }

            let len = list.length;
            if (len > 0) {
                let element:ActiveInfo;
                for (let i = len - 1 ; i >= 0 ; i--) {
                    element = list[i];
                    if (!this.isSubTaskFinished(element.item.nid , 0)) {
                        return element;
                    }
                }

                return list[len - 1];
            }
        }
        return null;
    }

    /**
     * 获取活动个人数据
     * @param nid 
     * @returns 
     */
    public getPrivateData(nid: number): GS_SysActivityPrivate_SysActivityData {
        return this._privateDataMap ? this._privateDataMap.get(nid) : null;
    }

    /**
     * 活动是否完成
     * @param nid 
     * @returns 
     */
    public isActivityFinished(nid: number): boolean {
        let cfg: ActiveInfo = this._sysActivityInfoItem && this._sysActivityInfoItem[nid];
        let privateData = this._privateDataMap && this._privateDataMap.get(nid);
        let outofDate: boolean = true;//活动是否结束
        // let subTaskFinished: boolean = true;

        if (cfg && privateData) {
            let endTime: number = cfg.item.nvalidtimes + privateData.nstarttimes;
            if (GlobalVal.getServerTime() * 0.001 < endTime || cfg.item.nvalidtimes == 0) {
                outofDate = false;
            }
            //判断子任务完成情况
            // for (let i = 0; i < cfg.taskList.length; i++) {
            //     if (!Utils.checkBitFlag(privateData.nflag, cfg.taskList[i].btindex)) {
            //         subTaskFinished = false;
            //     }
            // }

            if (nid == ACTIVE_TYPE.DISCOUNT_SKIN) {
                const rechargeCfg = Game.actorMgr.getChargeConifg(cfg.taskList[0].nparam1);
                if (rechargeCfg && rechargeCfg.sztitle) {

                    let arr = rechargeCfg.sztitle.split("_");//skin_1_1_1
                    const towerid = parseInt(arr[1] + "0" + arr[2]);
                    let fastionInfos = Game.fashionMgr.getTowerFashionInfos(towerid);
                    if (fastionInfos && fastionInfos.length > 0) {
                        return !!Game.fashionMgr.getFashionData(fastionInfos[0].nid);
                    }
                }
            }
        }

        return !privateData || privateData.nflag === SYSACTIVITY_FALG.CLOSE || outofDate;
    }

    isActivityFinishedByClientParam(param:number):boolean {
        let activeInfo = this.getActivityByClientParam(param);
        if (activeInfo) {
            let privateData = this._privateDataMap && this._privateDataMap.get(activeInfo.item.nid);
            let outofDate: boolean = true;//活动是否结束
            // let subTaskFinished: boolean = true;

            if (activeInfo && privateData) {
                let endTime: number = activeInfo.item.nvalidtimes + privateData.nstarttimes;
                if (GlobalVal.getServerTime() * 0.001 < endTime || activeInfo.item.nvalidtimes == 0) {
                    outofDate = false;
                }
            }

            return !privateData || privateData.nflag === SYSACTIVITY_FALG.CLOSE || outofDate;
        }
        return true;
    }

    /**
     * 子任务是否完成
     * @param nid 
     * @param btIndex 
     * @returns 
     */
    public isSubTaskFinished(nid: number, btIndex: number) {
        let cfg: ActiveInfo = this._sysActivityInfoItem && this._sysActivityInfoItem[nid];
        let privateData = this._privateDataMap && this._privateDataMap.get(nid);
        let subTaskFinished: boolean = true;
        if (cfg && privateData) {
            //判断子任务完成情况
            if (!Utils.checkBitFlag(privateData.nflag, btIndex)) {
                subTaskFinished = false;
            }
        }

        return subTaskFinished;
    }

    /**
     * 获取下一个未完成的任务下标
     */
    public getNextUnfinishedIndex(nid: number): number {
        let cfg: ActiveInfo = this._sysActivityInfoItem && this._sysActivityInfoItem[nid];
        let privateData = this._privateDataMap && this._privateDataMap.get(nid);
        let index = 0;
        if (cfg && privateData) {
            for (let i = 0; i < cfg.taskList.length; i++) {
                if (!Utils.checkBitFlag(privateData.nflag, cfg.taskList[i].btindex)) {
                    index = i;
                    break;
                }
            }
        }
        return index;
    }

    /**
     * 获取活动剩余时间
     * @param nid 
     * @returns 
     */
    public getActiveRestTime(nid) {
        let restTime: number = 0;
        let cfg = this._sysActivityInfoItem && this._sysActivityInfoItem[nid];
        let privateData = this._privateDataMap && this._privateDataMap.get(nid);
        if (cfg && privateData) {
            let item = cfg.item as GS_SysActivityConfig_SysActivityItem;
            if (item.nvalidtimes) {
                //非永久活动
                let endTime: number = item.nvalidtimes + privateData.nstarttimes;
                restTime = endTime - GlobalVal.getServerTime() * 0.001;
                restTime = restTime < 0 ? 0 : restTime;
            } else {
                //永久活动
                if (item.nclearcycleday) {
                    //循环周期活动
                    // let endTime: number = item.nvalidtimes + privateData.nstarttimes;
                    let dt = GlobalVal.getServerTime() * 0.001 - privateData.nstarttimes;
                    let circleTime = item.nclearcycleday * 24 * 60 * 60;
                    restTime = circleTime - dt % circleTime;
                    restTime = restTime < 0 ? 0 : restTime;
                }
            }
        }
        return restTime;
    }

    /**
     * 双倍充值是否结束
     * @returns 
     */
    public isDoubleRechargeFinished(): boolean {
        let startTime = new Date(this._doubleRechargeStart).getTime();
        let endTime = new Date(this._doubleRechargeEnd).getTime();
        let now = GlobalVal.getServerTime();
        return now < startTime || now >= endTime;
    }

    /**
     * 刷新双倍充值活动红点
     */
    public refreshDoubleRechargeRedpoints() {
        let node = Game.redPointSys.findRedPointNode(EVENT_REDPOINT.DOUBLE_RECHARGE);
        if (node) {
            node.setRedPointNum(this.isDoubleRechargeFinished() ? 0 : 1);
        }

        this.refreshDayLoginRedPoint();
    }

    /**
     * 刷新活动
     * @param activeId 活动id
     * @param mode 刷新模式（0：视频 1：钻石）
     */
    public refreshActive(activeId: number, mode: number) {
        let data = new GS_SysactivityReset();
        data.nid = activeId;
        data.btmode = mode;
        this.send(GS_PLAZA_SYSACTIVITY_MSG.PLAZA_SYSACTIVITY_REST, data);
    }

    private refreshDayLoginRedPoint() {
        let flag = false;
        let cfg = Game.sysActivityMgr.getActivityInfo(ACTIVE_TYPE.DAY_LOGIN);
        let privateData = Game.sysActivityMgr.getPrivateData(ACTIVE_TYPE.DAY_LOGIN);

        // let taskList = .taskList;
        if (cfg && cfg.taskList && privateData) {
            let len = cfg.taskList.length;
            for (let i = 0; i < len; i++) {
                const element = cfg.taskList[i] as GS_SysActivityNew_SysActivityNewTaskItem;
                if ((element.btindex < privateData.nmainprogress && !Utils.checkBitFlag(privateData.nflag, element.btindex))
                    || (element.btindex == privateData.nmainprogress && !Utils.isTimeInToday(privateData.nlastchangetimes))) {
                    flag = true;
                    break;
                }
            }
        }

        //flag
        Game.redPointSys.setRedPointNum(EVENT_REDPOINT.ACTIVE_HALL_DAYLOGIN, flag ? 1 : 0);
    }

    private _onLineTimerKey:number = -1;
    private refreshOnLineTime() {
        let num = 0;
        let cfg = Game.sysActivityMgr.getActivityInfo(ACTIVE_TYPE.ONLINE_TIME);
        let privateData = Game.sysActivityMgr.getPrivateData(ACTIVE_TYPE.ONLINE_TIME);

        let onlinetime = Game.actorMgr.getOnlineTime();
        let addTimeFlag = false;
        if (cfg && cfg.taskList && privateData) {
            let len = cfg.taskList.length;
            for (let i = 0; i < len; i++) {
                const element = cfg.taskList[i] as GS_SysActivityNew_SysActivityNewTaskItem;
                if (!Utils.checkBitFlag(privateData.nflag, element.btindex)) {
                    if (element.nparam1 <= onlinetime) {
                        num = 1;
                        break;
                    }
                    addTimeFlag = true;
                }
            }
        }

        if (addTimeFlag) {
            if (this._onLineTimerKey == -1) {
                this._onLineTimerKey = SysMgr.instance.doLoop(Handler.create(this.onCheckTimer , this) , 5000 ,0, true);
            }
        } else {
            if (this._onLineTimerKey != -1) {
                SysMgr.instance.clearTimerByKey(this._onLineTimerKey);
                this._onLineTimerKey = -1;
            }
        }

        Game.redPointSys.setRedPointNum(EVENT_REDPOINT.ON_LINE_TIME, num);
    }

    private refreshDailyGiftRedPoint() {
        let cfg = Game.sysActivityMgr.getActivityInfo(ACTIVE_TYPE.DAILY_GIFT);
        let privateData = Game.sysActivityMgr.getPrivateData(ACTIVE_TYPE.DAILY_GIFT);

        // let taskList = .taskList;
        if (cfg && cfg.taskList && privateData) {
            let len = cfg.taskList.length;
            for (let i = 0; i < len; i++) {
                const element = cfg.taskList[i] as GS_SysActivityNew_SysActivityNewTaskItem;
                let flag = privateData.nmainprogress > 0 && !Utils.checkBitFlag(privateData.nflag, element.btindex);
                Game.redPointSys.setRedPointNumSub(EVENT_REDPOINT.ACTIVE_HALL_DAILY_GIFT_ITEM , element.btindex.toString() , flag ? 1 : 0);
            }
        }

    }

    private onCheckTimer() {
        this.refreshOnLineTime();
    }

    public isLocalActiveFinished(id: number) {
        let finished = true;
        if (this._localActiveCfg) {
            let cfg = this._localActiveCfg[id];
            if (cfg) {
                let start = new Date(cfg.startTime).getTime();
                let end = start + cfg.interval * 24 * 60 * 60 * 1000;
                let now = GlobalVal.getServerTime();
                finished = now < start || now >= end;
            }
        }
        return finished;
    }

    everyDayRechargeOpen():boolean {
        let flag1 = this.isActivityFinished(ACTIVE_TYPE.EVERY_DAY_RECHARGE_6);

        if (!flag1) {
            flag1 = this.isSubTaskFinished(ACTIVE_TYPE.EVERY_DAY_RECHARGE_6 , 0);
        }

        let flag2 = this.isActivityFinished(ACTIVE_TYPE.EVERY_DAY_RECHARGE_30);

        if (!flag2) {
            flag2 = this.isSubTaskFinished(ACTIVE_TYPE.EVERY_DAY_RECHARGE_30 , 0);
        }

        return !flag1 || !flag2;
    }

    showActivityEft(nid:number) {
        let cfg = Game.sysActivityMgr.getActivityInfo(nid);
        return cfg && cfg.item.nclientparam == 1;
    }
}