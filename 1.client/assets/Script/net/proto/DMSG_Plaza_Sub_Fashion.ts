import { Encryption } from "../../utils/EncryptionValue";

export enum GS_PLAZA_FASHION_MSG
{	
	PLAZA_FASHION_INFO		= 0,		// ������Ϣ			c->s	
	PLAZA_FASHION_PRIVATE	= 1,		// ˽����Ϣ			s->c
	PLAZA_FASHION_BUY		= 2,		// ���򼤻�			c->s
	PLAZA_FASHION_ORDER		= 3,		// RMB���򶩵�		s->c
	PLAZA_FASHION_ACTIVE	= 4,		// ���򼤻��		s->c
	PLAZA_FASHION_USE		= 5,		// ʹ��				c->s
	PLAZA_FASHION_RETUSE	= 6,		// ʹ�÷���			s->c
	PLAZA_FASHION_CANCEL	= 7,		// ȡ��				c->s
	PLAZA_FASHION_RETCANCEL	= 8,		// ȡ������			s->c
	PLAZA_FASHION_MAX
}
export class GS_FashionHead  {
	protoList:any[] = 
		[
		]

}
export class GS_FashionOrder  {			
	nid : number;			
	szorder : string;			
	nrmb : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "slong",	"k" : "nid",},			
			{	"c" : 32,	"t" : "stchar",	"k" : "szorder",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nrmb",},
		]

}
export class GS_FashionBuy  {			
	nid : number;			
	btbuymode : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "slong",	"k" : "nid",},			
			{	"c" : 1,	"t" : "uchar",	"k" : "btbuymode",},
		]

}
export class GS_FashionCancel  {			
	nid : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "slong",	"k" : "nid",},
		]

}
export class GS_FashionUse  {			
	nid : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "slong",	"k" : "nid",},
		]

}
export class GS_FashionInfo  {			
	ucount : number;			
	uitemsize : number;			
	fashions : GS_FashionInfo_FashionItem[];
	fashionsClass : any = GS_FashionInfo_FashionItem;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "ushort",	"k" : "ucount",},			
			{	"c" : 1,	"t" : "ushort",	"k" : "uitemsize",},			
			{	"ck" : "ucount",	"c" : 0,	"t" : "GS_FashionInfo_FashionItem",	"s" : "uitemsize",	"k" : "fashions",},
		]

}
export class GS_FashionRetUse  {			
	nid : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "slong",	"k" : "nid",},
		]

}
export class GS_FashionInfo_FashionItem  {			
	nid : number;			
	ntroopsid : number;			
	szname : string;			
	usortid : number;			
	szskeletonres : string;			
	sz3dpicres : string;			
	szheadres : string;			
	szbooksres : string;			
	private _nhurtper: number = 0;			
	public get nhurtper(): number {
		return this._nhurtper;
	}
	ndiamonds : number;			
	nprice : number;			
	ngoodsid : number;			
	ngoodsnum : number;			
	ntroopsactivityid : number;			
	nuishowpicid : number;			
	nuinameshowpicid : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "slong",	"k" : "nid",},			
			{	"c" : 1,	"t" : "slong",	"k" : "ntroopsid",},			
			{	"c" : 32,	"t" : "stchar",	"k" : "szname",},			
			{	"c" : 1,	"t" : "ushort",	"k" : "usortid",},			
			{	"c" : 32,	"t" : "stchar",	"k" : "szskeletonres",},			
			{	"c" : 32,	"t" : "stchar",	"k" : "sz3dpicres",},			
			{	"c" : 32,	"t" : "stchar",	"k" : "szheadres",},			
			{	"c" : 32,	"t" : "stchar",	"k" : "szbooksres",},			
			{	"c" : 1,	"t" : "slong",	"k" : "_nhurtper",},			
			{	"c" : 1,	"t" : "slong",	"k" : "ndiamonds",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nprice",},			
			{	"c" : 1,	"t" : "slong",	"k" : "ngoodsid",},			
			{	"c" : 1,	"t" : "slong",	"k" : "ngoodsnum",},			
			{	"c" : 1,	"t" : "slong",	"k" : "ntroopsactivityid",},			
			{	"c" : 1,	"t" : "sint64",	"k" : "nuishowpicid",},			
			{	"c" : 1,	"t" : "sint64",	"k" : "nuinameshowpicid",},
		]

	constructor() {
		Encryption.wrapIntProp(this , ['_nhurtper']);
	}



}
export class GS_FashionPrivate_FashionData  {			
	nid : number;			
	btuse : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "slong",	"k" : "nid",},			
			{	"c" : 1,	"t" : "uchar",	"k" : "btuse",},
		]

}
export class GS_FashionPrivate  {			
	ucount : number;			
	uitemsize : number;			
	fashions : GS_FashionPrivate_FashionData[];
	fashionsClass : any = GS_FashionPrivate_FashionData;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "ushort",	"k" : "ucount",},			
			{	"c" : 1,	"t" : "ushort",	"k" : "uitemsize",},			
			{	"ck" : "ucount",	"c" : 0,	"t" : "GS_FashionPrivate_FashionData",	"s" : "uitemsize",	"k" : "fashions",},
		]

}
export class GS_FashionRetCancel  {			
	nid : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "slong",	"k" : "nid",},
		]

}
export class GS_FashionActive  {			
	nid : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "slong",	"k" : "nid",},
		]

}
 

 