import { BuryingPointMgr, EBuryingPoint } from "../buryingPoint/BuryingPointMgr";
import { EResPath } from "../common/EResPath";
import { EventEnum } from "../common/EventEnum";
import SceneMgr, { SCENE_NAME } from "../common/SceneMgr";
import SysMgr from "../common/SysMgr";
import Game from "../Game";
import GlobalVal, { SEND_TYPE, ServerType, XXPackageId } from "../GlobalVal";
import LoginScene from "../login/LoginScene";
import HttpControl from "../net/http/HttpControl";
import { GS_PLAZA_MSGID, SYSTEMTYPE } from "../net/socket/handler/MessageEnum";
import SocketManager from "../net/socket/SocketManager";
import { BI_TYPE } from "../sdk/CKSdkEventListener";
import { SysState } from "../sdk/NativeAPI";
import { GameEvent } from "../utils/GameEvent";
import { Handler } from "../utils/Handler";
import { LocalStorageMgr } from "../utils/LocalStorageMgr";
import SystemTipsMgr from "../utils/SystemTipsMgr";
import { UiManager } from "../utils/UiMgr";
import Utils from "../utils/Utils";
import HotUpdate from "./HotUpdate";
import LoadingScene from "./LoadingScene";
import { PreLoad } from "./PreLoad";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("Game/Loading/NewLoadingScene")
export default class NewLoadingScene extends cc.Component {

    @property(cc.Node)
    loadingNode: cc.Node = null;

    @property(cc.Node)
    loginNode: cc.Node = null;

    @property(LoadingScene)
    loadingScene: LoadingScene = null;

    @property(LoginScene)
    loginScene: LoginScene = null;

    @property(HotUpdate)
    hotUpdate: HotUpdate = null;

    @property(cc.Label)
    vLabel: cc.Label = null;

    @property(cc.Node)
    progressNode: cc.Node = null;

    // @property(cc.Node)
    // tips: cc.Node = null;

    @property(cc.Node)
    gonggao: cc.Node = null;

    static LOADING_STATE = 1;
    static LOGIN_STATE = 2;

    private _state = 1;
    private timeLimite: boolean = true;
    private resourceLoaded: boolean = false;
    private checkCertificationStatus: boolean = false;
    onLoad() {
        //第一次登录的时候
        if (GlobalVal.loginState == 0) {
            cc.macro.ENABLE_MULTI_TOUCH = false;
            document.title = "萌猫保卫战";
            // cc.log(11)
            // Game.nativeApi.getPhoneInfo(SysState.SYSSTATE_HDID) = deviceid;
            Utils.addDateFormat();
            
            //loading
            GameEvent.on(EventEnum.UPDATE_COMPLETE, this.onUpdateComplete, this);
            GameEvent.on(EventEnum.UPDATE_FAIL, this.onUpdateFail, this);
            GameEvent.on(EventEnum.REFRESH_LOADING_TIPS, this.refreshTips, this);
            GameEvent.on(EventEnum.UPDATE_PROGRESS_HOT_UPDATE, this.refreshProgress2, this);
            GameEvent.on(EventEnum.START_HOT_UPDATE, this.startHotUpdate, this);
            GameEvent.on(EventEnum.END_HOT_UPDATE, this.endHotUpdate, this);
            GameEvent.on(EventEnum.NEED_DOWN_LOAD_NEW_APP, this.doDownLoadNewApp, this);
            GameEvent.on(EventEnum.NOT_DOWN_LOAD_NEW_APP, this.notDownLoadNewApp, this);
            GameEvent.on(EventEnum.CHANGE_VERSION_NAME, this.onChangeVersion, this);
            BuryingPointMgr.postFristPoint(EBuryingPoint.SHOW_LOADING);

        } else {
            this.showLogin(false);
        }

        // this.vLabel.string = "版本号：" + GlobalVal.curVersion;
        this.onChangeVersion();
        //login
        GameEvent.on(EventEnum.LOGIN_WX_ERROR, this.onFastLoginError, this);
        GameEvent.on(EventEnum.ENTER_GAME_SUC, this.onEnterGameSuc, this);
        GameEvent.on(EventEnum.SOCKET_ON_ERROR, this.onSocketError, this);
        GameEvent.on(EventEnum.MODULE_INIT, this.onModuleInit, this);
        // GameEvent.on(EventEnum.ON_QUERY_RET, this.onQueryRet, this));
        // GameEvent.on(EventEnum.CERTIFICATION_SUCCESS, this.onCertificationRet, this));

        GameEvent.on(EventEnum.JAVA_CALL_ON_ANTI_ADDICTION_SUCC, this.onAntiAddictionSucc, this);
        GameEvent.on(EventEnum.JAVA_CALL_ON_ANTI_ADDICTION_CANCEL, this.onAntiAddictionCancel, this);

        GameEvent.on(EventEnum.ON_NOTICE_INFO, this.onNoticeInfo, this);
        GameEvent.on(EventEnum.ON_NULL_NOTICE_INFO, this.onNoticeInfo, this);
    }

