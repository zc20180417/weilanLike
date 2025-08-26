import { MathUtils } from "./MathUtils";

export class EncryptionValue {
    private _tempValue: number = 0;
    private _value: number = 0;
    private _keyIndex: number = 0;
    private static ENCRYPT_KEYB: number[] = [65, 68, 69, 70, 67, 66, 71, 72];

    set(value: number) {
        this._keyIndex = MathUtils.randomInt(0, 7);
        this._value = value ^ EncryptionValue.ENCRYPT_KEYB[this._keyIndex];
        this._tempValue = value;
    }

    get(): number {
        let value = this._value ^ EncryptionValue.ENCRYPT_KEYB[this._keyIndex];
        if (value != this._tempValue) {
            cc.log('作弊了');
        }
        return value;
    }

    add(value: number) {
        this.set(value + this.get());
    }
}

export class Encryption {
    public static global = {};
    public static ENCRYPT_KEYB: number[] = [65, 68, 69, 70, 67, 66, 71, 72];

    /**
     * 为对象整型类型属性添加加密
     * @param obj 
     * @param props 
     * @param defineUnexistProp 
     */
    public static wrapIntProp(obj: object, props: Array<string>, defineUnexistProp: boolean = false) {
        let originValue = 0;
        for (let i = props.length - 1; i >= 0; i--) {
            if (!defineUnexistProp && !obj.hasOwnProperty(props[i])) {
                continue;
            }
            let _keyIndex = 0;
            let _value = 0;
            let _tempValue = 0;
            originValue = obj[props[i]] || 0;
            Object.defineProperty(obj, props[i], {
                enumerable: true,
                configurable: true,
                get: function () {
                    let value = _value ^ Encryption.ENCRYPT_KEYB[_keyIndex];
                    if (value != _tempValue) {
                        cc.log('作弊了');
                    }

                    // cc.log('----------value:' , value);
                    return value;
                },
                set: function (value: number) {
                    _keyIndex = MathUtils.randomInt(0, 7);
                    _value = value ^ Encryption.ENCRYPT_KEYB[_keyIndex];
                    _tempValue = value;
                }
            });
            obj[props[i]] = originValue;
        }
    }

    // /**
    //  * 为对象浮点类型属性添加加密
    //  * @param obj 
    //  * @param props 
    //  * @param defineUnexistProp 
    //  */
    // public static wrapFloatProp(obj: object, props: Array<string>, defineUnexistProp: boolean = false) {
    //     let originValue = 0;
    //     for (let i = props.length - 1; i >= 0; i--) {
    //         if (!defineUnexistProp && !obj.hasOwnProperty(props[i])) {
    //             continue;
    //         }
    //         let _keyIndex = 0;
    //         let _value = 0;
    //         let _tempValue = 0;
    //         originValue = obj[props[i]] || 0;
    //         Object.defineProperty(obj, props[i], {
    //             enumerable: true,
    //             configurable: true,
    //             get: function () {
    //                 let value = _value ^ Encryption.ENCRYPT_KEYB[_keyIndex];
    //                 if (value != _tempValue) {
    //                     cc.log('作弊了');
    //                 }
    //                 return value;
    //             },
    //             set: function (value: number) {
    //                 _keyIndex = MathUtils.randomInt(0, 7);
    //                 _value = value ^ Encryption.ENCRYPT_KEYB[_keyIndex];
    //                 _tempValue = value;
    //             }
    //         });
    //         obj[props[i]] = originValue;
    //     }
    // }

    public static wrapGlobalIntProp(props: Array<string>) {
        this.wrapIntProp(this.global, props, true);
    }

    // public static wrapGlobalFloatProp(props: Array<string>) {
    //     this.wrapFloatProp(this.global, props, true);
    // }

    public static unwrap(obj: object, props: Array<string>) {
        let originValue = null;
        for (let i = props.length - 1; i >= 0; i--) {
            originValue = obj[props[i]];
            Object.defineProperty(obj, props[i], {
                enumerable: true,
                configurable: true,
                value: obj[props[i]],
                writable: true
            });
        }
    }

    public static unwrapGlobal(props: Array<string>) {
        this.unwrap(this.global, props);
    }
}