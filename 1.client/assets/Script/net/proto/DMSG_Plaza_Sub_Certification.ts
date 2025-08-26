export enum GS_PLAZA_CERTIFICATION_MSG
{	
	PLAZA_CERTIFICATION_POPUP			= 0,		//弹出实名认证
	PLAZA_CERTIFICATION_UNDERAGETIPS	= 1,		//认证为未成年之后的提示
	PLAZA_CERTIFICATION_STATE			= 2,		//实名认证功能开关状态
	PLAZA_CERTIFICATION_MAX
}
export class GS_CertificationHead  {
	protoList:any[] = 
		[
		]

}
export class GS_CertificationPopup_GiveGoodsItem  {			
	ngoodsid : number;			
	ngoodsnum : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "ngoodsid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsnum",	"c" : 1,},
		]

}
export class GS_CertificationPopup  {			
	btmode : number;			
	nrewardgoodsid : number;			
	nrewardgoodsnum : number;			
	sztips : string;			
	ugiveitemsize : number;			
	ugivecount : number;			
	give : GS_CertificationPopup_GiveGoodsItem[];
	giveClass : any = GS_CertificationPopup_GiveGoodsItem;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"k" : "btmode",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nrewardgoodsid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nrewardgoodsnum",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "sztips",	"c" : 128,},			
			{	"t" : "ushort",	"k" : "ugiveitemsize",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "ugivecount",	"c" : 1,},			
			{	"ck" : "ugivecount",	"c" : 0,	"t" : "GS_CertificationPopup_GiveGoodsItem",	"s" : "ugiveitemsize",	"k" : "give",},
		]

}
export class GS_CertificationUnderageTips  {
	protoList:any[] = 
		[
		]

}
export class GS_CertificationState  {			
	btstate : number;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"k" : "btstate",	"c" : 1,},
		]

}
 

 