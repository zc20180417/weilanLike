// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Game from "../../Game";
import { Handler } from "../../utils/Handler";
import ResManager from "../../utils/res/ResManager";
import { StringUtils } from "../../utils/StringUtils";
import Skin from "./Skin";

const { ccclass, property } = cc._decorator;

const SKIN_DIR = "prefabs/creature/skins/";

export enum SKIN_ANI_TYPE {
    DEFAULT,
    SHOW,       //展示
    SHOP,       //商城
    BOOK,       //图鉴
}

@ccclass
export default class SkinLoader extends cc.Component {

    private _path: string = "";
    private _isLoading: boolean = false;
    private _aniType: SKIN_ANI_TYPE = SKIN_ANI_TYPE.SHOW;

    private _callback: Function = null;

    setSkinPath(path: string, aniType: SKIN_ANI_TYPE, callback?: Function) {
        if (!StringUtils.isNilOrEmpty(path) && path != this._path) {
            this.node.removeAllChildren();
            this.removeLoad();
            this._path = SKIN_DIR + path;
            this._aniType = aniType;
            this._callback = callback;
            this.loadSkin();
        }
    }

    onDestroy() {
        this.removeLoad();
        Handler.dispose(this);
    }

    private removeLoad() {
        Game.resMgr.removeLoad(this._path, Handler.create(this.onSkinLoad, this));
        if (this._isLoading) {
            this._isLoading = false;
        }
    }

    private loadSkin() {
        if (this._isLoading) return;
        this._isLoading = true;
        Game.resMgr.loadRes(this._path, cc.Prefab, Handler.create(this.onSkinLoad, this));
    }

    private onSkinLoad(res, path) {
        Game.resMgr.addRef(path);
        this._isLoading = false;
        if (!res) return this._callback && this._callback.call(null, false);
        if (this._path == path) {
            this._callback && this._callback.call(null, true);
            let dragon: cc.Node = cc.instantiate(res);
            this.node.addChild(dragon);
            let skin = dragon.getComponent(Skin);
            switch (this._aniType) {
                case SKIN_ANI_TYPE.SHOW:
                    dragon.scale = skin.showScale;
                    dragon.setPosition(skin.showOffset);
                    skin.playAni("show", 0);
                    break;
                case SKIN_ANI_TYPE.SHOP:
                    skin.playAni("shop", 0);
                case SKIN_ANI_TYPE.BOOK:
                    dragon.setPosition(skin.bookOffset);
                    if (skin.bookScale !== 0) dragon.scale = skin.bookScale;
                    skin.playAni("show", 0);
                    break;
            }
        }
    }
}
