import { ECamp, GAME_TYPE, GameState } from "../common/AllEnum";
import { EResPath } from "../common/EResPath";
import { EventEnum } from "../common/EventEnum";
import SceneMgr, { SCENE_NAME } from "../common/SceneMgr";
import Game from "../Game";
import GlobalVal from "../GlobalVal";
import { GS_SceneWarFail } from "../net/proto/DMSG_Plaza_Sub_Scene";
import { SCOREFLAG } from "../net/socket/handler/MessageEnum";
import { GameEvent, Reply } from "../utils/GameEvent";
import { MathUtils } from "../utils/MathUtils";
import { UiManager } from "../utils/UiMgr";
import { GamePlayerLogicInfo } from "./GamePlayerLogicInfo";
import { HeroBuildingCtrl } from "./HeroBuildingCtrl";
import { LDBaseGameCtrl } from "./LDBaseGameCtrl";
import { LDMonsterDropCtrl } from "./LDMonsterDropCtrl";
import { LdMapCtrl } from "./map/LdMapCtrl";
import { LDCreateMonsterCtrl } from "./monster/LDCreateMonsterCtrl";
import { Pos } from "./Pos";
import { HeroTable } from "./tower/HeroTable";

export class NormalGameCtrl extends LDBaseGameCtrl {

    static TOWER_COL = 7;
    static GRID_WID = 88;
    static GRID_HGT = 83;
    static HALF_GRID_WID = 44;
    static HALF_GRID_HGT = 55;
    static FIRST_GRID_X = 93;
    static FIRST_GRID_Y = 23.5;
    static FIRST_GRID_LEFT = 49;

    private _gamewin:boolean = false;
    private _winState:any = {};
    private _preTime:number = 0;
    private _totalTime:number = 0;
    private _startTimerServer:number = 0;
    private _playTime:number = 0;
    private _cacheWinObj:any = {};
    private _cacheFailObj:any = {};
    private _waitExitGame:boolean = false;

    
    private _monsterDropCtrl:LDMonsterDropCtrl = new LDMonsterDropCtrl(this);
    private _selfLogicInfo:GamePlayerLogicInfo ;

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

    constructor() {
        super();
        this._mapCtrl = new LdMapCtrl();
        this._createMonsterCtrl = new LDCreateMonsterCtrl(this, this._mapCtrl);
        this._selfArea.x = NormalGameCtrl.FIRST_GRID_LEFT;
        this._selfArea.y = 0;
        this._selfArea.width = NormalGameCtrl.GRID_WID * NormalGameCtrl.TOWER_COL;
        this._selfArea.height = 1700;
        this._gameCommonConfig = Game.gameConfigMgr.getGameCommonConfig((GAME_TYPE.NORMAL + 1).toString());
        this._selfLogicInfo = new GamePlayerLogicInfo(this._gameCommonConfig , ECamp.BLUE , this);
    }

    loadGameScene() {
        super.loadGameScene();
        SceneMgr.instance.loadSceneWithTransition(SCENE_NAME.LD_NORMAL, null, null, SceneMgr.instance.getTransition(GlobalVal.curMapCfg ? GlobalVal.curMapCfg.nwarid : null), true);
    }

     enterMap() {
        super.enterMap();
        
        this._waitExitGame = false;
        MathUtils.setRandomSeed(GlobalVal.getServerTimeS());
        GlobalVal.recordEnterMapTime();
        GlobalVal.totalBlood = 0;
        GlobalVal.checkDialogPauseGame = true;
        this._createMonsterCtrl.enterMap(GlobalVal.curMapCfg , Game.gameConfigMgr.getMissionBrushList(GlobalVal.curMapCfg.nwarid));
        this._curMissonData = GlobalVal.curMapCfg;
        this.mapLifeMax = this._gameCommonConfig.cityWallHp;
        this.mapLife = this.mapLifeMax;
        this._gamewin = false;
        this._gameState = GameState.PLAYING;
        this.resetDatas();
        this._selfLogicInfo.enterMap();
        this._selfLogicInfo.coin = this._gameCommonConfig.baseCoin;
        this._monsterDropCtrl.initMonsterDrop();
        GameEvent.on(EventEnum.ON_OBJ_DIE, this.onDied, this);
        GameEvent.on(EventEnum.SHOW_GAME_START_VIEW, this.showGameStarView, this);
        GameEvent.on(EventEnum.DO_FAIL, this.doFaild, this);
        GameEvent.on(EventEnum.SOCKET_CONNECTED, this.onSocketConnected, this);
        GameEvent.on(EventEnum.GAME_PAUSE , this.onGamePause , this);

        GameEvent.onReturn(EventEnum.CALC_END_DRAG_TOWER , this.getHeroByPos , this);
        GameEvent.onReturn('getwarstar' , this.calcWarStar , this);
        // this.testSommon();
        GameEvent.emit(EventEnum.INIT_MAP_DATA_END);
    }

