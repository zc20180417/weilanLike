
import { EventEnum } from '../common/EventEnum';
import GlobalVal from '../GlobalVal';
import { GameEvent } from '../utils/GameEvent';

const {ccclass, property,menu} = cc._decorator;

@ccclass
@menu("Game/Loading/HotUpdate")
export default class HotUpdate extends cc.Component {
    @property({type:cc.Asset})
    manifestUrl:cc.Asset = null;
    
    @property(cc.Node)
    reLoadBtn:cc.Node = null;


    private _updating:boolean = false;
    public get updating():boolean {
        return this._updating;
    }

    private _canRetry:boolean = false;
    private _am:any;
    static downLoadNewApk:boolean = false;

    /**版本信息描述 */
    private _versionStr:string = "";

    private _localManifestUrl:string;
    /**获取包体内的project.manifest文件 */
    private get localManifestUrl():string {
        let self = this;
        if (!self._localManifestUrl)
        {
            self._localManifestUrl = self.manifestUrl.nativeUrl;
            if (cc.loader.md5Pipe) {
                self._localManifestUrl = cc.loader.md5Pipe.transformURL(self._localManifestUrl);
            }
        }
        return self._localManifestUrl;
    }


    tryStartUpdate() {
        this.reLoadBtn.on('click' , this.onResetClick , this);
        this.startUpdate();
        console.log('----------------------------tryStartUpdate');
        if (!GlobalVal.hotUpdateEnabled || !cc.sys.isNative) {
            GameEvent.emit(EventEnum.UPDATE_COMPLETE);
        }
    }

    private onResetClick() {
        if (!this._updating) {
            this.startUpdate();
        }
    }

    public checkCb(event):void
    {
        let self = this;
        let hasNew:boolean = false;
        this.log("checkCb Code:" + event.getEventCode());
        switch (event.getEventCode())
        {
            case jsb['EventAssetsManager'].ERROR_NO_LOCAL_MANIFEST:
                GameEvent.emit(EventEnum.REFRESH_LOADING_TIPS , "本地信息文件丢失,请重新下载完整的游戏包...");
                break;
            case jsb['EventAssetsManager'].ERROR_DOWNLOAD_MANIFEST:
            case jsb['EventAssetsManager'].ERROR_PARSE_MANIFEST:
                GameEvent.emit(EventEnum.REFRESH_LOADING_TIPS , "加载远程版本文件失败...");
                GameEvent.emit(EventEnum.UPDATE_COMPLETE);
                break;
            case jsb['EventAssetsManager'].ALREADY_UP_TO_DATE:
                self._versionStr = "game version: " + GlobalVal.curVersion + " " + (CC_DEBUG? "debug": "release");
                GameEvent.emit(EventEnum.REFRESH_LOADING_TIPS , "本地版本已为最新的版本");
                GameEvent.emit(EventEnum.UPDATE_COMPLETE);
                break;
            case jsb['EventAssetsManager'].NEW_VERSION_FOUND:
                GameEvent.emit(EventEnum.REFRESH_LOADING_TIPS , "发现新版本，请进行更新...");
                hasNew = true;
                break;
            default:
                //this.log("AAAAAAAAA这里有bugA:" + event.getEventCode());
                return;
        }
        
        self._am.setEventCallback(null);
        self._updating = false;

        self.log('-------------self._downLoadNewApk:' , HotUpdate.downLoadNewApk ? 'true' : 'false');
        if (HotUpdate.downLoadNewApk) {
            GameEvent.emit(EventEnum.NEED_DOWN_LOAD_NEW_APP , "'游戏版本过低，请下载新的安装包或加群下载新包'");
            return;
        }

        if (hasNew) {
            self.log('-------------hasNew , NOT_DOWN_LOAD_NEW_APP');
            GameEvent.emit(EventEnum.NOT_DOWN_LOAD_NEW_APP);
            self.hotUpdate();
        } else {
            GameEvent.emit(EventEnum.UPDATE_COMPLETE);
        }
    }

    /*
    private setAlert(content:string):void
    {
        GameGlobal.showGlobalMsgTip(content);
    }*/

