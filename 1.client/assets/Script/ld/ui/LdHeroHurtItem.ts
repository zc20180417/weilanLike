import { HeroConfig } from "../../common/ConfigInterface";
import Game from "../../Game";
import { HeadComp } from "../../ui/headPortrait/HeadComp";
import { StringUtils } from "../../utils/StringUtils";
import BaseItem from "../../utils/ui/BaseItem";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("Game/LD/ui/LdHeroHurtItem")
export class LdHeroHurtItem extends BaseItem {

    @property(cc.Label)
    nameLabel:cc.Label = null;

    @property(cc.Label)
    hurtLabel:cc.Label = null;

    @property(HeadComp)
    headComp:HeadComp = null;

    @property(cc.Sprite)
    progressBar:cc.Sprite = null;


    protected onEnable(): void {
        this.schedule(this.onRefresh , 1.0);
    }

    protected onDisable(): void {
        this.unschedule(this.onRefresh);
    }

    private onRefresh() {
        const data = this.data;
        if (!data) return;

        if (!Game.curLdGameCtrl) {
            return;
        }

        this.hurtLabel.string = StringUtils.formatNum(data.hurt);
        this.progressBar.node.stopAllActions();
        cc.tween(this.progressBar).to(0.2 , {fillRange: data.hurt / Game.ldSkillMgr.getCampHurtTotal(Game.curLdGameCtrl.getSelfCamp())}).start();
        // this.progressBar.fillRange = data.hurt / Game.ldSkillMgr.getCampHurtTotal(Game.curLdGameCtrl.getSelfCamp());
    }


    public setData(data: any, index?: number): void {
        super.setData(data , index);
        if (!data) return;

        const heroConfig:HeroConfig = Game.gameConfigMgr.getHeroConfig(data.heroId)
        this.nameLabel.string = heroConfig?.szname;

        this.headComp.headInfo = {
            nfaceid: data.heroId,
            nfaceframeid: 0,
        }
        
        this.onRefresh();
    }


}