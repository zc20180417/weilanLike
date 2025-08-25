// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Dialog from "../utils/ui/Dialog";

const { ccclass, property } = cc._decorator;

@ccclass
export default class QuestionView extends Dialog {
    @property(cc.Label)
    des: cc.Label = null;

    _data: string = "";
    setData(data) {
        this._data = data;
    }

    afterShow() {
        this.des.string = this._data;
    }
}
