// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseNetHandler from "../socket/handler/BaseNetHandler";
import { CMD_ROOT, GS_PLAZA_MSGID, MALL_LIMITTYPE, MALL_PRICETYPE } from "../socket/handler/MessageEnum";
import { GS_MALLTIPS, GS_PLAZA_MALL_MSG, GS_MallGoodsList, GS_MallListGoodsList, GS_MallUpListGoods, GS_MallPrivateData, GS_MallUpDatePrivateData, GS_MallRmbOrder, GS_MallSetFreeVideo, GS_MallSetAddFreeVideo, GS_MallGetFreeVideo, GS_MallTips, GS_MallBuy, GS_MallRandListGoodsList, GS_MallPrivateData_MallPrivateData, GS_MallRandListGoodsList_MallRandListTagItem, GS_MallRMBBuy, GS_MallGetAddFreeVideo, GS_MallGoodsList_MallGoodsItem, GS_MallListGoodsList_MallListGoodsItem, GS_MallListGoodsList_MallListTagItem, GS_MallNormallBuyHistory, GS_MallNormallBuyHistoryAdd, GS_MallUpRandGoods } from "../proto/DMSG_Plaza_Sub_Mall";
import { Handler } from "../../utils/Handler";
import Game from "../../Game";
import SystemTipsMgr from "../../utils/SystemTipsMgr";
import { GameEvent } from "../../utils/GameEvent";
import { EventEnum } from "../../common/EventEnum";
import { StringUtils } from "../../utils/StringUtils";
import HttpControl from "../http/HttpControl";
import GlobalVal, { SDK_CHANNEL, ServerType } from "../../GlobalVal";
import { BuryingPointMgr, EBuryingPoint } from "../../buryingPoint/BuryingPointMgr";
import { UiManager } from "../../utils/UiMgr";
import { EResPath } from "../../common/EResPath";
import Debug from "../../debug";
import { EVENT_REDPOINT } from "../../redPoint/RedPointSys";
import { ShopIndex } from "../../ui/shop/ShopView";
import SysMgr from "../../common/SysMgr";
import { md5 } from "../../libs/encrypt/md5";
const { ccclass, property } = cc._decorator;

const TIPS = {
    [GS_MALLTIPS.MALLTIPS_BUYSUCCESS]: "购买成功",
    [GS_MALLTIPS.MALLTIPS_NOPACKET]: "背包出现异常",
    [GS_MALLTIPS.MALLTIPS_NODIAMONDS]: "钻石不足",
    [GS_MALLTIPS.MALLTIPS_GOOSMAX]: "物品数量达到上限",
    [GS_MALLTIPS.MALLTIPS_ADDSTRENGTHERROR]: "扣除体力失败(需要联系GM解决)",
    [GS_MALLTIPS.MALLTIPS_ADDDIAMONDSERROR]: "扣除钻石失败(需要联系GM解决)",
    [GS_MALLTIPS.MALLTIPS_ADDGOODSERROR]: "添加物品失败(需要联系GM解决)",
    [GS_MALLTIPS.MALLTIPS_DBERROR]: "数据库异常",
    [GS_MALLTIPS.MALLTIPS_NOVIPLEVEL]: "VIP等级不够",
    [GS_MALLTIPS.MALLTIPS_NOSTARTTIME]: "售卖还未开始",
    [GS_MALLTIPS.MALLTIPS_ENDTIME]: "售卖已经结束",
    [GS_MALLTIPS.MALLTIPS_NOGOODS]: "物品不存在或者已经下架",
    [GS_MALLTIPS.MALLTIPS_MAXBUYCOUNT]: "已经达到最大购买次数",
    [GS_MALLTIPS.MALLTIPS_NOBUY]: "无法购买(某种条件没达到)",
    [GS_MALLTIPS.MALLTIPS_NONEEDGOODS]: "消耗物品不存在或者不足",
    [GS_MALLTIPS.MALLTIPS_NOMALLPART]: "用户的商城数据异常",
    [GS_MALLTIPS.MALLTIPS_TIMELIMIT]: "时间限制不能购买",
    [GS_MALLTIPS.MALLTIPS_LOCKDIAMODS]: "上一个钻石操作还未完成",
}

const RECHARGE_TIPS = {
    "0": "未满8周岁的用户无法充值",
    "1": "8-16周岁的用户单次充值金额不超过50元",
    "2": "8-16周岁的用户每月充值不超过200元",
    "3": "16-18周岁的用户单次充值金额不超过100元",
    "4": "16-18周岁的用户每月充值不超过400元",
    "5": "8-16可以充值",
    "6": "16-18可以充值",
    "7": "已成年可以充值",
    "8": "未实名认证无法充值",
    "9": "令牌无效",
    "10": "不需要实名"
}

