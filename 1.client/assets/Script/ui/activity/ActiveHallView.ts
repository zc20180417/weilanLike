// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { GLOBAL_FUNC } from "../../common/AllEnum";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import GlobalVal from "../../GlobalVal";
import { ACTIVE_TYPE } from "../../net/socket/handler/MessageEnum";
import { EVENT_REDPOINT } from "../../redPoint/RedPointSys";
import { GameEvent } from "../../utils/GameEvent";
import Dialog from "../../utils/ui/Dialog";
import TapView from "../dayInfoView/TapView";

const { ccclass, property } = cc._decorator;

export enum ACTIVE_HALL_TAP_INDEX  {
    SIGN,
    ZERO_GO,
    DAILY_GIFT,
    JI_JIN,
    DAILY_ACTIVE,
    DAILY_EQUIP,
    WEEK_TEHUI,
    WEEK_RECHARGE,
    CONTINUE_RECHARGE,
    DAY_LOGIN,
    ON_LINE
}

//活动页签下标
const ACTIVE_INDEX = {
    [ACTIVE_TYPE.DAILY_ZHADANREN]: ACTIVE_HALL_TAP_INDEX.DAILY_ACTIVE,
    [ACTIVE_TYPE.DAILY_LEISHEN]: ACTIVE_HALL_TAP_INDEX.DAILY_ACTIVE,
    [ACTIVE_TYPE.DAILY_GANGTIEXIA]: ACTIVE_HALL_TAP_INDEX.DAILY_ACTIVE,
    [ACTIVE_TYPE.DAILY_GIFT]: ACTIVE_HALL_TAP_INDEX.DAILY_GIFT,
    [ACTIVE_TYPE.DAILY_EQUIP]: ACTIVE_HALL_TAP_INDEX.DAILY_EQUIP,
    [ACTIVE_TYPE.WEEK_TEHUI]: ACTIVE_HALL_TAP_INDEX.WEEK_TEHUI,
    [ACTIVE_TYPE.WEEK_RECHARGE]: ACTIVE_HALL_TAP_INDEX.WEEK_RECHARGE,
    [ACTIVE_TYPE.CONTINUE_RECHARGE]: ACTIVE_HALL_TAP_INDEX.CONTINUE_RECHARGE,
    [ACTIVE_TYPE.DAY_LOGIN]: ACTIVE_HALL_TAP_INDEX.DAY_LOGIN,
    [ACTIVE_TYPE.ONLINE_TIME]: ACTIVE_HALL_TAP_INDEX.ON_LINE,
}



export const ACTIVE_HALL_ACTIVE_NAME = {
    [ACTIVE_HALL_TAP_INDEX.SIGN]: "签到",
    [ACTIVE_HALL_TAP_INDEX.ZERO_GO]: "零元购",
    [ACTIVE_HALL_TAP_INDEX.DAILY_GIFT]: "每日礼包",
    [ACTIVE_HALL_TAP_INDEX.JI_JIN]: "闯关基金",
    [ACTIVE_HALL_TAP_INDEX.DAILY_ACTIVE]: "每日特惠",
    [ACTIVE_HALL_TAP_INDEX.DAILY_EQUIP]: "装备礼包",
    [ACTIVE_HALL_TAP_INDEX.WEEK_TEHUI]: "每周特惠",
    [ACTIVE_HALL_TAP_INDEX.WEEK_RECHARGE]: "每周累充",
    [ACTIVE_HALL_TAP_INDEX.CONTINUE_RECHARGE]: "连充奖励",
    [ACTIVE_HALL_TAP_INDEX.DAY_LOGIN]: "七天登陆",
    [ACTIVE_HALL_TAP_INDEX.ON_LINE]: "累计时长",
}

@ccclass
export default class ActiveHallView extends Dialog {
    @property(TapView)
    tapView: TapView = null;

    private _index: number = null;

    private _yuekaNav: cc.Node = null;
    private _leishenNav: cc.Node = null;
    private _growgiftNav: cc.Node = null;
    private _weekRechargeNav: cc.Node = null;
    private _coutinueRechargeNav: cc.Node = null;
    private _dayloginNav: cc.Node = null;
    private _zeroMallNav: cc.Node = null;
    private _onLineTimeNav: cc.Node = null;
    private _dailyGiftNav: cc.Node = null;

    @property(cc.ScrollView)
    scrollview: cc.ScrollView = null;

    @property(cc.Node)
    arrowUp: cc.Node = null;

    @property(cc.Node)
    arrowDown: cc.Node = null;

    setData(data: any) {
        this._index = data;
    }

    addEvent() {
        GameEvent.on(EventEnum.NEW_ACTIVE, this.onNewActive, this);
        GameEvent.on(EventEnum.ACTIVE_CLOSE, this.onActiveClose, this);
        this.scrollview.node.on("scroll-to-top", this.scrollToTop, this);
        this.scrollview.node.on("scroll-to-bottom", this.scrollToBottom, this);
    }

