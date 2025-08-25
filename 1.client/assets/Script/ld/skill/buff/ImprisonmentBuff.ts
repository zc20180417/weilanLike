
import { CreatureState } from "../../../common/AllEnum";
import BuffBase from "./BuffBase"

export class ImprisonmentBuff extends BuffBase {

    onBuffEffect() {
        console.log('禁锢buff生效');
        this.receiver.modifyState(CreatureState.IMPRISONMENT , true);
    }

    onBuffRemove() {
        console.log('禁锢buff移除');
        this.receiver.modifyState(CreatureState.IMPRISONMENT , false);
        super.onBuffRemove();
    }



}