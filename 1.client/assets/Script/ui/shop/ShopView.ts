// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Dialog from "../../utils/ui/Dialog";
import TapView from "../dayInfoView/TapView";
import { ActorProp, GOODS_ID } from "../../net/socket/handler/MessageEnum";
import Game from "../../Game";
import { EventEnum } from "../../common/EventEnum";
import GroupImage from "../../utils/ui/GroupImage";
import { BuryingPointMgr, EBuryingPoint } from "../../buryingPoint/BuryingPointMgr";
import TapPageItem from "../dayInfoView/TapPageItem";
import { EVENT_REDPOINT } from "../../redPoint/RedPointSys";
import GlobalVal from "../../GlobalVal";
import { GameEvent, Reply } from "../../utils/GameEvent";

const { ccclass, property } = cc._decorator;

export enum ShopIndex {
    TE_HUI,
    TREATRUE,
    YAOSHI,
    ENERGY,
    DIAMOND,
    ZHAOCAI,
}

@ccclass
export default class ShopView extends Dialog {

    @property(TapView)
    tapView: TapView = null;

    @property(GroupImage)
    diamond: GroupImage = null;

    _index: number = 0;

    private _boxTab: cc.Node = null;
    private _tehuiTab: cc.Node = null;
    private _keyTab: cc.Node = null;
    private _zhaocaiTab: cc.Node = null;
    private _nengliangTab: cc.Node = null;
    private _doubleRechargeTab: cc.Node = null;

    protected beforeShow() {
        let data = {
            pageDatas: [
                {},
                {},
                {},
                {},
                {},
                {},
                
            ],
            navDatas: [
                {},
                {},
                {},
                {},
                {},
                {},
            ]
        }
        

        if (!GlobalVal.openRecharge) {
            data.pageDatas[ShopIndex.TE_HUI] = null;
            data.navDatas[ShopIndex.TE_HUI] = null;
            data.pageDatas[ShopIndex.DIAMOND] = null;
            data.navDatas[ShopIndex.DIAMOND] = null;
            data.pageDatas[ShopIndex.YAOSHI] = null;
            data.navDatas[ShopIndex.YAOSHI] = null;
        }

        if (!GlobalVal.openRechargeTaptap) {
            data.pageDatas[ShopIndex.DIAMOND] = null;
            data.navDatas[ShopIndex.DIAMOND] = null;
            data.pageDatas[ShopIndex.YAOSHI] = null;
            data.navDatas[ShopIndex.YAOSHI] = null;
        }


        if (true) {
            data.pageDatas[ShopIndex.TE_HUI] = null;
            data.navDatas[ShopIndex.TE_HUI] = null;
            data.pageDatas[ShopIndex.YAOSHI] = null;
            data.navDatas[ShopIndex.YAOSHI] = null;
            data.pageDatas[ShopIndex.ENERGY] = null;
            data.navDatas[ShopIndex.ENERGY] = null;
            data.pageDatas[ShopIndex.ZHAOCAI] = null;
            data.navDatas[ShopIndex.ZHAOCAI] = null;
        }

        this.tapView.init(data);
        this.tapView.selectTap(this._index);

        let diamond = Game.actorMgr.getProp(ActorProp.ACTOR_PROP_DIAMONDS);
        this.diamond.contentStr = diamond + '';

        BuryingPointMgr.post(EBuryingPoint.SHOW_SHOP_VIEW);

        //注册宝箱tab红点
        this._boxTab = this.tapView.navigation.getNavItem(ShopIndex.TREATRUE);
        if (this._boxTab) {
            Game.redPointSys.registerRedPoint(EVENT_REDPOINT.SHOP_BOX, this._boxTab);
        }

        this._tehuiTab = this.tapView.navigation.getNavItem(ShopIndex.TE_HUI);
        if (this._tehuiTab) {
            Game.redPointSys.registerRedPoint(EVENT_REDPOINT.SHOP_TEHUI, this._tehuiTab);
        }

        this._nengliangTab = this.tapView.navigation.getNavItem(ShopIndex.ENERGY);
        if (this._nengliangTab) {
            Game.redPointSys.registerRedPoint(EVENT_REDPOINT.SHOP_NENGLIANG, this._nengliangTab);
        }

        this._keyTab = this.tapView.navigation.getNavItem(ShopIndex.YAOSHI);
        if (this._keyTab) {
            Game.redPointSys.registerRedPoint(EVENT_REDPOINT.SHOP_KEY, this._keyTab);
        }

        this._zhaocaiTab = this.tapView.navigation.getNavItem(ShopIndex.ZHAOCAI);
        if (this._zhaocaiTab) {
            Game.redPointSys.registerRedPoint(EVENT_REDPOINT.SHOP_ZHAOCAI, this._zhaocaiTab);
        }

        //双倍充值红点
        this._doubleRechargeTab = this.tapView.navigation.getNavItem(ShopIndex.DIAMOND);
        if (this._doubleRechargeTab) {
            Game.redPointSys.registerRedPoint(EVENT_REDPOINT.DOUBLE_RECHARGE, this._doubleRechargeTab);
        }

        //首充双倍
        if (this._doubleRechargeTab) {
            Game.redPointSys.registerRedPoint(EVENT_REDPOINT.SHOP_DOUBLE_RECHARGE, this._doubleRechargeTab);
        }
    }

