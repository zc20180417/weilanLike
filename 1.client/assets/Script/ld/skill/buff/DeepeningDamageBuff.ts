
import BuffBase from "./BuffBase"

export class DeepeningDamageBuff extends BuffBase {

    onBuffEffect() {
        console.log(this.receiver.cfg.name , '伤害加深buff生效');
        // this.receiver.propComp.addPropertyValue(PropertyId.DEEPENING_DAMAGE , this._config.damageCoefficient);
    }

    onBuffRemove() {

        if (!this.receiver || !this.receiver.cfg) {
            console.log('伤害加深buff结束失败------------');
        }

        console.log(this.receiver?.cfg?.name , '伤害加深buff结束');
        // if (this.receiver) {
        //     this.receiver.propComp.addPropertyValue(PropertyId.DEEPENING_DAMAGE , -this._config.damageCoefficient);
        // }
        super.onBuffRemove();
    }


}