    /*
    /////////////////////////////////////////测试召唤物寻怪代码开始
    private _testMonster:Monster;
    private testSommon() {
        this._testMonster = Game.soMgr.createMonster(10 , 10000);
        this._testMonster.setPos(100 , 100);
        GameEvent.on(EventEnum.TOUCH_EMPTY_POS , this.onTouchEmptyPos , this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }
    private onKeyUp(event:cc.Event.EventKeyboard) {
        if (event.keyCode == cc.macro.KEY.a) {
            this.testCreateSommon();
        } else if (event.keyCode == cc.macro.KEY.s) {
            this.tryCreateTestTable();
        }
    }
    private testCreateSommon() {
        const gx = MathUtils.randomInt(0 , 6);
        const gy = this._readyCreateTableGxList[gx];
        const sommon = Game.soMgr.createSommonCreature(2051 , 1);
        sommon.setPos(this.getGridCenterX(gx) , this.getGridTop(gy));
    }
    private tryCreateTestTable() {
        this.tryCreateTable();
    }
    private onTouchEmptyPos(pos:cc.Vec2) {
        this._testMonster.setPosNow(pos.x , pos.y);
    }
    */
    /////////////////////////////////////////测试召唤物寻怪代码结束
    ////////////////////////////////////////////////////////////////////////////

    /**
     * 召唤物寻找移动路径，优先避开阻挡，尽量沿横向移动，遇阻时尝试垂直绕行。
     * 
     * @param sx 起始点x坐标
     * @param sy 起始点y坐标
     * @param tx 目标点x坐标
     * @param ty 目标点y坐标
     * @returns 返回路径点数组，包含起点和终点，中间点为绕行路径
     */
    public sommonFindMovePath(sx: number, sy: number, tx: number, ty: number): Pos[] {
        return this._selfLogicInfo.sommonFindMovePath(sx , sy , tx , ty);
    }

    checkHaveBlock(sx:number , sy:number , tx:number , ty:number):boolean {
        return this._selfLogicInfo.checkHaveBlock(sx , sy , tx , ty);
    }

    /**
     * 在二维网格上寻找从指定位置移动到目标位置的路径。
     *
     * @param x 起始位置的 x 坐标。
     * @param y 起始位置的 y 坐标。
     * @param halfWid 网格宽度的一半。
     * @returns 返回从起始位置到目标位置的路径，路径上的每一个点都是一个 Pos 对象。
     */
    public findMovePath(x: number, y: number, halfWid: number): Pos[] {
        return this._selfLogicInfo.findMovePath(x , y , halfWid);
    }

    private getHeroByPos(relay:Reply , x:number , y:number) {
        this._selfLogicInfo.getHeroByPos(relay , x , y);
    }

    getEmptySpace(x:number , y:number):[number , number] {
        const gx = this.getGridX(x);
        const gy = this.getGridY(y);

        let minGx = gx;
        let maxGx = gx;
        let leftDone = false;
        let rightDone = false;

        for (let i = 1; i < NormalGameCtrl.TOWER_COL; i++) {
            // 检查左边
            if (!leftDone) {
                const tempGx = gx - i;
                if (tempGx < 0 || this._selfLogicInfo.getHeroTable(tempGx, gy)) {
                    leftDone = true;
                } else {
                    minGx = tempGx;
                }
            }

            // 检查右边
            if (!rightDone) {
                const tempGx = gx + i;
                if (tempGx >= NormalGameCtrl.TOWER_COL || this._selfLogicInfo.getHeroTable(tempGx, gy)) {
                    rightDone = true;
                } else {
                    maxGx = tempGx;
                }
            }

            // 如果两边都完成了，就提前退出循环
            if (leftDone && rightDone) {
                break;
            }
        }

        return [this.getGridCenterX(minGx) - NormalGameCtrl.HALF_GRID_WID, this.getGridCenterX(maxGx) + NormalGameCtrl.HALF_GRID_WID];
    }

    /**
     * 进入地图完成
     */
    enterMapComplete() {
        this.onStartGame();
    }

    getGridX(x:number):number {
        return Math.floor((x - NormalGameCtrl.FIRST_GRID_LEFT) / NormalGameCtrl.GRID_WID);
    }

