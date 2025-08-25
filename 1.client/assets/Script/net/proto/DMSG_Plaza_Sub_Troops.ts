export enum GS_PLAZA_TROOPS_MSG
{
	PLAZA_TROOPS_INFO					= 0,		//炮台配置				s->c
	PLAZA_TROOPS_LISTDATA				= 1,		//炮台激活的个人数据	s->c	
	PLAZA_TROOPS_ADDNEW					= 2,		//激活新的炮台			s->c	
	PLAZA_TROOPS_UPGRADESTAR			= 3,		//升星					c->s
	PLAZA_TROOPS_RETUPGRADESTAR			= 4,		//升星返回				s->c
	PLAZA_TROOPS_TIPS					= 5,		//提示信息				s->c
	PLAZA_TROOPS_ACTIVE					= 6,		//激活使用炮台			c->s
	PLAZA_TROOPS_RETACTIVE				= 7,		//返回激活				s->c
	PLAZA_TROOPS_SKILLCONFIG			= 8,		//技能配置				s->c
	PLAZA_TROOPS_GOODSACTIVE			= 9,		//物品激活炮台			c->s
	PLAZA_TROOPS_EQUIPINFO				= 10,		//炮台装备配置			s->c
	PLAZA_TROOPS_EQUIPDATA				= 11,		//炮台装备个人数据		s->c
	PLAZA_TROOPS_UPEQUIPDATA			= 12,		//下发更新炮台数据		s->c
	PLAZA_TROOPS_UPGRADEEQUIPLV			= 13,		//炮台装备升级			c->s
	PLAZA_TROOPS_ACTIVETROOPSEQUIP		= 14,		//炮台装备被激活		s->c
	PLAZA_TROOPS_STARINFO				= 15,		//炮台升星配置			s->c
	PLAZA_TROOPS_SWITCHCARD				= 16,		//满星多余卡片转物品	s->c
	PLAZA_TROOPS_BUYCARDBAG				= 17,		//购买卡包				c->s
	PLAZA_TROOPS_RMBORDER				= 18,		//快充订单				s->c
	PLAZA_TROOPS_STAR_EXTRA				= 19,		//炮塔升星额外效果		s->c
	PLAZA_TROOPS_MAX
}
export enum TROOPTIPS
{
	TROOPTIPS_FINISH	= 0,	//操作完成
	TROOPTIPS_FAIL		= 1,	//操作失败
}
export class GS_TroopsHead  {
	protoList:any[] = 
		[
		]

}
export class GS_TroopsStarInfo_TroopsBase  {			
	btquitylv : number;			
	btcount : number;			
	nswitchgoodsid : number;			
	nswitchgoodsnum : number;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"k" : "btquitylv",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "btcount",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nswitchgoodsid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nswitchgoodsnum",	"c" : 1,},
		]

}
export class GS_TroopsTips  {			
	bttype : number;			
	szdes : string;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"k" : "bttype",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szdes",	"c" : 128,},
		]

}
export class GS_TroopsListData  {			
	uitemsize : number;			
	uitemcount : number;			
	activelist : GS_TroopsListData_ActiveTroopsItem[];
	activelistClass : any = GS_TroopsListData_ActiveTroopsItem;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"k" : "uitemsize",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uitemcount",	"c" : 1,},			
			{	"t" : "GS_TroopsListData_ActiveTroopsItem",	"c" : 0,	"k" : "activelist",	"s" : "uitemsize",	"ck" : "uitemcount",},
		]

}
export class GS_SkillInfo_SkillInfoItem  {			
	nskillid : number;			
	bttargettype : number;			
	szname : string;			
	btskilltype : number;			
	szactname : string;			
	btloop : number;			
	btattackdirect : number;			
	btstatustriggertype : number;			
	uhittime : number;			
	uattackeffecttime : number;			
	levellist : GS_SkillInfo_SkillLevel[];
	levellistClass : any = GS_SkillInfo_SkillLevel;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nskillid",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "bttargettype",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szname",	"c" : 32,},			
			{	"t" : "uchar",	"k" : "btskilltype",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szactname",	"c" : 32,},			
			{	"t" : "uchar",	"k" : "btloop",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btattackdirect",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btstatustriggertype",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uhittime",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uattackeffecttime",	"c" : 1,},			
			{	"t" : "GS_SkillInfo_SkillLevel",	"k" : "levellist",	"c" : 4,},
		]

}
export class GS_TroopsActiveEquip  {			
	nid : number;			
	nlv : number;			
	naddprop : number;			
	nupneedgoodsid1 : number;			
	nupneedgoodsid2 : number;			
	nupneedgoodsnum1 : number;			
	nupneedgoodsnum2 : number;			
	nnextaddprop : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nlv",	"c" : 1,},			
			{	"t" : "slong",	"k" : "naddprop",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nupneedgoodsid1",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nupneedgoodsid2",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nupneedgoodsnum1",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nupneedgoodsnum2",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nnextaddprop",	"c" : 1,},
		]

}
export class GS_TroopsEquipInfo_EquipItem  {			
	nid : number;			
	szname : string;			
	szdes : string;			
	nactivegoodsid : number;			
	sz3dpicres : string;			
	szheadres : string;			
	szbooksres : string;			
	btproptype : number;			
	nlv1addprop : number;			
	umaxlv : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nid",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szname",	"c" : 32,},			
			{	"t" : "stchar",	"k" : "szdes",	"c" : 32,},			
			{	"t" : "slong",	"k" : "nactivegoodsid",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "sz3dpicres",	"c" : 32,},			
			{	"t" : "stchar",	"k" : "szheadres",	"c" : 32,},			
			{	"t" : "stchar",	"k" : "szbooksres",	"c" : 32,},			
			{	"t" : "uchar",	"k" : "btproptype",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nlv1addprop",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "umaxlv",	"c" : 1,},
		]

}
export class GS_TroopsEquipData_ActiveEquipItem  {			
	nid : number;			
	nlv : number;			
	naddprop : number;			
	nupneedgoodsid1 : number;			
	nupneedgoodsid2 : number;			
	nupneedgoodsnum1 : number;			
	nupneedgoodsnum2 : number;			
	nnextaddprop : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nlv",	"c" : 1,},			
			{	"t" : "slong",	"k" : "naddprop",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nupneedgoodsid1",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nupneedgoodsid2",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nupneedgoodsnum1",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nupneedgoodsnum2",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nnextaddprop",	"c" : 1,},
		]

}
export class GS_TroopsRetActive  {			
	ncanceltroopsid : number;			
	ntroopsid : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "ncanceltroopsid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ntroopsid",	"c" : 1,},
		]

}
export class GS_TroopsSwitchCard  {			
	ngoodsid : number;			
	ngoodsnums : number;			
	nswitchgoodsid : number;			
	nswitchgoodsnum : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "ngoodsid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsnums",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nswitchgoodsid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nswitchgoodsnum",	"c" : 1,},
		]

}
export class GS_TroopsActive  {			
	ntroopsid : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "ntroopsid",	"c" : 1,},
		]

}
export class GS_TroopsStarInfo  {			
	ubasesize : number;			
	ubasecount : number;			
	uupstaritemsize : number;			
	uupstaritemcount : number;			
	data1 : GS_TroopsStarInfo_TroopsBase[];
	data1Class : any = GS_TroopsStarInfo_TroopsBase;			
	data2 : GS_TroopsStarInfo_TroopUpStarItem[];
	data2Class : any = GS_TroopsStarInfo_TroopUpStarItem;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"k" : "ubasesize",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "ubasecount",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uupstaritemsize",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uupstaritemcount",	"c" : 1,},			
			{	"t" : "GS_TroopsStarInfo_TroopsBase",	"s" : "ubasesize",	"k" : "data1",	"c" : 0,	"ck" : "ubasecount",},			
			{	"t" : "GS_TroopsStarInfo_TroopUpStarItem",	"s" : "uupstaritemsize",	"k" : "data2",	"c" : 0,	"ck" : "uupstaritemcount",},
		]

}
export class GS_SkillInfo_SkillLevel  {			
	btlevel : number;			
	szattackeft : string;			
	szhiteft : string;			
	szsoundeft : string;			
	nstatusid : number;			
	nstatuslevel : number;			
	ustatustrggervalue : number;			
	nstatusid2 : number;			
	nstatuslevel2 : number;			
	ustatustrggervalue2 : number;			
	nstatusid3 : number;			
	nstatuslevel3 : number;			
	ustatustrggervalue3 : number;			
	nstatusid4 : number;			
	nstatuslevel4 : number;			
	ustatustrggervalue4 : number;			
	uhitinterval : number;			
	uattacktimes : number;			
	ucoolcd : number;			
	uattackdist : number;			
	udamageaddper : number;			
	uskillparam0 : number;			
	uskillparam1 : number;			
	uskillparam2 : number;			
	uskillparam3 : number;			
	uskillparam4 : number;			
	uskillparam5 : number;			
	uskillparam6 : number;			
	uskillparam7 : number;			
	uskillparam8 : number;			
	szskillparam9 : string;			
	uskillparam10 : number;			
	szskillparam11 : string;			
	uskillparam12 : number;			
	uskillparam13 : number;			
	uskillparam14 : number;			
	uskillparam15 : number;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"k" : "btlevel",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szattackeft",	"c" : 32,},			
			{	"t" : "stchar",	"k" : "szhiteft",	"c" : 32,},			
			{	"t" : "stchar",	"k" : "szsoundeft",	"c" : 32,},			
			{	"t" : "slong",	"k" : "nstatusid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nstatuslevel",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "ustatustrggervalue",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nstatusid2",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nstatuslevel2",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "ustatustrggervalue2",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nstatusid3",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nstatuslevel3",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "ustatustrggervalue3",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nstatusid4",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nstatuslevel4",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "ustatustrggervalue4",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uhitinterval",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uattacktimes",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "ucoolcd",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uattackdist",	"c" : 1,},			
			{	"t" : "ulong",	"k" : "udamageaddper",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uskillparam0",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uskillparam1",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uskillparam2",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uskillparam3",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uskillparam4",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uskillparam5",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uskillparam6",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uskillparam7",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uskillparam8",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szskillparam9",	"c" : 32,},			
			{	"t" : "ushort",	"k" : "uskillparam10",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szskillparam11",	"c" : 32,},			
			{	"t" : "ushort",	"k" : "uskillparam12",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uskillparam13",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uskillparam14",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uskillparam15",	"c" : 1,},
		]

}
export class GS_TroopsUpGradeStar  {			
	ntroopsid : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "ntroopsid",	"c" : 1,},
		]

}
export class GS_TroopsRmbOrder  {			
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
export class GS_SkillInfo  {			
	btstate : number;			
	uitemsize : number;			
	uitemcount : number;			
	infolist : GS_SkillInfo_SkillInfoItem[];
	infolistClass : any = GS_SkillInfo_SkillInfoItem;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"k" : "btstate",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uitemsize",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uitemcount",	"c" : 1,},			
			{	"t" : "GS_SkillInfo_SkillInfoItem",	"c" : 0,	"k" : "infolist",	"s" : "uitemsize",	"ck" : "uitemcount",},
		]

}
export class GS_TroopsGoodsActive  {			
	ntroopsid : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "ntroopsid",	"c" : 1,},
		]

}
export class GS_TroopsInfo  {			
	nsharegoodsid : number;			
	naddhurtstarnum : number;			
	naddhurtper : number;			
	naddattackdiststarnum : number;			
	naddattackdistper : number;			
	naddattackspeedstarnum : number;			
	naddattackspeedper : number;			
	nupstaraddgoodsid : number;			
	nupstaraddgoodsnum : number;			
	btstate : number;			
	uitemsize : number;			
	uitemcount : number;			
	infolist : GS_TroopsInfo_TroopsInfoItem[];
	infolistClass : any = GS_TroopsInfo_TroopsInfoItem;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nsharegoodsid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "naddhurtstarnum",	"c" : 1,},			
			{	"t" : "slong",	"k" : "naddhurtper",	"c" : 1,},			
			{	"t" : "slong",	"k" : "naddattackdiststarnum",	"c" : 1,},			
			{	"t" : "slong",	"k" : "naddattackdistper",	"c" : 1,},			
			{	"t" : "slong",	"k" : "naddattackspeedstarnum",	"c" : 1,},			
			{	"t" : "slong",	"k" : "naddattackspeedper",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nupstaraddgoodsid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nupstaraddgoodsnum",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btstate",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uitemsize",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uitemcount",	"c" : 1,},			
			{	"t" : "GS_TroopsInfo_TroopsInfoItem",	"c" : 0,	"k" : "infolist",	"s" : "uitemsize",	"ck" : "uitemcount",},
		]

}
export class GS_TroopsInfo_TroopsInfoItem  {			
	ntroopsid : number;			
	szname : string;			
	szdes1 : string;			
	szdes2 : string;			
	bttype : number;			
	btquality : number;			
	szskeletonres : string;			
	sz3dpicres : string;			
	szheadres : string;			
	szbooksres : string;			
	nequipid1 : number;			
	nequipid2 : number;			
	nequipid3 : number;			
	nskillid1 : number;			
	nskillid2 : number;			
	nskillid3 : number;			
	ncardgoodsid : number;			
	nactiveneedcardcount : number;			
	btdot : number;			
	btctr : number;			
	btprofit : number;			
	btattackhurt : number;			
	btattackspeed : number;			
	btattackdist : number;			
	ncritical : number;			
	levellist : GS_TroopsInfo_Level[];
	levellistClass : any = GS_TroopsInfo_Level;			
	btbuymode : number;			
	szrechargetips : string;			
	nbuyprice1 : number;			
	btbuytype1 : number;			
	nneedgoodsid1 : number;			
	nneedgoodsnum1 : number;			
	nbuyprice10 : number;			
	btbuytype10 : number;			
	nneedgoodsid10 : number;			
	nneedgoodsnum10 : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "ntroopsid",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szname",	"c" : 32,},			
			{	"t" : "stchar",	"k" : "szdes1",	"c" : 256,},			
			{	"t" : "stchar",	"k" : "szdes2",	"c" : 256,},			
			{	"t" : "uchar",	"k" : "bttype",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btquality",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szskeletonres",	"c" : 32,},			
			{	"t" : "stchar",	"k" : "sz3dpicres",	"c" : 32,},			
			{	"t" : "stchar",	"k" : "szheadres",	"c" : 32,},			
			{	"t" : "stchar",	"k" : "szbooksres",	"c" : 32,},			
			{	"t" : "slong",	"k" : "nequipid1",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nequipid2",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nequipid3",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nskillid1",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nskillid2",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nskillid3",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ncardgoodsid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nactiveneedcardcount",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btdot",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btctr",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btprofit",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btattackhurt",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btattackspeed",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btattackdist",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ncritical",	"c" : 1,},			
			{	"t" : "GS_TroopsInfo_Level",	"k" : "levellist",	"c" : 4,},			
			{	"t" : "uchar",	"k" : "btbuymode",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szrechargetips",	"c" : 32,},			
			{	"t" : "slong",	"k" : "nbuyprice1",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btbuytype1",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nneedgoodsid1",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nneedgoodsnum1",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nbuyprice10",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btbuytype10",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nneedgoodsid10",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nneedgoodsnum10",	"c" : 1,},
		]

}
export class GS_TroopsUpEquipLv  {			
	nid : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nid",	"c" : 1,},
		]

}
export class GS_TroopsStarExtraConfig  {			
	uitemsize : number;			
	uitemcount : number;			
	data : GS_TroopsStarExtraConfig_TroopsStarExtraItem[];
	dataClass : any = GS_TroopsStarExtraConfig_TroopsStarExtraItem;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"k" : "uitemsize",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uitemcount",	"c" : 1,},			
			{	"t" : "GS_TroopsStarExtraConfig_TroopsStarExtraItem",	"c" : 0,	"k" : "data",	"s" : "uitemsize",	"ck" : "uitemcount",},
		]

}
export class GS_TroopsListData_ActiveTroopsItem  {			
	ntroopsid : number;			
	nstarlevel : number;			
	btuse : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "ntroopsid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nstarlevel",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btuse",	"c" : 1,},
		]

}
export class GS_TroopsEquipData  {			
	uitemsize : number;			
	uitemcount : number;			
	activelist : GS_TroopsEquipData_ActiveEquipItem[];
	activelistClass : any = GS_TroopsEquipData_ActiveEquipItem;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"k" : "uitemsize",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uitemcount",	"c" : 1,},			
			{	"t" : "GS_TroopsEquipData_ActiveEquipItem",	"c" : 0,	"k" : "activelist",	"s" : "uitemsize",	"ck" : "uitemcount",},
		]

}
export class GS_TroopsStarExtraConfig_TroopsStarExtraLevel  {			
	ntrooplevel : number;			
	nstrengthid : number;			
	nlevel : number;			
	btspecaillevel : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "ntrooplevel",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nstrengthid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nlevel",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btspecaillevel",	"c" : 1,},
		]

}
export class GS_TroopsUpEquipData  {			
	nid : number;			
	nlv : number;			
	naddprop : number;			
	nupneedgoodsid1 : number;			
	nupneedgoodsid2 : number;			
	nupneedgoodsnum1 : number;			
	nupneedgoodsnum2 : number;			
	nnextaddprop : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nlv",	"c" : 1,},			
			{	"t" : "slong",	"k" : "naddprop",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nupneedgoodsid1",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nupneedgoodsid2",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nupneedgoodsnum1",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nupneedgoodsnum2",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nnextaddprop",	"c" : 1,},
		]

}
export class GS_TroopsBuyCardBag  {			
	ntroopsid : number;			
	btmode : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "ntroopsid",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btmode",	"c" : 1,},
		]

}
export class GS_TroopsAddNew  {			
	ntroopsid : number;			
	nqualitylevel : number;			
	btuse : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "ntroopsid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nqualitylevel",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btuse",	"c" : 1,},
		]

}
export class GS_TroopsStarExtraConfig_TroopsStarExtraItem  {			
	ntroopid : number;			
	slevels : GS_TroopsStarExtraConfig_TroopsStarExtraLevel[];
	slevelsClass : any = GS_TroopsStarExtraConfig_TroopsStarExtraLevel;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "ntroopid",	"c" : 1,},			
			{	"t" : "GS_TroopsStarExtraConfig_TroopsStarExtraLevel",	"k" : "slevels",	"c" : 20,},
		]

}
export class GS_TroopsInfo_Level  {			
	btlevel : number;			
	szweqponres : string;			
	ncreategold : number;			
	ndestorygold : number;			
	nhurtper : number;			
	nattackdist : number;			
	nattackspeed : number;			
	btskilllevel : number;			
	ncritical : number;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"k" : "btlevel",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szweqponres",	"c" : 32,},			
			{	"t" : "slong",	"k" : "ncreategold",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ndestorygold",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nhurtper",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nattackdist",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nattackspeed",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btskilllevel",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ncritical",	"c" : 1,},
		]

}
export class GS_TroopsRetUpGradeStar  {			
	ntroopsid : number;			
	nstarlevel : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "ntroopsid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nstarlevel",	"c" : 1,},
		]

}
export class GS_TroopsStarInfo_TroopUpStarItem  {			
	btlevel : number;			
	nattack : number;			
	nfightscore : number;			
	nsharegoodsnum : number;			
	nprivategoodsnum : number;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"k" : "btlevel",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nattack",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nfightscore",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nsharegoodsnum",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nprivategoodsnum",	"c" : 1,},
		]

}
export class GS_TroopsEquipInfo  {			
	btstate : number;			
	uitemsize : number;			
	uitemcount : number;			
	infolist : GS_TroopsEquipInfo_EquipItem[];
	infolistClass : any = GS_TroopsEquipInfo_EquipItem;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"k" : "btstate",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uitemsize",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uitemcount",	"c" : 1,},			
			{	"t" : "GS_TroopsEquipInfo_EquipItem",	"c" : 0,	"k" : "infolist",	"s" : "uitemsize",	"ck" : "uitemcount",},
		]

}
 

 