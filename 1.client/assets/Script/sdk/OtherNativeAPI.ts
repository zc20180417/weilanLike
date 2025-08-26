import { EventEnum } from "../common/EventEnum";
import Game from "../Game";
import { SEND_TYPE } from "../GlobalVal";
import { GameEvent } from "../utils/GameEvent";
import { NativeAPI, SysState } from "./NativeAPI";
import Utils from "../utils/Utils";

export class OtherNativeAPI implements NativeAPI {
    BIReport(data: string) {
       
    }
    permission() {
        GameEvent.emit(EventEnum.JAVA_CALL_ON_PERMISSION_SUCC);
    }
    public userAgeView() {
        // Game.certification.reqQuery(Game.actorMgr.nactordbid, Game.actorMgr.loginKey, 0);
    }

    roleInfo(sendType: SEND_TYPE, uid: string, nickName: string, roleCreateTime: string, roleLevelMTime: string) {
        // throw new Error('Method not implemented.');
    }

    getSdkChannel(): string {
        return '2';
        //throw new Error("Method not implemented.");
    }

    switchAccount() {
        // throw new Error("Method not implemented.");
    }

    public sdkExitEnable(): boolean {
        return false;
    }

    public exit() {
        // throw new Error("Method not implemented.");
        cc.game.end();
    }

    logout() {
        // throw new Error("Method not implemented.");
        GameEvent.emit(EventEnum.JAVA_CALL_ON_LOGOUT_SUCC);
    }

    payOrder(orderInfo: string) {
        // throw new Error("Method not implemented.");
    }
    // showSkipVideo(visiable: boolean) {
    //     // throw new Error("Method not implemented.");
    // }
    showRewardAd(uid: string, orderId: string , sdkkey:string) {
        GameEvent.emit(EventEnum.JAVA_CALL_ON_REWARDAD_SUCC, orderId);
    }

    preLoadRewardAd() {
        console.log('preLoadRewardAd');
    };

    alipay(url: string) {
    }
    openWebView(url: string) {

    }

    login() {
        Game.loginMgr.loginByTourist();
    }

    getPhoneInfo(state: SysState): string {
        if (state == SysState.SYSSTATE_HDID) {
            return Utils.getDeviceID();
        }
        return "1002";
    }

    toSelectReegionalism() {

    }

    saveScreenShotImg() {

    }

    share(param: string) {

    }

    getChannel(): string {
        return "";
    }

    downLoadApk(url: string) {

    }
}