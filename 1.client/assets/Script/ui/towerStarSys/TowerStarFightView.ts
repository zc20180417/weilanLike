import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { GS_TroopsInfo_TroopsInfoItem } from "../../net/proto/DMSG_Plaza_Sub_Troops";
import { GameEvent } from "../../utils/GameEvent";
import SystemTipsMgr from "../../utils/SystemTipsMgr";
import Dialog from "../../utils/ui/Dialog";
import List from "../../utils/ui/List";

const { ccclass, property , menu } = cc._decorator;

@ccclass
@menu("Game/tower/TowerStarFightView")
export class TowerStarFightView extends Dialog {

    @property(List)
    typeList:List = null;

    @property(List)
    towerList:List = null;

    @property(cc.Label)
    btnLabel:cc.Label = null;

    @property(cc.Widget)
    leftWid:cc.Widget = null;

    private _up:boolean = false;

    protected addEvent(): void {
        GameEvent.on(EventEnum.TROOPS_TEMP_FIGHT_CHANGE , this.onFightChange , this);
        GameEvent.on(EventEnum.ACTIVATE_TOWER , this.onActiveTower , this);
    }

    protected beforeShow(): void {
        if (cc.winSize.width / cc.winSize.height > 1.79) {
            this.leftWid.left = 40;
        }

        Game.towerMgr.initTempFightTroops();
        this.refreshTypeList();
        this.refreshTowerList();

    }

    private onActiveTower() {
        if (this._sendSave) {
            SystemTipsMgr.instance.notice('保存阵容成功');
            this._sendSave = false; 
        }
    }

    private onFightChange() {
        
        this.refreshTypeList();
        this.refreshTowerList();
    }

    private _sendSave:boolean = false;
    private onSaveClick() {
        this._sendSave = true;
        Game.towerMgr.saveTempFightTroops();
    }

    private onOneKeyClick() {
        if (this._up) {
            Game.towerMgr.oneKeySetTempFightTroops();
        } else {
            Game.towerMgr.oneKeyRemoveTempFightTroops();
        }
    }

    private refreshTypeList() {
        // const fightTowerIds = Game.towerMgr.getFightTowers();
        // const datas:{id:number , type:number}[] = [];

        // fightTowerIds.forEach((element , index) => {
        //     datas.push({id:element , type:index + 1});
        // });
        this.typeList.array = [1 , 2 , 3 , 4 , 5 , 6, 7];
    }

    private refreshTowerList() {
        let data = Game.towerMgr.getTowerStarPageData();
        let towerTypes:GS_TroopsInfo_TroopsInfoItem[][] = [];
        data.forEach((element , index) => {
            towerTypes[index] = [];

            element.forEach(element2 => {
                if (Game.towerMgr.isTowerUnlock(element2.ntroopsid)) {
                    towerTypes[index].push(element2);
                }
            });

            if (towerTypes[index].length > 1) {
                this.sortData(towerTypes[index]);
            }
        });

        let datas:GS_TroopsInfo_TroopsInfoItem[] = [];
        const len = towerTypes.length;


        for (let j = 0 ; j < 5 ; j++) {
            for (let i = 0; i < len; i++) {
                if (j < towerTypes[i].length) {
                    datas.push(towerTypes[i][j]);
                } else {
                    datas.push(null);
                }
            }
        }

        const len2 = datas.length;
        let index = 0;
        for (let i = len2 - 1; i >= 0 ; i--) {
            if (datas[i] != null) {
                index = i;
                break;
            }
        }
        datas.splice(index + 1);


        this.towerList.array = datas;
        this.checkUp();
    }

    private checkUp() {
        this._up = Game.towerMgr.checkOneKeySetTempFightTroops();
        this.btnLabel.string = this._up ? '一键上阵' : '一键下阵';
    }

    private sortData(datas:GS_TroopsInfo_TroopsInfoItem[]) {
        return datas.sort((a, b) => {
            
            if (a.btquality < b.btquality) return 1;
            else if (a.btquality > b.btquality) return -1;

            if (a.bttype != b.bttype) return a.bttype - b.bttype;
            if (a.ntroopsid != b.ntroopsid) return a.ntroopsid - b.ntroopsid;

            return 0;
        });
    }

}