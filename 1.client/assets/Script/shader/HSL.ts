// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Shader from "../Shader";




const { ccclass, property, executeInEditMode, menu } = cc._decorator;

@ccclass
@executeInEditMode
@menu("Shader/HSL")
export default class HSL extends Shader {
    @property
    _h: number = 0;

    @property({
        min: -180,
        max: 180,
        slide: true,
        displayName: "H (色相)"
    })
    get h() {
        return this._h;
    }

    set h(value: number) {
        this._h = value;
        this.setProperty("u_h", this._h);
    }

    @property
    _s: number = 0;

    @property({
        min: -100,
        max: 100,
        slide: true,
        displayName: "S (饱和度)"
    })
    get s() {
        return this._s;
    }

    set s(value: number) {
        this._s = value;
        this.setProperty("u_s", this._s * 0.01);
    }

    @property
    _l: number = 0;

    @property({
        min: -100,
        max: 100,
        slide: true,
        displayName: "L (亮度)"
    })
    get l() {
        return this._l;
    }

    set l(value: number) {
        this._l = value;
        this.setProperty("u_l", this._l * 0.01);
    }

    @property(cc.Color)
    private _color: cc.Color = cc.Color.WHITE;

    @property({
        type: cc.Color,
    })
    get color(): cc.Color {
        return this._color;
    }
    set color(value: cc.Color) {
        this._color = value;
        this.setProperty("u_color", this._color);
    }

    @property
    private _gray: boolean = true;

    @property({
        displayName: "Gray (置灰)"
    })
    get gray(): boolean {
        return this._gray;
    }
    set gray(value: boolean) {
        this._gray = value;
        this.define("USE_GRAY", this._gray);
    }

    @property
    private _brightness: number = 0;
    @property
    public get brightness(): number {
        return this._brightness;
    }
    public set brightness(value: number) {
        this._brightness = value;
        this.setProperty("u_brightness", this._brightness);
    }

    protected onEnable(): void {
        this.setProperty("u_h", this._h);
        this.setProperty("u_s", this._s * 0.01);
        this.setProperty("u_l", this._l * 0.01);
        this.setProperty("u_color", this._color);
        this.brightness = 0;
        this.gray = this._gray;
    }
}
