import Utils from "../../utils/Utils";


class Rectangle {
	left:number = 0;
	right:number = 0;
	top:number = 0;
	bottom:number = 0;
}

/**阉割版A*，只保留上下左右4向寻路 */

export default class AStar {
    /**可走1 */
    static walkableNum_1:number = 1;
	/**可走2 */
	static walkableNum_2:number = 3;

	/**可走位 */
	static WALK_BIT:number = 0;
	/**塔位 */
	static TOWER_BIT:number = 1;
	/**镂空位 */
	static LK_BIT:number = 2;

	static LK_VALUE:number = 4;

    //====================================
	//	Constants
	//====================================
	/**
	 * 横或竖向移动一格的路径评分
	 * */
	private COST_STRAIGHT : number = 10;
	
	/**
	 * 斜向移动一格的路径评分
	 * */
	private COST_DIAGONAL : number = 14;
	
	/**
	 * (单个)节点数组 节点ID 索引
	 * */
	private NOTE_ID : number = 0;
	
	/**
	 * (单个)节点数组 是否在开启列表中 索引
	 * */
	private NOTE_OPEN : number = 1;
	
	/**
	 * (单个)节点数组 是否在关闭列表中 索引
	 * */
	private NOTE_CLOSED : number = 2;
	
	//====================================
	//	Member iables
	//====================================
	/**
	 * 最大寻路步数，限制超时返回
	 * */
	private m_maxTry : number;
	
	/**
	 * 开放列表，存放节点ID
	 * */
	private m_openList : Array<number>  = [];
	
	/**
	 * 开放列表长度
	 * */
	private m_openCount : number;
	
	/**
	 * 节点加入开放列表时分配的唯一ID(从0开始)
	 * 根据此ID(从下面的列表中)存取节点数据
	 * */
	private m_openId : number;
	
	/**
	 * 节点x坐标列表
	 * */
	private m_xList : Array<number> = [];
	
	/**
	 * 节点y坐标列表
	 * */
	private m_yList : Array<number> = [];
	
	/**
	 * 节点路径评分列表F
	 * */
	private m_pathScoreList : Array<number> = [];
	
	/**
	 * (从起点移动到)节点的移动耗费列表G
	 * */
	private m_movementCostList : number[] = [];
	
	/**
	 * 节点的父节点(ID)列表
	 * */
	private m_fatherList : number[] = [];
	
	/**
	 * 节点(数组)地图,根据节点坐标记录节点开启关闭状态和ID
	 * */
	private  m_noteMap : any = [];
	
	/**
	 * 地图块信息
	 */		
	private _mapBlocks : Array<Array<number>> = [];

	/**原始数据 */
	private _realBlocks : Array<Array<number>> = [];
	
	private _mapBlockRowTop : number = 0;
	private _mapBlockColumTop : number = 0;
	private _mapBlockRows : number;
	private _mapBlockColums : number;
	
	/**
	 * 单例对象
	 */
	private static  instance : AStar;
	
	/**
	 * 用于指定比如当前格子对应的名称 
	 */		
	public  name : String;
	
	private Sqrt(__num:number):number{
		if(__num<0){
			return NaN;
		}
		if(__num==0){
			return 0;
		}
		return Math.sqrt(__num);
	}
	
	//====================================
	//	Constructor
	//====================================
	/**
	 * 获取单例对象
	 */
	public static getInstance () : AStar
	{
		if(AStar.instance == null)
		{
			AStar.instance = new AStar();
		}
		return AStar.instance;
	}

	init(mapBlocks : Array<Array<number>>,p_maxTry : number = 2000) : void
	{
		if (this._mapBlocks) this._mapBlocks.length = 0;
		
		this._mapBlocks = mapBlocks;
		Utils.deepCopy(this._mapBlocks , this._realBlocks);

		this._mapBlockRowTop = 0;
		this._mapBlockColumTop = 0;
		this._mapBlockRows = mapBlocks.length;
		this._mapBlockColums = mapBlocks[0].length;
		
		if(((this._mapBlockRows*this._mapBlockColums)>>2) > p_maxTry)
		{
			p_maxTry =((this._mapBlockRows*this._mapBlockColums)); 
		}
		
		this.m_maxTry = p_maxTry;
	}
	
	getBlocks():Array<Array<number>>
	{
		return this._mapBlocks;
	}
	
	setBlocks(value:Array<Array<number>>):void
	{
		this._mapBlocks = value;
	}

	/**
	 * 设置A*宽高 
	 * @param rows
	 * @param colums
	 */		
	setBlockBorder(rowsTop :number , rowsBottom :number , columsTop :number , columsBottom :number):void
	{
		this._mapBlockRowTop = rowsTop;
		this._mapBlockColumTop = columsTop;
		this._mapBlockRows = rowsBottom;
		this._mapBlockColums = columsBottom;
	}
	
	/**
	 * 获取数据的范围 
	 * @return 
	 */		
	getBlockBorder():Rectangle
	{
		let rect : Rectangle = new Rectangle();
		rect.left 	= this._mapBlockColumTop;
		rect.top 	= this._mapBlockRowTop;
		rect.right 	= this._mapBlockColums;
		rect.bottom = this._mapBlockRows;
		return rect;
	}
	/**
	 *返回地图的格子总列数 
	* @return 
	*/		
	 get mapColum():number
	{
		return this._mapBlockColums;
	}
	/**
	 *返回地图的格子总行数
	* @return 
	*/		
	 get mapRows():number
	{
		return this._mapBlockRows;
	}
	
	/**
	 * A* 寻路算法
	 */
	 AStar ()
	{		
	}
	
	//====================================
	//	Properties
	//====================================
	/**
	 * 最大寻路步数，限制超时返回
	 */
	 get maxTry () :number
	{
		return this.m_maxTry;
	}
	
	/**
	 * @private
	 */
	set maxTry (p_value :number)
	{
		this.m_maxTry = p_value;
	}
	
