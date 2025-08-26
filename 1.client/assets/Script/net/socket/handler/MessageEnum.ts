export enum TURNTABLE_TYPE {
	PROP = 0,//道具
	GOODS = 1,//实物
};
/////////////////////////////////////////////////////////////////////////
//用户性别定义
export enum ACTOR_SEX {
	ACTOR_SEX_UNKNOWN = 0,	//保密
	ACTOR_SEX_BOY = 1,	//男
	ACTOR_SEX_GIRL = 2,	//女
	ACTOR_SEX_MAX
};

//////////////////////////////////////////////////////////////////////////
//登录方式定义
export enum LOGINTYPE {
	LOGINTYPE_ACCOUNT = 0,	//账号登录
	LOGINTYPE_PHONE = 1,	//手机号码登录
	LOGINTYPE_EMAIL = 2,	//邮箱登录
	LOGINTYPE_WEIXIN = 3,	//微信登录
	LOGINTYPE_TOURIST = 255, //游客登录
	LOGINTYPE_MAX,
};

//////////////////////////////////////////////////////////////////////////
//操作系统定义
export enum SYSTEMTYPE {
	SYSTEMTYPE_PC = 0,	//PC
	SYSTEMTYPE_ANDROID = 1,	//安卓
	SYSTEMTYPE_IOS = 2,	//IOS
	SYSTEMTYPE_SETTOPBOX = 3,	//机顶盒	
	SYSTEMTYPE_MAX
};

export enum LIMITSYSTEM {
	LIMITSYSTEM_PC = 0x1,	//PC客户端
	LIMITSYSTEM_ANDROID = 0x2,	//安卓
	LIMITSYSTEM_IOS = 0x4,	//IOS
	LIMITSYSTEM_SETTOPBOX = 0x8,	//机顶盒
};


//////////////////////////////////////////////////////////////////////////
//支付通路位标示
export enum PAYPLATFLAG {
	PAYPLATFLAG_IOS = 0x00000001,	//苹果内置支付	
	PAYPLATFLAG_WECHAT = 0x00000002,	//微信支付
	PAYPLATFLAG_ALIPAY = 0x00000004,	//支付宝支付	
};

//////////////////////////////////////////////////////////////////////////
//邮件状态定义
export enum EMAILSTATE {
	EMAILSTATE_NEW = 0,	//新邮件
	EMAILSTATE_OPEN = 1,	//已查看邮件
	EMAILSTATE_CLOSE = 2,	//已关闭邮件
};

//邮件正文状态
export enum EMAIL_TEXT_STATE {
	TEXT = 0,//有正文
	NO_TEXT = 5//没有正文
}

//////////////////////////////////////////////////////////////////////////
//商城

export enum MALL_LIMITTYPE {
	MALL_LIMITTYPE_NULL = 0,	//无限制
	MALL_LIMITTYPE_DAY = 1,	//每天
	MALL_LIMITTYPE_WEEK = 2,	//每周
	MALL_LIMITTYPE_MONTH = 3,	//每月
	MALL_LIMITTYPE_LIFE = 4,	//终身
	MALL_LIMITTYPE_MAX
};

//出售类型
export enum MALL_PRICETYPE {
	MALL_PRICETYPE_DIAMONDS = 0,	//钻石购买
	MALL_PRICETYPE_GOODS = 1,	//道具置换购买
	MALL_PRICETYPE_RMB = 2,	//RMB购买	
	MALL_PRICETYPE_FREEVIDEO = 3,	//免费视频
	MALL_PRICETYPE_FREE_DIAMONDS = 4,	//免费(CD期间钻石购买)	
	MALL_PRICETYPE_FREE_GOODS = 5,	//免费(CD期间道具购买)	
};


//角标标签
export enum MALL_FLAG {
	MALL_FLAG_UNKNOWN = 0,		//无效
	MALL_FLAG_HOT = 1,		//热卖
	MALL_FLAG_TOP = 2,		//推荐
};

//物品品质
export enum MALL_QUALITY {
	MALL_QUALITY_NORMAL = 0,	//常规
	MALL_QUALITY_CLASSIC = 1,	//经典
	MALL_QUALITY_EPIC = 2,	//传说
	MALL_QUALITY_LEGEND = 3,	//史诗
};

//////////////////////////////////////////////////////////////////////////
//排行榜
export enum RANKING_TYPE {
	RANKING_TYPE_1 = 0,	//战力榜
	RANKING_TYPE_2 = 1,	//红包榜
	RANKING_TYPE_3 = 2,	//赢金榜
	RANKING_TYPE_4 = 3,	//分享榜
	RANKING_TYPE_MAX
};

//////////////////////////////////////////////////////////////////////////
//炮台类定义
export enum ROLECARDS {
	ROLECARDS_UNKUNOW = 0,	//无效
	ROLECARDS_SINGLEATTACK = 1,	//单体
	ROLECARDS_GROUPATTACK = 2,	//范围
	ROLECARDS_REDUCESPEED = 3,	//减速
	ROLECARDS_MULTIPLE = 4,	//多重
	ROLECARDS_HYPERTOXIC = 5,	//剧毒
	ROLECARDS_PENETRATE = 6,	//穿透
	ROLECARDS_INCOME = 7,	//收益
	ROLECARDS_SUPER = 8,	//超能
	ROLECARDS_MAX
};

//炮台品质定义
export enum RULEQUALITY {
	RULEQUALITY_GREEN = 0,	//绿色
	RULEQUALITY_BLUE = 1,	//蓝色
	RULEQUALITY_VIOLET = 2,	//紫色
	RULEQUALITY_ORANGE = 3,	//橙色
};


//////////////////////////////////////////////////////////////////////////
//炮台攻击类型
export enum ROLEATTACKTYPE {
	ROLEATTACKTYPE_SIGNLINE = 1,	//单体攻击有弹道
	ROLEATTACKTYPE_BOMB = 2,	//爆炸攻击
	ROLEATTACKTYPE_SELFRANGE = 3,	//自身范围攻击
	ROLEATTACKTYPE_SIGN = 4,	//单体无弹道
};

