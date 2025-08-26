
import { EventEnum } from "../../common/EventEnum";
import { GameEvent } from "../../utils/GameEvent";
import Dialog from "../../utils/ui/Dialog";


const { ccclass, property , menu} = cc._decorator;

@ccclass
@menu("Game/BountyScene/JingCaiFailView")
export default class JingCaiFailView extends Dialog {


    @property(cc.Label)
    label:cc.Label = null;

    private _data:any = null;
    setData(data:any) {
        this._data = data;
    }

    beforeShow() {
        if (this._data) {
            this.label.string = this._data;
        }
    }

    private onBackClick() {
        this.hide();
        GameEvent.emit(EventEnum.DO_EXIT_MAP);
    }
    
}
