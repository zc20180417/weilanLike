export enum GS_PLAZA_BOUNTYCOOPERATION_MSG
{	
	PLAZA_BOUNTYCOOPERATION_CONFIG			= 0,	// 配置													s->c
	PLAZA_BOUNTYCOOPERATION_PRIVATE			= 1,	// 个人数据												s->c
	PLAZA_BOUNTYCOOPERATION_SETTROOPS		= 2,	// 修改竞技猫咪设置										c->s
	PLAZA_BOUNTYCOOPERATION_RETSETTROOPS	= 3,	// 确认修改竞技猫咪设置									s->c
		  
	PLAZA_BOUNTYCOOPERATION_UPDAYPLAYCOUNT	= 4,	// 更新进入参与次数										s->c	
	PLAZA_BOUNTYCOOPERATION_INVITE			= 5,	// 发起或取消邀请										c->s	
	PLAZA_BOUNTYCOOPERATION_INVITESTATE		= 6,	// 邀请状态通知											s->c	
	PLAZA_BOUNTYCOOPERATION_INVITERESPONSE	= 7,	// 同意或拒绝邀请										c->s
	PLAZA_BOUNTYCOOPERATION_INVITECLEAR		= 8,	// 清空某个用户对我发起的状态							s->c

	PLAZA_BOUNTYCOOPERATION_JOIN			= 9,	// 申请匹配												c->s	
	PLAZA_BOUNTYCOOPERATION_WAIT			= 10,	// 等待撮合开始											s->c
	PLAZA_BOUNTYCOOPERATION_OUTMATCH		= 11,	// 退出匹配												c->s
	PLAZA_BOUNTYCOOPERATION_OUTMATCHFINISH	= 12,	// 退出匹配成功											s->c
	

	PLAZA_BOUNTYCOOPERATION_RANKING			= 13,	// 排行榜												s->c
	PLAZA_BOUNTYCOOPERATION_UPRANKING		= 14,	// 更新排行榜单个个人数据								s->c	
	PLAZA_BOUNTYCOOPERATION_BUYBUFF			= 15,	// 购买BUFF												c->s
	PLAZA_BOUNTYCOOPERATION_BUFFERORDER		= 16,	// 购买BUFF订单下发										s->c
	PLAZA_BOUNTYCOOPERATION_FINISHBUFF		= 17,	// 完成购买BUFF											s->c
	PLAZA_BOUNTYCOOPERATION_GETREWARD		= 18,	// 领取奖励												c->s	

	PLAZA_BOUNTYCOOPERATION_GAMEERROR		= 19,	// 游戏异常结束											s->c
	PLAZA_BOUNTYCOOPERATION_MAX
}
export class GS_BountyCooperationHead  {
	protoList:any[] = 
		[
		]

}
export class GS_BountyCooperationInviteResponse  {			
	bttype : number;			
	nactordbid : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "uchar",	"k" : "bttype",},			
			{	"c" : 1,	"t" : "sint64",	"k" : "nactordbid",},
		]

}
export class GS_BountyCooperationWait  {
	protoList:any[] = 
		[
		]

}
export class GS_BountyCooperationGameError  {
	protoList:any[] = 
		[
		]

}
export class GS_BountyCooperationOutMatchFinish  {
	protoList:any[] = 
		[
		]

}
export class GS_BountyCooperationFinishBuff  {			
	naddper : number;			
	ndaybuffcount : number;			
	nbuffper : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "slong",	"k" : "naddper",},			
			{	"c" : 1,	"t" : "slong",	"k" : "ndaybuffcount",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nbuffper",},
		]

}
export class GS_BountyCooperationJoin  {
	protoList:any[] = 
		[
		]

}
export class GS_BountyCooperationSetTroops  {			
	ntroopsids : number[];
	protoList:any[] = 
		[			
			{	"c" : 9,	"t" : "slong",	"k" : "ntroopsids",},
		]

}
export class GS_BountyCooperationPrivate  {			
	ntroopsids : number[];			
	btstate : number;			
	ndaybuffcount : number;			
	nhistorylayer : number;			
	nbuffper : number;			
	nlastrewardtimes : number;
	protoList:any[] = 
		[			
			{	"c" : 9,	"t" : "slong",	"k" : "ntroopsids",},			
			{	"c" : 1,	"t" : "uchar",	"k" : "btstate",},			
			{	"c" : 1,	"t" : "slong",	"k" : "ndaybuffcount",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nhistorylayer",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nbuffper",},			
			{	"c" : 1,	"t" : "sint64",	"k" : "nlastrewardtimes",},
		]

}
export class GS_BountyCooperationUpRanking  {			
	uranking : number;			
	nactordbid : number;			
	szname : string;			
	szmd5face : string;			
	nfaceid : number;			
	nfaceframeid : number;			
	btsex : number;			
	ulayer : number;			
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
			{	"c" : 1,	"t" : "ushort",	"k" : "ulayer",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nusetime",},
		]

}
export class GS_BountyCooperationInvite  {			
	bttype : number;			
	nactordbid : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "uchar",	"k" : "bttype",},			
			{	"c" : 1,	"t" : "sint64",	"k" : "nactordbid",},
		]

}
export class GS_BountyCooperationBuffOrder  {			
	nrid : number;			
	szorder : string;			
	nsdkid : number;			
	szsdkkey : string;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "slong",	"k" : "nrid",},			
			{	"c" : 32,	"t" : "stchar",	"k" : "szorder",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nsdkid",},			
			{	"c" : 32,	"t" : "char",	"k" : "szsdkkey",},
		]

}
export class GS_BountyCooperationRanking_RankingItem  {			
	uranking : number;			
	nactordbid : number;			
	szname : string;			
	szmd5face : string;			
	nfaceid : number;			
	nfaceframeid : number;			
	btsex : number;			
	ulayer : number;			
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
			{	"c" : 1,	"t" : "ushort",	"k" : "ulayer",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nusetime",},
		]

}
export class GS_BountyCooperationUpDayPlayCount  {			
	ndaybuffcount : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "slong",	"k" : "ndaybuffcount",},
		]

}
export class GS_BountyCooperationConfig_RewardItem  {			
	ulayer : number;			
	ngoodsid : number[];			
	ngoodsnum : number[];
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "ushort",	"k" : "ulayer",},			
			{	"c" : 3,	"t" : "slong",	"k" : "ngoodsid",},			
			{	"c" : 3,	"t" : "slong",	"k" : "ngoodsnum",},
		]

}
export class GS_BountyCooperationInviteClear  {			
	nactordbid : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "sint64",	"k" : "nactordbid",},
		]

}
export class GS_BountyCooperationBuyBuff  {
	protoList:any[] = 
		[
		]

}
export class GS_BountyCooperationGetReward  {
	protoList:any[] = 
		[
		]

}
export class GS_BountyCooperationInviteState  {			
	btstate : number;			
	ntimer : number;			
	nmasterdbid : number;			
	nactordbid : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "uchar",	"k" : "btstate",},			
			{	"c" : 1,	"t" : "sint64",	"k" : "ntimer",},			
			{	"c" : 1,	"t" : "sint64",	"k" : "nmasterdbid",},			
			{	"c" : 1,	"t" : "sint64",	"k" : "nactordbid",},
		]

}
export class GS_BountyCooperationOutMatch  {
	protoList:any[] = 
		[
		]

}
export class GS_BountyCooperationRanking  {			
	uitemcount : number;			
	uitemsize : number;			
	rankings : GS_BountyCooperationRanking_RankingItem[];
	rankingsClass : any = GS_BountyCooperationRanking_RankingItem;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "ushort",	"k" : "uitemcount",},			
			{	"c" : 1,	"t" : "ushort",	"k" : "uitemsize",},			
			{	"ck" : "uitemcount",	"c" : 0,	"t" : "GS_BountyCooperationRanking_RankingItem",	"s" : "uitemsize",	"k" : "rankings",},
		]

}
export class GS_BountyCooperationConfig_RankingItem  {			
	nminranking : number;			
	nmaxranking : number;			
	ngoodsnums : number[];
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "slong",	"k" : "nminranking",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nmaxranking",},			
			{	"c" : 4,	"t" : "slong",	"k" : "ngoodsnums",},
		]

}
export class GS_BountyCooperationConfig  {			
	ubasecount : number;			
	ubasesize : number;			
	urewarditemcount : number;			
	urewarditemsize : number;			
	urankingitemcount : number;			
	urankingitemsize : number;			
	data1 : GS_BountyCooperationConfig_Base[];
	data1Class : any = GS_BountyCooperationConfig_Base;			
	data2 : GS_BountyCooperationConfig_RewardItem[];
	data2Class : any = GS_BountyCooperationConfig_RewardItem;			
	data3 : GS_BountyCooperationConfig_RankingItem[];
	data3Class : any = GS_BountyCooperationConfig_RankingItem;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "ushort",	"k" : "ubasecount",},			
			{	"c" : 1,	"t" : "ushort",	"k" : "ubasesize",},			
			{	"c" : 1,	"t" : "ushort",	"k" : "urewarditemcount",},			
			{	"c" : 1,	"t" : "ushort",	"k" : "urewarditemsize",},			
			{	"c" : 1,	"t" : "ushort",	"k" : "urankingitemcount",},			
			{	"c" : 1,	"t" : "ushort",	"k" : "urankingitemsize",},			
			{	"ck" : "ubasecount",	"c" : 0,	"t" : "GS_BountyCooperationConfig_Base",	"k" : "data1",	"s" : "ubasesize",},			
			{	"ck" : "urewarditemcount",	"c" : 0,	"t" : "GS_BountyCooperationConfig_RewardItem",	"k" : "data2",	"s" : "urewarditemsize",},			
			{	"ck" : "urankingitemcount",	"c" : 0,	"t" : "GS_BountyCooperationConfig_RankingItem",	"k" : "data3",	"s" : "urankingitemsize",},
		]

}
export class GS_BountyCooperationRetSetTroops  {			
	ntroopsids : number[];
	protoList:any[] = 
		[			
			{	"c" : 9,	"t" : "slong",	"k" : "ntroopsids",},
		]

}
export class GS_BountyCooperationConfig_Base  {			
	btisopen : number;			
	ninvitewaittimes : number;			
	ninvitesettimes : number;			
	nopenwarid : number;			
	ninvitegoodsid : number;			
	btdaybuffcount : number;			
	btbufffv : number;			
	nbuffdiamonds : number;			
	nstartdaytimes : number;			
	nenddaytimes : number;			
	ngoodsids : number[];
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "uchar",	"k" : "btisopen",},			
			{	"c" : 1,	"t" : "slong",	"k" : "ninvitewaittimes",},			
			{	"c" : 1,	"t" : "slong",	"k" : "ninvitesettimes",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nopenwarid",},			
			{	"c" : 1,	"t" : "slong",	"k" : "ninvitegoodsid",},			
			{	"c" : 1,	"t" : "uchar",	"k" : "btdaybuffcount",},			
			{	"c" : 1,	"t" : "uchar",	"k" : "btbufffv",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nbuffdiamonds",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nstartdaytimes",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nenddaytimes",},			
			{	"c" : 4,	"t" : "slong",	"k" : "ngoodsids",},
		]

}
 

 