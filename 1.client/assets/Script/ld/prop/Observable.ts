import { Observer } from "./Observer";


/**
 * 被观察者
 */
export class Observable {
    private _observers: Observer[] = [];
    public addObserver(observer: Observer) {
        this._observers.push(observer);
        return observer;
    }

    public removeObserver(observer: Observer) {
        let index = this._observers.indexOf(observer);
        if (index != -1) {
            this._observers.splice(index, 1);
        }
    }

    public notifyObservers(arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any) {
        for (let i = 0; i < this._observers.length; i++) {
            this._observers[i].onNotify(arg1, arg2, arg3, arg4, arg5);
        }
    }

    public removeAllObservers() {
        this._observers.length = 0;
    }
}