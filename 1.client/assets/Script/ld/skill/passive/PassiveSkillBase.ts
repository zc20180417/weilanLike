
import { PassiveSkillConfig } from "../../../common/ConfigInterface";
import Creature from "../../../logic/sceneObjs/Creature";
import { PassiveTriggerBase } from "./passiverTrigger/PassiveTriggerBase";
import { PassiveSkillUtil } from "./PassiveSkillUtil";

export class PassiveSkillBase {

    protected owner:Creature;
    protected cfg:PassiveSkillConfig;
    protected trigger:PassiveTriggerBase;
    protected passiveValue1:number[] ;
    protected passiveValue2:number[] ;
    setData(owner:Creature , cfg:PassiveSkillConfig ) {
        this.owner = owner;
        this.cfg = cfg;
        this.passiveValue1 = cfg.paramValue1 || [];
        this.passiveValue2 = cfg.paramValue2 || [];
        this.trigger = PassiveSkillUtil.createTrigger(cfg.triggerType);
        this.trigger.setData(owner , cfg , this);
    }

    onAdd() {
        this.trigger.onAdd();
    }

    onRemove() {
        this.trigger.onRemove();
    }

    onReset() {
        this.trigger.onReset();
    }

    onTrigger(param?:any) {

    }

    onTriggerStop() {

    }
    
    protected getTarget(enemy?:Creature):Creature | Creature[] {
        return PassiveSkillUtil.getTarget(this.owner , this.cfg.targetType , this.cfg.targetValue , enemy);
    }
}