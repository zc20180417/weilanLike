import Game from "../Game"
import GlobalVal from "../GlobalVal"
import { md5 } from "../libs/encrypt/md5";
import HttpControl from "../net/http/HttpControl"

export enum EBuryingPoint {
    GAME_START        = 10001,         //启动应用
    CONNECT_SERVER    = 10002,         //	连接服务器成功
    REQUEST_REGEDIT   = 10003,         //请求注册
    REQUEST_PHP_LOGIN = 10004,        //登录请求 1
    REQUEST_SERVER_LOGIN= 10005,      // 登录请求2
    SHOW_LOADING      = 10006,        // loading界面
    LOADING_COMPLETE  = 10007,       //	进入游戏大厅

    LaunchAppFrist  = 10108,             //	安卓启动第一次应用
    LaunchAppNormal = 10008,             //	安卓启动非第一次启动应用
    START_HOT_UPDATE = 10010,           //	开始热更
    END_HOT_UPDATE   = 10011,            //	热更完成
    SHOW_LOGIN_SCENE = 10012,           //	显示登录页面
    START_PLAY_VIDEO = 10013,           //	开始播放视频
    END_PLAY_VIDEO  = 10014,            //结束播放视频
    FAIL_HOT_UPDATE = 10015,            //热更新失败

    TOUCH_LOGIN      = 10016,           //点击登录按钮 (新加)
    REQ_WX_CODE      = 10017,           //请求微信code (新加)
    WX_CODE_SUC      = 10018,           //微信code返回成功 (新加)
    WX_CODE_FAIL     = 10019,           //微信code返回失败 (新加)
    WX_CODE_CANCEL   = 10020,           //取消授权微信code (新加)
    REQ_GET_ACCOUNT  = 10021,           //请求获取游戏账号（如果是新号，就是注册）(新加)
    RET_GET_ACCOUNT  = 10022,           //返回获取游戏账号成功（如果是新号，就是注册）(新加)
    RET_PHP_LOGIN_SUC = 10023,          //登录请求1返回成功 (新加)
    RET_SERVER_LOGIN_SUC = 10024,       //登录请求2返回成功 (新加)

    //实名认证相关
    REQ_CERTIFICATION_QUARY = 10025,          //实名认证查询 (新加)
    RET_CERTIFICATION_QUARY = 10026,          //实名认证查询返回成功 (新加)
    SHOW_ADDICTTION_VIEW    = 10027,          //显示实名认证面板 (新加)
    REQ_CERTIFICATION       = 10028,          //请求实名认证 (新加)
    RET_CERTIFICATION_SUC       = 10029,          //实名认证成功 (新加)
    RET_CERTIFICATION_FAIL      = 10030,          //实名认证失败 (新加)
    RET_CERTIFICATION_FAIL2     = 10031,         //实名认证失败（未成年） (新加)

    AGREE_YINSI     = 10032,         //同意隐私授权 (新加)
    REFUSE_YINSI     = 10033,         //拒绝隐私授权 (新加)

    PERMISSION      = 10034,            //（触控sdk申请权限）
    PERMISSION_SUC      = 10035,            //（触控sdk申请成功）
    PERMISSION_FAIL      = 10036,            //（触控sdk申请失败）
    INIT_SDK_SUC      = 10037,            //（触控sdk初始化成功）
    INIT_SDK_FAIL      = 10038,            //（触控sdk初始化失败）
    SELECT_LOGIN_PRIVACY     = 10039,             //首次勾选登陆界面用户协议和隐私协议
    
    SHOW_CARTOON     = 10103,             //显示漫画

    SHOW_SET_NAME_VIEW = 10100,
    REQ_SET_NAME = 10101,
    SET_NAME_SUCCESS = 10102,

    /////////////////////////////////////////////////////////
    SHOW_SIGN_VIEW   = 20001,      //	弹出签到界面次数：计算系统的使用率 //20002	玩家弹出签到界面人数：计算系统的使用率 

