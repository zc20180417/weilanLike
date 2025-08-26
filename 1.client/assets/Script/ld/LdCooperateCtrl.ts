import { ECamp, GAME_TYPE, GameState } from "../common/AllEnum";
import { EResPath } from "../common/EResPath";
import { EventEnum } from "../common/EventEnum";
import SceneMgr, { SCENE_NAME } from "../common/SceneMgr";
import SysMgr from "../common/SysMgr";
import Debug, { TAG } from "../debug";
import Game from "../Game";
import GlobalVal from "../GlobalVal";
import { EActType } from "../logic/actMach/ActMach";
import { EComponentType } from "../logic/comps/AllComp";
import { EActionName } from "../logic/comps/animation/AnimationComp";
import Creature from "../logic/sceneObjs/Creature";
import { Monster } from "../logic/sceneObjs/Monster";
import { SoType } from "../logic/sceneObjs/SoType";
import { GS_SceneWarFail } from "../net/proto/DMSG_Plaza_Sub_Scene";
import { GameEvent, Reply } from "../utils/GameEvent";
import { Handler } from "../utils/Handler";
import { MathUtils } from "../utils/MathUtils";
import { UiManager } from "../utils/UiMgr";
import { CooperatePlayerLogicInfo } from "./cooperate/CooperatePlayerLogicInfo";
import { CooperateRobot } from "./cooperate/CooperateRobot";
import { LDCooperateCreateMonsterCtrl } from "./cooperate/LDCooperateCreateMonsterCtrl";
import { GamePlayerLogicInfo } from "./GamePlayerLogicInfo";
import { HeroBuildingCtrl } from "./HeroBuildingCtrl";
import { LDBaseGameCtrl } from "./LDBaseGameCtrl";
import { LDMonsterDropCtrl } from "./LDMonsterDropCtrl";
import { LdMapCtrl } from "./map/LdMapCtrl";
import { LDCreateMonsterCtrl } from "./monster/LDCreateMonsterCtrl";
import { Pos } from "./Pos";
import { HeroTable } from "./tower/HeroTable";

export class LdCooperateCtrl extends LDBaseGameCtrl {

    static TOWER_COL = 7;
    static GRID_WID = 88;
    static GRID_HGT = 83;
    static HALF_GRID_WID = 44;
    static HALF_GRID_HGT = 55;
    static FIRST_GRID_X = 43.5;
    static FIRST_GRID_Y = 150;
    static FIRST_GRID_LEFT = 0;
    static MAP_WID:number = 800;

    private _gamewin:boolean = false;
    private _winState:any = {};
    private _preTime:number = 0;
    private _totalTime:number = 0;
    private _startTimerServer:number = 0;
    private _playTime:number = 0;
    private _cacheWinObj:any = {};
    private _cacheFailObj:any = {};
    private _waitExitGame:boolean = false;

    private _redCreateMonsterCtrl:LDCreateMonsterCtrl;
    private _leftMonsterDropCtrl:LDMonsterDropCtrl;
    private _rightMonsterDropCtrl:LDMonsterDropCtrl;
    private _leftLogicInfo:GamePlayerLogicInfo;
    private _rightLogicInfo:GamePlayerLogicInfo;
    private _selfLogicInfo:GamePlayerLogicInfo;



    private _cooperateRobot:CooperateRobot = new CooperateRobot(this);

    private _blockPoints1:cc.Vec2[] = [];
    private _blockPoints2:cc.Vec2[] = [];
    private _maxHalfWid:number = 0;
   

    get curCallTimes():number {
        return this._selfLogicInfo.curCallTimes;
    }

    get createTableCallTimes():number {
        return this._selfLogicInfo.createTableCallTimes;
    }

    get callConsumeCoin():number {
        return this._selfLogicInfo.callConsumeCoin;
    }

    get totalCallTimes():number { return this._selfLogicInfo.totalCallTimes };


    get strengthenSkillCoin():number {
        return this._selfLogicInfo.strengthenSkillCoin;
    }

    get mapHalfWid():number { 
        return this._maxHalfWid;
    }

