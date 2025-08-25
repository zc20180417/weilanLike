import { FestivalActivityTaskType } from "../../common/AllEnum";
import { EResPath } from "../../common/EResPath";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import GlobalVal from "../../GlobalVal";
import { EVENT_REDPOINT } from "../../redPoint/RedPointSys";
import { GameEvent } from "../../utils/GameEvent";
import { Handler } from "../../utils/Handler";
import SystemTipsMgr from "../../utils/SystemTipsMgr";
import { UiManager } from "../../utils/UiMgr";
import Utils from "../../utils/Utils";
import { GS_FestivalActivityClose, GS_FestivalActivityCombineDo, GS_FestivalActivityCombineOK, GS_FestivalActivityCombineReward, GS_FestivalActivityCombineRewardGet, GS_FestivalActivityConfig, GS_FestivalActivityConfig_ExchangeItem, GS_FestivalActivityConfig_LuckyItem, GS_FestivalActivityConfig_MallItem, GS_FestivalActivityConfig_RewardItem, GS_FestivalActivityConfig_Task, GS_FestivalActivityConfig_WishItem, GS_FestivalActivityExchangeReward, GS_FestivalActivityExchangeRewardGet, GS_FestivalActivityLuckyDrawPlayReward, GS_FestivalActivityLuckyDrawPlayRewardGet, GS_FestivalActivityLuckyDrawWishReward, GS_FestivalActivityLuckyDrawWishRewardGet, GS_FestivalActivityMallReward, GS_FestivalActivityMallRewardGet, GS_FestivalActivityPrivate, GS_FestivalActivityPrivate_ReceiveItem, GS_FestivalActivityPrivate_TaskItem, GS_FestivalActivityRmbOrder, GS_FestivalActivitySignReward, GS_FestivalActivitySignRewardGet, GS_FestivalActivitySignVideoOrder, GS_FestivalActivityTaskDailyUpdate, GS_FestivalActivityTaskReward, GS_FestivalActivityTaskRewardGet, GS_FestivalActivityUpdatePriceCount, GS_FestivalActivityUpdateTaskDaily, GS_PLAZA_FESTIVALACTIVITY_MSG } from "../proto/DMSG_Plaza_Sub_FestivalActivity";
import BaseNetHandler from "../socket/handler/BaseNetHandler";
import { CMD_ROOT, GOODS_TYPE, GS_PLAZA_MSGID } from "../socket/handler/MessageEnum";

export default class FestivalActivityMgr extends BaseNetHandler {

    private _config:GS_FestivalActivityConfig;
    private _data:GS_FestivalActivityPrivate;
    private _leiChouTasks:GS_FestivalActivityConfig_Task[] = [];
    private _leiChongTasks:GS_FestivalActivityConfig_Task[] = [];
    private _dailyTasks:GS_FestivalActivityConfig_Task[] = [];
    private _dailyTaskDic:{[key:string]:GS_FestivalActivityConfig_Task} = {};
    private _exchangeGoodsDic:{[key:string]:GS_FestivalActivityConfig_ExchangeItem} = {};
    
    private _leiChouTaskStateDic:{[key:string]:GS_FestivalActivityPrivate_TaskItem} = {};
    private _leiChongTaskStateDic:{[key:string]:GS_FestivalActivityPrivate_TaskItem} = {};
    private _dailyTaskStateDic:{[key:string]:GS_FestivalActivityPrivate_TaskItem} = {};
    private _ecxchangeShopStateDic:{[key:string]:GS_FestivalActivityPrivate_ReceiveItem} = {};
    private _shopStateDic:{[key:string]:GS_FestivalActivityPrivate_ReceiveItem} = {};
    private _xinYuanDic:{[key:string]:GS_FestivalActivityPrivate_ReceiveItem} = {};
    private _materialItemDic:{[key:string]:GS_FestivalActivityPrivate_ReceiveItem} = {};
    private _combinedDic:{[key:string]:GS_FestivalActivityPrivate_ReceiveItem} = {};
    private _luckyItemsDic:{[key:string]:GS_FestivalActivityConfig_LuckyItem} = {};
    // private _xinYuanTimes:number = 0;
    private _luckyValue:number = 0;
    private _selectWishNid:number = 0;
    private _combingItemDic:{[key:string]:number} = {};
    private _tempCombingDic:{[key:string]:number[]} = {};

