export enum GS_LOGIN_MSGID
{
	LOGIN_MAINID_LOGIN = 0,
}
export enum GS_LOGIN_MSG
{
	LOGIN_MSGID_LOGIN			= 1,	//��¼
	LOGIN_MSGID_REGEDIT			= 2,	//ע��
	LOGIN_MSGID_LOGINEND		= 3,	//��¼����
	LOGIN_MSGID_REGEDITEND		= 4,	//ע�᷵��
	LOGIN_MSGID_TIPS			= 5,	//��ʾ��Ϣ
	LOGIN_MSGID_GETVERIFICATION = 6,	//��ȡ��֤��
	LOGIN_MSGID_RESETPWD		= 7,	//��������
	LOGIN_MSGID_RESETPWDRET		= 8,	//�������뷵��
	LOGIN_MSGID_LOGINERROR		= 9,	//��¼����
	LOGIN_MSGID_MAX
}
export class LoginMain_Head  {
	protoList:any[] = 
		[
		]

}
export class Login_Head  {
	protoList:any[] = 
		[
		]

}
export class SLogin_Regedit  {			
	bok : number;
	protoList:any[] = 
		[			
			{	"k" : "bok",	"c" : 1,	"t" : "slong",},
		]

}
export class SLogin_LoginError  {			
	uerrortype : number;			
	szurl : string;
	protoList:any[] = 
		[			
			{	"k" : "uerrortype",	"c" : 1,	"t" : "uchar",},			
			{	"k" : "szurl",	"c" : 0,	"t" : "stchar",},
		]

}
export class CLogin_Login  {			
	btlogintype : number;			
	loginaccount : string;			
	loginpassword : string;			
	btsystemtype : number;			
	nplazaversion : number;			
	szclientversion : string;			
	szchannel : string;			
	btsoftware : number;			
	szidfa : string;			
	machinename : string;			
	sysversion : string;			
	mac : string;			
	buffhd : string;			
	buffbios : string;			
	buffcpu : string;			
	nclientresversion : number;
	protoList:any[] = 
		[			
			{	"k" : "btlogintype",	"c" : 1,	"t" : "uchar",},			
			{	"k" : "loginaccount",	"c" : 128,	"t" : "stchar",},			
			{	"k" : "loginpassword",	"c" : 128,	"t" : "stchar",},			
			{	"k" : "btsystemtype",	"c" : 1,	"t" : "uchar",},			
			{	"k" : "nplazaversion",	"c" : 1,	"t" : "slong",},			
			{	"k" : "szclientversion",	"c" : 64,	"t" : "stchar",},			
			{	"k" : "szchannel",	"c" : 64,	"t" : "stchar",},			
			{	"k" : "btsoftware",	"c" : 1,	"t" : "uchar",},			
			{	"k" : "szidfa",	"c" : 129,	"t" : "stchar",},			
			{	"k" : "machinename",	"c" : 64,	"t" : "stchar",},			
			{	"k" : "sysversion",	"c" : 64,	"t" : "stchar",},			
			{	"k" : "mac",	"c" : 32,	"t" : "stchar",},			
			{	"k" : "buffhd",	"c" : 128,	"t" : "stchar",},			
			{	"k" : "buffbios",	"c" : 64,	"t" : "stchar",},			
			{	"k" : "buffcpu",	"c" : 32,	"t" : "stchar",},			
			{	"k" : "nclientresversion",	"c" : 1,	"t" : "slong",},
		]

}
export class CLogin_Regedit  {			
	account : string;			
	password : string;			
	nickname : string;			
	idcard : string;			
	btsystemtype : number;			
	phone : string;			
	szverification : string;			
	email : string;			
	szchannel : string;			
	szidfa : string;			
	machinename : string;			
	sysversion : string;			
	mac : string;			
	buffhd : string;			
	buffbios : string;			
	buffcpu : string;
	protoList:any[] = 
		[			
			{	"k" : "account",	"c" : 128,	"t" : "stchar",},			
			{	"k" : "password",	"c" : 128,	"t" : "stchar",},			
			{	"k" : "nickname",	"c" : 32,	"t" : "stchar",},			
			{	"k" : "idcard",	"c" : 24,	"t" : "stchar",},			
			{	"k" : "btsystemtype",	"c" : 1,	"t" : "uchar",},			
			{	"k" : "phone",	"c" : 24,	"t" : "stchar",},			
			{	"k" : "szverification",	"c" : 8,	"t" : "stchar",},			
			{	"k" : "email",	"c" : 64,	"t" : "stchar",},			
			{	"k" : "szchannel",	"c" : 64,	"t" : "stchar",},			
			{	"k" : "szidfa",	"c" : 129,	"t" : "stchar",},			
			{	"k" : "machinename",	"c" : 64,	"t" : "stchar",},			
			{	"k" : "sysversion",	"c" : 64,	"t" : "stchar",},			
			{	"k" : "mac",	"c" : 32,	"t" : "stchar",},			
			{	"k" : "buffhd",	"c" : 128,	"t" : "stchar",},			
			{	"k" : "buffbios",	"c" : 64,	"t" : "stchar",},			
			{	"k" : "buffcpu",	"c" : 32,	"t" : "stchar",},
		]

}
export class SLogin_GetVerification  {			
	phone : string;			
	requesttype : number;			
	btsystemtype : number;			
	szchannel : string;
	protoList:any[] = 
		[			
			{	"k" : "phone",	"c" : 24,	"t" : "stchar",},			
			{	"k" : "requesttype",	"c" : 1,	"t" : "uchar",},			
			{	"k" : "btsystemtype",	"c" : 1,	"t" : "uchar",},			
			{	"k" : "szchannel",	"c" : 64,	"t" : "stchar",},
		]

}
export class SLogin_Tips  {			
	bttype : number;			
	szdes : string;
	protoList:any[] = 
		[			
			{	"k" : "bttype",	"c" : 1,	"t" : "uchar",},			
			{	"k" : "szdes",	"c" : 128,	"t" : "stchar",},
		]

}
export class SLogin_Login  {			
	nactordbid : number;			
	szkey : string;
	protoList:any[] = 
		[			
			{	"k" : "nactordbid",	"c" : 1,	"t" : "sint64",},			
			{	"k" : "szkey",	"c" : 32,	"t" : "stchar",},
		]

}
export class SLogin_ResetPwd  {			
	phone : string;			
	password : string;			
	szverification : string;			
	btsystemtype : number;			
	machinename : string;			
	sysversion : string;			
	mac : string;			
	buffhd : string;			
	buffbios : string;			
	buffcpu : string;
	protoList:any[] = 
		[			
			{	"k" : "phone",	"c" : 24,	"t" : "stchar",},			
			{	"k" : "password",	"c" : 128,	"t" : "stchar",},			
			{	"k" : "szverification",	"c" : 8,	"t" : "stchar",},			
			{	"k" : "btsystemtype",	"c" : 1,	"t" : "uchar",},			
			{	"k" : "machinename",	"c" : 64,	"t" : "stchar",},			
			{	"k" : "sysversion",	"c" : 64,	"t" : "stchar",},			
			{	"k" : "mac",	"c" : 32,	"t" : "stchar",},			
			{	"k" : "buffhd",	"c" : 128,	"t" : "stchar",},			
			{	"k" : "buffbios",	"c" : 64,	"t" : "stchar",},			
			{	"k" : "buffcpu",	"c" : 32,	"t" : "stchar",},
		]

}
export class SLogin_ResetPwdRet  {			
	bok : number;
	protoList:any[] = 
		[			
			{	"k" : "bok",	"c" : 1,	"t" : "slong",},
		]

}
 

 