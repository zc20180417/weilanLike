// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import TapNavItem from "../dayInfoView/TapNavItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends TapNavItem {
    @property([cc.SpriteFrame])
    txtOn: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    txtff: cc.SpriteFrame[] = [];

    @property(cc.Node)
    bgOn: cc.Node = null;

    @property(cc.Node)
    bgOff: cc.Node = null;

    @property(cc.Sprite)
    on: cc.Sprite = null;

    @property(cc.Sprite)
    off: cc.Sprite = null;
    
    public onSelect() {
        this.bgOn.active = true;
        this.bgOff.active = false;
        this.on.spriteFrame = this.txtOn[this.index];
        this.off.spriteFrame = this.txtff[this.index];
    }

    public unSelect() {
        this.bgOn.active = false;
        this.bgOff.active = true;
        this.on.spriteFrame = this.txtOn[this.index];
        this.off.spriteFrame = this.txtff[this.index];
    }
}
