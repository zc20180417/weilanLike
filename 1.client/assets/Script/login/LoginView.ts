import Dialog from "../utils/ui/Dialog";
import { EventEnum } from "../common/EventEnum";
import SystemTipsMgr from "../utils/SystemTipsMgr";
import Game from "../Game";
import { LocalStorageMgr } from "../utils/LocalStorageMgr";
import { GameEvent } from "../utils/GameEvent";
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("Game/Login/LoginView")
export class LoginView extends Dialog {


    @property(cc.EditBox)
    accountBox: cc.EditBox = null;
    @property(cc.EditBox)
    pswdBox: cc.EditBox = null;

    @property(cc.EditBox)
    registerAccountBox: cc.EditBox = null;

    @property(cc.EditBox)
    registerPswdBox: cc.EditBox = null;

    @property(cc.EditBox)
    codeBox: cc.EditBox = null;

    @property(cc.Node)
    loginView: cc.Node = null;

    @property(cc.Node)
    registerView: cc.Node = null;

    @property(cc.Material)
    normalMat: cc.Material = null;

    @property(cc.Material)
    grayMat: cc.Material = null;

    @property(cc.Button)
    getCodeBtn: cc.Button = null;

    @property(cc.Sprite)
    getCodeSprite: cc.Sprite = null;

    _codeTime: number = 0;
    _enableUpdateTime: boolean = false;
    private state: number = 1;

    start() {

    }

    protected beforeShow() {
        let account: string = LocalStorageMgr.getItem(LocalStorageMgr.ACCOUNT , false);
        if (account) {
            this.accountBox.string = account;
            this.pswdBox.string = LocalStorageMgr.getItem(LocalStorageMgr.PSWD , false);
        }
    }

    update(dt: number) {
        if (this._enableUpdateTime) {
            this._codeTime -= dt;
            if (this._codeTime <= 0) {
                this._codeTime = 0;
                this._enableUpdateTime = false;
                this.getCodeSprite.setMaterial(0, this.normalMat);
            }
        }
    }
    ///////////////////////////loginview

    /**点击登录 */
    private doLogin() {
        let account = this.accountBox.string;
        if (!this.checkPhone(account)) {
            SystemTipsMgr.instance.notice("请输入正确的手机号码");
            return;
        }
        Game.loginMgr.loginByAccount(account, this.pswdBox.string);
    }

    private onForgetPassworld() {

    }

    private onFastRegister() {
        this.registerView.active = true;
        this.loginView.active = false;
    }

    private onMessageLogin() {

    }
    /////////////////////////////////////registerView

    /**注册 */
    private doRegedit() {
        let account = this.registerAccountBox.string;
        if (!this.checkPhone(account)) {
            SystemTipsMgr.instance.notice("请输入正确的手机号码");
            return;
        }
        Game.loginMgr.regedit(account, this.registerPswdBox.string, this.codeBox.string);
    }

    private onGetCode() {
        if (!this.checkGetCode()) return;
        let account = this.registerAccountBox.string;
        if (!this.checkPhone(account)) {
            SystemTipsMgr.instance.notice("请输入正确的手机号码");
            return;
        }
        Game.loginMgr.reqVerificationCode(account, 0, "0");
    }

    private messageLogin() {

    }

    private closeRegisterView() {
        this.registerView.active = false;
        this.loginView.active = true;
    }

    addEvent() {
        GameEvent.on(EventEnum.REGEDIT_SUC, this.onRegeditSuc, this);
        GameEvent.on(EventEnum.VERIFICATION_SEND_RESULT, this.onVerifRet, this);
    }

    private onSocketError() {

    }

    private checkPhone(str: string): boolean {
        let num: number = Number(str);
        if (Number.isNaN(num)|| num == 0) return false;
        if (str.length != 11) return false;
        return true;
    }

    /**注册成功 */
    private onRegeditSuc() {
        this.closeRegisterView();
    }

    private onVerifRet(succ: number) {
        if (succ == 1) {
            this.getCodeSprite.setMaterial(0, this.grayMat);
            this.resetCodeTime();
        }
    }

    /**
     * 重置验证码计时器
     */
    private resetCodeTime() {
        this._codeTime = 60;
        this._enableUpdateTime = true;
    }

    /**
     * 是否允许获取验证码
     */
    private checkGetCode(): boolean {
        if (this._enableUpdateTime) {
            SystemTipsMgr.instance.notice("频繁操作，" + Math.ceil(this._codeTime) + "秒重试!");
        }
        return !this._enableUpdateTime;
    }

}