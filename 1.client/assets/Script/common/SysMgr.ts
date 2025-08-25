

import GlobalVal from "../GlobalVal";
import { Timer, TimerItem } from "../libs/timer/Timer";
import { GameEvent } from "../utils/GameEvent";
import { Handler } from "../utils/Handler";
import { ESceneType, TimeLineType } from "./AllEnum";
import { EventEnum } from "./EventEnum";


export default class SysMgr extends cc.Component {

    private static _instance: SysMgr = null;
    public static get instance(): SysMgr {
        if (!this._instance) {
            let node = new cc.Node("SysMgr");
            cc.game.addPersistRootNode(node);
            this._instance = node.addComponent(SysMgr);
        }
        return this._instance;
    }

    onLoad() {
        cc.game.on(cc.game.EVENT_HIDE, this.onGameHide, this);
        cc.game.on(cc.game.EVENT_SHOW, this.onGameShow, this);
    }

    private _hideTime: number = -1;
    private _autoUpdateOnActivity: boolean = true;
    private _date: Date = new Date();
    private _lastDay: number = -1;
    onGameHide() {
        let date = new Date();
        this._hideTime = date.getTime();
        cc.log("进入后台:" + date.toLocaleTimeString());
        GameEvent.emit(EventEnum.ON_GAME_HIDE);
    }

    onGameShow() {
        if (this._hideTime != -1) {
            let date = new Date();
            let delta = (date.getTime() - this._hideTime) / 1000;   //秒
            cc.log("进入前台:" + date.toLocaleTimeString() + " ,delta:" + delta);
            if (this._autoUpdateOnActivity) {
                // this.update(delta);
                this._globalTimer.update(delta);
            }
            GameEvent.emit(EventEnum.ON_GAME_SHOW, delta);
        }

        this._hideTime = -1;
    }

    //游戏计时器（主城，可被暂停）
    private _gameTimer: Timer = new Timer(TimeLineType.WORKER);
    //全局业务逻辑计时器
    private _globalTimer: Timer = new Timer(TimeLineType.GLOBAL);
    //战场计时器（可暂停和加速）
    private _warTimer: Timer = new Timer(TimeLineType.WAR); 
    //pvp计时器
    private _pvpTimer: Timer = new Timer(TimeLineType.PVP);

    update(delta: number) {
        this._gameTimer.update(delta);
        this._globalTimer.update(delta);
        this._warTimer.update(delta);
        this._pvpTimer.update(delta);

        this._date.setTime(GlobalVal.getServerTime());
        if (this._lastDay == -1) {
            this._lastDay = this._date.getDate();
        } else {
            if (this._lastDay != this._date.getDate()) {
                this._lastDay = this._date.getDate();
                //跨天
                GameEvent.emit(EventEnum.ACROSS_DAY);
            }
        }
    }

    lateUpdate() {
        this._gameTimer.lateUpdate();
        this._globalTimer.lateUpdate();
        this._warTimer.lateUpdate();
        this._pvpTimer.lateUpdate();
    }

    doOnce(handler: Handler, delay: number, isGlobal: boolean = false):number {
        return this.getTimer(isGlobal).doOnce(handler, delay);
    }

    doTimer(handler: Handler, interval: number, delay: number, repeats: number, isGlobal = false):number {
        return this.getTimer(isGlobal).doTimer(handler, interval, delay, repeats);
    }

    doLoop(handler: Handler, interval: number, delay: number = 0, isGlobal: boolean = false):number {
        return this.getTimer(isGlobal).doLoop(handler, interval, delay);
    }

    doFrameOnce(handler: Handler, delay: number, isGlobal: boolean = false):number {
        return this.getTimer(isGlobal).doFrameOnce(handler, delay);
    }

    doFrame(handler: Handler, interval: number, delay: number, repeats: number, isGlobal: boolean = false):number {
        return this.getTimer(isGlobal).doFrame(handler, interval, delay, repeats);
    }

    doFrameLoop(handler: Handler, interval: number, delay: number = 0, isGlobal: boolean = false):number {
        return this.getTimer(isGlobal).doFrameLoop(handler, interval, delay);
    }

    /**
     * 重新开始计时器的计时
     * @param timerItem 
     * @param isGlobal 
     * @returns 
     */
    // reStartTimer(timerItem: TimerItem, isGlobal: boolean = false) {
    //     if (!timerItem) return;
    //     timerItem.elapsed = 0;
    // }

    /**清除 */
    clearTimer(handler: Handler, isGlobal: boolean = false) {
        let timer = this.getTimer(isGlobal);
        timer.clearTimer(handler);
    }

    clearTimerByKey(key:number , isGlobal: boolean = false) {
        let timer = this.getTimer(isGlobal);
        timer.clearTimerByKey(key);
    }


