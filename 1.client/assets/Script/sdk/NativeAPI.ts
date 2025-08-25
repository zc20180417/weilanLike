import GlobalVal, { SDK_CHANNEL, SEND_TYPE } from './../GlobalVal';

import { EventEnum } from "../common/EventEnum";
import { GameEvent } from "../utils/GameEvent";
import SystemTipsMgr from '../utils/SystemTipsMgr';
import { BuryingPointMgr, EBuryingPoint } from '../buryingPoint/BuryingPointMgr';
import { LocalStorageMgr } from '../utils/LocalStorageMgr';

export enum SysState {
    SYSSTATE_MACADDRESS = 0,
    SYSSTATE_BIOSID = 1,
    SYSSTATE_CUPID = 2,
    SYSSTATE_HDID = 3,
    SYSSTATE_VERSION = 4,
    SYSSTATE_MODEL = 5,
    SYSSTATE_UUID = 6,
    SYSSTATE_OAID = 7,
    SYSSTATE_IP = 8,
    SYSSTATE_UA = 9,

    SYSSTATE_GAME_ID = 10,//游戏id
    SYSSTATE_CHANNEL_ID = 11,//sdk渠道id
    SYSSTATE_CPSID = 12,//子渠道id
    SYSSTATE_REGIONALID = 13,//大区id
    SYSSTATE_OS = 14,//操作系统
}

function getChannel(channel: string) {
    let channelName;
    switch (channel) {
        case SDK_CHANNEL.MI_GAME:
            channelName = "麦游";
            break;
        case SDK_CHANNEL.XIAN_XIAN:
            channelName = "闲闲";
            break;
        case SDK_CHANNEL.CHUKONG:
            channelName = "触控";
            break;
        default:
            channelName = "";
    }
    return channelName;
}

/**
 * 原生接口回调消息
 */
export enum NATIVE_MESSAGE {
    ON_LOGIN_SUCC = "onLoginSuccess",               //登录成功
    ON_LOGIN_FAIL = "onLoginFail",                  //登录失败
    ON_LOGIN_CANCEL = "onLoginCancel",              //登录取消   

    ON_SHARE_SUCC = "onShareComplete",              //分享成功
    ON_SHARE_FAIL = "onShareFail",                  //分享失败
    ON_SHARE_CANCEL = "onShareCancel",              //分享取消

    ON_PAY_SUCC = "onPaySuccess",                   //支付成功
    ON_PAY_FAIL = "onPayFail",                      //支付失败

    ON_REEGIONALISM_RET = "reegionalismReturn",     //选择地址返回

    ON_SAVE_IMG_SUCC = "saveImgSuccess",            //保存图片成功

    ON_GET_DEVICE_ID = "onGetDeviceId",             //获取设备信息

    ON_UPDATE_APK_PROGRESS = "updateApkProgress",   //更新apk更新进度

    ON_ANTI_ADDICTION_SUCC = "onAntiAddictionSucc",   //成年                   
    ON_ANTI_ADDICTION_CANCEL = "onAntiAddictionCancel",//未成年 
    ON_ANTI_ADDICTION_FAIL = "onAntiAddictionFail",     //未知

    ON_LOGOUT_SUCC = "onLogoutSucc",                  //登出成功
    ON_LOGOUT_FAIL = "onLogoutFail",                  //登出失败

    ON_EXIT_SUCC = "onExitSucc",                      //退出成功
    ON_EXIT_FAIL = "onExitFail",                      //退出失败

    ON_REWARDAD_SUCC = "onRewardADSucc",                 //激励视频奖励回调       
    ON_REWARDAD_FAIL = "onRewardADFail",                 //激励视频奖励回调       
    ON_REWARDAD_CLOSE = 'onRewardADClose',               //激励视频关闭

    ON_PERMISSION_SUCC = "onPermissionSucc",              //sdk授权成功
    ON_PERMISSION_FAIL = "onPermissionFail",              //sdk授权失败

