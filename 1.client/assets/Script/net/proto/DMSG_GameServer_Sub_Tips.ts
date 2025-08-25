export enum GS_TIPS_MSG
{
	GAME_TIPS_MSG				= 0,	// 提示消息
	GAME_TIPS_KEEPGAMESTATE		= 1,	// 通知客户端保持游戏状态（新手场之类的切换时候用）	
}
export enum GAME_TIPS_ID
{
	GAME_TIPS_ERROR_LOGIN			= 0,	//	登录错误
	GAME_TIPS_ERROR_KICK			= 1,	//	踢人消息
	GAME_TIPS_ERROR_DB				= 2,	//	数据库出错
	GAME_TIPS_NORMAL				= 3,	//	无错误,仅仅提示信息
	GAME_TIPS_LIMITEVERYDAYRECHARGE	= 4,	//	单日充值限额
	GAME_TIPS_LIMITALLRECHARGE		= 5,	//	总充值限额
	GAME_TIPS_MAX
}
export class GS_GameTipsHead  {
	protoList:any[] = 
		[
		]

}
export class GS_GameTips  {			
	bttype : number;			
	szdes : string;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"k" : "bttype",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szdes",	"c" : 128,},
		]

}
export class GS_GameKeepGameState  {
	protoList:any[] = 
		[
		]

}
 

 