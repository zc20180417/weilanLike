import Game from "../../Game";
import { GS_TroopsStarExtraConfig_TroopsStarExtraLevel } from "../../net/proto/DMSG_Plaza_Sub_Troops";
import BaseItem from "../../utils/ui/BaseItem";
import ImageLoader from "../../utils/ui/ImageLoader";
import { NodeUtils } from "../../utils/ui/NodeUtils";

const { ccclass, property , menu } = cc._decorator;

@ccclass
@menu("Game/tower/TowerInfoScienceItem")
export class TowerInfoScienceItem extends BaseItem {

    @property(ImageLoader)
    ico:ImageLoader = null;

    @property(cc.Label)
    nameLabel:cc.Label = null;

    @property(cc.Node)
    lockNode:cc.Node = null;

    @property(cc.Node)
    icoBg:cc.Node = null;

    @property(cc.Node)
    lockMaskNode:cc.Node = null;



    public setData(data: any, index?: number): void {
        super.setData(data, index);
        if (data) {
            
            const itemData:GS_TroopsStarExtraConfig_TroopsStarExtraLevel = data.data[0];
            const stars = data.star;
            const scienceCfg = Game.strengMgr.getStrengItem(itemData.nstrengthid);
            this.nameLabel.string = Game.towerMgr.getTowerScienceDes(data.troopsId , itemData.ntrooplevel).name;
            this.ico.setPicId(scienceCfg.npicid);
            

            const lock = itemData.ntrooplevel > stars;
            NodeUtils.setNodeGray(this.nameLabel.node , lock);
            NodeUtils.setNodeGray(this.icoBg , lock);
            this.lockNode.active = this.lockMaskNode.active = lock;


        }
    }

}