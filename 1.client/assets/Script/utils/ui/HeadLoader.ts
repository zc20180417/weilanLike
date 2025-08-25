import ImageLoader from "./ImageLoader";
import { GameEvent } from "../GameEvent";
import SysMgr from "../../common/SysMgr";
import { Handler } from "../Handler";
import { StringUtils } from "../StringUtils";
import Game from "../../Game";



const {ccclass, property} = cc._decorator;

@ccclass
export default class HeadLoader extends ImageLoader {

    public static urlDic:Object = {};

    private _updateHandler:Handler = null;
    private _uid: number = 0;
    private _imgIndex:number = 0;


    
    get imgIndex():number { return this._imgIndex ; }
    set imgIndex(v:number) {
        if (this._imgIndex != v) {
            this._imgIndex = v;
            SysMgr.instance.callLater(this.getUpdateHandler());
        }
    }

    get uid() : number {        return this._uid;    }
    set uid(v : number) {
        if (this._uid != v) {
            this._uid = v;
            if (this._uid <= 0) {
                this.clear();
                return;
            }
            SysMgr.instance.callLater(this.getUpdateHandler());
        }   
    }

    set url(v: string) {
        if (this._url != v) {
            this._url = v;
            if (this._url == null) {
                this.clear();
                return;
            }
            SysMgr.instance.callLater(this.getUpdateHandler());
        }
    }

    onLoad() {
        super.onLoad();
    }

    private onUrl(guid:number,url:string,imgIndex:number) {
        if (guid == this._uid) {
            this._imgIndex = imgIndex;
            this._url = url;
            if (!StringUtils.isNilOrEmpty(url)) {
                this.loadImage();
            }
            else  {
                this.loadImgByIndex();
            }
        }
    }

    protected updateUrl() {
        if (this._uid <= 0) {
            this.showDefaultImg();
            return;
        }

        if (HeadLoader.urlDic[this.uid]) {
            this.url = HeadLoader.urlDic[this.uid];
            return;
        }

        //Game.playerInfo.requestUrl(this._uid);
    }

    private getUpdateHandler():Handler {
        if (this._updateHandler == null) {
            this._updateHandler = new Handler(this.updateImg , this);
        }
        return this._updateHandler;
    }

    protected updateImg() {
        if (!StringUtils.isNilOrEmpty(this._url)) {
            this.loadImage()
        }
        else if (this._imgIndex > 0) {
            this.loadImgByIndex();
        }
        else {
            this.updateUrl();
        }
    }
    
    protected loadImgByIndex() {
        this.initNode();
        if(this.spriteTarget){
            this.spriteTarget.spriteFrame = Game.resMgr.getSpriteAtlas("textures/HeadIcon").getSpriteFrame(this._imgIndex + '');
        }
    }

    protected showDefaultImg() {
        this.initNode();
        if(this.spriteTarget){
            this.spriteTarget.spriteFrame = Game.resMgr.getSpriteAtlas("textures/HeadIcon").getSpriteFrame('0');
        }
    }

    clear() {
        SysMgr.instance.clearCallLater(this.getUpdateHandler());
        this.spriteTarget.spriteFrame = null;
        this._url = null;
        this._uid = -1;
        this._imgIndex = -1;
    }

    onDestroy() {
        GameEvent.targetOff(this);
    }
}