export enum GS_GAME_ACTORINFO_MSG
{
	GAME_ACTOR_PUBLIC			= 0,	//	玩家公有数据			s->c
	GAME_ACTOR_PRIVATE			= 1,	//	玩家私有数据			s->c
	GAME_ACTOR_VARIABLE			= 2,	//	玩家易变数字属性		s->c
	GAME_ACTOR_DESTORY			= 3,	//	玩家销毁(下线)			s->c	
	GAME_ACTOR_MAX
}
export class GS_GameActorInfoHead  {
	protoList:any[] = 
		[
		]

}
export class GS_GameActorDestory  {			
	nactordbid : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"k" : "nactordbid",	"c" : 1,},
		]

}
export class GS_GameActorPublicInfo  {			
	nactordbid : number;			
	szname : string;			
	szmd5facefile : string;			
	szsign : string;			
	btsex : number;			
	i64diamonds : number;			
	i64viplevel : number;			
	btguest : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"k" : "nactordbid",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szname",	"c" : 32,},			
			{	"t" : "stchar",	"k" : "szmd5facefile",	"c" : 33,},			
			{	"t" : "stchar",	"k" : "szsign",	"c" : 32,},			
			{	"t" : "uchar",	"k" : "btsex",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "i64diamonds",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "i64viplevel",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btguest",	"c" : 1,},
		]

}
export class GS_GameActorVariable_Variable  {			
	btpropid : number;			
	i64newvalue : number;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"k" : "btpropid",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "i64newvalue",	"c" : 1,},
		]

}
export class GS_GameActorVariable  {			
	nactordbid : number;			
	btpropcount : number;			
	svariable : GS_GameActorVariable_Variable[];
	svariableClass : any = GS_GameActorVariable_Variable;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"k" : "nactordbid",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btpropcount",	"c" : 1,},			
			{	"t" : "GS_GameActorVariable_Variable",	"k" : "svariable",	"c" : 0,},
		]

}
export class GS_GameActorPrivateInfo  {			
	nactordbid : number;			
	szname : string;			
	szmd5facefile : string;			
	szsign : string;			
	szphone : string;			
	btsex : number;			
	i64diamonds : number;			
	i64viplevel : number;			
	btguest : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"k" : "nactordbid",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szname",	"c" : 32,},			
			{	"t" : "stchar",	"k" : "szmd5facefile",	"c" : 33,},			
			{	"t" : "stchar",	"k" : "szsign",	"c" : 32,},			
			{	"t" : "stchar",	"k" : "szphone",	"c" : 24,},			
			{	"t" : "uchar",	"k" : "btsex",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "i64diamonds",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "i64viplevel",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btguest",	"c" : 1,},
		]

}
 

 