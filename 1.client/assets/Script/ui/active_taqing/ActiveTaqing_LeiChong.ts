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
@menu('Game/ui/active-taqing/ActiveTaqing_LeiChong')

export class ActiveTaqing_LeiChong extends PageView {

    @property(cc.Label)
    jifenLabel:cc.Label = null;

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
    private _str:string = '累充活动及活动礼包获得的红色猫咪自选碎片为三选一碎片；';
    onWenClick() {
        UiManager.showDialog(EResPath.ACTIVE_TAQING_HELP_TIPS , this._str);
    }

    /**子类继承，标签页面板显示 */
    protected doShow() {
        this._config = Game.festivalActivityMgr.getConfig();
        this._data = Game.festivalActivityMgr.getData();
        if (!this._config || !this._config.luckydraw || !this._data) return;
        this.refreshTime();
        this.schedule(this.refreshTime , 1 , cc.macro.REPEAT_FOREVER );
        this.refreshTask();
        this.jifenLabel.string = (this._data.npricecount * 10) + "";

    }

    private refreshTask() {
        let datas = Game.festivalActivityMgr.getTaskDatas(FestivalActivityTaskType.LeiChong);
        let dataList:any[] = [];
        let len = datas.length;
        for (let i = 0 ; i < len ; i++) {
            let item = datas[i];
            if (item.utargetvalue > 1000 && this._data.npricecount < 1000) continue;
            dataList.push({
                config:datas[i],
                data:Game.festivalActivityMgr.getTaskState(FestivalActivityTaskType.LeiChong , datas[i].nid),
            })
        }

        if (dataList.length > 1) {
            dataList.sort(this.sortTask);
        }


        if (datas) {
            this.list.array = dataList;
        }

        this.jifenLabel.string = (this._data.npricecount * 10)+ "";
    }


    /**子类继承，标签页面板关闭 */
    protected doHide() {
        this.unschedule(this.refreshTime);
    }

    /**子类继承，添加事件 */
    protected addEvent() {
        GameEvent.on(EventEnum.ACTIVE_TAQING_LEI_CHONG_TASK_RET , this.refreshTask , this);
        
    }
    /**子类继承，移除事件 */
    protected removeEvent() {
        GameEvent.off(EventEnum.ACTIVE_TAQING_LEI_CHONG_TASK_RET , this.refreshTask , this);
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