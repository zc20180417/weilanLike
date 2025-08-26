// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { UiManager } from "../utils/UiMgr";
import { EResPath } from "../common/EResPath";
import Game from "../Game";
import { GLOBAL_FUNC, LocalActiveId, NewSeviceRankType } from "../common/AllEnum";

import { EventEnum } from "../common/EventEnum";
import GlobalVal from "../GlobalVal";

import { BuryingPointMgr, EBuryingPoint } from "../buryingPoint/BuryingPointMgr";
import ImageLoader from "../utils/ui/ImageLoader";
import { ACTIVE_TYPE, ActorProp, ACTOR_OPENFLAG, GOODS_ID } from "../net/socket/handler/MessageEnum";
import { SystemGuideTriggerType } from "../ui/guide/SystemGuideCtrl";
import { Handler } from "../utils/Handler";
import { EVENT_REDPOINT } from "../redPoint/RedPointSys";
import { StringUtils } from "../utils/StringUtils";
import { HallChapterTips } from "./HallChapterTips";
import SysMgr from "../common/SysMgr";
import TweenNum from "../utils/TweenNum";
import { ShopIndex } from "../ui/shop/ShopView";
import { ChapterBookBtn } from "./ChapterBookBtn";
import { BookEft } from "./BookEft";
import { LocalStorageMgr } from "../utils/LocalStorageMgr";
import { HallSystemItem } from "./HallSystemItem";

import SystemTipsMgr from "../utils/SystemTipsMgr";
import { GameEvent, Reply } from "../utils/GameEvent";
import { CacheModel } from "../utils/res/ResManager";


// import Record from "../../Record";
const { ccclass, menu, property } = cc._decorator;

//左侧按钮（从上到下依次排序）
enum LeftBtn {
    DISCOUNT,           //打折屋
    YUE_KA,             //月卡
    FIRST_RECHARGE,     //首冲
    VIP,                //vip
    IRON_MAN,           //钢铁侠
    ACTIVE_HALL,        //活动大厅
    // BATTLE_PASS,        //战场通行证
    LOGIN_FUND,         //登录基金
    CELEBRATION,         //开服盛典
    EVERY_DAY_RECHARGE,  //每日首冲
    NEW_SEVICE_RANK,     //开服冲榜
    SKIN,                //皮肤
    BATTLE_PASS_3,      //闯关基金2
    BATTLE_PASS_4,      //闯关基金4
    ACTIVE_TAQING,      //节日活动
}

//右侧按钮（从上到下依次排序）
enum RightBtn {
    EMAIL,              //邮箱
    DUI_HUAN,           //兑换
    FRIEND,             //好友
    INVITE,             //邀请
    QUESTION,           //问卷调查
}

//底部按钮（从左到右依次排序）
enum BottomBtn {
    TASK,               //任务
    TU_JIAN,            //图鉴
    MALL,               //商城
    SCIENCE,            //天赋
    YONG_BING,          //猫咪
}

//背景中的按钮（从左到右依次排序）
enum SceneBtn {
    REDPACKET,          //红包兑换
    PVP,                //pvp
    SIGN,               //签到
    TREATRUE,           //宝箱
    SHANG_JIN,          //赏金
    CAT_HOUSE,          //猫咪公寓
}

@ccclass
@menu("Game/Hall/HallScene")
export default class HallScene extends cc.Component {
    @property(cc.Node)
    leftBtns: cc.Node[] = [];

    @property(cc.Node)
    rightBtns: cc.Node[] = [];

    @property(cc.Node)
    bottomBtns: cc.Node[] = [];

    @property(cc.Node)
    sceneBtns: cc.Node[] = [];

    @property(cc.Node)
    diamondIcoNode: cc.Node = null;

    @property(cc.Label)
    nameLab: cc.Label = null;

    @property(cc.Label)
    rank: cc.Label = null;

    @property(cc.Label)
    diamond: cc.Label = null;

    @property(cc.Label)
    money: cc.Label = null;

    @property(cc.Node)
    trophy: cc.Node = null;

    @property(cc.Node)
    bottomUi: cc.Node = null;

    @property(cc.Node)
    bookEftNode: cc.Node = null;

    @property(ImageLoader)
    diaIco: ImageLoader = null;

    @property(cc.Sprite)
    startBgs: cc.Sprite[] = [];

    @property(cc.Label)
    discountTime: cc.Label = null;

    @property(cc.Node)
    blockInputNode: cc.Node = null;

    @property(HallChapterTips)
    chapterTips: HallChapterTips = null;

    @property(ImageLoader)
    redPacketIco: ImageLoader = null;

    @property(dragonBones.ArmatureDisplay)
    boxArmature: dragonBones.ArmatureDisplay = null;

    @property(HallSystemItem)
    catHouseTitle: HallSystemItem = null;

    @property(HallSystemItem)
    bountryTitle: HallSystemItem = null;

    @property(HallSystemItem)
    exchangeTitle: HallSystemItem = null;

    @property(HallSystemItem)
    pvpTitle: HallSystemItem = null;

    @property(cc.Node)
    checkPointTitle: cc.Node = null;

    @property(HallSystemItem)
    dailyCpTitle: HallSystemItem = null;

    @property([cc.Node])
    uiNodes: cc.Node[] = [];

    @property(cc.Node)
    shopLockNode: cc.Node = null;

    @property(cc.Sprite)
    shopNameImg: cc.Sprite = null;

    @property(cc.SpriteFrame)
    shopNameNormaSf: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    shopNameDownSf: cc.SpriteFrame = null;

    @property(cc.SpriteAtlas)
    gameui: cc.SpriteAtlas = null;

    @property(cc.Label)
    newSeviceRankTimeLabel:cc.Label = null;

    @property(cc.Node)
    activityEftNode:cc.Node = null;

    private enableUpdateTime: boolean = true;
    private _curPower: number = 0;
    private _bookEft: cc.Node = null;
    private _friendOpenBook: boolean = true;
    private _newSeviceRankStopTime:number = 0;
    onLoad() {
        Game.soundMgr.playMusic(EResPath.MAIN_BG, 3);

        this.registerEvent();

        this.checkGlobalFunc();

        // this.refreshNoviceBtn();

        this.registerRedPoint();

        this.refreshUi();

        //请求邮件信息
        if (!Game.emailMgr.isReqestEmail()) {
            Game.emailMgr.reqEMailView();
        }

        //显示弹窗公告
        Game.actorMgr.showPopView();

        // cc.log("自选卡包：",Game.goodsMgr.getGoodsInfo(41));
    }

    start() {
        GameEvent.emit(EventEnum.ENTER_HALL_SCENE);
        BuryingPointMgr.postFristPoint(EBuryingPoint.LOADING_COMPLETE);
        this.refreshStartBg();
        if (Game.sceneNetMgr.getCurWorldID() == 1) {
            this.blockInputNode.active = true;

            if (false && Game.sceneNetMgr.getCurWarID() == 1 && (Game.actorMgr.getProp(ActorProp.ACTOR_PROP_OPENFLAG) & ACTOR_OPENFLAG.OPENFLAG_MODIFYNAME) == 0) {
                GameEvent.on(EventEnum.HIDE_DIALOG, this.onChangeNameEnd, this);
                GameEvent.on(EventEnum.HIDE_MANHUA, this.onHideManhua, this);
                this.setUINodeActive(false);
                UiManager.showDialog(EResPath.MAN_HUA);
            } else {
                this.loadBook();
            }

            this.startBgs[0].node.active = true;
        } else {
            this.checkPointTitle.active = true;
        }

        this.checkOnEnterHallScene();

        //每6秒播放一次宝箱动画
        if (Game.globalFunc.canShowFunc(GLOBAL_FUNC.TREATRUE) && Game.globalFunc.isFuncOpened(GLOBAL_FUNC.TREATRUE)) {
            this.schedule(this.playBoxAnimation, 6, cc.macro.REPEAT_FOREVER);
        }

        this.rank.string = Game.actorMgr.nactordbid.toString();
        if (cc.winSize.width / cc.winSize.height > 1.79) {
            let comp = this.uiNodes[0].getComponent(cc.Widget);
            if (comp) {
                comp.left = 210;
            }
        }
    }

