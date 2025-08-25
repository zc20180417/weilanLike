// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { GLOBAL_FUNC } from "../../common/AllEnum";
import { EResPath } from "../../common/EResPath";
import Game from "../../Game";
import { HideDialogCommand, LoadSceneCommand, OpenDialogCommand } from "../../tips/CheckPushDialogMgr";
import CommandsFlow from "./CommandsFlow";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CpinfoTipsHandler extends cc.Component {
    clickScience() {
        if (Game.globalFunc.checkGlobalFuncState(GLOBAL_FUNC.SCIENCE, true)) {
            CommandsFlow.addCommand(new HideDialogCommand())
                .addCommand(new LoadSceneCommand("Hall"))
                .addCommand(new OpenDialogCommand(EResPath.SCIENCE_VIEW))
                .startCommand();
        }
    }

    clickTowerStar() {
        CommandsFlow.addCommand(new HideDialogCommand())
            .addCommand(new OpenDialogCommand(EResPath.TOWER_STAR_MAIN_VIEW))
            .startCommand();
    }
}
