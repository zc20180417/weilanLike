// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import TapNavItem from "../dayInfoView/TapNavItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TaskNavItem extends TapNavItem {
    @property([cc.SpriteFrame])
    txtOn: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    txtff: cc.SpriteFrame[] = [];

    @property(cc.SpriteFrame)
    bgOn: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    bgOff: cc.SpriteFrame = null;

    @property(cc.Sprite)
    bg: cc.Sprite = null;

    @property(cc.Sprite)
    on: cc.Sprite = null;

    @property(cc.Sprite)
    off: cc.Sprite = null;

    public onSelect() {
        this.on.node.active = true;
        this.off.node.active = false;
        this.bg.spriteFrame = this.bgOn;
        this.on.spriteFrame = this.txtOn[this.index];
        this.off.spriteFrame = this.txtff[this.index];
    }

    public unSelect() {
        this.on.node.active = false;
        this.off.node.active = true;
        this.bg.spriteFrame = this.bgOff;
        this.on.spriteFrame = this.txtOn[this.index];
        this.off.spriteFrame = this.txtff[this.index];
    }
}
