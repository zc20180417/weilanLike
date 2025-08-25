import FJByteArray from "../socket/FJByteArray";
export enum GS_GAME_CHAT_MSG
{
	GAME_CHAT_ROOM			= 0,	// 房间聊天			c->s->c
	GAME_CHAT_PRIVATE		= 1,	// 私聊				c->s->c
	GAME_CHAT_TABLE			= 2,	// 游戏桌内聊天		c->s->c
	GAME_CHAT_ROOMPHRASES	= 3,	// 房间内聊天短语	c->s->c
	GAME_CHAT_GAMEPHRASES	= 4,	// 游戏内聊天短语	c->s->c
	GAME_CHAT_SYSTEM		= 5,	// 系统消息			s->c
	GAME_CHAT_MAX
}
export enum GameParseType
{
	GameParseSound	= 0,	//语音短语
	GameParseFace	= 1,	//表情短语
}
export class GS_GameChatHead  {			
	nactordbid : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"k" : "nactordbid",	"c" : 1,},
		]

}
export class GS_GameChatRoomPhrases  {			
	nactordbid : number;			
	sindex : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"k" : "nactordbid",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "sindex",	"c" : 1,},
		]

}
export class GS_GameChatSystem  {			
	nactordbid : number;			
	slen : number;			
	szbuffer : FJByteArray;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"k" : "nactordbid",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "slen",	"c" : 1,},			
			{	"t" : "FJByteArray",	"k" : "szbuffer",	"c" : 0,},
		]

}
export class GS_GameChatTable  {			
	nactordbid : number;			
	slen : number;			
	szbuffer : FJByteArray;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"k" : "nactordbid",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "slen",	"c" : 1,},			
			{	"t" : "FJByteArray",	"k" : "szbuffer",	"c" : 0,},
		]

}
export class GS_GameChatGamePhrases  {			
	nactordbid : number;			
	sindex : number;			
	stype : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"k" : "nactordbid",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "sindex",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "stype",	"c" : 1,},
		]

}
export class GS_GameChatPrivate  {			
	nactordbid : number;			
	nrecvactordbid : number;			
	slen : number;			
	szbuffer : FJByteArray;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"k" : "nactordbid",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nrecvactordbid",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "slen",	"c" : 1,},			
			{	"t" : "FJByteArray",	"k" : "szbuffer",	"c" : 0,},
		]

}
export class GS_GameChatRoom  {			
	nactordbid : number;			
	slen : number;			
	szbuffer : FJByteArray;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"k" : "nactordbid",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "slen",	"c" : 1,},			
			{	"t" : "FJByteArray",	"k" : "szbuffer",	"c" : 0,},
		]

}
 

 