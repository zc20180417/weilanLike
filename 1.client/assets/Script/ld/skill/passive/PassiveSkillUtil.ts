



import { PassiveSkillType, PassiveTargetType, PassiveTriggerType } from "../../../common/AllEnum";
import Creature from "../../../logic/sceneObjs/Creature";
import { PassiveTriggerBase } from "./passiverTrigger/PassiveTriggerBase";
import { PassiveSkillBase } from "./PassiveSkillBase";

type TriggerClass = new () => PassiveTriggerBase;
const triggerMap = new Map<PassiveTriggerType, TriggerClass>();
type SkillClass = new () => PassiveSkillBase;
const skillMap = new Map<PassiveSkillType, SkillClass>();



export class PassiveSkillUtil {

    static registerTrigger(type: PassiveTriggerType, triggerClass: TriggerClass) {
        if (triggerMap.has(type)) {
            console.warn(`PassiveTriggerType ${type} has been registered.`);
            return;
        }
        triggerMap.set(type, triggerClass);
    }

    static registerSkill(type: PassiveSkillType, skillClass: SkillClass) {
        if (skillMap.has(type)) {
            console.warn(`PassiveSkillType ${type} has been registered.`);
            return;
        }
        skillMap.set(type, skillClass);
    }

    static createTrigger(type: PassiveTriggerType): PassiveTriggerBase {
        const Trigger = triggerMap.get(type);
        if (Trigger) {
            return new Trigger();
        }
        // 如果没有找到特定的触发器，可以返回一个默认的或者抛出错误
        console.warn(`No trigger found for type: ${type}, using default.`);
        const DefaultTrigger = triggerMap.get(PassiveTriggerType.DEFAULT);
        return DefaultTrigger ? new DefaultTrigger() : null;
    }

    static createSkill(type: PassiveSkillType): PassiveSkillBase {
        const Skill = skillMap.get(type);
        if (Skill) {
            return new Skill();
        }
        // 如果没有找到特定的技能，可以返回一个默认的或者抛出错误
        console.warn(`No skill found for type: ${type}, using default.`);
        const DefaultSkill = skillMap.get(PassiveSkillType.ADD_BUFF);
        return DefaultSkill ? new DefaultSkill() : null;
    }


    static getTarget(owner: Creature, targetType: number, targetValue: number, enemy?: Creature): Creature | Creature[] {
        switch (targetType) {
            case PassiveTargetType.SELF:
                return owner;
            case PassiveTargetType.SELF_CAMP_HERO:
                // return this.getSelfCampHeros(owner , targetValue);
            case PassiveTargetType.ENEMY:
                // if (!enemy || owner.camp == enemy.camp) {
                //     return owner.soMgr.findTarget(owner.x , owner.y , owner.camp , SkillTargetType.CLOSEST_TARGET);
                // }
                return enemy;
                break;
        
            default:
                break;
        }
        return null;
    }
}



// export class PassiveSkillUtil {

//     static createTrigger(triggerType:number):PassiveTriggerBase {
//         let trigger:PassiveTriggerBase;
//         switch (triggerType) {
//             case PassiveTriggerType.DEFAULT:
//                 trigger = new PassiveTriggerDefault();
//                 break;
//             case PassiveTriggerType.ATTACK:
//                 trigger = new PT_Attack();
//                 break;
//             case PassiveTriggerType.CONTINUE_ATTACK:
//                 trigger = new PT_ContinueAttack();
//                 break;
//             case PassiveTriggerType.HIT:
//                 trigger = new PT_OnHit();
//                 break;
//             case PassiveTriggerType.HP_ZERO:
//                 trigger = new PT_HpZero();
//                 break;
//             case PassiveTriggerType.SELF_HP_GREATER_THAN:
//                 trigger = new PT_HpGreater();
//                 break;
//             case PassiveTriggerType.SELF_HP_LOWER_THAN:
//                 trigger = new PT_HpLower();
//                 break;
//             case PassiveTriggerType.CD_END:
//                 trigger = new PT_Cd();
//                 break;
//             case PassiveTriggerType.SELF_DIED:
//                 trigger = new PT_SelfDie();
//                 break;
//             default:
//                 break;
//         }
//         return trigger;
//     }

//     static createSkill(passiveType:number):PassiveSkillBase {
//         let skill:PassiveSkillBase;
//         switch (passiveType) {
//             case PassiveSkillType.ADD_BUFF:
//                 skill = new PS_AddBuff();
//                 break;
//             case PassiveSkillType.ADD_PROP:
//                 skill = new PS_AddProperty();
//                 break;
//             case PassiveSkillType.RELEASE_SKILL:
//                 skill = new PS_ReleaseSkill();
//                 break;        
//             default:
//                 break;
//         }

//         return skill;
//     }


//     static getTarget(owner:Creature , targetType:number , targetValue:number ,enemy?:Creature):Creature | Creature[] {
//         switch (targetType) {
//             case PassiveTargetType.SELF:
//                 return owner;
//             case PassiveTargetType.SELF_CAMP_HERO:
//                 // return this.getSelfCampHeros(owner , targetValue);
//             case PassiveTargetType.ENEMY:
//                 // if (!enemy || owner.camp == enemy.camp) {
//                 //     return owner.soMgr.findTarget(owner.x , owner.y , owner.camp , SkillTargetType.CLOSEST_TARGET);
//                 // }
//                 return enemy;
//                 break;
        
//             default:
//                 break;
//         }
//     }


    





// }