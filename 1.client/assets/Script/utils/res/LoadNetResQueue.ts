
import { md5 } from "../../libs/encrypt/md5";
import { LoadResData } from "./LoadResData";
import { LoadResQueue } from "./LoadResQueue";
import { LoadingState } from "./ResManager";

export class LoadNetResQueue extends LoadResQueue {

    private static MaxLoadingNetCount: number = 2;
    private _fileFolder:string = '';
    constructor() {
        super();
        if (cc.sys.isNative) {
            this._fileFolder = jsb.fileUtils.getWritablePath() + 'img/';
        }
    }

    protected loadNext(): void {
        if (this.datas.length > 0) {
            let data: LoadResData = this.datas.pop();
            if (cc.sys.isNative) {
                if (this.checkLoaded(data)) {
                    data.progress = 1;
                    this.changeProgress();
                    this.curLoadingCount++;
                    this.loadEndOne(data , this.getFilePath(data));
                    return;
                } else {

                    this.startLoadNetRes(data);
                }
            } else {
                // cc.log('--------data.path:' , data.path);
                // cc.log('--------data.resType:' , data.resType);
                cc.assetManager.loadRemote(data.path , 
                                        { ext: '.' + data.resType },
                                (err , tex) => {
                                    if (err == null) {
                                        data.data = tex;
                                        data.onComplete();
                                        this.onCompleteOne(data);
                                    } else {
                                        cc.log(err);
                                    }
                                });
            }

            this.curLoadingCount++;
            if (this.curLoadingCount < LoadNetResQueue.MaxLoadingNetCount) {
                this.loadNext();
            }
        }
    }

    private checkLoaded(data:LoadResData) {
        let filepath = this.getFilePath(data);
        return jsb.fileUtils.isFileExist(filepath) ? true : false;
    }

    // private startLoad(loadData:LoadResData) {
    //     loadData.loadState = LoadingState.LOADING;
    //     let filepath = this.getFilePath(loadData);
    //     this.loadingList.push(loadData);

    //     let downloader = new jsb.Downloader();
    //     let downPath:string = loadData.path;
    //     downloader.createDownloadFileTask( downPath , filepath);
    //     downloader.setOnTaskProgress((task:jsb.DownloaderTask , bytesReceived:number , totalBytesReceived:number , totalBytesExpected:number ) => {
    //         loadData.progress = totalBytesReceived / totalBytesExpected;
    //         this.changeProgress();
    //     })

    //     downloader.setOnFileTaskSuccess((task:jsb.DownloaderTask)=> {
    //         this.loadEndOne(loadData , filepath);
    //     });

    //     downloader.setOnTaskError(()=> {
    //         cc.log('downloader error:' , loadData.path);
    //         this.onDownLoadError(loadData);
    //     })
        
    // }

    private loadEndOne(loadData:LoadResData , filepath:string) {
        cc.assetManager.loadRemote(filepath, function (err, tex) {
            if (err) {
                cc.error('startLoadNetRes error:' + err);
            } else {
                cc.log('loadEnd:' + filepath);
                loadData.data = tex;
                loadData.onComplete();
            }
        });
        this.onCompleteOne(loadData);
    }

    // private onDownLoadError(loadData:LoadResData) {
    //     // if (loadData.completeLen > 0) {
    //     // }
    //     loadData.onComplete();
    //     this.onCompleteOne(loadData);
    // }

    private getFilePath(data:LoadResData):string {
        return this._fileFolder + md5(data.path) + '.' + data.resType;
    }


    /**
     * 开始加载网络图片，暂时不做队列
     * @param resData 
     */
     private startLoadNetRes(loadData: LoadResData) {
        loadData.loadState=LoadingState.LOADING;
        this.loadingList.push(loadData);

        let dirpath = jsb.fileUtils.getWritablePath() + 'img/';
        let filepath = this.getFilePath(loadData);
        let self = this;
        
        if (jsb.fileUtils.isFileExist(filepath)) {
            self.loadEndOne(loadData , filepath);
            return;
        }

        var saveFile = function (data) {
            if (typeof data !== 'undefined') {
                if (!jsb.fileUtils.isDirectoryExist(dirpath)) {
                    jsb.fileUtils.createDirectory(dirpath);
                }
                let array = new Uint8Array(data);
                //cc.log('saveFile:' , filepath , array.length ,loadData.path );
                if (jsb.fileUtils["writeDataToFile"]( array, filepath)) {
                    cc.log('Remote write file succeed.');
                    self.loadEndOne(loadData , filepath);
                } else {
                    cc.log('Remote write file failed.');
                }
            } else {
                cc.log('Remote download file failed.');
            }
        };

        var xhr:XMLHttpRequest = new XMLHttpRequest();

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    saveFile(xhr.response);
                } else {
                    cc.log('Remote download file failed.');
                }
            }
        }.bind(this);
        
        xhr.responseType = 'arraybuffer';
        xhr.open("GET", loadData.path, true);
        xhr.send();

        cc.log("---------------startLoadNetRes:" + loadData.path);
    }

}