    private onChangeVersion() {
        if (GlobalVal.curVersion == '3.2.1') {
            GlobalVal.curVersion = '3.2.0';
        }
        this.vLabel.string = "版本号：" + GlobalVal.curVersion;
    }

    start() {
        if (GlobalVal.loginState == 0) {
            console.log('-----------this.hotUpdate.tryStartUpdate');
            this.hotUpdate.tryStartUpdate();
        }
        GlobalVal.loginState = 1;
        Game.soundMgr.playMusic(EResPath.MAIN_BG, 3);

        this.onNoticeInfo();
        HttpControl.requestNotice();
        if (GlobalVal.serverType != ServerType.LOCAL) {
            HttpControl.checkServerInfo(Game.nativeApi.getPhoneInfo(SysState.SYSSTATE_CHANNEL_ID) , this.getSystemType());
        }
    }

    showLogin(frist: boolean = true) {
        this.enterHall();
        return;
        try {
            if (!frist || Game.actorMgr.nactordbid != 0) {
                Game.actorMgr.nactordbid = 0;
            }
    
            let showLoginFrist: boolean = LocalStorageMgr.getItem(LocalStorageMgr.SHOW_LOGIN_FRIST, false) || LocalStorageMgr.getItem('loginwx', false);
            BuryingPointMgr.showLoginFrist = showLoginFrist ? false : true;
            LocalStorageMgr.setItem(LocalStorageMgr.SHOW_LOGIN_FRIST, 1, false);
            
            this._state = NewLoadingScene.LOGIN_STATE;
            this.loadingNode.active = false;

            if (this.loginNode) {
                this.loginNode.active = true;
            }

            if (cc.sys.isNative && cc.sys.isMobile) {
                if (frist) {
                    let flag = LocalStorageMgr.getItem('confrim_xieyi', false);
                    if (GlobalVal.isChannelSubpackage() && !flag) {
                        // do
                    } else {
                        this.loginScene.toggle.isChecked = true;
                        Game.loginMgr.tryFastLogin();
                    }
                } 
            } 
            BuryingPointMgr.postFristPoint(EBuryingPoint.SHOW_LOGIN_SCENE);
        } catch (error) {
            
        }
    }

    onSettingClick() {
        UiManager.showDialog(EResPath.SETTING_VIEW);
    }

    onGongGaoClick() {
        UiManager.showDialog(EResPath.NOTICE_VIEW);
    }

    onShiLingClick() {
        UiManager.showDialog(EResPath.USER_AGREEMENT_VIEW2);
    }

    ////////////////////////////////////////////////////////////////////////

    private doDownLoadNewApp(str: string) {
        this.refreshTips(str);
        UiManager.showDialog(EResPath.DOWN_LOAD_GAME_VIEW, str);
    }

    private notDownLoadNewApp() {
        UiManager.hideDialog(EResPath.DOWN_LOAD_GAME_VIEW);
    }

    private startHotUpdate() {
        if (!this.progressNode.active) {
            this.progressNode.active = true;
        }
        LocalStorageMgr.setItem(LocalStorageMgr.HOT_UPDATA, 1, false);
        BuryingPointMgr.postFristPoint(EBuryingPoint.START_HOT_UPDATE);
    }

    private endHotUpdate() {
        BuryingPointMgr.postFristPoint(EBuryingPoint.END_HOT_UPDATE);
    }

    //loading
    private onUpdateComplete() {
        if (HotUpdate.downLoadNewApk) return;
        UiManager.hideDialog(EResPath.DOWN_LOAD_GAME_VIEW);
        this.preLoad();
        this.loadingScene.onUpdateComplete();
    }

    private onUpdateFail() {
        //this.preLoad();
        this.progressNode.active = false;
        BuryingPointMgr.postFristPoint(EBuryingPoint.FAIL_HOT_UPDATE);
    }

    private refreshTips(tips: string) {
        if (HotUpdate.downLoadNewApk) return;
        //this.progressLabel.string = tips;
        this.loadingScene.refreshTips(tips);
    }

    private refreshProgress(progress: number) {
        if (!isNaN(progress)) {
            this.loadingScene.refreshProgress(progress);
        }
    }

    private refreshProgress2(progress: number) {
        if (!isNaN(progress)) {
            this.loadingScene.refreshProgress2(progress);
        }
    }

    private preLoad() {
        PreLoad.instance.preLoad(new Handler(this.refreshProgress, this), new Handler(this.onRessouceLoaded, this));
        this.scheduleOnce(this.onTimer, 2);
    }

