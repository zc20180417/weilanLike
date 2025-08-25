import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { GameEvent } from "../../utils/GameEvent";
import Dialog from "../../utils/ui/Dialog";
import { YueKaItem } from "./YueKaItem";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("Game/ui/yueka/YueKaNewView")
export class YueKaNewView extends Dialog {

    @property(YueKaItem)
    weekItem:YueKaItem = null;

    @property(YueKaItem)
    monthItem:YueKaItem = null;

    protected addEvent() {
        GameEvent.on(EventEnum.REFRESH_MONTH_CARD , this.onFreshMonth , this);
        GameEvent.on(EventEnum.REFRESH_WEEK_CARD , this.onFreshWeek , this);
    }

    protected beforeShow(): void {
        this.weekItem.setData({type:1 , config:Game.signMgr.getWeekCardConfig()});
        this.monthItem.setData({type:2 , config:Game.signMgr.getMonthCardConfig()});
    }

    private onFreshMonth() {
        this.monthItem.setData({type:2 , config:Game.signMgr.getMonthCardConfig()});
    }

    private onFreshWeek() {
        this.weekItem.setData({type:1 , config:Game.signMgr.getWeekCardConfig()});
    }

    onDestroy() {

    }

}