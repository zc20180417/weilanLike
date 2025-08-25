// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import GlobalVal from "../../GlobalVal";
import { GS_NoviceTaskPrivate } from "../../net/proto/DMSG_Plaza_Sub_NoviceTask";
import { EVENT_REDPOINT } from "../../redPoint/RedPointSys";
import { GameEvent } from "../../utils/GameEvent";
import { StringUtils } from "../../utils/StringUtils";
import Dialog from "../../utils/ui/Dialog";
import TapView from "../dayInfoView/TapView";
import NewhandNavItem from "./NewhandNavItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewhandBookView extends Dialog {
    @property(TapView)
    tapView: TapView = null;

    @property(cc.Label)
    time: cc.Label = null;

    private _privateData: GS_NoviceTaskPrivate = null;

    addEvent() {
        GameEvent.on(EventEnum.ON_UPDATE_NOVICE, this.onUpdatePrivateData, this);
        GameEvent.on(EventEnum.ACROSS_DAY, this.acrossDay, this);
    }

    beforeShow() {
        let day = 7;
        let data = {
            pageDatas: [
            ],
            navDatas: [
            ]
        }

        for (let i = 0; i < day; i++) {
            data.pageDatas.push({});
            data.navDatas.push({});
        }

        this.tapView.init(data);
        this.tapView.selectTap(0);

        this._privateData = Game.noviceTask.getPrivateData();

        let currDay = Game.noviceTask.getCurrDay();
        //注册红点
        for (let i = 0; i < currDay; i++) {
            let navItem = this.tapView.navigation.getNavItem(i);
            if (navItem) {
                Game.redPointSys.registerRedPoint(EVENT_REDPOINT.NOVICE + "-day" + (i + 1), navItem);
            }
        }
    }

    afterHide() {
        //取消红点
        let day = Game.noviceTask.getCurrDay();
        for (let i = 0; i < day; i++) {
            let navItem = this.tapView.navigation.getNavItem(i);
            if (navItem) {
                Game.redPointSys.unregisterRedPoint(EVENT_REDPOINT.NOVICE + "-day" + (i + 1), navItem);
            }
        }
    }

    onUpdatePrivateData(dayIndex: number) {
        //超前完成任务
        if (dayIndex + 1 > Game.noviceTask.getCurrDay()) return;

        this.tapView.refreshCurrTap();
        let navItemCom = this.tapView.navigation.getNavItemCom(dayIndex);
        (navItemCom as NewhandNavItem).refreshState();
    }

    acrossDay() {
        let day = Game.noviceTask.getCurrDay();
        let navItem = this.tapView.navigation.getNavItem(day - 1);
        if (navItem) {
            Game.redPointSys.registerRedPoint(EVENT_REDPOINT.NOVICE + "-day" + day, navItem);
        }

        let navItemCom = this.tapView.navigation.getNavItemCom(day - 1);
        (navItemCom as NewhandNavItem).refreshState();
    }

    update(dt) {
        if (this._privateData) {
            let now = GlobalVal.getServerTime() * 0.001;
            this.time.string = StringUtils.formatTimeToDHM(this._privateData.nendgreentime - now);
        } else {
            this._privateData = Game.noviceTask.getPrivateData();
        }
    }
}
