// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Dialog from "../../utils/ui/Dialog";
import Game from "../../Game";
import { Handler } from "../../utils/Handler";
import { CacheModel } from "../../utils/res/ResManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BossView extends Dialog {
    @property(cc.Label)
    title: cc.Label = null;

    @property(cc.Sprite)
    titleIcon: cc.Sprite = null;

    @property(cc.Node)
    iconNode: cc.Node = null;

    @property(cc.Sprite)
    titleBg: cc.Sprite = null;

    @property(cc.Label)
    des: cc.Label = null;

    @property(cc.SpriteAtlas)
    guideAtlas: cc.SpriteAtlas = null;

    _data: any = null;

    setData(data: any) {
        this._data = data;
    }

    onLoad() {
        super.onLoad();
        this.refresh();
    }

    onDestroy() {
        if (this._data) {
            Game.resMgr.removeLoad(this._data.icon, Handler.create(this.iconLoadCompleted, this));
        }
        Handler.dispose(this);
    }

    refresh() {
        if (!this._data) return;

        this.title.string = this._data.titleName;
        this.titleIcon.spriteFrame = this.guideAtlas.getSpriteFrame(this._data.titleIcon);
        this.titleBg.spriteFrame = this.guideAtlas.getSpriteFrame(this._data.titleBg);
        this.des.string = this._data.des;

        Game.resMgr.loadRes(this._data.icon, cc.Prefab, Handler.create(this.iconLoadCompleted, this), CacheModel.CUSTOM);
    }

    iconLoadCompleted(res, path) {
        Game.resMgr.addRef(path);
        let icon = cc.instantiate(res);
        this.iconNode.addChild(icon);
    }

}
