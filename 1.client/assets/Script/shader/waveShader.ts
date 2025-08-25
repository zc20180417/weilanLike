// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class WaveShader extends cc.Component {

    @property
    offsetX: number = 0.002;
    @property
    offsetY: number = 0.002;

    _mat: cc.Material = null;

    _time: number = 0;

    _offsetX: number = 0;

    _sp: cc.Sprite = null;

    onLoad() {
        this._sp = this.node.getComponent(cc.Sprite);
        this._mat = this._sp.getMaterial(0);
    }

    update(dt) {
        this._time += dt;
        this._mat.setProperty("time", this._time);
        this._mat.setProperty("mapOffsetX", this._offsetX);
        this._mat.setProperty("offsetX", this.offsetX);
        this._mat.setProperty("offsetY", this.offsetY);
    }

    setOffsetX(offsetX: number) {
        this._offsetX = offsetX;
    }
}
