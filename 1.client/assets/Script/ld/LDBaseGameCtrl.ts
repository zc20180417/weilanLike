import { GAME_TYPE, GameState, ECamp } from "../common/AllEnum";
import { GameCommonConfig, MissionMainConfig, MonsterBoxConfig } from "../common/ConfigInterface";
import { EResPath } from "../common/EResPath";
import { EventEnum } from "../common/EventEnum";
import SysMgr from "../common/SysMgr";
import Game from "../Game";
import { AllComp } from "../logic/comps/AllComp";
import { GameEvent } from "../utils/GameEvent";
import { MathUtils } from "../utils/MathUtils";
import { UiManager } from "../utils/UiMgr";
import { HeroBuildingCtrl } from "./HeroBuildingCtrl";
import { LdMapCtrl } from "./map/LdMapCtrl";
import { LDCreateMonsterCtrl } from "./monster/LDCreateMonsterCtrl";
import { Pos } from "./Pos";
import { HeroTable } from "./tower/HeroTable";



export class LDBaseGameCtrl {
    protected _gameType:GAME_TYPE;
    protected _dirAmmoArea:cc.Rect = new cc.Rect();
    protected _dirAmmoCheckHitArea:cc.Rect = new cc.Rect();
    // protected _

    /////////////////////////
    protected _isInit: boolean = false;
    //开始游戏时间
    protected _startTime:number;
    //游戏状态
    protected _gameState:GameState;
    //游戏计时器
    protected _sys:SysMgr;
    //地图基本数据的
    protected _mapCtrl:LdMapCtrl;
    //关卡里的金币
    // protected _coin:number = 0;

    protected _reduceMonsterBlood:number = 0;
    protected _gameCommonConfig:GameCommonConfig;
    /**当前地图基本信息 */
    protected _curMissonData: MissionMainConfig;

    protected _selfCamp:ECamp = ECamp.BLUE;

    protected _selfArea:cc.Rect = new cc.Rect();
    //////l:number}> = {};
    protected _createMonsterCtrl:LDCreateMonsterCtrl;
    // protected _heroBuildingCtrl:HeroBuildingCtrl;

    constructor() {
        this._sys = SysMgr.instance;
        this._gameType = GAME_TYPE.NORMAL;
        this.initDirAmmoRect();
    }

    enterMap() {
        Game.curLdGameCtrl = this;
        AllComp.instance.resetComp();
        Game.soMgr.setGameType(GAME_TYPE.NORMAL);
        GameEvent.on(EventEnum.HIDE_START_GAME, this.onHideGameStart, this);
        GameEvent.on(EventEnum.ON_GAME_HIDE, this.onEventHide, this);
        GameEvent.on(EventEnum.ON_GAME_SHOW, this.onEventShow, this);
        GameEvent.on(EventEnum.GAME_SUCC, this.onGameSuccess, this);
        GameEvent.on(EventEnum.GAME_FAIL, this.onGameFail, this);
        GameEvent.on(EventEnum.RELOGIN_FAIL, this.onReconnectFail, this);
        GameEvent.on(EventEnum.ADD_GOLD, this.onAddCoin, this);
        GameEvent.on(EventEnum.DO_EXIT_MAP, this.exitMap, this);
        GameEvent.on(EventEnum.LD_CITY_WALL_HURT, this.onCityWallHurt, this);
    }

    get gameCommonConfig():GameCommonConfig {
        return this._gameCommonConfig;
    }

    protected onCityWallHurt(value:number) {
        this.mapLife += value;
    }

    getMapCtrl():LdMapCtrl {
        return this._mapCtrl;
    }

    // get coin(): number {
    //     return this._coin;
    // }

    // set coin(value:number) {
    //     this._coin = value;
    // }

    get curMissonData(): MissionMainConfig {
        return this._curMissonData;
    }

    getSelfCamp():ECamp {
        return this._selfCamp;
    }

