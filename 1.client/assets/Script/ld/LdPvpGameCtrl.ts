import { ECamp, GAME_TYPE, GameState } from "../common/AllEnum";
import { EResPath } from "../common/EResPath";
import { EventEnum } from "../common/EventEnum";
import SceneMgr, { SCENE_NAME } from "../common/SceneMgr";
import SysMgr from "../common/SysMgr";
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
import { GamePlayerLogicInfo } from "./GamePlayerLogicInfo";
import { HeroBuildingCtrl } from "./HeroBuildingCtrl";
import { LDBaseGameCtrl } from "./LDBaseGameCtrl";
import { LDMonsterDropCtrl } from "./LDMonsterDropCtrl";
import { LdMapCtrl } from "./map/LdMapCtrl";
import { LDCreateMonsterCtrl } from "./monster/LDCreateMonsterCtrl";
import { LDPvPCreateMonsterCtrl } from "./monster/LDPvPCreateMonsterCtrl";
import { Pos } from "./Pos";
import { LdPvPRobot } from "./pvp/LdPvPRobot";
import { HeroTable } from "./tower/HeroTable";

export class LdPvpGameCtrl extends LDBaseGameCtrl {

    static TOWER_COL = 7;
    static GRID_WID = 88;
    static GRID_HGT = 83;
    static HALF_GRID_WID = 44;
    static HALF_GRID_HGT = 55;
    static FIRST_GRID_X = 93;
    static FIRST_GRID_Y = 23.5;
    static FIRST_GRID_LEFT = 49;
    static TOTAL_HEIGHT = 2040;

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
    private _selfMonsterDropCtrl:LDMonsterDropCtrl;
    private _enemyMonsterDropCtrl:LDMonsterDropCtrl;
    private _selfLogicInfo:GamePlayerLogicInfo;
    private _enemyLogicInfo:GamePlayerLogicInfo;

    private _redMapLifeMax:number = 0;
    private _redMapLife:number = 0;
    private _pvpRobot:LdPvPRobot = new LdPvPRobot(this);
    private _redArea:cc.Rect;
    private _redDirAmmoArea:cc.Rect;
    private _redDirAmmoCheckHitArea:cc.Rect;

    get redMapLifeMax():number {
        return this._redMapLifeMax;
    }

    get redMapLife():number {
        return this._redMapLife;
    }

    set redMapLife(value:number) {
        this._redMapLife = value;
        GameEvent.emit(EventEnum.LD_RED_MAP_HP_CHANGE , this._redMapLife , this._redMapLifeMax);
        if (this._redMapLife <= 0) {
            this.onSuccess();
        }
    }

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
        this._gameType = GAME_TYPE.PVP;
        this._mapCtrl = new LdMapCtrl();
        this._createMonsterCtrl = new LDPvPCreateMonsterCtrl(this, this._mapCtrl , ECamp.BLUE);
        this._redCreateMonsterCtrl = new LDPvPCreateMonsterCtrl(this, this._mapCtrl , ECamp.RED);
        
