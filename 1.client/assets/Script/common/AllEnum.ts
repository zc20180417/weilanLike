

/**伤害目标位置 */
export enum EHitPoint {
    /**自身 */
    SELF = 1,
    TARGET = 2,
}

/**作用对象 */
export enum ETargetType {
    /**敌方 */
    ENEMY = 0,
    /**自己 */
    SELF = 1,
    /**友方 */
    FRIENDS = 2,
}

export enum ESoundEftName {
    CLICK_COMMON = "sound/click_common_1",
    /**点击不能点击的按钮 */
    CLICK_ERROR = "sound/error",
    /**点击升级 */
    CLICK_UPGRADE = "sound/levelup",
    /**强化 */
    QIANG_HUA = "sound/qianghua",
    /**淬炼 */
    CUI_LIAN = "sound/qianghuacg",
    /**重铸 */
    CHONG_ZHU = "sound/chongzhu",
}

/*** 物品类型*/
export enum ItemType {
    /**货币类 */
    MONEY = 1,
    /**魔法类 */
    SPELL = 2,
    /**宝箱类 */
    BOX = 3,
    /**卡片类 */
    CARD = 4,
    /**皮肤类 */
    SKIN = 5,
    /**芯片类 */
    SLUG = 6,
}

export enum TimeLineType {
    NONE,
    GLOBAL,
    WORKER,
    WAR,
    PVP,
    SCENE_OBJ,
}

export enum ESceneType {
    DEFAULT,
    WORLD,
    WAR,
    PVP,
}

/**货币类物品类型 */
export enum ItemMoneyType {
    /**喵币 */
    GOLD = 1,
    /**钻石 */
    DIAMOND,
    /**能量 */
    ENERGY,
    /**罐头 */
    CAN,
    /**体力 */
    TILI,
    /**芯片 */
    SLUG,
}

/**物品子类 */
export enum ItemSubType {

}

export enum EMODULE {
    ITEM = "item",
    CHECKPOINT = "checkpoint",
    CPTASK = "cptask",
    TILI = "tili",
    TOWER_STAR_SYS = "TOWER_STAR_SYS",        //炮塔升星系統
    CHAPTER = "CHAPTER",  //章节
    /**科技 */
    SCIENCE = "science",

    HIDECP = 'hidecp',
    //全局系统变量
    GLOBAL_FUNC = "GLOBAL_FUNC",

    ADDICTION = "ADDICTION",//防沉迷
    /**系统指引 */
    SYSTEM_GUIDE = "SYSTEM_GUIDE",
    WAR_BULLET_CHAT = 'WAR_BULLET_CHAT_',

    NEW_MONSTER_TOWER_TIPS = "new_monster_tower_tips",      //新怪物、新炮塔提示
    LD_GAME = "LD_GAME",
}

export enum EffectCompType {
    ROTATE = 1,
}

export enum Towertype {//炮塔类型
    SINGLE = 1,//单体
    AOE,//范围
    SLOWDOWN,//减速
    SPLIT,//分裂
    POISONING,//中毒
    THROUGH,//穿透
    INCOME,//收益
    SUPER,//超能
}

export const TowerTypeName = [//炮塔类型对应名称
    "单体",
    "范围",
    "减速",
    "群攻",
    "毒素",
    "穿透",
    "钱财",
    "超能"
]

export enum PropType {//属性类型
    ATTACH = 1,//攻击力
    SPEED,//攻击速度
    RANGE,//攻击范围
    OTHER//其他
}

export enum BindPointAnchorY {
    CENTER,
    BOTTOM,
    TOP,
}

//品质颜色
export const QUALITY_LIGHT_COLOR = {
    "1": "#73d980",
    "2": "#09B7FE",
    "3": "#7908ff",
    "4": "#ffba01",
    "5": "#ff898e",
}

export const QUALITY_BG_COLOR = {
    "1": "#73d980",
    "2": "#09B7FE",
    "3": "#8d6cff",
    "4": "#f4a932",
    "5": "#ff4b53",
}

export const TOWER_OUTLINE_COLOR = {
    "1": "#88ff63",
    "2": "#49fffd",
    "3": "#f33aff",
    "4": "#ffec13",
    "5": "#ae0213",
}

export const QUALITY_OUTLINE_COLOR = {
    "1": "#2e2900",
    "2": "#004b7a",
    "3": "#62007A",
    "4": "#BA7B00",
    "5": "#c50000",
}

export enum EDir {
    LEFT,
    RIGHT,
    TOP,
    BOTTOM,
}

