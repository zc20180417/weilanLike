export enum GS_PLAZA_ACTIVITY_MSG
{	
	PLAZA_ACTIVITY_NOTICE		= 0,	//告示
	PLAZA_ACTIVITY_REQUESTNOTICE= 1,	//请求告示列表
	PLAZA_ACTIVITY_MAX
}
export class GS_ActivityHead  {
	protoList:any[] = 
		[
		]

}
export class GS_ActivityNotice_NoticeItem  {			
	uflag : number;			
	nrid : number;			
	sztitle : string;			
	szpicurl : string;			
	szjumpurl : string;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"k" : "uflag",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nrid",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "sztitle",	"c" : 32,},			
			{	"t" : "stchar",	"k" : "szpicurl",	"c" : 128,},			
			{	"t" : "stchar",	"k" : "szjumpurl",	"c" : 128,},
		]

}
export class GS_ActivityNotice  {			
	bttype : number;			
	btcount : number;			
	uitemsize : number;			
	data : GS_ActivityNotice_NoticeItem[];
	dataClass : any = GS_ActivityNotice_NoticeItem;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"k" : "bttype",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btcount",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uitemsize",	"c" : 1,},			
			{	"ck" : "btcount",	"c" : 0,	"t" : "GS_ActivityNotice_NoticeItem",	"s" : "uitemsize",	"k" : "data",},
		]

}
export class GS_ActivityRequestNotice  {			
	bttype : number;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"k" : "bttype",	"c" : 1,},
		]

}
 

 