import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { GS_FestivalActivityConfig, GS_FestivalActivityConfig_Sign, GS_FestivalActivityPrivate } from "../../net/proto/DMSG_Plaza_Sub_FestivalActivity";
import { GameEvent } from "../../utils/GameEvent";
import { PageView } from "../../utils/ui/PageView";
import { ActiveTaqing_SignItem } from "./ActiveTaqing_SignItem";

const { ccclass, property ,menu } = cc._decorator;
@ccclass
@menu('Game/ui/active-taqing/ActiveTaqing_Sign')
export class ActiveTaqing_Sign extends PageView {


    @property([ActiveTaqing_SignItem])
    items:ActiveTaqing_SignItem[] = [];

    private _config:GS_FestivalActivityConfig;
    private _data:GS_FestivalActivityPrivate;
    private _sign:GS_FestivalActivityConfig_Sign;
    private _curDay:number = 0;

    /**子类继承，添加事件 */
    protected addEvent() {
        GameEvent.on(EventEnum.ACTIVE_TAQING_SIGN , this.onSignChange , this);
        GameEvent.on(EventEnum.ACROSS_DAY , this.onSignChange , this);
    }
    /**子类继承，移除事件 */
    protected removeEvent() {
        GameEvent.off(EventEnum.ACTIVE_TAQING_SIGN , this.onSignChange , this);
        GameEvent.off(EventEnum.ACROSS_DAY , this.onSignChange , this);
    }

    protected doShow() {
        this._config = Game.festivalActivityMgr.getConfig();
        this._data = Game.festivalActivityMgr.getData();
        if (!this._config || !this._config.sign || !this._data) return;
        this._sign = this._config.sign;
        this.refreshList();
    }


    private refreshList() {
        if (!this._sign) return;
        this._curDay = Game.festivalActivityMgr.getCurDay();
        let len = Math.min(this.items.length , this._sign.rewarditemlist ? Math.floor(this._sign.rewarditemlist.length) / 2 : 0);
        for (let i = 0 ; i < len ; i++) {
            this.items[i].setData(
                {
                    rewards:[this._sign.rewarditemlist[i * 2] , this._sign.rewarditemlist[i * 2 + 1]],
                    flag:this._data.nsignday[i],
                    curDay:this._curDay,
                },
                i
            )
        }
    }

    private onSignChange() {
        this.refreshList();
    }
}