export enum EDirStr {
    LEFT = "left",
    RIGHT = 'right',
    TOP = 'up',
    BOTTOM = 'down',
}
/**游戏状态 */
export enum GameState {
    NONE,
    /**游戏中 */
    PLAYING,
    /**成功 */
    SUCCESS,
    /**失败 */
    FAIL,
    /**复活中 */
    REVICE,
}

export enum Channel {
    xw = "tf_xw001",
    tt1 = 'toutiao1',
    tt2 = 'toutiao2',
}

export const QUALITY_COLOR = {
    "1": "#73d980",
    "2": "#09B7FE",
    "3": "#b085e5",
    "4": "#f5cb55",
    "5": "#ff4b53",
}

export const TOWER_TXT_COLOR = {
    "1": "#5fa258",
    "2": "#5773b8",
    "3": "#8367aa",
    "4": "#b48207",
    "5": "#b4070f",
}

//炮塔未解锁遮罩颜色
export const TOWER_MASK_BGCOLOR = {
    "1": "#5fa258",
    "2": "#041361",
    "3": "#2b0152",
    "4": "#644907",
    "5": "#a01823",
}

export const MAP_GRID_FRAME_COLOR = {
    '0': '#dd35fd',
    '1': "#fcd637",
    '2': '#dd5858',
    '3': '#0880fa',
    '4': '#ffffff',
    '7': '#fc85b5',


    'blue': '#dd5858',
    'red': '#0880fa',

}

/**阵营 */
export enum ECamp {
    BLUE = 1,
    RED = 2,
    COOPERATE = 3,
}

export const GLOBAL_FUNC = {
    ADVENTURE: 1,           //冒险模式
    CAT_HOUSE: 2,           //猫咪公寓
    DAILY_CP: 3,            //每日关卡
    PVP: 4,                 //对战模式
    YONGBING: 11,           //猫咪
    MALL: 12,               //商城
    TUJIAN: 13,             //图鉴
    TASK: 14,               //任务
    SCIENCE: 15,            //天赋
    TREATRUE: 16,           //宝箱
    INVITE: 17,             //邀请
    REDPACKET: 18,          //奖品兑换
    SIGN: 19,               //每日签到
    EMAIL: 20,              //邮箱
    DUIHUAN: 21,            //兑换
    FRIEND: 22,             //好友
    DISCOUNT: 23,           //打折屋
    YUEKA: 24,              //月卡
    FIRST_RECHARGE: 25,     //首冲
    VIP: 26,                //贵宾特权
    NOVICE: 27,             //新手宝典
    DOUBLE_RECHARGE: 28,    //双倍充值
    CERTIFICATION: 29,      //实名认证
    ACTIVITE: 30,           //活动
    JIJIN: 31,              //基金
    ACTIVE_HALL: 32,         //活动大厅
    BATTLE_PASS: 33,         //闯关通行证
    WAR_TASK: 34,            //关卡任务
    TURN_TABLE: 35,          //大转盘
    HARD_CP: 36,            //困难模式
    COOPERATE: 37,          //合作模式
    LOGIN_FUND: 38,          //登录基金
    CHALLENGE: 39,          //挑战
    NEW_SEVICE_RANK: 40,    //开服冲榜
    BATTLE_PASS3: 41,        //闯关基金3         
    BATTLE_PASS4: 42,        //闯关基金4  
    FESYIVAL_ACTIVITY: 43,   //节日活动       
    SHOP_DIAMOND_2: 44,      //钻石档位2       
    SHOP_DIAMOND_3: 45,      //钻石档位3       
    SHOP_DIAMOND_4: 46,      //钻石档位4       
}

