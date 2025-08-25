import { EventEnum } from "../../common/EventEnum";
import { GameEvent } from "../../utils/GameEvent";
import Dialog from "../../utils/ui/Dialog";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("Game/LD/ui/GameSuccessView")
export class GameSuccessView extends Dialog {


    onExitClick() {
        this.hide();
        GameEvent.emit(EventEnum.DO_EXIT_MAP);
    }

    onGoonClick() {
        
    }
}