    constructor() {
        super(CMD_ROOT.CMDROOT_PLAZA_MSG, GS_PLAZA_MSGID.GS_PLAZA_MSGID_FESTIVALACTIVITY);
        GameEvent.on(EventEnum.ACROSS_DAY , this.onAcrossDay , this);
    }

    register() {
        this.registerAnaysis(GS_PLAZA_FESTIVALACTIVITY_MSG.PLAZA_FESTIVALACTIVITY_CONFIG , Handler.create(this.onFestivalActivityConfig , this),  GS_FestivalActivityConfig);
        this.registerAnaysis(GS_PLAZA_FESTIVALACTIVITY_MSG.PLAZA_FESTIVALACTIVITY_PRIVATE , Handler.create(this.onFestivalActivityPrivate , this),  GS_FestivalActivityPrivate);
        this.registerAnaysis(GS_PLAZA_FESTIVALACTIVITY_MSG.PLAZA_FESTIVALACTIVITY_LUCKYDRAW_PLAY_REWARD , Handler.create(this.onFestivalActivityLuckyDrawPlayReward , this),  GS_FestivalActivityLuckyDrawPlayReward);
        this.registerAnaysis(GS_PLAZA_FESTIVALACTIVITY_MSG.PLAZA_FESTIVALACTIVITY_LUCKYDRAW_WISH_REWARD , Handler.create(this.onDrawWishReward , this),  GS_FestivalActivityLuckyDrawWishReward);
        this.registerAnaysis(GS_PLAZA_FESTIVALACTIVITY_MSG.PLAZA_FESTIVALACTIVITY_TASK_RECHARGE_REWARD , Handler.create(this.onTaskReChargeReward , this),  GS_FestivalActivityTaskReward);
        this.registerAnaysis(GS_PLAZA_FESTIVALACTIVITY_MSG.PLAZA_FESTIVALACTIVITY_TASK_LUCKYDRAW_REWARD , Handler.create(this.onTaskLuckyDrawReward , this),  GS_FestivalActivityTaskReward);
        this.registerAnaysis(GS_PLAZA_FESTIVALACTIVITY_MSG.PLAZA_FESTIVALACTIVITY_TASK_DAILY_REWARD , Handler.create(this.onTaskDailyReward , this),  GS_FestivalActivityTaskReward);
        this.registerAnaysis(GS_PLAZA_FESTIVALACTIVITY_MSG.PLAZA_FESTIVALACTIVITY_EXCHANGE_REWARD , Handler.create(this.onExchangeReward , this),  GS_FestivalActivityExchangeReward);
        this.registerAnaysis(GS_PLAZA_FESTIVALACTIVITY_MSG.PLAZA_FESTIVALACTIVITY_MALL_ORDER , Handler.create(this.onRmbOrder , this),  GS_FestivalActivityRmbOrder);
        this.registerAnaysis(GS_PLAZA_FESTIVALACTIVITY_MSG.PLAZA_FESTIVALACTIVITY_MALL_REWARD , Handler.create(this.onMallReward , this),  GS_FestivalActivityMallReward);
        this.registerAnaysis(GS_PLAZA_FESTIVALACTIVITY_MSG.PLAZA_FESTIVALACTIVITY_CLOSE , Handler.create(this.onFestivalActivityClose , this),  GS_FestivalActivityClose);
        this.registerAnaysis(GS_PLAZA_FESTIVALACTIVITY_MSG.PLAZA_FESTIVALACTIVITY_TASK_DAILY_UPDATE , Handler.create(this.onTaskDailyUpdate , this),  GS_FestivalActivityTaskDailyUpdate);
        this.registerAnaysis(GS_PLAZA_FESTIVALACTIVITY_MSG.PLAZA_FESTIVALACTIVITY_UPDATE_PRICECOUNT , Handler.create(this.onUpdatePriceCount, this),  GS_FestivalActivityUpdatePriceCount);
        this.registerAnaysis(GS_PLAZA_FESTIVALACTIVITY_MSG.PLAZA_FESTIVALACTIVITY_UPDATE_TASK_DAILY , Handler.create(this.onUpdateTaskDaily, this),  GS_FestivalActivityUpdateTaskDaily);
        this.registerAnaysis(GS_PLAZA_FESTIVALACTIVITY_MSG.PLAZA_FESTIVALACTIVITY_SIGN_REWARD , Handler.create(this.onActivitySignReward, this),  GS_FestivalActivitySignReward);
        this.registerAnaysis(GS_PLAZA_FESTIVALACTIVITY_MSG.PLAZA_FESTIVALACTIVITY_SIGN_VIDEOORDER , Handler.create(this.onActivitySignVideoOrder, this),  GS_FestivalActivitySignVideoOrder);
        this.registerAnaysis(GS_PLAZA_FESTIVALACTIVITY_MSG.PLAZA_FESTIVALACTIVITY_COMBINE_OK , Handler.create(this.onActivitySignCombineOK, this),  GS_FestivalActivityCombineOK);
        this.registerAnaysis(GS_PLAZA_FESTIVALACTIVITY_MSG.PLAZA_FESTIVALACTIVITY_COMBINE_REWARD , Handler.create(this.onActivityCombineReward, this),  GS_FestivalActivityCombineReward);
    }

