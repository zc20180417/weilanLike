import { IRecyclable } from "./IRecyclable";
import { ObjPool } from "./ObjPool";
import { ERecyclableType } from "./ERecyclableType";

/**回收对象基类 */
export class RecyclableObj implements IRecyclable {

    constructor() {
        
    }

    key:ERecyclableType = ERecyclableType.NONE;

    private _isCache:boolean = false;
    /** 回收前重置数据 */
    resetData() { 

    }

    /** 不回收丢弃 */
    giveUp() {

    }

    /** 销毁 ,调用销毁实际是添加到回收池去，如果回收池已满，将调用giveUp真正释放*/
    dispose() {
        this.recycleSelf();
    }

    /** 回收自己 */
    recycleSelf() {
        if (this._isCache) {
            return;
        }
        this._isCache = true;
        ObjPool.instance.recycleObj(this);
    }

    /**当回收使用 */
    onRecycleUse() {
        this._isCache = false;
    }
}