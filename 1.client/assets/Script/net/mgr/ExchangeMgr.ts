// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EventEnum } from "../../common/EventEnum";
import { GameEvent } from "../../utils/GameEvent";
import { Handler } from "../../utils/Handler";
import { StringUtils } from "../../utils/StringUtils";
import SystemTipsMgr from "../../utils/SystemTipsMgr";
import { CS_ExchangeListView, CS_ExchangeListView_ExchangeGoods, GS_ExchangeAliPay, GS_ExchangeBarCode, GS_ExchangeClearData, GS_ExchangeFragment, GS_ExchangeFreeVideoData, GS_ExchangeGetFreeVideo, GS_ExchangeGoods, GS_ExchangeGoodsReturn, GS_ExchangePrivateData, GS_ExchangePrivateData_ExchangeData, GS_ExchangeRetAliPay, GS_ExchangeRetHistory, GS_ExchangeRetWCRedPack, GS_ExchangeSetFreeVideoOrder, GS_ExchangeTips, GS_ExchangeUpPrivateData, GS_ExchangeWCRedPack, GS_PLAZA_EXCHANGE_MSG } from "../proto/DMSG_Plaza_Sub_Exchange";
import BaseNetHandler from "../socket/handler/BaseNetHandler";
import { CMD_ROOT, GS_PLAZA_MSGID } from "../socket/handler/MessageEnum";

export enum EXCHANGE_GOODS_TYPE {
    GAME_PROP,//游戏道具
    WC_REDPACKET,//微信红包
    GOODS,//实物道具
    ALI_REDPACKET,//支付宝红包
}


const { ccclass, property } = cc._decorator;

export default class ExchangeMgr extends BaseNetHandler {
    exchangList: CS_ExchangeListView = null;
    historyData: GS_ExchangeRetHistory = null;

    private _haveAliPay: boolean = false;
    private _privateDic: any = {};
    private _exchangeGoodsList: CS_ExchangeListView_ExchangeGoods[] = [];
    constructor() {
        super(CMD_ROOT.CMDROOT_PLAZA_MSG, GS_PLAZA_MSGID.GS_PLAZA_MSGID_EXCHANGE);
    }

    register() {

        this.registerAnaysis(GS_PLAZA_EXCHANGE_MSG.PLAZA_EXCHANGE_LIST, Handler.create(this.onExchangeList, this), CS_ExchangeListView);
        this.registerAnaysis(GS_PLAZA_EXCHANGE_MSG.PLAZA_EXCHANGE_RETWCREDPACK, Handler.create(this.onRetWCRedpack, this), GS_ExchangeRetWCRedPack);
        this.registerAnaysis(GS_PLAZA_EXCHANGE_MSG.PLAZA_EXCHANGE_TIPS, Handler.create(this.onExchangeTips, this), GS_ExchangeTips);
        this.registerAnaysis(GS_PLAZA_EXCHANGE_MSG.PLAZA_EXCHANGE_RETHISTORY, Handler.create(this.onRetHistory, this), GS_ExchangeRetHistory);
        this.registerAnaysis(GS_PLAZA_EXCHANGE_MSG.PLAZA_EXCHANGE_PRIVATE, Handler.create(this.onPrivateData, this), GS_ExchangePrivateData);
        this.registerAnaysis(GS_PLAZA_EXCHANGE_MSG.PLAZA_EXCHANGE_FREEVIDEODATA, Handler.create(this.onFreeVideoData, this), GS_ExchangeFreeVideoData);
        this.registerAnaysis(GS_PLAZA_EXCHANGE_MSG.PLAZA_EXCHANGE_UPPRIVATE, Handler.create(this.onUpPrivateData, this), GS_ExchangeUpPrivateData);
        this.registerAnaysis(GS_PLAZA_EXCHANGE_MSG.PLAZA_EXCHANGE_CLEARDATA, Handler.create(this.onClearData, this), GS_ExchangeClearData);
        this.registerAnaysis(GS_PLAZA_EXCHANGE_MSG.PLAZA_EXCHANGE_SETFREEVIDEOORDER, Handler.create(this.onFreeVideoOrder, this), GS_ExchangeSetFreeVideoOrder);
        this.registerAnaysis(GS_PLAZA_EXCHANGE_MSG.PLAZA_EXCHANGE_RETALIPAY, Handler.create(this.onRetAliPay, this), GS_ExchangeRetAliPay);
        this.registerAnaysis(GS_PLAZA_EXCHANGE_MSG.PLAZA_EXCHANGE_GOODS_RETURN, Handler.create(this.onExcahngeGoodsRet, this), GS_ExchangeGoodsReturn);
    }

