

import TapPageItem from "../dayInfoView/TapPageItem";
import NormalGoodListItem from "./NormalGoodListItem";
import { TAGID } from "../../net/mgr/MallProto";
import Game from "../../Game";
import { Handler } from "../../utils/Handler";
import { BuryingPointMgr, EBuryingPoint } from "../../buryingPoint/BuryingPointMgr";
import { MALL_PRICETYPE } from "../../net/socket/handler/MessageEnum";
import { EVENT_REDPOINT } from "../../redPoint/RedPointSys";

const {ccclass, property ,menu} = cc._decorator;

@ccclass
@menu("Game/ui/shop/KeyTagPage")
export default class KeyTagPage extends TapPageItem {

    @property(NormalGoodListItem)
    itemOne: NormalGoodListItem = null;
    @property(NormalGoodListItem)
    itemTwo: NormalGoodListItem = null;
    @property(NormalGoodListItem)
    itemThree: NormalGoodListItem = null;
    @property(NormalGoodListItem)
    itemFour: NormalGoodListItem = null;

    refresh(){
        let tempData = Game.mallProto.getGoodListByTagId(TAGID.MALL_KEY);
        if (tempData) {
            this.itemOne.setData(tempData[0]);
            this.itemOne.setClickCallBack(Handler.create(this.onItemOneClick , this));

            if (tempData[0].btpricetype == MALL_PRICETYPE.MALL_PRICETYPE_FREEVIDEO) {
                this.itemOne.setRegisterRedPointType(EVENT_REDPOINT.SHOP_KEY_PUTONG);
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
