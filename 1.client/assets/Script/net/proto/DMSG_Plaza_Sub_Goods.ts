export enum GS_PLAZA_GOODS_MSG
{	
	PLAZA_GOODS_GETINFO		= 0,	// 获得物品配置信息			c->s	
	PLAZA_GOODS_INFORETURN	= 1,	// 物品配置信息返回			s->c
	PLAZA_GOODS_GOODIDLIST	= 2,	// 物品ID列表信息			s->c(主动下发)
	PLAZA_GOODS_DROPBOXINFO	= 3,	// 掉落盒配置下发			s->c
	PLAZA_GOODS_USEBOX		= 4,	// 使用宝箱					c->s
	PLAZA_GOODS_DROPBOXDATA	= 5,	// 掉落宝箱的私有数据		s->c
	PLAZA_GOODS_UPDROPBOX	= 6,	// 更新单个掉落宝箱的数据	s->c
	PLAZA_GOODS_USECARDBAG	= 7,	// 使用自选卡包				c->s
	PLAZA_GOODS_MAX
}
export class GS_GoodsHead  {
	protoList:any[] = 
		[
		]

}
export class GS_GoodIDList  {			
	uclientcount : number;			
	uservergoodscount : number;			
	goodsid : number[];
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"k" : "uclientcount",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uservergoodscount",	"c" : 1,},			
			{	"t" : "slong",	"k" : "goodsid",	"c" : 0,},
		]

}
export class GS_GoodsDropBoxData  {			
	uitemcount : number;			
	uitemsize : number;			
	items : GS_GoodsDropBoxData_DropBoxItem[];
	itemsClass : any = GS_GoodsDropBoxData_DropBoxItem;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"k" : "uitemcount",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uitemsize",	"c" : 1,},			
			{	"ck" : "uitemcount",	"t" : "GS_GoodsDropBoxData_DropBoxItem",	"s" : "uitemsize",	"k" : "items",	"c" : 0,},
		]

}
export class GS_GoodsDropBoxData_DropBoxItem  {			
	nid : number;			
	ncount : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ncount",	"c" : 1,},
		]

}
export class GS_GoodsDropBoxInfo_DropBoxItem  {			
	ndropboxid : number;			
	ucount : number;			
	usecuritycount : number;			
	nsecuritydropboxid : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "ndropboxid",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "ucount",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "usecuritycount",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nsecuritydropboxid",	"c" : 1,},
		]

}
export class GS_GoodsInfoReturn  {			
	btcount : number;			
	uitemsize : number;			
	goodsconfigs : GS_GoodsInfoReturn_GoodsInfo[];
	goodsconfigsClass : any = GS_GoodsInfoReturn_GoodsInfo;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"k" : "btcount",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uitemsize",	"c" : 1,},			
			{	"ck" : "btcount",	"t" : "GS_GoodsInfoReturn_GoodsInfo",	"s" : "uitemsize",	"k" : "goodsconfigs",	"c" : 0,},
		]

}
export class GS_GoodsDropBoxInfo_DropBoxGoodsItem  {			
	udropgoodstype : number;			
	ndropmincount : number;			
	ndropmaxcount : number;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"k" : "udropgoodstype",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ndropmincount",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ndropmaxcount",	"c" : 1,},
		]

}
export class GS_GoodsUseCardBag  {			
	nusegoodsid : number;			
	btselindex : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nusegoodsid",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btselindex",	"c" : 1,},
		]

}
export class GS_GoodsInfoReturn_GoodsInfo  {			
	lgoodsid : number;			
	npacketpicid : number;			
	naniid : number;			
	lgoodstype : number;			
	btquality : number;			
	szgoodsname : string;			
	sztips : string;			
	lparam : number[];
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "lgoodsid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "npacketpicid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "naniid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "lgoodstype",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btquality",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szgoodsname",	"c" : 32,},			
			{	"t" : "stchar",	"k" : "sztips",	"c" : 128,},			
			{	"t" : "slong",	"k" : "lparam",	"c" : 8,},
		]

}
export class GS_GoodsUseBox  {			
	ngoodsid : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "ngoodsid",	"c" : 1,},
		]

}
export class GS_GetGoodsInfo  {			
	btcount : number;			
	lgoodsidlist : number[];
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"k" : "btcount",	"c" : 1,},			
			{	"t" : "slong",	"k" : "lgoodsidlist",	"c" : 0,},
		]

}
export class GS_GoodsDropBoxInfo  {			
	udropboxitemcount : number;			
	udropboxgoodsitemcount : number;			
	udropboxitemsize : number;			
	udropboxgoodsitemsize : number;			
	data1 : GS_GoodsDropBoxInfo_DropBoxItem[];
	data1Class : any = GS_GoodsDropBoxInfo_DropBoxItem;			
	data2 : GS_GoodsDropBoxInfo_DropBoxGoodsItem[];
	data2Class : any = GS_GoodsDropBoxInfo_DropBoxGoodsItem;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"k" : "udropboxitemcount",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "udropboxgoodsitemcount",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "udropboxitemsize",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "udropboxgoodsitemsize",	"c" : 1,},			
			{	"ck" : "udropboxitemcount",	"t" : "GS_GoodsDropBoxInfo_DropBoxItem",	"c" : 0,	"k" : "data1",	"s" : "udropboxitemsize",},			
			{	"ck" : "udropboxgoodsitemcount",	"t" : "GS_GoodsDropBoxInfo_DropBoxGoodsItem",	"c" : 0,	"k" : "data2",	"s" : "udropboxgoodsitemsize",},
		]

}
export class GS_GoodsUpDropBox  {			
	nid : number;			
	ncount : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ncount",	"c" : 1,},
		]

}
 

 