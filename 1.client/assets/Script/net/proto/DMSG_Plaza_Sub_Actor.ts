export enum GS_PLAZA_ACTORINFO_MSG
{	
	PLAZA_ACTOR_PRIVATE					= 0,	//	玩家私有数据										s->c
	PLAZA_ACTOR_VARIABLE				= 1,	//	玩家易变属性										s->c
	PLAZA_ACTOR_MODIFYDATA				= 2,	//	玩家修改资料										c->s
	PLAZA_ACTOR_MODIFYDATERET			= 3,	//	玩家修改资料返回									s->c	
	PLAZA_ACTOR_GETVERIFICATION			= 4,	//	获取验证码(无需等待返回,客户端直接倒计时1分钟)		c->s
	PLAZA_ACTOR_BINDPHONE				= 5,	//	绑定手机											c->s
	PLAZA_ACTOR_BINDPHONERET			= 6,	//	绑定手机返回										s->c
	PLAZA_ACTOR_FEEDBACK				= 7,	//	反馈信息											c->s
	PLAZA_ACTOR_FEEDBACKRET				= 8,	//	反馈信息返回										s->c
	PLAZA_ACTOR_FIRSTLOGIN				= 9,	//	首次登陆游戏										s->c
	PLAZA_ACTOR_FIRSTRECHARGEINFO		= 10,	//	首充配置下发										s->c
	PLAZA_ACTOR_FIRSTRECHARGE			= 11,	//	首充请求											c->s
	PLAZA_ACTOR_FIRSTRECHARGERET		= 12,	//	首充订单下发										s->c	
	PLAZA_ACTOR_MODIFYPWD				= 13,	//	用户修改密码										c->s
	PLAZA_ACTOR_MODIFYPWDRET			= 14,	//	用户修改密码返回									s->c
	PLAZA_ACTOR_RESETPWD				= 15,	//	用户重置密码										c->s
	PLAZA_ACTOR_RESETPWDRET				= 16,	//	用户重置密码返回									s->c
	PLAZA_ACTOR_GETRESETVERIFICATION	= 17,	//	获得绑定验证码(无需等待返回,客户端直接倒计时1分钟)	c->s
	PLAZA_ACTOR_VIPINFO					= 18,	//	VIP描述信息下发										s->c
	PLAZA_ACTOR_FACECHANGE				= 19,	//	玩家修改头像										s->c
	PLAZA_ACTOR_POPACTIVE				= 20,	//	弹出活动窗口										s->c	
	PLAZA_ACTOR_POPACTIVENOTICE			= 21,	//	弹出告示面板										s->c	
	PLAZA_ACTOR_CLIENTOPENFLAG			= 22,	//	客户端领取相关功能开启奖励							c->s
	PLAZA_ACTOR_CHECKTIME				= 23,	//	时间校验											c->s->c
	PLAZA_ACTOR_SETFACEID				= 24,	//	设置头像ID											c->s
	PLAZA_ACTOR_SETFACEFRAMEID			= 25,	//	设置头像框ID										c->s
	PLAZA_ACTOR_FACECONFIG				= 26,	//	头像与头像框配置下发								s->c
	PLAZA_ACTOR_VIPPRIVATE				= 27,	//	VIP个人数据											s->c
	PLAZA_ACTOR_GETVIPREWARD			= 28,	//	领取每日VIP奖励										c->s
	PLAZA_ACTOR_RECHARGECONFIG			= 29,	//	快充配置											s->c
	PLAZA_ACTOR_RANKINFO				= 30,	//	段位配置											s->c	
	PLAZA_ACTOR_CLIENTCONFIGLIST		= 31,	//	客户端配置列表头下发								s->c
	PLAZA_ACTOR_REQUESTCLIENTCONFIG		= 32,	//	请求最新的配置										c->s
	PLAZA_ACTOR_CLIENTCONFIG			= 33,	//	客户端配置数据下发									s->c
	PLAZA_ACTOR_ACTIVEFACELIST			= 34,	//	特殊激活的头像框和头像列表							s->c
	PLAZA_ACTOR_ACTIVEFACE				= 35,	//	激活一个可使用的头像								s->c
	PLAZA_ACTOR_ACTIVEFACEFRAME			= 36,	//	激活一个可使用的头像框								s->c
	PLAZA_ACTOR_CLIENTCONFIRMFREEVIDEO	= 37,	//	客户端确认视频订单									c->s
	PLAZA_ACTOR_GETVIPRECHARGE			= 38,	//	获得VIP快充											c->s
	PLAZA_ACTOR_SETVIPORDER				= 39,	//	下发VIP快充订单										s->c
	PLAZA_ACTOR_FIRSTRECHARGEPRIVATE	= 40,	//	首充私有数据										s->c
	PLAZA_ACTOR_GETFIRSTRECHARGEREWARD	= 41,	//	领取首冲奖励										c->s
	PLAZA_ACTOR_MAX
}
export class GS_ActorInfoHead  {
	protoList:any[] = 
		[
		]

}
export class GS_ActorOpenFlag  {			
	nflag : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"k" : "nflag",	"c" : 1,},
		]

}
export class GS_ActorPrivateInfo  {			
	nactordbid : number;			
	szname : string;			
	szmd5facefile : string;			
	szphone : string;			
	uid : number;			
	btsex : number;			
	i64strength : number;			
	i64diamonds : number;			
	i64vipexp : number;			
	i64viplevel : number;			
	i64nextviplevelexp : number;			
	nlastupviptime : number;			
	certification : number;			
	btofficialpay : number;			
	i64openflag : number;			
	nnewemailcount : number;			
	btguest : number;			
	szsign : string;			
	nlastaddstrengtime : number;			
	btdropjoinstate : number;			
	nfaceid : number;			
	nfaceframeid : number;			
	i64infinitestrength : number;			
	nrankmatchid : number;			
	nrankscore : number;			
	npvpwin : number;			
	npvplost : number;			
	npvpdraw : number;			
	nviprechargeflag : number;			
	btqqlevel : number;			
	btqqleveladdper : number;			
	nsoprtspoint : number;			
	ncooperationpoint : number;			
	nbountycooperationlayer : number;			
	nclientflag : number;			
	btaudit : number;			
	nchallengepoint : number;			
	nlogingreentime : number;			
	nhistoryplaytime : number;			
	nchannelopentimes : number;			
	nregtime : number;			
	nplazaid : number;			
	nplazachildid : number;			
	ngameserverid : number;			
	nbehaviorctrlflag : number;			
	nton : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"k" : "nactordbid",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szname",	"c" : 32,},			
			{	"t" : "stchar",	"k" : "szmd5facefile",	"c" : 33,},			
			{	"t" : "stchar",	"k" : "szphone",	"c" : 24,},			
			{	"t" : "sint64",	"k" : "uid",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btsex",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "i64strength",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "i64diamonds",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "i64vipexp",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "i64viplevel",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "i64nextviplevelexp",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nlastupviptime",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "certification",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btofficialpay",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "i64openflag",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nnewemailcount",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btguest",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szsign",	"c" : 32,},			
			{	"t" : "sint64",	"k" : "nlastaddstrengtime",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btdropjoinstate",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nfaceid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nfaceframeid",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "i64infinitestrength",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nrankmatchid",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nrankscore",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "npvpwin",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "npvplost",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "npvpdraw",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nviprechargeflag",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btqqlevel",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "btqqleveladdper",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nsoprtspoint",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "ncooperationpoint",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nbountycooperationlayer",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nclientflag",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btaudit",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nchallengepoint",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nlogingreentime",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nhistoryplaytime",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nchannelopentimes",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nregtime",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nplazaid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nplazachildid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngameserverid",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nbehaviorctrlflag",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nton",	"c" : 1,},
		]

}
export class GS_VipInfo  {			
	uitemcount : number;			
	uitemsize : number;			
	data : GS_VipInfo_VipLevel[];
	dataClass : any = GS_VipInfo_VipLevel;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"k" : "uitemcount",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uitemsize",	"c" : 1,},			
			{	"t" : "GS_VipInfo_VipLevel",	"c" : 0,	"k" : "data",	"s" : "uitemsize",	"ck" : "uitemcount",},
		]

}
export class GS_ActorVariable_Variable  {			
	btpropid : number;			
	i64newvalue : number;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"k" : "btpropid",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "i64newvalue",	"c" : 1,},
		]

}
export class GS_FeedbackRet  {
	protoList:any[] = 
		[
		]

}
export class GS_FirstRechargeInfo  {			
	urechargeitemcount : number;			
	ugiveitemcount : number;			
	urechargeitemsize : number;			
	ugiveitemsize : number;			
	data1 : GS_FirstRechargeInfo_RechargeItem[];
	data1Class : any = GS_FirstRechargeInfo_RechargeItem;			
	data2 : GS_FirstRechargeInfo_GiveItem[];
	data2Class : any = GS_FirstRechargeInfo_GiveItem;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"k" : "urechargeitemcount",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "ugiveitemcount",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "urechargeitemsize",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "ugiveitemsize",	"c" : 1,},			
			{	"t" : "GS_FirstRechargeInfo_RechargeItem",	"s" : "urechargeitemsize",	"k" : "data1",	"c" : 0,	"ck" : "urechargeitemcount",},			
			{	"t" : "GS_FirstRechargeInfo_GiveItem",	"s" : "ugiveitemsize",	"k" : "data2",	"c" : 0,	"ck" : "ugiveitemcount",},
		]

}
export class GS_ActorClientConfig_KeyItem  {			
	szname : string;
	protoList:any[] = 
		[			
			{	"t" : "stchar",	"k" : "szname",	"c" : 32,},
		]

}
export class GS_FaceChange  {			
	szmd5facefile : string;
	protoList:any[] = 
		[			
			{	"t" : "stchar",	"k" : "szmd5facefile",	"c" : 33,},
		]

}
export class GS_ActorSetFaceID  {			
	nfaceid : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nfaceid",	"c" : 1,},
		]

}
export class GS_FirstRechargeRet  {			
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
export class GS_ActorRankInfo_RankItem  {			
	nlevel : number;			
	szname : string;			
	nicon : number;			
	nscore : number;			
	ngoodsid : number[];			
	ngoodsnum : number[];			
	udiamonds : number;			
	uwinsoprtspoint : number;			
	ulostsoprtspoint : number;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"k" : "nlevel",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szname",	"c" : 32,},			
			{	"t" : "sint64",	"k" : "nicon",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nscore",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsid",	"c" : 4,},			
			{	"t" : "slong",	"k" : "ngoodsnum",	"c" : 4,},			
			{	"t" : "ushort",	"k" : "udiamonds",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uwinsoprtspoint",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "ulostsoprtspoint",	"c" : 1,},
		]

}
export class GS_FirstRecharge  {			
	btflag : number;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"k" : "btflag",	"c" : 1,},
		]

}
export class GS_ActorGetVerification  {			
	szphone : string;
	protoList:any[] = 
		[			
			{	"t" : "stchar",	"k" : "szphone",	"c" : 24,},
		]

}
export class GS_ActorRechargeConfig_QuickRechargeItem  {			
	nrid : number;			
	sztitle : string;			
	ngoodsid : number;			
	ngoodsnum : number;			
	noriginalrmb : number;			
	nneedrmb : number;			
	nneeddiamonds : number;			
	ngivegoodsid : number[];			
	ngivegoodsnums : number[];			
	btbuytype : number;			
	nneedgoodsid : number;			
	nneedgoodsnum : number;			
	ndiscount : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nrid",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "sztitle",	"c" : 32,},			
			{	"t" : "slong",	"k" : "ngoodsid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsnum",	"c" : 1,},			
			{	"t" : "slong",	"k" : "noriginalrmb",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nneedrmb",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nneeddiamonds",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngivegoodsid",	"c" : 5,},			
			{	"t" : "slong",	"k" : "ngivegoodsnums",	"c" : 5,},			
			{	"t" : "uchar",	"k" : "btbuytype",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nneedgoodsid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nneedgoodsnum",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ndiscount",	"c" : 1,},
		]

}
export class GS_ActorGetFirstRechargeReward  {			
	btflag : number;			
	btindex : number;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"k" : "btflag",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btindex",	"c" : 1,},
		]

}
export class GS_ActorClientConfig_ValueItem  {			
	nvalue : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nvalue",	"c" : 1,},
		]

}
export class GS_ActorActiveFaceList_FaceItem  {			
	nid : number;			
	nlasttimes : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nid",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nlasttimes",	"c" : 1,},
		]

}
export class GS_ActorClientConfirmFreeVideo  {			
	szorder : string;			
	nenquiry : number;			
	nadplatformid : number;			
	nadsourceid : number;
	protoList:any[] = 
		[			
			{	"t" : "stchar",	"k" : "szorder",	"c" : 32,},			
			{	"t" : "slong",	"k" : "nenquiry",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nadplatformid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nadsourceid",	"c" : 1,},
		]

}
export class GS_ActorVipPrivate  {			
	nfvcount : number;			
	btdayrewardstate : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nfvcount",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btdayrewardstate",	"c" : 1,},
		]

}
export class GS_PopActive  {			
	szurl : string;			
	uflag : number;			
	szparam : string;
	protoList:any[] = 
		[			
			{	"t" : "stchar",	"k" : "szurl",	"c" : 256,},			
			{	"t" : "ushort",	"k" : "uflag",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szparam",	"c" : 64,},
		]

}
export class GS_FirstRechargeInfo_RechargeItem  {			
	btflag : number;			
	npicid : number;			
	nrmb : number;			
	btgiveitemcount : number;			
	btbuytype : number;			
	nneedgoodsid : number;			
	nneedgoodsnum : number;			
	ndiscount : number;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"k" : "btflag",	"c" : 1,},			
			{	"t" : "ulong",	"k" : "npicid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nrmb",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btgiveitemcount",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btbuytype",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nneedgoodsid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nneedgoodsnum",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ndiscount",	"c" : 1,},
		]

}
export class GS_ActorFaceConfig_FaceItem  {			
	nid : number;			
	szname : string;			
	btactivetype : number;			
	nactiveparam : number;			
	naniid : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nid",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szname",	"c" : 32,},			
			{	"t" : "uchar",	"k" : "btactivetype",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nactiveparam",	"c" : 1,},			
			{	"t" : "slong",	"k" : "naniid",	"c" : 1,},
		]

}
export class GS_ActorActiveFace  {			
	nid : number;			
	nlasttimes : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nid",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nlasttimes",	"c" : 1,},
		]

}
export class GS_ActorFaceConfig  {			
	ufacecount : number;			
	ufaceframecount : number;			
	ufacestructsize : number;			
	ufaceframestructsize : number;			
	data1 : GS_ActorFaceConfig_FaceItem[];
	data1Class : any = GS_ActorFaceConfig_FaceItem;			
	data2 : GS_ActorFaceConfig_FaceFrameItem[];
	data2Class : any = GS_ActorFaceConfig_FaceFrameItem;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"k" : "ufacecount",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "ufaceframecount",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "ufacestructsize",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "ufaceframestructsize",	"c" : 1,},			
			{	"t" : "GS_ActorFaceConfig_FaceItem",	"s" : "ufacestructsize",	"k" : "data1",	"c" : 0,	"ck" : "ufacecount",},			
			{	"t" : "GS_ActorFaceConfig_FaceFrameItem",	"s" : "ufaceframestructsize",	"k" : "data2",	"c" : 0,	"ck" : "ufaceframecount",},
		]

}
export class GS_FirstLogin_GiveGoodsItem  {			
	ngoodsid : number;			
	ngoodsnum : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "ngoodsid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsnum",	"c" : 1,},
		]

}
export class GS_ActorSetVipOrder  {			
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
export class GS_BindPhoneRet_GiveGoodsItem  {			
	ngoodsid : number;			
	ngoodsnum : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "ngoodsid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsnum",	"c" : 1,},
		]

}
export class GS_ActorGetVipRecharge  {			
	btviplevel : number;			
	btmode : number;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"k" : "btviplevel",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btmode",	"c" : 1,},
		]

}
export class GS_ModifyPwd  {			
	oldpassword : string;			
	newpassword : string;
	protoList:any[] = 
		[			
			{	"t" : "stchar",	"k" : "oldpassword",	"c" : 128,},			
			{	"t" : "stchar",	"k" : "newpassword",	"c" : 128,},
		]

}
export class GS_ActorActiveFaceList  {			
	ufaceitemcount : number;			
	ufaceframeitemcount : number;			
	ufacestructsize : number;			
	ufaceframestructsize : number;			
	data1 : GS_ActorActiveFaceList_FaceItem[];
	data1Class : any = GS_ActorActiveFaceList_FaceItem;			
	data2 : GS_ActorActiveFaceList_FaceFrameItem[];
	data2Class : any = GS_ActorActiveFaceList_FaceFrameItem;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"k" : "ufaceitemcount",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "ufaceframeitemcount",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "ufacestructsize",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "ufaceframestructsize",	"c" : 1,},			
			{	"t" : "GS_ActorActiveFaceList_FaceItem",	"s" : "ufacestructsize",	"k" : "data1",	"c" : 0,	"ck" : "ufaceitemcount",},			
			{	"t" : "GS_ActorActiveFaceList_FaceFrameItem",	"s" : "ufaceframestructsize",	"k" : "data2",	"c" : 0,	"ck" : "ufaceframeitemcount",},
		]

}
export class GS_ActorFirstRechargePrivate_FirstRechargeItem  {			
	btflag : number;			
	btfinishflag : number;			
	btfinishall : number;			
	nactivetimes : number;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"k" : "btflag",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btfinishflag",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btfinishall",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nactivetimes",	"c" : 1,},
		]

}
export class GS_ActorPopActiveNotice  {
	protoList:any[] = 
		[
		]

}
export class GS_ActorModifyDateRet  {			
	szname : string;			
	btsex : number;			
	szsign : string;
	protoList:any[] = 
		[			
			{	"t" : "stchar",	"k" : "szname",	"c" : 32,},			
			{	"t" : "uchar",	"k" : "btsex",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szsign",	"c" : 32,},
		]

}
export class GS_ActorActiveFaceFrame  {			
	nid : number;			
	nlasttimes : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nid",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nlasttimes",	"c" : 1,},
		]

}
export class GS_ActorCheckTime  {			
	nclienttimestamp : number;			
	nservertimestamp : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"k" : "nclienttimestamp",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nservertimestamp",	"c" : 1,},
		]

}
export class GS_ActorClientConfig  {			
	ubasecount : number;			
	ukeyitemcount : number;			
	uvalueitemcount : number;			
	ubasestructsize : number;			
	ukeystructsize : number;			
	uvaluestructsize : number;			
	data1 : GS_ActorClientConfig_BaseData[];
	data1Class : any = GS_ActorClientConfig_BaseData;			
	data2 : GS_ActorClientConfig_KeyItem[];
	data2Class : any = GS_ActorClientConfig_KeyItem;			
	data3 : GS_ActorClientConfig_ValueItem[];
	data3Class : any = GS_ActorClientConfig_ValueItem;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"k" : "ubasecount",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "ukeyitemcount",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uvalueitemcount",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "ubasestructsize",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "ukeystructsize",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uvaluestructsize",	"c" : 1,},			
			{	"t" : "GS_ActorClientConfig_BaseData",	"s" : "ubasestructsize",	"k" : "data1",	"c" : 0,	"ck" : "ubasecount",},			
			{	"t" : "GS_ActorClientConfig_KeyItem",	"s" : "ukeystructsize",	"k" : "data2",	"c" : 0,	"ck" : "ukeyitemcount",},			
			{	"t" : "GS_ActorClientConfig_ValueItem",	"s" : "uvaluestructsize",	"k" : "data3",	"c" : 0,	"ck" : "uvalueitemcount",},
		]

}
export class GS_ActorActiveFaceList_FaceFrameItem  {			
	nid : number;			
	nlasttimes : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nid",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nlasttimes",	"c" : 1,},
		]

}
export class GS_ActorGetVipReward  {
	protoList:any[] = 
		[
		]

}
export class GS_ActorClientConfig_BaseData  {			
	nconfigid : number;			
	nversion : number;			
	bttransversekeycount : number;			
	btverticalkeycount : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nconfigid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nversion",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "bttransversekeycount",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btverticalkeycount",	"c" : 1,},
		]

}
export class GS_ActorModifyData  {			
	szname : string;			
	btsex : number;			
	szsign : string;
	protoList:any[] = 
		[			
			{	"t" : "stchar",	"k" : "szname",	"c" : 32,},			
			{	"t" : "uchar",	"k" : "btsex",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szsign",	"c" : 32,},
		]

}
export class GS_ActorRankInfo  {			
	ufreejoincount : number;			
	uitemcount : number;			
	uitemsize : number;			
	data : GS_ActorRankInfo_RankItem[];
	dataClass : any = GS_ActorRankInfo_RankItem;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"k" : "ufreejoincount",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uitemcount",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uitemsize",	"c" : 1,},			
			{	"t" : "GS_ActorRankInfo_RankItem",	"c" : 0,	"k" : "data",	"s" : "uitemsize",	"ck" : "uitemcount",},
		]

}
export class GS_ActorClientConfigList_ConfigItem  {			
	nconfigid : number;			
	nversion : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nconfigid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nversion",	"c" : 1,},
		]

}
export class GS_ActorFirstRechargePrivate  {			
	uitemsize : number;			
	uitemcount : number;			
	items : GS_ActorFirstRechargePrivate_FirstRechargeItem[];
	itemsClass : any = GS_ActorFirstRechargePrivate_FirstRechargeItem;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"k" : "uitemsize",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uitemcount",	"c" : 1,},			
			{	"t" : "GS_ActorFirstRechargePrivate_FirstRechargeItem",	"c" : 0,	"k" : "items",	"s" : "uitemsize",	"ck" : "uitemcount",},
		]

}
export class GS_ActorRechargeConfig  {			
	uitemcount : number;			
	uitemsize : number;			
	data : GS_ActorRechargeConfig_QuickRechargeItem[];
	dataClass : any = GS_ActorRechargeConfig_QuickRechargeItem;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"k" : "uitemcount",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uitemsize",	"c" : 1,},			
			{	"t" : "GS_ActorRechargeConfig_QuickRechargeItem",	"c" : 0,	"k" : "data",	"s" : "uitemsize",	"ck" : "uitemcount",},
		]

}
export class GS_ActorRequestClientConfig  {			
	nconfigids : number[];
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nconfigids",	"c" : 0,},
		]

}
export class GS_ActorClientConfigList  {			
	uitemsize : number;			
	uitemcount : number;			
	items : GS_ActorClientConfigList_ConfigItem[];
	itemsClass : any = GS_ActorClientConfigList_ConfigItem;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"k" : "uitemsize",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uitemcount",	"c" : 1,},			
			{	"t" : "GS_ActorClientConfigList_ConfigItem",	"c" : 0,	"k" : "items",	"s" : "uitemsize",	"ck" : "uitemcount",},
		]

}
export class GS_ActorSetFaceFrameID  {			
	nfaceframeid : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nfaceframeid",	"c" : 1,},
		]

}
export class GS_BindPhone  {			
	szphone : string;			
	szverification : string;			
	szpassword : string;			
	szexppwd : string;
	protoList:any[] = 
		[			
			{	"t" : "stchar",	"k" : "szphone",	"c" : 24,},			
			{	"t" : "stchar",	"k" : "szverification",	"c" : 8,},			
			{	"t" : "stchar",	"k" : "szpassword",	"c" : 128,},			
			{	"t" : "stchar",	"k" : "szexppwd",	"c" : 128,},
		]

}
export class GS_ActorVariable  {			
	uitemsize : number;			
	uitemcount : number;			
	svariable : GS_ActorVariable_Variable[];
	svariableClass : any = GS_ActorVariable_Variable;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"k" : "uitemsize",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "uitemcount",	"c" : 1,},			
			{	"t" : "GS_ActorVariable_Variable",	"c" : 0,	"k" : "svariable",	"s" : "uitemsize",	"ck" : "uitemcount",},
		]

}
export class GS_FirstRechargeInfo_GiveItem  {			
	btday : number;			
	ngoodsids : number[];			
	ngoodsnums : number[];
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"k" : "btday",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsids",	"c" : 4,},			
			{	"t" : "slong",	"k" : "ngoodsnums",	"c" : 4,},
		]

}
export class GS_Feedback  {			
	md5pic_1 : string;			
	md5pic_2 : string;			
	md5pic_3 : string;			
	md5pic_4 : string;			
	md5pic_5 : string;			
	szmsg : string;
	protoList:any[] = 
		[			
			{	"t" : "stchar",	"k" : "md5pic_1",	"c" : 33,},			
			{	"t" : "stchar",	"k" : "md5pic_2",	"c" : 33,},			
			{	"t" : "stchar",	"k" : "md5pic_3",	"c" : 33,},			
			{	"t" : "stchar",	"k" : "md5pic_4",	"c" : 33,},			
			{	"t" : "stchar",	"k" : "md5pic_5",	"c" : 33,},			
			{	"t" : "stchar",	"k" : "szmsg",	"c" : 256,},
		]

}
export class GS_ModifyPwdRet  {			
	bok : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "bok",	"c" : 1,},
		]

}
export class GS_GetResetVerification  {			
	phone : string;
	protoList:any[] = 
		[			
			{	"t" : "stchar",	"k" : "phone",	"c" : 24,},
		]

}
export class GS_ResetPwdRet  {			
	bok : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "bok",	"c" : 1,},
		]

}
export class GS_VipInfo_VipLevel  {			
	nneedexp : number;			
	nnowlevel : number;			
	ntroopsattackper : number;			
	ndayfvcount : number;			
	ngoodsids : number[];			
	ngoodsnums : number[];			
	szdes : string;			
	ndaybountycount : number;			
	nrechargelimittroopsid : number;			
	szrechargetitle : string;			
	nrechargegoodsid : number;			
	nrechargegoodsnum : number;			
	nrechargeoriginalrmb : number;			
	nrechargeneedrmb : number;			
	nrechargeneeddiamonds : number;			
	btbuytype : number;			
	nneedgoodsid : number;			
	nneedgoodsnum : number;			
	nrechargegivegoodsid : number[];			
	nrechargegivegoodsnums : number[];
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"k" : "nneedexp",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nnowlevel",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ntroopsattackper",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ndayfvcount",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsids",	"c" : 4,},			
			{	"t" : "slong",	"k" : "ngoodsnums",	"c" : 4,},			
			{	"t" : "stchar",	"k" : "szdes",	"c" : 256,},			
			{	"t" : "slong",	"k" : "ndaybountycount",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nrechargelimittroopsid",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szrechargetitle",	"c" : 32,},			
			{	"t" : "slong",	"k" : "nrechargegoodsid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nrechargegoodsnum",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nrechargeoriginalrmb",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nrechargeneedrmb",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nrechargeneeddiamonds",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btbuytype",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nneedgoodsid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nneedgoodsnum",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nrechargegivegoodsid",	"c" : 5,},			
			{	"t" : "slong",	"k" : "nrechargegivegoodsnums",	"c" : 5,},
		]

}
export class GS_BindPhoneRet  {			
	szphone : string;			
	ugoodsitemsize : number;			
	ugoodscount : number;			
	item : GS_BindPhoneRet_GiveGoodsItem[];
	itemClass : any = GS_BindPhoneRet_GiveGoodsItem;
	protoList:any[] = 
		[			
			{	"t" : "stchar",	"k" : "szphone",	"c" : 24,},			
			{	"t" : "ushort",	"k" : "ugoodsitemsize",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "ugoodscount",	"c" : 1,},			
			{	"t" : "GS_BindPhoneRet_GiveGoodsItem",	"c" : 0,	"k" : "item",	"s" : "ugoodsitemsize",	"ck" : "ugoodscount",},
		]

}
export class GS_FirstLogin  {			
	ugoodsitemsize : number;			
	ugoodscount : number;			
	item : GS_FirstLogin_GiveGoodsItem[];
	itemClass : any = GS_FirstLogin_GiveGoodsItem;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"k" : "ugoodsitemsize",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "ugoodscount",	"c" : 1,},			
			{	"t" : "GS_FirstLogin_GiveGoodsItem",	"c" : 0,	"k" : "item",	"s" : "ugoodsitemsize",	"ck" : "ugoodscount",},
		]

}
export class GS_ResetPwd  {			
	password : string;			
	phone : string;			
	szverification : string;			
	btsystemtype : number;			
	machinename : string;			
	sysversion : string;			
	mac : string;			
	buffhd : string;			
	buffbios : string;			
	buffcpu : string;
	protoList:any[] = 
		[			
			{	"t" : "stchar",	"k" : "password",	"c" : 128,},			
			{	"t" : "stchar",	"k" : "phone",	"c" : 24,},			
			{	"t" : "stchar",	"k" : "szverification",	"c" : 8,},			
			{	"t" : "uchar",	"k" : "btsystemtype",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "machinename",	"c" : 64,},			
			{	"t" : "stchar",	"k" : "sysversion",	"c" : 32,},			
			{	"t" : "stchar",	"k" : "mac",	"c" : 32,},			
			{	"t" : "stchar",	"k" : "buffhd",	"c" : 128,},			
			{	"t" : "stchar",	"k" : "buffbios",	"c" : 64,},			
			{	"t" : "stchar",	"k" : "buffcpu",	"c" : 32,},
		]

}
export class GS_ActorFaceConfig_FaceFrameItem  {			
	nid : number;			
	szname : string;			
	btactivetype : number;			
	nactiveparam : number;			
	naniid : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nid",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szname",	"c" : 32,},			
			{	"t" : "uchar",	"k" : "btactivetype",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nactiveparam",	"c" : 1,},			
			{	"t" : "slong",	"k" : "naniid",	"c" : 1,},
		]

}
 

 