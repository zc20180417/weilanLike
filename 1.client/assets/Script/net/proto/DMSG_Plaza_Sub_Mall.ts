export enum GS_PLAZA_MALL_MSG
{		
	PLAZA_MALL_GOODSLIST			= 0,	//	������Ʒ�б�									s->c
	PLAZA_MALL_LISTGOODSLIST		= 1,	//	��ʽ��Ʒ�б�									s->c
	PLAZA_MALL_RANDLISTGOODSLIST	= 2,	//	�����ʽ��Ʒ�б�								s->c
	PLAZA_MALL_UPLISTGOODS			= 3,	//	�·����µ�����ʽ��Ʒ							s->c
	PLAZA_MALL_PRIVATEDATA			= 4,	//	�û��̳ǹ����˽������							s->c
	PLAZA_MALL_UPPRIVATEDATA		= 5,	//	�·����µ���˽������							s->c
	PLAZA_MALL_BUY					= 6,	//	����										c->s
	PLAZA_MALL_RMBBUY				= 7,	//	RMB��ֵ������(RMB�������⴦��)			c->s
	PLAZA_MALL_RMBORDER				= 8,	//	RMB������������ض����Ÿ���ͻ���				s->c	
	PLAZA_MALL_TIPS					= 9,	//	��ʾ�ͻ���										s->c
	PLAZA_MALL_GETFREEVIDEOORDER	= 10,	//  ��������Ƶ����							c->s
	PLAZA_MALL_RETFREEVIDEOORDER	= 11,	//	�·������Ƶ����								s->c
	PLAZA_MALL_GETADDFREEVIDEOORDER = 12,	//  ��������Ƶ����							c->s
	PLAZA_MALL_RETADDFREEVIDEOORDER = 13,	//	�·������Ƶ����								s->c
	PLAZA_MALL_NORMALLBUYHISTORY	= 14,	//	�Ѿ����������Ʒ��ʷ��¼						s->c
	PLAZA_MALL_NORMALLBYTHISTORYADD	= 15,	//	����һ���Ѿ����������Ʒ��ʷ��¼				s->c
	PLAZA_MALL_UPRANDGOODS			= 16,	//	�·����µ��������ʽ��Ʒ						s->c

	PLAZA_MALL_PURCHASE_TON			= 17,	//	��ֵTON										c->s
	PLAZA_MALL_PICK_TON				= 18,	//	��ȡTON										c->s
	PLAZA_MALL_PICK_TON_RET			= 19,	//	��ȡTON���										s->c
	PLAZA_MALL_TON_ORDER			= 20,	//	��ֵTON����										s->c

	PLAZA_MALL_MAX
}
export enum  GS_MALLTIPS
	{
		MALLTIPS_BUYSUCCESS			= 0,	//����ɹ�
		MALLTIPS_NOPACKET			= 1,	//���������쳣
		MALLTIPS_NODIAMONDS			= 2,	//Ԫ������		
		MALLTIPS_GOOSMAX			= 3,	//��Ʒ�����ﵽ����
		MALLTIPS_ADDSTRENGTHERROR	= 4,	//�۳�����ʧ��(��Ҫ��ϵGM���)
		MALLTIPS_ADDDIAMONDSERROR	= 5,	//�۳�Ԫ��ʧ��(��Ҫ��ϵGM���)
		MALLTIPS_ADDGOODSERROR		= 6,	//������Ʒʧ��(��Ҫ��ϵGM���)	
		MALLTIPS_DBERROR			= 7,	//���ݿ��쳣
		MALLTIPS_NOVIPLEVEL			= 8,	//VIP�ȼ�����
		MALLTIPS_NOSTARTTIME		= 9,	//������δ��ʼ
		MALLTIPS_ENDTIME			= 10,	//�����Ѿ�����
		MALLTIPS_NOGOODS			= 11,	//��Ʒ�����ڻ����Ѿ��¼�
		MALLTIPS_MAXBUYCOUNT		= 12,	//�Ѿ��ﵽ��������
		MALLTIPS_NOBUY				= 13,	//�޷�����(ĳ������û�ﵽ��
		MALLTIPS_NONEEDGOODS		= 14,	//������Ʒ�����ڻ��߲���
		MALLTIPS_NOMALLPART			= 15,	//�û����̳������쳣
		MALLTIPS_TIMELIMIT			= 16,	//ʱ�����Ʋ��ܹ���
		MALLTIPS_LOCKDIAMODS		= 17,	//��һ����ʯ������δ���
		MALLTIPS_MAX
	}
