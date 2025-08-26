import { CreatureState } from "../../../common/AllEnum";
import { EActType } from "../../../logic/actMach/ActMach";
import BuffBase from "./BuffBase";

/**
 * 眩晕
 */
export class VertigoBuff extends BuffBase {

    onBuffEffect() {
        // console.log('眩晕buff生效');
        if (!this.receiver.inState(CreatureState.VERTIGO)) {
            this.receiver.modifyState(CreatureState.VERTIGO , true);
        }

        this.receiver.changeTo(EActType.IDLE);
        
        // this.receiver.changeTo(EActType.NUMB);
    }

    onBuffRemove() {
        // console.log('眩晕buff移除');
        this.receiver.modifyState(CreatureState.VERTIGO , false);
        super.onBuffRemove();
    }



}