    private onOpenBookTime() {
        this.blockInputNode.active = true;
        this.checkPointTitle.active = false;
        this.startBgs[0].node.active = true;
        if (this._bookEft) {
            let bookEftComp = this._bookEft.getComponent(BookEft);
            bookEftComp.play();
        } else {
            this.loadBook();
        }
    }

    private setUINodeActive(flag: boolean) {
        this.uiNodes.forEach(element => {
            element.active = flag;
        });
    }

    update(dt) {
        if (this.leftBtns[LeftBtn.DISCOUNT].active) {
            if (this.enableUpdateTime) {
                Game.discountMgr.caculLeftTime();
                let t = Game.discountMgr.getLeftTime();
                if (t == 0) {
                    this.enableUpdateTime = false;
                    //issue:由于本地时间和服务器时间存在差异，请求刷新打折商城，不一定下发打折商城的数据
                    Game.discountMgr.disCountTimeRefresh();

                }
                let timeStr = StringUtils.doInverseTime(Math.abs(t));
                this.discountTime.string = timeStr;
                // cc.log("大厅update", dt);
            }
        }

        if (this.leftBtns[LeftBtn.NEW_SEVICE_RANK].active) {
            let time = (this._newSeviceRankStopTime - GlobalVal.getServerTime() * 0.001);
            this.newSeviceRankTimeLabel.string = StringUtils.formatTimeToDHMS2(time);
        }

    }


    onDestroy() {
        Game.resMgr.removeLoad(EResPath.BOOK_EFFECT, Handler.create(this.onBookEftLoaded, this));
        SysMgr.instance.clearTimer(Handler.create(this.onOpenBookTime, this));
        Game.resMgr.decRef(EResPath.ACTIVITY_EFT);
        // SysMgr.instance.clearTimer(Handler.create(this.onOpenBookTime, this), true);
        //SysMgr.instance.clearTimer(Handler.create(this.onShowTipsTimer, this), true);
        // TweenNum.kill('setPowerValue');
        Game.globalFunc.clearFuncNodes();

        cc.director.getCollisionManager().enabled = false;

        this.unregisterRedPoint();

        this.unregisterEvent();

        this.unschedule(this.playBoxAnimation);
    }

    private loadBook() {
        GameEvent.on(EventEnum.BOOK_EFFECT_PLAY_END, this.onBookEftPlayEnd, this);
        Game.resMgr.loadRes(EResPath.BOOK_EFFECT, cc.Prefab, Handler.create(this.onBookEftLoaded, this));
    }

    private registerEvent() {
        GameEvent.on(EventEnum.MUSIC_STATE_CHANGE, this.onMusicStateChange, this);
        GameEvent.on(EventEnum.PLAYER_PROP_CHANGE + ActorProp.ACTOR_PROP_DIAMONDS, this.refreshDiamond, this);

        GameEvent.on(EventEnum.ITEM_COUNT_CHANGE, this.onMoneyChange, this);
        GameEvent.on(EventEnum.SYSTEM_GUIDE_CLICK2, this.onGuideClick, this);
        GameEvent.on(EventEnum.ON_DISCOUNT_PRIVATE_DATA, this.onDiscountPrivateData, this);

        GameEvent.on(EventEnum.NEW_ACTIVE, this.onNewActive, this);
        GameEvent.on(EventEnum.ACTIVE_CLOSE, this.onActiveClose, this);

        GameEvent.on(EventEnum.PLAYER_NAME_CHANGE, this.onNameChange, this);
        GameEvent.on(EventEnum.PVP_RANK_PRIVATE_INIT, this.onRankPrivateInit, this);
        GameEvent.on(EventEnum.COOPERATE_PRIVATE_INIT, this.onCooperatePrivateInit, this);

        GameEvent.on(EventEnum.FIRST_RECHARGE_END, this.onFirstRechargeEnd, this);
        GameEvent.on(EventEnum.FIRST_RECHARGE_PRIVATE, this.updateRechargeIcon, this);
        GameEvent.on(EventEnum.REFRESH_CK_QUESTION, this.onRefreshCkQuestion, this);

        GameEvent.onReturn("get_btn", this.getBtnNode, this);
        GameEvent.on(EventEnum.REFRESH_BATTLE_PASS2, this.onBattlePassPrivateData2, this);
        GameEvent.on(EventEnum.REFRESH_BATTLE_PASS3, this.onBattlePassPrivateData3, this);
        GameEvent.on(EventEnum.REFRESH_BATTLE_PASS4, this.onBattlePassPrivateData4, this);
        GameEvent.on(EventEnum.REFRESH_SYSTEM_OPEN_WAR, this.onRefreshSystemOpenWar, this);
        GameEvent.on(EventEnum.UPDATE_ACTIVE_DATA, this.onRefreshActiveData, this);
        GameEvent.on(EventEnum.NEW_SEVICE_RANKING_CONFIG, this.onRefreshNewSeviceRank, this);
        GameEvent.on(EventEnum.FASHION_ACTIVE, this.checkSkin, this);
        GameEvent.on(EventEnum.ACTIVE_INIT, this.onRefreshActive, this);
        GameEvent.on(EventEnum.ACTIVE_TAQING_CLOSE, this.onFestivalActivityClose, this);
        GameEvent.on(EventEnum.ACTIVE_TAQING_INIT, this.onFestivalActivityInit, this);
    }

    private onRefreshCkQuestion() {
        this.rightBtns[RightBtn.QUESTION].active = !LocalStorageMgr.getItem('ck_question', true) ? true : false;
    }

    private unregisterEvent() {
        GameEvent.targetOff(this);
        Handler.dispose(this);
    }