    protected onSocketError(): void {
        Game.containerMgr.needCardBag = true;
    }

    protected exitGame(): void {
        Game.containerMgr.needCardBag = true;
    }

    getConfig():GS_FestivalActivityConfig {
        return this._config;
    }

    getExChangeGoodsId():number {
        return this._config ? this._config.nexchangegoodsid : 0;
    }

    getLuckyGoodsId():number {
        return this._config && this._config.luckydraw ? this._config.luckydraw.ngoodsid : 0;
    }

    getData():GS_FestivalActivityPrivate {
        return this._data;
    }

    getLuckyValue():number {
        if (this._data) {
            return this._data.nplaycount - this._luckyValue;
        }
        return 0;
    }

    getCurDay():number {
        let day = 0;
        if (this._config) {
            day = Utils.getDiffDay(this._config.ntimeclose * 1000 , GlobalVal.getServerTime());
            day = this._config.nvalidday - day;
        }
        return day;
    }

    getTaskDatas(type:FestivalActivityTaskType):GS_FestivalActivityConfig_Task[] {
        switch (type) {
            case FestivalActivityTaskType.LeiChong:
                return this._leiChongTasks;
                break;
            case FestivalActivityTaskType.LeiChou:
                return this._leiChouTasks;
                break;
            case FestivalActivityTaskType.Daily:
                return this._dailyTasks;
                break;
        
            default:
                break;
        }
        return null;
    }

    getTaskState(type:FestivalActivityTaskType ,taskId:number):GS_FestivalActivityPrivate_TaskItem {
        let dic = {};
        switch (type) {
            case FestivalActivityTaskType.LeiChong:
                dic = this._leiChongTaskStateDic;
                break;
            case FestivalActivityTaskType.LeiChou:
                dic = this._leiChouTaskStateDic;
                break;
            case FestivalActivityTaskType.Daily:
                dic = this._dailyTaskStateDic;
        
            default:
                break;
        }
        if (!dic[taskId]) {
            let taskItem:GS_FestivalActivityPrivate_TaskItem = new GS_FestivalActivityPrivate_TaskItem();
            taskItem.ntaskid = taskId;
            taskItem.btgetreward = 0;
            taskItem.unowvalue = 0;
            dic[taskId] = taskItem;
        }
        return dic[taskId];
    }

    getLeiChouCount():number {
        return this._data ? this._data.nplaycount : 0;
    }

    getLeiChongCount():number {
        return this._data ? this._data.npricecount : 0;
    }

    getExchangeShopItemState(nid:number):GS_FestivalActivityPrivate_ReceiveItem {
        if (!this._ecxchangeShopStateDic[nid]) {
            let item = new GS_FestivalActivityPrivate_ReceiveItem();
            item.nid = nid;
            item.ntimes = 0;
            this._ecxchangeShopStateDic[nid] = item;
        }
        return this._ecxchangeShopStateDic[nid];
    }

    getShopItemState(nid:number):GS_FestivalActivityPrivate_ReceiveItem {
        if (!this._shopStateDic[nid]) {
            let item = new GS_FestivalActivityPrivate_ReceiveItem();
            item.nid = nid;
            item.ntimes = 0;
            this._shopStateDic[nid] = item;
        }
        return this._shopStateDic[nid];
    }

    getXinYuanItemState(nid:number):GS_FestivalActivityPrivate_ReceiveItem {
        if (!this._xinYuanDic[nid]) {
            let item = new GS_FestivalActivityPrivate_ReceiveItem();
            item.nid = nid;
            item.ntimes = 0;
            this._xinYuanDic[nid] = item;
        }
        return this._xinYuanDic[nid];
    }