//常规商品标签ID
export enum TAGID {
    PROP = 1,                           //道具
    TILI = 2,                           //体力
    TEHUI_1 = 11,                               //特惠推荐位1
    TEHUI_2 = 12,                        //特惠推荐位2
    TEHUI_3 = 13,                        //特惠推荐位3
    TEHUI_4 = 14,                        //特惠推荐位4
    TREATRUE_1 = 21,                     //宝箱推荐位1
    TREATRUE_2 = 22,                     //宝箱推荐位2
    TREATRUE_3 = 23,                     //宝箱推荐位3,
    TREATRUE_4 = 24,                     //宝箱推荐位4
    MALL_ENERGY = 41,                    //能量
    MALL_DIAMOND = 51,                   //砖石
    RED_PACKET = 4,                        //红包兑换
    MALL_KEY = 61,                          //钥匙
    MALL_ZHAOCAI = 71,                      //招财券
}

//随机商品标签ID
export enum RAND_TAGID {
    //TEHUI_1 = 11,                        //特惠推荐位1
    TEHUI_4 = 14,                        //特惠推荐位4
    SKIN_1 = 31,                           //皮肤推荐位1
    SKIN_2 = 32,                           //皮肤推荐位2              
    SKIN_3 = 33,                           //皮肤推荐位3
}

/**链式标签页 */
export enum LIST_TAGID {
    STAR_BOX = 3,                       //攒星开宝箱,
}

const MALL_TAG = "商城：";

export default class MallProto extends BaseNetHandler {
    _goodList: GS_MallGoodsList = null;                     //常规商品数据
    _listGoodList: GS_MallListGoodsList = null;             //链式商品数据
    _tagList: object = null;                                  //根据标签分类的常规商品数据
    _randGoodList: GS_MallRandListGoodsList = null;         //随机商品数据
    _randTagList: object = null;                              //根据标签分类的随机商品数据
    _mallPrivateData: GS_MallPrivateData = null;            //用户商城私有数据
    _sortedMallPrivateDate: object = null;                    //根据商品ID分类的商城私有数据

    private _normallBuyHistory: Array<number> = null;//普通商品购买历史记录

    private _mallItemInfoDic: any = null;

    // private box1LeftTime: number = 0;
    private box3LeftTime: number = 0;

    private isPrivateDataInit: boolean = false;
    private isGoodListInit: boolean = false;
    private isScheduled: boolean = false;

    constructor() {
        super(CMD_ROOT.CMDROOT_PLAZA_MSG, GS_PLAZA_MSGID.GS_PLAZA_MSGID_MALL);
        this.resetData();
    }

    register() {
        //s->c
        this.registerAnaysis(GS_PLAZA_MALL_MSG.PLAZA_MALL_GOODSLIST, Handler.create(this.onGoodsList, this), GS_MallGoodsList);
        this.registerAnaysis(GS_PLAZA_MALL_MSG.PLAZA_MALL_LISTGOODSLIST, Handler.create(this.onListGoodsList, this), GS_MallListGoodsList);
        this.registerAnaysis(GS_PLAZA_MALL_MSG.PLAZA_MALL_UPLISTGOODS, Handler.create(this.onUpGoodsList, this), GS_MallUpListGoods);
        this.registerAnaysis(GS_PLAZA_MALL_MSG.PLAZA_MALL_PRIVATEDATA, Handler.create(this.onPrivateData, this), GS_MallPrivateData);
        this.registerAnaysis(GS_PLAZA_MALL_MSG.PLAZA_MALL_UPPRIVATEDATA, Handler.create(this.onUpPrivateData, this), GS_MallUpDatePrivateData);
        this.registerAnaysis(GS_PLAZA_MALL_MSG.PLAZA_MALL_RANDLISTGOODSLIST, Handler.create(this.onRandListGoods, this), GS_MallRandListGoodsList);

        this.registerAnaysis(GS_PLAZA_MALL_MSG.PLAZA_MALL_RMBORDER, Handler.create(this.onRmbOrder, this), GS_MallRmbOrder);
        this.registerAnaysis(GS_PLAZA_MALL_MSG.PLAZA_MALL_TIPS, Handler.create(this.onTips, this), GS_MallTips);
        this.registerAnaysis(GS_PLAZA_MALL_MSG.PLAZA_MALL_RETFREEVIDEOORDER, Handler.create(this.onRetFreeVideoOrder, this), GS_MallSetFreeVideo);
        this.registerAnaysis(GS_PLAZA_MALL_MSG.PLAZA_MALL_RETADDFREEVIDEOORDER, Handler.create(this.onRetAddFreeVideoOrder, this), GS_MallSetAddFreeVideo);
        this.registerAnaysis(GS_PLAZA_MALL_MSG.PLAZA_MALL_NORMALLBUYHISTORY, Handler.create(this.onNomalBuyHistory, this), GS_MallNormallBuyHistory);
        this.registerAnaysis(GS_PLAZA_MALL_MSG.PLAZA_MALL_NORMALLBYTHISTORYADD, Handler.create(this.onNomalBuyHistoryAdd, this), GS_MallNormallBuyHistoryAdd);
        this.registerAnaysis(GS_PLAZA_MALL_MSG.PLAZA_MALL_UPRANDGOODS, Handler.create(this.onUpRandgoods, this), GS_MallUpRandGoods);
    }

