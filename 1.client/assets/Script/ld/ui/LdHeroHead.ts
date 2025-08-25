import { ECamp } from "../../common/AllEnum";
import { EResPath } from "../../common/EResPath";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { HeadComp } from "../../ui/headPortrait/HeadComp";
import { GameEvent } from "../../utils/GameEvent";
import BaseItem from "../../utils/ui/BaseItem";
import { UiManager } from "../../utils/UiMgr";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("Game/LD/ui/LdHeroHead")
export class LdHeroHead extends BaseItem {

    @property(HeadComp)
    headComp:HeadComp = null;

    @property(cc.Label)
    countLabel:cc.Label = null;

    private _heroId:number = 0;
    setData(data:number, index?: number) {
        super.setData(data, index);
        if (data == null) return;
        this._heroId = data;
        this.headComp.headInfo = {
            nfaceid: this._heroId,
            nfaceframeid: 0,
        }
        this.onActiveStrengthSkill(this._heroId);
        GameEvent.on(EventEnum.LD_STRENGTH_SKILL_CHANGE , this.onActiveStrengthSkill , this);
    }

    private onActiveStrengthSkill(heroId:number , campId:ECamp = ECamp.BLUE) {
        const selfCamp = Game.curLdGameCtrl.getSelfCamp();
        if (this._heroId != heroId || campId !== selfCamp) return;
        const build = Game.curLdGameCtrl.getHeroBuildingCtrl(selfCamp).getHeroBuilding(this._heroId);
        this.countLabel.string = build?.strengthSkillList?.length + '';
    }


    protected onDestroy(): void {
        GameEvent.off(EventEnum.LD_STRENGTH_SKILL_CHANGE , this.onActiveStrengthSkill , this);
    }


    private onClick() {
        if (this._heroId == 0) return;
        const worldPos = this.node.convertToWorldSpaceAR(cc.Vec2.ZERO_R);
        UiManager.showDialog(EResPath.LD_HERO_SKILL_VIEW , {
            worldPos:worldPos,
            heroId:this._heroId,
        })

    }

}