	private _endIndexX:number;
	private _endIndexY:number;
	/**
	 * 开始寻路 ,如果两点有无效的点则先将两点转化为附近的有效点再进行寻路
	 * @param startIndexX
	 * @param startIndexY
	 * @param endIndexX
	 * @param endIndexY
	 * @return 
	 * 
	 */		
	findByAvaliabePoint(startIndexX :number, startIndexY :number, endIndexX :number, endIndexY:number
										, delEndPt : number = 0):Array<Array<number>>
	{	
		
		//检查两者是否在闭合区域
		startIndexX = Math.floor(startIndexX);
		startIndexY = Math.floor(startIndexY);
		endIndexX 	= Math.floor(endIndexX);
		endIndexY 	= Math.floor(endIndexY);
		//console.log("startIndexX:" + startIndexX + ",startIndexY:" + startIndexY + ",endIndexX:" + endIndexX + ",endIndexY:" + endIndexY);
		let isCloseA:boolean = this.isClose(startIndexX, startIndexY);
		let isCloseB:boolean = this.isClose(endIndexX, endIndexY);
		
		let avaliableStart : Array<number> = this.getAvailablePoint(startIndexX , startIndexY , endIndexX , endIndexY);
		let avaliableEnd : Array<number> = null;
		
		//从非闭合区域到闭合区域
		if(isCloseB && !isCloseA)
			avaliableEnd = this.getNoClosePoint(endIndexX , endIndexY , startIndexX , startIndexY);
		else
			avaliableEnd = this.getAvailablePoint(endIndexX , endIndexY , startIndexX , startIndexY);
		let paths : Array<Array<number>> = this.find(avaliableStart[0] , avaliableStart[1]  ,avaliableEnd[0] , avaliableEnd[1], delEndPt);
		if (!paths)
		{
			paths = [[startIndexX,startIndexX]];
		}
		return paths;
	}
	
	/**
	 * 离目标点最近的一个点
	 * */
	private closestNode : Array<number> = [];
	
	/**
	 * 从出发点到离目标点最近的一个点的路径
	 * */
	private closestList : Array<Array<number>>  = [];
	
	/**
	 * 离目标点最近的一个点与目标点的距离
	 * */
	private closestNodeDis :number;

	/**
	 * 开始寻路
	 *
	 * @param p_startX		起点X坐标
	 * @param p_startY		起点Y坐标
	 * @param p_endX		终点X坐标
	 * @param p_endY		终点Y坐标
	 *
	 * @return 				找到的路径(二维数组 : [p_startX, p_startY], ... , [p_endX, p_endY])
	 */
	find (p_startX :number,p_startY :number,p_endX :number,p_endY :number, delEndPt : number = 0) : Array<Array<number>>
	{
		p_startX = Math.round(p_startX);
		p_startY = Math.round(p_startY);
		p_endX = Math.round(p_endX);
		p_endY = Math.round(p_endY);
		if(this._mapBlocks == null)
			return null;
		
		if(this.isBlock(p_endX , p_endY))
			return null;
		//初始化数组
		this.initLists();
		this.m_openCount = 0;
		this.m_openId = -1;
		
		//添加起始点到开启列表
		this.openNote(p_startX,p_startY,0,0,0);
		
		let currTry :number = 0;
		let currId :number;
		let currNoteX :number;
		let currNoteY :number;
		let aroundNotes : Array<Array<number>>;
		
		let checkingId :number;
		
		let cost :number;
		let dis :number;
		let score :number;
		let absvalue:number;
		while(this.m_openCount > 0)
		{
			//超时返回
			if(++currTry > this.m_maxTry)
			{
				break;
			}
			//每次取出开放列表最前面的ID
			currId = this.m_openList[0];
			//将编码为此ID的元素列入关闭列表
			this.closeNote(currId);
			currNoteX = this.m_xList[currId];
			currNoteY = this.m_yList[currId];
			
			//如果终点被放入关闭列表寻路结束，返回路径
			if(currNoteX == p_endX && currNoteY == p_endY)
			{
				//return this.cleanPath(this.getPath(p_startX,p_startY,currId, delEndPt),true);
				return this.cleanPath(this.getPath(p_startX,p_startY,currId, delEndPt),false);
			}
			
			absvalue = p_endX - currNoteX;
			if(absvalue < 0)
				absvalue *= -1;
			
			dis = p_endY - currNoteY;
			if(dis < 0)
				dis *= -1;
			
			dis = (dis + absvalue)*this.COST_STRAIGHT;
			
			if(dis < this.closestNodeDis)
			{
				this.closestNodeDis = dis;
				this.closestNode = [currNoteX, currNoteY];
				this.closestList = this.copyPath(p_startX,p_startY,currId);
			}
			
			//获取周围节点，排除不可通过和已在关闭列表中的
			aroundNotes = this.getArounds(currNoteX,currNoteY);
			//				if(aroundNotes == null || aroundNotes.length == 0)
			//				{//死路
			//					break;
			//				}

			//对于周围的每一个节点
			let len:number = aroundNotes.length;
			let note:any;
			for (var i:number = 0 ; i < len ; i++) {
				//计算F和G值 cost 为G,score 为f
				note = aroundNotes[i];
				cost = this.m_movementCostList[currId] + ((note[0] == currNoteX || note[1] == currNoteY) ? this.COST_STRAIGHT : this.COST_DIAGONAL);
				
				absvalue = p_endX - note[0];
				if(absvalue < 0)
					absvalue *= -1;
				
				dis = p_endY - note[1];
				if(dis < 0)
					dis *= -1;
				
				dis = (dis + absvalue)*this.COST_STRAIGHT;
				
				score = cost + dis;
				if(this.isOpen(note[0],note[1])) //如果节点已在播放列表中
				{
					checkingId = this.m_noteMap[note[1]][note[0]][this.NOTE_ID];
					//如果新的G值比节点原来的G值小,修改F,G值，换父节点
					if(cost < this.m_movementCostList[checkingId])
					{
						//G值
						this.m_movementCostList[checkingId] = cost;
						//F值
						this.m_pathScoreList[checkingId] = score;
						this.m_fatherList[checkingId] = currId;
						this.aheadNote(this.getIndex(checkingId));
					}
				}
				else //如果节点不在开放列表中
				{
					//将节点放入开放列表
					this.openNote(note[0],note[1],score,cost,currId);
				}
			}
		}
		
		//查找路径失败，返回离目标点最近的路径
		if(this.closestNode && this.closestNode.length > 0 && this.closestList && this.closestList.length > 0)
		{
			//return this.cleanPath(this.closestList, true);
			return this.cleanPath(this.closestList, false);
		}
		
		//清空所有数组
		this.destroyLists();
		return null;
	}
	