    /**
     * 注册红点
     */
    private registerRedPoint() {
        let globalFunc = Game.globalFunc;
        let redPointSys = Game.redPointSys;
        //商城
        if (globalFunc.isFuncOpened(GLOBAL_FUNC.MALL) && globalFunc.canShowFunc(GLOBAL_FUNC.MALL)) {
            redPointSys.registerRedPoint(EVENT_REDPOINT.SHOP, this.bottomBtns[BottomBtn.MALL]);
        }
        //任务
        if (globalFunc.isFuncOpened(GLOBAL_FUNC.TASK)) {
            redPointSys.registerRedPoint(EVENT_REDPOINT.TASK, this.bottomBtns[BottomBtn.TASK]);
        }
        //邮件
        if (globalFunc.isFuncOpened(GLOBAL_FUNC.EMAIL)) {
            redPointSys.registerRedPoint(EVENT_REDPOINT.EMAIL, this.rightBtns[RightBtn.EMAIL]);
        }

        //炮塔
        if (globalFunc.isFuncOpened(GLOBAL_FUNC.YONGBING)) {
            redPointSys.registerRedPoint(EVENT_REDPOINT.YONGBING, this.bottomBtns[BottomBtn.YONG_BING]);
            redPointSys.registerRedPoint(EVENT_REDPOINT.YONGBING_CANACTIVE, this.bottomBtns[BottomBtn.YONG_BING]);
        }

        //天赋
        if (globalFunc.isFuncOpened(GLOBAL_FUNC.SCIENCE)) {
            redPointSys.registerRedPoint(EVENT_REDPOINT.SCIENCE, this.bottomBtns[BottomBtn.SCIENCE]);
        }

        //图鉴
        if (globalFunc.isFuncOpened(GLOBAL_FUNC.TUJIAN)) {
            redPointSys.registerRedPoint(EVENT_REDPOINT.TUJIAN, this.bottomBtns[BottomBtn.TU_JIAN]);
        }

        //vip
        if (globalFunc.isFuncOpened(GLOBAL_FUNC.VIP)) {
            redPointSys.registerRedPoint(EVENT_REDPOINT.VIP, this.leftBtns[LeftBtn.VIP]);
        }

        //好友
        if (globalFunc.isFuncOpened(GLOBAL_FUNC.FRIEND)) {
            redPointSys.registerRedPoint(EVENT_REDPOINT.FRIEND, this.rightBtns[RightBtn.FRIEND]);
            redPointSys.registerRedPoint(EVENT_REDPOINT.FRIENDCHAT, this.rightBtns[RightBtn.FRIEND]);
        }

        //新手宝典
        // if (globalFunc.isFuncOpened(GLOBAL_FUNC.NOVICE)
        //     && globalFunc.canShowFunc(GLOBAL_FUNC.NOVICE)
        //     && !Game.noviceTask.isNoviceOver()) {
        //     redPointSys.registerRedPoint(EVENT_REDPOINT.NOVICE, this.leftBtns[LeftBtn.NOVICE]);
        // }

        //活动大厅
        redPointSys.registerRedPoint(EVENT_REDPOINT.ACTIVE_HALL, this.leftBtns[LeftBtn.ACTIVE_HALL]);

        //月卡
        redPointSys.registerRedPoint(EVENT_REDPOINT.YUEKA, this.leftBtns[LeftBtn.YUE_KA]);

        //通行证
        // redPointSys.registerRedPoint(EVENT_REDPOINT.BATTLE_PASS, this.leftBtns[LeftBtn.BATTLE_PASS]);
        redPointSys.registerRedPoint(EVENT_REDPOINT.LOGIN_FUND, this.leftBtns[LeftBtn.LOGIN_FUND]);
        redPointSys.registerRedPoint(EVENT_REDPOINT.BATTLE_PASS3, this.leftBtns[LeftBtn.BATTLE_PASS_3]);
        redPointSys.registerRedPoint(EVENT_REDPOINT.BATTLE_PASS4, this.leftBtns[LeftBtn.BATTLE_PASS_4]);
        redPointSys.registerRedPoint(EVENT_REDPOINT.PVP, this.sceneBtns[SceneBtn.PVP]);
        redPointSys.registerRedPoint(EVENT_REDPOINT.FESTIVAL_ACTIVE, this.leftBtns[LeftBtn.ACTIVE_TAQING]);


        // this.rightBtns[RightBtn.QUESTION].active = !LocalStorageMgr.getItem('ck_question', true) ? true : false;
        this.rightBtns[RightBtn.QUESTION].active = false;
    }

    private unregisterRedPoint() {
        let redPointSys = Game.redPointSys;
        //取消红点
        redPointSys.unregisterRedPoint(EVENT_REDPOINT.TASK, this.bottomBtns[BottomBtn.TASK]);
        redPointSys.unregisterRedPoint(EVENT_REDPOINT.EMAIL, this.rightBtns[RightBtn.EMAIL]);
        redPointSys.unregisterRedPoint(EVENT_REDPOINT.YONGBING, this.bottomBtns[BottomBtn.YONG_BING]);
        redPointSys.unregisterRedPoint(EVENT_REDPOINT.YONGBING_CANACTIVE, this.bottomBtns[BottomBtn.YONG_BING]);
        redPointSys.unregisterRedPoint(EVENT_REDPOINT.SCIENCE, this.bottomBtns[BottomBtn.SCIENCE]);
        redPointSys.unregisterRedPoint(EVENT_REDPOINT.TUJIAN, this.bottomBtns[BottomBtn.TU_JIAN]);
        redPointSys.unregisterRedPoint(EVENT_REDPOINT.VIP, this.leftBtns[LeftBtn.VIP]);
        redPointSys.unregisterRedPoint(EVENT_REDPOINT.FRIEND, this.rightBtns[RightBtn.FRIEND]);
        redPointSys.unregisterRedPoint(EVENT_REDPOINT.FRIENDCHAT, this.rightBtns[RightBtn.FRIEND]);
        redPointSys.unregisterRedPoint(EVENT_REDPOINT.SHOP, this.bottomBtns[BottomBtn.MALL]);
        redPointSys.unregisterRedPoint(EVENT_REDPOINT.ACTIVE_HALL, this.leftBtns[LeftBtn.ACTIVE_HALL]);
        redPointSys.unregisterRedPoint(EVENT_REDPOINT.YUEKA, this.leftBtns[LeftBtn.YUE_KA]);
        // redPointSys.unregisterRedPoint(EVENT_REDPOINT.BATTLE_PASS, this.leftBtns[LeftBtn.BATTLE_PASS]);
        redPointSys.unregisterRedPoint(EVENT_REDPOINT.LOGIN_FUND, this.leftBtns[LeftBtn.LOGIN_FUND]);
        redPointSys.unregisterRedPoint(EVENT_REDPOINT.BATTLE_PASS3, this.leftBtns[LeftBtn.BATTLE_PASS_3]);
        redPointSys.unregisterRedPoint(EVENT_REDPOINT.BATTLE_PASS4, this.leftBtns[LeftBtn.BATTLE_PASS_4]);
        redPointSys.unregisterRedPoint(EVENT_REDPOINT.PVP, this.sceneBtns[SceneBtn.PVP]);
        redPointSys.unregisterRedPoint(EVENT_REDPOINT.FESTIVAL_ACTIVE, this.leftBtns[LeftBtn.ACTIVE_TAQING]);
    }

