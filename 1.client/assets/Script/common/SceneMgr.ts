import { Handler } from "../utils/Handler";
import SystemTipsMgr from "../utils/SystemTipsMgr";
import { StringUtils } from "../utils/StringUtils";
import { EventEnum } from "./EventEnum";
import SysMgr from "./SysMgr";
import Game from "../Game";
import { EResPath } from "./EResPath";
import TransitionBase from "../transition/TransitionBase";
import { GameEvent } from "../utils/GameEvent";
import { CacheModel } from "../utils/res/ResManager";

export const TRANSITION = {
    "1": { effect: EResPath.TRANSITION_FOREST, sound: EResPath.TRANSITION_FOREST_SOUND },
    "2": { effect: EResPath.TRANSITION_CLOUD, sound: EResPath.TRANSITION_CLOUD_SOUND },
    "3": { effect: EResPath.TRANSITION_WAVE, sound: EResPath.TRANSITION_WAVE_SOUND },
    "4": { effect: EResPath.TRANSITION_FIRE, sound: EResPath.TRANSITION_SUGAR_SOUND },
    "5": { effect: EResPath.TRANSITION_SAND, sound: EResPath.TRANSITION_DESERT_SOUND },
    "6": { effect: EResPath.TRANSITION_MARSH, sound: EResPath.TRANSITION_CHAPTER_6 },
    "7": { effect: EResPath.TRANSITION_7, sound: EResPath.TRANSITION_CHAPTER_7_1, openSound: EResPath.TRANSITION_CHAPTER_7_2 },
    "hide": { effect: EResPath.TRANSITION_SUGAR, sound: EResPath.TRANSITION_HIDE },
    "1000": { effect: EResPath.TRANSITION_NORMAL, sound: EResPath.TRANSITION_FOREST_SOUND },
}

export enum SCENE_NAME {
    LD_NORMAL = 'LDScene',
    Hall = "HallMain",
    Loading = "Loading",
    Logo = "Logo",
    PvPScene = "LDPvpScene",
    LDCooperate = "LDCooperate",
}

export default class SceneMgr {

    private static _instance: SceneMgr;
    public static get instance() {
        if (!this._instance) {
            this._instance = new SceneMgr();
        }
        return this._instance;
    }

    private _loadingScene: string = '';
    private _isLoadingScene: boolean = false;

    private _toLoadScene: string = '';
    private _curSceneName: string = '';
    private _toLoadSucHandler: Handler = null;
    private _toLoadFailHandler: Handler = null;
    private _callLaterComplete: Handler;

    private _transitionNode: cc.Node = null;

    private _tempArgs: any = null;

    constructor() {
        this._transitionNode = new cc.Node();
        this._transitionNode.name = "transition";
        this._transitionNode.zIndex = 1000;
        this._transitionNode.addComponent(cc.BlockInputEvents);

        this._transitionNode.group = "transition";
        Game.fitMgr.addPersistRootNode(this._transitionNode);
        this._transitionNode.active = false;

        this._callLaterComplete = new Handler(this.onSceneLoadedLater, this);
        cc.director.on(cc.Director.EVENT_AFTER_SCENE_LAUNCH, this.onSceneLoaded, this);
        cc.view.on('canvas-resize', this.onCanvasResize, this);
        GameEvent.on(EventEnum.TRANSITION_END, this.transitionEnd, this);
        GameEvent.on(EventEnum.TRANSITION_START, this.transitionStart, this);
        GameEvent.on(EventEnum.TRANSITION_MID, this.transitionMid, this);
        GameEvent.on(EventEnum.TRANSITION_SHOW_HALF, this.transitionShowHalf, this);
    }

    get transitionNode(): cc.Node {
        return this._transitionNode;
    }

    clearTempArgs() {
        this._tempArgs = null;
    }

    private onCanvasResize() {
        let size = cc.winSize;
        this._transitionNode.width = size.width;
        this._transitionNode.height = size.height;
        this._transitionNode.x = size.width / 2;
        this._transitionNode.y = size.height / 2;
    }

    private onSceneLoaded() {
        this.onCanvasResize();

        if (!StringUtils.isNilOrEmpty(this._toLoadScene)) {
            if (this._toLoadScene == this.curScene) {
                if (this._toLoadSucHandler) {
                    this._toLoadSucHandler.execute();
                }
                SysMgr.instance.callLater(this._callLaterComplete);
            } else {
                this.loadScene(this._toLoadScene, this._toLoadSucHandler, this._toLoadFailHandler);
            }
            this._toLoadScene = '';
            this._toLoadSucHandler = null;
            this._toLoadFailHandler = null;
        } else {
            SysMgr.instance.callLater(this._callLaterComplete);
        }
    }

