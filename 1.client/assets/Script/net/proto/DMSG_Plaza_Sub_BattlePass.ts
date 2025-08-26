export enum GS_PLAZA_BATTLEPASS_MSG
{
	//1
	PLAZA_BATTLEPASS_BATTLEPASSCONFIG			= 0,		//战场通行证配置								s->c
	PLAZA_BATTLEPASS_BATTLEPASSPRIVATE			= 1,		//战场通行证个人数据							s->c
	PLAZA_BATTLEPASS_BATTLEPASSGETORDER			= 2,		//战场同行证开通付费模式						c->s
	PLAZA_BATTLEPASS_BATTLEPASSSETORDER			= 3,		//战场通行证付费订单下发						s->c
	PLAZA_BATTLEPASS_BATTLEPASSGETREWARD		= 4,		//领取奖励										c->s
		
	//2
	PLAZA_BATTLEPASS_BATTLEPASS2CONFIG			= 5,		//战场通行证配置								s->c
	PLAZA_BATTLEPASS_BATTLEPASS2PRIVATE			= 6,		//战场通行证个人数据							s->c
	PLAZA_BATTLEPASS_BATTLEPASS2GETORDER		= 7,		//战场同行证开通付费模式						c->s
	PLAZA_BATTLEPASS_BATTLEPASS2SETORDER		= 8,		//战场通行证付费订单下发						s->c
	PLAZA_BATTLEPASS_BATTLEPASS2GETREWARD		= 9,		//领取奖励										c->s
	PLAZA_BATTLEPASS_BATTLEPASS2FREEVIDEO		= 10,		//战场通行证领取视频							s->c

	//3
	PLAZA_BATTLEPASS_BATTLEPASS3CONFIG			= 11,		//战场通行证配置								s->c
	PLAZA_BATTLEPASS_BATTLEPASS3PRIVATE			= 12,		//战场通行证个人数据							s->c
	PLAZA_BATTLEPASS_BATTLEPASS3GETORDER		= 13,		//战场同行证开通付费模式						c->s
	PLAZA_BATTLEPASS_BATTLEPASS3SETORDER		= 14,		//战场通行证付费订单下发						s->c
	PLAZA_BATTLEPASS_BATTLEPASS3GETREWARD		= 15,		//领取奖励										c->s
	PLAZA_BATTLEPASS_BATTLEPASS3FREEVIDEO		= 16,		//战场通行证领取视频							s->c

	//4
	PLAZA_BATTLEPASS_BATTLEPASS4CONFIG			= 17,		//战场通行证配置								s->c
	PLAZA_BATTLEPASS_BATTLEPASS4PRIVATE			= 18,		//战场通行证个人数据							s->c
	PLAZA_BATTLEPASS_BATTLEPASS4GETORDER		= 19,		//战场同行证开通付费模式						c->s
	PLAZA_BATTLEPASS_BATTLEPASS4SETORDER		= 20,		//战场通行证付费订单下发						s->c
	PLAZA_BATTLEPASS_BATTLEPASS4GETREWARD		= 21,		//领取奖励										c->s
	PLAZA_BATTLEPASS_BATTLEPASS4FREEVIDEO		= 22,		//战场通行证领取视频							s->c
	PLAZA_BATTLEPASS_BATTLEPASS4GETSIGNFV		= 23,		//获得补签视频订单								c->s
	PLAZA_BATTLEPASS_BATTLEPASS4SETSIGNFV		= 24,		//下发补签视频订单								s->c
	PLAZA_BATTLEPASS_BATTLEPASS4GETALLREWARD	= 25,		//领取全部奖励									c->s
	PLAZA_BATTLEPASS_MAX
}
export class GS_BattlePassHead  {
	protoList:any[] = 
		[
		]

}
export class GS_SceneBattlePassGetOrder  {			
	nid : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nid",	"c" : 1,},
		]

}
export class GS_SceneBattlePass4GetReward  {			
	nid : number;			
	btindex : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nid",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btindex",	"c" : 1,},
		]

}
export class GS_SceneBattlePass3GetReward  {			
	nid : number;			
	btindex : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nid",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btindex",	"c" : 1,},
		]

}
export class GS_SceneBattlePassPrivate  {			
	uitemsize : number;			
	uitemcount : number;			
	items : GS_SceneBattlePassPrivate_Item[];
	itemsClass : any = GS_SceneBattlePassPrivate_Item;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"k" : "uitemsize",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uitemcount",	"c" : 1,},			
			{	"t" : "GS_SceneBattlePassPrivate_Item",	"c" : 0,	"k" : "items",	"s" : "uitemsize",	"ck" : "uitemcount",},
		]

}
export class GS_SceneBattlePass2Private  {			
	uitemsize : number;			
	uitemcount : number;			
	items : GS_SceneBattlePass2Private_Item[];
	itemsClass : any = GS_SceneBattlePass2Private_Item;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"k" : "uitemsize",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uitemcount",	"c" : 1,},			
			{	"t" : "GS_SceneBattlePass2Private_Item",	"c" : 0,	"k" : "items",	"s" : "uitemsize",	"ck" : "uitemcount",},
		]

}
export class GS_SceneBattlePass2GetOrder  {			
	nid : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nid",	"c" : 1,},
		]

}
export class GS_SceneBattlePass4SetSignFV  {			
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
export class GS_SceneBattlePassConfig_BaseItem  {			
	nid : number;			
	nopenwarid : number;			
	nworldid : number;			
	nvalidtimes : number;			
	nrmb : number;			
	ngoodsid : number;			
	ngoodsnum : number;			
	btbuytype : number;			
	nneedgoodsid : number;			
	nneedgoodsnum : number;			
	btpassitemcount : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nopenwarid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nworldid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nvalidtimes",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nrmb",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsnum",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btbuytype",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nneedgoodsid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nneedgoodsnum",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btpassitemcount",	"c" : 1,},
		]

}
export class GS_SceneBattlePass4SetOrder  {			
	szorder : string;			
	nrmb : number;
	protoList:any[] = 
		[			
			{	"t" : "stchar",	"k" : "szorder",	"c" : 32,},			
			{	"t" : "slong",	"k" : "nrmb",	"c" : 1,},
		]

}
export class GS_SceneBattlePass4GetAllReward  {			
	nid : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nid",	"c" : 1,},
		]

}
export class GS_SceneBattlePass4Config_PassItem  {			
	nday : number;			
	ngoodsid1 : number;			
	ngoodsnum1 : number;			
	ngoodsid2 : number;			
	ngoodsnum2 : number;			
	ngoodsid3 : number;			
	ngoodsnum3 : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nday",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsid1",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsnum1",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsid2",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsnum2",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsid3",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsnum3",	"c" : 1,},
		]

}
export class GS_SceneBattlePass4Config  {			
	ubaseitemsize : number;			
	ubaseitemcount : number;			
	upassitemsize : number;			
	upassitemcount : number;			
	data1 : GS_SceneBattlePass4Config_BaseItem[];
	data1Class : any = GS_SceneBattlePass4Config_BaseItem;			
	data2 : GS_SceneBattlePass4Config_PassItem[];
	data2Class : any = GS_SceneBattlePass4Config_PassItem;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"k" : "ubaseitemsize",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "ubaseitemcount",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "upassitemsize",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "upassitemcount",	"c" : 1,},			
			{	"t" : "GS_SceneBattlePass4Config_BaseItem",	"s" : "ubaseitemsize",	"k" : "data1",	"c" : 0,	"ck" : "ubaseitemcount",},			
			{	"t" : "GS_SceneBattlePass4Config_PassItem",	"s" : "upassitemsize",	"k" : "data2",	"c" : 0,	"ck" : "upassitemcount",},
		]

}
export class GS_SceneBattlePassPrivate_Item  {			
	nid : number;			
	nopentimes : number;			
	btstate : number;			
	btendreward : number;			
	nflag1 : number;			
	nflag2 : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nid",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nopentimes",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btstate",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btendreward",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nflag1",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nflag2",	"c" : 1,},
		]

}
export class GS_SceneBattlePass3FreeVideo  {			
	nwarid : number;			
	szorder : string;			
	nsdkid : number;			
	szsdkkey : string;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"k" : "nwarid",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szorder",	"c" : 32,},			
			{	"t" : "slong",	"k" : "nsdkid",	"c" : 1,},			
			{	"t" : "char",	"k" : "szsdkkey",	"c" : 32,},
		]

}
export class GS_SceneBattlePass2Config_BaseItem  {			
	nid : number;			
	nopenwarid : number;			
	nrmb1 : number;			
	noriginalrmb1 : number;			
	ngoodsid1 : number;			
	ngoodsnum1 : number;			
	btbuytype1 : number;			
	nneedgoodsid1 : number;			
	nneedgoodsnum1 : number;			
	nrmb2 : number;			
	noriginalrmb2 : number;			
	ngoodsid2 : number;			
	ngoodsnum2 : number;			
	btbuytype2 : number;			
	nneedgoodsid2 : number;			
	nneedgoodsnum2 : number;			
	nstarttime : number;			
	nendtime : number;			
	btnormalfv : number;			
	btpassitemcount : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nopenwarid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nrmb1",	"c" : 1,},			
			{	"t" : "slong",	"k" : "noriginalrmb1",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsid1",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsnum1",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btbuytype1",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nneedgoodsid1",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nneedgoodsnum1",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nrmb2",	"c" : 1,},			
			{	"t" : "slong",	"k" : "noriginalrmb2",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsid2",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsnum2",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btbuytype2",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nneedgoodsid2",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nneedgoodsnum2",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nstarttime",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nendtime",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btnormalfv",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btpassitemcount",	"c" : 1,},
		]

}
export class GS_SceneBattlePass2Config  {			
	ubaseitemsize : number;			
	ubaseitemcount : number;			
	upassitemsize : number;			
	upassitemcount : number;			
	data1 : GS_SceneBattlePass2Config_BaseItem[];
	data1Class : any = GS_SceneBattlePass2Config_BaseItem;			
	data2 : GS_SceneBattlePass2Config_PassItem[];
	data2Class : any = GS_SceneBattlePass2Config_PassItem;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"k" : "ubaseitemsize",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "ubaseitemcount",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "upassitemsize",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "upassitemcount",	"c" : 1,},			
			{	"t" : "GS_SceneBattlePass2Config_BaseItem",	"s" : "ubaseitemsize",	"k" : "data1",	"c" : 0,	"ck" : "ubaseitemcount",},			
			{	"t" : "GS_SceneBattlePass2Config_PassItem",	"s" : "upassitemsize",	"k" : "data2",	"c" : 0,	"ck" : "upassitemcount",},
		]

}
export class GS_SceneBattlePass2FreeVideo  {			
	nwarid : number;			
	szorder : string;			
	nsdkid : number;			
	szsdkkey : string;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"k" : "nwarid",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szorder",	"c" : 32,},			
			{	"t" : "slong",	"k" : "nsdkid",	"c" : 1,},			
			{	"t" : "char",	"k" : "szsdkkey",	"c" : 32,},
		]

}
export class GS_SceneBattlePass4Config_BaseItem  {			
	nid : number;			
	nstartday : number;			
	nvalidday : number;			
	nrmb1 : number;			
	noriginalrmb1 : number;			
	ngoodsid1 : number;			
	ngoodsnum1 : number;			
	btbuytype1 : number;			
	nneedgoodsid1 : number;			
	nneedgoodsnum1 : number;			
	nrmb2 : number;			
	noriginalrmb2 : number;			
	ngoodsid2 : number;			
	ngoodsnum2 : number;			
	btbuytype2 : number;			
	nneedgoodsid2 : number;			
	nneedgoodsnum2 : number;			
	nrmb3 : number;			
	noriginalrmb3 : number;			
	ngoodsid3 : number;			
	ngoodsnum3 : number;			
	btbuytype3 : number;			
	nneedgoodsid3 : number;			
	nneedgoodsnum3 : number;			
	btnormalfv : number;			
	btfvsign : number;			
	btpassitemcount : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nid",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nstartday",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nvalidday",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nrmb1",	"c" : 1,},			
			{	"t" : "slong",	"k" : "noriginalrmb1",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsid1",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsnum1",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btbuytype1",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nneedgoodsid1",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nneedgoodsnum1",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nrmb2",	"c" : 1,},			
			{	"t" : "slong",	"k" : "noriginalrmb2",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsid2",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsnum2",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btbuytype2",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nneedgoodsid2",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nneedgoodsnum2",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nrmb3",	"c" : 1,},			
			{	"t" : "slong",	"k" : "noriginalrmb3",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsid3",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsnum3",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btbuytype3",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nneedgoodsid3",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nneedgoodsnum3",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btnormalfv",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btfvsign",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btpassitemcount",	"c" : 1,},
		]

}
export class GS_SceneBattlePass3Private_Item  {			
	nid : number;			
	btmode : number;			
	nflag1 : number;			
	nflag2 : number;			
	nflag3 : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nid",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btmode",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nflag1",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nflag2",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nflag3",	"c" : 1,},
		]

}
export class GS_SceneBattlePass4Private  {			
	uitemsize : number;			
	uitemcount : number;			
	items : GS_SceneBattlePass4Private_Item[];
	itemsClass : any = GS_SceneBattlePass4Private_Item;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"k" : "uitemsize",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uitemcount",	"c" : 1,},			
			{	"t" : "GS_SceneBattlePass4Private_Item",	"c" : 0,	"k" : "items",	"s" : "uitemsize",	"ck" : "uitemcount",},
		]

}
export class GS_SceneBattlePassConfig_PassItem  {			
	nwarid : number;			
	nfullhpwarcount : number;			
	nfulltaskwarcount : number;			
	nclearthingwarcount : number;			
	ngoodsid1 : number;			
	ngoodsnum1 : number;			
	ngoodsid2 : number;			
	ngoodsnum2 : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nwarid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nfullhpwarcount",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nfulltaskwarcount",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nclearthingwarcount",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsid1",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsnum1",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsid2",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsnum2",	"c" : 1,},
		]

}
export class GS_SceneBattlePass4GetSignFV  {			
	nid : number;			
	btindex : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nid",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btindex",	"c" : 1,},
		]

}
export class GS_SceneBattlePass2Config_PassItem  {			
	nwarid : number;			
	nday : number;			
	ngoodsid1 : number;			
	ngoodsnum1 : number;			
	ngoodsid2 : number;			
	ngoodsnum2 : number;			
	ngoodsid3 : number;			
	ngoodsnum3 : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nwarid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nday",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsid1",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsnum1",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsid2",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsnum2",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsid3",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsnum3",	"c" : 1,},
		]

}
export class GS_SceneBattlePass3GetOrder  {			
	nid : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nid",	"c" : 1,},
		]

}
export class GS_SceneBattlePass4GetOrder  {			
	nid : number;			
	bttype : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nid",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "bttype",	"c" : 1,},
		]

}
export class GS_SceneBattlePass3Private  {			
	uitemsize : number;			
	uitemcount : number;			
	items : GS_SceneBattlePass3Private_Item[];
	itemsClass : any = GS_SceneBattlePass3Private_Item;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"k" : "uitemsize",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uitemcount",	"c" : 1,},			
			{	"t" : "GS_SceneBattlePass3Private_Item",	"c" : 0,	"k" : "items",	"s" : "uitemsize",	"ck" : "uitemcount",},
		]

}
export class GS_SceneBattlePass3Config_PassItem  {			
	nwarid : number;			
	ngoodsid1 : number;			
	ngoodsnum1 : number;			
	ngoodsid2 : number;			
	ngoodsnum2 : number;			
	ngoodsid3 : number;			
	ngoodsnum3 : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nwarid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsid1",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsnum1",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsid2",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsnum2",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsid3",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsnum3",	"c" : 1,},
		]

}
export class GS_SceneBattlePass3Config  {			
	ubaseitemsize : number;			
	ubaseitemcount : number;			
	upassitemsize : number;			
	upassitemcount : number;			
	data1 : GS_SceneBattlePass3Config_BaseItem[];
	data1Class : any = GS_SceneBattlePass3Config_BaseItem;			
	data2 : GS_SceneBattlePass3Config_PassItem[];
	data2Class : any = GS_SceneBattlePass3Config_PassItem;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"k" : "ubaseitemsize",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "ubaseitemcount",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "upassitemsize",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "upassitemcount",	"c" : 1,},			
			{	"t" : "GS_SceneBattlePass3Config_BaseItem",	"s" : "ubaseitemsize",	"k" : "data1",	"c" : 0,	"ck" : "ubaseitemcount",},			
			{	"t" : "GS_SceneBattlePass3Config_PassItem",	"s" : "upassitemsize",	"k" : "data2",	"c" : 0,	"ck" : "upassitemcount",},
		]

}
export class GS_SceneBattlePass3SetOrder  {			
	szorder : string;			
	nrmb : number;
	protoList:any[] = 
		[			
			{	"t" : "stchar",	"k" : "szorder",	"c" : 32,},			
			{	"t" : "slong",	"k" : "nrmb",	"c" : 1,},
		]

}
export class GS_SceneBattlePassGetReward  {			
	nid : number;			
	btmode : number;			
	btindex : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nid",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btmode",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btindex",	"c" : 1,},
		]

}
export class GS_SceneBattlePass2SetOrder  {			
	szorder : string;			
	nrmb : number;
	protoList:any[] = 
		[			
			{	"t" : "stchar",	"k" : "szorder",	"c" : 32,},			
			{	"t" : "slong",	"k" : "nrmb",	"c" : 1,},
		]

}
export class GS_SceneBattlePassConfig  {			
	ubaseitemsize : number;			
	ubaseitemcount : number;			
	upassitemsize : number;			
	upassitemcount : number;			
	data1 : GS_SceneBattlePassConfig_BaseItem[];
	data1Class : any = GS_SceneBattlePassConfig_BaseItem;			
	data2 : GS_SceneBattlePassConfig_PassItem[];
	data2Class : any = GS_SceneBattlePassConfig_PassItem;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"k" : "ubaseitemsize",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "ubaseitemcount",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "upassitemsize",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "upassitemcount",	"c" : 1,},			
			{	"t" : "GS_SceneBattlePassConfig_BaseItem",	"s" : "ubaseitemsize",	"k" : "data1",	"c" : 0,	"ck" : "ubaseitemcount",},			
			{	"t" : "GS_SceneBattlePassConfig_PassItem",	"s" : "upassitemsize",	"k" : "data2",	"c" : 0,	"ck" : "upassitemcount",},
		]

}
export class GS_SceneBattlePass2GetReward  {			
	nid : number;			
	btindex : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nid",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btindex",	"c" : 1,},
		]

}
export class GS_SceneBattlePass2Private_Item  {			
	nid : number;			
	ncycleid : number;			
	btmode : number;			
	nflag1 : number;			
	nflag2 : number;			
	nflag3 : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ncycleid",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btmode",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nflag1",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nflag2",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nflag3",	"c" : 1,},
		]

}
export class GS_SceneBattlePass4Private_Item  {			
	nid : number;			
	btmodeflag : number;			
	nflag1 : number;			
	nflag2 : number;			
	nflag3 : number;			
	nsignflag : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nid",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btmodeflag",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nflag1",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nflag2",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nflag3",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nsignflag",	"c" : 1,},
		]

}
export class GS_SceneBattlePass4FreeVideo  {			
	nwarid : number;			
	szorder : string;			
	nsdkid : number;			
	szsdkkey : string;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"k" : "nwarid",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szorder",	"c" : 32,},			
			{	"t" : "slong",	"k" : "nsdkid",	"c" : 1,},			
			{	"t" : "char",	"k" : "szsdkkey",	"c" : 32,},
		]

}
export class GS_SceneBattlePassSetOrder  {			
	szorder : string;			
	nrmb : number;
	protoList:any[] = 
		[			
			{	"t" : "stchar",	"k" : "szorder",	"c" : 32,},			
			{	"t" : "slong",	"k" : "nrmb",	"c" : 1,},
		]

}
export class GS_SceneBattlePass3Config_BaseItem  {			
	nid : number;			
	nopenwarid : number;			
	nrmb1 : number;			
	noriginalrmb1 : number;			
	ngoodsid1 : number;			
	ngoodsnum1 : number;			
	btbuytype1 : number;			
	nneedgoodsid1 : number;			
	nneedgoodsnum1 : number;			
	nrmb2 : number;			
	noriginalrmb2 : number;			
	ngoodsid2 : number;			
	ngoodsnum2 : number;			
	btbuytype2 : number;			
	nneedgoodsid2 : number;			
	nneedgoodsnum2 : number;			
	btnormalfv : number;			
	btpassitemcount : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nopenwarid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nrmb1",	"c" : 1,},			
			{	"t" : "slong",	"k" : "noriginalrmb1",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsid1",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsnum1",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btbuytype1",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nneedgoodsid1",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nneedgoodsnum1",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nrmb2",	"c" : 1,},			
			{	"t" : "slong",	"k" : "noriginalrmb2",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsid2",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsnum2",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btbuytype2",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nneedgoodsid2",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nneedgoodsnum2",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btnormalfv",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btpassitemcount",	"c" : 1,},
		]

}
 

 