	checkCanMoveTo(p_startX :number,p_startY :number,p_endX :number,p_endY :number):boolean {
		if(this._mapBlocks == null)
			return false;
		
		if(this.isBlock(p_endX , p_endY))
			return false;
		//初始化数组
		this.initLists();
		this.m_openCount = 0;
		this.m_openId = -1;
		
		//添加起始点到开启列表
		this.openNote(p_startX,p_startY,0,0,0);
		
		let currTry :number = 0;
		let currId :number;
		let currNoteX :number;
		let currNoteY :number;
		let aroundNotes : Array<Array<number>>;
		
		let checkingId :number;
		
		let cost :number;
		let dis :number;
		let score :number;
		let absvalue:number;
		while(this.m_openCount > 0)
		{
			//超时返回
			if(++currTry > this.m_maxTry)
			{
				break;
			}
			//每次取出开放列表最前面的ID
			currId = this.m_openList[0];
			//将编码为此ID的元素列入关闭列表
			this.closeNote(currId);
			currNoteX = this.m_xList[currId];
			currNoteY = this.m_yList[currId];
			
			//如果终点被放入关闭列表寻路结束，返回路径
			if(currNoteX == p_endX && currNoteY == p_endY)
			{
				return true;
			}
			
			absvalue = p_endX - currNoteX;
			if(absvalue < 0)
				absvalue *= -1;
			
			dis = p_endY - currNoteY;
			if(dis < 0)
				dis *= -1;
			
			dis = (dis + absvalue)*this.COST_STRAIGHT;
			
			if(dis < this.closestNodeDis)
			{
				this.closestNodeDis = dis;
				this.closestNode = [currNoteX, currNoteY];
				this.closestList = this.copyPath(p_startX,p_startY,currId);
			}
			
			//获取周围节点，排除不可通过和已在关闭列表中的
			aroundNotes = this.getArounds(currNoteX,currNoteY);
			//				if(aroundNotes == null || aroundNotes.length == 0)
			//				{//死路
			//					break;
			//				}

			//对于周围的每一个节点
			let len:number = aroundNotes.length;
			let note:any;
			for (var i:number = 0 ; i < len ; i++) {
				//计算F和G值 cost 为G,score 为f
				note = aroundNotes[i];
				cost = this.m_movementCostList[currId] + ((note[0] == currNoteX || note[1] == currNoteY) ? this.COST_STRAIGHT : this.COST_DIAGONAL);
				
				absvalue = p_endX - note[0];
				if(absvalue < 0)
					absvalue *= -1;
				
				dis = p_endY - note[1];
				if(dis < 0)
					dis *= -1;
				
				dis = (dis + absvalue)*this.COST_STRAIGHT;
				
				score = cost + dis;
				if(this.isOpen(note[0],note[1])) //如果节点已在播放列表中
				{
					checkingId = this.m_noteMap[note[1]][note[0]][this.NOTE_ID];
					//如果新的G值比节点原来的G值小,修改F,G值，换父节点
					if(cost < this.m_movementCostList[checkingId])
					{
						//G值
						this.m_movementCostList[checkingId] = cost;
						//F值
						this.m_pathScoreList[checkingId] = score;
						this.m_fatherList[checkingId] = currId;
						this.aheadNote(this.getIndex(checkingId));
					}
				}
				else //如果节点不在开放列表中
				{
					//将节点放入开放列表
					this.openNote(note[0],note[1],score,cost,currId);
				}
			}
		}
		
		return false;
	}

	/**
	 * 是否是闭合区域
	 * @param checkX
	 * @param checkY
	 * @return 
	 * 
	 */		
	private isClose(checkX :number, checkY :number) : boolean
	{
		return false;
		if(checkX < this._mapBlockColumTop || checkX >= this._mapBlockColums || checkY < this._mapBlockRowTop || checkY >= this._mapBlockRows)
		{
			return true;
		}
	}
	
	/**
	 * 是否为障碍
	 * @param p_startX	始点X坐标
	 * @param p_startY	始点Y坐标
	 * @param p_endX	终点X坐标
	 * @param p_endY	终点Y坐标
	 * @return 0为障碍 1为通路
	 */
	isBlock(checkX :number,checkY :number) : boolean
	{
		if(checkY <this._mapBlockRowTop || checkY >=this._mapBlockRows || checkX < this._mapBlockColumTop || checkX >= this._mapBlockColums)
		{
			return true;
		}

		try {
			let value = this._mapBlocks[checkY][checkX];
			//console.log('checkY:' + checkY + ",checkX:" + checkX + ",value:" + value);
			return value != AStar.walkableNum_1 && value != AStar.walkableNum_2;
		} catch (error) {
			//console.log('checkY:' + checkY + ",checkX:" + checkX + ",error:" + error)
			return true
		}
	}

	/**
	 * 是否是镂空
	 * @param checkX 
	 * @param checkY 
	 */
	isLk(checkX :number,checkY :number):boolean {
		if(checkY <this._mapBlockRowTop || checkY >=this._mapBlockRows || checkX < this._mapBlockColumTop || checkX >= this._mapBlockColums) {
			return false;
		}

		try {
			let value = this._mapBlocks[checkY][checkX];
			return value == AStar.LK_VALUE;
		} catch (error) {
			return false;
		}

	}
	
	canCreateTower(checkX:number, checkY:number):boolean {
		if(checkY <this._mapBlockRowTop || checkY >=this._mapBlockRows || checkX < this._mapBlockColumTop || checkX >= this._mapBlockColums) {
			return false;
		}

		let value = this._mapBlocks[checkY][checkX];
		return (value >> AStar.TOWER_BIT & 1) != 0; 
	}
	
	getValue(checkX:number, checkY:number):number
	{
		if(checkX < this._mapBlockColumTop || checkX >= this._mapBlockColums || checkY <this._mapBlockRowTop || checkY >=this._mapBlockRows)
		{
			return -1;
		}
		return this._mapBlocks[checkY][checkX];
	}
	
	
	setBlock(x:number , y:number) {
		if(x < this._mapBlockColumTop || x >= this._mapBlockColums || y <this._mapBlockRowTop || y >=this._mapBlockRows) {
			return;
		}

		let value = this._mapBlocks[y][x];
		this._mapBlocks[y][x] = value & (~ (1 << AStar.WALK_BIT));
	}

	setCanWalk(x:number , y:number) {
		if(x < this._mapBlockColumTop || x >= this._mapBlockColums || y <this._mapBlockRowTop || y >=this._mapBlockRows) {
			return;
		}

		let value = this._mapBlocks[y][x];
		this._mapBlocks[y][x] = value | ( 1 << AStar.WALK_BIT);
	}
	
	/**设置原始值 */
	setRealValue(x:number , y:number) {
		this._mapBlocks[y][x] = this._realBlocks[y][x];
	}

	getRealCanWaik(x:number , y:number):boolean {
		if(y <this._mapBlockRowTop || y >=this._mapBlockRows || x < this._mapBlockColumTop || x >= this._mapBlockColums) {
			return false;
		}

		let value = this._realBlocks[y][x];
		return (value >> AStar.WALK_BIT & 1) != 0;  
	}

	setGridValue(x:number , y:number , value:number) {
		if(x < this._mapBlockColumTop || x >= this._mapBlockColums || y <this._mapBlockRowTop || y >=this._mapBlockRows) {
			return;
		}
		this._mapBlocks[y][x] = value;
	}

