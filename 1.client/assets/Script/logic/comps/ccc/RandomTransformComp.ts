import { EventEnum } from "../../../common/EventEnum";
import Game from "../../../Game";
import { MathUtils } from "../../../utils/MathUtils";
import { StringUtils } from "../../../utils/StringUtils";
import Creature from "../../sceneObjs/Creature";
import BindSoComp from "./BindSoComp";


/**
 * 随机变身怪
 */
const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("Game/comp/RandomTransformComp")
export class RandomTransformComp extends BindSoComp {

    @property({
        type:[cc.Integer],
        tooltip:"要变身的怪物数组"
    })
    monsterIds:number[] = [];

    @property({
        tooltip:"血量百分比"
    })
    bloodRate:number = 0;

    @property({
        tooltip:"变身特效"
    })
    effectName:string = "";


    onAdd() {

        this.owner.on(EventEnum.REFRESH_BLOOD , this.refreshBlood , this);
    }

    onRemove() {
        if (this.refreshBlood , this) {
            this.owner.off(EventEnum.REFRESH_BLOOD , this.refreshBlood , this);
        }
    }

    private refreshBlood(value:number, bloodTotal:number) {
        let rate = value / bloodTotal;
        if (rate <= this.bloodRate) {
            this.changeModel();
            
        }
    }

    private changeModel() {
        if (!this.owner) return;
        this.owner.off(EventEnum.REFRESH_BLOOD , this.refreshBlood , this);
        if (!StringUtils.isNilOrEmpty(this.effectName)) {
            Game.soMgr.createEffect(this.effectName , this.owner.x , this.owner.y , false);
        }

        

        let exMonsterID:number = MathUtils.randomGetItemByList(this.monsterIds);
        Game.soMgr.changeMonsterModel(this.owner as Creature, exMonsterID);
    }


}