    constructor() {
        super();
        this._gameType = GAME_TYPE.COOPERATE;
        this._mapCtrl = new LdMapCtrl();
        this._createMonsterCtrl = new LDCooperateCreateMonsterCtrl(this, this._mapCtrl , ECamp.BLUE);
        this._redCreateMonsterCtrl = new LDCooperateCreateMonsterCtrl(this, this._mapCtrl , ECamp.COOPERATE);
        
        this._gameCommonConfig = Game.gameConfigMgr.getGameCommonConfig((GAME_TYPE.COOPERATE + 1).toString());
        this._leftLogicInfo = new CooperatePlayerLogicInfo(this._gameCommonConfig , ECamp.BLUE , this);
        this._rightLogicInfo = new CooperatePlayerLogicInfo(this._gameCommonConfig , ECamp.COOPERATE , this);
        this._leftMonsterDropCtrl = new LDMonsterDropCtrl(this , ECamp.BLUE);
        this._rightMonsterDropCtrl = new LDMonsterDropCtrl(this , ECamp.COOPERATE);
        this._maxHalfWid = LdCooperateCtrl.MAP_WID * 0.5;

    }

    protected initDirAmmoRect() {
        this._selfArea = new cc.Rect(0 , 124 , LdCooperateCtrl.MAP_WID , 1300);
        this._dirAmmoArea = new cc.Rect(-100 , -300 , 1000 , 2000);
        this._dirAmmoCheckHitArea = new cc.Rect(0 , 0 , LdCooperateCtrl.MAP_WID  , 1700);
    }
    

    // private _leftMaxX:number = 0;
    // private _rightMinX:number = 0;

    private _centerRoadLeftTopPos:cc.Vec2 = cc.Vec2.ZERO;
    private _centerRoadRightTopPos:cc.Vec2 = new cc.Vec2(10000 , 0);


    getCenterRoadLeftPos():cc.Vec2 {
        return this._centerRoadLeftTopPos;
    }

    getCenterRoadRightPos():cc.Vec2 {
        return this._centerRoadRightTopPos;
    }

    setBlocks(blockPoints1:cc.PolygonCollider , blockPoints2:cc.PolygonCollider) {
        const points1 = blockPoints1.points;
        const points2 = blockPoints2.points;

        this._blockPoints1.length = 0;
        this._blockPoints2.length = 0;
        points1.forEach(element => {
            this._blockPoints1.push(new cc.Vec2(element.x + blockPoints1.node.x, element.y + blockPoints1.node.y));
        });
        points2.forEach(element => {
            this._blockPoints2.push(new cc.Vec2(element.x + blockPoints2.node.x, element.y + blockPoints2.node.y));
        });


        this._blockPoints1.forEach(element => {
            if (element.x > this._centerRoadLeftTopPos.x && element.y > 0) {
                this._centerRoadLeftTopPos.x = element.x;
                this._centerRoadLeftTopPos.y = element.y;
            }
        });

        this._blockPoints2.forEach(element => {
            if (element.x < this._centerRoadRightTopPos.x && element.y > 0) {
                this._centerRoadRightTopPos.x = element.x;
                this._centerRoadRightTopPos.y = element.y;
            }
        });
    }


    private _cityWall:Monster = null;

    setCityWall(cityWall:cc.Node) {
        this._cityWall = Game.soMgr.createCityWall(cityWall);
    }


    loadGameScene() {
        super.loadGameScene();
        SceneMgr.instance.loadSceneWithTransition(SCENE_NAME.LDCooperate, null, null, SceneMgr.instance.getTransition(GlobalVal.curMapCfg ? GlobalVal.curMapCfg.nwarid : null), true);
    }

