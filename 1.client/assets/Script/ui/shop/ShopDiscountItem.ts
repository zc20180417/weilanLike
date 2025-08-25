// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { GS_DiscountStorePrivate_GoodsData } from "../../net/proto/DMSG_Plaza_Sub_DiscountStorePlugin";
import { ActorProp } from "../../net/socket/handler/MessageEnum";
import { GameEvent } from "../../utils/GameEvent";

import BaseItem from "../../utils/ui/BaseItem";
import GroupImage from "../../utils/ui/GroupImage";
import ImageLoader from "../../utils/ui/ImageLoader";
import { NodeUtils } from "../../utils/ui/NodeUtils";
import TowerStarTitle from "../towerStarSys/towerStarTitle";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ShopDiscountItem extends BaseItem {
    @property(ImageLoader)
    icon: ImageLoader = null;

    @property(cc.Sprite)
    bg: cc.Sprite = null;

    @property(GroupImage)
    discount: GroupImage = null;

    @property(cc.Label)
    originPrice: cc.Label = null;

    @property(cc.Label)
    price: cc.Label = null;

    @property(cc.Node)
    btn: cc.Node = null;

    @property(cc.Node)
    soldOut: cc.Node = null;

    @property(cc.Node)
    redLine: cc.Node = null;

    @property(cc.Node)
    diaIcon: cc.Node = null;

    @property(cc.Sprite)
    discountBg: cc.Sprite = null;

    @property(cc.Animation)
    bgAni: cc.Animation = null;

    @property(cc.SpriteFrame)
    fiveDis: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    otherDis: cc.SpriteFrame = null;

    @property(TowerStarTitle)
    towerTitle: TowerStarTitle = null;

    private addedEvent: boolean = false;

    private isAnimationEnd: boolean = true;

    private isTower: boolean = false;

    onDestroy() {
        GameEvent.targetOff(this);

    }

    refresh(enableAni: boolean = false) {
        if (!this.data) return;
        if (!this.addedEvent) {
            this.addedEvent = true;
            GameEvent.on(EventEnum.ON_DISCOUNT_BUY_RET, this.onBuyRet, this);
        }

        let data = this.data as GS_DiscountStorePrivate_GoodsData;
        let goodsInfo = Game.goodsMgr.getGoodsInfo(data.ngoodsid);
        //图标
        goodsInfo && this.icon.setPicId(goodsInfo.npacketpicid);

        this.isTower = goodsInfo.lgoodsid >= 101 && goodsInfo.lgoodsid <= 804;
        if (this.isTower) {
            this.towerTitle.node.active = true;
            let towerCfg = Game.towerMgr.getTroopBaseInfo(goodsInfo.lgoodsid);
            towerCfg && this.towerTitle.setIndex(towerCfg.bttype - 1);
        } else {
            this.towerTitle.node.active = false;
        }

        //背景
        if (!enableAni) {
            //折扣
            this.refreshPriceInfo();
        }
    }

    refreshPriceInfo() {
        if (!this.data) return;
        let data = this.data as GS_DiscountStorePrivate_GoodsData;
        if (data.btdiscount !== 0) {
            this.discountBg.spriteFrame = data.btdiscount == 5 ? this.fiveDis : this.otherDis;
            this.discount.contentStr = data.btdiscount.toString();
            if (data.btdiscount == 5) {
                this.tweenSaleNode();
            } else {
                this.discountBg.node.angle = 0;
                this.discountBg.node.stopAllActions();
            }
        }
        //原价
        this.originPrice.string = "原价：" + data.ndiamonds;
        //现价
        let price = (data.btdiscount / 10) * data.ndiamonds;
        this.price.string = data.btdiscount != 0 ? price.toString() : data.ndiamonds.toString();

        this.discount.node.active = data.btdiscount !== 0;
        this.discountBg.node.active = data.btdiscount !== 0;
        this.refreshSoldOut(data.btstate === 1);
        this.redLine.active = data.btdiscount !== 0;

        let diamond = Game.actorMgr.getProp(ActorProp.ACTOR_PROP_DIAMONDS);
        let isEnough = price <= diamond;
        NodeUtils.enabled(this.btn.getComponent(cc.Button), isEnough);
    }

    refreshWithAni(delay: number) {
        // this.unschedule(this.playRefreshAni);
        this.isAnimationEnd = false;
        this.scheduleOnce(this.playRefreshAni, delay);
    }

    playRefreshAni() {
        this.bgAni.play();
    }

    private onBgHide() {
        this.discount.node.active = false;
        this.discountBg.node.active = false;
        this.refresh(true);
        this.isTower && (this.towerTitle.node.active = false);
    }

    private onBgShow() {
        this.discount.node.active = true;
        this.discountBg.node.active = true;
        this.refreshPriceInfo();
        this.isTower && (this.towerTitle.node.active = true);
    }

    private aniEnd() {
        this.isAnimationEnd = true;
    }

    onBuyRet(index) {
        let data = this.data as GS_DiscountStorePrivate_GoodsData;
        if (data.btindex === index) {
            this.refreshSoldOut(true);
        }
    }

    refreshSoldOut(enable: boolean) {
        this.btn.active = !enable;
        this.soldOut.active = enable;
        this.price.node.active = !enable;
        this.diaIcon.active = !enable;
        this.originPrice.node.active = !enable;
        this.redLine.active = !enable;
    }

    onClick() {
        if (!this.data || !this.isAnimationEnd) return;
        let data = this.data as GS_DiscountStorePrivate_GoodsData;
        Game.discountMgr.disCountBuy(data.btindex);
    }

    private tweenSaleNode() {
        let tween = cc.tween(this.discountBg.node);
        tween.to(1, { angle: 7.5 });
        tween.to(1, { angle: -7.5 });
        cc.tween(this.discountBg.node).repeatForever(tween).start();
    }
}
