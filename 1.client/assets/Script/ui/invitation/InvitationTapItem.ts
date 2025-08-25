// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import TapNavItem from "../dayInfoView/TapNavItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class InvitationtapItem extends TapNavItem {

    @property(cc.Sprite)
    selectSprite: cc.Sprite = null;

    @property(cc.Sprite)
    textSprite: cc.Sprite = null;

    @property([cc.SpriteFrame])
    selecteSpriteFrame: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    unselectedSpriteFrame: cc.SpriteFrame[] = [];

    @property(cc.SpriteFrame)
    selectedBg: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    unselectedBg: cc.SpriteFrame = null;


    refresh() {
        this.textSprite.spriteFrame = this.unselectedSpriteFrame[this.index];
        this.selectSprite.spriteFrame = this.unselectedBg;
    }

    onSelect() {
        this.textSprite.spriteFrame = this.selecteSpriteFrame[this.index];
        this.selectSprite.spriteFrame = this.selectedBg;
    }

    unSelect() {
        this.textSprite.spriteFrame = this.unselectedSpriteFrame[this.index];
        this.selectSprite.spriteFrame = this.unselectedBg;
    }

}
