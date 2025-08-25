import FJByteArray from "../socket/FJByteArray";
export enum GS_GAME_PVP_MSG
{	
	GAME_PVP_PLAYER			= 0,	// 竞技双方信息下发				s->c
	GAME_PVP_ROBOTPLAYER	= 1,	// 竞技双方使用机器人模式		s->c
	GAME_PVP_MAP			= 2,	// 竞技地图下发					s->c
	GAME_PVP_READYPROGRESS	= 3,	// 加载等相关进度上报			c->s
	GAME_PVP_START			= 4,	// 开始竞技						s->c
	GAME_PVP_END			= 5,	// 客户端上报结束				c->s
	GAME_PVP_GAMEEND		= 6,	// 竞技结束						s->c
	GAME_PVP_GAMEENDERROR	= 7,	// 竞技异常结束					s->c
	GAME_PVP_C2S			= 8,	// 游戏帧上报					c->s
	GAME_PVP_S2C			= 9,	// 游戏帧同步下发				s->c
	GAME_PVP_SENDEMOTICON	= 10,	// 发送表情图包					c->s
	GAME_PVP_BROADEMOTICON	= 11,	// 广播表情图包					s->c
	GAME_PVP_SCENESTARTREST	= 12,	// 场景还原开始					s->c
	GAME_PVP_SCENEFRAMEREST	= 13,	// 场景还原传递(帧)				s->c
	GAME_PVP_SCENEDATAREST	= 14,	// 场景还原传递(数据)			s->c
	GAME_PVP_SCENEENDREST	= 15,	// 场景还原结束					s->c	
	GAME_PVP_SETROBOTDATA	= 16,	// 上报机器人数据				c->s
	GAME_PVP_RETROBOTDATA	= 17,	// 回传确认机器人数据			s->c
	GAME_PVP_MAX
}
export class GS_GamePvPHead  {
	protoList:any[] = 
		[
		]

}
export class GS_PvPStart  {			
	nleftactordbid : number;			
	nrightactordbid : number;			
	ninitgold : number;			
	nservergreenms : number;			
	nmonsterhpaddper : number;			
	nscenehpaddper : number;			
	nlimittimes : number;
	protoList:any[] = 
		[			
			{	"k" : "nleftactordbid",	"c" : 1,	"t" : "sint64",},			
			{	"k" : "nrightactordbid",	"c" : 1,	"t" : "sint64",},			
			{	"k" : "ninitgold",	"c" : 1,	"t" : "ulong",},			
			{	"k" : "nservergreenms",	"c" : 1,	"t" : "sint64",},			
			{	"k" : "nmonsterhpaddper",	"c" : 1,	"t" : "slong",},			
			{	"k" : "nscenehpaddper",	"c" : 1,	"t" : "slong",},			
			{	"k" : "nlimittimes",	"c" : 1,	"t" : "slong",},
		]

}
export class GS_PvPSetRobotData_StrengData  {			
	nid : number;			
	nlevel : number;
	protoList:any[] = 
		[			
			{	"k" : "nid",	"c" : 1,	"t" : "slong",},			
			{	"k" : "nlevel",	"c" : 1,	"t" : "slong",},
		]

}
export class GS_PvPSetRobotData_TroopsEquipData  {			
	nid : number;			
	nlv : number;
	protoList:any[] = 
		[			
			{	"k" : "nid",	"c" : 1,	"t" : "slong",},			
			{	"k" : "nlv",	"c" : 1,	"t" : "slong",},
		]

}
export class GS_PvPRobotPlayer  {			
	ndayplaycount : number;			
	btwin : number;
	protoList:any[] = 
		[			
			{	"k" : "ndayplaycount",	"c" : 1,	"t" : "slong",},			
			{	"k" : "btwin",	"c" : 1,	"t" : "uchar",},
		]

}
export class GS_PvPRetRobotData_TroopsData  {			
	nid : number;			
	nlv : number;
	protoList:any[] = 
		[			
			{	"k" : "nid",	"c" : 1,	"t" : "slong",},			
			{	"k" : "nlv",	"c" : 1,	"t" : "slong",},
		]

}
export class GS_PvPSetRobotData_PlayerItem  {			
	szname : string;			
	szmd5facefile : string;			
	btsex : number;			
	nfaceid : number;			
	nfaceframeid : number;			
	nseltroopsid : number[];			
	npvplv : number;			
	nranklv : number;
	protoList:any[] = 
		[			
			{	"k" : "szname",	"c" : 32,	"t" : "stchar",},			
			{	"k" : "szmd5facefile",	"c" : 33,	"t" : "stchar",},			
			{	"k" : "btsex",	"c" : 1,	"t" : "uchar",},			
			{	"k" : "nfaceid",	"c" : 1,	"t" : "slong",},			
			{	"k" : "nfaceframeid",	"c" : 1,	"t" : "slong",},			
			{	"k" : "nseltroopsid",	"c" : 9,	"t" : "slong",},			
			{	"k" : "npvplv",	"c" : 1,	"t" : "slong",},			
			{	"k" : "nranklv",	"c" : 1,	"t" : "slong",},
		]

}
export class GS_PvPRetRobotData_PlayerItem  {			
	szname : string;			
	szmd5facefile : string;			
	btsex : number;			
	nfaceid : number;			
	nfaceframeid : number;			
	nseltroopsid : number[];			
	npvplv : number;
	protoList:any[] = 
		[			
			{	"k" : "szname",	"c" : 32,	"t" : "stchar",},			
			{	"k" : "szmd5facefile",	"c" : 33,	"t" : "stchar",},			
			{	"k" : "btsex",	"c" : 1,	"t" : "uchar",},			
			{	"k" : "nfaceid",	"c" : 1,	"t" : "slong",},			
			{	"k" : "nfaceframeid",	"c" : 1,	"t" : "slong",},			
			{	"k" : "nseltroopsid",	"c" : 9,	"t" : "slong",},			
			{	"k" : "npvplv",	"c" : 1,	"t" : "slong",},
		]

}
export class GS_PvPMap_RefSceneThing  {			
	nscenethingid : number;			
	npointid : number;			
	nmonsterid : number;			
	nmonsterbloodratio : number;			
	nmonsterpoint : number;
	protoList:any[] = 
		[			
			{	"k" : "nscenethingid",	"c" : 1,	"t" : "slong",},			
			{	"k" : "npointid",	"c" : 1,	"t" : "slong",},			
			{	"k" : "nmonsterid",	"c" : 1,	"t" : "slong",},			
			{	"k" : "nmonsterbloodratio",	"c" : 1,	"t" : "slong",},			
			{	"k" : "nmonsterpoint",	"c" : 1,	"t" : "slong",},
		]

}
export class GS_PvPReadyProgress  {			
	uprogress : number;
	protoList:any[] = 
		[			
			{	"k" : "uprogress",	"c" : 1,	"t" : "ushort",},
		]

}
export class GS_PvPPlayer_TroopsData  {			
	nactordbid : number;			
	nid : number;			
	nlv : number;
	protoList:any[] = 
		[			
			{	"k" : "nactordbid",	"c" : 1,	"t" : "sint64",},			
			{	"k" : "nid",	"c" : 1,	"t" : "slong",},			
			{	"k" : "nlv",	"c" : 1,	"t" : "slong",},
		]

}
export class GS_PvPPlayer_TroopsEquipData  {			
	nactordbid : number;			
	nid : number;			
	nlv : number;			
	naddprop : number;
	protoList:any[] = 
		[			
			{	"k" : "nactordbid",	"c" : 1,	"t" : "sint64",},			
			{	"k" : "nid",	"c" : 1,	"t" : "slong",},			
			{	"k" : "nlv",	"c" : 1,	"t" : "slong",},			
			{	"k" : "naddprop",	"c" : 1,	"t" : "slong",},
		]

}
export class GS_PvPRetRobotData_TroopsEquipData  {			
	nid : number;			
	nlv : number;			
	naddprop : number;
	protoList:any[] = 
		[			
			{	"k" : "nid",	"c" : 1,	"t" : "slong",},			
			{	"k" : "nlv",	"c" : 1,	"t" : "slong",},			
			{	"k" : "naddprop",	"c" : 1,	"t" : "slong",},
		]

}
export class GS_PvPPlayer_StrengData  {			
	nactordbid : number;			
	nid : number;			
	nlevel : number;
	protoList:any[] = 
		[			
			{	"k" : "nactordbid",	"c" : 1,	"t" : "sint64",},			
			{	"k" : "nid",	"c" : 1,	"t" : "slong",},			
			{	"k" : "nlevel",	"c" : 1,	"t" : "slong",},
		]

}
export class GS_PvPPlayer  {			
	uplayercount : number;			
	utroopscount : number;			
	utroopsequipcount : number;			
	utroopsstrengcount : number;			
	utroopsfashioncount : number;			
	uplayersize : number;			
	utroopssize : number;			
	utroopsequipsize : number;			
	utroopsstrengsize : number;			
	utroopsfashionsize : number;			
	data1 : GS_PvPPlayer_PlayerItem[];
	data1Class : any = GS_PvPPlayer_PlayerItem;			
	data2 : GS_PvPPlayer_TroopsData[];
	data2Class : any = GS_PvPPlayer_TroopsData;			
	data3 : GS_PvPPlayer_TroopsEquipData[];
	data3Class : any = GS_PvPPlayer_TroopsEquipData;			
	data4 : GS_PvPPlayer_StrengData[];
	data4Class : any = GS_PvPPlayer_StrengData;			
	data5 : GS_PvPPlayer_FashionData[];
	data5Class : any = GS_PvPPlayer_FashionData;
	protoList:any[] = 
		[			
			{	"k" : "uplayercount",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "utroopscount",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "utroopsequipcount",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "utroopsstrengcount",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "utroopsfashioncount",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "uplayersize",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "utroopssize",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "utroopsequipsize",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "utroopsstrengsize",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "utroopsfashionsize",	"c" : 1,	"t" : "ushort",},			
			{	"c" : 0,	"k" : "data1",	"ck" : "uplayercount",	"s" : "uplayersize",	"t" : "GS_PvPPlayer_PlayerItem",},			
			{	"c" : 0,	"k" : "data2",	"ck" : "utroopscount",	"s" : "utroopssize",	"t" : "GS_PvPPlayer_TroopsData",},			
			{	"c" : 0,	"k" : "data3",	"ck" : "utroopsequipcount",	"s" : "utroopsequipsize",	"t" : "GS_PvPPlayer_TroopsEquipData",},			
			{	"c" : 0,	"k" : "data4",	"ck" : "utroopsstrengcount",	"s" : "utroopsstrengsize",	"t" : "GS_PvPPlayer_StrengData",},			
			{	"c" : 0,	"k" : "data5",	"ck" : "utroopsfashioncount",	"s" : "utroopsfashionsize",	"t" : "GS_PvPPlayer_FashionData",},
		]

}
export class GS_PvPMap_RefMonster  {			
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
			{	"k" : "nappeartime",	"c" : 1,	"t" : "slong",},			
			{	"k" : "nspace",	"c" : 1,	"t" : "slong",},			
			{	"k" : "nbloodratio",	"c" : 1,	"t" : "slong",},			
			{	"k" : "npoint1monterboxid",	"c" : 1,	"t" : "slong",},			
			{	"k" : "npoint2monterboxid",	"c" : 1,	"t" : "slong",},			
			{	"k" : "npoint3monterboxid",	"c" : 1,	"t" : "slong",},			
			{	"k" : "npoint4monterboxid",	"c" : 1,	"t" : "slong",},			
			{	"k" : "npoint5monterboxid",	"c" : 1,	"t" : "slong",},
		]

}
export class GS_PvPRetRobotData  {			
	uplayercount : number;			
	utroopscount : number;			
	utroopsequipcount : number;			
	utroopsstrengcount : number;			
	utroopsfashioncount : number;			
	uplayersize : number;			
	utroopssize : number;			
	utroopsequipsize : number;			
	utroopsstrengsize : number;			
	utroopsfashionsize : number;			
	data1 : GS_PvPRetRobotData_PlayerItem[];
	data1Class : any = GS_PvPRetRobotData_PlayerItem;			
	data2 : GS_PvPRetRobotData_TroopsData[];
	data2Class : any = GS_PvPRetRobotData_TroopsData;			
	data3 : GS_PvPRetRobotData_TroopsEquipData[];
	data3Class : any = GS_PvPRetRobotData_TroopsEquipData;			
	data4 : GS_PvPRetRobotData_StrengData[];
	data4Class : any = GS_PvPRetRobotData_StrengData;			
	data5 : GS_PvPRetRobotData_FashionData[];
	data5Class : any = GS_PvPRetRobotData_FashionData;
	protoList:any[] = 
		[			
			{	"k" : "uplayercount",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "utroopscount",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "utroopsequipcount",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "utroopsstrengcount",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "utroopsfashioncount",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "uplayersize",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "utroopssize",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "utroopsequipsize",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "utroopsstrengsize",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "utroopsfashionsize",	"c" : 1,	"t" : "ushort",},			
			{	"c" : 0,	"k" : "data1",	"ck" : "uplayercount",	"s" : "uplayersize",	"t" : "GS_PvPRetRobotData_PlayerItem",},			
			{	"c" : 0,	"k" : "data2",	"ck" : "utroopscount",	"s" : "utroopssize",	"t" : "GS_PvPRetRobotData_TroopsData",},			
			{	"c" : 0,	"k" : "data3",	"ck" : "utroopsequipcount",	"s" : "utroopsequipsize",	"t" : "GS_PvPRetRobotData_TroopsEquipData",},			
			{	"c" : 0,	"k" : "data4",	"ck" : "utroopsstrengcount",	"s" : "utroopsstrengsize",	"t" : "GS_PvPRetRobotData_StrengData",},			
			{	"c" : 0,	"k" : "data5",	"ck" : "utroopsfashioncount",	"s" : "utroopsfashionsize",	"t" : "GS_PvPRetRobotData_FashionData",},
		]

}
export class GS_PvPRetRobotData_StrengData  {			
	nid : number;			
	nlevel : number;
	protoList:any[] = 
		[			
			{	"k" : "nid",	"c" : 1,	"t" : "slong",},			
			{	"k" : "nlevel",	"c" : 1,	"t" : "slong",},
		]

}
export class GS_PvPBroadEmotIcon  {			
	nactordbid : number;			
	nid : number;
	protoList:any[] = 
		[			
			{	"k" : "nactordbid",	"c" : 1,	"t" : "sint64",},			
			{	"k" : "nid",	"c" : 1,	"t" : "slong",},
		]

}
export class GS_PvPSetRobotData_TroopsData  {			
	nid : number;			
	nlv : number;
	protoList:any[] = 
		[			
			{	"k" : "nid",	"c" : 1,	"t" : "slong",},			
			{	"k" : "nlv",	"c" : 1,	"t" : "slong",},
		]

}
export class GS_PvPSceneEndRest  {
	protoList:any[] = 
		[
		]

}
export class GS_PvPPlayer_PlayerItem  {			
	nactordbid : number;			
	szname : string;			
	szmd5facefile : string;			
	uid : number;			
	btsex : number;			
	i64viplevel : number;			
	szsign : string;			
	nrankscore : number;			
	nfaceid : number;			
	nfaceframeid : number;			
	npvpwin : number;			
	npvplost : number;			
	npvpdraw : number;			
	nseltroopsid : number[];			
	npvplv : number;			
	btqqlevel : number;			
	ndayplaycount : number;
	protoList:any[] = 
		[			
			{	"k" : "nactordbid",	"c" : 1,	"t" : "sint64",},			
			{	"k" : "szname",	"c" : 32,	"t" : "stchar",},			
			{	"k" : "szmd5facefile",	"c" : 33,	"t" : "stchar",},			
			{	"k" : "uid",	"c" : 1,	"t" : "uint64",},			
			{	"k" : "btsex",	"c" : 1,	"t" : "uchar",},			
			{	"k" : "i64viplevel",	"c" : 1,	"t" : "sint64",},			
			{	"k" : "szsign",	"c" : 32,	"t" : "stchar",},			
			{	"k" : "nrankscore",	"c" : 1,	"t" : "sint64",},			
			{	"k" : "nfaceid",	"c" : 1,	"t" : "slong",},			
			{	"k" : "nfaceframeid",	"c" : 1,	"t" : "slong",},			
			{	"k" : "npvpwin",	"c" : 1,	"t" : "sint64",},			
			{	"k" : "npvplost",	"c" : 1,	"t" : "sint64",},			
			{	"k" : "npvpdraw",	"c" : 1,	"t" : "sint64",},			
			{	"k" : "nseltroopsid",	"c" : 9,	"t" : "slong",},			
			{	"k" : "npvplv",	"c" : 1,	"t" : "slong",},			
			{	"k" : "btqqlevel",	"c" : 1,	"t" : "uchar",},			
			{	"k" : "ndayplaycount",	"c" : 1,	"t" : "slong",},
		]

}
export class GS_PvPPlayer_FashionData  {			
	nactordbid : number;			
	nid : number;
	protoList:any[] = 
		[			
			{	"k" : "nactordbid",	"c" : 1,	"t" : "sint64",},			
			{	"k" : "nid",	"c" : 1,	"t" : "slong",},
		]

}
export class GS_PvPSetRobotData_FashionData  {			
	nid : number;
	protoList:any[] = 
		[			
			{	"k" : "nid",	"c" : 1,	"t" : "slong",},
		]

}
export class GS_PvPC2S  {			
	ntroopsscore : number[];			
	bttroopskillcount : number[];			
	data : FJByteArray;
	protoList:any[] = 
		[			
			{	"k" : "ntroopsscore",	"c" : 9,	"t" : "slong",},			
			{	"k" : "bttroopskillcount",	"c" : 9,	"t" : "uchar",},			
			{	"k" : "data",	"c" : 0,	"t" : "FJByteArray",},
		]

}
export class GS_PvPSceneFrameRest  {			
	uitemcount : number;			
	uitemsize : number;			
	data : GS_PvPSceneFrameRest_FrameItem[];
	dataClass : any = GS_PvPSceneFrameRest_FrameItem;
	protoList:any[] = 
		[			
			{	"k" : "uitemcount",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "uitemsize",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "data",	"s" : "uitemsize",	"ck" : "uitemcount",	"c" : 0,	"t" : "GS_PvPSceneFrameRest_FrameItem",},
		]

}
export class GS_PvPEnd  {			
	bttype : number;
	protoList:any[] = 
		[			
			{	"k" : "bttype",	"c" : 1,	"t" : "uchar",},
		]

}
export class GS_PvPMap  {			
	btmode : number;			
	nwarid : number;			
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
	urefmonstercount : number;			
	urefscenethingcount : number;			
	urefmonstersize : number;			
	urefscenethingsize : number;			
	data1 : GS_PvPMap_RefMonster[];
	data1Class : any = GS_PvPMap_RefMonster;			
	data2 : GS_PvPMap_RefSceneThing[];
	data2Class : any = GS_PvPMap_RefSceneThing;
	protoList:any[] = 
		[			
			{	"k" : "btmode",	"c" : 1,	"t" : "uchar",},			
			{	"k" : "nwarid",	"c" : 1,	"t" : "sint64",},			
			{	"k" : "szname",	"c" : 32,	"t" : "stchar",},			
			{	"k" : "szsceneres",	"c" : 32,	"t" : "stchar",},			
			{	"k" : "szdes",	"c" : 32,	"t" : "stchar",},			
			{	"k" : "szbgmusic",	"c" : 32,	"t" : "stchar",},			
			{	"k" : "szbgpic",	"c" : 32,	"t" : "stchar",},			
			{	"k" : "btpathtype",	"c" : 1,	"t" : "uchar",},			
			{	"k" : "szpathres",	"c" : 32,	"t" : "stchar",},			
			{	"k" : "utipsid",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "btplaytype",	"c" : 1,	"t" : "uchar",},			
			{	"k" : "nplaytimes",	"c" : 1,	"t" : "slong",},			
			{	"k" : "nrolehp",	"c" : 1,	"t" : "slong",},			
			{	"k" : "nloopratio",	"c" : 1,	"t" : "slong",},			
			{	"k" : "nloopcount",	"c" : 1,	"t" : "slong",},			
			{	"k" : "btisopenmap",	"c" : 1,	"t" : "uchar",},			
			{	"k" : "urefmonstercount",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "urefscenethingcount",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "urefmonstersize",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "urefscenethingsize",	"c" : 1,	"t" : "ushort",},			
			{	"c" : 0,	"k" : "data1",	"ck" : "urefmonstercount",	"s" : "urefmonstersize",	"t" : "GS_PvPMap_RefMonster",},			
			{	"c" : 0,	"k" : "data2",	"ck" : "urefscenethingcount",	"s" : "urefscenethingsize",	"t" : "GS_PvPMap_RefSceneThing",},
		]

}
export class GS_PvPSendEmotIcon  {			
	nid : number;
	protoList:any[] = 
		[			
			{	"k" : "nid",	"c" : 1,	"t" : "slong",},
		]

}
export class GS_PvPSceneFrameRest_FrameItem  {			
	nframeid : number;			
	ulen : number[];
	protoList:any[] = 
		[			
			{	"k" : "nframeid",	"c" : 1,	"t" : "ulong",},			
			{	"k" : "ulen",	"c" : 2,	"t" : "ushort",},
		]

}
export class GS_PvPGameEnd  {			
	ntroopsscore : number[];			
	ntroopskillcount : number[];			
	btwin : number;			
	nrankscore : number;			
	nsoprtspoint : number;			
	btmatchstate : number;			
	btmode : number;
	protoList:any[] = 
		[			
			{	"k" : "ntroopsscore",	"c" : 9,	"t" : "slong",},			
			{	"k" : "ntroopskillcount",	"c" : 9,	"t" : "slong",},			
			{	"k" : "btwin",	"c" : 1,	"t" : "uchar",},			
			{	"k" : "nrankscore",	"c" : 1,	"t" : "slong",},			
			{	"k" : "nsoprtspoint",	"c" : 1,	"t" : "slong",},			
			{	"k" : "btmatchstate",	"c" : 1,	"t" : "uchar",},			
			{	"k" : "btmode",	"c" : 1,	"t" : "uchar",},
		]

}
export class GS_PvPSceneStartRest  {			
	ninitgold : number;			
	nlimittimes : number;			
	nservergreenms : number;			
	nmonsterhpaddper : number;			
	nscenehpaddper : number;			
	unowframeid : number;
	protoList:any[] = 
		[			
			{	"k" : "ninitgold",	"c" : 1,	"t" : "ulong",},			
			{	"k" : "nlimittimes",	"c" : 1,	"t" : "slong",},			
			{	"k" : "nservergreenms",	"c" : 1,	"t" : "sint64",},			
			{	"k" : "nmonsterhpaddper",	"c" : 1,	"t" : "slong",},			
			{	"k" : "nscenehpaddper",	"c" : 1,	"t" : "slong",},			
			{	"k" : "unowframeid",	"c" : 1,	"t" : "ulong",},
		]

}
export class GS_PvPSceneDataRest  {			
	data : FJByteArray;
	protoList:any[] = 
		[			
			{	"k" : "data",	"c" : 0,	"t" : "FJByteArray",},
		]

}
export class GS_PvPSetRobotData  {			
	uplayercount : number;			
	utroopscount : number;			
	utroopsequipcount : number;			
	utroopsstrengcount : number;			
	utroopsfashioncount : number;			
	uplayersize : number;			
	utroopssize : number;			
	utroopsequipsize : number;			
	utroopsstrengsize : number;			
	utroopsfashionsize : number;			
	data1 : GS_PvPSetRobotData_PlayerItem[];
	data1Class : any = GS_PvPSetRobotData_PlayerItem;			
	data2 : GS_PvPSetRobotData_TroopsData[];
	data2Class : any = GS_PvPSetRobotData_TroopsData;			
	data3 : GS_PvPSetRobotData_TroopsEquipData[];
	data3Class : any = GS_PvPSetRobotData_TroopsEquipData;			
	data4 : GS_PvPSetRobotData_StrengData[];
	data4Class : any = GS_PvPSetRobotData_StrengData;			
	data5 : GS_PvPSetRobotData_FashionData[];
	data5Class : any = GS_PvPSetRobotData_FashionData;
	protoList:any[] = 
		[			
			{	"k" : "uplayercount",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "utroopscount",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "utroopsequipcount",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "utroopsstrengcount",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "utroopsfashioncount",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "uplayersize",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "utroopssize",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "utroopsequipsize",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "utroopsstrengsize",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "utroopsfashionsize",	"c" : 1,	"t" : "ushort",},			
			{	"c" : 0,	"k" : "data1",	"ck" : "uplayercount",	"s" : "uplayersize",	"t" : "GS_PvPSetRobotData_PlayerItem",},			
			{	"c" : 0,	"k" : "data2",	"ck" : "utroopscount",	"s" : "utroopssize",	"t" : "GS_PvPSetRobotData_TroopsData",},			
			{	"c" : 0,	"k" : "data3",	"ck" : "utroopsequipcount",	"s" : "utroopsequipsize",	"t" : "GS_PvPSetRobotData_TroopsEquipData",},			
			{	"c" : 0,	"k" : "data4",	"ck" : "utroopsstrengcount",	"s" : "utroopsstrengsize",	"t" : "GS_PvPSetRobotData_StrengData",},			
			{	"c" : 0,	"k" : "data5",	"ck" : "utroopsfashioncount",	"s" : "utroopsfashionsize",	"t" : "GS_PvPSetRobotData_FashionData",},
		]

}
export class GS_PvPGameEndError  {			
	sztips : string;
	protoList:any[] = 
		[			
			{	"k" : "sztips",	"c" : 128,	"t" : "stchar",},
		]

}
export class GS_PvPS2C  {			
	nframeid : number;			
	ulrlen : number[];			
	data : FJByteArray;
	protoList:any[] = 
		[			
			{	"k" : "nframeid",	"c" : 1,	"t" : "ulong",},			
			{	"k" : "ulrlen",	"c" : 2,	"t" : "ushort",},			
			{	"k" : "data",	"c" : 0,	"t" : "FJByteArray",},
		]

}
export class GS_PvPRetRobotData_FashionData  {			
	nid : number;
	protoList:any[] = 
		[			
			{	"k" : "nid",	"c" : 1,	"t" : "slong",},
		]

}
 

 