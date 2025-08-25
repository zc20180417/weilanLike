// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EResPath } from "../../common/EResPath";
import Game from "../../Game";
import GlobalVal from "../../GlobalVal";
import { StringUtils } from "../../utils/StringUtils";
import Dialog from "../../utils/ui/Dialog";
import { UiManager } from "../../utils/UiMgr";
import { ShopIndex } from "../shop/ShopView";
import { getRichtextTips, RichTextTipsType } from "./RichTextTipsView";

const { ccclass, property } = cc._decorator;

export const GAME_FAILD_TIPS_TYPE = {
    LING_ENOUGH: 1,//铃铛足够
    STAR_ENOUGH: 2,//星星足够
    DIAMOND_ENOUGH: 3//砖石足够
}

@ccclass
export default class GameFailTipsView extends Dialog {
    @property(cc.RichText)
    tips: cc.RichText = null;

    @property(cc.Toggle)
    toggle: cc.Toggle = null;

    private _type: number = null;
    setData(type: number) {
        this._type = type;
    }

    beforeShow() {
        this.tips.string = getRichtextTips(RichTextTipsType.GAME_FIAL, this._type);
        this.toggle.isChecked = false;
    }

    clickToggle(toggle: cc.Toggle) {
        GlobalVal.mindGameFaild = !toggle.isChecked;
    }

    clickConfirm() {
        UiManager.removeAll();
        switch (this._type) {
            case GAME_FAILD_TIPS_TYPE.LING_ENOUGH:
                UiManager.showDialog(EResPath.SCIENCE_VIEW);
                break;
            // case GAME_FAILD_TIPS_TYPE.STAR_ENOUGH:
            //     Game.catHouseMgr.enterHouse();
            //     break;
            case GAME_FAILD_TIPS_TYPE.DIAMOND_ENOUGH:
                UiManager.showDialog(EResPath.SHOP_VIEW, ShopIndex.TREATRUE);
                break;
        }
    }

    clickCancel() {
        this.hide();
    }
}