     enterMap() {
        super.enterMap();
        GlobalVal.checkDialogPauseGame = false;
        GlobalVal.mirrorSceneObj = false;
        GlobalVal.checkSkillCamp = false;
        this._waitExitGame = false;
        MathUtils.setRandomSeed(GlobalVal.getServerTimeS());
        GlobalVal.recordEnterMapTime();
        GlobalVal.totalBlood = 0;
        this._createMonsterCtrl.enterMap(GlobalVal.curMapCfg , Game.gameConfigMgr.getCooperateBrushList(GlobalVal.curMapCfg.nwarid));
        this._redCreateMonsterCtrl.enterMap(GlobalVal.curMapCfg , Game.gameConfigMgr.getCooperateBrushList(GlobalVal.curMapCfg.nwarid));
        this._curMissonData = GlobalVal.curMapCfg;
        this.mapLifeMax = this._gameCommonConfig.cityWallHp;
        this.mapLife = this.mapLifeMax;



        this._gamewin = false;
        this._gameState = GameState.PLAYING;
        this._selfLogicInfo = this._selfCamp == ECamp.BLUE ? this._leftLogicInfo : this._rightLogicInfo;

        this.resetDatas();
        this._leftLogicInfo.enterMap();
        this._rightLogicInfo.enterMap();
        this._leftLogicInfo.coin = this._gameCommonConfig.baseCoin;
        this._rightLogicInfo.coin = this._gameCommonConfig.baseCoin;
        this._cooperateRobot.enterMap(this._rightLogicInfo);
        this._leftMonsterDropCtrl.initMonsterDrop();
        this._rightMonsterDropCtrl.initMonsterDrop();
        GameEvent.on(EventEnum.ON_OBJ_DIE, this.onDied, this);
        GameEvent.on(EventEnum.SHOW_GAME_START_VIEW, this.showGameStarView, this);
        GameEvent.on(EventEnum.DO_FAIL, this.doFaild, this);
        GameEvent.on(EventEnum.SOCKET_CONNECTED, this.onSocketConnected, this);
        GameEvent.on(EventEnum.GAME_PAUSE , this.onGamePause , this);
        GameEvent.onReturn(EventEnum.CALC_END_DRAG_TOWER , this.getHeroByPos , this);
        // this.testSommon();
        GameEvent.emit(EventEnum.INIT_MAP_DATA_END);
    }

    protected onCityWallHurt(value:number , camp:ECamp = ECamp.BLUE) {
        this.mapLife += value;
    }

    ////////////////////////////////////////////////////////////////////////////

    getEmptySpace(x:number , y:number , campId:ECamp = ECamp.BLUE):[number , number] {
        if (y <= this._centerRoadLeftTopPos.y) {
            return [this._centerRoadLeftTopPos.x , this._centerRoadLeftTopPos.x];
        }

        let minx = x;
        let maxx = x;
        let leftDone = false;
        let rightDone = false;

        for (let i = 1; i < 30 ; i++) {
            // 检查左边
            if (!leftDone) {
                const tempx = x - i * 10;
                if (tempx < 0 || this.calcHitTopY(tempx) > y) {

                    leftDone = true;
                } else {
                    minx = tempx;
                }
            }

            // 检查右边
            if (!rightDone) {
                const tempx = x + i * 10;
                if (tempx >= LdCooperateCtrl.MAP_WID || this.calcHitTopY(tempx) > y) {
                    rightDone = true;
                } else {
                    maxx = tempx;
                }
            }

            // 如果两边都完成了，就提前退出循环
            if (leftDone && rightDone) {
                break;
            }
        }
        return [minx , maxx];
    }


    /**
     * 计算两线段是否相交，返回交点（如果有）
     */
    private calcSegmentIntersectPos(p1:cc.Vec2, p2:cc.Vec2, q1:cc.Vec2, q2:cc.Vec2): cc.Vec2|null {
        const dx1 = p2.x - p1.x;
        const dy1 = p2.y - p1.y;
        const dx2 = q2.x - q1.x;
        const dy2 = q2.y - q1.y;
        const denominator = dx1 * dy2 - dy1 * dx2;
        if(denominator === 0) return null;
        const dx = q1.x - p1.x;
        const dy = q1.y - p1.y;
        const t = (dx * dy2 - dy * dx2) / denominator;
        const u = (dx * dy1 - dy * dx1) / denominator;
        if(t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            return new cc.Vec2(p1.x + t * dx1, p1.y + t * dy1);
        }
        return null;
    }


    /**
     * 召唤物寻找移动路径，使用递归分割算法在多边形障碍物中寻找路径。
     * 
     * @param sx 起始点x坐标
     * @param sy 起始点y坐标
     * @param tx 目标点x坐标
     * @param ty 目标点y坐标
     * @param campId 阵营ID
     * @returns 返回路径点数组，包含起点和终点
     */
    public sommonFindMovePath(sx: number, sy: number, tx: number, ty: number, campId: ECamp = ECamp.BLUE): Pos[] {

        const endIsLeft = tx <= this._maxHalfWid;
        const blockPoints = endIsLeft ? this._blockPoints1 : this._blockPoints2;

        const index = this.calcHitPoint(tx , 2000 , blockPoints , this._tempPoint1);
        if (index != -1 && ty < this._tempPoint1.y) {
            // cc.log('终点矫正：' , ty , this._tempPoint1.y);
            ty = this._tempPoint1.y + 1;
        }


        const start = cc.v2(sx, sy);
        const end = cc.v2(tx, ty);

        const recursivePath = this.findPathRecursive(start, end, 0);

        if (recursivePath) {
            // 将起点加入并优化路径
            const finalPath = this.optimizePath([start].concat(recursivePath));
            return finalPath.map(p => Pos.getPos(p.x, p.y));
        }

        // 如果找不到路径，返回包含起点和终点的直线路径作为备用
        return [Pos.getPos(sx, sy), Pos.getPos(tx, ty)];
    }