export class GS_MallHead  {
	protoList:any[] = 
		[
		]

}
export class GS_MallPickTon  {			
	ncount : number;			
	szkey : string;			
	szmemo : string;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"c" : 1,	"k" : "ncount",},			
			{	"t" : "char",	"c" : 128,	"k" : "szkey",},			
			{	"t" : "char",	"c" : 32,	"k" : "szmemo",},
		]

}
export class GS_MallGetAddFreeVideo  {
	protoList:any[] = 
		[
		]

}
export class GS_MallGoodsList  {			
	utagcount : number;			
	ugoodscount : number;			
	utagstructsize : number;			
	ugoodsstructsize : number;			
	data1 : GS_MallGoodsList_MallTagItem[];
	data1Class : any = GS_MallGoodsList_MallTagItem;			
	data2 : GS_MallGoodsList_MallGoodsItem[];
	data2Class : any = GS_MallGoodsList_MallGoodsItem;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"c" : 1,	"k" : "utagcount",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "ugoodscount",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "utagstructsize",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "ugoodsstructsize",},			
			{	"ck" : "utagcount",	"t" : "GS_MallGoodsList_MallTagItem",	"c" : 0,	"k" : "data1",	"s" : "utagstructsize",},			
			{	"ck" : "ugoodscount",	"t" : "GS_MallGoodsList_MallGoodsItem",	"c" : 0,	"k" : "data2",	"s" : "ugoodsstructsize",},
		]

}
export class GS_MallRmbOrder  {			
	nrid : number;			
	szorder : string;			
	nrmb : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"c" : 1,	"k" : "nrid",},			
			{	"t" : "stchar",	"c" : 32,	"k" : "szorder",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nrmb",},
		]

}
export class GS_MallBuy  {			
	nrid : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"c" : 1,	"k" : "nrid",},
		]

}
export class GS_MallSetFreeVideo  {			
	nrid : number;			
	szorder : string;			
	nsdkid : number;			
	szsdkkey : string;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"c" : 1,	"k" : "nrid",},			
			{	"t" : "stchar",	"c" : 32,	"k" : "szorder",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nsdkid",},			
			{	"t" : "char",	"c" : 32,	"k" : "szsdkkey",},
		]

}
export class GS_MallRandListGoodsList_MallRandListTagItem  {			
	uid : number;			
	usortid : number;			
	btlimittype : number;			
	nlimitbuycount : number;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"c" : 1,	"k" : "uid",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "usortid",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btlimittype",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nlimitbuycount",},
		]

}
export class GS_MallPrivateData  {			
	uitemcount : number;			
	uitemsize : number;			
	data : GS_MallPrivateData_MallPrivateData[];
	dataClass : any = GS_MallPrivateData_MallPrivateData;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"c" : 1,	"k" : "uitemcount",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "uitemsize",},			
			{	"ck" : "uitemcount",	"t" : "GS_MallPrivateData_MallPrivateData",	"c" : 0,	"s" : "uitemsize",	"k" : "data",},
		]

}
export class GS_MallSetAddFreeVideo  {			
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
export class GS_MallGoodsList_MallGoodsItem  {			
	utagid : number;			
	nrid : number;			
	ndefpaykeyflag : number;			
	npaykeyflag : number;			
	sztitle : string;			
	szdes : string;			
	btquality : number;			
	nlableflag : number;			
	ngoodsid : number;			
	npicid : number;			
	sindex : number;			
	sboundcount : number;			
	nfirstaddper : number;			
	btdiscount : number;			
	btpricetype : number;			
	npricegoodsid : number;			
	npricenums : number;			
	btlimittype : number;			
	nlimitbuycount : number;			
	nbuyspacetimes : number;			
	ngivegoodsid : number[];			
	ngivegoodsnum : number[];
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"c" : 1,	"k" : "utagid",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nrid",},			
			{	"t" : "uint64",	"c" : 1,	"k" : "ndefpaykeyflag",},			
			{	"t" : "uint64",	"c" : 1,	"k" : "npaykeyflag",},			
			{	"t" : "stchar",	"c" : 32,	"k" : "sztitle",},			
			{	"t" : "stchar",	"c" : 128,	"k" : "szdes",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btquality",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nlableflag",},			
			{	"t" : "slong",	"c" : 1,	"k" : "ngoodsid",},			
			{	"t" : "ulong",	"c" : 1,	"k" : "npicid",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "sindex",},			
			{	"t" : "slong",	"c" : 1,	"k" : "sboundcount",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nfirstaddper",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btdiscount",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btpricetype",},			
			{	"t" : "slong",	"c" : 1,	"k" : "npricegoodsid",},			
			{	"t" : "slong",	"c" : 1,	"k" : "npricenums",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btlimittype",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nlimitbuycount",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nbuyspacetimes",},			
			{	"t" : "slong",	"c" : 3,	"k" : "ngivegoodsid",},			
			{	"t" : "slong",	"c" : 3,	"k" : "ngivegoodsnum",},
		]

}
export class GS_MallRandListGoodsList_MallRandListGoodsItem  {			
	utagid : number;			
	nrid : number;			
	ndefpaykeyflag : number;			
	npaykeyflag : number;			
	sztitle : string;			
	szdes : string;			
	btquality : number;			
	nlableflag : number;			
	ngoodsid : number;			
	npicid : number;			
	sindex : number;			
	sboundcount : number;			
	btdiscount : number;			
	btpricetype : number;			
	npricegoodsid : number;			
	npricenums : number;			
	nbuyspacetimes : number;			
	ngivegoodsid : number[];			
	ngivegoodsnum : number[];
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"c" : 1,	"k" : "utagid",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nrid",},			
			{	"t" : "uint64",	"c" : 1,	"k" : "ndefpaykeyflag",},			
			{	"t" : "uint64",	"c" : 1,	"k" : "npaykeyflag",},			
			{	"t" : "stchar",	"c" : 32,	"k" : "sztitle",},			
			{	"t" : "stchar",	"c" : 64,	"k" : "szdes",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btquality",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nlableflag",},			
			{	"t" : "slong",	"c" : 1,	"k" : "ngoodsid",},			
			{	"t" : "ulong",	"c" : 1,	"k" : "npicid",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "sindex",},			
			{	"t" : "slong",	"c" : 1,	"k" : "sboundcount",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btdiscount",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btpricetype",},			
			{	"t" : "slong",	"c" : 1,	"k" : "npricegoodsid",},			
			{	"t" : "slong",	"c" : 1,	"k" : "npricenums",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nbuyspacetimes",},			
			{	"t" : "slong",	"c" : 3,	"k" : "ngivegoodsid",},			
			{	"t" : "slong",	"c" : 3,	"k" : "ngivegoodsnum",},
		]

}
export class GS_MallListGoodsList_MallListTagItem  {			
	uid : number;			
	usortid : number;			
	btlimittype : number;			
	nlimitbuycount : number;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"c" : 1,	"k" : "uid",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "usortid",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btlimittype",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nlimitbuycount",},
		]

}
export class GS_MallUpListGoods  {			
	utagid : number;			
	nrid : number;			
	ndefpaykeyflag : number;			
	npaykeyflag : number;			
	sztitle : string;			
	szdes : string;			
	btquality : number;			
	nlableflag : number;			
	ngoodsid : number;			
	npicid : number;			
	sboundcount : number;			
	btdiscount : number;			
	btpricetype : number;			
	npricegoodsid : number;			
	npricenums : number;			
	ngivegoodsid : number[];			
	ngivegoodsnum : number[];
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"c" : 1,	"k" : "utagid",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nrid",},			
			{	"t" : "uint64",	"c" : 1,	"k" : "ndefpaykeyflag",},			
			{	"t" : "uint64",	"c" : 1,	"k" : "npaykeyflag",},			
			{	"t" : "stchar",	"c" : 32,	"k" : "sztitle",},			
			{	"t" : "stchar",	"c" : 64,	"k" : "szdes",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btquality",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nlableflag",},			
			{	"t" : "slong",	"c" : 1,	"k" : "ngoodsid",},			
			{	"t" : "ulong",	"c" : 1,	"k" : "npicid",},			
			{	"t" : "slong",	"c" : 1,	"k" : "sboundcount",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btdiscount",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btpricetype",},			
			{	"t" : "slong",	"c" : 1,	"k" : "npricegoodsid",},			
			{	"t" : "slong",	"c" : 1,	"k" : "npricenums",},			
			{	"t" : "slong",	"c" : 3,	"k" : "ngivegoodsid",},			
			{	"t" : "slong",	"c" : 3,	"k" : "ngivegoodsnum",},
		]

}
export class GS_MallUpDatePrivateData  {			
	btidtype : number;			
	nid : number;			
	nbuycount : number;			
	nnextbuytime : number;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"c" : 1,	"k" : "btidtype",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nid",},			
			{	"t" : "sint64",	"c" : 1,	"k" : "nbuycount",},			
			{	"t" : "sint64",	"c" : 1,	"k" : "nnextbuytime",},
		]

}
export class GS_MallNormallBuyHistory  {			
	ucount : number;			
	ridlist : number[];
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"c" : 1,	"k" : "ucount",},			
			{	"t" : "slong",	"c" : 0,	"k" : "ridlist",},
		]

}
export class GS_MallTonOrder  {			
	nrid : number;			
	szorder : string;			
	nrmb : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"c" : 1,	"k" : "nrid",},			
			{	"t" : "stchar",	"c" : 32,	"k" : "szorder",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nrmb",},
		]

}
export class GS_MallGoodsList_MallTagItem  {			
	uid : number;			
	usortid : number;			
	szname : string;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"c" : 1,	"k" : "uid",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "usortid",},			
			{	"t" : "stchar",	"c" : 32,	"k" : "szname",},
		]

}
export class GS_MallUpRandGoods  {			
	utagid : number;			
	nrid : number;			
	ndefpaykeyflag : number;			
	npaykeyflag : number;			
	sztitle : string;			
	szdes : string;			
	btquality : number;			
	nlableflag : number;			
	ngoodsid : number;			
	npicid : number;			
	sindex : number;			
	sboundcount : number;			
	btdiscount : number;			
	btpricetype : number;			
	npricegoodsid : number;			
	npricenums : number;			
	nbuyspacetimes : number;			
	ngivegoodsid : number[];			
	ngivegoodsnum : number[];
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"c" : 1,	"k" : "utagid",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nrid",},			
			{	"t" : "uint64",	"c" : 1,	"k" : "ndefpaykeyflag",},			
			{	"t" : "uint64",	"c" : 1,	"k" : "npaykeyflag",},			
			{	"t" : "stchar",	"c" : 32,	"k" : "sztitle",},			
			{	"t" : "stchar",	"c" : 64,	"k" : "szdes",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btquality",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nlableflag",},			
			{	"t" : "slong",	"c" : 1,	"k" : "ngoodsid",},			
			{	"t" : "ulong",	"c" : 1,	"k" : "npicid",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "sindex",},			
			{	"t" : "slong",	"c" : 1,	"k" : "sboundcount",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btdiscount",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btpricetype",},			
			{	"t" : "slong",	"c" : 1,	"k" : "npricegoodsid",},			
			{	"t" : "slong",	"c" : 1,	"k" : "npricenums",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nbuyspacetimes",},			
			{	"t" : "slong",	"c" : 3,	"k" : "ngivegoodsid",},			
			{	"t" : "slong",	"c" : 3,	"k" : "ngivegoodsnum",},
		]

}
export class GS_MallNormallBuyHistoryAdd  {			
	nrid : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"c" : 1,	"k" : "nrid",},
		]

}
export class GS_MallPrivateData_MallPrivateData  {			
	btidtype : number;			
	nid : number;			
	nbuycount : number;			
	nnextbuytime : number;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"c" : 1,	"k" : "btidtype",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nid",},			
			{	"t" : "sint64",	"c" : 1,	"k" : "nbuycount",},			
			{	"t" : "sint64",	"c" : 1,	"k" : "nnextbuytime",},
		]

}
export class GS_MallGetFreeVideo  {			
	nrid : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"c" : 1,	"k" : "nrid",},
		]

}
export class GS_MallPurchaseTon  {			
	ncount : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"c" : 1,	"k" : "ncount",},
		]

}
export class GS_MallRandListGoodsList  {			
	utagcount : number;			
	ugoodscount : number;			
	utagstructsize : number;			
	ugoodsstructsize : number;			
	data1 : GS_MallRandListGoodsList_MallRandListTagItem[];
	data1Class : any = GS_MallRandListGoodsList_MallRandListTagItem;			
	data2 : GS_MallRandListGoodsList_MallRandListGoodsItem[];
	data2Class : any = GS_MallRandListGoodsList_MallRandListGoodsItem;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"c" : 1,	"k" : "utagcount",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "ugoodscount",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "utagstructsize",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "ugoodsstructsize",},			
			{	"ck" : "utagcount",	"t" : "GS_MallRandListGoodsList_MallRandListTagItem",	"c" : 0,	"k" : "data1",	"s" : "utagstructsize",},			
			{	"ck" : "ugoodscount",	"t" : "GS_MallRandListGoodsList_MallRandListGoodsItem",	"c" : 0,	"k" : "data2",	"s" : "ugoodsstructsize",},
		]

}
export class GS_MallTips  {			
	stipsid : number;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"c" : 1,	"k" : "stipsid",},
		]

}
export class GS_MallPickTonRet  {			
	nret : number;			
	norderid : number;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"c" : 1,	"k" : "nret",},			
			{	"t" : "sint64",	"c" : 1,	"k" : "norderid",},
		]

}
export class GS_MallListGoodsList  {			
	utagcount : number;			
	ugoodscount : number;			
	utagstructsize : number;			
	ugoodsstructsize : number;			
	data1 : GS_MallListGoodsList_MallListTagItem[];
	data1Class : any = GS_MallListGoodsList_MallListTagItem;			
	data2 : GS_MallListGoodsList_MallListGoodsItem[];
	data2Class : any = GS_MallListGoodsList_MallListGoodsItem;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"c" : 1,	"k" : "utagcount",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "ugoodscount",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "utagstructsize",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "ugoodsstructsize",},			
			{	"ck" : "utagcount",	"t" : "GS_MallListGoodsList_MallListTagItem",	"c" : 0,	"k" : "data1",	"s" : "utagstructsize",},			
			{	"ck" : "ugoodscount",	"t" : "GS_MallListGoodsList_MallListGoodsItem",	"c" : 0,	"k" : "data2",	"s" : "ugoodsstructsize",},
		]

}
export class GS_MallListGoodsList_MallListGoodsItem  {			
	utagid : number;			
	nrid : number;			
	ndefpaykeyflag : number;			
	npaykeyflag : number;			
	sztitle : string;			
	szdes : string;			
	btquality : number;			
	nlableflag : number;			
	ngoodsid : number;			
	npicid : number;			
	sindex : number;			
	sboundcount : number;			
	btdiscount : number;			
	btpricetype : number;			
	npricegoodsid : number;			
	npricenums : number;			
	nbuyspacetimes : number;			
	ngivegoodsid : number[];			
	ngivegoodsnum : number[];
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"c" : 1,	"k" : "utagid",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nrid",},			
			{	"t" : "uint64",	"c" : 1,	"k" : "ndefpaykeyflag",},			
			{	"t" : "uint64",	"c" : 1,	"k" : "npaykeyflag",},			
			{	"t" : "stchar",	"c" : 32,	"k" : "sztitle",},			
			{	"t" : "stchar",	"c" : 64,	"k" : "szdes",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btquality",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nlableflag",},			
			{	"t" : "slong",	"c" : 1,	"k" : "ngoodsid",},			
			{	"t" : "ulong",	"c" : 1,	"k" : "npicid",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "sindex",},			
			{	"t" : "slong",	"c" : 1,	"k" : "sboundcount",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btdiscount",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btpricetype",},			
			{	"t" : "slong",	"c" : 1,	"k" : "npricegoodsid",},			
			{	"t" : "slong",	"c" : 1,	"k" : "npricenums",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nbuyspacetimes",},			
			{	"t" : "slong",	"c" : 3,	"k" : "ngivegoodsid",},			
			{	"t" : "slong",	"c" : 3,	"k" : "ngivegoodsnum",},
		]

}
export class GS_MallRMBBuy  {			
	nrid : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"c" : 1,	"k" : "nrid",},
		]

}
 

 