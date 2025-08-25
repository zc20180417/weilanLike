export enum GS_PLAZA_NOVICETASK_MSG
{	
	PLAZA_NOVICETASK_CONFIG		= 0,	// 配置												s->c
	PLAZA_NOVICETASK_PRIVATE	= 1,	// 私人数据(首次此配置客户端才能显示界面)			s->c
	PLAZA_NOVICETASK_UPDATA		= 2,	// 下发更新某个任务或者任务链数据					s->c
	PLAZA_NOVICETASK_GETREWARD	= 3,	// 领取奖励											c->s
	PLAZA_NOVICETASK_SHARE		= 4,	// 完成分享											c->s
	PLAZA_NOVICETASK_MAX
}
export class GS_NoviceTaskHead  {
	protoList:any[] = 
		[
		]

}
export class GS_NoviceTaskPrivate_TaskData  {			
	nid : number;			
	btstate : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nid",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btstate",	"c" : 1,},
		]

}
export class GS_NoviceTaskConfig  {			
	tasklists : GS_NoviceTaskConfig_NoviceTaskList[];
	tasklistsClass : any = GS_NoviceTaskConfig_NoviceTaskList;
	protoList:any[] = 
		[			
			{	"t" : "GS_NoviceTaskConfig_NoviceTaskList",	"k" : "tasklists",	"c" : 7,},
		]

}
export class GS_NoviceTaskConfig_NoviceTaskList  {			
	nid : number;			
	ngoodsid1 : number;			
	ngoodsnums1 : number;			
	ngoodsid2 : number;			
	ngoodsnums2 : number;			
	tasks : GS_NoviceTaskConfig_NoviceTaskItem[];
	tasksClass : any = GS_NoviceTaskConfig_NoviceTaskItem;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsid1",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsnums1",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsid2",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsnums2",	"c" : 1,},			
			{	"t" : "GS_NoviceTaskConfig_NoviceTaskItem",	"k" : "tasks",	"c" : 4,},
		]

}
export class GS_NoviceTaskConfig_NoviceTaskItem  {			
	nid : number;			
	szdes : string;			
	ngoodsid : number;			
	ngoodsnums : number;			
	bttype : number;			
	ulogicparam1 : number;			
	nclientparam : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nid",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szdes",	"c" : 128,},			
			{	"t" : "slong",	"k" : "ngoodsid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsnums",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "bttype",	"c" : 1,},			
			{	"t" : "ulong",	"k" : "ulogicparam1",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nclientparam",	"c" : 1,},
		]

}
export class GS_NoviceTaskPrivate  {			
	nstartgreentime : number;			
	nendgreentime : number;			
	uitemcount : number;			
	uitemsize : number;			
	data : GS_NoviceTaskPrivate_TaskData[];
	dataClass : any = GS_NoviceTaskPrivate_TaskData;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"k" : "nstartgreentime",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nendgreentime",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uitemcount",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uitemsize",	"c" : 1,},			
			{	"ck" : "uitemcount",	"c" : 0,	"t" : "GS_NoviceTaskPrivate_TaskData",	"s" : "uitemsize",	"k" : "data",},
		]

}
export class GS_NoviceTaskUpData  {			
	nid : number;			
	btstate : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nid",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btstate",	"c" : 1,},
		]

}
export class GS_NoviceTaskShare  {
	protoList:any[] = 
		[
		]

}
export class GS_NoviceTaskGetReward  {			
	nid : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nid",	"c" : 1,},
		]

}
 

 