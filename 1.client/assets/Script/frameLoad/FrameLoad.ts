
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
/**
 * schedule(callback,target,interval,repeat,delay);
 * scheduleOnce(callback,target,delay);
 * scheduleForIterator(callback,target,interval,repeat,delay);
 * scheduleFrame(callback,target,interval,repeat,delay);
 * scheduleFrameOnce(callback,target,delay);
 * scheduleFrameForIterator(callback,target,interval,repeat,delay);
 */

let clearFunc = function (obj: any) {
    obj._callback = null;
    obj._target = null;
    obj._frameInterval = 0;
    obj._currFrame = 0;
    obj._lastExeFrame = 0;
    obj._isFrameSchedule = false;
    obj._timeInterval = 0;
    obj._currTime = 0;
    obj._lastExeTime = 0;
    obj._isTimeSchedule = false;
    obj._isFinished = false;
    obj._repeats = 0;
    obj._executedTims = 0;
    obj._step = 0;
    obj._totalSteps = 0;
    obj._currStep = 0;
    obj._delay = 0;
    obj._args = null;
}

let getFunc = function () {
    return this._get() || new FrameLoadCom();
}

/**
 * 迭代函数接口
 */
interface IteratorFunction {
    (first: number, end: number): void;
};

/**
 * 帧加载组件
 */
export class FrameLoadCom {

    _callback: any = null;

    _target: any = null;

    _frameInterval: number = null;//加载的帧间隔

    _currFrame: number = null;//当前帧

    _lastExeFrame: number = null;//上一次执行的帧

    _isFrameSchedule: boolean = null;//是否使用帧进行加载

    _timeInterval: number = null;//时间间隔(s)

    _currTime: number = null;//当前时间

    _lastExeTime: number = null;//上一次执行的时间

    _isTimeSchedule: boolean = null;//是否使用时间进行加载

    _isFinished: boolean = null;//是否结束

    _repeats: number = null;//执行次数

    _executedTims: number = null;//已经执行的次数

    _step: number = null;//步长

    _totalSteps: number = null;//总步数

    _currStep: number = null;//当前步数

    _delay: number = null;//延迟(时间/帧

    _args: any = null;

    constructor() {
        this._callback = null;
        this._target = null;
        this._frameInterval = 0;
        this._currFrame = 0;
        this._lastExeFrame = 0;
        this._isFrameSchedule = false;
        this._timeInterval = 0;
        this._currTime = 0;
        this._lastExeTime = 0;
        this._isTimeSchedule = false;
        this._isFinished = false;
        this._repeats = 0;
        this._executedTims = 0;
        this._step = 0;
        this._totalSteps = 0;
        this._currStep = 0;
        this._delay = 0;
        this._args = null;
    }

    public getTarget(): any {
        return this._target;
    }

    public getCallback(): Function | IteratorFunction {
        return this._callback;
    }

    /**
     * 设置帧间隔
     * @param frameInterval 
     */
    public frame(frameInterval: number): FrameLoadCom {
        if (this._isTimeSchedule) {
            // cc.error("时间加载和帧加载只能使用二者之一")
            return this;
        }
        this._frameInterval = frameInterval;
        this._isFrameSchedule = true;
        this._currFrame = 0;
        this._lastExeFrame = 0;
        return this;
    }

    /**
     * 设置时间间隔
     * @param timeInterval 
     */
    public time(timeInterval: number): FrameLoadCom {
        if (this._isFrameSchedule) {
            return this;
        }
        this._timeInterval = timeInterval;
        this._isTimeSchedule = true;
        this._currTime = 0;
        this._lastExeTime = 0;
        return this;
    }

    /**
     * 设置调用函数
     * @param callback 
     */
    public call(callback: Function | IteratorFunction, target: any): FrameLoadCom {
        this._callback = callback;
        this._target = target;
        return this;
    }

    public delay(delay: number): FrameLoadCom {
        this._delay = delay;
        return this;
    }

    /**
     * 设置用于执行for循环所需参数
     * @param step 
     * @param totalSteps 
     */
    public step(step: number, totalSteps: number) {
        this._step = step;
        this._totalSteps = totalSteps;
        this.repeat(Math.ceil(totalSteps / step));
        return this;
    }

    /**
     * callback重复执行的次数
     * @param repeats 
     */
    public repeat(repeats: number) {
        this._repeats = repeats;
        this._executedTims = 0;
        return this;
    }

