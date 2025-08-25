import FJByteArray from "../socket/FJByteArray";
export enum GS_PLAZA_PVP_MSG
{	
	PLAZA_PVP_RANKCONFIG			= 0,	// 竞技场段位配置				s->c
	PLAZA_PVP_PRIVATE				= 1,	// 竞技的个人数据				s->c
	PLAZA_PVP_SETTROOPS				= 2,	// 修改竞技猫咪设置					c->s
	PLAZA_PVP_RETSETTROOPS			= 3,	// 确认修改竞技猫咪设置			s->c
	PLAZA_PVP_JOIN					= 4,	// 加入竞技							c->s	
	PLAZA_PVP_WAIT					= 5,	// 等待撮合开始					s->c
	PLAZA_PVP_OUT					= 6,	// 退出竞技							c->s
	PLAZA_PVP_OUTFINISH				= 7,	// 退出成功						s->c
	PLAZA_PVP_PLAYER				= 8,	// 竞技双方信息下发				s->c
	PLAZA_PVP_ROBOTPLAYER			= 9,	// 竞技双方使用机器人模式		s->c
	PLAZA_PVP_MAP					= 10,	// 竞技地图下发					s->c
	PLAZA_PVP_READYPROGRESS			= 11,	// 加载等相关进度上报				c->s
	PLAZA_PVP_START					= 12,	// 开始竞技						s->c
	PLAZA_PVP_END					= 13,	// 客户端上报结束					c->s
	PLAZA_PVP_GAMEEND				= 14,	// 竞技结束						s->c
	PLAZA_PVP_GAMEENDERROR			= 15,	// 竞技异常结束					s->c
	PLAZA_PVP_C2S					= 16,	// 游戏帧上报						c->s
	PLAZA_PVP_S2C					= 17,	// 游戏帧同步下发				s->c
	PLAZA_PVP_SENDEMOTICON			= 18,	// 发送表情图包						c->s
	PLAZA_PVP_BROADEMOTICON			= 19,	// 广播表情图包					s->c
	PLAZA_PVP_SCENESTARTREST		= 20,	// 场景还原开始					s->c
	PLAZA_PVP_SCENEFRAMEREST		= 21,	// 场景还原传递(帧)				s->c
	PLAZA_PVP_SCENEDATAREST			= 22,	// 场景还原传递(数据)			s->c
	PLAZA_PVP_SCENEENDREST			= 23,	// 场景还原结束					s->c	
	PLAZA_PVP_RANKING				= 24,	// 下发排行榜					s->c
	PLAZA_PVP_SETROBOTDATA			= 25,	// 上报机器人数据					c->s
	PLAZA_PVP_RETROBOTDATA			= 26,	// 回传确认机器人数据			s->c

	PLAZA_PVP_UPDAYPLAYCOUNT		= 27,	// 更新进入参与次数				s->c	
	PLAZA_PVP_INVITE				= 28,	// 发起或取消邀请					c->s	
	PLAZA_PVP_INVITESTATE			= 29,	// 邀请状态通知					s->c	
	PLAZA_PVP_INVITERESPONSE		= 30,	// 同意或拒绝邀请					c->s
	PLAZA_PVP_INVITECLEAR			= 31,	// 清空某个用户对我发起的状态	s->c

	PLAZA_PVP_DAILYMATCH_STATUS		= 32,	// 定时赛开启状态				s->c
	PLAZA_PVP_DAILYMATCH_WIN_TIPS	= 33,	// 定时赛连胜提示				s->c
	PLAZA_PVP_DAILYMATCH_WIN_STOP_TIPS = 34,	// 定时赛连胜终止提示		s->c

	PLAZA_PVP_DAILYMATCH_SENIORTIMESTODAY = 35,	// 更新 定时赛（高级场）已进行的游戏次数		s->c