export const GLOBAL_FUNC_NAME = {
    [GLOBAL_FUNC.ADVENTURE]: "冒险模式",
    [GLOBAL_FUNC.CAT_HOUSE]: "猫咪公寓",
    [GLOBAL_FUNC.DAILY_CP]: "每日关卡",
    [GLOBAL_FUNC.PVP]: "对战模式",
    [GLOBAL_FUNC.YONGBING]: "猫咪",
    [GLOBAL_FUNC.MALL]: "商城",
    [GLOBAL_FUNC.TUJIAN]: "图鉴",
    [GLOBAL_FUNC.TASK]: "任务",
    [GLOBAL_FUNC.SCIENCE]: "天赋",
    [GLOBAL_FUNC.TREATRUE]: "宝箱",
    [GLOBAL_FUNC.INVITE]: "邀请",
    [GLOBAL_FUNC.REDPACKET]: "奖品兑换",
    [GLOBAL_FUNC.SIGN]: "每日签到",
    [GLOBAL_FUNC.EMAIL]: "邮箱",
    [GLOBAL_FUNC.DUIHUAN]: "兑换",
    [GLOBAL_FUNC.FRIEND]: "好友",
    [GLOBAL_FUNC.DISCOUNT]: "打折屋",
    [GLOBAL_FUNC.YUEKA]: "月卡",
    [GLOBAL_FUNC.FIRST_RECHARGE]: "首冲",
    [GLOBAL_FUNC.VIP]: "贵宾特权",
    [GLOBAL_FUNC.NOVICE]: "新手宝典",
    [GLOBAL_FUNC.DOUBLE_RECHARGE]: "双倍充值",
    [GLOBAL_FUNC.CERTIFICATION]: "实名认证",
    [GLOBAL_FUNC.ACTIVITE]: "钢铁侠",
    [GLOBAL_FUNC.JIJIN]: "闯关基金",
    [GLOBAL_FUNC.ACTIVE_HALL]: "活动大厅",
    [GLOBAL_FUNC.BATTLE_PASS]: "闯关通行证",
    [GLOBAL_FUNC.WAR_TASK]: "关卡任务",
    [GLOBAL_FUNC.TURN_TABLE]: "大转盘",
    [GLOBAL_FUNC.HARD_CP]: "困难模式",
    [GLOBAL_FUNC.COOPERATE]: "合作模式",
    [GLOBAL_FUNC.DAILY_CP]: "每日关卡",
    [GLOBAL_FUNC.LOGIN_FUND]: "登录基金",
    [GLOBAL_FUNC.CHALLENGE]: "挑战模式",
    [GLOBAL_FUNC.NEW_SEVICE_RANK]: "开服冲榜",
}

//章节名称
export const CHAPTER_NAME = {
    "1": "香草森林",
    "2": "奶油冰川",
    "3": "苏打海洋",
    "4": "辣酱火山",
    "5": "焦糖沙漠",
    "6": "芥末沼泽",
    "7": "蜂蜜殿堂",
}

export enum EGetOaidState {
    NONE,
    ACTIVE,
    LOGIN,
    RECHARGE,
    REGISTER,
}

export enum BulletChatState {
    NONE,
    REQUEST,
    IS_SEND,
}

export enum WarEventType {
    CREATE_TOWER = 1,
}

export enum ExperienceWarID {
    LEI_SHEN = 2001,
}

export enum EnterMapSceneType {
    Normal,
    BackFail,
    BackNormal,
}

/**
 * 生物状态
 */
export enum E_STATUS {
    //冰冻
    FROZEN = 1,
    //石化
    SHIHUA = 2,
    //击飞
    JI_FEI = 3,
    //受击回血
    HIT_BLOOD_RETURN = 4,

}

/**陷阱 */
export enum E_TRAP {
    //加速
    JIAN_SU = 1,
    //毒
    DU,
    //加速
    JIA_SU,
}

//皮肤品质颜色
export const SKIN_QUALITY_COLOR = {
    "0": "#439459",
    "1": "#50689b",
    "2": "#7f4fb7",
    "3": "#c6961f",
    "4": "#cd3741",
}

export enum GAME_TYPE {
    NORMAL,
    PVP,
    COOPERATE,
}

export enum CHANNEL_TYPE {
    XX = 'xx',
    TAPTAP = 'taptap',
    GLOBAL = 'toutiao'
}

//通行证模式
export enum BATTLE_PASS_MODE {
    NORMAL = 0,         //普通
    RMB = 1             //付费
}

export enum BATTLE_PASS_REWARD_MODE {
    NORMAL = 0,         //普通
    RMB = 1,             //付费
    END = 2,               //最终
}

export enum BOUNTRY_TOWER_SKILL_TYPE {
    //(攻击百分比,攻击范围百分比,攻击速度百分比,守护血量加N点，固定加N金币,怪物血量减百分比)
    HURT,
    DIS,
    SPEED,
    HP,
    COIN,
    NANDU,
    MAX,
}

export enum CP_SYSTEM_TYPE {
    //1 暂停 2 取消暂停 3 加速 4 恢复普通速度
    PAUSE = 1,
    RESUME,
    DOUBLE_SPEED,
    NORMAL_SPEED,
    TASK,

}

export enum BUY_COUNT_TYPE {
    BOUNTRY,
    COOPERATE,
}

//失败引导提示类型
export enum GameFailTipsItemType {
    UPGRADE,                //升星猫咪（多次出现，强引导）
    BOX,                    //购买宝箱（多次出现，强引导）
    SCIENCE,                //天赋（多次出现，强引导）
    EQUIP,                  //装备（多次出现，强引导）
    SKIN,                   //皮肤（一次性，强引导）
    ZHENRONG,               //阵容搭配（一次性，强引导）
    QQ,                     //QQ（一次性，强引导）
    GANGTIE,                //钢铁（一次性，强引导）
    TONG_XING_ZHENG,        //同行证（一次性，强引导）
    UPGRADE2,               //升星猫咪（无引导）
    SCIENCE2,               //天赋（无引导）
    EQUIP2                  //装备（无引导）
}

