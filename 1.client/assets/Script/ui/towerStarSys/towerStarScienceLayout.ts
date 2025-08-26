// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseItem from "../../utils/ui/BaseItem";
import TowerStarScienceItem from "./towerStarScienceItem";
import Game from "../../Game";
import { GS_StrengConfig_StrengItem } from "../../net/proto/DMSG_Plaza_Sub_Streng";
import { EventEnum } from "../../common/EventEnum";
import { GameEvent } from "../../utils/GameEvent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TowerStarScienceLayout extends BaseItem {

    @property([TowerStarScienceItem])
    items: TowerStarScienceItem[] = [];

    onLoad() {
        GameEvent.on(EventEnum.SCIENCE_UPGRADE, this.onScienceUpgrade, this);
    }


    onDestroy() {
        GameEvent.targetOff(this);
    }

    private onScienceUpgrade(nid, level, typeId) {
        this.refresh();
    }

    setData(data) {

        super.setData(data);
    }

    refresh() {
        if (!this.data) return;

        let dataLen = this.data.length;
        for (let i = 0, len = this.items.length; i < len; i++) {
            if (i < dataLen) {
                let itemData: GS_StrengConfig_StrengItem = this.data[i] as GS_StrengConfig_StrengItem;
                let scienceData = Game.strengMgr.getStrengData(itemData.nid);
                this.items[i].setData(this.data[i], i);
                scienceData ? this.items[i].setIconNormal() : this.items[i].setIconGray();
            } else {
                this.items[i].setData(null, i);
            }
        }
    }

}
