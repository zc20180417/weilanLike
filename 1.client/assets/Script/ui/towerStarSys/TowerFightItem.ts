import Game from "../../Game";
import BaseItem from "../../utils/ui/BaseItem";

const { ccclass, property , menu } = cc._decorator;

@ccclass
@menu("Game/tower/TowerFightItem")
export class TowerFightItem extends BaseItem {

    @property(cc.Sprite)
    headImg:cc.Sprite = null;


    @property(cc.SpriteAtlas)
    headAtlas:cc.SpriteAtlas = null;

    @property([cc.Node])
    selectNode:cc.Node[] = [];

    @property(cc.Label)
    starLabel:cc.Label = null;

    public setData(data: any, index?: number): void {
        super.setData(data, index);
        if (data) {
            this.headImg.spriteFrame = this.headAtlas.getSpriteFrame(Game.towerMgr.getFashionHeadName(data.ntroopsid));
            const isFight = Game.towerMgr.isTowerTempFight(data.ntroopsid);
            this.selectNode.forEach(element => {
                element.active = isFight;
            });

            this.starLabel.string = Game.towerMgr.getTroopData(data.ntroopsid).nstarlevel.toString();
        }
    }

    onItemClick() {
        if (this.data && !Game.towerMgr.isTowerTempFight(this.data.ntroopsid)) {
            Game.towerMgr.setTowerTempFight(this.data.ntroopsid);
        }
    }

}