	//====================================
	//	Private Methods
	//====================================
	
	private m_List_Len:number = 0;
	/**
	 * @private
	 * 将节点加入开放列表
	 *
	 * @param p_x		节点在地图中的x坐标
	 * @param p_y		节点在地图中的y坐标
	 * @param P_score	节点的路径评分
	 * @param p_cost	起始点到节点的移动成本
	 * @param p_fatherId	父节点
	 */
	private openNote (p_x :number,p_y :number,p_score :number,p_cost :number,p_fatherId :number) : void
	{
		++this.m_openCount; //初始为0
		++this.m_openId; //初始为-1
		
		
		if(this.m_noteMap[p_y] == null)
		{
			this.m_noteMap[p_y] = [];
		}
		
		this.m_noteMap[p_y][p_x] = [];
		this.m_noteMap[p_y][p_x][this.NOTE_OPEN] = true;
		//保存某节点的 在开启列表中索引的位置
		this.m_noteMap[p_y][p_x][this.NOTE_ID] = this.m_openId;
		
		this.m_xList[this.m_List_Len] = p_x;
		this.m_yList[this.m_List_Len] = p_y;
		//评分
		this.m_pathScoreList[this.m_List_Len] = p_score;
		this.m_movementCostList[this.m_List_Len] = p_cost;
		this.m_fatherList[this.m_List_Len] = p_fatherId;
		//id从0开始，count从-1开始
		this.m_openList.push(this.m_openId);
		this.m_List_Len ++;
		this.aheadNote(this.m_openCount);
	}
	
	/**
	 * @private
	 * 将节点加入关闭列表
	 */
	private  closeNote (p_id :number) : void
	{
		--this.m_openCount;
		let noteX :number = this.m_xList[p_id];
		let noteY :number = this.m_yList[p_id];
		this.m_noteMap[noteY][noteX][this.NOTE_OPEN] = false;
		this.m_noteMap[noteY][noteX][this.NOTE_CLOSED] = true;
		
		if(this.m_openCount == 0)
		{
			this.m_openCount = 0;
			this.m_openList.length = 0;
			return;
		}
		else if(this.m_openCount < 0)
		{
			this.m_openCount = 0;
			return;
		}
		
		this.m_openList[0] = this.m_openList.pop();
		this.backNote();
	}
	
	/**
	 * @private
	 * 将(新加入开放别表或修改了路径评分的)节点向前移动
	 * @p_index  添加到开启列表的计数
	 */
	private  aheadNote (p_index :number) : void
	{
		let father :number;
		let change :number;
		while(p_index > 1)
		{
			//父节点的位置
			//father = Math.floor(p_index >> 1);
			father = p_index >> 1;
			//如果该节点的F值小于父节点的F值则和父节点交换
			if(this.getScore(p_index) < this.getScore(father))
			{
				change = this.m_openList[p_index - 1];
				this.m_openList[p_index - 1] = this.m_openList[father - 1];
				this.m_openList[father - 1] = change;
				p_index = father;
			}
			else
			{
				break;
			}
		}
	}
	
	/**
	 * @private
	 * 将(取出开启列表中路径评分最低的节点后从队尾移到最前的)节点向后移动
	 */
	private  backNote () : void
	{
		//尾部的节点被移到最前面
		let checkIndex :number = 1;
		let tmp :number;
		let change :number;
		let tmp1 :number;
		
		while(true)
		{
			tmp = checkIndex;
			tmp1 =  tmp<<1;
			
			//如果有子节点
			if(tmp1 <= this.m_openCount)
			{
				//如果子节点的F值更小
				if(this.getScore(checkIndex) > this.getScore(tmp1))
				{
					//记节点的新位置为子节点位置
					checkIndex = tmp1;
				}
				//如果有两个子节点
				if(tmp1 + 1 <= this.m_openCount)
				{
					//如果第二个子节点F值更小
					if(this.getScore(checkIndex) > this.getScore(tmp1 + 1))
					{
						//更新节点新位置为第二个子节点位置
						checkIndex = tmp1 + 1;
					}
				}
			}
			//如果节点位置没有更新结束排序
			if(tmp == checkIndex)
			{
				break;
			}
				//反之和新位置交换，继续和新位置的子节点比较F值
			else
			{
				change = this.m_openList[tmp - 1];
				this.m_openList[tmp - 1] = this.m_openList[checkIndex - 1];
				this.m_openList[checkIndex - 1] = change;
			}
		}
	}
	
	/**
	 * @private
	 * 判断某节点是否在开放列表
	 */
	private isOpen (p_x :number,p_y :number) : Boolean
	{
		if(this.m_noteMap[p_y] == null)
			return false;
		if(this.m_noteMap[p_y][p_x] == null)
			return false;
		return this.m_noteMap[p_y][p_x][this.NOTE_OPEN];
	}
	
	/**
	 * @private
	 * 判断某节点是否在关闭列表中
	 */
	private  isClosed (p_x :number,p_y :number) : Boolean
	{
		if(this.m_noteMap[p_y] == null)
			return false;
		if(this.m_noteMap[p_y][p_x] == null)
			return false;
		return this.m_noteMap[p_y][p_x][this.NOTE_CLOSED];
	}
	
	
	
	private canRight:Boolean = false;
	private canDown:Boolean = false;
	private canLeft:Boolean = false;
	private canUp:Boolean = false;
	private checkX:number = 0;
	private checkY:number = 0;
	private arr:Array<Array<number>> = [];
	
	
	/**
	 * @private
	 * 获取某节点的周围节点，排除不能通过和已在关闭列表中的
	 */
	getArounds (p_x :number,p_y :number) : Array<Array<number>>
	{
		this.arr = [];
		this.checkX = 0;
		
		//右
		this.checkX = p_x + 1;
		this.checkY = p_y;
		this.canRight = (this.isBlock(this.checkX,this.checkY) == false);
		if(this.canRight && !this.isClosed(this.checkX,this.checkY))
		{
			this.arr.push([this.checkX,this.checkY]);
		}
		//下
		this.checkX = p_x;
		this.checkY = p_y + 1;
		this.canDown = (this.isBlock(this.checkX,this.checkY) == false);
		if(this.canDown && !this.isClosed(this.checkX,this.checkY))
		{
			this.arr.push([this.checkX,this.checkY]);
		}
		
		//左
		this.checkX = p_x - 1;
		this.checkY = p_y;
		this.canLeft = (this.isBlock(this.checkX,this.checkY) == false);
		if(this.canLeft && !this.isClosed(this.checkX,this.checkY))
		{
			this.arr.push([this.checkX,this.checkY]);
		}
		//上
		this.checkX = p_x;
		this.checkY = p_y - 1;
		this.canUp = (this.isBlock(this.checkX,this.checkY) == false);
		if(this.canUp && !this.isClosed(this.checkX,this.checkY))
		{
			this.arr.push([this.checkX,this.checkY]);
		}
		
		return this.arr;
	}
	