    private onSceneLoadedLater() {
        GameEvent.emit(EventEnum.ON_SCENE_LOAD_COMPLETE, this.curScene);
    }

    loadScene(sceneName: string, sucHandler: Handler = null, failHandler: Handler = null) {
        GameEvent.emit(EventEnum.START_LOAD_SCENE);
        if (!this._isLoadingScene) {
            this._isLoadingScene = true;
            this._loadingScene = sceneName;
            cc.director.loadScene(sceneName, (err) => {
                this._curSceneName = sceneName;
                if (err) {
                    SystemTipsMgr.instance.notice('加载场景失败:' + sceneName);
                    if (failHandler) {
                        failHandler.execute();
                    }
                } else {
                    if (sucHandler) {
                        sucHandler.execute();
                    }
                    if (this._tempArgs && !this._tempArgs.waitGameSceneInitEnd) {
                        GameEvent.emit(EventEnum.EVENT_AFTER_SCENE_LAUNCH);
                    }
                }
                this._isLoadingScene = false;
            });
        } else {
            this._toLoadScene = sceneName;
            this._toLoadSucHandler = sucHandler;
            this._toLoadFailHandler = failHandler;
        }
    }

    /**
     * 使用指定转场动画加载场景
     * @param sceneName 
     * @param sucHandler 
     * @param failHandler 
     * @param transitionObj 
     * @param waitGameSceneInitEnd 
     * @param data 
     * @returns 
     */
    loadSceneWithTransition(sceneName: string, sucHandler: Handler = null, failHandler: Handler = null, transitionObj: any, waitGameSceneInitEnd: boolean = false, data?: any) {
        if (!transitionObj || this._isLoadingScene) return;
        GameEvent.emit(EventEnum.START_CHANGE_SCENE_WITH_TRANSITION);
        this._tempArgs = {
            "sceneName": sceneName,
            "sucHandler": sucHandler,
            "failHandler": failHandler,
            waitGameSceneInitEnd: waitGameSceneInitEnd,
        }
        this._transitionNode.active = true;
        Game.resMgr.loadRes(transitionObj.effect, cc.Prefab, new Handler(function (res: any, path: string) {
            Game.soundMgr.playSound(transitionObj.sound);
            let transition = cc.instantiate(res);
            let comp: TransitionBase = transition.getComponent(TransitionBase);
            if (data) {
                comp.setData(data);
            }
            comp.openSound = transitionObj.openSound;
            Game.resMgr.addRef(transitionObj.effect);
            transition.parent = this._transitionNode;
        }, this) , CacheModel.AUTO);
    }

    get isLoading(): boolean {
        return this._isLoadingScene;
    }

    get loadingScene(): string {
        return this._isLoadingScene ? this._loadingScene : "";
    }

    get curScene(): string {
        return this._curSceneName;
    }


    isInHall(): boolean {
        return this.curScene == SCENE_NAME.Hall;
    }

    private transitionStart() {

    }

    private transitionMid() {
        if (!this._tempArgs) return;
        if (this._tempArgs["sceneName"] == "Map" && this._curSceneName == "MainScene") {
            GameEvent.emit(EventEnum.EXIT_GAME_SCENE_END);
        }

        this.loadScene(this._tempArgs["sceneName"], this._tempArgs["sucHandler"], this._tempArgs["failHandler"]);

    }

    private transitionShowHalf() {

    }

    private transitionEnd() {
        let children = this._transitionNode.children;
        for (let i = children.length - 1; i >= 0; i--) {
            children[i].destroy();
            // children[i].removeFromParent(true);
        }
        this._transitionNode.active = false;
    }

    /**
     * 获取场景切换特效
     */
    public getTransition(currWarId: number): any {
        return TRANSITION['6'];
        currWarId = currWarId ? currWarId : Game.sceneNetMgr.getCurWarID();
        let transitionKey = null;
        if (Game.sceneNetMgr.isHideWar(currWarId) || Game.sceneNetMgr.isExperienceWar(currWarId)) {
            transitionKey = "hide";
        } else {
            let currWorldInfo = Game.sceneNetMgr.getChapterByWarID(currWarId);
            let currWorldId = currWorldInfo ? currWorldInfo.nworldid : Game.sceneNetMgr.getCurWorldID();
            transitionKey = currWorldId;
        }

        return TRANSITION[transitionKey];
    }

    getTransitionByKey(key: string): any {
        return TRANSITION['6'];
        return TRANSITION[key] || TRANSITION['hide'];
    }

}