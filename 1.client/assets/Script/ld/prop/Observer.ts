
/**
 * 观察者
 */
export class Observer {
    target: any;
    callback: Function;

    constructor(callback: Function, target?: any) {
        this.callback = callback;
        this.target = target;
    }

    onNotify(arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any) {
        this.callback.call(this.target, arg1, arg2, arg3, arg4, arg5);
    }
}