
import { StringUtils } from "../../utils/StringUtils";

import { LoadResData } from "./LoadResData";
import { LoadResQueue } from "./LoadResQueue";
import { LoadNetResQueue } from "./LoadNetResQueue";
import FJByteArray from "../../net/socket/FJByteArray";
import { Handler } from "../Handler";
import SysMgr from "../../common/SysMgr";
import { EResPath } from "../../common/EResPath";
import Debug, { TAG } from "../../debug";


export enum LoadingState {
    NONE,
    LOADING,
    LOADED,
}

/**
 * 缓存模式
 */
export enum CacheModel {
    CUSTOM,             //手动释放
    AUTO,               //切换场景时自动释放
    TIME,               //定时释放
}

export default class ResManager {

    private static _instance: ResManager;

    public static get instance(): ResManager {
        if (!ResManager._instance) {
            ResManager._instance = new ResManager();
        }
        return ResManager._instance;
    }

    constructor() {
        cc.director.on(cc.Director.EVENT_AFTER_SCENE_LAUNCH, this.onAfterSceneLaunch, this);
        SysMgr.instance.doLoop(new Handler(this.releaseByTime, this), this.releaseTime, 0, true);
    }

    /**每5分钟检测一下引用计时为0的ico ,为了测试方便，暂时设为10秒*/
    private releaseTime: number = 5 * 60 * 1000;
    // private CHECK_RELEASE_TIME: number = 10000;
    private allRes: { [key: string]: LoadResData; } = Object.create(null);

    private loadQueue: LoadResQueue = new LoadResQueue();
    private loadNetQueue: LoadNetResQueue = new LoadNetResQueue();

    private _cacheMap: { [key: string]: LoadResData; } = Object.create(null);
    private _timeMap: { [key: string]: LoadResData; } = Object.create(null);
    private _autoMap: { [key: string]: LoadResData; } = Object.create(null);

    /**
     * 获取资源
     * @param resPath 资源路径
     */
    getRes(resPath: string) {
        return this.allRes[resPath]?.data;
    }

    /**
     * 获取材质资源
     * @param path 
     * @returns 
     */
    public getMaterial(name: string) {
        let material = this.getRes(EResPath.MATERIAL + name) as cc.Material;
        return material ? cc.MaterialVariant.create(material, null) : null;
    }

    getCfg(resPath: string): any {
        let resData = this.getRes(resPath);
        return resData ? (resData as cc.JsonAsset).json : null;
    }

    /**
     * 批量加载资源，采用列队加载
     * @param paths 资源的路径
     * @param moduleName 模块名
     */
    batchLoadRes(paths: Array<string>, resTypes?: any,
        progressCallback?: Handler, completeCallback?: Handler, module = CacheModel.AUTO): LoadResQueue {

        const datas: Array<LoadResData> = [];
        for (let i = 0; i < paths.length; i++) {
            const path = paths[i];
            const data: LoadResData = this.createRes(path, null, false, module);
            data.modle = module;
            data.resType = resTypes ? resTypes[i] : null;
            datas.push(data);
        }

        if (datas.length == 0) {
            completeCallback.execute();
            return;
        }

        const queue: LoadResQueue = new LoadResQueue();
        queue.datas = datas;
        queue.progressCallback = progressCallback;
        queue.completeCallback = completeCallback;
        queue.start();

        return queue;
    }

    /**
     * 加载资源
     * @param path 
     * @param resType 
     * @param completeCallback 
     * @param modle 
     * @returns 
     */
    loadRes(path: string, resType?: any, completeCallback?: Handler, modle = CacheModel.AUTO) {
        if (StringUtils.isNilOrEmpty(path)) return cc.warn("loadRes: 资源路径为空");
        let resData = this.allRes[path];
        if (resData && resData.loadState === LoadingState.LOADED) {
            if (completeCallback) {
                completeCallback.executeWith(resData.data, path);
            }
            return; 
        }

        let data: LoadResData = this.createRes(path, completeCallback, false, modle);
        data.modle = modle;
        data.resType = resType;
        this.loadQueue.addResLoad(data);
    }

    /**
     * 移除加载
     * @param path 
     * @param completeCallback 
     * @param releaseNow 
     * @returns 
     */
    removeLoad(path: string, completeCallback?: Handler) {
        if (StringUtils.isNilOrEmpty(path)) return cc.warn("removeLoad: 资源路径为空");
        let loadResData: LoadResData = this.allRes[path];
        if (!loadResData) return;
        if (loadResData.loadState === LoadingState.LOADED) {
            loadResData.decRef();
            return;
        }
        if (loadResData.queue) loadResData.queue.removeLoad(loadResData, completeCallback);
    }

    batchLoadNetRes(paths: string[], resTypes?: string[],
        progressCallback?: Handler, completeHandler?: Handler, module = CacheModel.AUTO) {
        const datas: Array<LoadResData> = [];
        for (let i = 0; i < paths.length; i++) {
            const path = paths[i];
            const data: LoadResData = this.createRes(path, null, false, module);
            data.modle = module;
            data.resType = resTypes[i] ? resTypes[i] : null;
            datas.push(data);
        }

        if (datas.length == 0) {
            completeHandler.execute();
            return;
        }

        const queue: LoadNetResQueue = new LoadNetResQueue();
        queue.datas = datas;
        queue.progressCallback = progressCallback;
        queue.completeCallback = completeHandler;
        queue.start();
    }