    /**
     * 检测全局功能开启
     */
    private checkGlobalFunc() {
        let globalFunc = Game.globalFunc;

        // globalFunc.checkFuncNode(this.sceneBtns[SceneBtn.SIGN], GLOBAL_FUNC.CHALLENGE);
        // globalFunc.checkFuncNode(this.sceneBtns[SceneBtn.SIGN], GLOBAL_FUNC.DAILY_CP);
        // globalFunc.checkFuncNode(this.sceneBtns[SceneBtn.REDPACKET], GLOBAL_FUNC.REDPACKET);

        globalFunc.checkFuncNode(this.rightBtns[RightBtn.EMAIL], GLOBAL_FUNC.EMAIL);
        globalFunc.checkFuncNode(this.rightBtns[RightBtn.DUI_HUAN], GLOBAL_FUNC.DUIHUAN);

        globalFunc.checkFuncNode(this.sceneBtns[SceneBtn.TREATRUE], GLOBAL_FUNC.TREATRUE);
        globalFunc.checkFuncNode(this.bottomBtns[BottomBtn.TU_JIAN], GLOBAL_FUNC.TUJIAN, this.bottomUi);
        globalFunc.checkFuncNode(this.bottomBtns[BottomBtn.TASK], GLOBAL_FUNC.TASK, this.bottomUi);
        globalFunc.checkFuncNode(this.bottomBtns[BottomBtn.SCIENCE], GLOBAL_FUNC.SCIENCE, this.bottomUi);
        globalFunc.checkFuncNode(this.bottomBtns[BottomBtn.YONG_BING], GLOBAL_FUNC.YONGBING, this.bottomUi);
        globalFunc.checkFuncNode(this.bottomBtns[BottomBtn.MALL], GLOBAL_FUNC.MALL, this.bottomUi);
        // globalFunc.checkFuncNode(this.leftBtns[LeftBtn.LOGIN_FUND], GLOBAL_FUNC.LOGIN_FUND);
        this.onRefreshSystemOpenWar();


        // if (!GlobalVal.isChannelSubpackage()) {
        //     globalFunc.checkFuncNode(this.rightBtns[RightBtn.INVITE], GLOBAL_FUNC.INVITE);
        // } else {
        // }
        this.rightBtns[RightBtn.INVITE].active = false;
        globalFunc.checkFuncNode(this.rightBtns[RightBtn.FRIEND], GLOBAL_FUNC.FRIEND);
        globalFunc.checkFuncNode(this.leftBtns[LeftBtn.DISCOUNT], GLOBAL_FUNC.DISCOUNT);

        if (!GlobalVal.openRecharge) {
            this.leftBtns[LeftBtn.VIP].active = false;
            this.leftBtns[LeftBtn.ACTIVE_HALL].active = false;
        } else {
            globalFunc.checkFuncNode(this.leftBtns[LeftBtn.ACTIVE_HALL], GLOBAL_FUNC.ACTIVE_HALL);
            globalFunc.checkFuncNode(this.leftBtns[LeftBtn.VIP], GLOBAL_FUNC.VIP);
        }

        this.onRefreshActive();

        //首充
        if (!Game.actorMgr.isFirstRechargeFinished() &&
            GlobalVal.openRecharge &&
            Game.globalFunc.canShowFunc(GLOBAL_FUNC.FIRST_RECHARGE) &&
            Game.globalFunc.isFuncOpened(GLOBAL_FUNC.FIRST_RECHARGE)) {
            this.leftBtns[LeftBtn.FIRST_RECHARGE].active = true;
            this.showActivityItemEft(this.leftBtns[LeftBtn.FIRST_RECHARGE] , true);
            this.updateRechargeIcon();
        } else {
            this.leftBtns[LeftBtn.FIRST_RECHARGE].active = false;
            this.showActivityItemEft(this.leftBtns[LeftBtn.FIRST_RECHARGE] , false);
        }
        //月卡
        if (globalFunc.isFuncOpened(GLOBAL_FUNC.YUEKA) &&
            globalFunc.canShowFunc(GLOBAL_FUNC.YUEKA) &&
            GlobalVal.openRecharge) {
            this.leftBtns[LeftBtn.YUE_KA].active = true;
        } else {
            this.leftBtns[LeftBtn.YUE_KA].active = false;
        }

        //通行证3
        if (globalFunc.isFuncOpened(GLOBAL_FUNC.BATTLE_PASS3) &&
            globalFunc.canShowFunc(GLOBAL_FUNC.BATTLE_PASS3) && 
            GlobalVal.openRecharge &&
            !Game.battlePassMgr.isAllBattlePass3Finished()) {
            this.leftBtns[LeftBtn.BATTLE_PASS_3].active = true;
        } else {
            this.leftBtns[LeftBtn.BATTLE_PASS_3].active = false;
        }

        //通行证4
        if (globalFunc.isFuncOpened(GLOBAL_FUNC.BATTLE_PASS4) &&
            globalFunc.canShowFunc(GLOBAL_FUNC.BATTLE_PASS4) && 
            GlobalVal.openRecharge &&
            !Game.battlePassMgr.isAllBattlePass4Finished()) {
            this.leftBtns[LeftBtn.BATTLE_PASS_4].active = true;
        } else {
            this.leftBtns[LeftBtn.BATTLE_PASS_4].active = false;
        }

        //登录基金
        if (globalFunc.isFuncOpened(GLOBAL_FUNC.LOGIN_FUND) &&
            globalFunc.canShowFunc(GLOBAL_FUNC.LOGIN_FUND) &&
            GlobalVal.openRecharge &&
            !Game.battlePassMgr.isAllBattlePass2Finished()) {
            this.leftBtns[LeftBtn.LOGIN_FUND].active = true;
        } else {
            this.leftBtns[LeftBtn.LOGIN_FUND].active = false;
        }

        //节日活动
        if (globalFunc.isFuncOpened(GLOBAL_FUNC.FESYIVAL_ACTIVITY) &&
            globalFunc.canShowFunc(GLOBAL_FUNC.FESYIVAL_ACTIVITY) &&
            GlobalVal.openRecharge &&
            Game.festivalActivityMgr.checkFestivalActivity()) {
            this.leftBtns[LeftBtn.ACTIVE_TAQING].active = true;
            this.showActivityItemEft(this.leftBtns[LeftBtn.ACTIVE_TAQING] , true);
        } else {
            this.leftBtns[LeftBtn.ACTIVE_TAQING].active = false;
            this.showActivityItemEft(this.leftBtns[LeftBtn.ACTIVE_TAQING] , false);
        }

        if (globalFunc.isFuncOpened(GLOBAL_FUNC.MALL)) {
            this.shopLockNode.active = false;
            this.shopNameImg.node.x = 0;
        } else {
            this.shopLockNode.active = true;
            this.shopNameImg.node.x = 25.5;
        }

        //开服盛典
        if (GlobalVal.openRecharge && !Game.sysActivityMgr.isLocalActiveFinished(LocalActiveId.CELEBRATION)) {
            this.leftBtns[LeftBtn.CELEBRATION].active = true;
        } else {
            this.leftBtns[LeftBtn.CELEBRATION].active = false;
        }

        this.onRefreshNewSeviceRank();
        this.showActivityEft();
    }

    private onRefreshSystemOpenWar() {
        let globalFunc = Game.globalFunc;
        this.pvpTitle.show(globalFunc.isFuncOpened(GLOBAL_FUNC.PVP), globalFunc.getOpenCfg(GLOBAL_FUNC.PVP).funcOpenCondition);
        this.bountryTitle.show(globalFunc.isFuncOpened(GLOBAL_FUNC.CHALLENGE), globalFunc.getOpenCfg(GLOBAL_FUNC.CHALLENGE).funcOpenCondition);
        // this.exchangeTitle.show(globalFunc.isFuncOpened(GLOBAL_FUNC.REDPACKET), globalFunc.getOpenCfg(GLOBAL_FUNC.REDPACKET).funcOpenCondition);
        this.catHouseTitle.show(globalFunc.isFuncOpened(GLOBAL_FUNC.COOPERATE), globalFunc.getOpenCfg(GLOBAL_FUNC.COOPERATE).funcOpenCondition);
        this.dailyCpTitle.show(globalFunc.isFuncOpened(GLOBAL_FUNC.ACTIVE_HALL), globalFunc.getOpenCfg(GLOBAL_FUNC.ACTIVE_HALL).funcOpenCondition);
        // this.dailyCpTitle.show(globalFunc.isFuncOpened(GLOBAL_FUNC.CHALLENGE), globalFunc.getOpenCfg(GLOBAL_FUNC.CHALLENGE).funcOpenCondition);
    }

