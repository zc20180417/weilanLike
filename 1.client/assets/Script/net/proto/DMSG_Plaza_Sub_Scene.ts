export enum GS_PLAZA_SCENE_MSG
{
	PLAZA_SCENE_THINGINFO				= 0,		//���������Ϣ									s->c
	PLAZA_SCENE_WORLDINFO				= 1,		//���糡����Ϣ									s->c
	PLAZA_SCENE_WORLDDATA				= 2,		//���糡����������								s->c
	PLAZA_SCENE_REQUESTWAR				= 3,		//����ս��										c->s
	PLAZA_SCENE_OPENWAR					= 4,		//ս������										s->c
	PLAZA_SCENE_REQUESTWARFINISH		= 5,		//����ͨ��ս��									c->s
	PLAZA_SCENE_WARFINISH				= 6,		//ͨ�����										s->c
	PLAZA_SCENE_REQUESTWARFAIL			= 7,		//����ͨ��ʧ��									c->s
	PLAZA_SCENE_WARFAIL					= 8,		//ʧ�ܷ���										s->c
	PLAZA_SCENE_RESET					= 9,		//�������ã��ͻ�����ʾ������������ս����		s->c	
	PLAZA_SCENE_KILLMONSTER				= 10,		//��ɱ����										c->s
	PLAZA_SCENE_MONSTERDIEDROP			= 11,		//������������									s->c
	PLAZA_SCENE_GETWORLDWARLIST			= 12,		//�����½���������йؿ��б�					c->s
	PLAZA_SCENE_SETWORLDWARLIST			= 13,		//�·��½���������йؿ��б�					s->c
	PLAZA_SCENE_GETWARDETAILS			= 14,		//��ùؿ�����									c->s
	PLAZA_SCENE_SETWARDETATLS			= 15,		//�·��ؿ�����									s->c	
	PLAZA_SCENE_WARFREEVIDEO			= 16,		//�·�����ؿ�����Ƶ����						s->c
	PLAZA_SCENE_WARUSESKILL				= 17,		//ʹ�ü��ܿ�									c->s
	PLAZA_SCENE_GETPERFECTREWARD		= 18,		//��ȡ����ͨ�ؽ���								c->s
	PLAZA_SCENE_SETPERFECTREWARD		= 19,		//�·�����ͨ�ؽ���								c->s
	PLAZA_SCENE_GETWARFINISHFREEVIDEO	= 20,		//����ͨ�������Ƶ�ӱ�����						c->s
	PLAZA_SCENE_SETWARFINISHFREEVIDEO	= 21,		//�·�ͨ�������Ƶ�ӱ���������					s->c
	PLAZA_SCENE_GETFULLHPFREEVIDEO		= 22,		//������Ѫ������Ƶ								c->s
	PLAZA_SCENE_SETFULLHPFREEVIDEO		= 23,		//�·���Ѫ������Ƶ����							s->c
	PLAZA_SCENE_FULLHP					= 24,		//֪ͨ�ͻ�����Ѫ����							s->c
	PLAZA_SCENE_GETFULLHPDIAMONDS		= 25,		//ʹ����ʯ��Ѫ����								c->s
	PLAZA_SCENE_BATTLEDATA				= 26,		//ս����������									s->c
	PLAZA_SCENE_USELOSTADDATTACKPER		= 27,		//�ͻ���ȷ��ʹ�ù���BUFF						c->s	
	PLAZA_SCENE_GETTEACHINGFV			= 28,		//�����ѧ��Ƶ����								c->s
	PLAZA_SCENE_SETTEACHINGFV			= 29,		//�·���ѧ��Ƶ����								s->c
	PLAZA_SCENE_SETTEACHINGINFO			= 30,		//�·���ѧ����ͼƬID�б�						s->c
	PLAZA_SCENE_GETWARMYBULLETCHAT		= 31,		//����ҵ�������Ϣ								c->s
	PLAZA_SCENE_WARMYBULLETCHAT			= 32,		//�·��ҵ�������Ϣ								s->c
	PLAZA_SCENE_SETWARMYBULLETCHAT		= 33,		//����������Ϣ									c->s
	PLAZA_SCENE_RETSETWARMYBULLETCHAT	= 34,		//����������Ϣ����								s->c
	PLAZA_SCENE_GETWARBULLETCHAT		= 35,		//���ĳ���ؿ���������Ϣ						c->s
	PLAZA_SCENE_WARBULLETCHAT			= 36,		//�·�ĳ����Ǯ��������Ϣ						s->c
	PLAZA_SCENE_REQUESTEXPERIENCEWAR	= 37,		//���������									c->s
	PLAZA_SCENE_SETEXPERIENCEWAR		= 38,		//�·������									s->c	
	PLAZA_SCENE_GETLOSTFV				= 39,		//����ʧ����Ƶ�ӳɶ���							c->s
	PLAZA_SCENE_SETLOSTFV				= 40,		//�·�ʧ����Ƶ�ӳɶ���							s->c
	PLAZA_SCENE_FINISHLOSTFV			= 41,		//ʧ����Ƶ�ӳɶ������							s->c	
	PLAZA_SCENE_GETWARTROOPSORDER		= 42,		//��ùؿ��Ƽ���䶩��							c->s
	PLAZA_SCENE_SETWARTROOPSORDER		= 43,		//�·��ؿ��Ƽ���䶩��							s->c
	PLAZA_SCENE_KILLDOOR				= 44,		//��ɱ������									c->s

	PLAZA_SCENE_PASS_WAR				= 45,		//��������ս��									c->s
	PLAZA_SCENE_PASS_WAR_CONFIG			= 46,		//��������										s->c

	PLAZA_SCENE_MAX
}
export class GS_SceneHead  {
	protoList:any[] = 
		[
		]

}
export class GS_SceneGetWarMyBulletChat  {			
	nwarid : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"k" : "nwarid",	"c" : 1,},
		]

}
export class GS_SceneGetWorldWarList  {			
	bttype : number;			
	nworldid : number;			
	btmode : number;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"k" : "bttype",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nworldid",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btmode",	"c" : 1,},
		]

}
export class GS_SceneSetWarDetails  {			
	nwarid : number;			
	btjoinfv : number;			
	btdifflv : number;			
	btplaytype : number;			
	btisopenmap : number;			
	szname : string;			
	szdes : string;			
	uopenneedstrength : number;			
	btopenrolecards : number[];			
	szsceneres : string;			
	uscoreflag : number;			
	task : GS_SceneSetWarDetails_TaskInfo[];
	taskClass : any = GS_SceneSetWarDetails_TaskInfo;			
	nminpower : number;			
	btsetbulletchat : number;			
	nlastbulletchatindexes : number;			
	nmonsteridlist : number[];
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nwarid",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btjoinfv",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btdifflv",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btplaytype",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btisopenmap",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szname",	"c" : 32,},			
			{	"t" : "stchar",	"k" : "szdes",	"c" : 32,},			
			{	"t" : "ushort",	"k" : "uopenneedstrength",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btopenrolecards",	"c" : 8,},			
			{	"t" : "stchar",	"k" : "szsceneres",	"c" : 32,},			
			{	"t" : "ushort",	"k" : "uscoreflag",	"c" : 1,},			
			{	"t" : "GS_SceneSetWarDetails_TaskInfo",	"k" : "task",	"c" : 3,},			
			{	"t" : "sint64",	"k" : "nminpower",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btsetbulletchat",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nlastbulletchatindexes",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nmonsteridlist",	"c" : 64,},
		]

}
export class GS_SceneWarMyBulletChat  {			
	nwarid : number;			
	szbulletchat : string;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"k" : "nwarid",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szbulletchat",	"c" : 32,},
		]

}
export class GS_SceneWarFreeVideo  {			
	szorder : string;			
	nsdkid : number;			
	szsdkkey : string;
	protoList:any[] = 
		[			
			{	"t" : "stchar",	"k" : "szorder",	"c" : 32,},			
			{	"t" : "slong",	"k" : "nsdkid",	"c" : 1,},			
			{	"t" : "char",	"k" : "szsdkkey",	"c" : 32,},
		]

}
export class GS_SceneWorldInfo_HideWarShareConfig  {			
	szbgpic : string;			
	btpathtype : number;			
	szpathres : string;			
	nopennormalwarid : number;
	protoList:any[] = 
		[			
			{	"t" : "stchar",	"k" : "szbgpic",	"c" : 32,},			
			{	"t" : "uchar",	"k" : "btpathtype",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szpathres",	"c" : 32,},			
			{	"t" : "sint64",	"k" : "nopennormalwarid",	"c" : 1,},
		]

}
export class GS_SceneGetAddFreeVideo  {
	protoList:any[] = 
		[
		]

}
export class GS_SceneSetExperienceWar_RefMonsterData  {			
	nappeartime : number;			
	nspace : number;			
	nbloodratio : number;			
	npoint1monterboxid : number;			
	npoint2monterboxid : number;			
	npoint3monterboxid : number;			
	npoint4monterboxid : number;			
	npoint5monterboxid : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nappeartime",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nspace",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nbloodratio",	"c" : 1,},			
			{	"t" : "slong",	"k" : "npoint1monterboxid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "npoint2monterboxid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "npoint3monterboxid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "npoint4monterboxid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "npoint5monterboxid",	"c" : 1,},
		]

}
export class GS_ScenePassWarConfig  {			
	ngoodsid : number;			
	nnormalcommongoodsnum : number;			
	nnormalbossgoodsnum : number;			
	nhardcommongoodsnum : number;			
	nhardbossgoodsnum : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "ngoodsid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nnormalcommongoodsnum",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nnormalbossgoodsnum",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nhardcommongoodsnum",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nhardbossgoodsnum",	"c" : 1,},
		]

}
export class GS_SceneOpenWar_RefMonsterData  {			
	nappeartime : number;			
	nspace : number;			
	nbloodratio : number;			
	npoint1monterboxid : number;			
	npoint2monterboxid : number;			
	npoint3monterboxid : number;			
	npoint4monterboxid : number;			
	npoint5monterboxid : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nappeartime",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nspace",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nbloodratio",	"c" : 1,},			
			{	"t" : "slong",	"k" : "npoint1monterboxid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "npoint2monterboxid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "npoint3monterboxid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "npoint4monterboxid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "npoint5monterboxid",	"c" : 1,},
		]

}
export class GS_SceneSetPerfectReward  {			
	nwarid : number;			
	uoldscoreflag : number;			
	uscoreflag : number;			
	uitemsize : number;			
	uitemcount : number;			
	dropgoodslist : GS_SceneSetPerfectReward_DropGoodsList[];
	dropgoodslistClass : any = GS_SceneSetPerfectReward_DropGoodsList;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nwarid",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uoldscoreflag",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uscoreflag",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uitemsize",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uitemcount",	"c" : 1,},			
			{	"t" : "GS_SceneSetPerfectReward_DropGoodsList",	"c" : 0,	"k" : "dropgoodslist",	"s" : "uitemsize",	"ck" : "uitemcount",},
		]

}
export class GS_SceneWorldData  {			
	ubaseitemsize : number;			
	ubaseitemcount : number;			
	uitemsize : number;			
	uitemcount : number;			
	uharditemsize : number;			
	uharditemcount : number;			
	data1 : GS_SceneWorldData_Base[];
	data1Class : any = GS_SceneWorldData_Base;			
	data2 : GS_SceneWorldData_WolrdData[];
	data2Class : any = GS_SceneWorldData_WolrdData;			
	data3 : GS_SceneWorldData_HardWolrdData[];
	data3Class : any = GS_SceneWorldData_HardWolrdData;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"k" : "ubaseitemsize",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "ubaseitemcount",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uitemsize",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uitemcount",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uharditemsize",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uharditemcount",	"c" : 1,},			
			{	"t" : "GS_SceneWorldData_Base",	"s" : "ubaseitemsize",	"k" : "data1",	"c" : 0,	"ck" : "ubaseitemcount",},			
			{	"t" : "GS_SceneWorldData_WolrdData",	"s" : "uitemsize",	"k" : "data2",	"c" : 0,	"ck" : "uitemcount",},			
			{	"t" : "GS_SceneWorldData_HardWolrdData",	"s" : "uharditemsize",	"k" : "data3",	"c" : 0,	"ck" : "uharditemcount",},
		]

}
export class GS_SceneGetTeachingFV  {			
	nwarid : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nwarid",	"c" : 1,},
		]

}
export class GS_SceneRequestWar  {			
	nwarid : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"k" : "nwarid",	"c" : 1,},
		]

}
export class GS_SceneWarFail  {			
	nwarid : number;			
	nrmb : number;			
	ngoodsid : number;			
	ngoodsnum : number;			
	btbuytype : number;			
	nneedgoodsid : number;			
	nneedgoodsnum : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nwarid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nrmb",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsnum",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btbuytype",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nneedgoodsid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nneedgoodsnum",	"c" : 1,},
		]

}
export class GS_SceneWorldInfo_HardWorldItem  {			
	bttype : number;			
	nworldid : number;			
	szname : string;			
	szdes : string;			
	szbgmusic : string;			
	nstartwarid : number;			
	nendwarid : number;			
	szbgpic : string;			
	btpathtype : number;			
	szpathres : string;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"k" : "bttype",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nworldid",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szname",	"c" : 32,},			
			{	"t" : "stchar",	"k" : "szdes",	"c" : 64,},			
			{	"t" : "stchar",	"k" : "szbgmusic",	"c" : 32,},			
			{	"t" : "sint64",	"k" : "nstartwarid",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nendwarid",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szbgpic",	"c" : 32,},			
			{	"t" : "uchar",	"k" : "btpathtype",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szpathres",	"c" : 32,},
		]

}
export class GS_SceneGetFullHPFreeVideo  {			
	nwarid : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"k" : "nwarid",	"c" : 1,},
		]

}
export class GS_SceneGetWarTroopsOrder  {			
	nwarid : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nwarid",	"c" : 1,},
		]

}
export class GS_SceneSetWorldWarList  {			
	bttype : number;			
	nworldid : number;			
	btmode : number;			
	uitemsize : number;			
	uitemcount : number;			
	warlist : GS_SceneSetWorldWarList_WorldWarItem[];
	warlistClass : any = GS_SceneSetWorldWarList_WorldWarItem;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"k" : "bttype",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nworldid",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btmode",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uitemsize",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uitemcount",	"c" : 1,},			
			{	"t" : "GS_SceneSetWorldWarList_WorldWarItem",	"c" : 0,	"k" : "warlist",	"s" : "uitemsize",	"ck" : "uitemcount",},
		]

}
export class GS_SceneWarFinish  {			
	nwarid : number;			
	nfirsttime : number;			
	uoldscoreflag : number;			
	uscoreflag : number;			
	btfreevideo : number;			
	nthreestarcount : number;			
	nthreegradecount : number;			
	nclearthingcount : number;			
	nleftfveevideocount : number;			
	nworldid : number;			
	nperfectcount : number;			
	uitemsize : number;			
	uitemcount : number;			
	dropgoodslist : GS_SceneWarFinish_DropGoodsList[];
	dropgoodslistClass : any = GS_SceneWarFinish_DropGoodsList;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nwarid",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nfirsttime",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uoldscoreflag",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uscoreflag",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btfreevideo",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nthreestarcount",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nthreegradecount",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nclearthingcount",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nleftfveevideocount",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nworldid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nperfectcount",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uitemsize",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uitemcount",	"c" : 1,},			
			{	"t" : "GS_SceneWarFinish_DropGoodsList",	"c" : 0,	"k" : "dropgoodslist",	"s" : "uitemsize",	"ck" : "uitemcount",},
		]

}
export class GS_MonsterDieDrop  {			
	nmonsterid : number;			
	nkillcount : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nmonsterid",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nkillcount",	"c" : 1,},
		]

}
export class GS_SceneSetWarTroopsOrder  {			
	szorder : string;			
	nrmb : number;
	protoList:any[] = 
		[			
			{	"t" : "stchar",	"k" : "szorder",	"c" : 32,},			
			{	"t" : "slong",	"k" : "nrmb",	"c" : 1,},
		]

}
export class GS_SceneWorldInfo  {			
	hidewarshare : GS_SceneWorldInfo_HideWarShareConfig;
	hidewarshareClass : any = GS_SceneWorldInfo_HideWarShareConfig;			
	uitemsize : number;			
	uitemcount : number;			
	uharditemsize : number;			
	uharditemcount : number;			
	data1 : GS_SceneWorldInfo_WorldItem[];
	data1Class : any = GS_SceneWorldInfo_WorldItem;			
	data2 : GS_SceneWorldInfo_HardWorldItem[];
	data2Class : any = GS_SceneWorldInfo_HardWorldItem;
	protoList:any[] = 
		[			
			{	"t" : "GS_SceneWorldInfo_HideWarShareConfig",	"k" : "hidewarshare",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uitemsize",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uitemcount",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uharditemsize",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uharditemcount",	"c" : 1,},			
			{	"t" : "GS_SceneWorldInfo_WorldItem",	"s" : "uitemsize",	"k" : "data1",	"c" : 0,	"ck" : "uitemcount",},			
			{	"t" : "GS_SceneWorldInfo_HardWorldItem",	"s" : "uharditemsize",	"k" : "data2",	"c" : 0,	"ck" : "uharditemcount",},
		]

}
export class GS_SceneFullHP  {			
	nwarid : number;			
	nhp : number;			
	ntimes : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"k" : "nwarid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nhp",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ntimes",	"c" : 1,},
		]

}
export class GS_SceneReset  {			
	btresetcase : number;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"k" : "btresetcase",	"c" : 1,},
		]

}
export class GS_SceneSetExperienceWar  {			
	nwarid : number;			
	szname : string;			
	szsceneres : string;			
	szdes : string;			
	szbgmusic : string;			
	szbgpic : string;			
	btpathtype : number;			
	szpathres : string;			
	utipsid : number;			
	btplaytype : number;			
	nplaytimes : number;			
	nrolehp : number;			
	nloopratio : number;			
	nloopcount : number;			
	nmonsterhpaddper : number;			
	nscenehpaddper : number;			
	btopenrolecards : number[];			
	nopenskillcards : number[];			
	nguideskillcardsnums : number[];			
	btisopenmap : number;			
	ninitgold : number;			
	btwinrule : number[];			
	nclearscenethingid : number[];			
	uitemsize : number;			
	uitemcount : number;			
	refmonsterlist : GS_SceneSetExperienceWar_RefMonsterData[];
	refmonsterlistClass : any = GS_SceneSetExperienceWar_RefMonsterData;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nwarid",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szname",	"c" : 32,},			
			{	"t" : "stchar",	"k" : "szsceneres",	"c" : 32,},			
			{	"t" : "stchar",	"k" : "szdes",	"c" : 32,},			
			{	"t" : "stchar",	"k" : "szbgmusic",	"c" : 32,},			
			{	"t" : "stchar",	"k" : "szbgpic",	"c" : 32,},			
			{	"t" : "uchar",	"k" : "btpathtype",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szpathres",	"c" : 32,},			
			{	"t" : "ushort",	"k" : "utipsid",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btplaytype",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nplaytimes",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nrolehp",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nloopratio",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nloopcount",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nmonsterhpaddper",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nscenehpaddper",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btopenrolecards",	"c" : 8,},			
			{	"t" : "slong",	"k" : "nopenskillcards",	"c" : 10,},			
			{	"t" : "slong",	"k" : "nguideskillcardsnums",	"c" : 10,},			
			{	"t" : "uchar",	"k" : "btisopenmap",	"c" : 1,},			
			{	"t" : "ulong",	"k" : "ninitgold",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btwinrule",	"c" : 4,},			
			{	"t" : "slong",	"k" : "nclearscenethingid",	"c" : 8,},			
			{	"t" : "ushort",	"k" : "uitemsize",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uitemcount",	"c" : 1,},			
			{	"t" : "GS_SceneSetExperienceWar_RefMonsterData",	"c" : 0,	"k" : "refmonsterlist",	"s" : "uitemsize",	"ck" : "uitemcount",},
		]

}
export class GS_SceneWarBulletChat_BulletChatItem  {			
	nindexes : number;			
	nactordbid : number;			
	szbulletchat : string;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"k" : "nindexes",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nactordbid",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szbulletchat",	"c" : 32,},
		]

}
export class GS_SceneOpenWar_WarTaskData  {			
	bttype : number;			
	npicid : number;			
	nmarkpicid : number;			
	szdes : string;			
	nrewardgoodsid : number;			
	nrewardgoodsnums : number;			
	nparams : number[];
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"k" : "bttype",	"c" : 1,},			
			{	"t" : "slong",	"k" : "npicid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nmarkpicid",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szdes",	"c" : 64,},			
			{	"t" : "slong",	"k" : "nrewardgoodsid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nrewardgoodsnums",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nparams",	"c" : 6,},
		]

}
export class GS_SceneSetFullHPFreeVideo  {			
	nwarid : number;			
	szorder : string;			
	nsdkid : number;			
	szsdkkey : string;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"k" : "nwarid",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szorder",	"c" : 32,},			
			{	"t" : "slong",	"k" : "nsdkid",	"c" : 1,},			
			{	"t" : "char",	"k" : "szsdkkey",	"c" : 32,},
		]

}
export class GS_SceneRequestWarFail  {			
	nwarid : number;			
	btvalid : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nwarid",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btvalid",	"c" : 1,},
		]

}
export class GS_SceneGetWarDetails  {			
	nwarid : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nwarid",	"c" : 1,},
		]

}
export class GS_SceneWarFinish_DropGoodsList  {			
	ngoodsid : number;			
	ngoodsnum : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "ngoodsid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsnum",	"c" : 1,},
		]

}
export class GS_SceneGetLostFV  {			
	nwarid : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nwarid",	"c" : 1,},
		]

}
export class GS_SceneSetPerfectReward_DropGoodsList  {			
	ngoodsid : number;			
	ngoodsnum : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "ngoodsid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ngoodsnum",	"c" : 1,},
		]

}
export class GS_SceneGetWarBulletChat  {			
	nwarid : number;			
	nindexes : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"k" : "nwarid",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nindexes",	"c" : 1,},
		]

}
export class GS_SceneWarUseSkill  {			
	nskillcardid : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nskillcardid",	"c" : 1,},
		]

}
export class GS_SceneOpenWar  {			
	nwarid : number;			
	nfaileventid : number;			
	uhistoryscoreflag : number;			
	szname : string;			
	szsceneres : string;			
	szdes : string;			
	szbgmusic : string;			
	utipsid : number;			
	btplaytype : number;			
	nplaytimes : number;			
	nrolehp : number;			
	nloopratio : number;			
	nloopcount : number;			
	nmonsterhpaddper : number;			
	nscenehpaddper : number;			
	nrewardgoodsid : number;			
	nrewardgoodsnum : number;			
	ntrophyrewardgoodsid : number;			
	ntrophyrewardgoodsnum : number;			
	uopenneedstrength : number;			
	btopenrolecards : number[];			
	nopenskillcards : number[];			
	nguideskillcardsnums : number[];			
	btisopenmap : number;			
	ninitgold : number;			
	btwinrule : number[];			
	nclearscenethingid : number[];			
	nstar2rule : number;			
	nstar3rule : number;			
	tasklist : GS_SceneOpenWar_WarTaskData[];
	tasklistClass : any = GS_SceneOpenWar_WarTaskData;			
	nreconnectionid : number;			
	nfullhpneeddiamonds : number;			
	btcanfullhp : number;			
	btlostfv : number;			
	nlostaddgold : number;			
	nlostcount : number;			
	nlostaddgoodsids : number[];			
	nlostaddgoodsnums : number[];			
	nlostaddattackper : number;			
	nminpower : number;			
	bthaveteaching : number;			
	btfvstate : number;			
	uitemsize : number;			
	uitemcount : number;			
	refmonsterlist : GS_SceneOpenWar_RefMonsterData[];
	refmonsterlistClass : any = GS_SceneOpenWar_RefMonsterData;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nwarid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nfaileventid",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uhistoryscoreflag",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szname",	"c" : 32,},			
			{	"t" : "stchar",	"k" : "szsceneres",	"c" : 32,},			
			{	"t" : "stchar",	"k" : "szdes",	"c" : 32,},			
			{	"t" : "stchar",	"k" : "szbgmusic",	"c" : 32,},			
			{	"t" : "ushort",	"k" : "utipsid",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btplaytype",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nplaytimes",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nrolehp",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nloopratio",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nloopcount",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nmonsterhpaddper",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nscenehpaddper",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nrewardgoodsid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nrewardgoodsnum",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ntrophyrewardgoodsid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ntrophyrewardgoodsnum",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uopenneedstrength",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btopenrolecards",	"c" : 8,},			
			{	"t" : "slong",	"k" : "nopenskillcards",	"c" : 10,},			
			{	"t" : "slong",	"k" : "nguideskillcardsnums",	"c" : 10,},			
			{	"t" : "uchar",	"k" : "btisopenmap",	"c" : 1,},			
			{	"t" : "ulong",	"k" : "ninitgold",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btwinrule",	"c" : 4,},			
			{	"t" : "slong",	"k" : "nclearscenethingid",	"c" : 8,},			
			{	"t" : "slong",	"k" : "nstar2rule",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nstar3rule",	"c" : 1,},			
			{	"t" : "GS_SceneOpenWar_WarTaskData",	"k" : "tasklist",	"c" : 3,},			
			{	"t" : "sint64",	"k" : "nreconnectionid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nfullhpneeddiamonds",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btcanfullhp",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btlostfv",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nlostaddgold",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nlostcount",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nlostaddgoodsids",	"c" : 10,},			
			{	"t" : "slong",	"k" : "nlostaddgoodsnums",	"c" : 10,},			
			{	"t" : "slong",	"k" : "nlostaddattackper",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nminpower",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "bthaveteaching",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btfvstate",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uitemsize",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uitemcount",	"c" : 1,},			
			{	"t" : "GS_SceneOpenWar_RefMonsterData",	"c" : 0,	"k" : "refmonsterlist",	"s" : "uitemsize",	"ck" : "uitemcount",},
		]

}
export class GS_SceneRetSetWarMyBulletChat  {			
	nwarid : number;			
	szbulletchat : string;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"k" : "nwarid",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szbulletchat",	"c" : 32,},
		]

}
export class GS_SceneSetTeachingInfo  {			
	nwarid : number;			
	npicid : number[];
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"k" : "nwarid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "npicid",	"c" : 10,},
		]

}
export class GS_SceneSetWarDetails_TaskInfo  {			
	bttype : number;			
	npicid : number;			
	szdes : string;			
	nrewardgoodsid : number;			
	nrewardgoodsnums : number;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"k" : "bttype",	"c" : 1,},			
			{	"t" : "slong",	"k" : "npicid",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szdes",	"c" : 64,},			
			{	"t" : "slong",	"k" : "nrewardgoodsid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nrewardgoodsnums",	"c" : 1,},
		]

}
export class GS_SceneRequestWarFinish  {			
	nwarid : number;			
	uscoreflag : number;			
	nlefthp : number;			
	nlefttime : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nwarid",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uscoreflag",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nlefthp",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nlefttime",	"c" : 1,},
		]

}
export class GS_SceneFinishLostFV  {			
	nwarid : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nwarid",	"c" : 1,},
		]

}
export class GS_SceneUseLostAddAttackPer  {
	protoList:any[] = 
		[
		]

}
export class GS_SceneSetAddFreeVideo  {			
	szorder : string;			
	nsdkid : number;			
	szsdkkey : string;
	protoList:any[] = 
		[			
			{	"t" : "stchar",	"k" : "szorder",	"c" : 32,},			
			{	"t" : "slong",	"k" : "nsdkid",	"c" : 1,},			
			{	"t" : "char",	"k" : "szsdkkey",	"c" : 32,},
		]

}
export class GS_ScenePassWar  {			
	nwarid : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"k" : "nwarid",	"c" : 1,},
		]

}
export class GS_SceneGetPerfectReward  {			
	nwarid : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nwarid",	"c" : 1,},
		]

}
export class GS_SceneSetLostFV  {			
	szorder : string;			
	nsdkid : number;			
	szsdkkey : string;
	protoList:any[] = 
		[			
			{	"t" : "stchar",	"k" : "szorder",	"c" : 32,},			
			{	"t" : "slong",	"k" : "nsdkid",	"c" : 1,},			
			{	"t" : "char",	"k" : "szsdkkey",	"c" : 32,},
		]

}
export class GS_SceneFullHPDiamonds  {			
	nwarid : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"k" : "nwarid",	"c" : 1,},
		]

}
export class GS_SceneSetWorldWarList_WorldWarItem  {			
	nwarid : number;			
	uscoreflag : number;			
	nfirsttime : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nwarid",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uscoreflag",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nfirsttime",	"c" : 1,},
		]

}
export class GS_SceneThingInfo  {			
	uitemsize : number;			
	uitemcount : number;			
	thinglist : GS_SceneThingInfo_ThingItem[];
	thinglistClass : any = GS_SceneThingInfo_ThingItem;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"k" : "uitemsize",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uitemcount",	"c" : 1,},			
			{	"t" : "GS_SceneThingInfo_ThingItem",	"c" : 0,	"k" : "thinglist",	"s" : "uitemsize",	"ck" : "uitemcount",},
		]

}
export class GS_SceneWorldData_WolrdData  {			
	bttype : number;			
	nworldid : number;			
	nstr : number;			
	btperfect : number;			
	uperfectcount : number;			
	nfullhpwarcount : number;			
	nfulltaskwarcount : number;			
	nclearthingwarcount : number;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"k" : "bttype",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nworldid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nstr",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btperfect",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uperfectcount",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nfullhpwarcount",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nfulltaskwarcount",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nclearthingwarcount",	"c" : 1,},
		]

}
export class GS_SceneSetTeachingFV  {			
	nwarid : number;			
	szorder : string;			
	nsdkid : number;			
	szsdkkey : string;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"k" : "nwarid",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szorder",	"c" : 32,},			
			{	"t" : "slong",	"k" : "nsdkid",	"c" : 1,},			
			{	"t" : "char",	"k" : "szsdkkey",	"c" : 32,},
		]

}
export class GS_SceneBattleData  {			
	ntoplostwarid : number;			
	nlostcount : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"k" : "ntoplostwarid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nlostcount",	"c" : 1,},
		]

}
export class GS_SceneThingInfo_ThingItem  {			
	nthingid : number;			
	szres : string;			
	ubasehp : number;			
	bttype : number;			
	btdroptype : number;			
	udropvalue : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nthingid",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szres",	"c" : 32,},			
			{	"t" : "ulong",	"k" : "ubasehp",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "bttype",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btdroptype",	"c" : 1,},			
			{	"t" : "ulong",	"k" : "udropvalue",	"c" : 1,},
		]

}
export class GS_SceneRequestExperienceWar  {			
	nwarid : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"k" : "nwarid",	"c" : 1,},
		]

}
export class GS_SceneWorldData_HardWolrdData  {			
	bttype : number;			
	nworldid : number;			
	nstr : number;			
	btperfect : number;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"k" : "bttype",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nworldid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nstr",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btperfect",	"c" : 1,},
		]

}
export class GS_SceneSetWarMyBulletChat  {			
	nwarid : number;			
	szbulletchat : string;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"k" : "nwarid",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szbulletchat",	"c" : 32,},
		]

}
export class GS_SceneWarBulletChat  {			
	nwarid : number;			
	uitemsize : number;			
	uitemcount : number;			
	items : GS_SceneWarBulletChat_BulletChatItem[];
	itemsClass : any = GS_SceneWarBulletChat_BulletChatItem;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"k" : "nwarid",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uitemsize",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "uitemcount",	"c" : 1,},			
			{	"t" : "GS_SceneWarBulletChat_BulletChatItem",	"c" : 0,	"k" : "items",	"s" : "uitemsize",	"ck" : "uitemcount",},
		]

}
export class GS_SceneWorldInfo_WorldItem  {			
	bttype : number;			
	nworldid : number;			
	szname : string;			
	szdes : string;			
	szbgmusic : string;			
	nconditionid : number[];			
	ntotalstar : number;			
	nstartwarid : number;			
	nendwarid : number;			
	nhidwarids : number[];			
	szbgpic : string;			
	btpathtype : number;			
	szpathres : string;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"k" : "bttype",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nworldid",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szname",	"c" : 32,},			
			{	"t" : "stchar",	"k" : "szdes",	"c" : 64,},			
			{	"t" : "stchar",	"k" : "szbgmusic",	"c" : 32,},			
			{	"t" : "slong",	"k" : "nconditionid",	"c" : 10,},			
			{	"t" : "slong",	"k" : "ntotalstar",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nstartwarid",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nendwarid",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nhidwarids",	"c" : 10,},			
			{	"t" : "stchar",	"k" : "szbgpic",	"c" : 32,},			
			{	"t" : "uchar",	"k" : "btpathtype",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szpathres",	"c" : 32,},
		]

}
export class GS_SceneKillMonster  {			
	btheroattack : number;			
	nmonsterid : number;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"k" : "btheroattack",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nmonsterid",	"c" : 1,},
		]

}
export class GS_SceneWorldData_Base  {			
	nlastwarid : number;			
	nthreestarcount : number;			
	nthreegradecount : number;			
	nclearthingcount : number;			
	nfinishhidwarcount : number;			
	nperfectfinishhidwarcount : number;			
	nlastwarfinishtime : number;			
	nhardlastwarid : number;			
	nhardthreestarcount : number;			
	nhardthreegradecount : number;			
	nhardclearthingcount : number;			
	nopenhardmodewarid : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "nlastwarid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nthreestarcount",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nthreegradecount",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nclearthingcount",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nfinishhidwarcount",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nperfectfinishhidwarcount",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nlastwarfinishtime",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nhardlastwarid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nhardthreestarcount",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nhardthreegradecount",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nhardclearthingcount",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nopenhardmodewarid",	"c" : 1,},
		]

}
 

 