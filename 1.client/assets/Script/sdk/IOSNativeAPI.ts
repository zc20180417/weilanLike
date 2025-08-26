import Game from "../Game";
import GlobalVal, { SDK_CHANNEL, SEND_TYPE } from "../GlobalVal";
import { NativeAPI, SysState } from "./NativeAPI";

export class IOSNativeAPI implements NativeAPI {
    BIReport(data: string) {
        
    }
    permission() {
        
    }
    public userAgeView() {
        if (GlobalVal.sdkChannel === SDK_CHANNEL.CHUKONG) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "userAgeView", "()V");
        }
    }

    getSdkChannel(): string {
        return '2';
        // throw new Error("Method not implemented.");
    }
    public switchAccount() {
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "switchAccount", "()V");
    }
    public exit() {
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "exit", "()V");
    }

    public sdkExitEnable(): boolean {
        if (GlobalVal.sdkChannel === SDK_CHANNEL.CHUKONG) {
            return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "sdkExitEnable", "()Z");
        }
        return false;
    }

    logout() {
        // throw new Error("Method not implemented.");
    }
    payOrder(orderInfo: string) {
        // throw new Error("Method not implemented.");
    }
    // showSkipVideo(visiable: boolean) {
    //     // throw new Error("Method not implemented.");
    // }
    showRewardAd(uid: string, orderId: string ,sdkkey:string) {

    }

    preLoadRewardAd() { };

    openWebView(url: string) {
        jsb.reflection.callStaticMethod("AppController", "wxH5Pay:", url);
    }
    login() {
        jsb.reflection.callStaticMethod("AppController", "wxLogin");
    }
    getPhoneInfo(state: SysState): string {
        let phoneState = "default";
        switch (state) {
            case SysState.SYSSTATE_BIOSID:
                phoneState = jsb.reflection.callStaticMethod("AppController", "getBiosId");
                break;
            case SysState.SYSSTATE_CUPID:
            case SysState.SYSSTATE_MODEL:
                phoneState = jsb.reflection.callStaticMethod("AppController", "getCpuID");
                break;
            case SysState.SYSSTATE_HDID:
                phoneState = jsb.reflection.callStaticMethod("AppController", "getHDID");
                break;
            case SysState.SYSSTATE_MACADDRESS:
                phoneState = jsb.reflection.callStaticMethod("AppController", "getMacAddres");
                break;
            case SysState.SYSSTATE_OAID:
            case SysState.SYSSTATE_UUID:
                phoneState = jsb.reflection.callStaticMethod("AppController", "getUUID");
                break;
            case SysState.SYSSTATE_VERSION:
                phoneState = jsb.reflection.callStaticMethod("AppController", "getVersion");
                break;
        }
        return phoneState;
    }
    toSelectReegionalism() {
        if (cc.sys.isNative) {
            jsb.reflection.callStaticMethod("AppController", "toSelectReegionalis");
        }
    }
    saveScreenShotImg() {

    }
    share(param: string) {
        jsb.reflection.callStaticMethod("AppController", "doShare:", param);
    }
    getChannel(): string {
        return "ios";
    }

    downLoadApk(url: string) {

    }

    roleInfo(sendType: SEND_TYPE, uid: string, nickName: string, roleCreateTime: string, roleLevelMTime: string) {
        // throw new Error('Method not implemented.');
    }
}