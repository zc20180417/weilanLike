import GlobalVal from "../../../GlobalVal";
import { Monster } from "../../../logic/sceneObjs/Monster";
import { SommonObj } from "../../../logic/sceneObjs/SommonObj";
import { CCCBloodBase } from "./CCCBloodBase";



const {ccclass, property , menu} = cc._decorator;
@ccclass
@menu("Game/comp/SommonBloodComp")
export class SommonBloodComp extends CCCBloodBase {


    @property(cc.Sprite)
    timeProgress:cc.Sprite = null;

    monster:SommonObj;

    onAdd(): void {
        super.onAdd();
    }

    refreshBlood(bloodRate:number) {
        this.blood.fillRange = bloodRate;
        const timeRate = (GlobalVal.now - this.monster.createTime) / (this.monster.lifeTime);
        this.timeProgress.fillRange = 1 - timeRate;
    }

}