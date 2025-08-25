
import { PassiveSkillConfig } from "../../../../common/ConfigInterface";
import Creature from "../../../../logic/sceneObjs/Creature";
import { PassiveSkillBase } from "../PassiveSkillBase";


/**单纯加属性的被动 */
export class PS_AddProperty extends PassiveSkillBase {

    setData(owner:Creature , cfg:PassiveSkillConfig ) {
        super.setData(owner , cfg );
        // this.passiveValue1 = cfg.paramValue1[0] || 0;
    }

    onTrigger(param?:any) {
        let target = this.getTarget(param);
        if (target instanceof Creature) {
            this.addProperty(target);
        } else if (target) {
            target.forEach(element => {
                this.addProperty(element);
            });
        }
    }

    onTriggerStop() {
        let target = this.getTarget();
        if (target instanceof Creature) {
            this.removeProperty(target);
        } else if (target) {
            target.forEach(element => {
                this.removeProperty(element);
            });
        }
    }


    private addProperty(target:Creature) {
        const len = this.cfg.paramValue1.length;
        for (let i = 0; i < len; ++i) {
            console.log("被动技能触发增加属性：" , this.cfg.name , this.cfg.paramValue1[i] , this.passiveValue2);
            target.prop.addPropertyValue(this.cfg.paramValue1[i] , this.passiveValue2[i] , false);

        }
    }

    private removeProperty(target:Creature) {
        const len = this.cfg.paramValue1.length;
        for (let i = 0; i < len; ++i) {
            console.log("被动技移除增加属性：" , this.cfg.name  , this.cfg.paramValue1[i] , this.passiveValue2);
            target.prop.addPropertyValue(this.cfg.paramValue1[i] , -this.passiveValue2[i] , false);

        }
        
    }
}