	/**
	 * 获取周围所有可行走点的坐标 
	 * @param p_x
	 * @param p_y
	 * @return 
	 * 
	 */		
	getAroundsNoneBlockOrClose(p_x :number,p_y :number):Array<Array<number>>
	{
		let arr : Array<Array<number>> = [];
		let Count:number = 10;
		
		//右			
		this.checkX = p_x + 1;
		this.checkY = p_y;
		while(Count-- != 0)
		{
			if(!this.isBlock(this.checkX,this.checkY) && !this.isClose(this.checkX,this.checkY))
			{
				arr.push([this.checkX,this.checkY]);
				break;
			}
			
			++this.checkX;
		}
		
		//下
		Count=10;
		this.checkX = p_x;
		this.checkY = p_y + 1;
		
		while(Count-- != 0)
		{
			if(!this.isBlock(this.checkX,this.checkY) && !this.isClose(this.checkX,this.checkY))
			{
				arr.push([this.checkX,this.checkY]);
				break;
			}
			++this.checkY;
		}
		
		
		//左
		Count=10;
		this.checkX = p_x - 1;
		this.checkY = p_y;			
		while(Count-- != 0)
		{
			if(!this.isBlock(this.checkX,this.checkY) && !this.isClose(this.checkX,this.checkY))
			{
				arr.push([this.checkX,this.checkY]);
				break;
			}
			--this.checkX;
		}
		
		//上
		Count=10;
		this.checkX = p_x;
		this.checkY = p_y - 1;			
		while(Count-- != 0)
		{
			if(!this.isBlock(this.checkX,this.checkY) && !this.isClose(this.checkX,this.checkY))
			{
				arr.push([this.checkX,this.checkY]);
				break;
			}
			--this.checkY;
		}
		
		return arr;
	}
	
	/**
	 * 获取周围所有可行走点的坐标 
	 * @param p_x
	 * @param p_y
	 * @return 
	 * 
	 */		
	getAroundsNoneBlock(p_x :number,p_y :number, rand:number = 1):Array<Array<number>>
	{
		let arr : Array<Array<number>> = [];
		
		//右
		this.checkX = p_x + rand;
		this.checkY = p_y;			
		if(!this.isBlock(this.checkX,this.checkY))
		{
			arr.push([this.checkX,this.checkY]);
		}
		//下
		this.checkX = p_x;
		this.checkY = p_y + rand;			
		if(!this.isBlock(this.checkX,this.checkY))
		{
			arr.push([this.checkX,this.checkY]);
		}
		
		//左
		this.checkX = p_x - rand;
		this.checkY = p_y;			
		if(!this.isBlock(this.checkX,this.checkY))
		{
			arr.push([this.checkX,this.checkY]);
		}
		//上
		this.checkX = p_x;
		this.checkY = p_y - rand;			
		if(!this.isBlock(this.checkX,this.checkY))
		{
			arr.push([this.checkX,this.checkY]);
		}
		
		return arr;
	}
	
	/**
	 * 取周围八向所有数据 
	 * @param p_x
	 * @param p_y
	 * @return 
	 * 
	 */		
	 getAllArounds(p_x :number , p_y :number) : Array<Array<number>>
	{
		let arr : Array<Array<number>> = [];
		arr.push([p_x + 1 , p_y]);
		arr.push([p_x - 1 , p_y]);

		arr.push([p_x , p_y - 1]);
		arr.push([p_x , p_y + 1]);
		
		return arr;
	}
	
	/**
	 *找到从 ［startIndexX ， startIndexY］ 到 ［endIndexX ， endIndexY］ 可用于非闭合区域寻路的最短的点
		* @param startIndexX
		* @param startIndexY
		* @param endIndexX
		* @param endIndexY
		* @param closed
		* @return 
		* 
		*/		
	 getNoClosePoint(startIndexX :number , startIndexY :number 
									, endIndexX :number, endIndexY:number , closed : string[] = null):number[]
	{	
		let avaliable : Array<number> = null;
		if(this.isBlock(startIndexX , startIndexY) || this.isClose(startIndexX, startIndexY))
		{
			if(closed == null)
				closed = [];
			
			closed.push(startIndexX + "_" + startIndexY);
			let arounds : Array<Array<number>> = this.getAroundsNoneBlockOrClose(startIndexX , startIndexY);
			let len:number = arounds.length,i:number = 0, arr:Array<number>;
			for (i = 0 ; i < len ; i++) {
				arr = arounds[i];
				if(!this.isBlock(arr[0],arr[1]) && !this.isClose(arr[0], arr[1]))
				{
					avaliable = [arr[0] , arr[1]];
					break;
				}
			}

			
			
			if(avaliable == null && arounds.length > 0)
			{
				for (i = 0 ; i < len ; i++) {
					arr = arounds[i];
					if(closed.indexOf(arr[0] + "_" + arr[1]) == -1)
					{
						let start2endDst :number = this.getDistance(startIndexX , startIndexY , endIndexX , endIndexY);
						let preDst :number = this.getDistance(arr[0] , arr[1] , endIndexX , endIndexY);
						if(preDst < start2endDst)
							break;
					}
				}

				
				avaliable = this.getNoClosePoint(arr[0] , arr[1]  , endIndexX , endIndexY , closed);
			}
			else if( avaliable == null && arounds.length == 0)
			{
				console.log("周围没有一点是可以走的");
				//let allArounds : Array<Array<number>> = this.getAllArounds( startIndexX , startIndexY);
				let start2endDst1 :number  = this.getDistance(startIndexX , startIndexY , endIndexX , endIndexY);
				let len:number = arounds.length,i:number = 0, arr:Array<number>;
				for (i = 0 ; i < len ; i++) {
					arr = arounds[i];
					if(closed.indexOf(arr[0] + "_" + arr[1]) == -1)
					{
						let preDst1:number = this.getDistance(arr[0] , arr[1] , endIndexX , endIndexY);
						if(preDst1 < start2endDst1)
							break;
					}
				}

				
				
				if(arr)
					avaliable = this.getNoClosePoint(arr[0] , arr[1]  , endIndexX , endIndexY , closed);
			}
		}
		
		closed = null;
		
		return avaliable == null ? [startIndexX , startIndexY ] : avaliable;
	}
	
