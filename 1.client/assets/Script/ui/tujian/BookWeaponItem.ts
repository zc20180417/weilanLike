// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Handler } from "../../utils/Handler";
import BaseItem from "../../utils/ui/BaseItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BookWeaponItem extends BaseItem {
    @property(cc.SpriteAtlas)
    weaponAtlas: cc.SpriteAtlas = null;

    @property(cc.Sprite)
    icon: cc.Sprite = null;

    @property(cc.SpriteFrame)
    bgOn: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    bgOff: cc.SpriteFrame = null;

    @property(cc.Sprite)
    bg: cc.Sprite = null;

    private _clickHandler: Handler = null;

    public setClickHandler(handler: Handler) {
        this._clickHandler = handler;
    }

    public refresh() {
        this.icon.spriteFrame = this.weaponAtlas.getSpriteFrame(this.data);
        this.bg.spriteFrame = this.bgOff;
    }

    public onSelect() {
        this.bg.spriteFrame = this.bgOn;
    }

    public unSelect() {
        this.bg.spriteFrame = this.bgOff;
    }

    public onClick() {
        this.onSelect();
        if (this._clickHandler) this._clickHandler.executeWith(this.index);
    }
}