    private onNameChange() {
        this.nameLab.string = StringUtils.getShowName(Game.actorMgr.privateData.szname, 14);
    }

    private onRefreshActiveData(nid:number) {
        if (GlobalVal.openRecharge && (nid == ACTIVE_TYPE.EVERY_DAY_RECHARGE_30 || nid == ACTIVE_TYPE.EVERY_DAY_RECHARGE_6)) {
            let flag = Game.sysActivityMgr.everyDayRechargeOpen();
            this.leftBtns[LeftBtn.EVERY_DAY_RECHARGE].active = flag;
            this.showActivityItemEft(this.leftBtns[LeftBtn.EVERY_DAY_RECHARGE] , flag);
            this.onLeftItemChanged();
        }
    }

    private onRefreshActive() {
        this.checkIronMan();
        this.checkEveryRecharge();
        this.checkSkin();
        this.showActivityEft();
    }

    private onFestivalActivityClose() {
        this.leftBtns[LeftBtn.ACTIVE_TAQING].active = false;
        this.showActivityItemEft(this.leftBtns[LeftBtn.ACTIVE_TAQING] , false);
        this.onLeftItemChanged();
    }

    private onFestivalActivityInit() {
        //节日活动
        if (Game.globalFunc.isFuncOpened(GLOBAL_FUNC.FESYIVAL_ACTIVITY) &&
            Game.globalFunc.canShowFunc(GLOBAL_FUNC.FESYIVAL_ACTIVITY) &&
            GlobalVal.openRecharge &&
            Game.festivalActivityMgr.checkFestivalActivity()) {
            this.leftBtns[LeftBtn.ACTIVE_TAQING].active = true;
            this.showActivityItemEft(this.leftBtns[LeftBtn.ACTIVE_TAQING] , true);
        } else {
            this.leftBtns[LeftBtn.ACTIVE_TAQING].active = false;
            this.showActivityItemEft(this.leftBtns[LeftBtn.ACTIVE_TAQING] , false);
        }
        this.onLeftItemChanged();
    }

    private checkIronMan() {
        //钢铁侠活动
        if (!Game.globalFunc.isFuncOpened(GLOBAL_FUNC.ACTIVITE)
            || !Game.globalFunc.canShowFunc(GLOBAL_FUNC.ACTIVITE)
            || Game.sysActivityMgr.isActivityFinished(ACTIVE_TYPE.GANGTIEXIA)
            || !GlobalVal.openRecharge) {
            this.leftBtns[LeftBtn.IRON_MAN].active = false;
        } else {
            this.leftBtns[LeftBtn.IRON_MAN].active = true;
            this.showActivityItemEft(this.leftBtns[LeftBtn.IRON_MAN] , Game.sysActivityMgr.showActivityEft(ACTIVE_TYPE.GANGTIEXIA));
        }
    }

    private checkSkin() {
        //钢铁侠活动
        if (!Game.globalFunc.isFuncOpened(GLOBAL_FUNC.ACTIVITE)
            || !Game.globalFunc.canShowFunc(GLOBAL_FUNC.ACTIVITE)
            || Game.sysActivityMgr.isActivityFinished(ACTIVE_TYPE.DISCOUNT_SKIN)
            || !GlobalVal.openRecharge) {
            this.leftBtns[LeftBtn.SKIN].active = false;
            this.showActivityItemEft(this.leftBtns[LeftBtn.SKIN] , false);
        } else {
            this.leftBtns[LeftBtn.SKIN].active = true;
            this.showActivityItemEft(this.leftBtns[LeftBtn.SKIN] , Game.sysActivityMgr.showActivityEft(ACTIVE_TYPE.DISCOUNT_SKIN));
        }

        this.onLeftItemChanged();
    }

    private checkEveryRecharge() {
        if (GlobalVal.openRecharge && Game.sysActivityMgr.everyDayRechargeOpen()) {
            this.leftBtns[LeftBtn.EVERY_DAY_RECHARGE].active = true;
            this.showActivityItemEft(this.leftBtns[LeftBtn.EVERY_DAY_RECHARGE] , Game.sysActivityMgr.showActivityEft(ACTIVE_TYPE.EVERY_DAY_RECHARGE_6));
        } else {
            this.leftBtns[LeftBtn.EVERY_DAY_RECHARGE].active = false;
            this.showActivityItemEft(this.leftBtns[LeftBtn.EVERY_DAY_RECHARGE] , false);
        }
    }

    private onRefreshNewSeviceRank() {
        if (Game.globalFunc.isFuncOpened(GLOBAL_FUNC.NEW_SEVICE_RANK) &&
            Game.newSevicerankMgr.getIsOpen(NewSeviceRankType.COMMON_WAR)) {
            this.leftBtns[LeftBtn.NEW_SEVICE_RANK].active = true;
            this._newSeviceRankStopTime = Game.newSevicerankMgr.getShopTime(NewSeviceRankType.COMMON_WAR);
        } else {
            this.leftBtns[LeftBtn.NEW_SEVICE_RANK].active = false;
        }
        this.onLeftItemChanged();
    }

    /**
     *  刷新大厅ui 
     */
    private refreshUi() {
        //this.icon.setFaceFile(Game.actorMgr.privateData.szmd5facefile);
        this.onNameChange();
        this.diamond.string = Game.actorMgr.getProp(ActorProp.ACTOR_PROP_DIAMONDS);
        let num = Game.containerMgr.getItemCount(GOODS_ID.REDPACKET);
        this.money.string = num + '';
        // this.onRefreshPower();

        let info = Game.goodsMgr.getGoodsInfo(GOODS_ID.DIAMOND);
        info && this.diaIco.setPicId(info.npacketpicid);

        info = Game.goodsMgr.getGoodsInfo(GOODS_ID.REDPACKET);
        info && this.redPacketIco.setPicId(info.npacketpicid);
    }

    private onBattlePassPrivateData2() {
        const flag = !Game.battlePassMgr.isAllBattlePass2Finished();
        if (this.leftBtns[LeftBtn.LOGIN_FUND].active != flag) {
            this.leftBtns[LeftBtn.LOGIN_FUND].active = flag;
            this.onLeftItemChanged();
        }
    }

    private onBattlePassPrivateData3() {
        const flag = !Game.battlePassMgr.isAllBattlePass3Finished();
        if (this.leftBtns[LeftBtn.BATTLE_PASS_3].active != flag) {
            this.leftBtns[LeftBtn.BATTLE_PASS_3].active = flag;
            this.onLeftItemChanged();
        }
    }
    private onBattlePassPrivateData4() {
        const flag = !Game.battlePassMgr.isAllBattlePass4Finished();
        if (this.leftBtns[LeftBtn.BATTLE_PASS_4].active != flag) {
            this.leftBtns[LeftBtn.BATTLE_PASS_4].active = flag;
            this.onLeftItemChanged();
        }
    }

    private onFirstRechargeEnd() {
        this.leftBtns[LeftBtn.FIRST_RECHARGE].active = false;
        this.showActivityItemEft(this.leftBtns[LeftBtn.FIRST_RECHARGE] , false);
        this.onLeftItemChanged();
    }

