// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { BuryingPointMgr, EBuryingPoint } from "../../buryingPoint/BuryingPointMgr";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { GS_VipInfo_VipLevel } from "../../net/proto/DMSG_Plaza_Sub_Actor";
import { ActorProp } from "../../net/socket/handler/MessageEnum";
import { CheckPushDialogMgr } from "../../tips/CheckPushDialogMgr";
import { GameEvent } from "../../utils/GameEvent";
import { MathUtils } from "../../utils/MathUtils";
import Dialog from "../../utils/ui/Dialog";
import GroupImage from "../../utils/ui/GroupImage";
import ImageLoader from "../../utils/ui/ImageLoader";
import List from "../../utils/ui/List";
import { NodeUtils } from "../../utils/ui/NodeUtils";
import Utils from "../../utils/Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VipView extends Dialog {
    @property(cc.Label)
    vipNum: cc.Label = null;

    @property(cc.Label)
    vipDes: cc.Label = null;

    @property(cc.Node)
    preBtn: cc.Node = null;

    @property(cc.Node)
    nextBtn: cc.Node = null;

    @property(GroupImage)
    vipProgressNum: GroupImage = null;

    @property(cc.Label)
    progressMoney: cc.Label = null;

    @property(cc.Label)
    progressVipLevel: cc.Label = null;

    @property(cc.Button)
    charge: cc.Button = null;

    @property(cc.Sprite)
    progress: cc.Sprite = null;

    @property(cc.Node)
    progressNode: cc.Node = null;

    @property(cc.Node)
    vipItem: cc.Node = null;

    @property(ImageLoader)
    vipItemIcon: ImageLoader = null;

    @property(cc.Label)
    vipItemLabel: cc.Label = null;

    @property(cc.Label)
    originPirce: cc.Label = null;

    @property(cc.Label)
    price: cc.Label = null;

    @property(cc.Node)
    soldOut: cc.Node = null;

    @property(cc.Button)
    buyBtn: cc.Button = null;

    @property(cc.Node)
    btnNode: cc.Node = null;

    @property(cc.Label)
    towerTips: cc.Label = null;

    @property(List)
    vipRechargeList: List = null;

    private _vipCfgs: Array<GS_VipInfo_VipLevel> = null;
    // private _vipPrivateData: GS_ActorVipPrivate = null;
    private _index: number = 0;
    private _vipLevel: number = 0;

    protected beforeShow() {
        // GameEvent.on(EventEnum.ON_VIP_PRIVATE_DATA, this.onVipPrivateData, this));
        GameEvent.on(EventEnum.PLAYER_PROP_CHANGE + ActorProp.ACTOR_PROP_VIPEXP, this.refreshProgress, this);
        GameEvent.on(EventEnum.PLAYER_PROP_CHANGE + ActorProp.ACTOR_PROP_VIPLEVEL, this.refresh, this);
        GameEvent.on(EventEnum.PLAYER_PROP_CHANGE + ActorProp.ACTOR_PROP_VIPRECHARGEFLAG, this.refreshBtnState, this);

        let startNode: cc.Node = GameEvent.dispathReturnEvent("get_btn", 'vip');
        if (startNode) {
            this.startPos = startNode.convertToWorldSpaceAR(cc.Vec2.ZERO_R);
            this.startPos.x -= cc.winSize.width >> 1;
            this.startPos.y -= cc.winSize.height >> 1;
        }
        BuryingPointMgr.post(EBuryingPoint.SHARE_VIP_VIEW);

        this.refresh();
    }

    protected afterHide() {
        GameEvent.targetOff(this);
    }

    // private onVipPrivateData() {
    //     // this._vipPrivateData = Game.actorMgr.getVipPrivateData();
    //     this.refreshBtnState();
    // }

    private refresh() {
        let cfgs = Game.actorMgr.getVipInfo();
        this._vipCfgs = cfgs ? cfgs.data : [];
        // this._vipPrivateData = Game.actorMgr.getVipPrivateData();
        if (this._vipCfgs.length <= 0) return;
        this._vipLevel = Game.actorMgr.getProp(ActorProp.ACTOR_PROP_VIPLEVEL);
        this._index = this._vipLevel <= 0 ? 1 : this._vipLevel;

        //当前vip等级
        this.vipProgressNum.contentStr = this._vipLevel.toString();

        this.refreshProgress();
        this.checkPreAndNextState();
        this.refreshVipContentInfo();
    }

    private refreshVipContentInfo() {
        //vip title
        this.vipNum.string = this._index.toString();

        let vipLevelCfg = this._vipCfgs[this._index];

        //vip描述
        this.vipDes.string = vipLevelCfg.szdes;

        // this.vipItem.active = true;

        // this.towerTips.node.active = false;
        //不配rmb购买
        //奖励物品
        if (vipLevelCfg.nrechargegivegoodsid[0] == 0) {
            let goodsInfo = Game.goodsMgr.getGoodsInfo(vipLevelCfg.nrechargegoodsid);
            if (goodsInfo) {
                this.vipItemIcon.setPicId(goodsInfo.npacketpicid);
            }
            this.vipItemIcon.node.active = true;
            this.vipRechargeList.array = [];
        } else {
            this.vipItemIcon.node.active = false;

            let dataList: any = [{ id: vipLevelCfg.nrechargegoodsid, num: vipLevelCfg.nrechargegoodsnum }];
            let len = vipLevelCfg.nrechargegivegoodsid.length;
            for (let i = 0; i < len; i++) {
                if (vipLevelCfg.nrechargegivegoodsid[i] > 0) {
                    dataList.push({ id: vipLevelCfg.nrechargegivegoodsid[i], num: vipLevelCfg.nrechargegivegoodsnums[i] });
                }
            }
            this.vipRechargeList.array = dataList;
        }

        this.vipItemLabel.string = vipLevelCfg.szrechargetitle;

        //奖励
        if (this._index > this._vipLevel) {
            //隐藏按钮
            this.btnNode.active = false;
            this.soldOut.active = false;
            this.towerTips.node.active = true;
            this.towerTips.string = "升级VIP" + this._index + "后才可购买专属礼包";
        } else if (!vipLevelCfg.nrechargegoodsid || (vipLevelCfg.nrechargelimittroopsid && !Game.towerMgr.isTowerUnlock(vipLevelCfg.nrechargelimittroopsid))) {
            this.btnNode.active = false;
            this.soldOut.active = false;
            this.towerTips.node.active = true;
            let towerCfg = Game.towerMgr.getTroopBaseInfo(vipLevelCfg.nrechargelimittroopsid);
            if (towerCfg) {
                this.towerTips.string = "需购买" + towerCfg.szname + "才可购买专属礼包";
            }
        } else {

            this.towerTips.node.active = false;

            //原价
            this.originPirce.string = vipLevelCfg.nrechargeoriginalrmb + "";

            //现价
            this.price.string = vipLevelCfg.nrechargeneeddiamonds + "";

            //按钮状态
            let diamond = Game.actorMgr.getProp(ActorProp.ACTOR_PROP_DIAMONDS);
            NodeUtils.enabled(this.buyBtn, vipLevelCfg.nrechargeneeddiamonds <= diamond);

            //是否已购买
            this.refreshBtnState();
        }
    }

    private refreshBtnState() {
        //领取状态
        let flag = Game.actorMgr.getProp(ActorProp.ACTOR_PROP_VIPRECHARGEFLAG);
        let finished = Utils.checkBitFlag(flag, MathUtils.clamp(this._index, 1, 31));
        this.btnNode.active = !finished;
        this.soldOut.active = finished;
    }

    private refreshProgress() {
        //vip进度
        if (this._vipLevel >= this._vipCfgs.length - 1) {//达到最大等级
            this.progressNode.active = false;
            this.progress.fillRange = 1;
            this.vipProgressNum.contentStr = (this._vipCfgs.length - 1).toString();
        } else {
            let currValue = Game.actorMgr.getProp(ActorProp.ACTOR_PROP_VIPEXP);
            let maxValue = Game.actorMgr.getProp(ActorProp.ACTOR_PROP_NEXTVIPLEVELEXP);
            this.progress.fillRange = currValue / maxValue;
            this.progressMoney.string = (maxValue - currValue) + "元";
            this.progressVipLevel.string = "Vip" + (this._vipLevel + 1);
        }
    }

    /**
     * 上一级vip
     */
    private preClick() {
        this._index--;
        this.checkPreAndNextState();
        this.refreshVipContentInfo();
    }

    /**
     * 下一级vip
     */
    private nextClick() {
        this._index++;
        this.checkPreAndNextState();
        this.refreshVipContentInfo();
    }

    private checkPreAndNextState() {
        if (this._index <= 1) {
            this._index = 1;
            this.preBtn.active = false;
        } else {
            this.preBtn.active = true;
        }

        if (this._index >= this._vipCfgs.length - 1) {
            this._index = this._vipCfgs.length - 1;
            this.nextBtn.active = false;
        } else {
            this.nextBtn.active = true;
        }
    }

    /**
     * 领取
     */
    private rewardClick() {
        Game.actorMgr.getVipReward(this._index, 1);
    }

    /**
     * 充值
     */
    private recharge() {
        CheckPushDialogMgr.instance.checkShowRechargeView();
    }
}
