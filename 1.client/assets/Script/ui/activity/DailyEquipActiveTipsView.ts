// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Dialog from "../../utils/ui/Dialog";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DailyEquipActiveTipsView extends Dialog {
    @property(cc.RichText)
    des: cc.RichText = null;

    beforeShow() {
        this.des.string = `  1.需要先激活对应猫咪后，才会出现其装备礼包\n  2.该礼包为唯一，每只猫只限购一次\n  3.装备不能重复激活，如果已经激活过装备，请不要重复购买或者联系客服`;
    }
}