        this._gameCommonConfig = Game.gameConfigMgr.getGameCommonConfig((GAME_TYPE.PVP + 1).toString());
        this._selfLogicInfo = new GamePlayerLogicInfo(this._gameCommonConfig , ECamp.BLUE , this);
        this._enemyLogicInfo = new GamePlayerLogicInfo(this._gameCommonConfig , ECamp.RED , this);
        this._selfMonsterDropCtrl = new LDMonsterDropCtrl(this , ECamp.BLUE);
        this._enemyMonsterDropCtrl = new LDMonsterDropCtrl(this , ECamp.RED);
    }

    protected initDirAmmoRect() {
        this._selfArea = new cc.Rect(LdPvpGameCtrl.FIRST_GRID_LEFT , 0 , LdPvpGameCtrl.GRID_WID * LdPvpGameCtrl.TOWER_COL , 900);
        this._redArea = new cc.Rect(LdPvpGameCtrl.FIRST_GRID_LEFT , 1138 , LdPvpGameCtrl.GRID_WID * LdPvpGameCtrl.TOWER_COL , 900);
        this._dirAmmoArea = new cc.Rect(-100 , -300 , 920 , 1200);
        this._redDirAmmoArea = new cc.Rect(-100 , 1138 , 920 , 1200);
        this._dirAmmoCheckHitArea = new cc.Rect(0 , 0 , 720 , 900);
        this._redDirAmmoCheckHitArea = new cc.Rect(0 , 1138 , 720 , 900);
    }

    loadGameScene() {
        super.loadGameScene();
        SceneMgr.instance.loadSceneWithTransition(SCENE_NAME.PvPScene, null, null, SceneMgr.instance.getTransition(GlobalVal.curMapCfg ? GlobalVal.curMapCfg.nwarid : null), true);
    }

     enterMap() {
        super.enterMap();
        GlobalVal.checkDialogPauseGame = false;
        GlobalVal.mirrorSceneObj = true;
        GlobalVal.checkSkillCamp = true;
        this._waitExitGame = false;
        MathUtils.setRandomSeed(GlobalVal.getServerTimeS());
        GlobalVal.recordEnterMapTime();
        GlobalVal.totalBlood = 0;
        this._redKillCount = this._blueKillCount = 0;
        this._createMonsterCtrl.enterMap(GlobalVal.curMapCfg , Game.gameConfigMgr.getPvpBrushList(GlobalVal.curMapCfg.nwarid));
        this._redCreateMonsterCtrl.enterMap(GlobalVal.curMapCfg , Game.gameConfigMgr.getPvpBrushList(GlobalVal.curMapCfg.nwarid));
        this._curMissonData = GlobalVal.curMapCfg;
        this.mapLifeMax = this._gameCommonConfig.cityWallHp;
        this.mapLife = this.mapLifeMax;

        this._redMapLifeMax = this._gameCommonConfig.cityWallHp;
        this.redMapLife = this._redMapLifeMax;

        this._gamewin = false;
        this._gameState = GameState.PLAYING;
        this.resetDatas();
        this._selfLogicInfo.enterMap();
        this._enemyLogicInfo.enterMap();
        this._selfLogicInfo.coin = this._gameCommonConfig.baseCoin;
        this._enemyLogicInfo.coin = this._gameCommonConfig.baseCoin;
        this._pvpRobot.enterMap(this._enemyLogicInfo);
        this._selfMonsterDropCtrl.initMonsterDrop();
        this._enemyMonsterDropCtrl.initMonsterDrop();
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
        if (camp == ECamp.BLUE) {
            this.mapLife += value;
        } else {
            this.redMapLife += value;
        }
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
    public sommonFindMovePath(sx: number, sy: number, tx: number, ty: number , campId:ECamp = ECamp.BLUE): Pos[] {
        const logicInfo = campId == ECamp.BLUE ? this._selfLogicInfo : this._enemyLogicInfo;
        return logicInfo.sommonFindMovePath(sx , sy , tx , ty);
    }

    checkHaveBlock(sx:number , sy:number , tx:number , ty:number , campId:ECamp = ECamp.BLUE):boolean {
        const logicInfo = campId == ECamp.BLUE ? this._selfLogicInfo : this._enemyLogicInfo;
        return logicInfo.checkHaveBlock(sx , sy , tx , ty);
    }

    /**
     * 在二维网格上寻找从指定位置移动到目标位置的路径。
     *
     * @param x 起始位置的 x 坐标。
     * @param y 起始位置的 y 坐标。
     * @param halfWid 网格宽度的一半。
     * @returns 返回从起始位置到目标位置的路径，路径上的每一个点都是一个 Pos 对象。
     */
    public findMovePath(x: number, y: number, halfWid: number , campId:ECamp = ECamp.BLUE): Pos[] {
        const logicInfo = campId == ECamp.BLUE ? this._selfLogicInfo : this._enemyLogicInfo;
        return logicInfo.findMovePath(x , y , halfWid);
    }

    private getHeroByPos(relay:Reply , x:number , y:number , campId:ECamp = ECamp.BLUE) {
        const logicInfo = campId == ECamp.BLUE ? this._selfLogicInfo : this._enemyLogicInfo;
        logicInfo.getHeroByPos(relay , x , y);
    }

    /**
     * 进入地图完成
     */
    enterMapComplete() {
        this.onStartGame();
    }

    getGridX(x:number):number {
        return Math.floor((x - LdPvpGameCtrl.FIRST_GRID_LEFT) / LdPvpGameCtrl.GRID_WID);
    }

    getGridY(y:number , campId:ECamp = ECamp.BLUE):number {
        if (campId == ECamp.RED) {
            y = LdPvpGameCtrl.TOTAL_HEIGHT - y;
        }
        const gridHeight = LdPvpGameCtrl.GRID_HGT; // 83
        const topOffset = LdPvpGameCtrl.HALF_GRID_HGT; // 顶部离中心点的距离
        // 计算y相对于第0行网格顶部的偏移量
        const offsetFromTop = y - (LdPvpGameCtrl.FIRST_GRID_Y + topOffset);
        // 通过偏移量除以格子高度，向下取整得到行索引
        const index = Math.floor(offsetFromTop / gridHeight) + 1;
        // 返回索引，确保不小于0
        return Math.max(0, index);
    }

    getGridCenterX(gx:number):number {
        return LdPvpGameCtrl.FIRST_GRID_X + gx * LdPvpGameCtrl.GRID_WID;
    }

    getGridCenterY(gy:number , campId:ECamp = ECamp.BLUE):number {
        const y = LdPvpGameCtrl.FIRST_GRID_Y + gy * LdPvpGameCtrl.GRID_HGT;
        if (campId == ECamp.RED) {
            return LdPvpGameCtrl.TOTAL_HEIGHT - y;
        }

        return y;
    }
    
    getGridTop(gy:number , campId:ECamp = ECamp.BLUE):number {
        const y = LdPvpGameCtrl.FIRST_GRID_Y + gy * LdPvpGameCtrl.GRID_HGT + 55;
        if (campId == ECamp.RED) {
            return LdPvpGameCtrl.TOTAL_HEIGHT - y;
        }
        return y;
    }

    mirrorY(y:number , campId:ECamp = ECamp.BLUE):number {
        if (campId == ECamp.RED) {
            return LdPvpGameCtrl.TOTAL_HEIGHT - y;
        }
        return y;
    }

    getEmptySpace(x:number , y:number , campId:ECamp = ECamp.BLUE):[number , number] {
        const gx = this.getGridX(x);
        const gy = this.getGridY(y);
        const logicInfo = campId == ECamp.BLUE ? this._selfLogicInfo : this._enemyLogicInfo;

        let minGx = gx;
        let maxGx = gx;
        let leftDone = false;
        let rightDone = false;

        for (let i = 1; i < LdPvpGameCtrl.TOWER_COL; i++) {
            // 检查左边
            if (!leftDone) {
                const tempGx = gx - i;
                if (tempGx < 0 || logicInfo.getHeroTable(tempGx, gy)) {
                    leftDone = true;
                } else {
                    minGx = tempGx;
                }
            }

            // 检查右边
            if (!rightDone) {
                const tempGx = gx + i;
                if (tempGx >= LdPvpGameCtrl.TOWER_COL || logicInfo.getHeroTable(tempGx, gy)) {
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

        return [this.getGridCenterX(minGx) - LdPvpGameCtrl.HALF_GRID_WID, this.getGridCenterX(maxGx) + LdPvpGameCtrl.HALF_GRID_WID];
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
        Game.ldGameMgr.reqSuccessPvp();
    }

    getEmptyGridTopYByGx(gx:number , campId:ECamp = ECamp.BLUE):number {
        const logicInfo = campId == ECamp.BLUE ? this._selfLogicInfo : this._enemyLogicInfo;
        return logicInfo.getEmptyGridTopYByGx(gx);
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


    private _blueKillCount = 0;
    private _redKillCount = 0;

    /**场景中一个物体死亡 */
    protected onDied(target: Creature, cfg?: any, x?: number, y?: number) {
        if (SoType.isMonster(target) && (target as Monster).isCreatePosMonster()) {
            let count = target.camp == ECamp.RED ? this._redKillCount : this._blueKillCount;
            count += 1;
            if (count % this._gameCommonConfig.killMonsterCount == 0) {
                this.createMonsterToEnemy(target.camp)
            }
            
            if (target.camp == ECamp.RED) {
                this._redKillCount = count;
            } else {
                this._blueKillCount = count;
            }

        }


        if (this._createMonsterCtrl.createCompleted && target.camp == ECamp.BLUE) {
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


        if (this._redCreateMonsterCtrl.createCompleted && target.camp == ECamp.RED) {
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
                this.doFaild();
            }
        }

    }

    private createMonsterToEnemy(campId:ECamp) {
        const role = campId == ECamp.BLUE ? this._selfLogicInfo.leadingRole : this._enemyLogicInfo.leadingRole;
        if (!role.isInAct(EActType.ATTACK)) {
            role.animationComp.playAction(EActionName.ATTACK , false);
        }
        SysMgr.instance.doOnce(new Handler(this.doCreateMonster , this , campId) , 500);
    }

    private doCreateMonster(campId:ECamp) {
        const toCampId = campId == ECamp.BLUE ? ECamp.RED : ECamp.BLUE;
        const bloodRatio = toCampId == ECamp.BLUE ? this._createMonsterCtrl.curBloodRate : this._redCreateMonsterCtrl.curBloodRate;
        let monster = Game.soMgr.createMonster(this._gameCommonConfig.createMonsterId , bloodRatio , 0, toCampId , Game.soMgr.getEffectTopContainer());
        const tx = MathUtils.randomInt(49 + monster.halfSize.width , 665 - monster.halfSize.width);
        let ty = 800 + MathUtils.randomInt(50 , 100);
        ty = Game.curLdGameCtrl.mirrorY(ty , toCampId);
        const role = campId == ECamp.BLUE ? this._selfLogicInfo.leadingRole : this._enemyLogicInfo.leadingRole;
        const dy =  campId == ECamp.BLUE ? 1 : -1;
        const sx = role.x;
        const sy = role.y + role.halfSize.height * dy;
        monster.setPosNow(sx, sy);
        monster.getAddComponent(EComponentType.MONSTER_AUTO);
        monster.changeTo(EActType.FLY_ENTER , {time:2000 , tox:tx , toy:ty});
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
        GlobalVal.checkSkillCamp = false;
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
        this._enemyLogicInfo.clearMap();
        this._createMonsterCtrl.exitMap();
        this._redCreateMonsterCtrl.exitMap();
        this._pvpRobot.exitMap();
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
        this._selfMonsterDropCtrl.resetMonsterDrop();
        this._enemyMonsterDropCtrl.resetMonsterDrop();
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
        const logicInfo = camp == ECamp.BLUE ? this._selfLogicInfo : this._enemyLogicInfo;
        return logicInfo.getHeroBuildingCtrl();
    }

    protected onAddCoin(value:number , camp:ECamp = ECamp.BLUE) {
        const logicInfo = camp == ECamp.BLUE ? this._selfLogicInfo : this._enemyLogicInfo;
        logicInfo.addCoin(value , camp);
    }

    getSelfCoin():number {
        return this._selfLogicInfo.coin;
    }


    getHeroTable(gx:number , gy:number , camp:ECamp = ECamp.BLUE):HeroTable {
        const logicInfo = camp == ECamp.BLUE ? this._selfLogicInfo : this._enemyLogicInfo;
        return logicInfo.getHeroTable(gx , gy);
    }

    getDirAmmoArea(camp:ECamp):cc.Rect {
        return camp == ECamp.BLUE ?  this._dirAmmoArea : this._redDirAmmoArea;
    }

    getDirAmmoCheckHitArea(camp:ECamp):cc.Rect {
        return camp == ECamp.BLUE ?  this._dirAmmoCheckHitArea : this._redDirAmmoCheckHitArea;
    }

    
}