    /**
     * 刷新新手宝典按钮状态
     */
    // private refreshNoviceBtn() {
    //     this.leftBtns[LeftBtn.NOVICE].active = Game.globalFunc.isFuncOpened(GLOBAL_FUNC.NOVICE) && Game.globalFunc.canShowFunc(GLOBAL_FUNC.NOVICE) && !Game.noviceTask.isNoviceOver();
    // }

    private onNewActive(nid: number) {
        if (nid == ACTIVE_TYPE.GANGTIEXIA) {
            this.leftBtns[LeftBtn.IRON_MAN].active = true;
            this.showActivityItemEft(this.leftBtns[LeftBtn.IRON_MAN] , true);
            this.onLeftItemChanged();
        }
    }

    private onActiveClose(nid: number) {
        if (nid == ACTIVE_TYPE.GANGTIEXIA) {
            this.leftBtns[LeftBtn.IRON_MAN].active = false;
            this.showActivityItemEft(this.leftBtns[LeftBtn.IRON_MAN] , false);
            this.onLeftItemChanged();
        }
    }

    private onDiscountPrivateData() {
        this.enableUpdateTime = true;
    }

    private onMoneyChange(id: number, num: number) {
        if (id === GOODS_ID.REDPACKET) {
            this.money.string = (num) + '';
        }
    }

    private onRefreshPower() {
        //总战力
        TweenNum.to(this._curPower, Game.towerMgr.getAllUnlockTowerPower(), 0.3, Handler.create(this.setPowerValue, this), 'setPowerValue');
    }

    private setPowerValue(value: number) {
        this._curPower = value;
        this.rank.string = value.toString();
    }

    private refreshDiamond(newValue: number, oldValue: number) {
        this.diamond.string = newValue.toString();
    }

    private playBoxAnimation() {
        if (this.boxArmature) {
            this.boxArmature.playAnimation("newAnimation", 1);
        }
    }

    private onRankPrivateInit() {
        
    }

    private onCooperatePrivateInit() {

    }

    private checkOnEnterHallScene() {
        // let pvpPrivate = Game.pvpNetCtrl.getPrivateData();
        // let cooperatePrivate = Game.cooperateNetCtrl.getPrivateData();

        // if (pvpPrivate && pvpPrivate.btstate != 1 && 
        //     cooperatePrivate && cooperatePrivate.btstate != 1) {
        //     CheckPushDialogMgr.instance.checkOnEnterHallScene();
        // }
    }

    private onViewHide() {
        if (UiManager.getShowViewCount() == 0) {
            SysMgr.instance.clearTimer(Handler.create(this.onShowTipsTimer, this), true);
            SysMgr.instance.doOnce(Handler.create(this.onShowTipsTimer, this), 10000, true);
        }
    }

    private onSceneClick() {
        SysMgr.instance.clearTimer(Handler.create(this.onShowTipsTimer, this), true);
    }

    private showTipsEnd() {
        if (!this.chapterTips) return;
        SysMgr.instance.doOnce(Handler.create(this.onShowTipsTimer, this), 10000, true);
    }

    private onShowTipsTimer() {
        if (!this.chapterTips) return;
        this.chapterTips.showTip(Handler.create(this.showTipsEnd, this));
    }

    private onBookEftLoaded(res: any, path: string) {
        if (res) {
            Game.resMgr.addRef(path);
            this._bookEft = cc.instantiate(res);
            this.bookEftNode.addChild(this._bookEft);
        }
    }

    private onBookEftPlayEnd() {
        this.blockInputNode.active = false;
        this.checkPointTitle.active = true;
        this.startBgs[0].node.active = true;
        let chapterBookBtnComp = this.startBgs[0].getComponent(ChapterBookBtn);
        if (chapterBookBtnComp) {
            let bookEftComp = this._bookEft.getComponent(BookEft);
            chapterBookBtnComp.bindNode = bookEftComp.btnNode;
        }
        if (Game.sceneNetMgr.getCurWarID() == 1) {
            GameEvent.emit(EventEnum.SYSTEM_GUIDE_TRIGGER, SystemGuideTriggerType.FRIST_ENTER);
        } else if (!this._friendOpenBook) {
            GameEvent.emit(EventEnum.SYSTEM_GUIDE_TRIGGER, SystemGuideTriggerType.CLICK_BOOK);
        }

        if (this._friendOpenBook) {
            this._friendOpenBook = false;
        }

        SysMgr.instance.doOnce(Handler.create(this.onOpenBookTime, this), 14000, true);
    }

    private onChangeNameEnd(path: string) {
        if (path == EResPath.MAN_HUA) {
            UiManager.showDialog(EResPath.SET_NAME_VIEW);
            return;
        }
        if (path != EResPath.SET_NAME_VIEW) return;
        GameEvent.off(EventEnum.HIDE_DIALOG, this.onChangeNameEnd, this);
        Game.sceneNetMgr.reqEnterWar(Game.sceneNetMgr.getCurWarID());
        // this.setUINodeActive(true);
        // this.loadBook();
    }

    private onHideManhua() {
        UiManager.hideDialog(EResPath.MAN_HUA);
        GameEvent.off(EventEnum.HIDE_DIALOG, this.onChangeNameEnd, this);
        this.setUINodeActive(true);
        this.loadBook();
    }

    private onMusicStateChange(state: boolean) {
        if (state) {
            Game.soundMgr.playMusic(EResPath.MAIN_BG);
        }
    }
    /***************************************左侧按钮事件*********************************/
    /**
     * 点击头像
     */
    onTrophyClick() {
        this.onSceneClick();
        UiManager.showDialog(EResPath.TROPHY_VIEW);
    }

    /**
     * 打折屋
     */
    private onDiscountClick() {
        this.onSceneClick();
        if (!Game.globalFunc.isFuncOpened(GLOBAL_FUNC.DISCOUNT)) {
            return;
        }
        UiManager.showDialog(EResPath.DISCOUNT_VIEW);
    }

    /**
     * 月卡
     */
    private onYueKaClick() {
        this.onSceneClick();
        UiManager.showDialog(EResPath.YUE_KA_VIEW);
    }

    /**
     * 首冲
     */
    private onFirstRechargeClick() {
        this.onSceneClick();
        let data = Game.actorMgr.getFirstRechargeViewData();
        let path = Game.actorMgr.getFirstRechargeViewPath();
        if (data && path) {
            UiManager.showDialog(path, data[1]);
        }
    }

    /**
     * vip
     */
    private onVipClick() {
        this.onSceneClick();
        UiManager.showDialog(EResPath.VIP_VIEW);
    }

    /**
     * 点击新手活动
     */
    // private clickNovice() {
    //     this.onSceneClick();
    //     UiManager.showDialog(EResPath.NEWHAND_BOOK_VIEW);
    // }

    /**
     * 钢铁侠活动
     */
    private gangTieXiaClick() {
        this.onSceneClick();
        UiManager.showDialog(EResPath.ACTIVE_GANGTIEXIA_VIEW);
    }

    private onActiveHallClick() {
        UiManager.showDialog(EResPath.ACTIVE_HALL_VIEW);
    }

    private onActiveTaqingClick() {
        UiManager.showDialog(EResPath.ACTIVE_TAQING_VIEW);
    }