    public updateCb(event):void {
        let self = this;
        let needRestart:boolean = false;
        let failed:boolean = false;
        self.log("updateCb code :" + event.getEventCode());
        switch (event.getEventCode())
        {
            case jsb['EventAssetsManager'].ERROR_NO_LOCAL_MANIFEST:
                self.log("jsb['EventAssetsManager'].ERROR_NO_LOCAL_MANIFEST");
                GameEvent.emit(EventEnum.REFRESH_LOADING_TIPS , "本地信息文件丢失,请重新下载完整的游戏包...");
                GameEvent.emit(EventEnum.NEED_DOWN_LOAD_NEW_APP , "本地信息文件丢失,请重新下载完整的游戏包...");
                failed = true;
                break;
            case jsb['EventAssetsManager'].UPDATE_PROGRESSION:
                let progress = event.getPercent();
                self.log("jsb['EventAssetsManager'].UPDATE_PROGRESSION:" + progress);
                if(isNaN(progress)){
                    progress = 0;
                }else if(progress > 1){
                    progress = 1;
                }

                let progressTotal:number = event.getPercentByFile() + (1 / event.getTotalFiles()) * progress;
                GameEvent.emit(EventEnum.UPDATE_PROGRESS_HOT_UPDATE , progressTotal);
                //let fileStr:string = event.getDownloadedFiles() + ' / ' + event.getTotalFiles();
                //let loadedMb:number = event.getDownloadedBytes() / 1024 / 1024;
                //let totalMb:number = event.getTotalBytes() / 1024 / 1024;

                //self.progressLabel.string = loadedMb.toFixed(1) + "mb" + ' / ' + totalMb.toFixed(1) + "mb " + "File Count" + fileStr + ")" + "\n" + self._versionStr;

                var msg = event.getMessage();
                if (msg) {
                    //GameEvent.emit(EventEnum.REFRESH_LOADING_TIPS , "Updated file" + msg);
                    //self.panel.info.string = 'Updated file: ' + msg;
                }
                break;
            case jsb['EventAssetsManager'].ERROR_DOWNLOAD_MANIFEST:
            case jsb['EventAssetsManager'].ERROR_PARSE_MANIFEST:
                self.log("jsb['EventAssetsManager'].ERROR_DOWNLOAD_MANIFEST");
                self.log("jsb['EventAssetsManager'].ERROR_PARSE_MANIFEST");
                GameEvent.emit(EventEnum.REFRESH_LOADING_TIPS , "加载远程版本文件失败...");
                failed = true;
                
                break;
            case jsb['EventAssetsManager'].ALREADY_UP_TO_DATE:
                self.log("jsb['EventAssetsManager'].ALREADY_UP_TO_DATE");
                GameEvent.emit(EventEnum.REFRESH_LOADING_TIPS , "本地版本已为最新的版本");
                GameEvent.emit(EventEnum.UPDATE_COMPLETE);
                break;
            case jsb['EventAssetsManager'].UPDATE_FINISHED:
                self.log("jsb['EventAssetsManager'].UPDATE_FINISHED");
                needRestart = true;//这里直接restart
                GameEvent.emit(EventEnum.REFRESH_LOADING_TIPS , "更新完成");
                break;
            case jsb['EventAssetsManager'].UPDATE_FAILED:
                self.log("jsb['EventAssetsManager'].UPDATE_FAILED," + event.getMessage());
                GameEvent.emit(EventEnum.REFRESH_LOADING_TIPS , "更新失败" + event.getMessage());
                GameEvent.emit(EventEnum.UPDATE_FAIL);
                self._updating = false;
                self._canRetry = true;
                self.onFail();
                break;
            case jsb['EventAssetsManager'].ERROR_UPDATING:
                self.log("jsb['EventAssetsManager'].ERROR_UPDATING," + event.getAssetId() + ', ' + event.getMessage());
                GameEvent.emit(EventEnum.REFRESH_LOADING_TIPS , "文件更新失败" + event.getAssetId() + ', ' + event.getMessage());
                break;
            case jsb['EventAssetsManager'].ERROR_DECOMPRESS:
                self.log("jsb['EventAssetsManager'].ERROR_DECOMPRESS," + event.getMessage());
                GameEvent.emit(EventEnum.REFRESH_LOADING_TIPS , event.getMessage());
                break;
            default:
                //self.log("AAAAAAAAA这里有bugB:" + event.getEventCode());
                break;
        }

        if (failed) {
            self._am.setEventCallback(null);
            self._updating = false;
        }

        self.log("needRestart:" + needRestart);
        if (needRestart) {
            GameEvent.emit(EventEnum.END_HOT_UPDATE);
            self._am.setEventCallback(null);
            // Prepend the manifest's search path
            var searchPaths = jsb.fileUtils.getSearchPaths();
            var newPaths = self._am.getLocalManifest().getSearchPaths();
            self.log(JSON.stringify(newPaths));
            Array.prototype.unshift.apply(searchPaths, newPaths);

            cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
            jsb.fileUtils.setSearchPaths(searchPaths);

            self.log("update end !!!!!!!!!!!!!!!!");
            cc.audioEngine.stopAll();
            cc.game.restart();
        }
    }


