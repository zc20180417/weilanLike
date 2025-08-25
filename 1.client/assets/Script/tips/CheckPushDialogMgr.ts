import { EnterMapSceneType, GLOBAL_FUNC, GLOBAL_FUNC_NAME } from "../common/AllEnum";
import { EResPath } from "../common/EResPath";
import { EventEnum } from "../common/EventEnum";
import SceneMgr, { SCENE_NAME } from "../common/SceneMgr";
import SysMgr from "../common/SysMgr";
import Game from "../Game";
import GlobalVal from "../GlobalVal";
import { ACTIVE_HALL_TAP_INDEX, ACTIVE_HALL_ACTIVE_NAME } from "../ui/activity/ActiveHallView";
import MapPageView from "../ui/chapter/MapPageView";
import { SystemGuideTriggerType } from "../ui/guide/SystemGuideCtrl";
import { Command } from "../ui/tips/CommandsFlow";
import { GameEvent } from "../utils/GameEvent";
import { Handler } from "../utils/Handler";
import { UiManager } from "../utils/UiMgr";
const FAIL_TIPS_WARID = [10, 15, 16, 20, 23, 24];
/**
 * 关闭界面
 */
export class HideDialogCommand extends Command {
    private _path: string = null;
    constructor(path: string = "") {
        super();
        this._path = path;
    }

    start() {
        GameEvent.on(EventEnum.ON_DIALOG_HIDE, this.onDialogHide, this);
        if (this._path) {
            UiManager.hideDialog(this._path);
        } else {
            UiManager.hideAll();
        }
    }

    onDialogHide(dialogName: string) {
        if (this._path) {
            if (dialogName == UiManager.getName(this._path)) {
                GameEvent.targetOff(this);
                this.end();
            }
        } else {
            GameEvent.targetOff(this);
            this.end();
        }
    }
}

/**
 * 打开界面
 */
export class OpenDialogCommand extends Command {
    private _path: string = null;
    private _args: any = null;
    constructor(path: string, ...args) {
        super();
        this._path = path;
        this._args = args || [];
    }

    start() {
        GameEvent.on(EventEnum.AFTER_SHOW_DIALOG, this.onDialogShow, this);
        UiManager.showDialog(this._path, ...this._args);
    }

    onDialogShow(dialogName: string) {
        if (dialogName == UiManager.getName(this._path)) {
            GameEvent.targetOff(this);
            this.end();
        }
    }
}

/**
 * 加载场景
 */
export class LoadSceneCommand extends Command {
    private _sceneName: string = null;
    constructor(sceneName: string) {
        super();
        this._sceneName = sceneName;
    }

    start() {
        if (this._sceneName === cc.director.getScene().name) {
            return this.end();
        }
        GameEvent.on(EventEnum.ON_SCENE_LOAD_COMPLETE, this.onSceneLoaded, this);
        // if (this._sceneName == "CatHouse") {
        //     Game.catHouseMgr.enterHouse();
        // } else if (this._sceneName == "Map") {
        //     GlobalVal.cacheMapPosX = null;
        //     GlobalVal.cacheMapId = null;
        //     SceneMgr.instance.waitMapViewInit = true;
        //     SceneMgr.instance.loadSceneWithTransition("Map", null, null, SceneMgr.instance.getTransition(null));
        // } else {
        //     SceneMgr.instance.loadScene(this._sceneName);
        // }
    }

    onSceneLoaded(sceneName: string) {
        if (sceneName == this._sceneName) {
            GameEvent.targetOff(this);
            this.end();
        }
    }
}

/**
 * 指引点击按钮
 */
export class GuideToClickBtnCommand extends Command {
    private _btnName: string = null;
    private _btnNode: cc.Node = null;
    constructor(btnName: string) {
        super();
        this._btnName = btnName;
    }

    start() {
        this._btnNode = GameEvent.dispathReturnEvent("get_btn", this._btnName);
        if (this._btnNode) {
            SysMgr.instance.doOnce(Handler.create(this.showDialog, this), 200, true);
        } else {
            this.end();
        }
    }

    showDialog() {
        UiManager.showDialog(EResPath.GUIDE_TO_CLICK_BTN_VIEW, this._btnNode);
        this.end();
    }
}

/**
 * 系统指引
 */
