export enum GS_PLAZA_CONTAINER_MSG
{
	PLAZA_CONTAINER_INFO			= 0,	//	玩家容器信息
	PLAZA_CONTAINER_CHANGE			= 1,	//	容器数据改变消息		
	PLAZA_CONTAINER_MAX
}
export class GS_ContainerHead  {
	protoList:any[] = 
		[
		]

}
export class GS_ContainerInfo_ContainerItem  {			
	ngoodsid : number;			
	nnums : number;
	protoList:any[] = 
		[			
			{	"t" : "slong",	"k" : "ngoodsid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nnums",	"c" : 1,},
		]

}
export class GS_ContainerChange  {			
	nactordbid : number;			
	btcontainerid : number;			
	ucontainerdata : number;			
	nnums : number;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"k" : "nactordbid",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btcontainerid",	"c" : 1,},			
			{	"t" : "slong",	"k" : "ucontainerdata",	"c" : 1,},			
			{	"t" : "slong",	"k" : "nnums",	"c" : 1,},
		]

}
export class GS_ContainerInfo  {			
	nactordbid : number;			
	btcontainerid : number;			
	scontainercount : number;			
	packet : GS_ContainerInfo_ContainerItem[];
	packetClass : any = GS_ContainerInfo_ContainerItem;
	protoList:any[] = 
		[			
			{	"t" : "sint64",	"k" : "nactordbid",	"c" : 1,},			
			{	"t" : "uchar",	"k" : "btcontainerid",	"c" : 1,},			
			{	"t" : "ushort",	"k" : "scontainercount",	"c" : 1,},			
			{	"t" : "GS_ContainerInfo_ContainerItem",	"k" : "packet",	"c" : 0,},
		]

}
 

 