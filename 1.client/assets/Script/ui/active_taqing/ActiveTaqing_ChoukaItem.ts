import { ACTIVE_TAQING_PAGE_INDEX } from "../../common/AllEnum";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { GS_FestivalActivityConfig_RewardItem, GS_FestivalActivityConfig_Task, GS_FestivalActivityPrivate_TaskItem } from "../../net/proto/DMSG_Plaza_Sub_FestivalActivity";
import { EVENT_REDPOINT } from "../../redPoint/RedPointSys";
import { GameEvent } from "../../utils/GameEvent";
import BaseItem from "../../utils/ui/BaseItem";
import { GoodsBox } from "../../utils/ui/GoodsBox";
import { GoodsItemData } from "../newhand_book/GoodsItem";

const { ccclass, property ,menu } = cc._decorator;

@ccclass
@menu('Game/ui/active-taqing/ActiveTaqing_ChoukaItem')
export class ActiveTaqing_ChoukaItem extends BaseItem {

    @property(GoodsBox)
    goodsBox:GoodsBox = null;

    @property(cc.Label)
    taskInfoLabel:cc.Label = null;

    @property(cc.Label)
    progressLabel:cc.Label = null;

    @property(cc.Node)
    btnNode:cc.Node = null;

    @property(cc.Node)
    btnLabelNode:cc.Node = null;

    @property(cc.Label)
    btnLabel:cc.Label = null;

    @property(cc.Node)
    bg:cc.Node = null;

    private _taskData:GS_FestivalActivityConfig_Task;
    private _taskState:GS_FestivalActivityPrivate_TaskItem;
    setData(data:any , index:number) {
        this.clearRedPoint();
        this.bg.active = index % 2 == 1;
        super.setData(data , index);
        this._taskData = this._taskState = null;
        if (!data) return;
        this._taskData = data.config as GS_FestivalActivityConfig_Task;
        this._taskState = data.data as GS_FestivalActivityPrivate_TaskItem;
        Game.redPointSys.registerRedPointSub(EVENT_REDPOINT.FESTIVAL_ACTIVE_LEICHOU_ITEM , this._taskData.nid.toString() , this.btnNode);
        this.taskInfoLabel.string = this._taskData.szdescription;
        this.progressLabel.string = "(" + Game.festivalActivityMgr.getLeiChouCount() + "/" + this._taskData.utargetvalue + ")";
        const geted = this._taskState.btgetreward == 1;
        if (this._taskData.rewarditemlist) {
            let len = this._taskData.rewarditemlist.length;
            let goodsDataList:GoodsItemData[] = [];
            let goodsData:GS_FestivalActivityConfig_RewardItem;
            for (let i = 0 ; i < len ; i++) {
                goodsData = this._taskData.rewarditemlist[i];
                if (goodsData.ngoodsid > 0) {
                    let goodsItemData:GoodsItemData = {
                        goodsId:goodsData.ngoodsid,
                        nums:goodsData.ngoodsnum,
                        gray:geted,
                        showGou:geted,
                    }

                    goodsDataList.push(goodsItemData);
                }
                
            }
            this.goodsBox.array = goodsDataList;
        }
        
        // this.btnLabelNode.active = this.btnNode.active = this.progressLabel.node.active = !geted;
        this.setNodeActive(this.btnLabelNode , !geted);
        this.setNodeActive(this.btnNode , !geted);
        this.setNodeActive(this.progressLabel.node , !geted);
        if (!geted) {
            this.btnLabel.string = Game.festivalActivityMgr.getLeiChouCount() >= this._taskData.utargetvalue ? "领取" : "抽奖";
        }

    }

    onChouJiangClick() {
        if (!this._taskData || !this._taskState) return;
        if (Game.festivalActivityMgr.getLeiChouCount() >= this._taskData.utargetvalue) {
            Game.festivalActivityMgr.reqTaskLeiChouReward(this._taskData.nid);
        } else {
            GameEvent.emit(EventEnum.ACTIVE_TAQING_PAGE_CHANGE , ACTIVE_TAQING_PAGE_INDEX.LUCKY);
        }
        
    }

    private clearRedPoint() {
        if (this._taskData) {
            Game.redPointSys.unregisterRedPointSub(EVENT_REDPOINT.FESTIVAL_ACTIVE_LEICHOU_ITEM , this._taskData.nid.toString() , this.btnNode);
        }
    }

    onDestroy() {
        this.clearRedPoint();
    }


}