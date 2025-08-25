import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { ActiveInfo } from "../../net/mgr/SysActivityMgr";
import { GS_SysActivityPrivate_SysActivityData } from "../../net/proto/DMSG_Plaza_Sub_SysActivity";
import { ACTIVE_TYPE } from "../../net/socket/handler/MessageEnum";
import { GameEvent } from "../../utils/GameEvent";
import { StringUtils } from "../../utils/StringUtils";
import List from "../../utils/ui/List";
import Utils from "../../utils/Utils";
import TapPageItem from "../dayInfoView/TapPageItem";

const { ccclass, property , menu} = cc._decorator;

@ccclass
@menu("Game/ui/active/WeekRecharge/WeekRechargePage")
export default class ContinueRechargePage extends TapPageItem {

    @property(List)
    list:List = null;

    @property(cc.Label)
    timeLabel:cc.Label = null;

    private _cfg:ActiveInfo = null;
    private _privateData:GS_SysActivityPrivate_SysActivityData = null;

    protected onEnable(): void {
        GameEvent.on(EventEnum.UPDATE_ACTIVE_DATA, this.updateActiveData, this);
    }

    protected onDisable(): void {
        GameEvent.off(EventEnum.UPDATE_ACTIVE_DATA, this.updateActiveData, this);
    }
    
    private updateActiveData(nid:number) {
        if (nid == ACTIVE_TYPE.WEEK_RECHARGE) {
            this.refresh();
        }
    }

    public refresh() {
        this._cfg = Game.sysActivityMgr.getActivityInfo(ACTIVE_TYPE.WEEK_RECHARGE);
        this._privateData = Game.sysActivityMgr.getPrivateData(ACTIVE_TYPE.WEEK_RECHARGE);
        let taskList = this._cfg.taskList;
        if (!taskList || !this._cfg || !this._privateData) return;

        let dataList:any[] = [];
        let len = taskList.length;
        for (let i = 0; i < len; i++) {
            const element = taskList[i];
            dataList.push({cfg:element , privateData:this._privateData , flag:Utils.checkBitFlag(this._privateData.nflag , element.btindex)})
        }

        if (dataList.length > 1) {
            dataList.sort((a:any , b:any):number => {
                if (a.flag == b.flag) {
                    return a.cfg.btindex - b.cfg.btindex;
                }
                if (a.flag) return 1;
                return -1;
            })
        }

        this.list.array = dataList;
        this.schedule(this.onTimer , 10 , cc.macro.REPEAT_FOREVER);
        this.onTimer();
    }

    private onTimer() {
        if (this._cfg) {
            let time = Game.sysActivityMgr.getActiveRestTime(ACTIVE_TYPE.WEEK_RECHARGE);
            this.timeLabel.string = '剩余时间 ：' + StringUtils.formatTimeToDHM(time <= 0 ? 0 : time);
        }
    }
}