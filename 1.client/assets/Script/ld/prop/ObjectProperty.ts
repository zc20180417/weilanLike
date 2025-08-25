
import SceneObject from "../../logic/sceneObjs/SceneObject";
import { StringUtils } from "../../utils/StringUtils";
import { Observable } from "./Observable";

/**
 * 对象属性
 */
export default class ObjectProperty extends Observable {

    static EventType = {
        VALUE_CHANGED: "value-changed",
        VALUE_MAX: "value-max",
    }

    private ower: SceneObject;
    public id: number;
    private _valueFroms: Record<string, number> = {};
    private _ratioFroms: Record<string, number> = {};
    public isRatio: boolean = false;

    constructor(id?: number, ower?: SceneObject) {
        super();
        this.id = id;
        this.ower = ower;
    }

    set owner(value: SceneObject) {
        this.ower = value;
    }

    /**
     * 最终值
     */
    private _value: number = 0;
    public get value(): number {
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
        this._maxValue = value;
        this.update();
    }
    /**
     * 最小值
     */
    private _minValue: number = 0;
    get minValue(): number {
        return this._minValue;
    }
    set minValue(value: number) {
        this._minValue = value;
        this.update();
    }

    public ignoreMaxValue: boolean = false;

    private _initValue: number = 0;
    get initValue(): number {
        return this._initValue;
    }
    set initValue(value: number) {
        this._initValue = value;
    }

    /**
     * 基础值
     */
    private _base: number = 0;
    public get base(): number {
        return this._base;
    }

    public set base(value: number) {
        if (value === this.base) return;
        if (this._maxValue !== -1) {
            this._base += Math.min((this._maxValue - this._value), value - this._base);
        } else {
            this._base = value;
        }
        this.update();
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
        if (this._maxValue !== -1) {
            this._addition += Math.min((this._maxValue - this._value), value - this._addition);
        } else {
            this._addition = value;
        }
        this.update();
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
        this._ratio = Math.max(-10000, value);
        this.update();
    }

    private _additionRatio: number = 0;
    get additionRatio(): number {
        return this._additionRatio;
    }
    set additionRatio(value: number) {
        if (this._additionRatio === value) return;
        this._additionRatio = value;
        this.update();
    }

    private _baseAddition: number = 0;
    get baseAddition(): number {
        return this._baseAddition;
    }
    /**
     * 倍数
     */
    private _multiple: number = 1;
    public get multiple() {
        return this._multiple;
    }
    public set multiple(value: number) {
        this._multiple = value;
        this.update();
    }

    private update() {
        let old = this._value;
        this._baseAddition = this._base + this._addition;
        this._value = this._baseAddition * (1 + this._ratio * 0.0001 + this._additionRatio * 0.0001) * this._multiple;
        if (!this.isRatio) this._value = Math.floor(this._value);
        if (!this.ignoreMaxValue && this._maxValue !== -1) {
            this._value = Math.min(this._maxValue, this._value);

            if (this._value >= this._maxValue && old < this._maxValue) {
                this.notifyObservers(ObjectProperty.EventType.VALUE_MAX, this, old);
            }
        }

        this._value = Math.max(this._minValue, this._value);

        // this.ower && this.ower.emit(EventEnum.PROPERTY_CHANGE, this.id, this._value, old, this.ower);
        this.notifyObservers(ObjectProperty.EventType.VALUE_CHANGED, this, old);
    }

    getValueFroms(): Record<string, number> {
        return this._valueFroms;
    }

    getRatioFroms(): Record<string, number> {
        return this._ratioFroms;
    }

    setValueFrom(type: string | number, value: number) {
        let old = this._valueFroms[type] || 0;
        old += value;
        this._valueFroms[type] = old;
    }

    setRatioFrom(type: string | number, value: number) {
        let old = this._ratioFroms[type] || 0;
        old += value;
        this._ratioFroms[type] = old;
    }

    /**参与计算战力的属性值,过滤掉技能与buff加的部分属性 */
    get battlePowerValue() {
        let deleteValue = 0;
        for (const key in this._valueFroms) {
            if (!StringUtils.isNumber(key)) {
                deleteValue += this._valueFroms[key] || 0;
            }
        }
        return (this._baseAddition - deleteValue) * (1 + (this.battlePowerRatio) * 0.0001 + this._additionRatio * 0.0001);
    }

    /**参与计算战力的万分比,过滤掉技能与buff加的部分属性 */
    get battlePowerRatio() {
        let deleteRatio = 0;
        for (const key in this._ratioFroms) {
            if (!StringUtils.isNumber(key)) {
                deleteRatio += this._ratioFroms[key] || 0;
            }
        }
        return this._ratio - deleteRatio;
    }

    public clear() {
        this._base = 0;
        this._addition = 0;
        this._ratio = 0;
        this._initValue = 0;
        this._value = 0;
        this._valueFroms = {};
        this._ratioFroms = {};
        this.multiple = 1;
        this._additionRatio = 0;
    }

    public copy(prop: ObjectProperty) {
        this._base = prop.base;
        this._addition = prop.addition;
        this._ratio = prop.ratio;
        this._initValue = prop.initValue;
        this._value = prop.value;
        this._valueFroms = prop.getValueFroms();
        this._ratioFroms = prop.getRatioFroms();
    }

    public isMax(addition?: number) {
        if (addition) {
            return this._maxValue !== -1 ? this._value + addition >= this._maxValue : false;
        } else {
            return this._maxValue !== -1 ? this._value >= this._maxValue : false;
        }
    }

    public delta() {
        return this._maxValue !== -1 ? Math.max(0, this._maxValue - this._value) : -1;
    }

    public add(vlaue: number) {
        this.base += vlaue;
    }
}