    /**
     * 递归寻找路径的核心函数
     * @param start 起点
     * @param end 终点
     * @param depth 当前递归深度，防止无限循环
     * @returns 返回路径节点数组 (不包含起点), 或者在找不到路径时返回 null
     */
    private findPathRecursive(start: cc.Vec2, end: cc.Vec2, depth: number): cc.Vec2[] | null {
        const MAX_DEPTH = 10; // 最大递归深度
        if (depth > MAX_DEPTH) {
            return null;
        }

        // 1. 检查起点和终点之间是否有障碍物
        if (!this.isPathBlocked(start, end)) {
            return [end]; // 路径通畅，直接返回终点
        }

        // 2. 路径被阻挡，找到最近的交点信息
        const intersectionInfo = this.findNearestIntersection(start, end);
        if (!intersectionInfo) {
            return null; // 理论上不应该发生，因为 isPathBlocked 返回 true
        }

        // 3. 关键改动：不再直接使用障碍物的顶点，
        //    而是计算一个在障碍物边缘外侧的“安全点”来作为绕行目标。
        //    这可以彻底解决路径目标点刚好落在障碍物边界上，导致递归卡死的问题。
        const detourPoints = this.getSafeDetourPoints(intersectionInfo.edge[0], intersectionInfo.edge[1], end);

        // 4. 依次尝试两个“安全”的绕行点
        for (const detourPoint of detourPoints) {
            const path_part1 = this.findPathRecursive(start, detourPoint, depth + 1);
            if (path_part1) {
                const path_part2 = this.findPathRecursive(detourPoint, end, depth + 1);
                if (path_part2) {
                    return path_part1.concat(path_part2); // 找到一条完整路径，返回
                }
            }
        }

        return null; // 两条绕行路径都失败
    }

    private sommonFindPathOffsetY:number = 10;
    private sommonFindPathOffsetX:number = 30;

    /**
     * 根据障碍物的边，计算出两个在障碍物外侧的安全绕行点
     * @param v1 边的顶点1
     * @param v2 边的顶点2
     * @param finalEnd 最终的目标点，用于排序
     */
    private getSafeDetourPoints(v1: cc.Vec2, v2: cc.Vec2, finalEnd: cc.Vec2): cc.Vec2[] {
        
        v1 = v1.clone();
        v2 = v2.clone();
        v1.y += this.sommonFindPathOffsetY;
        v2.y += this.sommonFindPathOffsetY;
        const a = finalEnd.x < this._maxHalfWid ? 1 : -1;
        v1.x += this.sommonFindPathOffsetX * a;
        v2.x += this.sommonFindPathOffsetX * a;
       
        const edgeVec = v2.clone().sub(v1);
        
        // 关键假设：我们假设障碍物多边形的顶点是按“顺时针”顺序定义的。
        // 基于此，(dy, -dx)可以计算出指向障碍物外部的法线。
        const outwardNormal = cc.v2(edgeVec.y, -edgeVec.x).normalize();
        const offset = 30.0; // 将绕行点向外偏移2个单位，确保它在障碍物之外

        const safe_v1 = v1.add(outwardNormal.mul(offset));
        const safe_v2 = v2.add(outwardNormal.mul(offset));

        // 优先选择更高的顶点绕行
        if (safe_v1.y > safe_v2.y) {
            return [safe_v1, safe_v2];
        } else {
            return [safe_v2, safe_v1];

        }
    }

    /**
     * 检查路径是否被任何障碍物阻挡
     */
    private isPathBlocked(p1: cc.Vec2, p2: cc.Vec2): boolean {
        return this.isSegmentIntersectPolygon2(p1, p2, this._blockPoints1) || this.isSegmentIntersectPolygon2(p1, p2, this._blockPoints2);
    }

