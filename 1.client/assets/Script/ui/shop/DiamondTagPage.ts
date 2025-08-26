// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import TapPageItem from "../dayInfoView/TapPageItem";
import NormalGoodListItem from "./NormalGoodListItem";
import Game from "../../Game";
import { TAGID } from "../../net/mgr/MallProto";
import { Handler } from "../../utils/Handler";
import { BuryingPointMgr, EBuryingPoint } from "../../buryingPoint/BuryingPointMgr";
import { GLOBAL_FUNC } from "../../common/AllEnum";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DiamondTagPageView extends TapPageItem {
    @property(NormalGoodListItem)
    itemOne: NormalGoodListItem = null;
    @property(NormalGoodListItem)
    itemTwo: NormalGoodListItem = null;
    @property(NormalGoodListItem)
    itemThree: NormalGoodListItem = null;
    @property(NormalGoodListItem)
    itemFour: NormalGoodListItem = null;

    @property(cc.Node)
    doubleRecharge: cc.Node = null;

    refresh() {
        let tempData = Game.mallProto.getGoodListByTagId(TAGID.MALL_DIAMOND);
        if (tempData) {
            this.itemOne.setClickCallBack(Handler.create(this.onItemOneClick, this));
            this.itemOne.setData(tempData[0]);
            this.itemOne.refresh();

            this.itemTwo.setClickCallBack(Handler.create(this.onItemTowClick, this));
            this.itemTwo.setData(tempData[1]);
            this.itemTwo.checkIsOpen(GLOBAL_FUNC.SHOP_DIAMOND_2);

            this.itemThree.setClickCallBack(Handler.create(this.onItemThreeClick, this));
            this.itemThree.setData(tempData[2]);
            this.itemThree.checkIsOpen(GLOBAL_FUNC.SHOP_DIAMOND_3);

            this.itemFour.setClickCallBack(Handler.create(this.onItemFourClick, this));
            this.itemFour.setData(tempData[3]);
            this.itemFour.checkIsOpen(GLOBAL_FUNC.SHOP_DIAMOND_4);
        }

        /*
        //双倍充值
        if (Game.globalFunc.isFuncOpened(GLOBAL_FUNC.DOUBLE_RECHARGE)
            && Game.globalFunc.canShowFunc(GLOBAL_FUNC.DOUBLE_RECHARGE)
            && !Game.sysActivityMgr.isDoubleRechargeFinished()) {
            this.doubleRecharge.active = true;
        } else {
            this.doubleRecharge.active = false;
        }
        */

    }

    private onItemOneClick() {
        if (!this.itemOne.data) return;
        BuryingPointMgr.curPayType = this.getIsFristBuy(this.itemOne) ? EBuryingPoint.TOUCH_DIAMOND_NEW_1 : EBuryingPoint.TOUCH_DIAMOND_1;
    }
    private onItemTowClick() {
        if (!this.itemTwo.data) return;
        BuryingPointMgr.curPayType = this.getIsFristBuy(this.itemTwo) ? EBuryingPoint.TOUCH_DIAMOND_NEW_2 : EBuryingPoint.TOUCH_DIAMOND_2;
    }
    private onItemThreeClick() {
        if (!this.itemThree.data) return;
        BuryingPointMgr.curPayType = this.getIsFristBuy(this.itemThree) ? EBuryingPoint.TOUCH_DIAMOND_NEW_3 : EBuryingPoint.TOUCH_DIAMOND_3;
    }
    private onItemFourClick() {
        if (!this.itemFour.data) return;
        BuryingPointMgr.curPayType = this.getIsFristBuy(this.itemFour) ? EBuryingPoint.TOUCH_DIAMOND_NEW_4 : EBuryingPoint.TOUCH_DIAMOND_4;
    }

    private getIsFristBuy(item: NormalGoodListItem): any {
        let privateData = Game.mallProto.getUpdataPrivateDataById(item.data.nrid);
        return !privateData || privateData.nbuycount <= 0;
    }
}
