
import BuffBase from "./BuffBase"

export class AddAtttackSpeedBuff extends BuffBase {

    onBuffEffect() {
        console.log('攻击速度buff生效');
        // this.receiver.propComp.addPropertyValue(PropertyId.ATTACK_SPEED , -this.config.damageCoefficient);
    }

    onBuffRemove() {
        console.log('攻击速度buff失效');
        // this.receiver.propComp.addPropertyValue(PropertyId.ATTACK_SPEED , this.config.damageCoefficient);
        super.onBuffRemove();
    }



}