
import { CreatureState } from "../../../common/AllEnum";
import { EventEnum } from "../../../common/EventEnum";
import { EActType } from "../../../logic/actMach/ActMach";
import { NodeUtils } from "../../../utils/ui/NodeUtils";
import BuffBase from "./BuffBase"

/**
 * 麻痹
 */
export class NumbBuff extends BuffBase {

    onBuffEffect() {
        // console.log('麻痹buff生效');
        if (!this.receiver.inState(CreatureState.NUMB)) {
            this.receiver.modifyState(CreatureState.NUMB , true);
        }
        if (this.receiver.mainBody) {
            this.initMainBody();
        } else {
            this.receiver.once(EventEnum.MAIN_BODY_ATTACHED , this.initMainBody , this);
        }
        this.receiver.on(EventEnum.ON_SELF_REMOVE , this.onSelfRemove , this);
        this.receiver.changeTo(EActType.NUMB);
    }

    onBuffRemove() {
        // console.log('麻痹buff移除');
        this.onSelfRemove();
        this.receiver.off(EventEnum.ON_SELF_REMOVE , this.onSelfRemove , this);
        this.receiver.off(EventEnum.MAIN_BODY_ATTACHED , this.initMainBody , this);
        this.receiver.modifyState(CreatureState.NUMB , false);
        if (this.receiver.isInAct(EActType.NUMB)) {
            this.receiver.changeTo(EActType.IDLE);
        }
        super.onBuffRemove();
    }

    private onSelfRemove() {
        if (this.receiver.mainBody) {
            NodeUtils.setColor(this.receiver.mainBody , cc.Color.WHITE);
        }
    }


    private initMainBody() {
        NodeUtils.setColor(this.receiver.mainBody , cc.Color.BLACK.fromHEX('#00FAFF'))
    }



}