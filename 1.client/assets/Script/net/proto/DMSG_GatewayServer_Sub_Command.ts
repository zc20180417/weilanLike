export enum GS_GATEWAY_COMMAND_MSG
{	
	GATEWAY_COMMAND_TIPS				= 0,	//提示信息					s->c
	GATEWAY_COMMAND_SOCKETERROR			= 1,	//代理的网络连接被断开		s->c
	GATEWAY_COMMAND_KEEPACTIVE			= 2,	//保持网络激活状态			s->c
	GATEWAY_COMMAND_GETHTTPFILE			= 3,	//获得HTTP文件				c->s
	GATEWAY_COMMAND_SENDHTTPFILE		= 4,	//发送HTTP文件				s->c
	GATEWAY_COMMAND_MAINTENANCENOTICE	= 5,	//下发维护通知				s->c
	GATEWAY_COMMAND_SERVERCHECKACTIVE	= 6,	//服务器检测存活（客户端不需要处理)	s->c
	GATEWAY_COMMAND_CONNECTROOM			= 7,	//连接房间					c->s
	GATEWAY_COMMAND_MAX
}
export enum GATEWAY_TIPS
{
	GATEWAY_TIPS_MAINTAIN		= 0,	//服务器停机维护
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
 

 