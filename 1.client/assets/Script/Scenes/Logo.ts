

import { BuryingPointMgr, EBuryingPoint } from "../buryingPoint/BuryingPointMgr";
import { EventEnum } from "../common/EventEnum";
import SceneMgr from "../common/SceneMgr";
import Game from "../Game";
import GlobalVal, { XXPackageId } from "../GlobalVal";
import { GameEvent } from "../utils/GameEvent";
import { LocalStorageMgr } from "../utils/LocalStorageMgr";
import Utils from "../utils/Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Logo extends cc.Component {
    @property(cc.Node)
    bg: cc.Node = null;

    @property(cc.Node)
    healthTips: cc.Node = null;

    @property(cc.Node)
    logo: cc.Node = null;

    @property(cc.Node)
    logoTaptap: cc.Node = null;

    @property(cc.Node)
    logoXX: cc.Node = null;

    @property(cc.Node)
    logoBilibili: cc.Node = null;



    private _initSdkEnd:boolean = false;
    private _showLogoEnd:boolean = false;

    start() {
        cc.view.setOrientation(cc.macro.ORIENTATION_PORTRAIT);
        if (window['_game_res_version']) {
            console.log('_game_res_version', window['_game_res_version']);
            GlobalVal.packageVersionName = window['_game_res_version'];
        }

        

        GlobalVal.deviceid = Utils.getDeviceID();
        GlobalVal.initUrl();
        Game.baseInit();
        Game.fitMgr.fitCanvas();
        GlobalVal.channel = Game.nativeApi.getChannel();
        GlobalVal.sdkChannel = Game.nativeApi.getSdkChannel();
        console.log('---------getSdkChannel---------:' , GlobalVal.sdkChannel);
        GameEvent.on(EventEnum.JAVA_CALL_ON_SDK_INIT_SUCC, this.onSdkInitEnd, this);
        this.showLogo();
    }

    showLogo() {
        let hotUpdate = LocalStorageMgr.getItem(LocalStorageMgr.HOT_UPDATA, false);
        if (hotUpdate && parseInt(hotUpdate) == 1) {
            LocalStorageMgr.setItem(LocalStorageMgr.HOT_UPDATA, 0 , false);
            this._showLogoEnd = true;
            this._initSdkEnd = true;
            if (LocalStorageMgr.getItem(LocalStorageMgr.CLOSE_VIDEO)) {
                GlobalVal.closeAwardVideo = true;
            }
            this.tryShowLoading();
            return;
        }

        let launchAppFrist: boolean = LocalStorageMgr.getItem(LocalStorageMgr.LAUNCH_APP_FRIST, false) || LocalStorageMgr.getItem('loginwx', false);
        BuryingPointMgr.launchAppFrist = launchAppFrist ? false : true;
        LocalStorageMgr.setItem(LocalStorageMgr.LAUNCH_APP_FRIST, 1, false);

        BuryingPointMgr.postFristPoint(EBuryingPoint.GAME_START);
        this.tryShowTip();
    }

    private showSubChannelLogo(subLogo: cc.Node) {
        subLogo.active = true;
        this.bg.opacity = 255;
        cc.tween(subLogo).to(1.5, { opacity: 255 }).delay(1.5).to(1, { opacity: 0 }).call(() => {
            this.showHealthTips();
        }).start();
    }

    showHealthTips() {
        /*
        this.bg.opacity = 255;
        cc.tween(this.bg).to(1.5, { opacity: 255 }).delay(1.5).to(1, { opacity: 0 }).start();
        cc.tween(this.healthTips).to(1.5, { opacity: 255 }).delay(1.5).to(1, { opacity: 0 }).call(() => {
            this._showLogoEnd = true;
            this.tryShowLoading();
        }).start();
        */
        this._showLogoEnd = true;
        this.tryShowLoading();
    }

    private tryShowTip() {
        // if (cc.sys.isNative && cc.sys.platform == cc.sys.ANDROID) {
        //     BuryingPointMgr.postFristPoint(EBuryingPoint.PERMISSION);
        //     Game.nativeApi.permission();
        // } else {
        //     this.onSdkInitEnd();
        // }

        this.onSdkInitEnd();
    }

    private onConfirm() {
        LocalStorageMgr.setItem('confrim_yinsi', 1, false);
        BuryingPointMgr.postFristPoint(EBuryingPoint.PERMISSION);
        Game.nativeApi.permission();
    }

    private onSdkInitEnd() {
        this._initSdkEnd = true;
        if (this._showLogoEnd) {
            this.tryShowLoading();
            return;
        }
        
        cc.tween(this.bg).delay(1.5).to(1, { opacity: 0 }).start();
        cc.tween(this.logo).delay(1.5).to(1, { opacity: 0 }).call(() => {
            this.showHealthTips();
        }).start();
    }

    private tryShowLoading() {
        if (!this._initSdkEnd || !this._showLogoEnd) return;
        SceneMgr.instance.loadScene("Loading");
    }

    onDestroy() {
        GameEvent.targetOff(this);
    }
}
