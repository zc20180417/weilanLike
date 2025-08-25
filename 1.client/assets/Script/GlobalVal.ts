
import { Rect } from "./utils/MathUtils";
import { StringUtils } from "./utils/StringUtils"
import { GS_SceneOpenWar } from "./net/proto/DMSG_Plaza_Sub_Scene";
import { GameFailTipsItemType } from "./common/AllEnum";
import { MissionMainConfig } from "./common/ConfigInterface";

export enum ServerType {
    /**内网 */
    LOCAL,
    /**taptap */
    TAPTAP,
    /**外网 */
    GLOBAL,
    /**闲闲 */
    XX,
    SQ,
    //触控
    CK,
    //触控测试服
    CK_TEST,
    //触控ios提审服
    CK_IOS_TEST,
    //传趣
    CQ,
}

export enum XXPackageId {
    mmy = '91051', //迷你守卫队-摸摸鱼 
    xiaomi = '91049', //迷你守卫队-小米 
    bilibili = '91048', //迷你守卫队-B站 
    huawei = '91026', //迷你守卫队-华为 
    vivo = '91025', //迷你守卫队-vivo 
    oppo = '90976', //迷你守卫队-oppo 
}

export const SDK_CHANNEL = {
    MI_GAME: "1",//麦游
    XIAN_XIAN: "2",//闲闲
    CHUKONG: "3",//触控
    CHUAN_QU: "4"//传趣
}

/**
 * 数据上报类型
 */
export enum SEND_TYPE {
    ROLE_INFO_CHANGE = "0",        //角色信息改变
    LOGIN = "1",                   //登录
    CREATE_ROLE = "2",             //创建角色
}

export default class GlobalVal {
    static GAME_NAME: string = "CatStarTD";
    static DEFAULT_MODULE_NAME: string = "com.mx.catstartd."
    static LOGIN_TYPE: string = "";
    static GRID_SIZE: number = 75;
    static HALF_GRID_SIZE: number = 32.5;
    static GRID_RATE: number = 0.1;
    static MAP_TOTAL_LIFE: number = 10;
    static GRID_ROW: number = 13;
    static GRID_COL: number = 7;

    static RECHARGE_URE: string = "UserRecharge/recharge";

    static REAL_NAME_AUTH_RUL: string = "http://sh-api.maostar.cn/VerifyRealnames";
    // static REAL_NAME_AUTH_RUL: string = "http://sh-api.maostar.cn/VerifyRealname";
    static QUARY_URL: string = "http://sh-api.maostar.cn/VerifyRealnames/query";
    static RECORD_URL: string = "http://sh-api.maostar.cn/VerifyRealname/record";
    /**验证码接口 */
    static CODE_URL: string = "http://mxhd.f3322.net:8002/Public/smsverify";
    static PAY_URL: string = "http://mxhd.f3322.net:8002/Fictitious/clientPay";
    static PAY_ORDER_URL: string = "";
    static FEEDBACK_URL: string = "http://mxhd.f3322.net:8002/Public/uploadFeedback";
    public static FRAME_TIME_SDT = 0.0166;
    public static FRAME_TIME_MDT = 16.6;
    static dontLoadRes:boolean = false;
    /** 
     * 麦游微信登录
     * 类型：get
     * 参数：
     *      merchant_id:商户id 
     *      unionid:微信原始unionid 
     *      code:校验码 
     *      sign:签名md5(merchant_id+unionid+code)
     *      clienttype:客户端类型
     *      channel:渠道
    /** 
     * 微信登录
     * 类型：get
     * 参数：merchant_id:商户id unionid:微信原始unionid code:校验码 sign:签名md5(merchant_id+unionid+code)    
     */
    private static WECHAT_LOGIN_METHOD_URL = "SdkWeixin/requestSDK";
    public static WECHAT_LOGIN_URL: string = "";


