
import { EventEnum } from "../../../../common/EventEnum";
import Creature from "../../../../logic/sceneObjs/Creature";
import { PassiveTriggerBase } from "./PassiveTriggerBase";

/**
 * 被击中时概率触发
 */
export class PT_OnHit extends PassiveTriggerBase {


    protected _times:number = 0;
    onAdd() {
        this._times = 0;
        // Debug.logWar("========PT_OnHit:" , this._times , this.owner.id , this.cfg.name);
        this.owner.on(EventEnum.ON_HIT , this.onHit , this);

        
    }


    onRemove(): void {
        this.owner.off(EventEnum.ON_HIT , this.onHit , this);
    }

    onReset(): void {
        super.onReset();
        this._times = 0;
    }

    protected onHit(release:Creature) {
        // Debug.logWar("========PT_OnHit1:" , this._times , this.owner.id ,release?.id || 0, this.cfg.name , this._isAddSuperArmorBuff , this.owner.inState(CreatureState.SUPER_ARMOR));
        this._times ++;
        // Debug.logWar("========PT_OnHit2:" , this._times , this.owner.id ,release?.id || 0, this.cfg.name , this.cfg.triggerValue);
        if (this._times >= this.cfg.triggerValue) {
            console.log("PT_OnHit:",this._times , "onTrigger");
            this._times = 0;
            this.onTrigger(release);
        }
    }

}