import { ECamp } from "../../common/AllEnum";
import { EventEnum } from "../../common/EventEnum";
import SysMgr from "../../common/SysMgr";
import { GameEvent } from "../../utils/GameEvent";
import { Handler } from "../../utils/Handler";
import LdUiCtrl from "../map/LdUiCtrl";

const { ccclass, property ,menu} = cc._decorator;

@ccclass
@menu("Game/LD/LDCooperateUiCtrl")
export class LDCooperateUiCtrl extends LdUiCtrl {


    protected start() {
        super.start();

    }

    protected otherCampFloatGlod(value:number , campId:ECamp) {
        SysMgr.instance.doOnce(new Handler(this.doAddGold , this , value , campId) , 0.95);
    }

    private doAddGold(value:number , campId:ECamp) {
        GameEvent.emit(EventEnum.ADD_GOLD , value , campId);
    }

}