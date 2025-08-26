// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EResPath } from "../../common/EResPath";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { GS_GoodsInfoReturn_GoodsInfo } from "../../net/proto/DMSG_Plaza_Sub_Goods";
import { GS_LargeTurnTableFinish, GS_LargeTurntableInfo } from "../../net/proto/DMSG_Plaza_Sub_LargeTurntable";
import { GS_RewardTips, GS_RewardTips_RewardGoods } from "../../net/proto/DMSG_Plaza_Sub_Tips";
import { GOODS_ID } from "../../net/socket/handler/MessageEnum";
import { GameEvent, Reply } from "../../utils/GameEvent";
import SystemTipsMgr from "../../utils/SystemTipsMgr";
import Dialog from "../../utils/ui/Dialog";
import GroupImage from "../../utils/ui/GroupImage";
import ImageLoader from "../../utils/ui/ImageLoader";
import { UiManager } from "../../utils/UiMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TurntableView extends Dialog {

    @property(ImageLoader)
    imgs: ImageLoader[] = [];

    @property(cc.Label)
    desLabels: cc.Label[] = [];

    @property(cc.Node)
    turnNode: cc.Node = null;

    @property(cc.Node)
    choujiang: cc.Node = null;

    @property(ImageLoader)
    jiangquan: ImageLoader = null;

    @property(GroupImage)
    jiangquanNum: GroupImage = null;

    @property(cc.Node)
    turnBtn: cc.Node = null;

    @property(cc.Node)
    blankNode:cc.Node = null;

    private _goodsInfo: GS_LargeTurntableInfo = null;
    private _isTuring: boolean = false;
    private _rewardData: GS_RewardTips = null;
    private _waitForReward: boolean = false;
    protected beforeShow(): void {
        this._goodsInfo = Game.turnTableMgr.getTurnTableInfo();
        if (this._goodsInfo && this._goodsInfo.infolist) {
            let itemInfo: GS_GoodsInfoReturn_GoodsInfo;
            for (let i = 0, len = this._goodsInfo.infolist.length; i < len; i++) {
                this.imgs[i].setPicId(this._goodsInfo.infolist[i].npicid);
                itemInfo = Game.goodsMgr.getGoodsInfo(this._goodsInfo.infolist[i].nshowgoodsid);
                this.desLabels[i].string = itemInfo ? itemInfo.szgoodsname + " x" + this._goodsInfo.infolist[i].nshowgoodsnum : "";
            }
        }

        this.refreshJiangquan();
    }

    protected beforeHide(): void {
        if (this._isTuring) {
            this.onTurntableComplete();
        }
    }

    protected addEvent(): void {
        GameEvent.on(EventEnum.ON_TURNTABLE_RET, this.onRet, this);
        GameEvent.on(EventEnum.ON_TURNTABLE_REWARD, this.onReward, this);
        GameEvent.on(EventEnum.ITEM_COUNT_CHANGE, this.onMoneyChange, this);
        GameEvent.onReturn("get_btn", this.getBtnNode, this);
    }

    onDestroy(): void {
        super.onDestroy();
        GameEvent.offReturn("get_btn", this.getBtnNode, this);
    }

    private getBtnNode(reply:Reply , name:string): cc.Node {
        // let name = param && param[0] ? param[0] : "";
        if (name == 'turntable') {
            return reply(this.turnBtn);
        } else if (name == 'blank') {
            return reply(this.blankNode);
        }
        return reply(null);
    }

    private onMoneyChange(id: number, num: number) {
        if (this._goodsInfo && this._goodsInfo.ngoodsid == id) {
            this.refreshJiangquan();
        }
    }

    private refreshJiangquan() {
        if (this._goodsInfo) {
            let goodsInfo = Game.goodsMgr.getGoodsInfo(this._goodsInfo.ngoodsid);
            if (goodsInfo) {
                this.jiangquan.setPicId(goodsInfo.npacketpicid);
                this.jiangquanNum.contentStr = Game.containerMgr.getItemCount(goodsInfo.lgoodsid).toString();
            }
        }
    }

    turnTable(index: number) {
        // cc.log('turntable:', index);
        cc.tween(this.choujiang).by(0.1, { angle: -25 }).by(0.5, { angle: 25 }, { easing: "elasticOut" }).start();

        let endAngle = 5 + Math.random() * 35 + index * (360 / 8) - 8 * 360;
        let startAngle = this.turnNode.angle % 360;
        this.turnNode.angle = startAngle;
        cc.tween(this.turnNode).to(7, { angle: endAngle }, { easing: "quartInOut" }).call(() => {
            this.onTurntableComplete();
        }).start();
    }

    private clickTurn() {
        if (this._isTuring) return;
        if (this._goodsInfo && this._goodsInfo.infolist) {
            if (Game.containerMgr.getItemCount(this._goodsInfo.ngoodsid) < this._goodsInfo.ngoodsnum) {
                let goodsInfo = Game.goodsMgr.getGoodsInfo(this._goodsInfo.ngoodsid);
                return SystemTipsMgr.instance.notice((goodsInfo ? goodsInfo.szgoodsname : "奖券") + "不足");
            }
            Game.turnTableMgr.jion();
            this._waitForReward = false;
            this._isTuring = true;
        }
    }

    private onRet(data: GS_LargeTurnTableFinish) {
        let config = Game.turnTableMgr.getGoodsCfg(data.nid);
        if (config) {
            this.turnTable(Game.turnTableMgr.getGoodsIndex(data.nid));
            // if (config.bttype === TURNTABLE_TYPE.GOODS) {
            //     // Game.tipsMgr.interceptReward();
            //     cc.log("实物");
            // } else if (config.bttype === TURNTABLE_TYPE.PROP) {
            //     cc.log("道具")
            // }
        }
    }

    private onReward(data: GS_RewardTips) {
        if (this._waitForReward) {
            this.showReward(data);
            this._waitForReward = false;
        } else {
            this._rewardData = data;
        }
    }

    private onTurntableComplete() {
        this._isTuring = false;
        if (this._rewardData) {
            this.showReward(this._rewardData);
            this._rewardData = null;
        } else {
            this._waitForReward = true;
        }
    }

    private showReward(data: GS_RewardTips) {
        if (data.goodslist && data.goodslist.length) {
            switch (data.goodslist[0].sgoodsid) {
                case GOODS_ID.DIAMOND:
                    //道具
                    UiManager.showDialog(EResPath.NEW_GOODS_VIEW, { list: data.goodslist });
                    break;
                default:
                    //实物
                    UiManager.showDialog(EResPath.TURN_TABLE_EXCHANGEVIEW, data.goodslist[0]);
                    break;
            }
        }
    }

    private clickBlack() {
        if (this._isTuring) return;
        this.hide();
    }

    private onBlankClick() {
        if (this._isTuring) return;
        this.hide();
    }
}
