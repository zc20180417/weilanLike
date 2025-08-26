import { EResPath } from "../../common/EResPath";
import Game from "../../Game";
import { GS_FestivalActivityConfig_ExchangeItem, GS_FestivalActivityPrivate_ReceiveItem } from "../../net/proto/DMSG_Plaza_Sub_FestivalActivity";
import { GS_GoodsInfoReturn_GoodsInfo } from "../../net/proto/DMSG_Plaza_Sub_Goods";
import { GOODS_ID } from "../../net/socket/handler/MessageEnum";
import SystemTipsMgr from "../../utils/SystemTipsMgr";
import BaseItem from "../../utils/ui/BaseItem";
import ImageLoader from "../../utils/ui/ImageLoader";
import { UiManager } from "../../utils/UiMgr";
import GoodsItem from "../newhand_book/GoodsItem";

const { ccclass, property ,menu } = cc._decorator;

@ccclass
@menu('Game/ui/active-taqing/ActiveTaqing_Shop_Item')
export class ActiveTaqing_Shop_Item extends BaseItem {

    @property(GoodsItem)
    goodsItem:GoodsItem = null;

    @property(cc.Node)
    diamondNode:cc.Node = null;

    @property(ImageLoader)
    ico:ImageLoader = null;

    @property(cc.Label)
    diamondLabel:cc.Label = null;

    @property(cc.Label)
    limitLabel:cc.Label = null;

    @property(cc.Node)
    clearNode:cc.Node = null;

    @property(cc.Button)
    btn:cc.Button = null;

    @property(cc.Color)
    labelColor:cc.Color = null;

    @property(cc.Node)
    imgSale:cc.Node = null;

    private _shopConfig:GS_FestivalActivityConfig_ExchangeItem;
    private _stateData:GS_FestivalActivityPrivate_ReceiveItem;
    private _goodsInfo:GS_GoodsInfoReturn_GoodsInfo;

    setData(data:any , index:number) {
        super.setData(data , index);
        this._shopConfig = null;
        this._stateData = null;
        if (!data) return;
        this._shopConfig = data.config;
        this._stateData = data.state;
        this._goodsInfo = data.goodsInfo;
        this.goodsItem.setData({
            goodsId:this._shopConfig.ngoodsid,
            nums:this._shopConfig.ngoodsnum,
            prefix:'x',
        });

        let goodsInfo = this._shopConfig.btpricetype == 0 ? data.goodsInfo : Game.goodsMgr.getGoodsInfo(GOODS_ID.DIAMOND);

        if (goodsInfo) {
            this.ico.setPicId(goodsInfo.npacketpicid);
        }

        this.imgSale.active = this._shopConfig.btpricetype == 1 && this._shopConfig.ngoodsid != Game.festivalActivityMgr.getLuckyGoodsId();

        const limitStr = this._shopConfig.btlimitbuytype == 2 ? '每日限购' : '限购';

        this.limitLabel.string = limitStr + `（${this._stateData.ntimes}/${this._shopConfig.nlimitbuynum}）`;
        this.limitLabel.node.active = this._shopConfig.nlimitbuynum > 0;
        this.diamondLabel.string = 'x' + this._shopConfig.nprice;
        if (this._shopConfig.nlimitbuynum > 0) {
            let clear = this._stateData.ntimes >= this._shopConfig.nlimitbuynum;
            this.clearNode.active = clear;
            this.diamondNode.active = this.diamondLabel.node.active = !clear;
        } else {
            this.clearNode.active = false;
            this.diamondNode.active = this.diamondLabel.node.active = true;
        }

        this.btn.enabled = !this.clearNode.active;
        if (!this.clearNode.active) {
            let count = this._shopConfig.btpricetype == 0 ? Game.containerMgr.getItemCount(data.goodsInfo.lgoodsid) : Game.actorMgr.getDiamonds();
            this.diamondLabel.node.color = count >= this._shopConfig.nprice ? this.labelColor : cc.Color.RED;
        }
    }

    onItemClick() {
        if (!this._shopConfig || !this._stateData) return;
        if (this._shopConfig.btpricetype == 0 && !this._goodsInfo) {
            SystemTipsMgr.instance.notice("兑换道具配置出错");
            return;
        }
        // let config:GS_FestivalActivityConfig_ExchangeItem = data.config;
        // let state:GS_FestivalActivityPrivate_ReceiveItem = data.state;
        // if (config && state) {
            if (this._shopConfig .nlimitbuynum <= this._stateData.ntimes) {
                SystemTipsMgr.instance.notice("该商品已达到购买上限");
                return;
            }
        // }

        if (this._shopConfig.btpricetype == 0) {
            if (!Game.containerMgr.isEnough(this._goodsInfo.lgoodsid , this._shopConfig.nprice)) {
                SystemTipsMgr.instance.notice(this._goodsInfo.szgoodsname + "不足");
                return;
            }

        } else if (Game.actorMgr.getDiamonds() < this._shopConfig.nprice) {
            SystemTipsMgr.instance.notice("钻石不足");
            return;
        }

        if (this._shopConfig.ngoodsid == GOODS_ID.REDPACKET || this._shopConfig.ngoodsid == GOODS_ID.ENERGY || this._shopConfig.ngoodsid == Game.festivalActivityMgr.getLuckyGoodsId()) {

            let value = this._shopConfig.btpricetype == 0 ? Game.containerMgr.getItemCount(this._goodsInfo.lgoodsid) : Game.actorMgr.getDiamonds();
            const maxCount = Math.floor(value / this._shopConfig.nprice);
            UiManager.showDialog(EResPath.ACTIVE_TAQING_SHOP_BATCH_BUY , {
                totalCount:this._shopConfig .nlimitbuynum - this._stateData.ntimes,
                maxCount:maxCount,
                nid:this._shopConfig.nid,
                goodsName:this._shopConfig.btpricetype == 0 ? this._goodsInfo.szgoodsname : "钻石",
            });

            return;
        }

        Game.festivalActivityMgr.reqBuyExchangeGoods(this._shopConfig.nid);
    }
}