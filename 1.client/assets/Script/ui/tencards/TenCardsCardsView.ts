// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { QUALITY_BG_COLOR } from "../../common/AllEnum";
import Game from "../../Game";
import { Lang, LangEnum } from "../../lang/Lang";
import { GS_LuckDrawRet, GS_LuckDrawRet_Item } from "../../net/proto/DMSG_Plaza_Sub_LuckDrawPlugin";
import { GS_TroopsInfo_TroopsInfoItem } from "../../net/proto/DMSG_Plaza_Sub_Troops";
import { GOODS_ID, GOODS_TYPE, LUCK_DRAW_JION_TYPE } from "../../net/socket/handler/MessageEnum";
import { MathUtils } from "../../utils/MathUtils";
import Dialog from "../../utils/ui/Dialog";
import ImageLoader from "../../utils/ui/ImageLoader";
import BgScrollAni from "../towerStarSys/bgScrollAni";
import TenCardsCardItem, { TenCardsCardItemData } from "./TenCardsCardItem";

const { ccclass, property } = cc._decorator;

enum STAGE {
    NONE,
    OPENED,
}

@ccclass
export default class TenCardsCardsView extends Dialog {
    @property(cc.Node)
    catNode: cc.Node = null;

    @property(cc.Node)
    uiLayer: cc.Node = null;

    @property(cc.Node)
    tipsNode: cc.Node = null;

    @property(ImageLoader)
    costIco: ImageLoader = null;

    @property(cc.Label)
    costLabel: cc.Label = null;

    @property(BgScrollAni)
    bgAni: BgScrollAni = null;

    @property(cc.Node)
    bgNode: cc.Node = null;

    @property(cc.Node)
    bgFrontNode: cc.Node = null;

    @property(cc.Node)
    singleLayer: cc.Node = null;

    @property(cc.Node)
    tenLayer: cc.Node = null;

    @property(cc.Prefab)
    card: cc.Prefab = null;

    @property(cc.Label)
    costDes: cc.Label = null;

    @property(cc.Label)
    qeuding: cc.Label = null;

    @property(cc.Label)
    clickTips: cc.Label = null;

    private data: GS_LuckDrawRet = null;

    private cardItems: TenCardsCardItem[] = [];
    private stage: STAGE = STAGE.NONE;
    private enableClick: boolean = true;
    private _isSingle: boolean = true;
    private aniDelay: number = 0.05;
    private _enableBgTransition: boolean = true;
    private maxQuality: number = 1;
    private flipEndCount: number = 0;
    private _buyType:LUCK_DRAW_JION_TYPE;
    setData(data: GS_LuckDrawRet) {
        this.data = data;
        this.refresh();
    }

    protected beforeShow(): void {
        this.clickTips.string = Lang.getL(LangEnum.CLICK_TO_FLIP);
        this.qeuding.string = Lang.getL(LangEnum.QEUDING);
    }