export enum InviteType {
    PVP,
    COOPERATE
}

export enum WarBpType {
    ENTER = 1,
    WAR_RESULT = 2,
    GOON = 3,

}

export enum LocalActiveId {
    CELEBRATION = 1,        //开服盛典
}

export enum StoreType {
    COOPERATE,
    PVP,
    CHALLENGE,
}

export enum NewSeviceRankType {
    COMMON_WAR = 2, //普通关卡闯关
}

export enum CHAT_COMMON_CMD {
    INVITE_PVP = '$101',
    REFUSE_PVP = '$102',
    CANCEL_PVP = '$103',
    INVITE_PVP_TIMEOUT = '$104',
    AGREE_PVP = '$109',
    INVITE_COOPERATE = '$105',
    REFUSE_COOPERATE = '$106',
    CANCEL_COOPERATE = '$107',
    INVITE_COOPERATE_TIMEOUT = '$108',
    AGREE_COOPERATE = '$110',
}

export enum DayTaskType {
    None = 0,   //无法跳转到具体界面
    Ad = 1,         //广告
    War = 2,        //挑战任意关卡
    ConsumeDiamond = 3,//消耗钻石
    HideWar = 4,       //隐藏关
    UpgradeTower = 5,   //升星猫咪
    Pvp = 6,   //对战
    Cooperate = 7,   //参与合作模式
    AddFriend = 8,   //添加好友
    Chapter = 9,   //完成章节
    WarChatBullet = 10,   //留言板
    Challenge = 11,   //每日挑战
    Skin = 12,   //皮肤获取
    Equip = 13,   //装备获取
    Science = 14,   //天赋
    GetTower = 15,   //猫咪获取
}

export enum FestivalActivityTaskType {
    LeiChong = 0,
    LeiChou = 1,
    Daily = 2,
}

export enum ACTIVE_TAQING_PAGE_INDEX {
    SIGN,
    LUCKY,
    // HE_CHENG,
    LEI_CHONG,
    TASK,
    SHOP_EXCHANGE,
    LEI_CHOU,
    SHOP_GIFT,
}

export enum PVP_ROBOT_TYPE {
    HIGH,
    NORMAL,
    LOSE,
}

export enum StrengthSkillType {
    HURT = 1,               //伤害
    DURATION = 2,           //持续时间
    DAMAGE_SCOPE = 3,       //伤害范围
    HIT_TARGET_COUNT = 4,   //命中目标数量
    RELEASE_TIMES = 5,      //释放次数
    SKILL_AMMO_COUNT = 6,   //子弹数量
    RELEASE_TIMES_MULTIPLE = 7, //释放次数倍数
    CRITICAL = 8,  //暴击率增加万分比
    CONFLATE_WEIGHT = 9,                //合成同英雄权重增加
    CRITICAL_ADD_RELEASE_TIMES = 10,    //暴击时增加释放次数
    REDUCTION_DAMAGE = 11,              //减少伤害万分比
    BLOOD_MAX = 12,                     //血量上限增加万分比
    DAMAGE_REBOUND = 13,                //伤害反弹万分比
    HIT_COUNT_MAX_ADD = 14,                //命中目标数量上限增加
    SKILL_BUFF_TIME_ADD = 15,              //技能buff时间增加






}

/**
 * buff 类型
 */
export enum BuffType {
    TREAT = 1,                           //治疗
    ADD_ATTACK_SPEED = 2,                //加攻击速度
    DEEPENING_DAMAGE = 3,                //伤害加深
    IMPRISONMENT = 4,                    //禁锢
    NUMB = 5,                           //麻痹
    BURN = 6,                           //灼烧
    TAUNT = 7,                          //嘲讽  
    BEAT_BACK = 8,                      //击退
    TREAT_REDUCE = 9,                   //治疗减少万分比
    VERTIGO = 10,                       //眩晕
    IMMUNE_CTRL = 11,                   //免疫控制

}

/**
 * buff覆盖方式
 */
export enum BuffCoverType {
    COVER,                           //0:覆盖，高级的盖掉低级的
    COEXIST,                         //1:共存
    TIME_ADD,                        //2:时间叠加
    TIME_COVER,                      //3:时间覆盖
    EXCLUDE,                         //4:排斥
}

/**
 * 角色状态标志位
 */
