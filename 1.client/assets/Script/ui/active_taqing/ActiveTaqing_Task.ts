import { FestivalActivityTaskType } from "../../common/AllEnum";
import { EResPath } from "../../common/EResPath";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import GlobalVal from "../../GlobalVal";
import { GS_FestivalActivityConfig, GS_FestivalActivityPrivate } from "../../net/proto/DMSG_Plaza_Sub_FestivalActivity";
import { GameEvent } from "../../utils/GameEvent";

import { StringUtils } from "../../utils/StringUtils";
import List from "../../utils/ui/List";
import { PageView } from "../../utils/ui/PageView";
import { UiManager } from "../../utils/UiMgr";


const { ccclass, property ,menu } = cc._decorator;

@ccclass
@menu('Game/ui/active-taqing/ActiveTaqing_Task')
export class ActiveTaqing_Task extends PageView {

    @property(cc.Label)
    timeLabel:cc.Label = null;

    @property(List)
    list:List = null;

    private _config:GS_FestivalActivityConfig;
    private _data:GS_FestivalActivityPrivate;
    onWenClick() {

        let str = '活动任务：' + '\r\n' + 
        '完成任务即可获得道具，该道具可以在兑换商店进行兑换！';

        UiManager.showDialog(EResPath.JING_CAI_TIPS_VIEW , str);
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
        let datas = Game.festivalActivityMgr.getTaskDatas(FestivalActivityTaskType.Daily);
        let dataList:any[] = [];
        let len = datas.length;
        for (let i = 0 ; i < len ; i++) {
            dataList.push({
                config:datas[i],
                data:Game.festivalActivityMgr.getTaskState(FestivalActivityTaskType.Daily , datas[i].nid),
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
        GameEvent.on(EventEnum.ACTIVE_TAQING_DAILY_TASK_RET , this.refreshTask , this);
    }
    /**子类继承，移除事件 */
    protected removeEvent() {
        GameEvent.off(EventEnum.ACTIVE_TAQING_DAILY_TASK_RET , this.refreshTask , this);
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

    onDestroy(): void {
        super.onDestroy();
        // this.skinLoader.destroy();
    }


}