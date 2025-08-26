import { EventEnum } from "../common/EventEnum";


export type Reply = (arg: any) => any;

export type ReturnFuntion = (relay: Reply,...args: any[]) => any;
export type Callback = (...any: any[]) => void;

/**
 * 全局事件管理
 */
export class GameEvent {
    private static _event = new cc.EventTarget();

    /**侦听事件 */
    public static on(type: EventEnum | string, callback: Callback, target?: any): any {
        return this._event.on(type as unknown as string, callback, target);
    }

    /**移除事件 */
    public static off(type: EventEnum | string, callback?: Callback, target?: any): void {
        this._event.off(type as unknown as string, callback, target);
    }

    /**移除target下的所有事件 */
    public static targetOff(target: any): void {
        this._event.targetOff(target);
    }

    /**侦听一次 */
    public static once(
        type: EventEnum | string,
        callback: (arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any) => any,
        target?: any
    ) {
        this._event.once(type as unknown as string, callback, target);
    }

    /**通过type广播事件 */
    public static emit(type: EventEnum | string, arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any): void {
        this._event.emit(type as unknown as string, arg1, arg2, arg3, arg4, arg5);
    }

    /**侦听带返回的事件 */
    public static onReturn(type: string | EventEnum, callback: ReturnFuntion, target?: any): void {
        this._event.on(type as unknown as string, callback, target);
    }

    /**移除事件 */
    public static offReturn(type: EventEnum | string, callback?: Callback, target?: any): void {
        this._event.off(type as unknown as string, callback, target);
    }

    /**广播带返回值的事件 */
    public static dispathReturnEvent(type: string | EventEnum, ...args): any {
        let result: any;
        this._event.emit(type as unknown as string, (arg: any) => {
            result = arg;
        }, ...args);
        return result;
    }
}