	/**
	 * 找到从 ［startIndexX ， startIndexY］ 到 ［endIndexX ， endIndexY］ 可用于寻路的最短的点
	 * @param startIndexX
	 * @param startIndexY
	 * @param endIndexX
	 * @param endIndexY
	 * @return 
	 */
	getAvailablePoint(startIndexX :number , startIndexY :number 
										, endIndexX :number, endIndexY:number) : Array<number>
	{
		this._tryGetAvbPtCount = 0;
		return this.tryGetAvailablePoint(startIndexX, startIndexY, endIndexX, endIndexY);
	}
	
	/**
	 * 尝试的次数
	 * */
	protected _tryGetAvbPtCount :number;
	
	/**
	 * 找到从 ［startIndexX ， startIndexY］ 到 ［endIndexX ， endIndexY］ 可用于寻路的最短的点
	 * @param startIndexX
	 * @param startIndexY
	 * @param endIndexX
	 * @param endIndexY
	 * @param closed
	 * @return 
	 */
	protected  tryGetAvailablePoint(startIndexX :number , startIndexY :number 
											, endIndexX :number, endIndexY:number , closed : Array<string> = null) : Array<number>
	{
		this._tryGetAvbPtCount++;
		if(this._tryGetAvbPtCount > 30000)
		{
			return [startIndexX , startIndexY ];
		}
		let avaliable : number[] = null;
		if(this.isBlock(startIndexX , startIndexY))
		{
			//如果目标点也是占位,则需要在目标点周围寻找不是占位的位置
			if(this.isBlock(endIndexX, endIndexY))
			{		
				//以自身为中心，最大半径为500进行查询
				for(let s:number = 0; s < 100; s++)
				{
					let pointarry:number[][] = this.getAroundsNoneBlock(endIndexX, endIndexY, s+1);
					if(pointarry.length > 0)
					{
						endIndexX = pointarry[0][0];
						endIndexY = pointarry[0][1];
						break;
					}
				}
			}
			
			if(closed == null)
				closed = [];
			
			closed.push(startIndexX + "_" + startIndexY);
			let arounds : number[][] = this.getAroundsNoneBlock(startIndexX , startIndexY);
			let len:number = arounds.length , i:number = 0 , arr:Array<number>;
			for (i = 0 ; i < len ; i++) {
				arr = arounds[i];
				if(!this.isBlock(arr[0],arr[1]))
				{
					avaliable = [arr[0] , arr[1]];
					break;
				}
			}
			
			if(avaliable == null && arounds.length > 0)
			{
				for (i = 0 ; i < len ; i++) {
					arr = arounds[i];
					if(closed.indexOf(arr[0] + "_" + arr[1]) == -1)
					{
						let start2endDst :number = this.getDistance(startIndexX , startIndexY , endIndexX , endIndexY);
						let preDst :number = this.getDistance(arr[0] , arr[1] , endIndexX , endIndexY);
						if(preDst < start2endDst)
							break;
					}
				}
				avaliable = this.tryGetAvailablePoint(arr[0] , arr[1]  , endIndexX , endIndexY , closed);
			}
			else if( avaliable == null && arounds.length == 0)
			{
				console.log("周围没有一点是可以走的");
				//let allArounds : number[][] = this.getAllArounds( startIndexX , startIndexY);
				let start2endDst1:number  = this.getDistance(startIndexX , startIndexY , endIndexX , endIndexY);
				let len:number = arounds.length , i:number = 0 , arr:Array<number>;

				for (i = 0 ; i < len ; i++) {
					arr = arounds[i];
					if(closed.indexOf(arr[0] + "_" + arr[1]) == -1)
					{
						let preDst1:number= this.getDistance(arr[0] , arr[1] , endIndexX , endIndexY);
						if(preDst1 < start2endDst1)
							break;
					}
				}
				
				if(arr)
					avaliable = this.tryGetAvailablePoint(arr[0] , arr[1]  , endIndexX , endIndexY , closed);
			}
		}
		
		closed = null; 
		
		return avaliable == null ? [startIndexX , startIndexY ] : avaliable;
	}
	
	/**
	 * 获取目标点周围离目标点最近的一个非障碍物的点
	 * */
	 getClosestAvailablePoint(targetIndexX :number, targetIndexY :number, startIndexX :number, startIndexY :number) : number[]
	{
		if(!this.isBlock(targetIndexX, targetIndexY))
		{
			return [targetIndexX, targetIndexY];
		}
		
		let value1:number = targetIndexX - startIndexX;
		let value2:number = targetIndexY - startIndexY;
		if(value1 < 0)
			value1 *= -1;
		
		if(value2 < 0)
			value2 *= -1;
		
		let maxR :number = value1 > value2 ?  value1 : value2;
		if(maxR <= 1)
		{
			return [startIndexX, startIndexY];
		}
		
		let r :number;//扫描半径
		let dis :number;
		let minDis :number;
		let finalPoint : number[];
		let tempX :number;
		let tempY :number;
		let i :number;
		let j :number;
		let iTrue:Boolean = false;
		let startIndextemp:number = 0;
		
		for(r = 1; r < maxR; r++)
		{
			minDis = Number.MAX_VALUE;
			finalPoint = null;
			for(i = -r; i <= r; i++)
			{
				iTrue = (i == -r || i == r);
				tempX = targetIndexX + i;
				startIndextemp = startIndexX - tempX;
				if(startIndextemp < 0)
					startIndextemp *= -1;
				
				for(j = -r; j <= r; j++)
				{
					if(iTrue  || j == r || j == -r )						
					{	
						tempY = targetIndexY + j;
						if(!this.isBlock(tempX, tempY))
						{
							dis = startIndexY - tempY;
							if(dis < 0)
								dis *= -1;
							
							dis = startIndextemp + dis;
							if(dis < minDis)
							{
								minDis = dis;
								finalPoint = [tempX, tempY];
							}
						}
					}
				}
			}
			if(finalPoint && finalPoint.length > 1)
			{
				break;
			}
		}
		return finalPoint;
	}
	
	/**
	 * 计算两点距离
	 * @param Ax	A点x坐标
	 * @param Ay	A点y坐标
	 * @param Bx	B点x坐标
	 * @param By	B点y坐标
	 */
	getDistance(Ax :number, Ay :number, Bx :number, By :number):number 
	{
		let x:number = Ax - Bx;
		let y:number = Ay - By;
		
		//return (Math.sqrt(x*x + y*y));
		return this.Sqrt(x*x + y*y);
	}
	
