
import { CreatureState } from "../../../../common/AllEnum";
import { EventEnum } from "../../../../common/EventEnum";
import { EActType } from "../../../../logic/actMach/ActMach";
import { PassiveTriggerBase } from "./PassiveTriggerBase";

/**
 * 连续攻击N下
 */
export class PT_ContinueAttack extends PassiveTriggerBase {


    private _atkTimes:number = 0;

    onAdd() {
        // this.owner.on(EventEnum.RELEASE_NORMAL_ATTACK , this.onAttack , this);
        // this.owner.on(EventEnum.ACTION_CAHNGE , this.onActionChange , this);
    }


    onRemove(): void {
        // this.owner.off(EventEnum.RELEASE_NORMAL_ATTACK , this.onAttack , this);
        // this.owner.off(EventEnum.ACTION_CAHNGE , this.onActionChange , this);
    }

    onReset(): void {
        super.onReset();
        this._atkTimes = 0;
    }

    private onAttack() {
        this._atkTimes ++;
        if (this._atkTimes >= this.cfg.triggerValue) {
            this._atkTimes = 0;
            this.onTrigger();
        }
    }


}