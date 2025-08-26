
// ... import all other PT_ classes

import { PassiveSkillType, PassiveTriggerType } from "../../../common/AllEnum";
import { PS_AddBuff } from "./passiverSkill/PS_AddBuff";
import { PS_AddProperty } from "./passiverSkill/PS_AddProperty";
import { PS_CreateMonster } from "./passiverSkill/PS_CreateMonster";
import { PS_DeathRecovery } from "./passiverSkill/PS_DeathRecovery";
import { PS_ReleaseSkill } from "./passiverSkill/PS_ReleaseSkill";
import { PS_Sprint } from "./passiverSkill/PS_Sprint";
import { PT_Attack } from "./passiverTrigger/PT_Attack";
import { PT_Cd } from "./passiverTrigger/PT_Cd";
import { PT_ContinueAttack } from "./passiverTrigger/PT_ContinueAttack";
import { PassiveTriggerDefault } from "./passiverTrigger/PT_Default";
import { PT_Hit_OnSommon } from "./passiverTrigger/PT_Hit_OnSommon";
import { PT_HpGreater } from "./passiverTrigger/PT_HpGreater";
import { PT_HpLower } from "./passiverTrigger/PT_HpLower";
import { PT_HpZero } from "./passiverTrigger/PT_HpZero";
import { PT_OnHit } from "./passiverTrigger/PT_OnHit";
import { PT_SelfDie } from "./passiverTrigger/PT_SelfDie";
import { PassiveSkillUtil } from "./PassiveSkillUtil";

export class PassiveSkillRegistry {
    public static registerAll() {
        PassiveSkillUtil.registerTrigger(PassiveTriggerType.DEFAULT, PassiveTriggerDefault);
        PassiveSkillUtil.registerTrigger(PassiveTriggerType.ATTACK, PT_Attack);
        PassiveSkillUtil.registerTrigger(PassiveTriggerType.CONTINUE_ATTACK, PT_ContinueAttack);
        PassiveSkillUtil.registerTrigger(PassiveTriggerType.HIT, PT_OnHit);
        PassiveSkillUtil.registerTrigger(PassiveTriggerType.HP_ZERO, PT_HpZero);
        PassiveSkillUtil.registerTrigger(PassiveTriggerType.SELF_HP_GREATER_THAN, PT_HpGreater);
        PassiveSkillUtil.registerTrigger(PassiveTriggerType.SELF_HP_LOWER_THAN, PT_HpLower);
        PassiveSkillUtil.registerTrigger(PassiveTriggerType.CD_END, PT_Cd);
        PassiveSkillUtil.registerTrigger(PassiveTriggerType.SELF_DIED, PT_SelfDie);
        PassiveSkillUtil.registerTrigger(PassiveTriggerType.HIT_ON_SOMMON, PT_Hit_OnSommon);


        PassiveSkillUtil.registerSkill(PassiveSkillType.ADD_BUFF, PS_AddBuff);
        PassiveSkillUtil.registerSkill(PassiveSkillType.ADD_PROP, PS_AddProperty);
        PassiveSkillUtil.registerSkill(PassiveSkillType.RELEASE_SKILL, PS_ReleaseSkill);
        PassiveSkillUtil.registerSkill(PassiveSkillType.CREATE_MONSTER, PS_CreateMonster);
        PassiveSkillUtil.registerSkill(PassiveSkillType.DEATH_RECOVER, PS_DeathRecovery);
        PassiveSkillUtil.registerSkill(PassiveSkillType.SPRINT, PS_Sprint);

        // ... register all other triggers
    }
}