// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Dialog from "../../utils/ui/Dialog";
import Game from "../../Game";
import ImageLoader from "../../utils/ui/ImageLoader";
import { GS_MallGoodsList_MallGoodsItem } from "../../net/proto/DMSG_Plaza_Sub_Mall";

const { ccclass, property } = cc._decorator;


@ccclass
export default class NewSkillView extends Dialog {
    @property(ImageLoader)
    icon: ImageLoader = null;

    @property(cc.Label)
    title: cc.Label = null;

    @property(cc.Label)
    costLabel: cc.Label = null;

    @property(cc.Label)
    des: cc.Label = null;

    _data: any = null;

    setData(data: any) {
        this._data = data;
    }

    onLoad() {
        super.onLoad();

        this.refresh();
    }

    refresh() {
        if (!this._data) return;
        let goodsCfg: GS_MallGoodsList_MallGoodsItem = Game.mallProto.getGoodsConfig(this._data.itemId);
        if (goodsCfg) {
            this.icon.setPicId(goodsCfg.npicid);
            this.des.string = goodsCfg.szdes;
            this.title.string = goodsCfg.sztitle;
            this.costLabel.string = "需要           " + goodsCfg.npricenums + " ";
        }
    }

}
