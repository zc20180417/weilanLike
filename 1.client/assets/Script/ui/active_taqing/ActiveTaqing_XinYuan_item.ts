import Game from "../../Game";
import BaseItem from "../../utils/ui/BaseItem";
import ImageLoader from "../../utils/ui/ImageLoader";
import { NodeUtils } from "../../utils/ui/NodeUtils";

const { ccclass, property ,menu } = cc._decorator;

@ccclass
@menu('Game/ui/active-taqing/ActiveTaqing_XinYuan_item')
export class ActiveTaqing_XinYuan_item extends BaseItem {

    @property(ImageLoader)
    ico:ImageLoader = null;

    @property(cc.Node)
    mask:cc.Node = null;

    @property(cc.Label)
    luckyLabel:cc.Label = null;

    setData(data:any , index?:number) {
        super.setData(data , index);
        if (data) {
            let config = data.config;
            let goodsCfg = Game.goodsMgr.getGoodsInfo(config.ngoodsid);
            if (goodsCfg) {
                this.ico.setPicId(goodsCfg.npacketpicid);
            }
            this.luckyLabel.string = '幸运值x' + config.nwishneednum;
            let geted = data.geted;
            this.node.getComponent(cc.Button).enabled = !geted;
            NodeUtils.setNodeGray(this.ico.node , geted);
        }
    }


    public onSelect() {
        this.mask.active = true;
    }

    public unSelect() {
        this.mask.active = false;
    }

}