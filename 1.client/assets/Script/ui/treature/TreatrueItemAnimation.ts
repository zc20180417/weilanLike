// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import TreatrueItem from "./treatrueItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TreatureItemAnimation extends cc.Component {
    @property(TreatrueItem)
    treatrueItem: TreatrueItem = null;

    animationEnd() {
        this.treatrueItem.animationEnd();
    }

    frameEventBgOpacityToMax() {
        this.treatrueItem.frameEventBgOpacityToMax();
    }
}