    exitGame() {
        //重置数据
        this.resetData();
    }

    resetData() {
        this._mallItemInfoDic = {};

        // this.box1LeftTime = 0;
        this.box3LeftTime = 0;

        this.isPrivateDataInit = false;
        this.isGoodListInit = false;
        this.isScheduled = false;

        //取消商城定时器
        SysMgr.instance.clearTimer(Handler.create(this.update , this) , true);
        // let schedule = cc.director.getScheduler();
        // schedule.enableForTarget(this);
        // schedule.unscheduleUpdate(this);
    }

    selectBuyKey(goodsid:number) {
        let list:GS_MallGoodsList_MallGoodsItem[] = Game.mallProto.getGoodListByTagId(TAGID.MALL_KEY);
        let len = list.length;
        for (let i = 0; i < len; i++) {
            const element = list[i];
            if (element.ngoodsid == goodsid) {

                if (element.npricenums == 0) {
                    SystemTipsMgr.instance.notice("需要购买钥匙开启宝箱");
                    GameEvent.emit(EventEnum.CHANGE_SHOP_TAP , ShopIndex.YAOSHI);
                } else {
                    UiManager.showDialog(EResPath.SELECT_BUY_KEY_DIALOG , {value:element.npricenums ,picid:element.npicid , callback: new Handler(this.selectBuy , this , element) })
                }

                break;
            }
        }
    }

    private selectBuy(arg:GS_MallGoodsList_MallGoodsItem) {
        if (arg) {
            this.buy(arg.nrid);
        }
    }

    /**
     * 新增一个已经购买过的商品历史记录
     * @param data GS_MallNormallBuyHistoryAdd
     */
    private onNomalBuyHistoryAdd(data: GS_MallNormallBuyHistoryAdd) {
        Debug.log(MALL_TAG, "新增商品历史记录", data);
        this._normallBuyHistory = this._normallBuyHistory || [];
        let index = this._normallBuyHistory.indexOf(data.nrid);
        if (index == -1) {
            this._normallBuyHistory.push(data.nrid);
        }

        this.refreshShopDoubleRecharge();
    }

    /**
     * 下发更新单个随机链式商品
     * @param data GS_MallUpRandGoods
     */
    private onUpRandgoods(data: GS_MallUpRandGoods) {
        Debug.log(MALL_TAG, "更新单个随机链式商品", data);

    }

    /**
     * 已经购买过的商品历史记录
     * @param data GS_MallNormallBuyHistory
     */
    private onNomalBuyHistory(data: GS_MallNormallBuyHistory) {
        Debug.log(MALL_TAG, "购买过的商品历史记录", data);
        this._normallBuyHistory = data.ridlist || [];
        this.refreshShopDoubleRecharge();
    }

    /**
     * 物品rid是否存在历史记录中
     * @param rid number
     * @returns boolean
     */
    public isInNormallBuyHistory(rid: number): boolean {
        return this._normallBuyHistory && this._normallBuyHistory.indexOf(rid) != -1;
    }

    /**
     * 设置定时器，统计商城宝箱刷新时间
     * @returns 
     */
    private scheduleUpdate() {
        if (!this.isPrivateDataInit || !this.isGoodListInit || this.isScheduled) return;
        SysMgr.instance.doLoop(Handler.create(this.update , this) , 0.5 ,0, true);
        // let schedule = cc.director.getScheduler();
        // schedule.enableForTarget(this);
        // schedule.scheduleUpdate(this, cc.Scheduler.PRIORITY_NON_SYSTEM, false);
        this.isScheduled = true;
    }

    /**
     * 请求免费视频附加卡
     */
    reqGetAddFreeVideoOrder() {
        if (!GlobalVal.getCanReqFvTime()) return;
        GlobalVal.changeNextReqFvTime();

        let data: GS_MallGetAddFreeVideo = new GS_MallGetAddFreeVideo();
        this.send(GS_PLAZA_MALL_MSG.PLAZA_MALL_GETADDFREEVIDEOORDER, data);
    }


