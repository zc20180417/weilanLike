export enum GS_PLAZA_RELATION_MSG
{
	PLAZA_RELATION_INFO							= 0,	//����罻��Ϣ		s->c
	PLAZA_RELATION_NOTICEINFO					= 1,	//����罻֪ͨ��Ϣ	s->c

	PLAZA_RELATION_FIND							= 2,	//�����û�			c->s
	PLAZA_RELATION_FINDRETURN					= 3,	//�����û�����		s->c
	PLAZA_RELATION_ADD							= 4,	//���Ӻ���			c->s
	PLAZA_RELATION_ADDEND						= 5,	//���Ӻ���ȷ��		s->c
	PLAZA_RELATION_REWARD						= 6,	//���ͺ���			c->s->c
	PLAZA_RELATION_RETREWARD					= 7,	//���´���			s->c
	PLAZA_RELATION_CONFIRMNOTICE				= 8,	//ȷ��֪ͨ			c->s->c
	PLAZA_RELATION_TIPS							= 9,	//��ʾ��Ϣ			s->c
	PLAZA_RELATION_NEWNOTICE					= 10,	//�������·���֪ͨ	s->c
	PLAZA_RELATION_DELETE						= 11,	//ɾ������			c->s->c
	PLAZA_RELATION_DELETEEND					= 12,	//ɾ������ȷ��		s->c
	PLAZA_RELATION_UPDATENOTICE					= 13,	//����������һ��֪ͨs->c
	PLAZA_RELATION_FRIENDSTATE					= 14,	//����״̬����		s->c
	PLAZA_RELATION_GETRECOMMEND					= 15,	//��ȡ�Ƽ�����		c->s
	PLAZA_RELATION_SENDRECOMMEND				= 16,	//�·��Ƽ�����		s->c		
	PLAZA_RELATION_NEXTDAY						= 17,	//�����������͵�����s->c
	PLAZA_RELATION_UPWARID						= 18,	//�����û����¹ؿ�����	s->c
	PLAZA_RELATION_UPRANKSCORE					= 19,	//�����û����»���	s->c
	PLAZA_RELATION_UPFACE						= 20,	//�����û�ͷ��		s->c
	PLAZA_RELATION_UPBOUNTYCOOPERATIONLAYER		= 21,	//�����û����������ߵȼ� s->c
	PLAZA_RELATION_MAX
}
export enum RELATIONTIPS
	{
		RELATIONTIPS_LIMIT				= 0,	//���Ѵﵽ����
		RELATIONTIPS_ISFRIEND			= 1,	//�Ѿ��Ǻ���
		RELATIONTIPS_NOFRIEND			= 2,	//�����ڴ˺���
		RELATIONTIPS_MAXAWARD			= 3,	//���մ��ʹ����ﵽ����
		RELATIONTIPS_DBAWARD			= 4,	//�Ѿ����͹��˺���
		RELATIONTIPS_NORECIVE			= 5,	//û�жԷ��Ĵ�����Ϣ
		RELATIONTIPS_MAXRECIVE			= 6,	//������ȡ�Ѵﵽ����
		RELATIONTIPS_DBERROR			= 7,	//���ݿ��쳣
		RELATIONTIPS_NOFIND				= 8,	//��ѯ�û�ʧ��
		RELATIONTIPS_NORID				= 9,	//��������Ҫȷ�ϵ�֪ͨ
		RELATIONTIPS_MAXFRIEND			= 10,	//���Ѵﵽ����
		RELATIONTIPS_WAITVALIDATE		= 11,	//�ȴ��Է�������֤ͨ��
		RELATIONTIPS_MAXRECEIVEREWARD	= 12,	//������ʹ�����ȡ�ﵽ����
		RELATIONTIPS_NOACTORDETAILS		= 13,	//�޷��õ��û�������Ϣ
		RELATIONTIPS_NOGOLD				= 14,	//��Ҳ����޷�����
		RELATIONTIPS_REPEATREQUEST		= 15,	//�ظ��������Ӻ���,��ȴ��Է���֤ͨ��
		RELATIONTIPS_ISPLAYGAME			= 16,	//������Ϸ����,�޷����д˲���
		RELATIONTIPS_MAX
	}
