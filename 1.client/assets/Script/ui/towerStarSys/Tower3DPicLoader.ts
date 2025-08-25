// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Game from "../../Game";
import { Handler } from "../../utils/Handler";
import Tower3DPic from "./Tower3DPic";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Tower3DPicLoader extends cc.Component {
    static EventType = {
        ON_COMPLETE: "on_complete"
    }

    @property
    private _url: string = "";

    @property
    get url(): string {
        return this._url;
    }
    set url(value: string) {
        if (this._url && value === this._url) {
            this._tower3DPic && this.node.emit(Tower3DPicLoader.EventType.ON_COMPLETE, this._tower3DPic);
            return;
        }
        let oldUrl = this.url;
        this._url = value;
        this._load(this._url, oldUrl);
    }

    private _tower3DPic: Tower3DPic = null;
    get tower3DPic(): Tower3DPic {
        return this._tower3DPic;
    }
    set tower3DPic(value: Tower3DPic) {
        this._tower3DPic = value;
    }

    private _load(url: string, oldUrl: string) {
        if (this._tower3DPic) {
            this._tower3DPic.clickHandler = null;
            this._tower3DPic.node.destroy();
            this._tower3DPic = null;
        }
        if (oldUrl) {
            Game.resMgr.removeLoad(oldUrl, Handler.create(this._onComplete, this));
        }

        Game.resMgr.loadRes(url, cc.Prefab, Handler.create(this._onComplete, this));
    }

    private _onComplete(data: cc.Prefab, path: string) {
        // if (this.url !== path) return;
        Game.resMgr.addRef(path);
        let node = cc.instantiate(data);
        node.parent = this.node;
        this._tower3DPic = node.getComponent(Tower3DPic);
        this.node.emit(Tower3DPicLoader.EventType.ON_COMPLETE, this._tower3DPic);
    }

    protected onDestroy(): void {
        Game.resMgr.removeLoad(this.url, Handler.create(this._onComplete, this));
        Handler.dispose(this);
    }
}   
