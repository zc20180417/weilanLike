// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Game from "../../Game";
import GlobalVal from "../../GlobalVal";
import TipsMgr from "../../net/mgr/TipsMgr";
import { GS_EmailViewReturn_EmailViewItem } from "../../net/proto/DMSG_Plaza_Sub_EMaill";
import { EMAIL_TEXT_STATE, GOODS_ID, GOODS_TYPE } from "../../net/socket/handler/MessageEnum";
import { GameEvent } from "../../utils/GameEvent";
import { StringUtils } from "../../utils/StringUtils";
import BaseItem from "../../utils/ui/BaseItem";
import ImageLoader from "../../utils/ui/ImageLoader";

const { ccclass, property } = cc._decorator;

@ccclass
export default class EmaiItem extends BaseItem {
    @property(cc.Label)
    title: cc.Label = null;

    @property(cc.Label)
    time: cc.Label = null;

    @property(cc.Label)
    emailDes: cc.Label = null;

    @property(cc.Node)
    duqu: cc.Node = null;

    @property(cc.Node)
    lingqu: cc.Node = null;

    @property(ImageLoader)
    goodsIcon: ImageLoader[] = [];

    @property(cc.Label)
    goodsCounts: cc.Label[] = [];

    @property(cc.Node)
    rewardNode: cc.Node = null;

    setData(data: any, index?: number) {
        super.setData(data, index);
        this.refresh();
    }

    private refresh() {
        if (!this.data) return;
        let data = this.data as GS_EmailViewReturn_EmailViewItem;
        //  GS_EmailViewReturn_EmailViewItem
        //标题
        this.title.string = data.sztitle;

        //按钮
        if (data.btgoodslistcount > 0) {//道具邮件
            this.duqu.active = data.bttype == EMAIL_TEXT_STATE.TEXT;
            this.lingqu.active = !this.duqu.active;
            this.rewardNode.active = true;
            this.refreshGoods();

        } else {//事务邮件
            this.duqu.active = true;
            this.lingqu.active = false;
            this.rewardNode.active = false;
        }
    }

    private refreshGoods() {
        let goods = Game.emailMgr.getPropEmailGoods(this.data.nemaillid);
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
    private refreshTime() {
        if (!this.data) return;
        // let now = GlobalVal.getServerTime();
        let now = GlobalVal.getServerTime() / 1000;
        let time = now - this.data.nsendtime;
        this.time.string = StringUtils.getCeilTime(time);
    }

    update(dt) {
        this.refreshTime();
    }

    onDisable() {
        GameEvent.targetOff(this);
    }

    private receiveClick() {
        Game.emailMgr.reqEmailPick(this.data.nemaillid);
    }

    private readClick() {
        Game.emailMgr.reqEMailText(this.data.nemaillid);
    }
}
