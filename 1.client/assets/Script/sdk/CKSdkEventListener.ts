import { EventEnum } from "../common/EventEnum";
import Game from "../Game";
import GlobalVal, { SEND_TYPE, ServerType } from "../GlobalVal";
import HttpControl from "../net/http/HttpControl";
import { SysState } from "./NativeAPI";
import { GameEvent } from "../utils/GameEvent";
import { md5 } from "../libs/encrypt/md5";

export enum DIAMOND_SRC_TYPE {
    DIAMOND_BUY = 1,            //钻石购买
    MISSION_REWARD = 2,         //任务奖励
    SIGN_REWARD = 3,            //签到奖励
    EXCHANGE_REWARD = 4,        //兑换奖励
    EXCHANGE_FAIL_RET = 5,      //兑换失败返还
    ORDER_PRODUCT = 6,          //订单产出
    EMAIL_PRODUCT = 7,          //邮件产出
    FUNC_OPEN_REWARD = 8,       //功能开启奖励
    FRIEND_TILI_REWARD = 9,     //领取打赏体力
    DISCOUNT_BUY = 10,          //折扣商店购买
    WEB_RET = 11,               //WEB后台操作
    USER_USE_ITEM = 12,         //用户使用物品
    ERR_LOG = 13,               //错误日止集合
    EQUIP_LV_UP = 14,           //升级猫咪装备
    YUEKA_REWARD = 15,          //月卡领取
    POWER = 16,                 //强化
    HERO_UPSTAR = 17,           //英雄升星
    HERO_LVUP = 18,             //英雄升级
    TOWER_UPSTAR = 19,          //炮台升星
    ACTIVE_BOOK = 20,           //激活图鉴
    TOWER_UPSTAR_REWARD = 21,   //炮台升星奖励
    BUY_FURNITURE = 22,         //购买道具家具
    VIP_DAILY_REWARD = 23,      //vip每日奖励
    CP_SUCC_REWARD = 24,        //通关奖励
    FREE_VIDEO_ORDER = 25,      //免费小视频订单
    FRIEND_HOUSE_REWARD = 26,   //好友访问房屋奖励
    FLOOR_LVUP = 27,            //楼层升级
    BUY_FATION = 28,            //购买时装
    ACTIVE_REWARD = 29,         //内置活动奖励
    CP_SUCC_LOG = 30,           //通关日志
    SHOP_FIRST_DOUBLE_REWARD = 31,//商城首次购买多倍赠送
    ACTIVE_TOWER = 32,          //激活炮台
    CP_COST_TILI = 33,          //关卡战斗消耗体力
    TIMER_ADD_TILI = 34,        //定时增加体力值
    USE_SKILL_CARD = 35,        //使用技能卡
    SCIENCE_TYPE = 36,          //科技类型
    JION_TURNTABLE = 37,        //参与抽奖大转盘
    TURNTABLE_REWARD = 38,      //抽奖大转盘奖励
    FULL_RELIVE = 39,           //满血复活
    RANK_REWARD = 40,           //段位奖励
    NEWHAND_MISSION = 41,       //新手任务
    JOIN_PVP = 42,              //PVP报名
    PVP_SUCC_DIAMOND = 43,      //PVP胜利奖励钻石
    GROW_REWARD = 44,           //成长礼包领取
    OPNE_BOX = 45,              //开宝箱
    BOX_DROP = 46,              //开宝箱掉落
    ROON_ADD_GOODS = 47,        //房间添加物品
    SHANGJIN_OPNE_GRID = 48,    //赏金开启猫咪格
    SHANGJIN_REF_MAP = 49,      //赏金刷新地图
    SHANGJIN_CP_REWARD = 50,    //赏金关卡奖励
    VIP_TEHUI = 51,             //VIP等级特惠
    JOIN_ACTIVE = 52,           //内置活动参与
    CARD_TO_GOODS = 53,         //炮台满星剩余卡片转换物品
    SHANGJIN_BUY_CHALLENGE = 54,//赏金购买挑战次数
    TXZ_REWARD = 55,            //战场通行证奖励
    SHANGJIN_MISSION_REWARD = 56,//赏金关卡任务奖励
    PT_REWARD = 57,             //赏金爬塔奖励
    PT_BUY_PROP = 58,           //赏金爬塔购买属性
    USE_CARD_BAG = 59,          //使用自选卡包
    CARD_BAG_ADD_GOODS = 60,    //使用自选卡包添加物品
    DWK_REWARD = 61,            //大玩咖奖励
    ACTIVE_RESET = 62,          //活动重置
    DIAMOND_REF_DISCOUNT_SHOP = 63,//钻石刷新打折屋
    PVP_POINT = 64,             //PVP胜利奖励竞技点
    DIAMOND_REF_PVP_SHOP = 65,  //钻石刷新竞技商店
    PVP_SHOP_BUY_COST = 66,     //竞技商店购买消耗
    PVP_SHOP_BUY_GOODS = 67,    //竞技商店购买添加物品
    DIAMOND_REF_COOP_SHOP = 68, //钻石刷新合作商店
    COOP_SHOP_BUY_COST = 69,    //合作商店购买消耗
    COOP_SHOP_BUY_GOODS = 70,   //合作商店购买添加物品
    COOP_PT_REWARD = 71,        //组队爬塔奖励
    COOP_PT_BUY_COUNT = 72,     //组队爬塔购买次数
}