    /**
     * 随机商品列表
     * @param data 
     */
    private onRandListGoods(data: GS_MallRandListGoodsList) {
        Debug.log(MALL_TAG, "随机商品列表", data);
        this._randGoodList = data;
        this._randTagList = {};

        if (data.data2) {
            data.data2.forEach((value) => {
                if (!this._randTagList[value.utagid]) this._randTagList[value.utagid] = [];
                this._randTagList[value.utagid].push(value);
                //存入字典
                this._mallItemInfoDic[value.nrid] = value;
            });
        }

        GameEvent.emit(EventEnum.ON_RAND_LIST_GOODS);
    }

    /**
     * 常规商品列表
     * @param data 
     */
    private onGoodsList(data: GS_MallGoodsList) {
        Debug.log(MALL_TAG, "常规商品列表", data);
        this._goodList = data;
        this._tagList = {};

        if (data.data2) {
            data.data2.forEach((value) => {
                if (!this._tagList[value.utagid]) this._tagList[value.utagid] = [];
                this._tagList[value.utagid].push(value);
                //存入字典
                this._mallItemInfoDic[value.nrid] = value;
            });
        }
        this.isGoodListInit = true;
        this.scheduleUpdate();
        this.refreshShopDoubleRecharge();
    }

    /**
     * 链式商品列表
     * @param data 
     */
    private onListGoodsList(data: GS_MallListGoodsList) {
        Debug.log(MALL_TAG, "链式商品列表", data);
        this._listGoodList = data;

        if (data.data2 && data.data2.length > 0) {
            data.data2.forEach(element => {
                this._mallItemInfoDic[element.nrid] = element;
            });
        }
    }

    /**
     * 下发更新单个链式商品
     * @param data 
     */
    private onUpGoodsList(data: GS_MallUpListGoods) {
        Debug.log(MALL_TAG, "下发更新单个链式商品", data);
        let len = this._listGoodList.data2 ? this._listGoodList.data2.length : 0;
        for (let i = len - 1; i >= 0; i--) {
            if (this._listGoodList.data2[i].utagid == data.utagid) {
                this._listGoodList.data2.splice(i, 1);
                break;
            }
        }

        let listGoodsItem: GS_MallListGoodsList_MallListGoodsItem = new GS_MallListGoodsList_MallListGoodsItem();
        listGoodsItem.utagid = data.utagid;
        listGoodsItem.nrid = data.nrid;
        listGoodsItem.ndefpaykeyflag = data.ndefpaykeyflag;
        listGoodsItem.npaykeyflag = data.npaykeyflag;
        listGoodsItem.sztitle = data.sztitle;
        listGoodsItem.szdes = data.szdes;
        listGoodsItem.btquality = data.btquality;
        listGoodsItem.nlableflag = data.nlableflag;
        listGoodsItem.ngoodsid = data.ngoodsid;
        listGoodsItem.npicid = data.npicid;
        //listGoodsItem.sindex = listGoodsItem.sindex;			
        listGoodsItem.sboundcount = data.sboundcount;
        listGoodsItem.btdiscount = data.btdiscount;
        listGoodsItem.btpricetype = data.btpricetype;
        listGoodsItem.npricegoodsid = data.npricegoodsid;
        listGoodsItem.npricenums = data.npricenums;
        //listGoodsItem.nbuyspacetimes = data.nbuyspacetimes;			
        listGoodsItem.ngivegoodsid = data.ngivegoodsid;
        listGoodsItem.ngivegoodsnum = data.ngivegoodsnum;

        this._listGoodList.data2.push(listGoodsItem);

        this._mallItemInfoDic[listGoodsItem.nrid] = listGoodsItem;

        GameEvent.emit(EventEnum.MALL_LIST_GOODS_UPDATE, data);
    }

    /**
     * 用户商城购买的私有数据
     * @param data 
     */
    private onPrivateData(data: GS_MallPrivateData) {
        Debug.log(MALL_TAG, "用户商城购买的私有数据", data);
        this._mallPrivateData = data;
        this._sortedMallPrivateDate = {};

        if (data && data.uitemcount > 0) {
            data.data.forEach((element) => {
                this._sortedMallPrivateDate[element.nid] = element;
            });
        }
        this.isPrivateDataInit = true;
        this.scheduleUpdate();
        this.refreshBoxRedPoint();
        this.refreshTeHuiRedPoint();
        this.refreshNengLiang();
        GameEvent.emit(EventEnum.ON_MALL_PRIVATE_DATA);
    }

    /**
     * 下发更新单个私有数据
     * @param data 
     */
    private onUpPrivateData(data: GS_MallUpDatePrivateData) {
        Debug.log(MALL_TAG, "下发更新单个私有数据", data);
        if (!data) return;

        let privateData: GS_MallPrivateData_MallPrivateData = new GS_MallPrivateData_MallPrivateData();
        privateData.btidtype = data.btidtype;
        privateData.nbuycount = data.nbuycount;
        privateData.nid = data.nid;
        privateData.nnextbuytime = data.nnextbuytime;

        this._sortedMallPrivateDate[data.nid] = privateData;

        this.refreshBoxRedPoint();
        this.refreshTeHuiRedPoint();
        this.refreshNengLiang();
        GameEvent.emit(EventEnum.MALL_UPDATE_PRIVATE_DATA, privateData);
    }

