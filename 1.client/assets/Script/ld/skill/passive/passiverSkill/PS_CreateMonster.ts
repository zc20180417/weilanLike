import { PropertyId } from "../../../../common/AllEnum";
import { MonsterConfig } from "../../../../common/ConfigInterface";
import Debug, { TAG } from "../../../../debug";
import Game from "../../../../Game";
import { EComponentType } from "../../../../logic/comps/AllComp";
import { Monster } from "../../../../logic/sceneObjs/Monster";
import { PassiveSkillBase } from "../PassiveSkillBase";

export class PS_CreateMonster extends PassiveSkillBase {

    onTrigger(param?:any) {
        let cfg: MonsterConfig = Game.monsterManualMgr.getMonsterCfg(this.passiveValue1[0]);
        if (!cfg) return Debug.log(TAG.SKILL ,  "PS_CreateMonster onTrigger cfg is null");
        const y = this.owner.y;
        const x = this.owner.x;
        let startX = x;
        let endX = x;
        let wid = cfg.hitWid * (cfg.uscale > 0 ? cfg.uscale / 1000 : 1);

        const count = this.passiveValue2[0];
        const bloodRate = this.owner.prop.getPropertyValue(PropertyId.CUR_HP_RATIO);
        if (count > 1) {
            const [minX , maxX] = Game.curLdGameCtrl.getEmptySpace(x , y , this.owner.camp);
            endX = maxX;
            startX = Math.max(minX , -(wid * (count - 1)) * 0.5 + x);
        }

        for (let i = 0 ; i < count ; i++) {
            const monster = Game.soMgr.createMonster(this.passiveValue1[0] , bloodRate , 0 , this.owner.camp);
            monster.setPosNow(Math.min(startX + i * wid , endX) , y);
            monster.coinRatio = (this.owner as Monster).coinRatio;
            monster.getAddComponent(EComponentType.MONSTER_AUTO);
            Debug.log(TAG.SKILL ,  "PS_CreateMonster onTrigger create monster:" , monster.x , monster.y);
        }
    }

    
}