export enum CreatureState {
    NONE = 0,
    INVINCIBLE = 1 << 1,                                                    //无敌，免疫所有伤害 
    IMPRISONMENT = 1 << 2,                                                  //监禁，无法移动
    HIT_FLOAT = 1 << 3,                                                     //击飞状态
    SILENT = 1 << 4,                                                        //沉默
    VERTIGO = 1 << 5,                                                       //眩晕
    NUMB = 1 << 6,                                                          //麻痹
    TAUNT = 1 << 7,                                                         //嘲讽
    DEATH_RECOVER = 1 << 8,                                                 //濒死回血状态
    SPRINT = 1 << 9,                                                        //冲刺


    CTRL = IMPRISONMENT | HIT_FLOAT | VERTIGO | TAUNT | NUMB,               //控制


    DONT_MOVE = HIT_FLOAT | IMPRISONMENT | VERTIGO | NUMB,                              //限制移动（击飞 监禁 眩晕+麻痹）
}

export enum TriggerSkillType {
    HIT_PROBABILITY = 1,                                                        //命中概率触发
    RELEASE_SKILL_TIMES = 2,                                                    //释放技能次数触发
    RANGE_HIT_PROBABILITY = 3,                                                  //范围命中概率触发
    CRITICAL = 4,                                                               //暴击时触发
    DIED                     = 5,                                                    //死亡触发
    NOW                      = 6,                                                    //即时触发
    BE_BORN                  = 7,                                                    //出生时触发

}

//寻找目标类型
export enum FindTargetType {
    BLOOD_MIN,                      //血量最少
    BLOOD_MAX,                      //血量最多
    RANDOM,                         //随机
    DISCOUNT,                       //距离最近
    BLOOD_RATE_MIN,                 //血量百分比最少
    DISCOUNT_SELF,                  //距离自身最近

}

/**
 * 技能击中目标范围类型
 */
export enum SkillHitRangeType {
    NONE,                               //目标 单体
    CIRCLE_TARGET,                      //以目标为中心的圆形         
    CIRCLE_SELF,                        //以自身为中心的圆形         
    SECTOR,                             //扇形
    RECT,                               //矩形
    SELF_RECT,                          //自身为起点矩形
    ALL,                                //全体
    RANDOM_ANGLE_RECT,                  //随机角度的矩形
}


/**
 * 属性类型
 */
export enum PropertyId {
    MAX_HP = 1,                         //1 血量   
    ATTACK,                             //2 攻击
    DEFENSE,                            //3 防御
    MAX_HP_RATIO,                       //4 万分比血量
    ATTACK_RATIO,                       //5 万分比攻击
    DEFENSE_RATIO,                      //6 万分比防御
    BASE_PROPERTY,                      //7 基础属性
    CRI_RATE,                           //8 万分比暴击率
    CRI_DAMAGE,                         //9 万分比暴击伤害
    CRI_RATE_REDUCE,                    //10 *降低万分比暴击率
    CRI_DAMAGE_REDUCE,                  //11 *降低万分比暴击倍率
    SPEED,                              //12 移动速度
    SPEED_RATIO,                        //13 万分比移动速度
    HP,                                 //14 当前血量
    DEEPENING_DAMAGE,                   //15 伤害加深万分比
    REDUCTION_DAMAGE,                   //16 伤害减免万分比
    CUR_HP_RATIO,                       //17 当前血量万分比

