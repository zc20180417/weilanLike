// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import { GLOBAL_FUNC } from "../../common/AllEnum";
import { EResPath } from "../../common/EResPath";
import Game from "../../Game";
import { UiManager } from "../../utils/UiMgr";
import { ShopIndex } from "../shop/ShopView";
import { RichTextTipsData, getRichtextTips, RichTextTipsType } from "./RichTextTipsView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class EnergyRichtexHandler extends cc.Component {
    clickShopTehui() {
        if (Game.globalFunc.checkGlobalFuncState(GLOBAL_FUNC.MALL, true)) {
            UiManager.showDialog(EResPath.SHOP_VIEW, ShopIndex.TE_HUI);
        }
    }

    clickShopBox() {
        if (Game.globalFunc.checkGlobalFuncState(GLOBAL_FUNC.MALL, true)) {
            UiManager.showDialog(EResPath.SHOP_VIEW, ShopIndex.TREATRUE);
        }
    }

    clickShopEnergy() {
        if (Game.globalFunc.checkGlobalFuncState(GLOBAL_FUNC.MALL, true)) {
            UiManager.showDialog(EResPath.SHOP_VIEW, ShopIndex.ENERGY);
        }
    }

    clickVip() {
        if (Game.globalFunc.checkGlobalFuncState(GLOBAL_FUNC.VIP, true)) {
            UiManager.showDialog(EResPath.VIP_VIEW);
        }
    }

    onWeekTeQuanClick() {
        let data: RichTextTipsData = {
            title: "周卡特权",
            des: getRichtextTips(RichTextTipsType.WEEK)
        }

        UiManager.showDialog(EResPath.RICHTEXT_TIPS_VIEW, data);
    }
}
