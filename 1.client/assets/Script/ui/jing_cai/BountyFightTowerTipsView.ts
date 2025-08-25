
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { GS_BountyData } from "../../net/proto/DMSG_Plaza_Sub_Bounty";
import { GameEvent } from "../../utils/GameEvent";
import Dialog from "../../utils/ui/Dialog";
import BountyFightTowerTipsItem from "./BountyFightTowerTipsItem";

const {ccclass, property , menu} = cc._decorator;

@ccclass
@menu("Game/ui/bounty/BountyFightTowerTipsView")
export default class BountyFightTowerTipsView extends Dialog {

    @property([BountyFightTowerTipsItem])
    itemList:BountyFightTowerTipsItem[] = [];

    private _data:any = null;
    setData(data:any) {
        if (data) {
            this._data = data;
        }
    }


    beforeShow() {
        if (this._data) {
            let tipDatas = this._data.tipDatas;
            let len = this.itemList.length;
            for (let i = 0 ; i < len ; i++) {
                if (tipDatas[i]) {
                    this.itemList[i].node.active = true;
                    this.itemList[i].setData(tipDatas[i]);
                } else {
                    this.itemList[i].node.active = false;
                }
            }
        }
    }   

    onOkClick() {   
        if (this._data) {
            let tipDatas = this._data.tipDatas;
            let len = tipDatas.length;
            let obj:any;

            for (let i = 0 ; i < len ; i++) {
                obj = tipDatas[i];
                Game.bountyMgr.reqOpenGrid(obj.type);
                Game.bountyMgr.reqSetTroops(obj.type , obj.towerid);
            }

            Game.bountyMgr.reqEnterWar(this._data.warid , false);

        }

        this.hide();
    }

    onCancelClick() {
        this.hide();
        GameEvent.emit(EventEnum.BOUNTY_SHOW_FIGHT_TOWER_TIPS);
    }

}
