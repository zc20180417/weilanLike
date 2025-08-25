import { CHANNEL_TYPE } from "../../common/AllEnum";
import GlobalVal from "../../GlobalVal";
import Dialog from "../../utils/ui/Dialog";

const { ccclass, property ,menu} = cc._decorator;

@ccclass
@menu("Game/ui/tips/QQQunView")
export class QQQunView extends Dialog {


    @property(cc.Node)
    gongZhongHaoImg:cc.Node = null;

    beforeShow() {
        if (this.gongZhongHaoImg) {
            this.gongZhongHaoImg.active = GlobalVal.channel == CHANNEL_TYPE.XX;

        }
    }

}