    ON_SDK_INIT_SUCC = "onSdkInitSucc",                        //sdk初始化成功
    ON_SDK_INIT_FAIL = "onSdkInitFail",                        //sdk初始化失败
    ON_SDK_ADS_INIT_FAIL = "onAdsSdkInitFail",                 //视频sdk初始化失败
    ON_ADS_SDK_INIT_SUCC = "onAdsSdkInitSucc",                 //视频sdk初始化成功
}

/**
 * 原生接口回调nativeCallbacks
 */
let nc = window["NC"] = {};

nc[NATIVE_MESSAGE.ON_LOGIN_SUCC] = function (channel, ...args) {
    cc.log("登录成功 ", "sdk渠道: ", getChannel(channel), "参数：", args.toString());
    GameEvent.emit(EventEnum.JAVA_CALL_LOGIN_SUCCESS, channel, ...args);
}

nc[NATIVE_MESSAGE.ON_LOGIN_FAIL] = function (channel, ...args) {
    cc.log("登录失败 ", "sdk渠道: ", getChannel(channel), "参数：", args.toString());
    GameEvent.emit(EventEnum.JAVA_CALL_LOGIN_FAIL, channel, ...args);
}

nc[NATIVE_MESSAGE.ON_LOGIN_CANCEL] = function (channel, ...args) {
    cc.log("登录取消 ", "sdk渠道: ", getChannel(channel), "参数：", args.toString());
    GameEvent.emit(EventEnum.JAVA_CALL_LOGIN_CANCEL, channel, ...args);
}

nc[NATIVE_MESSAGE.ON_SHARE_SUCC] = function (channel, ...args) {
    cc.log("分享成功 ", "sdk渠道: ", getChannel(channel), "参数：", args.toString());
    GameEvent.emit(EventEnum.JAVA_CALL_SHARE_SUCCESS, channel, ...args);
}

nc[NATIVE_MESSAGE.ON_SHARE_FAIL] = function (channel, ...args) {
    cc.log("分享失败 ", "sdk渠道: ", getChannel(channel), "参数：", args.toString());
    GameEvent.emit(EventEnum.JAVA_CALL_SHARE_FAIL, channel, ...args);
}

nc[NATIVE_MESSAGE.ON_SHARE_CANCEL] = function (channel, ...args) {
    cc.log("分享取消 ", "sdk渠道: ", getChannel(channel), "参数：", args.toString());
    GameEvent.emit(EventEnum.JAVA_CALL_SHARE_FAIL, channel, ...args);
}

nc[NATIVE_MESSAGE.ON_PAY_SUCC] = function (channel, ...args) {
    cc.log("支付成功 ", "sdk渠道: ", getChannel(channel), "参数：", args.toString());
    GameEvent.emit(EventEnum.JAVA_CALL_PAY_SUCCESS, channel, ...args);
}

nc[NATIVE_MESSAGE.ON_PAY_FAIL] = function (channel, ...args) {
    cc.log("支付失败 ", "sdk渠道: ", getChannel(channel), "参数：", args.toString());
    GameEvent.emit(EventEnum.JAVA_CALL_PAY_FAIL, channel, ...args);
}

nc[NATIVE_MESSAGE.ON_REEGIONALISM_RET] = function (channel, ...args) {
    cc.log("选择地址 ", "sdk渠道: ", getChannel(channel), "参数：", args.toString());
    GameEvent.emit(EventEnum.JAVA_REEGIONALISM_RETURN, args[0], args[1], args[2], args[3]);
}

nc[NATIVE_MESSAGE.ON_SAVE_IMG_SUCC] = function (channel, ...args) {
    cc.log("保存图片成功 ", "sdk渠道: ", getChannel(channel), "参数：", args.toString());
    GameEvent.emit(EventEnum.JAVA_CALL_SAVE_IMG_SUCCESS, args[0]);
}

