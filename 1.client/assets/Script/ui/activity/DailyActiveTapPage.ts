// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { BuryingPointMgr, EBuryingPoint } from "../../buryingPoint/BuryingPointMgr";
import { EventEnum } from "../../common/EventEnum";
import SysMgr from "../../common/SysMgr";
import Game from "../../Game";
import { ActiveInfo } from "../../net/mgr/SysActivityMgr";
import { ACTIVE_TYPE } from "../../net/socket/handler/MessageEnum";
import { GameEvent } from "../../utils/GameEvent";
import { Handler } from "../../utils/Handler";
import List from "../../utils/ui/List";
import TogGroup from "../../utils/ui/TogGroup";
import TapPageItem from "../dayInfoView/TapPageItem";


const { ccclass, property } = cc._decorator;

@ccclass
export default class DailyActiveTapPage extends TapPageItem {

    @property(TogGroup)
    togGroup:TogGroup = null;

    @property(List)
    list:List = null;

    private _array:any[] = [];
    private _selectIndex:number = -1;
    start () {
        GameEvent.on(EventEnum.NEW_ACTIVE, this.onNewActive , this);
        GameEvent.on(EventEnum.UPDATE_ACTIVE_DATA, this.activeUpdate, this);
        this.togGroup.node.on('valueChange' , this.onTogChange , this);
        BuryingPointMgr.post(EBuryingPoint.SHOW_DAILY_ACTIVE_VIEW);
    }

    onDestroy() {
        GameEvent.off(EventEnum.NEW_ACTIVE, this.onNewActive , this);
        GameEvent.off(EventEnum.UPDATE_ACTIVE_DATA, this.activeUpdate, this);
        Handler.dispose(this);
    }

    private onTogChange(flag:string) {
        let index = Number(flag) - 1;
        this._selectIndex = index;
        this.list.array = this._array[index];
    }


    public refresh() {
        this.refresh2();
        if (this._selectIndex != -1) return;
        if (!Game.sysActivityMgr.isActivityFinishedByClientParam(ACTIVE_TYPE.DAILY_ZHADANREN)) {
            this.togGroup.selectedFlag = '3';
            // this.onTogChange('3');
        } else if (!Game.sysActivityMgr.isActivityFinishedByClientParam(ACTIVE_TYPE.DAILY_GANGTIEXIA)) {
            // this.onTogChange('2');
            this.togGroup.selectedFlag = '2';
        } else {
            this.togGroup.selectedFlag = '1';
            // this.onTogChange('1');
        }

    }

    private refresh2() {
        this._array.length = 0;

        let dataList3 = Game.sysActivityMgr.getActivityListByClientParam(ACTIVE_TYPE.DAILY_ZHADANREN);
        let dataList2 = Game.sysActivityMgr.getActivityListByClientParam(ACTIVE_TYPE.DAILY_LEISHEN);
        let dataList1 = Game.sysActivityMgr.getActivityListByClientParam(ACTIVE_TYPE.DAILY_GANGTIEXIA);

        this._array.push(dataList1);
        this._array.push(dataList2);
        this._array.push(dataList3);

        for (let i = 0 ; i < 3 ; i++) {
            let flag = this._array[i] && this._array[i].length > 0;
            this.togGroup.toggles[i].active = flag
            if (flag) {
                this.togGroup.titleLabels[i].string = this.getTogName(this._array[i]);
                this._array[i].sort(this.sortList);
            }
        }  

        if (this._selectIndex != -1) {
            this.list.array = this._array[this._selectIndex];
        }
    }

    private onNewActive() {
        SysMgr.instance.callLater(Handler.create(this.refresh2 , this) , true);
    }

    private activeUpdate() {
        SysMgr.instance.callLater(Handler.create(this.refresh2 , this) , true);
    }

    private getTogName(data:ActiveInfo[]):string {
        if (!data || data.length == 0) return '';
        let item = data[0];
        let taskItem = item.taskList[0];
        //�������
        let chargeCfg = Game.actorMgr.getChargeConifg(taskItem.nparam1);
        if (chargeCfg) {
            let goodsInfo = Game.goodsMgr.getGoodsInfo(chargeCfg.ngoodsid);
            if (goodsInfo && Game.goodsMgr.isCard(chargeCfg.ngoodsid , goodsInfo)) {
                let towerInfo = Game.towerMgr.getTroopBaseInfo(goodsInfo.lparam[0]);
                if (towerInfo) {
                    return towerInfo.szname;
                }
            }
        }

        return '';
    }

    private sortList(a , b):number {
        let flagA = Game.sysActivityMgr.isSubTaskFinished(a.item.nid, a.taskList[0].btindex);
        let flagB = Game.sysActivityMgr.isSubTaskFinished(b.item.nid, b.taskList[0].btindex);
        if (flagA != flagB) {
            if (flagA) {
                return 1;
            }

            if (flagB) {
                return -1;
            }
        }

        return a.item.nid - b.item.nid;
    }
}
