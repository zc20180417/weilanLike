// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Dialog from "../../utils/ui/Dialog";
import Game from "../../Game";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TimeView extends Dialog {

    @property(cc.Label)
    des: cc.Label = null;

    update() {
        // this.des.string = Game.addictionMgr.getTimeDesString();
    }

}