    /**
     * 兑换列表
     * @param data 
     */
    private onExchangeList(data: CS_ExchangeListView) {
        cc.log("兑换列表：", data);
        this.exchangList = data;
        this.refreshExchangList();
    }

    /**
     * 微信红包兑换返回
     * @param data 
     */
    private onRetWCRedpack(data: GS_ExchangeRetWCRedPack) {
        cc.log("微信红包兑换返回", data);
    }

    /**
     * 兑换系统提示信息
     * @param data 
     */
    private onExchangeTips(data: GS_ExchangeTips) {
        SystemTipsMgr.instance.notice(data.sztips);
    }

    /**
     * 兑换历史返回
     * @param data 
     */
    private onRetHistory(data: GS_ExchangeRetHistory) {
        cc.log("兑换历史返回", data);
        this.historyData = data;
    }

    /**
     * 兑换的私有数据
     * @param data 
     */
    private onPrivateData(data: GS_ExchangePrivateData) {
        cc.log("兑换的私有数据", data);

        if (data.nitemcount > 0) {
            data.data.forEach(element => {
                this._privateDic[element.nrid] = element;
            });
        }

        this.refreshExchangList();
    }

    /**
     * 免费小视频的数据
     * @param data 
     */
    private onFreeVideoData(data: GS_ExchangeFreeVideoData) {

    }

    /**
     * 更新兑换单个私有数据
     * @param data 
     */
    private onUpPrivateData(data: GS_ExchangeUpPrivateData) {
        cc.log("更新兑换单个私有数据", data);
        SystemTipsMgr.instance.notice("兑换成功，请注意查收");

        this._privateDic[data.nrid] = data;
        this.refreshExchangList();
        GameEvent.emit(EventEnum.EXCHANGE_UP_PRIVATE_DATA, data);
    }

    /**
     * 清理数据
     * @param data 
     */
    private onClearData(data: GS_ExchangeClearData) {
        cc.log("清理数据", data)
    }

    /**
     * 下发免费小视频订单
     * @param data 
     */
    private onFreeVideoOrder(data: GS_ExchangeSetFreeVideoOrder) {

    }
    /**
     *实物兑换返回
     * @param data 
     */
    private onExcahngeGoodsRet(data: GS_ExchangeGoodsReturn) {
        cc.log("实物兑换返回", data);
    }

    /**
     * 支付宝提现返回
     * @param data 
     */
    private onRetAliPay(data: GS_ExchangeRetAliPay) {
        cc.log("支付宝提现返回", data);
    }

    /**
     * 条形码兑换
     * @param barcode 
     */
    public exchangeBarCode(barcode: string) {
        if (StringUtils.isNilOrEmpty(barcode)) return cc.error("兑换码不能为空");
        let data: GS_ExchangeBarCode = new GS_ExchangeBarCode();
        data.szbarcode = barcode;
        this.send(GS_PLAZA_EXCHANGE_MSG.PLAZA_EXCHANGE_BARCODE, data);
    }

    /**
     * 道具兑换
     * @param nrid 
     */
    public exchangeFragment(nrid: number) {
        if (nrid === null || nrid === undefined) return cc.error("道具兑换nrid不能为空！");
        let data: GS_ExchangeFragment = new GS_ExchangeFragment();
        data.nrid = nrid;
        this.send(GS_PLAZA_EXCHANGE_MSG.PLAZA_EXCHANGE_FRAGMENT, data);
    }

