export enum GS_PLAZA_STATUS_MSG
{	
	PLAZA_STATUS_INFO		= 0,	// ×´Ì¬ÅäÖÃÁÐ±í				s->c		
	PLAZA_STATUS_MAX
}
export class GS_StatusHead  {
	protoList:any[] = 
		[
		]

}
export class GS_StatusInfo_StautsItem  {			
	nstatusid : number;			
	szres : string;			
	bttype : number;			
	bteffecttype : number;			
	btrule : number;			
	unum : number;			
	ulvaddnum : number;			
	ulvaddpernum : number;			
	btendmode : number;			
	utimes : number;			
	ulvaddtimes : number;			
	ulvaddtimesper : number;			
	uoperatenum : number;			
	ulvaddoperatenum : number;			
	ulvaddperoperatenum : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nstatusid",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szres",	"c" : 32,},			
			{	"t" : "uchar",	"k" : "bttype",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "bteffecttype",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btrule",	"c" : 1,},			
			{	"t" : "ulong",	"k" : "unum",	"c" : 1,},			
			{	"t" : "ulong",	"k" : "ulvaddnum",	"c" : 1,},			
			{	"t" : "ulong",	"k" : "ulvaddpernum",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btendmode",	"c" : 1,},			
			{	"t" : "ulong",	"k" : "utimes",	"c" : 1,},			
			{	"t" : "ulong",	"k" : "ulvaddtimes",	"c" : 1,},			
			{	"t" : "ulong",	"k" : "ulvaddtimesper",	"c" : 1,},			
			{	"t" : "ulong",	"k" : "uoperatenum",	"c" : 1,},			
			{	"t" : "ulong",	"k" : "ulvaddoperatenum",	"c" : 1,},			
			{	"t" : "ulong",	"k" : "ulvaddperoperatenum",	"c" : 1,},
		]

}
export class GS_StatusInfo  {			
	uitemsize : number;			
	uitemcount : number;			
	statuslist : GS_StatusInfo_StautsItem[];
	statuslistClass : any = GS_StatusInfo_StautsItem;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"k" : "uitemsize",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uitemcount",	"c" : 1,},			
			{	"ck" : "uitemcount",	"c" : 0,	"t" : "GS_StatusInfo_StautsItem",	"s" : "uitemsize",	"k" : "statuslist",},
		]

}
 

 