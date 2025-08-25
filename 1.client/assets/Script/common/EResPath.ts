export enum EResPath {
    //config
    // = "cfgs/monster",
    //TOWER_CFG = "cfgs/tower",
    //SKILL_CFG = "cfgs/skill",
    // BUFF_CFG = "cfgs/buff",
    CFG = "cfgs/config",

    ROBOT_CMD_CFG = 'cfgs/robot/',
    NAME_CFG = "name",
    TRAP_CFG = "trap",
    PROPERTY_CFG = "property",                                //属性配置
    GAME_COMMON = "game_common",                              //游戏通用配置
    MISSION_MAIN = "mission_main",                            //关卡表
    PVP_MAIN = "pvp_main",                                    //pvp关卡表
    MISSION_BRUSH = "mission_brush",                          //关卡刷怪表
    PVP_BRUSH = "pvp_brush",                                  //pvp关卡刷怪表
    COOPERATE_MAIN = "cooperate_mission_main",                //合作关卡表
    COOPERATE_BRUSH = "cooperate_brush",                      //合作关卡刷怪表
    PASSIVE_SKILL = "PassiveSkill",                           //被动技能ID 

    MONSTER_BOX = "monster_box",                              //怪物盒子
    MONSTER_DROP = "mission_drop",                            //怪物掉落
    HERO = "hero",                                            //英雄
    MAGIC_SKILL_CFG = "magicSkill",
    TOWER_STAR_CFG = "towerStar",
    //关卡索引表
    MISSION_CFG = "mission_info",
    //关卡基本数据
    MISSION_DATA = "mission_data",
    /**关卡任务 */
    MISSION_TASK = "mission_task",
    /**每波怪物数据 */
    MISSION_WAVECASE = "mission_waveCase",
    /**每波数据 */
    MISSION_WAVEDATA = "mission_waveData",
    /**关卡杂项*/
    OTHER_RATIO = "other_Ratio",
    TOWER_SCIENCE_DES = "towerScienceDes",
    /**物品表 */
    ITEM = "item",
    /**科技等级表 */
    SCIENCE_LEVEL = "science_level",
    /**科技基础数据表 */
    SCIENCE_BASE = "science_base",
    /**科技激活 */
    SCIENCE_ACTIVE = "science_active",
    /**随机创建炮塔 */
    RANDOM_TOWER = "random_tower",
    //炮塔权重
    TOWER_WEIGHT = "towerWeight",
    //宝箱
    TREATRUE = "treatrue",
    /**小提示 */
    MISSION_TIPS = "mission_tips",
    /**boss说明书 */
    MONSTER_DES = "monsterDes",
    /** 关卡提示*/
    LV_ITEM_TIPS = "warTips",
    //章节解锁条件
    CHAPTER = "chapter",
    /**变身 */
    //TRANSFORMATION = "cfgs/transformation",

    /**引导 */
    GUIDE_CFG = "guide",
    GUIDE_UI_CFG = "guideUiCfg",
    GUIDE_TIPS_CFG = "cpGuideTips",

    //全局系统变量
    GLOBAL_FUNC = "global",
    // furniture
    FURNITURE_CFG = "furniture",
    //账号表
    ACCOUNT_CFG = "account",
    //红点配置表
    RED_POINT_CFG = "red-point",
    /**系统指引 */
    SYSTEM_GUIDE_CFG = "systemGuide",
    /**战斗事件 */
    WAR_EVENT_CFG = "warEvent",
    BOOK_UNLOCK_CFG = "book_unlock",
    MONSTER = "monster",

    /**ai 配置 */
    AI_CONFIG = 'cfgs/robot/aiConfig',
    /**ai 权重 */
    AI_WEIGHT = 'cfgs/robot/aiWeight',

    /**测试阵容 */
    ROBOT_TEST_CFG = 'cfgs/robot/clientTest',
    /**机器人名字 */
    ROBOT_NAME_CFG = 'cfgs/robot/robotname',

    //夜晚资源表
    NIGHT_RES = "night_res",

    //图鉴炮塔生效科技
    BOOK_TOWER_CFG = "book_tower",

    //图鉴武器配置表
    BOOK_WEAPON_CFG = "book_weapon",

    //tabview面板配置表
    TAB_VIEW_CFG = "cfgs/tabview-config",

    BP_MISSION = "guideBP_mission",

    //新怪物、新炮塔提示
    NEW_MONSTER_TOWER_CFG = "new_monster_tower_tips",

    //炮塔类型描述
    TOWER_TYPE_DES = "tower_type_des",

    //本地活动表
    LOCAL_ACTIVE_CFG = "active",
    ////////////////////////////////////////////////////
    MAP_BG_BASE = "maps/bgs/",
    MAP_CFG_BASE = "maps/cfgs/",
    MAP_TOP_BG = "maps/bgs2/",
    /**路径 */
    MAP_PATHS = "maps/paths/mapPath",
    /**开放地图路径 */
    MAP_PATHS2 = "maps/paths/grid",



    //prefab
    BLOOD = "prefabs/Blood",
    LUO_BO_BLOOD = "prefabs/LuoboBlood",
    BUBBLE = 'prefabs/ui/war/TowerBubble',
    WAR_FACE = 'prefabs/face/WarFace',

    //UI

    MAN_HUA = "prefabs/ui/login/FirstManHua",
    GAME_FAILD_VIEW = "prefabs/ui/ld/GameFaild",
    GAME_START_VIEW = "prefabs/ui/GameStart",
    GAME_SUCCESS_VIEW = "prefabs/ui/ld/GameSuccess",
    CP_TASK_VIEW = "prefabs/ui/CpTaskView",
    COOPERATION_GAME_SUCC_VIEW = "prefabs/ui/CooperationGameSuccess",
    COOPERATION_GAME_FAIL_VIEW = "prefabs/ui/CooperationGameFaild",
    CHALLENGE_VIEW = "prefabs/ui/dayWarRank/DayWarRankView",
    CHALLENGE_SUCC_VIEW = "prefabs/ui/dayWarRank/ChallengeSuccView",
    CHALLENGE_FAIL_VIEW = "prefabs/ui/dayWarRank/ChallengeFaildView",
    CHALLENGE_SHOP_VIEW = "prefabs/ui/dayWarRank/ChallengeShopView",
    GOODS_EFT           = "prefabs/goodsEft/goods_",
    HEAD_EFT           = "prefabs/goodsEft/headEft_",

    /****************************************  炮塔  ****************************************/

    TOWER_STAR_MAIN_VIEW = "prefabs/ui/towerStarSys/towerStarMainNewView",//炮塔培养系统主界面
    TOWER_STAR_FIGHT_VIEW = "prefabs/ui/towerStarSys/towerStarFightView",//炮塔培养系统主界面
    TOWER_STAR_NEW_CARDS_VIEW = "prefabs/ui/towerStarSys/towerStarNewCardView",//炮塔培养系统主界面
    TOWER_STAR_DETAILS_VIEW = "prefabs/ui/towerStarSys/towerStarDetailsView",//炮塔升星详情界面
    TOWER_STAR_LV_UP_VIEW = "prefabs/ui/towerStarSys/towerStarLvUpNewView",//炮塔升星成功界面
    TOWER_STAR_GET_CARD = "prefabs/ui/towerStarSys/getCardView",//获得卡片
    TOWER_STAR_EQUIPMENT_VIEW = "prefabs/ui/towerStarSys/TowerStarEquipmentView",//装备强化
    TOWER_INFO_TIPS = "prefabs/ui/tips/TowerInfoTips",//装备强化

    CP_INFO_VIEW = "prefabs/ui/CpInfoView",
    DEBUG_VIEW = "prefabs/ui/DebugView",
    HU_DIE_JIE_TIPS_VIEW = "prefabs/ui/towerStarSys/HuDieJieTipsView",
    TOWER_3D_PIC = "prefabs/ui/towerStarSys/tower3dPic/",

    CARD_EFT = 'prefabs/effect/cardEft_',
    ACTIVITY_EFT = 'prefabs/effect/activityEffect',
    /****************************************  科技  ****************************************/
    SCIENCE_VIEW = "prefabs/ui/science/ScienceViewNew",
    SCIENCE_DETAIL_VIEW = "prefabs/ui/science/scienceDetailView",
    SCIENCE_TYPE_VIEW = "prefabs/ui/science/ScienceTypeView",

    SKILL_SHOP_VIEW = "prefabs/ui/SkillShopView",
    H5_PAY_VIEW = "prefabs/ui/shop/PayView",
    SHOP_VIEW = "prefabs/ui/shop/shopView",
    NEW_GOODS_VIEW = "prefabs/ui/shop/GetNewGoodsView",
    NEW_GOODS_VIEW2 = "prefabs/ui/shop/GetNewGoodsView2",
    CP_MENU_VIEW = "prefabs/ui/CpMenuView",
    PRIVACY_AGREEMENT_VIEW = "prefabs/ui/login/PrivacyAgreement",
    PRIVACY_AGREEMENT_VIEW2 = "prefabs/ui/login/PrivacyAgreement2",
    PRIVACY_AGREEMENT_VIEW3 = "prefabs/ui/login/PrivacyAgreement3",
    USER_AGREEMENT_VIEW = "prefabs/ui/login/UserAgreement",
    USER_AGREEMENT_VIEW2 = "prefabs/ui/login/UserAgreement2",
    TROPHY_VIEW = "prefabs/ui/trophyView",

    CHAPTER_OVERVIEW_VIEW = "prefabs/ui/chapters/chapterOverviewView",//章节总览界面
    TREATUR_VIEW = "prefabs/ui/treasure/treasureView",
    CARD_BAG_VIEW = "prefabs/ui/treasure/cardBagView",
    CARD_BAG_PREVIEW = "prefabs/ui/treasure/cardBagPreview",
    SETTING_VIEW = "prefabs/ui/settingView",
    LOGIN_VIEW = "prefabs/ui/login/LoginView",
    NOTICE_WEB_VIEW = "prefabs/ui/login/NoticeWebView",
    // DAY_INFO_VIEW = "prefabs/ui/dayInfoView/signView",//签到面板
    NOTICE_VIEW = "prefabs/ui/dayInfoView/noticeView",//公告

    TASK_VIEW = "prefabs/ui/task/TaskView",
    CHAPTER_UNLOCK_VIEW = "prefabs/ui/chapters/chapterUnlockView",
    TUJIAN_VIEW = "prefabs/ui/tujian/tuJianView",

    BOSS_DES_VIEW = "prefabs/ui/des/BossDesView",
    TILI_VIEW = "prefabs/ui/TiliView",

    // RED_PACKET = "prefabs/ui/redPacketView",//红包界面
    PAY_VIEW = "prefabs/ui/PayView",
    BINDING_VIEW = "prefabs/ui/BindingView",

    /****************************************  防沉迷  ****************************************/
    ADDICTION_VIEW = "prefabs/ui/addiction/AddictionView",
    TIME_VIEW = "prefabs/ui/addiction/TimeView",
    EXIST_TIPS_VIEW = "prefabs/ui/addiction/ExistTipsView",
    TO_IDENTIFICATION_View = "prefabs/ui/addiction/ToIdentificationView",
    ADDICTION_TIPS_VIEW = "prefabs/ui/addiction/AddictionTipsView",

    NEW_CAT_VIEW = "prefabs/ui/guide/newCatView",
    BACK_TO_LIFE_VIEW = "prefabs/ui/BackToLifeView",//复活面板
    /**系统指引面板 */
    SYSTEM_GUIDE_VIEW = "prefabs/ui/guide/GuideView",
    SYSTEM_GUIDE_VIEW2 = "prefabs/ui/guide/GuideView2",
    GUIDE_TO_CLICK_BTN_VIEW = "prefabs/ui/guide/GuideToClickBtnView",
    SYSTEM_OPEN_GUIDE_VEW = "prefabs/ui/guide/SystemOpenGuideView",

    SERVICE_VIEW = "prefabs/ui/service/serviceView",
    GLOBAL_FUNC_VIEW = "prefabs/ui/globalFuncTips",
    FEED_BACK_VIEW = "prefabs/ui/feedBackView",
    QUESTION_VIEW = "prefabs/ui/QuestionView",
    // OPEN_RED_PACKET_VIEW = "prefabs/ui/OpenRedPacketView",
    RED_PACKET_EXCHANGE_VIEW = "prefabs/ui/redPacketExchangeView",
    EMAIL_VIEW = "prefabs/ui/email/emailView",
    EMAIL_DETAIL_VIEW = "prefabs/ui/email/emailDetailView",

    EXCHANGE_VIEW = "prefabs/ui/dayInfoView/exchangeView",
    FRIEND_VIEW = "prefabs/ui/friend/friendView",
    FILL_INFO_VIEW = "prefabs/ui/FillInfoView",
    INVITATION_VIEW = "prefabs/ui/invitation/InvitationView",
    ANY_TIPS_VIEW = "prefabs/ui/des/AnyTipsView",
    HEAD_PORTRAIT_VIEW = "prefabs/ui/headSculpture/headPortraitView",//头像界面
    CHANGE_NAME_VIEW = "prefabs/ui/headSculpture/ChangeNameView",
    SET_NAME_VIEW = "prefabs/ui/login/SetNameView",


    FRIEND_INVITE_VIEW = "prefabs/ui/friend/addFriendView",//添加好友面板
    FRIEND_DELETE_VIEW = "prefabs/ui/friend/deleteFriendView",//删除好友面板

    SHARE_DIALOG = "prefabs/ui/share/ShareDialog",

    SCENE_EFFECT_PATH = "prefabs/chapterEft/",
    SHARE_VIEW = "prefabs/ui/share/ShareView",
    BEGIN_BUFF_DIALOG = "prefabs/ui/shop/BeginBuffView",
    ALI_PAY_DIALOG = "prefabs/ui/AlipayView",
    SYSTEM_OPEN_VIEW = "prefabs/ui/des/SystemOpenView",
    DISCOUNT_VIEW = "prefabs/ui/shop/shopDiscountView",//打折商城
    METHOD_VIEW = "prefabs/ui/war/MethodView",
    EQUIP_TIPS_VIEW = "prefabs/ui/equip/EquipTipsView",
    NEW_EQUIP_VIEW = "prefabs/ui/equip/GetNewEquipView",
    NEW_EQUIP_LINE = "prefabs/ui/equip/NewEquipLine",
    TJ_EQUIP_LINE = "prefabs/ui/equip/TjEquipLine",

    RECONNECT_VIEW = "prefabs/ui/des/ReconnectView",
    // QQ_QUN_VIEW = "prefabs/ui/des/QQQunView",
    EXIT_GAME_VIEW = "prefabs/ui/des/ExitGameView",
    CAT_HOUSE_TIPS = "prefabs/ui/des/CatHouseTipsView",
    CAT_HOUSE_FLOOR = "prefabs/ui/catHouse/CatHouseFloorView",
    CAT_HOUSE_SHOP = "prefabs/ui/catHouse/CatHouseShopView",
    CAT_HOUSE_BUY_TIPS = "prefabs/ui/catHouse/CatHouseBuyTips",
    BULLET_CHAT_VIEW = "prefabs/ui/war/BulletChatView",
    CP_HELP_VIEW = "prefabs/ui/war/HelpView",
    BULLET_CHAT_ITEM = "prefabs/ui/war/OtherChat",
    BULLET_CHAT_SWITCH = "prefabs/ui/war/BulletChatSwitch",
    FASHION_VIEW = "prefabs/ui/towerStarSys/FashionView",
    DOWN_LOAD_GAME_VIEW = "prefabs/ui/des/DownLoadGameView",
    LOADING_TIPS = "prefabs/ui/tips/LoadingTips",

    // FASHION_BG = "prefabs/creature/skinBgs/skin_bg_",

    BOUNTRY_TOWER_VIEW = "prefabs/ui/bountyWar/BountyWarView",
    SELECT_BUY_PROP_VIEW = "prefabs/ui/bountyWar/SelectBuyPropDialog",
    BT_GAME_SUCCESS_VIEW = "prefabs/ui/bountyWar/BtGameSuccessView",
    TIME_BACK_VIEW = "prefabs/ui/war/TimeBackView",
    SELECT_BUY_KEY_DIALOG = "prefabs/ui/shop/SelectBuyKeyDialog",
    EVERY_DAY_RECHARGE_VIEW = "prefabs/ui/activity/EveryDayReChargeView",
    YI_YUAN_GOU_VIEW = "prefabs/ui/activity/YiYuanGouView",

    CHAT_VIEW = "prefabs/ui/chat/ChatView",
    CHAT_TIPS = "prefabs/ui/tips/ChatTips",
    FIGHT_INFO_TIPS = "prefabs/ui/tips/PvpTipsInfo",
    /****************************************  图鉴面板  ****************************************/

    MONSTER_DETAIL_VIEW = "prefabs/ui/tujian/monsterDetailView",
    ///////////////////////////////////////////////////////////

    //sound effect
    TowerBulid = "sound/effect/tower/TowerBulid",
    TowerUpgrade = "sound/effect/tower/TowerUpdata",
    TowerSelect = "sound/effect/tower/TowerSelect",
    TowerDeselect = "sound/effect/tower/TowerDeselect",
    TowerSell = "sound/effect/tower/TowerSell",
    TowerBulidDefend = "sound/effect/tower/TowerBuildDefend",

    TaskFinished = "sound/effect/task/taskFinished",

    LOCK = "sound/effect/sceneItem/lock",

    CP_SUCC = "sound/effect/cpSuccFail/cp_succ",
    CP_FAIL = "sound/effect/cpSuccFail/cp_fail",
    STAR_UP = "sound/effect/star_up",


    CAT_ON_HIT = "sound/effect/cat_on_hit",
    CP_START_COUNT = "sound/effect/counting",
    CP_READY_GO = "sound/effect/readygo",
    CP_START_COUNT_END = "sound/effect/counting_end",
    CP_LAST_30 = "sound/effect/loop_cp_last_30",
    BOSS_WARING = "sound/effect/boss_waring",
    SOUND_EFFECT_DIR = "sound/effect/",
    GUNEFFECT_DIR = "sound/effect/gunEffect/",
    TASK_SHOW = "sound/effect/taskShow",
    RED = "sound/effect/red",
    RIGHT = "sound/effect/right",

    PINK_CARD = "sound/pink_card",
    YELLOW_CARD = "sound/yellow_card",
    NEW_MONSTER_TOWER = "sound/new_monster_tower",

    //bg sound
    SOUND_BG_DIR = "sound/bg/",
    FOREST_BOSS_BG = "sound/bg/forest_boss_bg",
    FOREST_CHAPTER_BG = "sound/bg/forest_chapter_bg",
    BG_PATH = "sound/bg/",
    PAGE_SOUND = "sound/page",
    MAIN_BG = "sound/bg/main_bg",
    DIE_SOUND = "sound/effect/dieEffect/",
    MAGIC_SOUND = "sound/effect/magicSkill/",

    //cat house

    CAT_HOUSE_SOUND_CLEAR = 'sound/effect/cathouse/clear',
    CAT_HOUSE_SOUND_BUY = 'sound/effect/cathouse/clickBuy',
    CAT_HOUSE_SOUND_DT = 'sound/effect/cathouse/dianti',
    CAT_HOUSE_SOUND_ENTER = 'sound/effect/cathouse/enterFloor',
    CAT_HOUSE_SOUND_SAVE = 'sound/effect/cathouse/needSave',
    CAT_HOUSE_SOUND_BG = 'sound/effect/cathouse/cathouse',

    /////////////////////////////////////////////////////////////////////////

    //transition
    TRANSITION_FOREST = "prefabs/transition/transitionForest",
    TRANSITION_NORMAL = "prefabs/transition/transitionNormal",
    TRANSITION_CLOUD = "prefabs/transition/transitionCloud",
    TRANSITION_WAVE = "prefabs/transition/transitionWave",
    TRANSITION_SUGAR = "prefabs/transition/transitionSugar",
    TRANSITION_FIRE = "prefabs/transition/transitionFire",
    TRANSITION_SAND = "prefabs/transition/transitionSand",
    TRANSITION_MARSH = "prefabs/transition/transitionMarsh",
    TRANSITION_7 = "prefabs/transition/transition_7",
    TRANSITION_COOPERATE = "prefabs/transition/transitionCooperate",



    TRANSITION_FOREST_SOUND = "sound/effect/changeScene/leaf",
    TRANSITION_CLOUD_SOUND = "sound/effect/changeScene/snow",
    TRANSITION_WAVE_SOUND = "sound/effect/changeScene/sea",
    TRANSITION_SUGAR_SOUND = "sound/effect/changeScene/volcano",
    TRANSITION_DESERT_SOUND = "sound/effect/changeScene/desert",
    TRANSITION_CHAPTER_6 = "sound/effect/changeScene/chapter_6",
    TRANSITION_CHAPTER_7_1 = "sound/effect/changeScene/chapter_7_1",
    TRANSITION_CHAPTER_7_2 = "sound/effect/changeScene/chapter_7_2",
    TRANSITION_HIDE = "sound/effect/changeScene/hide",

    REVICE_CAT_SOUND1 = "sound/effect/fuhuo1",
    REVICE_CAT_SOUND2 = "sound/effect/fuhuo2",

    //monster img

    MONSTER_IMG = "textures/monsterImg/",
    TOWER_IMG = "textures/tower/",
    TOWER_SDF = "textures/towerSDF/",
    //creature
    CREATURE_MONSTER = "prefabs/creature/",
    CREATURE_TOWER = "prefabs/creature/towers/",
    CREATURE_SCENCE = "prefabs/sceneItem/",
    SCENCE_EFFECT = "prefabs/effect/",
    EFFECT_BUFF_FREEZE = "prefabs/effect/buff_freeze",

    //chapter
    CHAPTER_SELECT_WAR1 = 'prefabs/ui/chapters/chapter_1',
    CHAPTER_SELECT_WAR2 = 'prefabs/ui/chapters/chapter_2',
    CHAPTER_SELECT_WAR3 = 'prefabs/ui/chapters/chapter_3',
    CHAPTER_SELECT_WAR4 = 'prefabs/ui/chapters/chapter_4',
    CHAPTER_SELECT_WAR5 = 'prefabs/ui/chapters/chapter_5',
    CHAPTER_SELECT_WAR6 = 'prefabs/ui/chapters/chapter_6',
    CHAPTER_SELECT_WAR7 = "prefabs/ui/chapters/chapter_7",

    BOOK_EFFECT = 'prefabs/bookEft',


    //redpoint
    REDPOINTNEW = "prefabs/redPoint/redPointNew",
    REDPOINTDOT = "prefabs/redPoint/redDot",

    MAGIC_SKILL_EFFECT_11 = 'prefabs/propEffect/heartEffect',
    MAGIC_SKILL_EFFECT_12 = 'prefabs/propEffect/slowdownEffect',
    MAGIC_SKILL_EFFECT_13 = 'prefabs/propEffect/speedUpEffect',
    MAGIC_SKILL_EFFECT_14 = 'prefabs/propEffect/snowEffect',
    MAGIC_SKILL_EFFECT_15 = 'prefabs/propEffect/bombEffect',
    EFFECT_SLOW_SNOW = 'prefabs/effect/slowSnow',
    EFFECT_SAND = 'prefabs/effect/sandParticle',
    EFFECT_DU_FOG = 'prefabs/effect/duFogParticle',

    LIU_SHA_EFT = 'prefabs/chapterEft/liusha',
    DU_PAO_PAO = 'prefabs/chapterEft/duPaopao',


    ////////////////////////////////////////////imageLoaderDir


    /****************************************  系统提示  ****************************************/
    UNLOCK_NEW_MONSTER = "prefabs/ui/tips/unlockMonsterTips",
    TASK_FINISHED_TIPS = "prefabs/ui/tips/taskFinishedTips",
    SHOP_DISCOUNT_TIPS = "prefabs/ui/tips/shopDiscountTips",
    SHOP_TREATURE_TIPS = "prefabs/ui/tips/shopTreatureTips",
    PVP_TIPS = "prefabs/ui/tips/pvpTips",
    COOPERATE_INVITE_TIPS = "prefabs/ui/tips/cooperateTips",
    ROLL_TIPS_VIEW = "prefabs/ui/tips/RollTipsView",
    POP_TIPS_VIEW = "prefabs/ui/tips/popTipsView",
    //重新开始的提示
    EXIT_CP_TIPS = "prefabs/ui/tips/ExitCPView",
    //进入关卡的提示
    CPINFO_TIPS = "prefabs/ui/tips/CpinfoTips",
    GAME_FAILD_TIPS_VIEW = "prefabs/ui/tips/GameFailTips",
    LINGDANG_TIPS_VIEW = "prefabs/ui/tips/LingDangTipsView",
    ENERGY_TIPS_VIEW = "prefabs/ui/tips/EnergyTipsView",
    STAR_TIPS_VIEW = "prefabs/ui/tips/StarTipsView",

    DIAANDREDPACKET_TIPS_VIEW = "prefabs/ui/tips/DiaAndRedPacketTipsView",
    ITEM_MASK_TIPS_VIEW = "prefabs/ui/tips/ItemMaskTipsView",
    ITEM_POPUP_TIPS_VIEW = "prefabs/ui/tips/ItemPopupTipsView",
    QUESTION_TIPS_VIEW = "prefabs/ui/tips/QuestionTipsView",
    RICHTEXT_TIPS_VIEW = "prefabs/ui/tips/RichTextTipsView",
    NEW_MOSNTER_TOWER_TIPS_VIEW = "prefabs/ui/tips/NewMonsterCatTipsView",
    NEW_MOSNTER_TOWER_TIPS = "prefabs/ui/tips/NewMonsterCatTips",
    REPEAT_TOWER_TIPS = "prefabs/ui/tips/RepeatTowerTips",

    /****************************************  vip  ****************************************/
    VIP_VIEW = "prefabs/ui/vip/VipView",

    /****************************************  vedio  ****************************************/
    START_VIDEO = "video/start_video",

    /****************************************  活动面板  ****************************************/
    ACTIVE_GANGTIEXIA_VIEW = "prefabs/ui/activity/ActiveGangTieXiaView",
    DOUBLE_RECHARGE_VIEW = "prefabs/ui/activity/DoubleRechargeView",
    ACTIVE_HALL_VIEW = "prefabs/ui/activity/ActiveHallView",
    YUE_KA_VIEW = "prefabs/ui/activity/YuekaNewView",
    FIRST_RECHARGE_VIEW0 = "prefabs/ui/activity/Recharge6View",
    FIRST_RECHARGE_VIEW1 = "prefabs/ui/activity/Recharge30View",
    FIRST_RECHARGE_VIEW2 = "prefabs/ui/activity/Recharge98View",

    BATTLE_PASSPORT_VIEW = "prefabs/ui/tongxingzheng/TXZView",
    DAILY_EQUIP_ACTIVE_TIPS_VIEW = "prefabs/ui/activity/DailyEquipActiveTipsView",
    TURN_TABLE = 'prefabs/ui/activity/TurntableView',
    TURN_TABLE_EXCHANGEVIEW = 'prefabs/ui/activity/TurntableExchangeView',
    // TXZ="",
    LOGINFUND_VIEW = 'prefabs/ui/activity/LoginFundView',
    BATTLEPASS3_VIEW = 'prefabs/ui/activity/BattlePass3View',
    BATTLEPASS4_VIEW = 'prefabs/ui/activity/BattlePass4View2',
    BATTLEPASS4_BUY_VIEW = 'prefabs/ui/activity/BattlePass4BuyView',
    CELEBRATION_VIEW = 'prefabs/ui/activity/CelebrationView',
    NEW_SEVICE_RANK_VIEW = 'prefabs/ui/activity/NewSeviceRankView',
    NEW_SEVICE_RANK_REWARD_TIPS = 'prefabs/ui/activity/NewSeviceRankRewardTipsView',
    ACTIVE_TAQING_VIEW = "prefabs/ui/active_taqing/ActiveTaqingView",
    ACTIVE_TAQING_HELP_TIPS = "prefabs/ui/active_taqing/ActiveTaqingHelpTips",
    ACTIVE_TAQING_TIPS = "prefabs/ui/active_taqing/ActiveTaqingTips",
    ACTIVE_TAQING_LIBAO_TIPS = "prefabs/ui/active_taqing/ActiveTaqingLibaoTips",
    ACTIVE_TAQING_XINYUAN_TIPS = "prefabs/ui/active_taqing/ActiveTaqingXinYuanTips",
    ACTIVE_TAQING_CHOU_JIANG_TIPS = "prefabs/ui/active_taqing/ActiveTaqing_ChouJiangTips",
    ACTIVE_TAQING_SHOP_BATCH_BUY = "prefabs/ui/active_taqing/ActiveTaqingBatchBuy",
    ACTIVE_TAQING_HE_CHENG_TIPS = "prefabs/ui/active_taqing/ActiveTaqingHeChengTips",
    ACTIVE_TAQING_HE_CHENG_HELP_TIPS = "prefabs/ui/active_taqing/ActiveTaqingHeChengHelpTips",

    /****************************************  pvp  ****************************************/
    PVP_MATCH_VIEW = "prefabs/ui/pvp/pvpMatchView",
    PVP_MENU_VIEW = "prefabs/ui/pvp/PvpMenuView",
    PVP_VS_VIEW = "prefabs/ui/pvp/pvpVSView",
    PVP_SHOP_VIEW = "prefabs/ui/pvp/PvpShopView",
    PVP_RANK_INFO_VIEW = "prefabs/ui/pvp/pvpRankInfoView",
    PVP_CHAT_FACE = 'prefabs/face/face_',
    PVP_FIGHTING_TIPS_VIEW = "prefabs/ui/pvp/FightingLevelTipsView",
    PVP_RANKINFO_TIPS_VIEW = "prefabs/ui/pvp/RankInfoTipsView",
    PVP_WIN_VIEW = "prefabs/ui/pvp/pvpWinView",
    PVP_LOSE_VIEW = "prefabs/ui/pvp/pvpLoseView",
    PVP_GAME_START = "prefabs/ui/pvp/PvpGameStart",
    PVP_GUIDE_VIEW = "prefabs/ui/pvp/PvpGuideView",
    PVP_PLAY_INFO_TIPS_VIEW = "prefabs/ui/pvp/pvpPlayInfoTipsView",
    PVP_PATH_START_TIPS = "prefabs/ui/pvp/PvpPathStartBubble",
    PVP_OTHER_MONSTER_TIPS = "prefabs/ui/pvp/PvpOtherMonsterBubble",
    PVP_RANK_TIPS_VIEW = "prefabs/ui/pvp/PvpRankTipsView",
    PVP_RANK_VIEW = "prefabs/ui/pvp/PvpRankView",
    PVP_WEEK_REWARD_VIEW = "prefabs/ui/pvp/PvpWeekRewardTipsView",
    INVITE_FRIEND_PVP_VIEW = "prefabs/ui/pvp/InviteFriendPvPView",
    INVITE_JOIN_PVP_VIEW = "prefabs/ui/pvp/pvpJoinInviteView",
    PVP_DAILY_MATCH_TIPS = "prefabs/ui/pvp/PvpDailyMatchTipsView",
    PVP_DAILY_MATCH_LOSE = "prefabs/ui/pvp/pvpDailyMatchLoseView",
    PVP_DAILY_MATCH_WIN = "prefabs/ui/pvp/pvpDailyMatchWinView",

    /////////////////////////////////pvp sound

    PVP_CLICK_START = 'sound/effect/pvp/pvp_click_start',
    PVP_WIN = 'sound/effect/pvp/pvp_win',
    PVP_FAIL = 'sound/effect/pvp/pvp_fail',
    PVP_START = 'sound/effect/pvp/pvp_start',
    PVP_WAIT = 'sound/effect/pvp/pvp_wait',

    /****************************************  新手宝典  ****************************************/

    NEWHAND_BOOK_VIEW = "prefabs/ui/newhand_book/NewhandBookView",

    /*******************************************  赏金  *********************************************/
    SHANG_JIN = "prefabs/ui/jing_cai/JingCaiView",
    BOUNTY_GAME_WIN = "prefabs/ui/jing_cai/JingCaiSuccView",
    BOUNTY_GAME_FAIL = "prefabs/ui/jing_cai/JingCaiFaildView",
    JING_CAI_TIPS_VIEW = "prefabs/ui/jing_cai/JingCaiTipsView",
    BOUNTY_MODE_DIALOG = "prefabs/ui/jing_cai/BountyModeDialog",
    BOUNTY_BUY_COUNT_VIEW = "prefabs/ui/jing_cai/SelectBuyCountDialog",
    BOUNTY_FIGHT_TOWER_TIPS = "prefabs/ui/jing_cai/BountyFightTowerTipsView",

    /******************************************** 合作模式 *****************************************/

    COOPERATE_VIEW = "prefabs/ui/cooperate/CooperateView",
    COOPERATE_READY_VIEW = "prefabs/ui/cooperate/CooperateReadyView",
    COOPERATE_TIPS = "prefabs/ui/cooperate/CooperateTips",
    INVITE_FRIEND_VIEW = "prefabs/ui/cooperate/InviteFriendView",
    COOPERATE_SHOP = "prefabs/ui/cooperate/CooperateShopView",
    COOPERATE_RANK = "prefabs/ui/cooperate/CooperateRankView",
    COOPERATE_PLAY_TIPS = "prefabs/ui/cooperate/CooperatePlayTipsView",
    COOPERATE_ADD_HURT_VIEW = "prefabs/ui/cooperate/CooperateHurtAddTipsView",
    COOPERATE_SHUAI_ZI = "prefabs/ui/cooperate/AddHurtEftView",
    COOPERATE_REWARD_TIPS = "prefabs/ui/cooperate/CooperateRewardTipsView",
    COOPERATE_GUIDE_VIEW = "prefabs/ui/cooperate/CooperateGuideView",

    /******************************************** 通用图集 *****************************************/
    GAME_UI = "textures/gameUI",
    GAME_UI1 = "textures/ui/GameUI1",
    GAME_UI2 = "textures/ui/GameUI2",
    NUMBER_UI = "textures/ui/headPortrait",
    HEAD_UI = "textures/ui/number",
    CHAPTER_UI = "textures/ui/chapterUi",

    /************************************** 字体资源 *******************************************/
    FONT = "font/font",

    CHAPTER_CUPS_VIEW = "prefabs/ui/chapters/ChapterCupsView",
    TEST = "test",

    TEN_CARDS_VIEW = "prefabs/ui/tencards/tenCardsView",
    TEN_CARDS_TIPS_VIEW = "prefabs/ui/tencards/tenCardsTipsView",
    TEN_CARDS_CARDS_VIEW = "prefabs/ui/tencards/tenCardsCardsView",

    //-------------------   材质资源    ----------------------
    MATERIAL = "materials/",


    //////////////////////////////////////////////LD
    LD_STRENGTH_SKILL_VIEW = "prefabs/ui/ld/LdStrengthSkillView",
    LD_HERO_SKILL_VIEW = "prefabs/ui/ld/LdHeroSkillView",
    LD_GAME_PAUSE_VIEW = "prefabs/ui/ld/GamePauseView",
    LD_PRIZE_ROLL_VIEW = "prefabs/ui/ld/ClawMachinePrizeRoll",
    LD_HURT_VIEW = "prefabs/ui/ld/LdHeroHurtView",

}