export enum GS_TIPS_MSG
{
	GAME_TIPS_MSG				= 0,	// ��ʾ��Ϣ
	GAME_TIPS_KEEPGAMESTATE		= 1,	// ֪ͨ�ͻ��˱�����Ϸ״̬�����ֳ�֮����л�ʱ���ã�	
}
export enum GAME_TIPS_ID
{
	GAME_TIPS_ERROR_LOGIN			= 0,	//	��¼����
	GAME_TIPS_ERROR_KICK			= 1,	//	������Ϣ
	GAME_TIPS_ERROR_DB				= 2,	//	���ݿ����
	GAME_TIPS_NORMAL				= 3,	//	�޴���,������ʾ��Ϣ
	GAME_TIPS_LIMITEVERYDAYRECHARGE	= 4,	//	���ճ�ֵ�޶�
	GAME_TIPS_LIMITALLRECHARGE		= 5,	//	�ܳ�ֵ�޶�
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
 

 