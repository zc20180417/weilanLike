// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { MathUtils } from "../../utils/MathUtils";

const { ccclass, property , menu } = cc._decorator;

@ccclass
@menu("Game/tower/TowerStarTitle")
export default class TowerStarTitle extends cc.Component {
    @property(cc.SpriteFrame)
    titleSpriteFrame: cc.SpriteFrame[] = [];

    @property(cc.Sprite)
    icon: cc.Sprite = null;

    @property(cc.SpriteFrame)
    nameSpriteFrame: cc.SpriteFrame[] = [];

    @property(cc.Sprite)
    nameSprite: cc.Sprite = null;

    public setIndex(index: number) {
        index = index >= this.titleSpriteFrame.length ? index - 1 : index;
        this.icon.spriteFrame = this.titleSpriteFrame[index];

        if (this.nameSprite) {
            this.nameSprite.spriteFrame = this.nameSpriteFrame[MathUtils.clamp(index, 0, this.nameSpriteFrame.length)];
        }
    }
}
