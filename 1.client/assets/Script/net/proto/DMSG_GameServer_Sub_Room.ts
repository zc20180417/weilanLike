import FJByteArray from "../socket/FJByteArray";
export enum GS_GAME_ROOM_MSG
{
	GAME_ROOM_S_INFO			= 0,	//房间配置信息下发	s->c
	GAME_ROOM_C_ONTABLE			= 1,	//上桌				c->s
	GAME_ROOM_C_OUTTABLE		= 2,	//离开游戏桌		c->s
	GAME_ROOM_C_HANDS			= 3,	//举手				c->s	
	GAME_ROOM_CS_GAMEDATA		= 4,	//游戏数据			c->s->c	
	GAME_ROOM_S_TABLESTATE		= 5,	//游戏桌状态广播	s->c
	GAME_ROOM_C_OUTROOM			= 6,	//用户离开房间		c->s
	GAME_ROOM_C_CHANGETABLE		= 7,	//换桌				c->s
	GAME_ROOM_S_POPRECHARGE		= 8,	//提示充值			s->c
	GAME_ROOM_C_GAMELOG			= 9,	//游戏日志			c->s
	GAME_ROOM_S_TIPS			= 10,	//游戏内提示信息	s->c
	GAME_ROOM_C_TRUSTEESHIP		= 11,	//托管开关设置		c->s
	GAME_ROOM_S_GAMERULE		= 12,	//游戏规则			s->c
	GAME_ROOM_S_DROPEND			= 13,	//掉线恢复数据		s->c
	GAME_ROOM_S_REPLACE			= 14,	//踢号重登恢复数据	s->c
	GAME_ROOM_S_ADDFRIENDREQUEST= 15,	//请求添加好友通知	s->c
	GAME_ROOM_S_MAGICINFO		= 16,	//魔法表情配置信息	s->c
	GAME_ROOM_CS_USEMAGICFACE	= 17,	//使用魔法表情		c->s->c
	GAME_ROOM_S_HALFWAYJOIN		= 18,	//中途入桌数据		s->c
	GAME_ROOM_S_TIPSUPROOM		= 19,	//提示升场			s->c
	GAME_ROOM_C_AGREEUPROOM		= 20,	//同意升场			c->s	
	GAME_ROOM_S_GMJOIN			= 21,	//GM入桌数据		s->c
	GAME_ROOM_S_ALLTABLESTATE	= 22,	//所有桌子状态下发	s->c
	GAME_ROOM_S_LOTTERYDATA		= 23,	//彩池数值变化		s->c
	GAME_ROOM_S_LOTTERYPLAY		= 24,	//彩池玩家中奖数据	s->c
	GAME_ROOM_S_UPDATEROOMINFO	= 25,	//更新房间配置		s->c
	GAME_ROOM_S_COMPGAMEDATA	= 26,	//压缩游戏数据		s->c
	GAME_ROOM_C_SWITCHROOM		= 27,	//切换到其他游戏房间c->s
	GAME_ROOM_S_FORCESWITCHROOM	= 28,	//服务器强制切换房间通知	s->c
	GAME_ROOM_C_FORCESWITCH		= 29,	//客户端上报可以强制切换房间	c->s
	GAME_ROOM_S_GAMEREWARD		= 30,	//游戏奖励下发		s->c
	GAME_ROOM_MAX,

