// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class WaveShader extends cc.Component {

    _mat: cc.Material = null;

    _time: number = 0;

    _offsetX: number = 0;

    _sp: cc.Sprite = null;

    onLoad() {
        this._sp = this.node.getComponent(cc.Sprite);
        this._mat = this._sp.getMaterial(0);
        this._mat.setProperty("width", this.node.width);
        this._mat.setProperty("height", this.node.height);
    }

    update(dt) {
        this._time += dt;
        this._mat.setProperty("time", this._time);
    }
}
