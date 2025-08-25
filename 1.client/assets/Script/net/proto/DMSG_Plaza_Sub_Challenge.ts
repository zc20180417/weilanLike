export enum GS_PLAZA_CHALLENGE_MSG
{
	PLAZA_CHALLENGE_CONFIG					= 0,	//基础配置					s->c
	PLAZA_CHALLENGE_DAYDATA					= 1,	//今日数据					s->c
	PLAZA_CHALLENGE_PRIVATE					= 2,	//私人数据					s->c
	PLAZA_CHALLENGE_REQUESTWAR				= 3,	//请求战争					c->s
	PLAZA_CHALLENGE_OPENWAR					= 4,	//开启战争					s->c
	PLAZA_CHALLENGE_REQWIN					= 5,	//请求胜利					c->s
	PLAZA_CHALLENGE_RETREQWIN				= 6,	//请求胜利返回				s->c
	PLAZA_CHALLENGE_REQLOST					= 7,	//请求失败					c->s
	PLAZA_CHALLENGE_RETREQLOST				= 8,	//请求失败返回				s->c
	PLAZA_CHALLENGE_CLOSE					= 9,	//关闭功能					s->c
	PLAZA_CHALLENGE_RANKING					= 10,	//排行榜					s->c
	PLAZA_CHALLENGE_UPRANKING				= 11,	//更新排行榜单个个人数据	s->c	
	PLAZA_CHALLENGE_MAX
}
export class GS_ChallengeHead  {
	protoList:any[] = 
		[
		]

}
export class GS_ChallengeData_WarItem  {			
	nwarid : number;			
	btdifflv : number;			
	btplaytype : number;			
	btisopenmap : number;			
	szbgpic : string;			
	btpathtype : number;			
	szpathres : string;			
	szname : string;			
	szdes : string;			
	szsceneres : string;			
	nfinishrewardgoodsid : number;			
	nfinishrewardgoodsnum : number;			
	task : GS_ChallengeData_TaskInfo[];
	taskClass : any = GS_ChallengeData_TaskInfo;			
	nmonsteridlist : number[];			
	ntroopsids : number[];			
	ntroopslvs : number[];
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "slong",	"k" : "nwarid",},			
			{	"c" : 1,	"t" : "uchar",	"k" : "btdifflv",},			
			{	"c" : 1,	"t" : "uchar",	"k" : "btplaytype",},			
			{	"c" : 1,	"t" : "uchar",	"k" : "btisopenmap",},			
			{	"c" : 32,	"t" : "stchar",	"k" : "szbgpic",},			
			{	"c" : 1,	"t" : "uchar",	"k" : "btpathtype",},			
			{	"c" : 32,	"t" : "stchar",	"k" : "szpathres",},			
			{	"c" : 32,	"t" : "stchar",	"k" : "szname",},			
			{	"c" : 32,	"t" : "stchar",	"k" : "szdes",},			
			{	"c" : 32,	"t" : "stchar",	"k" : "szsceneres",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nfinishrewardgoodsid",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nfinishrewardgoodsnum",},			
			{	"c" : 3,	"t" : "GS_ChallengeData_TaskInfo",	"k" : "task",},			
			{	"c" : 64,	"t" : "slong",	"k" : "nmonsteridlist",},			
			{	"c" : 10,	"t" : "slong",	"k" : "ntroopsids",},			
			{	"c" : 10,	"t" : "slong",	"k" : "ntroopslvs",},
		]

}
export class GS_ChallengeRanking  {			
	uitemcount : number;			
	uitemsize : number;			
	rankings : GS_ChallengeRanking_RankingItem[];
	rankingsClass : any = GS_ChallengeRanking_RankingItem;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "ushort",	"k" : "uitemcount",},			
			{	"c" : 1,	"t" : "ushort",	"k" : "uitemsize",},			
			{	"ck" : "uitemcount",	"c" : 0,	"t" : "GS_ChallengeRanking_RankingItem",	"s" : "uitemsize",	"k" : "rankings",},
		]

}
export class GS_ChallengeOpenWar_RefMonster  {			
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
			{	"c" : 1,	"t" : "slong",	"k" : "nappeartime",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nspace",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nbloodratio",},			
			{	"c" : 1,	"t" : "slong",	"k" : "npoint1monterboxid",},			
			{	"c" : 1,	"t" : "slong",	"k" : "npoint2monterboxid",},			
			{	"c" : 1,	"t" : "slong",	"k" : "npoint3monterboxid",},			
			{	"c" : 1,	"t" : "slong",	"k" : "npoint4monterboxid",},			
			{	"c" : 1,	"t" : "slong",	"k" : "npoint5monterboxid",},
		]

}
export class GS_ChallengeConfig  {			
	nopenwarid : number;			
	uopenneedstrengths : number[];
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "slong",	"k" : "nopenwarid",},			
			{	"c" : 10,	"t" : "ushort",	"k" : "uopenneedstrengths",},
		]

}
export class GS_ChallengePrivate_WarItemData  {			
	nid : number;			
	nfasttime : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "slong",	"k" : "nid",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nfasttime",},
		]

}
export class GS_ChallengeData  {			
	uitemcount : number;			
	uitemsize : number;			
	warlist : GS_ChallengeData_WarItem[];
	warlistClass : any = GS_ChallengeData_WarItem;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "ushort",	"k" : "uitemcount",},			
			{	"c" : 1,	"t" : "ushort",	"k" : "uitemsize",},			
			{	"ck" : "uitemcount",	"c" : 0,	"t" : "GS_ChallengeData_WarItem",	"s" : "uitemsize",	"k" : "warlist",},
		]

}
export class GS_ChallengeOpenWar_WarTaskData  {			
	bttype : number;			
	npicid : number;			
	nmarkpicid : number;			
	szdes : string;			
	nrewardgoodsid : number;			
	nrewardgoodsnums : number;			
	nparams : number[];
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "uchar",	"k" : "bttype",},			
			{	"c" : 1,	"t" : "slong",	"k" : "npicid",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nmarkpicid",},			
			{	"c" : 64,	"t" : "stchar",	"k" : "szdes",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nrewardgoodsid",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nrewardgoodsnums",},			
			{	"c" : 6,	"t" : "slong",	"k" : "nparams",},
		]

}
export class GS_ChallengeClose  {
	protoList:any[] = 
		[
		]

}
export class GS_ChallengeReqLost  {			
	nwarid : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "slong",	"k" : "nwarid",},
		]

}
export class GS_ChallengeData_TaskInfo  {			
	bttype : number;			
	npicid : number;			
	szdes : string;			
	nrewardgoodsid : number;			
	nrewardgoodsnums : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "uchar",	"k" : "bttype",},			
			{	"c" : 1,	"t" : "slong",	"k" : "npicid",},			
			{	"c" : 64,	"t" : "stchar",	"k" : "szdes",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nrewardgoodsid",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nrewardgoodsnums",},
		]

}
export class GS_ChallengeRanking_RankingItem  {			
	uranking : number;			
	nactordbid : number;			
	szname : string;			
	szmd5face : string;			
	nfaceid : number;			
	nfaceframeid : number;			
	btsex : number;			
	nusetime : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "ushort",	"k" : "uranking",},			
			{	"c" : 1,	"t" : "sint64",	"k" : "nactordbid",},			
			{	"c" : 32,	"t" : "stchar",	"k" : "szname",},			
			{	"c" : 33,	"t" : "stchar",	"k" : "szmd5face",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nfaceid",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nfaceframeid",},			
			{	"c" : 1,	"t" : "uchar",	"k" : "btsex",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nusetime",},
		]

}
export class GS_ChallengeOpenWar  {			
	btdifflv : number;			
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
	nfinishrewardgoodsid : number;			
	nfinishrewardgoodsnum : number;			
	ntroopsids : number[];			
	ntroopslvs : number[];			
	nreconnectionid : number;			
	utaskcount : number;			
	utasksize : number;			
	urefmonstercount : number;			
	urefmonstersize : number;			
	data1 : GS_ChallengeOpenWar_WarTaskData[];
	data1Class : any = GS_ChallengeOpenWar_WarTaskData;			
	data2 : GS_ChallengeOpenWar_RefMonster[];
	data2Class : any = GS_ChallengeOpenWar_RefMonster;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "uchar",	"k" : "btdifflv",},			
			{	"c" : 1,	"t" : "sint64",	"k" : "nwarid",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nloadid",},			
			{	"c" : 32,	"t" : "stchar",	"k" : "szname",},			
			{	"c" : 32,	"t" : "stchar",	"k" : "szsceneres",},			
			{	"c" : 32,	"t" : "stchar",	"k" : "szdes",},			
			{	"c" : 32,	"t" : "stchar",	"k" : "szbgmusic",},			
			{	"c" : 32,	"t" : "stchar",	"k" : "szbgpic",},			
			{	"c" : 1,	"t" : "uchar",	"k" : "btpathtype",},			
			{	"c" : 32,	"t" : "stchar",	"k" : "szpathres",},			
			{	"c" : 1,	"t" : "ushort",	"k" : "utipsid",},			
			{	"c" : 1,	"t" : "uchar",	"k" : "btplaytype",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nplaytimes",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nrolehp",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nloopratio",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nloopcount",},			
			{	"c" : 1,	"t" : "uchar",	"k" : "btisopenmap",},			
			{	"c" : 10,	"t" : "slong",	"k" : "nopenskillcards",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nstar2rule",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nstar3rule",},			
			{	"c" : 1,	"t" : "ulong",	"k" : "ninitgold",},			
			{	"c" : 4,	"t" : "uchar",	"k" : "btwinrule",},			
			{	"c" : 8,	"t" : "slong",	"k" : "nclearscenethingid",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nmonsterhpaddper",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nscenehpaddper",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nfinishrewardgoodsid",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nfinishrewardgoodsnum",},			
			{	"c" : 10,	"t" : "slong",	"k" : "ntroopsids",},			
			{	"c" : 10,	"t" : "slong",	"k" : "ntroopslvs",},			
			{	"c" : 1,	"t" : "sint64",	"k" : "nreconnectionid",},			
			{	"c" : 1,	"t" : "ushort",	"k" : "utaskcount",},			
			{	"c" : 1,	"t" : "ushort",	"k" : "utasksize",},			
			{	"c" : 1,	"t" : "ushort",	"k" : "urefmonstercount",},			
			{	"c" : 1,	"t" : "ushort",	"k" : "urefmonstersize",},			
			{	"ck" : "utaskcount",	"c" : 0,	"t" : "GS_ChallengeOpenWar_WarTaskData",	"k" : "data1",	"s" : "utasksize",},			
			{	"ck" : "urefmonstercount",	"c" : 0,	"t" : "GS_ChallengeOpenWar_RefMonster",	"k" : "data2",	"s" : "urefmonstersize",},
		]

}
export class GS_ChallengePrivate  {			
	uitemcount : number;			
	uitemsize : number;			
	warlist : GS_ChallengePrivate_WarItemData[];
	warlistClass : any = GS_ChallengePrivate_WarItemData;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "ushort",	"k" : "uitemcount",},			
			{	"c" : 1,	"t" : "ushort",	"k" : "uitemsize",},			
			{	"ck" : "uitemcount",	"c" : 0,	"t" : "GS_ChallengePrivate_WarItemData",	"s" : "uitemsize",	"k" : "warlist",},
		]

}
export class GS_ChallengeUpRanking  {			
	uranking : number;			
	nactordbid : number;			
	szname : string;			
	szmd5face : string;			
	nfaceid : number;			
	nfaceframeid : number;			
	btsex : number;			
	nusetime : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "ushort",	"k" : "uranking",},			
			{	"c" : 1,	"t" : "sint64",	"k" : "nactordbid",},			
			{	"c" : 32,	"t" : "stchar",	"k" : "szname",},			
			{	"c" : 33,	"t" : "stchar",	"k" : "szmd5face",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nfaceid",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nfaceframeid",},			
			{	"c" : 1,	"t" : "uchar",	"k" : "btsex",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nusetime",},
		]

}
export class GS_ChallengeRequestWar  {			
	nwarid : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "slong",	"k" : "nwarid",},
		]

}
export class GS_ChallengeRetReqWin  {			
	nwarid : number;			
	btscoreflag : number;			
	nusetime : number;			
	btfirstfinish : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "slong",	"k" : "nwarid",},			
			{	"c" : 1,	"t" : "uchar",	"k" : "btscoreflag",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nusetime",},			
			{	"c" : 1,	"t" : "uchar",	"k" : "btfirstfinish",},
		]

}
export class GS_ChallengeRetReqLost  {			
	nwarid : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "slong",	"k" : "nwarid",},
		]

}
export class GS_ChallengeReqWin  {			
	nwarid : number;			
	btscoreflag : number;			
	nusetime : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "slong",	"k" : "nwarid",},			
			{	"c" : 1,	"t" : "uchar",	"k" : "btscoreflag",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nusetime",},
		]

}
 

 