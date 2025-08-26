import { ECamp } from "../../common/AllEnum";
import { MonsterBoxConfig } from "../../common/ConfigInterface";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { SoType } from "../../logic/sceneObjs/SoType";
import { GameEvent } from "../../utils/GameEvent";
import { LDBaseGameCtrl } from "../LDBaseGameCtrl";
import { LdMapCtrl } from "../map/LdMapCtrl";
import { LDCreateMonsterCtrl } from "../monster/LDCreateMonsterCtrl";
import { LDCooperateCreateTimeLine } from "./LDCooperateCreateTimeLine";

export class LDCooperateCreateMonsterCtrl extends LDCreateMonsterCtrl {
    constructor(gameCtrl:LDBaseGameCtrl , mapCtrl:LdMapCtrl , camp:ECamp) {
        super(gameCtrl , mapCtrl , camp);
    }

    private _bossTimeLine: LDCooperateCreateTimeLine;

    protected addEvent() {
        super.addEvent();
        GameEvent.on(EventEnum.ON_OBJ_DIE, this.onDied, this);
    }
    
    protected removeEvent() {
        super.removeEvent();
        GameEvent.off(EventEnum.ON_OBJ_DIE, this.onDied, this);
    }

    protected initCreateTimeLine() {
        let i = 1;
        for (i = 1; i <= 10; i++) {
            let boxID = this._curBoData['npoint' + i + 'monterboxid'];
            if (boxID > 0) {

                let timeLine: LDCooperateCreateTimeLine = this._timeLineList[i - 1] as LDCooperateCreateTimeLine;
                if (!timeLine) {
                    timeLine = new LDCooperateCreateTimeLine(i - 1 , this._campId , false);
                    this._timeLineList[i - 1] = timeLine;
                }

                let monsterData: MonsterBoxConfig = this._gameCtrl.getBoMonsterList(boxID);
                timeLine.start(monsterData, Game.curLdGameCtrl.gameCommonConfig.nspace, this._curBloodRate, this._coinRatio, i);

                //调试用
                timeLine.setBoIndex(this._boIndex);
            }
        }


        const bossBoxId = this._curBoData['npointBoss'];
        if (bossBoxId > 0 && this._campId == ECamp.BLUE) {
            if (!this._bossTimeLine) {
                this._bossTimeLine = new LDCooperateCreateTimeLine(i - 1 , this._campId , true);
            }
            let monsterData: MonsterBoxConfig = this._gameCtrl.getBoMonsterList(bossBoxId);
            this._bossTimeLine.start(monsterData, Game.curLdGameCtrl.gameCommonConfig.nspace, this._curBloodRate, this._coinRatio, i);

            //调试用
            this._bossTimeLine.setBoIndex(this._boIndex);
        
        }
    }

    protected checkMonsterClear() {
        if (this._waitMonsterClear) {
            this.checkMonsterAllDied();
        } else {
            this.onMonsterClear();
        }
    }

    private onDied(obj:any) {
        if (!SoType.isMonster(obj)) {
            return;
        }
        this.checkMonsterAllDied();
    }


    /**检测怪物是否全部击杀完 */
    private checkMonsterAllDied() {
        let allMonster: any[] = Game.soMgr.getAllMonster();
        let len: number = allMonster.length;
        let monster: any;
        let isClear: boolean = true;
        for (let i = 0; i < len; i++) {
            monster = allMonster[i];
            if (monster.cfg && monster.isCreatePosMonster() && !SoType.isBoss(monster)) {

                isClear = false;
                break;
            }
        }

        if (isClear) {
            this.onMonsterClear();
        }
    }
    

    protected resetCreateTimeLine() {
        if (this._bossTimeLine) {
            this._bossTimeLine.exit();
        }
        super.resetCreateTimeLine();
    }

    protected clearData() {
        if (this._bossTimeLine) {
            this._bossTimeLine = null;
        }
        super.clearData();
    }
}