    private refresh() {
        if (this.data) {
            this.cardItems.forEach(v => v.node.destroy());
            this.cardItems.length = 0;

            this.setCatVisiable(true);

            this.uiLayer.active = false;
            this.tipsNode.active = true;
            this.bgFrontNode.active = false;

            this.stage = STAGE.NONE;
            this._enableBgTransition = true;
            //抽卡消耗
            this._isSingle = this.isSingle();
            let itemInfo = Game.luckDrawMgr.getLuckDrawInfo(this.data.nid);
            let goodsinfo = Game.goodsMgr.getGoodsInfo(itemInfo.nneedgoodsid);
            let diamondInfo = Game.goodsMgr.getGoodsInfo(GOODS_ID.DIAMOND);

            let goodsnum = this._isSingle ? itemInfo.nonenum : itemInfo.ntennum;
            let diamondnum = this._isSingle ? itemInfo.nonediamonds : itemInfo.ntendiamonds;

            if (!Game.containerMgr.isEnough(itemInfo.nneedgoodsid , goodsnum) && diamondnum > 0) {

                this.costLabel.string = diamondnum.toString();
                this.costIco.setPicId(diamondInfo.npacketpicid);
                this._buyType = this._isSingle ? LUCK_DRAW_JION_TYPE.DIA_SINGLE:LUCK_DRAW_JION_TYPE.DIA_TEN;
            } else {
                this.costIco.setPicId(goodsinfo.npacketpicid);
                this.costLabel.string = goodsnum.toString();
                this._buyType = this._isSingle ? LUCK_DRAW_JION_TYPE.PROP_SINGLE:LUCK_DRAW_JION_TYPE.PROP_TEN;
            }
            let quality = this._isSingle ? 1 : 3;
            this.updateBgAni(quality, QUALITY_BG_COLOR[quality.toString()]);

            this.genCards();
            this.setCatVisiable(false);
            this.enableClick = false;
            this.tipsNode.active = true;
            this.maxQuality = this.getCardMaxQuality();
            this.flipEndCount = 0;

            this.costDes.string = Lang.getL(LangEnum.ZHAO_MU) + (this._isSingle ? "" : " x10");
        }
    }

    private onClick() {
        if (!this.data || !this.enableClick) return;
        switch (this.stage) {
            case STAGE.NONE: this.flipCards(); break;
        }
    }

    private genCards() {
        if (!this.data.uitemcount) {
            this.showBtn();
            return;
        }
        let layers = this._isSingle ? this.singleLayer.children : this.tenLayer.children;
        let flatItems: TenCardsCardItemData[] = [];
        let enableConvert = false;
        for (let v of this.data.items) {
            let goodsInfo = Game.goodsMgr.getGoodsInfo(v.ngoodsid);
            if (goodsInfo.lgoodstype != GOODS_TYPE.GOODSTYPE_RES_UPGRADESTAR) {
                enableConvert = true;
            } else {
                for (let i = 0; i < v.ngoodsnum; i++) {
                    // let goodsInfo = Game.goodsMgr.getGoodsInfo(v.ngoodsid);
                    let towerId = 0;
                    if (goodsInfo && goodsInfo.lgoodstype == GOODS_TYPE.GOODSTYPE_RES_UPGRADESTAR) {
                        towerId = goodsInfo.lparam[0];
                    }
                    flatItems.push({ goodsid:v.ngoodsid, towerId: towerId, enableConvert: enableConvert });
                }
            }
        }

        let itemNode, itemCom: TenCardsCardItem, delay = 0;
        let starPos = this.catNode.convertToWorldSpaceAR(cc.Vec2.ZERO_R);
        let endPos;
        for (let i = 0, len = flatItems.length; i < len; i++) {
            if (layers[i]) {
                endPos = layers[i].convertToWorldSpaceAR(cc.Vec2.ZERO_R);
                itemNode = cc.instantiate(this.card);
                itemNode.parent = layers[i];
                itemCom = itemNode.getComponent(TenCardsCardItem);
                this.cardItems.push(itemCom);
                itemCom.setData(this.getRandomCard(flatItems));
                itemCom.hide();
                itemCom.refresh();
                itemCom.fly(starPos, endPos, delay);
                delay += this.aniDelay;
                itemCom.node.on(TenCardsCardItem.EventType.ON_FLIP_MID, this.onFlipMid, this);
                itemCom.node.on(TenCardsCardItem.EventType.ON_FLIP_END, this.onFlipEnd, this);
            }
        }
        if (itemCom) {
            itemCom.node.on(TenCardsCardItem.EventType.ON_FLY_END, this.onGenCardEnd, this);
        }
    }

    private flipCards() {
        let delay = 0;
        for (let i = 0; i < this.cardItems.length; i++) {
            if (this.cardItems[i].enableFlip()) {
                this.cardItems[i].playFlip(delay);
                delay += this.aniDelay;
            }
        }
        this.stage = STAGE.OPENED;
    }