    /**
     * 触控登录接口
     */
    public static CK_LOGIN_URL: string = "";
    /** 
     * 闲闲微信登录
     * 类型：get
     * 参数：
     *      uid:闲闲返回用户ID
     *      token:闲闲返回的token
     *      device_id:我们自己的拿的设备码
     *      gametype:游戏类型ID（不发默认为1）
     *      clienttype:客户端类型
     *      channel:渠道 
     */
    private static XX_WECHAT_LOGIN_METHOD_URL = "XxSdkWeixin/requestSDK";
    public static XX_WECHAT_LOGIN_URL: string = "";

    /**
     * 西柚订单信息 
     * 类型：post
     * 参数：order:订单号 sign:令牌
     */
    private static ORDER_INFO_METHOD_URL: string = "SdkOrderInfo/query";
    public static ORDER_INFO_URL: string = "";

    /**
     * 闲闲订单信息 
     * 类型：post
     * 参数：order:订单号 sign:令牌
     */
    private static XX_ORDER_INFO_METHOD_URL: string = "XxSdkOrderInfo/query";
    public static XX_ORDER_INFO_URL: string = "";

    /**
     * 触控订单信息
     */
    public static CK_ORDER_INFO_URL: string = "";

    /**
     * 触控信息上报
     */
    public static CK_BI_REPORT_URL1: string = "";
    public static CK_BI_REPORT_URL2: string = "";

    public static CQ_LOGIN_URL: string = "AnecdoteLogin/login";

    /**微信H5支付 */
    static WECHAT_H5_PAY_URL: string = "http://mxhd.f3322.net:8002/Wx/h5pay";
    /**微信app支付 */
    static WECHAT_APP_PAY_URL: string = "http://mxhd.f3322.net:8002/WxApp/getPrePayOrder";
    /**视频回调 */
    static FREE_VIDEO_CALLBACK: string = "http://sh-api.maostar.cn/Pangolin/notify";
    /**埋点 */
    static BURYING_POINT_URL: string = "http://mxhd.f3322.net:8002/BurySpot/index";
    /**新增埋点接口（虑重） */
    static BURYING_POINT_URL2: string = "FlowPath/index";
    /**ico地址 */
    static IMAGE_LOADER_DIR: string = '';
    /**头像地址 */
    static HEAD_URL: string = "http://mxhd.f3322.net:8002/Static/upload/image/icon/feedback/";
    /** */
    static WAP_PAY: string = "http://mxhd.f3322.net:8002/Wappay/index";
    /**公告 */
    static NOTICE_URL: string = "http://mxhd.f3322.net:8002/Notice/notice";

    static QRCODE_URL: string = "WxShare/qrcode";

    /**获取全部分享任务*/
    static SHARE_TASK_CONFIG: string = "http://mxhd.f3322.net:8002/ShareTask/wholeTsak";
    /**获取任务状态*/
    static SHARE_TASK_STATE: string = "http://mxhd.f3322.net:8002/ShareTask/tsakStatus";
    /**每日分享钻石领取 */
    static SHARE_GET_AWARD: string = "http://mxhd.f3322.net:8002/ShareTask/shareSuccessReward";
    /**领取分享任务奖励 */
    static SHARE_TASK_GET_AWARD: string = "http://mxhd.f3322.net:8002/ShareTask/receiveReward";
    /**通关20关通知php */
    static SHARE_CLEARANCE: string = "http://mxhd.f3322.net:8002/ShareTask/clearance";
    /**分享记录 */
    static SHARE_RECORD: string = "http://mxhd.f3322.net:8002/ShareTask/shareTaskRecord";
    static CHECK_SERVER_INFO:string = 'EditionIp/edition';

    static MODIFY_ORDER: string = "";

    static SOUND_URL: string = "";

    static GAME_ACTIVE: string = "";
    static GAME_RECHARGE_POST: string = "";
    static GAME_REGEDIT_POST: string = "";