    /**
     * RMB购买服务器返回订单号给予客户端
     * @param data 
     */
    private onRmbOrder(data: GS_MallRmbOrder) {
        Debug.log(MALL_TAG, "RMB购买服务器返回订单号给予客户端", data);
        if (!data) return cc.error("RMB购买服务器返回数据有误！");

        if (BuryingPointMgr.curPayType != null) {
            BuryingPointMgr.post(BuryingPointMgr.curPayType, JSON.stringify({ order: data.szorder }));
            BuryingPointMgr.curPayType = null;
        }

        this.payOrder(data.szorder);
    }

    public payOrder(orderNum: string) {
        if (GlobalVal.serverType == ServerType.LOCAL || GlobalVal.setRechargeFree) {
            this.modifyOrder(orderNum);
            // this.h5QueryOrderInfo(orderNum);
        } else {
            switch (Game.nativeApi.getSdkChannel()) {
                case SDK_CHANNEL.MI_GAME:
                    this.miGameQueryOrderInfo(orderNum);
                    break;
                case SDK_CHANNEL.XIAN_XIAN:
                    this.xxGameQueryOrderInfo(orderNum);
                    break;
                case SDK_CHANNEL.CHUKONG:
                    this.ckGameQueryOrderInfo(orderNum);
                    break;
            }
        }
    }

    private h5QueryOrderInfo(orderId:string) {
        let obj = {
            is_open:1,
            order_num: orderId,
            goods_name:"",
        };

        let dataStr = "";
        let url = '';
        Object.keys(obj).forEach(key => {
            dataStr += key + "=" + (true ? encodeURI(obj[key]) : obj[key]) + "&";
        });
        if(dataStr != ""){
            dataStr = dataStr.substr(0, dataStr.lastIndexOf("&"));
            url += "?" + dataStr;
        }
        url = GlobalVal.WAP_PAY + url;
        UiManager.showDialog(EResPath.H5_PAY_VIEW, url);
    }

    /**
     * 西柚查询订单信息
     * @param orderId 
     */
    private miGameQueryOrderInfo(orderId: string) {
        let obj = {
            order: orderId,
            sign: md5(orderId + GlobalVal.TOKEN_FLAG)
        };

        HttpControl.post(GlobalVal.ORDER_INFO_URL, obj, (suc: boolean, ret: string | any) => {
            cc.log("查询订单信息返回:", suc, JSON.stringify(ret));
            if (suc) {
                if (ret.status == 1 && ret.info) {
                    ret.info.setServerId = "1";//区服id（以后分服备用）
                    Game.nativeApi.payOrder(JSON.stringify(ret.info));
                }
            }
        }, true);
    }

    /**
     * 闲闲查询订单信息
     * @param orderId 
     */
    private xxGameQueryOrderInfo(orderId: string) {
        let obj = {
            order: orderId,
            sign: md5(orderId + GlobalVal.TOKEN_FLAG)
        };

        HttpControl.post(GlobalVal.XX_ORDER_INFO_URL, obj, (suc: boolean, ret: string | any) => {
            cc.log("查询订单信息返回:", suc, JSON.stringify(ret));
            if (suc) {
                if (ret.status == 1 && ret.info) {
                    Game.nativeApi.payOrder(JSON.stringify(ret.info));
                }
            }
        }, true);
    }

    /**
     * 触控查询订单信息
     * @param orderId 
     */
    private ckGameQueryOrderInfo(orderId: string) {
        let obj = {
            order: orderId,
            sign: md5(orderId + GlobalVal.TOKEN_FLAG)
        };

        HttpControl.post(GlobalVal.CK_ORDER_INFO_URL, obj, (suc: boolean, ret: string | any) => {
            cc.log("查询订单信息返回:", suc, JSON.stringify(ret));
            if (suc) {
                if (ret.status == 1 && ret.info) {
                    ret.info.orderId=orderId;
                    Game.nativeApi.payOrder(JSON.stringify(ret.info));
                }
            }
        }, true);
    }

    /**
     * 提示客户端
     * @param data 
     */
    private onTips(data: GS_MallTips) {
        Debug.log(MALL_TAG, "商城提示:", TIPS[data.stipsid]);
        SystemTipsMgr.instance.notice(TIPS[data.stipsid]);
    }

