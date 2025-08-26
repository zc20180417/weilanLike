// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EResPath } from "../../common/EResPath";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import GlobalVal from "../../GlobalVal";
import { Lang, LangEnum } from "../../lang/Lang";
import { ShopIndex } from "../../ui/shop/ShopView";
import { GameEvent } from "../../utils/GameEvent";
import { Handler } from "../../utils/Handler";
import SystemTipsMgr from "../../utils/SystemTipsMgr";
import { UiManager } from "../../utils/UiMgr";
import { GS_GoodsInfoReturn_GoodsInfo } from "../proto/DMSG_Plaza_Sub_Goods";
import { GS_LuckDrawClear, GS_LuckDrawInfo, GS_LuckDrawInfo_Item, GS_LuckDrawJoin, GS_LuckDrawPrivate, GS_LuckDrawPrivate_Item, GS_LuckDrawRet, GS_PLAZA_LUCKDRAW_MSG } from "../proto/DMSG_Plaza_Sub_LuckDrawPlugin";
import BaseNetHandler from "../socket/handler/BaseNetHandler";
import { CMD_ROOT, GOODS_ID, GS_PLAZA_MSGID, LUCK_DRAW_JION_TYPE } from "../socket/handler/MessageEnum";

export default class LuckDrawMgr extends BaseNetHandler {
    private luckDrawInfo: GS_LuckDrawInfo = null;
    private luckDrawInfoMap: Map<number, GS_LuckDrawInfo_Item> = null;
    private luckDrawPrivate: GS_LuckDrawPrivate = null;
    private luckDrawPrivateMap: Map<number, GS_LuckDrawPrivate_Item> = null;

    constructor() {
        super(CMD_ROOT.CMDROOT_PLAZA_MSG, GS_PLAZA_MSGID.GS_PLAZA_MSGID_LUCKDRAW);
        this.luckDrawInfoMap = new Map();
        this.luckDrawPrivateMap = new Map();
    }

    register() {
        this.registerAnaysis(GS_PLAZA_LUCKDRAW_MSG.PLAZA_LUCKDRAW_INFO, Handler.create(this.onLuckDrawInfo, this), GS_LuckDrawInfo);
        this.registerAnaysis(GS_PLAZA_LUCKDRAW_MSG.PLAZA_LUCKDRAW_PRIVATE, Handler.create(this.onLuckDrawPrivate, this), GS_LuckDrawPrivate);
        this.registerAnaysis(GS_PLAZA_LUCKDRAW_MSG.PLAZA_LUCKDRAW_RET, Handler.create(this.onLuckDarwRet, this), GS_LuckDrawRet);
        this.registerAnaysis(GS_PLAZA_LUCKDRAW_MSG.PLAZA_LUCKDRAW_CLEAR, Handler.create(this.onLuckDrawClear, this), GS_LuckDrawClear);
    }

    protected exitGame(): void {
        this.luckDrawInfoMap.clear();
        this.luckDrawPrivateMap.clear();
    }

    /**
     * 十连抽配置
     * @param data 
     */
    private onLuckDrawInfo(data: GS_LuckDrawInfo) {
        cc.log("十连抽配置", data);
        this.luckDrawInfo = data;
        if (data.uitemcount) {
            for (let v of data.items) {
                this.luckDrawInfoMap.set(v.nid, v);
            }
        }
        GameEvent.emit(EventEnum.ON_LUCK_INFO);
    }

    /**
     * 十连抽个人数据
     * @param data 
     */
    private onLuckDrawPrivate(data: GS_LuckDrawPrivate) {
        cc.log("十连抽个人数据", data);
        this.luckDrawPrivate = data;
        if (data.uitemcount) {
            for (let v of data.items) {
                this.luckDrawPrivateMap.set(v.nid, v);
            }
        }
        GameEvent.emit(EventEnum.ON_LUCK_PRIVATE);
    }

    /**
     * 返回抽取结果
     * @param data 
     */
    private onLuckDarwRet(data: GS_LuckDrawRet) {
        cc.log("十连抽返回抽取结果", data);
        let privateData = this.luckDrawPrivateMap.get(data.nid);
        if (privateData) {
            privateData.ndayplaycount = data.ndayplaycount;
        } else {
            privateData = new GS_LuckDrawPrivate_Item();
            privateData.nid = data.nid;
            privateData.ndayplaycount = data.ndayplaycount;
            this.luckDrawPrivateMap.set(data.nid , privateData);
        }

        GameEvent.emit(EventEnum.ON_LUCK_JION_RET, data);
    }

