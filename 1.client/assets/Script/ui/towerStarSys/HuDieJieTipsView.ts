// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Dialog from "../../utils/ui/Dialog";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HuDieJieTipsView extends Dialog {
    @property(cc.RichText)
    tips: cc.RichText = null;

    beforeShow(){
        this.tips.string=
        `1.好友列表-进入好友猫咪公寓：每日可以拾取少量蝴蝶结\n2.猫咪公寓：解锁猫咪公寓楼层获得大量蝴蝶结`;
    }
}
