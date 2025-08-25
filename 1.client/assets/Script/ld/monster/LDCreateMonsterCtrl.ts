import { ECamp } from "../../common/AllEnum";
import { MissionBrushConfig, MissionMainConfig, MonsterBoxConfig } from "../../common/ConfigInterface";
import { EventEnum } from "../../common/EventEnum";
import SysMgr from "../../common/SysMgr";
import Game from "../../Game";
import { GameEvent } from "../../utils/GameEvent";
import { Handler } from "../../utils/Handler";
import { LDBaseGameCtrl } from "../LDBaseGameCtrl";
import { LdMapCtrl } from "../map/LdMapCtrl";
import { LDCreateTimeLine } from "./LDCreateTimeLine";


export class LDCreateMonsterCtrl {
    protected _curMissonData:MissionMainConfig;
    /**当前地图刷新信息 */
    protected _curBodataList: MissionBrushConfig[];
    /**当前波怪物数据 */
    protected _curBoData: MissionBrushConfig;
    /**刷怪时间轴 */
    protected _timeLineList: LDCreateTimeLine[] = [];
    /**刷怪点结束数组 */
    protected _pEnd: boolean[] = [];
    /**当前波是否创怪结束 */
    protected _isBoCreateEnd: boolean = false;
    /**波数index */
    protected _boIndex: number = 0;
    //当前波怪物血量系数
    protected _curBloodRate: number = 0;
    protected _coinRatio:number = 1;

    //总波数
    protected _boLen:number = 0;
    protected _boEndIndex:number = 0;
    protected _mapCtrl:LdMapCtrl;
    protected _onStartBoTimer:Handler;
    protected _gameCtrl:LDBaseGameCtrl;
    protected _sys:SysMgr;
    protected _inMap:boolean = false;
    protected _dontSendBoChangeEvt:boolean = false;
    protected _baseBloodRate:number = 1;
    protected _createCompleted:boolean = false;
    protected _campId:ECamp;
    protected _waitMonsterClear:boolean = false;

    
    constructor(gameCtrl:LDBaseGameCtrl , mapCtrl:LdMapCtrl , camp:ECamp = ECamp.BLUE) {
        this._gameCtrl = gameCtrl;
        this._mapCtrl = mapCtrl;
        this._sys = SysMgr.instance;
        this._campId = camp;
        this._onStartBoTimer = new Handler(this.onStartBoTimer, this);
    }

    /////////////////////////////////////////////////get
    /**当前第几波 */
    get boIndex():number {
        return this._boIndex;
    }
    /**当前波的血量系数（会刷小怪的BOSS需要） */
    get curBloodRate():number {
        return this._curBloodRate;
    }

    setDontSendBoChangeEvt(flag:boolean) {
        this._dontSendBoChangeEvt = flag;
    }

    setBaseBloodRate(rate:number) {
        this._baseBloodRate = rate;
    }

    get createCompleted():boolean {
        return this._createCompleted;
    }
    ///////////////////////////////////////////////public
    enterMap(missonData:MissionMainConfig , boList:MissionBrushConfig[] = null) {
        if (this._inMap) {
            this.exitMap();
        }
        this._inMap = true;
        this.addEvent();
        this._createCompleted = false;
        this._boEndIndex = 0;
        this._boIndex = 0;
        this._curMissonData = missonData;
        this._curBodataList = boList;
        this._boLen = this._curBodataList.length;
        this._waitMonsterClear = false;
        if (!this._dontSendBoChangeEvt) {
            GameEvent.emit(EventEnum.MAP_BO_CHANGE, this._boIndex, this._boLen);
        }
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


    protected addEvent() {
        GameEvent.on(EventEnum.CREATE_BO_END, this.onCreateBoEnd, this);
    }

    protected removeEvent() {
        GameEvent.off(EventEnum.CREATE_BO_END, this.onCreateBoEnd, this);
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
        this._coinRatio = this._curBoData.coinRatio != 0 ? this._curBoData.coinRatio / 10000 : 1.0;

        if (this._gameCtrl.getReduceMonsterBlood() > 0) {
            //开局buff扣血
            this._curBloodRate = this._curBloodRate * (1 - this._gameCtrl.getReduceMonsterBlood());
        }
        this.initCreateTimeLine();

        
        if (this._boIndex >= this._boLen) {
            return;
        }

        const nextBoData = this._curBodataList[this._boIndex % this._curBodataList.length];
        this._waitMonsterClear = nextBoData.isClearStart == 1;
    }

    protected initCreateTimeLine() {
        let i = 1;
        for (i = 1; i <= 10; i++) {
            let boxID = this._curBoData['npoint' + i + 'monterboxid'];
            if (boxID > 0) {

                let timeLine: LDCreateTimeLine = this._timeLineList[i - 1];
                if (!timeLine) {
                    timeLine = new LDCreateTimeLine(i - 1);
                    this._timeLineList[i - 1] = timeLine;
                }

                let monsterData: MonsterBoxConfig = this._gameCtrl.getBoMonsterList(boxID);
                timeLine.start(monsterData, Game.curLdGameCtrl.gameCommonConfig.nspace, this._curBloodRate,this._coinRatio, i);
                //调试用
                timeLine.setBoIndex(this._boIndex);
            }
            
        }
    }

    //////////////////////////////////////////////////////////
    /**
     * 一个刷怪点刷完怪
     * @param p 
     */
    protected onCreateBoEnd(p: number , camp:ECamp) {
        if (camp != this._campId) {
            return;
        }
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

    protected checkMonsterClear() {
        this.onMonsterClear();
    }

    
    protected onMonsterClear() {
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