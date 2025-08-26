import { NewSeviceRankType } from "../../common/AllEnum";
import { EResPath } from "../../common/EResPath";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import GlobalVal from "../../GlobalVal";
import { GameEvent } from "../../utils/GameEvent";
import { StringUtils } from "../../utils/StringUtils";
import Dialog from "../../utils/ui/Dialog";
import List from "../../utils/ui/List";
import { UiManager } from "../../utils/UiMgr";
import { NewSeviceRankItem } from "./NewSeviceRankItem";

const { ccclass, property ,menu } = cc._decorator;

@ccclass
@menu('Game/ui/active/NewSeviceRankView')
export class NewSeviceRankView extends Dialog {

    @property(List)
    list:List = null;

    @property([NewSeviceRankItem])
    rankItems:NewSeviceRankItem[] = [];

    @property(cc.Label)
    endLabel:cc.Label = null;

    @property(cc.Label)
    selfWarLabel:cc.Label = null;

    @property(cc.Label)
    selfTimeLabel:cc.Label = null;

    private _stopTime:number = 0;
    protected beforeShow(): void {
        this.blackLayer.opacity = 178;
        GameEvent.on(EventEnum.NEW_SEVICE_RANKING_DATA , this.onRankData , this);
        GameEvent.on(EventEnum.NEW_SEVICE_RANKING_CONFIG ,this.onRankConfig , this);
        Game.newSevicerankMgr.reqRank(NewSeviceRankType.COMMON_WAR);
        this.selfWarLabel.string = '当前关卡数：' + (Game.sceneNetMgr.getLastWarID()); 
        this.selfTimeLabel.string = '通关日期：' +  StringUtils.formateTimeTo(Game.sceneNetMgr.getLastWarFinishTime() , '-' , true);

        this.onRankConfig();
    }

    private onRankData(nid:number) {
        if (nid != NewSeviceRankType.COMMON_WAR) return;
        let rankingDatas = Game.newSevicerankMgr.getRankData(NewSeviceRankType.COMMON_WAR);

        // let temp1 = rankingDatas.slice().splice(0 , 1);

        for (let i = 0 ; i < 3 ; i++) {
            this.rankItems[i].setData(rankingDatas[i] || Game.newSevicerankMgr.getRankTestData(i));
        }

        let showDatas = [];
        
        let len = rankingDatas.length;
        if (len > 3) {
            showDatas = rankingDatas.slice().splice(3 , len);
           
        } 

        len = showDatas.length;
        if (len < 5) {
            for (let i = len ; i < 5 ; i++) {
                showDatas.push(Game.newSevicerankMgr.getRankTestData(i + 3));
            }
        }

        this.list.array = showDatas;
    }

    private onRankConfig() {
        let timeItem = Game.newSevicerankMgr.getTimeItem(NewSeviceRankType.COMMON_WAR);
        this._stopTime = timeItem ? timeItem.stopTime : 0;
        if (this._stopTime > 0) {
            this.schedule(this.onTimer , 1 , cc.macro.REPEAT_FOREVER);
        } else {
            this.endLabel.string = StringUtils.formatTimeToDHMS(0 ,  " ");
        }
        this.onTimer();
    }

    private onTimer() {
        this.endLabel.string = "距离结束：" +  StringUtils.formatTimeToDHMS(this._stopTime - GlobalVal.getServerTime() * 0.001 ,  " ");
    }

    onRewardClick() {
        UiManager.showDialog(EResPath.NEW_SEVICE_RANK_REWARD_TIPS);
    }



    onWenClick() {
        let str = "1.至少通过第20关的玩家才可以上榜\r\n" + 
                "2.排名以关卡通过数量作为依据，如果两个玩家通关数一样，则看谁的通关日期靠前\r\n" + 
                "3.排名只以普通关卡为准，隐藏关和困难模式关卡不算入其中\r\n"+
                "4.活动结束后，榜单奖励会以邮件形式发放，活动和榜单公示一段时间后关闭";
        UiManager.showDialog(EResPath.JING_CAI_TIPS_VIEW , str);
    }

}