    getGridY(y:number):number {
        const gridHeight = NormalGameCtrl.GRID_HGT; // 83
        const topOffset = NormalGameCtrl.HALF_GRID_HGT; // 顶部离中心点的距离
        // 计算y相对于第0行网格顶部的偏移量
        const offsetFromTop = y - (NormalGameCtrl.FIRST_GRID_Y + topOffset);
        // 通过偏移量除以格子高度，向下取整得到行索引
        const index = Math.floor(offsetFromTop / gridHeight) + 1;
        // 返回索引，确保不小于0
        return Math.max(0, index);
    }

    getGridCenterX(gx:number):number {
        return NormalGameCtrl.FIRST_GRID_X + gx * NormalGameCtrl.GRID_WID;
    }

    getGridCenterY(gy:number):number {
        return NormalGameCtrl.FIRST_GRID_Y + gy * NormalGameCtrl.GRID_HGT;
    }
    
    getGridTop(gy:number):number {
        return NormalGameCtrl.FIRST_GRID_Y + gy * NormalGameCtrl.GRID_HGT + NormalGameCtrl.HALF_GRID_HGT;
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
       
        let starLv: number = this.calcWarStar();

        let score = 0;

        score |= SCOREFLAG['SCOREFLAG_GRADE' + starLv];
        this._playTime = GlobalVal.getServerTime() - this._startTimerServer;


        let leftHp = this.mapLife;
        

        // if (!SocketManager.instance.isConnected) {
        //     this._cacheWinObj = { warid: this._curMissonData.nwarid, score: score, leftHp: leftHp};
        //     this.tryReconnect();
        // } else {
            // Game.sceneNetMgr.reqWarSuccess(this._curMissonData.nwarid, score, leftHp);
        // }

        // this.onGameSuccess();
        Game.ldGameMgr.reqSuccess(this._curMissonData.nwarid);
        

    }

    getEmptyGridTopYByGx(gx:number):number {
        return this._selfLogicInfo.getEmptyGridTopYByGx(gx);
    }

    protected onStartGame() {
        this._startTime = GlobalVal.now;
        this._startTimerServer = GlobalVal.getServerTime();
        this._createMonsterCtrl.setStartBoTimer(1000, true);
        this.playCurrCheckPointMusic();
        GameEvent.emit(EventEnum.LD_START_GAME);
    }

    private calcWarStar() {
        const starValue = this.mapLife;
        const star = this.calcStar(starValue);
        return star;
    }

    calcStar(value: number): number {
        // if (value >= this._curMissonData.nstar3rule) {
        //     return 3;
        // } else if (value >= this._curMissonData.nstar2rule) {
        //     return 2;
        // }
        // return 1;

        return 1;
    }

    protected tryReconnect() {
        UiManager.showDialog(EResPath.RECONNECT_VIEW);
        GameEvent.emit(EventEnum.RECONNECT_FAIL);
    }

    /**场景中一个物体死亡 */
    protected onDied(target: any, cfg?: any, x?: number, y?: number) {
        if (this._createMonsterCtrl.createCompleted) {
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
        if (this._gameState > GameState.PLAYING && this._gameState != GameState.REVICE) return;
        this._gameState = GameState.FAIL;
        this._sys.pauseGame('gameover' , true);
        this.onGameFail();
        /*
        if (!SocketManager.instance.isConnected) {
            this._cacheFailObj = { warid: this._curMissonData.nwarid };
            this.tryReconnect();
        } else {

        }
        */
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
        Game.soundMgr.stopMusic();
        this._selfLogicInfo.clearMap();
        this._createMonsterCtrl.exitMap();
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
        this._monsterDropCtrl.resetMonsterDrop();
        GameEvent.emit(EventEnum.EXIT_GAME_SCENE);
        Game.soMgr.clearAll();
        Game.ldSkillMgr.clearReleaseSkill();
        GlobalVal.defaultAngle = 0;
        Game.curLdGameCtrl = null;
    }

    isPlaying(): boolean {
        return this._gameState == GameState.PLAYING || this._gameState == GameState.REVICE;
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


    getHeroBuildingCtrl(camp:ECamp = ECamp.BLUE):HeroBuildingCtrl {
        return this._selfLogicInfo.getHeroBuildingCtrl();
    }

    protected onAddCoin(value:number , camp:ECamp = ECamp.BLUE) {
        this._selfLogicInfo.addCoin(value , camp);
    }

    getSelfCoin():number {
        return this._selfLogicInfo.coin;
    }


    getHeroTable(gx:number , gy:number):HeroTable {
        return this._selfLogicInfo.getHeroTable(gx , gy);
    }

}