    /**
     * 加载服务器上的图片并保存在手机内存里
     * @param path 
     * @param completeCallback 
     */
    loadNetRes(path: string, resType: string, completeCallback?: Handler, modle: CacheModel = CacheModel.AUTO) {
        let resData = this.getRes(path);
        if (resData) {
            if (completeCallback) {
                completeCallback.executeWith(resData, path);
            }
            return;
        }

        let loadData: LoadResData = this.createRes(path, completeCallback, true, modle);
        loadData.resType = resType;
        loadData.modle = modle;
        this.loadNetQueue.addResLoad(loadData);
    }

    /**
     * 移除加载远程资源
     * @param path 
     * @param completeCallback 
     */
    removeLoadNetRes(path: string, completeCallback?: Handler) {
        if (StringUtils.isNilOrEmpty(path) || !completeCallback) {
            return;
        }
        let loadData: LoadResData = this.allRes[path];
        if (loadData) {
            if (loadData.loadState === LoadingState.LOADED) {
                return loadData.decRef();
            }
            if (loadData.queue) loadData.queue.removeLoad(loadData, completeCallback);
        }
    }

    /**加载配置表 */
    loadLocalJsonRes(name: string, handler: Handler) {
        let filepath = jsb.fileUtils.getWritablePath() + 'config/' + name + '.json';
        if (jsb.fileUtils.isFileExist(filepath)) {
            cc.assetManager.loadRemote(filepath, function (err, tex) {
                if (err) {
                    Debug.log(TAG.RES_MGR, 'loadLocalJsonRes error:' + err);
                } else {
                    Debug.log(TAG.RES_MGR, 'loadLocalJsonRes loadEnd:' + filepath);
                    handler.executeWith(name, tex);
                }
            });
        }
    }

    /**将配置表写入手机缓存 */
    writeLocalJsonRes(name: string, info: string): boolean {
        let dirpath = jsb.fileUtils.getWritablePath() + 'config/';
        let filepath = dirpath + name + '.json';
        if (!jsb.fileUtils.isDirectoryExist(dirpath)) {
            jsb.fileUtils.createDirectory(dirpath);
        }

        let byteArray = FJByteArray.CreateByteBuffer();
        byteArray.writeString(info);
        if (jsb.fileUtils["writeDataToFile"](byteArray.bytes, filepath)) {
            Debug.log(TAG.RES_MGR, 'Remote write json file succeed.');
            return true;
        } else {
            Debug.log(TAG.RES_MGR, 'Remote write json file failed.');
            return false;
        }

    }

    private createRes(path: string, completeCallback: Handler, isNet: boolean, model: CacheModel): LoadResData {
        let data: LoadResData = this.allRes[path];
        if (!data) {
            data = new LoadResData();
            data.path = path;
            data.isNetRes = isNet;
            data.loadState = LoadingState.NONE;
            this.allRes[path] = data;
            switch (model) {
                case CacheModel.AUTO:
                    this._autoMap[path] = data;
                    break;
                case CacheModel.TIME:
                    this._timeMap[path] = data;
                    break;
                case CacheModel.CUSTOM:
                    this._cacheMap[path] = data;
                    break;
            }
        }
        data.addCompleteCallBack(completeCallback);
        return data;
    }

    /**
     * 定时释放资源
     */
    private releaseByTime() {
        for (let key in this._timeMap) {
            if (this._timeMap[key].loadState === LoadingState.LOADED && this._timeMap[key].refCount === 0) {
                this._timeMap[key].release();
                delete this._timeMap[key];
                delete this.allRes[key];
            }
        }
    }

    /**
     * 手动释放
     */
    public releaseCache() {
        for (let key in this._cacheMap) {
            if (this._autoMap[key].loadState === LoadingState.LOADED && this._cacheMap[key].refCount === 0) {
                this._cacheMap[key].release();
                delete this._cacheMap[key];
                delete this.allRes[key];
            }
        }
    }

    /**
     * 自动释放
     */
    private onAfterSceneLaunch() {
        for (let key in this._autoMap) {
            if (this._autoMap[key].loadState === LoadingState.LOADED && this._autoMap[key].refCount === 0) {
                this._autoMap[key].release();
                delete this._autoMap[key];
                delete this.allRes[key];
            }
        }
    }

    public release(path: string) {
        if (!path) return;
        let resData = this.getResData(path);
        if (resData) {
            let resMap = resData.modle === CacheModel.CUSTOM ? this._cacheMap :
                resData.modle === CacheModel.AUTO ? this._autoMap : this._timeMap;
            resData.release();
            delete resMap[path];
            delete this.allRes[path];
        }
    }

    /**
     * 增加引用
     * @param paths 
     * @param isNetRes 
     * @returns 
     */
    public addRef(paths: string | string[]) {
        if (!paths) return;
        if (typeof paths === "string") {
            this.getResData(paths)?.addRef();
        } else {
            for (let v of paths) {
                this.getResData(v)?.addRef();
            }
        }
    }

    /**
     * 减少引用
     * @param paths 
     * @param isNetRes 
     * @param releaseNow 
     * @returns 
     */
    public decRef(paths: string | string[]) {
        if (!paths) return;
        if (typeof paths === "string") {
            this.getResData(paths)?.decRef();
        } else {
            for (let v of paths) {
                this.getResData(v)?.decRef();
            }
        }
    }

    private getResData(path: string): LoadResData {
        return this.allRes[path] || null;
    }
}