import FJByteArray from "../socket/FJByteArray";
export enum GS_GAME_CHAT_MSG
{
	GAME_CHAT_ROOM			= 0,	// ��������			c->s->c
	GAME_CHAT_PRIVATE		= 1,	// ˽��				c->s->c
	GAME_CHAT_TABLE			= 2,	// ��Ϸ��������		c->s->c
	GAME_CHAT_ROOMPHRASES	= 3,	// �������������	c->s->c
	GAME_CHAT_GAMEPHRASES	= 4,	// ��Ϸ���������	c->s->c
	GAME_CHAT_SYSTEM		= 5,	// ϵͳ��Ϣ			s->c
	GAME_CHAT_MAX
}
export enum GameParseType
{
	GameParseSound	= 0,	//��������
	GameParseFace	= 1,	//�������
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
 

 