	/**
	 * @private
	 * 获取路径（此方法在得到路径后会调用destroyLists）
	 *
	 * @param p_startX	起始点X坐标
	 * @param p_startY	起始点Y坐标
	 * @param p_id		终点的ID
	 *
	 * @return 			路径坐标(Point)数组
	 */
	private getPath (p_startX :number,p_startY :number,p_id :number, delEndPt : number = 0) : number[][]
	{
		let arr : number[][] = this.copyPath(p_startX, p_startY, p_id, delEndPt);
		this.destroyLists();
		return arr;
	}
	
	/**
	 * @private
	 * 获取路径（此方法在得到路径后不会调用destroyLists）
	 *
	 * @param p_startX	起始点X坐标
	 * @param p_startY	起始点Y坐标
	 * @param p_id		终点的ID
	 *
	 * @return 			路径坐标(Point)数组
	 */
	private copyPath(p_startX :number,p_startY :number,p_id :number, delEndPt : number = 0) : Array<Array<number>>
	{
		let dep : number = delEndPt;
		let arr : Array<Array<number>> = [];
		let preNodeX :number = -10;
		let preNodeY :number = -10;
		let nodeX :number = this.m_xList[p_id];
		let nodeY :number = this.m_yList[p_id];
		let curDirX :number = -10;
		let curDirY :number = -10;
		let tempDirX :number = -11;
		let tempDirY :number = -11;
		let curNode : number[];
		let tempX:number = 0;
		let tempY:number = 0;
		let temp_id:number = 0;
		while(nodeX != p_startX || nodeY != p_startY)
		{
			temp_id = this.m_fatherList[p_id];
			tempX = this.m_xList[p_id];
			tempY = this.m_yList[p_id];
			
			if(dep > 0)
			{
				p_id = this.m_fatherList[p_id];
				nodeX = this.m_xList[p_id];
				nodeY = this.m_yList[p_id];
				dep--;
			}
			else
			{
				if(tempDirX != curDirX || tempDirY != curDirY)
				{
					curNode = [nodeX,nodeY];
					arr.push(curNode);
				}
				else
				{
					curNode[0] = nodeX;
					curNode[1] = nodeY;
				}
				
				preNodeX = nodeX;
				preNodeY = nodeY;
				p_id = this.m_fatherList[p_id];
				nodeX = this.m_xList[p_id];
				nodeY = this.m_yList[p_id];
				curDirX = tempDirX;
				curDirY = tempDirY;
				tempDirX = preNodeX - nodeX;
				tempDirY = preNodeY - nodeY;
			}
		}
		if(tempDirX != curDirX || tempDirY != curDirY)
		{
			curNode = [p_startX,p_startY];
			arr.push(curNode);
		}
		else
		{
			curNode[0] = p_startX;
			curNode[1] = p_startY;
		}
		
		arr.reverse();
		return arr;
	}
	
	/**
	 * 清理下路径
	 * @param path 需要清理的路径列表
	 * @param delBrokenLine 是否需要去掉多余的折线
	 * */
	protected  cleanPath(path : number[][], delBrokenLine : Boolean = true) : number[][]
	{
		if(!delBrokenLine)
		{
			return path;
		}
		if(path)
		{
			let result : number[][] = [];
			let resultIndex :number = -1;
			let node : number[];
			let nodeX : number;
			let nodeY : number;
			let dbCheckStartIndex :number = 0;
			let dbCheckStartX : number;
			let dbCheckStartY : number;
			let cannotGoDirectly : Boolean;
			let i : number;
			let len : number = path.length;
			let dbCheckDx :number;
			let dbCheckDy :number;
			if(len <= 2)
			{
				return path;
			}
			for(i = 0; i < len; i++)
			{
				node = path[i] as number[];
				if(delBrokenLine)
				{
					nodeX = node[0];
					nodeY = node[1];
					if(i == dbCheckStartIndex + 1)
					{
						result.push(node);
						resultIndex++;
					}
					else
					{
						dbCheckDx = nodeX - dbCheckStartX;
						dbCheckDy = nodeY - dbCheckStartY;
						cannotGoDirectly = (dbCheckDx == 0) || (dbCheckDy == 0) || (dbCheckDx == dbCheckDy) || (dbCheckDx == -dbCheckDy) 
							|| (i == dbCheckStartIndex) || this.hasBarrier(dbCheckStartX, dbCheckStartY, nodeX, nodeY);
						if(cannotGoDirectly)
						{
							dbCheckStartIndex = i;
							dbCheckStartX = nodeX;
							dbCheckStartY = nodeY;
							result.push(node);
							resultIndex++;
						}
						else
						{
							result[resultIndex] = node;
						}
					}
				}
			}
			return result;
		}
		return null;
	}
	
	/**
	 * @private
	 * 获取某ID节点在开放列表中的索引(从1开始)
	 */
	private  getIndex (p_id :number) :number
	{			
		for(let i:number = 0, len:number = this.m_openList.length; i < len; i += 1)
		{
			if(this.m_openList[i] == p_id)
				return i;
		}
		
		return -1;
	}
	
	/**
	 * @private
	 * 获取某节点的路径评分
	 *
	 * @param p_index	节点在开启列表中的索引(从1开始)
	 */
	private  getScore (p_index :number) :number
	{
		return this.m_pathScoreList[this.m_openList[p_index - 1]];
	}
	
	/**
	 * @private
	 * 初始化数组
	 */
	private  initLists () : void
	{
		this.m_openList.length = 0 ;//=  new Vector.<int>();
		this.m_xList.length = 0 ; // = new Vector.<int>();
		this.m_yList.length = 0 ; // = new Vector.<int>();
		this.m_pathScoreList.length = 0 ; // = new Vector.<int>();
		this.m_movementCostList.length = 0 ; // = new Vector.<int>();
		this.m_fatherList.length = 0 ; // = new Vector.<int>();
		this.m_noteMap = [];
		this.m_List_Len = 0;
		this.closestNode = [];
		this.closestList = [];
		this.closestNodeDis =Number.MAX_VALUE;
	}
	
	/**
	 * @private
	 * 销毁数组
	 */
	private  destroyLists () : void
	{
		//			this.m_openList = null;
		//			this.m_xList = null;
		//			this.m_yList = null;
		//			this.m_pathScoreList = null;
		//			this.m_movementCostList = null;
		//			this.m_fatherList = null;
		//			this.m_noteMap = null;
	}
	
