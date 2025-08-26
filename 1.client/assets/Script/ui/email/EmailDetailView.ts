// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { GS_EmailViewReturn_EmailViewItem, GS_EmailViewTextReturn } from "../../net/proto/DMSG_Plaza_Sub_EMaill";
import { GameEvent } from "../../utils/GameEvent";
import Dialog from "../../utils/ui/Dialog";
import ImageLoader from "../../utils/ui/ImageLoader";

const { ccclass, property } = cc._decorator;

@ccclass
export default class EmailDetailView extends Dialog {
    @property(cc.Label)
    text: cc.Label = null;

    @property(cc.Label)
    title: cc.Label = null;

    @property(cc.Node)
    textNode: cc.Node = null;

    @property(cc.Node)
    propNode: cc.Node = null;

    @property(ImageLoader)
    goodsIcon: ImageLoader[] = [];

    @property(cc.Label)
    goodsCounts: cc.Label[] = [];

    @property(cc.Node)
    scrollView: cc.Node = null;

    @property(cc.Node)
    viewNode: cc.Node = null;

    private emailItem: GS_EmailViewReturn_EmailViewItem = null;

    private _longEmailHeight: number = 350;
    private _shortEmailHeight: number = 250;

    setData(data: GS_EmailViewTextReturn) {
        if (!data) return;
        let emialItem: GS_EmailViewReturn_EmailViewItem = Game.emailMgr.getEmailItem(data.nemailid);
        this.emailItem = emialItem;
        this.propNode.active = !!emialItem;
        this.textNode.active = !this.propNode.active;

        this.scrollView.height = this.propNode.active ? this._shortEmailHeight : this._longEmailHeight;
        this.viewNode.height = this.scrollView.height;

        if (emialItem) {//道具邮件返回
            let goods = Game.emailMgr.getPropEmailGoods(data.nemailid);
            if (!goods) return;
            let info, goodsInfo;
            for (let i = 0; i < 3; i++) {
                goodsInfo = goods[i];
                if (goodsInfo) {
                    this.goodsIcon[i].node.parent.active = true;
                    info = Game.goodsMgr.getGoodsInfo(goodsInfo.ngoodsid);
                    info && this.goodsIcon[i].setPicId(info.npacketpicid);

                    this.goodsCounts[i].string = goodsInfo.ngoodsnum.toString();
                } else {
                    this.goodsIcon[i].node.parent.active = false;
                }
            }
        }

        this.text.string = data.data2;
        this.title.string = data.sztitle;
        GameEvent.on(EventEnum.ON_EMAIL_RECEIVE, this.onEmailReceive, this);
    }

    public afterHide() {
        GameEvent.targetOff(this);
    }

    private onEmailReceive() {
        this.hide();
    }

    private getReward() {
        Game.emailMgr.reqEmailPick(this.emailItem.nemaillid);
    }

    comfirm() {
        this.hide();
    }
}
