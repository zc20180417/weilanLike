import { EResPath } from "../../common/EResPath";
import Game from "../../Game";
import { GS_FestivalActivityConfig_MallItem, GS_FestivalActivityConfig_RewardItem, GS_FestivalActivityPrivate_ReceiveItem } from "../../net/proto/DMSG_Plaza_Sub_FestivalActivity";
import { EVENT_REDPOINT } from "../../redPoint/RedPointSys";
import SystemTipsMgr from "../../utils/SystemTipsMgr";
import BaseItem from "../../utils/ui/BaseItem";
import { GoodsBox } from "../../utils/ui/GoodsBox";
import ImageLoader from "../../utils/ui/ImageLoader";
import { NodeUtils } from "../../utils/ui/NodeUtils";
import { UiManager } from "../../utils/UiMgr";
import GoodsItem, { GoodsItemData } from "../newhand_book/GoodsItem";

const { ccclass, property ,menu } = cc._decorator;

@ccclass
@menu('Game/ui/active-taqing/ActiveTaqing_Shop_LiBao_Item')
export class ActiveTaqing_Shop_LiBao_Item extends BaseItem {


    @property(cc.Label)
    goodsName:cc.Label = null;

    @property(ImageLoader)
    goodsIco:ImageLoader = null;

    @property(cc.Label)
    limitLabel:cc.Label = null;

    @property(cc.Label)
    pirceLabel:cc.Label = null;

    @property(GoodsBox)
    goodsBox:GoodsBox = null;

    @property(cc.Node)
    btnNode:cc.Node = null;

    private _addRedPoint:boolean = false;
    onIconClick() {
        if (!this._shopConfig || !this._shopConfig.rewarditemlist) return;
        let goodsList:GoodsItemData[] = [];

        // let ids = [2 , 56 , 405 , 4021 ,40];
        let len = this._shopConfig.rewarditemlist.length
        for (let i = 0; i < len ; i++) {
            let id = this._shopConfig.rewarditemlist[i].ngoodsid;
            if (id > 0) {
                let goods:GoodsItemData = {
                    goodsId: id,
                    nums: this._shopConfig.rewarditemlist[i].ngoodsnum,
                    prefix: "x",
                    showNumWhenOne: false,
                    limit:Game.goodsMgr.isCard(id) ? 150 : 80,
                }
                goodsList.push(goods);
            }
            
        }

        UiManager.showDialog(EResPath.ACTIVE_TAQING_LIBAO_TIPS , goodsList);
    }

    onItemClick() {
        if (this._shopConfig && this._stateData) {
            if (this._shopConfig.nlimitbuynum <= this._stateData.ntimes) {
                SystemTipsMgr.instance.notice("该商品已达到购买上限");
                return;
            }
        }
        Game.festivalActivityMgr.reqBuyShopGoods(this._shopConfig.nid);
    }


    private _shopConfig:GS_FestivalActivityConfig_MallItem;
    private _stateData:GS_FestivalActivityPrivate_ReceiveItem;
    setData(data:any , index:number) {
        super.setData(data , index);
        this._shopConfig = null;
        this._stateData = null;
        if (!data) return;
        this._shopConfig = data.config;
        this._stateData = data.state;

        this.goodsName.string = this._shopConfig.szname;
        this.goodsIco.setPicId(this._shopConfig.nicon);

        this.limitLabel.string = `永久限购（${this._stateData.ntimes}/${this._shopConfig.nlimitbuynum}）`;
        this.limitLabel.node.active = this._shopConfig.nlimitbuynum > 0;
        this.pirceLabel.string = '¥' + this._shopConfig.nprice;

        if (this._shopConfig.nprice == 0 && !this._addRedPoint) {
            this._addRedPoint = true;
            Game.redPointSys.registerRedPoint(EVENT_REDPOINT.FESTIVAL_ACTIVE_SHOP_GIFT_FREE , this.btnNode);
        } else if (this._addRedPoint) {
            this._addRedPoint = false;
            Game.redPointSys.unregisterRedPoint(EVENT_REDPOINT.FESTIVAL_ACTIVE_SHOP_GIFT_FREE , this.btnNode);
        }

        // this.preLabel.string = '¥' + this._shopConfig.norgprice;

        let flag = this._stateData.ntimes >=  this._shopConfig.nlimitbuynum;
        NodeUtils.setNodeGray(this.node , flag);
        this.goodsIco.getComponent(cc.Button).enabled = !flag;

        let len = this._shopConfig.rewarditemlist.length;
        let goodsInfoList:GoodsItemData[] = [];
        let rewardItem:GS_FestivalActivityConfig_RewardItem;
        for (let i = 0; i < len ; i++) {
            rewardItem = this._shopConfig.rewarditemlist[i];
            if (rewardItem.ngoodsid > 0) {

                goodsInfoList.push({
                    goodsId:rewardItem.ngoodsid,
                    nums:rewardItem.ngoodsnum,
                    prefix:'x',
                });
                
            }
        }

        if (goodsInfoList.length > 0) {
            this.goodsBox.array = goodsInfoList;
        }
        
    }

    onDestroy() {
        if (this._addRedPoint) {
            Game.redPointSys.unregisterRedPoint(EVENT_REDPOINT.FESTIVAL_ACTIVE_SHOP_GIFT_FREE , this.btnNode);
        }
    }

}