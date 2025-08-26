import SysMgr from "../common/SysMgr";
import Game from "../Game";
import GlobalVal, { SDK_CHANNEL, SEND_TYPE } from "../GlobalVal";
import HttpControl from "../net/http/HttpControl";
import LoadingTips from "../ui/tips/LoadingTips";
import { Handler } from "../utils/Handler";
import { StringUtils } from "../utils/StringUtils";
import { NativeAPI, SysState } from "./NativeAPI";

export class AndroidNativeAPI implements NativeAPI {

    static AD_POS_ID:string = "102160501";

    BIReport(data: any) {
        if (GlobalVal.sdkChannel === SDK_CHANNEL.CHUKONG) {
            HttpControl.post(GlobalVal.CK_BI_REPORT_URL1, data, null);
        }
    }
    permission() {
        if (GlobalVal.sdkChannel === SDK_CHANNEL.CHUKONG) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "checkPermission", "()V");
        }
    }
    public userAgeView() {
        if (GlobalVal.sdkChannel === SDK_CHANNEL.CHUKONG) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "userAgeView", "()V");
        }
    }

    public getSdkChannel(): string {
        console.log('---------getSdkChannel---------');
        return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getSdkChannel", "()Ljava/lang/String;");
    }
    public switchAccount() {
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "switchAccount", "()V");
    }
    public exit() {
        if (this.sdkExitEnable()) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "exit", "()V");
        } else {
            cc.game.end();
        }
    }
    public sdkExitEnable(): boolean {
        if (GlobalVal.sdkChannel === SDK_CHANNEL.CHUKONG) {
            return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "sdkExitEnable", "()Z");
        }
        return false;
    }

    public logout() {
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "logout", "()V");
    }
    public payOrder(orderInfo: string) {
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "payOrder", "(Ljava/lang/String;)V", orderInfo);
    }

    public showRewardAd(uid: string, orderId: string , sdkkey:string ) {
        console.log("GlobalVal.closeAwardVideo ", GlobalVal.closeAwardVideo ? "true" : "false" , orderId , sdkkey );
        sdkkey = StringUtils.trim(sdkkey);
        if (cc.sys.isNative && !GlobalVal.closeAwardVideo) {
            LoadingTips.showLoadingTips('showRewardAd');
            SysMgr.instance.doOnce(Handler.create(this.hideLoadingTips, this), 12000, true);
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showRewardAd", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", uid, orderId , sdkkey);
        }
    }

    preLoadRewardAd() {
        console.log("preLoadRewardAd " );
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "preLoadRewardAd", "(Ljava/lang/String;Ljava/lang/String;)V", Game.actorMgr.nactordbid , AndroidNativeAPI.AD_POS_ID);
    }

    public openWebView(url: string) {
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JsToJavaBridge", "openWebView", "(Ljava/lang/String;)V", url);
    }

    login() {
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "ThirdPartyLogin", "(Ljava/lang/String;)V", "1");
    }

    

    getPhoneInfo(state: SysState): string {
        if (cc.sys.isNative) {
            let result = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "GetSysInfo", "(I)Ljava/lang/String;", state);
            console.log('getPhoneInfo:', SysState[state], result);
            return result;
        }
        return '1002';
    }

    toSelectReegionalism() {
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "ToSelectReegionalism", "()V");
    }

    saveScreenShotImg() {
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "SaveScreenShotImage", "()V");
    }

    share(param: string) {
        // if (cc.sys.isNative) {
        //     jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "ThirdPartyShare", "(Ljava/lang/String;)V", param);
        // }
    }

    getChannel(): string {
        let channel = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "GetChannel", "()Ljava/lang/String;");
        console.log("--------getChannel:", channel);
        return channel || 'test';
    }

    downLoadApk(url: string) {
        if (!url) return cc.log("apk url 为空！");
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "downloadApk", "(Ljava/lang/String;)V", url);
    }

    private hideLoadingTips() {
        LoadingTips.hideLoadingTips('showRewardAd');
    }

    public roleInfo(sendType: SEND_TYPE, uid: string, nickName: string, roleCreateTime: string, roleLevelMTime: string) {
        if (GlobalVal.sdkChannel === SDK_CHANNEL.CHUKONG) {
            let roleInfo = {
                sendType: sendType,
                uid: uid,
                nickName: nickName,
                roleCreateTime: roleCreateTime,
                roleLevelMTime: roleLevelMTime,
            }
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "roleInfo", "(Ljava/lang/String;)V", JSON.stringify(roleInfo));
        }
    }
}