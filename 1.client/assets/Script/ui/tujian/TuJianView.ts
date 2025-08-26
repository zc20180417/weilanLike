// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Dialog from "../../utils/ui/Dialog";
import TapView from "../dayInfoView/TapView";
import Game from "../../Game";
import { BuryingPointMgr, EBuryingPoint } from "../../buryingPoint/BuryingPointMgr";
import { EVENT_REDPOINT } from "../../redPoint/RedPointSys";

const { ccclass, property } = cc._decorator;

export interface TujianData {
    tabIndex: number;
    subTabIndex?: number;
    towerId?: number;
    isSkin?:boolean;
}

export enum TujianTabIndex {
    CAT,
    MONSTER
}

@ccclass
export default class TuJianView extends Dialog {
    @property(TapView)
    tapView: TapView = null;

    _monsterNavItem: cc.Node = null;
    _catNavItem: cc.Node = null;

    private data: TujianData = null;
    public setData(data: TujianData) {
        this.data = data;
    }

    protected afterShow() {
        let allMonsterCfgs = Game.monsterManualMgr.getAllkMonsterInfo();
        let data = {
            pageDatas: [
                {},
                allMonsterCfgs,
            ],
            navDatas: [
                {},
                {},
            ]
        }

        // this.tapView.setData(data);

        this.tapView.init(data);
        if (this.data) {
            this.tapView.selectTap(this.data.tabIndex, this.data.subTabIndex || 0, this.data.towerId , this.data.isSkin);
        } else {
            this.tapView.selectTap(0);
        }

        // this.scrollPage.scrollLeftHandler = Handler.create(this.btnNextPage, this);
        // this.scrollPage.scrollRightHandler = Handler.create(this.btnPrePage, this);

        //注册怪物图鉴导航item红点
        this._monsterNavItem = this.tapView.navigation.getNavItem(1);
        if (this._monsterNavItem) {
            Game.redPointSys.registerRedPoint(EVENT_REDPOINT.TUJIAN_GUAIWU, this._monsterNavItem);
        }

        this._catNavItem = this.tapView.navigation.getNavItem(0);
        if (this._catNavItem) {
            Game.redPointSys.registerRedPoint(EVENT_REDPOINT.TUJIAN_NEWCAT, this._catNavItem);
        }
    }

    // btnPrePage() {
    //     GameEvent.emit(EventEnum.TUJIAN_PRE_PAGE);
    // }

    // btnNextPage() {
    //     GameEvent.emit(EventEnum.TUJIAN_NEXT_PAGE);
    // }

    // refreshState(preState: boolean, nextState: boolean) {
    //     this.preNode.active = preState;
    //     this.nextNode.active = nextState;
    // }

    protected beforeShow() {
        BuryingPointMgr.post(EBuryingPoint.SHOW_TUJIAN_VIEW);
        // this.preNode.active = this.nextNode.active = false;
    }

    protected beforeHide() {
        // FrameLoadMgr.getInstance().unscheduleTargetAll(this.tapView);
    }

    protected afterHide() {
        //移除红点
        if (this._monsterNavItem) {
            Game.redPointSys.unregisterRedPoint(EVENT_REDPOINT.TUJIAN_GUAIWU, this._monsterNavItem);
        }
        if (this._catNavItem) {
            Game.redPointSys.unregisterRedPoint(EVENT_REDPOINT.TUJIAN_NEWCAT, this._catNavItem);
        }
    }

    protected readyDestroy() {
        this.tapView.readyDestroy();
        super.readyDestroy();
    }
}
