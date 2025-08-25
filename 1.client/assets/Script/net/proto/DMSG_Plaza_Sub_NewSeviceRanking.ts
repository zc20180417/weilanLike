export enum GS_PLAZA_NEWSEVICERANKING_MSG
{
	PLAZA_NEWSEVICERANKING_CONFIG					= 0,	//排行榜配置
	PLAZA_NEWSEVICERANKING_GET						= 1,	//客户端请求排行榜数据
	PLAZA_NEWSEVICERANKING_DATA						= 2,	//下发排行榜数据(拿到的数据已经排序)
	PLAZA_NEWSEVICERANKING_MAX
}
export class GS_NewSeviceRankingHead  {
	protoList:any[] = 
		[
		]

}
export class GS_NewSeviceRankingGet  {			
	nid : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"c" : 1,	"k" : "nid",},
		]

}
export class GS_NewSeviceRankingConfig_RewardItem  {			
	nminranking : number;			
	nmaxranking : number;			
	ngoodsnums : number[];
	protoList:any[] = 
		[			
			{	"t" : "slong",	"c" : 1,	"k" : "nminranking",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nmaxranking",},			
			{	"t" : "slong",	"c" : 5,	"k" : "ngoodsnums",},
		]

}
export class GS_NewSeviceRankingConfig  {			
	ubasecount : number;			
	urewardcount : number;			
	ubasesize : number;			
	urewardsize : number;			
	data1 : GS_NewSeviceRankingConfig_Base[];
	data1Class : any = GS_NewSeviceRankingConfig_Base;			
	data2 : GS_NewSeviceRankingConfig_RewardItem[];
	data2Class : any = GS_NewSeviceRankingConfig_RewardItem;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"c" : 1,	"k" : "ubasecount",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "urewardcount",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "ubasesize",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "urewardsize",},			
			{	"t" : "GS_NewSeviceRankingConfig_Base",	"c" : 0,	"k" : "data1",	"s" : "ubasesize",	"ck" : "ubasecount",},			
			{	"t" : "GS_NewSeviceRankingConfig_RewardItem",	"c" : 0,	"k" : "data2",	"s" : "urewardsize",	"ck" : "urewardcount",},
		]

}
export class GS_NewSeviceRankingData  {			
	nid : number;			
	ucount : number;			
	uitemsize : number;			
	data : GS_NewSeviceRankingData_RankingItem[];
	dataClass : any = GS_NewSeviceRankingData_RankingItem;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"c" : 1,	"k" : "nid",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "ucount",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "uitemsize",},			
			{	"t" : "GS_NewSeviceRankingData_RankingItem",	"k" : "data",	"s" : "uitemsize",	"c" : 0,	"ck" : "ucount",},
		]

}
export class GS_NewSeviceRankingData_RankingItem  {			
	nactordbid : number;			
	szname : string;			
	szmd5face : string;			
	nfaceid : number;			
	nfaceframeid : number;			
	btsex : number;			
	nvalue1 : number;			
	nvalue2 : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"c" : 1,	"k" : "nactordbid",},			
			{	"t" : "stchar",	"c" : 32,	"k" : "szname",},			
			{	"t" : "stchar",	"c" : 33,	"k" : "szmd5face",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nfaceid",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nfaceframeid",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btsex",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nvalue1",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nvalue2",},
		]

}
export class GS_NewSeviceRankingConfig_Base  {			
	nid : number;			
	bttype : number;			
	nopendelaytimes : number;			
	nstopdelaytimes : number;			
	nclosedelaytimes : number;			
	nminwarid : number;			
	ngoodsids : number[];			
	btcount : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"c" : 1,	"k" : "nid",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "bttype",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nopendelaytimes",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nstopdelaytimes",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nclosedelaytimes",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nminwarid",},			
			{	"t" : "slong",	"c" : 5,	"k" : "ngoodsids",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btcount",},
		]

}
 

 