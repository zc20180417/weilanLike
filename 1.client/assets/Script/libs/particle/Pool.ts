

export class Pool<T> {
    private _count: number = 0;
    private _cleanup: (obj: T) => void;
    private _pool: Array<T>;
    private _constructor: new () => T;
    constructor(constructor: new () => T, cleanupFunc: (obj: T) => void, size: number = 0) {
        this._count = 0;
        this._pool = [];
        this._cleanup = cleanupFunc;
        this._constructor = constructor;
    }

    get() {
        return this._pool.pop() || new this._constructor();
    }

    put(obj: T) {
        var pool = this._pool;
        if (this._count < pool.length) {
            this._cleanup(obj);
            pool.push(obj);
            ++this._count;
        }
    }

    resize(size: number) {
        if (size > 0) {
            this._pool.length = size;
        }
    }
}
