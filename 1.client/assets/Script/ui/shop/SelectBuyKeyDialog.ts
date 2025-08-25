import { Handler } from "../../utils/Handler";
import Dialog from "../../utils/ui/Dialog";
import ImageLoader from "../../utils/ui/ImageLoader";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("Game/ui/shop/SelectBuyKeyDialog")
export class SelectBuyKeyDialog extends Dialog {

    @property(cc.Label)
    label:cc.Label = null;

    @property(ImageLoader)
    ico:ImageLoader = null;

    private _okCallBack:Handler;

    onCancelClick() {
        this.hide();
    }

    onOkClick() {
        this._okCallBack.execute();
        this.hide();
    }


    public setData(data: any): void {
        if (!data) return;
        this.label.string = `是否花费 ${data.value} 钻石购买`;
        this.ico.setPicId(data.picid);
        this._okCallBack = data.callback;
    }

}