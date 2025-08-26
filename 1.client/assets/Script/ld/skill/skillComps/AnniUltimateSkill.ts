

import { ECamp } from "../../../common/AllEnum";
import { EventEnum } from "../../../common/EventEnum";
import Game from "../../../Game";
import { SommonObj } from "../../../logic/sceneObjs/SommonObj";
import { GameEvent } from "../../../utils/GameEvent";
import { LDSkillBase, LDSkillStrengthBase } from "../LdSkillManager";
import { HeroUltimateSkillBase } from "./HeroUltimateSkillBase";

//英雄大招控制类
export class AnniUltimateSkill extends HeroUltimateSkillBase {
    
    onActiveSkill(skill:LDSkillStrengthBase) {
        super.onActiveSkill(skill);
        GameEvent.on(EventEnum.LD_SOMMON_BE_BORN , this.onSommonBorn , this);
        GameEvent.emit(EventEnum.LD_TRY_RELEASE_ANNI_ULTIMATE_SKILL , this.heroBuild.maxLevelHeroUid);
    }

    private onSommonBorn(monster:SommonObj) {
        if (monster.ownerHeroUId == this.heroBuild.maxLevelHeroUid) {
            const dy = this.heroBuild.campId == ECamp.RED ? -1 : 1;
            Game.ldSkillMgr.releaseSkill(monster , null ,monster.x , monster.y + dy , this._skill);
        }
    }
   

    disposeUltimateSkill() {
        GameEvent.off(EventEnum.LD_SOMMON_BE_BORN , this.onSommonBorn , this);
        super.disposeUltimateSkill();
    }

}