    /**
     * 微信红包兑换
     * @param nrid 
     */
    public exchangeWCRedPacket(nrid: number) {
        if (nrid === null || nrid === undefined) return cc.error("微信红包兑换nrid不能为空！");
        let data: GS_ExchangeWCRedPack = new GS_ExchangeWCRedPack();
        data.nrid = nrid;
        this.send(GS_PLAZA_EXCHANGE_MSG.PLAZA_EXCHANGE_WCREDPACK, data);
    }
    /**
     * 实物兑换
     * @param nrid 
     */
    public exchangeGoods(nrid: number, phone: string, userName: string, areCode: number, address: string) {
        if (nrid === null || nrid === undefined) return cc.error("nrid不能为空！");
        let data: GS_ExchangeGoods = new GS_ExchangeGoods();
        data.nrid = nrid;
        data.nareacode = areCode;
        data.szphone = phone;
        data.szaddressee = userName;
        data.szaddr = address;
        this.send(GS_PLAZA_EXCHANGE_MSG.PLAZA_EXCHANGE_GOODS, data);
    }

    /**
     * 支付宝提现
     * @param rid 商品id
     * @param realName  真实姓名
     * @param aliAccount   支付宝账号
     */
    exchangeAliPay(rid: number, realName: string, aliAccount: string) {
        let data: GS_ExchangeAliPay = new GS_ExchangeAliPay();
        data.nrid = rid;
        data.szrealname = realName;
        data.szalipayaccount = aliAccount;
        this.send(GS_PLAZA_EXCHANGE_MSG.PLAZA_EXCHANGE_ALIPAY, data);
    }

    getHaveAliPay(): boolean {
        return this._haveAliPay;
    }

    /**
     * 请求免费小视频订单
     */
    public getFreeVideo() {
        let data: GS_ExchangeGetFreeVideo = new GS_ExchangeGetFreeVideo();
        this.send(GS_PLAZA_EXCHANGE_MSG.PLAZA_EXCHANGE_GETFREEVIDEO, data);
    }

    /**
     * 获取兑换物品列表
     * 
     */
    public getExchangGoodsList(): Array<CS_ExchangeListView_ExchangeGoods> {
        if (!this.exchangList) return null;
        return this._exchangeGoodsList;
    }

    public getExchangeGoodsItem(goodsId: number): CS_ExchangeListView_ExchangeGoods {
        let item: CS_ExchangeListView_ExchangeGoods = null;
        if (this.exchangList) {
            for (let v of this._exchangeGoodsList) {
                if (v.ngoodsid === goodsId) {
                    item = v;
                    break;
                }
            }
        }
        return item;
    }

    private refreshExchangList() {
        /*
            nallcount : number;			
            ndaycount : number;			
            nweekcount : number;			
            nmonthcount : number;
        */

        this._haveAliPay = false;
        if (!this.exchangList || !this.exchangList.goods) return;
        let len = this.exchangList.goods.length;
        this._exchangeGoodsList.length = 0;
        let data: CS_ExchangeListView_ExchangeGoods;
        let privateData: any;
        for (let i = 0; i < len; i++) {
            data = this.exchangList.goods[i];
            privateData = this._privateDic[data.nrid];

            if (data.nlimitallcount == 0 || !privateData || !(privateData.nallcount >= data.nlimitallcount || privateData.ndaycount >= data.nlimitdaycount ||
                privateData.nweekcount >= data.nlimitweekcount || privateData.nmonthcount >= data.nlimitmonthcount)) {
                this._exchangeGoodsList.push(data);
                if (data.nawardtype == EXCHANGE_GOODS_TYPE.ALI_REDPACKET) {
                    this._haveAliPay = true;
                }
            }

        }
    }

}