    /**
     * 设置参数
     * @param args 
     */
    public args(args: any) {
        this._args = args;
    }

    public update(dt) {
        if (this._isFinished) return;

        if (this._isTimeSchedule) {//按时间进行加载


            let interval = this._currTime - this._lastExeTime;

            while (true) {
                let timeInterval = 0;
                this._executedTims < 1 ? timeInterval = this._delay : timeInterval = this._timeInterval;

                if (interval - timeInterval >= 0) {
                    if (this._totalSteps > 0) {
                        let first = this._executedTims * this._step, end = Math.min((this._executedTims + 1) * this._step, this._totalSteps);
                        this._callback.call(this._target, first, end);
                    } else {
                        this._callback.call(this._target);
                    }
                    //cc.log("executed:" + this._callback.name, FrameLoadMgr.getInstance().getCurrTime(), FrameLoadMgr.getInstance().getCurrFrame());
                    this._executedTims++;
                    if (this._executedTims === this._repeats) return this._isFinished = true;
                    this._lastExeTime += timeInterval;
                    interval -= timeInterval;
                } else {
                    break;
                }
            }

            this._currTime += dt;


        } else if (this._isFrameSchedule) {//按帧进行加载

            let interval = this._currFrame - this._lastExeFrame;

            while (true) {
                let frameInterval = 0;
                this._executedTims < 1 ? frameInterval = this._delay : frameInterval = this._frameInterval;

                if (interval - frameInterval >= 0) {
                    if (this._totalSteps > 0) {
                        let first = this._executedTims * this._step, end = Math.min((this._executedTims + 1) * this._step, this._totalSteps);
                        this._args = this._args || [];
                        this._callback.call(this._target, first, end, ...this._args);
                    } else {
                        this._callback.apply(this._target, this._args);
                    }
                    //cc.log("executed:" + this._callback.name, FrameLoadMgr.getInstance().getCurrTime(), FrameLoadMgr.getInstance().getCurrFrame());
                    this._executedTims++;
                    if (this._executedTims === this._repeats) return this._isFinished = true;
                    this._lastExeFrame += frameInterval;
                    interval -= frameInterval;
                } else {
                    break;
                }
            }
            this._currFrame++;

        }

    }

    public isFinished(): boolean {
        return this._isFinished;
    }

}

export default class FrameLoadMgr {
    private static _instance: FrameLoadMgr = null;

    _frameLoadComs: Array<FrameLoadCom> = null;//分帧组件   

    private noTargetMap: Map<any, FrameLoadCom> = null;
    private targetMap: Map<any, FrameLoadCom[]> = null;

    private frameComPool: cc.js.Pool = null;//分帧组件池

    private poolSize: number = 10;

    private time: number = 0;
    private frame: number = 0;

    static getInstance(): FrameLoadMgr {
        return FrameLoadMgr._instance = FrameLoadMgr._instance || new FrameLoadMgr();
    }

    constructor() {
        this._frameLoadComs = [];
        this.noTargetMap = new Map();
        this.targetMap = new Map();
        this.frameComPool = new cc.js.Pool(clearFunc, this.poolSize);
        this.frameComPool.get = getFunc;
        cc.director.on(cc.Director.EVENT_AFTER_UPDATE, this.update, this);
    }

    public getCurrTime(): number {
        return this.time;
    }

    public getCurrFrame(): number {
        return this.frame;
    }

    /**
     * 注册分帧组件
     * @param frameLoadCom 
     */
    private registerFrameLoadCom(frameLoadCom: FrameLoadCom) {
        let target = frameLoadCom.getTarget();
        if (target) {
            let list = this.targetMap.get(target);
            if (!list) {
                list = [];
                this.targetMap.set(target, list);
            }
            list.push(frameLoadCom);
        } else {
            this.noTargetMap.set(frameLoadCom.getCallback(), frameLoadCom);
        }
    }

    /**
     * 移除分帧组件
     * @param frameLoadCom 
     */
    private unregisterFrameLoadCom(callback: Function, target: any) {
        if (target) {
            let list = this.targetMap.get(target);
            if (list) {
                for (let i = 0; i < list.length; i++) {
                    if (list[i].getCallback() === callback) {
                        list.splice(i, 1);
                        break;
                    }
                }
            }
        } else {
            this.noTargetMap.delete(callback);
        }
    }