    //////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////面板曝光埋点
    //20003	弹出签到界面次数：计算面板曝光率 
    //20004	玩家弹出签到界面次数：计算面板曝光率
    SHOW_TOWER_VIEW = 20101,//	弹出佣兵界面次数：计算面板曝光率
    //20102	弹出佣兵界面人数：计算系统的使用率
    SHOW_KEJI_VIEW = 20201,//	弹出科技界面次数：计算面板曝光率
    //20202	弹出科技界面人数：计算系统的使用率
    SHOW_TUJIAN_VIEW = 20301,//	弹出图鉴界面次数：计算面板曝光率
    //20302	弹出图鉴界面人数：计算系统的使用率
    SHOW_SHOP_VIEW = 20401,//	弹出商店界面次数：计算面板曝光率
    //20402	弹出商店界面人数：计算系统的使用率
    SHOW_TASK_VIEW = 20501,//	弹出任务界面次数：计算面板曝光率
    //20502	弹出任务界面人数：计算面板的使用率
    //OPEN_STAR_BOX =  20601,//	关卡星星宝箱打开次数

    
    SHOW_GAME_SUCCESS_VIEW = 20701,  //弹出关卡结算-胜利界面次数
    SHOW_GAME_FAIL_VIEW = 20801,     //弹出关卡结算-失败界面次数
    SHOW_TILI_SHOP = 20901,          //打开体力购买界面次数
    SHOW_SKILL_SHOP_VIEW = 21001,    //打开技能商城面板的次数
    SHOW_EXCHANGE_VIEW = 21101,      //弹出兑换界面次数
    SHOW_FRIEND_VIEW = 21201,        //弹出好友界面次数
    SHOW_PVP_ENTER_VIEW = 21301,     //弹出对战模式-进入界面次数 (待加)
    SHOW_PVP_SUCCESS_VIEW = 21401,   //弹出对战模式-胜利界面次数 (待加)
    SHOW_PVP_FAIL_VIEW = 21501,      //弹出对战模式-失败界面次数 (待加)
    SHOW_SJ_VIEW = 21601,            //弹出赏金模式界面次数 (待加)
    SHOW_CAT_HOME_VIEW = 21701,      //弹出猫咪公寓界面次数 (待加)
    SHOW_JB_VIEW       = 21801,      //弹出我的奖杯界面次数 (暂不加)
    SHOW_MAIL_VIEW     = 21901,      //弹出邮件界面次数 (暂不加)
    SHOW_EXCHANGE_NUM_VIEW= 22001,   //弹出兑换码界面次数 (暂不加)
    SHOW_SETTING_VIEW= 22101,        //弹出游戏设置界面次数 (暂不加)
    SHOW_HIDE_WAR_VIEW= 22201,       //弹出隐藏关卡界面次数
    //SHOW_CHAPTER_VIEW= 22301,        //弹出章节切换界面次数 (暂不加)
    SHOW_SALE_VIEW= 22401,           //弹出打折屋界面次数 (待加)
    SHOW_RECV_VIEW= 22501,           //弹出复活界面次数
    SHOW_AWARD_BOX_VIEW= 22601,      //弹出开宝箱界面次数
    SHOW_WAR_INFO_VIEW = 22701,      //弹出关卡信息界面次数
    SHARE_OPEN_TASK_VIEW = 22801,     //打开邀请-分享界面
    SHARE_FRIST_RECHARGE_VIEW = 22901,     //打开首冲界面
    QWER_ZXCV     = 22902,             //
    QWER_ZXCV1     = 22903,             //
    SHARE_YUE_KA_VIEW = 23001,     //打开月卡界面
    SHARE_LEI_SHEN_SGIN_VIEW = 24001,     //打开雷神签到（没做）
    SHARE_SCIENCE_VIEW = 24101,          //打开科技面板
    SHARE_VIP_VIEW = 24201,             //打开vip面板
    SHARE_XIAO_CHOU_ACTIVITY_VIEW = 24301,       //小丑皮肤购买界面(活动)
    SHARE_XIAO_CHOU_SKIN_VIEW = 24302,       //小丑皮肤购买界面
    SHOW_DAILY_ACTIVE_VIEW = 24303,       //每日特惠界面

    

    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////视频埋点
    SHOW_VODEO_END            = 30001,//看完视频的埋点 
    TOUCH_TILI_FREE_VIDEO = 30011,	//点击按钮“视频购买体力”次数 //30003	点击按钮“视频购买体力”看完次数
    //TOUCH_DOUBLE = 30021,//	结算-胜利“翻倍”点击次数 //30022	结算-胜利“翻倍”视频看完次数
    REVICE_FREE_VIDEO = 30031 , //复活视频 //30032	复活界面“复活”视频看完次数
    METHOD_FREE_VIDEO = 30041 , //结算-失败“攻略”视频点击次数 //30042	结算-失败“攻略”视频看完次数 (待加)
    TOUCH_FREE_BOX = 30051,//	商店-宝箱“免费宝箱”视频点击次数  //30052	商店-宝箱“免费宝箱” 视频看完次数
    //TOUCH_TEHUI_FREE_BOX = 30061,//	商店-特惠“每日超值礼包”视频点击次数  //30062 商店-特惠“每日超值礼包” 视频看完次数 (新加)
    TOUCH_TEHUI_FREE_DIAMOND = 30071,//商店-特惠“一袋钻石”视频点击次数 //30072	商店-特惠“一袋钻石” 视频看完次数
    TOUCH_TEHUI_FREE_LINGDANG = 30081,//商店-特惠“铃铛”点击次数 //TOUCH_TEHUI30082	商店-特惠“铃铛” 视频看完次数
    TOUCH_FREE_SKILL          = 30091,//	商店-特惠“技能”点击次数 //TOUCH_30092	商店-特惠“技能” 视频看完次数
    TOUCH_ADD_CARD            = 30101,//抽卡-“附加卡”视频点击次数
    HIDE_WAR_FREE             = 30111,//隐藏关卡-“进入/重来”视频点击次数   
    SALE_SHOP_FREE_REFRESH    = 30121,//打折屋-“刷新”视频点击次数           
    PVP_SUCCESS_AWARD_FREE    = 30131,//对战模式胜利-“翻倍”视频点击次数      （待加）
    PVP_FAIL_FREE             = 30141,//对战模式失败-“免扣”视频点击次数      （待加）
    LEI_SHEN_VIDEO            = 30151,//雷神签到打卡视频点击次数     

    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////钻石埋点
    NL_BUY_1             = 40011,//商店-能量“档位1”钻石购买次数（新加）
    NL_BUY_2             = 40012,//商店-能量“档位2”钻石购买次数（新加）
    NL_BUY_3             = 40013,//商店-能量“档位3”钻石购买次数（新加）
    NL_BUY_4             = 40014,//商店-能量“档位4”钻石购买次数（新加）
    GIFT_BOX_BUY_2       = 40021,//商店-宝箱“高档宝箱”钻石购买次数（新加）
    TOUCH_ZHIZUN_BOX     = 40022,//	商店-宝箱“至尊宝箱”钻石购买点击次数（新加）
    TOUCH_ZHIZUN_BOX_FREE = 40023,//商店-宝箱“至尊宝箱”免费钻石购买次数(新加)
    TOUCH_JINSE_BOX       = 40024,//商店-宝箱“金色卡包”钻石购买点击次数

