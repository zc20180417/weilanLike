import Game from "../../Game";
import { GS_TroopsStarExtraConfig_TroopsStarExtraLevel } from "../../net/proto/DMSG_Plaza_Sub_Troops";
import { StringUtils } from "../../utils/StringUtils";
import BaseItem from "../../utils/ui/BaseItem";
import { NodeUtils } from "../../utils/ui/NodeUtils";


const { ccclass, property , menu } = cc._decorator;

@ccclass
@menu("Game/tower/TowerInfoScienceItem2")
export class TowerInfoScienceItem2 extends BaseItem {


    @property(cc.Node)
    bgNode:cc.Node = null;

    @property(cc.Label)
    lvLabel:cc.Label = null;

    @property(cc.RichText)
    desLabel:cc.RichText = null;



    public setData(data: any, index?: number): void {
        super.setData(data, index);
        if (data) {
            const itemData:GS_TroopsStarExtraConfig_TroopsStarExtraLevel = data.data;
            const stars = data.star;

            this.lvLabel.string = `等级 ${itemData.ntrooplevel}`;
             

            const lock = itemData.ntrooplevel > stars;
            NodeUtils.setNodeGray(this.bgNode , lock);
            NodeUtils.setNodeGray(this.lvLabel.node , lock);
            let desStr = Game.towerMgr.getTowerScienceDes(data.troopsId , itemData.ntrooplevel).des;
            if (lock)  {
                desStr = StringUtils.changeFontColor(desStr , '#717171');
                desStr = StringUtils.fontColor(desStr , '#717171');
            }
            this.desLabel.string = desStr;

        }
    }

}