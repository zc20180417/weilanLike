import { StringUtils } from "../StringUtils";
import GlobalVal from "../../GlobalVal";
import Game from "../../Game";
import { Handler } from "../Handler";
import { CacheModel } from "../res/ResManager";


const { ccclass, property, menu } = cc._decorator;

/**
 *
 */
@ccclass
@menu("Game/utls/ImageLoader")
export default class ImageLoader extends cc.Component {
    public static EventType = {
        ON_IMAGE_LOADED: "on_image_loaded"
    }

    @property({
        type: cc.Sprite,
        tooltip: '精灵对象'
    })
    spriteTarget: cc.Sprite = null;

    @property({
        type: cc.SpriteFrame,
        tooltip: '默认显示图像（在加载成功前显示）'
    })
    defaultSpriteFrame: cc.SpriteFrame = null;

    @property({
        min: 1,
        max: 4096,
        type: cc.Float,
        tooltip: '图像宽度'
    })
    imageWidth: number = 100;

    @property({
        min: 1,
        max: 4096,
        step: 1,
        type: cc.Float,
        tooltip: '图像高度'
    })
    imageHeight: number = 100;

    @property({
        tooltip: '是否保持原始大小',
    })
    sizeIsRaw: boolean = false;

    @property({
        tooltip: '限制最大的宽高',
    })
    limitMaxWid: number = 0;

    @property({
        tooltip: '限制最大的高',
    })
    limitMaxHeight: number = 0;

    private _useSpriteFrame: boolean = false;
    private _loadHandler: Handler = new Handler(this.setSf, this);
    private _loadNetHandler: Handler = new Handler(this.setTex, this);
    private _setTexCb: Handler;
    protected _loading: boolean = false;
    protected _url: string = null;
    get url(): string {
        return this._url;
    }

    set url(v: string) {
        if (this._url != v) {
            this.tryRemoveLoad();
            this._url = v;
            this.loadImage();
        }
    }

    clear() {
        this.url = "";
        this.spriteTarget.spriteFrame = null;
    }

    /**一般的ico */
    setPicId(id: number) {
        this.url = GlobalVal.IMAGE_LOADER_DIR + id;
    }

    setFaceFile(fileName: string) {
        this.url = GlobalVal.HEAD_URL + fileName;
    }

    setSpriteFrame(value: cc.SpriteFrame) {
        this.setSf(value);
        this._useSpriteFrame = true;
    }

    onLoad() {
        if (!this._loading) {
            this.loadImage();
        }

        if (this.spriteTarget.spriteFrame && this._useSpriteFrame) {
            this.initNode();
            this.tryLimitWid();
        }
    }

    setTexCb(handler: Handler) {
        this._setTexCb = handler;
        if (this.spriteTarget.spriteFrame) {
            this._setTexCb.executeWith(this);
        }
    }

    protected initNode() {
        if (this.spriteTarget) {
            if (!this.sizeIsRaw) {
                this.spriteTarget.sizeMode = cc.Sprite.SizeMode.CUSTOM;
                this.spriteTarget.node.width = this.imageWidth;
                this.spriteTarget.node.height = this.imageHeight;
            } else {
                this.spriteTarget.sizeMode = cc.Sprite.SizeMode.RAW;
            }
        }
        // if (!this.sizeIsRaw && this.spriteTarget) {
            
        // }
    }

    protected tryLimitWid() {
        if (this.limitMaxWid > 1) {
            let rect: cc.Rect = this.spriteTarget.spriteFrame.getRect();
            let height = Math.max(rect.height, rect.width);
            this.spriteTarget.node.scale = height > this.limitMaxWid ? this.limitMaxWid / height : 1;
        }

        this.tryLimitHeight();
    }

    protected tryLimitHeight() {
        if (this.limitMaxHeight > 0) {
            let rect: cc.Size = this.spriteTarget.spriteFrame.getOriginalSize();
            let height = rect.height;
            this.spriteTarget.node.scale = height > this.limitMaxHeight ? this.limitMaxHeight / height : 1;
        }

        if (this._setTexCb) {
            this._setTexCb.executeWith(this);
        }
    }

    protected loadImage() {
        if (this.spriteTarget == null) {
            return;
        }
        if (this._url == null || this._url == "") {
            if (!this._useSpriteFrame) {
                this.spriteTarget.spriteFrame = this.defaultSpriteFrame;
            }
            return;
        }

        let spriteTarget: cc.Sprite = this.spriteTarget;
        this.initNode();

        spriteTarget.spriteFrame = this.defaultSpriteFrame;
        this._loading = true;
        if (StringUtils.startsWith(this._url, "http")) {
            Game.resMgr.loadNetRes(this._url, 'png', this._loadNetHandler , CacheModel.TIME);
        } else {
            Game.resMgr.loadRes(this._url, cc.SpriteFrame, this._loadHandler, CacheModel.TIME);
        }
    }


    private setTex(tex: cc.Texture2D, url: string) {
        Game.resMgr.addRef(url);
        if (url == this._url) {
            var spriteFrame: cc.SpriteFrame = new cc.SpriteFrame(tex);
            this.spriteTarget.spriteFrame = spriteFrame;
            this.tryLimitWid();
        }

        this.node.emit(ImageLoader.EventType.ON_IMAGE_LOADED);
    }

    private tryRemoveLoad() {
        if (StringUtils.isNilOrEmpty(this._url)) return;
        if (StringUtils.startsWith(this._url, "http")) {
            Game.resMgr.removeLoadNetRes(this._url, this._loadNetHandler);
        } else {
            Game.resMgr.removeLoad(this._url, this._loadHandler);
        }
        this._url = "";
        this._loading = false;
    }

    private setSf(value: cc.SpriteFrame, path?: string) {
        if (!value) {
            if (this.defaultSpriteFrame) {
                this.spriteTarget.spriteFrame = this.defaultSpriteFrame;
                this.tryLimitWid();
            }
            return;
        }
        if (path) Game.resMgr.addRef(path);
        this._useSpriteFrame = false;
        this.spriteTarget.spriteFrame = value;
        this.tryLimitWid();
        this.node.emit(ImageLoader.EventType.ON_IMAGE_LOADED);
    }

    onDestroy() {
        this.tryRemoveLoad();
        this._loadHandler = null;
        this._loadNetHandler = null;
    }

}