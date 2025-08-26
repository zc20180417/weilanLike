// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { GLOBAL_FUNC } from "../../common/AllEnum";
import { EResPath } from "../../common/EResPath";
import Game from "../../Game";
import { OPERATION_TYPE } from "../../net/mgr/NoviceTaskMgr";
import { GS_NoviceTaskConfig_NoviceTaskItem } from "../../net/proto/DMSG_Plaza_Sub_NoviceTask";
import { NOVICE_TASK_STATE } from "../../net/socket/handler/MessageEnum";
import { CheckPushDialogMgr, HideDialogCommand, LoadSceneCommand, OpenDialogCommand } from "../../tips/CheckPushDialogMgr";
import BaseItem from "../../utils/ui/BaseItem";
import ImageLoader from "../../utils/ui/ImageLoader";
import { ACTIVE_HALL_TAP_INDEX } from "../activity/ActiveHallView";
import CommandsFlow from "../tips/CommandsFlow";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewhandScrollItem extends BaseItem {
    @property(cc.Label)
    title: cc.Label = null;

    @property(ImageLoader)
    rewardIcon: ImageLoader = null;

    @property(cc.Label)
    rewardLabel: cc.Label = null;

    @property(cc.Node)
    rewardBtn: cc.Node = null;

    @property(cc.Node)
    rewardState: cc.Node = null;

    setData(data: any, index: number) {
        super.setData(data, index);
        this.refresh();
    }

    refresh() {
        if (!this.data) return;
        let data = this.data as GS_NoviceTaskConfig_NoviceTaskItem;
        let privateData = Game.noviceTask.getTaskPrivateData(data.nid);
        //标题
        this.title.string = data.szdes;
        //奖励icon
        let goodsCfg = Game.goodsMgr.getGoodsInfo(data.ngoodsid);
        this.rewardIcon.setPicId(goodsCfg.npacketpicid);

        this.rewardLabel.string = data.ngoodsnums.toString();

        if (privateData) {
            this.rewardBtn.active = privateData.btstate == NOVICE_TASK_STATE.CANGET;
            this.rewardState.active = privateData.btstate == NOVICE_TASK_STATE.FINISHED;
        } else {
            this.rewardBtn.active = false;
            this.rewardState.active = false;
        }
    }

    clickReward() {
        if (!this.data) return;
        let data = this.data as GS_NoviceTaskConfig_NoviceTaskItem;
        let privateData = Game.noviceTask.getTaskPrivateData(data.nid);
        if (privateData) {
            Game.noviceTask.getReward(privateData.nid);
        }
    }

    showDialog() {
        if (!this.data || this.rewardState.active) return;
        let data = this.data as GS_NoviceTaskConfig_NoviceTaskItem;
        switch (data.nclientparam) {
            case OPERATION_TYPE.SELECT_MAP:
                CommandsFlow.addCommand(new HideDialogCommand())
                    .addCommand(new LoadSceneCommand("Map"))
                    .startCommand();
                break;
            case OPERATION_TYPE.SIGN:
                if (Game.globalFunc.checkGlobalFuncState(GLOBAL_FUNC.SIGN, true)) {
                    CommandsFlow.addCommand(new HideDialogCommand())
                        .addCommand(new OpenDialogCommand(EResPath.ACTIVE_HALL_VIEW, ACTIVE_HALL_TAP_INDEX.SIGN))
                        .startCommand();
                }
                break;
            case OPERATION_TYPE.CAT_HOUSE:
                if (Game.globalFunc.checkGlobalFuncState(GLOBAL_FUNC.CAT_HOUSE, true)) {
                    CommandsFlow.addCommand(new HideDialogCommand())
                        .addCommand(new LoadSceneCommand("CatHouse"))
                        .startCommand();
                }
                break;
            case OPERATION_TYPE.FIRST_RECHARGE:
                if (Game.globalFunc.checkGlobalFuncState(GLOBAL_FUNC.FIRST_RECHARGE, true)) {
                    let path = Game.actorMgr.getFirstRechargeViewPath();
                    let data = Game.actorMgr.getFirstRechargeViewData();
                    CommandsFlow.addCommand(new HideDialogCommand())
                        .addCommand(new OpenDialogCommand(path, data[1]))
                        .startCommand();
                }
                break;
            case OPERATION_TYPE.FRIENDS:
                if (Game.globalFunc.checkGlobalFuncState(GLOBAL_FUNC.FRIEND, true)) {
                    CommandsFlow.addCommand(new HideDialogCommand())
                        .addCommand(new OpenDialogCommand(EResPath.FRIEND_VIEW))
                        .startCommand();
                }
                break;
            case OPERATION_TYPE.TOWER:
                CommandsFlow.addCommand(new HideDialogCommand())
                    .addCommand(new OpenDialogCommand(EResPath.TOWER_STAR_MAIN_VIEW))
                    .startCommand();
                break;
            case OPERATION_TYPE.SHARE:
                if (Game.globalFunc.checkGlobalFuncState(GLOBAL_FUNC.INVITE, true)) {
                    CommandsFlow.addCommand(new HideDialogCommand())
                        .addCommand(new OpenDialogCommand(EResPath.INVITATION_VIEW))
                        .startCommand();
                }
                break;
            case OPERATION_TYPE.PVP:
                if (Game.globalFunc.checkGlobalFuncState(GLOBAL_FUNC.PVP, true)) {
                    CommandsFlow.addCommand(new HideDialogCommand())
                        .addCommand(new OpenDialogCommand(EResPath.PVP_MATCH_VIEW))
                        .startCommand();
                }
                break;
            case OPERATION_TYPE.YUEKA:
                if (Game.globalFunc.checkGlobalFuncState(GLOBAL_FUNC.YUEKA, true)) {
                    CommandsFlow.addCommand(new HideDialogCommand())
                        .addCommand(new OpenDialogCommand(EResPath.YUE_KA_VIEW))
                        .startCommand();
                }
                break;
            case OPERATION_TYPE.SCIENCE:
                if (Game.globalFunc.checkGlobalFuncState(GLOBAL_FUNC.SCIENCE, true)) {
                    CommandsFlow.addCommand(new HideDialogCommand())
                        .addCommand(new OpenDialogCommand(EResPath.SCIENCE_VIEW))
                        .startCommand();
                }
                break;
            case OPERATION_TYPE.DAILY_ACTIVE:
                if (Game.globalFunc.checkGlobalFuncState(GLOBAL_FUNC.TASK, true)) {
                    CommandsFlow.addCommand(new HideDialogCommand())
                        .addCommand(new OpenDialogCommand(EResPath.TASK_VIEW))
                        .startCommand();
                }
                break;
            case OPERATION_TYPE.VIP:
                if (Game.globalFunc.checkGlobalFuncState(GLOBAL_FUNC.VIP, true)) {
                    CommandsFlow.addCommand(new HideDialogCommand())
                        .addCommand(new OpenDialogCommand(EResPath.VIP_VIEW))
                        .startCommand();
                }
                break;
        }
    }
}