export class SystemGuideCommand extends Command {
    private _triggerType: SystemGuideTriggerType = null;
    constructor(triggerType: SystemGuideTriggerType) {
        super();
        this._triggerType = triggerType;
    }

    start() {
        GameEvent.emit(EventEnum.SYSTEM_GUIDE_TRIGGER, this._triggerType);
        this.end();
    }
}

/**
 * 是否有好友
 */
export class HasFriendCommand extends Command {
    start() {
        let friends = Game.relationMgr.getFriendsData();
        let houseBtn = GameEvent.dispathReturnEvent("get_friend_btn", "cathouse");
        friends.size && houseBtn ? this.end() : this.abort();
    }
}

/**
 * 选指定关卡
 */
export class SelectCPCommand extends Command {
    private _mapId: number = null;
    private _index: number = null;
    constructor(mapId: number, index: number) {
        super();
        this._mapId = mapId;
        this._index = index;
    }

    start() {
        UiManager.showMask();
        let mapPageView: MapPageView = GameEvent.dispathReturnEvent("get_map_page_view");
        if (mapPageView.initialized) {
            this.onMapSelect(mapPageView.getIndex());
        } else {
            GameEvent.on(EventEnum.ON_MPA_PAGE_SELECT_INDEX, this.onMapSelect, this);
        }
    }

    private onMapSelect(index: number) {
        if (index + 1 !== this._mapId) {
            //选中指定章节
            GameEvent.emit(EventEnum.MAP_PAGE_SELECT_INDEX, this._mapId - 1);
        } else {
            GameEvent.off(EventEnum.ON_MPA_PAGE_SELECT_INDEX, this.onMapSelect, this);
            GameEvent.once(EventEnum.MAP_PAGE_VIEW_SCROLL_END, this.onMapEnd, this);
            GameEvent.emit(EventEnum.MAP_PAGE_ITEM_SCROLL_TO_INDEX, this._mapId, this._index);
        }
    }

    private onMapEnd() {
        UiManager.hideMask();
        this.end();
    }
}

export class CheckPushDialogMgr {

    private static _instance: CheckPushDialogMgr = null;

    static get instance(): CheckPushDialogMgr {
        if (!this._instance) {
            this._instance = new CheckPushDialogMgr();
        }
        return this._instance;
    }

    constructor() {
        GameEvent.on(EventEnum.ENTER_MAP_SCENE, this.checkOnEnterMapScene, this);
        GameEvent.on(EventEnum.DO_EXIT_MAP, this.backMapScene, this);
        GameEvent.on(EventEnum.STRENGTH_NOTENOUGH, this.strengthNotEnough, this);
    }

    /////////////////////////////////////////

    private _enterMapSceneState: EnterMapSceneType = EnterMapSceneType.Normal;

    checkOnEnterHallScene() {
        if (GlobalVal.dayInfoChecked) return;
        GlobalVal.dayInfoChecked = true;

        let dialogMap: Map<string, any> = new Map();
        //双倍充值
        if (Game.globalFunc.isFuncOpened(GLOBAL_FUNC.DOUBLE_RECHARGE)
            && Game.globalFunc.canShowFunc(GLOBAL_FUNC.DOUBLE_RECHARGE)
            && !Game.sysActivityMgr.isDoubleRechargeFinished()
            && GlobalVal.openRecharge) {
            dialogMap.set("DOUBLE_RECHARGE_VIEW", null);
        }

        //签到
        if (Game.globalFunc.isFuncOpened(GLOBAL_FUNC.SIGN)) {
            // let info = Game.signMgr.getSignInfo();
            if (!Game.signMgr.isSignToday()) {
                dialogMap.set('ACTIVE_HALL_VIEW', ACTIVE_HALL_TAP_INDEX.SIGN);
            }
        }

        //月卡
        if (Game.globalFunc.checkGlobalFuncState(GLOBAL_FUNC.YUEKA, false)
            && Game.signMgr.isBoughtYueKa()
            && !Game.signMgr.isYueKaSignedToday()) {
            dialogMap.set("YUE_KA_VIEW", null);
        }

        //首冲
        if (Game.globalFunc.checkGlobalFuncState(GLOBAL_FUNC.FIRST_RECHARGE, false)) {
            let data = Game.actorMgr.getFirstRechargeViewData();
            if (data) {
                // dialogMap.set('FIRST_RECHARGE_VIEW' + data[0], data[1]);
                dialogMap.set('FIRST_RECHARGE_VIEW0', data[1]);
            }
        }

        let i = 0;
        dialogMap.forEach((value, key) => {
            // UiManager.showDialogWithZIndex(EResPath[key], --i, value);
            UiManager.showDialog(EResPath[key], value);
        });
    }

