// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Game from "../../Game";
import { CS_ExchangeListView_ExchangeGoods } from "../../net/proto/DMSG_Plaza_Sub_Exchange";
import { GS_RewardTips_RewardGoods } from "../../net/proto/DMSG_Plaza_Sub_Tips";
import Dialog from "../../utils/ui/Dialog";
import GoodsItem, { GoodsItemData } from "../../ui/newhand_book/GoodsItem";
import { StringUtils } from "../../utils/StringUtils";
import { UiManager } from "../../utils/UiMgr";
import { EResPath } from "../../common/EResPath";
import { EXCHANGE_TYPE } from "../FillInfoView";
import { EventEnum } from "../../common/EventEnum";
import { GameEvent } from "../../utils/GameEvent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TurntableExchangeView extends Dialog {
    @property(GoodsItem)
    goodsItem: GoodsItem = null;

    @property(cc.Label)
    currNum: cc.Label = null;

    @property(cc.RichText)
    des: cc.RichText = null;

    @property(cc.Node)
    fillinfoBtn: cc.Node = null;

    @property(cc.Node)
    confirmBtn: cc.Node = null;

    private _data: GS_RewardTips_RewardGoods = null;
    private _exchangeGoodsItem: CS_ExchangeListView_ExchangeGoods = null;

    public setData(data: any): void {
        this._data = data;
    }

    protected addEvent(): void {
        GameEvent.on(EventEnum.ITEM_COUNT_CHANGE, this.onItemChanged, this);
    }

    protected beforeShow(): void {
        if (!this._data) return;
        this._exchangeGoodsItem = Game.exchangeMgr.getExchangeGoodsItem(this._data.sgoodsid);
        let goodsInfo = Game.goodsMgr.getGoodsInfo(this._data.sgoodsid);
        let currNum = Game.containerMgr.getItemCount(this._data.sgoodsid);
        let needNum = (this._exchangeGoodsItem && this._exchangeGoodsItem.ngoodsnums) || 0;
        if (this._exchangeGoodsItem && goodsInfo) {
            this.currNum.string = "当前拥有：" + currNum;
            let data: GoodsItemData = {
                goodsId: this._data.sgoodsid,
                nums: this._data.sgoodsnum,
                prefix: " x",
                desColor: "#AD5B29",
                numColor: "#EA5718",
                hideNumWhenOne: true
            }
            this.goodsItem.setData(data);
            this.des.string = StringUtils.richTextColorFormat("恭喜您在幸运披萨中抽取到", "#AD5B29") +
                StringUtils.richTextColorFormat("“" + goodsInfo.szgoodsname + " " + this._data.sgoodsnum + "个”", "#EA5718") +
                StringUtils.richTextColorFormat(",集齐" + needNum + "个后即可", "#AD5B29") +
                StringUtils.richTextColorFormat("兑换实物周边奖励", "#EA5718") +
                StringUtils.richTextColorFormat(",而且包邮哦~", "#AD5B29");
        } else {
            this.currNum.string = "";
            this.des.string = "";
        }

        // NodeUtils.enabled(this.fillinfoBtn, currNum >= needNum);
        this.refreshBtn(currNum >= needNum);
    }

    private clickFillinfo() {
        if (this.enableExchange()) {
            UiManager.showDialog(EResPath.FILL_INFO_VIEW, { data: this._exchangeGoodsItem, type: EXCHANGE_TYPE.REDPACKET });
        }
    }

    private onItemChanged(id: number, count: number) {
        if (!this._data || this._data.sgoodsid !== id) return;
        this.currNum.string = "当前拥有：" + count;

        let needNum = (this._exchangeGoodsItem && this._exchangeGoodsItem.ngoodsnums) || 0;

        this.refreshBtn(count >= needNum);
    }

    private enableExchange() {
        if (!this._data) return false;
        let currNum = Game.containerMgr.getItemCount(this._data.sgoodsid);
        let needNum = (this._exchangeGoodsItem && this._exchangeGoodsItem.ngoodsnums) || 0;
        return currNum >= needNum;
    }

    private refreshBtn(enable: boolean) {
        this.confirmBtn.active = !enable;
        this.fillinfoBtn.active = enable;
    }
}