    getCampBySkillUid(id:number):ECamp {
        return this._selfCamp;
    }

    getIsSelfCamp(camp:ECamp):boolean {
        return true;
    }

    isPlaying():boolean {
        return true;
    }

    getSelfArea():cc.Rect {
        return this._selfArea;
    }

    getDirAmmoArea(camp:ECamp):cc.Rect {
        return this._dirAmmoArea;
    }

    getDirAmmoCheckHitArea(camp:ECamp):cc.Rect {
        return this._dirAmmoCheckHitArea;
    }

    getGameType():GAME_TYPE {
        return this._gameType;
    }

    getIsNormalGameType():boolean {
        return this._gameType != GAME_TYPE.PVP;
    }

    getEmptySpace(x:number , y:number , campId:ECamp):[number , number] {
        return [x , y];
    }

    /**当前波血量系数 */
    get curBloodRate(): number {
        return this._createMonsterCtrl.curBloodRate;
    }

    get boIndex():number {
        return this._createMonsterCtrl.boIndex;
    }

    getReduceMonsterBlood():number {
        return this._reduceMonsterBlood;
    } 

    getBoMonsterList(id: number): MonsterBoxConfig {
        return Game.gameConfigMgr.getMonsterBoxConfig(id);
    }

    isUseFashion(towerid:number , camp:ECamp = ECamp.BLUE):boolean {
        return false;
    }

    getBuildCoinRate(troopsid:number):number {
        return Game.strengMgr.getBuildCoinRate(troopsid);
    }

    getTaskCtrl():any {
        
    }

    playCurrCheckPointMusic() {
        this.playBgM(this.curMissonData.szbgmusic);
    }

    sommonFindMovePath(sx:number , sy:number , tx:number , ty:number , campId:ECamp = ECamp.BLUE):Pos[] {
        return [];
    }

    findMovePath(x:number , y:number , halfWid:number, campId:ECamp = ECamp.BLUE):Pos[] {
        return [];
    }

    reStart(flag:boolean) {

    }

    goonPlay() {
        
    }

    getGridFrameColor(x:number):cc.Color {
        return null;
    }

    protected _mapLifeMax:number = 0;

    get mapLifeMax(): number {
        return this._mapLifeMax;
    }

    set mapLifeMax(value: number) {
        this._mapLifeMax = value;
    }


    protected _mapLife: number = 0;

    get mapLife(): number {
        return this._mapLife;
    }

    set mapLife(value: number) {
        this._mapLife = MathUtils.clamp(value , 0 , this._mapLifeMax);
        GameEvent.emit(EventEnum.LD_MAP_HP_CHANGE , this._mapLife , this._mapLifeMax);
        if (this._mapLife <= 0) {
            GameEvent.emit(EventEnum.DO_FAIL);
        }
    }

    get scenehpaddper():number {
        return 0;
    }

    getGridX(x:number):number {
        return 0;
    }

    getGridY(y:number, campId:ECamp = ECamp.BLUE):number {
        return 0;
    }

    getGridTop(gy:number , campId:ECamp = ECamp.BLUE):number {

        return 0;
    }


    getGridCenterX(gx:number):number {
        return 0;
    }

    getGridCenterY(gy:number , campId:ECamp = ECamp.BLUE):number {
        return 0;
    }

    mirrorY(y:number , campId:ECamp = ECamp.BLUE):number {
        return y;
    }


    // getMaxSkillHeros():number[] {
    //     return [];
    // }
    get totalCallTimes():number { return 0 };

    getEmptyGridTopYByGx(gx:number , campId:ECamp = ECamp.BLUE):number {
        return 0;
    }
    
    getHeroBuildingCtrl(camp:ECamp = ECamp.BLUE):HeroBuildingCtrl {
        return null;
    }
    //////////////////////////////////////////////////////

    protected onAddCoin(value:number , camp?:ECamp) {

    }