    /**
     * 跨天清理已抽取次数
     * @param data 
     */
    private onLuckDrawClear(data: GS_LuckDrawClear) {
        cc.log("十连抽跨天清理已抽取次数", data);
        let privateDatas = this.getLuckDrawPrivates();
        for (let v of privateDatas) {
            v.ndayplaycount = 0;
        }
        GameEvent.emit(EventEnum.ON_LUCK_JION_CLEAR);
    }

    private  _preRequestTime:number = 0;
    /**
     * 抽卡
     * @param nid 
     * @param type 
     */
    public luckDrawJion(nid: number, type: LUCK_DRAW_JION_TYPE) {
        const time = GlobalVal.getServerTimeS();
        if (time == this._preRequestTime) return;
        if (!this.isCostEnough(nid, type, true) || !this.isPlayCountEnough(nid, type, true)) return;
        let data = new GS_LuckDrawJoin();
        data.nid = nid;
        data.bttype = type;
        this.send(GS_PLAZA_LUCKDRAW_MSG.PLAZA_LUCKDRAW_JOIN, data);
        this._preRequestTime = time;
    }


    public getLuckDrawInfos() {
        return Array.from(this.luckDrawInfoMap.values());
    }

    public getLuckDrawInfo(nid: number) {
        return this.luckDrawInfoMap.get(nid);
    }

    public getLuckDrawPrivates() {
        return Array.from(this.luckDrawPrivateMap.values());
    }

    public getLuckDrawPrivate(id) {
        return this.luckDrawPrivateMap.get(id);
    }

    private isCostEnough(nid: number, type: LUCK_DRAW_JION_TYPE, withTips: boolean = false) {
        let info = this.luckDrawInfoMap.get(nid);
        let needCost, curr, goodsInfo: GS_GoodsInfoReturn_GoodsInfo;
        switch (type) {
            case LUCK_DRAW_JION_TYPE.DIA_SINGLE:
                needCost = info.nonediamonds;
                curr = Game.actorMgr.getDiamonds();
                goodsInfo = Game.goodsMgr.getGoodsInfo(GOODS_ID.DIAMOND);
                break;
            case LUCK_DRAW_JION_TYPE.DIA_TEN:
                needCost = info.ntendiamonds;
                curr = Game.actorMgr.getDiamonds();
                goodsInfo = Game.goodsMgr.getGoodsInfo(GOODS_ID.DIAMOND);
                break;
            case LUCK_DRAW_JION_TYPE.PROP_SINGLE:
                needCost = info.nonenum;
                curr = Game.containerMgr.getItemCount(info.nneedgoodsid);
                goodsInfo = Game.goodsMgr.getGoodsInfo(info.nneedgoodsid);
                break;
            case LUCK_DRAW_JION_TYPE.PROP_TEN:
                needCost = info.ntennum;
                curr = Game.containerMgr.getItemCount(info.nneedgoodsid);
                goodsInfo = Game.goodsMgr.getGoodsInfo(info.nneedgoodsid);
                break;
        }

        let enough = curr >= needCost;
        if (withTips && goodsInfo && !enough) {
            SystemTipsMgr.instance.notice(goodsInfo.szgoodsname + Lang.getL(LangEnum.BU_ZHU));
            UiManager.showDialog(EResPath.SHOP_VIEW , ShopIndex.ZHAOCAI);
        }
        return enough;
    }

    private isPlayCountEnough(nid: number, type: LUCK_DRAW_JION_TYPE, withTips: boolean = false) {
        let info = this.luckDrawInfoMap.get(nid);
        let privateData = this.luckDrawPrivateMap.get(nid);
        let dayMax, curr;
        dayMax = info.ndaymaxcount;
        curr = privateData ? privateData.ndayplaycount : 0;

        switch (type) {
            case LUCK_DRAW_JION_TYPE.DIA_SINGLE:
            case LUCK_DRAW_JION_TYPE.PROP_SINGLE:
                curr++;
                break;
            case LUCK_DRAW_JION_TYPE.DIA_TEN:
            case LUCK_DRAW_JION_TYPE.PROP_TEN:
                curr += 10;
                break;
        }

        let enough = curr <= dayMax;
        if (withTips && !enough) {
            SystemTipsMgr.instance.notice(Lang.getL(LangEnum.DRAW_CARD_UNENOUGH));
        }
        return enough;
    }
}
