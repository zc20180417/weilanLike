// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EResPath } from "../common/EResPath";
import { EventEnum } from "../common/EventEnum";
import Game from "../Game";
import { EXCHANGE_GOODS_TYPE } from "../net/mgr/ExchangeMgr";
import { CS_ExchangeListView_ExchangeGoods, GS_ExchangePrivateData } from "../net/proto/DMSG_Plaza_Sub_Exchange";
import { GameEvent } from "../utils/GameEvent";
import SystemTipsMgr from "../utils/SystemTipsMgr";
import BaseItem from "../utils/ui/BaseItem";
import ImageLoader from "../utils/ui/ImageLoader";
// import { NodeUtils } from "../utils/ui/NodeUtils";
// import SystemTip from "../utils/ui/SystemTip";
import { UiManager } from "../utils/UiMgr";
// import Utils from "../utils/Utils";
import { EXCHANGE_TYPE } from "./FillInfoView";
// import HornTips from "./HornTips";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RedPacketExchangeItem extends BaseItem {
    @property(ImageLoader)
    ico: ImageLoader = null;
    @property(cc.Label)
    title: cc.Label = null;
    @property(cc.Label)
    des: cc.Label = null;
    @property(cc.Button)
    btn: cc.Button = null;

    @property(cc.Label)
    tips: cc.Label = null;

    public setData(data: any) {
        super.setData(data);
        this.refresh();
    }

    onEnable() {
        GameEvent.on(EventEnum.ITEM_COUNT_CHANGE, this.onMoneyChange, this);
    }

    onDisable() {
        GameEvent.targetOff(this);
    }

    onMoneyChange(id: number, num: number) {
        if (this.data && this.data.ngoodsid === id) {
            // NodeUtils.enabled(this.btn.getComponent(cc.Button), this.data.ngoodsnums <= num);
            this.refreshBtnState();
        }
    }

    refresh() {
        if (!this.data) return;
        let data = this.data as CS_ExchangeListView_ExchangeGoods;
        // let currNum = Game.containerMgr.getItemCount(data.ngoodsid);
        this.ico.setPicId(data.npicid);

        let str: string = data.szname;
        let index = str.indexOf("（");
        if (index != -1) {
            this.title.string = str.substring(0, index);
            this.des.string = str.substring(index);
        } else {
            this.des.node.active = false;
            this.title.string = data.szname;
        }
        // let num = data.ngoodsnums;
        //let tempNum = num / 100;
        // this.price.string = num + '';
        let goodsInfo = Game.goodsMgr.getGoodsInfo(data.ngoodsid);
        if (goodsInfo) {
            this.tips.string = "兑换需要\n" + goodsInfo.szgoodsname + " x" + data.ngoodsnums;
        }
        // let isEnable = NodeUtils.enabled(this.btn.getComponent(cc.Button), num <= currNum);
        this.refreshBtnState();
    }

    refreshBtnState() {
        let data = this.data as CS_ExchangeListView_ExchangeGoods;
        let currNum = Game.containerMgr.getItemCount(data.ngoodsid);
        let isEnable = data.ngoodsnums <= currNum;

        this.btn.node.active = isEnable;
        this.tips.node.active = !isEnable;
    }

    onClick() {
        if (!this.data) return;
        let data = this.data as CS_ExchangeListView_ExchangeGoods;

        //判断通关id
        let currWarId = Game.sceneNetMgr.getLastWarID();
        if (currWarId < data.nlimitwarid) {
            let typeStr = (data.nawardtype == EXCHANGE_GOODS_TYPE.ALI_REDPACKET || data.nawardtype == EXCHANGE_GOODS_TYPE.WC_REDPACKET) ? "提现" : "兑换";
            return SystemTipsMgr.instance.notice(`需要通关${this.data.nlimitwarid}关后方可${typeStr}`);
        }

        switch (data.nawardtype) {
            case EXCHANGE_GOODS_TYPE.GAME_PROP:
                // Game.exchangeMgr.exchangeFragment(this.data.nrid);
                break;
            case EXCHANGE_GOODS_TYPE.WC_REDPACKET:
                Game.exchangeMgr.exchangeWCRedPacket(this.data.nrid);
                break;
            case EXCHANGE_GOODS_TYPE.GOODS:
                UiManager.showDialog(EResPath.FILL_INFO_VIEW, { data: data, type: EXCHANGE_TYPE.REDPACKET });
                break;
            case EXCHANGE_GOODS_TYPE.ALI_REDPACKET:
                UiManager.showDialog(EResPath.ALI_PAY_DIALOG, data);
                break;
        }
    }
}