export enum BI_TYPE {
    LOGIN = 1,        //登录数据上报
    ROLE_LOGIN = 2,       //角色登录上报
    ROLE_LV_CHANGE = 3,     //角色等级变化上报
    MISSION = 6,        //任务事件上报
}

export enum MISSION_TYPE {
    CP = 1,       //关卡
    MISSION = 2,      //任务
    COPY = 3,         //副本
    PVP = 4,          //pvp
    COOPERATE = 5,    //合作模式
    
    OPEN_BOX            = 7,      //开宝箱
    UPGRADE_TOWER       = 8,      //猫咪升级
    ACTIVE_TOWER        = 9,      //猫咪激活
    ACTIVE_SKIN         = 10,     //获取皮肤
    ACTIVE_EQUIP        = 11,     //激活装备
    CONSUME_TILI        = 12,     //消耗体力
    CONSUME_LINGDANG    = 13,     //消耗铃铛
    CONSUME_ENERGY      = 14,     //消耗能量
    CONSUME_SKILL_ITEM  = 15,     //消耗技能道具
    ACTIVE_SCIENCE ,              //天赋激活
    UPGRADE_SCIENCE ,             //天赋升级
    RESET_SCIENCE ,               //天赋重置

}

export enum MISSION_LEVEL {
    NORMAL = "普通",
    HARD = "精英",
}

export enum MISSION_NAME {
    PVP = "对战模式",          //pvp
    COOPERATE = "合作模式",    //合作模式
    SCIENCE = "天赋",      //天赋
    OPEN_BOX = "开宝箱",
    UPGRADE_TOWER = "猫咪升级",
    ACTIVE_TOWER  = "猫咪激活",
    ACTIVE_SKIN   = "获取皮肤",//获取皮肤
    ACTIVE_EQUIP  = "激活装备",//激活装备
    CONSUME_TILI  = "消耗体力",//消耗体力
    CONSUME_LINGDANG  = "消耗铃铛",//消耗铃铛
    CONSUME_ENERGY  = "消耗能量",//消耗能量
    CONSUME_SKILL_ITEM  = "消耗技能道具",//消耗技能道具
    ACTIVE_SCIENCE = "天赋激活",
    UPGRADE_SCIENCE = "天赋升级",
    RESET_SCIENCE = "天赋重置",
}

export enum MISSION_STATE {
    FAIL = 1,       //失败
    SUCC = 2        //成功
}

export class CKSdkEventListener {
    constructor() {
        GameEvent.on(EventEnum.CK_ROLE_INFO_CHANGE, this.roleInfoChange, this);
        GameEvent.on(EventEnum.CK_BI_REPORT, this.BIReport, this);
        GameEvent.on(EventEnum.CK_BI_REPORT_EVENT, this.BIReportEvt, this);
        GameEvent.on(EventEnum.CK_BREAK_POINT, this.ckBreakPoint, this);
    }

    /**
     * 触控角色信息上报
     * @param sendType 
     */
    public roleInfoChange(sendType: SEND_TYPE) {
        let uid = GlobalVal.ckRoleId;
        let nickName = Game.actorMgr.privateData.szname;
        let time = Math.floor(GlobalVal.getServerTime() * 0.001).toString();
        console.log("上报角色信息:", sendType, uid, nickName, time, time);
        Game.nativeApi.roleInfo(sendType, uid, nickName, time, time);
    }

    public BIReport(type: BI_TYPE, jsonParm: string) {
        if (GlobalVal.serverType != ServerType.CK && GlobalVal.serverType != ServerType.CK_TEST) return;
        let data = {
            type: type,
            regionalid: Game.nativeApi.getPhoneInfo(SysState.SYSSTATE_REGIONALID),
            cpsid: Game.nativeApi.getPhoneInfo(SysState.SYSSTATE_CPSID),
            user_id: GlobalVal.ckRoleId,
        };
        switch (type) {
            case BI_TYPE.LOGIN:
            case BI_TYPE.ROLE_LV_CHANGE:
                Object.assign(data, {
                    roleid: Game.actorMgr.privateData.nactordbid,
                    device: Game.nativeApi.getPhoneInfo(SysState.SYSSTATE_MODEL),
                    OS: Game.nativeApi.getPhoneInfo(SysState.SYSSTATE_OS),
                    deviceid: Game.nativeApi.getPhoneInfo(SysState.SYSSTATE_HDID)
                });
                HttpControl.post(GlobalVal.CK_BI_REPORT_URL1, data, null);
                break;
            case BI_TYPE.MISSION:
                Object.assign(data, JSON.parse(jsonParm));
                HttpControl.post(GlobalVal.CK_BI_REPORT_URL2, data, null);
                break;
        }
    }

    private BIReportEvt(mission_type:MISSION_TYPE ,mission_level:MISSION_LEVEL ,event_name:string ,event_ID:string ,event_OK:MISSION_STATE = MISSION_STATE.SUCC) {
        if (GlobalVal.serverType != ServerType.CK &&　GlobalVal.serverType != ServerType.CK_TEST) return;
        let data = {
            user_id:Game.actorMgr.nactordbid,
            token:md5(GlobalVal.TOKEN_FLAG),
            mission_type: mission_type,
            mission_level: mission_level,
            event_name: event_name,
            event_ID: event_ID,
            event_OK: event_OK
        };
        HttpControl.post(GlobalVal.CK_BI_REPORT_URL2, data, null);
    }

    private ckBreakPoint(type:string , extension:string) {
        if (cc.sys.isNative) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "ckBreakpoint", "(Ljava/lang/String;Ljava/lang/String;)V", type, extension);
        }
    }
}