    private onTurnTableClick() {
        UiManager.showDialog(EResPath.TURN_TABLE);
    }

    private onLoginFundClick() {
        UiManager.showDialog(EResPath.LOGINFUND_VIEW);
    }

    private onBattlePass3Click() {
        UiManager.showDialog(EResPath.BATTLEPASS3_VIEW);
    }

    private onBattlePass4Click() {
        UiManager.showDialog(EResPath.BATTLEPASS4_VIEW);
    }

    private onCelebrationClick() {
        UiManager.showDialog(EResPath.CELEBRATION_VIEW);
    }

    private onNewSeviceRankClick() {
        UiManager.showDialog(EResPath.NEW_SEVICE_RANK_VIEW);
    }

    private onSkinClick() {
        UiManager.showDialog(EResPath.FASHION_VIEW );
    }

    /***************************************右侧按钮事件*********************************/

    /**
     * 点击设置
     */
    onSettingClick() {
        this.onSceneClick();
        //UiManager.showDialog(EResPath.SYSTEM_OPEN_VIEW , Game.globalFunc.randomOpenCfg());
        UiManager.showDialog(EResPath.SETTING_VIEW);
    }

    /**
     * 点击钻石
     */
    private onDiamondClick() {
        this.onSceneClick();

        if (!Game.globalFunc.isFuncOpened(GLOBAL_FUNC.MALL) || !Game.globalFunc.canShowFunc(GLOBAL_FUNC.MALL)) {
            let cfg = Game.globalFunc.getOpenCfg(GLOBAL_FUNC.MALL);
            SystemTipsMgr.instance.notice(`通关第${cfg.funcOpenCondition}后开启商城`);
            return;
        }

        //UiManager.showDialog(EResPath.CP_HELP_VIEW);
        UiManager.showDialog(EResPath.SHOP_VIEW, ShopIndex.DIAMOND);
    }

    /**
     * 点击红包
     */
    private onMoneyClick() {
        this.onSceneClick();
        if (!Game.globalFunc.isFuncOpened(GLOBAL_FUNC.REDPACKET)) {
            return;
        }
        UiManager.showDialog(EResPath.TEN_CARDS_VIEW);
    }

    /**
     * 点击邮箱
     */
    private onEmailClick() {
        this.onSceneClick();
        UiManager.showDialog(EResPath.EMAIL_VIEW);
    }

    /**
     * 点击兑换
     */
    private onExchangeClick() {
        this.onSceneClick();
        UiManager.showDialog(EResPath.EXCHANGE_VIEW);
    }

    /**
     * 点击好友
     */
    private onFriendClick() {
        this.onSceneClick();
        if (!Game.globalFunc.isFuncOpened(GLOBAL_FUNC.FRIEND)) {
            return;
        }
        UiManager.showDialog(EResPath.FRIEND_VIEW);
    }

    /**
     * 点击邀请
     */
    private onInvitationClick() {
        this.onSceneClick();
        UiManager.showDialog(EResPath.INVITATION_VIEW);
    }

    /***************************************底部按钮事件*********************************/

    /**
     * 点击任务
     */
    onTaskClick() {
        this.onSceneClick();
        if (!Game.globalFunc.isFuncOpened(GLOBAL_FUNC.TASK)) {
            this.showHallTip(GLOBAL_FUNC.TASK, this.bottomBtns[BottomBtn.TASK]);
            return;
        }
        UiManager.showDialog(EResPath.TASK_VIEW);
    }

    /**
     * 点击图鉴
     */
    onTuJianClick() {
        this.onSceneClick();
        if (!Game.globalFunc.isFuncOpened(GLOBAL_FUNC.TUJIAN)) {
            this.showHallTip(GLOBAL_FUNC.TUJIAN, this.bottomBtns[BottomBtn.TU_JIAN]);
            return;
        };

        UiManager.showDialog(EResPath.TUJIAN_VIEW);
    }

    /**
     * 点击商城
     */
    onShopClick() {
        this.onSceneClick();
        if (!Game.globalFunc.isFuncOpened(GLOBAL_FUNC.MALL)) {
            this.showHallTip(GLOBAL_FUNC.MALL, this.bottomBtns[BottomBtn.MALL]);
            return;
        }
        UiManager.showDialog(EResPath.SHOP_VIEW);
    }

    /**
     * 点击科技
     */
    onScienceClick() {
        this.onSceneClick();
        if (!Game.globalFunc.isFuncOpened(GLOBAL_FUNC.SCIENCE)) {
            this.showHallTip(GLOBAL_FUNC.SCIENCE, this.bottomBtns[BottomBtn.SCIENCE]);
            return;
        }
        UiManager.showDialog(EResPath.SCIENCE_VIEW);
    }

    /**
     * 点击炮塔
     */
    btnClickTowerStar() {
        this.onSceneClick();
        if (!Game.globalFunc.isFuncOpened(GLOBAL_FUNC.YONGBING)) {
            this.showHallTip(GLOBAL_FUNC.YONGBING, this.bottomBtns[BottomBtn.YONG_BING]);
            return;
        };
        let index = Game.towerMgr.getFightCanupTowerIndex(Game.towerMgr.getFightTowers());
        UiManager.showDialog(EResPath.TOWER_STAR_MAIN_VIEW, index);
    }

    onQuestionClick() {
        UiManager.showDialog(EResPath.NOTICE_WEB_VIEW, "https://www.wjx.cn/vm/tTRoAKR.aspx");
    }
    /******************************************场景按钮事件**********************************************/
    /**
     * 红包兑换界面
     */
    private onZhaoCaiMaoClick() {
        // if (WxConst.WX_APP_ID == "wx69d53126cca82260") return;
        if (!Game.globalFunc.isFuncOpened(GLOBAL_FUNC.REDPACKET)) {
            this.showHallTip(GLOBAL_FUNC.REDPACKET, this.sceneBtns[SceneBtn.REDPACKET]);
            return;
        }
        // UiManager.showDialog(EResPath.RED_PACKET_EXCHANGE_VIEW);
        UiManager.showDialog(EResPath.TEN_CARDS_VIEW);

    }

    private onEveryDayRechargeClick() {
        UiManager.showDialog(EResPath.EVERY_DAY_RECHARGE_VIEW);
    }

    /**
     * 点击对战
     */
    private onPvpClick() {
        this.onSceneClick();

        if (!Game.globalFunc.isFuncOpened(GLOBAL_FUNC.PVP)) {
            this.showHallTip(GLOBAL_FUNC.PVP, this.sceneBtns[SceneBtn.PVP]);
            return;
        }

        UiManager.showDialog(EResPath.PVP_MATCH_VIEW);
    }

    /**
     * 点击签到
     */
    private onTaiLiClick() {
        // if (!Game.globalFunc.isFuncOpened(GLOBAL_FUNC.DAILY_CP)) {
        //     this.showHallTip(GLOBAL_FUNC.DAILY_CP, this.sceneBtns[SceneBtn.SIGN]);
        //     return;
        // }
        // // if (!Game.globalFunc.isFuncOpened(GLOBAL_FUNC.CHALLENGE)) {
        // //     this.showHallTip(GLOBAL_FUNC.CHALLENGE, this.sceneBtns[SceneBtn.SIGN]);
        // //     return;
        // // }
        // UiManager.showDialog(EResPath.SHANG_JIN);

        if (!Game.globalFunc.isFuncOpened(GLOBAL_FUNC.ACTIVE_HALL)) {
            this.showHallTip(GLOBAL_FUNC.ACTIVE_HALL, this.sceneBtns[SceneBtn.SIGN]);
            return;
        }
        UiManager.showDialog(EResPath.ACTIVE_HALL_VIEW);
    }

