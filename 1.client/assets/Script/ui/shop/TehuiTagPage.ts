// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import TapPageItem from "../dayInfoView/TapPageItem";
import NormalGoodListItem from "./NormalGoodListItem";
import Game from "../../Game";
import { RAND_TAGID, TAGID } from "../../net/mgr/MallProto";
import { Handler } from "../../utils/Handler";
import { BuryingPointMgr, EBuryingPoint } from "../../buryingPoint/BuryingPointMgr";
import { EVENT_REDPOINT } from "../../redPoint/RedPointSys";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TehuiTagPageView extends TapPageItem {
    @property(NormalGoodListItem)
    itemOne: NormalGoodListItem = null;

    @property(NormalGoodListItem)
    itemTwo: NormalGoodListItem = null;

    @property(NormalGoodListItem)
    itemThree: NormalGoodListItem = null;

    @property(NormalGoodListItem)
    itemFour: NormalGoodListItem = null;

    refresh() {
        let tempData = null;
        tempData = Game.mallProto.getGoodListByTagId(TAGID.TEHUI_1);
        if (tempData) {
            this.itemOne.setClickCallBack(Handler.create(this.onItemOneClick, this));
            this.itemOne.setData(tempData[0]);
            this.itemOne.refresh();
        }

        tempData = Game.mallProto.getGoodListByTagId(TAGID.TEHUI_2);
        if (tempData) {
            this.itemTwo.setClickCallBack(Handler.create(this.onItemTowClick, this));
            this.itemTwo.setData(tempData[0]);
            this.itemTwo.setRegisterRedPointType(EVENT_REDPOINT.SHOP_TEHUI_DIAMOND);
            this.itemTwo.refresh();
        }

        tempData = Game.mallProto.getGoodListByTagId(TAGID.TEHUI_3);
        if (tempData) {
            this.itemThree.setClickCallBack(Handler.create(this.onItemThreeClick, this));
            this.itemThree.setData(tempData[0]);
            this.itemThree.setRegisterRedPointType(EVENT_REDPOINT.SHOP_TEHUI_NENGLIANG);
            this.itemThree.refresh();
        }

        tempData = Game.mallProto.getGoodListByTagId(TAGID.TEHUI_4);
        if (tempData) {
            this.itemFour.setClickCallBack(Handler.create(this.onItemFourClick, this));
            this.itemFour.setData(tempData[0]);
            this.itemFour.setRegisterRedPointType(EVENT_REDPOINT.SHOP_TEHUI_YAOQINGQUAN);
            this.itemFour.refresh();
        }

    }

    getGuideNode(): cc.Node {
        return this.itemTwo.btnNode;
    }

    private onItemOneClick() {
        BuryingPointMgr.curPayType = EBuryingPoint.PAY_TEHUI_1;
        //BuryingPointMgr.curShopBuryingType = EBuryingPoint.PAY_TEHUI_1;
        //BuryingPointMgr.curShopBuryingType = EBuryingPoint.TOUCH_TEHUI_FREE_BOX;
    }

    /**特惠-大袋钻石点击 */
    private onItemTowClick() {
        BuryingPointMgr.curShopBuryingType = EBuryingPoint.TOUCH_TEHUI_FREE_DIAMOND;
    }

    /**特惠-铃铛点击 */
    private onItemThreeClick() {
        BuryingPointMgr.curShopBuryingType = EBuryingPoint.TOUCH_TEHUI_FREE_LINGDANG;
    }

    /**商店-特惠“技能 */
    private onItemFourClick() {
        BuryingPointMgr.curShopBuryingType = EBuryingPoint.TOUCH_FREE_SKILL;
    }
}
