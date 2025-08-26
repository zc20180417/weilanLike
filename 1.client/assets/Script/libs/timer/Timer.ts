import { ESceneType, TimeLineType } from "../../common/AllEnum";
import SysMgr from "../../common/SysMgr";
import GlobalVal from "../../GlobalVal";
import { Handler } from "../../utils/Handler";


export interface UpdateListItem {
    handler: Handler;
    priority: number;
    isClear: boolean;
}

export class TimerItem {
    private static _pool: TimerItem[] = [];
    private static _key:number = 0;


    public static create(): TimerItem {
        const item = this._pool.pop() || new TimerItem();
        item._isRecycled = false;
        item.key = this._key++;

        return item;
    }

    handler: Handler;
    delay: number;
    interval: number;
    repeats: number;
    userFrame: boolean;

    isLoop: boolean;
    exeTimes: number;
    private _isClear: boolean = false;
    private _isPause: boolean = false;
    useDelay: boolean;
    elapsed: number;
    key:number;

    private _isRecycled: boolean = false;

    constructor() { }

    public init(handler: Handler, delay: number, interval: number, repeats: number, useFrame: boolean) {
        this.handler = handler;
        this.delay = delay;
        this.useDelay = !!delay;
        this.interval = interval;
        this.repeats = repeats;
        this.userFrame = useFrame;

        this.exeTimes = 0;
        this.isLoop = repeats === 0;
        this.isClear = false;
        this.isPause = false;
        this.elapsed = 0;
    }

    public get isClear(): boolean {
        return this._isClear;
    }

    public set isClear(value: boolean) {
        if (this._isRecycled) {
            console.warn("TimerItem: Attempt to set 'isClear' on a recycled object.");
            return;
        }
        this._isClear = value;
    }

    public get isPause(): boolean {
        return this._isPause;
    }

    public set isPause(value: boolean) {
        if (this._isRecycled) {
            console.warn("TimerItem: Attempt to set 'isPause' on a recycled object.");
            return;
        }
        this._isPause = value;
    }

    public recycle(): void {
        if (this._isRecycled) return;

        this.handler = null;
        this.delay = 0;
        this.interval = 0;
        this.repeats = 0;
        this.userFrame = false;
        this.isLoop = false;
        this.exeTimes = 0;
        this._isClear = false;
        this._isPause = false;
        this.useDelay = false;
        this.elapsed = 0;
        this._isRecycled = true;
        this.key = -1;

        TimerItem._pool.push(this);
    }

    pause() {
        this.isPause = true;
    }

    resume() {
        this.isPause = false;
    }

    destroy() {
        SysMgr.instance.clearTimerByKey(this.key);
    }

    /**
     * 重置时间
     * @param time 
     */
    resetTime(time: number) {
        this.elapsed = 0;
        this.interval = time;
    }

    addTime(time: number) {
        this.interval += time;
    }

    /**
     * 获取计时器执行时间
     * @returns 
     */
    getTotalElapsedTime() {
        return this.useDelay ? this.elapsed : this.delay + this.elapsed + this.interval * Math.max(0, this.exeTimes - 1);
    }
}

export class Timer {
    private _timerData: TimerItem[] = [];
    private _timerTargetMap: Map<any, Set<TimerItem>> = new Map();


    private callLaterList: Array<Handler> = [];
    private _curFrame: number = 0;
    private updateList: UpdateListItem[] = [];
    private lateUpdateList: UpdateListItem[] = [];
    private updateMap: Map<Handler,  UpdateListItem> = new Map();
    private lateUpdateMap: Map<Handler,  UpdateListItem> = new Map();

    private _pause: boolean = false;
    private _speed: number = 1;

    /**该时间轴的当前时间 */
    private _now: number = 0;
    /**设置glocal time ,如果是全局的timer ，就不用赋值 */
    private _setGlobalTimeFunc: Function;
    /**是否是场景层的timer,场景层的有暂停和加减速 */
    private _type: TimeLineType;

    private _timerList: Timer[] = [];
    public waitRemove: boolean = false;
    public gameStart: boolean = false;
    public parent: Timer;

