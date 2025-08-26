export enum GS_PLAZA_GROWGIFT_MSG
{
	PLAZA_GROWGIFT_INFO					= 0,	//成长礼包配置						s->c
	PLAZA_GROWGIFT_PRIVATE				= 1,	//个人数据							s->c
	PLAZA_GROWGIFT_BUY					= 2,	//购买礼包							c->s
	PLAZA_GROWGIFT_ORDER				= 3,	//购买订单							s->c
	PLAZA_GROWGIFT_GET					= 4,	//领取奖励							c->s
	PLAZA_GROWGIFT_CLOSE				= 5,	//关闭通知							s->c
	PLAZA_GROWGIFT_MAX
}
export class GS_GrowGiftHead  {
	protoList:any[] = 
		[
		]

}
export class GS_GrowGiftInfo_RewardItem  {			
	nwarid : number;			
	ndiamonds : number;			
	ngoodsid : number;			
	ngoodsnum : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nwarid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ndiamonds",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsnum",	"c" : 1,},
		]

}
export class GS_GrowGiftInfo  {			
	nid : number;			
	nrid : number;			
	nrmb : number;			
	ngoodsid : number;			
	ngoodsnums : number;			
	ngivegoodsid : number[];			
	ngivegoodsnum : number[];			
	btbuytype : number;			
	nneedgoodsid : number;			
	nneedgoodsnum : number;			
	uitemsize : number;			
	uitemcount : number;			
	rewardlist : GS_GrowGiftInfo_RewardItem[];
	rewardlistClass : any = GS_GrowGiftInfo_RewardItem;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nrid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nrmb",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsnums",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngivegoodsid",	"c" : 5,},			
			{	"t" : "slong",	"k" : "ngivegoodsnum",	"c" : 5,},			
			{	"t" : "uchar",	"k" : "btbuytype",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nneedgoodsid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nneedgoodsnum",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uitemsize",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uitemcount",	"c" : 1,},			
			{	"t" : "GS_GrowGiftInfo_RewardItem",	"c" : 0,	"k" : "rewardlist",	"s" : "uitemsize",	"ck" : "uitemcount",},
		]

}
export class GS_GrowGiftClose  {
	protoList:any[] = 
		[
		]

}
export class GS_GrowGiftBuy  {
	protoList:any[] = 
		[
		]

}
export class GS_GrowGiftOrder  {			
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
export class GS_GrowGiftPrivate  {			
	btbuy : number;			
	nflag : number;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"k" : "btbuy",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nflag",	"c" : 1,},
		]

}
export class GS_GrowGiftGet  {			
	btindex : number;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"k" : "btindex",	"c" : 1,},
		]

}
 

 