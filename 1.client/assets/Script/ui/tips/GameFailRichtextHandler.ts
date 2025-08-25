// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { GLOBAL_FUNC } from "../../common/AllEnum";
import { EResPath } from "../../common/EResPath";
import Game from "../../Game";
import { GuideToClickBtnCommand, HideDialogCommand, LoadSceneCommand, OpenDialogCommand } from "../../tips/CheckPushDialogMgr";
import { UiManager } from "../../utils/UiMgr";
import CommandsFlow from "./CommandsFlow";

const { ccclass } = cc._decorator;

@ccclass
export default class GameFailRichtextHandler extends cc.Component {
    clickScience() {
        if (Game.globalFunc.checkGlobalFuncState(GLOBAL_FUNC.SCIENCE, true)) {
            CommandsFlow.addCommand(new HideDialogCommand(EResPath.GAME_FAILD_TIPS_VIEW))
                .addCommand(new LoadSceneCommand("Hall"))
                .addCommand(new OpenDialogCommand(EResPath.SCIENCE_VIEW))
                .startCommand();
        }
    }

    clickStar() {
        UiManager.showDialog(EResPath.STAR_TIPS_VIEW);
    }

    clickCathouse() {
        if (Game.globalFunc.checkGlobalFuncState(GLOBAL_FUNC.CAT_HOUSE, true)) {
            CommandsFlow.addCommand(new HideDialogCommand())
                .addCommand(new LoadSceneCommand("Hall"))
                .addCommand(new GuideToClickBtnCommand("cathouse"))
                .startCommand();
        }
    }

    clickShopBox() {
        if (Game.globalFunc.checkGlobalFuncState(GLOBAL_FUNC.MALL, true)) {
            CommandsFlow.addCommand(new HideDialogCommand())
                .addCommand(new LoadSceneCommand("Hall"))
                .addCommand(new OpenDialogCommand(EResPath.SHOP_VIEW, 1))
                .startCommand();
        }
    }
}