    private _sceneType: ESceneType = ESceneType.DEFAULT;

    /**是否激活 */
    private _isActive: boolean = false;

    get isActive(): boolean {
        return this._isActive;
    }

    set isActive(val: boolean) {
        if (this._type !== TimeLineType.SCENE_OBJ) return;
        if (this._isActive !== val) { //只处理激活状态
            if (val) {
                SysMgr.instance.registerTimer(this , this._sceneType);
            } else {
                SysMgr.instance.unRegisterTimer(this , this._sceneType);
            }
        }
        this._isActive = val;
    }

    // unRegisterTimerToLine() {
    //     this._isActive = false;
    //     SysMgr.instance.unRegisterTimer(this , this._sceneType);
    // }


    constructor(type: TimeLineType = TimeLineType.NONE) {
        this._type = type;
        switch (type) {
            case TimeLineType.WORKER:
                this._setGlobalTimeFunc = this.setGlobalTimeFunc;
                break;
            case TimeLineType.WAR:
                this._setGlobalTimeFunc = this.setWarTimeFunc;
                break;
            case TimeLineType.PVP:
                this._setGlobalTimeFunc = this.setPvPTimeFunc;
                break;

            default:
                this._setGlobalTimeFunc = this.none;
                break;
        }
    }

    get frameIndex(): number {
        return this._curFrame;
    }

    reset() {
        this._curFrame = 0;
        this._now = 0;
        this.isActive = false;
    }

    //清理timer
    clear() {
        this.reset();
        this.isActive = false;
        this._timerList.length = 0;
        this._timerData.length = 0;
        this.callLaterList.length = 0;
        this.updateList.length = 0;
        this.lateUpdateList.length = 0;
        this.updateMap.clear();
        this.lateUpdateMap.clear();
        this._timerTargetMap.clear();

        this._pause = false;
        this._editTimerList = false;
        this._timerListChange = false;
        this._speed = 1;
        this._sDt = 0;
        this._sceneType = ESceneType.DEFAULT;
        this._waitRegisterTimers.length = 0;
        this.waitRemove = false;
    }


    setObjType(type: ESceneType) {
        this._sceneType = type;
        this.isActive = this._sceneType == ESceneType.WAR || this._sceneType == ESceneType.PVP;
    }


    get now(): number {
        return this._now;
    }

    /**
     * 定时dalay毫秒后执行
     * @param handler 回调 
     * @param delay 延时执行（ms）
     * @returns 
     */
    doOnce(handler: Handler, delay: number):number {
        if (this._sceneType == ESceneType.WAR || this._sceneType == ESceneType.PVP) {
            return this.doFrame(handler, 0, Math.ceil(delay / GlobalVal.FRAME_TIME_MDT), 1);
        }
        return this.doTimer(handler, 0, delay || 1, 1);
    }

    /**
     * 定时器
     * @param handler 回调 
     * @param interval 执行间隔（ms）
     * @param delay 延时执行（ms）
     * @param repeats 重复次数（0：循环 其他：指定次数）
     * @returns 
     */
    doTimer(handler: Handler, interval: number, delay: number, repeats: number):number {
        let item = TimerItem.create();
        item.init(handler, delay, interval, repeats, false);
        this.isActive = true;
        this._timerData.push(item);
        this.addToTimerMap(item , handler);

        return item.key;
    }

    /**
     * 循环计时器
     * @param handler 回调 
     * @param interval 执行间隔（ms）
     * @param delay 延时执行（ms）
     * @returns 
     */
    doLoop(handler: Handler, interval: number, delay: number):number {
        if (this._sceneType == ESceneType.WAR || this._sceneType == ESceneType.PVP) {
            return this.doFrame(handler, Math.ceil(interval / GlobalVal.FRAME_TIME_MDT), Math.ceil(delay / GlobalVal.FRAME_TIME_MDT), 0);
        }
        return this.doTimer(handler, interval, delay, 0);
    }