    private scrollToTop() {
        this.showArrow(false, true);
    }

    private scrollToBottom() {
        this.showArrow(true, false);
    }

    beforeShow() {
        let datas = {
            pageDatas: [
            ],
            navDatas: [
            ]
        }
        let globalFunc = Game.globalFunc;
        let activeActive = globalFunc.isFuncOpened(GLOBAL_FUNC.ACTIVITE) &&
            globalFunc.canShowFunc(GLOBAL_FUNC.ACTIVITE);
        //每日签到
        let tempData = globalFunc.isFuncOpenAndCanShow(GLOBAL_FUNC.SIGN) ? {} : null;
        datas.pageDatas.push(tempData);
        datas.navDatas.push(tempData);

        if (Game.zeroMallMgr.getIsOpen()) {
            datas.pageDatas.push({});
            datas.navDatas.push({});
        } else {
            datas.pageDatas.push(null);
            datas.navDatas.push(null);
        }

         //每日装备
         if (!activeActive
            || Game.sysActivityMgr.isActivityFinished(ACTIVE_TYPE.DAILY_GIFT)
            || !GlobalVal.openRecharge) {
            datas.pageDatas.push(null);
            datas.navDatas.push(null);
        } else {
            datas.pageDatas.push({});
            datas.navDatas.push({});
        }

        //基金
        if (globalFunc.isFuncOpened(GLOBAL_FUNC.JIJIN) &&
            globalFunc.canShowFunc(GLOBAL_FUNC.JIJIN) &&
            GlobalVal.openRecharge) {
            datas.pageDatas.push({});
            datas.navDatas.push({});
        } else {
            datas.pageDatas.push(null);
            datas.navDatas.push(null);
        }

        //每日特惠
        if (!activeActive
            || Game.sysActivityMgr.isActivityFinishedByClientParam(ACTIVE_TYPE.DAILY_ZHADANREN) &&
            Game.sysActivityMgr.isActivityFinishedByClientParam(ACTIVE_TYPE.DAILY_LEISHEN) &&
            Game.sysActivityMgr.isActivityFinishedByClientParam(ACTIVE_TYPE.DAILY_GANGTIEXIA)
            || !GlobalVal.openRecharge) {
            datas.pageDatas.push(null);
            datas.navDatas.push(null);
        } else {
            datas.pageDatas.push({});
            datas.navDatas.push({});
        }

        //每日装备
        if (!activeActive
            || Game.sysActivityMgr.isActivityFinished(ACTIVE_TYPE.DAILY_EQUIP)
            || !GlobalVal.openRecharge) {
            datas.pageDatas.push(null);
            datas.navDatas.push(null);
        } else {
            datas.pageDatas.push({});
            datas.navDatas.push({});
        }
        //每周特惠
        if (!activeActive
            || Game.sysActivityMgr.isActivityFinished(ACTIVE_TYPE.WEEK_TEHUI)
            || !GlobalVal.openRecharge) {
            datas.pageDatas.push(null);
            datas.navDatas.push(null);
        } else {
            datas.pageDatas.push({});
            datas.navDatas.push({});
        }
        //每周累充
        if (!activeActive
            || Game.sysActivityMgr.isActivityFinished(ACTIVE_TYPE.WEEK_RECHARGE)
            || !GlobalVal.openRecharge) {
            datas.pageDatas.push(null);
            datas.navDatas.push(null);
        } else {
            datas.pageDatas.push({});
            datas.navDatas.push({});
        }
        //连充奖励
        if (!activeActive
            || Game.sysActivityMgr.isActivityFinished(ACTIVE_TYPE.CONTINUE_RECHARGE)
            || !GlobalVal.openRecharge) {
            datas.pageDatas.push(null);
            datas.navDatas.push(null);
        } else {
            datas.pageDatas.push({});
            datas.navDatas.push({});
        }

        //七天登录
        if (!activeActive
            || Game.sysActivityMgr.isActivityFinished(ACTIVE_TYPE.DAY_LOGIN)) {
            datas.pageDatas.push(null);
            datas.navDatas.push(null);
        } else {
            datas.pageDatas.push({});
            datas.navDatas.push({});
        }

        //累计登录
        if (!activeActive
            || Game.sysActivityMgr.isActivityFinished(ACTIVE_TYPE.ONLINE_TIME)) {
            datas.pageDatas.push(null);
            datas.navDatas.push(null);
        } else {
            datas.pageDatas.push({});
            datas.navDatas.push({});
        }
        this.tapView.init(datas);

        if (this._index !== undefined && this._index !== null) {
            this.tapView.selectTap(this._index);
        } else {
            this.tapView.selectFirstTap();
        }

        this.registerRedpoint();

        if (this.tapView.navigation.itemLength >= 7) {
            this.showArrow(false, true);
        } else {
            this.showArrow(false, false);
        }
    }

    public afterHide() {
        this.unregisterRedpoint();
        this.scrollview.node.off("scroll-to-top", this.scrollToTop);
        this.scrollview.node.off("scroll-to-bottom", this.scrollToBottom);
    }

