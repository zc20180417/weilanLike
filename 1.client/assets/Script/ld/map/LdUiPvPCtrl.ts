import { ECamp } from "../../common/AllEnum";
import { EventEnum } from "../../common/EventEnum";
import SysMgr from "../../common/SysMgr";
import { GameEvent } from "../../utils/GameEvent";
import { Handler } from "../../utils/Handler";
import LdUiCtrl from "./LdUiCtrl";

const { ccclass, property ,menu} = cc._decorator;

@ccclass
@menu("Game/LD/LdUiPvPCtrl")
export class LdUiPvPCtrl extends LdUiCtrl {

    @property(cc.Label)
    bloodRedLabel:cc.Label = null;

    @property(cc.ProgressBar)
    bloodRedProgress:cc.ProgressBar = null;


    protected start() {
        super.start();
        GameEvent.on(EventEnum.LD_RED_MAP_HP_CHANGE , this.onMapRedHpChange , this);
    }

    private onMapRedHpChange(hp:number , maxHp:number) {
        this.bloodRedLabel.string = hp.toString();
        hp = Math.max(hp , 0);
        this.bloodRedProgress.progress = hp / maxHp;
    }

    protected otherCampFloatGlod(value:number , campId:ECamp) {
        SysMgr.instance.doOnce(new Handler(this.doAddGold , this , value , campId) , 0.95);
    }

    private doAddGold(value:number , campId:ECamp) {
        GameEvent.emit(EventEnum.ADD_GOLD , value , campId);
    }

}