    KING_ATTACK = 101,//	国王攻击力
    KING_CRI = 102,//	国王暴击率
    KING_CRI_DAMAGE = 103,//	国王暴击伤害
    KING_ATTACK_SPEED = 104,//	国王攻击速度（针对普攻）
    KING_DEEPENING_DAMAGE = 105,//	国王增伤（先针对所有技能，后续看情况是否拆开）
    KING_CD = 106,//	国王技能冷却缩短（先针对所有技能，后续看情况是否拆开）
    HERO_ATTACK = 107,//	全英雄攻击力
    HERO_CRI = 108,	//暴击率
    HERO_CRI_DAMAGE = 109,//	暴击伤害系数
    HERO_DEEPENING_DAMAGE = 110,//	全体英雄增伤
    SOMMON_BLOOD_RATE = 111,//	全体召唤物血量系数（主角也能召唤）
    KING_FROZEN_DEEPENING_DAMAGE = 112,//	对国王冰封的单位增伤
    CAREER_ATTACK_1 = 113,//	[战士]攻击力
    CAREER_ATTACK_2 = 114,//	[法师]攻击力
    CAREER_ATTACK_3 = 115,//	[射手]攻击力
    CAREER_ATTACK_4 = 116,//	[毒师]攻击力
    CAREER_ATTACK_5 = 117,//	[召唤]攻击力
    CAREER_ATTACK_6 = 118,//	[控制]攻击力
    CAREER_ATTACK_7 = 119,//	[辅助]攻击力
    CAREER_CRI_1 = 120,//	[战士]附加暴击率
    CAREER_CRI_2 = 121,//	[法师]附加暴击率
    CAREER_CRI_3 = 122,//	[射手]附加暴击率
    CAREER_CRI_4 = 123,//	[毒师]附加暴击率
    CAREER_CRI_5 = 124,//	[召唤]附加暴击率
    CAREER_CRI_6 = 125,//	[控制]附加暴击率
    CAREER_CRI_7 = 126,//	[辅助]附加暴击率
    CAREER_CRI_DAMAGE_1 = 127,//	[战士]暴击率伤害
    CAREER_CRI_DAMAGE_2 = 128,//	[法师]暴击率伤害
    CAREER_CRI_DAMAGE_3 = 129,//	[射手]暴击率伤害
    CAREER_CRI_DAMAGE_4 = 130,//	[毒师]暴击率伤害
    CAREER_CRI_DAMAGE_5 = 131,//	[召唤]暴击率伤害
    CAREER_CRI_DAMAGE_6 = 132,//	[控制]暴击率伤害
    CAREER_CRI_DAMAGE_7 = 133,//	[辅助]暴击率伤害
    CAREER_DEEPENING_DAMAGE_1 = 134,//	[战士]增伤
    CAREER_DEEPENING_DAMAGE_2 = 135,//	[法师]增伤
    CAREER_DEEPENING_DAMAGE_3 = 136,//	[射手]增伤
    CAREER_DEEPENING_DAMAGE_4 = 137,//	[毒师]增伤
    CAREER_DEEPENING_DAMAGE_5 = 138,//	[召唤]增伤
    CAREER_DEEPENING_DAMAGE_6 = 139,//	[控制]增伤
    CAREER_DEEPENING_DAMAGE_7 = 140,//	[辅助]增伤
    CAREER_DEEPENING_DAMAGE_MAX_1 = 141,//	最高星[战士]增伤
    CAREER_DEEPENING_DAMAGE_MAX_2 = 142,//	最高星[法师]增伤
    CAREER_DEEPENING_DAMAGE_MAX_3 = 143,//	最高星[射手]增伤
    CAREER_DEEPENING_DAMAGE_MAX_4 = 144,//	最高星[毒师]增伤
    CAREER_DEEPENING_DAMAGE_MAX_5 = 145,//	最高星[召唤]增伤
    CAREER_DEEPENING_DAMAGE_MAX_6 = 146,//	最高星[控制]增伤
    CAREER_DEEPENING_DAMAGE_MAX_7 = 147,//	最高星[辅助]增伤
    CAREER_CD_1 = 148,//	[战士]技能冷却缩短
    CAREER_CD_2 = 149,//	[法师]技能冷却缩短
    CAREER_CD_3 = 150,//	[射手]技能冷却缩短
    CAREER_CD_4 = 151,//	[毒师]技能冷却缩短
    CAREER_CD_5 = 152,//	[召唤]技能冷却缩短
    CAREER_CD_6 = 153,//	[控制]技能冷却缩短
    CAREER_CD_7 = 154,//	[辅助]技能冷却缩短
    SOMMO_HP_ADD = 155,//	召唤物血量增加
    CTRL_TIME_ADD = 156,//	控制时长增加
    VERTIGO_TIME_ADD = 157,//	眩晕时间增加
    FROZEN_TIME_ADD = 158,//	冰冻时间增加
    CW_HP = 159,//	城墙血量
    CW_SHIELD = 160,//	城墙护盾值
    CW_INJURY_FREE_TIMES = 161,//	城墙免伤次数
    CW_BO_ADD_HP = 162,//	城墙每波怪物回复血量
    CW_BO_ADD_HP_RATE = 163,//	城墙每波怪物回复百分比血量
    CW_CONFLATE_ADD_HP = 164,//	每次合成满英雄回复血量
    CW_CONFLATE_MAX_ADD_HP = 165,//	每次合成满星英雄回复血量
    CW_KILL_BOSS_ADD_HP = 166,	//杀死BOSS和精英怪物后回复百分比血量
    CW_REDUCTION_DAMAGE = 167,//	城墙伤害减免系数
    CW_LOWER_DAMAGE_AMMO = 168,//	城墙受到远程怪伤害减少(具体值)
    CW_LOWER_DAMAGE_SPEED = 169,//	城墙受到速度怪伤害减少(具体值)
    CW_LOWER_DAMAGE_MEAT = 170,//	城墙受到肉盾怪伤害减少(具体值)
    CW_LOWER_DAMAGE_FLY = 171,//	城墙受到飞行怪伤害减少(具体值)
    CW_LOWER_DAMAGE_BOSS = 172,//	城墙受到BOSS和精英怪伤害减少(具体值)
    CW_REDUCTION_DAMAGE_AMMO = 173,	//远程怪伤害抵抗
    CW_REDUCTION_DAMAGE_SPEED = 174,	//速度怪伤害抵抗
    CW_REDUCTION_DAMAGE_MEAT = 175,//	肉盾怪伤害抵抗
    CW_REDUCTION_DAMAGE_FLY = 176,//	飞行怪伤害抵抗
    CW_REDUCTION_DAMAGE_BOSS = 177,//	BOSS和精英怪伤害抵抗
    //地图增伤
    DEEPENING_DAMAGE_MAIN = 178,//	主线增伤
    DEEPENING_DAMAGE_COOPERATE = 179,//	合作模式增伤
    DEEPENING_DAMAGE_PVP = 180,//	竞技场增伤
    DEEPENING_DAMAGE_COIN = 181,//	金币副本增伤
    DEEPENING_DAMAGE_GUILD = 182,//	公会BOSS增伤
    //对怪物类型增伤
    DEEPENING_DAMAGE_NEGATIVE = 183,//	对所有负面状态的怪物增伤
    DEEPENING_DAMAGE_FLY = 184,//	对飞行怪物增伤百分比
    DEEPENING_DAMAGE_SPEED = 185,//	对速度怪物增伤百分比
    DEEPENING_DAMAGE_MEAT = 186,//	对肉盾怪物增伤百分比
    DEEPENING_DAMAGE_AMMO = 187,//	对远程怪物增伤百分比
    DEEPENING_DAMAGE_BOSS = 188,	//对BOSS和精英怪物增伤百分比
    DEEPENING_DAMAGE_BO_3_BEFORE = 189,//	前三波怪物增伤系数
    CRI_BO_3_BEFORE = 190,//	前三波怪物增加暴击系数
    DEEPENING_DAMAGE_BO_3_AFTER = 191,//	三波之后怪物增伤系数
    DEEPENING_DAMAGE_BO_7_AFTER = 192,//	第七波之后增伤系数
    CRI_BO_7_AFTER = 193,//	第七波之后增加暴击系数
    CAREER_RESISRANCE_REDUCTION_1 = 194,//	[战士]抗性穿透
    CAREER_RESISRANCE_REDUCTION_2 = 195,//	[法师]抗性穿透
    CAREER_RESISRANCE_REDUCTION_3 = 196,//	[射手]抗性穿透
    CAREER_RESISRANCE_REDUCTION_4 = 197,//	[毒师]抗性穿透
    CAREER_RESISRANCE_REDUCTION_5 = 198,//	[召唤]抗性穿透
    CAREER_RESISRANCE_REDUCTION_6 = 199,//	[控制]抗性穿透
    CAREER_RESISRANCE_REDUCTION_7 = 200,//	[辅助]抗性穿透
    CW_FULL_HP_DEEPENING_DAMAGE = 201,//	城墙满血时增伤
    CW_FULL_HP_CRI = 202,//	城墙满血时增加暴击率
    CW_30_HP_DEEPENING_DAMAGE = 203,//	城墙30%血量时增伤系数
    CW_30_HP_CRI = 204,//	城墙30%血量时暴击伤害增加
    DEEPENING_DAMAGE_TO_SOMMON = 205,//	对[召唤物]增伤
    DEEPENING_DAMAGE_TO_CW = 206,//	对[城墙]增伤
    REDUCTION_DAMAGE_TO_CAREER_1 = 207,//	[战士]伤害抗性+
    REDUCTION_DAMAGE_TO_CAREER_2 = 208,//	[法师]伤害抗性+
    REDUCTION_DAMAGE_TO_CAREER_3 = 209,//	[射手]伤害抗性+
    REDUCTION_DAMAGE_TO_CAREER_4 = 210,//	[毒师]伤害抗性+
    REDUCTION_DAMAGE_TO_CAREER_5 = 211,//	[召唤]伤害抗性+
    REDUCTION_DAMAGE_TO_CAREER_6 = 212,//	[控制]伤害抗性+
    REDUCTION_DAMAGE_TO_CAREER_7 = 213,//	[辅助]伤害抗性+
    REDUCTION_DAMAGE_TIMES = 214,//	伤害免伤次数
    DODGE = 215,	//[英雄职业]闪避
    CTRL_BUFF_TIME_ADD = 216,//	[受控制的/眩晕/冰冻/灼烧/中毒]时间延长
    CTRL_BUFF_TIME_REDUCE = 217,//	[受控制的/眩晕/冰冻/灼烧/中毒]时间缩短
    POISON_DAMAGE_ADD = 218,//	[灼烧/中毒]伤害增加
    POISON_DAMAGE_REDUCE = 219,//	[灼烧/中毒]伤害减少
    DAMAGE_REBOUND = 220,	//伤害反弹
    TREAT_REDUCE = 221,	//治疗减免


