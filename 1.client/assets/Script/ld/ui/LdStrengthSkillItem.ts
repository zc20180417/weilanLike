
import { HeroConfig } from "../../common/ConfigInterface";
import { EResPath } from "../../common/EResPath";
import Game from "../../Game";
import PrefabLoader from "../../libs/ui/PrefabLoader";
import BaseItem from "../../utils/ui/BaseItem";
import { LDSkillStrengthBase } from "../skill/LdSkillManager";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("Game/LD/ui/LdStrengthSkillItem")
export class LdStrengthSkillItem extends BaseItem {

    @property(cc.Label)
    nameLabel: cc.Label = null;

    @property(cc.RichText)
    desLabel:cc.RichText = null;

    @property(PrefabLoader)
    prefabLoader:PrefabLoader = null;

    @property(cc.Node)
    bgNode:cc.Node = null;

    @property(cc.Sprite)
    bgImg:cc.Sprite = null;

    @property(cc.Node)
    ultimateText:cc.Node = null;

    @property(cc.SpriteFrame)
    ultimateFrame: cc.SpriteFrame = null;
    
    @property(cc.SpriteFrame)
    normalFrame: cc.SpriteFrame = null;

    @property(cc.Color)
    ultimateColor:cc.Color = cc.color(255, 255, 255);

    public setData(data: LDSkillStrengthBase, index?: number): void {
        super.setData(data, index);
        if (!data) return;
        this.nameLabel.string = data.skillName;
        this.desLabel.string = data.des;
        const heroCfg:HeroConfig = Game.gameConfigMgr.getHeroConfig(data.heroId);

        if (this.prefabLoader) this.prefabLoader.url = heroCfg ? EResPath.CREATURE_TOWER + heroCfg.resName : '';
        if (this.bgNode) this.bgNode.color = data.isUltimate ? this.ultimateColor : cc.Color.WHITE;
        if (this.ultimateText) this.ultimateText.active = data.isUltimate == 1;
        if (this.bgImg) this.bgImg.spriteFrame = data.isUltimate ? this.ultimateFrame : this.normalFrame;
    }

    



}