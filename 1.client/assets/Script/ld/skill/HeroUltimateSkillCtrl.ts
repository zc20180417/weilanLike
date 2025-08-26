import { AnniUltimateSkill } from "./skillComps/AnniUltimateSkill";
import { HeroUltimateSkillBase } from "./skillComps/HeroUltimateSkillBase";
import { HuoJianUltimateSkill } from "./skillComps/HuoJianUltimateSkill";
import { JianShengUltimateSkill } from "./skillComps/JianShengUltimateSkill";

export class HeroUltimateSkillCtrl {



    static getUltimateSkill(heroId: number):HeroUltimateSkillBase {
        switch (heroId) {
            case 104:
                return new HuoJianUltimateSkill();
                break;
            case 202:
                return new JianShengUltimateSkill();
                break;
            case 205:
                return new AnniUltimateSkill();
                break;
        }
        return null;
    }








}