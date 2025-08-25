export enum GS_PLAZA_BOUNTY_MSG
{
	PLAZA_BOUNTY_CONFIG					= 0,	//赏金配置					s->c
	PLAZA_BOUNTY_DATA					= 1,	//赏金个人数据				s->c
	PLAZA_BOUNTY_OPENGRID				= 2,	//开启猫咪格				c->s
	PLAZA_BOUNTY_UPGRID					= 3,	//下发猫咪格状况			s->c
	PLAZA_BOUNTY_SETTROOPS				= 4,	//设置猫咪					c->s
	PLAZA_BOUNTY_SETTROOPSRET			= 5,	//设置猫咪返回				s->c
	PLAZA_BOUNTY_REFMAP					= 6,	//刷新地图					c->s
	PLAZA_BOUNTY_REFMATRET				= 7,	//刷新地图返回				s->c
	PLAZA_BOUNTY_REQUESTWAR				= 8,	//请求战争					c->s
	PLAZA_BOUNTY_OPENWAR				= 9,	//开启战争					s->c
	PLAZA_BOUNTY_REQWIN					= 10,	//请求胜利					c->s
	PLAZA_BOUNTY_RETREQWIN				= 11,	//请求胜利返回				s->c
	PLAZA_BOUNTY_REQLOST				= 12,	//请求失败					c->s
	PLAZA_BOUNTY_RETREQLOST				= 13,	//请求失败返回				s->c
	PLAZA_BOUNTY_CLOSE					= 14,	//关闭功能					s->c	
	PLAZA_BOUNTY_GETREWARD				= 15,	//领取奖励					c->s
	PLAZA_BOUNTY_UPDAYCOUNT				= 16,	//更新今日领取次数			s->c
	PLAZA_BOUNTY_FREEVIDEOORDER			= 17,	//视频订单返回				s->c
	PLAZA_BOUNTY_MAX
}
export class GS_BountyHead  {
	protoList:any[] = 
		[
		]

}
export class GS_BountySetTroops  {			
	btindex : number;			
	ntroopsid : number;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"k" : "btindex",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ntroopsid",	"c" : 1,},
		]

}
export class GS_BountyOpenGrid  {			
	btindex : number;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"k" : "btindex",	"c" : 1,},
		]

}
export class GS_BountyOpenWar_RefMonster  {			
	nappeartime : number;			
	nspace : number;			
	nbloodratio : number;			
	npoint1monterboxid : number;			
	npoint2monterboxid : number;			
	npoint3monterboxid : number;			
	npoint4monterboxid : number;			
	npoint5monterboxid : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nappeartime",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nspace",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nbloodratio",	"c" : 1,},			
			{	"t" : "slong",	"k" : "npoint1monterboxid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "npoint2monterboxid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "npoint3monterboxid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "npoint4monterboxid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "npoint5monterboxid",	"c" : 1,},
		]

}
export class GS_BountyReqLost  {			
	nwarid : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nwarid",	"c" : 1,},
		]

}
export class GS_BountyData_TaskInfo  {			
	bttype : number;			
	npicid : number;			
	szdes : string;			
	nrewardgoodsid : number;			
	nrewardgoodsnums : number;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"k" : "bttype",	"c" : 1,},			
			{	"t" : "slong",	"k" : "npicid",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szdes",	"c" : 64,},			
			{	"t" : "slong",	"k" : "nrewardgoodsid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nrewardgoodsnums",	"c" : 1,},
		]

}
export class GS_BountyRefMap  {
	protoList:any[] = 
		[
		]

}
export class GS_BountyData  {			
	ntroopsid : number[];			
	bttroopsgridstate : number[];			
	ndayrewardcount : number;			
	nwarid : number;			
	btscoreflag : number;			
	btdifficulty : number;			
	btplaytype : number;			
	btisopenmap : number;			
	btwinrule : number[];			
	szsceneres : string;			
	szbgpic : string;			
	btpathtype : number;			
	szpathres : string;			
	nstar2rule : number;			
	nstar3rule : number;			
	nfullrewardgoodsid : number;			
	nfullrewardgoodsnum : number;			
	nstart3rewardgoodsid : number;			
	nstart3rewardgoodsnum : number;			
	nclearrewardgoodsid : number;			
	nclearrewardgoodsnum : number;			
	task : GS_BountyData_TaskInfo[];
	taskClass : any = GS_BountyData_TaskInfo;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "ntroopsid",	"c" : 9,},			
			{	"t" : "uchar",	"k" : "bttroopsgridstate",	"c" : 9,},			
			{	"t" : "ushort",	"k" : "ndayrewardcount",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nwarid",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btscoreflag",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btdifficulty",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btplaytype",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btisopenmap",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btwinrule",	"c" : 4,},			
			{	"t" : "stchar",	"k" : "szsceneres",	"c" : 32,},			
			{	"t" : "stchar",	"k" : "szbgpic",	"c" : 32,},			
			{	"t" : "uchar",	"k" : "btpathtype",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szpathres",	"c" : 32,},			
			{	"t" : "slong",	"k" : "nstar2rule",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nstar3rule",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nfullrewardgoodsid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nfullrewardgoodsnum",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nstart3rewardgoodsid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nstart3rewardgoodsnum",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nclearrewardgoodsid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nclearrewardgoodsnum",	"c" : 1,},			
			{	"t" : "GS_BountyData_TaskInfo",	"k" : "task",	"c" : 3,},
		]

}
export class GS_BountyRetReqWin  {			
	nwarid : number;			
	btscoreflag : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nwarid",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btscoreflag",	"c" : 1,},
		]

}
export class GS_BountyOpenWar  {			
	btdifficulty : number;			
	nwarid : number;			
	nloadid : number;			
	szname : string;			
	szsceneres : string;			
	szdes : string;			
	szbgmusic : string;			
	szbgpic : string;			
	btpathtype : number;			
	szpathres : string;			
	utipsid : number;			
	btplaytype : number;			
	nplaytimes : number;			
	nrolehp : number;			
	nloopratio : number;			
	nloopcount : number;			
	btisopenmap : number;			
	nopenskillcards : number[];			
	nstar2rule : number;			
	nstar3rule : number;			
	ninitgold : number;			
	btwinrule : number[];			
	nclearscenethingid : number[];			
	nmonsterhpaddper : number;			
	nscenehpaddper : number;			
	tasklist : GS_BountyOpenWar_WarTaskData[];
	tasklistClass : any = GS_BountyOpenWar_WarTaskData;			
	nfullrewardgoodsid : number;			
	nfullrewardgoodsnum : number;			
	nstart3rewardgoodsid : number;			
	nstart3rewardgoodsnum : number;			
	nclearrewardgoodsid : number;			
	nclearrewardgoodsnum : number;			
	nreconnectionid : number;			
	urefmonstercount : number;			
	urefmonstersize : number;			
	data1 : GS_BountyOpenWar_RefMonster[];
	data1Class : any = GS_BountyOpenWar_RefMonster;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"k" : "btdifficulty",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nwarid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nloadid",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szname",	"c" : 32,},			
			{	"t" : "stchar",	"k" : "szsceneres",	"c" : 32,},			
			{	"t" : "stchar",	"k" : "szdes",	"c" : 32,},			
			{	"t" : "stchar",	"k" : "szbgmusic",	"c" : 32,},			
			{	"t" : "stchar",	"k" : "szbgpic",	"c" : 32,},			
			{	"t" : "uchar",	"k" : "btpathtype",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szpathres",	"c" : 32,},			
			{	"t" : "ushort",	"k" : "utipsid",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btplaytype",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nplaytimes",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nrolehp",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nloopratio",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nloopcount",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btisopenmap",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nopenskillcards",	"c" : 10,},			
			{	"t" : "slong",	"k" : "nstar2rule",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nstar3rule",	"c" : 1,},			
			{	"t" : "ulong",	"k" : "ninitgold",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btwinrule",	"c" : 4,},			
			{	"t" : "slong",	"k" : "nclearscenethingid",	"c" : 8,},			
			{	"t" : "slong",	"k" : "nmonsterhpaddper",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nscenehpaddper",	"c" : 1,},			
			{	"t" : "GS_BountyOpenWar_WarTaskData",	"k" : "tasklist",	"c" : 3,},			
			{	"t" : "slong",	"k" : "nfullrewardgoodsid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nfullrewardgoodsnum",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nstart3rewardgoodsid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nstart3rewardgoodsnum",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nclearrewardgoodsid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nclearrewardgoodsnum",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nreconnectionid",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "urefmonstercount",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "urefmonstersize",	"c" : 1,},			
			{	"t" : "GS_BountyOpenWar_RefMonster",	"ck" : "urefmonstercount",	"c" : 0,	"k" : "data1",	"s" : "urefmonstersize",},
		]

}
export class GS_BountyConfig  {			
	nopenwarid : number;			
	btrefmode : number;			
	urefneeddiamonds : number;			
	uactiveneeddiamonds : number[];			
	btpowerlvcount : number;			
	npowerlv : number[];			
	npowerfightadd : number[];			
	nstrength : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nopenwarid",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btrefmode",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "urefneeddiamonds",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uactiveneeddiamonds",	"c" : 9,},			
			{	"t" : "uchar",	"k" : "btpowerlvcount",	"c" : 1,},			
			{	"t" : "slong",	"k" : "npowerlv",	"c" : 128,},			
			{	"t" : "slong",	"k" : "npowerfightadd",	"c" : 9,},			
			{	"t" : "slong",	"k" : "nstrength",	"c" : 1,},
		]

}
export class GS_BountyUpGrid  {			
	btindex : number;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"k" : "btindex",	"c" : 1,},
		]

}
export class GS_BountyFreeVideoRet  {			
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
export class GS_BountyGetReward  {			
	nwarid : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nwarid",	"c" : 1,},
		]

}
export class GS_BountyReqWin  {			
	nwarid : number;			
	btscoreflag : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nwarid",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btscoreflag",	"c" : 1,},
		]

}
export class GS_BountyRetReqLost  {			
	nwarid : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nwarid",	"c" : 1,},
		]

}
export class GS_BountySetTroopsRet  {			
	btindex : number;			
	ntroopsid : number;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"k" : "btindex",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ntroopsid",	"c" : 1,},
		]

}
export class GS_BountyRefMapRet  {			
	ntroopsid : number[];			
	bttroopsgridstate : number[];			
	ndayrewardcount : number;			
	nwarid : number;			
	btscoreflag : number;			
	btdifficulty : number;			
	btplaytype : number;			
	btisopenmap : number;			
	btwinrule : number[];			
	szsceneres : string;			
	szbgpic : string;			
	btpathtype : number;			
	szpathres : string;			
	nstar2rule : number;			
	nstar3rule : number;			
	nfullrewardgoodsid : number;			
	nfullrewardgoodsnum : number;			
	nstart3rewardgoodsid : number;			
	nstart3rewardgoodsnum : number;			
	nclearrewardgoodsid : number;			
	nclearrewardgoodsnum : number;			
	task : GS_BountyRefMapRet_TaskInfo[];
	taskClass : any = GS_BountyRefMapRet_TaskInfo;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "ntroopsid",	"c" : 9,},			
			{	"t" : "uchar",	"k" : "bttroopsgridstate",	"c" : 9,},			
			{	"t" : "ushort",	"k" : "ndayrewardcount",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nwarid",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btscoreflag",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btdifficulty",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btplaytype",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btisopenmap",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btwinrule",	"c" : 4,},			
			{	"t" : "stchar",	"k" : "szsceneres",	"c" : 32,},			
			{	"t" : "stchar",	"k" : "szbgpic",	"c" : 32,},			
			{	"t" : "uchar",	"k" : "btpathtype",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szpathres",	"c" : 32,},			
			{	"t" : "slong",	"k" : "nstar2rule",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nstar3rule",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nfullrewardgoodsid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nfullrewardgoodsnum",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nstart3rewardgoodsid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nstart3rewardgoodsnum",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nclearrewardgoodsid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nclearrewardgoodsnum",	"c" : 1,},			
			{	"t" : "GS_BountyRefMapRet_TaskInfo",	"k" : "task",	"c" : 3,},
		]

}
export class GS_BountyUpDayCount  {			
	ndayrewardcount : number;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"k" : "ndayrewardcount",	"c" : 1,},
		]

}
export class GS_BountyClose  {
	protoList:any[] = 
		[
		]

}
export class GS_BountyOpenWar_WarTaskData  {			
	bttype : number;			
	npicid : number;			
	nmarkpicid : number;			
	szdes : string;			
	nrewardgoodsid : number;			
	nrewardgoodsnums : number;			
	nparams : number[];
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"k" : "bttype",	"c" : 1,},			
			{	"t" : "slong",	"k" : "npicid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nmarkpicid",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szdes",	"c" : 64,},			
			{	"t" : "slong",	"k" : "nrewardgoodsid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nrewardgoodsnums",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nparams",	"c" : 6,},
		]

}
export class GS_BountyRefMapRet_TaskInfo  {			
	bttype : number;			
	npicid : number;			
	szdes : string;			
	nrewardgoodsid : number;			
	nrewardgoodsnums : number;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"k" : "bttype",	"c" : 1,},			
			{	"t" : "slong",	"k" : "npicid",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szdes",	"c" : 64,},			
			{	"t" : "slong",	"k" : "nrewardgoodsid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nrewardgoodsnums",	"c" : 1,},
		]

}
export class GS_BountyRequestWar  {			
	nwarid : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nwarid",	"c" : 1,},
		]

}
 

 