    static TOKEN_FLAG: string = "qhhw@tf2020";

    static SERVER_IP: string = "";
    static SERVER_PORT: number = 0;
    static REQUEST_FV_DELAY: number = 2000;

    static serverIpList: string[] = [];
    static serverPortList: number[] = [];


    static phpUrl: string = 'http://mxhd.f3322.net:8002/';
    static resUrl: string = '';

    static moduleName: string = GlobalVal.DEFAULT_MODULE_NAME;
    // static deviceid: string = "";
    static channel: string = "";
    static DYNAMIC_HOTUPDATE_HOST = false;
    static hotUpdateEnabled = true;
    static WriteDir = "remote-asset";
    static curVersion = "1.0.0";
    //包体版本，每次出包时要换的
    static packageVersionName = "3.3.0";
    static serverOpened:boolean = true;
    static curPlazaversion = 8;
    static curResVersion = 8;
    static updateHost = "";

    /**是否调试 */
    static isTest: boolean = true;
    /**是否是外网 */
    static isExtranet: boolean = false;
    /**与服务器的时间差 */
    static timeDifference: number = 0;

    static CREATE_ITEM_MIN_X: number = 0;
    static CREATE_ITEM_MAX_X: number = 0;
    static tempVec2: cc.Vec2 = cc.Vec2.ZERO;
    static tempVecRight: cc.Vec2 = cc.Vec2.RIGHT_R;
    static tempRect: Rect = new Rect();
    /**当前地图的基本信息 */
    static curMapCfg: MissionMainConfig;
    /**当前地图的格子信息 */
    static curMapData: any;
    /**游戏时间 */
    static now: number = 0;
    // static delta: number = 0;
    static ANGLE_DY: number = 15;
    static curAngleDelta: number = 0;
    static defaultAngle: number = 0;
    static loginState: number = 0;
    static treatrueNewCardList: Array<any> = [];
    static _treatrueArrowAniTime: number = 0;

    //static dragonSyncTime: number = 0;
    /////////////////////////////
    static enterMapTime: number = 0;
    static totalBlood: number = 0;

    static flyCatEndPos: cc.Vec2 = cc.Vec2.ZERO;
    static dayInfoChecked: boolean = false;
    //招财猫心位置
    static heartPos: cc.Vec2 = cc.Vec2.ZERO;
    //招财猫位置
    static catPos: cc.Vec2 = cc.Vec2.ZERO;

    static cacheMapPosX: number = null;
    static cacheMapId: number = null;

    private static nextReqFvTime: number = 0;

    /**服务器 */
    public static serverType: ServerType = ServerType.LOCAL;
    //重新开始是否弹出提示
    public static mindRestart: boolean = true;
    //进入关卡是否弹出提示
    public static mindCpinfo: boolean = true;
    //关卡失败是否弹出提示
    public static mindGameFaild: boolean = true;
    //是否开放充值
    static openRecharge: boolean = true;

    static openRechargeTaptap:boolean = true;

    static setRechargeFree: boolean = false;
    //是否关闭广告
    static closeAwardVideo: boolean = false;

    static serverIpFrist: string = '';

    static xxPackageId: string = "";
    static deviceid: string = "";
    //关卡详情界面提示切换猫咪
    public static mindSwitchTower: boolean = true;
    public static mindTips803: boolean = true;
    public static mindTips804: boolean = true;

    public static failTipsType: GameFailTipsItemType[] = [];
    public static temp3Vec2:cc.Vec2 = cc.Vec2.ZERO;
 
    public static sdkChannel: string = "";
    public static sdkInit: boolean = false;
    public static ckRoleId: string = "";
    static mDelta: number = 0;
    //秒间隔
    static sDelta: number = 0;

    //毫秒间隔
    static war_MDelta: number = 0;
    //秒间隔
    static war_SDelta: number = 0;
    //没有特殊意义，单纯用来加打印的
    public static curFrameIndex:number = 0;
    //没有特殊意义，单纯用来加打印的
    public static pvpFrameIndex:number = 0;
    static TOWER_TYPE_LEN = 8;

