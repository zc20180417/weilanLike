// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Dialog from "../utils/ui/Dialog";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GlobalFuncTipsView extends Dialog {

    @property(cc.Label)
    tips: cc.Label = null;

    setData(data: string) {
        this.tips.string = data;
    }

}
