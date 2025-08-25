// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EResPath } from "../../common/EResPath";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { Lang, LangEnum } from "../../lang/Lang";
import { GS_LuckDrawInfo_Item, GS_LuckDrawRet } from "../../net/proto/DMSG_Plaza_Sub_LuckDrawPlugin";
import { ActorProp, GOODS_ID, LUCK_DRAW_JION_TYPE } from "../../net/socket/handler/MessageEnum";
import { GameEvent } from "../../utils/GameEvent";
import Dialog from "../../utils/ui/Dialog";
import GroupImage from "../../utils/ui/GroupImage";
import ImageLoader from "../../utils/ui/ImageLoader";
import { UiManager } from "../../utils/UiMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TenCardsView extends Dialog {
    @property(cc.Node)
    preNode: cc.Node = null;

    @property(cc.Node)
    nextNode: cc.Node = null;

    @property(ImageLoader)
    singleCostIco: ImageLoader = null;

    @property(cc.Label)
    singleCostLabel: cc.Label = null;

    @property(ImageLoader)
    tenCostIco: ImageLoader = null;

    @property(cc.Label)
    tenCostLabel: cc.Label = null;

    @property(cc.Node)
    discounNode: cc.Node = null;

    @property(cc.Label)
    discountLabel: cc.Label = null;

    @property(cc.Label)
    countLabel: cc.Label = null;

    @property(ImageLoader)
    background: ImageLoader = null;

    @property(GroupImage)
    redpacketLabel: GroupImage = null;

    @property(ImageLoader)
    redpacketIcon: ImageLoader = null;

    @property(GroupImage)
    diamondLabel: GroupImage = null;

    @property(ImageLoader)
    diamondIcon: ImageLoader = null;

    @property(cc.Label)
    tips1: cc.Label = null;

    @property(cc.Label)
    qualityTips: cc.Label = null;

    @property(cc.Label)
    singleTips: cc.Label = null;

    @property(cc.Label)
    tenTips: cc.Label = null;

    @property(cc.Label)
    rateTips: cc.Label = null;

    @property(cc.Label)
    discountTips: cc.Label = null;

    @property(cc.Color)
    tenColor:cc.Color = null;

    @property(cc.Color)
    onceColor:cc.Color = null;

    @property(cc.Widget)
    leftWidget:cc.Widget = null;

    @property(cc.Widget)
    rightWidget:cc.Widget = null;

    private data: Array<GS_LuckDrawInfo_Item> = null;
    private currIndex = 0;
    private _singleType:LUCK_DRAW_JION_TYPE;
    private _tenType:LUCK_DRAW_JION_TYPE;
    beforeShow() {
        this.tips1.string = Lang.getL(LangEnum.TEN_CARD_TIPS1);
        this.qualityTips.string = Lang.getL(LangEnum.PINK);
        this.singleTips.string = Lang.getL(LangEnum.ZHAO_MU);
        this.tenTips.string = Lang.getL(LangEnum.ZHAO_MU) + " x10";
        this.rateTips.string = Lang.getL(LangEnum.WATCH_RATE);
        this.discountTips.string = Lang.getL(LangEnum.DISCOUNT);
        this.onDiamondChange();
        this.refresh();

        if (cc.winSize.width / cc.winSize.height > 1.79) {
            this.leftWidget.left = 25;
            this.rightWidget.right = 25;
        }
    }

    protected addEvent(): void {
        GameEvent.on(EventEnum.ON_LUCK_INFO, this.refresh, this);
        GameEvent.on(EventEnum.ON_LUCK_PRIVATE, this.refreshpage, this);
        GameEvent.on(EventEnum.ON_LUCK_JION_RET, this.onLuckJionRet, this);
        GameEvent.on(EventEnum.ON_LUCK_JION_CLEAR, this.refreshpage, this);
        GameEvent.on(EventEnum.ITEM_COUNT_CHANGE, this.onRedpacketChange, this);
        GameEvent.on(EventEnum.PLAYER_PROP_CHANGE + ActorProp.ACTOR_PROP_DIAMONDS, this.onDiamondChange, this);
    }

    private onDiamondChange() {
        this.diamondLabel.contentStr = Game.actorMgr.getDiamonds().toString();
    }

    private refresh() {
        this.data = Game.luckDrawMgr.getLuckDrawInfos();
        this.refreshpage(this.currIndex);
        this.preNode.active = this.data.length >= 2;
        this.nextNode.active = this.data.length >= 2;
        this.onRedpacketChange(GOODS_ID.REDPACKET, Game.containerMgr.getItemCount(GOODS_ID.REDPACKET));
    }

    private refreshpage(index?: number) {
        index = index === undefined ? 0 : index;
        index = index % this.data.length;
        index = index >= 0 ? index : index + this.data.length;
        this.currIndex = index;
        let itemInfo = this.data[index];
        if (itemInfo) {
            //背景
            let itemPrivate = Game.luckDrawMgr.getLuckDrawPrivate(itemInfo.nid);
            this.background.setPicId(itemInfo.nbackpicid);
            //抽卡消耗
            let goodsInfo = Game.goodsMgr.getGoodsInfo(itemInfo.nneedgoodsid);
            let diamondGoods = Game.goodsMgr.getGoodsInfo(GOODS_ID.DIAMOND);
            if (!goodsInfo || !diamondGoods) return;

            let oneEnough = Game.containerMgr.isEnough(itemInfo.nneedgoodsid , itemInfo.nonenum);
            let tenEnough = Game.containerMgr.isEnough(itemInfo.nneedgoodsid , itemInfo.ntennum);

            if (!oneEnough && itemInfo.nonediamonds > 0) {
                this.singleCostIco.setPicId(diamondGoods.npacketpicid);
                this.singleCostLabel.string = itemInfo.nonediamonds.toString();
                this._singleType = LUCK_DRAW_JION_TYPE.DIA_SINGLE;

                this.setOneColor(Game.actorMgr.getDiamonds() >= itemInfo.nonediamonds);

            } else {
                this.singleCostIco.setPicId(goodsInfo.npacketpicid);
                this.singleCostLabel.string = itemInfo.nonenum.toString();
                this._singleType = LUCK_DRAW_JION_TYPE.PROP_SINGLE;
                this.setOneColor(oneEnough);
            }

            if (!tenEnough && itemInfo.ntendiamonds > 0) {
                this.tenCostIco.setPicId(diamondGoods.npacketpicid);
                this.tenCostLabel.string = itemInfo.ntendiamonds.toString();
                this._tenType = LUCK_DRAW_JION_TYPE.DIA_TEN;

                this.setTenColor(Game.actorMgr.getDiamonds() >= itemInfo.ntendiamonds);
            } else {
                this.tenCostIco.setPicId(goodsInfo.npacketpicid);
                this.tenCostLabel.string = itemInfo.ntennum.toString();
                this._tenType = LUCK_DRAW_JION_TYPE.PROP_TEN;
                this.setTenColor(tenEnough);
            }
            //抽卡次数限制
            this.refreshPlayCount((itemPrivate ? itemPrivate.ndayplaycount : 0), itemInfo.ndaymaxcount);
        }

        //红包
        let goodsInfo = Game.goodsMgr.getGoodsInfo(GOODS_ID.REDPACKET);
        if (goodsInfo) {
            this.redpacketIcon.setPicId(goodsInfo.npacketpicid);
        }
    }

    private setOneColor(flag:boolean) {
        this.singleCostLabel.node.color = flag ? this.onceColor : cc.Color.RED;
        // this.singleTips.node.color = flag ? this.onceColor : cc.Color.RED;
    }

    private setTenColor(flag:boolean) {
        this.tenCostLabel.node.color = flag ? this.tenColor : cc.Color.RED;
        // this.tenTips.node.color = flag ? this.tenColor : cc.Color.RED;
    }

    private onLuckJionRet(data: GS_LuckDrawRet) {
        if (this.data[this.currIndex].nid !== data.nid) return;
        let itemInfo = Game.luckDrawMgr.getLuckDrawInfo(data.nid);
        this.refreshPlayCount(data.ndayplaycount, itemInfo.ndaymaxcount);
        UiManager.showDialog(EResPath.TEN_CARDS_CARDS_VIEW, data);
    }

    private onSingleJionClick() {
        // UiManager.showDialog(EResPath.TEN_CARDS_CARDS_VIEW);
        if (this.data[this.currIndex]) {
            Game.luckDrawMgr.luckDrawJion(this.data[this.currIndex].nid, this._singleType);
        }
    }

    private onTenJionClick() {
        if (this.data[this.currIndex]) {
            Game.luckDrawMgr.luckDrawJion(this.data[this.currIndex].nid, this._tenType);
        }
    }

    private selectPrePage() {
        this.refreshpage(this.currIndex - 1);
    }

    private selectNextPage() {
        this.refreshpage(this.currIndex + 1);
    }

    private onInfoClick() {
        // UiManager.showDialog(EResPath.TEN_CARDS_TIPS_VIEW, "test");
        if (this.data[this.currIndex]) {
            UiManager.showDialog(EResPath.TEN_CARDS_TIPS_VIEW, this.data[this.currIndex].sztitle);
        }
    }

    private onRedpacketChange(id: number, num: number) {
        if (id === GOODS_ID.REDPACKET) {
            this.redpacketLabel.contentStr = num.toString();
            this.refreshpage(this.currIndex);
        }
    }

    private refreshPlayCount(curr: number, max: number) {
        this.countLabel.string = Lang.getL(LangEnum.DRAW_CARD_COUNT) + curr + "/" + max;
    }

    onDestroy(): void {
        GameEvent.targetOff(this);
    }
}
