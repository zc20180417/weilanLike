export enum GS_PLAZA_ZEROMALL_MSG
{	
	PLAZA_ZEROMALL_CONFIG		= 0,	// 配置						s->c	
	PLAZA_ZEROMALL_PRIVATE		= 1,	// 个人数据					s->c
	PLAZA_ZEROMALL_BUY			= 2,	// 购买激活					c->s
	PLAZA_ZEROMALL_GETREWARD	= 3,	// 领取奖励					c->s
	PLAZA_ZEROMALL_CLOSE		= 4,	// 通知关闭					s->c
	PLAZA_ZEROMALL_MAX
}
export class GS_ZeroMallHead  {
	protoList:any[] = 
		[
		]

}
export class GS_ZeroMallBuy  {
	protoList:any[] = 
		[
		]

}
export class GS_ZeroMallPrivate  {			
	btactive : number;			
	uflag : number;			
	nlogincount : number;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"k" : "btactive",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uflag",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nlogincount",	"c" : 1,},
		]

}
export class GS_ZeroMallClose  {
	protoList:any[] = 
		[
		]

}
export class GS_ZeroMallConfig_RewardGoods  {			
	ngoodsid : number;			
	ngoodsnum : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "ngoodsid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsnum",	"c" : 1,},
		]

}
export class GS_ZeroMallConfig_RewardItem  {			
	nloginday : number;			
	btgoodscount : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nloginday",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btgoodscount",	"c" : 1,},
		]

}
export class GS_ZeroMallConfig  {			
	ndiamonds : number;			
	nopenwarid : number;			
	nclosetimes : number;			
	urewaritemcount : number;			
	urewardgoodscount : number;			
	urewarditemsize : number;			
	urewardgoodssize : number;			
	data1 : GS_ZeroMallConfig_RewardItem[];
	data1Class : any = GS_ZeroMallConfig_RewardItem;			
	data2 : GS_ZeroMallConfig_RewardGoods[];
	data2Class : any = GS_ZeroMallConfig_RewardGoods;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "ndiamonds",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nopenwarid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nclosetimes",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "urewaritemcount",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "urewardgoodscount",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "urewarditemsize",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "urewardgoodssize",	"c" : 1,},			
			{	"t" : "GS_ZeroMallConfig_RewardItem",	"ck" : "urewaritemcount",	"c" : 0,	"k" : "data1",	"s" : "urewarditemsize",},			
			{	"t" : "GS_ZeroMallConfig_RewardGoods",	"ck" : "urewardgoodscount",	"c" : 0,	"k" : "data2",	"s" : "urewardgoodssize",},
		]

}
export class GS_ZeroMallGetReward  {			
	btindex : number;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"k" : "btindex",	"c" : 1,},
		]

}
 

 