export enum GS_GAME_LOGIN_MSG
{
	GAME_LOGIN_CLIENTLOGIN		= 0,		// µÇÂ¼			c->s	
	GAME_LOGIN_MAX
}
export class GS_GameLoginHead  {
	protoList:any[] = 
		[
		]

}
export class GS_GameLogin  {			
	nactordbid : number;			
	szloginkey : string;			
	gameversion : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"k" : "nactordbid",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szloginkey",	"c" : 32,},			
			{	"t" : "ulong",	"k" : "gameversion",	"c" : 1,},
		]

}
 

 