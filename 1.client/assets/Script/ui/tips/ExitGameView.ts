import Game from "../../Game";
import { Handler } from "../../utils/Handler";
import Dialog from "../../utils/ui/Dialog";


const { ccclass, property ,menu} = cc._decorator;

@ccclass
@menu("Game/ui/tips/ExitGameView")
export class ExitGameView extends Dialog {

    private _handler:Handler;

    setData(handler:Handler) {
        this._handler = handler;
    }


    onExitClick() {
        this.hide();
        if (this._handler) {
            this._handler.execute();
        }
        // Game.nativeApi.exit();
    }


    onOkClick() {
        this.hide();
    }


}