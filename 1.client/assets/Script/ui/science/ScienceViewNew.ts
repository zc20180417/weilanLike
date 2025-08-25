import { BuryingPointMgr, EBuryingPoint } from "../../buryingPoint/BuryingPointMgr";
import { TowerTypeName } from "../../common/AllEnum";
import { EResPath } from "../../common/EResPath";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { EVENT_REDPOINT } from "../../redPoint/RedPointSys";
import { GameEvent } from "../../utils/GameEvent";
import Dialog from "../../utils/ui/Dialog";
import { UiManager } from "../../utils/UiMgr";
import { ScienceTowerItem } from "./ScienceTowerItem";

const { ccclass, menu, property } = cc._decorator;

@ccclass
@menu("Game/ui/science/ScienceViewNew")

export class ScienceViewNew extends Dialog {


    @property([ScienceTowerItem])
    itemList: ScienceTowerItem[] = [];


    protected addEvent(): void {
        GameEvent.on(EventEnum.SCIENCE_UPGRADE, this.onScienceUpgrade, this);
        GameEvent.on(EventEnum.SCIENCE_RESET, this.onScienceReset, this);
    }

    protected beforeShow() {
        let len = this.itemList.length;
        for (let i = 0; i < len; i++) {
            this.itemList[i].setData({ type: TowerTypeName[i], activeCount: Game.strengMgr.getActivityCount(i + 1), max: Game.strengMgr.getStrengItemCount(i + 1) });
        }
        BuryingPointMgr.post(EBuryingPoint.SHARE_SCIENCE_VIEW);
        this.registerRedPoint();
    }

    protected afterHide(): void {
        this.unregisterRedPoint();
    }

    private onScienceUpgrade(id: number, level: number, rolecardtype: number) {
        this.onScienceReset(rolecardtype);
    }

    private onScienceReset(type: number) {
        if (this.itemList[type - 1]) {
            this.itemList[type - 1].refresh(Game.strengMgr.getActivityCount(type), Game.strengMgr.getStrengItemCount(type));
        }
    }

    onTypeClick(e: any, param: string) {
        UiManager.showDialog(EResPath.SCIENCE_TYPE_VIEW, Number(param));
    }

    private registerRedPoint() {
        for (let i = 0, len = this.itemList.length; i < len; i++) {
            Game.redPointSys.registerRedPoint(EVENT_REDPOINT.SCIENCE + "-" + (i + 1), this.itemList[i].node);
        }
    }

    private unregisterRedPoint() {
        for (let i = 0, len = this.itemList.length; i < len; i++) {
            Game.redPointSys.unregisterRedPoint(EVENT_REDPOINT.SCIENCE + "-" + (i + 1), this.itemList[i].node);
        }
    }

}