    protected addEvent() {
        GameEvent.on(EventEnum.PLAYER_PROP_CHANGE + ActorProp.ACTOR_PROP_DIAMONDS, this.diamondChange, this);
        //跨天时需要监听商城下发的私有数据
        GameEvent.on(EventEnum.ON_MALL_PRIVATE_DATA, this.onMallPrivateData, this);
        GameEvent.on(EventEnum.CHANGE_SHOP_TAP, this.onChangeTap, this);
        GameEvent.onReturn("get_guide_shop_btn", this.getGuideShopBtn, this);
    }

    protected afterHide() {
        GameEvent.offReturn("get_guide_shop_btn", this.getGuideShopBtn, this);
        //取消红点
        if (this._boxTab) {
            Game.redPointSys.unregisterRedPoint(EVENT_REDPOINT.SHOP_BOX, this._boxTab);
        }

        if (this._tehuiTab) {
            Game.redPointSys.unregisterRedPoint(EVENT_REDPOINT.SHOP_TEHUI, this._tehuiTab);
        }

        if (this._nengliangTab) {
            Game.redPointSys.unregisterRedPoint(EVENT_REDPOINT.SHOP_NENGLIANG, this._nengliangTab);
        }
        
        if (this._keyTab) {
            Game.redPointSys.unregisterRedPoint(EVENT_REDPOINT.SHOP_KEY, this._keyTab);
        }

        if (this._doubleRechargeTab) {
            Game.redPointSys.unregisterRedPoint(EVENT_REDPOINT.DOUBLE_RECHARGE, this._doubleRechargeTab);
            Game.redPointSys.unregisterRedPoint(EVENT_REDPOINT.SHOP_DOUBLE_RECHARGE, this._doubleRechargeTab);
        }
    }

    diamondChange(newValue: number, oldValue: number) {
        cc.log("商城砖石刷新");
        this.diamond.contentStr = newValue.toString();

        this.tapView.refreshCurrTap();
    }

    onMallPrivateData() {
        this.tapView.refreshCurrTap();
    }

    private onChangeTap(tap:number) {
        this._index = tap;
        this.tapView.selectTap(this._index);
    }

    setData(index: number = ShopIndex.TE_HUI) {
        if (!GlobalVal.openRecharge) {
            index = ShopIndex.TREATRUE;
        }
        
        if (index == ShopIndex.TE_HUI || index == ShopIndex.ENERGY || index == ShopIndex.YAOSHI) {
            index = ShopIndex.TREATRUE;
        }
        this._index = index;
    }

    addDiamond() {
        if (!GlobalVal.openRecharge) return;
        this.tapView.selectTap(ShopIndex.DIAMOND);
    }

    addEnergy() {
        this.tapView.selectTap(ShopIndex.ENERGY);
    }

    protected getGuideShopBtn(reply:Reply): cc.Node {
        if (this.tapView.curIndex != ShopIndex.TREATRUE) {
            this.tapView.selectTap(ShopIndex.TREATRUE);
        }

        let pages = this.tapView.getPages();
        return reply(pages[1].getComponent(TapPageItem)['getGuideNode']());
    }

    protected readyDestroy() {
        this.tapView.readyDestroy();
        super.readyDestroy();
    }
}