    /**
     * 找到线段与所有障碍物相交的、离起点最近的交点
     * @returns 返回交点信息，包括交点坐标和相交的边
     */
    private findNearestIntersection(start: cc.Vec2, end: cc.Vec2): { point: cc.Vec2; edge: [cc.Vec2, cc.Vec2] } | null {
        let nearest: { point: cc.Vec2; edge: [cc.Vec2, cc.Vec2] } | null = null;
        let minDistance = Infinity;
        const obstacles = [this._blockPoints1, this._blockPoints2];

        for (const block of obstacles) {
            if (!block || block.length === 0) continue;
            for (let i = 0; i < block.length; i++) {
                const p1 = block[i];
                const p2 = block[(i + 1) % block.length];
                const intersectionPoint = this.calcSegmentIntersectPos(start, end, p1, p2);

                if (intersectionPoint) {
                    // BUG 修复: 使用 distancesqr 方法来计算距离，避免修改 'start' 向量。
                    // 之前的代码 start.sub(intersectionPoint) 会改变 start 向量的值，
                    // 导致后续的递归计算出错。
                    const dist =  MathUtils.getDistance(start.x , start.y, intersectionPoint.x , intersectionPoint.y);
                    if (dist < minDistance) {
                        minDistance = dist;
                        nearest = { point: intersectionPoint, edge: [p1, p2] };
                    }
                }
            }
        }
        return nearest;
    }

    /**
     * 优化路径，移除路径中可以被直线替代的多余节点
     */
    private optimizePath(path: cc.Vec2[]): cc.Vec2[] {
        if (path.length < 3) {
            return path;
        }
        const optimizedPath: cc.Vec2[] = [path[0]];
        let i = 0;
        while (i < path.length - 1) {
            let lastVisibleIndex = i + 1;
            for (let j = i + 2; j < path.length; j++) {
                if (!this.isPathBlocked(path[i], path[j])) {
                    lastVisibleIndex = j;
                }
            }
            optimizedPath.push(path[lastVisibleIndex]);
            i = lastVisibleIndex;
        }
        return optimizedPath;
    }


    /**
     * 判断线段与多边形是否相交
     */
    private isSegmentIntersectPolygon2(p1: cc.Vec2, p2: cc.Vec2, polygon: cc.Vec2[]): boolean {
        if (!polygon) return false;
        for (let i = 0; i < polygon.length; i++) {
            const a = polygon[i];
            const b = polygon[(i + 1) % polygon.length];
            // 关键修复：调用我们修正过的、更精确的 calcSegmentIntersectPos 函数
            // 来进行相交判断。如果该函数返回一个非 null 的交点，则说明路径被阻挡。
            if (this.calcSegmentIntersectPos(p1, p2, a, b)) {
                return true;
            }
        }
        return false;
    }

    checkHaveBlock(sx:number , sy:number , tx:number , ty:number , campId:ECamp = ECamp.BLUE):boolean {
        this._tempPoint1.x = sx;
        this._tempPoint1.y = sy;
        this._tempPoint2.x = tx;
        this._tempPoint2.y = ty;
        const flag1 = this.isSegmentIntersectPolygon(this._tempPoint1 , this._tempPoint2 , this._blockPoints1);
        const flag2 = this.isSegmentIntersectPolygon(this._tempPoint1 , this._tempPoint2 , this._blockPoints2);
        return flag1 || flag2;
    }

