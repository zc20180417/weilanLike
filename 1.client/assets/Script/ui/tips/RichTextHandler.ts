// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { GLOBAL_FUNC } from "../../common/AllEnum";
import { EResPath } from "../../common/EResPath";
import Game from "../../Game";
import { GuideToClickBtnCommand, HasFriendCommand, HideDialogCommand, LoadSceneCommand, OpenDialogCommand, SystemGuideCommand } from "../../tips/CheckPushDialogMgr";
import { UiManager } from "../../utils/UiMgr";
import { SystemGuideTriggerType } from "../guide/SystemGuideCtrl";
import { ShopIndex } from "../shop/ShopView";
import CommandsFlow, { Command } from "./CommandsFlow";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RichTextHandler extends cc.Component {
    private _enableClick: boolean = true;

    private checkEnableClick(): boolean {
        if (!this._enableClick) return false;
        this._enableClick = false;
        this.scheduleOnce(this.enableClick, 1.5);
        return true;
    }

    private enableClick() {
        this._enableClick = true;
    }

    clickCathouse() {
        if (!this.checkEnableClick()) return;
        if (Game.globalFunc.checkGlobalFuncState(GLOBAL_FUNC.CAT_HOUSE, true)) {
            CommandsFlow.addCommand(new HideDialogCommand())
                .addCommand(new LoadSceneCommand("Hall"))
                .addCommand(new GuideToClickBtnCommand("cathouse"))
                .startCommand();
        }
    }

    clickGameFailShopBox() {
        if (!this.checkEnableClick()) return;
        if (Game.globalFunc.checkGlobalFuncState(GLOBAL_FUNC.MALL, true)) {
            CommandsFlow.addCommand(new HideDialogCommand())
                .addCommand(new LoadSceneCommand("Hall"))
                .addCommand(new OpenDialogCommand(EResPath.SHOP_VIEW, 1))
                .startCommand();
        }
    }

    clickScience() {
        if (!this.checkEnableClick()) return;
        if (Game.globalFunc.checkGlobalFuncState(GLOBAL_FUNC.SCIENCE, true)) {
            CommandsFlow.addCommand(new HideDialogCommand())
                .addCommand(new LoadSceneCommand("Hall"))
                .addCommand(new OpenDialogCommand(EResPath.SCIENCE_VIEW))
                .startCommand();
        }
    }

    clickTowerStar() {
        if (!this.checkEnableClick()) return;
        if (Game.globalFunc.checkGlobalFuncState(GLOBAL_FUNC.YONGBING, true)) {
            CommandsFlow.addCommand(new HideDialogCommand())
                .addCommand(new OpenDialogCommand(EResPath.TOWER_STAR_MAIN_VIEW))
                .startCommand();
        }
    }

    /**
     * 商城宝箱
     */
    clickShopBox() {
        if (!this.checkEnableClick()) return;
        if (Game.globalFunc.checkGlobalFuncState(GLOBAL_FUNC.MALL, true)) {
            UiManager.showDialog(EResPath.SHOP_VIEW, ShopIndex.TREATRUE);
        }
    }

    /**
     * 合作模式的兑换商店
     */
    clickCooperationShop() {
        if (!this.checkEnableClick()) return;
        if (Game.globalFunc.checkGlobalFuncState(GLOBAL_FUNC.COOPERATE, true)) {
            UiManager.showDialog(EResPath.COOPERATE_SHOP);
        }
    }

    /**
     * 合作模式
     */
    clickCooperation() {
        if (!this.checkEnableClick()) return;
        if (Game.globalFunc.checkGlobalFuncState(GLOBAL_FUNC.COOPERATE, true)) {
            UiManager.showDialog(EResPath.COOPERATE_VIEW);
        }
    }

    /**
     * 活动大厅
     */
    clickActiveHall() {
        if (!this.checkEnableClick()) return;
        if (Game.globalFunc.checkGlobalFuncState(GLOBAL_FUNC.ACTIVE_HALL, true)) {
            UiManager.showDialog(EResPath.ACTIVE_HALL_VIEW);
        }
    }

    /**
     * 成就
     */
    clickAchievement() {
        if (!this.checkEnableClick()) return;
        if (Game.globalFunc.checkGlobalFuncState(GLOBAL_FUNC.TASK, true)) {
            UiManager.showDialog(EResPath.TASK_VIEW, 1);
        }
    }

    /**
     * 显示好友列表并引导点击猫咪公寓
     */
    clickFriendAndToCathouse() {
        if (!this.checkEnableClick()) return;
        if (Game.globalFunc.checkGlobalFuncState(GLOBAL_FUNC.FRIEND, true)) {
            CommandsFlow.addCommand(new OpenDialogCommand(EResPath.FRIEND_VIEW))
                .addCommand(new HasFriendCommand())
                .addCommand(new SystemGuideCommand(SystemGuideTriggerType.TO_FRIEND_CATHOUSE))
                .startCommand();
        }
    }

    /**
     * 每日关卡
     */
    clickDailyCheckpoint() {
        if (!this.checkEnableClick()) return;
        if (Game.globalFunc.checkGlobalFuncState(GLOBAL_FUNC.DAILY_CP, true)) {
            UiManager.showDialog(EResPath.SHANG_JIN);
        }
    }

    /**
     * 商城能量
     */
    clickShopEnergy() {
        if (!this.checkEnableClick()) return;
        if (Game.globalFunc.checkGlobalFuncState(GLOBAL_FUNC.MALL, true)) {
            UiManager.showDialog(EResPath.SHOP_VIEW, ShopIndex.ENERGY);
        }
    }

    /**
     * 商城特惠
     */
    clickShopTehui() {
        if (!this.checkEnableClick()) return;
        if (Game.globalFunc.checkGlobalFuncState(GLOBAL_FUNC.MALL, true)) {
            UiManager.showDialog(EResPath.SHOP_VIEW, ShopIndex.TE_HUI);
        }
    }

    /**
     * 竞技商店
     */
    clickPvpShop() {
        if (!this.checkEnableClick()) return;
        if (Game.globalFunc.checkGlobalFuncState(GLOBAL_FUNC.PVP, true)) {
            UiManager.showDialog(EResPath.PVP_SHOP_VIEW);
        }
    }

    // clickScience2() {
    //     if (Game.globalFunc.checkGlobalFuncState(GLOBAL_FUNC.SCIENCE, true)) {
    //         CommandsFlow.addCommand(new HideDialogCommand(EResPath.GAME_FAILD_TIPS_VIEW))
    //             .addCommand(new LoadSceneCommand("Hall"))
    //             .addCommand(new OpenDialogCommand(EResPath.SCIENCE_VIEW))
    //             .startCommand();
    //     }
    // }

    clickCatHouseForHudiejie() {
        if (!this.checkEnableClick()) return;
        if (Game.globalFunc.checkGlobalFuncState(GLOBAL_FUNC.CAT_HOUSE, true)) {
            UiManager.removeAll();
            Game.catHouseMgr.enterHouse();
        }
    }
}
