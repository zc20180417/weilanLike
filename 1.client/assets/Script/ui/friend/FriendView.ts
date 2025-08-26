// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { BuryingPointMgr, EBuryingPoint } from "../../buryingPoint/BuryingPointMgr";
import Game from "../../Game";
import { EVENT_REDPOINT } from "../../redPoint/RedPointSys";
import Dialog from "../../utils/ui/Dialog";
import TapView from "../dayInfoView/TapView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FriendView extends Dialog {
    @property(TapView)
    tapView: TapView = null;

    private _noticeNavItem: cc.Node = null;
    private _pvpNavItem: cc.Node = null;
    private _listItem: cc.Node = null;
    onLoad() {

    }

    private _showIndex: number = 0;
    public setData(data: any): void {
        this._showIndex = data ? data : 0;
    }

    onDestroy() {
        if (this._noticeNavItem) {
            Game.redPointSys.unregisterRedPoint(EVENT_REDPOINT.FRIEND_NOTICE, this._noticeNavItem);
        }
        if (this._pvpNavItem) {
            Game.redPointSys.unregisterRedPoint(EVENT_REDPOINT.FRIEND_PVP, this._pvpNavItem);
        }
        if (this._listItem) {
            Game.redPointSys.unregisterRedPoint(EVENT_REDPOINT.FRIENDLIST, this._listItem);
        }
    }

    beforeShow() {
        // Game.relationMgr.relationGetRecommend();
        BuryingPointMgr.post(EBuryingPoint.SHOW_FRIEND_VIEW);

        let data = {
            pageDatas: [
                {},
                {},
                {},
                {}
            ],
            navDatas: [
                {},
                {},
                {},
                {}
            ]
        }

        this.tapView.init(data);
        this.tapView.selectTap(this._showIndex);

        this._noticeNavItem = this.tapView.navigation.getNavItem(2);
        if (this._noticeNavItem) {
            Game.redPointSys.registerRedPoint(EVENT_REDPOINT.FRIEND_NOTICE, this._noticeNavItem);
        }

        this._pvpNavItem = this.tapView.navigation.getNavItem(3);
        if (this._pvpNavItem) {
            Game.redPointSys.registerRedPoint(EVENT_REDPOINT.FRIEND_PVP, this._pvpNavItem);
        }

        this._listItem = this.tapView.navigation.getNavItem(0);
        if (this._listItem) {
            Game.redPointSys.registerRedPoint(EVENT_REDPOINT.FRIENDLIST, this._listItem);
        }
    }
}
