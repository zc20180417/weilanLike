
import SysMgr from "../../../common/SysMgr";
import Game from "../../../Game";
import { EActType } from "../../../logic/actMach/ActMach";
import { Tower } from "../../../logic/sceneObjs/Tower";
import { Handler } from "../../../utils/Handler";
import { LDSkillStrengthBase } from "../LdSkillManager";
import { HeroUltimateSkillBase } from "./HeroUltimateSkillBase";

export class JianShengUltimateSkill extends HeroUltimateSkillBase {


    onActiveSkill(skill: LDSkillStrengthBase): void {
        super.onActiveSkill(skill);
        if (!this._skill) return;
        this.doReleaseSkill();
    }


    protected doReleaseSkill() {
        const maxLevelHeroUid = this.heroBuild.maxLevelHeroUid;
        if (maxLevelHeroUid == 0) return;
        let hero:Tower = Game.soMgr.getTowerByGuid(maxLevelHeroUid);
        if (!hero || hero.isInAct(EActType.ATTACK)) return this.startCheckReleaseSkill();
        const target = Game.soMgr.findTarget(hero.pos , this._skill.range , this._skill.findTargetType , this.heroBuild.campId);
        if (!target) return this.startCheckReleaseSkill();
        this.stopCheckReleaseSkill();
        Game.ldSkillMgr.releaseSkill(hero, target , target.x , target.y , this._skill);
        SysMgr.instance.doOnce(Handler.create(this.doReleaseSkill , this) , this._skill.cd);

    }

    private startCheckReleaseSkill() {
        SysMgr.instance.doLoop(Handler.create(this.doReleaseSkill , this) , 0 ,  30);
    }

    private stopCheckReleaseSkill() {
        SysMgr.instance.clearTimer(Handler.create(this.doReleaseSkill , this));
    }

    
}