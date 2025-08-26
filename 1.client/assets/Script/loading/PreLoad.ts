import { EResPath } from "../common/EResPath";
import Game from "../Game";
import { Handler } from "../utils/Handler";
import ResManager from "../utils/res/ResManager";

export class PreLoad {

    private static _instance: PreLoad;

    static get instance(): PreLoad {
        if (!PreLoad._instance) {
            PreLoad._instance = new PreLoad();
        }
        return PreLoad._instance;
    }

    private _preLoads: string[] = [];
    private _preLoadTypes: cc.Asset[] = [];
    private _curComplete: Handler;
    private _onComplete: Handler;


    constructor() {
        this._onComplete = new Handler(this.onComplete, this);
        this.initPreLoad();
    }

    preLoad(progress?: Handler, complete?: Handler) {
        this._curComplete = complete;
        ResManager.instance.batchLoadRes(this._preLoads,
            this._preLoadTypes,
            progress,
            this._onComplete);
    }

    /**初始化预加载配置表 */
    private initPreLoad() {
        this.addPreLoad(EResPath.CFG);
        //场景过渡动画
        this.addPreLoad(EResPath.TRANSITION_NORMAL);
        this.addPreLoad(EResPath.REDPOINTDOT);
        this.addPreLoad(EResPath.REDPOINTNEW);

        this.addPreLoad(EResPath.LOADING_TIPS);
        this.addPreLoad(EResPath.GAME_UI, cc.SpriteAtlas);
        this.addPreLoad(EResPath.GAME_UI1, cc.SpriteAtlas);
        this.addPreLoad(EResPath.GAME_UI2, cc.SpriteAtlas);
        this.addPreLoad(EResPath.NUMBER_UI, cc.SpriteAtlas);

        this.addPreLoad(EResPath.FONT);
        this.addPreLoad(EResPath.TAB_VIEW_CFG);
    }

    private addPreLoad(path: string, resType?: any) {
        this._preLoads.push(path);
        this._preLoadTypes.push(resType);
    }

    private onComplete(paths: string[]) {
        Game.resMgr.addRef(paths);
        if (this._curComplete != null) {
            this._curComplete.execute();
            this._curComplete = null;
        }
    }

}