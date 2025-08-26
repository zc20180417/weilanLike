import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import GlobalVal from "../../GlobalVal";
import { GameEvent } from "../../utils/GameEvent";
import { Handler } from "../../utils/Handler";
import { GS_NewSeviceRankingConfig, GS_NewSeviceRankingConfig_Base, GS_NewSeviceRankingConfig_RewardItem, GS_NewSeviceRankingData, GS_NewSeviceRankingData_RankingItem, GS_NewSeviceRankingGet, GS_PLAZA_NEWSEVICERANKING_MSG } from "../proto/DMSG_Plaza_Sub_NewSeviceRanking";
import BaseNetHandler from "../socket/handler/BaseNetHandler";
import { CMD_ROOT, GS_PLAZA_MSGID } from "../socket/handler/MessageEnum";

export class NewSeviceRankConfig {
    base: GS_NewSeviceRankingConfig_Base;
    rewards: GS_NewSeviceRankingConfig_RewardItem[];
}

export class NewSeviceRankTimes {
    openTime:number = 0;
    stopTime:number = 0;
    closeTime:number = 0;
}

export class NewSeviceRankingMgr extends BaseNetHandler {




    private _newSeviceRankConfigDic:{[key:string]:NewSeviceRankConfig} = {};
    private _rankDataDic:{[key:string]:GS_NewSeviceRankingData_RankingItem[]} = {};
    private _timesDic:{[key:string]:NewSeviceRankTimes}  = {};
    private _lastReqTime:number = 0;
    //请求排行榜数据间隔
    private reqDataDy:number = 5000;
    private _testRankDatas:GS_NewSeviceRankingData_RankingItem[] = [];
    constructor() {
        super(CMD_ROOT.CMDROOT_PLAZA_MSG, GS_PLAZA_MSGID.GS_PLAZA_MSGID_NEWSEVICERANKING);

        let data0:GS_NewSeviceRankingData_RankingItem = new GS_NewSeviceRankingData_RankingItem();
        data0.nfaceframeid = 14;
        data0.nfaceid = 210;
        let data1:GS_NewSeviceRankingData_RankingItem = new GS_NewSeviceRankingData_RankingItem();
        data1.nfaceframeid = 16;
        data1.nfaceid = 701;
        let data2:GS_NewSeviceRankingData_RankingItem = new GS_NewSeviceRankingData_RankingItem();
        data2.nfaceframeid = 11;
        data2.nfaceid = 104;

        this._testRankDatas[0] = data0;
        this._testRankDatas[1] = data1;
        this._testRankDatas[2] = data2;

        for (let i = 0 ; i < 8 ; i++) {
            this._testRankDatas.push(new GS_NewSeviceRankingData_RankingItem());
        }
    }

    register() {
        this.registerAnaysis(GS_PLAZA_NEWSEVICERANKING_MSG.PLAZA_NEWSEVICERANKING_CONFIG , Handler.create(this.onNewSeviceRankingConfig , this) , GS_NewSeviceRankingConfig);
        this.registerAnaysis(GS_PLAZA_NEWSEVICERANKING_MSG.PLAZA_NEWSEVICERANKING_DATA , Handler.create(this.onNewSeviceRankingData , this) , GS_NewSeviceRankingData);
    }

    reqRank(nid:number) {
        if (GlobalVal.getServerTime() - this._lastReqTime < this.reqDataDy) {
            GameEvent.emit(EventEnum.NEW_SEVICE_RANKING_DATA , nid);
            return;
        }

        let data:GS_NewSeviceRankingGet = new GS_NewSeviceRankingGet();
        data.nid = nid;
        this.send(GS_PLAZA_NEWSEVICERANKING_MSG.PLAZA_NEWSEVICERANKING_GET , data);
    }

    getRankConfig(nid:number):NewSeviceRankConfig {
        return this._newSeviceRankConfigDic[nid];
    }

    getRankData(nid:number):GS_NewSeviceRankingData_RankingItem[] {
        return this._rankDataDic[nid];
    }

    getTimeItem(nid:number):NewSeviceRankTimes {
        return this._timesDic[nid];
    }

    getShopTime(nid:number):number {
        let item = this.getTimeItem(nid);
        return item ? item.stopTime : 0;
    }

    getIsOpen(nid:number):boolean {
        let timeItem = this.getTimeItem(nid);
        if (timeItem) {
            const now = GlobalVal.getServerTime() * 0.001;
            return now >= timeItem.openTime && now < timeItem.closeTime;
        }
        return false;
    }

    getRankTestData(index:number):GS_NewSeviceRankingData_RankingItem {
        return this._testRankDatas[index];
    }

    private onNewSeviceRankingData(data:GS_NewSeviceRankingData) {
        cc.log('-------onNewSeviceRankingData:' , data);
        this._rankDataDic[data.nid] = [];
        for (let i = 0; i < data.ucount ; i++) {
            this._rankDataDic[data.nid].push(data.data[i]);
        }
        this._lastReqTime = GlobalVal.getServerTime();
        GameEvent.emit(EventEnum.NEW_SEVICE_RANKING_DATA , data.nid);
    }

    private onNewSeviceRankingConfig(data:GS_NewSeviceRankingConfig) {

        cc.log('-------onNewSeviceRankingConfig:' , data);
        this._newSeviceRankConfigDic = {};
        this._timesDic = {};
        let rewardIndex = 0;
        for (let i = 0 ; i < data.ubasecount ; i++) {
            let element:GS_NewSeviceRankingConfig_Base = data.data1[i];
            let item:NewSeviceRankConfig = new NewSeviceRankConfig();
            item.base = element;
            if (element.btcount > 0 && data.data2.length >= rewardIndex + element.btcount) {
                item.rewards = [];
                for (let j = rewardIndex ; j < rewardIndex + element.btcount ; j++) {

                    item.rewards.push(data.data2[j]);
                }
                item.rewards.sort((a:GS_NewSeviceRankingConfig_RewardItem , b:GS_NewSeviceRankingConfig_RewardItem):number=> {
                    return a.nminranking - b.nminranking;
                })
            }
            rewardIndex += element.btcount;
            this._newSeviceRankConfigDic[element.nid] = item;

            let timeItem:NewSeviceRankTimes = new NewSeviceRankTimes();
            const channelopentimes = Game.actorMgr.privateData.nchannelopentimes;
            timeItem.openTime = channelopentimes + element.nopendelaytimes;
            timeItem.closeTime = channelopentimes + element.nclosedelaytimes;
            timeItem.stopTime = channelopentimes + element.nstopdelaytimes;
            this._timesDic[element.nid] = timeItem;
        }

        GameEvent.emit(EventEnum.NEW_SEVICE_RANKING_CONFIG);
    }

}