	GAME_ROOM_PRIVATE_CONFIG			= 100,	//私人房配置				s->c
	GAME_ROOM_PRIVATE_LIST				= 101,	//私人房列表				s->c
	GAME_ROOM_PRIVATE_NEW				= 102,	//新增私人房				s->c
	GAME_ROOM_PRIVATE_DESTORY			= 103,	//销毁私人房				s->c
	GAME_ROOM_PRIVATE_MODIFY			= 104,	//桌主修改私人房配置		s->c
	GAME_ROOM_PRIVATE_CREATE			= 105,	//桌主创建私人房			c->s
	GAME_ROOM_PRIVATE_SET				= 106,	//桌主设置私人房			c->s
	GAME_ROOM_PRIVATE_JOIN				= 107,	//参与者加入私人房			c->s
	GAME_ROOM_PRIVATE_MODIFYGOLD		= 108,	//参与者修改金额			c->s
	GAME_ROOM_PRIVATE_APPLYJOIN			= 109,	//参与者申请入桌			c->s
	GAME_ROOM_PRIVATE_APPLYDATA			= 110,	//房主收到申请入桌消息		s->c
	GAME_ROOM_PRIVATE_MASTEROPERATION	= 111,	//房主拒绝或者同意入桌		c->s
	GAME_ROOM_PRIVATE_APPLYRET			= 112,	//参与者的申请返回			s->c
	GAME_ROOM_PRIVATE_KILLAPPLYDATA		= 113,	//通知桌主清理掉申请消息(用户可能离开房间或者做了其他操作)	s->c
	GAME_ROOM_PRIVATE_CLOSEAPPLY		= 114,	//参与者关闭申请			c->s
	GAME_ROOM_PRIVATE_CLOSEAPPLYRET		= 115,	//关闭申请返回				s->c
	GAME_ROOM_PRIVATE_GETRANKING		= 116,	//获得排行榜				c->s
	GAME_ROOM_PRIVATE_SENDRANKING		= 117,	//下发排行榜				s->c
	GAME_ROOM_PRIVATE_FREEDATA			= 118,	//用户的免费数据信息		s->c

	GAME_ROOM_PRIVATE_RANDFIT			= 119,	//发起或者结束随机撮合匹配	c->s	
	GAME_ROOM_PRIVATE_RANDFITFAIL		= 120,	//随机匹配申请失败			s->c
	GAME_ROOM_PRIVATE_RANDFITSUCCESS	= 121,	//随机匹配申请成功			s->c
	GAME_ROOM_PRIVATE_RANDFITGAMESTART	= 122,	//随机匹配成功游戏开始		s->c

	GAME_ROOM_PRIVATE_MAX,


	GAME_ROOM_GM_C_ONTABLE		= 200,	//GM进入游戏桌		c->s
	GAME_ROOM_GM_C_OUTTABLE		= 201,	//GM退出游戏桌子	c->s
	
