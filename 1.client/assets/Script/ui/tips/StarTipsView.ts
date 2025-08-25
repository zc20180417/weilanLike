// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { StringUtils } from "../../utils/StringUtils";
import Dialog from "../../utils/ui/Dialog";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StarTipsView extends Dialog {
    @property(cc.RichText)
    des: cc.RichText = null;

    beforeShow() {
        this.des.string = StringUtils.richTextColorFormat("1.升级猫咪可以获得星星<br/><br/>2.完成关卡任务可以获得星星", "#995124")
    }
}
