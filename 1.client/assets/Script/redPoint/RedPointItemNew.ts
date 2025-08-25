// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import RedPointSytle from "./RedPointStyle";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RedPointItemNew extends RedPointSytle {
    @property(cc.Node)
    state: cc.Node = null;

    public refresh(redPointNum: number) {
        this.state.active = redPointNum > 0;
    }
}
