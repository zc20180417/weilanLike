// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { GLOBAL_FUNC } from "../../common/AllEnum";
import { EResPath } from "../../common/EResPath";
import Game from "../../Game";
import { CheckPushDialogMgr } from "../../tips/CheckPushDialogMgr";
import Dialog from "../../utils/ui/Dialog";
import { UiManager } from "../../utils/UiMgr";
import { ShopIndex } from "../shop/ShopView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DoubleRechargeView extends Dialog {
    clickBg() {
        if (Game.globalFunc.checkGlobalFuncState(GLOBAL_FUNC.MALL, true)) {
            UiManager.showDialog(EResPath.SHOP_VIEW, ShopIndex.DIAMOND);
        }
    }
}
