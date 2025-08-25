import Creature from "../../../../logic/sceneObjs/Creature";
import { SoType } from "../../../../logic/sceneObjs/SoType";
import { PT_OnHit } from "./PT_OnHit";

export class PT_Hit_OnSommon extends PT_OnHit {

    protected onHit(release:Creature) {
        if (!SoType.isSommon(release)) return;
        // Debug.logWar("========PT_OnHit1:" , this._times , this.owner.id ,release?.id || 0, this.cfg.name , this._isAddSuperArmorBuff , this.owner.inState(CreatureState.SUPER_ARMOR));
        this._times ++;
        // Debug.logWar("========PT_OnHit2:" , this._times , this.owner.id ,release?.id || 0, this.cfg.name , this.cfg.triggerValue);
        if (this._times >= this.cfg.triggerValue) {
            console.log("PT_Hit_OnSommon:",this._times , "onTrigger");
            this._times = 0;
            this.onTrigger(release);
        }
    }
}