// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { BuryingPointMgr, EBuryingPoint } from "../buryingPoint/BuryingPointMgr";
import Game from "../Game";
import GlobalVal from "../GlobalVal";
import { StringUtils } from "../utils/StringUtils";
import Dialog from "../utils/ui/Dialog";
import { UiManager } from "../utils/UiMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CpinfoTips extends Dialog {
    @property(cc.RichText)
    tips: cc.RichText = null;

    @property(cc.Toggle)
    toggle: cc.Toggle = null;

    private _warId: number = null;
    setData(warId: number) {
        this._warId = warId;
    }

    beforeShow() {
        this.tips.string = StringUtils.richTextColorFormat("猫咪的战斗力差很多，建议", "#995124")
            + StringUtils.richTextColorFormat("<on click='clickScience'> <u>升级天赋</u> </on>", "#ea5718")
            + StringUtils.richTextColorFormat("或者", "#995124")
            + StringUtils.richTextColorFormat("<on click='clickTowerStar'> <u>猫咪升星</u> </on>", "#ea5718")
            + StringUtils.richTextColorFormat("后再来挑战", "#995124");

        this.toggle.isChecked = false;
    }

    clickToggle(toggle: cc.Toggle) {
        GlobalVal.mindCpinfo = !toggle.isChecked;
    }

    clickConfirm() {
        UiManager.hideAll();
        if (this._warId) {
            Game.sceneNetMgr.reqEnterWar(this._warId);
        }
    }

    clickCancel() {
        this.hide();
    }
}