//////////////////////////////////////////////////////////////////////////
//效果类型定义
export enum STATUS_TYPE {
	STATUS_SLOWDOWN = 0,	//减速（千分比或者固定值）
	STATUS_FROZEN = 1,	//冰冻(禁锢移动）
	STATUS_DAMAGE = 2,	//持续伤害(毒性伤害等）
	STATUS_STEALMONEY = 3,	//偷钱（固定值）
	STATUS_ADDDROPMONEY = 4,	//增加死亡掉落金币（掉落翻多倍）
	STATUS_SLOWDOWNRESISTANCE = 5,	//减速免疫（直接抵抗）
	STATUS_FROZENRESISTANCE = 6,	//冰冻免疫（直接抵抗）
	STATUS_DAMAGESISTANCE = 7,	//持续伤害免疫（直接抵抗）
	STATUS_SUPERARMOR = 8,	//无敌（免疫所有负面状态）
	STATUS_ADDHPMAX = 9,	//增加血量上限（千分比或者固定值）
	STATUS_ADDSPACE = 10,	//增加移动速度（千分比或者固定值）
	STATUS_ADDATTACKHP = 11,	//增加伤血量（千分比或者固定值）
	STATUS_BURN = 12,	//灼烧
	STATUS_BURNSISTANCE = 13,	//灼烧免疫
	STATUS_REDUCECD = 14,	//减少CD时间
	STATUS_REDUCEATTACKHP = 15,	//减少伤血量（千分比或者固定值）
	STATUS_ADDSPEED = 16,	//加速(千分比）
	STATUS_RATTACKSPEED = 17,	//减攻速(千分比）
	STATUS_STONECHANGEGOLD = 18,	//点石成金
	STATUS_FLOATING = 19,	//浮空(固定值）
	STATUS_FLOATING_RESISTANCE = 20, ////免疫浮空
	STATUS_STONECHANGEGOLD_RESISTANCE = 21, ////免疫点石成金
	STATUS_CONTROL_RESISTANCE = 22, ////免疫所有控制
	STATUS_BOOM_RESISTANCE = 23, ////免疫被炸药桶炸
	STATUS_USERSKILL	   = 24,	//触发技能
};

//////////////////////////////////////////////////////////////////////////
//物品分类定义
export enum GOODS_TYPE {
	GOODSTYPE_CARD_UNKNOWN = 0,		//未知类型
	GOODSTYPE_CARD_DIAMOND = 1,		//钻石卡													lParam[0]:钻石值
	GOODSTYPE_CARD_STRENGTH = 2,		//体力卡													lParam[0]:体力值
	GOODSTYPR_CARD_SKILL = 3,		//技能卡													lParam[0]:技能ID
	GOODSTYPE_RES_SKIN = 4,		//皮肤资源（最大数量1）										lParam[0]:炮台ID				lParam[1]:外观ID
	GOODSTYPE_RES_REDPACKET = 5,		//红包资源
	GOODSTYPE_RES_ENERGY = 6,		//能量资源(升星资源）
	GOODSTYPE_RES_UPGRADESTAR = 7,		//升星资源(升星卡片）										lParam[0]:对应猫咪ID			lParam[1]:未激活是否限制在打折屋出售						lParam[2]:未激活是否在宝箱掉落
	GOODSTYPE_RES_CHIPS = 8,		//芯片资源(升级天赋资源)	
	GOODSTYPE_RES_FRAGMENT = 9,		//常规碎片
	GOODSTYPE_BOX = 10,		//宝箱														lParam[0]:掉落组合ID			lParam[1]:掉落模式（0:宝箱模式 1:红包模式 2:礼包模式）		lParam[2]:打开模式（0:获得自动打开 1:手动打开）
	GOODSTYPE_CARD_TROOPSEQUIP = 11,		//炮台装备													lParam[0]:可装备的炮台ID		lParam[1]:对应的装备ID
	GOODSTYPE_RES_TROOPSEQUIPLV = 12,		//炮台装备升级材料	
	GOODSTYPE_CARD_INFINITESTRENGTH = 13,		//无限体力卡												lParam[0]:有效天数	
	GOODSTYPE_CARD_FURNITURE = 14,		//家具激活卡												lParam[0]:家具ID
	GOODSTYPE_CARD_SHOWRES = 15,		//展示资源(仅仅用来展示用，不会加入背包，不带逻辑功能）	
	GOODSTYPE_CARD_FACEFRAME = 16,		//头像框激活卡												lParam[0]:头像框ID				lParam[1]:有效时长(0:永久 <0:有效天数）
	GOODSTYPE_CARD_FACE = 17,		//头像激活卡												lParam[0]:头像ID				lParam[1]:有效时长(0:永久 <0:有效天数）
	GOODSTYPE_CARD_TROOPSCARDBAG = 18,		//自选猫咪卡包												lParam[0]-lPram[7]:猫咪ID
	GOODSTYPE_CARD_SPORTSPOINT = 19,		//竞技点卡				
	GOODSTYPE_CARD_COOPERATIONPOINT = 20,		//合作卡点		
	GOODSTYPE_CARD_RENAME = 21,		//改名卡		
	GOODSTYPE_CARD_CHALLENGE		= 22,		//挑战点
	GOODSTYPE_TASK_SCORE		= 24,		//任务积分
	GOODSTYPE_MAX = 64,		//最大物品种类数量
	//其他类型，在程序中不使用的
};


///////////////////////////////////////////////////////////////////////////
//物品id
export enum GOODS_ID {
	DIAMOND = 2,					//钻石
	ENERGY = 3,						//能量
	TILI = 5,						//体力
	LINGDANG = 6,					//铃铛
	REDPACKET = 7,					//红包
	EQUIP_UPGRADE_MATERIAL = 8,		//蝴蝶结
	COOPERATE_SCORE = 17,		//合作点
	CHOUJIANG_QUAN = 56,		//抽奖券
	PVP_CARDS = 94,					//竞技卡包	

}

//////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////
//全局消息码定义
export enum CMD_ROOT {
	CMDROOT_GATEWAY_MSG = 0x0,	//代理前端消息
	CMDROOT_LOGIN_MSG = 0x1,	//登录服务器消息
	CMDROOT_PLAZA_MSG = 0x2,	//广场消息	
	CMDROOT_GAMESERVER_MSG = 0x3,	//游戏服务器消息
	CMDROOT_WEB_MSG = 0x4,	//WEB服务器消息		
	CMDROOT_MAX
};

export enum MessageConst {
	MAX_NET_PACKAGE_SIZE = (1024 * 32),
}

