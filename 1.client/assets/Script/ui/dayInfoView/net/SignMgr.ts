

import BaseNetHandler from "../../../net/socket/handler/BaseNetHandler";
import { CMD_ROOT, GS_PLAZA_MSGID } from "../../../net/socket/handler/MessageEnum";
import { GS_PLAZA_SIGN_MSG, GS_SignConfig, GS_SignPrivateInfo, GS_SignCheck, GS_SignMonthCardConfig, GS_SignMonthCardPrivate, GS_SignMonthCardBuy, GS_SignMonthCardOrder, GS_SignMonthCardsGetReward, GS_SignSetFreeVideoOrder, GS_SignWeekCardConfig, GS_SignWeekCardPrivate, GS_SignWeekCardBuy, GS_SignWeekCardOrder, GS_SignWeekCardsGetReward } from "../../../net/proto/DMSG_Plaza_Sub_Sign";
import { Handler } from "../../../utils/Handler";
import { GameEvent } from "../../../utils/GameEvent";
import { EventEnum } from "../../../common/EventEnum";
import GlobalVal from "../../../GlobalVal";
import Game from "../../../Game";
import { BuryingPointMgr, EBuryingPoint } from "../../../buryingPoint/BuryingPointMgr";
import Debug from "../../../debug";
import Utils from "../../../utils/Utils";
import { EVENT_REDPOINT } from "../../../redPoint/RedPointSys";
import SystemTipsMgr from "../../../utils/SystemTipsMgr";
import { UiManager } from "../../../utils/UiMgr";
import { EResPath } from "../../../common/EResPath";

const { ccclass, property } = cc._decorator;

const SIGN_TAG = "签到：";

export default class SignMgr extends BaseNetHandler {

    private _signConfig: GS_SignConfig;
    private _signInfo: GS_SignPrivateInfo;
    private _monthCardConfig: GS_SignMonthCardConfig;
    private _monthCardPrivate: GS_SignMonthCardPrivate;
    private _weekCardConfig: GS_SignWeekCardConfig;
    private _weekCardPrivate: GS_SignWeekCardPrivate;


    constructor() {
        super(CMD_ROOT.CMDROOT_PLAZA_MSG, GS_PLAZA_MSGID.GS_PLAZA_MSGID_SIGN);
    }

    register() {
        this.registerAnaysis(GS_PLAZA_SIGN_MSG.PLAZA_SIGN_INFO, Handler.create(this.onGetSignInfo, this), GS_SignConfig);
        this.registerAnaysis(GS_PLAZA_SIGN_MSG.PLAZA_SIGN_PRIVATEINFO, Handler.create(this.onGetSignPrivateinfo, this), GS_SignPrivateInfo);
        this.registerAnaysis(GS_PLAZA_SIGN_MSG.PLAZA_SIGN_MONTHCARDCONFIG, Handler.create(this.onMonthCardConfig, this), GS_SignMonthCardConfig);
        this.registerAnaysis(GS_PLAZA_SIGN_MSG.PLAZA_SIGN_MONTHCARDPRIVATE, Handler.create(this.onMonthCardPrivate, this), GS_SignMonthCardPrivate);
        this.registerAnaysis(GS_PLAZA_SIGN_MSG.PLAZA_SIGN_MONTHCARDORDER, Handler.create(this.onMonthCardOrder, this), GS_SignMonthCardOrder);
        this.registerAnaysis(GS_PLAZA_SIGN_MSG.PLAZA_SIGN_SETFREEVIDEOORDER, Handler.create(this.onFreeVideoOrder, this), GS_SignSetFreeVideoOrder);
        this.registerAnaysis(GS_PLAZA_SIGN_MSG.PLAZA_SIGN_WEEKCARDCONFIG, Handler.create(this.onWeekCardConfig, this), GS_SignWeekCardConfig);
        this.registerAnaysis(GS_PLAZA_SIGN_MSG.PLAZA_SIGN_WEEKCARDPRIVATE, Handler.create(this.onWeekCardPrivate, this), GS_SignWeekCardPrivate);
        this.registerAnaysis(GS_PLAZA_SIGN_MSG.PLAZA_SIGN_WEEKCARDORDER, Handler.create(this.onWeekCardOrder, this), GS_SignWeekCardOrder);
    }

    /**签到 */
    sign() {
        let signData: GS_SignCheck = new GS_SignCheck();
        this.send(GS_PLAZA_SIGN_MSG.PLAZA_SIGN_CHECK, signData);
    }

    /**请求购买月卡 */
    reqBuyMonthCard() {
        let data: GS_SignMonthCardBuy = new GS_SignMonthCardBuy();
        this.send(GS_PLAZA_SIGN_MSG.PLAZA_SIGN_MONTHCARDBUY, data);
    }

    /**请求购买周卡 */
    reqBuyWeekCard() {
        let data: GS_SignWeekCardBuy = new GS_SignWeekCardBuy();
        this.send(GS_PLAZA_SIGN_MSG.PLAZA_SIGN_WEEKCARDBUY, data);
    }

    /**
     * 领取月卡奖励
     * @param btMode 
     */
    reqGetRewardMonthCard() {
        let data: GS_SignMonthCardsGetReward = new GS_SignMonthCardsGetReward();
        this.send(GS_PLAZA_SIGN_MSG.PLAZA_SIGN_MONTHCARDGETREWARD, data);
    }

