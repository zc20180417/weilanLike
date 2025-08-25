

import BuffBase from "./BuffBase"

export class TreatBuff extends BuffBase {

    onBuffEffect() {
        console.log('治疗buff生效');

    }

    onBuffRemove() {
        console.log('治疗buff移除');
        super.onBuffRemove();
    }

    protected onHitTimer() {
        // const maxHp = this.receiver.propComp.getPropertyValue(PropertyId.MAX_HP);
        // const addHp = this.config.damageCoefficient * 0.0001 * maxHp;
        // console.log('治疗buff触发，加血：' , addHp);
        // Game.skillMgr.modifyHp(-addHp , this.caster , this.receiver);
    }

}