export enum GS_PLAZA_MONSTERMANUAL_MSG
{
	PLAZA_MONSTERMANUAL_INFO		= 0,	//����ͼ������																	s->c
	PLAZA_MONSTERMANUAL_LISTDATA	= 1,	//����ͼǩ��������(��¼�·�����Ϸ�����л�ɱ�����ͻ����Լ�ͬ������)				s->c
	PLAZA_MONSTERMANUAL_UPDATE		= 2,	//���µ�������ͼ������															s->c
	PLAZA_MONSTERMANUAL_BOX			= 3,	//������������																	s->c
	PLAZA_MONSTERMANUAL_GETDETAILS	= 4,	//�����������																	c->s
	PLAZA_MONSTERMANUAL_SETDETAILS	= 5,	//�·���������																	s->c	
	PLAZA_MONSTERMANUAL_GETREWARD	= 6,	//��ȡ����																		c->s
	PLAZA_MONSTERMANUAL_MAX
}
export class GS_MonsterManualHead  {
	protoList:any[] = 
		[
		]

}
export class GS_MonsterManualInfo_MonsterItem  {			
	nmonsterid : number;			
	szname : string;			
	szres : string;			
	uscale : number;			
	ubasehp : number;			
	udropgold : number;			
	uattackhp : number;			
	uspace : number;			
	btshapetype : number;			
	bttype : number;			
	nnextstagemonsterid : number;			
	btnextstagecondition : number;			
	nnextstagevalue : number;			
	nstatusid1 : number;			
	nstatusid1level : number;			
	nstatusid2 : number;			
	nstatusid2level : number;			
	nstatusid3 : number;			
	nstatusid3level : number;			
	nstatusid4 : number;			
	nstatusid4level : number;			
	nstatusid5 : number;			
	nstatusid5level : number;			
	nbookspicid : number;			
	btbookstagid : number;			
	btbookssortid : number;			
	nopenwarid : number;			
	nopenkillcount : number;			
	nopenrewarddiamonds : number;			
	nopenrewardfaceid : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nmonsterid",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szname",	"c" : 32,},			
			{	"t" : "stchar",	"k" : "szres",	"c" : 32,},			
			{	"t" : "ulong",	"k" : "uscale",	"c" : 1,},			
			{	"t" : "ulong",	"k" : "ubasehp",	"c" : 1,},			
			{	"t" : "ulong",	"k" : "udropgold",	"c" : 1,},			
			{	"t" : "ulong",	"k" : "uattackhp",	"c" : 1,},			
			{	"t" : "ulong",	"k" : "uspace",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btshapetype",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "bttype",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nnextstagemonsterid",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btnextstagecondition",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nnextstagevalue",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nstatusid1",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nstatusid1level",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nstatusid2",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nstatusid2level",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nstatusid3",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nstatusid3level",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nstatusid4",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nstatusid4level",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nstatusid5",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nstatusid5level",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nbookspicid",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btbookstagid",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btbookssortid",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nopenwarid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nopenkillcount",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nopenrewarddiamonds",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nopenrewardfaceid",	"c" : 1,},
		]

}
export class GS_MonsterManualUpDate  {			
	nmonsterid : number;			
	btstate : number;			
	ndiamonds : number;			
	nrewardfaceid : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nmonsterid",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btstate",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ndiamonds",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nrewardfaceid",	"c" : 1,},
		]

}
export class GS_MonsterManualListData  {			
	uitemsize : number;			
	uitemcount : number;			
	monsterlist : GS_MonsterManualListData_MonsterItem[];
	monsterlistClass : any = GS_MonsterManualListData_MonsterItem;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"k" : "uitemsize",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uitemcount",	"c" : 1,},			
			{	"s" : "uitemsize",	"t" : "GS_MonsterManualListData_MonsterItem",	"c" : 0,	"k" : "monsterlist",	"ck" : "uitemcount",},
		]

}
export class GS_MonsterManualListData_MonsterItem  {			
	nmonsterid : number;			
	nkillcount : number;			
	btstate : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nmonsterid",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nkillcount",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btstate",	"c" : 1,},
		]

}
export class GS_MonsterManualInfo  {			
	btclientclear : number;			
	uitemsize : number;			
	uitemcount : number;			
	monsterlist : GS_MonsterManualInfo_MonsterItem[];
	monsterlistClass : any = GS_MonsterManualInfo_MonsterItem;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"k" : "btclientclear",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uitemsize",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uitemcount",	"c" : 1,},			
			{	"s" : "uitemsize",	"t" : "GS_MonsterManualInfo_MonsterItem",	"c" : 0,	"k" : "monsterlist",	"ck" : "uitemcount",},
		]

}
export class GS_MonsterManualSetDetails  {			
	nmonsterid : number;			
	btbookshpscore : number;			
	btbooksspeedscore : number;			
	szbooksdes : string;			
	szbooksskilldes : string;			
	nopenwarid : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nmonsterid",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btbookshpscore",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btbooksspeedscore",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szbooksdes",	"c" : 64,},			
			{	"t" : "stchar",	"k" : "szbooksskilldes",	"c" : 64,},			
			{	"t" : "sint64",	"k" : "nopenwarid",	"c" : 1,},
		]

}
export class GS_MonsterMaunalGetReward  {			
	nmonsterid : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nmonsterid",	"c" : 1,},
		]

}
export class GS_MonsterManualGetDetails  {			
	nmonsterid : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nmonsterid",	"c" : 1,},
		]

}
export class GS_MonsterManualBox  {			
	btstate : number;			
	uitemsize : number;			
	uitemcount : number;			
	monsterboxlist : GS_MonsterManualBox_MonsterBoxItem[];
	monsterboxlistClass : any = GS_MonsterManualBox_MonsterBoxItem;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"k" : "btstate",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uitemsize",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uitemcount",	"c" : 1,},			
			{	"s" : "uitemsize",	"t" : "GS_MonsterManualBox_MonsterBoxItem",	"c" : 0,	"k" : "monsterboxlist",	"ck" : "uitemcount",},
		]

}
export class GS_MonsterManualBox_MonsterBoxItem  {			
	nmonsterboxid : number;			
	nmonsterid : number[];			
	nbronspacetimes : number[];			
	nrandcount : number;			
	btrandmode : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nmonsterboxid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nmonsterid",	"c" : 8,},			
			{	"t" : "slong",	"k" : "nbronspacetimes",	"c" : 8,},			
			{	"t" : "slong",	"k" : "nrandcount",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btrandmode",	"c" : 1,},
		]

}
 

 