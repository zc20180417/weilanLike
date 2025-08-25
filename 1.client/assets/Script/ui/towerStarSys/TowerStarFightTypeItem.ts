import { EResPath } from "../../common/EResPath";
import Game from "../../Game";
import BaseItem from "../../utils/ui/BaseItem";
import CatDragonBoneUi from "./CatDragonBoneUi";
import TowerStarTitle from "./towerStarTitle";

const { ccclass, property , menu } = cc._decorator;

@ccclass
@menu("Game/tower/TowerStarFightTypeItem")
export class TowerStarFightTypeItem extends BaseItem {

    @property(CatDragonBoneUi)
    heroHeadImg:CatDragonBoneUi = null;

    @property(cc.SpriteAtlas)
    headAtlas:cc.SpriteAtlas = null;

    @property(TowerStarTitle)
    towerTitle:TowerStarTitle = null;

    @property(cc.Node)
    shadow:cc.Node = null;

    public setData(data: number, index?: number): void {
        super.setData(data , index);
        if (data) {
            this.towerTitle.setIndex(data - 1);
            const towerId = Game.towerMgr.getTempFightByType(data);
            if (towerId > 0) {
                const info = Game.towerMgr.getTroopBaseInfo(towerId);
                // this.heroHeadImg.node.opacity = 255;
                this.heroHeadImg.node.active = true;
                this.heroHeadImg.unlock();
                this.heroHeadImg.setLevel(Game.fashionMgr.getTowerUseFashionInfo(towerId) ? 4 : 1);
                this.heroHeadImg.setDragonUrl(Game.towerMgr.getUiModelUrl(towerId, info));
                this.shadow.active = false;
            } else {
                this.heroHeadImg.node.active = false;
                this.shadow.active = true;
            }
        }
    }

}