    BUY_SKILL_SHOP_INDEX = 40020,      //购买道具11次数


    TOUCH_TILI_1 = 40041,//	体力-“购买1点体力”次数
    TOUCH_TILI_2 = 40042,//	体力-“购买5点体力”次数
    TOUCH_TILI_3 = 40043,//	体力-“购买10点体力”次数

    PVP_DIAMOND_ENTER = 40051,//对战模式钻石进入次数(待加)
    RECIVE_DIAMOND    = 40061,//复活界面“复活”钻石次数
    SCIENCE_RESET     = 40081,//天赋重置次数

    TOUCH_DIAMOND_NEW_1   = 44011,//	首次商店-钻石“充值6元”
    TOUCH_DIAMOND_NEW_2   = 44012,//	首次商店-钻石“充值30元”
    TOUCH_DIAMOND_NEW_3   = 44013,//	首次商店-钻石“充值98元”
    TOUCH_DIAMOND_NEW_4   = 44014,//	首次商店-钻石“充值328元”

    TOUCH_DIAMOND_1     = 44021,//	商店-钻石“充值6元”
    TOUCH_DIAMOND_2     = 44022,//	商店-钻石“充值30元”
    TOUCH_DIAMOND_3     = 44023,//	商店-钻石“充值98元”
    TOUCH_DIAMOND_4     = 44024,//	商店-钻石“充值328元”
    PAY_TEHUI_1         = 44031,//  商店-特惠“超值礼包”
    //PAY_TEHUI_2         = 44032,//  商店-特惠“一袋钻石”(待加)
    SHARE_DIAMOND_GET   = 44041,// 分享钻石领取次数 (?)

