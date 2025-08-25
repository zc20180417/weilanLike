
import Game from "../../Game";
import { GameEvent } from "../../utils/GameEvent";
import Dialog from "../../utils/ui/Dialog";
import List from "../../utils/ui/List";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("Game/LD/ui/LdHeroHurtView")
export class LdHeroHurtView extends Dialog {

    @property(List)
    list:List = null;


    protected beforeShow(): void {
        const y = (cc.winSize.height >> 1) - 250;
        this.startPos = cc.v2(-100 , y);
        this.endPos.x = -60;
        this.endPos.y = y;
        this.onTimer();
    }

    private onTimer() {
        const campHurtData = Game.ldSkillMgr.getCampHurtData(Game.curLdGameCtrl.getSelfCamp());
        this.list.array = campHurtData.list;
    }

    
}