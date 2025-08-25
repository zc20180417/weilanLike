import Game from "../Game";
import { UiManager } from "../utils/UiMgr";
import { EResPath } from "../common/EResPath";
import SystemTipsMgr from "../utils/SystemTipsMgr";
import { LocalStorageMgr } from "../utils/LocalStorageMgr";
import { BuryingPointMgr, EBuryingPoint } from "../buryingPoint/BuryingPointMgr";
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("Game/Login/LoginScene")
export default class LoginScene extends cc.Component {

    @property(cc.Toggle)
    toggle: cc.Toggle = null;

    private _isLoginSuccess: boolean = false;

    onWiXinClick() {
        if (this.toggle.isChecked == false) {
            SystemTipsMgr.instance.notice('请先阅读用户协议与隐私协议');
            return;
        }
        if (this._isLoginSuccess) return;
        BuryingPointMgr.postFristPoint(EBuryingPoint.TOUCH_LOGIN);
        // Game.loginMgr.loginByWx();
        // UiManager.showDialog(EResPath.LOGIN_VIEW);
        Game.loginMgr.loginByTourist();
    }

    onQQClick() {
        if (this.toggle.isChecked == false) {
            SystemTipsMgr.instance.notice('请先阅读用户协议与隐私协议');
            return;
        }
        if (this._isLoginSuccess) return;
        //this.onEnterGameSuc();
    }

    onPhoneClick() {
        if (this.toggle.isChecked == false) {
            SystemTipsMgr.instance.notice('请先阅读用户协议与隐私协议');
            return;
        }
        if (this._isLoginSuccess) return;
        UiManager.showDialog(EResPath.LOGIN_VIEW);
    }

    onPrivacyClick() {
        if (this._isLoginSuccess) return;
        UiManager.showDialog(EResPath.PRIVACY_AGREEMENT_VIEW);
    }

    onUserAgreementClick() {
        if (this._isLoginSuccess) return;
        UiManager.showDialog(EResPath.USER_AGREEMENT_VIEW);
    }

    onLoad() {
        this.toggle.node.on("toggle", this.onTogValueChanged, this);
        // this.onTogValueChanged();
    }

    start() {
        // Game.soundMgr.playMusic(EResPath.MAIN_BG, 3);
        const flag = LocalStorageMgr.getItem('confrim_xieyi', false);
        this.toggle.isChecked = flag == 1;
        this.toggle.isChecked = true;
    }

    setLoginSuccess(flag: boolean) {
        this._isLoginSuccess = flag;
    }

    private onTogValueChanged() {
        cc.log("this.toggle.isChecked:" + (this.toggle.isChecked ? 'true' : "false"));
        if (this.toggle.isChecked) {
            BuryingPointMgr.postFristPoint(EBuryingPoint.SELECT_LOGIN_PRIVACY);
        }
        LocalStorageMgr.setItem('confrim_xieyi', this.toggle.isChecked ? 1 : 0 ,false);
    }

    onDestroy() {
        // GameEvent.targetOff(this);
        // SysMgr.instance.clearTimerByTarget(this);
    }


}
