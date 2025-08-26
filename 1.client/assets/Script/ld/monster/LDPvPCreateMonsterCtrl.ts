import { ECamp } from "../../common/AllEnum";
import { MissionMainConfig, MissionBrushConfig, MonsterBoxConfig } from "../../common/ConfigInterface";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { GameEvent } from "../../utils/GameEvent";
import { LDBaseGameCtrl } from "../LDBaseGameCtrl";
import { LdMapCtrl } from "../map/LdMapCtrl";
import { LDCreateMonsterCtrl } from "./LDCreateMonsterCtrl";
import { LDCreateTimeLine } from "./LDCreateTimeLine";
import { LDPvPCreateTimeLine } from "./LDPvPCreateTimeLine";

export class LDPvPCreateMonsterCtrl extends LDCreateMonsterCtrl {


    
    constructor(gameCtrl:LDBaseGameCtrl , mapCtrl:LdMapCtrl , camp:ECamp = ECamp.BLUE) {
        super(gameCtrl, mapCtrl , camp);
    }

    
    ///////////////////////////////////////////////public
    enterMap(missonData:MissionMainConfig , boList:MissionBrushConfig[] = null) {
        super.enterMap(missonData, boList);
    }

    exitMap() {
        this.removeEvent();
        this.resetCreateTimeLine();
        this.clearData();
        this._inMap = false;
    }

    clearStartBoTimer() {
        this._sys.clearTimer(this._onStartBoTimer);
    }

    get curBloodRate():number {
        return this._curBloodRate;
    }

    protected addEvent() {
        GameEvent.on(EventEnum.CREATE_BO_END, this.onCreateBoEnd, this);
        // GameEvent.on(EventEnum.ON_OBJ_DIE, this.onDied, this);
    }

    protected removeEvent() {
        GameEvent.off(EventEnum.CREATE_BO_END, this.onCreateBoEnd, this);
        // GameEvent.off(EventEnum.ON_OBJ_DIE, this.onDied, this);
    }

    /**添加下一波刷怪计时器 */
    setStartBoTimer(dy: number, showPathTip: boolean = true) {
        this._sys.doOnce(this._onStartBoTimer, dy);
        this._isBoCreateEnd = false;
        if (showPathTip) {
            if (this._boIndex >= this._boLen) {
                return;
            }
        }
    }

    /**某一波怪物开始 */
    onStartBoTimer() {

        this._pEnd = [];

        if (this._boIndex >= this._boLen) {
            return;
        }

        if (this._boEndIndex < this._boIndex) {
            this._boEndIndex = this._boIndex;
            GameEvent.emit(EventEnum.MAP_BO_END , this._boIndex);
        }
        let boLen = this._curBodataList.length;
        let index = this._boIndex % boLen;
        // let loopIndex = Math.floor(this._boIndex / boLen);
        this._curBoData = this._curBodataList[index];
        
        this._boIndex++;

        if (!this._dontSendBoChangeEvt) {
            GameEvent.emit(EventEnum.MAP_BO_CHANGE, this._boIndex, this._boLen);
        }

        this._curBloodRate = (this._curBoData.nbloodratio ) / 10000 * (this._curMissonData.nmonsterhpaddper / 10000) * this._baseBloodRate;
        this._coinRatio = this._curBoData.coinRatio != 0 ? this._curBoData.coinRatio / 10000 : 1;


        if (this._gameCtrl.getReduceMonsterBlood() > 0) {
            //开局buff扣血
            this._curBloodRate = this._curBloodRate * (1 - this._gameCtrl.getReduceMonsterBlood());
        }
        
        let i = 1;
        for (i = 1; i <= 10; i++) {
            let boxID = this._curBoData['npoint' + i + 'monterboxid'];
            if (boxID > 0) {

                let timeLine: LDPvPCreateTimeLine = this._timeLineList[i - 1] as LDPvPCreateTimeLine;
                if (!timeLine) {
                    timeLine = new LDPvPCreateTimeLine(i - 1 , this._campId);
                    this._timeLineList[i - 1] = timeLine;
                }

                let monsterData: MonsterBoxConfig = this._gameCtrl.getBoMonsterList(boxID);
                timeLine.start(monsterData, Game.curLdGameCtrl.gameCommonConfig.nspace, this._curBloodRate, this._coinRatio, i);

                //调试用
                timeLine.setBoIndex(this._boIndex);
            }
            
        }

        if (this._boIndex >= this._boLen) {
            return;
        }
    }

    //////////////////////////////////////////////////////////
    /**
     * 一个刷怪点刷完怪
     * @param p 
     */
    protected onCreateBoEnd(p: number , campId:ECamp ) {
        if (campId !== this._campId) return;
        this._pEnd[p - 1] = true;
        this._isBoCreateEnd = true;
        for (let i = 1; i < 9; i++) {
            if (this._curBoData && this._curBoData['npoint' + i + 'monterboxid'] > 0) {
                if (!this._pEnd[i - 1]) {
                    this._isBoCreateEnd = false;
                    break;
                }
            }
        }

        if (this._isBoCreateEnd) {
            this.checkMonsterClear();
        }
    }

    /*
    private onDied(obj:any) {
        if (obj.camp != this._campId || !SoType.isMonster(obj)) {
            return;
        }
        this.checkMonsterAllDied();
    }
    */

    /**检测怪物是否全部击杀完 */
    /*
    private checkMonsterAllDied() {
        let allMonster: any[] = Game.soMgr.getAllMonster();
        let len: number = allMonster.length;
        let monster: any;
        let isClear: boolean = true;
        for (let i = 0; i < len; i++) {
            monster = allMonster[i];
            if (monster.camp == this._campId && monster.cfg && monster.isCreatePosMonster()) {
                isClear = false;
                break;
            }
        }

        if (isClear) {
            this.onMonsterClear();
        }
    }
    */

    
    protected onMonsterClear() {
        if (!this._isBoCreateEnd) return;
        if (this._boIndex < this._boLen) {
            this._curBoData = this._curBodataList[this._boIndex % this._curBodataList.length];
            this._boEndIndex = this._boIndex;
            GameEvent.emit(EventEnum.MAP_BO_END , this._boIndex);
            this._sys.clearTimer(this._onStartBoTimer);
            this.setStartBoTimer(Game.curLdGameCtrl.gameCommonConfig.nspace);
            GameEvent.emit(EventEnum.COMPLETE_BO, this._boIndex);
        } else {
            this._createCompleted = true;
            GameEvent.emit(EventEnum.CREATE_ALL_MONSTER_COMPLETE);
        }
        
    }

    /////////////////////////////////clear
    protected resetCreateTimeLine() {
        let len = this._timeLineList.length;
        for (let i = 0; i < len; i++) {
            let timeLine: LDCreateTimeLine = this._timeLineList[i];
            if (timeLine) {
                timeLine.exit();
            } else {
                cc.log("is not timeLine");
            }
        }
    }

    protected clearData() {
        this.clearStartBoTimer();
        this._curMissonData = null;
        this._curBodataList = [];
        this._curBoData = null;
        this._timeLineList = [];
        this._pEnd = [];
        this._isBoCreateEnd = false;
        this._boIndex = 0;
        this._boLen = 1;
        this._baseBloodRate = 1;
    }

}