export enum GS_PLAZA_LOGIN_MSG
{
	PLAZA_LOGIN_CLIENTLOGIN		= 0,		// µÇÂ¼	
	PLAZA_LOGIN_MAX
}
export class GS_LoginHead  {
	protoList:any[] = 
		[
		]

}
export class GS_Login  {			
	btlogintype : number;			
	nactordbid : number;			
	szloginkey : string;			
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
	nreconnectionid : number;
	protoList:any[] = 
		[			
			{	"t" : "uchar",	"k" : "btlogintype",	"c" : 1,},			
			{	"t" : "sint64",	"k" : "nactordbid",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szloginkey",	"c" : 32,},			
			{	"t" : "uchar",	"k" : "btsystemtype",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nplazaversion",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szclientversion",	"c" : 64,},			
			{	"t" : "stchar",	"k" : "szchannel",	"c" : 64,},			
			{	"t" : "uchar",	"k" : "btsoftware",	"c" : 1,},			
			{	"t" : "stchar",	"k" : "szidfa",	"c" : 129,},			
			{	"t" : "stchar",	"k" : "machinename",	"c" : 64,},			
			{	"t" : "stchar",	"k" : "sysversion",	"c" : 64,},			
			{	"t" : "stchar",	"k" : "mac",	"c" : 32,},			
			{	"t" : "stchar",	"k" : "buffhd",	"c" : 128,},			
			{	"t" : "stchar",	"k" : "buffbios",	"c" : 64,},			
			{	"t" : "stchar",	"k" : "buffcpu",	"c" : 32,},			
			{	"t" : "sint64",	"k" : "nreconnectionid",	"c" : 1,},
		]

}
 

 