    /**
     * 下发免费视频订单
     * @param data 
     */
    private onRetFreeVideoOrder(data: GS_MallSetFreeVideo) {
        Debug.log(MALL_TAG, "免费视频订单", data);
        if (BuryingPointMgr.curShopBuryingType != null) {
            BuryingPointMgr.post(BuryingPointMgr.curShopBuryingType, JSON.stringify({ order: data.szorder, rid: data.nrid }));
            BuryingPointMgr.curShopBuryingType = null;
        }
        Game.nativeApi.showRewardAd(Game.actorMgr.nactordbid.toString(), data.szorder , data.szsdkkey);
    }

    /**
     * 下发免费视频订单(附加卡)
     * @param data 
     */
    private onRetAddFreeVideoOrder(data: GS_MallSetAddFreeVideo) {
        Debug.log(MALL_TAG, "下发免费视频订单", data);
        BuryingPointMgr.post(EBuryingPoint.TOUCH_ADD_CARD, JSON.stringify({ order: data.szorder }));
        Game.nativeApi.showRewardAd(Game.actorMgr.nactordbid.toString(), data.szorder , data.szsdkkey);
    }

    /**
     * 购买
     * @param nrid 
     */
    buy(nrid: number) {
        if (BuryingPointMgr.curShopBuryingType != null) {
            BuryingPointMgr.post(BuryingPointMgr.curShopBuryingType, JSON.stringify({ rid: nrid }));
            BuryingPointMgr.curShopBuryingType = null;
        }

        let data = new GS_MallBuy();
        data.nrid = nrid;
        this.send(GS_PLAZA_MALL_MSG.PLAZA_MALL_BUY, data);
    }


    /**
     * 人民币充值购买
     * @param nrid 
     */
    rmbBuy(nrid: number) {
        let data = new GS_MallRMBBuy();
        data.nrid = nrid;
        this.send(GS_PLAZA_MALL_MSG.PLAZA_MALL_RMBBUY, data);
    }

    /**
     * 获得免费视频订单
     */
    getFreeVideoOrder(nrid: number) {
        if (!GlobalVal.getCanReqFvTime()) return;
        GlobalVal.changeNextReqFvTime();
        let data: GS_MallGetFreeVideo = new GS_MallGetFreeVideo();
        data.nrid = nrid;
        this.send(GS_PLAZA_MALL_MSG.PLAZA_MALL_GETFREEVIDEOORDER, data);
    }

    /**
     * 通过页签id获取goodlist
     * @param tagId 
     */
    getGoodListByTagId(tagId: TAGID): Array<GS_MallGoodsList_MallGoodsItem> {
        if (!this._goodList) return [];
        return this._tagList[tagId];
    }

    getGoodsConfig(goodsId: number, tagId: number = TAGID.PROP): any {
        let list = this.getGoodListByTagId(tagId);
        if (list) {
            for (let i = 0, len = list.length; i < len; i++) {
                if (list[i].ngoodsid == goodsId) {
                    return list[i];
                }
            }
        }

        return null;
    }

    /**
     * 通过商品唯一id获取商品配置
     * @param rid 
     */
    getGoodsInfoByRid(rid: number): any {
        return this._mallItemInfoDic[rid];
    }

    /**
     * 通过标签ID获取随机商品列表
     * @param tagId 
     */
    getRandGoodListByTagId(tagId: RAND_TAGID): Array<any> {
        if (!this._randGoodList) return [];
        return this._randTagList[tagId];
    }

    /**
     * 通过标签ID获取随机商品的标签配置
     * @param tagId 
     */
    getRandGoodTagCfg(tagId: RAND_TAGID): GS_MallRandListGoodsList_MallRandListTagItem {
        if (this._randGoodList) {
            for (let v of this._randGoodList.data1) {
                if (tagId == v.uid) {
                    return v;
                }
            }
        }
        return null;
    }

    /**
     * 通关链式标签id获取
     * @param tagid 
     */
    getListGoodsByTagID(tagid: LIST_TAGID): GS_MallListGoodsList_MallListGoodsItem {
        let len = this._listGoodList.data2.length;
        for (let i = 0; i < len; i++) {
            let item: GS_MallListGoodsList_MallListGoodsItem = this._listGoodList.data2[i];
            if (item.utagid == tagid) {
                return item;
            }
        }
        return null;
    }

    /**
     * 获取链标签属性
     * @param tagid 
     */
    getListTag(tagid: LIST_TAGID): GS_MallListGoodsList_MallListTagItem {
        let len = this._listGoodList.data1.length;
        for (let i = 0; i < len; i++) {
            let item: GS_MallListGoodsList_MallListTagItem = this._listGoodList.data1[i];
            if (item.uid == tagid) {
                return item;
            }
        }
        return null;
    }

    /**
     * 通过id获取商品私有数据
     * @param rnid 
     */
    public getUpdataPrivateDataById(rnid: number): GS_MallPrivateData_MallPrivateData {
        return this._sortedMallPrivateDate[rnid];
    }