    /**
     * 领取周卡奖励
     */
    reqGetWeekCardReward() {
        let data: GS_SignWeekCardsGetReward = new GS_SignWeekCardsGetReward();
        this.send(GS_PLAZA_SIGN_MSG.PLAZA_SIGN_WEEKCARDGETREWARD, data);
    }

    /**签到配置 */
    getSignConfig(): GS_SignConfig {
        return this._signConfig;
    }

    /**签到数据 */
    getSignInfo(): GS_SignPrivateInfo {
        return this._signInfo;
    }

    getMonthCardConfig(): GS_SignMonthCardConfig {
        return this._monthCardConfig;
    }

    getMonthCardPrivate(): GS_SignMonthCardPrivate {
        return this._monthCardPrivate;
    }

    getWeekCardConfig(): GS_SignWeekCardConfig {
        return this._weekCardConfig;
    }

    getWeekCardPrivate(): GS_SignWeekCardPrivate {
        return this._weekCardPrivate;
    }

    /**
     * 月卡活动今日是否签到
     * @returns 
     */
    isYueKaSignedToday(): boolean {
        return !this._monthCardPrivate || Utils.isTimeInToday(this._monthCardPrivate.nlastfreetimes);
    }

    /**
     * 是否购买了月卡
     * @returns 
     */
    isBoughtYueKa(): boolean {
        return this._monthCardPrivate && GlobalVal.getServerTime() < this._monthCardPrivate.nexpiretimes * 1000;
    }

    /**
     * 周卡活动今日是否签到
     * @returns 
     */
    isWeekSignedToday(): boolean {
        return !this._weekCardPrivate || Utils.isTimeInToday(this._weekCardPrivate.nlastfreetimes);
    }

    /**
     * 是否购买了周卡
     * @returns 
     */
    isBoughtWeek(): boolean {
        return this._weekCardPrivate && GlobalVal.getServerTime() < this._weekCardPrivate.nexpiretimes * 1000;
    }

    checkBoughtWeek():boolean {
        if (!GlobalVal.closeAwardVideo || this.isBoughtWeek()) {
            return true;
        }

        SystemTipsMgr.instance.notice("需要先购买周卡才能使用此功能");
        UiManager.showDialog(EResPath.YUE_KA_VIEW);

        return false;
    }
    /////////////////////////////////////////////////////////////////

    private onGetSignInfo(data: GS_SignConfig) {
        this._signConfig = data;
        Debug.log(SIGN_TAG, "签到配置", data);
        GameEvent.emit(EventEnum.ON_SIN_CONFIG);
    }

    private onGetSignPrivateinfo(data: GS_SignPrivateInfo) {
        Debug.log(SIGN_TAG, "玩家签到个人信息", data);
        this._signInfo = data;
        this.refreshSignRedPoint();
        GameEvent.emit(EventEnum.ON_SIGN_PRIVATEINFO, data);
    }

    /////////////////////////////////////////////////////////////////yueka
    //月卡配置
    private onMonthCardConfig(data: GS_SignMonthCardConfig) {
        Debug.log(SIGN_TAG, "月卡配置", data);
        this._monthCardConfig = data;
    }
    //月卡个人数据
    private onMonthCardPrivate(data: GS_SignMonthCardPrivate) {
        Debug.log(SIGN_TAG, "月卡个人数据", data);
        this._monthCardPrivate = data;
        this.refreshYueKaRedpoints();
        GameEvent.emit(EventEnum.REFRESH_MONTH_CARD, data);
    }
    //月卡订单
    private onMonthCardOrder(data: GS_SignMonthCardOrder) {
        Game.mallProto.payOrder(data.szorder);
        BuryingPointMgr.post(EBuryingPoint.PAY_YUEKA, JSON.stringify({ order: data.szorder }));
    }

    private onFreeVideoOrder(data: GS_SignSetFreeVideoOrder) {
        Game.nativeApi.showRewardAd(Game.actorMgr.nactordbid.toString(), data.szorder, data.szsdkkey);
    }


    private onWeekCardConfig(data: GS_SignWeekCardConfig) {
        this._weekCardConfig = data;
    }

    private onWeekCardPrivate(data: GS_SignWeekCardPrivate) {
        this._weekCardPrivate = data;
        GameEvent.emit(EventEnum.REFRESH_WEEK_CARD, data);
        this.refreshYueKaRedpoints();
    }

    /**周卡订单 */
    private onWeekCardOrder(data: GS_SignWeekCardOrder) {
        Game.mallProto.payOrder(data.szorder);
    }

    /**
     * 刷新月卡红点
     */
    private refreshYueKaRedpoints() {
        let redpointNum = 0;
        if ((this.isBoughtYueKa() && !this.isYueKaSignedToday())
            || (this.isBoughtWeek() && !this.isWeekSignedToday())) {
            redpointNum = 1;
        }
        let node = Game.redPointSys.findRedPointNode(EVENT_REDPOINT.YUEKA);
        if (node) {
            node.setRedPointNum(redpointNum);
        }
    }

    private refreshSignRedPoint() {
        let node = Game.redPointSys.findRedPointNode(EVENT_REDPOINT.ACTIVE_HALL_LEISHEN);
        if (node) {
            node.setRedPointNum(this.isSignToday() ? 0 : 1);
        }
    }

    public isSignToday(): boolean {
        return this._signInfo && (this._signInfo.btcheckindex === - 1);
    }
}
