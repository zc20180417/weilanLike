
import Debug, { TAG } from "../../debug";
import { Handler } from "../Handler";
import { LoadResQueue } from "./LoadResQueue";
import ResManager, { LoadingState, CacheModel } from "./ResManager";

export class LoadResData {
    public queue: LoadResQueue = null;
    public path: string = null;
    public modle: CacheModel = null;
    public resType: any = null;
    public data: any = null;
    public progress: number = 0;
    /**引用计数 */
    public refCount: number = 0;
    /**加载状态 */
    public loadState: LoadingState = LoadingState.NONE;
    /**是否自动是否的资源 */
    private _completeHandlers: Handler[] = [];
    public isNetRes: boolean = false;
    /** 释放资源*/
    public release() {
        if (this.loadState == LoadingState.LOADED) {
            this.data && cc.assetManager.releaseAsset(this.data);
            this.loadState = LoadingState.NONE;
            this.data = null;
            this.queue = null;
            Debug.log(TAG.RES_MGR, "release " + this.path);
        }
    }

    /**加载完成 */
    onComplete() {
        Debug.log(TAG.RES_MGR, "onComplete ", this.path);
        this.loadState = LoadingState.LOADED;
        for (let i = 0; i < this._completeHandlers.length; i++) {
            this._completeHandlers[i].executeWith(this.data, this.path);
        }
        (this.data as cc.Asset)?.addRef();
        this._completeHandlers.length = 0;
    }

    /**添加加载完成回调 */
    addCompleteCallBack(callBack: Handler) {
        if (callBack && this._completeHandlers.indexOf(callBack) == -1) {
            this._completeHandlers.push(callBack);
        }
    }

    /**移除加载完成回调 */
    removeCompleteCallBack(callBack: Handler) {
        if (!callBack) return;
        let index = this._completeHandlers.indexOf(callBack);
        if (index != -1) {
            this._completeHandlers.splice(index, 1);
        }
    }

    get completeCallbackLength(): number {
        return this._completeHandlers.length;
    }

    /**
     * 增加引用
     */
    public addRef() {
        if (this.loadState === LoadingState.LOADED) {
            if (this.data && (this.data as cc.Asset).refCount === 0) {
                (this.data as cc.Asset).addRef();
            }
            this.refCount++;
        } else {
            Debug.warn(TAG.RES_MGR, "addRef fail: 资源 " + this.path + " 未加载/加载失败");
        }
    }

    /**                       
     * 减少引用
     * @param releaseNow 引用次数为零时是否立即释放
     */
    public decRef() {
        if (this.loadState === LoadingState.LOADED) {
            this.refCount = Math.max(0, this.refCount - 1);
            if (this.refCount === 0 && this.modle === CacheModel.CUSTOM) {
                ResManager.instance.release(this.path);
            }
        } else {
            Debug.warn(TAG.RES_MGR, "addRef fail: 资源 " + this.path + " 未加载/加载失败");
        }
    }
}
