import BindSoComp from "../../../logic/comps/ccc/BindSoComp";



const {ccclass, property , menu} = cc._decorator;
@ccclass
@menu("Game/comp/CCCBloodBase")
export class CCCBloodBase extends BindSoComp {

    @property(cc.Sprite)
    blood:cc.Sprite = null;


    refreshBlood(bloodRate:number) {
        this.blood.fillRange = bloodRate;
    }

}