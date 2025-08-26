export enum GS_PLAZA_FESTIVALACTIVITY_MSG
{
	PLAZA_FESTIVALACTIVITY_CONFIG							= 0,	//活动配置								s->c
	PLAZA_FESTIVALACTIVITY_PRIVATE							= 1,	//用户活动数据							s->c

	PLAZA_FESTIVALACTIVITY_LUCKYDRAW_PLAY_REWARD_GET_1		= 2,	//玩家点击1抽								c->s
	PLAZA_FESTIVALACTIVITY_LUCKYDRAW_PLAY_REWARD_GET_10		= 3,	//玩家点击10抽								c->s
	PLAZA_FESTIVALACTIVITY_LUCKYDRAW_PLAY_REWARD_GET_50		= 4,	//玩家点击50抽								c->s
	PLAZA_FESTIVALACTIVITY_LUCKYDRAW_PLAY_REWARD			= 5,	//发放了抽奖物品						s->c
	PLAZA_FESTIVALACTIVITY_LUCKYDRAW_WISH_REWARD_GET		= 6,	//玩家点击领取心愿单物品					c->s
	PLAZA_FESTIVALACTIVITY_LUCKYDRAW_WISH_REWARD			= 7,	//心愿单物品 已被领取					s->c

	PLAZA_FESTIVALACTIVITY_TASK_RECHARGE_REWARD_GET			= 8,	//玩家点击领取某一个 累充 任务奖励			c->s
	PLAZA_FESTIVALACTIVITY_TASK_RECHARGE_REWARD				= 9,	//一个 累充 任务奖励 已被领取			s->c

	PLAZA_FESTIVALACTIVITY_TASK_LUCKYDRAW_REWARD_GET		= 10,	//玩家点击领取某一个 累抽 任务奖励			c->s
	PLAZA_FESTIVALACTIVITY_TASK_LUCKYDRAW_REWARD			= 11,	//一个 累抽 任务奖励 已被领取			s->c

	PLAZA_FESTIVALACTIVITY_TASK_DAILY_REWARD_GET			= 12,	//玩家点击领取某一个 单日 任务奖励			c->s
	PLAZA_FESTIVALACTIVITY_TASK_DAILY_REWARD				= 13,	//一个 单日 任务奖励 已被领取			s->c

	PLAZA_FESTIVALACTIVITY_EXCHANGE_REWARD_GET				= 14,	//玩家点击兑换某一个物品					c->s
	PLAZA_FESTIVALACTIVITY_EXCHANGE_REWARD					= 15,	//一个 兑换物品 已被领取				s->c

	PLAZA_FESTIVALACTIVITY_MALL_REWARD_GET					= 16,	//玩家充值购买某一个物品					c->s
	PLAZA_FESTIVALACTIVITY_MALL_ORDER						= 17,	//充值订单（充值类活动下发）			s->c
	PLAZA_FESTIVALACTIVITY_MALL_REWARD						= 18,	//一个 商城礼包 已被购买领取			s->c

	PLAZA_FESTIVALACTIVITY_CLOSE							= 19,	//节日活动关闭（跨天时 若节日活动结束时间到了 触发）	s->c
	PLAZA_FESTIVALACTIVITY_TASK_DAILY_UPDATE				= 20,	//更新玩家的 单日任务 配置（跨天时触发）				s->c

	PLAZA_FESTIVALACTIVITY_UPDATE_PRICECOUNT				= 21,	//在 节日活动 外充值了					s->c

	PLAZA_FESTIVALACTIVITY_UPDATE_TASK_DAILY				= 22,	//更新 单日活动 的进度					s->c

	PLAZA_FESTIVALACTIVITY_SIGN_REWARD_GET					= 23,	//签到										c->s
	PLAZA_FESTIVALACTIVITY_SIGN_REWARD						= 24,	//某天的 签到 奖励 已被领取				s->c
	PLAZA_FESTIVALACTIVITY_SIGN_VIDEOORDER					= 25,	//视频补签订单							s->c

	PLAZA_FESTIVALACTIVITY_COMBINE_DO						= 26,	//合成										c->s
	PLAZA_FESTIVALACTIVITY_COMBINE_OK						= 27,	//合成结束								s->c

	PLAZA_FESTIVALACTIVITY_COMBINE_REWARD_GET				= 28,	//领取额外奖励								c->s
	PLAZA_FESTIVALACTIVITY_COMBINE_REWARD					= 29,	//额外奖励领取成功						s->c

	PLAZA_FESTIVALACTIVITY_MAX
}
export class GS_FestivalActivityHead  {
	protoList:any[] = 
		[
		]

}
export class GS_FestivalActivityTaskReward  {			
	nid : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "slong",	"k" : "nid",},
		]

}
export class GS_FestivalActivityClose  {
	protoList:any[] = 
		[
		]

}
export class GS_FestivalActivityConfig_Sign  {			
	btresigntype : number;			
	nresignvalue : number;			
	rewarditemlist : GS_FestivalActivityConfig_RewardItem[];
	rewarditemlistClass : any = GS_FestivalActivityConfig_RewardItem;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "uchar",	"k" : "btresigntype",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nresignvalue",},			
			{	"c" : 14,	"t" : "GS_FestivalActivityConfig_RewardItem",	"k" : "rewarditemlist",},
		]

}
export class GS_FestivalActivityLuckyDrawWishRewardGet  {			
	nid : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "slong",	"k" : "nid",},
		]

}
export class GS_FestivalActivitySignReward  {			
	nday : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "uchar",	"k" : "nday",},
		]

}
export class GS_FestivalActivityCombineRewardGet  {
	protoList:any[] = 
		[
		]

}
export class GS_FestivalActivityExchangeReward  {			
	nid : number;			
	nnum : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "slong",	"k" : "nid",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nnum",},
		]

}
export class GS_FestivalActivityConfig_ExchangeItem  {			
	nid : number;			
	btlimitbuytype : number;			
	nlimitbuynum : number;			
	ngoodsid : number;			
	ngoodsnum : number;			
	btquality : number;			
	btcornermark : number;			
	btpricetype : number;			
	nprice : number;			
	usortid : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "slong",	"k" : "nid",},			
			{	"c" : 1,	"t" : "uchar",	"k" : "btlimitbuytype",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nlimitbuynum",},			
			{	"c" : 1,	"t" : "slong",	"k" : "ngoodsid",},			
			{	"c" : 1,	"t" : "slong",	"k" : "ngoodsnum",},			
			{	"c" : 1,	"t" : "uchar",	"k" : "btquality",},			
			{	"c" : 1,	"t" : "uchar",	"k" : "btcornermark",},			
			{	"c" : 1,	"t" : "uchar",	"k" : "btpricetype",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nprice",},			
			{	"c" : 1,	"t" : "ushort",	"k" : "usortid",},
		]

}
export class GS_FestivalActivityLuckyDrawPlayRewardGet  {
	protoList:any[] = 
		[
		]

}
export class GS_FestivalActivityConfig_Task  {			
	nid : number;			
	szname : string;			
	szdescription : string;			
	bttype : number;			
	btdailytype : number;			
	uprocesstype : number;			
	uprocessparam0 : number;			
	uprocessparam1 : number;			
	ufinishtimes : number;			
	btisrandom : number;			
	nviewlimit : number;			
	utargetvalue : number;			
	rewarditemlist : GS_FestivalActivityConfig_RewardItem[];
	rewarditemlistClass : any = GS_FestivalActivityConfig_RewardItem;			
	usortid : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "slong",	"k" : "nid",},			
			{	"c" : 32,	"t" : "stchar",	"k" : "szname",},			
			{	"c" : 128,	"t" : "stchar",	"k" : "szdescription",},			
			{	"c" : 1,	"t" : "uchar",	"k" : "bttype",},			
			{	"c" : 1,	"t" : "uchar",	"k" : "btdailytype",},			
			{	"c" : 1,	"t" : "ushort",	"k" : "uprocesstype",},			
			{	"c" : 1,	"t" : "ulong",	"k" : "uprocessparam0",},			
			{	"c" : 1,	"t" : "ulong",	"k" : "uprocessparam1",},			
			{	"c" : 1,	"t" : "sint64",	"k" : "ufinishtimes",},			
			{	"c" : 1,	"t" : "uchar",	"k" : "btisrandom",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nviewlimit",},			
			{	"c" : 1,	"t" : "sint64",	"k" : "utargetvalue",},			
			{	"c" : 5,	"t" : "GS_FestivalActivityConfig_RewardItem",	"k" : "rewarditemlist",},			
			{	"c" : 1,	"t" : "ushort",	"k" : "usortid",},
		]

}
export class GS_FestivalActivityPrivate_TaskItem  {			
	ntaskid : number;			
	unowvalue : number;			
	btgetreward : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "ulong",	"k" : "ntaskid",},			
			{	"c" : 1,	"t" : "sint64",	"k" : "unowvalue",},			
			{	"c" : 1,	"t" : "uchar",	"k" : "btgetreward",},
		]

}
export class GS_FestivalActivityCombineReward  {
	protoList:any[] = 
		[
		]

}
export class GS_FestivalActivityUpdatePriceCount  {			
	npricecount : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "slong",	"k" : "npricecount",},
		]

}
export class GS_FestivalActivityTaskDailyUpdate  {			
	utasksize : number;			
	udailytaskcount : number;			
	data1 : GS_FestivalActivityTaskDailyUpdate_Task[];
	data1Class : any = GS_FestivalActivityTaskDailyUpdate_Task;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "ushort",	"k" : "utasksize",},			
			{	"c" : 1,	"t" : "ushort",	"k" : "udailytaskcount",},			
			{	"s" : "utasksize",	"ck" : "udailytaskcount",	"k" : "data1",	"t" : "GS_FestivalActivityTaskDailyUpdate_Task",	"c" : 0,},
		]

}
export class GS_FestivalActivityPrivate  {			
	npricecount : number;			
	nplaycount : number;			
	nexchangegoodscount : number;			
	nsignday : number[];			
	btcombinegetreward : number;			
	utasksize : number;			
	utaskcount : number;			
	urechargetaskcount : number;			
	uluckydrawtaskcount : number;			
	udailytaskcount : number;			
	ureceiveitemsize : number;			
	ureceiveitemcount : number;			
	uwishitemcount : number;			
	uexchangeitemcount : number;			
	umallitemcount : number;			
	umaterialitemcount : number;			
	ucombineditemcount : number;			
	data1 : GS_FestivalActivityPrivate_TaskItem[];
	data1Class : any = GS_FestivalActivityPrivate_TaskItem;			
	data2 : GS_FestivalActivityPrivate_ReceiveItem[];
	data2Class : any = GS_FestivalActivityPrivate_ReceiveItem;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "slong",	"k" : "npricecount",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nplaycount",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nexchangegoodscount",},			
			{	"c" : 7,	"t" : "uchar",	"k" : "nsignday",},			
			{	"c" : 1,	"t" : "uchar",	"k" : "btcombinegetreward",},			
			{	"c" : 1,	"t" : "ushort",	"k" : "utasksize",},			
			{	"c" : 1,	"t" : "ushort",	"k" : "utaskcount",},			
			{	"c" : 1,	"t" : "ushort",	"k" : "urechargetaskcount",},			
			{	"c" : 1,	"t" : "ushort",	"k" : "uluckydrawtaskcount",},			
			{	"c" : 1,	"t" : "ushort",	"k" : "udailytaskcount",},			
			{	"c" : 1,	"t" : "ushort",	"k" : "ureceiveitemsize",},			
			{	"c" : 1,	"t" : "ushort",	"k" : "ureceiveitemcount",},			
			{	"c" : 1,	"t" : "ushort",	"k" : "uwishitemcount",},			
			{	"c" : 1,	"t" : "ushort",	"k" : "uexchangeitemcount",},			
			{	"c" : 1,	"t" : "ushort",	"k" : "umallitemcount",},			
			{	"c" : 1,	"t" : "ushort",	"k" : "umaterialitemcount",},			
			{	"c" : 1,	"t" : "ushort",	"k" : "ucombineditemcount",},			
			{	"s" : "utasksize",	"ck" : "utaskcount",	"k" : "data1",	"t" : "GS_FestivalActivityPrivate_TaskItem",	"c" : 0,},			
			{	"s" : "ureceiveitemsize",	"ck" : "ureceiveitemcount",	"k" : "data2",	"t" : "GS_FestivalActivityPrivate_ReceiveItem",	"c" : 0,},
		]

}
export class GS_FestivalActivitySignVideoOrder  {			
	szorder : string;			
	nsdkid : number;			
	szsdkkey : string;
	protoList:any[] = 
		[			
			{	"c" : 32,	"t" : "stchar",	"k" : "szorder",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nsdkid",},			
			{	"c" : 32,	"t" : "char",	"k" : "szsdkkey",},
		]

}
export class GS_FestivalActivityConfig  {			
	nvalidday : number;			
	nscorerate : number;			
	ntimeclose : number;			
	nexchangegoodsid : number;			
	luckydraw : GS_FestivalActivityConfig_LuckyDraw;
	luckydrawClass : any = GS_FestivalActivityConfig_LuckyDraw;			
	sign : GS_FestivalActivityConfig_Sign;
	signClass : any = GS_FestivalActivityConfig_Sign;			
	combine : GS_FestivalActivityConfig_Combine;
	combineClass : any = GS_FestivalActivityConfig_Combine;			
	utasksize : number;			
	utaskcount : number;			
	urechargetaskcount : number;			
	uluckydrawtaskcount : number;			
	udailytaskcount : number;			
	uexchangeitemcount : number;			
	uexchangeitemsize : number;			
	umallitemcount : number;			
	umallitemsize : number;			
	data1 : GS_FestivalActivityConfig_Task[];
	data1Class : any = GS_FestivalActivityConfig_Task;			
	data2 : GS_FestivalActivityConfig_ExchangeItem[];
	data2Class : any = GS_FestivalActivityConfig_ExchangeItem;			
	data3 : GS_FestivalActivityConfig_MallItem[];
	data3Class : any = GS_FestivalActivityConfig_MallItem;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "slong",	"k" : "nvalidday",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nscorerate",},			
			{	"c" : 1,	"t" : "slong",	"k" : "ntimeclose",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nexchangegoodsid",},			
			{	"c" : 1,	"t" : "GS_FestivalActivityConfig_LuckyDraw",	"k" : "luckydraw",},			
			{	"c" : 1,	"t" : "GS_FestivalActivityConfig_Sign",	"k" : "sign",},			
			{	"c" : 1,	"t" : "GS_FestivalActivityConfig_Combine",	"k" : "combine",},			
			{	"c" : 1,	"t" : "ushort",	"k" : "utasksize",},			
			{	"c" : 1,	"t" : "ushort",	"k" : "utaskcount",},			
			{	"c" : 1,	"t" : "ushort",	"k" : "urechargetaskcount",},			
			{	"c" : 1,	"t" : "ushort",	"k" : "uluckydrawtaskcount",},			
			{	"c" : 1,	"t" : "ushort",	"k" : "udailytaskcount",},			
			{	"c" : 1,	"t" : "ushort",	"k" : "uexchangeitemcount",},			
			{	"c" : 1,	"t" : "ushort",	"k" : "uexchangeitemsize",},			
			{	"c" : 1,	"t" : "ushort",	"k" : "umallitemcount",},			
			{	"c" : 1,	"t" : "ushort",	"k" : "umallitemsize",},			
			{	"s" : "utasksize",	"ck" : "utaskcount",	"k" : "data1",	"t" : "GS_FestivalActivityConfig_Task",	"c" : 0,},			
			{	"s" : "uexchangeitemsize",	"ck" : "uexchangeitemcount",	"k" : "data2",	"t" : "GS_FestivalActivityConfig_ExchangeItem",	"c" : 0,},			
			{	"s" : "umallitemsize",	"ck" : "umallitemcount",	"k" : "data3",	"t" : "GS_FestivalActivityConfig_MallItem",	"c" : 0,},
		]

}
export class GS_FestivalActivityTaskRewardGet  {			
	nid : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "slong",	"k" : "nid",},
		]

}
export class GS_FestivalActivityLuckyDrawWishReward  {			
	nid : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "slong",	"k" : "nid",},
		]

}
export class GS_FestivalActivityUpdateTaskDaily  {			
	nid : number;			
	nnowvalue : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "slong",	"k" : "nid",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nnowvalue",},
		]

}
export class GS_FestivalActivityConfig_LuckyItem  {			
	nid : number;			
	ngoodsid : number;			
	ngoodsnum : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "slong",	"k" : "nid",},			
			{	"c" : 1,	"t" : "slong",	"k" : "ngoodsid",},			
			{	"c" : 1,	"t" : "slong",	"k" : "ngoodsnum",},
		]

}
export class GS_FestivalActivityCombineOK  {			
	nid : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "slong",	"k" : "nid",},
		]

}
export class GS_FestivalActivityConfig_Combine  {			
	ncombinerewardgoodsid : number;			
	ncombinerewardgoodsnum : number;			
	ncombinefailedgoodsid : number;			
	materialitemlist : GS_FestivalActivityConfig_Material[];
	materialitemlistClass : any = GS_FestivalActivityConfig_Material;			
	combineconfigitemlist : GS_FestivalActivityConfig_CombineConfig[];
	combineconfigitemlistClass : any = GS_FestivalActivityConfig_CombineConfig;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "slong",	"k" : "ncombinerewardgoodsid",},			
			{	"c" : 1,	"t" : "slong",	"k" : "ncombinerewardgoodsnum",},			
			{	"c" : 1,	"t" : "slong",	"k" : "ncombinefailedgoodsid",},			
			{	"c" : 5,	"t" : "GS_FestivalActivityConfig_Material",	"k" : "materialitemlist",},			
			{	"c" : 7,	"t" : "GS_FestivalActivityConfig_CombineConfig",	"k" : "combineconfigitemlist",},
		]

}
export class GS_FestivalActivityConfig_RewardItem  {			
	ngoodsid : number;			
	ngoodsnum : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "slong",	"k" : "ngoodsid",},			
			{	"c" : 1,	"t" : "slong",	"k" : "ngoodsnum",},
		]

}
export class GS_FestivalActivityLuckyDrawPlayReward  {			
	nplaycount : number;			
	uitemsize : number;			
	uitemcount : number;			
	itemlist : GS_FestivalActivityLuckyDrawPlayReward_RewardItem[];
	itemlistClass : any = GS_FestivalActivityLuckyDrawPlayReward_RewardItem;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "slong",	"k" : "nplaycount",},			
			{	"c" : 1,	"t" : "ushort",	"k" : "uitemsize",},			
			{	"c" : 1,	"t" : "ushort",	"k" : "uitemcount",},			
			{	"c" : 0,	"ck" : "uitemcount",	"s" : "uitemsize",	"t" : "GS_FestivalActivityLuckyDrawPlayReward_RewardItem",	"k" : "itemlist",},
		]

}
export class GS_FestivalActivityMallRewardGet  {			
	nid : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "slong",	"k" : "nid",},
		]

}
export class GS_FestivalActivityMallReward  {			
	nid : number;			
	npricecount : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "slong",	"k" : "nid",},			
			{	"c" : 1,	"t" : "slong",	"k" : "npricecount",},
		]

}
export class GS_FestivalActivitySignRewardGet  {			
	nday : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "uchar",	"k" : "nday",},
		]

}
export class GS_FestivalActivityConfig_Material  {			
	ngoodsid : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "slong",	"k" : "ngoodsid",},
		]

}
export class GS_FestivalActivityTaskDailyUpdate_Task  {			
	nid : number;			
	szname : string;			
	szdescription : string;			
	btdailytype : number;			
	uprocesstype : number;			
	uprocessparam0 : number;			
	uprocessparam1 : number;			
	ufinishtimes : number;			
	nrewardexchangenum : number;			
	usortid : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "slong",	"k" : "nid",},			
			{	"c" : 32,	"t" : "stchar",	"k" : "szname",},			
			{	"c" : 128,	"t" : "stchar",	"k" : "szdescription",},			
			{	"c" : 1,	"t" : "uchar",	"k" : "btdailytype",},			
			{	"c" : 1,	"t" : "ushort",	"k" : "uprocesstype",},			
			{	"c" : 1,	"t" : "ulong",	"k" : "uprocessparam0",},			
			{	"c" : 1,	"t" : "ulong",	"k" : "uprocessparam1",},			
			{	"c" : 1,	"t" : "sint64",	"k" : "ufinishtimes",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nrewardexchangenum",},			
			{	"c" : 1,	"t" : "ushort",	"k" : "usortid",},
		]

}
export class GS_FestivalActivityConfig_MallItem  {			
	nid : number;			
	szname : string;			
	btlimitbuytype : number;			
	nlimitbuynum : number;			
	btquality : number;			
	btcornermark : number;			
	norgprice : number;			
	nprice : number;			
	usortid : number;			
	nicon : number;			
	rewarditemlist : GS_FestivalActivityConfig_RewardItem[];
	rewarditemlistClass : any = GS_FestivalActivityConfig_RewardItem;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "slong",	"k" : "nid",},			
			{	"c" : 32,	"t" : "stchar",	"k" : "szname",},			
			{	"c" : 1,	"t" : "uchar",	"k" : "btlimitbuytype",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nlimitbuynum",},			
			{	"c" : 1,	"t" : "uchar",	"k" : "btquality",},			
			{	"c" : 1,	"t" : "uchar",	"k" : "btcornermark",},			
			{	"c" : 1,	"t" : "slong",	"k" : "norgprice",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nprice",},			
			{	"c" : 1,	"t" : "ushort",	"k" : "usortid",},			
			{	"c" : 1,	"t" : "sint64",	"k" : "nicon",},			
			{	"c" : 5,	"t" : "GS_FestivalActivityConfig_RewardItem",	"k" : "rewarditemlist",},
		]

}
export class GS_FestivalActivityExchangeRewardGet  {			
	nid : number;			
	nnum : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "slong",	"k" : "nid",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nnum",},
		]

}
export class GS_FestivalActivityPrivate_ReceiveItem  {			
	nid : number;			
	ntimes : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "slong",	"k" : "nid",},			
			{	"c" : 1,	"t" : "slong",	"k" : "ntimes",},
		]

}
export class GS_FestivalActivityRmbOrder  {			
	nrid : number;			
	szorder : string;			
	nrmb : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "slong",	"k" : "nrid",},			
			{	"c" : 32,	"t" : "stchar",	"k" : "szorder",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nrmb",},
		]

}
export class GS_FestivalActivityConfig_CombineConfig  {			
	nid : number;			
	nrequiregoodsids : number[];			
	ncombinegoodsid : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "slong",	"k" : "nid",},			
			{	"c" : 3,	"t" : "slong",	"k" : "nrequiregoodsids",},			
			{	"c" : 1,	"t" : "slong",	"k" : "ncombinegoodsid",},
		]

}
export class GS_FestivalActivityConfig_WishItem  {			
	nid : number;			
	ngoodsid : number;			
	ngoodsnum : number;			
	nmaxgetcount : number;			
	nwishneednum : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "slong",	"k" : "nid",},			
			{	"c" : 1,	"t" : "slong",	"k" : "ngoodsid",},			
			{	"c" : 1,	"t" : "slong",	"k" : "ngoodsnum",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nmaxgetcount",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nwishneednum",},
		]

}
export class GS_FestivalActivityCombineDo  {			
	ngoodsids : number[];
	protoList:any[] = 
		[			
			{	"c" : 3,	"t" : "slong",	"k" : "ngoodsids",},
		]

}
export class GS_FestivalActivityLuckyDrawPlayReward_RewardItem  {			
	nid : number;			
	ngoodsnum : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "slong",	"k" : "nid",},			
			{	"c" : 1,	"t" : "slong",	"k" : "ngoodsnum",},
		]

}
export class GS_FestivalActivityConfig_LuckyDraw  {			
	ngoodsid : number;			
	ngoodsnum1 : number;			
	ngoodsnum10 : number;			
	ngoodsnum50 : number;			
	nticketprice : number;			
	luckyitemlist : GS_FestivalActivityConfig_LuckyItem[];
	luckyitemlistClass : any = GS_FestivalActivityConfig_LuckyItem;			
	wishitemlist : GS_FestivalActivityConfig_WishItem[];
	wishitemlistClass : any = GS_FestivalActivityConfig_WishItem;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "slong",	"k" : "ngoodsid",},			
			{	"c" : 1,	"t" : "slong",	"k" : "ngoodsnum1",},			
			{	"c" : 1,	"t" : "slong",	"k" : "ngoodsnum10",},			
			{	"c" : 1,	"t" : "slong",	"k" : "ngoodsnum50",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nticketprice",},			
			{	"c" : 10,	"t" : "GS_FestivalActivityConfig_LuckyItem",	"k" : "luckyitemlist",},			
			{	"c" : 21,	"t" : "GS_FestivalActivityConfig_WishItem",	"k" : "wishitemlist",},
		]

}
 

 