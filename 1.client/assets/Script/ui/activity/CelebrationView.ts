// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EResPath } from "../../common/EResPath";
import Dialog from "../../utils/ui/Dialog";
import { UiManager } from "../../utils/UiMgr";
import { ShopIndex } from "../shop/ShopView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CeleBration extends Dialog {
    private onClick() {
        UiManager.showDialog(EResPath.SHOP_VIEW, ShopIndex.DIAMOND);
    }
}
