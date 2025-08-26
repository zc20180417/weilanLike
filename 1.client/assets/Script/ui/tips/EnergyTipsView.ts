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
export default class EnergyTipsView extends Dialog {
    @property(cc.RichText)
    des: cc.RichText = null;

    beforeShow() {
        let order: number = 2;
        this.des.string = StringUtils.richTextColorFormat("1.抽取", "#995124")
            + StringUtils.richTextColorFormat("<on click='clickShopBox'> <u>商店-宝箱</u> </on>", "#ea5718")
            + StringUtils.richTextColorFormat("能获得大量的能量", "#995124");

        if (GlobalVal.openRecharge) {
            this.des.string += StringUtils.richTextColorFormat("<br/><br/>2.在", "#995124")
                + StringUtils.richTextColorFormat("<on click='clickShopTehui'> <u>商店-特惠</u> </on>", "#ea5718")
                + StringUtils.richTextColorFormat("免费领取今日分能量<br/><br/>3.通过", "#995124")
                + StringUtils.richTextColorFormat("<on click='clickVip'> <u>贵宾特权</u> </on>", "#ea5718")
                + StringUtils.richTextColorFormat("领取每日份的能量", "#995124");
            order = 4;
        }

        this.des.string += StringUtils.richTextColorFormat("<br/><br/>" + order + ".在", "#995124")
            + StringUtils.richTextColorFormat("<on click='clickShopEnergy'> <u>商店-能量</u> </on>", "#ea5718")
            + StringUtils.richTextColorFormat("使用钻石兑换能量", "#995124");
    }
}
