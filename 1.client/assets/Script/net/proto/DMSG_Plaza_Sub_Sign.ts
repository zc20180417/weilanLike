export enum GS_PLAZA_SIGN_MSG
{	
	PLAZA_SIGN_INFO					= 0,	//签到配置				s->c
	PLAZA_SIGN_PRIVATEINFO			= 1,	//签到的个人配置		s->c
	PLAZA_SIGN_CHECK				= 2,	//进行签到				c->s
	PLAZA_SIGN_GETFREEVIDEOORDER	= 3,	//获得小视频订单		c->s
	PLAZA_SIGN_SETFREEVIDEOORDER	= 4,	//下发小视频订单		s->c
	PLAZA_SIGN_MONTHCARDCONFIG		= 5,	//月卡配置下发			s->c
	PLAZA_SIGN_MONTHCARDPRIVATE		= 6,	//月卡私有数据下发		s->c
	PLAZA_SIGN_MONTHCARDBUY			= 7,	//购买月卡				c->s
	PLAZA_SIGN_MONTHCARDORDER		= 8,	//月卡订单				s->c
	PLAZA_SIGN_MONTHCARDGETREWARD	= 9,	//领取月卡奖励			c->s

	PLAZA_SIGN_WEEKCARDCONFIG		= 10,	//周卡配置下发			s->c
	PLAZA_SIGN_WEEKCARDPRIVATE		= 11,	//周卡私有数据下发		s->c
	PLAZA_SIGN_WEEKCARDBUY			= 12,	//购买周卡				c->s
	PLAZA_SIGN_WEEKCARDORDER		= 13,	//周卡订单				s->c
	PLAZA_SIGN_WEEKCARDGETREWARD	= 14,	//领取周卡奖励			c->s
	PLAZA_SIGN_MAX
}
export class GS_SignHead  {
	protoList:any[] = 
		[
		]

}
export class GS_SignWeekCardPrivate  {			
	nexpiretimes : number;			
	nlastfreetimes : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"k" : "nexpiretimes",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nlastfreetimes",	"c" : 1,},
		]

}
export class GS_SignSetFreeVideoOrder  {			
	szorder : string;			
	nsdkid : number;			
	szsdkkey : string;
	protoList:any[] = 
		[			
			{	"t" : "stchar",	"k" : "szorder",	"c" : 32,},			
			{	"t" : "slong",	"k" : "nsdkid",	"c" : 1,},			
			{	"t" : "char",	"k" : "szsdkkey",	"c" : 32,},
		]

}
export class GS_SignCheck  {
	protoList:any[] = 
		[
		]

}
export class GS_SignConfig_SignReward  {			
	ngoodsid : number;			
	ngoodsnums : number;			
	btfreevideorewardtype : number;			
	nfreevideoparams : number;			
	nfreevideogoodsids : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "ngoodsid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsnums",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btfreevideorewardtype",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nfreevideoparams",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nfreevideogoodsids",	"c" : 1,},
		]

}
export class GS_SignConfig  {			
	btstate : number;			
	btitemsize : number;			
	btitemcount : number;			
	reward : GS_SignConfig_SignReward[];
	rewardClass : any = GS_SignConfig_SignReward;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"k" : "btstate",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btitemsize",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btitemcount",	"c" : 1,},			
			{	"t" : "GS_SignConfig_SignReward",	"c" : 0,	"k" : "reward",	"s" : "btitemsize",	"ck" : "btitemcount",},
		]

}
export class GS_SignWeekCardOrder  {			
	nrid : number;			
	szorder : string;			
	nrmb : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nrid",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szorder",	"c" : 32,},			
			{	"t" : "slong",	"k" : "nrmb",	"c" : 1,},
		]

}
export class GS_SignMonthCardOrder  {			
	nrid : number;			
	szorder : string;			
	nrmb : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nrid",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szorder",	"c" : 32,},			
			{	"t" : "slong",	"k" : "nrmb",	"c" : 1,},
		]

}
export class GS_SignMonthCardConfig_GoodsItem  {			
	ngoodsid : number;			
	ngoodsnums : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "ngoodsid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsnums",	"c" : 1,},
		]

}
export class GS_SignWeekCardsGetReward  {
	protoList:any[] = 
		[
		]

}
export class GS_SignWeekCardConfig_GoodsItem  {			
	ngoodsid : number;			
	ngoodsnums : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "ngoodsid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsnums",	"c" : 1,},
		]

}
export class GS_SignGetFreeVideoOrder  {
	protoList:any[] = 
		[
		]

}
export class GS_SignMonthCardPrivate  {			
	nexpiretimes : number;			
	nlastfreetimes : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"k" : "nexpiretimes",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nlastfreetimes",	"c" : 1,},
		]

}
export class GS_SignPrivateInfo  {			
	btsigncount : number;			
	btcheckindex : number;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"k" : "btsigncount",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btcheckindex",	"c" : 1,},
		]

}
export class GS_SignWeekCardBuy  {
	protoList:any[] = 
		[
		]

}
export class GS_SignMonthCardBuy  {
	protoList:any[] = 
		[
		]

}
export class GS_SignMonthCardConfig  {			
	nvalidday : number;			
	nrid : number;			
	nrmb : number;			
	btbuytype : number;			
	nneedgoodsid : number;			
	nneedgoodsnum : number;			
	nfirstrmb : number;			
	btfirstbuytype : number;			
	nfirstneedgoodsid : number;			
	nfirstneedgoodsnum : number;			
	sbuygoods : GS_SignMonthCardConfig_GoodsItem;
	sbuygoodsClass : any = GS_SignMonthCardConfig_GoodsItem;			
	sdaygoods : GS_SignMonthCardConfig_GoodsItem;
	sdaygoodsClass : any = GS_SignMonthCardConfig_GoodsItem;			
	btfullstrength : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nvalidday",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nrid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nrmb",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btbuytype",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nneedgoodsid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nneedgoodsnum",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nfirstrmb",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btfirstbuytype",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nfirstneedgoodsid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nfirstneedgoodsnum",	"c" : 1,},			
			{	"t" : "GS_SignMonthCardConfig_GoodsItem",	"k" : "sbuygoods",	"c" : 1,},			
			{	"t" : "GS_SignMonthCardConfig_GoodsItem",	"k" : "sdaygoods",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btfullstrength",	"c" : 1,},
		]

}
export class GS_SignMonthCardsGetReward  {
	protoList:any[] = 
		[
		]

}
export class GS_SignWeekCardConfig  {			
	nvalidday : number;			
	nrid : number;			
	nrmb : number;			
	btbuytype : number;			
	nneedgoodsid : number;			
	nneedgoodsnum : number;			
	nfirstrmb : number;			
	btfirstbuytype : number;			
	nfirstneedgoodsid : number;			
	nfirstneedgoodsnum : number;			
	sbuygoods : GS_SignWeekCardConfig_GoodsItem;
	sbuygoodsClass : any = GS_SignWeekCardConfig_GoodsItem;			
	sdaygoods : GS_SignWeekCardConfig_GoodsItem;
	sdaygoodsClass : any = GS_SignWeekCardConfig_GoodsItem;			
	btexemptvideo : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nvalidday",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nrid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nrmb",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btbuytype",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nneedgoodsid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nneedgoodsnum",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nfirstrmb",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btfirstbuytype",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nfirstneedgoodsid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nfirstneedgoodsnum",	"c" : 1,},			
			{	"t" : "GS_SignWeekCardConfig_GoodsItem",	"k" : "sbuygoods",	"c" : 1,},			
			{	"t" : "GS_SignWeekCardConfig_GoodsItem",	"k" : "sdaygoods",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btexemptvideo",	"c" : 1,},
		]

}
 

 