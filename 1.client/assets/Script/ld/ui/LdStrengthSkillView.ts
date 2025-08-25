
import { ECamp } from "../../common/AllEnum";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { GameEvent } from "../../utils/GameEvent";
import { Handler } from "../../utils/Handler";
import BaseItem from "../../utils/ui/BaseItem";
import Dialog from "../../utils/ui/Dialog";
import List from "../../utils/ui/List";
import { LDSkillStrengthBase } from "../skill/LdSkillManager";


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("Game/LD/ui/LdStrengthSkillView")
export class LdStrengthSkillView extends Dialog {

    @property(List)
    list: List = null;

    private _datas:LDSkillStrengthBase[];
    public setData(data: any): void {
        const selfCamp = Game.curLdGameCtrl.getSelfCamp();
        this._datas = Game.curLdGameCtrl.getHeroBuildingCtrl(selfCamp).getReadyStrengthSkills(data);
    }

    protected beforeShow() {
        this.list.setClickHandler(new Handler(this.onItemClick, this))
        this.list.array = this._datas; 
    }

    private onItemClick(item:BaseItem) {
        if (!item || !item.data) return;
        GameEvent.emit(EventEnum.LD_ACTIVE_STRENGTH_SKILL , item.data.heroId , item.data.skillID);
        this.hide(false);
    }

}