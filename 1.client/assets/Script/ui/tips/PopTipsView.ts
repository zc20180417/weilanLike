// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Dialog from "../../utils/ui/Dialog";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PopTipsView extends Dialog {
    @property(cc.Label)
    txt: cc.Label = null;

    public setData(data: any) {
        this.txt.string = data ? data : "";
    }
}