    /**
     * 检测商品是否允许购买
     * @param nrid 
     * @param priceType 
     */
    public checkPrivateGoodsTime(nrid: number, priceType, enableTips: boolean = true): boolean {
        let privateData = Game.mallProto.getUpdataPrivateDataById(nrid);
        if (!privateData) return true;
        let now = GlobalVal.getServerTime() / 1000;
        let nextTime = privateData.nnextbuytime;
        let dt = now - nextTime;
        let enable = dt >= 0 ? true : false;
        let tipsStr = "";
        if (!enable && enableTips) {
            tipsStr = StringUtils.doInverseTime(Math.abs(dt));
            if (priceType == MALL_PRICETYPE.MALL_PRICETYPE_DIAMONDS) {
                tipsStr += "后可再次购买！";
            } else if (priceType == MALL_PRICETYPE.MALL_PRICETYPE_FREEVIDEO) {
                tipsStr += "后可再次观看！";
            }
            SystemTipsMgr.instance.notice(tipsStr);
        }
        return enable;
    }

    /**
     * 获取商城物品的刷新剩余时间
     * @param nrid 
     * @returns 
     */
    public getPrivateGoodTime(nrid: number): number {
        let privateData = Game.mallProto.getUpdataPrivateDataById(nrid);
        if (!privateData) return 0;
        let now = GlobalVal.getServerTime() / 1000;
        let nextTime = privateData.nnextbuytime;
        let t = nextTime - now;
        return t >= 0 ? t : 0;
    }

    /**
     * 获取物品剩余购买次数
     * @param nrid 
     */
    public getGoodsRestBuyCount(nrid: number): number {
        let privateData = this.getUpdataPrivateDataById(nrid);
        let goodCfg = this.getGoodsInfoByRid(nrid);
        if (!goodCfg) return 0;
        return goodCfg.nlimitbuycount - (privateData ? privateData.nbuycount : 0);
    }

    /**
     * 请求能否进行充值
     * @param uid 
     * @param rmb 
     */
    private reqRecharge(uid: string, rmb: number, callback: Function) {
        // return callback && callback.call(null, true);
        let token: string = md5(uid + GlobalVal.TOKEN_FLAG);
        Debug.log(MALL_TAG, "令牌：", token);
        let data = { user_id: uid, rmb: rmb.toFixed(2), token: token };
        HttpControl.get(GlobalVal.RECHARGE_URE, data, (suc: boolean, ret: string | any) => {
            Debug.log(MALL_TAG, "请求能否进行充值返回", suc, ret);
            if (!suc) {
                SystemTipsMgr.instance.notice("请求充值失败");
            } else {
                if (ret.status == 0) {
                    SystemTipsMgr.instance.notice(RECHARGE_TIPS[ret.tipid]);
                }
                callback && callback.call(null, ret.status == 1);
                GameEvent.emit(EventEnum.CAN_PAY, ret.status == 1);
            }
        }, true);
    }

    /**
     * 网页支付
     */
    private h5Pay(url) {
        //由于ios平台下引擎webview的setOnJSCallback回调时机不对，iOS平台使用原生webview支付
        if (cc.sys.os == cc.sys.OS_IOS) {
            Game.nativeApi.openWebView(url);
        } else {
            UiManager.showDialog(EResPath.H5_PAY_VIEW, url);
        }
    }

    /**
     * 修改订单
     * @param orderNum 
     */
    public modifyOrder(orderNum) {
        Debug.log(MALL_TAG, "请求修改订单：", orderNum);

        let data = {
            order_num: orderNum,
            sign: md5(orderNum + GlobalVal.TOKEN_FLAG)
        };

        HttpControl.post(GlobalVal.MODIFY_ORDER, data, this.onModifyOrder, true);
    }

    private onModifyOrder(suc: boolean, ret: string | any) {
        Debug.log(MALL_TAG, "修改订单返回", suc, ret);
    }

    private update() {
        let treatureData = Game.mallProto.getGoodListByTagId(TAGID.TREATRUE_1);
        let data: GS_MallGoodsList_MallGoodsItem = null;
        let t = 0;
        if (treatureData) {
            data = treatureData[0];
            if (data.btpricetype == MALL_PRICETYPE.MALL_PRICETYPE_FREEVIDEO) {
                if (this.refreshLimitTimeItemRd(data.nrid , EVENT_REDPOINT.SHOP_BOX_PUTONG)) {
                    //提示
                    // SystemTipsMgr.instance.showCommentTips(EResPath.SHOP_TREATURE_TIPS, treatureData[0].npicid);
                }
            }
        }

        treatureData = this.getGoodListByTagId(TAGID.TREATRUE_2);
        if (treatureData) {
            t = this.getPrivateGoodTime(treatureData[0].nrid);
            if (this.box3LeftTime > 0 && t <= 0) {
                //提示
                SystemTipsMgr.instance.showCommentTips(EResPath.SHOP_TREATURE_TIPS, treatureData[0].npicid);
                this.refreshBoxRedPoint();
            }
            this.box3LeftTime = t;
        }

        

        this.refreshTeHuiRedPoint();
        this.refreshNengLiang();
    }

