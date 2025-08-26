
import { EventEnum } from "../../../../common/EventEnum";
import Creature from "../../../../logic/sceneObjs/Creature";
import { MathUtils } from "../../../../utils/MathUtils";
import { PassiveTriggerBase } from "./PassiveTriggerBase";

/**
 * 攻击时概率触发
 */
export class PT_Attack extends PassiveTriggerBase {


    onAdd() {
        // this.owner.on(EventEnum.RELEASE_NORMAL_ATTACK , this.onAttack , this);
    }


    onRemove(): void {
        // this.owner.off(EventEnum.RELEASE_NORMAL_ATTACK , this.onAttack , this);
    }

    private onAttack(target:Creature) {
        const value = MathUtils.seedRandomConst();
        if (value <= this.cfg.triggerValue * 0.0001) {
            this.onTrigger(target);
        }
    }

}