//游戏主消息码定义
export enum GS_PLAZA_MSGID {
	GS_PLAZA_MSGID_INTERNAL = 0,	//	内部数据处理插件,外部不能使用
	GS_PLAZA_MSGID_STATUS = 1,	//	状态		s->c
	GS_PLAZA_MSGID_GOODS = 2,	//	物品		c->s->c	
	GS_PLAZA_MSGID_STRENG = 3,	//	强化		c->s->c
	GS_PLAZA_MSGID_MONSTERMANUAL = 4,	//	怪物图鉴	c->s->c
	GS_PLAZA_MSGID_TIPS = 5,	//	提示		s->c
	GS_PLAZA_MSGID_LOGIN = 6,	//	登录		c->s->c
	GS_PLAZA_MSGID_ACTOR = 7,	//	玩家		s->c
	GS_PLAZA_MSGID_CHAT = 8,	//	聊天		c->s->c
	GS_PLAZA_MSGID_CONTAINER = 9,	//	容器		s->c	
	GS_PLAZA_MSGID_TASK = 10,	//	任务		c->s->c
	GS_PLAZA_MSGID_SIGN = 11,	//	签到		c->s->c
	GS_PLAZA_MSGID_MALL = 12,	//  商城		c->s->c
	GS_PLAZA_MSGID_ACTIVITY = 13,	//	活动		c->s->c
	GS_PLAZA_MSGID_EXCHANGE = 14,	//	兑换		c->s->c
	GS_PLAZA_MSGID_EMAIL = 15,	//	邮件		c->s->c	
	GS_PLAZA_MSGID_PACKET = 16,	//	背包		c->s->c
	GS_PLAZA_MSGID_RANKING = 17,	//	排行榜		c->s->c	
	GS_PLAZA_MSGID_CERTIFICATION = 18,	//	实名认证	c->s->c
	GS_PLAZA_MSGID_SCENE = 19,	//	场景		c->s->c
	GS_PLAZA_MSGID_LARGETURNTABLE = 20,	//	抽奖大转盘	c->s->c
	GS_PLAZA_MSGID_TROOPS = 21,	//	部队		c->s->c	
	GS_PLAZA_MSGID_RELATION = 22,	//	社交		c->s->c	
	GS_PLAZA_MSGID_DISCOUNTSTORE = 23,	//	打折商店	c->s->c
	GS_PLAZA_MSGID_HOUSE = 24,	//	房屋		c->s->c
	GS_PLAZA_MSGID_FASHION = 25,	//	时装		c->s->c
	GS_PLAZA_MSGID_SYSACTIVITY = 26,	//	系统活动	c->s->c
	GS_PLAZA_MSGID_PVP = 27,	//	PVP竞技		c->s->c
	GS_PLAZA_MSGID_NOVICETASK = 28,	//	新手任务	c->s->c
	GS_PLAZA_MSGID_GROWGIFT = 29,	//	成长礼包	c->s->c
	GS_PLAZA_MSGID_BOUNTY				= 30,	//	赏金		c->s->c
	GS_PLAZA_MSGID_ROOM					= 31,	//	房间		c->s->c
	GS_PLAZA_MSGID_BOUNTYTOWER			= 32,	//	赏金爬塔	c->s->c
	GS_PLAZA_MSGID_QQLEVEL				= 33,	//	大玩咖		c->s->c
	GS_PLAZA_MSGID_STORE				= 34,	//	商店		c->s->c
	//GS_PLAZA_MSGID_COOPERATIONSTORE	= 35,	//	合作商店	c->s->c
	GS_PLAZA_MSGID_BOUNTYCOOPERATION	= 36,	//	组队爬塔	c->s->c
	GS_PLAZA_MSGID_LUCKDRAW				= 37,	//	抽奖		c->s->c
	GS_PLAZA_MSGID_CHALLENGE			= 38,	//	挑战		c->s->c
	GS_PLAZA_MSGID_NEWSEVICERANKING		= 39,	//	开服冲榜	c->s->c
	GS_PLAZA_MSGID_ZEROMALL				= 40,	//	零元购		c->s->c
	GS_PLAZA_MSGID_BATTLEPASS			= 41,	//	通行证		c->s->c
	GS_PLAZA_MSGID_FESTIVALACTIVITY		= 42,	//节日活动
	GS_PLAZA_MSGID_MAX
};

export enum ACTOR_CLIENTFLAG {
	CLIENTFLAG_CLIENT1 = 0x1,//客户端使用标识1
	CLIENTFLAG_CLIENT2 = 0x2,//客户端使用标识2
	CLIENTFLAG_CLIENT3 = 0x4,//客户端使用标识3
	CLIENTFLAG_CLIENT4 = 0x8,//客户端使用标识4
};


//游戏主消息码定义
export enum GS_GAME_MSGID {
	GS_GAME_MSGID_ROOM = 0,	//	房间	c->s->c	
	GS_GAME_MSGID_TIPS = 1,	//	提示	s->c
	GS_GAME_MSGID_LOGIN = 2,	//	登录	c->s->c		
	GS_GAME_MSGID_ACTOR = 3,	//	玩家	s->c
	GS_GAME_MSGID_CHAT = 4,	//	聊天	c->s->c	
	GS_GAME_MSGID_MAX
};

//游戏房间相关
export enum GAMEROOM_TYPE {
	GAMEROOM_TYPE_PVP = 0,	//PVP房间
	GAMEROOM_TYPE_COOPERATE = 4,	//合作
	GAMEROOM_TYPE_MAX
};

export enum EMAIL_SENDTYPE {
	EMAIL_SENDTYPE_SYSTEM = 0,	//系统发送
	EMAIL_SENDTYPE_ACTOR = 1,	//玩家发送	
	EMAIL_SENDTYPE_COINDEALERS = 2,	//点卡销售
	EMAIL_SENDTYPE_OFFLINE = 3,	//离线物品
	EMAIL_SENDTYPE_PROCESS = 4,	//服务器进程
	EMAIL_SENDTYPE_SYSTEMREWARD = 5,	//系统奖励
};

export enum EMAIL_PROCESS {
	EMAIL_PROCESS_EXCHANGEGOOD = 0,	//实物兑换系统
	EMAIL_PROCESS_EXCHANGEVIRTUAL = 1,	//虚拟物品
	EMAIL_PROCESS_BARCODE = 2,	//条形码兑换
	EMAIL_PROCESS_BINDPHONE = 3,	//绑定手机系统	
	EMAIL_PROCESS_USEDIAMONDS = 4,	//离线钻石消耗产出
	EMAIL_PROCESS_EXCHANGEFAIL = 5,	//兑换失败返还	
	EMAIL_PROCESS_SHOPSCORE = 6,	//离线商城积分消耗产出
	EMAIL_PROCESS_GAME = 7,	//游戏添加
	EMAIL_PROCESS_QQLEVEL = 8,	//QQ大玩咖商城购买加成
	EMAIL_PROCESS_BOUNTYCOOPERATION = 9,	//组队爬塔奖励
};

