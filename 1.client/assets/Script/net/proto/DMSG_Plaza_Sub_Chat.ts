import FJByteArray from "../socket/FJByteArray";
export enum GS_PLAZA_CHAT_MSG
{	
	PLAZA_CHAT_SYSTEM			= 0,	// 系统消息					s->c
	PLAZA_CHAT_NEWSYSTEM		= 1,	// 新系统消息				s->c
	PLAZA_CHAT_POPSYSTEM		= 2,	// 弹出提示系统消息			s->c
	PLAZA_CHAT_POPSYSTEMTEXT	= 3,	// 弹出纯文本的系统消息		s->c
	PLAZA_CHAT_FRIEND			= 4,	// 好友聊天					c->s->c
	PLAZA_CHAT_MAX
}
export class GS_ChatHead  {			
	nactordbid : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"c" : 1,	"k" : "nactordbid",},
		]

}
export class GS_ChatSystem  {			
	nactordbid : number;			
	bttype : number;			
	slen : number;			
	szbuffer : FJByteArray;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"c" : 1,	"k" : "nactordbid",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "bttype",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "slen",},			
			{	"t" : "FJByteArray",	"c" : 0,	"k" : "szbuffer",},
		]

}
export class GS_ChatPopSystem  {			
	nactordbid : number;			
	szjumpurl : number[];			
	szurl : number[];
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"c" : 1,	"k" : "nactordbid",},			
			{	"t" : "uchar",	"c" : 256,	"k" : "szjumpurl",},			
			{	"t" : "uchar",	"c" : 256,	"k" : "szurl",},
		]

}
export class GS_ChatFriend  {			
	nactordbid : number;			
	nrecvactordbid : number;			
	szmsg : string;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"c" : 1,	"k" : "nactordbid",},			
			{	"t" : "sint64",	"c" : 1,	"k" : "nrecvactordbid",},			
			{	"t" : "stchar",	"c" : 0,	"k" : "szmsg",},
		]

}
export class GS_ChatNewSystem  {			
	nactordbid : number;			
	bttype : number;			
	utf8_json : string[];
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"c" : 1,	"k" : "nactordbid",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "bttype",},			
			{	"t" : "uchar_string",	"c" : 0,	"k" : "utf8_json",},
		]

}
export class GS_ChatPopSystemText  {			
	nactordbid : number;			
	szjumpurl : number[];			
	sztext : string;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"c" : 1,	"k" : "nactordbid",},			
			{	"t" : "uchar",	"c" : 256,	"k" : "szjumpurl",},			
			{	"t" : "stchar",	"c" : 0,	"k" : "sztext",},
		]

}
 

 