    /**
     * 定时dalay帧后执行
     * @param handler 回调
     * @param delay 延时执行（帧）
     * @returns 
     */
    doFrameOnce(handler: Handler, delay: number):number {
        return this.doFrame(handler, 0, delay, 1);
    }
    /**
     * 帧定时器
     * @param handler 回调 
     * @param interval 执行间隔（帧）
     * @param delay 延时执行（帧）
     * @param repeats 重复次数（0：循环 其他：指定次数）
     * @returns 
     */
    doFrame(handler: Handler, interval: number, delay: number, repeats: number):number {
        let item = TimerItem.create();
        item.init(handler, delay, interval, repeats, true);
        this.isActive = true;
        this._timerData.push(item);
        this.addToTimerMap(item , handler);

        return item.key;
    }

    /**
     * 帧循环计时器
     * @param handler 回调 
     * @param interval 执行间隔（帧）
     * @param delay 延时执行（帧）
     * @returns 
     */
    doFrameLoop(handler: Handler, interval: number, delay: number):number {
        return this.doFrame(handler, interval, delay, 0);
    }


    /**清除 */
    clearTimerByKey(key:number) {
        if (key == -1) return;
        let len = this._timerData.length;
        for (let i = len - 1; i >= 0; i--) {
            let d = this._timerData[i];
            if (d.key == key) {
                d.isClear = true;
            }
        }
    }


    /**清除 */
    clearTimer(handler: Handler) {
        if (handler == null) return;
        this._timerData.forEach(element => {
            if (element.handler == handler) {
                element.isClear = true;
            }
        });
    }

    /**清除target下所有计时器 */
    clearTimerByTarget(target: any) {
        let set = this._timerTargetMap.get(target);
        if (set) {
            set.forEach((timerItem) => {
                timerItem.isClear = true;
            });
        }
        this.clearCallLaterByTarget(target);
    }

    /**延迟调用 */
    callLater(handler: Handler) {
        if (!handler) return;
        let index = this.callLaterList.indexOf(handler);
        if (index == -1) {
            this.callLaterList.push(handler);
        }
    }

    /**立即执行延迟调用 */
    exeCallLater(handler: Handler) {
        if (!handler) return;
        let index = this.callLaterList.indexOf(handler);
        if (index != -1) {
            this.callLaterList.splice(index, 1);
        }
        handler.execute();
    }

    /**清除 */
    clearCallLater(handler: Handler) {
        if (!handler) return;
        let index = this.callLaterList.indexOf(handler);
        if (index != -1) {
            this.callLaterList.splice(index, 1);
        }
    }

    clearCallLaterByTarget(target: any) {
        let len = this.callLaterList.length;
        for (let i = len - 1; i >= 0; i--) {
            if (this.callLaterList[i].target == target) {
                this.callLaterList.splice(i, 1);
            }
        }
    }

    private addToTimerMap(timerItem: TimerItem , handler:Handler) {
        let set = this._timerTargetMap.get(handler.target);
        if (!set) {
            set = new Set<TimerItem>();
            this._timerTargetMap.set(handler.target, set);
        }
        set.add(timerItem);
    }

    private removeFromTimerMap(timerItem: TimerItem) {
        let set = this._timerTargetMap.get(timerItem.handler.target);
        if (set) {
            set.delete(timerItem);
            const count = set.size;
            if (count == 0) {
                this._timerTargetMap.delete(timerItem.handler.target);
            }
        }
    }


    private _editTimerList: boolean = false;
    private _timerListChange: boolean = false;

    private getMdt(sDt: number): number {
        return sDt * 1000;
    }