//////////////////////////////////////////////////////////////////////////
//容器ID定义
export enum ECONTAINER {
	ENCONTAINER_PACKET = 2,		//背包
	ENCONTAINER_MAX
};

//////////////////////////////////////////////////////////////////////////
//功能开启标志
export enum ACTOR_OPENFLAG {
	OPENFLAG_FIRSTRECHARGE = 0x1,	//首充
	OPENFLAG_LOGINIT = 0x2,	//第一次登录初始化
	OPENFLAG_FIRSTLOGIN = 0x4,	//首次登陆游戏
	OPENFLAG_FIRSTBINDPHONE = 0x8,	//首次绑定手机
	OPENFIAG_NOVICETEACHING = 0x10,	//新手教学（客户端使用）
	OPENFLAG_NOVICEREWARD = 0x20,	//新手奖励
	OPENFLAG_FINISHNOVICETASK = 0x40,	//新手任务完成标识
	OPENFLAG_FIRSTMONTHCARD = 0x80,	//首次完成月卡
	OPENFLAG_MODIFYNAME = 0x100,//改名
	OPENFLAG_FIRSTLARGETURNTABLE = 0x200,//首次大转盘抽奖		
	OPENFLAG_FIRSTWEEKCARD = 0x400,	//首次完成周卡
	OPENFLAG_FINISHZEROMALL			= 0x800,//完成零元购或者过期
};

//////////////////////////////////////////////////////////////////////////
//用户实名类型
export enum ACTOR_CERTIFICATION {
	ACTOR_CERTIFICATION_NULL = 0,	//未认证
	ACTOR_CERTIFICATION_ADULT = 1,	//成年
	ACTOR_CERTIFICATION_TEENAGERS = 2,	//青少年（未成年）
};

//////////////////////////////////////////////////////////////////////////
//用户属性枚举定义
export enum ActorProp {
	ACTOR_PROP_DBID = 1,	//用户的DBID		
	ACTOR_PROP_STRENGTH = 2,	//体力值(最大值为MAX_STRENGTH）
	ACTOR_PROP_DIAMONDS = 3,	//钻石值		
	ACTOR_PROP_VIPEXP = 4,	//VIP经验值
	ACTOR_PROP_VIPLEVEL = 5,	//VIP等级
	ACTOR_PROP_NEXTVIPLEVELEXP = 6,	//VIP达到下一等级需要的经验值
	ACTOR_PROP_LASTUPVIPTIMES = 7,	//VIP最后升级时间
	ACTOR_PROP_SEX = 8,	//用户性别		
	ACTOR_PROP_OPENFLAG = 9,	//功能开启标示(参考OPENFLAG定义)		
	ACTOR_PROP_ISGUEST = 10,	//游客账号
	ACTOR_PROP_CERTIFICATION = 11,	//实名状态(参考ACTOR_CERTIFICATION的定义）
	ACTOR_PROP_OFFICIALPAY = 12,	//是否启用官方支付(0:不启用，1：启用)		
	ACTOR_PROP_LASTADDSTRENGTIME = 13,	//体力值时间戳（<=0表示体力满无效状态）				
	ACTOR_PROP_FACEID = 14,	//头像ID（0为无效）
	ACTOR_PROP_FACEFRAMEID = 15,	//头像框ID（0为无效）
	ACTOR_PROP_INFINITESTRENGTH = 16,	//无限体力到期时间（格林时间）		

	ACTOR_PROP_RANKMATCHID = 17,	//段位关联的赛事ID（xxxx年xx月xx日)(@用来做清理的记录KEY）
	ACTOR_PROP_RANKSCORE = 18,	//段位积分		

	ACTOR_PROP_PVPWIN = 19,	//竞技赢次数
	ACTOR_PROP_PVPLOST = 20,	//竞技输次数
	ACTOR_PROP_PVPDRAW = 21,	//竞技平次数
	ACTOR_PROP_VIPRECHARGEFLAG = 22,	//用户VIP快充完成位标识
	ACTOR_PROP_QQLEVEL = 23,	//QQ玩咖等级
	ACTOR_PROP_QQLEVELADDPER = 24,	//QQ玩咖等级加成返利百分
	ACTOR_PROP_SOPRTSPOINT = 25,	//竞技点
	ACTOR_PROP_COOPERATIONPOINT = 26,	//合作点
	ACTOR_PROP_BOUNTYCOOPERATIONLAYER = 27,	//组队爬塔历史最高层
	ACTOR_PROP_CLIENTOPENFLAG = 28,	//客户端功能开启标示(参考ACTOR_CLIENTFLAG定义)
	ACTOR_PROP_EXEMPTVIDEOTIME = 29,	//免视频到期时间（格林时间
	ACTOR_PROP_ISAUDIT = 30,	//是否是审核账号
	ACTOR_PROP_CHALLENGEPOINT			= 31,	//挑战点
	ACTOR_PROP_BEHAVIORCTRL				= 32,	//用户行为权限(参考ACTOR_BEHAVIORCTRL定义)
	ACTOR_PROP_MAX,
};

//兑换限制
export enum EXCHANGE_LIMIT {
	EXCHANGE_LIMIT_FREEVIDEOSIGNCOUNT = 0,	//播放兑换专属小视频数量
	EXCHANGE_LIMIT_FRONTRID = 1,	//完成前一个兑换（RID）		
	//EXCHANGE_LIMIT_HEROLEVEL			= 2,	//英雄等级
	EXCHANGE_LIMIT_ALLCOUNT = 3,	//兑换总次数限制
	EXCHANGE_LIMIT_DAYCOUNT = 4,	//每日兑换次数限制
	EXCHANGE_LIMIT_WEEKCOUNT = 5,	//每周兑换次数限制
	EXCHANGE_LIMIT_MONTHCOUNT = 6,	//每月兑换次数限制
	EXCHANGE_LIMIT_MAX
};


//////////////////////////////////////////////////////////////////////////
//怪物类型定义
export enum MONSTER_TYPE {
	MONSTER_TYPE_NORMAL = 0,	//普通怪
	MONSTER_TYPE_ELITE = 1,	//精英怪
	MONSTER_TYPE_BOSS = 2,	//BOSS怪
};

//怪物体型定义
export enum MONSTER_SHAPE {
	MONSTER_SHAPE_NORMAL = 0,	//普通怪
	MONSTER_SHAPE_MEAT = 1,		//肉怪
	//速度怪
	MONSTER_SHAPE_SPEED = 2,	//速度怪
	//远程怪
	MONSTER_SHAPE_REMOTE = 3,	//远程怪
	//飞行怪
	MONSTER_SHAPE_FLY = 4,	//飞行怪
};

