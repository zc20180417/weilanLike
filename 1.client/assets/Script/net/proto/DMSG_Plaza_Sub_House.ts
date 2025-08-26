export enum GS_PLAZA_HOUSE_MSG
{
	PLAZA_HOUSE_FLOORINFO			= 0,	//楼层配置																	s->c
	PLAZA_HOUSE_FURNITUREINFO		= 1,	//家具配置																	s->c
	PLAZA_HOUSE_PRIVATE				= 2,	//个人数据																	s->c
	PLAZA_HOUSE_SETFURNITURE		= 3,	//设置家具																	c->s
	PLAZA_HOUSE_RETSETFURNITURE		= 4,	//返回设置家具																s->c	
	PLAZA_HOUSE_SAVEFLOOR			= 5,	//楼层存档																	c->s
	PLAZA_HOUSE_RETSAVEFLOOR		= 6,	//返回楼层存档																s->c
	PLAZA_HOUSE_FRIENDVISITINFO		= 7,	//好友访问配置																s->c
	PLAZA_HOUSE_FRIENDVISITPRIVATE	= 8,	//好友访问个人数据															s->c
	PLAZA_HOUSE_GETFRIENDHOUSE		= 9,	//请求访问好友房屋															c->s
	PLAZA_HOUSE_SETFRIENDHOUSE		= 10,	//下发好友房屋数据															s->c
	PLAZA_HOUSE_GETHOUSEREWARD		= 11,	//领取好友房屋奖励															c->s
	PLAZA_HOUSE_SETHOUSEREWARD		= 12,	//下发领取好友房屋奖励														s->c
	PLAZA_HOUSE_UPFLOORREWARDSTATE	= 13,	//更新楼层奖励领取状态														s->c	
	PLAZA_HOUSE_ACTIVEFURNITURE		= 14,	//激活某个家具（家具的摆放楼层为0才需要）									s->c
	PLAZA_HOUSE_MAX
}
export class GS_HouseHead  {
	protoList:any[] = 
		[
		]

}
export class GS_HouseSaveFloor  {			
	ufloorid : number;			
	btcount : number;			
	data : GS_HouseSaveFloor_FurnitureData[];
	dataClass : any = GS_HouseSaveFloor_FurnitureData;
	protoList:any[] = 
		[			
			{	"k" : "ufloorid",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "btcount",	"c" : 1,	"t" : "uchar",},			
			{	"k" : "data",	"c" : 0,	"t" : "GS_HouseSaveFloor_FurnitureData",},
		]

}
export class GS_HousePrivateData  {			
	ufurniturecount : number;			
	ustatecount : number;			
	ufurnituresize : number;			
	ustatesize : number;			
	data1 : GS_HousePrivateData_FurnitureData[];
	data1Class : any = GS_HousePrivateData_FurnitureData;			
	data2 : GS_HousePrivateData_RewardState[];
	data2Class : any = GS_HousePrivateData_RewardState;
	protoList:any[] = 
		[			
			{	"k" : "ufurniturecount",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "ustatecount",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "ufurnituresize",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "ustatesize",	"c" : 1,	"t" : "ushort",},			
			{	"c" : 0,	"k" : "data1",	"ck" : "ufurniturecount",	"s" : "ufurnituresize",	"t" : "GS_HousePrivateData_FurnitureData",},			
			{	"c" : 0,	"k" : "data2",	"ck" : "ustatecount",	"s" : "ustatesize",	"t" : "GS_HousePrivateData_RewardState",},
		]

}
export class GS_HouseSetFriendReward  {			
	nactordbid : number;
	protoList:any[] = 
		[			
			{	"k" : "nactordbid",	"c" : 1,	"t" : "sint64",},
		]

}
export class GS_HouseRetSaveFloor  {			
	ufloorid : number;
	protoList:any[] = 
		[			
			{	"k" : "ufloorid",	"c" : 1,	"t" : "ushort",},
		]

}
export class GS_HouseSaveFloor_FurnitureData  {			
	nid : number;			
	nposx : number;			
	nposy : number;			
	nrotate : number;
	protoList:any[] = 
		[			
			{	"k" : "nid",	"c" : 1,	"t" : "slong",},			
			{	"k" : "nposx",	"c" : 1,	"t" : "sshort",},			
			{	"k" : "nposy",	"c" : 1,	"t" : "sshort",},			
			{	"k" : "nrotate",	"c" : 1,	"t" : "sshort",},
		]

}
export class GS_HouseFriendVisitInfo  {			
	ngoodsid : number;			
	nfriendnums : number;			
	nallfriendnums : number;
	protoList:any[] = 
		[			
			{	"k" : "ngoodsid",	"c" : 1,	"t" : "slong",},			
			{	"k" : "nfriendnums",	"c" : 1,	"t" : "slong",},			
			{	"k" : "nallfriendnums",	"c" : 1,	"t" : "slong",},
		]

}
export class GS_HouseFurnitureInfo_FurnitureItem  {			
	nid : number;			
	bttype : number;			
	nsortid : number;			
	szname : string;			
	nfloorid : number;			
	nshowpicid : number;			
	niconpicid : number;			
	ulayer : number;
	protoList:any[] = 
		[			
			{	"k" : "nid",	"c" : 1,	"t" : "slong",},			
			{	"k" : "bttype",	"c" : 1,	"t" : "uchar",},			
			{	"k" : "nsortid",	"c" : 1,	"t" : "slong",},			
			{	"k" : "szname",	"c" : 32,	"t" : "stchar",},			
			{	"k" : "nfloorid",	"c" : 1,	"t" : "slong",},			
			{	"k" : "nshowpicid",	"c" : 1,	"t" : "sint64",},			
			{	"k" : "niconpicid",	"c" : 1,	"t" : "sint64",},			
			{	"k" : "ulayer",	"c" : 1,	"t" : "ushort",},
		]

}
export class GS_HouseSetFriendHouse  {			
	nactordbid : number;			
	uitemsize : number;			
	uitemcount : number;			
	furnituredatas : GS_HouseSetFriendHouse_FurnitureData[];
	furnituredatasClass : any = GS_HouseSetFriendHouse_FurnitureData;
	protoList:any[] = 
		[			
			{	"k" : "nactordbid",	"c" : 1,	"t" : "sint64",},			
			{	"k" : "uitemsize",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "uitemcount",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "furnituredatas",	"s" : "uitemsize",	"ck" : "uitemcount",	"c" : 0,	"t" : "GS_HouseSetFriendHouse_FurnitureData",},
		]

}
export class GS_HouseGetFriendHouse  {			
	nactordbid : number;
	protoList:any[] = 
		[			
			{	"k" : "nactordbid",	"c" : 1,	"t" : "sint64",},
		]

}
export class GS_HouseFurnitureInfo  {			
	btclientclear : number;			
	uitemsize : number;			
	uitemcount : number;			
	furnitures : GS_HouseFurnitureInfo_FurnitureItem[];
	furnituresClass : any = GS_HouseFurnitureInfo_FurnitureItem;
	protoList:any[] = 
		[			
			{	"k" : "btclientclear",	"c" : 1,	"t" : "uchar",},			
			{	"k" : "uitemsize",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "uitemcount",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "furnitures",	"s" : "uitemsize",	"ck" : "uitemcount",	"c" : 0,	"t" : "GS_HouseFurnitureInfo_FurnitureItem",},
		]

}
export class GS_HouseActiveFurniture  {			
	nid : number;
	protoList:any[] = 
		[			
			{	"k" : "nid",	"c" : 1,	"t" : "slong",},
		]

}
export class GS_HousePrivateData_FurnitureData  {			
	nid : number;			
	ufloorid : number;			
	nposx : number;			
	nposy : number;			
	nrotate : number;
	protoList:any[] = 
		[			
			{	"k" : "nid",	"c" : 1,	"t" : "slong",},			
			{	"k" : "ufloorid",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "nposx",	"c" : 1,	"t" : "sshort",},			
			{	"k" : "nposy",	"c" : 1,	"t" : "sshort",},			
			{	"k" : "nrotate",	"c" : 1,	"t" : "sshort",},
		]

}
export class GS_HouseUpFloorRewardState  {			
	nfloorid : number;
	protoList:any[] = 
		[			
			{	"k" : "nfloorid",	"c" : 1,	"t" : "slong",},
		]

}
export class GS_HouseGetFriendReward  {			
	nactordbid : number;
	protoList:any[] = 
		[			
			{	"k" : "nactordbid",	"c" : 1,	"t" : "sint64",},
		]

}
export class GS_HouseFriendVisitPrivate_FriendItem  {			
	nfrienddbid : number;			
	ncount : number;
	protoList:any[] = 
		[			
			{	"k" : "nfrienddbid",	"c" : 1,	"t" : "sint64",},			
			{	"k" : "ncount",	"c" : 1,	"t" : "slong",},
		]

}
export class GS_HouseFloorInfo_FloorItem  {			
	uid : number;			
	szname : string;			
	ntroopsid : number;			
	nopenwarid : number;			
	nwallpicid : number;			
	ngroundpicid : number;			
	ndoorpicid : number;			
	nrewardgoodsid : number;			
	nrewardgoodsnum : number;
	protoList:any[] = 
		[			
			{	"k" : "uid",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "szname",	"c" : 32,	"t" : "stchar",},			
			{	"k" : "ntroopsid",	"c" : 1,	"t" : "slong",},			
			{	"k" : "nopenwarid",	"c" : 1,	"t" : "slong",},			
			{	"k" : "nwallpicid",	"c" : 1,	"t" : "sint64",},			
			{	"k" : "ngroundpicid",	"c" : 1,	"t" : "sint64",},			
			{	"k" : "ndoorpicid",	"c" : 1,	"t" : "sint64",},			
			{	"k" : "nrewardgoodsid",	"c" : 1,	"t" : "slong",},			
			{	"k" : "nrewardgoodsnum",	"c" : 1,	"t" : "slong",},
		]

}
export class GS_HouseRetSetFurniture  {			
	nid : number;			
	ufloorid : number;			
	nposx : number;			
	nposy : number;			
	nrotate : number;
	protoList:any[] = 
		[			
			{	"k" : "nid",	"c" : 1,	"t" : "slong",},			
			{	"k" : "ufloorid",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "nposx",	"c" : 1,	"t" : "sshort",},			
			{	"k" : "nposy",	"c" : 1,	"t" : "sshort",},			
			{	"k" : "nrotate",	"c" : 1,	"t" : "sshort",},
		]

}
export class GS_HouseSetFriendHouse_FurnitureData  {			
	nid : number;			
	ufloorid : number;			
	nposx : number;			
	nposy : number;			
	nrotate : number;
	protoList:any[] = 
		[			
			{	"k" : "nid",	"c" : 1,	"t" : "slong",},			
			{	"k" : "ufloorid",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "nposx",	"c" : 1,	"t" : "sshort",},			
			{	"k" : "nposy",	"c" : 1,	"t" : "sshort",},			
			{	"k" : "nrotate",	"c" : 1,	"t" : "sshort",},
		]

}
export class GS_HouseFloorInfo  {			
	nopenwarid : number;			
	btclientclear : number;			
	uitemsize : number;			
	uitemcount : number;			
	floors : GS_HouseFloorInfo_FloorItem[];
	floorsClass : any = GS_HouseFloorInfo_FloorItem;
	protoList:any[] = 
		[			
			{	"k" : "nopenwarid",	"c" : 1,	"t" : "slong",},			
			{	"k" : "btclientclear",	"c" : 1,	"t" : "uchar",},			
			{	"k" : "uitemsize",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "uitemcount",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "floors",	"s" : "uitemsize",	"ck" : "uitemcount",	"c" : 0,	"t" : "GS_HouseFloorInfo_FloorItem",},
		]

}
export class GS_HousePrivateData_RewardState  {			
	btstate : number;
	protoList:any[] = 
		[			
			{	"k" : "btstate",	"c" : 1,	"t" : "uchar",},
		]

}
export class GS_HouseSetFurniture  {			
	nid : number;			
	ufloorid : number;			
	nposx : number;			
	nposy : number;			
	nrotate : number;
	protoList:any[] = 
		[			
			{	"k" : "nid",	"c" : 1,	"t" : "slong",},			
			{	"k" : "ufloorid",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "nposx",	"c" : 1,	"t" : "sshort",},			
			{	"k" : "nposy",	"c" : 1,	"t" : "sshort",},			
			{	"k" : "nrotate",	"c" : 1,	"t" : "sshort",},
		]

}
export class GS_HouseFriendVisitPrivate  {			
	uitemsize : number;			
	uitemcount : number;			
	friendlist : GS_HouseFriendVisitPrivate_FriendItem[];
	friendlistClass : any = GS_HouseFriendVisitPrivate_FriendItem;
	protoList:any[] = 
		[			
			{	"k" : "uitemsize",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "uitemcount",	"c" : 1,	"t" : "ushort",},			
			{	"k" : "friendlist",	"s" : "uitemsize",	"ck" : "uitemcount",	"c" : 0,	"t" : "GS_HouseFriendVisitPrivate_FriendItem",},
		]

}
 

 