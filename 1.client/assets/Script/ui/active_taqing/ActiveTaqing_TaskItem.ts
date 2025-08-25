import Game from "../../Game";
import { GS_FestivalActivityConfig_RewardItem, GS_FestivalActivityConfig_Task, GS_FestivalActivityPrivate_TaskItem } from "../../net/proto/DMSG_Plaza_Sub_FestivalActivity";
import { EVENT_REDPOINT } from "../../redPoint/RedPointSys";
import SystemTipsMgr from "../../utils/SystemTipsMgr";
import BaseItem from "../../utils/ui/BaseItem";
import GoodsItem, { GoodsItemData } from "../newhand_book/GoodsItem";

const { ccclass, property ,menu } = cc._decorator;

@ccclass
@menu('Game/ui/active-taqing/ActiveTaqing_TaskItem')
export class ActiveTaqing_TaskItem extends BaseItem {

    @property(GoodsItem)
    goodsItem:GoodsItem = null;
    
    @property(cc.Node)
    btnNode:cc.Node = null;

    @property(cc.Label)
    btnLabel:cc.Label = null;

    @property(cc.Label)
    titleLabel:cc.Label = null;

    @property(cc.Label)
    infoLabel:cc.Label = null;

    private _taskData:GS_FestivalActivityConfig_Task;
    private _taskState:GS_FestivalActivityPrivate_TaskItem;
    
    setData(data:any , index:number) {
        if (this._data) {
            Game.redPointSys.unregisterRedPointSub(EVENT_REDPOINT.FESTIVAL_ACTIVE_TASK_ITEM , this._data.config.nid.toString() , this.btnNode);
        }
        super.setData(data , index);
        this._taskData = null;
        this._taskState = null;
        if (!data) return;
        Game.redPointSys.registerRedPointSub(EVENT_REDPOINT.FESTIVAL_ACTIVE_TASK_ITEM , data.config.nid.toString() , this.btnNode);
        this._taskData = data.config;
        this._taskState = data.data;
        this.titleLabel.string = this._taskData.szname;
        this.infoLabel.string = this._taskData.szdescription;

        if (this._taskData.rewarditemlist) {
            let len = this._taskData.rewarditemlist.length;
            for (let i = 0 ; i < len ; i++) {
                let temp = this._taskData.rewarditemlist[i];
                if (temp.ngoodsid > 0) {
                    let goodsItemData:GoodsItemData = {
                        goodsId:temp.ngoodsid,
                        nums:temp.ngoodsnum,
                        gray:this._taskState.btgetreward == 1,
                        showGou:this._taskState.btgetreward == 1,
                    }
                    this.goodsItem.setData(goodsItemData);
                    break;
                }
            }
        }
        this.setNodeActive(this.btnLabel.node , this._taskState.btgetreward != 1);
        this.setNodeActive(this.btnNode , this._taskState.btgetreward != 1 && this._taskState.unowvalue >= this._taskData.ufinishtimes);
        this.btnLabel.string = this._taskState.unowvalue >= this._taskData.ufinishtimes ? "领 取" : this._taskState.unowvalue + '/' + this._taskData.ufinishtimes;
    }

    onClick() {
        if (!this._taskData || !this._taskState) return;
        if (this._taskData.ufinishtimes > this._taskState.unowvalue) {
            SystemTipsMgr.instance.notice('任务尚未完成，领取失败');
            return;
        }
        Game.festivalActivityMgr.reqTaskDailyReward(this._taskData.nid);
    }

    onDestroy() {
        if (this._data) {
            Game.redPointSys.unregisterRedPointSub(EVENT_REDPOINT.FESTIVAL_ACTIVE_TASK_ITEM , this._data.config.nid.toString() , this.btnNode);
        }
    }


}