// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Game from "../Game";
import { Lang, LangEnum } from "../lang/Lang";
import { GS_BountyCooperationGameEnd } from "../net/proto/DMSG_Plaza_Sub_BountyCooperation";
import { GOODS_ID } from "../net/socket/handler/MessageEnum";
import Dialog from "../utils/ui/Dialog";
import ImageLoader from "../utils/ui/ImageLoader";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CooperationGameFaildView extends Dialog {
    @property(cc.Label)
    title: cc.Label = null;

    @property(ImageLoader)
    goodsImg0:ImageLoader = null;

    @property(ImageLoader)
    goodsImg1:ImageLoader = null;
    @property(cc.Label)
    label0:cc.Label = null;

    @property(cc.Label)
    label1:cc.Label = null;

    @property(cc.Node)
    awardNode:cc.Node = null;

    @property(cc.Label)
    noingLabel:cc.Label = null;

    @property(cc.Node)
    jilu:cc.Node = null;

    @property(cc.Label)
    newTips:cc.Label = null;

    private _data:GS_BountyCooperationGameEnd;
    public setData(data: any): void {
        this._data = data;
    }

    protected beforeShow(): void {
        this.title.string = `挑战波数：${this._data.uendlayer}`;
        let privateData = Game.cooperateNetCtrl.getPrivateData();
        if (privateData) {
            let flag = this._data.uendlayer > privateData.nhistorylayer;
            // let flag = true;
            this.jilu.active = flag;
            this.newTips.node.active = flag;
            this.noingLabel.node.active = !flag;
            this.awardNode.active = flag;
            if (flag) {
                privateData.nhistorylayer = this._data.uendlayer;
                this.newTips.string = Lang.getL(LangEnum.CooperateNewWaveTips);
                let reward = Game.cooperateNetCtrl.getLayerAward(this._data.uendlayer);
                if (reward) {
                    let len = reward.ngoodsid ? reward.ngoodsid.length : 0;
                    let index = 0;
                    for (let i = 0; i < len; i++) {
                        if (reward.ngoodsid[i] > 0) {
                            const element = reward.ngoodsid[i];
                            let goodsInfo = Game.goodsMgr.getGoodsInfo(element);
                            if (goodsInfo && this['goodsImg' + index]) {
                                (this['goodsImg' + index] as ImageLoader).setPicId(goodsInfo.npacketpicid);
                                (this['label' + index] as cc.Label).string = reward.ngoodsnum[i].toString();
                            }

                            index ++;
                        }
                    }
                }

            } else {
                this.noingLabel.string = Lang.getL(LangEnum.CooperateGameFaildTips);
            }
        }


        /*
        this.noingNode.active = this._data.urewardcount == 0;
        this.awardNode.active = this._data.urewardcount > 0;

        for (let i = 0; i < this._data.urewardcount; i++) {
            const element = this._data.rewards[i];
            let goodsInfo = Game.goodsMgr.getGoodsInfo(element.ngoodsid);
            if (goodsInfo && this['goodsImg' + i]) {
                (this['goodsImg' + i] as ImageLoader).setPicId(goodsInfo.npacketpicid);
                (this['label' + i] as cc.Label).string = element.ngoodsnum.toString();
            }
        }
        */

    }


    private clickHome() {
        Game.cooperateGameCtrl.exitMap();
        this.hide();
    }
}