    ZERO_MALL_BUY       = 40050,//购买0元礼包埋点
    ////////////////////////////////////////////////////////////////////

    PAY_FRIST_RECHARGE = 50016,     //首充购买次数
    PAY_YUEKA          = 50017,     //月卡购买次数（包含续费）
    PAY_FASHION_ACTIVE = 50018,     //小丑皮肤购买次数 （打折）
    PAY_AON_MAN        = 50019,     //钢铁侠购买次数 打折(待加)
    PAY_FASHION        = 50020,     //小丑皮肤购买次数 （原价）
    PAY_DAILY_ZHADANREN      = 50021,     //炸弹喵礼包购买次数
    PAY_DAILY_LEISHEN        = 50022,     //雷喵礼包购买次数
    PAY_DAILY_GANGTIEXIA     = 50023,     //钢铁喵礼包购买次数

    ////////////////////////////////////////////////////////////////////分享
    SHARE_CLICK_SHARE = 60011,  //邀请-点击“分享”按钮点击人数
    SHARE_CIRCLE      = 60012,  //邀请-点击“朋友圈”按钮点击人数
    WAR_SUCCESS_SHARE = 60021,  //结算-胜利“分享”按钮点击次数 
    PVP_SUCCESS_SHARE = 60031,  //对战-胜利“分享”按钮点击次数 (待加)

    ////////////////////////////////////////////////////////////////////

    DOUBLE_FREE_VIDEO = 30102,//结算翻倍订单号

    //PAY_DIAMOND_4       = 30408,//	商店-钻石“档位4”付费次数
    //TOUCH_ADD_CARD      = 30501,    //点击附加卡视频
    //TOUCH_ADD_CARD      = 30502,    //附加卡视频播放完成

    //war
    STAR_WAR =  400001,//	请求进入关卡 关卡id 
    ENTER_WAR_SUCCESS = 400002,//	关卡id 进入成功
    WAR_SUCCESS = 400003,//	通关成功 关卡id，任务完成情况，通关时间
    EXIT_WAR = 400004,//	退出 关卡id
    WAR_FAILD = 400005,//   通关失败 关卡失败