export class GS_RelationHead  {
	protoList:any[] = 
		[
		]

}
export class GS_RelationConfirmNotice  {			
	nrid : number;			
	btnewstate : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"c" : 1,	"k" : "nrid",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btnewstate",},
		]

}
export class GS_RelationDeleteEnd  {			
	ndeleteactordbid : number;			
	btstate : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"c" : 1,	"k" : "ndeleteactordbid",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btstate",},
		]

}
export class GS_RelationAdd  {			
	nactordbid : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"c" : 1,	"k" : "nactordbid",},
		]

}
export class GS_RelationUpBountyCooperationLayer  {			
	nfrienddbid : number;			
	nbountycooperationlayer : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"c" : 1,	"k" : "nfrienddbid",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nbountycooperationlayer",},
		]

}
export class GS_RelationUpDateNotice  {			
	nrid : number;			
	btnewstate : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"c" : 1,	"k" : "nrid",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btnewstate",},
		]

}
export class GS_RelationFindReturn  {			
	nactordbid : number;			
	szname : string;			
	szmd5facefile : string;			
	btsex : number;			
	szarea : string;			
	nfaceid : number;			
	nfaceframeid : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"c" : 1,	"k" : "nactordbid",},			
			{	"t" : "stchar",	"c" : 32,	"k" : "szname",},			
			{	"t" : "stchar",	"c" : 33,	"k" : "szmd5facefile",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btsex",},			
			{	"t" : "stchar",	"c" : 64,	"k" : "szarea",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nfaceid",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nfaceframeid",},
		]

}
export class GS_RelationReward  {			
	nactordbid : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"c" : 1,	"k" : "nactordbid",},
		]

}
export class GS_RelationInfo  {			
	rewardactordbid : number[];			
	ulimitcount : number;			
	uitemsize : number;			
	uitemcount : number;			
	item : GS_RelationInfo_RelationItem[];
	itemClass : any = GS_RelationInfo_RelationItem;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"c" : 30,	"k" : "rewardactordbid",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "ulimitcount",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "uitemsize",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "uitemcount",},			
			{	"c" : 0,	"ck" : "uitemcount",	"t" : "GS_RelationInfo_RelationItem",	"s" : "uitemsize",	"k" : "item",},
		]

}
export class GS_RelationDelete  {			
	nactordbid : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"c" : 1,	"k" : "nactordbid",},
		]

}
export class GS_RelationUpWarID  {			
	nfrienddbid : number;			
	nlastwarid : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"c" : 1,	"k" : "nfrienddbid",},			
			{	"t" : "sint64",	"c" : 1,	"k" : "nlastwarid",},
		]

}
export class GS_RelationSendRecommend_RecommendFriend  {			
	nactordbid : number;			
	szname : string;			
	szmd5facefile : string;			
	btsex : number;			
	szarea : string;			
	nfaceid : number;			
	nfaceframeid : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"c" : 1,	"k" : "nactordbid",},			
			{	"t" : "stchar",	"c" : 32,	"k" : "szname",},			
			{	"t" : "stchar",	"c" : 33,	"k" : "szmd5facefile",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btsex",},			
			{	"t" : "stchar",	"c" : 64,	"k" : "szarea",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nfaceid",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nfaceframeid",},
		]

}
export class GS_RelationTips  {			
	stipsid : number;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"c" : 1,	"k" : "stipsid",},
		]

}
export class GS_RelationInfo_RelationItem  {			
	nactordbid : number;			
	szname : string;			
	szmd5facefile : string;			
	btsex : number;			
	nlastonlinetime : number;			
	btstate : number;			
	nlastwarid : number;			
	nrankscore : number;			
	btreward : number;			
	nfaceid : number;			
	nfaceframeid : number;			
	nbountycooperationlayer : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"c" : 1,	"k" : "nactordbid",},			
			{	"t" : "stchar",	"c" : 32,	"k" : "szname",},			
			{	"t" : "stchar",	"c" : 33,	"k" : "szmd5facefile",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btsex",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nlastonlinetime",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btstate",},			
			{	"t" : "sint64",	"c" : 1,	"k" : "nlastwarid",},			
			{	"t" : "sint64",	"c" : 1,	"k" : "nrankscore",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btreward",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nfaceid",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nfaceframeid",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nbountycooperationlayer",},
		]

}
export class GS_RelationNewNotice  {			
	nrid : number;			
	btnoticetype : number;			
	btstate : number;			
	nsenddbid : number;			
	szsendname : string;			
	szsendmd5facefile : string;			
	nsendfaceid : number;			
	nsendfaceframeid : number;			
	nrecivedbid : number;			
	szrecivename : string;			
	szrecivemd5facefile : string;			
	nrecivefaceid : number;			
	nrecivefaceframeid : number;			
	nstrength : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"c" : 1,	"k" : "nrid",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btnoticetype",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btstate",},			
			{	"t" : "sint64",	"c" : 1,	"k" : "nsenddbid",},			
			{	"t" : "stchar",	"c" : 32,	"k" : "szsendname",},			
			{	"t" : "stchar",	"c" : 33,	"k" : "szsendmd5facefile",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nsendfaceid",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nsendfaceframeid",},			
			{	"t" : "sint64",	"c" : 1,	"k" : "nrecivedbid",},			
			{	"t" : "stchar",	"c" : 32,	"k" : "szrecivename",},			
			{	"t" : "stchar",	"c" : 33,	"k" : "szrecivemd5facefile",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nrecivefaceid",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nrecivefaceframeid",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nstrength",},
		]

}
export class GS_RelationFind  {			
	nactordbid : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"c" : 1,	"k" : "nactordbid",},
		]

}
export class GS_RelationRetReward  {			
	nactordbid : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"c" : 1,	"k" : "nactordbid",},
		]

}
export class GS_RelationSendRecommend  {			
	uitemsize : number;			
	uitemcount : number;			
	data : GS_RelationSendRecommend_RecommendFriend[];
	dataClass : any = GS_RelationSendRecommend_RecommendFriend;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"c" : 1,	"k" : "uitemsize",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "uitemcount",},			
			{	"c" : 0,	"ck" : "uitemcount",	"t" : "GS_RelationSendRecommend_RecommendFriend",	"s" : "uitemsize",	"k" : "data",},
		]

}
export class GS_RelationGetRecommend  {
	protoList:any[] = 
		[
		]

}
export class GS_RelationNoticeInfo  {			
	uitemsize : number;			
	uitemcount : number;			
	item : GS_RelationNoticeInfo_NoticeItem[];
	itemClass : any = GS_RelationNoticeInfo_NoticeItem;
	protoList:any[] = 
		[			
			{	"t" : "ushort",	"c" : 1,	"k" : "uitemsize",},			
			{	"t" : "ushort",	"c" : 1,	"k" : "uitemcount",},			
			{	"c" : 0,	"ck" : "uitemcount",	"t" : "GS_RelationNoticeInfo_NoticeItem",	"s" : "uitemsize",	"k" : "item",},
		]

}
export class GS_RelationFriendState  {			
	nfriendid : number;			
	btstate : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"c" : 1,	"k" : "nfriendid",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btstate",},
		]

}
export class GS_RelationUpFace  {			
	nfrienddbid : number;			
	nfaceid : number;			
	nfaceframeid : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"c" : 1,	"k" : "nfrienddbid",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nfaceid",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nfaceframeid",},
		]

}
export class GS_RelationUpRankScore  {			
	nfrienddbid : number;			
	nrankscore : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"c" : 1,	"k" : "nfrienddbid",},			
			{	"t" : "sint64",	"c" : 1,	"k" : "nrankscore",},
		]

}
export class GS_RelationNoticeInfo_NoticeItem  {			
	nrid : number;			
	btnoticetype : number;			
	btstate : number;			
	nstrength : number;			
	btinfotype : number;			
	nactordbid : number;			
	szname : string;			
	szmd5facefile : string;			
	nfaceid : number;			
	nfaceframeid : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"c" : 1,	"k" : "nrid",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btnoticetype",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btstate",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nstrength",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btinfotype",},			
			{	"t" : "sint64",	"c" : 1,	"k" : "nactordbid",},			
			{	"t" : "stchar",	"c" : 32,	"k" : "szname",},			
			{	"t" : "stchar",	"c" : 33,	"k" : "szmd5facefile",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nfaceid",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nfaceframeid",},
		]

}
export class GS_RelationNextDay  {
	protoList:any[] = 
		[
		]

}
export class GS_RelationAddEnd  {			
	nactordbid : number;			
	szname : string;			
	szmd5facefile : string;			
	btsex : number;			
	nlastonlinetime : number;			
	nlastwarid : number;			
	nrankscore : number;			
	btreward : number;			
	btstate : number;			
	nfaceid : number;			
	nfaceframeid : number;			
	nbountycooperationlayer : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"c" : 1,	"k" : "nactordbid",},			
			{	"t" : "stchar",	"c" : 32,	"k" : "szname",},			
			{	"t" : "stchar",	"c" : 33,	"k" : "szmd5facefile",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btsex",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nlastonlinetime",},			
			{	"t" : "sint64",	"c" : 1,	"k" : "nlastwarid",},			
			{	"t" : "sint64",	"c" : 1,	"k" : "nrankscore",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btreward",},			
			{	"t" : "uchar",	"c" : 1,	"k" : "btstate",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nfaceid",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nfaceframeid",},			
			{	"t" : "slong",	"c" : 1,	"k" : "nbountycooperationlayer",},
		]

}
 

 