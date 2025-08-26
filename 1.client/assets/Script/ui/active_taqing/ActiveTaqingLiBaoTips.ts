import Dialog from "../../utils/ui/Dialog";
import { GoodsBox } from "../../utils/ui/GoodsBox";

const { ccclass, property ,menu } = cc._decorator;

@ccclass
@menu('Game/ui/active-taqing/ActiveTaqingLiBaoTips')

export class ActiveTaqingLiBaoTips extends Dialog {

    @property(GoodsBox)
    goodsBox:GoodsBox = null;

    // goodsItem:GoodsItem

    private _data:any[] = [];
    setData(data:any) {
        this._data = data;
    }

    protected beforeShow(): void {
        this.goodsBox.array = this._data;
    }

}