    private backMapScene(isFail: boolean = false) {
        this._enterMapSceneState = isFail ? EnterMapSceneType.BackFail : EnterMapSceneType.Normal;
    }

    private checkOnEnterMapScene() {
        if (this._enterMapSceneState == EnterMapSceneType.Normal) return;
        if (this._enterMapSceneState == EnterMapSceneType.BackFail) {
            this.checkOnFailBack();
        } else {
            this.checkBackMapScene();
        }
        this._enterMapSceneState = EnterMapSceneType.Normal;
    }

    private checkOnFailBack() {
        // if (!GlobalVal.mindGameFaild) return;

        // if (FAIL_TIPS_WARID.indexOf(GlobalVal.curMapCfg.nwarid) !== -1
        //     && Game.globalFunc.checkGlobalFuncState(GLOBAL_FUNC.FIRST_RECHARGE, false)) {
        //     UiManager.showDialog(EResPath.FIRST_RECHARGE_VIEW);
        //     return;
        // }

        //指引充值
        CheckPushDialogMgr.instance.checkShowRechargeView();
    }

    private strengthNotEnough() {
        if (Game.globalFunc.checkGlobalFuncState(GLOBAL_FUNC.YUEKA, false)
            && !this.isDialogShowedToday(EResPath.YUE_KA_VIEW)
            && (!Game.signMgr.isBoughtYueKa() || !Game.signMgr.isYueKaSignedToday())) {
            UiManager.showDialog(EResPath.YUE_KA_VIEW);
            this.recordDialog(EResPath.YUE_KA_VIEW);
        } else {
            UiManager.showDialog(EResPath.TILI_VIEW);
        }
    }

    private checkBackMapScene() {

    }

    /**
     * 充值导购
     */
    public checkShowRechargeView() {
        if (!GlobalVal.openRecharge || (GlobalVal.curMapCfg && GlobalVal.curMapCfg.nwarid <= 19)) return;
        let path = Game.actorMgr.getFirstRechargeViewPath();
        let data = Game.actorMgr.getFirstRechargeViewData();
        if (Game.globalFunc.checkGlobalFuncState(GLOBAL_FUNC.FIRST_RECHARGE, false)
            && !this.isDialogShowedToday(path)) {
            //首冲
            UiManager.showDialog(path, data[1]);
            this.recordDialog(path);
        } else if (Game.globalFunc.checkGlobalFuncState(GLOBAL_FUNC.ACTIVITE, false)
            && !this.isDialogShowedToday(EResPath.ACTIVE_GANGTIEXIA_VIEW)) {
            //超能钢铁猫
            UiManager.showDialog(EResPath.ACTIVE_GANGTIEXIA_VIEW);
            this.recordDialog(EResPath.ACTIVE_GANGTIEXIA_VIEW);
        } else if (Game.globalFunc.checkGlobalFuncState(GLOBAL_FUNC.ACTIVE_HALL, false, ACTIVE_HALL_TAP_INDEX.DAILY_ACTIVE)
            && !this.isDialogShowedToday(EResPath.ACTIVE_HALL_VIEW)) {
            //每日特惠
            UiManager.showDialog(EResPath.ACTIVE_HALL_VIEW, ACTIVE_HALL_TAP_INDEX.DAILY_ACTIVE);
            this.recordDialog(EResPath.ACTIVE_HALL_VIEW);
        }
    }

    public recordDialog(dialogPath: string) {
        cc.sys.localStorage.setItem(dialogPath, cc.sys.now());
    }

    public isDialogShowedToday(dialogPath: string) {
        let data = cc.sys.localStorage.getItem(dialogPath);
        let result = false;
        if (data && new Date(parseInt(data)).toDateString() === new Date(cc.sys.now()).toDateString()) {
            result = true;
        }
        return result;
    }
}