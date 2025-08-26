import { EResPath } from "../../common/EResPath";
import Game from "../../Game";
import { GS_TroopsInfo_TroopsInfoItem } from "../../net/proto/DMSG_Plaza_Sub_Troops";
import BaseItem from "../../utils/ui/BaseItem";
import { UiManager } from "../../utils/UiMgr";
import CatDragonBoneUi from "./CatDragonBoneUi";
import TowerStarTitle from "./towerStarTitle";

const { ccclass, property , menu } = cc._decorator;



@ccclass
@menu("Game/tower/TowerMainFightItem")
export default class TowerMainFightItem extends BaseItem {

    @property(CatDragonBoneUi)
    towerIcon: CatDragonBoneUi = null;

    @property(TowerStarTitle)
    towerTitle:TowerStarTitle = null;


    public setData(data: any, index?: number): void {
        super.setData(data, index);
        if (!data) return;

        const info:GS_TroopsInfo_TroopsInfoItem = Game.towerMgr.getTroopBaseInfo(data);
        this.towerTitle.setIndex(info.bttype - 1);
        this.towerIcon.unlock();
        this.towerIcon.setLevel(Game.fashionMgr.getTowerUseFashionInfo(info.ntroopsid) ? 4 : 1);
        this.towerIcon.setDragonUrl(Game.towerMgr.getUiModelUrl(info.ntroopsid, info));
    }

    private onClick() {
        if (this.data) {
            UiManager.showDialog(EResPath.TOWER_STAR_LV_UP_VIEW, { towerInfo: Game.towerMgr.getTroopBaseInfo(this.data) })
        }
    }

}