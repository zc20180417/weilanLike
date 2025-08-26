export enum GS_PLAZA_EMAILL_MSG
{
	PLAZA_EMAIL_VIEW				= 0,			//  浏览邮件				c->s
	PLAZA_EMAIL_VIEWRETURN			= 1,			//	浏览邮件返回			s->c
	PLAZA_EMAIL_VIEWTEXT			= 2,			//	浏览邮件正文			c->s
	PLAZA_EMAIL_VIEWTEXTRETURN		= 3,			//	浏览正文返回			s->c
	PLAZA_EMAIL_PICK				= 4,			//	提取附件				c->s
	PLAZA_EMAIL_PICKRETURN			= 5,			//	提取附件返回			s->c	
	PLAZA_EMAIL_ADDNEW				= 6,			//	增加一封新邮件			s->c
	PLAZA_EMAIL_DEL					= 7,			//	删除一封邮件			c->s
	PLAZA_EMAIL_DELRET				= 8,			//	删除返回				s->c	
	PLAZA_EMAIL_MAX
}
export class GS_EmailHead  {
	protoList:any[] = 
		[
		]

}
export class GS_EmailNew_NewGoods  {			
	ngoodsid : number;			
	ngoodsnum : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "ngoodsid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsnum",	"c" : 1,},
		]

}
export class GS_EmailViewTextReturn  {			
	nnewemallcount : number;			
	nemailid : number;			
	btstate : number;			
	sztitle : string;			
	nstrength : number;			
	ngoodsitemsize : number;			
	lgoodsitemcount : number;			
	stextlen : number;			
	data1 : GS_EmailViewTextReturn_ViewGoods[];
	data1Class : any = GS_EmailViewTextReturn_ViewGoods;			
	data2 : string;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nnewemallcount",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nemailid",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btstate",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "sztitle",	"c" : 32,},			
			{	"t" : "slong",	"k" : "nstrength",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsitemsize",	"c" : 1,},			
			{	"t" : "slong",	"k" : "lgoodsitemcount",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "stextlen",	"c" : 1,},			
			{	"ck" : "lgoodsitemcount",	"s" : "ngoodsitemsize",	"t" : "GS_EmailViewTextReturn_ViewGoods",	"c" : 0,	"k" : "data1",},			
			{	"t" : "stchar",	"ck" : "stextlen",	"k" : "data2",	"c" : 0,},
		]

}
export class GS_EmailViewReturn  {			
	nnewemallcount : number;			
	uviewcount : number;			
	ugoodscount : number;			
	uviewstructsize : number;			
	ugoodsstructsize : number;			
	data1 : GS_EmailViewReturn_EmailViewItem[];
	data1Class : any = GS_EmailViewReturn_EmailViewItem;			
	data2 : GS_EmailViewReturn_ViewGoodsInfo[];
	data2Class : any = GS_EmailViewReturn_ViewGoodsInfo;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nnewemallcount",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uviewcount",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "ugoodscount",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uviewstructsize",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "ugoodsstructsize",	"c" : 1,},			
			{	"ck" : "uviewcount",	"s" : "uviewstructsize",	"t" : "GS_EmailViewReturn_EmailViewItem",	"c" : 0,	"k" : "data1",},			
			{	"ck" : "ugoodscount",	"s" : "ugoodsstructsize",	"t" : "GS_EmailViewReturn_ViewGoodsInfo",	"c" : 0,	"k" : "data2",},
		]

}
export class GS_EmailPickReturn_PickGoods  {			
	ngoodsid : number;			
	ngoodsnum : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "ngoodsid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsnum",	"c" : 1,},
		]

}
export class GS_EmailNew  {			
	nemaillid : number;			
	btstate : number;			
	bttype : number;			
	nsendtime : number;			
	sztitle : string;			
	nstrength : number;			
	nitemsize : number;			
	nitemcount : number;			
	goodlist : GS_EmailNew_NewGoods[];
	goodlistClass : any = GS_EmailNew_NewGoods;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"k" : "nemaillid",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btstate",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "bttype",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nsendtime",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "sztitle",	"c" : 32,},			
			{	"t" : "slong",	"k" : "nstrength",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nitemsize",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nitemcount",	"c" : 1,},			
			{	"ck" : "nitemcount",	"c" : 0,	"t" : "GS_EmailNew_NewGoods",	"s" : "nitemsize",	"k" : "goodlist",},
		]

}
export class GS_EmailViewTextReturn_ViewGoods  {			
	ngoodsid : number;			
	ngoodsnum : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "ngoodsid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsnum",	"c" : 1,},
		]

}
export class GS_EmailDelRet  {			
	nemailid : number;			
	bret : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"k" : "nemailid",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "bret",	"c" : 1,},
		]

}
export class GS_EmailViewReturn_EmailViewItem  {			
	nemaillid : number;			
	btstate : number;			
	bttype : number;			
	nsendtime : number;			
	sztitle : string;			
	nstrength : number;			
	btgoodslistcount : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"k" : "nemaillid",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btstate",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "bttype",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nsendtime",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "sztitle",	"c" : 32,},			
			{	"t" : "sint64",	"k" : "nstrength",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btgoodslistcount",	"c" : 1,},
		]

}
export class GS_EmailView  {
	protoList:any[] = 
		[
		]

}
export class GS_EmailDel  {			
	nemailid : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"k" : "nemailid",	"c" : 1,},
		]

}
export class GS_EmailViewReturn_ViewGoodsInfo  {			
	ngoodsid : number;			
	ngoodsnum : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "ngoodsid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsnum",	"c" : 1,},
		]

}
export class GS_EmailPick  {			
	nemailid : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"k" : "nemailid",	"c" : 1,},
		]

}
export class GS_EmailViewText  {			
	nemailid : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"k" : "nemailid",	"c" : 1,},
		]

}
export class GS_EmailPickReturn  {			
	nemailid : number;			
	btstate : number;			
	nstrength : number;			
	ndropboxid : number;			
	nitemsize : number;			
	nitemcount : number;			
	goodlist : GS_EmailPickReturn_PickGoods[];
	goodlistClass : any = GS_EmailPickReturn_PickGoods;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"k" : "nemailid",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btstate",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nstrength",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ndropboxid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nitemsize",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nitemcount",	"c" : 1,},			
			{	"ck" : "nitemcount",	"c" : 0,	"t" : "GS_EmailPickReturn_PickGoods",	"s" : "nitemsize",	"k" : "goodlist",},
		]

}
 

 