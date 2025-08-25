
import { PropertyId } from "../../../../common/AllEnum";
import { EventEnum } from "../../../../common/EventEnum";
import { PassiveTriggerBase } from "./PassiveTriggerBase";

/**
 * 血量为0的时候触发
 */
export class PT_HpZero extends PassiveTriggerBase {


    onAdd() {
        this.owner.on(EventEnum.PROPERTY_CHANGE, this.onPropChange, this);
    }


    onRemove(): void {
        this.owner.off(EventEnum.PROPERTY_CHANGE , this.onPropChange , this);
    }

    private onPropChange(id:number , value:number) {
        if (id == PropertyId.HP && value <= 0) {
            this.onTrigger();
        }
    }

}