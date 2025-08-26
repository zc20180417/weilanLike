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
import { RichTextTipsData, getRichtextTips, RichTextTipsType } from "../tips/RichTextTipsView";
import { MALL_PRICETYPE } from "../../net/socket/handler/MessageEnum";
import { EVENT_REDPOINT } from "../../redPoint/RedPointSys";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BaoxiangTagPageView extends TapPageItem {

    @property(NormalGoodListItem)
    itemOne: NormalGoodListItem = null;
    @property(NormalGoodListItem)
    itemTwo: NormalGoodListItem = null;
    @property(NormalGoodListItem)
    itemThree: NormalGoodListItem = null;  

    start() {
        super.start();
        // Game.globalFunc.tryStartSystemGuide(GLOBAL_FUNC.MALL);
    }

    refresh() {
        let tempData = Game.mallProto.getGoodListByTagId(TAGID.TREATRUE_1);
        if (tempData) {
            this.itemOne.notEnoughCanClick = true;
            this.itemOne.setClickCallBack(Handler.create(this.onItemOneClick , this));
            this.itemOne.setData(tempData[0]);
            if (tempData[0].btpricetype == MALL_PRICETYPE.MALL_PRICETYPE_FREEVIDEO) {
                this.itemOne.setRegisterRedPointType(EVENT_REDPOINT.SHOP_BOX_PUTONG);
            }
            this.itemOne.refresh();

            let data1: RichTextTipsData = {
                title: "普通宝箱",
                des: getRichtextTips(RichTextTipsType.BOX_1)
            }
            
            this.itemOne.setRateTipsData(data1);
        }

        tempData = Game.mallProto.getGoodListByTagId(TAGID.TREATRUE_2);
        if (tempData) {
            this.itemTwo.notEnoughCanClick = true;
            this.itemTwo.setData(tempData[0]);
            this.itemTwo.setClickCallBack(Handler.create(this.onItemTwoClick , this));
            if (tempData[0].btpricetype == MALL_PRICETYPE.MALL_PRICETYPE_FREE_DIAMONDS || tempData[0].btpricetype == MALL_PRICETYPE.MALL_PRICETYPE_FREE_GOODS) {
                this.itemTwo.setRegisterRedPointType(EVENT_REDPOINT.SHOP_BOX_ZHIZHUN);
            }
            this.itemTwo.refresh();

            let data2: RichTextTipsData = {
                title: "高档宝箱",
                des: getRichtextTips(RichTextTipsType.BOX_3)
            }
            
            this.itemTwo.setRateTipsData(data2);
        }

        tempData = Game.mallProto.getGoodListByTagId(TAGID.TREATRUE_3);
        if (tempData) {
            this.itemThree.notEnoughCanClick = true;
            this.itemThree.setClickCallBack(Handler.create(this.onItemThreeClick , this));
            this.itemThree.setData(tempData[0]);
            this.itemThree.refresh();

            let data3: RichTextTipsData = {
                title: "至尊宝箱",
                des: getRichtextTips(RichTextTipsType.BOX_4)
            }
            
            this.itemThree.setRateTipsData(data3);
        }
    }

    private onItemOneClick() {
        BuryingPointMgr.curShopBuryingType = EBuryingPoint.TOUCH_FREE_BOX;
    }

    private onItemTwoClick() {
        BuryingPointMgr.curShopBuryingType = EBuryingPoint.GIFT_BOX_BUY_2;
    }

    private onItemThreeClick() {
        BuryingPointMgr.post(EBuryingPoint.TOUCH_ZHIZUN_BOX);
    }
    
    private onItemFourClick() {
        BuryingPointMgr.post(EBuryingPoint.TOUCH_JINSE_BOX);
    }

    getGuideNode():cc.Node {
        return this.itemTwo.btnNode;
    }

    onDestroy() {
        Handler.dispose(this);
    }
}
