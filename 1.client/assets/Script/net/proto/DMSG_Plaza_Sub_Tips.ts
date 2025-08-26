export enum GS_PLAZA_TIPS_MSG
{
	PLAZA_TIPS_MSG					= 0,	// ��ʾ��Ϣ		
	PLAZA_TIPS_REWARD				= 1,	// ������ʾ	
	PLAZA_TIPS_MAX
}
export enum PLAZA_TIPS_ID
{
	PLAZA_TIPS_NORMAL					= 0,	//	�޴���,������ʾ��Ϣ
	PLAZA_TIPS_CLOSECLIENT				= 1,	//	�ͻ����Զ��˳���ʾ
	PLAZA_TIPS_ERROR_LOGIN				= 2,	//	��¼����
	PLAZA_TIPS_ERROR_KICK				= 3,	//	������Ϣ
	PLAZA_TIPS_ERROR_DB					= 4,	//	���ݿ����	
	PLAZA_TIPS_WEB						= 5,	//	��ʾWEB��Ϣ
	PLAZA_TIPS_BINDPHONE				= 6,	//	���ֻ���ʾ
	PLAZA_TIPS_RESETPWD					= 7,	//	����������ʾ	
	PLAZA_TIPS_VERIFICATION_MSG			= 8,	//	��ȡ��֤��ɹ���ʾ
	PLAZA_TIPS_LIMITEVERYDAYRECHARGE	= 9,	//	���ճ�ֵ�޶�
	PLAZA_TIPS_LIMITALLRECHARGE			= 10,	//	�ܳ�ֵ�޶�
	PLAZA_TIPS_RESETPWDERROR			= 11,	//	�����������	
}
export enum PLAZA_TIPSREWARD
{
	PLAZA_TIPSREWARD_NORMAL				= 0,		//常规性奖励
	PLAZA_TIPSREWARD_MALL				= 1,		//商城
	PLAZA_TIPSREWARD_EMAIL				= 2,		//邮件
	PLAZA_TIPSREWARD_FIRSTRECHARGE		= 3,		//首冲
	PLAZA_TIPSREWARD_USEDIAMONDS		= 4,		//钻石消耗
	PLAZA_TIPSREWARD_EXCHANGE			= 5,		//兑换
	PLAZA_TIPSREWARD_SIGN				= 6,		//签到	
	PLAZA_TIPSREWARD_TASK				= 7,		//任务
	PLAZA_TISPREWARD_SIGNFREEVIDEO		= 8,		//签到小视频奖励
	PLAZA_TIPSREWARD_MALLADD			= 9,		//商城附加卡视频奖励	
	PLAZA_TIPSREWARD_WARADDREWARD		= 10,		//战场通关附加视频奖励		
	PLAZA_TIPSREWARD_MALLFIRST			= 11,		//商城首次购买赠送
	PLAZA_TIPSREWARD_LARGETURNTABLE		= 12,		//抽奖大转盘奖励
	PLAZA_TIPSREWARD_DISCOUNTSTORE		= 13,		//折扣商城购买
	PLAZA_TIPSREWARD_MONTHCARDFREE		= 14,		//月卡每日免费
	///PLAZA_TIPSREWARD_MONTHCARDFV		= 15,		//月卡每日视频
	//PLAZA_TIPSREWARD_MONTHCARDFULLSIGN= 16,		//月卡满签奖励
	PLAZA_TIPSREWARD_VIPDAYREWARD		= 17,		//VIP每日奖励
	PLAZA_TIPSREWARD_HOUSEFRIEND		= 18,		//好友房屋访问
	PLAZA_TIPSREWARD_UPFLOOR			= 19,		//楼层升级
	PLAZA_TIPSREWARD_SYSACTIVITY		= 20,		//内置活动
	PLAZA_TIPSREWARD_RANK				= 21,		//段位奖励
	PLAZA_TIPSREWARD_NOVICETASK			= 22,		//新手任务奖励
	PLAZA_TIPSREWARD_GROWGIFT			= 23,		//成长礼包
	PLAZA_TIPSREWARD_OPENBOX			= 24,		//手动开宝箱
	PLAZA_TIPSREWARD_BOUNTYREWARD		= 25,		//赏金关卡奖励
	PLAZA_TIPSREWARD_VIPRECHARGE		= 26,		//VIP等级特惠
	PLAZA_TIPSREWARD_BATTLEPASS			= 27,		//战场通行证
	PLAZA_TIPSREWARD_BOUNTYTOWERREWARD	= 28,		//赏金爬塔奖励
	PLAZA_TIPSREWARD_CARDBAG			= 29,		//开卡包
	PLAZA_TIPSREWARD_QQLEVEL			= 30,		//大玩咖奖励
	PLAZA_TIPSREWARD_STORE				= 31,		//商店购买
	//PLAZA_TIPSREWARD_COOPERATIONSTORE	= 32,		//合作商店购买
	PLAZA_TIPSREWARD_TROOPSCARDBAG1		= 33,		//打开卡包1
	PLAZA_TIPSREWARD_TROOPSCARDBAG10	= 34,		//打开卡包10
	PLAZA_TIPSREWARD_WEEKCARDFREE		= 35,		//周卡每日免费
	PLAZA_TIPSREWARD_BATTLEPASS2		= 36,		//战场通行证2
	PLAZA_TIPSREWARD_ZEROMALL			= 37,		//零元购奖励
	PLAZA_TIPSREWARD_WARTROOPS			= 38,		//一元购？？？
	PLAZA_TIPSREWARD_BATTLEPASS3		= 39,		//战场通行证3
	PLAZA_TIPSREWARD_FESTIVALACTIVITY 	= 41,
	PLAZA_TIPSREWARD_PVP_DAILY			= 42,		//PVP定时赛
	PLAZA_TIPSREWARD_AD_COIN			= 43,		//看视频赠送广告币
	
}
export class GS_TipsHead  {
	protoList:any[] = 
		[
		]

}
export class GS_Tips  {			
	bttype : number;			
	szdes : string;
	protoList:any[] = 
		[			
			{	"k" : "bttype",	"c" : 1,	"t" : "uchar",},			
			{	"k" : "szdes",	"c" : 128,	"t" : "stchar",},
		]

}
export class GS_RewardTips  {			
	bttype : number;			
	nstrength : number;			
	ndiamonds : number;			
	ndropboxid : number;			
	btfreevideomulit : number;			
	urewardgoodsitemcount : number;			
	ufreevideogoodsitemcount : number;			
	ucleargoodsitemcount : number;			
	ugoodsitemsize : number;			
	ugoodsitemcount : number;			
	goodslist : GS_RewardTips_RewardGoods[];
	goodslistClass : any = GS_RewardTips_RewardGoods;
	protoList:any[] = 
		[			
			{	"k" : "bttype",	"c" : 1,	"t" : "uchar",},			
			{	"k" : "nstrength",	"c" : 1,	"t" : "sint64",},			
			{	"k" : "ndiamonds",	"c" : 1,	"t" : "sint64",},			
			{	"k" : "ndropboxid",	"c" : 1,	"t" : "slong",},			
			{	"k" : "btfreevideomulit",	"c" : 1,	"t" : "uchar",},			
			{	"k" : "urewardgoodsitemcount",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "ufreevideogoodsitemcount",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "ucleargoodsitemcount",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "ugoodsitemsize",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "ugoodsitemcount",	"c" : 1,	"t" : "ushort",},			
			{	"c" : 0,	"t" : "GS_RewardTips_RewardGoods",	"ck" : "ugoodsitemcount",	"s" : "ugoodsitemsize",	"k" : "goodslist",},
		]

}
export class GS_RewardTips_RewardGoods  {			
	sgoodsid : number;			
	sgoodsnum : number;
	protoList:any[] = 
		[			
			{	"k" : "sgoodsid",	"c" : 1,	"t" : "slong",},			
			{	"k" : "sgoodsnum",	"c" : 1,	"t" : "slong",},
		]

}
 

 