    SHOW_COUNT_DOWN =  400006,      //   倒计时出现人数
    COUNT_DOWN_END = 400007 ,       //倒计时结束人数
    SHOW_WAR_GUIDE = 400008,        // 弹出引导 XX id人数：
    BREAK_WAR_GUIDE = 400009,       //点击引导 XX 跳过人数：
    SHOW_WAR_FAILD_VIEW = 400010,   // 弹出“结算面板-失败”人数
    TOUCH_AGIN_WAR = 400011 ,       //*“结算面板-失败”点击“再试一次”人数
    TOUCH_WAR_FAIL_BACK = 400012 , //*“结算面板-失败”点击“返回”人数
    TOUCH_WAR_FAIL_SHARE = 400013 , //“结算面板-失败”点击“分享”人数
    SHOW_WAR_SUCCESS_VIEW = 400014 , //弹出“结算面板-胜利”人数
    TOUCH_WAR_SUCCESS_GOON = 400015 , //*“结算面板-胜利”点击“继续游戏”人数
    TOUCH_WAR_SUCCESS_BACK = 400016, //*“结算面板-胜利”点击“返回”人数
    TOUCH_WAR_SUCCESS_DOUBLE = 400017,//“结算面板-胜利”点击“视频”人数
    SHOW_RED_PACK_VIEW = 400018 , //弹出红包界面人数
    CLOSE_RED_PACK_VIEW = 400019 , //关闭红包界面人数
    TOUCH_MENU_RESTART = 400020 , //*“设置面板”点击重新开始按钮人数
    TOUCH_MENU_EXIT = 400021 , //*“设置面板”点击退出本关按钮人数
    USE_MAGIC_SKILL = 400022 , //使用技能XX人数
    STAR_ENTER_WAR = 400023,//开始进入关卡
    STAR_LOAD_TRANSFORM = 400024,//开始加载切关动画
    STAR_LOAD_WAR = 400025,//开始加载关卡场景
    LOAD_WAR_SUCCESS = 400026,//加载关卡场景成功

    DOUBLE_SPEED = 400027,//开启双倍速
    TOUCH_SCENE_ITEM = 400028,//点击建筑物
    PASS_WAR_TIME = 400029,//点击建筑物
    

    BEGIN_BUFF_VIEW = 401024,   //开局buff界面弹出
    BEGIN_BUFF_USE = 401025,    //开局buff使用次数
    


    
}

/**埋点 */
export class BuryingPointMgr {

    private static extensionObjs = {
        // 10001:{
        //     type:"Game_Frist_Scene_Start",
        //     extension:"游戏初始场景程序入口",
        // },
        // 10032:{
        //     type:"Game_Argee_Jurisdiction",
        //     extension:"同意隐私授权",
        // },
        // 10034:{
        //     type:"Game_Call_SDK_Permission",
        //     extension:"调用触控sdk申请权限",
        // },
        10035:{
            type:"Game_SDK_Permission_Success",
            extension:"触控sdk权限申请成功",
        },
        10036:{
            type:"Game_SDK_Permission_Fail",
            extension:"触控sdk权限申请失败",
        },
        10037:{
            type:"Game_SDK_Init_Success",
            extension:"触控sdk初始化成功",
        },
        10038:{
            type:"Game_SDK_Init_Fail",
            extension:"触控sdk初始化失败",
        },
        10006:{
            type:"Game_Enter_Loading",
            extension:"显示Loading界面",
        },
        10010:{
            type:"Game_Start_Hot_Update",
            extension:"开始热更",
        },
        10011:{
            type:"Game_Start_Update_Success",
            extension:"热更完成",
        },
        10015:{
            type:"Game_Start_Update_Fail",
            extension:"热更失败",
        },
        10012:{
            type:"Game_Enter_Login",
            extension:"进入登录页面",
        },
        10039:{
            type:"Game_Select_Privacy",
            extension:"勾选登陆界面用户协议和隐私协议",
        },
        10016:{
            type:"Game_Call_SDK_Login",
            extension:"点击登录按钮（触发触控sdk登录）",
        },
        10018:{
            type:"Game_SDK_Login_Success",
            extension:"触控SDK登录成功",
        },
        10019:{
            type:"Game_SDK_Login_Fail",
            extension:"触控SDK授权登录失败或超时",
        },
        10021:{
            type:"Game_Req_Get_Account",
            extension:"通过SDK返回的用户标示获取游戏账号",
        },
        10022:{
            type:"Game_Ret_Get_Account",
            extension:"HTTP服务器返回账号成功",
        },
        10002:{
            type:"Game_Connect_Socket",
            extension:"连接游戏的Socket成功",
        },
        10004:{
            type:"Game_Login_Server",
            extension:"登录大厅服务器",
        },
        10005:{
            type:"Game_Login_Plaza_Server",
            extension:"登录中心服务器",
        },
        10007:{
            type:"Game_Enter_Hall",
            extension:"进入游戏大厅成功",
        },
        10100:{
            type:"Game_Show_Set_Name_View",
            extension:"改名界面弹出",
        },
        10103:{
            type:"Game_Show_CARTOON",
            extension:"显示四格漫画",
        },
        10101:{
            type:"Game_Req_Set_Name",
            extension:"改名界面确认",
        },
        10102:{
            type:"Game_Set_Name_Success",
            extension:"改名成功",
        },

    }

