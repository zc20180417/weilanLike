
import SysMgr from "../../../common/SysMgr";
import Game from "../../../Game";
import { HeroBuilding } from "../../tower/HeroBuilding";
import { LDSkillBase, LDSkillStrengthBase } from "../LdSkillManager";

//英雄大招控制类
export class HeroUltimateSkillBase {
    protected _heroId:number;
    protected _skill:LDSkillBase;
    heroBuild:HeroBuilding;

    onActiveSkill(skill:LDSkillStrengthBase) {
        this._heroId = skill.heroId;
        if (skill.ultimateSkillId > 0) {
            this._skill = Game.ldSkillMgr.getSkillCfg(skill.ultimateSkillId);
            if (!this._skill) return;
        }
    }

    getSkill():LDSkillBase {
        return this._skill;
    }

    protected doReleaseSkill() {
        
    }

    disposeUltimateSkill() {
        this._skill = null;
        SysMgr.instance.clearTimerByTarget(this);
    }

}