    /**
     * 是否存在分帧组件
     * @param frameLoadCom 
     */
    public hasFrameLoadCom(callback: Function | IteratorFunction, target: any) {
        if (target) {
            let list = this.targetMap.get(target);
            if (list) {
                for (let v of list) {
                    if (v.getCallback() === callback) return true;
                }
            }
        }
        return this.noTargetMap.has(callback);
    }

    /**
     * 更新分帧组件
     * 
     */
    public update() {
        let dt = cc.director.getDeltaTime();
        this.time += dt;
        this.frame++;

        this.noTargetMap.forEach((v, k, m) => {
            v.update(dt);
            if (v.isFinished()) {
                m.delete(k);
                this.frameComPool.put(v);
            }
        });

        this.targetMap.forEach((v, k, m) => {
            for (let key in v) {
                v[key].update(dt);
                if (v[key] && v[key].isFinished()) {
                    this.frameComPool.put(v[key]);
                    v.splice(parseInt(key), 1);
                }
            }
            if (m.get(k).length <= 0) m.delete(k);
        });

        // cc.log("time:" + this.time.toFixed(2), "dt:" + dt.toFixed(2), "frame:" + this.frame);
    }

    public schedule(callback: Function, target: any, interval: number, repeat: number, delay?: number) {
        if (!callback) return;
        if (this.hasFrameLoadCom(callback, target)) return cc.warn("帧加载组件重复注册", callback);
        target = target || null;
        interval = interval || 0;
        repeat = repeat || 1;
        delay = delay || 0;
        let frameCom: FrameLoadCom = this.frameComPool.get();
        frameCom.call(callback, target).time(interval).repeat(repeat).delay(delay);
        this.registerFrameLoadCom(frameCom);
    }

    public scheduleOnce(callback: Function, target: any, delay?: number) {
        this.schedule(callback, target, 0, 1, delay);
    }

    public scheduleForIterator(callback: IteratorFunction, target: any, interval: number, steps: number, totalStep: number, delay?: number) {
        if (!callback) return;
        if (this.hasFrameLoadCom(callback, target)) return cc.warn("帧加载组件重复注册", callback);
        target = target || null;
        interval = interval || 0;
        steps = steps || 1;
        totalStep = totalStep || 0;
        delay = delay || 0;
        let frameCom: FrameLoadCom = this.frameComPool.get();
        frameCom.call(callback, target).time(interval).step(steps, totalStep).delay(delay);
        this.registerFrameLoadCom(frameCom);
    }

    public scheduleFrame(callback: Function, target: any, interval: number, repeat: number, delay?: number, ...args: any) {
        if (!callback) return;
        if (this.hasFrameLoadCom(callback, target)) return cc.warn("帧加载组件重复注册", callback);
        target = target || null;
        interval = interval || 0;
        repeat = repeat || 1;
        delay = delay || 0;
        let frameCom: FrameLoadCom = this.frameComPool.get();
        frameCom.call(callback, target).frame(interval).repeat(repeat).delay(delay).args(args);
        this.registerFrameLoadCom(frameCom);
    }

    public scheduleFrameOnce(callback: Function, target: any, delay?: number, ...args: any) {
        this.scheduleFrame(callback, target, 0, 1, delay, ...args);
    }

    public scheduleFrameForIterator(callback: IteratorFunction, target: any, interval: number, steps: number, totalStep: number, delay?: number, ...args: any) {
        if (!callback) return;
        if (this.hasFrameLoadCom(callback, target)) return cc.warn("帧加载组件重复注册", callback);
        target = target || null;
        interval = interval || 0;
        steps = steps || 1;
        totalStep = totalStep || 0;
        delay = delay || 0;
        let frameCom: FrameLoadCom = this.frameComPool.get();
        frameCom.call(callback, target).frame(interval).step(steps, totalStep).delay(delay).args(args);
        this.registerFrameLoadCom(frameCom);
    }

    public unschedule(callback: Function | IteratorFunction, target: any) {
        this.unregisterFrameLoadCom(callback, target);
    }

    public unscheduleTargetAll(target: any) {
        if (!target) return;
        let value = this.targetMap.get(target);
        value && (value.length = 0);
        this.targetMap.delete(target);
    }
}
