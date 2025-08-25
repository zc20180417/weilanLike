import Game from "../../Game";
import BaseItem from "../../utils/ui/BaseItem";
import ImageLoader from "../../utils/ui/ImageLoader";

const { ccclass, property , menu } = cc._decorator;

@ccclass
@menu("Game/ui/vip/VipRechargeItem")
export class VipRechargeItem extends BaseItem {
    @property(ImageLoader)
    ico:ImageLoader = null;

    @property(cc.Label)
    label:cc.Label = null;


    setData(data:any , index = 0) {
        super.setData(data);
        if (data) {
            let goodsInfo = Game.goodsMgr.getGoodsInfo(data.id);
            if (goodsInfo) {
                this.ico.setPicId(goodsInfo.npacketpicid);
            }

            this.label.string = 'x' + data.num; 
        }
    }
}