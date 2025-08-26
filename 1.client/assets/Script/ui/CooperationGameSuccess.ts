// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Game from "../Game";
import { GS_BountyCooperationGameEnd } from "../net/proto/DMSG_Plaza_Sub_BountyCooperation";
import { GOODS_ID } from "../net/socket/handler/MessageEnum";
import Dialog from "../utils/ui/Dialog";
import ImageLoader from "../utils/ui/ImageLoader";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CooperationGameSuccess extends Dialog {
    @property(cc.Label)
    title: cc.Label = null;

    @property(cc.Label)
    label0: cc.Label = null;

    @property(cc.Label)
    label1: cc.Label = null;

    @property(ImageLoader)
    goodsImg0:ImageLoader = null;

    @property(ImageLoader)
    goodsImg1:ImageLoader = null;

    private _data:GS_BountyCooperationGameEnd;
    public setData(data: any): void {
        this._data = data;
    }

    protected beforeShow(): void {
        this.title.string = `恭喜通关：${this._data.uendlayer}`;

        for (let i = 0; i < this._data.urewardcount; i++) {
            const element = this._data.rewards[i];
            let goodsInfo = Game.goodsMgr.getGoodsInfo(element.ngoodsid);
            if (goodsInfo && this['goodsImg' + i]) {
                (this['goodsImg' + i] as ImageLoader).setPicId(goodsInfo.npacketpicid);
                (this['label' + i] as cc.Label).string = element.ngoodsnum.toString();
            }
        }
    }


    private clickHome() {
        Game.cooperateGameCtrl.exitMap();
        this.hide();
    }
}