    private refreshNengLiang() {
        let tempData = Game.mallProto.getGoodListByTagId(TAGID.MALL_ENERGY);
        if (tempData) {
            this.refreshLimitTimeItemRd(tempData[0].nrid , EVENT_REDPOINT.SHOP_NENGLIANG_FREE);
        }
    }

    /**
     * 刷新至尊宝箱的红点
     */
    private refreshBoxRedPoint() {
        let treatureData = this.getGoodListByTagId(TAGID.TREATRUE_2);
        if (treatureData && treatureData[0].btpricetype == MALL_PRICETYPE.MALL_PRICETYPE_FREE_DIAMONDS) {
            let redPointNode = Game.redPointSys.findRedPointNode(EVENT_REDPOINT.SHOP_BOX_ZHIZHUN);
            let t = this.getPrivateGoodTime(treatureData[0].nrid);
            if (redPointNode) {
                redPointNode.setRedPointNum(t <= 0 ? 1 : 0);
            }
        }
    }

    private refreshTeHuiRedPoint() {
        let tempData = Game.mallProto.getGoodListByTagId(TAGID.TEHUI_2);
        if (tempData) {
            this.refreshLimitTimeItemRd(tempData[0].nrid , EVENT_REDPOINT.SHOP_TEHUI_DIAMOND);
        }

        tempData = Game.mallProto.getGoodListByTagId(TAGID.TEHUI_3);
        if (tempData) {
            this.refreshLimitTimeItemRd(tempData[0].nrid , EVENT_REDPOINT.SHOP_TEHUI_NENGLIANG);
        }

        tempData = Game.mallProto.getGoodListByTagId(TAGID.TEHUI_4);
        if (tempData) {
            this.refreshLimitTimeItemRd(tempData[0].nrid , EVENT_REDPOINT.SHOP_TEHUI_YAOQINGQUAN);
        }

        tempData = this.getGoodListByTagId(TAGID.MALL_KEY);
        if (tempData) {
            let flag = this.refreshLimitTimeItemRd(tempData[0].nrid , EVENT_REDPOINT.SHOP_KEY_PUTONG);
        }

        tempData = this.getGoodListByTagId(TAGID.MALL_ZHAOCAI);
        if (tempData) {
            let flag = this.refreshLimitTimeItemRd(tempData[0].nrid , EVENT_REDPOINT.SHOP_ZHAOCAI_PUTONG);
        }
    }

    private refreshLimitTimeItemRd(rid:number , type:string):boolean {
        let redPointNode = Game.redPointSys.findRedPointNode(type);
        let buyCount =  Game.mallProto.getGoodsRestBuyCount(rid);
        let t = this.getPrivateGoodTime(rid);
        let flag = buyCount > 0 && t <= 0;
        if (redPointNode) {
            redPointNode.setRedPointNum(flag ? 1 : 0);
        }
        return flag;
    }

    public hasFreeBox(): boolean {
        //视频免费宝箱
        let treatureData = this.getGoodListByTagId(TAGID.TREATRUE_1);
        if (treatureData && treatureData[0]) {
            let times: number = Game.mallProto.getGoodsRestBuyCount(treatureData[0].nrid);
            if (Game.mallProto.getPrivateGoodTime(treatureData[0].nrid) <= 0 &&
                ((MALL_LIMITTYPE.MALL_LIMITTYPE_NULL != treatureData[0].btlimittype && times > 0) ||
                    MALL_LIMITTYPE.MALL_LIMITTYPE_NULL === treatureData[0].btlimittype)) {
                return true;
            }
        }
        //至尊宝箱
        treatureData = this.getGoodListByTagId(TAGID.TREATRUE_2);
        if (treatureData && treatureData[0]) {
            if (this.getPrivateGoodTime(treatureData[0].nrid) <= 0) {
                return true;
            }
        }
        return false;
    }

    /**
     * 刷新砖石双倍红点
     */
    private refreshShopDoubleRecharge() {
        return;
        if (!this._goodList || !this._normallBuyHistory || !GlobalVal.openRecharge) return;
        let tempData = Game.mallProto.getGoodListByTagId(TAGID.MALL_DIAMOND);
        let num: number = 0;
        if (tempData) {
            for (let data of tempData) {
                if (!this.isInNormallBuyHistory(data.nrid)) {
                    num++;
                }
            }
        }

        let node = Game.redPointSys.findRedPointNode(EVENT_REDPOINT.SHOP_DOUBLE_RECHARGE);
        if (node) {
            node.setRedPointNum(num);
        }
    }
}
