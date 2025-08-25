// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GlobalVal from "../../GlobalVal";
import { StringUtils } from "../../utils/StringUtils";
import Dialog from "../../utils/ui/Dialog";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LingDangTipsView extends Dialog {
    @property(cc.RichText)
    des: cc.RichText = null;

    beforeShow() {
        let order: number = 3;
        this.des.string = StringUtils.richTextColorFormat("1.在", "#995124")
            + StringUtils.richTextColorFormat("<on click='clickShangJin'> <u>赏金模式</u> </on>", "#ea5718")
            + StringUtils.richTextColorFormat("中通过关卡获得铃铛<br/><br/>2.完成关卡的困难模式-任务3，可获得较多铃铛", "#995124");

        // if (GlobalVal.openRecharge) {
        //     this.des.string += StringUtils.richTextColorFormat("<br/><br/>3.通过", "#995124")
        //         + StringUtils.richTextColorFormat("<on click='clickVip'> <u>贵宾特权</u> </on>", "#ea5718")
        //         + StringUtils.richTextColorFormat("领取每日份的铃铛", "#995124");
        //     order = 4;
        // }

        this.des.string += StringUtils.richTextColorFormat("<br/><br/>" + order + ".完成游戏", "#995124")
            + StringUtils.richTextColorFormat("<on click='clickAchievement'> <u>成就</u> </on>", "#ea5718")
            + StringUtils.richTextColorFormat("获得大量的铃铛", "#995124");
    }
}
