// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Game from "../../Game";
import { GS_ActorRechargeConfig_QuickRechargeItem } from "../../net/proto/DMSG_Plaza_Sub_Actor";
import { GS_SysActivityNew_SysActivityNewTaskItem } from "../../net/proto/DMSG_Plaza_Sub_SysActivity";
import { ACTIVE_TYPE } from "../../net/socket/handler/MessageEnum";
import BaseItem from "../../utils/ui/BaseItem";
import { NodeUtils } from "../../utils/ui/NodeUtils";
import GoodsItem from "../newhand_book/GoodsItem";
import LiCaiGoodsItem from "./LiCaiGoodsItem";
const { ccclass, property } = cc._decorator;

@ccclass
export default class WeekTehuiItem extends BaseItem {
    @property([GoodsItem])
    goodsItems: GoodsItem[] = [];

    @property(cc.Label)
    btnLabel: cc.Label = null;

    @property(cc.Node)
    discountNode: cc.Node = null;

    @property(cc.Label)
    discountLabel: cc.Label = null;

    @property([cc.SpriteFrame])
    bgSps: cc.SpriteFrame[] = [];

    @property(cc.Sprite)
    bg: cc.Sprite = null;

    @property(cc.Node)
    btnNode: cc.Node = null;

    @property(cc.Node)
    soldOut: cc.Node = null;

    @property(cc.Node)
    layout: cc.Node = null;

    private _rechargeCfg: GS_ActorRechargeConfig_QuickRechargeItem = null;

    public setData(data: any, index?: number): void {
        super.setData(data, index);
        this.refresh();
    }

    public refresh() {
        if (!this.data) return this.node.active = false;
        let cfg = this.data as GS_SysActivityNew_SysActivityNewTaskItem;
        this._rechargeCfg = Game.actorMgr.getChargeConifg(cfg.nparam1);
        if (!this._rechargeCfg) return this.node.active = false;
        //奖励
        for (let i = 0; i < this.goodsItems.length; i++) {
            if (this._rechargeCfg.ngivegoodsid[i]) {
                this.goodsItems[i].setData({
                    goodsId: this._rechargeCfg.ngivegoodsid[i],
                    nums: this._rechargeCfg.ngivegoodsnums[i],
                    prefix:"x"
                });
            } else {
                this.goodsItems[i].node.active = false;
            }
        }

        //折扣
        if (this._rechargeCfg.noriginalrmb) {
            this.discountNode.active = true;
            this.discountLabel.string = this._rechargeCfg.noriginalrmb + "%";
        } else {
            this.discountNode.active = false;
        }

        //rmb
        this.btnLabel.string = this._rechargeCfg.nneedrmb === 0 ? "免费" : "¥ " + this._rechargeCfg.nneedrmb;

        //背景
        this.bg.spriteFrame = this.bgSps[this.data.btindex];
        let activeCfg = Game.sysActivityMgr.getActivityInfo(ACTIVE_TYPE.WEEK_TEHUI);
        let isFinished = Game.sysActivityMgr.isSubTaskFinished(activeCfg.item.nid, cfg.btindex);
        this.btnNode.active = !isFinished;
        this.soldOut.active = isFinished;
        //置灰
        NodeUtils.setNodeGray(this.layout, isFinished);
    }

    onClick() {
        let cfg = Game.sysActivityMgr.getActivityInfo(ACTIVE_TYPE.WEEK_TEHUI);
        Game.sysActivityMgr.joinSysActivity(cfg.item.nid, this.data.btindex, 0);
    }
}
