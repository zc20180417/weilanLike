
import { CreatureState } from "../../../common/AllEnum";
import { EventEnum } from "../../../common/EventEnum";
import Game from "../../../Game";
import { EActType } from "../../../logic/actMach/ActMach";
import { GameEvent } from "../../../utils/GameEvent";
import BuffBase from "./BuffBase"

/**
 * 嘲讽
 */
export class TauntBuff extends BuffBase {

    onBuffEffect() {
        // console.log('嘲讽buff生效');
        if (!this.receiver.inState(CreatureState.TAUNT)) {
            this.receiver.modifyState(CreatureState.TAUNT , true);
        }

        this.receiver.changeTo(EActType.IDLE);
        const releaseData = Game.ldSkillMgr.getReleaseSkillData(this.skillUid);
        if (releaseData) {
            this.receiver.emit(EventEnum.LD_TAUNT_BUFF , releaseData.releaseUid || 0);
        }
        // this.receiver.changeTo(EActType.NUMB);
    }

    onBuffRemove() {
        // console.log('嘲讽buff移除');
        this.receiver.modifyState(CreatureState.TAUNT , false);
        this.receiver.emit(EventEnum.LD_TAUNT_BUFF , 0);
        super.onBuffRemove();
    }



}