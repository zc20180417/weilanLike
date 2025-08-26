

import { PropertyId } from "../../../common/AllEnum";
import BuffBase from "./BuffBase"

export class TreatReduceBuff extends BuffBase {

    onBuffEffect() {
        console.log('降低治疗buff生效');
        this.receiver.prop.addPropertyValue(PropertyId.TREAT_REDUCE , this._config.buffValue);
    }

    onBuffRemove() {
        console.log('降低治疗buff移除');
        this.receiver.prop.addPropertyValue(PropertyId.TREAT_REDUCE , -this._config.buffValue);
        super.onBuffRemove();
    }



}