export enum GS_PLAZA_STRENG_MSG
{	
	PLAZA_STRENG_CONFIG		= 0,	//强化配置		s->c
	PLAZA_STRENG_DATA		= 1,	//强化个人数据	s->c
	PLAZA_STRENG_UPLEVEL	= 2,	//升级			c->s
	PLAZA_STRENG_RETUPLEVEL	= 3,	//升级返回		s->c
	PLAZA_STRENG_ACTIVE		= 4,	//激活			c->s
	PLAZA_STRENG_RETACTIVE	= 5,	//激活返回		s->c
	PLAZA_STRENG_TIPS		= 6,	//提示信息		s->c
	PLAZA_STRENG_RESET		= 7,	//重置			c->s
	PLAZA_STRENG_RETRESET	= 8,	//重置完成		s->c
	PLAZA_STRENG_MAX
}
export enum STRENGTIPS
{
	STRENGTIPS_FINISH	= 0,	//操作完成
	STRENGTIPS_FAIL		= 1,	//操作失败
}
export class GS_StrengHead  {
	protoList:any[] = 
		[
		]

}
export class GS_StrengTips  {			
	bttype : number;			
	szdes : string;
	protoList:any[] = 
		[			
			{	"k" : "bttype",	"t" : "uchar",	"c" : 1,},			
			{	"k" : "szdes",	"t" : "stchar",	"c" : 128,},
		]

}
export class GS_StrengConfig_LevelItem  {			
	btlevel : number;			
	nupgradegoodsnums : number;			
	nfightscore : number[];			
	nvalue : number;
	protoList:any[] = 
		[			
			{	"k" : "btlevel",	"t" : "uchar",	"c" : 1,},			
			{	"k" : "nupgradegoodsnums",	"t" : "slong",	"c" : 1,},			
			{	"k" : "nfightscore",	"t" : "slong",	"c" : 5,},			
			{	"k" : "nvalue",	"t" : "slong",	"c" : 1,},
		]

}
export class GS_StrengReset  {			
	bttype : number;
	protoList:any[] = 
		[			
			{	"k" : "bttype",	"t" : "uchar",	"c" : 1,},
		]

}
export class GS_StrengUpLevel  {			
	nid : number;
	protoList:any[] = 
		[			
			{	"k" : "nid",	"t" : "slong",	"c" : 1,},
		]

}
export class GS_StrengRetUpLevel  {			
	nid : number;			
	nlevel : number;
	protoList:any[] = 
		[			
			{	"k" : "nid",	"t" : "slong",	"c" : 1,},			
			{	"k" : "nlevel",	"t" : "slong",	"c" : 1,},
		]

}
export class GS_StrengConfig  {			
	nopenwarid : number;			
	uitemsize : number;			
	uitemcount : number;			
	strenglist : GS_StrengConfig_StrengItem[];
	strenglistClass : any = GS_StrengConfig_StrengItem;
	protoList:any[] = 
		[			
			{	"k" : "nopenwarid",	"t" : "sint64",	"c" : 1,},			
			{	"k" : "uitemsize",	"t" : "ushort",	"c" : 1,},			
			{	"k" : "uitemcount",	"t" : "ushort",	"c" : 1,},			
			{	"t" : "GS_StrengConfig_StrengItem",	"c" : 0,	"ck" : "uitemcount",	"s" : "uitemsize",	"k" : "strenglist",},
		]

}
export class GS_StrengData_StrengData  {			
	nid : number;			
	nlevel : number;
	protoList:any[] = 
		[			
			{	"k" : "nid",	"t" : "slong",	"c" : 1,},			
			{	"k" : "nlevel",	"t" : "slong",	"c" : 1,},
		]

}
export class GS_StrengRetReset  {			
	bttype : number;			
	ngoodid : number;			
	ngoodsnums : number;
	protoList:any[] = 
		[			
			{	"k" : "bttype",	"t" : "uchar",	"c" : 1,},			
			{	"k" : "ngoodid",	"t" : "slong",	"c" : 1,},			
			{	"k" : "ngoodsnums",	"t" : "slong",	"c" : 1,},
		]

}
export class GS_StrengData  {			
	uitemsize : number;			
	uitemcount : number;			
	strengdatalist : GS_StrengData_StrengData[];
	strengdatalistClass : any = GS_StrengData_StrengData;
	protoList:any[] = 
		[			
			{	"k" : "uitemsize",	"t" : "ushort",	"c" : 1,},			
			{	"k" : "uitemcount",	"t" : "ushort",	"c" : 1,},			
			{	"t" : "GS_StrengData_StrengData",	"c" : 0,	"ck" : "uitemcount",	"s" : "uitemsize",	"k" : "strengdatalist",},
		]

}
export class GS_StrengActive  {			
	nid : number;
	protoList:any[] = 
		[			
			{	"k" : "nid",	"t" : "slong",	"c" : 1,},
		]

}
export class GS_StrengConfig_StrengItem  {			
	nid : number;			
	szname : string;			
	npicid : number;			
	szdes : string;			
	bttype : number;			
	nfrontstrengid : number[];			
	btrolecardtype : number;			
	ntroopsid : number;			
	nparams : number[];			
	btmaxlevel : number;			
	level : GS_StrengConfig_LevelItem[];
	levelClass : any = GS_StrengConfig_LevelItem;
	protoList:any[] = 
		[			
			{	"k" : "nid",	"t" : "slong",	"c" : 1,},			
			{	"k" : "szname",	"t" : "stchar",	"c" : 32,},			
			{	"k" : "npicid",	"t" : "slong",	"c" : 1,},			
			{	"k" : "szdes",	"t" : "stchar",	"c" : 128,},			
			{	"k" : "bttype",	"t" : "uchar",	"c" : 1,},			
			{	"k" : "nfrontstrengid",	"t" : "slong",	"c" : 2,},			
			{	"k" : "btrolecardtype",	"t" : "uchar",	"c" : 1,},			
			{	"k" : "ntroopsid",	"t" : "slong",	"c" : 1,},			
			{	"k" : "nparams",	"t" : "slong",	"c" : 3,},			
			{	"k" : "btmaxlevel",	"t" : "uchar",	"c" : 1,},			
			{	"k" : "level",	"t" : "GS_StrengConfig_LevelItem",	"c" : 15,},
		]

}
export class GS_StrengRetActive  {			
	nid : number;			
	nlevel : number;
	protoList:any[] = 
		[			
			{	"k" : "nid",	"t" : "slong",	"c" : 1,},			
			{	"k" : "nlevel",	"t" : "slong",	"c" : 1,},
		]

}
 

 