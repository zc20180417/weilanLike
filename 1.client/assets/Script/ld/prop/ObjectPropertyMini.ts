
import SceneObject from "../../logic/sceneObjs/SceneObject";

/**
 * 对象属性
 */
export default class ObjectPropertyMini  {
    private ower: SceneObject;
    public readonly id: number;
    public isRatio: boolean = false;
    public ignoreMaxValue: boolean = false;
    private _isDirty: boolean = true; // 脏标记，用于延迟计算
    // private _

    constructor(id?: number, ower?: SceneObject) {
        this.id = id;
        this.ower = ower;
    }

    set owner(value: SceneObject) {
        this.ower = value;
    }

    /**
     * 最终值
     * 在获取时才进行计算（如果数据已变脏）
     */
    private _value: number = 0;
    public get value(): number {
        if (this._isDirty) {
            this.update();
        }
        return this._value;
    }

    /**
     * 最大值
     */
    private _maxValue: number = -1;
    get maxValue(): number {
        return this._maxValue;
    }

    set maxValue(value: number) {
        if (this._maxValue === value) return;
        this._maxValue = value;
        this._isDirty = true;
    }

    /**
     * 最小值
     */
    private _minValue: number = 0;
    get minValue(): number {
        return this._minValue;
    }
    set minValue(value: number) {
        if (this._minValue === value) return;
        this._minValue = value;
        this._isDirty = true;
    }

    /**
     * 万分比
     */
    private _ratio: number = 0;
    public get ratio(): number {
        return this._ratio;
    }
    public set ratio(value: number) {
        if (this._ratio === value) return;
        this._ratio = value; // 限制可以放在业务逻辑层或保持原样
        this._isDirty = true;
    }

    /**
     * 基础值
     */
    private _base: number = 0;
    public get base(): number {
        return this._base;
    }
    public set base(value: number) {
        if (this._base === value) return;
        this._base = value;
        this._isDirty = true;
    }

    /**
     * 额外值
     */
    private _addition: number = 0;
    get addition(): number {
        return this._addition;
    }
    set addition(value: number) {
        if (this._addition === value) return;
        this._addition = value;
        this._isDirty = true;
    }

    

    private update() {
        // 1. 计算基础值 + 额外值
        let combinedBase = this._base + this._addition;
        
        // 2. 应用万分比加成
        let finalValue = combinedBase * (1 + this._ratio * 0.0001);

        // 3. 取整（如果需要）
        if (!this.isRatio) {
            finalValue = Math.floor(finalValue);
        }

        // 4. 应用最大/最小值约束
        if (!this.ignoreMaxValue && this._maxValue !== -1) {
            finalValue = Math.min(this._maxValue, finalValue);
        }
        this._value = Math.max(this._minValue, finalValue);
        
        // 5. 重置脏标记
        this._isDirty = false;
    }

    /**
     * 强制立即更新属性值。
     * 通常不需要手动调用，除非你想在不读取 a.value 的情况下确保 a._value 是最新的。
     */
    public forceUpdate() {
        this.update();


    }

    public clear() {
        this._base = 0;
        this._addition = 0;
        this._ratio = 0;
        this._isDirty = true;
        this.update(); // clear后立即更新一次
    }

    public isMax(addition: number = 0): boolean {
        const currentValue = this.value; // 获取最新值
        return this._maxValue !== -1 ? (currentValue + addition) >= this._maxValue : false;
    }

    public delta(): number {
        return this._maxValue !== -1 ? Math.max(0, this._maxValue - this.value) : -1;
    }

    public add(value: number) {
        this.base += value; // 直接修改base，setter会自动处理脏标记
    }
}