nc[NATIVE_MESSAGE.ON_GET_DEVICE_ID] = function (channel, ...args) {
    cc.log("获取设备信息 ", "sdk渠道: ", getChannel(channel), "参数：", args.toString());
    GameEvent.emit(EventEnum.JAVA_CALL_ON_GET_DEVICEID, args[0]);
}

/**
 * 更新apk更新进度
 * @param progress 
 */
nc[NATIVE_MESSAGE.ON_UPDATE_APK_PROGRESS] = function (channel, ...args) {
    cc.log("更新apk更新进度 ", "sdk渠道: ", getChannel(channel), "参数：", args.toString());
    GameEvent.emit(EventEnum.UPDATE_APK_PROGRESS, args[0]);
}

nc[NATIVE_MESSAGE.ON_ANTI_ADDICTION_SUCC] = function (channel, ...args) {
    cc.log("成年 ", "sdk渠道: ", getChannel(channel), "参数：", args.toString());
    GameEvent.emit(EventEnum.JAVA_CALL_ON_ANTI_ADDICTION_SUCC, args[0]);
}
nc[NATIVE_MESSAGE.ON_ANTI_ADDICTION_CANCEL] = function (channel, ...args) {
    cc.log("未成年 ", "sdk渠道: ", getChannel(channel), "参数：", args.toString());
    GameEvent.emit(EventEnum.JAVA_CALL_ON_ANTI_ADDICTION_CANCEL, args[0]);
}
nc[NATIVE_MESSAGE.ON_ANTI_ADDICTION_FAIL] = function (channel, ...args) {
    cc.log("未知 ", "sdk渠道: ", getChannel(channel), "参数：", args.toString());
    GameEvent.emit(EventEnum.JAVA_CALL_ON_ANTI_ADDICTION_FAIL, args[0]);
}

nc[NATIVE_MESSAGE.ON_LOGOUT_SUCC] = function (channel, ...args) {
    cc.log("登出成功 ", "sdk渠道: ", getChannel(channel), "参数：", args.toString());
    GameEvent.emit(EventEnum.JAVA_CALL_ON_LOGOUT_SUCC, args[0]);
}
nc[NATIVE_MESSAGE.ON_LOGOUT_FAIL] = function (channel, ...args) {
    cc.log("登出失败 ", "sdk渠道: ", getChannel(channel), "参数：", args.toString());
    GameEvent.emit(EventEnum.JAVA_CALL_ON_LOGOUT_FAIL, args[0]);
}
nc[NATIVE_MESSAGE.ON_REWARDAD_SUCC] = function (channel, ...args) {
    console.log("激励视频奖励成功 ", "sdk渠道: ", getChannel(channel), "参数：", args.toString());
    GameEvent.emit(EventEnum.JAVA_CALL_ON_REWARDAD_SUCC, args[0]);
}

nc[NATIVE_MESSAGE.ON_REWARDAD_FAIL] = function (channel, ...args) {
    console.log("激励视频奖励失败 ", "sdk渠道: ", getChannel(channel), "参数：", args.toString());
    GameEvent.emit(EventEnum.JAVA_CALL_ON_REWARDAD_FAIL, args[0]);
}
nc[NATIVE_MESSAGE.ON_REWARDAD_CLOSE] = function (channel, ...args) {
    console.log("激励视频奖励关闭 ", "sdk渠道: ", getChannel(channel), "参数：", args.toString());
    GameEvent.emit(EventEnum.JAVA_CALL_ON_REWARDAD_CLOSE);
}

