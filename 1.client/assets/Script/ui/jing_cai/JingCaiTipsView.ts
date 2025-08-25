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
export default class JingCaiTipsView extends Dialog {
    @property(cc.RichText)
    des: cc.RichText = null;

    private _data: any = null;
    setData(data: any) {
        this._data = data;
    }

    afterShow() {
        this.des.string = this._data ||
            "    1.可以随机关卡进行挑战，系统根据玩家" + StringUtils.richTextColorFormat("自身最强的猫咪", "#ff0000") + "去生成关卡的基础强度" +
            "\n    2.关卡的难度星级是根据玩家挑战成功率统计的评分参考，不代表绝对难度" +
            "\n    3.免费上阵三个猫咪，想要上阵更多猫咪，需要点击对应猫咪图标，钻石激活" +
            "\n    4.挑战消耗体力，但不限挑战次数，只限制每天的领取次数" +
            "\n    5.该模式中无法使用道具" +
            "\n    6." + StringUtils.richTextColorFormat("只会记录上一次挑战，所以奖励无法分多次完成", "#ff0000");
    }
}
