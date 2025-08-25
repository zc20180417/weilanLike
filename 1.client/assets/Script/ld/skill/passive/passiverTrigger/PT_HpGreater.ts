
import { PropertyId } from "../../../../common/AllEnum";
import { EventEnum } from "../../../../common/EventEnum";
import { PassiveTriggerBase } from "./PassiveTriggerBase";

/**
 * 血量>n的时候触发
 */
export class PT_HpGreater extends PassiveTriggerBase {

    //是否生效中
    private _isInEffect:boolean = false;
    private _triggerValue:number = 0;
    onAdd() {
        this._triggerValue = this.cfg.triggerValue * 0.0001;
        this.checkHp(this.owner.prop.hp.value);
        this.owner.on(EventEnum.PROPERTY_CHANGE, this.onPropChange, this);
    }


    onRemove(): void {
        this.owner.off(EventEnum.PROPERTY_CHANGE , this.onPropChange , this);
    }

    protected onTriggerStop(): void {
        this._isInEffect = false
        super.onTriggerStop();
        if (this.exceedingLimits) {
            this.onRemove();
        }
    }

    private onPropChange(id:number , value:number) {
        if (id == PropertyId.HP) {
            this.checkHp(value);
        }
    }

    private checkHp(hp:number) {
        const totalHp = this.owner.prop.getPropertyValue(PropertyId.MAX_HP);
        const triggerFlag = (hp / totalHp) >= this._triggerValue;
        if (!this._isInEffect && triggerFlag) {
            this.onTrigger();
            this._isInEffect = true;
        } else if (this._isInEffect && !triggerFlag) {
            //血量低于N，结束
            this.onTriggerStop();
        }
    }

}