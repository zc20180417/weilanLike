
import { BuryingPointMgr, EBuryingPoint } from "../../buryingPoint/BuryingPointMgr";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import GlobalVal from "../../GlobalVal";
import { EVENT_REDPOINT } from "../../redPoint/RedPointSys";
import { GameEvent } from "../../utils/GameEvent";
import { Handler } from "../../utils/Handler";
import Utils from "../../utils/Utils";
import { GS_PLAZA_ZEROMALL_MSG, GS_ZeroMallBuy, GS_ZeroMallClose, GS_ZeroMallConfig, GS_ZeroMallConfig_RewardGoods, GS_ZeroMallConfig_RewardItem, GS_ZeroMallGetReward, GS_ZeroMallPrivate } from "../proto/DMSG_Plaza_Sub_ZeroMall";
import BaseNetHandler from "../socket/handler/BaseNetHandler";
import { ActorProp, ACTOR_OPENFLAG, CMD_ROOT, GS_PLAZA_MSGID } from "../socket/handler/MessageEnum";


export class ZeroMallRewardItems {
    loginDay:number = 0;
    rewardGoods:GS_ZeroMallConfig_RewardGoods[];
    flag:boolean = false;
    curLoginDay:number = 0;
}

export class ZeroMallMgr extends BaseNetHandler {



    private _rewardItems:ZeroMallRewardItems[] = [];
    private _config:GS_ZeroMallConfig;
    private _private:GS_ZeroMallPrivate;
    private _closeTime:number = 0;
    constructor() {
        super(CMD_ROOT.CMDROOT_PLAZA_MSG, GS_PLAZA_MSGID.GS_PLAZA_MSGID_ZEROMALL);
    }

    register(): void {
        this.registerAnaysis(GS_PLAZA_ZEROMALL_MSG.PLAZA_ZEROMALL_CONFIG , Handler.create(this.onZeroMallConfig , this) , GS_ZeroMallConfig);
        this.registerAnaysis(GS_PLAZA_ZEROMALL_MSG.PLAZA_ZEROMALL_PRIVATE , Handler.create(this.onZeroMallPrivate , this) , GS_ZeroMallPrivate);
        this.registerAnaysis(GS_PLAZA_ZEROMALL_MSG.PLAZA_ZEROMALL_CLOSE , Handler.create(this.onZeroMallClose , this) , GS_ZeroMallClose);
    }


    getConfig():GS_ZeroMallConfig {
        return this._config;
    }

    getPrivate():GS_ZeroMallPrivate {
        return this._private;
    }

    getRewardItems():ZeroMallRewardItems[] {
        return this._rewardItems;
    }

    getIsOpen():boolean {
        if (!this._config || !this._private) return false;

        if (this._private.btactive == 1) {
            return (Game.actorMgr.getProp(ActorProp.ACTOR_PROP_OPENFLAG) & ACTOR_OPENFLAG.OPENFLAG_FINISHZEROMALL) == 0 && !this.allAwardGeted();
        }

        return Game.sceneNetMgr.getLastWarID() >= this._config.nopenwarid && GlobalVal.getServerTimeS() < this._closeTime; 
    }

    reqBuy() {
        let data:GS_ZeroMallBuy = new GS_ZeroMallBuy(); 
        this.send(GS_PLAZA_ZEROMALL_MSG.PLAZA_ZEROMALL_BUY , data);
        BuryingPointMgr.post(EBuryingPoint.ZERO_MALL_BUY);
    }

    reqGetReward(index:number) {
        let data:GS_ZeroMallGetReward = new GS_ZeroMallGetReward();
        data.btindex = index;
        this.send(GS_PLAZA_ZEROMALL_MSG.PLAZA_ZEROMALL_GETREWARD , data);
    }

    private onZeroMallConfig(data:GS_ZeroMallConfig) {
        this._config = data;
        this._rewardItems = [];
        let goodsIndex = 0;
        if (data.urewaritemcount > 0) {
            for (let i = 0 ; i < data.urewaritemcount ; i++) {
                let item:ZeroMallRewardItems = new ZeroMallRewardItems();
                let rewaritem:GS_ZeroMallConfig_RewardItem = data.data1[i];
                item.loginDay = rewaritem.nloginday;
                item.rewardGoods = [];
                let end = goodsIndex + rewaritem.btgoodscount;
                for (let j = goodsIndex ; j < end ; j++) {
                    item.rewardGoods.push(data.data2[j]);
                }
                goodsIndex += rewaritem.btgoodscount;
                this._rewardItems.push(item);
            }
        }

        this._closeTime = this._config.nclosetimes + (Game.actorMgr.privateData ? Game.actorMgr.privateData.nregtime : 0);
        this.checkRedPoint();
        GameEvent.emit(EventEnum.ZERO_MALL_CONFIG);
    }

    private onZeroMallPrivate(data:GS_ZeroMallPrivate) {
        this._private = data;
        this.checkRedPoint();
        GameEvent.emit(EventEnum.ZERO_MALL_DATA);
    }

    private onZeroMallClose(data:GS_ZeroMallClose) {
        
    }

    private allAwardGeted():boolean {
        if (!this._config || !this._private) return true;
        let flag = false;
        let len = this._rewardItems.length;
        for (let i = 0 ; i < len ; i++) {
            if (!Utils.checkBitFlag(this._private.uflag , i)) {
                return false;
            }
        }
        return true;
    }

    private checkRedPoint() {
        if (!this._config || !this._private) return;
        let len = this._rewardItems.length;
        let redNum = 0;
        for (let i = 0 ; i < len ; i++) {
            this._rewardItems[i].flag = Utils.checkBitFlag(this._private.uflag , i);
            this._rewardItems[i].curLoginDay = this._private.nlogincount;

            if (this._private.btactive == 1 && !Utils.checkBitFlag(this._private.uflag , i) && this._private.nlogincount > this._rewardItems[i].loginDay ) {
                redNum = 1;
            }
        }

        let redPoint = Game.redPointSys.findRedPointNode(EVENT_REDPOINT.ZERO_MALL);
        if (redPoint) {
            redPoint.setRedPointNum(redNum);
        }
    }

}