	GAME_ROOM_GM_MAX
}
export class GS_GameRoomHead  {
	protoList:any[] = 
		[
		]

}
export class GS_S_PrivateApplyRet  {			
	btmode : number;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"k" : "btmode",	"c" : 1,},
		]

}
export class GS_S_PirvateRandFitGameStart  {			
	uitemsize : number;			
	uitemcount : number;			
	actorlist : GS_S_PirvateRandFitGameStart_ActorInfo[];
	actorlistClass : any = GS_S_PirvateRandFitGameStart_ActorInfo;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"k" : "uitemsize",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uitemcount",	"c" : 1,},			
			{	"c" : 0,	"t" : "GS_S_PirvateRandFitGameStart_ActorInfo",	"ck" : "uitemcount",	"s" : "uitemsize",	"k" : "actorlist",},
		]

}
export class GS_S_HalfWayjoin  {			
	ulen : number;			
	data : FJByteArray;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"k" : "ulen",	"c" : 1,},			
			{	"t" : "FJByteArray",	"k" : "data",	"c" : 0,},
		]

}
export class GS_C_PrivateCreate  {			
	sztabletitle : string;			
	btpwd : number[];			
	nsetgold : number;			
	data : GS_C_PrivateCreate_RuleData[];
	dataClass : any = GS_C_PrivateCreate_RuleData;
	protoList:any[] = 
		[			
			{	"t" : "stchar",	"k" : "sztabletitle",	"c" : 32,},			
			{	"t" : "uchar",	"k" : "btpwd",	"c" : 8,},			
			{	"t" : "sint64",	"k" : "nsetgold",	"c" : 1,},			
			{	"t" : "GS_C_PrivateCreate_RuleData",	"k" : "data",	"c" : 0,},
		]

}
export class GS_S_GameReward  {
	protoList:any[] = 
		[
		]

}
export class GS_S_PrivateApplyData  {			
	nactordbid : number;			
	nactortempdbid : number;			
	szname : string;			
	szmd5face : string;			
	uviplevel : number;			
	bsetgold : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"k" : "nactordbid",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nactortempdbid",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szname",	"c" : 32,},			
			{	"t" : "stchar",	"k" : "szmd5face",	"c" : 33,},			
			{	"t" : "ushort",	"k" : "uviplevel",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "bsetgold",	"c" : 1,},
		]

}
export class GS_S_RoomTableState  {			
	utableid : number;			
	btstate : number;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"k" : "utableid",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btstate",	"c" : 1,},
		]

}
export class GS_S_Tips  {			
	sztips : string;
	protoList:any[] = 
		[			
			{	"t" : "stchar",	"k" : "sztips",	"c" : 0,},
		]

}
export class GS_S_PrivateFreeData  {			
	ufreecreatecount : number;			
	ufreejoincount : number;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"k" : "ufreecreatecount",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "ufreejoincount",	"c" : 1,},
		]

}
export class GS_CS_RoomCompGameData  {			
	data : FJByteArray;
	protoList:any[] = 
		[			
			{	"t" : "FJByteArray",	"k" : "data",	"c" : 0,},
		]

}
export class GS_C_GameLog  {			
	szlog : string[];
	protoList:any[] = 
		[			
			{	"t" : "uchar_string",	"k" : "szlog",	"c" : 0,},
		]

}
export class GS_C_PrivateSet_RuleData  {			
	btmainkey : number;			
	btsubkey : number;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"k" : "btmainkey",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btsubkey",	"c" : 1,},
		]

}
export class GS_S_AddFriendRequest  {			
	nsendactordbid : number;			
	nrecvactordbid : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"k" : "nsendactordbid",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nrecvactordbid",	"c" : 1,},
		]

}
export class GS_S_PrivateConfig_CustomSubKey  {			
	btmainkey : number;			
	btsubkey : number;			
	szdes : string;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"k" : "btmainkey",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btsubkey",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szdes",	"c" : 32,},
		]

}
export class GS_S_PopRecharge  {			
	nrid : number;			
	ngametype : number;			
	ngrouptype : number;			
	nkindid : number;			
	nquickgoodsid : number;			
	nquickgoodsnum : number;			
	nquickneedrmb : number;			
	nquickneeddiamonds : number;			
	szquicktitle : string;			
	szquickdes : string;			
	szquickpaykey : string;			
	nquickgivegoodsid : number[];			
	nquickgivegoodsnum : number[];
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nrid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngametype",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngrouptype",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nkindid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nquickgoodsid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nquickgoodsnum",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nquickneedrmb",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nquickneeddiamonds",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szquicktitle",	"c" : 32,},			
			{	"t" : "stchar",	"k" : "szquickdes",	"c" : 512,},			
			{	"t" : "stchar",	"k" : "szquickpaykey",	"c" : 16,},			
			{	"t" : "slong",	"k" : "nquickgivegoodsid",	"c" : 3,},			
			{	"t" : "slong",	"k" : "nquickgivegoodsnum",	"c" : 3,},
		]

}
export class GS_C_ForceSwitchRoom  {
	protoList:any[] = 
		[
		]

}
export class GS_C_PrivateMasterOperation  {			
	noperationactordbid : number;			
	noperationactortempdbid : number;			
	btmode : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"k" : "noperationactordbid",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "noperationactortempdbid",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btmode",	"c" : 1,},
		]

}
export class GS_S_PrivateConfig_BaseRule  {			
	ucreateneedviplevel : number;			
	ncreateretaingold : number;			
	ncreatemaxgold : number;			
	ulevelvipvalidtimes : number;			
	ncreatemingold : number;			
	btcreatemode : number;			
	ufreecreateviplevel : number;			
	udayfreecreatecount : number;			
	ufreejoinviplevel : number;			
	udayfreejoincount : number;			
	btcanrankfit : number;			
	urankfitviplevel : number;			
	urankfitlevelvipvalidtimes : number;			
	nrankfitretaingold : number;			
	nrankfitmaxgold : number;			
	nrankfitmingold : number;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"k" : "ucreateneedviplevel",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "ncreateretaingold",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "ncreatemaxgold",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "ulevelvipvalidtimes",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "ncreatemingold",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btcreatemode",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "ufreecreateviplevel",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "udayfreecreatecount",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "ufreejoinviplevel",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "udayfreejoincount",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btcanrankfit",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "urankfitviplevel",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "urankfitlevelvipvalidtimes",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nrankfitretaingold",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nrankfitmaxgold",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nrankfitmingold",	"c" : 1,},
		]

}
export class GS_S_MagicInfo  {			
	umagiccount : number;			
	smagicinfo : GS_S_MagicInfo_MagicInfo[];
	smagicinfoClass : any = GS_S_MagicInfo_MagicInfo;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"k" : "umagiccount",	"c" : 1,},			
			{	"t" : "GS_S_MagicInfo_MagicInfo",	"k" : "smagicinfo",	"c" : 0,},
		]

}
export class GS_S_PrivateConfig  {			
	ubaserulesize : number;			
	umainkeyitemsize : number;			
	umainkeycount : number;			
	ucustomruleitemsize : number;			
	ucustomrulecount : number;			
	data1 : GS_S_PrivateConfig_BaseRule[];
	data1Class : any = GS_S_PrivateConfig_BaseRule;			
	data2 : GS_S_PrivateConfig_CustomMainKey[];
	data2Class : any = GS_S_PrivateConfig_CustomMainKey;			
	data3 : GS_S_PrivateConfig_CustomSubKey[];
	data3Class : any = GS_S_PrivateConfig_CustomSubKey;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"k" : "ubaserulesize",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "umainkeyitemsize",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "umainkeycount",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "ucustomruleitemsize",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "ucustomrulecount",	"c" : 1,},			
			{	"s" : "ubaserulesize",	"t" : "GS_S_PrivateConfig_BaseRule",	"ck" : "1",	"c" : 0,	"k" : "data1",},			
			{	"s" : "umainkeyitemsize",	"t" : "GS_S_PrivateConfig_CustomMainKey",	"ck" : "umainkeycount",	"c" : 0,	"k" : "data2",},			
			{	"s" : "ucustomruleitemsize",	"t" : "GS_S_PrivateConfig_CustomSubKey",	"ck" : "ucustomrulecount",	"c" : 0,	"k" : "data3",},
		]

}
export class GS_C_PrivateCreate_RuleData  {			
	btmainkey : number;			
	btsubkey : number;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"k" : "btmainkey",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btsubkey",	"c" : 1,},
		]

}
export class GS_C_ChangeTable  {
	protoList:any[] = 
		[
		]

}
export class GS_CS_UseMagic  {			
	nsendactordbid : number;			
	nrecvactordbid : number;			
	umagicid : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"k" : "nsendactordbid",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nrecvactordbid",	"c" : 1,},			
			{	"t" : "ulong",	"k" : "umagicid",	"c" : 1,},
		]

}
export class GS_GM_C_OutTable  {
	protoList:any[] = 
		[
		]

}
export class GS_S_RoomInfo  {			
	nserverid : number;			
	szservername : string;			
	nroomtype : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nserverid",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szservername",	"c" : 32,},			
			{	"t" : "slong",	"k" : "nroomtype",	"c" : 1,},
		]

}
export class GS_S_PirvateRandFitGameStart_ActorInfo  {			
	nactordbid : number;			
	szname : string;			
	szface : string;			
	ugold : number;			
	nviplevel : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"k" : "nactordbid",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szname",	"c" : 32,},			
			{	"t" : "stchar",	"k" : "szface",	"c" : 33,},			
			{	"t" : "uint64",	"k" : "ugold",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nviplevel",	"c" : 1,},
		]

}
export class GS_S_LotteryData  {			
	uhandselgold : number;			
	uhandselgold2 : number;
	protoList:any[] = 
		[			
			{	"t" : "uint64",	"k" : "uhandselgold",	"c" : 1,},			
			{	"t" : "uint64",	"k" : "uhandselgold2",	"c" : 1,},
		]

}
export class GS_S_TipsUpRoom  {			
	uuproomserverid : number;			
	uuproomrewardgold : number;			
	szuproomname : string;
	protoList:any[] = 
		[			
			{	"t" : "ulong",	"k" : "uuproomserverid",	"c" : 1,},			
			{	"t" : "ulong",	"k" : "uuproomrewardgold",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szuproomname",	"c" : 32,},
		]

}
export class GS_S_UpdateRoomInfo  {			
	nrid : number;			
	nquickgoodsid : number;			
	nquickgoodsnum : number;			
	nquickneedrmb : number;			
	nquickneeddiamonds : number;			
	szquicktitle : string;			
	szquickdes : string;			
	szquickpaykey : string;			
	nquickgivegoodsid : number[];			
	nquickgivegoodsnum : number[];			
	ndefpaykeyflag : number;			
	npaykeyflag : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nrid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nquickgoodsid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nquickgoodsnum",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nquickneedrmb",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nquickneeddiamonds",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szquicktitle",	"c" : 32,},			
			{	"t" : "stchar",	"k" : "szquickdes",	"c" : 512,},			
			{	"t" : "stchar",	"k" : "szquickpaykey",	"c" : 16,},			
			{	"t" : "slong",	"k" : "nquickgivegoodsid",	"c" : 3,},			
			{	"t" : "slong",	"k" : "nquickgivegoodsnum",	"c" : 3,},			
			{	"t" : "uint64",	"k" : "ndefpaykeyflag",	"c" : 1,},			
			{	"t" : "uint64",	"k" : "npaykeyflag",	"c" : 1,},
		]

}
export class GS_C_SwitchRoom  {			
	nroomkindid : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nroomkindid",	"c" : 1,},
		]

}
export class TableInfo  {			
	utableid : number;			
	nmasterid : number;			
	szmastername : string;			
	szmasterface : string;			
	umasterviplevel : number;			
	sztabletitle : string;			
	szruledes : string;			
	btstate : number;			
	nmastertempid : number;			
	nsetgold : number;			
	urandtableid : number;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"k" : "utableid",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nmasterid",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szmastername",	"c" : 32,},			
			{	"t" : "stchar",	"k" : "szmasterface",	"c" : 33,},			
			{	"t" : "ushort",	"k" : "umasterviplevel",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "sztabletitle",	"c" : 32,},			
			{	"t" : "stchar",	"k" : "szruledes",	"c" : 32,},			
			{	"t" : "uchar",	"k" : "btstate",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nmastertempid",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nsetgold",	"c" : 1,},			
			{	"t" : "ulong",	"k" : "urandtableid",	"c" : 1,},
		]

}
export class GS_C_RoomOutTable  {
	protoList:any[] = 
		[
		]

}
export class GS_S_ForceSwitchRoom  {			
	btmode : number;			
	uroomserverid : number;			
	szroomname : string;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"k" : "btmode",	"c" : 1,},			
			{	"t" : "ulong",	"k" : "uroomserverid",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szroomname",	"c" : 32,},
		]

}
export class GS_C_Trusteeship  {			
	btusertrusteeship : number;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"k" : "btusertrusteeship",	"c" : 1,},
		]

}
export class GS_S_MagicInfo_MagicInfo  {			
	nid : number;			
	ngold : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngold",	"c" : 1,},
		]

}
export class GS_S_PrivateModify  {			
	utableid : number;			
	sztabletitle : string;			
	szruledes : string;			
	btstate : number;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"k" : "utableid",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "sztabletitle",	"c" : 32,},			
			{	"t" : "stchar",	"k" : "szruledes",	"c" : 32,},			
			{	"t" : "uchar",	"k" : "btstate",	"c" : 1,},
		]

}
export class GS_S_Replace  {			
	ulen : number;			
	data : FJByteArray;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"k" : "ulen",	"c" : 1,},			
			{	"t" : "FJByteArray",	"k" : "data",	"c" : 0,},
		]

}
export class GS_S_DropEnd  {			
	ulen : number;			
	data : FJByteArray;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"k" : "ulen",	"c" : 1,},			
			{	"t" : "FJByteArray",	"k" : "data",	"c" : 0,},
		]

}
export class GS_C_PrivateGetRanking  {
	protoList:any[] = 
		[
		]

}
export class GS_C_PrivateCloseApply  {
	protoList:any[] = 
		[
		]

}
export class GS_S_PrivateSendRanking  {			
	uitemcount : number;			
	uitemsize : number;			
	nmyscore : number;			
	item : GS_S_PrivateSendRanking_Ranking[];
	itemClass : any = GS_S_PrivateSendRanking_Ranking;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"k" : "uitemcount",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uitemsize",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nmyscore",	"c" : 1,},			
			{	"c" : 0,	"t" : "GS_S_PrivateSendRanking_Ranking",	"ck" : "uitemcount",	"s" : "uitemsize",	"k" : "item",},
		]

}
export class GS_S_PrivateSendRanking_Ranking  {			
	nactortempdbid : number;			
	szname : string;			
	szmd5face : string;			
	nscore : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"k" : "nactortempdbid",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szname",	"c" : 32,},			
			{	"t" : "stchar",	"k" : "szmd5face",	"c" : 33,},			
			{	"t" : "sint64",	"k" : "nscore",	"c" : 1,},
		]

}
export class GS_S_GameRule  {			
	ulen : number;			
	data : FJByteArray;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"k" : "ulen",	"c" : 1,},			
			{	"t" : "FJByteArray",	"k" : "data",	"c" : 0,},
		]

}
export class GS_C_PrivateJoin  {			
	utableid : number;			
	btpwd : number[];			
	nsetgold : number;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"k" : "utableid",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btpwd",	"c" : 8,},			
			{	"t" : "sint64",	"k" : "nsetgold",	"c" : 1,},
		]

}
export class GS_C_RoomHands  {
	protoList:any[] = 
		[
		]

}
export class GS_S_PrivateNew  {			
	data : TableInfo;
	dataClass : any = TableInfo;
	protoList:any[] = 
		[			
			{	"t" : "TableInfo",	"k" : "data",	"c" : 1,},
		]

}
export class GS_CS_RoomGameData  {			
	data : FJByteArray;
	protoList:any[] = 
		[			
			{	"t" : "FJByteArray",	"k" : "data",	"c" : 0,},
		]

}
export class GS_C_RoomOnTable  {			
	ntableid : number;			
	nchairid : number;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"k" : "ntableid",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "nchairid",	"c" : 1,},
		]

}
export class GS_S_PirvateRandFitSuccess  {			
	ngold : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"k" : "ngold",	"c" : 1,},
		]

}
export class GS_S_GMjoin  {			
	ulen : number;			
	data : FJByteArray;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"k" : "ulen",	"c" : 1,},			
			{	"t" : "FJByteArray",	"k" : "data",	"c" : 0,},
		]

}
export class GS_S_PrivateKillApplyData  {			
	nactordbid : number;			
	nactortempdbid : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"k" : "nactordbid",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nactortempdbid",	"c" : 1,},
		]

}
export class GS_C_AgreeUpRoom  {			
	uuproomserverid : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "uuproomserverid",	"c" : 1,},
		]

}
export class GS_C_PrivateSet  {			
	sztabletitle : string;			
	btpwd : number[];			
	nsetgold : number;			
	data : GS_C_PrivateSet_RuleData[];
	dataClass : any = GS_C_PrivateSet_RuleData;
	protoList:any[] = 
		[			
			{	"t" : "stchar",	"k" : "sztabletitle",	"c" : 32,},			
			{	"t" : "uchar",	"k" : "btpwd",	"c" : 8,},			
			{	"t" : "sint64",	"k" : "nsetgold",	"c" : 1,},			
			{	"t" : "GS_C_PrivateSet_RuleData",	"k" : "data",	"c" : 0,},
		]

}
export class GS_S_AllTableState  {			
	utablecount : number;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"k" : "utablecount",	"c" : 1,},
		]

}
export class GS_C_PrivateApplyJoin  {			
	utableid : number;			
	btusefree : number;			
	nsetgold : number;			
	urandtableid : number;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"k" : "utableid",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btusefree",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nsetgold",	"c" : 1,},			
			{	"t" : "ulong",	"k" : "urandtableid",	"c" : 1,},
		]

}
export class GS_S_PrivateConfig_CustomMainKey  {			
	btmainkey : number;			
	btoperationtype : number;			
	szdes : string;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"k" : "btmainkey",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btoperationtype",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szdes",	"c" : 32,},
		]

}
export class GS_S_PrivateCloseApplyRet  {
	protoList:any[] = 
		[
		]

}
export class GS_S_PrivateRandFitFail  {			
	sztips : string;
	protoList:any[] = 
		[			
			{	"t" : "stchar",	"k" : "sztips",	"c" : 0,},
		]

}
export class GS_C_RoomOut  {
	protoList:any[] = 
		[
		]

}
export class GS_S_LotteryPlayer  {			
	nlastwinningdbid : number;			
	szlastwinningname : string;			
	szlastwinningface : string;			
	ulastwinninggold : number;			
	nlastwinningactorviplevel : number;			
	nlastwinningdbid2 : number;			
	szlastwinningname2 : string;			
	szlastwinningface2 : string;			
	ulastwinninggold2 : number;			
	nlastwinningactorviplevel2 : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"k" : "nlastwinningdbid",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szlastwinningname",	"c" : 32,},			
			{	"t" : "stchar",	"k" : "szlastwinningface",	"c" : 33,},			
			{	"t" : "uint64",	"k" : "ulastwinninggold",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nlastwinningactorviplevel",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nlastwinningdbid2",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szlastwinningname2",	"c" : 32,},			
			{	"t" : "stchar",	"k" : "szlastwinningface2",	"c" : 33,},			
			{	"t" : "uint64",	"k" : "ulastwinninggold2",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nlastwinningactorviplevel2",	"c" : 1,},
		]

}
export class GS_C_PrivateJoinModifyGold  {			
	nsetgold : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"k" : "nsetgold",	"c" : 1,},
		]

}
export class GS_S_PrivateList  {			
	ucount : number;			
	uitemsize : number;			
	data : TableInfo[];
	dataClass : any = TableInfo;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"k" : "ucount",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uitemsize",	"c" : 1,},			
			{	"c" : 0,	"t" : "TableInfo",	"ck" : "ucount",	"s" : "uitemsize",	"k" : "data",},
		]

}
export class GS_S_PrivateDestory  {			
	utableid : number;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"k" : "utableid",	"c" : 1,},
		]

}
export class GS_GM_C_OnTable  {			
	ntableid : number;			
	nchairid : number;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"k" : "ntableid",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "nchairid",	"c" : 1,},
		]

}
export class GS_C_PirvateRandFit  {			
	ngold : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"k" : "ngold",	"c" : 1,},
		]

}
 

 