import Game from "../../Game";
import TroopsMgr from "../../net/mgr/TroopsMgr";
import { GS_TroopsInfo_TroopsInfoItem } from "../../net/proto/DMSG_Plaza_Sub_Troops";
import { StringUtils } from "../../utils/StringUtils";

const { ccclass, property , menu } = cc._decorator;

@ccclass
@menu("Game/ui/equip/TjEquipTips")
export default class TjEquipTips extends cc.Component {

    @property([cc.Label])
    titleLabels:cc.Label[] = [];

    @property([cc.Label])
    infoLabels:cc.Label[] = [];

    @property(cc.Color)
    titleColorNormal:cc.Color = null;
    @property(cc.Color)
    infoColorNormal:cc.Color = null;

    show(towerInfo: GS_TroopsInfo_TroopsInfoItem) {
        this.node.active = true;

        let active:boolean = false;
        let titleLabel:cc.Label;
        let infoLabel:cc.Label;
        for (let i = 0 ; i < 3; i++) {
            const equipId = towerInfo['nequipid' + (i + 1)];
            const equioInfo = Game.towerMgr.getEquipItem(equipId);
            titleLabel = this.titleLabels[i];
            infoLabel = this.infoLabels[i];
            active = false;
            if (equioInfo) {
                titleLabel.string = equioInfo.szname;
                infoLabel.string = StringUtils.format(TroopsMgr.EQUIP_INFO_LIST2[i] , Game.towerMgr.getTowerName(towerInfo.ntroopsid , towerInfo), Math.floor(equioInfo.nlv1addprop / 100));
                active = Game.towerMgr.checkEquipActive(equipId);
            }

            if (active) {
                titleLabel.node.color = this.titleColorNormal;
                infoLabel.node.color = this.infoColorNormal;
            } else {
                titleLabel.node.color = cc.Color.GRAY;
                infoLabel.node.color = cc.Color.GRAY;
            }
        }

    }


    hide() {
        this.node.active = false;
    }
}