    updateByMs(sDt: number, mDt: number, fDt: number) {
        if (this._pause) return;
        this._now += mDt;
        this._curFrame += fDt;
        let len = this._timerData.length;
        for (let i = len - 1; i >= 0; i--) {
            let t = this._timerData[i];

            if (!t.isPause) {
                if (!t.isClear) {
                    t.elapsed += t.userFrame ? fDt : mDt;
                    if (t.isLoop && !t.useDelay) {
                        if (t.elapsed >= t.interval) {
                            t.handler.execute();
                            t.exeTimes++;
                            t.elapsed = t.elapsed % t.interval;
                        }
                    } else {
                        if (t.useDelay) {
                            if (t.elapsed >= t.delay) {
                                t.handler.execute();
                                t.exeTimes++;
                                t.elapsed = (t.elapsed - t.delay) % t.interval;
                                t.useDelay = false;
                            }
                        } else {
                            if (t.elapsed >= t.interval) {
                                t.handler.execute();
                                t.exeTimes++;
                                t.elapsed = t.elapsed % t.interval;
                            }
                        }
                    }
                    if (!t.isLoop && t.exeTimes >= t.repeats) {
                        t.isClear = true;
                    }
                }
            }

            if (t.isClear) {
                this._timerData.splice(i, 1);
                this.removeFromTimerMap(t);
                t.recycle();
            }
        }

        len = this.updateList.length;
        if (len > 0) {
            for (let i = len - 1 ; i >= 0 ; i--) {
                let t = this.updateList[i];
                if (t.isClear) {
                    this.updateList.splice(i, 1);
                    this.deleteUpdateItem(t.handler , this.updateMap);

                } else {
                    t.handler.executeWith(sDt);
                }
            }
        }

        this._editTimerList = true;
        this._timerListChange = false;
        len = this._timerList.length;
        let tempTimer: Timer;
        for (let i = 0; i < len; i++) {
            tempTimer = this._timerList[i];
            if (!tempTimer.waitRemove) {
                tempTimer.updateByMs(sDt, mDt, fDt);
            } else {
                tempTimer.waitRemove = false;
                this._timerList.splice(i, 1);
                i--;
                len--;
            }
        }
        this._editTimerList = false;
        this.tryAddTimer();
        this.tryRemoveTimer();

    }

    private _sDt: number = 0;
    update(sDt: number) {
        if (this._pause) return;

        let mDt = 0;
        if (this._type == TimeLineType.WAR || this._type == TimeLineType.PVP) {
            this._sDt += sDt;
            while (this._sDt >= GlobalVal.FRAME_TIME_SDT) {
                this._sDt -= GlobalVal.FRAME_TIME_SDT;
                mDt = GlobalVal.FRAME_TIME_MDT;
                sDt = GlobalVal.FRAME_TIME_SDT;
                //此处修改，因为改项目里有加速1.5倍的，假如都是整数倍数加速，就可以改回来
                // const count = GlobalVal.dontLoadRes && this.gameStart ? 10000 : this._speed;
                // for (let i = 0; i < count; i++) {
                //     this._setGlobalTimeFunc(sDt, mDt);
                //     this.updateByMs(sDt, mDt, 1);
                // }
                // const count = GlobalVal.dontLoadRes && this.gameStart ? 10000 : this._speed;
                // for (let i = 0; i < count; i++) {
                    this._setGlobalTimeFunc(sDt * this._speed , mDt * this._speed);
                    this.updateByMs(sDt * this._speed, mDt * this._speed, 1);
                // }
            }
        } else {
            sDt = sDt;
            mDt = this.getMdt(sDt);
            this._setGlobalTimeFunc(sDt, mDt);
            this.updateByMs(sDt, mDt, 1);
        }
    }

    lateUpdate() {
        if (this._pause) return;
        let len = this.callLaterList.length;
        if (len > 0) {
            for (let i = len - 1; i >= 0; i--) {
                this.callLaterList[i].execute();
            }
            this.callLaterList.length = 0;
        }

        len = this.lateUpdateList.length;
        let t : UpdateListItem;

        for (let i = len - 1; i >= 0; i--) {
            t = this.lateUpdateList[i];
            if (t.isClear) {
                this.lateUpdateList.splice(i, 1);
                this.deleteUpdateItem(t.handler , this.lateUpdateMap);
            } else {
                t.handler.execute();
            }
        }
    }

    registerUpdate(onTimer: Handler, priority: number) {
        this.isActive = true;
        this.insertHandler(onTimer, priority, this.updateList , this.updateMap);
    }

    unRegisterUpdate(onTimer: Handler) {
        this.setUpdateClear(onTimer, this.updateList , this.updateMap);
    }

    registerLateUpdate(onTimer: Handler, priority: number) {
        this.isActive = true;
        this.insertHandler(onTimer, priority, this.lateUpdateList , this.lateUpdateMap);
    }

