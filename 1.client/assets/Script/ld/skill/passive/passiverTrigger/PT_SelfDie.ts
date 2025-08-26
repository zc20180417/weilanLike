
import { EventEnum } from "../../../../common/EventEnum";
import { PassiveTriggerBase } from "./PassiveTriggerBase";

/**
 * 自身死亡时触发
 */
export class PT_SelfDie extends PassiveTriggerBase {


    onAdd() {
        this.owner.on(EventEnum.CREATURE_DIE_CHECK , this.onSelfDie , this);
    }


    onRemove(): void {
        this.owner.off(EventEnum.CREATURE_DIE_CHECK , this.onSelfDie , this);
    }

    private onSelfDie() {
        this.onTrigger();
    }

}