    getCoin(camp:ECamp) {
        return 0;
    }

    getSelfCoin():number {
        return 0;
    }

    /**加载游戏场景，进入关卡的第一步 */
    loadGameScene() {
        Game.curLdGameCtrl = this;
        this.addEnterMapEvent();
        Game.soMgr.initQuadTree(this._gameType);
    }

    /**帧听加载地图基础配置完成和切换动画展示到一半 */
    protected addEnterMapEvent() {
        GameEvent.on(EventEnum.INIT_MAP_COMPLETE, this.onInit, this);
        GameEvent.on(EventEnum.TRANSITION_SHOW_HALF, this.onShowHalf, this);
    }
    
    /**移除帧听加载地图基础配置完成和切换动画展示到一半 */
    protected removeEnterMapEvent() {
        GameEvent.off(EventEnum.INIT_MAP_COMPLETE, this.onInit, this);
        GameEvent.off(EventEnum.TRANSITION_SHOW_HALF, this.onShowHalf, this);
    }

    protected onInit() {
        this._isInit = true;
        this.enterMap();
    }

    protected onShowHalf() {
        if (this._isInit) {
            this.enterMapComplete();
        }
    }

    //进入地图完成
    protected enterMapComplete() {

    }

    protected onFaild() {

    }

    protected onSuccess() {

    }

    // protected _curBossDesCfg: any;
    /**刷boss了，准备显示boss介绍界面  */
    protected readyShowBossDes(bossDes: any) {

    }

    /**游戏退出到后台 */
    protected onEventHide() {
        if (this._startTime == 0 || this._gameState > GameState.PLAYING) {
            this._sys.pauseGame('active', true);
            return;
        }

        // if (!this._sys.pause) {
        //     UiManager.showDialog(EResPath.CP_MENU_VIEW, {str: GlobalVal.curMapCfg.szname , type:this.getGameType()});
        // }
    }

    /**从后台回来 */
    protected onEventShow() {
        this._sys.pauseGame('active', false);
    }

    /**播放背景音乐 */
    protected playBgM(music:string) {
        Game.soundMgr.playMusic(EResPath.BG_PATH + music, 3);
    }

    /**显示游戏开始界面 */
    protected showGameStarView() {
        UiManager.showDialog(EResPath.GAME_START_VIEW);
    }

    /**开始倒计时界面关闭 */
    protected onHideGameStart() {

    }

    /**收到服务器胜利 */
    protected onGameSuccess(data:any = null) {

    }

    /**收到服务器失败 */
    protected onGameFail(data:any = null) {

    }

    /**重连失败 */
    protected onReconnectFail() {
        this._gameState = GameState.NONE;
        this.exitMap(false , true);
    }

    protected exitMap(isFail:boolean = false , isReconnect:boolean = false) {
        GameEvent.targetOff(this);
    }

    protected clearMap() {
        UiManager.hideDialog(EResPath.LD_HURT_VIEW);
        Game.ldSkillMgr.resetReleaseData();
        GameEvent.targetOff(this);
    }

    protected hideGameUi() {

    }

    getHeroTable(gx:number , gy:number , campId:ECamp = ECamp.BLUE):HeroTable {

        return null;
    }

    protected initDirAmmoRect() {
        this._dirAmmoArea.xMin = -100;
        this._dirAmmoArea.yMin = -500;
        this._dirAmmoArea.xMax = 820;
        this._dirAmmoArea.yMax = 1500;
        this._dirAmmoCheckHitArea.xMin = 0;
        this._dirAmmoCheckHitArea.xMax = 720;
        this._dirAmmoCheckHitArea.yMin = 0;
        this._dirAmmoCheckHitArea.yMax = 1500;
    }

    checkHaveBlock(sx:number , sy:number , tx:number , ty:number , campId:ECamp = ECamp.BLUE):boolean {
        return false;
    }
    
   
    

    









}