    DEEPENING_DAMAGE_TO_CAREER_1 = 222,//	[战士]伤害抗性-
    DEEPENING_DAMAGE_TO_CAREER_2 = 223,//	[法师]伤害抗性-
    DEEPENING_DAMAGE_TO_CAREER_3 = 224,//	[射手]伤害抗性-
    DEEPENING_DAMAGE_TO_CAREER_4 = 225,//	[毒师]伤害抗性-
    DEEPENING_DAMAGE_TO_CAREER_5 = 226,//	[召唤]伤害抗性-
    DEEPENING_DAMAGE_TO_CAREER_6 = 227,//	[控制]伤害抗性-
    DEEPENING_DAMAGE_TO_CAREER_7 = 228,//	[辅助]伤害抗性-

    DODGE_TO_CAREER_1 = 229,//	[战士]闪避-
    DODGE_TO_CAREER_2 = 230,//	[法师]闪避-
    DODGE_TO_CAREER_3 = 231,//	[射手]闪避-
    DODGE_TO_CAREER_4 = 232,//	[毒师]闪避-
    DODGE_TO_CAREER_5 = 233,//	[召唤]闪避-
    DODGE_TO_CAREER_6 = 234,//	[控制]闪避-
    DODGE_TO_CAREER_7 = 235,//	[辅助]闪避-


}