    private log(str:string,...subst: any[]) {
        console.log("-------------------------HotUpdate:--------------------" + str,subst)
    }

    private onFail() {
        this.reLoadBtn.active = true;
        //this.progressLabel.string = "ReLoad";
    }

    public retry():void
    {
        if (!this._updating && this._canRetry) {
            // this.panel.retryBtn.active = false;
            this._canRetry = false;
            GameEvent.emit(EventEnum.REFRESH_LOADING_TIPS , "Retry failed Assets...");
            //this.panel.info.string = 'Retry failed Assets...';
            this._am.downloadFailedAssets();
        }
    }

    public checkUpdate():void {
        let self = this;
        if (self._updating) {
            GameEvent.emit(EventEnum.REFRESH_LOADING_TIPS , "Checking or updating ...");

            //self.panel.info.string = 'Checking or updating ...';
            return;
        }
        if (self._am.getState() === jsb['AssetsManager'].State.UNINITED) {//如果可写路径就从可写路径里读，然后再从本地路径读
            // Resolve md5 url
            self._am.loadLocalManifest(self.localManifestUrl);
        }
        if (!self._am.getLocalManifest() || !self._am.getLocalManifest().isLoaded()) {
            //self.panel.info.string = 'Failed to load local manifest ...';
            GameEvent.emit(EventEnum.REFRESH_LOADING_TIPS , "本地信息文件丢失,请重新下载完整的游戏包...");
            GameEvent.emit(EventEnum.NEED_DOWN_LOAD_NEW_APP , "本地信息文件丢失,请重新下载完整的游戏包...");
            GameEvent.emit(EventEnum.UPDATE_FAIL);
            return;
        }

        // this.log('manifest url:' + self._am.getLocalManifest().remoteVersionUrl);
        self._am.setEventCallback(self.checkCb.bind(self));

        self._am.checkUpdate();
        self._updating = true;
    }

    public hotUpdate():void
    {
        let self = this;
        self.log('------hotUpdate-------');
        if (self._am && !self._updating) {
            self.log('------hotUpdate-----1--');
            self._am.setEventCallback(self.updateCb.bind(self));

            if (self._am.getState() === jsb['AssetsManager'].State.UNINITED) {
                // Resolve md5 url
                self._am.loadLocalManifest(self.localManifestUrl);
                self.log('------hotUpdate-----2--');
            }

            self._am.update();
            self._updating = true;
            GameEvent.emit(EventEnum.START_HOT_UPDATE);
        }

        self.log('self._am :' , self._am ? ' true' : 'false' , 'self._updating:' , self._updating ? 'true' : 'false');
    }

    /**获取当前版本号 */
    public getCurGameVersion():string
    {
        let self = this;
        if (!GlobalVal.hotUpdateEnabled)//不是原生环境
        {
            this.log("不是在原生模式下, 默认返回0.0.0");
            return "0.0.0";
        }
        let verStr:string = self.getAppVerFile(self.localManifestUrl);
        this.log("返回当前版本号:" + verStr);
        return verStr;
    }