//////////////////////////////////////////////////////////////////////////
//场景物件定义
export enum SCENETHING_TYPE {
	SCENETHING_TYPE_GOODS = 0,	//放置物
	SCENETHING_TYPE_PORTAL = 1,	//传送门
	SCENETHING_TYPE_BOMB = 2,	//易燃易爆物 
	SCENETHING_TYPE_TENTACLE = 3,	//触手
};

//////////////////////////////////////////////////////////////////////////
//技能目标类型定义
export enum SKILLTARGET {
	SKILLTARGET_SELF = 0,	//自身
	SKILLTARGET_ENEMY = 1,	//敌人
	SKILLTARGET_SELFSAMETYPE = 2,	//自身以及与自身相同的类型
	SKILLTARGET_FRIENDLYFORCES = 3,	//友军
};
//技能类型定义
export enum SKILLTYPE {
	SKILLTYPE_TARGETTRAJECTORY = 0,		//目标弹道
	SKILLTYPE_DIRECTTRAJECTORY = 1,		//方向弹道
	SKILLTYPE_LINE = 5,					//连线类
	SKILLTYPE_FIXEDBOMB = 6,			//定点炸弹类
	SKILLTYPE_GYRATION = 7,				//回旋镖
	SKILLTYPE_LIGHTNING = 8,			//闪电
	SKILLTYPE_NORMAL = 9,				//普通技能
	SKILLTYPE_TARGET = 10,				//近战技能
	SKILLTYPE_BLINK_TARGET = 11,		//闪现至目标前
	SKILLTYPE_JIAN_SHENG = 12,			//剑圣大招
	SKILLTYPE_SUMMON 	 = 13,			//召唤类
	SKILLTYPE_XIONGXIONG = 14,			//熊熊烈火
	SKILLTYPE_CHARGEE = 15,			//冲锋
	

};



//////////////////////////////////////////////////////////////////////////

export enum SCOREFLAG {
	SCOREFLAG_TASK1 = 0x001,	//任务1
	SCOREFLAG_TASK2 = 0x002,	//任务2
	SCOREFLAG_TASK3 = 0x004,	//任务3
	SCOREFLAG_CLEARTHING = 0x008,	//场景全清
	SCOREFLAG_GRADE1 = 0x010,	//评分铜
	SCOREFLAG_GRADE2 = 0x020,	//评分银
	SCOREFLAG_GRADE3 = 0x040,	//评分金
	SCOREFLAG_FINISHREWARD = 0x080,	//是否领取了完美通关奖励

	SCOREFLAG_ALLTASK = (SCOREFLAG_TASK1 | SCOREFLAG_TASK2 | SCOREFLAG_TASK3),//三星
	SCOREFLAG_PERFECT = (SCOREFLAG_TASK1 | SCOREFLAG_TASK2 | SCOREFLAG_TASK3 | SCOREFLAG_CLEARTHING | SCOREFLAG_GRADE3),		//完美通关
};

//////////////////////////////////////////////////////////////////////////
//通关条件
export enum WAR_WINRULE {
	WAR_WINRULE_KILLBOSS = 0,		//清除BOSS
	WAR_WINRULE_KILLMONSTER = 1,		//清除小怪
	WAR_WINRULE_CLEARSCENE = 2,		//场景物件清空
	WAR_WINRULE_CLEARSCENETHING = 3,		//清空场景特定物件
	WAR_WINRULE_MAX
};

export enum WAR_TASKTYPE {
	WARTASKTYPE_UNKUNOW = 0,		//无效
	WARTASKTYPE_FULLHP = 1,		//满血通关
	WARTASKTYPE_WAVEFULLHP = 2,		//波数满血挑战
	WARTASKTYPE_WAVE = 3,		//波数过关
	WARTASKTYPE_UPTROOPS = 4,		//升级塔任务
	WARTASKTYPE_UPTROOPSTOP = 5,		//升级顶级塔任务
	WARTASKTYPE_BUILDTROOPS = 6,		//建造塔任务
	WARTASKTYPE_LIMITBUILDTROOPS = 7,		//建造塔数量限制
	WARTASKTYPE_LIMITBUILDALLTROOPS = 8,		//建造塔总数量限制
	WARTASKTYPE_DISTORYTROOPS = 9,		//卖塔限制
	WARTASKTYPE_FINDHIDETROOPS = 10,		//找到隐藏塔
	WARTASKTYPE_TROOPSKILLMONSTER = 11,		//指定塔消灭敌人
	WARTASKTYPE_LIMITDISTORYTHING = 12,		//摧毁场景物件限制
	WARTASKTYPE_DISTORYTHING = 13,		//摧毁指定场景物件
	WARTASKTYPE_DISTORYPORTAL = 14,		//摧毁传送门
	WARTASKTYPE_DISTORYOTHERTHING = 15,		//摧毁指定之外的场景物件
	WARTASKTYPE_GETGOLD = 16,		//赚取游戏币
};

//任务处理逻辑类型
export enum TASKPROCESS_TYPE {
	TASKPROCESS_TYPE_TROOPSCOUNT = 1,	//炮塔数量					TaskList::{uProcessParam0:NULL									uProcessParam1:NULL}			TaskItem::uFinishTimes:拥有数量
	TASKPROCESS_TYPE_FINISHWAR = 2,	//通关关卡					TaskList::{uProcessParam0:NULL									uProcessParam1:NULL}			TaskItem::uFinishTimes:关卡ID
	TASKPROCESS_TYPE_USEDIAMONDS = 3,	//钻石消耗					TaskList::{uProcessParam0:NULL									uProcessParam1:NULL}			TaskItem::uFinishTimes:消耗数量
	TASKPROCESS_TYPE_CLEARSCENE = 4,	//场景全清奖章				TaskList::{uProcessParam0:NULL									uProcessParam1:NULL}			TaskItem::uFinishTimes:全清奖章数量
	TASKPROCESS_TYPE_FINISHHIDEWAR = 5,	//通关隐藏关卡数量			TaskList::{uProcessParam0:NULL									uProcessParam1:NULL}			TaskItem::uFinishTimes:关卡数量
	TASKPROCESS_TYPE_TROOPSUPSTAR = 6,	//炮塔升星					TaskList::{uProcessParam0:星级									uProcessParam1:NULL}			TaskItem::uFinishTimes:炮台数量
	TASKPROCESS_TYPE_OPENSTRENG = 7,	//点亮科技					TaskList::{uProcessParam0:炮台类型（参考ROLECARDS定义）			uProcessParam1:NULL}			TaskItem::uFinishTimes:天赋数量
	TASKPROCESS_TYPE_FREEVOIDE = 8,	//免费小视频				TaskList::{uProcessParam0:NULL									uProcessParam1:NULL}			TaskItem::uFinishTimes:次数
	TASKPROCESS_TYPE_PLAYNORMALWAR = 9,	//通关普通关卡次数			TaskList::{uProcessParam0:NULL									uProcessParam1:NULL}			TaskItem::uFinishTimes:次数
	TASKPROCESS_TYPE_PLAYHIDEWAR = 10,	//通关隐藏关卡次数			TaskList::{uProcessParam0:NULL									uProcessParam1:NULL}			TaskItem::uFinishTimes:次数
	TASKPROCESS_TYPE_TROOPSUPSTARCOUNT = 11,	//升星次数					TaskList::{uProcessParam0:NULL									uProcessParam1:NULL}			TaskItem::uFinishTimes:次数	
	TASKPROCESS_TYPE_DAYLOGIN = 12,	//每日登录					TaskList::{uProcessParam0:NULL	