    private onGenCardEnd() {
        this.enableClick = true;
    }

    private onFlipMid(towerId: number) {
        let towerInfo = Game.towerMgr.getTroopBaseInfo(towerId);
        if (this._enableBgTransition && towerInfo && towerInfo.btquality + 1 >= this.maxQuality) {
            this.updateBgAni(this.maxQuality, QUALITY_BG_COLOR[this.maxQuality.toString()], true);
            this._enableBgTransition = false;
        }
    }

    private onFlipEnd() {
        this.flipEndCount++;
        if (this.flipEndCount >= this.cardItems.length) {
            //转换多余的卡片
            this.scheduleOnce(this.convertToHuDieJie, 0.25);
        }
    }

    private convertToHuDieJie() {
        let lastItem: TenCardsCardItem;
        for (let i = 0; i < this.cardItems.length; i++) {
            if (this.cardItems[i].convertToHuDieJie()) {
                lastItem = this.cardItems[i];
            }
        }

        if (lastItem) {
            lastItem.node.on(TenCardsCardItem.EventType.ON_CONVERT_END, this.showBtn, this);
        } else {
            this.showBtn();
        }
    }

    private showBtn() {
        this.enableClick = true;
        this.uiLayer.active = true;
        this.tipsNode.active = false;
    }

    private updateBgAni(quality: number, color: string, withAni: boolean = false) {
        if (withAni) {
            this.playBgTransition();
        }
        this.bgAni.refreshBg(quality);
        this.bgNode.color = cc.color().fromHEX(color);
    }

    private playBgTransition() {
        this.bgFrontNode.active = true;
        this.bgFrontNode.color = this.bgNode.color;
        this.bgFrontNode.opacity = 255;
        cc.Tween.stopAllByTarget(this.bgFrontNode);
        cc.tween(this.bgFrontNode).to(0.3, { opacity: 0 }).start();
    }

    private getCardMaxQuality() {
        let quality = 1;
        let towerCfg: GS_TroopsInfo_TroopsInfoItem;
        if (this.data.uitemcount) {
            for (let i = 0; i < this.data.uitemcount; i++) {
                const element = this.data.items[i];
                let goodsinfo = Game.goodsMgr.getGoodsInfo(element.ngoodsid);
                if (goodsinfo && goodsinfo.lgoodstype == GOODS_TYPE.GOODSTYPE_RES_UPGRADESTAR) {
                    towerCfg = Game.towerMgr.getTroopBaseInfo(goodsinfo.lparam[0]);
                    if (towerCfg) {
                        quality = Math.max(towerCfg.btquality + 1, quality);
                    }
                }
            }
        }
        return MathUtils.clamp(quality, 1, 5);
    }

    private setCatVisiable(visiable: boolean) {
        cc.Tween.stopAllByTarget(this.catNode);
        if (visiable) {
            this.catNode.opacity = 255;
        } else {
            cc.tween(this.catNode).set({ opacity: 255 }).to(0.5, { opacity: 0 }).start();
        }
    }

    private isSingle() {
        let isSingle = true;
        if (this.data && this.data.uitemcount) {
            let count = 0;
            this.data.items.forEach(v => {
                let goodsInfo = Game.goodsMgr.getGoodsInfo(v.ngoodsid);
                if (goodsInfo.lgoodstype == GOODS_TYPE.GOODSTYPE_RES_UPGRADESTAR) {
                    count += v.ngoodsnum;
                }
            });
            if (count !== 1) isSingle = false;
        }
        return isSingle;
    }

    private getRandomCard(cards: TenCardsCardItemData[]) {
        return cards.splice(Math.floor(Math.random() * cards.length), 1)[0];
    }

    private joinLuckDraw() {
        if (this.data) {
            Game.luckDrawMgr.luckDrawJion(this.data.nid, this._buyType);
        }
    }


}