    public static isUserClickCPTaskView: boolean = false;

    public static encrypt: boolean = true;

    public static hideSuperTower: boolean = true;
    public static mirrorSceneObj:boolean = false;
    public static checkSkillCamp:boolean = false;
    public static checkDialogPauseGame:boolean = true;
    public static isShowFloat:boolean = true;


    static warSpeed:number = 1;

    static get treatrueArrowAniTime() {
        return GlobalVal._treatrueArrowAniTime;
    }

    static set treatrueArrowAniTime(time: number) {
        GlobalVal._treatrueArrowAniTime = time;
    }

    //调试使用
    static toMapGridPos(pos: cc.Vec2): cc.Vec2 {
        let x: number = Math.floor((pos.x - GlobalVal.GRID_SIZE * 0.5) / GlobalVal.GRID_SIZE);
        let y: number = Math.floor(pos.y / GlobalVal.GRID_SIZE);
        return cc.v2(x, y);
    }

    static recordEnterMapTime() {
        GlobalVal.enterMapTime = GlobalVal.now;
    }

    //调试用
    static getMapTimeStr(): String {
        let time: number = GlobalVal.now - GlobalVal.enterMapTime;
        return StringUtils.doInverseTime(time * 0.001);
    }

    ///////////////////////////////
    static toMapMidPos(value: number): number {
        return GlobalVal.GRID_SIZE * (value + 0.5);
    }

    static toGridPos(value: number): number {
        return Math.floor(value * GlobalVal.GRID_RATE);
    }

    static toMapPos(value: number): number {
        return GlobalVal.GRID_SIZE * value;
    }

    static getServerTime(): number {
        return cc.sys.now() - GlobalVal.timeDifference;
    }

    static getServerTimeS():number {
        return Math.floor(this.getServerTime() * 0.001);
    }

    static getCanReqFvTime(): boolean {
        return this.nextReqFvTime <= this.getServerTime();
    }

    static changeNextReqFvTime() {
        this.nextReqFvTime = this.getServerTime() + this.REQUEST_FV_DELAY;
    }

    static isChannelSubpackage(): boolean {
        return true;
    }