    getCombinedState(nid:number):GS_FestivalActivityPrivate_ReceiveItem {
        if (!this._combinedDic[nid]) {
            let item = new GS_FestivalActivityPrivate_ReceiveItem();
            item.nid = nid;
            item.ntimes = 0;
            this._combinedDic[nid] = item;
        }
        return this._combinedDic[nid];
    }

    getMaterialItemState(nid:number):GS_FestivalActivityPrivate_ReceiveItem {
        if (!this._materialItemDic[nid]) {
            let item = new GS_FestivalActivityPrivate_ReceiveItem();
            item.nid = nid;
            item.ntimes = 0;
            this._materialItemDic[nid] = item;
        }
        return this._materialItemDic[nid];
    }

    getExchangeGoodsCount():number {
        return this._data ? this._data.nexchangegoodscount : 0;
    }

    checkFestivalActivity():boolean {
        if (this._config) {
            return GlobalVal.getServerTimeS() < this._config.ntimeclose;
        }
        return false;
    }

    getWishItem(id:number):GS_FestivalActivityConfig_WishItem {
        if (this._config) {
            let len = this._config.luckydraw.wishitemlist ? this._config.luckydraw.wishitemlist.length : 0;
            for (let i = 0 ; i < len ; i++) {
                if (this._config.luckydraw.wishitemlist[i].nid == id) {
                    return this._config.luckydraw.wishitemlist[i];
                }
            }
        }
        return null;
    }

    getSelectWishId():number {
        return this._selectWishNid;
    }

    setCombingItem(id:number , index:number , nid:number) {
        let count = this._combingItemDic[id] || 0;
        count ++;
        this._combingItemDic[id] = count;

        if (!this._tempCombingDic[nid]) {
            this._tempCombingDic[nid] = [];
        }
        
        this._tempCombingDic[nid][index] = id;
    }

    getTempCombingList(nid:number):number[] {
        return this._tempCombingDic[nid];
    }

    cacheCombingItem(id:number) {
        let count = this._combingItemDic[id] || 0;
        count --;
        this._combingItemDic[id] = count;
    }

    getCombingItemCount(id:number):number {
        return this._combingItemDic[id] || 0;
    }

