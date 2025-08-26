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
import Utils from "../utils/Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ExitCPView extends Dialog {
    @property(cc.RichText)
    tips: cc.RichText = null;

    @property(cc.Toggle)
    toggle: cc.Toggle = null;

    beforeShow() {
        this.tips.string = StringUtils.richTextColorFormat("关卡任务和奖杯", "#995124")
            + StringUtils.richTextColorFormat("可分多次完成", "#ea5718")
            + StringUtils.richTextColorFormat("哦！确定要重新开始？", "#995124");

        this.toggle.isChecked = false;
    }

    clickToggle(toggle: cc.Toggle) {
        GlobalVal.mindRestart = !toggle.isChecked;
    }

    clickConfirm() {
        UiManager.hideAll();
        Game.curGameCtrl.reStart(false);
        BuryingPointMgr.postWar(EBuryingPoint.TOUCH_MENU_RESTART);
    }

    clickCancel() {
        this.hide();
    }
}
