import BaseItem from "./BaseItem";

const { ccclass, property ,menu} = cc._decorator;

@ccclass
@menu("Game/utls/ComBoxItem")
export class ComBoxItem extends BaseItem {
    @property(cc.Label)
    label: cc.Label = null;

    start () {

    }

    public setData(data:any , index?:number) {
        super.setData(data , index);
        if (data == null) return;
        this.label.string = data.text;
        
    }
}