	TASKPROCESS_TYPE_LIFE = 13,	//死亡复活					TaskList::{uProcessParam0:NULL									uProcessParam1:NULL}			TaskItem::uFinishTimes:复活次数
	TASKPROCESS_TYPE_CUMULATIVELOGIN = 14,	//累计登录					TaskList::{uProcessParam0:NULL									uProcessParam1:NULL}			TaskItem::uFinishTimes:登录次数
	TASKPROCESS_TYPE_WARFAIL = 15,	//同一关失败				TaskList::{uProcessParam0:NULL									uProcessParam1:NULL}			TaskItem::uFinishTimes:失败次数
	TASKPROCESS_TYPE_TROOPSSTAR = 16,	//获得满星猫咪				TaskList::{uProcessParam0:NULL									uProcessParam1:NULL}			TaskItem::uFinishTimes:数量
	TASKPROCESS_TYPE_LEFTTIMEWIN = 17,	//一秒过关					TaskList::{uProcessParam0:NULL									uProcessParam1:NULL}			TaskItem::uFinishTimes:次数
	TASKPROCESS_TYPE_LEFTHPWIN = 18,	//一点血过关				TaskList::{uProcessParam0:NULL									uProcessParam1:NULL}			TaskItem::uFinishTimes:次数
	TASKPROCESS_TYPE_RESETSTRENG = 19,	//重置天赋					TaskList::{uProcessParam0:NULL									uProcessParam1:NULL}			TaskItem::uFinishTimes:次数
	TASKPROCESS_TYPE_CUMULATIVEWARFAIL = 20,	//累计关卡失败				TaskList::{uProcessParam0:NULL									uProcessParam1:NULL}			TaskItem::uFinishTimes:失败次数
	TASKPROCESS_TYPE_USEGOODS = 21,	//使用物品					TaskList::{uProcessParam0:物品ID								uProcessParam1:NULL}			TaskItem::uFinishTimes:使用次数
	TASKPROCESS_TYPE_TEACHING = 22,	//完成攻略					TaskList::{uProcessParam0:NULL									uProcessParam1:NULL}			TaskItem::uFinishTimes:次数
	TASKPROCESS_TYPE_PLAYFV = 23,	//播放视频					TaskList::{uProcessParam0:NULL									uProcessParam1:NULL}			TaskItem::uFinishTimes:次数
	TASKPROCESS_TYPE_WARCHAT = 24,	//关卡留言					TaskList::{uProcessParam0:NULL									uProcessParam1:NULL}			TaskItem::uFinishTimes:次数
	TASKPROCESS_TYPE_PERFECTFINISHWORLD = 25,	//完美通关指定普通章节		TaskList::{uProcessParam0:章节ID								uProcessParam1:NULL}			TaskItem::uFinishTimes:固定填1	
	TASKPROCESS_TYPE_PERFECTFINIHIDWAR = 26,	//完美通关隐藏关数量		TaskList::{uProcessParam0:NULL	
	TASKPROCESS_TYPE_PVPCOUNT = 27,	//PVP对战次数				TaskList::{uProcessParam0:(0:无 1:对战胜利 2:对战失败)			uProcessParam1:NULL}			TaskItem::uFinishTimes:次数
	TASKPROCESS_TYPE_PERFECTFINISHHARDWORLD = 28,	//完美通关指定困难章节		TaskList::{uProcessParam0:章节ID									
	TASKPROCESS_TYPE_ADDFRIEND = 29,	//成功添加好友				TaskList::{uProcessParam0:NULL									uProcessParam1:NULL}			TaskItem::uFinishTimes:次数
	TASKPROCESS_TYPE_BOUNTYCOOPERATIONLAYER = 30,	//组队爬塔达到多少层		TaskList::{uProcessParam0:NULL									uProcessParam1:NULL}			TaskItem::uFinishTimes:层数
	TASKPROCESS_TYPE_FINSHBOUNTY = 31,	//领取赏金奖励				TaskList::{uProcessParam0:NULL									uProcessParam1:NULL}			TaskItem::uFinishTimes:次数
	TASKPROCESS_TYPE_GETTROOPS = 32,	//获得猫咪数量				TaskList::{uProcessParam0:NULL									uProcessParam1:NULL}			TaskItem::uFinishTimes:数量
	TASKPROCESS_TYPE_GETFASHION = 33,	//获得皮肤数量				TaskList::{uProcessParam0:NULL									uProcessParam1:NULL}			TaskItem::uFinishTimes:数量
	TASKPROCESS_TYPE_GETEQUIP = 34,	//获得装备数量				TaskList::{uProcessParam0:NULL									uProcessParam1:NULL}			TaskItem::uFinishTimes:数量
	TASKPROCESS_TYPE_PLAYBOUNTYCOOPERATION = 35,	//组队爬塔次数				TaskList::{uProcessParam0:NULL									uProcessParam1:NULL}			TaskItem::uFinishTimes:数量
	TASKPROCESS_TYPE_MAX
};

//任务的客户端触发功能
export enum TASKTRIGGERFUNC_TYPE {
	TASKTRIGGERFUNC_TYPE_UNKNOWN = 0,	//未知								TriggerFuncItem::uFuncParam0:NULL						TriggerFuncItem::uFuncParam1:NULL	
};


export enum ServerDefine {
	WARMAX_COUNT = 1000,		//关卡最大数量（不同类型的关卡都有这个数量）
	WARHID_STARID = 1001,		//隐藏关卡开始ID
	WARHARD_INDEX = 2000,
	WARHARD_STARID = 2001,		//困难关卡开始ID 
	WARHARD_MAXID = 3001,		//困难关卡最大ID 
	EXPERIENCE_STARTID = 20001,	//试玩关卡

