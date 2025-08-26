export enum GS_PLAZA_EXCHANGE_MSG
{	
	PLAZA_EXCHANGE_LIST					= 0,			//	�һ��б�				s->c	
	PLAZA_EXCHANGE_BARCODE				= 1,			//	������һ�				c->s	
	PLAZA_EXCHANGE_FRAGMENT				= 2,			//	���߶һ�				c->s	
	PLAZA_EXCHANGE_WCREDPACK			= 3,			//	΢�ź���һ�			c->s
	PLAZA_EXCHANGE_RETWCREDPACK			= 4,			//	΢�ź���һ�����		s->c
	PLAZA_EXCHANGE_TIPS					= 5,			//	�һ�ϵͳ��ʾ��Ϣ		s->c
	PLAZA_EXCHANGE_RETHISTORY			= 6,			//	�һ���ʷ����			s->c
	PLAZA_EXCHANGE_PRIVATE				= 7,			//  �һ���˽������			s->c
	PLAZA_EXCHANGE_FREEVIDEODATA		= 8,			//	���С��Ƶ������		s->c
	PLAZA_EXCHANGE_UPPRIVATE			= 9,			//	���¶һ�����˽������	s->c
	PLAZA_EXCHANGE_CLEARDATA			= 10,			//	��������				s->c
	PLAZA_EXCHANGE_GETFREEVIDEO			= 11,			//	�������С��Ƶ����		c->s
	PLAZA_EXCHANGE_SETFREEVIDEOORDER	= 12,			//	�·����С��Ƶ����		s->c
	PLAZA_EXCHANGE_GOODS				= 13,			//	ʵ��һ�				c->s
	PLAZA_EXCHANGE_GOODS_RETURN			= 14,			//	ʵ��һ�����			s->c
	PLAZA_EXCHANGE_ALIPAY				= 15,			//	֧������Ǯ�һ�			c->s
	PLAZA_EXCHANGE_RETALIPAY			= 16,			//  ֧������Ǯ�һ�����		s->c
	PLAZA_EXCHANGE_MAX
}
export class GS_ExchangeHead  {
	protoList:any[] = 
		[
		]

}
export class GS_ExchangeUpPrivateData  {			
	nrid : number;			
	nallcount : number;			
	ndaycount : number;			
	nweekcount : number;			
	nmonthcount : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"k" : "nrid",	"t" : "slong",},			
			{	"c" : 1,	"k" : "nallcount",	"t" : "sint64",},			
			{	"c" : 1,	"k" : "ndaycount",	"t" : "slong",},			
			{	"c" : 1,	"k" : "nweekcount",	"t" : "slong",},			
			{	"c" : 1,	"k" : "nmonthcount",	"t" : "slong",},
		]

}
export class GS_ExchangeRetHistory_HistoryItem  {			
	nrecordid : number;			
	ntime : number;			
	szgoodsname : string;			
	szorder : string;			
	btstate : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"k" : "nrecordid",	"t" : "slong",},			
			{	"c" : 1,	"k" : "ntime",	"t" : "slong",},			
			{	"c" : 32,	"k" : "szgoodsname",	"t" : "stchar",},			
			{	"c" : 32,	"k" : "szorder",	"t" : "stchar",},			
			{	"c" : 1,	"k" : "btstate",	"t" : "uchar",},
		]

}
export class CS_ExchangeListView  {			
	btstate : number;			
	nitemsize : number;			
	nitemcount : number;			
	goods : CS_ExchangeListView_ExchangeGoods[];
	goodsClass : any = CS_ExchangeListView_ExchangeGoods;
	protoList:any[] = 
		[			
			{	"c" : 1,	"k" : "btstate",	"t" : "uchar",},			
			{	"c" : 1,	"k" : "nitemsize",	"t" : "ushort",},			
			{	"c" : 1,	"k" : "nitemcount",	"t" : "ushort",},			
			{	"s" : "nitemsize",	"c" : 0,	"ck" : "nitemcount",	"k" : "goods",	"t" : "CS_ExchangeListView_ExchangeGoods",},
		]

}
export class GS_ExchangeGetFreeVideo  {
	protoList:any[] = 
		[
		]

}
export class GS_ExchangeRetAliPay  {			
	nrid : number;			
	ntime : number;			
	nrecordid : number;			
	btstate : number;			
	szorder : string;
	protoList:any[] = 
		[			
			{	"c" : 1,	"k" : "nrid",	"t" : "slong",},			
			{	"c" : 1,	"k" : "ntime",	"t" : "slong",},			
			{	"c" : 1,	"k" : "nrecordid",	"t" : "slong",},			
			{	"c" : 1,	"k" : "btstate",	"t" : "uchar",},			
			{	"c" : 32,	"k" : "szorder",	"t" : "stchar",},
		]

}
export class GS_ExchangeGoodsReturn  {			
	nrid : number;			
	ntime : number;			
	nrecordid : number;			
	btstate : number;			
	szorder : string;
	protoList:any[] = 
		[			
			{	"c" : 1,	"k" : "nrid",	"t" : "slong",},			
			{	"c" : 1,	"k" : "ntime",	"t" : "slong",},			
			{	"c" : 1,	"k" : "nrecordid",	"t" : "slong",},			
			{	"c" : 1,	"k" : "btstate",	"t" : "uchar",},			
			{	"c" : 32,	"k" : "szorder",	"t" : "stchar",},
		]

}
export class GS_ExchangeGoods  {			
	nrid : number;			
	nareacode : number;			
	szaddressee : string;			
	szphone : string;			
	szaddr : string;
	protoList:any[] = 
		[			
			{	"c" : 1,	"k" : "nrid",	"t" : "slong",},			
			{	"c" : 1,	"k" : "nareacode",	"t" : "sint64",},			
			{	"c" : 64,	"k" : "szaddressee",	"t" : "stchar",},			
			{	"c" : 24,	"k" : "szphone",	"t" : "stchar",},			
			{	"c" : 128,	"k" : "szaddr",	"t" : "stchar",},
		]

}
export class GS_ExchangeBarCode  {			
	szbarcode : string;
	protoList:any[] = 
		[			
			{	"c" : 32,	"k" : "szbarcode",	"t" : "stchar",},
		]

}
export class GS_ExchangeWCRedPack  {			
	nrid : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"k" : "nrid",	"t" : "slong",},
		]

}
export class GS_ExchangeRetWCRedPack  {			
	nrid : number;			
	ntime : number;			
	nrecordid : number;			
	btstate : number;			
	szorder : string;
	protoList:any[] = 
		[			
			{	"c" : 1,	"k" : "nrid",	"t" : "slong",},			
			{	"c" : 1,	"k" : "ntime",	"t" : "slong",},			
			{	"c" : 1,	"k" : "nrecordid",	"t" : "slong",},			
			{	"c" : 1,	"k" : "btstate",	"t" : "uchar",},			
			{	"c" : 32,	"k" : "szorder",	"t" : "stchar",},
		]

}
export class GS_ExchangePrivateData  {			
	uitemsize : number;			
	nitemcount : number;			
	data : GS_ExchangePrivateData_ExchangeData[];
	dataClass : any = GS_ExchangePrivateData_ExchangeData;
	protoList:any[] = 
		[			
			{	"c" : 1,	"k" : "uitemsize",	"t" : "ushort",},			
			{	"c" : 1,	"k" : "nitemcount",	"t" : "slong",},			
			{	"s" : "uitemsize",	"c" : 0,	"ck" : "nitemcount",	"k" : "data",	"t" : "GS_ExchangePrivateData_ExchangeData",},
		]

}
export class GS_ExchangePrivateData_ExchangeData  {			
	nrid : number;			
	nallcount : number;			
	ndaycount : number;			
	nweekcount : number;			
	nmonthcount : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"k" : "nrid",	"t" : "slong",},			
			{	"c" : 1,	"k" : "nallcount",	"t" : "sint64",},			
			{	"c" : 1,	"k" : "ndaycount",	"t" : "slong",},			
			{	"c" : 1,	"k" : "nweekcount",	"t" : "slong",},			
			{	"c" : 1,	"k" : "nmonthcount",	"t" : "slong",},
		]

}
export class GS_ExchangeSetFreeVideoOrder  {			
	szorder : string;			
	nsdkid : number;			
	szsdkkey : string;
	protoList:any[] = 
		[			
			{	"c" : 32,	"k" : "szorder",	"t" : "stchar",},			
			{	"c" : 1,	"k" : "nsdkid",	"t" : "slong",},			
			{	"c" : 32,	"k" : "szsdkkey",	"t" : "char",},
		]

}
export class GS_ExchangeTips  {			
	sztips : string;
	protoList:any[] = 
		[			
			{	"c" : 0,	"k" : "sztips",	"t" : "stchar",},
		]

}
export class CS_ExchangeListView_ExchangeGoods  {			
	nrid : number;			
	szname : string;			
	nawardtype : number;			
	npicid : number;			
	ngoodsid : number;			
	ngoodsnums : number;			
	utagflag : number;			
	nlimitfreevideosigncount : number;			
	nlimitfrontrid : number;			
	nlimitallcount : number;			
	nlimitdaycount : number;			
	nlimitweekcount : number;			
	nlimitmonthcount : number;			
	nlimitwarid : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"k" : "nrid",	"t" : "slong",},			
			{	"c" : 32,	"k" : "szname",	"t" : "stchar",},			
			{	"c" : 1,	"k" : "nawardtype",	"t" : "slong",},			
			{	"c" : 1,	"k" : "npicid",	"t" : "ulong",},			
			{	"c" : 1,	"k" : "ngoodsid",	"t" : "slong",},			
			{	"c" : 1,	"k" : "ngoodsnums",	"t" : "slong",},			
			{	"c" : 1,	"k" : "utagflag",	"t" : "ulong",},			
			{	"c" : 1,	"k" : "nlimitfreevideosigncount",	"t" : "uchar",},			
			{	"c" : 1,	"k" : "nlimitfrontrid",	"t" : "slong",},			
			{	"c" : 1,	"k" : "nlimitallcount",	"t" : "slong",},			
			{	"c" : 1,	"k" : "nlimitdaycount",	"t" : "slong",},			
			{	"c" : 1,	"k" : "nlimitweekcount",	"t" : "slong",},			
			{	"c" : 1,	"k" : "nlimitmonthcount",	"t" : "slong",},			
			{	"c" : 1,	"k" : "nlimitwarid",	"t" : "slong",},
		]

}
export class GS_ExchangeAliPay  {			
	nrid : number;			
	szrealname : string;			
	szalipayaccount : string;
	protoList:any[] = 
		[			
			{	"c" : 1,	"k" : "nrid",	"t" : "slong",},			
			{	"c" : 128,	"k" : "szrealname",	"t" : "stchar",},			
			{	"c" : 128,	"k" : "szalipayaccount",	"t" : "stchar",},
		]

}
export class GS_ExchangeRetHistory  {			
	uitemsize : number;			
	nitemcount : number;			
	history : GS_ExchangeRetHistory_HistoryItem[];
	historyClass : any = GS_ExchangeRetHistory_HistoryItem;
	protoList:any[] = 
		[			
			{	"c" : 1,	"k" : "uitemsize",	"t" : "ushort",},			
			{	"c" : 1,	"k" : "nitemcount",	"t" : "slong",},			
			{	"s" : "uitemsize",	"c" : 0,	"ck" : "nitemcount",	"k" : "history",	"t" : "GS_ExchangeRetHistory_HistoryItem",},
		]

}
export class GS_ExchangeFreeVideoData  {			
	nplayfreevideocount : number;			
	btcanplayfreevideo : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"k" : "nplayfreevideocount",	"t" : "slong",},			
			{	"c" : 1,	"k" : "btcanplayfreevideo",	"t" : "uchar",},
		]

}
export class GS_ExchangeClearData  {			
	btday : number;			
	btweek : number;			
	btmonth : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"k" : "btday",	"t" : "uchar",},			
			{	"c" : 1,	"k" : "btweek",	"t" : "uchar",},			
			{	"c" : 1,	"k" : "btmonth",	"t" : "uchar",},
		]

}
export class GS_ExchangeFragment  {			
	nrid : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"k" : "nrid",	"t" : "slong",},
		]

}
 

 