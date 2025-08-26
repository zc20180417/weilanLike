

import Game from "../../../../Game";
import { EActType } from "../../../../logic/actMach/ActMach";
import { ReleaseSkillData } from "../../LdSkillManager";
import { PassiveSkillBase } from "../PassiveSkillBase";

/**释放技能 */
export class PS_ReleaseSkill extends PassiveSkillBase {


    private _skillReleaseData:ReleaseSkillData;

    onTrigger(param?:any) {
        if (!this._skillReleaseData) {
            this.initSkill();
        }
        let target = this.getTarget(param);
        console.log("被动技能触发释放技能", this._skillReleaseData);
        //被动触发释放技能
        if (this._skillReleaseData) {
            this.owner.changeTo(EActType.ATTACK, this._skillReleaseData)
        }
    }

    private initSkill() {
        this._skillReleaseData = null;
        //被动触发释放技能
        const skillCfg = Game.ldSkillMgr.getSkillCfg(this.passiveValue1[0]);
        if (skillCfg) {
            // this._skill = new SkillData(skillCfg , null , this.passiveValue2);
        }
    }
   

}