    /**
     * 在二维网格上寻找从指定位置移动到目标位置的路径。
     *
     * @param x 起始位置的 x 坐标。
     * @param y 起始位置的 y 坐标。
     * @param halfWid 物体宽度的一半。
     * @returns 返回从起始位置到目标位置的路径，路径上的每一个点都是一个 Pos 对象。
     * 算法说明：
     * - 每次优先向目标纵向靠近，若遇到阻挡则尝试横向绕行。
     * - 横向绕行时根据格子高度调整路径点。
     * - 最多迭代20次，防止死循环。
     */
    /**
     * 寻找宽体物体的移动路径。
     * @param x 起始x坐标
     * @param y 起始y坐标
     * @param halfWid 物体半宽
     * @returns 路径点数组
     */
    public findMovePath(x: number, y: number, halfWid: number): Pos[] {
        const path: Pos[] = [Pos.getPos(x, y)];
        const MAX_ITERATIONS = 20;
        let iterationCount = 0;
        // 约束物体半宽，确保其在合理范围内
        const constrainedHalfWid = Math.min(Math.max(halfWid, 10), LdCooperateCtrl.HALF_GRID_WID - 5);
        const isLeft = x < this._maxHalfWid;
        const dir = isLeft ? 1 : -1;

        const blocks:cc.Vec2[] = isLeft ? this._blockPoints1 : this._blockPoints2;
        while (iterationCount++ < MAX_ITERATIONS) {    
            const edgeX = isLeft ? x - constrainedHalfWid : x + constrainedHalfWid;
            if ((isLeft && edgeX >= this._centerRoadLeftTopPos.x) || (!isLeft && edgeX <= this._centerRoadRightTopPos.x)) {
                path.push(Pos.getPos(x , 0));
                break;
            }
            //检测x，edgeX 与blocks最高的线段碰撞点
            const index1 = this.calcHitPoint(edgeX , 2000 , blocks , this._tempPoint1);
            //只判断边缘碰撞，因为地势原因边缘肯定比中间点高
            if (index1 !== -1) {
                const edgeNextBlockPos = isLeft ? blocks[index1] : blocks[index1 + 1];
                const nextBlockPos =  edgeNextBlockPos ;
                const tempPos = this._tempPoint1 ;

                //如果边缘点与中间点与blocks相交的最高线段相同
                path.push(Pos.getPos(x , tempPos.y));
                const nextX = nextBlockPos.x + dir * (constrainedHalfWid + 1); //避免碰撞到同一个线段
                const nextY = nextBlockPos.y;
                path.push(Pos.getPos(nextX , nextY));
                x = nextX;
                y = nextY;
            }
        }
        if (iterationCount >= MAX_ITERATIONS) {
            Debug.warn(TAG.DEFAULT, 'findMovePath exceeded maximum iterations');
        }
        return path;
    }

    calcHitTopY(x:number ):number {
        if (x <= this._centerRoadLeftTopPos.x) {
            const index = this.calcHitPoint(x , 2000 , this._blockPoints1 , this._tempPoint1);
            if (index !== -1) {
                return this._tempPoint1.y;
            }
        } else if (x >= this._centerRoadRightTopPos.x) {
            const index = this.calcHitPoint(x , 2000 , this._blockPoints2 , this._tempPoint1);
            if (index !== -1) {
                return this._tempPoint1.y;
            }
        } 

        return 0;
    }

    

    private _tempPoint1:cc.Vec2 = new cc.Vec2();
    private _tempPoint2:cc.Vec2 = new cc.Vec2();
    private calcHitPoint(x:number , y:number , blocks:cc.Vec2[] , outPoint:cc.Vec2):number {
        let maxY = -Infinity;
        let index = -1;
        for (let i = 0, n = blocks.length; i < n; ++i) {
            let a = blocks[i];
            let b = blocks[(i + 1) % n];
            if ((a.x - x) * (b.x - x) > 0) continue;
            if (a.x === b.x && a.x !== x) continue;
            if (a.x === b.x && a.x === x) {
                let minY = Math.min(a.y, b.y);
                let maxYEdge = Math.max(a.y, b.y);
                if (maxYEdge < y && maxYEdge > maxY) {
                    maxY = maxYEdge;
                    outPoint.x = x;
                    outPoint.y = maxYEdge;
                    index = i;
                }
                if (minY < y && minY > maxY) {
                    maxY = minY;
                    outPoint.x = x;
                    outPoint.y = minY;
                    index = i;
                }
            } else {
                let t = (x - a.x) / (b.x - a.x);
                if (t < 0 || t > 1) continue;
                let interY = a.y + (b.y - a.y) * t;
                if (interY < y && interY > maxY) {
                    maxY = interY;
                    outPoint.x = x;
                    outPoint.y = interY;
                    index = i;

                }
            }
        }
        return index;
    }

