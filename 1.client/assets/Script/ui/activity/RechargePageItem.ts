// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { Lang, LangEnum } from "../../lang/Lang";
import { FIRST_RECHARGE_STATE } from "../../net/socket/handler/MessageEnum";
import { GameEvent } from "../../utils/GameEvent";
import { MathUtils } from "../../utils/MathUtils";
import { FirstRechargeInfo } from "../actor/ActorMgr";
import TapPageItem from "../dayInfoView/TapPageItem";
import GoodsItem, { GoodsItemData } from "../newhand_book/GoodsItem";

const { ccclass, property } = cc._decorator;

const DAY_MAP = {
    "1": "一",
    "2": "二",
    "3": "三"
}

@ccclass
export default class RechargePageItem extends TapPageItem {
    @property(cc.ToggleContainer)
    toggleContainer: cc.ToggleContainer = null;

    @property(cc.Node)
    goodsNode: cc.Node = null;

    @property(cc.Node)
    btnNode: cc.Node = null;

    @property(cc.Label)
    currDay: cc.Label = null;

    @property(cc.Label)
    selectTitle: cc.Label[] = [];

    @property(cc.Label)
    unselectTitle: cc.Label[] = [];

    private buyBtn: cc.Button = null;
    private reciveBtn: cc.Button = null;
    private recivedNode: cc.Node = null;

    private goodsItems: GoodsItem[] = [];

    private currIndex: number = 0;
    private cusorInit: boolean = false;
    onLoad() {
        let btnChildren = this.btnNode.children;
        this.buyBtn = btnChildren[0].getComponent(cc.Button);
        this.reciveBtn = btnChildren[1].getComponent(cc.Button);
        this.recivedNode = btnChildren[2];

        this.buyBtn.node.on("click", this.buy, this);
        this.reciveBtn.node.on("click", this.recive, this);

        let goodsChildren = this.goodsNode.children;
        for (let v of goodsChildren) {
            this.goodsItems.push(v.getComponent(GoodsItem));
        }
    }

    start() {
        let currDayIndex = this.getCurrDay();

        if (this.selectTitle.length) {
            for (let i = 0, len = this.selectTitle.length; i < len; i++) {
                this.selectTitle[i].string = "第 " + (i + 1) + " 天";
            }
        }

        if (this.unselectTitle.length) {
            for (let i = 0, len = this.unselectTitle.length; i < len; i++) {
                this.unselectTitle[i].string = "第 " + (i + 1) + " 天";
            }
        }

        this.buyBtn.node.children[0].getComponent(cc.Label).string = Lang.getL(LangEnum.BUY);
        this.reciveBtn.node.children[0].getComponent(cc.Label).string = Lang.getL(LangEnum.RECIVE);
        this.recivedNode.children[0].getComponent(cc.Label).string = Lang.getL(LangEnum.RECIVED);

        this.toggleContainer.toggleItems[currDayIndex]["toggle"](true);
    }

    onEnable() {
        GameEvent.on(EventEnum.FIRST_RECHARGE_PRIVATE, this.refresh, this);
    }

    onDisable() {
        GameEvent.off(EventEnum.FIRST_RECHARGE_PRIVATE, this.refresh, this);
    }

    onDestroy() {

    }

    refresh() {
        if (this.isDataValid()) {
            if (this.currDay && !this.cusorInit) {
                this.cusorInit = true;
                //将游标移动到当前天
                let currDayIndex = this.getCurrDay();
                this.currDay.string = "第" + DAY_MAP[MathUtils.clamp(currDayIndex + 1, 1, 3)] + "天";
                let worldPos = this.toggleContainer.toggleItems[currDayIndex].node.convertToWorldSpaceAR(cc.Vec2.ZERO_R);
                this.currDay.node.parent.x = this.currDay.node.parent.parent.convertToNodeSpaceAR(worldPos).x;
            }

            let data = this.data as FirstRechargeInfo;
            let state = Game.actorMgr.getFirstRechargeState(data.item.btflag, this.currIndex);

            //奖励物品
            for (let i = 0, len = this.goodsItems.length; i < len; i++) {
                let goodsItem = data.goodsItem[this.currIndex];
                // this.goodsItems[i].node.active = true;
                let goodsItemData: GoodsItemData = {
                    goodsId: goodsItem.ngoodsids[i],
                    nums: goodsItem.ngoodsnums[i],
                    gray: state === FIRST_RECHARGE_STATE.RECIVED,
                    showGou: state === FIRST_RECHARGE_STATE.RECIVED,
                    prefix: "x"
                }
                this.goodsItems[i].setData(goodsItemData, i);
            }

            //按钮状态
            this.refreshBtnState(state);
        }
    }

    private onToggleClick(toggle: cc.Toggle) {
        this.currIndex = toggle.node.getSiblingIndex();
        this.refresh();
    }

    private buy() {
        if (this.isDataValid()) {
            let data = this.data as FirstRechargeInfo;
            Game.actorMgr.reqFirstRecharge(data.item.btflag);
        }
    }

    private recive() {
        if (this.isDataValid()) {
            let data = this.data as FirstRechargeInfo;
            Game.actorMgr.reciveFirstRechargeReward(data.item.btflag, this.currIndex);
        }
    }

    private getCurrDay(): number {
        if (this.isDataValid()) {
            let data = this.data as FirstRechargeInfo;
            return Game.actorMgr.getFirstRechargeCurrDayIndex(data.item.btflag);
        }
        return 0;
    }

    private isDataValid() {
        return !!(this.data && this.data.goodsItem[this.currIndex]);
    }

    private refreshBtnState(state: FIRST_RECHARGE_STATE) {
        this.recivedNode.active = state === FIRST_RECHARGE_STATE.RECIVED;
        this.buyBtn.node.active = state === FIRST_RECHARGE_STATE.BUY;
        this.reciveBtn.node.active = state === FIRST_RECHARGE_STATE.RECIVE;
    }
}