    /**清除target下所有计时器 */
    clearTimerByTarget(target: any, isGlobal: boolean = false) {
        let timer = this.getTimer(isGlobal);
        timer.clearTimerByTarget(target);
    }

    /**延迟调用 */
    callLater(handler: Handler, isGlobal: boolean = false) {
        let timer = this.getTimer(isGlobal);
        timer.callLater(handler);
    }

    /**立即执行延迟调用 */
    exeCallLater(handler: Handler, isGlobal: boolean = false) {
        let timer = this.getTimer(isGlobal);
        timer.exeCallLater(handler);
    }

    /**清除 */
    clearCallLater(handler: Handler, isGlobal: boolean = false) {
        let timer = this.getTimer(isGlobal);
        timer.clearCallLater(handler);
    }

    clearCallLaterByTarget(target: any, isGlobal: boolean = false) {
        let timer = this.getTimer(isGlobal);
        timer.clearCallLaterByTarget(target);
    }

    registerUpdate(onTimer: Handler, priority: number, isLate: boolean = false) {
        if (isLate) {
            this._gameTimer.registerLateUpdate(onTimer, priority);
        } else {
            this._gameTimer.registerUpdate(onTimer, priority);
        }
    }

    unRegisterUpdate(onTimer: Handler, isLate: boolean = false) {
        if (isLate) {
            this._gameTimer.unRegisterLateUpdate(onTimer);
        } else {
            this._gameTimer.unRegisterUpdate(onTimer);
        }
    }

    registerTimer(timer:Timer , sceneType:ESceneType) {
        const timerLine = this.getTimerBySceneType(sceneType);
        timerLine.registerTimer(timer);
    }

    unRegisterTimer(timer:Timer , sceneType:ESceneType) {
        const timerLine = this.getTimerBySceneType(sceneType);
        timerLine.unRegisterTimer(timer);
    }

    private getTimerBySceneType(sceneType:ESceneType):Timer {
        switch (sceneType) {
            case ESceneType.WAR:
                return this._warTimer;
            case ESceneType.PVP:
                return this.pvpTimer;
        }
        return this._gameTimer;
    }

    /**
     * 重新设置计时器的计时
     * @param timerItem 
     * @param delay 
     */
    // reSetTimer(timerItem:TimerItem , interval:number,isGlobal:boolean = false) {
    //     if (!timerItem) return;
    //     timerItem.elapsed = 0;
    //     timerItem.interval = interval;
    // }

     /**
     * 改变定时器的执行时间
     * 需要先减去已经过去的时间
     */
    //  changeTimerDyItem(timerItem:TimerItem , interval:number) {
    //     if (!timerItem) return;
    //     let tempTime = timerItem.elapsed - timerItem.interval;
    //     timerItem.elapsed = tempTime + interval;
    //     timerItem.interval = interval;
    // }

    get pause(): boolean {
        return this._gameTimer.pause;
    }

    set pause(value: boolean) {
        if (this._pause == value) return;
        this._pause = value;
        this._warTimer.pause = value;
        this._gameTimer.pause = value;
        this._pvpTimer.pause = value;
        
        if (!value) {
            this.pauseList.length = 0;
        }
        GameEvent.emit(EventEnum.GAME_PAUSE, value);
    }

    set warSpeed(value: number) {
        this._warTimer.speed = value;
        GameEvent.emit(EventEnum.TIME_SPEED, value , ESceneType.WAR);
    }

    get warSpeed() {
        return this._warTimer.speed;
    }

    set pvpSpeed(value: number) {
        this._pvpTimer.speed = value;
        GameEvent.emit(EventEnum.TIME_SPEED, value , ESceneType.PVP);
    }

    get pvpSpeed() {
        return this._pvpTimer.speed;
    }

    private _pause: boolean = false;
    private pauseList: any[] = [];
    pauseGame(target: any, flag: boolean) {
        let index = this.pauseList.indexOf(target);
        if (!flag && index != -1) {
            this.pauseList.splice(index, 1);

            if (this.pauseList.length == 0) {
                this.pause = false;
            }
        } else if (flag) {
            if (index == -1) {
                this.pauseList.push(target);
            }
            this.pause = true;
        }
    }

    checkPauseGameFlag(target: any) {
        return this.pauseList.indexOf(target) != -1;
    }

    setAutoUpdateOnActivity(flag: boolean) {
        this._autoUpdateOnActivity = false;
    }

    public getTimer(isGlobal: boolean = false): Timer {
        let timer = isGlobal ? this._globalTimer : this._warTimer;
        if (!timer) {
            timer = new Timer();
        }
        return timer;
    }

    get warTimer():Timer {
        return this._warTimer;
    }

    get pvpTimer():Timer {
        return this._pvpTimer;
    }
}