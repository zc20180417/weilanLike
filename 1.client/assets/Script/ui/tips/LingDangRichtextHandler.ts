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
import { UiManager } from "../../utils/UiMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LingDangRichtextHandler extends cc.Component {
    clickCatHouse() {
        if (Game.globalFunc.checkGlobalFuncState(GLOBAL_FUNC.CAT_HOUSE, true)) {
            UiManager.removeAll();
            Game.catHouseMgr.enterHouse();
        }
    }

    clickFriend() {
        if (Game.globalFunc.checkGlobalFuncState(GLOBAL_FUNC.FRIEND, true)) {
            UiManager.removeAll();
            UiManager.showDialog(EResPath.FRIEND_VIEW);
        }
    }

    clickVip() {
        if (Game.globalFunc.checkGlobalFuncState(GLOBAL_FUNC.VIP, true)) {
            UiManager.removeAll();
            UiManager.showDialog(EResPath.VIP_VIEW);
        }
    }

    clickAchievement() {
        if (Game.globalFunc.checkGlobalFuncState(GLOBAL_FUNC.TASK, true)) {
            UiManager.removeAll();
            UiManager.showDialog(EResPath.TASK_VIEW, 1);
        }
    }

    clickShangJin() {
        if (Game.globalFunc.checkGlobalFuncState(GLOBAL_FUNC.DAILY_CP, true)) {
            UiManager.removeAll();
            UiManager.showDialog(EResPath.SHANG_JIN);
        }
    }
}
