import { FestivalActivityTaskType } from "../../common/AllEnum";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import GlobalVal from "../../GlobalVal";
import { GS_FestivalActivityConfig, GS_FestivalActivityPrivate } from "../../net/proto/DMSG_Plaza_Sub_FestivalActivity";
import { GameEvent } from "../../utils/GameEvent";
import { StringUtils } from "../../utils/StringUtils";
import List from "../../utils/ui/List";
import { PageView } from "../../utils/ui/PageView";

const { ccclass, property ,menu } = cc._decorator;

@ccclass
@menu('Game/ui/active-taqing/ActiveTaqing_Chouka')
export class ActiveTaqing_Chouka extends PageView {
    @property(cc.Label)
    timeLabel:cc.Label = null;

    @property(cc.Label)
    tipsLabel1:cc.Label = null;

    @property(cc.Label)
    tipsLabel2:cc.Label = null;

    @property(List)
    list:List = null;

    private _config:GS_FestivalActivityConfig;
    private _data:GS_FestivalActivityPrivate;
    
    start() {
        this.tipsLabel1.string = '达到100抽即可领取一只橙色品质猫咪！';
        this.tipsLabel2.string = '完成所有累计抽奖任务即可领取一只红色品质猫咪！';
    }

    /**子类继承，标签页面板显示 */
    protected doShow() {
        this._config = Game.festivalActivityMgr.getConfig();
        this._data = Game.festivalActivityMgr.getData();
        if (!this._config || !this._config.luckydraw || !this._data) return;
        this.refreshTime();
        this.schedule(this.refreshTime , 1 , cc.macro.REPEAT_FOREVER );
        this.refreshTask();
    }

    private refreshTask() {
        let datas = Game.festivalActivityMgr.getTaskDatas(FestivalActivityTaskType.LeiChou);
        let dataList:any[] = [];
        let len = datas.length;
        for (let i = 0 ; i < len ; i++) {
            dataList.push({
                config:datas[i],
                data:Game.festivalActivityMgr.getTaskState(FestivalActivityTaskType.LeiChou , datas[i].nid),
            })
        }

        if (dataList.length > 1) {
            dataList.sort(this.sortTask);
        }


        if (datas) {
            this.list.array = dataList;
        }
    }


    /**子类继承，标签页面板关闭 */
    protected doHide() {
        this.unschedule(this.refreshTime);
    }

    /**子类继承，添加事件 */
    protected addEvent() {
        GameEvent.on(EventEnum.ACTIVE_TAQING_CHOUKA_TASK_RET , this.refreshTask , this);
    }
    /**子类继承，移除事件 */
    protected removeEvent() {
        GameEvent.off(EventEnum.ACTIVE_TAQING_CHOUKA_TASK_RET , this.refreshTask , this);
    }

    private refreshTime() {
        let endTime = this._config.ntimeclose;
        let d = endTime - GlobalVal.getServerTimeS();
        this.timeLabel.string = '活动倒计时:' + StringUtils.formatTimeToDHMS(d);
    }

    private sortTask(a:any , b:any):number {
        if (a.data.btgetreward == b.data.btgetreward) {
            return a.config.usortid - b.config.usortid;
        }

        if (a.data.btgetreward) return 1;
        return -1;
    }
}