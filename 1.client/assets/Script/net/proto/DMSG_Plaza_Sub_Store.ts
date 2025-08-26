export enum GS_PLAZA_STORE_MSG
{	
	PLAZA_STORE_INFO			= 0,		//配置								s->c
	PLAZA_STORE_PRIVATE			= 1,		//个人数据							s->c
	PLAZA_STORE_FREEREF			= 2,		//免费刷新(成功会重发个人数据)		c->s
	PLAZA_STORE_FREEVIDEOREF	= 3,		//视频刷新(视频成功会重发个人数据）	c->s
	PLAZA_STORE_FREEVIDEOORDER	= 4,		//视频刷新订单下发					s->c
	PLAZA_STORE_BUY				= 5,		//购买物品							c->s
	PLAZA_STORE_BUYRET			= 6,		//购买返回							s->c
	PLAZA_STORE_TIMEREF			= 7,		//客户端通知服务器时间到了刷新		c->s
	PLAZA_STORE_UPPRIVATE		= 8,		//更新单个个人数据					s->c
	PLAZA_STORE_MAX
}
export class GS_StoreHead  {
	protoList:any[] = 
		[
		]

}
export class GS_StoreBuy  {			
	bttype : number;			
	btindex : number;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"c" : 1,	"k" : "bttype",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btindex",},
		]

}
export class GS_StorePrivate_StoreData  {			
	bttype : number;			
	nlastreftime : number;			
	nfreerefcount : number;			
	nfreevideorefcont : number;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"c" : 1,	"k" : "bttype",},			
			{	"t" : "sint64",	"c" : 1,	"k" : "nlastreftime",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "nfreerefcount",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "nfreevideorefcont",},
		]

}
export class GS_StorePrivate  {			
	utagcount : number;			
	ugoodscount : number;			
	utagstructsize : number;			
	ugoodsstructsize : number;			
	data1 : GS_StorePrivate_StoreData[];
	data1Class : any = GS_StorePrivate_StoreData;			
	data2 : GS_StorePrivate_GoodsData[];
	data2Class : any = GS_StorePrivate_GoodsData;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"c" : 1,	"k" : "utagcount",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "ugoodscount",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "utagstructsize",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "ugoodsstructsize",},			
			{	"ck" : "utagcount",	"t" : "GS_StorePrivate_StoreData",	"c" : 0,	"k" : "data1",	"s" : "utagstructsize",},			
			{	"ck" : "ugoodscount",	"t" : "GS_StorePrivate_GoodsData",	"c" : 0,	"k" : "data2",	"s" : "ugoodsstructsize",},
		]

}
export class GS_StoreUpPrivate  {			
	bttype : number;			
	nlastreftime : number;			
	nfreerefcount : number;			
	nfreevideorefcont : number;			
	ugoodscount : number;			
	ugoodsstructsize : number;			
	goodsdatalist : GS_StoreUpPrivate_GoodsData[];
	goodsdatalistClass : any = GS_StoreUpPrivate_GoodsData;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"c" : 1,	"k" : "bttype",},			
			{	"t" : "sint64",	"c" : 1,	"k" : "nlastreftime",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "nfreerefcount",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "nfreevideorefcont",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "ugoodscount",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "ugoodsstructsize",},			
			{	"ck" : "ugoodscount",	"t" : "GS_StoreUpPrivate_GoodsData",	"c" : 0,	"s" : "ugoodsstructsize",	"k" : "goodsdatalist",},
		]

}
export class GS_StoreTimeRef  {			
	bttype : number;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"c" : 1,	"k" : "bttype",},
		]

}
export class GS_StoreFreeRef  {			
	bttype : number;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"c" : 1,	"k" : "bttype",},
		]

}
export class GS_StoreInfo_ConfigItem  {			
	bttype : number;			
	nfreecount : number;			
	nfreevideocount : number;			
	nautoreftimes : number;			
	nopenwarid : number;			
	nrefdiamonds : number;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"c" : 1,	"k" : "bttype",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nfreecount",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nfreevideocount",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nautoreftimes",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nopenwarid",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nrefdiamonds",},
		]

}
export class GS_StoreUpPrivate_GoodsData  {			
	bttype : number;			
	btindex : number;			
	ngoodsid : number;			
	npoint : number;			
	btstate : number;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"c" : 1,	"k" : "bttype",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btindex",},			
			{	"t" : "slong",	"c" : 1,	"k" : "ngoodsid",},			
			{	"t" : "slong",	"c" : 1,	"k" : "npoint",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btstate",},
		]

}
export class GS_StoreFreeVideoRef  {			
	bttype : number;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"c" : 1,	"k" : "bttype",},
		]

}
export class GS_StoreFreeVideoRet  {			
	szorder : string;			
	nsdkid : number;			
	szsdkkey : string;
	protoList:any[] = 
		[			
			{	"t" : "stchar",	"c" : 32,	"k" : "szorder",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nsdkid",},			
			{	"t" : "char",	"c" : 32,	"k" : "szsdkkey",},
		]

}
export class GS_StorePrivate_GoodsData  {			
	bttype : number;			
	btindex : number;			
	ngoodsid : number;			
	npoint : number;			
	btstate : number;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"c" : 1,	"k" : "bttype",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btindex",},			
			{	"t" : "slong",	"c" : 1,	"k" : "ngoodsid",},			
			{	"t" : "slong",	"c" : 1,	"k" : "npoint",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btstate",},
		]

}
export class GS_StoreBuyRet  {			
	bttype : number;			
	btindex : number;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"c" : 1,	"k" : "bttype",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btindex",},
		]

}
export class GS_StoreInfo  {			
	uitemsize : number;			
	uitemcount : number;			
	goodsdatalist : GS_StoreInfo_ConfigItem[];
	goodsdatalistClass : any = GS_StoreInfo_ConfigItem;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"c" : 1,	"k" : "uitemsize",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "uitemcount",},			
			{	"ck" : "uitemcount",	"t" : "GS_StoreInfo_ConfigItem",	"c" : 0,	"s" : "uitemsize",	"k" : "goodsdatalist",},
		]

}
 

 