export enum E_CAREER {
    ZHAN_SHI = 1,
    FA_SHI = 2,
    SHE_SHOU = 3,
    DU_SHI = 4,
    ZHAO_HUAN = 5,
    KONG_ZHI = 6,
    FU_ZHU = 7,
}

export enum E_CAREER_NAME {
    ZHAN_SHI = "战士",
    FA_SHI = "法师",
    SHE_SHOU = "射手",
    DU_SHI = "毒师",
    ZHAO_HUAN = "召唤",
    KONG_ZHI = "控制",
    FU_ZHU = "辅助",
}



export interface PrizeRollItemData {
    type: number; // 1金币 2英雄
    itemID: number;
    skillId?: number;
    isSelect?: boolean; // 是否选中
    count?: number; // 数量
    coinTitle?:string; //金币称号


}

export enum MonsterDropType {
    SKILL_THREE = 2,    //同英雄三个技能(AAAAA)
    SKILL_TOW = 3,      //同英雄两个技能(AAAA*)
    SKILL_AAABB = 4,    //两英雄俩技能AAABB技能
    SKILL_AABB = 5,     //两英雄俩技能AABB*技能
    SKILL_AAA = 6,      //单英雄单技能AAA**技能
    SKILL_AA = 7,       //单英雄单技能AA***技能
    COIN_1 = 8,       //超量金币
    COIN_2 = 9,       //大量金币
    COIN_3 = 10,       //适量金币
    COIN_4 = 11,       //少量金币
    SKILL_COIN_4 = 12,       //技能AAA金币SS
    SKILL_COIN_5 = 13,       //技能AA金币SSS
    SKILL_COIN_6 = 14,       //技能AA金币SS*
}

export enum FLOAT_DAMAGE_TYPE {
    NORMAL = 1,
    CRIT = 2,
    DODGE = 3,

}

/**被动技能触发类型 */
export enum PassiveTriggerType {
    DEFAULT = 0,//默认一直携带，一般是加属性的
    ATTACK = 1,//攻击时触发（value = 概率）
    CONTINUE_ATTACK = 2,//持续攻击N次时触发 (value = 次数)
    HIT = 3,//被击中时触发（value = 次数）
    HP_ZERO = 4,//血量为0时触发
    SELF_HP_GREATER_THAN = 5,//自身血量高于N时触发
    SELF_HP_LOWER_THAN = 6,//自身血量低于N时触发
    CD_END = 7,//技能CD结束时触发
    SELF_DIED = 8,//自身死亡时触发
    HIT_ON_SOMMON = 9,//被召唤物击中时触发
}

/**被动技能目标类型 */
export enum PassiveTargetType {
    SELF = 0,                   //自己
    SELF_CAMP_HERO = 1,         //自身阵营英雄
    ENEMY = 2,                  //敌方
}

export enum PassiveSkillType {
    ADD_BUFF = 1,               //加buff效果   
    ADD_PROP = 2,               //加属性
    RELEASE_SKILL = 3,          //释放技能
    CREATE_MONSTER = 4,         //创建怪物
    DEATH_RECOVER = 5,          //死亡恢复  
    SPRINT = 6,                 //冲刺  
    
}