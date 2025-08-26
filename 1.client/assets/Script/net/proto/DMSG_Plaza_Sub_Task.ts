export enum GS_PLAZA_TASK_MSG
{
	PLAZA_TASK_INFO						= 0,	//	玩家所有任务进度信息		s->c
	PLAZA_TASK_VIEW						= 1,	//	任务视图					s->c
	PLAZA_TASK_ADD						= 2,	//	新增任务					s->c
	PLAZA_TASK_CHANGE					= 3,	//	任务改变					s->c	
	PLAZA_TASK_FINISH					= 4,	//	完成任务					c->s
	PLAZA_TASK_FINISHALL				= 5,	//	一键领取任务奖励			c->s
	PLAZA_TASK_GETSCOREREWARD			= 6,	//	领取积分奖励				c->s
	PLAZA_TASK_SCOREREWARDFLAG			= 7,	//	更新积分物品领取状态		s->c
	PLAZA_TASK_SCORE					= 8,	//	更新积分					s->c
	PLAZA_TASK_OPENED_URL				= 9,	//	客户端打开了链接			c->s
	PLAZA_TASK_MAX
}
export class GS_TaskHead  {
	protoList:any[] = 
		[
		]

}
export class GS_TaskView_ScoreRewardItem  {			
	nneedscore : number;			
	ngoodsids : number[];			
	ngoodsnums : number[];
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "slong",	"k" : "nneedscore",},			
			{	"c" : 3,	"t" : "slong",	"k" : "ngoodsids",},			
			{	"c" : 3,	"t" : "slong",	"k" : "ngoodsnums",},
		]

}
export class GS_TaskScore  {			
	nscore : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "slong",	"k" : "nscore",},
		]

}
export class GS_TaskView  {			
	nopenwarid : number;			
	nscorerewardflag : number;			
	nscore : number;			
	uscorerewarditemcount : number;			
	uscorerewarditemsize : number;			
	ucount : number;			
	uitemsize : number;			
	data1 : GS_TaskView_ScoreRewardItem[];
	data1Class : any = GS_TaskView_ScoreRewardItem;			
	data2 : GS_TaskView_TaskViewItem[];
	data2Class : any = GS_TaskView_TaskViewItem;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "slong",	"k" : "nopenwarid",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nscorerewardflag",},			
			{	"c" : 1,	"t" : "slong",	"k" : "nscore",},			
			{	"c" : 1,	"t" : "ushort",	"k" : "uscorerewarditemcount",},			
			{	"c" : 1,	"t" : "ushort",	"k" : "uscorerewarditemsize",},			
			{	"c" : 1,	"t" : "ushort",	"k" : "ucount",},			
			{	"c" : 1,	"t" : "ushort",	"k" : "uitemsize",},			
			{	"s" : "uscorerewarditemsize",	"t" : "GS_TaskView_ScoreRewardItem",	"ck" : "uscorerewarditemcount",	"k" : "data1",	"c" : 0,},			
			{	"s" : "uitemsize",	"t" : "GS_TaskView_TaskViewItem",	"ck" : "ucount",	"k" : "data2",	"c" : 0,},
		]

}
export class GS_TaskChange  {			
	ltasklistid : number;			
	unowfinish : number;			
	ureceivefinish : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "slong",	"k" : "ltasklistid",},			
			{	"c" : 1,	"t" : "sint64",	"k" : "unowfinish",},			
			{	"c" : 1,	"t" : "sint64",	"k" : "ureceivefinish",},
		]

}
export class GS_TaskFinishAll  {
	protoList:any[] = 
		[
		]

}
export class GS_TaskInfo  {			
	sitemsize : number;			
	staskcount : number;			
	task : GS_TaskInfo_TaskItem[];
	taskClass : any = GS_TaskInfo_TaskItem;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "ushort",	"k" : "sitemsize",},			
			{	"c" : 1,	"t" : "ushort",	"k" : "staskcount",},			
			{	"c" : 0,	"t" : "GS_TaskInfo_TaskItem",	"ck" : "staskcount",	"s" : "sitemsize",	"k" : "task",},
		]

}
export class GS_TaskInfo_TaskItem  {			
	ltasklistid : number;			
	unowfinish : number;			
	ureceivefinish : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "slong",	"k" : "ltasklistid",},			
			{	"c" : 1,	"t" : "sint64",	"k" : "unowfinish",},			
			{	"c" : 1,	"t" : "sint64",	"k" : "ureceivefinish",},
		]

}
export class GS_TaskView_TaskViewItem  {			
	bttype : number;			
	stasklistid : number;			
	staskid : number;			
	npicid : number;			
	szname : string;			
	ufinishtimes : number;			
	szchildname : string;			
	sztips : string;			
	nrewardgoodsid : number[];			
	nrewardgoodsnum : number[];			
	uprocessparam0 : number;			
	uprocessparam1 : number;			
	ufunctype : number;			
	ufuncparam0 : number;			
	ufuncparam1 : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "uchar",	"k" : "bttype",},			
			{	"c" : 1,	"t" : "slong",	"k" : "stasklistid",},			
			{	"c" : 1,	"t" : "slong",	"k" : "staskid",},			
			{	"c" : 1,	"t" : "ulong",	"k" : "npicid",},			
			{	"c" : 32,	"t" : "stchar",	"k" : "szname",},			
			{	"c" : 1,	"t" : "sint64",	"k" : "ufinishtimes",},			
			{	"c" : 32,	"t" : "stchar",	"k" : "szchildname",},			
			{	"c" : 64,	"t" : "stchar",	"k" : "sztips",},			
			{	"c" : 4,	"t" : "slong",	"k" : "nrewardgoodsid",},			
			{	"c" : 4,	"t" : "slong",	"k" : "nrewardgoodsnum",},			
			{	"c" : 1,	"t" : "ulong",	"k" : "uprocessparam0",},			
			{	"c" : 1,	"t" : "ulong",	"k" : "uprocessparam1",},			
			{	"c" : 1,	"t" : "ushort",	"k" : "ufunctype",},			
			{	"c" : 1,	"t" : "ulong",	"k" : "ufuncparam0",},			
			{	"c" : 1,	"t" : "ulong",	"k" : "ufuncparam1",},
		]

}
export class GS_TaskScoreRewardFlag  {			
	nscorerewardflag : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "slong",	"k" : "nscorerewardflag",},
		]

}
export class GS_TaskGetScoreReward  {			
	btindex : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "uchar",	"k" : "btindex",},
		]

}
export class GS_TaskOpenedUrl  {			
	nurlid : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "slong",	"k" : "nurlid",},
		]

}
export class GS_TaskAdd  {			
	bttype : number;			
	stasklistid : number;			
	staskid : number;			
	npicid : number;			
	szname : string;			
	ufinishtimes : number;			
	szchildname : string;			
	sztips : string;			
	nrewardgoodsid : number[];			
	nrewardgoodsnum : number[];			
	uprocessparam0 : number;			
	uprocessparam1 : number;			
	ufunctype : number;			
	ufuncparam0 : number;			
	ufuncparam1 : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "uchar",	"k" : "bttype",},			
			{	"c" : 1,	"t" : "slong",	"k" : "stasklistid",},			
			{	"c" : 1,	"t" : "slong",	"k" : "staskid",},			
			{	"c" : 1,	"t" : "ulong",	"k" : "npicid",},			
			{	"c" : 32,	"t" : "stchar",	"k" : "szname",},			
			{	"c" : 1,	"t" : "sint64",	"k" : "ufinishtimes",},			
			{	"c" : 32,	"t" : "stchar",	"k" : "szchildname",},			
			{	"c" : 64,	"t" : "stchar",	"k" : "sztips",},			
			{	"c" : 4,	"t" : "slong",	"k" : "nrewardgoodsid",},			
			{	"c" : 4,	"t" : "slong",	"k" : "nrewardgoodsnum",},			
			{	"c" : 1,	"t" : "ulong",	"k" : "uprocessparam0",},			
			{	"c" : 1,	"t" : "ulong",	"k" : "uprocessparam1",},			
			{	"c" : 1,	"t" : "ushort",	"k" : "ufunctype",},			
			{	"c" : 1,	"t" : "ulong",	"k" : "ufuncparam0",},			
			{	"c" : 1,	"t" : "ulong",	"k" : "ufuncparam1",},
		]

}
export class GS_TaskFinish  {			
	ltasklistid : number;
	protoList:any[] = 
		[			
			{	"c" : 1,	"t" : "slong",	"k" : "ltasklistid",},
		]

}
 

 