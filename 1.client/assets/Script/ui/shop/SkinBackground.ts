// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { MathUtils } from "../../utils/MathUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SkinBackground extends cc.Component {
    @property(cc.SpriteFrame)
    skins: cc.SpriteFrame[] = [];

    @property(cc.Sprite)
    skin: cc.Sprite = null;

    public setQuality(index: number) {
        index = MathUtils.clamp(index, 0, this.skins.length - 1);
        this.skin.spriteFrame = this.skins[index];
    }
}