	MAX_STRENGTH = 15,	//体力最大值
	STRENGTH_SPACE = 900000,//体力恢复间隔(15分钟+1)
	NORMAL_TOWER_MAX_LEVEL = 3,
	FASHION_TOWER_MAX_LEVEL = 4,

	WAR_MODEL_NORMAL = 0,
	WAR_MODEL_HARD = 1,
}

export enum DropType {
	COIN = 0,//金币
	TIME = 1,//时间
	DIAMOND = 2,//钻石
}

//////////////////////////////////////////////////////////////////////////
//强化类型(type*100000+id)
export enum STRENG_TYPE {
	STRENGTYPE_DEEPENHURT_TARGETTYPE = 1,		//针对目标类型伤害增强							main-param0:(0:全部 1:场景建筑 2:小型怪 3:中型怪 4:大型怪 5:普通怪 6:精英怪 7:BOSS怪)	level-pamra0:伤害加深百分比
	STRENGTYPE_DEEPENHURT_TARGETHIGHHP = 2,		//针对目标血量伤害增强							main-param0:判定方式（0：高于 1：低于）main-param1:血量百分比							level-param0:伤害加深百分比	
	STRENGTYPE_ADDNEWSTATUS_TIME = 3,		//次数百分比附加状态							main-param0:状态ID			mian-param1:次数											level-param0:状态等级
	STRENGTYPE_DEEPENHURT_SELFLEVEL = 4,		//针对自身等级伤害增强							main-param0:等级																		level-param0:伤害提升百分比
	STRENGTYPE_FOCUSHURT = 5,		//集火伤害增强									main-param0:NULL																		level-param0:伤害提升百分比
	STRENGTYPE_PENETRATEHURT = 6,		//穿透伤害增强									main-param0:NULL																		level-param0:伤害提升百分比
	STRENGTYPE_GROUPHURT = 7,		//群攻伤害增强									main-param0:同时攻击数量																level-param0:加深伤害百分比
	STRENGTYPE_ATTACKDIST = 8,		//攻击距离提升									main-param0:NULL																		level-param0:距离提升百分比
	STRENGTYPE_ATTACKSPEED = 9,		//攻击速度提升									main-param0:NULL																		level-param0:速度提升百分比
	STRENGTYPE_ATTACKTOSPEED = 10,		//攻击力转攻速									main-param0:NULL																		level-param0:转换百分比
	STRENGTYPE_MODSTATUSPER = 11,		//附加状态概率提升或者减少						main-param0:NULL																		level-param0:状态命中百分比值（正为增加负为减少）
	STRENGTYPE_MODSTATUSVALUE = 12,		//附加状态数值提升或者减少						main-param0:NULL																		level-param0:状态数值百分比（正为增加负为减少）
	STRENGTYPE_MODSTATUSTIME = 13,		//附加状态时间提升或者减少						main-param0:NULL																		level-param0:状态时间百分比（正为增加负为减少）	
	STRENGTYPE_PERADDNEWSTATUS = 14,		//概率附加新状态								main-param0:状态ID			main-param1:状态等级										level-param0:附加概率百分比
	STRENGTYPE_ADDHURT_PER = 15,		//攻击概率伤害提升								main-param0:提升概率百分比																level-param0:伤害提升百分比	
	STRENGTYPE_ADDSKILL2 = 16,		//附加二段技能									main-param0:二段技能ID		main-param1:技能等级										level-param0:释放概率
	STRENGTYPE_ADDSKILL2_TIME = 17,		//次数附加二段技能（技能等级跟当前技能一致）	main-param0:二段技能ID		main-param1:技能等级										level-param0:一段技能攻击次数
	STRENGTYPE_REDUCEGOLD = 18,		//金币消耗降低									main-param0:NULL																		level-param0:降低百分比
	STRENGTYPE_RANGEATTACKSPEED_SELFLEVEL = 19,		//等级范围内全塔类型射速增强					main-param0:范围			main-param1:等级	 										level-param0:射速提升百分比
	STRENGTYPE_RANGEDEEPENHURT_SELFLEVEL = 20,		//等级范围内全塔类型伤害增强					main-param0:范围			main-param1:等级											level-param0:伤害提升百分比
	STRENGTYPE_RANGEDIST_SELFLEVEL = 21,		//等级范围内全塔类型攻击距离增强				main-param0:范围			main-param1:等级											level-param0:距离提升百分比
	STRENGTYPE_ADDNEWSTATUS = 22,		//百分百附加新状态								main-param0:状态ID																		level-param0:附加状态等级	
	STRENGTYPE_RANGESTATUS = 23,		//范围内全塔类型自带效果数值加强				main-param0:范围			main-param1:效果ID											level-param0:效果数值增强百分比	
	STRENGTYPE_RANGSWITCHSKILL = 24,		//概率替换技能ID							 main-param0:技能ID（等级使用原技能本身等级）											pevel-param0:概率百分比											level-param0:效果数值增强百分比	
	STRENGTYPE_GROUPHURTADDPER = 25,		//炮台集体伤害提升								main-param0:炮台类型		main-param1:炮台等级													pevel-param0:伤害提升百分比
	STRENGTYPE_STATUSHURTADDPER = 26,		//状态伤害加强									main-param0:被加强状态ID	main-param1:被加强需要的状态ID											pevel-param0:伤害提升百分比
	STRENGTYPE_STATUSSWITCH = 27,		//状态附加次数转换新状态						main-param0:当前状态ID		main-param1:累计附加次数	main-param2:替换新状态ID					pevel-param0:新状态等级
	STRENGTYPE_STATUSVALUEADD = 28,		//状态数值加强									main-param0:要加强的状态ID	main-param1:加强方式（0:上限 1：固定）									pevel-param0:加强数值
	STRENGTYPE_ADDSKILL2_RATE					= 29,		//概率附加二段技能								main-param0:二段技能ID																				level-param0:概率
	STRENGTYPE_GROUPSTATUSADDPER				= 30,		//群体状态累加加强								main-param0:炮台ID			main-param1:被加强状态ID	main-param2:累加上限						level-param0:单次状态数值加强百分比	
	STRENGTYPE_GROUPHURTADDPER2					= 31,		//群体伤害累加提升								main-param0:炮台ID			main-param1:累加上限													level-param0:单次伤害提升百分比
};


//游戏主消息码定义
export enum GS_GATEWAY_MSGID {
	GS_GATEWAY_MSGID_COMMAND = 0,	//	客户端与服务器之间交互		c->s->c	
	GS_GATEWAY_MSGID_MAX
};

