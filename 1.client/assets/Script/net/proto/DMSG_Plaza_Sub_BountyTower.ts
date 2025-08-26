export enum GS_PLAZA_BOUNTYTOWER_MSG
{
	PLAZA_BOUNTYTOWER_CONFIG					= 0,	//赏金配置								s->c
	PLAZA_BOUNTYTOWER_DATA						= 1,	//赏金个人数据							s->c
	PLAZA_BOUNTYTOWER_SETTROOPS					= 2,	//设置猫咪								c->s
	PLAZA_BOUNTYTOWER_SETTROOPSRET				= 3,	//设置猫咪返回							s->c
	PLAZA_BOUNTYTOWER_REQUESTWAR				= 4,	//请求战争								c->s
	PLAZA_BOUNTYTOWER_OPENWAR					= 5,	//开启战争								s->c
	PLAZA_BOUNTYTOWER_REQWIN					= 6,	//请求胜利								c->s
	PLAZA_BOUNTYTOWER_RETREQWIN					= 7,	//请求胜利返回							s->c
	PLAZA_BOUNTYTOWER_REQLOST					= 8,	//请求失败								c->s
	PLAZA_BOUNTYTOWER_RETREQLOST				= 9,	//请求失败返回							s->c
	PLAZA_BOUNTYTOWER_CLOSE						= 10,	//关闭功能								s->c
	PLAZA_BOUNTYTOWER_GETREWARD					= 11,	//领取奖励								c->s	
	PLAZA_BOUNTYTOWER_UPREWARDLAYER				= 12,	//更新领奖层级							s->c
	PLAZA_BOUNTYTOWER_BUYPROP					= 13,	//购买加成属性							c->s
	PLAZA_BOUNTYTOWER_OPENPROP					= 14,	//属性加成开启							s->c
	PLAZA_BOUNTYTOWER_UPLEFTHP					= 15,	//购买属性造成的剩余血量变化更新		s->c
	PLAZA_BOUNTYTOWER_UPLEVEL					= 16,	//点击升级								c->s
	PLAZA_BOUNTYTOWER_NEXTDAY					= 17,	//跨天									s->c
	PLAZA_BOUNTYTOWER_UPLEFTGOLD				= 18,	//购买属性造成金币变化					s->c
	PLAZA_BOUNTYTOWER_MAX
}
export class GS_BountyTowerHead  {
	protoList:any[] = 
		[
		]

}
export class GS_BountyTowerOpenWar_RefMonster  {			
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
			{	"t" : "slong",	"c" : 1,	"k" : "nappeartime",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nspace",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nbloodratio",},			
			{	"t" : "slong",	"c" : 1,	"k" : "npoint1monterboxid",},			
			{	"t" : "slong",	"c" : 1,	"k" : "npoint2monterboxid",},			
			{	"t" : "slong",	"c" : 1,	"k" : "npoint3monterboxid",},			
			{	"t" : "slong",	"c" : 1,	"k" : "npoint4monterboxid",},			
			{	"t" : "slong",	"c" : 1,	"k" : "npoint5monterboxid",},
		]

}
export class GS_BountyTowerNextDay  {
	protoList:any[] = 
		[
		]

}
export class GS_BountyTowerRequestWar  {
	protoList:any[] = 
		[
		]

}
export class GS_BountyTowerSetTroops  {			
	btindex : number;			
	ntroopsid : number;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"c" : 1,	"k" : "btindex",},			
			{	"t" : "slong",	"c" : 1,	"k" : "ntroopsid",},
		]

}
export class GS_BountyTowerOpenProp  {			
	btindex : number;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"c" : 1,	"k" : "btindex",},
		]

}
export class GS_BountyTowerReqLost  {
	protoList:any[] = 
		[
		]

}
export class GS_BountyTowerBuyProp  {			
	btindex : number;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"c" : 1,	"k" : "btindex",},
		]

}
export class GS_BountyTowerRetReqWin  {			
	btlayer : number;			
	ngold : number;			
	nplacetroopsid : number[];			
	btplacetroopslv : number[];			
	btlefthp : number;			
	udayfinishcount : number;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"c" : 1,	"k" : "btlayer",},			
			{	"t" : "slong",	"c" : 1,	"k" : "ngold",},			
			{	"t" : "slong",	"c" : 91,	"k" : "nplacetroopsid",},			
			{	"t" : "uchar",	"c" : 91,	"k" : "btplacetroopslv",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btlefthp",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "udayfinishcount",},
		]

}
export class GS_BountyTowerRetReqLost  {
	protoList:any[] = 
		[
		]

}
export class GS_BountyTowerUpLeftHP  {			
	btlefthp : number;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"c" : 1,	"k" : "btlefthp",},
		]

}
export class GS_BountyTowerData  {			
	btlevel : number;			
	btlayer : number;			
	btlastrewardlayer : number;			
	btopenpropflag : number;			
	nsettroopsid : number[];			
	ngold : number;			
	nplacetroopsid : number[];			
	btplacetroopslv : number[];			
	udayfinishcount : number;			
	btlefthp : number;			
	szname : string;			
	szsceneres : string;			
	szbgpic : string;			
	btpathtype : number;			
	szpathres : string;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"c" : 1,	"k" : "btlevel",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btlayer",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btlastrewardlayer",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btopenpropflag",},			
			{	"t" : "slong",	"c" : 9,	"k" : "nsettroopsid",},			
			{	"t" : "slong",	"c" : 1,	"k" : "ngold",},			
			{	"t" : "slong",	"c" : 91,	"k" : "nplacetroopsid",},			
			{	"t" : "uchar",	"c" : 91,	"k" : "btplacetroopslv",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "udayfinishcount",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btlefthp",},			
			{	"t" : "stchar",	"c" : 32,	"k" : "szname",},			
			{	"t" : "stchar",	"c" : 32,	"k" : "szsceneres",},			
			{	"t" : "stchar",	"c" : 32,	"k" : "szbgpic",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btpathtype",},			
			{	"t" : "stchar",	"c" : 32,	"k" : "szpathres",},
		]

}
export class GS_BountyTowerReqWin  {			
	ngold : number;			
	nplacetroopsid : number[];			
	btplacetroopslv : number[];			
	btlefthp : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"c" : 1,	"k" : "ngold",},			
			{	"t" : "slong",	"c" : 91,	"k" : "nplacetroopsid",},			
			{	"t" : "uchar",	"c" : 91,	"k" : "btplacetroopslv",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btlefthp",},
		]

}
export class GS_BountyTowerUpLeftGold  {			
	nleftgold : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"c" : 1,	"k" : "nleftgold",},
		]

}
export class GS_BountyTowerUpLevel  {
	protoList:any[] = 
		[
		]

}
export class GS_BountyTowerOpenWar  {			
	nloadid : number;			
	szname : string;			
	szsceneres : string;			
	szbgmusic : string;			
	szbgpic : string;			
	btpathtype : number;			
	szpathres : string;			
	nmonsterhpaddper : number;			
	nscenehpaddper : number;			
	btisopenmap : number;			
	nmonstergoldaddper : number;			
	nthinggoldaddper : number;			
	nlimittimes : number;			
	urefmonstercount : number;			
	urefmonstersize : number;			
	data1 : GS_BountyTowerOpenWar_RefMonster[];
	data1Class : any = GS_BountyTowerOpenWar_RefMonster;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"c" : 1,	"k" : "nloadid",},			
			{	"t" : "stchar",	"c" : 32,	"k" : "szname",},			
			{	"t" : "stchar",	"c" : 32,	"k" : "szsceneres",},			
			{	"t" : "stchar",	"c" : 32,	"k" : "szbgmusic",},			
			{	"t" : "stchar",	"c" : 32,	"k" : "szbgpic",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btpathtype",},			
			{	"t" : "stchar",	"c" : 32,	"k" : "szpathres",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nmonsterhpaddper",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nscenehpaddper",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btisopenmap",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nmonstergoldaddper",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nthinggoldaddper",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nlimittimes",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "urefmonstercount",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "urefmonstersize",},			
			{	"t" : "GS_BountyTowerOpenWar_RefMonster",	"c" : 0,	"k" : "data1",	"s" : "urefmonstersize",	"ck" : "urefmonstercount",},
		]

}
export class GS_BountyTowerConfig_Base  {			
	nopenwarid : number;			
	btopendate : number[];			
	naddpropneeddiamonds : number[];			
	naddprops : number[];			
	udayfinishcount : number;			
	btmaxlevel : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"c" : 1,	"k" : "nopenwarid",},			
			{	"t" : "uchar",	"c" : 7,	"k" : "btopendate",},			
			{	"t" : "slong",	"c" : 6,	"k" : "naddpropneeddiamonds",},			
			{	"t" : "slong",	"c" : 6,	"k" : "naddprops",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "udayfinishcount",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btmaxlevel",},
		]

}
export class GS_BountyTowerConfig  {			
	ubasecount : number;			
	ubasesize : number;			
	urewarditemcount : number;			
	urewarditemsize : number;			
	data1 : GS_BountyTowerConfig_Base[];
	data1Class : any = GS_BountyTowerConfig_Base;			
	data2 : GS_BountyTowerConfig_RewardItem[];
	data2Class : any = GS_BountyTowerConfig_RewardItem;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"c" : 1,	"k" : "ubasecount",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "ubasesize",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "urewarditemcount",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "urewarditemsize",},			
			{	"t" : "GS_BountyTowerConfig_Base",	"c" : 0,	"k" : "data1",	"s" : "ubasesize",	"ck" : "ubasecount",},			
			{	"t" : "GS_BountyTowerConfig_RewardItem",	"c" : 0,	"k" : "data2",	"s" : "urewarditemsize",	"ck" : "urewarditemcount",},
		]

}
export class GS_BountyTowerSetTroopsRet  {			
	btindex : number;			
	ntroopsid : number;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"c" : 1,	"k" : "btindex",},			
			{	"t" : "slong",	"c" : 1,	"k" : "ntroopsid",},
		]

}
export class GS_BountyTowerClose  {
	protoList:any[] = 
		[
		]

}
export class GS_BountyTowerGetReward  {
	protoList:any[] = 
		[
		]

}
export class GS_BountyTowerConfig_RewardItem  {			
	btminlevel : number;			
	btmaxlevel : number;			
	uspace : number;			
	ngoodsid : number[];			
	ngoodsnum : number[];
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"c" : 1,	"k" : "btminlevel",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btmaxlevel",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "uspace",},			
			{	"t" : "slong",	"c" : 3,	"k" : "ngoodsid",},			
			{	"t" : "slong",	"c" : 3,	"k" : "ngoodsnum",},
		]

}
export class GS_BountyTowerSUpRewardLayer  {			
	btlastrewardlayer : number;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"c" : 1,	"k" : "btlastrewardlayer",},
		]

}
 

 