    static curShopBuryingType:number = 0;
    static curPayType:number = 0;
    static launchAppFrist:boolean = false;
    static showLoginFrist:boolean = false;

    static fristPortDic:any = {};

    static post(id:EBuryingPoint | number , param?:any) {
        return;
        let uid = Game.actorMgr && Game.actorMgr.nactordbid > 0 ? Game.actorMgr.nactordbid: GlobalVal.deviceid;

        if (id < EBuryingPoint.SHOW_SIGN_VIEW && (BuryingPointMgr.launchAppFrist || BuryingPointMgr.showLoginFrist)) {
            id += 100;
        }

        let paramStr = param ? param : "";

        // if (uid > 0) {
        //     if (paramStr != "") {
        //         try {
        //             let obj = JSON.parse(paramStr);
        //             if (obj) {
        //                 obj.channel_id = "3";
        //                 paramStr = JSON.stringify(obj);
        //             }
    
        //         } catch (error) {
                    
        //         }
        //     } else {
        //         paramStr = JSON.stringify({channel_id : "3"});
        //     }
        // }

        // if (paramStr != "" ) {
        //     cc.log(paramStr);
        // }
        let obj = {uid:uid , nid:id , aconite:paramStr};
        HttpControl.post(GlobalVal.BURYING_POINT_URL , obj , (suc: boolean, ret: string | any) => {
            cc.log("埋点返回" , ret);
        } , true);

    }

    static postWar(id:EBuryingPoint) {
        return;
        BuryingPointMgr.post(id , JSON.stringify({ warid : GlobalVal.curMapCfg.nwarid}));  
    }

    static postFristPoint(id:EBuryingPoint | number , type?:string , extension?:string) {
        return;
        this.postFristPoint2(id , type , extension);
        this.post(id);
    }

    private static postFristPoint2(id:EBuryingPoint | number , type?:string , extension?:string) {
        return;
        let uid = Game.actorMgr && Game.actorMgr.nactordbid > 0 ? Game.actorMgr.nactordbid: GlobalVal.deviceid;
        let obj = {
                    uid:uid , 
                    nid:id , 
                    sign:md5(id + GlobalVal.TOKEN_FLAG),
        };

        HttpControl.post(GlobalVal.BURYING_POINT_URL2 , obj , (suc: boolean, ret: string | any) => {
            cc.log("埋点2返回" , ret);
        } , true);

        let extensionObj = this.extensionObjs[id];
        if (extensionObj) {
            this.ckBreakPoint(extensionObj.type , extensionObj.extension);
        } else if (type && extension) {
            this.ckBreakPoint(type , extension);
        }
    }

    private static ckBreakPoint(type:string , extension:string) {
        return;
        if (cc.sys.isNative) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "ckBreakpoint", "(Ljava/lang/String;Ljava/lang/String;)V", type, extension);
        }
    }
}