    unRegisterLateUpdate(onTimer: Handler) {
        this.setUpdateClear(onTimer, this.lateUpdateList , this.lateUpdateMap);
    }

    private deleteUpdateItem(handler: Handler , map: Map<Handler, UpdateListItem>) {
        map.delete(handler);
    }


    private _waitRegisterTimers: Timer[] = [];

    registerTimer(timer: Timer) {
        timer.parent = this;
        this.isActive = true;
        if (timer.waitRemove) {
            timer.waitRemove = false;
            console.log("error registerTimer repeat !");
        }
        if (this._editTimerList) {
            const index = this._waitRegisterTimers.indexOf(timer);
            if (index == -1) {
                this._waitRegisterTimers.push(timer);
            }
            return;
        }

        const index = this._timerList.indexOf(timer);
        if (index == -1) {
            this._timerList.push(timer);
        }
    }

    unRegisterTimer(timer: Timer) {
        let index = this._waitRegisterTimers.indexOf(timer);
        if (index != -1) {
            this._waitRegisterTimers.splice(index, 1);
        }

        if (this._editTimerList) {
            timer.waitRemove = true;
            this._timerListChange = true;
            return;
        }

        index = this._timerList.indexOf(timer);
        if (index != -1) {
            this._timerList.splice(index, 1);
        }
    }

    private tryAddTimer() {
        if (this._waitRegisterTimers.length == 0) return;
        for (let i = 0; i < this._waitRegisterTimers.length; i++) {
            this.registerTimer(this._waitRegisterTimers[i]);
        }
        this._waitRegisterTimers.length = 0;
    }

    private tryRemoveTimer() {
        if (!this._timerListChange) return;
        this._timerListChange = false;
        let temp: Timer;
        const len = this._timerList.length;
        for (let i = len - 1; i >= 0; i--) {
            temp = this._timerList[i];
            if (temp.waitRemove) {
                temp.waitRemove = false;
                this._timerList.splice(i, 1);
            }
        }
    }

    private setUpdateClear(handler: Handler, list: any[] , map: Map<Handler, UpdateListItem>) {
        const item = map.get(handler);
        if (item) {
            item.isClear = true;
            return true;
        }
        return false;
    }



    private insertHandler(onTimer: Handler, priority: number, list: any[] ,map: Map<Handler, UpdateListItem>) {
        let timeObj = map.get(onTimer);
        if (timeObj) {
            if (!timeObj.isClear) {
                cc.log("error repeat registerUpdate !");
            }
            timeObj.isClear = false;
            return;
        }
        let obj = { handler: onTimer, priority: priority, isClear: false };
        map.set(onTimer, obj);
        this.insertByPriority(obj, list);
    }

    get pause(): boolean {
        return this._pause;
    }

    set pause(value: boolean) {
        this._pause = value;
    }

    set speed(value: number) {
        this._speed = value;
    }

    get speed(): number {
        return this._speed;
    }

    private insertByPriority(obj: any, list: any[]) {
        // 使用二分查找找到插入点，维持数组按 priority 降序排列
        let low = 0;
        let high = list.length - 1;
        let target = obj.priority;
        let mid;

        while (low <= high) {
            mid = Math.floor((low + high) / 2);
            // 修改此处的比较逻辑，实现降序排列
            if (list[mid].priority > target) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }

        list.splice(low, 0, obj);
    }

    // private getTimer(handler: Handler, delay: number, interval: number, repeats: number, userFrame: boolean) {
    //     return ;
    // }

    private setGlobalTimeFunc(sDt: number, mDt: number) {
        
        GlobalVal.sDelta = sDt;
        GlobalVal.mDelta = mDt;
    }

    private setWarTimeFunc(sDt: number, mDt: number) {
        GlobalVal.war_SDelta = sDt;
        GlobalVal.war_MDelta = mDt;
        GlobalVal.curFrameIndex = this._curFrame + 1;
        GlobalVal.curAngleDelta = mDt;
        GlobalVal.now = this._now;
    }

    private setPvPTimeFunc(sDt: number, mDt: number) {
        GlobalVal.pvpFrameIndex = this._curFrame + 1;
    }

    private none() {

    }

}