    /**
     * 点击宝箱
     * @returns 
     */
    private clickBox() {
        this.onSceneClick();
        if (!Game.globalFunc.isFuncOpened(GLOBAL_FUNC.MALL) || !Game.globalFunc.canShowFunc(GLOBAL_FUNC.MALL)) {
            let cfg = Game.globalFunc.getOpenCfg(GLOBAL_FUNC.MALL);
            SystemTipsMgr.instance.notice(`通关第${cfg.funcOpenCondition}后开启商城`);
            return;
        }
        UiManager.showDialog(EResPath.SHOP_VIEW, ShopIndex.TREATRUE);
    }

    /**
     * 点击赏金模式
     */
    private onShangJinClick() {
       
        // if (Game.globalFunc.isFuncOpened(GLOBAL_FUNC.COOPERATE) &&
        //     Game.globalFunc.canShowFunc(GLOBAL_FUNC.COOPERATE)) {
        //     UiManager.showDialog(EResPath.COOPERATE_VIEW);
        // } else {
        //     this.showHallTip(GLOBAL_FUNC.COOPERATE, this.sceneBtns[SceneBtn.SHANG_JIN]);
        // }

        if (!Game.globalFunc.isFuncOpened(GLOBAL_FUNC.CHALLENGE)) {
            this.showHallTip(GLOBAL_FUNC.CHALLENGE, this.sceneBtns[SceneBtn.SHANG_JIN]);
            return;
        }
        UiManager.showDialog(EResPath.CHALLENGE_VIEW);
    }

    /**
     * 点击猫咪公寓
     */
    private onCatHouseClick() {
        this.onSceneClick();
        if (Game.globalFunc.isFuncOpened(GLOBAL_FUNC.COOPERATE) &&
            Game.globalFunc.canShowFunc(GLOBAL_FUNC.COOPERATE)) {
            UiManager.showDialog(EResPath.COOPERATE_VIEW);
        } else {
            this.showHallTip(GLOBAL_FUNC.COOPERATE, this.sceneBtns[SceneBtn.CAT_HOUSE]);
        }
    }

    /**
     * 开始游戏
     */
    private onStartClick() {
        // UiManager.showDialog(EResPath.NEWHAND_BOOK_VIEW);
        // GlobalVal.cacheMapPosX = null;
        // GlobalVal.cacheMapId = null;

        // if (!Game.sceneNetMgr.getChapterByWarID(Game.sceneNetMgr.getCurWarID())) {
        //     return;
        // }
        
        Game.ldGameMgr.reqEnterWar(1);
        // SceneMgr.instance.loadSceneWithTransition("Map", null, null, SceneMgr.instance.getTransition(null));
    }

    private showHallTip(systemId: number, node: cc.Node) {
        let cfg = Game.globalFunc.getOpenCfg(systemId);
        UiManager.showDialog(EResPath.ANY_TIPS_VIEW, { title: cfg.name, info: cfg.tips, node: node, level: cfg.funcOpenCondition });
        //this.hallTip.showTip(cfg.name, cfg.tips, node, cfg.funcOpenCondition);
    }

    private getBtnNode(reply: Reply , name:string) {
        let node = this.bottomBtns[BottomBtn.YONG_BING];
        if (StringUtils.isNilOrEmpty(name)) {
            name = '';
        }
        switch (name) {
            case 'tower':
                break;
            case 'mall':
                node = this.bottomBtns[BottomBtn.MALL];
                break;
            case 'diamond':
                node = this.diamondIcoNode;
                break;
            case 'science':
                node = this.bottomBtns[BottomBtn.SCIENCE];
                break;
            case 'book':
                let id = Game.sceneNetMgr.getCurWorldID();
                id = id > 1 ? id - 1 : 0;
                node = this.startBgs[id].node;
                break;
            case 'book_eft':
                //node = this.bookEftNode.childrenCount > 0 ? this.bookEftNode.children[0] : this.bookEftNode;
                node = this.bookEftNode;
                break;
            case 'sign':
                node = this.sceneBtns[SceneBtn.SIGN];
                break;
            case 'hongbaoduihuan':
                node = this.sceneBtns[SceneBtn.REDPACKET];
                break;
            case 'vip':
                node = this.leftBtns[LeftBtn.VIP];
                break;
            case 'discount':
                node = this.leftBtns[LeftBtn.DISCOUNT];
                break;
            case "pvp":
                node = this.sceneBtns[SceneBtn.PVP];
                break;
            case "cooperate":
                node = this.sceneBtns[SceneBtn.CAT_HOUSE];
                break;
        }

        reply(node);
    }

    private onGuideClick(node: cc.Node) {
        if (node == this.bookEftNode) {
            this.onStartClick();
        } else if (node == this.sceneBtns[SceneBtn.REDPACKET]) {
            this.onZhaoCaiMaoClick();
        }
    }

    private refreshStartBg() {
        let id = Game.sceneNetMgr.getCurWorldID();

        for (let i = 0, len = this.startBgs.length; i < len; i++) {
            if (id > 1 && id == i + 1) {
                this.startBgs[i].node.active = true;
            } else {
                this.startBgs[i].node.active = false;
            }
        }
    }

    private updateRechargeIcon() {
        let rechargeData = Game.actorMgr.getFirstRechargeViewData();
        if (rechargeData) {
            this.leftBtns[LeftBtn.FIRST_RECHARGE].getComponent(cc.Sprite).spriteFrame = this.gameui.getSpriteFrame("recharge_icon_" + rechargeData[0]);
        }
    }

    private _activityEftMap:Map<cc.Node , cc.Node> = new Map();
    private _activityEftPrefab:cc.Prefab = null;
    private showActivityItemEft(item:cc.Node , flag:boolean) {

        if (flag) {
            if (!this._activityEftMap.has(item)) {
                this._activityEftMap.set(item , null);
            }
        } else {

            let eftItem = this._activityEftMap.get(item);
            if (eftItem) {
                eftItem.removeFromParent();
            }

            this._activityEftMap.delete(item);
        }

        if (!this._activityEftPrefab)  {
            Game.resMgr.loadRes(EResPath.ACTIVITY_EFT , cc.Prefab , Handler.create(this.onActivityEftLoaded , this) , CacheModel.AUTO);
        }
    }

    private onActivityEftLoaded(res:cc.Prefab , path:string) {
        Game.resMgr.addRef(EResPath.ACTIVITY_EFT);
        if (!res) return;
        Game.resMgr.addRef(path);
        this._activityEftPrefab = res;
        this.showActivityEft();
    }


    private showActivityEft() {
        if (!this._activityEftPrefab) return;
        this._activityEftMap.forEach((value:cc.Node , key:cc.Node)=> {
            if (value == null) {
                
                let itemNode = cc.instantiate(this._activityEftPrefab);
                this._activityEftMap.set(key , itemNode);
                this.activityEftNode.addChild(itemNode);
                value = itemNode;
            }

            value.x = key.x + 87.5;
            value.y = key.y;
        })
    }

    private onLeftItemChanged() {
        SysMgr.instance.doFrameOnce(Handler.create(this.showActivityEft , this) ,2, true);
    }
}