//社交系统相关
export enum NOTICE_TYPE {
	NOTICE_ADDFRIEND = 0,	//加好友
	NOTICE_REWARD = 1,	//打赏		
};

export enum NOTICE_ADDFRIEND_STATE {
	ADDFRIEND_UNKNOWN = 0,	//未处理
	ADDFRIEND_AGREE = 1,	//同意
	ADDFRIEND_REFUSE = 2,	//拒绝
};

export enum NOTICE_REWARD_STATE {
	REWARD_UNKNOWN = 0,	//未处理
	REWARD_RECEIVE = 1,	//领取
};

export enum RELATION_FRIENDSTATE {
	STATE_OFFLINE = 0,	//离线
	STATE_ONLINE = 1,	//在线
};

export enum MONSTER_STATE {
	UNGETED = 0,//未领取
	GETED = 1,//已领取
};

/**头像激活方式 */
export enum HEAD_ACTIVE_TYPE {
	WAR_ACTIVE = 0,					//通关关卡
	TOWER_ACTIVE = 1,				//解锁炮塔
	PERFECT_ACTIVE = 2,				//完美通关
	MONSTER_ACTIVE = 3,				//解锁怪物
	TESHU_ACTIVE = 4,				//特殊(客户端通过服务器下发的激活列表判断是否可以使用)
	SKIN_ACTIVE = 5,				//特殊(客户端通过服务器下发的激活列表判断是否可以使用)
}

/**
 * 头像框激活方式
 */
export enum HEAD_FRAME_ACTIVE_TYPE {
	PERFECT,					//完美通关章节
	RANK_SCORE,					//段位积分
	WAR,						//通关章节
	PERFECT_HIDE_WAR_COUNT,		//完美通关隐藏关卡数量
	HIDE_WAR_COUNT,				//通关隐藏关卡数量
	VIP_EXP,					//VIP经验值
	FINISH_TASK,				//完成任务
	SPECIAL,					//特殊
}

export enum Furniture_Type {
	Common = 1,
	DianQi = 2,
	ZhuangShi = 3,
	ZhiWu = 4,
	Other = 5,
}

export enum Furniture_Buy_Type {
	Star = 1,
	Diamond = 2,
	FreeTv = 3,
	Recharge = 4,
	Task = 5,
}

//弹窗消息类型
export enum POP_VIEW_TYPE {
	URL = 1,					//链接
	MESSAGE = 2,				//纯文本
}

//活动完成标识
export enum SYSACTIVITY_FALG {
	CLOSE = -1,
	UNFINISHED = 0,
	// FINISHED = 1,
}

//活动类型
export enum ACTIVE_TYPE {
	XIAO_CHOU = 1,				//小丑皮肤
	LEISHEN = 2,				//雷神
	GANGTIEXIA = 3,				//钢铁侠
	DAILY_ZHADANREN = 4,		//今日特惠（炸弹人）
	DAILY_LEISHEN = 5,			//今日特惠（雷神）
	DAILY_GANGTIEXIA = 6,		//今日特惠（钢铁侠)
	DISCOUNT_SKIN = 7,			//特价皮肤,
	DAILY_EQUIP = 9,			//装备礼包
	WEEK_TEHUI = 11,			//每周特惠
	WEEK_RECHARGE = 12,			//每周累充
	CONTINUE_RECHARGE = 13,		//连充奖励
	DAY_LOGIN = 14,				//七天登录
	ONLINE_TIME = 15,			//累计在线时长
	DAILY_GIFT	= 70,			//每日礼包

	EVERY_DAY_RECHARGE_6 = 17,			//每日首冲6
	EVERY_DAY_RECHARGE_30 = 18,			//每日首冲30
	ZERO_MALL = 19,			//0元购
}

export enum SYSTEM_ACTIVE_TYPE {
	BUY = 1,				//购买特惠
	RECHARGE = 2,			//充值赠送
	LOGIN = 3,				//连登赠送
	VIDEO_SIGN = 4,			//视频连签赠送
	DIAMOND = 5,			//钻石消耗赠送
	SIGN = 6,				//常规连签赠送
	SIGN_NO_BREAK = 7,		//常规签到赠送(不计断签)

	ON_LINE = 12,
}

//任务类型定义
export enum TASK_TYPE {
	TASK_TYPE_DAY = 0,			//每日任务
	TASK_TYPE_WEEK = 1,			//周任务	
	TASK_TYPE_MONTH = 2,		//月任务
	TASK_TYPE_TIME = 3,			//定时任务
	TASK_TYPE_ACHIEVEMENT = 4,	//成就任务
	TASK_TYPE_NOVICE = 5,		//新手任务
	TASK_TYPE_LOOP = 6,			//循环任务
	TASK_TYPE_MAX
};

//滚动消息类型
export enum ROOL_TIPS_TYPE {
	SHOW_IN_GAMESCENE = 0,		//在游戏场景中显示
	NOTSHOW_IN_GAMESCENE = 1,	//不在游戏场景显示
}

/**
 * 新手宝典任务状态
 */
export enum NOVICE_TASK_STATE {
	UNFINISHED = 0,				//未完成
	CANGET = 1,					//可领取
	FINISHED = 2,				//已完成
}

/**
 * 系统活动刷新模式
 */
export enum SYS_ACTIVE_RERESH_MODE {
	VIDEO = 0,					//视频
	DIAMOND = 1					//钻石
}

/**
 * 每日活动刷新模式
 */
export enum BOUNTY_RERESH_MODE {
	DIAMOND = 0,				//钻石
	VIDEO = 1,					//视频
}

/**
 * 猫咪公寓奖励领取状态
 */
export enum HOUSE_REWARD_STATE {
	UNREWARD,		//未领取
	REWARD			//已领取
}

/**
 * 家具类型
 */
export enum FURNITURE_TYPE {
	NORMAL = 1,			//普通家具
	ACHIEVE = 5			//成就
}

// 0:道具单抽 1：道具十连抽 2：钻石单抽 3：钻石十连抽
export enum LUCK_DRAW_JION_TYPE {
	PROP_SINGLE,
	PROP_TEN,
	DIA_SINGLE,
	DIA_TEN,
}

//首充状态
export enum FIRST_RECHARGE_STATE {
	NONE,
	BUY,
	RECIVE,
	RECIVED,
}

//行为权限
export enum ACTOR_BEHAVIORCTRL
{
	ACTOR_BEHAVIORCTRL_SPEAK		= 0x1,	//禁言
};
