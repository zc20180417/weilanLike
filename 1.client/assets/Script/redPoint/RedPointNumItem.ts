import RedPointSytle from "./RedPointStyle";

const { ccclass, property ,menu} = cc._decorator;
@ccclass
@menu("Game/ui/redPoint/RedPointNumItem")
export default class RedPointNumItem extends RedPointSytle {
    @property(cc.Node)
    state: cc.Node = null;

    @property(cc.Label)
    label:cc.Label = null;
    public refresh(redPointNum: number) {
        this.state.active = redPointNum > 0;
        this.label.string = redPointNum.toString();
    }
}