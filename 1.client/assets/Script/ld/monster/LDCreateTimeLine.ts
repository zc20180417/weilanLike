import { ECamp } from "../../common/AllEnum";
import { MonsterBoxConfig } from "../../common/ConfigInterface";
import { EventEnum } from "../../common/EventEnum";
import SysMgr from "../../common/SysMgr";
import Game from "../../Game";
import GlobalVal from "../../GlobalVal";
import { EComponentType } from "../../logic/comps/AllComp";
import { Monster } from "../../logic/sceneObjs/Monster";
import { GameEvent } from "../../utils/GameEvent";
import { Handler } from "../../utils/Handler";
import { MathUtils } from "../../utils/MathUtils";



export class LDCreateTimeLine {

    protected _dy: number = 0;
    protected _dyList: number[] = null;
    protected _bloodRatio: number = 0;
    protected _monList: MonsterBoxConfig;
    protected _count:number = 0;
    protected _index: number = 0;
    protected _p: number = 0;
    protected _posIndex: number = 0;

    protected _addIndexFunc:Function = null;
    protected _monsterLen:number = 0;
    protected _totalCount:number = 0;
    protected _minX:number = 49;
    protected _maxX:number = 665;
    protected _initY:number = 1000;
    protected _coinRatio:number = 1;


    ///////////////////////////////////
    //调试用
    protected _boIndex: number = 0;
    protected _campId:ECamp;


    setBoIndex(boIndex: number) {
        this._boIndex = boIndex;
    }

    ////////////////////////////////////////

    constructor(index: number , camp:ECamp = ECamp.BLUE) {
        this._posIndex = index;
        this._campId = camp;
    }

    start(monList: MonsterBoxConfig, dy: number, bloodRatio: number,coinRatio:number, p: number) {

        if (!monList) {
            cc.log('error');
            GameEvent.emit(EventEnum.CREATE_BO_END, this._p);
            return;
        }
        this._coinRatio = coinRatio;
        this._monList = monList;
        this._dy = dy;
        this._bloodRatio = bloodRatio;
        this._count = 0;
        this._index = 0;
        this._p = p;

        let haveBronspacetime = false;
        for (let i = 0 ; i < monList.nbronspacetimes.length ; i++) {
            if (monList.nbronspacetimes[i] > 0) {
                haveBronspacetime = true;
                break;
            }
        }

        this._dyList = haveBronspacetime ? monList.nbronspacetimes : null;
        
        this._monsterLen = 0;
        for (let i = 0 ; i < this._monList.nmonsterid.length ; i++) {
            if (this._monList.nmonsterid[i] > 0) {
                this._monsterLen ++;
            }
        }

        if (monList.btrandmode == 0) {
            this._addIndexFunc = this.addIndex;
            this._totalCount = this._monsterLen * this._monList.nrandcount;
        } else if (monList.btrandmode == 1) {
            this._addIndexFunc = this.addIndexLast;
            this._totalCount = this._monsterLen + (this._monList.nrandcount - 1);
        } else if (monList.btrandmode == 2) {
            this._addIndexFunc = this.addIndexReverse;
            this._totalCount = this._monsterLen * this._monList.nrandcount;
        }

        this.clearTimer();
        SysMgr.instance.doFrameOnce(Handler.create(this.doCreate, this), 1);
    }

    exit() {
        this._index = 0;
        this.clearTimer();
    }

    stop() {

        this.clearTimer();
    }

    protected setCreateTime() {
        let index = this._index == -1 ? 0 : this._index;
        let dy = this._dyList ? this._dyList[index] : this._dy;
        SysMgr.instance.doOnce(Handler.create(this.doCreate, this), dy);
    }

    protected doCreate() {
        let monsterID: number = this._monList.nmonsterid[this._index];
        if (monsterID > 0) {
            let so: Monster = Game.soMgr.createMonster(monsterID, this._bloodRatio);
            if (so) {
                // GameEvent.emit(EventEnum.CREATE_MONSTER,this._boIndex);
                //调试用
                so.setBoIndex(this._boIndex);
                //调试
                // let debugInfo: string = GlobalVal.getMapTimeStr() + " " + so.getHpDebugStr() + " 创建";
                // GameEvent.emit(EventEnum.DEBUG_SHOW_HPINFO, debugInfo);

                //49地图最左边，665地图最右边

                const x = MathUtils.randomInt(this._minX + so.halfSize.width , this._maxX - so.halfSize.width);

                const y = this._initY + MathUtils.randomInt(50 , 100);

                so.setPosNow(x, y);
                so.coinRatio = this._coinRatio;

                so.getAddComponent(EComponentType.MONSTER_AUTO);
            }
        }
        this._count ++;
        this._addIndexFunc();
    }

    protected clearTimer() {
        SysMgr.instance.clearTimer(Handler.create(this.doCreate, this));
    }

    protected addIndex() {
        if (this.checkRefEnd()) {
            return;
        }
        
        this._index = this._count % this._monsterLen;
        this.setCreateTime();
    }

    protected addIndexLast() {
        if (this.checkRefEnd()) {
            return;
        }
        this._index = this._count < this._monsterLen ? this._count : this._monsterLen - 1;
        this.setCreateTime();
    }

    protected addIndexReverse() {
        if (this.checkRefEnd()) {
            return;
        }

        let loopIndex = Math.floor(this._count / this._monsterLen);
        if (loopIndex % 2 == 1) {
            this._index = this._monsterLen - (this._count % this._monsterLen) - 1;
        } else {
            this._index = this._count % this._monsterLen
        }
        this.setCreateTime();
    }

    protected checkRefEnd() {
        if (this._count >= this._totalCount) {
            GameEvent.emit(EventEnum.CREATE_BO_END, this._p , this._campId);
            return true;
        }
        return false;
    }


}