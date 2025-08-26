import Game from "../../Game";
import Dialog from "../../utils/ui/Dialog";

const {ccclass, property , menu} = cc._decorator;

@ccclass
@menu("Game/ui/shop/H5PayDialog")
export class H5PayDialog extends Dialog {
    @property(cc.WebView)
    webView:cc.WebView = null;


    afterShow() {
        if (!cc.sys.isNative) {
            this.blackLayer.on("click", this.hide, this);
        }
        this.webView.node.on('error', this.onError ,  this);
    }

    setData(data:any) {
        //cc.log("");
        let self = this;
        this.webView.url = data;
        this.webView.setOnJSCallback((target:any , url:string)=> {
            // Game.nativeApi.openWebView(url);
            self.hide();
        });
        this.webView.setJavascriptInterfaceScheme("close");
    }

    private onEvt(webview:cc.WebView, eventType:cc.WebView.EventType, customEventDatay:any) {
        if (eventType == cc.WebView.EventType.ERROR) {
            this.hide(true);
        }
    }

    private onError() {
        this.hide(true);
    }
}