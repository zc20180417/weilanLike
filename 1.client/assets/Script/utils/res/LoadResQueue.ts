
import Debug, { TAG } from "../../debug";
import { Handler } from "../Handler";
import { LoadResData } from "./LoadResData";
import ResManager, { LoadingState } from "./ResManager";

// 加载列队
export class LoadResQueue {
    private _datas: Array<LoadResData> = [];
    public get datas() {
        return this._datas;
    }

    public set datas(value) {
        if (!value) return;
        this._datas = value;
        for (let v of this._datas) {
            v.queue = this;
        }
    }

    public progressCallback: Handler;
    public completeCallback: Handler;

    //同时加载的个数
    private static MaxLoadingCount: number = 8;
    protected curLoadingCount: number = 0;
    protected completeCount: number = 0;
    protected len: number = 0;
    protected loadingList: LoadResData[] = [];
    protected stopLoad: boolean = false;
    isComplete: boolean = false;

    private _completePaths: string[] = [];

    /**
     * 开始加载
     */
    start(): void {
        this.len = this.datas.length;
        this.isComplete = false;
        this.stopLoad = false;
        this.loadNext();
    }

    stop() {
        this.stopLoad = true;
    }

    public addResLoad(resLoad: LoadResData) {
        if (resLoad.loadState === LoadingState.NONE && this.datas.indexOf(resLoad) === -1) {
            resLoad.queue = this;
            this.datas.push(resLoad);
            this.len++;
            this.loadNext();
        }
    }

    /**从队列中移除 */
    removeLoad(loadResData: LoadResData, completeHandler: Handler) {
        if (!loadResData) return;

        loadResData.removeCompleteCallBack(completeHandler);

        if (loadResData.completeCallbackLength === 0) {
            let index = this.datas.indexOf(loadResData);
            if (index != -1) {
                this.datas.splice(index, 1);
                loadResData.queue = null;
            }
        }
    }

    protected onCompleteOne(data?: LoadResData) {
        if (data) {
            this._completePaths.push(data.path);
            let index = this.loadingList.indexOf(data);
            if (index != -1) {
                this.loadingList.splice(index, 1);
            }
        }
        this.completeCount++;
        this.curLoadingCount--;

        if (this.completeCount >= this.len) {
            if (this.completeCallback) {
                this.completeCallback.executeWith(this._completePaths);
            }
            this.isComplete = true;
            this._completePaths.length = 0;
            return;
        }
        if (!this.stopLoad) {
            this.loadNext();
        }
    }

    protected loadNext(): void {
        if (this.datas.length > 0) {
            let data: LoadResData = this.datas.pop();
            if (ResManager.instance.getRes(data.path)) {
                data.progress = 1;
                this.changeProgress();
                this.curLoadingCount++;
                this.onCompleteOne();
                return;

            } else {
                let self: LoadResQueue = this;

                const progressFunc = function (completedCount: number, totalCount: number, item: any): void {
                    data.progress = completedCount / totalCount;
                    self.changeProgress();
                };

                const completeFunc = function (err: Error, res: any) {
                    if (err) {
                        Debug.warn(TAG.RES_MGR, err);
                        data.onComplete();
                        self.onCompleteOne(data);
                    } else {
                        data.data = res;
                        data.onComplete();
                        self.onCompleteOne(data);
                    }
                };

                data.loadState = LoadingState.LOADING;
                if (data.resType) {
                    cc.resources.load(data.path, data.resType, progressFunc, completeFunc);
                } else {
                    cc.resources.load(data.path, progressFunc, completeFunc);
                }

                this.loadingList.push(data);
            }

            this.curLoadingCount++;
            if (this.curLoadingCount < LoadResQueue.MaxLoadingCount) {
                this.loadNext();
            }
        }
    }

    /**
     * 获取加载loadinglist中的加载进度
     */
    protected getLoadingListProgress() {
        let progress = 0;
        this.loadingList = this.loadingList || [];
        for (let v of this.loadingList) {
            progress += v.progress;
        }
        return progress;
    }

    protected changeProgress() {
        const percent: number = (this.getLoadingListProgress() + this.completeCount) / this.len;
        if (this.progressCallback) {
            this.progressCallback.executeWith(percent);
        }
    }

}