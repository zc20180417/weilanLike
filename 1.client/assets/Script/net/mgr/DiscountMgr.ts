/* 
 * 打折商店协议
 * @Author: BMIU 
 * @Date: 2021-01-23 11:14:22 
 * @Last Modified by: BMIU
 * @Last Modified time: 2021-05-31 10:33:39
 */

import { BuryingPointMgr, EBuryingPoint } from "../../buryingPoint/BuryingPointMgr";
import { GLOBAL_FUNC } from "../../common/AllEnum";
import { EResPath } from "../../common/EResPath";
import { EventEnum } from "../../common/EventEnum";
import Debug from "../../debug";
import Game from "../../Game";
import GlobalVal from "../../GlobalVal";
import { GameEvent } from "../../utils/GameEvent";
import { Handler } from "../../utils/Handler";
import SystemTipsMgr from "../../utils/SystemTipsMgr";
import { GS_DiscountStoreBuy, GS_DiscountStoreBuyRet, GS_DiscountStoreFreeRef, GS_DiscountStoreFreeVideoRef, GS_DiscountStoreFreeVideoRet, GS_DiscountStoreInfo, GS_DiscountStorePrivate, GS_DiscountStorePrivate_GoodsData, GS_DiscountStoreTimeRef, GS_PLAZA_DISCOUNTSTORE_MSG } from "../proto/DMSG_Plaza_Sub_DiscountStorePlugin";
import BaseNetHandler from "../socket/handler/BaseNetHandler";
import { CMD_ROOT, GS_PLAZA_MSGID } from "../socket/handler/MessageEnum";

const DISCOUNT_TAG = "打折商城：";

export default class DiscountMgr extends BaseNetHandler {
    private discountStoreInfo: GS_DiscountStoreInfo = null;//配置
    private privateData: GS_DiscountStorePrivate = null;//个人数据
    private privateDataMap: Map<number, GS_DiscountStorePrivate_GoodsData> = null;

    private isStoreInfoInit: boolean = false;
    private isPrivateDataInit: boolean = false;
    private isScheduled: boolean = false;
    private leftTime: number = 0;

    constructor() {
        super(CMD_ROOT.CMDROOT_PLAZA_MSG, GS_PLAZA_MSGID.GS_PLAZA_MSGID_DISCOUNTSTORE);

        this.resetData();
    }

    register() {
        this.registerAnaysis(GS_PLAZA_DISCOUNTSTORE_MSG.PLAZA_DISCOUNTSTORE_INFO, Handler.create(this.onDiscountStoreInfo, this), GS_DiscountStoreInfo);
        this.registerAnaysis(GS_PLAZA_DISCOUNTSTORE_MSG.PLAZA_DISCOUNTSTORE_FREEVIDEOORDER, Handler.create(this.onDisFreeVideoOrder, this), GS_DiscountStoreFreeVideoRet);
        this.registerAnaysis(GS_PLAZA_DISCOUNTSTORE_MSG.PLAZA_DISCOUNTSTORE_BUYRET, Handler.create(this.onDisBuyRet, this), GS_DiscountStoreBuyRet);
        this.registerAnaysis(GS_PLAZA_DISCOUNTSTORE_MSG.PLAZA_DISCOUNTSTORE_PRIVATE, Handler.create(this.onDisCountPrivate, this), GS_DiscountStorePrivate);
    }

    resetData() {
        if (this.privateDataMap) this.privateDataMap.clear();
        this.isStoreInfoInit = false;
        this.isPrivateDataInit = false;
        this.isScheduled = false;
        this.leftTime = 0;

        //取消定时器
        let schedule = cc.director.getScheduler();
        schedule.enableForTarget(this);
        schedule.unscheduleUpdate(this);
    }

    exitGame() {
        this.resetData();
    }

    /**
     * 设置定时器，统计打折商城刷新时间
     * @returns 
     */
    private scheduleUpdate() {
        if (!this.isStoreInfoInit || !this.isPrivateDataInit || this.isScheduled) return;
        let schedule = cc.director.getScheduler();
        schedule.enableForTarget(this);
        schedule.scheduleUpdate(this, cc.Scheduler.PRIORITY_NON_SYSTEM, false);
        this.isScheduled = true;
    }

    /**
     * 配置
     * @param data GS_DiscountStoreInfo
     */
    onDiscountStoreInfo(data: GS_DiscountStoreInfo) {
        Debug.log(DISCOUNT_TAG, "打折商城配置", data);
        this.discountStoreInfo = data;
        this.isStoreInfoInit = true;
        this.scheduleUpdate();
    }

