import { EventEnum } from "../common/EventEnum";
import Game from "../Game";
import { GameEvent } from "../utils/GameEvent";
import { LocalStorageMgr } from "../utils/LocalStorageMgr";
import { StringUtils } from "../utils/StringUtils";
import Dialog from "../utils/ui/Dialog";
import GlobalVal from "../GlobalVal";
import HttpControl from "../net/http/HttpControl";
import SystemTipsMgr from "../utils/SystemTipsMgr";
import { md5 } from "../libs/encrypt/md5";

const {ccclass, property , menu} = cc._decorator;

@ccclass
@menu("Game/Login/NoticeWebView")
export class NoticeWebView extends Dialog {
    @property(cc.WebView)
    webView:cc.WebView = null;


    afterShow() {
        this.webView.node.on('error', this.onError ,  this);
    }

    setData(data:any) {
        //cc.log("");
        let self = this;
        if (!StringUtils.startsWith(data , 'http')) {
            data = 'http://' + data;
        }
        cc.log('--' , data);
        this.webView.url = data;
        this.webView.setOnJSCallback((target:any , url:string)=> {
            console.log('---------url' , url);
            LocalStorageMgr.setItem("ck_question" , 1 , true);

            let data = {
                user_id:Game.actorMgr.nactordbid,
                sign:md5(Game.actorMgr.nactordbid + GlobalVal.TOKEN_FLAG),
            }

            HttpControl.get(GlobalVal.phpUrl + 'QuestionnaireReward/index' , data , (suc:boolean , ret:any)=> {
                console.log('QuestionnaireReward:' , ret);
            } , true);


            GameEvent.emit(EventEnum.REFRESH_CK_QUESTION);
            // Game.nativeApi.openWebView(url);
            self.hide();
            SystemTipsMgr.instance.notice("提交成功,请注意在邮箱查收奖励");
        });
        this.webView.setJavascriptInterfaceScheme("https");
    }

    private onEvt(webview:cc.WebView, eventType:cc.WebView.EventType, customEventDatay:any) {
        if (eventType == cc.WebView.EventType.ERROR) {
            this.hide(true);
        }
    }

    private onError() {
        this.hide(true);
    }

    public onCloseBtnClick() {
        this.hide(false);
    }

    

}