    /**
     * 初始化各种url
     * @param isExtranet 是否是外网
     */
    static initUrl() {

        this.initServer();
        GlobalVal.IMAGE_LOADER_DIR = GlobalVal.resUrl + "game/resources/dynamicres/";
        GlobalVal.SOUND_URL = GlobalVal.resUrl + "game/resources/sound/";
        GlobalVal.REAL_NAME_AUTH_RUL = GlobalVal.phpUrl + "VerifyRealnames";
        GlobalVal.QUARY_URL = GlobalVal.phpUrl + "VerifyRealnames/query";
        GlobalVal.RECORD_URL = GlobalVal.phpUrl + "VerifyRealnames/record";
        GlobalVal.CODE_URL = GlobalVal.phpUrl + "Public/smsverify";

        GlobalVal.PAY_URL = GlobalVal.phpUrl + "Alipay/order";
        GlobalVal.PAY_ORDER_URL = GlobalVal.phpUrl + "MallQuery/order";
        GlobalVal.FEEDBACK_URL = GlobalVal.phpUrl + "Public/uploadFeedback";
        GlobalVal.WECHAT_LOGIN_URL = GlobalVal.phpUrl + GlobalVal.WECHAT_LOGIN_METHOD_URL;
        GlobalVal.WECHAT_H5_PAY_URL = GlobalVal.phpUrl + "Wx/h5pay";
        GlobalVal.WECHAT_APP_PAY_URL = GlobalVal.phpUrl + "WxApp/getPrePayOrder";
        GlobalVal.FREE_VIDEO_CALLBACK = GlobalVal.phpUrl + "Pangolin/notify";
        /**埋点 */
        GlobalVal.BURYING_POINT_URL = GlobalVal.phpUrl + "BurySpot/index";
        GlobalVal.WAP_PAY = GlobalVal.phpUrl + "Wappay/index";
        GlobalVal.NOTICE_URL = GlobalVal.phpUrl + "Notice/notice";
        GlobalVal.QRCODE_URL = GlobalVal.phpUrl + "WxShare/qrcode";
        GlobalVal.SHARE_TASK_CONFIG = GlobalVal.phpUrl + "ShareTask/wholeTsak";
        /**获取任务状态*/
        GlobalVal.SHARE_TASK_STATE = GlobalVal.phpUrl + "ShareTask/tsakStatus";
        /**每日分享钻石领取 */
        GlobalVal.SHARE_GET_AWARD = GlobalVal.phpUrl + "ShareTask/shareSuccessReward";
        /**领取分享任务奖励 */
        GlobalVal.SHARE_TASK_GET_AWARD = GlobalVal.phpUrl + "ShareTask/receiveReward";
        GlobalVal.SHARE_RECORD = GlobalVal.phpUrl + "ShareTask/shareTaskRecord";
        GlobalVal.SHARE_CLEARANCE = GlobalVal.phpUrl + "ShareTask/clearance";
        GlobalVal.GAME_ACTIVE = GlobalVal.phpUrl + "Headlines/activation";
        GlobalVal.GAME_RECHARGE_POST = GlobalVal.phpUrl + "Headlines/recharge";
        GlobalVal.GAME_REGEDIT_POST = GlobalVal.phpUrl + "Headlines/register";
        GlobalVal.MODIFY_ORDER = GlobalVal.phpUrl + "TestPayment/modifyOrder";
        GlobalVal.RECHARGE_URE = GlobalVal.phpUrl + "UserRecharge/recharge";
        GlobalVal.ORDER_INFO_URL = GlobalVal.phpUrl + GlobalVal.ORDER_INFO_METHOD_URL;
        GlobalVal.XX_ORDER_INFO_URL = GlobalVal.phpUrl + GlobalVal.XX_ORDER_INFO_METHOD_URL;
        GlobalVal.XX_WECHAT_LOGIN_URL = GlobalVal.phpUrl + GlobalVal.XX_WECHAT_LOGIN_METHOD_URL;

        GlobalVal.CK_LOGIN_URL = GlobalVal.phpUrl + "TouchLogin/Login";
        GlobalVal.BURYING_POINT_URL2 = GlobalVal.phpUrl + "FlowPath/index";
        GlobalVal.CHECK_SERVER_INFO = GlobalVal.phpUrl + "EditionIp/edition";
    }

    static initServer() {
        switch (this.serverType) {
            case ServerType.LOCAL:
                this.initLocalServer();
                break;
            case ServerType.TAPTAP:
                this.initTaptapServer();
                break;
            case ServerType.GLOBAL:
                this.initGlobalServer();
                break;
            case ServerType.XX:
                this.initXXServer();
            case ServerType.SQ:
                this.initXXServer();
                break;
            case ServerType.CK:
                this.initCKServer();
                break;
            case ServerType.CK_TEST:
                this.initCKTestServer();
                break;
            case ServerType.CK_IOS_TEST:
                this.initCK_IOS_TestServer();
                break;
            case ServerType.CQ:
                this.initCQServer();
                break;
            default:
                break;
        }
    }

    private static initLocalServer() {
        GlobalVal.phpUrl = 'http://api.yuanyou.x3322.net:8081/';
        GlobalVal.resUrl = 'http://api.yuanyou.x3322.net:8081/Static/';
        GlobalVal.HEAD_URL = GlobalVal.resUrl + "Static/upload/image/icon/feedback/";
        /**春哥*/
        // GlobalVal.SERVER_IP = "192.168.1.105";
        // GlobalVal.SERVER_IP = "192.168.1.200";
        GlobalVal.SERVER_IP = "yuanyou.x3322.net";
        GlobalVal.SERVER_PORT = 1200;
        GlobalVal.isExtranet = false;
        GlobalVal.hotUpdateEnabled = false;
    }