    private registerRedpoint() {
        let redPointSys = Game.redPointSys;
        //签到红点
        this._leishenNav = this.tapView.navigation.getNavItem(ACTIVE_HALL_TAP_INDEX.SIGN);
        if (this._leishenNav) {
            redPointSys.registerRedPoint(EVENT_REDPOINT.ACTIVE_HALL_LEISHEN, this._leishenNav);
        }

        //基金
        this._growgiftNav = this.tapView.navigation.getNavItem(ACTIVE_HALL_TAP_INDEX.JI_JIN);
        if (this._growgiftNav) {
            redPointSys.registerRedPoint(EVENT_REDPOINT.ACTIVE_HALL_GROWGIFT, this._growgiftNav);
        }

        //每周充值
        this._weekRechargeNav = this.tapView.navigation.getNavItem(ACTIVE_HALL_TAP_INDEX.WEEK_RECHARGE);
        if (this._weekRechargeNav) {
            redPointSys.registerRedPoint(EVENT_REDPOINT.WEEK_RECHARGE, this._weekRechargeNav);
        }

        //连冲
        this._coutinueRechargeNav = this.tapView.navigation.getNavItem(ACTIVE_HALL_TAP_INDEX.CONTINUE_RECHARGE);
        if (this._coutinueRechargeNav) {
            redPointSys.registerRedPoint(EVENT_REDPOINT.CONTINUE_RECHARGE, this._coutinueRechargeNav);
        }

        //7日连登
        this._dayloginNav = this.tapView.navigation.getNavItem(ACTIVE_HALL_TAP_INDEX.DAY_LOGIN);
        if (this._dayloginNav) {
            redPointSys.registerRedPoint(EVENT_REDPOINT.ACTIVE_HALL_DAYLOGIN, this._dayloginNav);
        }

        this._zeroMallNav = this.tapView.navigation.getNavItem(ACTIVE_HALL_TAP_INDEX.ZERO_GO);
        if (this._zeroMallNav) {
            redPointSys.registerRedPoint(EVENT_REDPOINT.ZERO_MALL, this._zeroMallNav);
        }

        this._onLineTimeNav = this.tapView.navigation.getNavItem(ACTIVE_HALL_TAP_INDEX.ON_LINE);
        if (this._onLineTimeNav) {
            redPointSys.registerRedPoint(EVENT_REDPOINT.ON_LINE_TIME, this._onLineTimeNav);
        }
        this._dailyGiftNav = this.tapView.navigation.getNavItem(ACTIVE_HALL_TAP_INDEX.DAILY_GIFT);
        if (this._dailyGiftNav) {
            redPointSys.registerRedPoint(EVENT_REDPOINT.ACTIVE_HALL_DAILY_GIFT, this._dailyGiftNav);
        }
    }

    private unregisterRedpoint() {
        let redPointSys = Game.redPointSys;
        if (this._leishenNav) {
            redPointSys.unregisterRedPoint(EVENT_REDPOINT.ACTIVE_HALL_LEISHEN, this._leishenNav);
        }

        if (this._growgiftNav) {
            redPointSys.unregisterRedPoint(EVENT_REDPOINT.ACTIVE_HALL_GROWGIFT, this._growgiftNav);
        }

        if (this._weekRechargeNav) {
            redPointSys.unregisterRedPoint(EVENT_REDPOINT.WEEK_RECHARGE, this._weekRechargeNav);
        }

        if (this._coutinueRechargeNav) {
            redPointSys.unregisterRedPoint(EVENT_REDPOINT.CONTINUE_RECHARGE, this._coutinueRechargeNav);
        }

        if (this._dayloginNav) {
            redPointSys.unregisterRedPoint(EVENT_REDPOINT.ACTIVE_HALL_DAYLOGIN, this._dayloginNav);
        }

        if (this._zeroMallNav) {
            redPointSys.unregisterRedPoint(EVENT_REDPOINT.ZERO_MALL, this._zeroMallNav);
        }

        if (this._onLineTimeNav) {
            redPointSys.unregisterRedPoint(EVENT_REDPOINT.ON_LINE_TIME, this._onLineTimeNav);
        }

        if (this._dailyGiftNav) {
            redPointSys.unregisterRedPoint(EVENT_REDPOINT.ACTIVE_HALL_DAILY_GIFT, this._dailyGiftNav);
        }
    }

    private onNewActive(nid: number) {
        let index = ACTIVE_INDEX[nid];
        if (index !== null && index !== undefined) {
            this.tapView.insertPage(index);
        }
    }

    private onActiveClose(nid: number) {
        let index = ACTIVE_INDEX[nid];
        if (index !== null && index !== undefined &&
            index !== ACTIVE_HALL_TAP_INDEX.DAILY_ACTIVE) {
            this.tapView.removePage(index);
        }
    }

    private showArrow(up: boolean, down: boolean) {
        this.arrowUp.active = up;
        this.arrowDown.active = down;
    }
}
