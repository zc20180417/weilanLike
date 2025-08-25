export enum GS_PLAZA_DISCOUNTSTORE_MSG
{	
	PLAZA_DISCOUNTSTORE_INFO						= 0,		//����								s->c
	PLAZA_DISCOUNTSTORE_PRIVATE						= 1,		//��������							s->c
	PLAZA_DISCOUNTSTORE_FREEREF						= 2,		//���ˢ��(�ɹ����ط���������)		c->s
	PLAZA_DISCOUNTSTORE_FREEVIDEOREF				= 3,		//��Ƶˢ��(��Ƶ�ɹ����ط��������ݣ�	c->s
	PLAZA_DISCOUNTSTORE_FREEVIDEOORDER				= 4,		//��Ƶˢ�¶����·�					s->c
	PLAZA_DISCOUNTSTORE_BUY							= 5,		//������Ʒ							c->s
	PLAZA_DISCOUNTSTORE_BUYRET						= 6,		//���򷵻�							s->c
	PLAZA_DISCOUNTSTORE_TIMEREF						= 7,		//�ͻ���֪ͨ������ʱ�䵽��ˢ��		c->s
	PLAZA_DISCOUNTSTORE_MAX
}
export class GS_DiscountStoreHead  {
	protoList:any[] = 
		[
		]

}
export class GS_DiscountStorePrivate_GoodsData  {			
	btindex : number;			
	ngoodsid : number;			
	ndiamonds : number;			
	btdiscount : number;			
	btstate : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"k" : "btindex",	"t" : "uchar",},			
			{	"c" : 1,	"k" : "ngoodsid",	"t" : "slong",},			
			{	"c" : 1,	"k" : "ndiamonds",	"t" : "slong",},			
			{	"c" : 1,	"k" : "btdiscount",	"t" : "uchar",},			
			{	"c" : 1,	"k" : "btstate",	"t" : "uchar",},
		]

}
export class GS_DiscountStoreBuy  {			
	btindex : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"k" : "btindex",	"t" : "uchar",},
		]

}
export class GS_DiscountStorePrivate  {			
	nlastreftime : number;			
	nfreerefcount : number;			
	nfreevideorefcont : number;			
	uitemsize : number;			
	uitemcount : number;			
	goodsdatalist : GS_DiscountStorePrivate_GoodsData[];
	goodsdatalistClass : any = GS_DiscountStorePrivate_GoodsData;
	protoList:any[] = 
		[			
			{	"c" : 1,	"k" : "nlastreftime",	"t" : "sint64",},			
			{	"c" : 1,	"k" : "nfreerefcount",	"t" : "ushort",},			
			{	"c" : 1,	"k" : "nfreevideorefcont",	"t" : "ushort",},			
			{	"c" : 1,	"k" : "uitemsize",	"t" : "ushort",},			
			{	"c" : 1,	"k" : "uitemcount",	"t" : "ushort",},			
			{	"s" : "uitemsize",	"c" : 0,	"ck" : "uitemcount",	"k" : "goodsdatalist",	"t" : "GS_DiscountStorePrivate_GoodsData",},
		]

}
export class GS_DiscountStoreFreeRef  {
	protoList:any[] = 
		[
		]

}
export class GS_DiscountStoreInfo  {			
	nfreecount : number;			
	nfreevideocount : number;			
	nautoreftimes : number;			
	nopenwarid : number;			
	nrefdiamonds : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"k" : "nfreecount",	"t" : "slong",},			
			{	"c" : 1,	"k" : "nfreevideocount",	"t" : "slong",},			
			{	"c" : 1,	"k" : "nautoreftimes",	"t" : "slong",},			
			{	"c" : 1,	"k" : "nopenwarid",	"t" : "slong",},			
			{	"c" : 1,	"k" : "nrefdiamonds",	"t" : "slong",},
		]

}
export class GS_DiscountStoreBuyRet  {			
	btindex : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"k" : "btindex",	"t" : "uchar",},
		]

}
export class GS_DiscountStoreTimeRef  {
	protoList:any[] = 
		[
		]

}
export class GS_DiscountStoreFreeVideoRef  {
	protoList:any[] = 
		[
		]

}
export class GS_DiscountStoreFreeVideoRet  {			
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
 

 