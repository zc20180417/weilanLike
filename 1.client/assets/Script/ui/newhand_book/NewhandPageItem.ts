// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Game from "../../Game";
import { GS_NoviceTaskConfig_NoviceTaskItem, GS_NoviceTaskConfig_NoviceTaskList, GS_NoviceTaskPrivate_TaskData } from "../../net/proto/DMSG_Plaza_Sub_NoviceTask";
import { NOVICE_TASK_STATE } from "../../net/socket/handler/MessageEnum";
import List from "../../utils/ui/List";
import TapPageItem from "../dayInfoView/TapPageItem";
import GoodsItem from "./GoodsItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewhandPageItem extends TapPageItem {
    @property(List)
    list: List = null;

    @property(GoodsItem)
    goodsItem: GoodsItem[] = [];

    @property(cc.Button)
    rewardBtn: cc.Button = null;

    @property(cc.Node)
    rewardState: cc.Node = null;

    refresh() {
        let taskListCfg: GS_NoviceTaskConfig_NoviceTaskList = Game.noviceTask.getTaskListCfg(this.index);
        //根据id由小到大对任务进行排序
        let data: Array<GS_NoviceTaskConfig_NoviceTaskItem> = null;
        if (taskListCfg) {
            data = Array.from(taskListCfg.tasks);
            data.sort((a, b) => {
                return a.nid - b.nid;
            });
        }

        this.list.array = data || [];

        //任务链奖励   
        let privateData = null;
        if (taskListCfg) {
            this.goodsItem[0].setData(taskListCfg.ngoodsid1, taskListCfg.ngoodsnums1);
            this.goodsItem[1].setData(taskListCfg.ngoodsid2, 0 | (taskListCfg.ngoodsnums2 / 100), " ", " 元");
            privateData = Game.noviceTask.getTaskPrivateData(taskListCfg.nid);
            if (privateData) {
                this.rewardBtn.node.active = privateData.btstate == NOVICE_TASK_STATE.CANGET;
                this.rewardState.active = privateData.btstate == NOVICE_TASK_STATE.FINISHED;
            } else {
                this.rewardBtn.node.active = false;
                this.rewardState.active = false;
            }
        } else {
            this.rewardBtn.node.active = false;
            this.rewardState.active = false;
        }
    }

    clickReward() {
        let taskListCfg: GS_NoviceTaskConfig_NoviceTaskList = Game.noviceTask.getTaskListCfg(this.index);
        if (taskListCfg) {
            Game.noviceTask.getReward(taskListCfg.nid);
        }
    }
}
