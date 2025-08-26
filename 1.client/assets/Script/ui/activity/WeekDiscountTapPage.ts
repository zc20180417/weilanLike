// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { ActiveInfo } from "../../net/mgr/SysActivityMgr";
import { GS_SysActivityConfig_SysActivityItem, GS_SysActivityNew_SysActivityNewTaskItem } from "../../net/proto/DMSG_Plaza_Sub_SysActivity";
import { ACTIVE_TYPE } from "../../net/socket/handler/MessageEnum";
import { GameEvent } from "../../utils/GameEvent";
import { Handler } from "../../utils/Handler";
import { StringUtils } from "../../utils/StringUtils";
import List from "../../utils/ui/List";
import TapPageItem from "../dayInfoView/TapPageItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class WeekDiscountTapPage extends TapPageItem {
    @property(List)
    list: List = null;

    @property(cc.Label)
    timeLabel: cc.Label = null;

    private _cfg: ActiveInfo = null;

    onLoad(): void {
        GameEvent.on(EventEnum.UPDATE_ACTIVE_DATA, this.updateActiveData, this);
    }

    protected onDestroy(): void {
        Handler.dispose(this);
        GameEvent.targetOff(this);
    }

    refresh() {
        this._cfg = Game.sysActivityMgr.getActivityInfo(ACTIVE_TYPE.WEEK_TEHUI);
        if (!this._cfg) return this.list.node.active = false;
        let arr = Array.from(this._cfg.taskList || []);
        arr.sort((a, b) => {
            //已完成的任务排在后面
            let aFinished = Game.sysActivityMgr.isSubTaskFinished(this._cfg.item.nid, a.btindex);
            let bFinished = Game.sysActivityMgr.isSubTaskFinished(this._cfg.item.nid, b.btindex);
            if (aFinished && bFinished) {
                return a.btindex - b.btindex;
            } else if (aFinished) {
                return 1;
            } else if (bFinished) {
                return -1;
            } else {
                return a.btindex - b.btindex
            }
        });
        this.list.array = arr;
        this.updateTime();
        this.schedule(this.updateTime, 1, cc.macro.REPEAT_FOREVER, 0);
    }

    updateTime() {
        let time = Game.sysActivityMgr.getActiveRestTime(ACTIVE_TYPE.WEEK_TEHUI);
        this.timeLabel.string = '剩余时间 ：' + StringUtils.formatTimeToDHM(time <= 0 ? 0 : time);
    }

    private updateActiveData(nid: number) {
        let item: GS_SysActivityConfig_SysActivityItem = this._cfg.item as GS_SysActivityConfig_SysActivityItem;
        if (!item || nid !== item.nid) return;
        this.refresh();
    }
}
