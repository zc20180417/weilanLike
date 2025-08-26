

import { BuffType, CreatureState, PropertyId } from "../../../../common/AllEnum";
import { EventEnum } from "../../../../common/EventEnum";
import Game from "../../../../Game";
import { EComponentType } from "../../../../logic/comps/AllComp";
import { Monster } from "../../../../logic/sceneObjs/Monster";
import { HeroTable } from "../../../tower/HeroTable";
import BuffContainerComp from "../../buff/BuffContainerComp";
import { PassiveSkillBase } from "../PassiveSkillBase";

/**冲刺 */
export class PS_Sprint extends PassiveSkillBase {

    onTrigger(param?:any) {
        this.owner.modifyState(CreatureState.SPRINT , true);

        this.owner.prop.addPropertyRatioValue(PropertyId.SPEED , 1.0);
        this.owner.on(EventEnum.CREATURE_STATE_CHANGE , this.onStateChange , this);
        this.owner.on(EventEnum.LD_SPRINIT_CW , this.onSprintEnd , this);

    }

    onRemove(): void {
        this.breakSprint();
    }

    private onStateChange() {
        if (this.owner.inState(CreatureState.CTRL)) {
            this.breakSprint();
        }
    }

    private breakSprint() {
        this.owner.modifyState(CreatureState.SPRINT , false);
        this.owner.off(EventEnum.CREATURE_STATE_CHANGE , this.onStateChange , this);
        this.owner.off(EventEnum.LD_SPRINIT_CW , this.onSprintEnd , this);
        this.owner.prop.addPropertyRatioValue(PropertyId.SPEED , -1.0);
        const buffComp:BuffContainerComp = this.owner.getAddComponent(EComponentType.BUFF);
        if (buffComp) {
            buffComp.removeBuffByType(BuffType.IMMUNE_CTRL);
        }
    }


    private onSprintEnd(target:HeroTable | Monster) {

        this.breakSprint();

        //给城墙造成伤害
        Game.ldSkillMgr.damageHeroTable(target , this.passiveValue2[0] , 1.0 , 0 , true , this.owner.id);

        //默认第一个是眩晕buff
        const buffComp:BuffContainerComp = this.owner.getAddComponent(EComponentType.BUFF);
        buffComp.addBuff(this.passiveValue1[0] , 0 , 0);
        
        // const heroTable = Game.curLdGameCtrl.getHeroTable()

        


    }

}