    /**
     * 判断线段与多边形是否相交
     */
    private isSegmentIntersectPolygon(p1: cc.Vec2, p2: cc.Vec2, polygon: cc.Vec2[]): boolean {
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const a = polygon[i], b = polygon[j];
            if (this.isSegmentIntersect(p1, p2, a, b)) return true;
        }
        return false;
    }

    /**
     * 判断两线段是否相交
     */
    private isSegmentIntersect(p1: cc.Vec2, p2: cc.Vec2, q1: cc.Vec2, q2: cc.Vec2): boolean {
        function cross(p: cc.Vec2, q: cc.Vec2, r: cc.Vec2) {
            return (q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x);
        }
        return (Math.max(p1.x, p2.x) >= Math.min(q1.x, q2.x)) &&
            (Math.max(q1.x, q2.x) >= Math.min(p1.x, p2.x)) &&
            (Math.max(p1.y, p2.y) >= Math.min(q1.y, q2.y)) &&
            (Math.max(q1.y, q2.y) >= Math.min(p1.y, p2.y)) &&
            (cross(p1, p2, q1) * cross(p1, p2, q2) <= 0) &&
            (cross(q1, q2, p1) * cross(q1, q2, p2) <= 0);
    }

   

    private getHeroByPos(relay:Reply , x:number , y:number , campId:ECamp = ECamp.BLUE) {
        const logicInfo = campId == ECamp.BLUE ? this._leftLogicInfo : this._rightLogicInfo;
        logicInfo.getHeroByPos(relay , x , y);
    }

    /**
     * 进入地图完成
     */
    enterMapComplete() {
        this.onStartGame();
    }

    getGridX(x:number):number {
        return Math.floor((x - LdCooperateCtrl.FIRST_GRID_LEFT) / LdCooperateCtrl.GRID_WID);
    }

    getGridY(y:number , campId:ECamp = ECamp.BLUE):number {
        const gridHeight = LdCooperateCtrl.GRID_HGT; // 83
        const topOffset = LdCooperateCtrl.HALF_GRID_HGT; // 顶部离中心点的距离
        // 计算y相对于第0行网格顶部的偏移量
        const offsetFromTop = y - (LdCooperateCtrl.FIRST_GRID_Y + topOffset);
        // 通过偏移量除以格子高度，向下取整得到行索引
        const index = Math.floor(offsetFromTop / gridHeight) + 1;
        // 返回索引，确保不小于0
        return Math.max(0, index);
    }

    getGridCenterX(gx:number):number {
        return LdCooperateCtrl.FIRST_GRID_X + gx * LdCooperateCtrl.GRID_WID;
    }

    getGridCenterY(gy:number , campId:ECamp = ECamp.BLUE):number {
        const y = LdCooperateCtrl.FIRST_GRID_Y + gy * LdCooperateCtrl.GRID_HGT;
        return y;
    }
    
    getGridTop(gy:number , campId:ECamp = ECamp.BLUE):number {
        const y = LdCooperateCtrl.FIRST_GRID_Y + gy * LdCooperateCtrl.GRID_HGT + 55;
        return y;
    }

    mirrorY(y:number , campId:ECamp = ECamp.BLUE):number {
        return y;
    }

    protected onKillMapAllMonster() {
        this.onSuccess();
    }

     protected onSuccess() {
        if (this._gameState > GameState.PLAYING) {
            this._gamewin = true;
            return;
        }
        this._gameState = GameState.SUCCESS;
        this._sys.pauseGame('gameover' , true);
        Game.ldGameMgr.reqCooperateSuccess();
    }

    getEmptyGridTopYByGx(gx:number , campId:ECamp = ECamp.BLUE):number {
        // const logicInfo = campId == ECamp.BLUE ? this._selfLogicInfo : this._enemyLogicInfo;
        return 0;
    }

    protected onStartGame() {
        this._startTime = GlobalVal.now;
        this._startTimerServer = GlobalVal.getServerTime();
        this._createMonsterCtrl.setStartBoTimer(1000, true);
        this._redCreateMonsterCtrl.setStartBoTimer(1000, true);
        this.playCurrCheckPointMusic();
        GameEvent.emit(EventEnum.LD_START_GAME);
    }



    protected tryReconnect() {
        UiManager.showDialog(EResPath.RECONNECT_VIEW);
        GameEvent.emit(EventEnum.RECONNECT_FAIL);
    }

    /**场景中一个物体死亡 */
    protected onDied(target: Creature, cfg?: any, x?: number, y?: number) {
        if (SoType.isSommon(target)) return;
        if (this._createMonsterCtrl.createCompleted && this._redCreateMonsterCtrl.createCompleted) {
            let allMonster: any[] = Game.soMgr.getAllMonster();
            let len: number = allMonster.length;
            let monster: any;
            let isClear: boolean = true;
            for (let i = 0; i < len; i++) {
                monster = allMonster[i];
                if (monster.cfg && monster.isCreatePosMonster()) {
                    isClear = false;
                    break;
                }
            } 
            if (isClear) {
                this.onKillMapAllMonster();
            }
        }
    }



    /**
     * 执行失败
     */
    protected doFaild() {
        if (this._gameState > GameState.PLAYING) return;
        this._gameState = GameState.FAIL;
        this._sys.pauseGame('gameover' , true);
        this.onGameFail();

    }

    protected onSocketConnected() {
        if (this._cacheWinObj) {
            Game.sceneNetMgr.reqWarSuccess(this._cacheWinObj.warid, this._cacheWinObj.score, this._cacheWinObj.leftHp, this._cacheWinObj.leftTime);
        } else if (this._cacheFailObj) {
            Game.sceneNetMgr.reqWarFail(this._cacheFailObj.warid, this._cacheFailObj.realFail);
        }
    }

    protected onGameFail(data: GS_SceneWarFail = null) {
        this._gameState = GameState.FAIL;
        if (this._waitExitGame) {
            this.exitMap();
        } else {
            UiManager.showDialog(EResPath.GAME_FAILD_VIEW);
        }
    }
    

    /**离开地图 */
    protected exitMap(isFail: boolean = false, isReconnect: boolean = false) {
        GlobalVal.mirrorSceneObj = false;
        // if (this.isPlaying() && !isReconnect) {
        //     this._waitExitGame = true;
        //     Game.sceneNetMgr.reqWarFail(this._curMissonData.nwarid);
        //     return;
        // }
        this.clearMap();
        // if (!isReconnect) {
            SceneMgr.instance.loadSceneWithTransition(SCENE_NAME.Hall, null, null, SceneMgr.instance.getTransition(GlobalVal.curMapCfg ? GlobalVal.curMapCfg.nwarid : null));
        // }
    }

     protected clearMap() {
        super.clearMap();
        this._cityWall = null;
        Game.soundMgr.stopMusic();
        this._leftLogicInfo.clearMap();
        this._rightLogicInfo.clearMap();
        this._createMonsterCtrl.exitMap();
        this._redCreateMonsterCtrl.exitMap();
        this._cooperateRobot.exitMap();
        // this.coin = 0;
        this._curMissonData = null;
        this._gameState = GameState.NONE;
        this._gamewin = false;
        this._isInit = false;
        this._startTime = 0;
        this._startTimerServer = 0;
        Game.actorMgr.reconnectionid = 0;
        this._mapCtrl.exitMap();
        this._cacheWinObj = null;
        this._cacheFailObj = null;
        this.hideGameUi();
        this._sys.warSpeed = 1;
        GlobalVal.warSpeed = 1;
        this._sys.pause = false;
        this._leftMonsterDropCtrl.resetMonsterDrop();
        this._rightMonsterDropCtrl.resetMonsterDrop();
        SysMgr.instance.clearTimerByTarget(this);
        GameEvent.emit(EventEnum.EXIT_GAME_SCENE);
        Game.soMgr.clearAll();
        Game.ldSkillMgr.clearReleaseSkill();
        GlobalVal.defaultAngle = 0;
        Game.curLdGameCtrl = null;
    }

    isPlaying(): boolean {
        return this._gameState == GameState.PLAYING;
    }

     private onGamePause(flag:boolean) {
        const curTime = GlobalVal.getServerTime();
        if (flag) {
            this._totalTime += (curTime - this._preTime);
        } else {
            this._preTime = curTime;
        }
    }
    

    private resetDatas() {
        this._winState = {};
        this._cacheWinObj = this._cacheFailObj = null;
        this._preTime = GlobalVal.getServerTime();
        this._totalTime = 0;
    }



    getHeroBuildingCtrl(camp:ECamp = ECamp.BLUE ):HeroBuildingCtrl {
        const logicInfo = camp == ECamp.BLUE ? this._leftLogicInfo : this._rightLogicInfo;
        return logicInfo.getHeroBuildingCtrl();
    }

    protected onAddCoin(value:number , camp:ECamp = ECamp.BLUE) {
        this._leftLogicInfo.addCoin(value , ECamp.BLUE);
        this._rightLogicInfo.addCoin(value , ECamp.COOPERATE);
    }

    getSelfCoin():number {
        return this._selfLogicInfo.coin;
    }


    getHeroTable(gx:number , gy:number , camp:ECamp = ECamp.BLUE):HeroTable {
        const logicInfo = camp == ECamp.BLUE ? this._leftLogicInfo : this._rightLogicInfo;
        return logicInfo.getHeroTable(gx , gy);
    }

    getEndTarget():Monster {
        return this._cityWall;
    }

    getDirAmmoArea(camp:ECamp):cc.Rect {
        return this._dirAmmoArea;
    }

    getDirAmmoCheckHitArea(camp:ECamp):cc.Rect {
        return this._dirAmmoCheckHitArea ;
    }

    
}