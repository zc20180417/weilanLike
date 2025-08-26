// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Game from "../../Game";
import Dialog from "../../utils/ui/Dialog";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ExistTipsView extends Dialog {
    @property(cc.RichText)
    des: cc.RichText = null;

    setData(data) {
        this.des.string = data || "";
    }

    onClick() {
        Game.nativeApi.exit();
    }
}
