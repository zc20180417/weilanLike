export enum GS_GATEWAY_COMMAND_MSG
{	
	GATEWAY_COMMAND_TIPS				= 0,	//��ʾ��Ϣ					s->c
	GATEWAY_COMMAND_SOCKETERROR			= 1,	//������������ӱ��Ͽ�		s->c
	GATEWAY_COMMAND_KEEPACTIVE			= 2,	//�������缤��״̬			s->c
	GATEWAY_COMMAND_GETHTTPFILE			= 3,	//���HTTP�ļ�				c->s
	GATEWAY_COMMAND_SENDHTTPFILE		= 4,	//����HTTP�ļ�				s->c
	GATEWAY_COMMAND_MAINTENANCENOTICE	= 5,	//�·�ά��֪ͨ				s->c
	GATEWAY_COMMAND_SERVERCHECKACTIVE	= 6,	//�����������ͻ��˲���Ҫ����)	s->c
	GATEWAY_COMMAND_CONNECTROOM			= 7,	//���ӷ���					c->s
	GATEWAY_COMMAND_MAX
}
export enum GATEWAY_TIPS
{
	GATEWAY_TIPS_MAINTAIN		= 0,	//������ͣ��ά��
}
export enum CONNPROXY{ CONNPROXY_LOGIN, CONNPROXY_PLAZA, CONNPROXY_GAME }
export class GS_GatewayCommandHead  {
	protoList:any[] = 
		[
		]

}
export class GS_GetHttpFile  {			
	szfile : string;
	protoList:any[] = 
		[			
			{	"t" : "stchar",	"k" : "szfile",	"c" : 256,},
		]

}
export class GS_MaintenanceNotice  {			
	sznoticeurl : string;
	protoList:any[] = 
		[			
			{	"t" : "stchar",	"k" : "sznoticeurl",	"c" : 0,},
		]

}
export class GS_SendHttpFile  {			
	szfile : string;			
	btstate : number;			
	ufilesize : number;			
	data : number[];
	protoList:any[] = 
		[			
			{	"t" : "stchar",	"k" : "szfile",	"c" : 256,},			
			{	"t" : "uchar",	"k" : "btstate",	"c" : 1,},			
			{	"t" : "ulong",	"k" : "ufilesize",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "data",	"c" : 0,},
		]

}
export class GS_ServerCheckActive  {
	protoList:any[] = 
		[
		]

}
export class GS_GatewaySocketError  {			
	btservertype : number;			
	nserverid : number;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"k" : "btservertype",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nserverid",	"c" : 1,},
		]

}
export class GS_KeepActive  {			
	ntimer : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"k" : "ntimer",	"c" : 1,},
		]

}
export class GS_GatewayTips  {			
	bttype : number;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"k" : "bttype",	"c" : 1,},
		]

}
export class GS_GatewayConnect  {			
	nserverid : number;			
	nplazaid : number;			
	nplazachildid : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nserverid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nplazaid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nplazachildid",	"c" : 1,},
		]

}
 

 