    private static initTaptapServer() {
        GlobalVal.phpUrl = 'http://test-api.maostar.cn/';
        GlobalVal.resUrl = 'http://test-gm.maostar.cn/Static/';

        GlobalVal.HEAD_URL = GlobalVal.resUrl + "upload/image/icon/face/";
        GlobalVal.serverIpList = ["test-game.maostar.cn"];
        GlobalVal.serverIpFrist = '8.129.11.226';
        GlobalVal.serverPortList = [2100];
        GlobalVal.isExtranet = true;
        GlobalVal.hotUpdateEnabled = true;
        GlobalVal.isTest = false;
        GlobalVal.openRecharge = true;
        GlobalVal.closeAwardVideo = true;

        console.log('-----------initTaptapServer');
    }

    private static initGlobalServer() {
        GlobalVal.phpUrl = 'https://mmbwz-api.maostar.cn/';
        GlobalVal.resUrl = 'https://mmbwz-cdn-static.maostar.cn/';

        GlobalVal.HEAD_URL = GlobalVal.resUrl + "upload/image/icon/face/";
        GlobalVal.serverIpList = ['mmbwz-game1.maostar.cn', 'mmbwz-game2.maostar.cn', 'mmbwz-game3.maostar.cn'];
        GlobalVal.serverIpFrist = '8.135.101.254';
        //1100 - 1110
        GlobalVal.serverPortList = [1107];
        GlobalVal.isExtranet = true;
        GlobalVal.hotUpdateEnabled = true;
        GlobalVal.isTest = false;
    }

    private static initXXServer() {
        GlobalVal.phpUrl = 'https://xx-api.maostar.cn/';
        GlobalVal.resUrl = 'https://xx-cdn-static.maostar.cn/';

        GlobalVal.HEAD_URL = GlobalVal.resUrl + "upload/image/icon/face/";

        GlobalVal.serverIpList = ['xx-game1.maostar.cn', 'xx-game2.maostar.cn', 'xx-game3.maostar.cn'];
        GlobalVal.serverIpFrist = '120.78.219.67';
        //GlobalVal.serverIpList = ['120.78.219.67'];
        //1100 - 1110
        GlobalVal.serverPortList = [1100, 1101, 1102, 1103, 1104, 1105, 1106, 1107, 1108, 1109, 1110];

        GlobalVal.isExtranet = true;
        GlobalVal.hotUpdateEnabled = true;
        GlobalVal.isTest = false;
    }

    private static initSqServer() {
        GlobalVal.isExtranet = true;
        GlobalVal.hotUpdateEnabled = true;
        GlobalVal.isTest = false;
    }

    private static initCKServer() {
        GlobalVal.phpUrl = 'https://apimmbwz.chukonggame.com/';
        GlobalVal.resUrl = 'https://cdnmmbwz.chukonggame.com/';

        GlobalVal.HEAD_URL = GlobalVal.resUrl + "upload/image/icon/face/";
        GlobalVal.CK_ORDER_INFO_URL = GlobalVal.phpUrl + "TouchSdkOrderInfo/query";
        GlobalVal.CK_BI_REPORT_URL1 = GlobalVal.phpUrl + "BIEscalation/index";
        GlobalVal.CK_BI_REPORT_URL2 = GlobalVal.phpUrl + "MissionBI/BIEscalation";
        GlobalVal.serverIpList = ['gamemmbwz.chukonggame.com'];
        //1100 - 1110
        GlobalVal.serverPortList = [1100, 1101, 1102, 1103, 1104, 1105, 1106, 1107, 1108, 1109, 1110];

        GlobalVal.isExtranet = true;
        GlobalVal.hotUpdateEnabled = true;
        GlobalVal.isTest = false;
    }

