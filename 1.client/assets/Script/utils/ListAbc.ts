export class ListAbc<T> {

    private static _defaultCapacity:number = 4;
    private _emptyArray:T[] = [];

    private _items:Array<T>;
    private _size:number;

    constructor(){
        this._items = this._emptyArray;
    }

    get capacity():number{
        return this._items.length;
    }
    set capacity(v:number){
        if(v < this._size){
            return;
        }
        if(v > 0){
            let newItems:Array<T> = new Array<T>(v);
            if(this._size > 0){
                
            }
            this._items = newItems;
        }else{
            this._items = this._emptyArray;
        }
    }

    get count():number{
        return this._size;
    }

    getItem(i:number):T{
        if(i>=this._size){
            return null;
        }
        return this._items[i];
    }
    setItem(i:number, t:T){
        if(i>=this._size){
            return;
        }
        this._items[i] = t;
    }

    add(t:T){
        if(this._size == this._items.length){
            this.ensureCapacity(this._size + 1);
        }
        this._items[this._size++] = t;
    }












    //--------------------------------------------
    private ensureCapacity(min:number){
        if(this._items.length < min){
            let newCapacity = this._items.length == 0 ? ListAbc._defaultCapacity : this._items.length * 2;
            if(newCapacity < min) newCapacity = min;
            this.capacity = newCapacity;
        }
    }
}