	/**
	 * 判断2点之间是否有障碍物
	 */		
	private hasBarrier(startX:number, startY:number, endX:number, endY:number):Boolean
	{
		//如果起点终点是同一个点那傻子都知道它们间是没有障碍物的
		if( startX == endX && startY == endY )return false;
		//两节点中心位置
		let point1:cc.Vec2 = new cc.Vec2(startX + .5 , startY + .5);
		let point2:cc.Vec2 = new cc.Vec2(endX + .5 , endY + .5);
		
		//1.根据起点终点间横纵向距离的大小来判断遍历方向
		let distX:number = Math.abs(endX - startX);
		let distY:number = Math.abs(endY - startY);										
		
		/**遍历方向，为true则为横向遍历，否则为纵向遍历*/
		let loopDirection:Boolean = distX > distY ? true : false;
		/**起始点与终点的连线方程*/
		let lineFuction:Function;
		
		/** 循环递增量 */
		let i:number;
		
		/** 循环起始值 */
		let loopStart:number;
		
		/** 循环终结值 */
		let loopEnd:number;
		
		/** 起终点连线所经过的节点 */
		let passedNodeList:number[][];
		
		let passedNode:number[];
		
		let node : number[];
		if( loopDirection )
		{				
			//lineFuction = MathUtil.getLineFunc(point1, point2, 0);
			lineFuction = AStar.getLineFunc(point1, point2, 0);
			loopStart = Math.min( point1.x, point2.x );
			loopEnd = Math.max( point1.x, point2.x );
			
			//开始横向遍历起点与终点间的节点看是否存在障碍(不可移动点) 
			for( i=loopStart; i<loopEnd; i++)
			{
				//由于线段方程是根据终起点中心点连线算出的，所以对于起始点来说需要根据其中心点
				//位置来算，而对于其他点则根据左上角来算
				if( i==loopStart )
				{
					i += .5;
				}
				//根据x得到直线上的y值
				let yPos:number = lineFuction(i);
				//检查经过的节点是否有障碍物，若有则返回true
				passedNodeList = this.getNodesUnderPoint( i, yPos);
				let len:number = passedNodeList.length , j:number = 0;
				for (j = 0 ; j < len ; j ++) {
					passedNode = passedNodeList[j];
					if(this.isBlock(Math.floor(passedNode[0]),Math.floor(passedNode[1])))
					{
						return true;
					}
				}
				
				if( i == loopStart + .5 )
				{
					i -= .5;
				}
			}
		}
		else
		{
			//lineFuction = MathUtil.getLineFunc(point1, point2, 1);
			lineFuction = AStar.getLineFunc(point1, point2, 1);
			
			loopStart = Math.min( point1.y, point2.y );
			loopEnd = Math.max( point1.y, point2.y );
			
			//开始纵向遍历起点与终点间的节点看是否存在障碍(不可移动点)
			for( i=loopStart; i<loopEnd; i++)
			{
				if( i==loopStart )
				{
					i += .5;
				}
				//根据y得到直线上的x值
				let xPos:number = lineFuction(i);
				passedNodeList = this.getNodesUnderPoint( xPos, i);
				let len:number = passedNodeList.length , j:number = 0;
				for (j = 0 ; j < len ; j ++) {
					passedNode = passedNodeList[j];
					if(this.isBlock(Math.floor(passedNode[0]),Math.floor(passedNode[1])))
					{
						return true;
					}
				}
				if( i == loopStart + .5 )
				{
					i -= .5;
				}
			}			
			
		}			
		return false;
	}		
	/**
	 * 得到一个点下的所有节点 
	 * @param xPos		点的横向位置(像素) 
	 * @param yPos		点的纵向位置(像素)
	 * @return 			共享此点的所有节点
	 */		
	private getNodesUnderPoint( xPos:number, yPos:number):number[][]
	{ 
		let result:number[][] = [];
		
		let xIsInt:boolean = xPos % 1 == 0;
		let yIsInt:boolean = yPos % 1 == 0;
		
		xPos = xPos < 0 ? 0 : xPos;
		yPos = yPos < 0 ? 0 : yPos;
		
		//点由四节点共享情况
		if( xIsInt && yIsInt )
		{
			result[0] = [ xPos - 1, yPos - 1];
			result[1] = [ xPos, yPos - 1];
			result[2] = [ xPos - 1, yPos];
			result[3] = [xPos, yPos];
		}
			//点由2节点共享情况
			//点落在两节点左右临边上
		else if( xIsInt && !yIsInt )
		{
			result[0] =[ xPos - 1, yPos];
			result[1] = [ xPos,yPos ];
		}
			//点落在两节点上下临边上
		else if( !xIsInt && yIsInt )
		{
			result[0] = [ xPos, yPos - 1 ];
			result[1] = [ xPos, yPos ];
		}
			//点由一节点独享情况
		else
		{
			result[0] = [ xPos, yPos ];
		}
		return result;
	}

	/**
	 * 根据两点确定这两点连线的二元一次方程 y = ax + b或者 x = ay + b
	 * @param ponit1
	 * @param point2
	 * @param type		指定返回函数的形式。为0则根据x值得到y，为1则根据y得到x
	 * 
	 * @return 由参数中两点确定的直线的二元一次函数
	 */		
	public static getLineFunc(ponit1:cc.Vec2, point2:cc.Vec2, type:number = 0):Function
	{
		var resultFuc:Function;
		
		
		// 先考虑两点在一条垂直于坐标轴直线的情况，此时直线方程为 y = a 或者 x = a 的形式
		if( ponit1.x == point2.x )
		{
			if( type == 0 )
			{
				throw new Error("两点所确定直线垂直于y轴，不能根据x值得到y值");
			}
			else if( type == 1 )
			{
				resultFuc =	function( y:Number ):Number
				{
					return ponit1.x;
				}
				
			}
			return resultFuc;
		}
		else if( ponit1.y == point2.y )
		{
			if( type == 0 )
			{
				resultFuc =	function( x:Number ):Number
				{
					return ponit1.y;
				}
			}
			else if( type == 1 )
			{
				throw new Error("两点所确定直线垂直于y轴，不能根据x值得到y值");
			}
			return resultFuc;
		}
		
		// 当两点确定直线不垂直于坐标轴时直线方程设为 y = ax + b
		var a:number;
		
		// 根据
		// y1 = ax1 + b
		// y2 = ax2 + b
		// 上下两式相减消去b, 得到 a = ( y1 - y2 ) / ( x1 - x2 ) 
		a = (ponit1.y - point2.y) / (ponit1.x - point2.x);
		
		var b:number;
		
		//将a的值代入任一方程式即可得到b
		b = ponit1.y - a * ponit1.x;
		
		//把a,b值代入即可得到结果函数
		if( type == 0 )
		{
			resultFuc =	function( x:number ):number
			{
				return a * x + b;
			}
		}
		else if( type == 1 )
		{
			resultFuc =	function( y:number ):number
			{
				return (y - b) / a;
			}
		}
		
		return resultFuc;
	}
}