    private static initCKTestServer() {
        GlobalVal.phpUrl = 'https://test-apimmbwz.chukonggame.com/';
        GlobalVal.resUrl = 'https://test-cdnmmbwz.chukonggame.com/';

        GlobalVal.HEAD_URL = GlobalVal.resUrl + "upload/image/icon/face/";
        GlobalVal.CK_ORDER_INFO_URL = GlobalVal.phpUrl + "TouchSdkOrderInfo/query";
        GlobalVal.CK_BI_REPORT_URL1 = GlobalVal.phpUrl + "BIEscalation/index";
        GlobalVal.CK_BI_REPORT_URL2 = GlobalVal.phpUrl + "MissionBI/BIEscalation";
        GlobalVal.serverIpList = ['test-gamemmbwz.chukonggame.com'];
        // GlobalVal.serverIpFrist = '120.78.219.67';
        //GlobalVal.serverIpList = ['120.78.219.67'];
        //1100 - 1110
        GlobalVal.serverPortList = [1100, 1101, 1102, 1103, 1104, 1105, 1106, 1107, 1108, 1109, 1110];

        GlobalVal.isExtranet = true;
        GlobalVal.hotUpdateEnabled = true;
        GlobalVal.isTest = false;
    }

    private static initCK_IOS_TestServer() {
        GlobalVal.phpUrl = 'https://ios-apimmbwz.chukonggame.com/';
        GlobalVal.resUrl = 'https://ios-cdnmmbwz.chukonggame.com/';

        GlobalVal.HEAD_URL = GlobalVal.resUrl + "upload/image/icon/face/";
        GlobalVal.CK_ORDER_INFO_URL = GlobalVal.phpUrl + "TouchSdkOrderInfo/query";
        GlobalVal.CK_BI_REPORT_URL1 = GlobalVal.phpUrl + "BIEscalation/index";
        GlobalVal.CK_BI_REPORT_URL2 = GlobalVal.phpUrl + "MissionBI/BIEscalation";
        GlobalVal.serverIpList = ['ios-gamemmbwz.chukonggame.com'];
        // GlobalVal.serverIpFrist = '120.78.219.67';
        //GlobalVal.serverIpList = ['120.78.219.67'];
        //1100 - 1110
        GlobalVal.serverPortList = [2100, 2101, 2102, 2103, 2104, 2105, 2106, 2107, 2108, 2109, 2110];

        GlobalVal.isExtranet = true;
        GlobalVal.hotUpdateEnabled = true;
        GlobalVal.isTest = false;
    }

    private static initCQServer() {
        GlobalVal.phpUrl = 'https://mmbwz-api.maostar.cn/';
        GlobalVal.resUrl = 'https://mmbwz-cdn-static.maostar.cn/';

        GlobalVal.HEAD_URL = GlobalVal.resUrl + "upload/image/icon/face/";
        GlobalVal.CQ_LOGIN_URL = GlobalVal.phpUrl + "AnecdoteLogin/login";
        GlobalVal.serverIpList = ['mmbwz-game1.maostar.cn', 'mmbwz-game2.maostar.cn', 'mmbwz-game3.maostar.cn'];
        GlobalVal.serverIpFrist = '8.135.101.254';
        //1100 - 1110
        GlobalVal.serverPortList = [1107];
        GlobalVal.isExtranet = true;
        GlobalVal.hotUpdateEnabled = false;
        GlobalVal.isTest = false;
    }

    /**收到后台返回后 */
    static initCkServerUrl(isTest:boolean) {
        this.serverType = isTest ? (cc.sys.os === cc.sys.OS_IOS ? ServerType.CK_IOS_TEST : ServerType.CK_TEST) : ServerType.CK;
        this.initUrl();
    }
}