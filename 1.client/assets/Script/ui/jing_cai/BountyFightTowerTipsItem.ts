
import Game from "../../Game";
import BaseItem from "../../utils/ui/BaseItem";

const { ccclass, property ,menu} = cc._decorator;

@ccclass
@menu("Game/ui/bounty/BountyFightTowerTipsItem")
export default class BountyFightTowerTipsItem extends BaseItem {

    @property(cc.Sprite)
    towericon: cc.Sprite = null;

    @property(cc.SpriteAtlas)
    gameUi: cc.SpriteAtlas = null;

    @property(cc.Label)
    starLab: cc.Label = null;

    setData(data:any , index?:number) {
        super.setData(data , index);
        this.towerRefresh();
    }

    private towerRefresh() {
        if (!this.data) return;
        this.towericon.spriteFrame = this.gameUi.getSpriteFrame(this.data.towerid);
        this.starLab.string = Game.towerMgr.getStar(this.data.towerid) + '';
    }


}
