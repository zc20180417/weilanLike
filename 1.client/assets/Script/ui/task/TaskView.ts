// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { BuryingPointMgr, EBuryingPoint } from "../../buryingPoint/BuryingPointMgr";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { EVENT_REDPOINT } from "../../redPoint/RedPointSys";
import { GameEvent } from "../../utils/GameEvent";
import Dialog from "../../utils/ui/Dialog";
import TapView from "../dayInfoView/TapView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ManualView extends Dialog {

    @property(TapView)
    tapView: TapView = null;

    private _dailyItem: cc.Node = null;
    private _achievementItem: cc.Node = null;
    private _index: number = 0;
    setData(index: number) {
        this._index = index || 0;
    }

    onLoad() {
        super.onLoad();

        let data = {
            pageDatas: [
                [],
                []
            ],
            navDatas: [
                {},
                {}
            ]
        }

        this.tapView.init(data);
        this.tapView.selectTap(this._index);

        //注册日常红点
        this._dailyItem = this.tapView.navigation.getNavItem(0);
        if (this._dailyItem) {
            Game.redPointSys.registerRedPoint(EVENT_REDPOINT.TASK_DAILY, this._dailyItem);
        }
        this._achievementItem = this.tapView.navigation.getNavItem(1);
        if (this._achievementItem) {
            Game.redPointSys.registerRedPoint(EVENT_REDPOINT.TASK_ACHIEVEMENT, this._achievementItem);
        }
    }

    addEvent() {
        GameEvent.on(EventEnum.TASK_CHANGE, this.refreshCurrTap, this);
        GameEvent.on(EventEnum.TASK_ADD, this.refreshCurrTap, this);
        //监听跨天重置的消息
        GameEvent.on(EventEnum.ON_TASK_INIT, this.refreshCurrTap, this);
    }

    onDestroy() {
        if (this._dailyItem) {
            Game.redPointSys.unregisterRedPoint(EVENT_REDPOINT.TASK_DAILY, this._dailyItem);
        }
        if (this._achievementItem) {
            Game.redPointSys.unregisterRedPoint(EVENT_REDPOINT.TASK_ACHIEVEMENT, this._achievementItem);
        }
    }

    protected beforeShow() {
        BuryingPointMgr.post(EBuryingPoint.SHOW_TASK_VIEW);
    }

    refreshCurrTap() {
        this.tapView.refreshCurrTap();
    }
}
