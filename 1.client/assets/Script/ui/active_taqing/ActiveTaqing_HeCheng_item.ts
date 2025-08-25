import { EResPath } from "../../common/EResPath";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { GS_FestivalActivityConfig_CombineConfig } from "../../net/proto/DMSG_Plaza_Sub_FestivalActivity";
import { GOODS_TYPE } from "../../net/socket/handler/MessageEnum";
import { GameEvent } from "../../utils/GameEvent";
import { StringUtils } from "../../utils/StringUtils";
import BaseItem from "../../utils/ui/BaseItem";
import ImageLoader from "../../utils/ui/ImageLoader";
import { NodeUtils } from "../../utils/ui/NodeUtils";
import { UiManager } from "../../utils/UiMgr";
import { ItemMaskTipsViewData } from "../tips/ItemMaskTipsView";

const { ccclass, property ,menu } = cc._decorator;

@ccclass
@menu('Game/ui/active-taqing/ActiveTaqing_HeCheng_item')
export class ActiveTaqing_HeCheng_item extends BaseItem {

    @property(ImageLoader)
    goodsItem0:ImageLoader = null;
    @property(ImageLoader)
    goodsItem1:ImageLoader = null;
    @property(ImageLoader)
    goodsItem2:ImageLoader = null;

    @property(ImageLoader)
    goodsItem3:ImageLoader = null;

    @property(cc.Node)
    emptyNode0:cc.Node = null;
    @property(cc.Node)
    emptyNode1:cc.Node = null;
    @property(cc.Node)
    emptyNode2:cc.Node = null;
    @property(cc.Node)
    emptyNode3:cc.Node = null;

    private _combingData:number[] = [];
    private _config:GS_FestivalActivityConfig_CombineConfig;
    onClick(e:any , index:number) {
        if (!this.data) return;
        UiManager.showDialog(EResPath.ACTIVE_TAQING_HE_CHENG_TIPS , this._data.config.nid + "_" + index);
    }

    onZongziClick(event:any) {
        if (!this.data || this.data.state.ntimes <= 0) return;
        let goodsCfg = Game.goodsMgr.getGoodsInfo(this.data.config.ncombinegoodsid);

        if (goodsCfg && goodsCfg.lgoodstype === GOODS_TYPE.GOODSTYPE_CARD_TROOPSCARDBAG) {
            UiManager.showDialog(EResPath.CARD_BAG_PREVIEW, goodsCfg.lgoodsid);
            return;
        }

        let str = "";
        let tempStr;
        str += StringUtils.richTextSizeFormat(StringUtils.richTextColorFormat(goodsCfg.szgoodsname, "#995124"), 24);
        tempStr = "\n" + goodsCfg.sztips;
        str += StringUtils.richTextSizeFormat(StringUtils.richTextColorFormat(tempStr, "#a75f49"), 20);
        let data: ItemMaskTipsViewData = {
            node: event.target,
            tips: str
        };
        UiManager.showDialog(EResPath.ITEM_MASK_TIPS_VIEW, data);
    }

    setData(data:any , index:number) {
        this.removeEvent();
        this._config = null;
        this._combingData = [];
        super.setData(data , index);
        if (!data) return;
        this._config = data.config as GS_FestivalActivityConfig_CombineConfig;
        this.addEvent();
        if (data.state.ntimes > 0) {
            for (let i = 0 ; i < 3 ; i++) {
                let goods = Game.goodsMgr.getGoodsInfo(this._config.nrequiregoodsids[i]);
                this['goodsItem' + i].setPicId(goods.npacketpicid);
                NodeUtils.setNodeGray(this['goodsItem' + i].node , true);
            }

            let goods3 = Game.goodsMgr.getGoodsInfo(this._config.ncombinegoodsid);
            this.goodsItem3.setPicId(goods3.npacketpicid);
            NodeUtils.setNodeGray(this.goodsItem3.node , true);


            for (let i = 0 ; i < 4 ; i++) {
                this['emptyNode' + i].active = false;
            }

        } else {
            for (let i = 0 ; i < 4 ; i++) {
                this['emptyNode' + i].active = true;
            }

            for (let i = 0 ; i < 4 ; i++) {
                this['goodsItem' + i].clear();
            }
        }

        let tempList = Game.festivalActivityMgr.getTempCombingList(this._config.nid);
        if (tempList) {
            this._combingData = tempList;
            for (let i = 0 ; i < tempList.length ; i++) {
                let goodsId = tempList[i];
                if (goodsId > 0) {
                    this.setItemGoods(i , goodsId);
                }
            }
        }
    }

    onDestroy() {
        this.removeEvent();
    }

    private setItemGoods(index:number , goodsId:number) {
        this['emptyNode' + index].active = false;

        let tempId = this._combingData[index];
        if (tempId > 0) {
            Game.festivalActivityMgr.cacheCombingItem(goodsId);
        }

        let goodsInfo = Game.goodsMgr.getGoodsInfo(goodsId);
        this['goodsItem' + index].setPicId(goodsInfo.npacketpicid);
        this._combingData[index] = goodsId;

        Game.festivalActivityMgr.setCombingItem(goodsId , index , this.data.config.nid);
        NodeUtils.setNodeGray(this['goodsItem' + index].node , false);
        let flag = true;
        for (let i = 0 ; i < 3 ; i++) {
            if (this._combingData[i] == undefined) {
                flag = false;
                break;
            } 
        }

        if (flag) {
            Game.festivalActivityMgr.reqCombineDo(this._combingData);
        }
    }

    private removeEvent() {
        GameEvent.off(EventEnum.ACTIVE_TAQING_SELECT_HECHENG_ITEM , this.onSelectItem , this);
    }

    private addEvent() {
        GameEvent.on(EventEnum.ACTIVE_TAQING_SELECT_HECHENG_ITEM , this.onSelectItem , this);
    }

    private onSelectItem(tag:string , goodsid:number) {
        if (!this._data) return;
        let arr = tag.split("_");
        let id = Number(arr[0]);
        if (id  == this._data.config.nid) {

            let index = Number(arr[1]);
            this.setItemGoods(index , goodsid);
            
        }
    }

}