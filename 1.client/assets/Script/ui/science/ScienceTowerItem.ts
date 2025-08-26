
import BaseItem from "../../utils/ui/BaseItem";

const { ccclass, menu, property } = cc._decorator;

@ccclass
@menu("Game/ui/science/ScienceTowerItem")
export class ScienceTowerItem extends BaseItem {


    @property(cc.Label)
    type: cc.Label = null;

    @property(cc.Label)
    progressLabel:cc.Label = null;


    setData(data:any) {
        this.type.string = data.type;
        this.progressLabel.string = data.activeCount + "/" + data.max;
    }

    refresh(activeCount:number , max:number) {
        this.progressLabel.string = activeCount + "/" + max;
    }

}