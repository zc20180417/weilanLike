import BaseItem from "../utils/ui/BaseItem";

const {ccclass, property,menu} = cc._decorator;

@ccclass
@menu("Game/Hall/PointItem")
export class PointItem extends BaseItem {
    @property(cc.Label)
    label: cc.Label = null;

    start () {

    }

    /**数据源 */
    public setData(data:any , index?:number) {
        super.setData(data,index);
        if (data) {
            this.label.string = data.describe;
        }
    }

}