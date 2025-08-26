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
@menu('Game/ui/active-taqing/ActiveTaqing_LeiChong_Item')
export class ActiveTaqing_LeiChong_Item extends BaseItem {

    @property(cc.Label)
    valueLabel:cc.Label = null;

    @property(GoodsBox)
    goodsBox:GoodsBox = null;

    @property(cc.Label)
    label:cc.Label = null;

    @property(cc.Node)
    btnNode:cc.Node = null;

    @property(cc.Label)
    btnLabel:cc.Label = null;

    @property(cc.Node)
    completeNode:cc.Node = null;

    @property(cc.Color)
    labelNormalColor:cc.Color = null;

    @property(cc.Color)
    valueLabelNormalColor:cc.Color = null;

    @property(cc.Color)
    labelGetedColor:cc.Color = null;

    @property(cc.Color)
    valueLabelGetedColor:cc.Color = null;

    private _taskData:GS_FestivalActivityConfig_Task;
    private _taskState:GS_FestivalActivityPrivate_TaskItem;

    setData(data:any , index:number) {
        this.clearRedPoint();
        super.setData(data , index);
        this._taskData = null;
        this._taskState = null;
        if (!data) return;
        this._taskData = data.config as GS_FestivalActivityConfig_Task;
        this._taskState = data.data as GS_FestivalActivityPrivate_TaskItem;
        Game.redPointSys.registerRedPointSub(EVENT_REDPOINT.FESTIVAL_ACTIVE_LEICHONG_ITEM , this._taskData.nid.toString() , this.btnNode);
        this.valueLabel.string = (this._taskData.utargetvalue * 10) + "";
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
        };

        this.setNodeActive(this.btnNode , !geted);
        this.setNodeActive(this.btnLabel.node , !geted);
        this.setNodeActive(this.completeNode , geted);
        this.label.node.color = geted ? this.labelGetedColor : this.labelNormalColor;
        this.valueLabel.node.color = geted ? this.valueLabelGetedColor : this.valueLabelNormalColor;

        if (!geted) {
            this.btnLabel.string = Game.festivalActivityMgr.getLeiChongCount() >= this._taskData.utargetvalue ? "领 取":"前往充值";
        }
    }
    

    onReChargeClick() {
        if (!this._taskData || !this._taskState) return;
        if (Game.festivalActivityMgr.getLeiChongCount() >= this._taskData.utargetvalue) {
            Game.festivalActivityMgr.reqTaskLeiChongReward(this._taskData.nid);
        } else {
            GameEvent.emit(EventEnum.ACTIVE_TAQING_PAGE_CHANGE , ACTIVE_TAQING_PAGE_INDEX.SHOP_GIFT);
        }
        
    }

    private clearRedPoint() {
        if (this._taskData) {
            Game.redPointSys.unregisterRedPointSub(EVENT_REDPOINT.FESTIVAL_ACTIVE_LEICHONG_ITEM , this._taskData.nid.toString() , this.btnNode);
        }
    }

    onDestroy() {
        this.clearRedPoint();
    }


}