export enum GS_PLAZA_LARGETURNTABLE_MSG
{	
	PLAZA_LARGETURNTABLE_INFO						= 0,		//配置						s->c
	PLAZA_LARGETURNTABLE_JOIN						= 1,		//抽奖						c->s
	PLAZA_LARGETURNTABLE_FINISH						= 2,		//通知结果					s->c	(奖励通过公共的奖励接口下发,如果是实物奖励客户端弹出填写资料面板）
	PLAZA_LARGETURNTABLE_WRITEINFO					= 3,		//递交资料					c->s
	PLAZA_LARGETURNTABLE_EXCHANGE					= 4,		//实物兑换成功				s->c
	PLAZA_LARGETURNTABLE_MAX
}
export class GS_LargeTurntableHead  {
	protoList:any[] = 
		[
		]

}
export class GS_LargeTurnTableJoin  {
	protoList:any[] = 
		[
		]

}
export class GS_LargeTurnTableExchange  {			
	nid : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "slong",	"k" : "nid",},
		]

}
export class GS_LargeTurntableInfo_RewardItem  {			
	nid : number;			
	bttype : number;			
	npicid : number;			
	nshowgoodsid : number;			
	nshowgoodsnum : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "slong",	"k" : "nid",},			
			{	"c" : 1,	"t" : "uchar",	"k" : "bttype",},			
			{	"c" : 1,	"t" : "slong",	"k" : "npicid",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nshowgoodsid",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nshowgoodsnum",},
		]

}
export class GS_LargeTurnTableWriteInfo  {			
	nareacode : number;			
	szaddressee : string;			
	szphone : string;			
	szaddr : string;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "sint64",	"k" : "nareacode",},			
			{	"c" : 64,	"t" : "stchar",	"k" : "szaddressee",},			
			{	"c" : 24,	"t" : "stchar",	"k" : "szphone",},			
			{	"c" : 128,	"t" : "stchar",	"k" : "szaddr",},
		]

}
export class GS_LargeTurnTableFinish  {			
	nid : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "slong",	"k" : "nid",},
		]

}
export class GS_LargeTurntableInfo  {			
	ngoodsid : number;			
	ngoodsnum : number;			
	uitemsize : number;			
	uitemcount : number;			
	infolist : GS_LargeTurntableInfo_RewardItem[];
	infolistClass : any = GS_LargeTurntableInfo_RewardItem;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "slong",	"k" : "ngoodsid",},			
			{	"c" : 1,	"t" : "slong",	"k" : "ngoodsnum",},			
			{	"c" : 1,	"t" : "ushort",	"k" : "uitemsize",},			
			{	"c" : 1,	"t" : "ushort",	"k" : "uitemcount",},			
			{	"t" : "GS_LargeTurntableInfo_RewardItem",	"ck" : "uitemcount",	"c" : 0,	"s" : "uitemsize",	"k" : "infolist",},
		]

}
 

 