    /**获取记录版本的文件
     * 1.在包体内
     * 2.在更新的可写文件内
     */
    private getAppVerFile(localManifestPath:string):string
    {
        let projManifestPath:string = jsb.fileUtils.getWritablePath() + GlobalVal.WriteDir + '/project.manifest';
        let loadManifest:string;
        let manifestObj:any;
        if (!jsb.fileUtils.isFileExist(projManifestPath))//优先获取可写路径内的,如果不存在才读取本地路径
        {
            //有更新过,在热更新可写路径内找到了project.manifest文件
            //没有更新过的话,需要从本地获取
            projManifestPath = localManifestPath;
        }
        loadManifest = jsb.fileUtils.getStringFromFile(projManifestPath);
        manifestObj = JSON.parse(loadManifest);
        return manifestObj.version;
    }

    /**比较版本号的函数 */
    private versionCompareHandle(versionA:string, versionB:string):number {
        console.log("-------------JS Custom Version Compare: version A is " + versionA + ', version B is ' + versionB);
        GlobalVal.curVersion = versionA;
        GameEvent.emit(EventEnum.CHANGE_VERSION_NAME);
        var vA:string[] = versionA.split('.');
        var vB:string[] = versionB.split('.');
        for (var i = 0; i < vA.length; ++i) {
            var a:number = parseInt(vA[i]);
            var b:number = parseInt(vB[i] || '0');

            console.log("-------------JS Custom Version Compare:" , b , a);
            
            if (i == 0 && b > a) {
                HotUpdate.downLoadNewApk = true;
                return 0;
            }

            if (a === b) {
                continue;
            }
            else {
                return a - b;
            }
        }
        HotUpdate.downLoadNewApk = false;
        if (vB.length > vA.length) {
            return -1;
        }
        else {
            return 0;
        }
    }

    /**开始更新 */
    public startUpdate():void
    {
        let self = this;
        
        self.reLoadBtn.active = false;

        // Hot update is only available in Native build
        console.log("GlobalVal.hotUpdateEnabled:" + (GlobalVal.hotUpdateEnabled ? "true" : "false"));
        if (!GlobalVal.hotUpdateEnabled || !cc.sys.isNative || (cc.sys.os != cc.sys.OS_IOS && cc.sys.os != cc.sys.OS_ANDROID)) {
            this.log("热更新只在原生环境下支持");
            return;
        }

        //本地可写路径
        let storagePath:string = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + GlobalVal.WriteDir);
        self.log('Storage path for remote asset : ' + storagePath);

        self._am = new jsb['AssetsManager']('', storagePath, self.versionCompareHandle);

        //let panel:UpdatePanel = self.panel;
        // Setup the verification callback, but we don't have md5 check function yet, so only print some message
        // Return true if the verification passed, otherwise return false
        self._am.setVerifyCallback(function (path:string, asset) {
            // When asset is compressed, we don't need to check its md5, because zip file have been deleted.
            var compressed = asset.compressed;
            // Retrieve the correct md5 value.
            var expectedMD5 = asset.md5;
            // asset.path is relative path and path is absolute.
            var relativePath = asset.path;
            // The size of asset file, but this value could be absent.
            var size = asset.size;

            if (compressed) {
                console.log("Verification passed : " + relativePath);
                return true;
            }
            else {
                console.log("Verification passed : " + relativePath + ' (' + expectedMD5 + ')');
                return true;
            }
        });

        //GameEvent.emit(EventEnum.REFRESH_LOADING_TIPS , 'Hot update is ready, please check or directly update.');
        GameEvent.emit(EventEnum.REFRESH_LOADING_TIPS , '正在检测版本.');
        //self.panel.info.string = 'Hot update is ready, please check or directly update.';

        if (cc.sys.os === cc.sys.OS_ANDROID) {
            self._am.setMaxConcurrentTask(2);
            //GameEvent.emit(EventEnum.REFRESH_LOADING_TIPS , 'Max concurrent tasks count have been limited to 2');
            //self.panel.info.string = "Max concurrent tasks count have been limited to 2";
        }
        
        //自动调用检测是否要更新
        self.checkUpdate();
    }

    onDestroy() {
        if(this._am){
            this._am.setEventCallback(null);
        }
    }


}