    /**
     * 视频刷新订单下发
     * @param data GS_DiscountStoreFreeVideoRet
     */
    onDisFreeVideoOrder(data: GS_DiscountStoreFreeVideoRet) {
        Debug.log(DISCOUNT_TAG, "打折商城视频订单", data);
        BuryingPointMgr.post(EBuryingPoint.SALE_SHOP_FREE_REFRESH, JSON.stringify({ order: data.szorder }));
        Game.nativeApi.showRewardAd(Game.actorMgr.nactordbid.toString(), data.szorder , data.szsdkkey);
    }

    /**
     * 购买返回
     * @param data GS_DiscountStoreBuyRet
     */
    onDisBuyRet(data: GS_DiscountStoreBuyRet) {
        Debug.log(DISCOUNT_TAG, "打折商城购买返回", data);
        let privateData = this.privateDataMap.get(data.btindex);
        privateData.btstate = 1;

        GameEvent.emit(EventEnum.ON_DISCOUNT_BUY_RET, data.btindex);
    }


    /**
     * 个人数据
     * @param data GS_DiscountStorePrivate
     */
    onDisCountPrivate(data: GS_DiscountStorePrivate) {
        Debug.log(DISCOUNT_TAG, "打折商城个人数据", data);
        this.privateData = data;
        if (this.privateDataMap) this.privateDataMap.clear();
        else {
            this.privateDataMap = new Map();
        }
        if (data.goodsdatalist) {
            data.goodsdatalist.forEach(el => {
                this.privateDataMap.set(el.btindex, el);
            });
        }
        this.isPrivateDataInit = true;
        this.scheduleUpdate();
        GameEvent.emit(EventEnum.ON_DISCOUNT_PRIVATE_DATA);
    }

    /**
     * 免费刷新(成功会重发个人数据)
     * 
     */
    disCountFreeRefresh() {
        let data = new GS_DiscountStoreFreeRef();
        this.send(GS_PLAZA_DISCOUNTSTORE_MSG.PLAZA_DISCOUNTSTORE_FREEREF, data);
    }


    /**
     * 视频刷新(视频成功会重发个人数据）
     */
    disCountFreeVideoRefresh() {
        if (!GlobalVal.getCanReqFvTime()) return;
        GlobalVal.changeNextReqFvTime();
        let data = new GS_DiscountStoreFreeVideoRef();
        this.send(GS_PLAZA_DISCOUNTSTORE_MSG.PLAZA_DISCOUNTSTORE_FREEVIDEOREF, data);
    }

    /**
     * 购买物品
     * @param index number
     */
    disCountBuy(index: number) {
        let data = new GS_DiscountStoreBuy();
        data.btindex = index;
        this.send(GS_PLAZA_DISCOUNTSTORE_MSG.PLAZA_DISCOUNTSTORE_BUY, data);
    }

    /**
     * 客户端通知服务器时间到了刷新
     */
    disCountTimeRefresh() {
        let data = new GS_DiscountStoreTimeRef();
        this.send(GS_PLAZA_DISCOUNTSTORE_MSG.PLAZA_DISCOUNTSTORE_TIMEREF, data);
    }

    /**
     * privateDataMap
     */
    getPrivateMap(): Map<number, GS_DiscountStorePrivate_GoodsData> {
        return this.privateDataMap;
    }

    /**
     * 获取折扣商城配置
     */
    getDiscountInfo(): GS_DiscountStoreInfo {
        return this.discountStoreInfo;
    }

    /**
     * 私有数据
     */
    getPrivateData(): GS_DiscountStorePrivate {
        return this.privateData;
    }

    /**
     * 每帧更新
     * @param dt 
     */
    private update(dt: number) {
        this.caculLeftTime();
        // Debug.log(DISCOUNT_TAG,"discountMgr update", dt);
    }

    /**
     * 获取刷新剩余的时间
     * @returns 
     */
    public getLeftTime(): number {
        return this.leftTime;
    }

    public caculLeftTime() {
        let privateData = this.privateData;
        let dicountInfo = this.discountStoreInfo;
        if (!privateData) {
            this.leftTime = 0;
            return;
        }
        let now = GlobalVal.getServerTime() / 1000;
        let nextTime = privateData.nlastreftime + dicountInfo.nautoreftimes * 60 * 60;
        let t = nextTime - now;
        if (this.leftTime > 0 && t <= 0
            && Game.globalFunc.isFuncOpened(GLOBAL_FUNC.DISCOUNT)
            && Game.globalFunc.canShowFunc(GLOBAL_FUNC.DISCOUNT)) {
            //显示提示
            SystemTipsMgr.instance.showCommentTips(EResPath.SHOP_DISCOUNT_TIPS);
        }
        this.leftTime = t >= 0 ? t : 0;
    }
}
