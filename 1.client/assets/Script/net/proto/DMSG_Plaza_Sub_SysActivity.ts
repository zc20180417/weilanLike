export enum GS_PLAZA_SYSACTIVITY_MSG
{	
	PLAZA_SYSACTIVITY_CONFIG		= 0,	//�û������еĻ��������
	PLAZA_SYSACTIVITY_PRIVATE		= 1,	//�û������(�û��ķ�ȫ����ɵĻ��
	PLAZA_SYSACTIVITY_NEW			= 2,	//�����µĻ
	PLAZA_SYSACTIVITY_CLOSE			= 3,	//��ر�(��̨ˢ�¹ر�ĳ�����
	PLAZA_SYSACTIVITY_JOIN			= 4,	//����ĳ���
	PLAZA_SYSACTIVITY_ORDER			= 5,	//�����ֵ������ֵ���·���
	PLAZA_SYSACTIVITY_FVORDER		= 6,	//���Ƶ����(ǩ�����·�����
	PLAZA_SYSACTIVITY_UPDATA		= 7,	//����ĳ����ĸ�������(�ͻ���ͨ�������ݴ���ĳ����Ƿ�ȫ����ɣ�
	PLAZA_SYSACTIVITY_GETREWARD		= 8,	//�ֶ���ȡ������ǩ����������Ҫ��
	PLAZA_SYSACTIVITY_REF			= 9,	//�ͻ��˽���ˢ������ֻ�����װ����è�䲢���Ӽ�������������Ϊһ�Ļ����ˢ��,ˢ��Ҳ�����������رգ�	����
	PLAZA_SYSACTIVITY_REST			= 10,	//����
	PLAZA_SYSACTIVITY_MAX
}
export class GS_SysActivityHead  {
	protoList:any[] = 
		[
		]

}
export class GS_SysActivityNew_SysActivityNewTaskItem  {			
	nparam1 : number;			
	nparam2 : number;			
	nparam3 : number;			
	nparam4 : number;			
	nparam5 : number;			
	nparam6 : number;			
	nparam7 : number;			
	nparam8 : number;			
	nparam9 : number;			
	btindex : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"c" : 1,	"k" : "nparam1",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nparam2",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nparam3",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nparam4",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nparam5",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nparam6",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nparam7",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nparam8",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nparam9",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btindex",},
		]

}
export class GS_SysActivityClose  {			
	nid : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"c" : 1,	"k" : "nid",},
		]

}
export class GS_SysActivityPrivate_SysActivityData  {			
	nid : number;			
	nflag : number;			
	nstarttimes : number;			
	nmainprogress : number;			
	nlastchangetimes : number;			
	nsubprogress : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"c" : 1,	"k" : "nid",},			
			{	"t" : "sint64",	"c" : 1,	"k" : "nflag",},			
			{	"t" : "sint64",	"c" : 1,	"k" : "nstarttimes",},			
			{	"t" : "sint64",	"c" : 1,	"k" : "nmainprogress",},			
			{	"t" : "sint64",	"c" : 1,	"k" : "nlastchangetimes",},			
			{	"t" : "sint64",	"c" : 1,	"k" : "nsubprogress",},
		]

}
export class GS_SysactivityReset  {			
	nid : number;			
	btmode : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"c" : 1,	"k" : "nid",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btmode",},
		]

}
export class GS_SysActivityConfig  {			
	usysactivitycount : number;			
	usysactivitytaskcount : number;			
	usysactivitysize : number;			
	usysactivitytasksize : number;			
	data1 : GS_SysActivityConfig_SysActivityItem[];
	data1Class : any = GS_SysActivityConfig_SysActivityItem;			
	data2 : GS_SysActivityConfig_SysActivityTaskItem[];
	data2Class : any = GS_SysActivityConfig_SysActivityTaskItem;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"c" : 1,	"k" : "usysactivitycount",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "usysactivitytaskcount",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "usysactivitysize",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "usysactivitytasksize",},			
			{	"s" : "usysactivitysize",	"ck" : "usysactivitycount",	"t" : "GS_SysActivityConfig_SysActivityItem",	"k" : "data1",	"c" : 0,},			
			{	"s" : "usysactivitytasksize",	"ck" : "usysactivitytaskcount",	"t" : "GS_SysActivityConfig_SysActivityTaskItem",	"k" : "data2",	"c" : 0,},
		]

}
export class GS_SysActivityNew_SysActivityNewItem  {			
	nid : number;			
	sztitle : string;			
	nicon : number;			
	nvalidtimes : number;			
	njumpwarid : number;			
	nclientparam : number;			
	bttype : number;			
	bttaskcount : number;			
	btfvref : number;			
	nrefneeddiamonds : number;			
	nclearcycleday : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"c" : 1,	"k" : "nid",},			
			{	"t" : "stchar",	"c" : 32,	"k" : "sztitle",},			
			{	"t" : "sint64",	"c" : 1,	"k" : "nicon",},			
			{	"t" : "sint64",	"c" : 1,	"k" : "nvalidtimes",},			
			{	"t" : "sint64",	"c" : 1,	"k" : "njumpwarid",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nclientparam",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "bttype",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "bttaskcount",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btfvref",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nrefneeddiamonds",},			
			{	"t" : "sint64",	"c" : 1,	"k" : "nclearcycleday",},
		]

}
export class GS_SysActivityConfig_SysActivityItem  {			
	nid : number;			
	sztitle : string;			
	nicon : number;			
	nvalidtimes : number;			
	njumpwarid : number;			
	nclientparam : number;			
	bttype : number;			
	bttaskcount : number;			
	btfvref : number;			
	nrefneeddiamonds : number;			
	nclearcycleday : number;			
	nextraparam1 : number;			
	nextraparam2 : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"c" : 1,	"k" : "nid",},			
			{	"t" : "stchar",	"c" : 32,	"k" : "sztitle",},			
			{	"t" : "sint64",	"c" : 1,	"k" : "nicon",},			
			{	"t" : "sint64",	"c" : 1,	"k" : "nvalidtimes",},			
			{	"t" : "sint64",	"c" : 1,	"k" : "njumpwarid",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nclientparam",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "bttype",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "bttaskcount",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btfvref",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nrefneeddiamonds",},			
			{	"t" : "sint64",	"c" : 1,	"k" : "nclearcycleday",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nextraparam1",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nextraparam2",},
		]

}
export class GS_SysActivityRef  {			
	nid : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"c" : 1,	"k" : "nid",},
		]

}
export class GS_SysActivityNew  {			
	usysactivitycount : number;			
	usysactivitytaskcount : number;			
	usysactivitysize : number;			
	usysactivitytasksize : number;			
	data1 : GS_SysActivityNew_SysActivityNewItem[];
	data1Class : any = GS_SysActivityNew_SysActivityNewItem;			
	data2 : GS_SysActivityNew_SysActivityNewTaskItem[];
	data2Class : any = GS_SysActivityNew_SysActivityNewTaskItem;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"c" : 1,	"k" : "usysactivitycount",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "usysactivitytaskcount",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "usysactivitysize",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "usysactivitytasksize",},			
			{	"s" : "usysactivitysize",	"ck" : "usysactivitycount",	"t" : "GS_SysActivityNew_SysActivityNewItem",	"k" : "data1",	"c" : 0,},			
			{	"s" : "usysactivitytasksize",	"ck" : "usysactivitytaskcount",	"t" : "GS_SysActivityNew_SysActivityNewTaskItem",	"k" : "data2",	"c" : 0,},
		]

}
export class GS_SysActivityUpData  {			
	nid : number;			
	nflag : number;			
	nstarttimes : number;			
	nmainprogress : number;			
	nlastchangetimes : number;			
	nsubprogress : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"c" : 1,	"k" : "nid",},			
			{	"t" : "sint64",	"c" : 1,	"k" : "nflag",},			
			{	"t" : "sint64",	"c" : 1,	"k" : "nstarttimes",},			
			{	"t" : "sint64",	"c" : 1,	"k" : "nmainprogress",},			
			{	"t" : "sint64",	"c" : 1,	"k" : "nlastchangetimes",},			
			{	"t" : "sint64",	"c" : 1,	"k" : "nsubprogress",},
		]

}
export class GS_SysActivityConfig_SysActivityTaskItem  {			
	nparam1 : number;			
	nparam2 : number;			
	nparam3 : number;			
	nparam4 : number;			
	nparam5 : number;			
	nparam6 : number;			
	nparam7 : number;			
	nparam8 : number;			
	nparam9 : number;			
	btindex : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"c" : 1,	"k" : "nparam1",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nparam2",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nparam3",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nparam4",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nparam5",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nparam6",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nparam7",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nparam8",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nparam9",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btindex",},
		]

}
export class GS_SysActivityPrivate  {			
	uitemcount : number;			
	uitemsize : number;			
	data : GS_SysActivityPrivate_SysActivityData[];
	dataClass : any = GS_SysActivityPrivate_SysActivityData;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"c" : 1,	"k" : "uitemcount",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "uitemsize",},			
			{	"c" : 0,	"ck" : "uitemcount",	"t" : "GS_SysActivityPrivate_SysActivityData",	"s" : "uitemsize",	"k" : "data",},
		]

}
export class GS_SysActivityOrder  {			
	szorder : string;			
	nrmb : number;
	protoList:any[] = 
		[			
			{	"t" : "stchar",	"c" : 32,	"k" : "szorder",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nrmb",},
		]

}
export class GS_SysActivityGetReward  {			
	nid : number;			
	btindex : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"c" : 1,	"k" : "nid",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btindex",},
		]

}
export class GS_SysActivityFVOrder  {			
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
export class GS_SysActivityJoin  {			
	nid : number;			
	btindex : number;			
	btmode : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"c" : 1,	"k" : "nid",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btindex",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btmode",},
		]

}
 

 