	PLAZA_PVP_MAX
}
export class GS_PvPHead  {
	protoList:any[] = 
		[
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
export class GS_PvPRobotPlayer  {			
	ndayplaycount : number;			
	btrobottype : number;
	protoList:any[] = 
		[			
			{	"k" : "ndayplaycount",	"c" : 1,	"t" : "slong",},			
			{	"k" : "btrobottype",	"c" : 1,	"t" : "uchar",},
		]

}
export class GS_PvPDailyMatchSeniorTimesToday  {			
	nseniortimestoday : number;
	protoList:any[] = 
		[			
			{	"k" : "nseniortimestoday",	"c" : 1,	"t" : "slong",},
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
export class GS_PvPSetTroops  {			
	ntroopsids : number[];
	protoList:any[] = 
		[			
			{	"k" : "ntroopsids",	"c" : 9,	"t" : "slong",},
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
export class GS_PvPRetRobotData_TroopsData  {			
	nid : number;			
	nlv : number;
	protoList:any[] = 
		[			
			{	"k" : "nid",	"c" : 1,	"t" : "slong",},			
			{	"k" : "nlv",	"c" : 1,	"t" : "slong",},
		]

}
export class GS_PvPUpDayPlayCount  {			
	nplaycount : number;
	protoList:any[] = 
		[			
			{	"k" : "nplaycount",	"c" : 1,	"t" : "slong",},
		]

}
export class GS_PvPInvite  {			
	bttype : number;			
	nactordbid : number;
	protoList:any[] = 
		[			
			{	"k" : "bttype",	"c" : 1,	"t" : "uchar",},			
			{	"k" : "nactordbid",	"c" : 1,	"t" : "sint64",},
		]

}
export class GS_PvPRankConfig_MatchRewardItem  {			
	nminranking : number;			
	nmaxranking : number;			
	ngoodsnums : number[];
	protoList:any[] = 
		[			
			{	"k" : "nminranking",	"c" : 1,	"t" : "slong",},			
			{	"k" : "nmaxranking",	"c" : 1,	"t" : "slong",},			
			{	"k" : "ngoodsnums",	"c" : 4,	"t" : "slong",},
		]

}
export class GS_PvPRanking_RankingActor  {			
	btranking : number;			
	nactordbid : number;			
	szname : string;			
	szmd5face : string;			
	nfaceid : number;			
	nfaceframeid : number;			
	btsex : number;			
	nrankscore : number;			
	ntoptroopsid1 : number;			
	ntoptroopslv1 : number;			
	ntoptroopsid2 : number;			
	ntoptroopslv2 : number;			
	ntoptroopsid3 : number;			
	ntoptroopslv3 : number;
	protoList:any[] = 
		[			
			{	"k" : "btranking",	"c" : 1,	"t" : "uchar",},			
			{	"k" : "nactordbid",	"c" : 1,	"t" : "sint64",},			
			{	"k" : "szname",	"c" : 32,	"t" : "stchar",},			
			{	"k" : "szmd5face",	"c" : 33,	"t" : "stchar",},			
			{	"k" : "nfaceid",	"c" : 1,	"t" : "slong",},			
			{	"k" : "nfaceframeid",	"c" : 1,	"t" : "slong",},			
			{	"k" : "btsex",	"c" : 1,	"t" : "uchar",},			
			{	"k" : "nrankscore",	"c" : 1,	"t" : "sint64",},			
			{	"k" : "ntoptroopsid1",	"c" : 1,	"t" : "slong",},			
			{	"k" : "ntoptroopslv1",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "ntoptroopsid2",	"c" : 1,	"t" : "slong",},			
			{	"k" : "ntoptroopslv2",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "ntoptroopsid3",	"c" : 1,	"t" : "slong",},			
			{	"k" : "ntoptroopslv3",	"c" : 1,	"t" : "ushort",},
		]

}
export class GS_PvPReadyProgress  {			
	uprogress : number;
	protoList:any[] = 
		[			
			{	"k" : "uprogress",	"c" : 1,	"t" : "ushort",},
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
export class GS_PvPRetRobotData_FashionData  {			
	nid : number;
	protoList:any[] = 
		[			
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
export class GS_PvPJoin  {			
	btmatchtype : number;
	protoList:any[] = 
		[			
			{	"k" : "btmatchtype",	"c" : 1,	"t" : "uchar",},
		]

}
export class GS_PvPGameEndError  {			
	sztips : string;
	protoList:any[] = 
		[			
			{	"k" : "sztips",	"c" : 128,	"t" : "stchar",},
		]

}
export class GS_PvPRankConfig_DailyMatch  {			
	nopendayflag : number;			
	smatchtime : GS_PvPRankConfig_MatchTime[];
	smatchtimeClass : any = GS_PvPRankConfig_MatchTime;			
	nmaxscoreforday : number;			
	nwinscore : number;			
	nlostscore : number;			
	nseniortimesdaily : number;			
	nseniorgoodsid : number;			
	nseniorgoodsnum : number;			
	sseniorrewarditemwin : GS_PvPRankConfig_RewardItem[];
	sseniorrewarditemwinClass : any = GS_PvPRankConfig_RewardItem;			
	sseniorrewarditemlose : GS_PvPRankConfig_RewardItem[];
	sseniorrewarditemloseClass : any = GS_PvPRankConfig_RewardItem;
	protoList:any[] = 
		[			
			{	"k" : "nopendayflag",	"c" : 1,	"t" : "slong",},			
			{	"k" : "smatchtime",	"c" : 2,	"t" : "GS_PvPRankConfig_MatchTime",},			
			{	"k" : "nmaxscoreforday",	"c" : 1,	"t" : "slong",},			
			{	"k" : "nwinscore",	"c" : 1,	"t" : "slong",},			
			{	"k" : "nlostscore",	"c" : 1,	"t" : "slong",},			
			{	"k" : "nseniortimesdaily",	"c" : 1,	"t" : "slong",},			
			{	"k" : "nseniorgoodsid",	"c" : 1,	"t" : "slong",},			
			{	"k" : "nseniorgoodsnum",	"c" : 1,	"t" : "slong",},			
			{	"k" : "sseniorrewarditemwin",	"c" : 3,	"t" : "GS_PvPRankConfig_RewardItem",},			
			{	"k" : "sseniorrewarditemlose",	"c" : 3,	"t" : "GS_PvPRankConfig_RewardItem",},
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
export class GS_PvPRankConfig_Base  {			
	btpowerlvcount : number;			
	npowerlv : number[];			
	npowerfightadd : number[];			
	nmonstergoldaddper : number;			
	nthinggoldaddper : number;			
	ninvitewaittimes : number;			
	ninvitesettimes : number;			
	ndayfreecount : number;			
	nopenwarid : number;
	protoList:any[] = 
		[			
			{	"k" : "btpowerlvcount",	"c" : 1,	"t" : "uchar",},			
			{	"k" : "npowerlv",	"c" : 128,	"t" : "slong",},			
			{	"k" : "npowerfightadd",	"c" : 9,	"t" : "slong",},			
			{	"k" : "nmonstergoldaddper",	"c" : 1,	"t" : "slong",},			
			{	"k" : "nthinggoldaddper",	"c" : 1,	"t" : "slong",},			
			{	"k" : "ninvitewaittimes",	"c" : 1,	"t" : "slong",},			
			{	"k" : "ninvitesettimes",	"c" : 1,	"t" : "slong",},			
			{	"k" : "ndayfreecount",	"c" : 1,	"t" : "slong",},			
			{	"k" : "nopenwarid",	"c" : 1,	"t" : "slong",},
		]

}
export class GS_PvPRanking  {			
	uitemcount : number;			
	uitemsize : number;			
	data : GS_PvPRanking_RankingActor[];
	dataClass : any = GS_PvPRanking_RankingActor;
	protoList:any[] = 
		[			
			{	"k" : "uitemcount",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "uitemsize",	"c" : 1,	"t" : "ushort",},			
			{	"ck" : "uitemcount",	"s" : "uitemsize",	"k" : "data",	"c" : 0,	"t" : "GS_PvPRanking_RankingActor",},
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
			{	"ck" : "uplayercount",	"k" : "data1",	"c" : 0,	"s" : "uplayersize",	"t" : "GS_PvPRetRobotData_PlayerItem",},			
			{	"ck" : "utroopscount",	"k" : "data2",	"c" : 0,	"s" : "utroopssize",	"t" : "GS_PvPRetRobotData_TroopsData",},			
			{	"ck" : "utroopsequipcount",	"k" : "data3",	"c" : 0,	"s" : "utroopsequipsize",	"t" : "GS_PvPRetRobotData_TroopsEquipData",},			
			{	"ck" : "utroopsstrengcount",	"k" : "data4",	"c" : 0,	"s" : "utroopsstrengsize",	"t" : "GS_PvPRetRobotData_StrengData",},			
			{	"ck" : "utroopsfashioncount",	"k" : "data5",	"c" : 0,	"s" : "utroopsfashionsize",	"t" : "GS_PvPRetRobotData_FashionData",},
		]

}
export class GS_PvPSceneDataRest  {			
	data : FJByteArray;
	protoList:any[] = 
		[			
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
			{	"ck" : "uitemcount",	"s" : "uitemsize",	"k" : "data",	"c" : 0,	"t" : "GS_PvPSceneFrameRest_FrameItem",},
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
export class GS_PvPEnd  {			
	bttype : number;
	protoList:any[] = 
		[			
			{	"k" : "bttype",	"c" : 1,	"t" : "uchar",},
		]

}
export class GS_PvPSceneEndRest  {
	protoList:any[] = 
		[
		]

}
export class GS_PvPRetSetTroops  {			
	ntroopsids : number[];
	protoList:any[] = 
		[			
			{	"k" : "ntroopsids",	"c" : 9,	"t" : "slong",},
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
export class GS_PvPWait  {
	protoList:any[] = 
		[
		]

}
export class GS_PvPRankConfig_MatchItem  {			
	szname : string;			
	nstartdaytimes : number;			
	nenddaytimes : number;			
	nrankingminscore : number;			
	ngoodsids : number[];			
	btrewardcount : number;
	protoList:any[] = 
		[			
			{	"k" : "szname",	"c" : 32,	"t" : "stchar",},			
			{	"k" : "nstartdaytimes",	"c" : 1,	"t" : "slong",},			
			{	"k" : "nenddaytimes",	"c" : 1,	"t" : "slong",},			
			{	"k" : "nrankingminscore",	"c" : 1,	"t" : "slong",},			
			{	"k" : "ngoodsids",	"c" : 4,	"t" : "slong",},			
			{	"k" : "btrewardcount",	"c" : 1,	"t" : "uchar",},
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
			{	"ck" : "uplayercount",	"k" : "data1",	"c" : 0,	"s" : "uplayersize",	"t" : "GS_PvPSetRobotData_PlayerItem",},			
			{	"ck" : "utroopscount",	"k" : "data2",	"c" : 0,	"s" : "utroopssize",	"t" : "GS_PvPSetRobotData_TroopsData",},			
			{	"ck" : "utroopsequipcount",	"k" : "data3",	"c" : 0,	"s" : "utroopsequipsize",	"t" : "GS_PvPSetRobotData_TroopsEquipData",},			
			{	"ck" : "utroopsstrengcount",	"k" : "data4",	"c" : 0,	"s" : "utroopsstrengsize",	"t" : "GS_PvPSetRobotData_StrengData",},			
			{	"ck" : "utroopsfashioncount",	"k" : "data5",	"c" : 0,	"s" : "utroopsfashionsize",	"t" : "GS_PvPSetRobotData_FashionData",},
		]

}
export class GS_PvPPrivate  {			
	ntroopsids : number[];			
	btstate : number;			
	ndayplaycount : number;			
	ntotalscoretoday : number;			
	nseniortimestoday : number;
	protoList:any[] = 
		[			
			{	"k" : "ntroopsids",	"c" : 9,	"t" : "slong",},			
			{	"k" : "btstate",	"c" : 1,	"t" : "uchar",},			
			{	"k" : "ndayplaycount",	"c" : 1,	"t" : "slong",},			
			{	"k" : "ntotalscoretoday",	"c" : 1,	"t" : "slong",},			
			{	"k" : "nseniortimestoday",	"c" : 1,	"t" : "slong",},
		]

}
export class GS_PvPRankConfig  {			
	umatchbasecount : number;			
	umatchcount : number;			
	umatchrewardcount : number;			
	umatchbasestructsize : number;			
	umatchstructsize : number;			
	umatchrewardstructsize : number;			
	udailymatchcount : number;			
	udailymatchstructsize : number;			
	data1 : GS_PvPRankConfig_Base[];
	data1Class : any = GS_PvPRankConfig_Base;			
	data2 : GS_PvPRankConfig_MatchItem[];
	data2Class : any = GS_PvPRankConfig_MatchItem;			
	data3 : GS_PvPRankConfig_MatchRewardItem[];
	data3Class : any = GS_PvPRankConfig_MatchRewardItem;			
	data4 : GS_PvPRankConfig_DailyMatch[];
	data4Class : any = GS_PvPRankConfig_DailyMatch;
	protoList:any[] = 
		[			
			{	"k" : "umatchbasecount",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "umatchcount",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "umatchrewardcount",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "umatchbasestructsize",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "umatchstructsize",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "umatchrewardstructsize",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "udailymatchcount",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "udailymatchstructsize",	"c" : 1,	"t" : "ushort",},			
			{	"ck" : "umatchbasecount",	"k" : "data1",	"c" : 0,	"s" : "umatchbasestructsize",	"t" : "GS_PvPRankConfig_Base",},			
			{	"ck" : "umatchcount",	"k" : "data2",	"c" : 0,	"s" : "umatchstructsize",	"t" : "GS_PvPRankConfig_MatchItem",},			
			{	"ck" : "umatchrewardcount",	"k" : "data3",	"c" : 0,	"s" : "umatchrewardstructsize",	"t" : "GS_PvPRankConfig_MatchRewardItem",},			
			{	"ck" : "udailymatchcount",	"k" : "data4",	"c" : 0,	"s" : "udailymatchstructsize",	"t" : "GS_PvPRankConfig_DailyMatch",},
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
export class GS_PvPSetRobotData_StrengData  {			
	nid : number;			
	nlevel : number;
	protoList:any[] = 
		[			
			{	"k" : "nid",	"c" : 1,	"t" : "slong",},			
			{	"k" : "nlevel",	"c" : 1,	"t" : "slong",},
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
export class GS_PvPInviteState  {			
	btstate : number;			
	ntimer : number;			
	nmasterdbid : number;			
	nactordbid : number;
	protoList:any[] = 
		[			
			{	"k" : "btstate",	"c" : 1,	"t" : "uchar",},			
			{	"k" : "ntimer",	"c" : 1,	"t" : "sint64",},			
			{	"k" : "nmasterdbid",	"c" : 1,	"t" : "sint64",},			
			{	"k" : "nactordbid",	"c" : 1,	"t" : "sint64",},
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
export class GS_PvPPlayer  {			
	btmode : number;			
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
			{	"k" : "btmode",	"c" : 1,	"t" : "uchar",},			
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
			{	"ck" : "uplayercount",	"k" : "data1",	"c" : 0,	"s" : "uplayersize",	"t" : "GS_PvPPlayer_PlayerItem",},			
			{	"ck" : "utroopscount",	"k" : "data2",	"c" : 0,	"s" : "utroopssize",	"t" : "GS_PvPPlayer_TroopsData",},			
			{	"ck" : "utroopsequipcount",	"k" : "data3",	"c" : 0,	"s" : "utroopsequipsize",	"t" : "GS_PvPPlayer_TroopsEquipData",},			
			{	"ck" : "utroopsstrengcount",	"k" : "data4",	"c" : 0,	"s" : "utroopsstrengsize",	"t" : "GS_PvPPlayer_StrengData",},			
			{	"ck" : "utroopsfashioncount",	"k" : "data5",	"c" : 0,	"s" : "utroopsfashionsize",	"t" : "GS_PvPPlayer_FashionData",},
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
export class GS_PvPDailyMatchWinTips  {			
	sznamewinner : string;			
	nwincount : number;
	protoList:any[] = 
		[			
			{	"k" : "sznamewinner",	"c" : 32,	"t" : "stchar",},			
			{	"k" : "nwincount",	"c" : 1,	"t" : "slong",},
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
export class GS_PvPOutFinish  {
	protoList:any[] = 
		[
		]

}
export class GS_PvPDailyMatchStatus  {			
	btopen : number;
	protoList:any[] = 
		[			
			{	"k" : "btopen",	"c" : 1,	"t" : "uchar",},
		]

}
export class GS_PvPDailyMatchWinStopTips  {			
	sznamewinner : string;			
	sznameloser : string;			
	nwincount : number;
	protoList:any[] = 
		[			
			{	"k" : "sznamewinner",	"c" : 32,	"t" : "stchar",},			
			{	"k" : "sznameloser",	"c" : 32,	"t" : "stchar",},			
			{	"k" : "nwincount",	"c" : 1,	"t" : "slong",},
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
export class GS_PvPInviteClear  {			
	nactordbid : number;
	protoList:any[] = 
		[			
			{	"k" : "nactordbid",	"c" : 1,	"t" : "sint64",},
		]

}
export class GS_PvPRankConfig_RewardItem  {			
	ngoodsid : number;			
	ngoodsnum : number;
	protoList:any[] = 
		[			
			{	"k" : "ngoodsid",	"c" : 1,	"t" : "slong",},			
			{	"k" : "ngoodsnum",	"c" : 1,	"t" : "slong",},
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
export class GS_PvPSendEmotIcon  {			
	nid : number;
	protoList:any[] = 
		[			
			{	"k" : "nid",	"c" : 1,	"t" : "slong",},
		]

}
export class GS_PvPOut  {
	protoList:any[] = 
		[
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
export class GS_PvPRankConfig_MatchTime  {			
	nstarttime : number;			
	ntotaltime : number;
	protoList:any[] = 
		[			
			{	"k" : "nstarttime",	"c" : 1,	"t" : "slong",},			
			{	"k" : "ntotaltime",	"c" : 1,	"t" : "slong",},
		]

}
export class GS_PvPInviteResponse  {			
	bttype : number;			
	nactordbid : number;
	protoList:any[] = 
		[			
			{	"k" : "bttype",	"c" : 1,	"t" : "uchar",},			
			{	"k" : "nactordbid",	"c" : 1,	"t" : "sint64",},
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
			{	"ck" : "urefmonstercount",	"k" : "data1",	"c" : 0,	"s" : "urefmonstersize",	"t" : "GS_PvPMap_RefMonster",},			
			{	"ck" : "urefscenethingcount",	"k" : "data2",	"c" : 0,	"s" : "urefscenethingsize",	"t" : "GS_PvPMap_RefSceneThing",},
		]

}
 

 