    clearCombing() {
        this._combingItemDic = {};
        this._tempCombingDic = {};
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////

    reqLuckyDraw(index:number) {
        let type = 0;
        switch (index) {
            case 1:
                type = GS_PLAZA_FESTIVALACTIVITY_MSG.PLAZA_FESTIVALACTIVITY_LUCKYDRAW_PLAY_REWARD_GET_1;
                break;
            case 2:
                Game.containerMgr.needCardBag = false;
                type = GS_PLAZA_FESTIVALACTIVITY_MSG.PLAZA_FESTIVALACTIVITY_LUCKYDRAW_PLAY_REWARD_GET_10;
                break;
            case 3:
                Game.containerMgr.needCardBag = false;
                type = GS_PLAZA_FESTIVALACTIVITY_MSG.PLAZA_FESTIVALACTIVITY_LUCKYDRAW_PLAY_REWARD_GET_50;
                break;
        
            default:
                break;
        }

        let data:GS_FestivalActivityLuckyDrawPlayRewardGet = new GS_FestivalActivityLuckyDrawPlayRewardGet();
        this.send(type , data);
    }

    selectWish(nid:number) {
        this._selectWishNid = nid;
        GameEvent.emit(EventEnum.ACTIVE_TAQING_SELECT_WISH_ITEM);
    }

    reqWish(nid:number) {
        let data:GS_FestivalActivityLuckyDrawWishRewardGet = new GS_FestivalActivityLuckyDrawWishRewardGet();
        data.nid = nid;
        this.send(GS_PLAZA_FESTIVALACTIVITY_MSG.PLAZA_FESTIVALACTIVITY_LUCKYDRAW_WISH_REWARD_GET , data);
    }

    reqTaskLeiChouReward(nid:number) {
        let data:GS_FestivalActivityTaskRewardGet = new GS_FestivalActivityTaskRewardGet();
        data.nid = nid;
        this.send(GS_PLAZA_FESTIVALACTIVITY_MSG.PLAZA_FESTIVALACTIVITY_TASK_LUCKYDRAW_REWARD_GET , data);
    }

    reqTaskLeiChongReward(nid:number) {
        let data:GS_FestivalActivityTaskRewardGet = new GS_FestivalActivityTaskRewardGet();
        data.nid = nid;
        this.send(GS_PLAZA_FESTIVALACTIVITY_MSG.PLAZA_FESTIVALACTIVITY_TASK_RECHARGE_REWARD_GET , data);
    }

    reqTaskDailyReward(nid:number) {
        let data:GS_FestivalActivityTaskRewardGet = new GS_FestivalActivityTaskRewardGet();
        data.nid = nid;
        this.send(GS_PLAZA_FESTIVALACTIVITY_MSG.PLAZA_FESTIVALACTIVITY_TASK_DAILY_REWARD_GET , data); 
    }

    reqBuyExchangeGoods(nid:number , count:number = 1) {
        let data:GS_FestivalActivityExchangeRewardGet = new GS_FestivalActivityExchangeRewardGet();
        data.nid = nid;
        data.nnum = count;
        this.send(GS_PLAZA_FESTIVALACTIVITY_MSG.PLAZA_FESTIVALACTIVITY_EXCHANGE_REWARD_GET , data);
    }

    private _time:number = 0;
    reqBuyShopGoods(nid:number) {
        if (GlobalVal.getServerTime() - this._time < 500) return;
        this._time = GlobalVal.getServerTime();
        let data:GS_FestivalActivityMallRewardGet = new GS_FestivalActivityMallRewardGet();
        data.nid = nid;
        this.send(GS_PLAZA_FESTIVALACTIVITY_MSG.PLAZA_FESTIVALACTIVITY_MALL_REWARD_GET , data);
    }

    reqSignReward(nday:number) {
        let data:GS_FestivalActivitySignRewardGet = new GS_FestivalActivitySignRewardGet();
        data.nday = nday;
        this.send(GS_PLAZA_FESTIVALACTIVITY_MSG.PLAZA_FESTIVALACTIVITY_SIGN_REWARD_GET , data);
    }

    /**
     * 请求合成
     * @param goods 
     */
    reqCombineDo(goods:number[]) {
        if (goods.length < 3) {
            return;
        }
        let data:GS_FestivalActivityCombineDo = new GS_FestivalActivityCombineDo();
        data.ngoodsids = goods;
        this.send(GS_PLAZA_FESTIVALACTIVITY_MSG.PLAZA_FESTIVALACTIVITY_COMBINE_DO , data);
    }

    reqCombineRewardGet() {
        let data:GS_FestivalActivityCombineRewardGet = new GS_FestivalActivityCombineRewardGet();
        this.send(GS_PLAZA_FESTIVALACTIVITY_MSG.PLAZA_FESTIVALACTIVITY_COMBINE_REWARD_GET , data);
    }

    /////////////////////////////////////////////////////////////////////////////////////////////
    //活动配置
    private onFestivalActivityConfig(data:GS_FestivalActivityConfig) {
        cc.log('节日活动配置:' , data);
        this._config = data;
        this._leiChouTasks.length = 0;
        this._leiChongTasks.length = 0;
        this._dailyTasks.length = 0;
        this._dailyTaskDic = {};
        this._exchangeGoodsDic = {};
        // this._leichongTheBaseReward = null;

        if (this._config.data1 && this._config.data1.length > 0) {
            let len = this._config.data1.length;
            for (let i = 0 ; i < len ; i++) {
                let element = this._config.data1[i];
                switch (element.bttype) {
                    case FestivalActivityTaskType.LeiChong:
                        this._leiChongTasks.push(element);
                        break;
                    case FestivalActivityTaskType.LeiChou:
                        this._leiChouTasks.push(element);
                        break;
                    case FestivalActivityTaskType.Daily:
                        this._dailyTasks.push(element);
                        this._dailyTaskDic[element.nid] = element;
                        break;
                
                    default:
                        break;
                }
            }
        }

        if (this._config.data2) {
            this._config.data2.forEach(element => {
                this._exchangeGoodsDic[element.nid] = element;
            });
        }

        this._luckyItemsDic = {};
        if (this._config.luckydraw && this._config.luckydraw.luckyitemlist) {
            this._config.luckydraw.luckyitemlist.forEach(element => {
                this._luckyItemsDic[element.nid] = element;
            });
        }

        GameEvent.emit(EventEnum.ACTIVE_TAQING_INIT);
    }

    //活动个人数据
    private onFestivalActivityPrivate(data:GS_FestivalActivityPrivate) {
        this._data = data;
        this._leiChongTaskStateDic = {};
        this._leiChouTaskStateDic = {};
        this._dailyTaskStateDic = {};
        this._luckyValue = 0;
        this._ecxchangeShopStateDic = {};
        this._shopStateDic = {};
        this._xinYuanDic = {};
        this._materialItemDic = {};
        this._combinedDic = {};

        if (this._data.data1) {
            let item:GS_FestivalActivityPrivate_TaskItem;
            let len = this._data.data1.length;
            for (let i = 0 ; i < len ; i++) {
                item = this._data.data1[i];
                if (i < this._data.urechargetaskcount) {
                    this._leiChongTaskStateDic[item.ntaskid] = item;
                } else if (i < this._data.urechargetaskcount + this._data.uluckydrawtaskcount) {
                    this._leiChouTaskStateDic[item.ntaskid] = item;
                } else {
                    this._dailyTaskStateDic[item.ntaskid] = item;
                }
            }
        }

        if (this._data.data2) {
            let item:GS_FestivalActivityPrivate_ReceiveItem;
            let len = this._data.data2.length;
            const exchangeitemcount = this._data.uwishitemcount + this._data.uexchangeitemcount;
            const mallItemCount = exchangeitemcount + this._data.umallitemcount;
            const materialItemCount = mallItemCount + this._data.umaterialitemcount;
            const combinedItemCount = materialItemCount + this._data.ucombineditemcount;
            for (let i = 0 ; i < len ; i++) {
                item = this._data.data2[i];
                if (i < this._data.uwishitemcount) {
                    this._xinYuanDic[item.nid] = item;

                    let wishItem = this.getWishItem(item.nid);
                    if (wishItem) {
                        this._luckyValue += wishItem.nwishneednum * item.ntimes;
                    }

                } else if (i < exchangeitemcount) {
                    this._ecxchangeShopStateDic[item.nid] = item;
                } else if (i < mallItemCount) {
                    this._shopStateDic[item.nid] = item;
                } else if (i < materialItemCount) {
                    this._materialItemDic[item.nid] = item;
                } else if (i < combinedItemCount) {
                    this._combinedDic[item.nid] = item;
                }
            }
        }

        this.checkRedPoint();
        this.checkLeiChouRedPoint();
        this.checkLeiChongRedPoint();
        this.checkShopFree();
        this.checkSign();
    }

    //转盘返回
    private onFestivalActivityLuckyDrawPlayReward(data:GS_FestivalActivityLuckyDrawPlayReward) {
        this._data.nplaycount = data.nplaycount;
        this.checkLeiChouRedPoint();
        if (data.uitemcount == 1) {
            GameEvent.emit(EventEnum.ACTIVE_TAQING_CHOUKA_RET , data.itemlist[0].nid , data.itemlist[0].ngoodsnum);
        } else {
            let list:any[] = [];
            let luckyItem:GS_FestivalActivityConfig_LuckyItem;
            data.itemlist.forEach(element => {
                luckyItem = this._luckyItemsDic[element.nid];
                list.push({
                    sgoodsid : luckyItem ? luckyItem.ngoodsid : 0,			
	                sgoodsnum : element.ngoodsnum,
                })
            });
            
            UiManager.showDialog(EResPath.NEW_GOODS_VIEW2 , {list:list} );
            GameEvent.emit(EventEnum.ACTIVE_TAQING_CHOUKA_RET);
        }
    }

    //心愿单物品 已被领取
    private onDrawWishReward(data:GS_FestivalActivityLuckyDrawWishReward) {
        let item = this.getXinYuanItemState(data.nid);
        item.ntimes ++;

        let wishItem = this.getWishItem(item.nid);
        if (wishItem) {
            this._luckyValue += wishItem.nwishneednum;
        }
        GameEvent.emit(EventEnum.ACTIVE_TAQING_CHOUKA_RET , 0);
    }

    //累充任务奖励
    private onTaskReChargeReward(data:GS_FestivalActivityTaskReward) {
        let taskState = this.getTaskState(FestivalActivityTaskType.LeiChong , data.nid);
        if (taskState) {
            taskState.btgetreward = 1;
            this.checkLeiChongRedPoint();
            GameEvent.emit(EventEnum.ACTIVE_TAQING_LEI_CHONG_TASK_RET , data);
        }
    }

    //累抽任务奖励
    private onTaskLuckyDrawReward(data:GS_FestivalActivityTaskReward) {
        let taskState = this.getTaskState(FestivalActivityTaskType.LeiChou , data.nid);
        if (taskState) {
            taskState.btgetreward = 1;
            this.checkLeiChouRedPoint();
            GameEvent.emit(EventEnum.ACTIVE_TAQING_CHOUKA_TASK_RET , data);
        }
    }

    //单日任务奖励
    private onTaskDailyReward(data:GS_FestivalActivityTaskReward) {
        let taskData = this._dailyTaskDic[data.nid];
        if (taskData) {
            // this._data.nexchangegoodscount += taskData.nrewardexchangenum || 0;
            // GameEvent.emit(EventEnum.ACTIVE_TAQING_REFREST_EXCHANGE_GOODS_COUNT);
        }
        let taskState = this.getTaskState(FestivalActivityTaskType.Daily , data.nid);
        if (taskState) {
            taskState.btgetreward = 1;
            this.checkRedPoint();
            GameEvent.emit(EventEnum.ACTIVE_TAQING_DAILY_TASK_RET , data);
        }
    }
    
    //兑换物品 已被领取
    private onExchangeReward(data:GS_FestivalActivityExchangeReward) {
        let state = this.getExchangeShopItemState(data.nid);
        state.ntimes += data.nnum;

        let itemConfig = this._exchangeGoodsDic[data.nid];
        if (itemConfig) {
            this._data.nexchangegoodscount -= itemConfig.nprice;
        }
        
        GameEvent.emit(EventEnum.ACTIVE_TAQING_EXCHANGE_RET , data);
    }

    //RMB订单
    private onRmbOrder(data:GS_FestivalActivityRmbOrder) {
        Game.mallProto.payOrder(data.szorder);
    }

    //一个 商城礼包 已被购买领取
    private onMallReward(data:GS_FestivalActivityMallReward) {
        let state = this.getShopItemState(data.nid);
        state.ntimes ++;
        this.checkShopFree();
        this._data.npricecount =  data.npricecount;
        this.checkLeiChongRedPoint();
        GameEvent.emit(EventEnum.ACTIVE_TAQING_MALL_RET , data);
        GameEvent.emit(EventEnum.ACTIVE_TAQING_LEI_CHONG_TASK_RET);
    }

    //节日活动关闭了
    private onFestivalActivityClose(data:GS_FestivalActivityClose) {
        GameEvent.emit(EventEnum.ACTIVE_TAQING_CLOSE);
    }

    //更新玩家的 单日任务 配置（跨天时触发）
    private onTaskDailyUpdate(data:GS_FestivalActivityTaskDailyUpdate) {
        this._dailyTasks.length = 0;
        this._dailyTaskStateDic = {};
        this._dailyTaskDic = {};

        if (data.data1 && data.udailytaskcount > 0) {
            for (let i = 0 ; i < data.udailytaskcount ; i++) {

                let item:GS_FestivalActivityConfig_Task = new GS_FestivalActivityConfig_Task();
                Utils.copyMsgObjPro(item , data.data1[i]);

                this._dailyTasks.push(item);
                this._dailyTaskDic[item.nid] = item;
            }
        }
        this.checkRedPoint();
        GameEvent.emit(EventEnum.ACTIVE_TAQING_DAILY_TASK_RET);

    }

    private onUpdatePriceCount(data:GS_FestivalActivityUpdatePriceCount) {
        this._data.npricecount = data.npricecount;
        this.checkLeiChongRedPoint();
        GameEvent.emit(EventEnum.ACTIVE_TAQING_LEI_CHONG_TASK_RET);
    }

    private onUpdateTaskDaily(data:GS_FestivalActivityUpdateTaskDaily) {
        let state = this.getTaskState(FestivalActivityTaskType.Daily , data.nid);
        state.unowvalue = data.nnowvalue;
        this.checkRedPoint();
        GameEvent.emit(EventEnum.ACTIVE_TAQING_DAILY_TASK_RET);
    }

    private onActivitySignReward(data:GS_FestivalActivitySignReward) {
        if (this._data) {
            this._data.nsignday[data.nday] = 1;
        }
        this.checkSign();
        GameEvent.emit(EventEnum.ACTIVE_TAQING_SIGN);
    }

    private onActivitySignVideoOrder(data:GS_FestivalActivitySignVideoOrder) {
        Game.nativeApi.showRewardAd(Game.actorMgr.nactordbid.toString() , data.szorder , data.szsdkkey);
    }

    /**
     * 合成返回
     * @param data 
     */
    private onActivitySignCombineOK(data:GS_FestivalActivityCombineOK) {
        this.clearCombing();
        if (data.nid > 0) {
            let combineState = this.getCombinedState(data.nid);
            combineState.ntimes ++;
        } else {
            SystemTipsMgr.instance.notice('合成失败');
            // GameEvent.emit(EventEnum.ACTIVE_TAQING_HECHENG_FAIL);
        }
        GameEvent.emit(EventEnum.ACTIVE_TAQING_HECHENG_SUCCESS);
    }

    private onActivityCombineReward(data:GS_FestivalActivityCombineReward) {
        this._data.btcombinegetreward = 1;
        GameEvent.emit(EventEnum.ACTIVE_TAQING_HECHENG_REWARD);
    }

    private checkRedPoint() {
        let flag = false;
        let len = this._dailyTasks.length;
        for (let i = 0 ; i < len ; i++) {
            let item = this._dailyTasks[i];
            if (item) {
                let state = this.getTaskState(FestivalActivityTaskType.Daily , item.nid);
                flag = state && state.btgetreward == 0 && state.unowvalue >= item.ufinishtimes;
                Game.redPointSys.setRedPointNumSub(EVENT_REDPOINT.FESTIVAL_ACTIVE_TASK_ITEM , item.nid.toString() , flag ? 1 : 0);
            }
        }
    }

    private checkLeiChongRedPoint() {
        let flag = false;
        let len = this._leiChongTasks.length;
        for (let i = 0 ; i < len ; i++) {
            let item = this._leiChongTasks[i];
            if (item) {
                let state = this.getTaskState(FestivalActivityTaskType.LeiChong , item.nid);
                flag =  (state && state.btgetreward == 0 && this.getLeiChongCount() >= item.utargetvalue);
                Game.redPointSys.setRedPointNumSub(EVENT_REDPOINT.FESTIVAL_ACTIVE_LEICHONG_ITEM , item.nid.toString() ,  flag ? 1 : 0);
            }
        }

        
    }

    private checkLeiChouRedPoint() {
        let flag = false;
        let len = this._leiChouTasks.length;
        for (let i = 0 ; i < len ; i++) {
            let item = this._leiChouTasks[i];
            if (item) {
                let state = this.getTaskState(FestivalActivityTaskType.LeiChou , item.nid);
                flag =  (state && state.btgetreward == 0 && this.getLeiChouCount() >= item.utargetvalue);
                Game.redPointSys.setRedPointNumSub(EVENT_REDPOINT.FESTIVAL_ACTIVE_LEICHOU_ITEM , item.nid.toString() ,  flag ? 1 : 0);

            }
        }
    }

    private checkSign() {
        if (!this._config || !this._config.sign || !this._data || this._config.nvalidday < 7) return;
        let len = this._config.sign.rewarditemlist ? Math.floor(this._config.sign.rewarditemlist.length *0.5) : 0;
        let curDay = this.getCurDay();
        let flag = false;
        for (let i = 0 ; i < len ; i ++) {
            flag = (i <= curDay && !this._data.nsignday[i]);
            Game.redPointSys.setRedPointNumSub(EVENT_REDPOINT.FESTIVAL_ACTIVE_SIGN_ITEM , i.toString() ,  flag ? 1 : 0);
        }
    }

    private checkShopFree() {
        if (!this._config || !this._data) return;
        let len = this._config.data3 ?  this._config.data3.length : 0;
        let flag = false;
        let item:GS_FestivalActivityConfig_MallItem;
        for (let i = 0 ; i < len ; i++) {
            item = this._config.data3[i];

            if (item.nprice == 0 ) {
                let state = this.getShopItemState(item.nid);
                if (state.ntimes < item.nlimitbuynum) {
                    flag = true;
                }
                break;
            }
        }

        Game.redPointSys.setRedPointNum(EVENT_REDPOINT.FESTIVAL_ACTIVE_SHOP_GIFT_FREE , flag ? 1 : 0);
    }

    private onAcrossDay() {
        this.checkSign();
    }
    
}