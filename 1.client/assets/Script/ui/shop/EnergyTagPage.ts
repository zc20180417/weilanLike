// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import TapView from "../dayInfoView/TapView";
import TapNavItem from "../dayInfoView/TapNavItem";
import TapPageItem from "../dayInfoView/TapPageItem";
import NormalGoodListItem from "./NormalGoodListItem";
import { TAGID } from "../../net/mgr/MallProto";
import Game from "../../Game";
import { Handler } from "../../utils/Handler";
import { BuryingPointMgr, EBuryingPoint } from "../../buryingPoint/BuryingPointMgr";
import { MALL_PRICETYPE } from "../../net/socket/handler/MessageEnum";
import { EVENT_REDPOINT } from "../../redPoint/RedPointSys";

const {ccclass, property} = cc._decorator;

@ccclass
export default class EnergyTagPageView extends TapPageItem {

    @property(NormalGoodListItem)
    itemOne: NormalGoodListItem = null;
    @property(NormalGoodListItem)
    itemTwo: NormalGoodListItem = null;
    @property(NormalGoodListItem)
    itemThree: NormalGoodListItem = null;
    @property(NormalGoodListItem)
    itemFour: NormalGoodListItem = null;

    refresh(){
        let tempData = Game.mallProto.getGoodListByTagId(TAGID.MALL_ENERGY);
        if (tempData) {
            this.itemOne.setData(tempData[0]);
            this.itemOne.setClickCallBack(Handler.create(this.onItemOneClick , this));
            if (tempData[0].btpricetype == MALL_PRICETYPE.MALL_PRICETYPE_FREEVIDEO) {
                this.itemOne.setRegisterRedPointType(EVENT_REDPOINT.SHOP_NENGLIANG_FREE);
            }
            this.itemOne.refresh();

            this.itemTwo.setData(tempData[1]);
            this.itemTwo.setClickCallBack(Handler.create(this.onItemTwoClick , this));
            this.itemTwo.refresh();

            this.itemThree.setData(tempData[2]);
            this.itemThree.setClickCallBack(Handler.create(this.onItemThreeClick , this));
            this.itemThree.refresh();

            this.itemFour.setData(tempData[3]);
            this.itemFour.setClickCallBack(Handler.create(this.onItemFourClick , this));
            this.itemFour.refresh();
        }
    }


    private onItemOneClick() {
        BuryingPointMgr.curShopBuryingType = EBuryingPoint.NL_BUY_1;
    }

    private onItemTwoClick() {
        BuryingPointMgr.curShopBuryingType = EBuryingPoint.NL_BUY_2;
    }

    private onItemThreeClick() {
        BuryingPointMgr.curShopBuryingType = EBuryingPoint.NL_BUY_3;
    }

    private onItemFourClick() {
        BuryingPointMgr.curShopBuryingType = EBuryingPoint.NL_BUY_4;
    }
    
}
