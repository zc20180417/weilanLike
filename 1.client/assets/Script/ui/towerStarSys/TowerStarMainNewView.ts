import { BuryingPointMgr, EBuryingPoint } from "../../buryingPoint/BuryingPointMgr";
import { EResPath } from "../../common/EResPath";
import { EventEnum } from "../../common/EventEnum";
import SysMgr from "../../common/SysMgr";
import Game from "../../Game";
import { GS_TroopsInfo_TroopsInfoItem } from "../../net/proto/DMSG_Plaza_Sub_Troops";
import { GameEvent } from "../../utils/GameEvent";
import { Handler } from "../../utils/Handler";
import Dialog from "../../utils/ui/Dialog";
import GroupImage from "../../utils/ui/GroupImage";
import List from "../../utils/ui/List";
import TogGroup from "../../utils/ui/TogGroup";
import { UiManager } from "../../utils/UiMgr";
import TowerMainFightItem from "./TowerMainFightItem";

const { ccclass, property , menu } = cc._decorator;

@ccclass
@menu("Game/tower/TowerStarMainNewView")
export default class TowerStarMainNewView extends Dialog {

    @property(List)
    list:List = null;

    @property(TogGroup)
    toggleContainer:TogGroup = null;

    @property(cc.Toggle)
    toggle:cc.Toggle = null;

    @property([TowerMainFightItem])
    fightItems:TowerMainFightItem[] = [];
    

    @property(GroupImage)
    bpLabel:GroupImage = null;

    // @property(cc.Widget)
    // leftWid:cc.Widget = null;

    _currPageIndex: number = 0;
    private _data: GS_TroopsInfo_TroopsInfoItem[][] = null;
    public setData(data: any) {
        this._currPageIndex = 0;
        if (data != undefined && data != null) {
            this._currPageIndex = data;
        }
    }

    protected addEvent(): void {
        this.toggleContainer.node.on("valueChange", this.onTogGroupValueChanged, this);
        GameEvent.on(EventEnum.UNLOCK_NEW_TOWER , this.onUnLockNewTower , this);
        GameEvent.on(EventEnum.ACTIVATE_TOWER , this.onActiveTower , this);
    }

    protected beforeShow() {
        // if (cc.winSize.width / cc.winSize.height > 1.79) {
        //     this.leftWid.left = 40;
        // }

        this._data = Game.towerMgr.getTowerStarPageData();
        this.toggleContainer.selectedIndex = this._currPageIndex;
        
        this.refreshFights();
        BuryingPointMgr.post(EBuryingPoint.SHOW_TOWER_VIEW);
    }

    private onUnLockNewTower() {
        this.refreshList();
    }

    private onActiveTower() {
        this.refreshList();
        this.refreshFights();
    }

    private onTogGroupValueChanged(flag:string) {
        let index = Number(flag);
        this._currPageIndex = index;
        SysMgr.instance.doFrameOnce(Handler.create(this.refreshList , this) , 1 , true);
        // this.refreshList(index);   
    }

    private onEditFightClick() {
        UiManager.showDialog(EResPath.TOWER_STAR_FIGHT_VIEW);
    }

    private refreshFights() {
        const ids = Game.towerMgr.getFightTowers();
        // return;
        this.fightItems.forEach((element , index) => {
            element.setData(ids[index] , index);
        });

        this.bpLabel.contentStr = Game.towerMgr.getAllFightTowerPower().toString();
    }

    private refreshList() {
        let index = this._currPageIndex;
        let datas:GS_TroopsInfo_TroopsInfoItem[] = [];
        if (index == 0) {
            this._data.forEach(element => {
                datas = datas.concat(element);
            });

            this.toggleContainer.toggles.forEach(element => {
                const toggle = element.getComponent(cc.Toggle);
                toggle.checkMark.node.active = true;
            });

        } else {
            datas = this._data[index - 1];

            this.toggleContainer.toggles.forEach((element , index2) => {
                if (index2 !== index ) {
                    const toggle = element.getComponent(cc.Toggle);
                    toggle.checkMark.node.active = false;
                }
            });

        }
        this.sortData(datas);
        this.list.array = datas;
        this.list.setStartIndex(0);
    }

    private sortData(datas:GS_TroopsInfo_TroopsInfoItem[]) {
        return datas.sort((a, b) => {
            const afight = Game.towerMgr.isTowerActive(a.ntroopsid);
            const bfight = Game.towerMgr.isTowerActive(b.ntroopsid);

            if (afight && !bfight) return -1;
            else if (!afight && bfight) return 1;

            const alock = Game.towerMgr.isTowerUnlock(a.ntroopsid);
            const block = Game.towerMgr.isTowerUnlock(b.ntroopsid);

            if (alock && !block) return -1;
            else if (!alock && block) return 1;

            if (a.btquality < b.btquality) return 1;
            else if (a.btquality > b.btquality) return -1;

            if (a.bttype != b.bttype) return a.bttype - b.bttype;
            if (a.ntroopsid != b.ntroopsid) return a.ntroopsid - b.ntroopsid;

            return 0;
        });
    }

}