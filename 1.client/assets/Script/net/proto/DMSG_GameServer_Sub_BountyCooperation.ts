import FJByteArray from "../socket/FJByteArray";
export enum GS_GAME_BOUNTYCOOPERATION_MSG
{	
	GAME_BOUNTYCOOPERATION_OUT				= 0,	// 中途退出爬塔											c->s
	GAME_BOUNTYCOOPERATION_OUTFINISH		= 1,	// 退出成功												s->c
	GAME_BOUNTYCOOPERATION_PLAYER			= 2,	// 爬塔双方信息下发										s->c	
	GAME_BOUNTYCOOPERATION_MAP				= 3,	// 爬塔地图下发											s->c
	GAME_BOUNTYCOOPERATION_READYPROGRESS	= 4,	// 加载等相关进度上报									c->s
	GAME_BOUNTYCOOPERATION_START			= 5,	// 开始竞技												s->c
	GAME_BOUNTYCOOPERATION_FINISHLAYER		= 6,	// 客户端上报完成某一层									c->s
	GAME_BOUNTYCOOPERATION_NEXTLAYER		= 7,	// 服务器通知客户端进行下一层							s->c
	GAME_BOUNTYCOOPERATION_GAMEEND			= 8,	// 结束													s->c
	GAME_BOUNTYCOOPERATION_GAMEENDERROR		= 9,	// 异常结束												s->c	
	GAME_BOUNTYCOOPERATION_C2S				= 10,	// 游戏帧上报											c->s
	GAME_BOUNTYCOOPERATION_S2C				= 11,	// 游戏帧同步下发										s->c
	GAME_BOUNTYCOOPERATION_SENDEMOTICON		= 12,	// 发送表情图包											c->s
	GAME_BOUNTYCOOPERATION_BROADEMOTICON	= 13,	// 广播表情图包											s->c
	GAME_BOUNTYCOOPERATION_SCENESTARTREST	= 14,	// 场景还原开始											s->c
	GAME_BOUNTYCOOPERATION_SCENEFRAMEREST	= 15,	// 场景还原传递(帧)										s->c
	GAME_BOUNTYCOOPERATION_SCENEDATAREST	= 16,	// 场景还原传递(数据)									s->c
	GAME_BOUNTYCOOPERATION_SCENEENDREST		= 17,	// 场景还原结束											s->c			  	
	GAME_BOUNTYCOOPERATION_MAX
}
export class GS_GameBountyCooperationHead  {
	protoList:any[] = 
		[
		]

}
export class GS_GameBountyCooperationPlayer_TroopsEquipData  {			
	nid : number;			
	nlv : number;			
	naddprop : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"c" : 1,	"k" : "nid",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nlv",},			
			{	"t" : "slong",	"c" : 1,	"k" : "naddprop",},
		]

}
export class GS_GameBountyCooperationPlayer_PlayerItem  {			
	nactordbid : number;			
	szname : string;			
	szmd5facefile : string;			
	btsex : number;			
	i64viplevel : number;			
	szsign : string;			
	nrankscore : number;			
	nfaceid : number;			
	nfaceframeid : number;			
	nseltroopsid : number[];			
	btqqlevel : number;			
	utroopscount : number;			
	utroopsequipcount : number;			
	ustrengcount : number;			
	ufashioncount : number;			
	nbuffper : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"c" : 1,	"k" : "nactordbid",},			
			{	"t" : "stchar",	"c" : 32,	"k" : "szname",},			
			{	"t" : "stchar",	"c" : 33,	"k" : "szmd5facefile",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btsex",},			
			{	"t" : "sint64",	"c" : 1,	"k" : "i64viplevel",},			
			{	"t" : "stchar",	"c" : 32,	"k" : "szsign",},			
			{	"t" : "sint64",	"c" : 1,	"k" : "nrankscore",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nfaceid",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nfaceframeid",},			
			{	"t" : "slong",	"c" : 9,	"k" : "nseltroopsid",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btqqlevel",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "utroopscount",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "utroopsequipcount",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "ustrengcount",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "ufashioncount",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nbuffper",},
		]

}
export class GS_GameBountyCooperationSceneEndRest  {
	protoList:any[] = 
		[
		]

}
export class GS_GameBountyCooperationSceneDataRest  {			
	data : FJByteArray;
	protoList:any[] = 
		[			
			{	"t" : "FJByteArray",	"c" : 0,	"k" : "data",},
		]

}
export class GS_GameBountyCooperationSceneFrameRest_FrameItem  {			
	nframeid : number;			
	ulen : number[];
	protoList:any[] = 
		[			
			{	"t" : "ulong",	"c" : 1,	"k" : "nframeid",},			
			{	"t" : "ushort",	"c" : 2,	"k" : "ulen",},
		]

}
export class GS_GameBountyCooperationPlayer_TroopsData  {			
	nid : number;			
	nlv : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"c" : 1,	"k" : "nid",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nlv",},
		]

}
export class GS_GameBountyCooperationPlayer_StrengData  {			
	nid : number;			
	nlevel : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"c" : 1,	"k" : "nid",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nlevel",},
		]

}
export class GS_GameBountyCooperationOutFinish_GoodsList  {			
	ngoodsid : number;			
	ngoodsnum : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"c" : 1,	"k" : "ngoodsid",},			
			{	"t" : "slong",	"c" : 1,	"k" : "ngoodsnum",},
		]

}
export class GS_GameBountyCooperationC2S  {			
	ulayer : number;			
	data : FJByteArray;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"c" : 1,	"k" : "ulayer",},			
			{	"t" : "FJByteArray",	"c" : 0,	"k" : "data",},
		]

}
export class GS_GameBountyCooperationGameEndError  {			
	sztips : string;
	protoList:any[] = 
		[			
			{	"t" : "stchar",	"c" : 128,	"k" : "sztips",},
		]

}
export class GS_GameBountyCooperationOutFinish  {			
	uendlayer : number;			
	urewardcount : number;			
	urewardsize : number;			
	rewards : GS_GameBountyCooperationOutFinish_GoodsList[];
	rewardsClass : any = GS_GameBountyCooperationOutFinish_GoodsList;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"c" : 1,	"k" : "uendlayer",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "urewardcount",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "urewardsize",},			
			{	"t" : "GS_GameBountyCooperationOutFinish_GoodsList",	"c" : 0,	"ck" : "urewardcount",	"s" : "urewardsize",	"k" : "rewards",},
		]

}
export class GS_GameBountyCooperationSceneFrameRest  {			
	uitemcount : number;			
	uitemsize : number;			
	data : GS_GameBountyCooperationSceneFrameRest_FrameItem[];
	dataClass : any = GS_GameBountyCooperationSceneFrameRest_FrameItem;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"c" : 1,	"k" : "uitemcount",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "uitemsize",},			
			{	"t" : "GS_GameBountyCooperationSceneFrameRest_FrameItem",	"c" : 0,	"ck" : "uitemcount",	"s" : "uitemsize",	"k" : "data",},
		]

}
export class GS_GameBountyCooperationPlayer  {			
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
	data1 : GS_GameBountyCooperationPlayer_PlayerItem[];
	data1Class : any = GS_GameBountyCooperationPlayer_PlayerItem;			
	data2 : GS_GameBountyCooperationPlayer_TroopsData[];
	data2Class : any = GS_GameBountyCooperationPlayer_TroopsData;			
	data3 : GS_GameBountyCooperationPlayer_TroopsEquipData[];
	data3Class : any = GS_GameBountyCooperationPlayer_TroopsEquipData;			
	data4 : GS_GameBountyCooperationPlayer_StrengData[];
	data4Class : any = GS_GameBountyCooperationPlayer_StrengData;			
	data5 : GS_GameBountyCooperationPlayer_FashionData[];
	data5Class : any = GS_GameBountyCooperationPlayer_FashionData;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"c" : 1,	"k" : "uplayercount",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "utroopscount",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "utroopsequipcount",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "utroopsstrengcount",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "utroopsfashioncount",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "uplayersize",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "utroopssize",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "utroopsequipsize",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "utroopsstrengsize",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "utroopsfashionsize",},			
			{	"t" : "GS_GameBountyCooperationPlayer_PlayerItem",	"c" : 0,	"ck" : "uplayercount",	"k" : "data1",	"s" : "uplayersize",},			
			{	"t" : "GS_GameBountyCooperationPlayer_TroopsData",	"c" : 0,	"ck" : "utroopscount",	"k" : "data2",	"s" : "utroopssize",},			
			{	"t" : "GS_GameBountyCooperationPlayer_TroopsEquipData",	"c" : 0,	"ck" : "utroopsequipcount",	"k" : "data3",	"s" : "utroopsequipsize",},			
			{	"t" : "GS_GameBountyCooperationPlayer_StrengData",	"c" : 0,	"ck" : "utroopsstrengcount",	"k" : "data4",	"s" : "utroopsstrengsize",},			
			{	"t" : "GS_GameBountyCooperationPlayer_FashionData",	"c" : 0,	"ck" : "utroopsfashioncount",	"k" : "data5",	"s" : "utroopsfashionsize",},
		]

}
export class GS_GameBountyCooperationGameEnd  {			
	uendlayer : number;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"c" : 1,	"k" : "uendlayer",},
		]

}
export class GS_GameBountyCooperationStart  {			
	nservergreenms : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"c" : 1,	"k" : "nservergreenms",},
		]

}
export class GS_GameBountyCooperationFinishLayer  {			
	ulayer : number;			
	btstate : number;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"c" : 1,	"k" : "ulayer",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btstate",},
		]

}
export class GS_GameBountyCooperationS2C  {			
	ulayer : number;			
	nframeid : number;			
	ulrlen : number[];			
	data : FJByteArray;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"c" : 1,	"k" : "ulayer",},			
			{	"t" : "ulong",	"c" : 1,	"k" : "nframeid",},			
			{	"t" : "ushort",	"c" : 2,	"k" : "ulrlen",},			
			{	"t" : "FJByteArray",	"c" : 0,	"k" : "data",},
		]

}
export class GS_GameBountyCooperationMap_RefLayer  {			
	btendmode : number;			
	nappeartime : number;			
	uspace : number;			
	nbloodratio : number;			
	nlimittime : number;			
	btrefmonstercount : number;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"c" : 1,	"k" : "btendmode",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nappeartime",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "uspace",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nbloodratio",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nlimittime",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btrefmonstercount",},
		]

}
export class GS_GameBountyCooperationBroadEmotIcon  {			
	nactordbid : number;			
	nid : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"c" : 1,	"k" : "nactordbid",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nid",},
		]

}
export class GS_GameBountyCooperationPlayer_FashionData  {			
	nid : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"c" : 1,	"k" : "nid",},
		]

}
export class GS_GameBountyCooperationOut  {
	protoList:any[] = 
		[
		]

}
export class GS_GameBountyCooperationMap  {			
	szsceneres : string;			
	szbgmusic : string;			
	szbgpic : string;			
	btpathtype : number;			
	szpathres : string;			
	btplaytype : number;			
	nrolehp : number;			
	nmonsterhpaddper : number;			
	nscenehpaddper : number;			
	btisopenmap : number;			
	ninitgold : number;			
	nmonstergoldaddpers : number[];			
	nthinggoldaddper : number;			
	ureflayercount : number;			
	urefmonstercount : number;			
	ureflayersize : number;			
	urefmonstersize : number;			
	data1 : GS_GameBountyCooperationMap_RefLayer[];
	data1Class : any = GS_GameBountyCooperationMap_RefLayer;			
	data2 : GS_GameBountyCooperationMap_RefMonster[];
	data2Class : any = GS_GameBountyCooperationMap_RefMonster;
	protoList:any[] = 
		[			
			{	"t" : "stchar",	"c" : 32,	"k" : "szsceneres",},			
			{	"t" : "stchar",	"c" : 32,	"k" : "szbgmusic",},			
			{	"t" : "stchar",	"c" : 32,	"k" : "szbgpic",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btpathtype",},			
			{	"t" : "stchar",	"c" : 32,	"k" : "szpathres",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btplaytype",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nrolehp",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nmonsterhpaddper",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nscenehpaddper",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btisopenmap",},			
			{	"t" : "ulong",	"c" : 1,	"k" : "ninitgold",},			
			{	"t" : "slong",	"c" : 3,	"k" : "nmonstergoldaddpers",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nthinggoldaddper",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "ureflayercount",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "urefmonstercount",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "ureflayersize",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "urefmonstersize",},			
			{	"t" : "GS_GameBountyCooperationMap_RefLayer",	"c" : 0,	"ck" : "ureflayercount",	"k" : "data1",	"s" : "ureflayersize",},			
			{	"t" : "GS_GameBountyCooperationMap_RefMonster",	"c" : 0,	"ck" : "urefmonstercount",	"k" : "data2",	"s" : "urefmonstersize",},
		]

}
export class GS_GameBountyCooperationSceneStartRest  {			
	nservergreenms : number;			
	nnowlayerservergreenms : number;			
	ulayer : number;			
	unowframeid : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"c" : 1,	"k" : "nservergreenms",},			
			{	"t" : "sint64",	"c" : 1,	"k" : "nnowlayerservergreenms",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "ulayer",},			
			{	"t" : "ulong",	"c" : 1,	"k" : "unowframeid",},
		]

}
export class GS_GameBountyCooperationNextLayer  {			
	ulayer : number;			
	nlayerstartgreentime : number;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"c" : 1,	"k" : "ulayer",},			
			{	"t" : "sint64",	"c" : 1,	"k" : "nlayerstartgreentime",},
		]

}
export class GS_GameBountyCooperationReadyProgress  {			
	uprogress : number;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"c" : 1,	"k" : "uprogress",},
		]

}
export class GS_GameBountyCooperationSendEmotIcon  {			
	nid : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"c" : 1,	"k" : "nid",},
		]

}
export class GS_GameBountyCooperationMap_RefMonster  {			
	btpoint : number;			
	monterboxid : number;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"c" : 1,	"k" : "btpoint",},			
			{	"t" : "slong",	"c" : 1,	"k" : "monterboxid",},
		]

}
 

 