nc[NATIVE_MESSAGE.ON_PERMISSION_SUCC] = function (channel, ...args) {
    console.log("授权成功 ", "sdk渠道: ", getChannel(channel), "参数：", args.toString());
    BuryingPointMgr.postFristPoint(EBuryingPoint.PERMISSION_SUC);
    GameEvent.emit(EventEnum.JAVA_CALL_ON_PERMISSION_SUCC, args[0]);
}
nc[NATIVE_MESSAGE.ON_PERMISSION_FAIL] = function (channel, ...args) {
    console.log("授权失败 ", "sdk渠道: ", getChannel(channel), "参数：", args.toString());
    BuryingPointMgr.postFristPoint(EBuryingPoint.PERMISSION_FAIL);
    GameEvent.emit(EventEnum.JAVA_CALL_ON_PERMISSION_FAIL, args[0]);
}

nc[NATIVE_MESSAGE.ON_SDK_INIT_SUCC] = function (channel, ...args) {
    console.log("sdk初始化成功 ", "sdk渠道: ", getChannel(channel), "参数：", args.toString());
    BuryingPointMgr.postFristPoint(EBuryingPoint.INIT_SDK_SUC);
    GameEvent.emit(EventEnum.JAVA_CALL_ON_SDK_INIT_SUCC, args[0]);
}
nc[NATIVE_MESSAGE.ON_SDK_INIT_FAIL] = function (channel, ...args) {
    console.log("sdk初始化失败 ", "sdk渠道: ", getChannel(channel), "参数：", args.toString());
    SystemTipsMgr.instance.showSysTip2("sdk初始化失败，请检查网络退出后重试");
    BuryingPointMgr.postFristPoint(EBuryingPoint.INIT_SDK_FAIL);
    GameEvent.emit(EventEnum.JAVA_CALL_ON_SDK_INIT_FAIL, args[0]);
}
nc[NATIVE_MESSAGE.ON_SDK_ADS_INIT_FAIL] = function (channel, ...args) {
    LocalStorageMgr.setItem(LocalStorageMgr.CLOSE_VIDEO , 1);
    GlobalVal.closeAwardVideo = true;
}
nc[NATIVE_MESSAGE.ON_ADS_SDK_INIT_SUCC] = function (channel, ...args) {
    LocalStorageMgr.setItem(LocalStorageMgr.CLOSE_VIDEO , 0);
    GlobalVal.closeAwardVideo = false;
}

/******************************************************原生平台接口******************************************************/
export interface NativeAPI {

    /**
     * 显示激励广告
     * @param uid string
     * @param orderId string
     * @param posId 广告位id
     */
    showRewardAd(uid: string, orderId: string , sdkkey:string);

    /**
     * 打开网页
     * @param url string
     */
    openWebView(url: string);

    /**
     * 登录
     */
    login();

    /**
     * 退出登录
     */
    logout();

    /**
     * 切换账号
     */
    switchAccount();

    /**
     * 退出
     */
    exit();

    sdkExitEnable(): boolean;

    /**
     * 获取手机的一些基本信息
     * @param state 
     */
    getPhoneInfo(state: SysState): string;

    /**
     * 选择地址
     */
    toSelectReegionalism();

    /**
     * 保存图片
     */
    saveScreenShotImg();

    /**
     * 分享
     * @param param string
     */
    share(param: string);

    /**
     * 获取渠道号
     */
    getChannel(): string;


    /**
     * 下载apk
     * @param url 
     */
    downLoadApk(url: string);

    /**
     * 支付订单
     * @param orderInfo 
     */
    payOrder(orderInfo: string);

    /**
     * 获取sdk渠道
     */
    getSdkChannel(): string;

    /**
     * 触控上报角色信息
     * @param sendType 
     * @param uid 
     * @param nickName 
     * @param roleCreateTime 角色创建时间，单位（秒） 长度：10
     * @param roleLevelMTime 角色等级变化时间，单位（秒）长度：10
     */
    roleInfo(sendType: SEND_TYPE, uid: string, nickName: string, roleCreateTime: string, roleLevelMTime: string);

    /**
     * 触控实名认证
     */
    userAgeView();

    /**
     * 申请权限
     */
    permission();

    /**
     * 数据上报
     */
    BIReport(data: string);

    preLoadRewardAd();
}
