export enum GS_PLAZA_LUCKDRAW_MSG
{	
	PLAZA_LUCKDRAW_INFO							= 0,		//配置								s->c
	PLAZA_LUCKDRAW_PRIVATE						= 1,		//个人数据							s->c
	PLAZA_LUCKDRAW_JOIN							= 2,		//进行抽取							c->s
	PLAZA_LUCKDRAW_RET							= 3,		//返回抽取结果						s->c
	PLAZA_LUCKDRAW_CLEAR						= 4,		//跨天清理已抽取次数				s->c
	PLAZA_LUCKDRAW_MAX
}
export class GS_LuckDrawHead  {
	protoList:any[] = 
		[
		]

}
export class GS_LuckDrawClear  {
	protoList:any[] = 
		[
		]

}
export class GS_LuckDrawPrivate  {			
	uitemsize : number;			
	uitemcount : number;			
	items : GS_LuckDrawPrivate_Item[];
	itemsClass : any = GS_LuckDrawPrivate_Item;
	protoList:any[] = 
		[			
			{	"k" : "uitemsize",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "uitemcount",	"c" : 1,	"t" : "ushort",},			
			{	"c" : 0,	"t" : "GS_LuckDrawPrivate_Item",	"ck" : "uitemcount",	"s" : "uitemsize",	"k" : "items",},
		]

}
export class GS_LuckDrawRet_Item  {			
	ngoodsid : number;			
	ngoodsnum : number;
	protoList:any[] = 
		[			
			{	"k" : "ngoodsid",	"c" : 1,	"t" : "slong",},			
			{	"k" : "ngoodsnum",	"c" : 1,	"t" : "slong",},
		]

}
export class GS_LuckDrawPrivate_Item  {			
	nid : number;			
	ndayplaycount : number;
	protoList:any[] = 
		[			
			{	"k" : "nid",	"c" : 1,	"t" : "slong",},			
			{	"k" : "ndayplaycount",	"c" : 1,	"t" : "slong",},
		]

}
export class GS_LuckDrawInfo_Item  {			
	nid : number;			
	nbackpicid : number;			
	nneedgoodsid : number;			
	nonenum : number;			
	nonediamonds : number;			
	ntennum : number;			
	ntendiamonds : number;			
	ndaymaxcount : number;			
	sztitle : string;
	protoList:any[] = 
		[			
			{	"k" : "nid",	"c" : 1,	"t" : "slong",},			
			{	"k" : "nbackpicid",	"c" : 1,	"t" : "sint64",},			
			{	"k" : "nneedgoodsid",	"c" : 1,	"t" : "slong",},			
			{	"k" : "nonenum",	"c" : 1,	"t" : "slong",},			
			{	"k" : "nonediamonds",	"c" : 1,	"t" : "slong",},			
			{	"k" : "ntennum",	"c" : 1,	"t" : "slong",},			
			{	"k" : "ntendiamonds",	"c" : 1,	"t" : "slong",},			
			{	"k" : "ndaymaxcount",	"c" : 1,	"t" : "slong",},			
			{	"k" : "sztitle",	"c" : 128,	"t" : "stchar",},
		]

}
export class GS_LuckDrawJoin  {			
	nid : number;			
	bttype : number;
	protoList:any[] = 
		[			
			{	"k" : "nid",	"c" : 1,	"t" : "slong",},			
			{	"k" : "bttype",	"c" : 1,	"t" : "uchar",},
		]

}
export class GS_LuckDrawInfo  {			
	uitemsize : number;			
	uitemcount : number;			
	items : GS_LuckDrawInfo_Item[];
	itemsClass : any = GS_LuckDrawInfo_Item;
	protoList:any[] = 
		[			
			{	"k" : "uitemsize",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "uitemcount",	"c" : 1,	"t" : "ushort",},			
			{	"c" : 0,	"t" : "GS_LuckDrawInfo_Item",	"ck" : "uitemcount",	"s" : "uitemsize",	"k" : "items",},
		]

}
export class GS_LuckDrawRet  {			
	nid : number;			
	ndayplaycount : number;			
	uaddcount : number;			
	uclearcount : number;			
	uitemsize : number;			
	uitemcount : number;			
	items : GS_LuckDrawRet_Item[];
	itemsClass : any = GS_LuckDrawRet_Item;
	protoList:any[] = 
		[			
			{	"k" : "nid",	"c" : 1,	"t" : "slong",},			
			{	"k" : "ndayplaycount",	"c" : 1,	"t" : "slong",},			
			{	"k" : "uaddcount",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "uclearcount",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "uitemsize",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "uitemcount",	"c" : 1,	"t" : "ushort",},			
			{	"c" : 0,	"t" : "GS_LuckDrawRet_Item",	"ck" : "uitemcount",	"s" : "uitemsize",	"k" : "items",},
		]

}
 

 