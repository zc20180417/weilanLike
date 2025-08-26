// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import Dialog from "../utils/ui/Dialog";
const { ccclass, property } = cc._decorator;

@ccclass
export default class PrivacyAgreementView extends Dialog {
    // @property(List)
    // list: List = null;

    @property(cc.WebView)
    webView:cc.WebView = null;

    protected afterShow() {
        this.webView.url = 'http://res-cdn.ljinggame.com/privacy/mmbwz/index.html?v=' + Math.random();
    }

    protected beforeHide() {

    }

    public onCloseBtnClick() {
        this.hide(false);
    }
}