    private onRessouceLoaded() {
        this.resourceLoaded = true;
        !this.timeLimite && this.enterScene();
    }

    private onTimer() {
        this.timeLimite = false;
        this.resourceLoaded && this.enterScene();
    }

    private enterScene() {
        Game.init();
        this.showLogin();
        
    }

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////login

    //是否登录成功
    private _isLoginSuccess: boolean = false;
    //初始化成功的模块（收到服务器下发基础配置与基础数据的模块）
    private _initedModuleDic: any = {};
    //进游戏前必须收到服务器数据的模块数组
    private antiAddiction = 0;//实名认证
    private _initModuleList: number[] = [
        this.antiAddiction,
        GS_PLAZA_MSGID.GS_PLAZA_MSGID_STATUS,
        GS_PLAZA_MSGID.GS_PLAZA_MSGID_GOODS,
        GS_PLAZA_MSGID.GS_PLAZA_MSGID_STRENG,
        GS_PLAZA_MSGID.GS_PLAZA_MSGID_ACTOR,
        GS_PLAZA_MSGID.GS_PLAZA_MSGID_SCENE,
        GS_PLAZA_MSGID.GS_PLAZA_MSGID_TROOPS,
        GS_PLAZA_MSGID.GS_PLAZA_MSGID_MONSTERMANUAL,
    ];
    //登录成功后等待到初始化成功的等待最长时间
    private _waitTime: number = 10000;
    private _timer: Handler = new Handler(this.onTimeOut, this);
    private _time: number = 0;

    /**
     * 登录服务器成功
     */
    private onEnterGameSuc() {
        this.loginScene.setLoginSuccess(true);
        Game.initGameData();
        UiManager.hideDialog(EResPath.LOGIN_VIEW);

        // 查询实名认证信息
        // Game.nativeApi.userAgeView();
        // Game.certification.reqQuery(Game.actorMgr.nactordbid, Game.actorMgr.loginKey, 0);
        // this.checkCertification();
        // this.enterHall();
        this.onModuleInit(0);
    }

    private onTimeOut() {
        this.loginScene.setLoginSuccess(false);
        SocketManager.instance.closeConnect();
        SystemTipsMgr.instance.notice("进入游戏失败，尝试重新登录");
        Game.reconnectMgr.readyReConnect();
    }

    private enterHall() {
        SysMgr.instance.clearTimer(this._timer, true);
        cc.log("等待模块初始化耗时:" + (cc.sys.now() - this._time));
        SceneMgr.instance.loadScene(SCENE_NAME.Hall);
    }

    private reTryCount: number = 0;
    private onFastLoginError() {
        if (this._state == NewLoadingScene.LOADING_STATE) {
            this.showLogin();
        } else {
            cc.log("================onFastLoginError()");
            this.reTryCount++;
            if (this.reTryCount < 2) {
                Game.loginMgr.tryGetWxCode();
            }
        }
    }

    private onSocketError() {
        SystemTipsMgr.instance.notice("连接服务器失败,请检查网络");
        this.loginScene.setLoginSuccess(false);
        this.showLogin();
    }

    private onModuleInit(module: number) {
        this._initedModuleDic[module] = true;
        // if (!Game.certification.isCert() && GlobalVal.serverType != ServerType.LOCAL) {
        //     return;
        // }
        let len = this._initModuleList.length;
        for (let i = 0; i < len; i++) {
            if (!this._initedModuleDic[this._initModuleList[i]]) {
                return;
            }
        }

        //上报数据
        // Game.actorMgr.roleInfoChange();
        // GameEvent.emit(EventEnum.CK_ROLE_INFO_CHANGE, SEND_TYPE.LOGIN);
        GameEvent.emit(EventEnum.CK_BI_REPORT, BI_TYPE.LOGIN);
        GameEvent.emit(EventEnum.CK_BI_REPORT, BI_TYPE.ROLE_LOGIN);
        GameEvent.emit(EventEnum.CK_BI_REPORT, BI_TYPE.ROLE_LV_CHANGE);

        this.enterHall();
    }

    ///////////////////////////////////////////////
    onDestroy() {
        GameEvent.targetOff(this);
        SysMgr.instance.clearTimerByTarget(this, true);
    }

    private onAntiAddictionSucc() {
        this.onModuleInit(this.antiAddiction);
    }

    private onAntiAddictionCancel() {
        this.onModuleInit(this.antiAddiction);
    }

    private onNoticeInfo() {
        this.gonggao.active = !HttpControl.hideNotice;
    }

    private getSystemType() {
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            return SYSTEMTYPE.SYSTEMTYPE_ANDROID;
        }
        if (cc.sys.os === cc.sys.OS_IOS) {
            return SYSTEMTYPE.SYSTEMTYPE_IOS;
        }
        return SYSTEMTYPE.SYSTEMTYPE_ANDROID;
    }
}