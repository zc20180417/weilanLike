// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property } = cc._decorator;

@ccclass
export default class TowerStarLvUpPropItem extends cc.Component {

    @property(cc.Label)
    titleText: cc.Label = null;

    @property(cc.Label)
    currValue: cc.Label = null;

    @property(cc.Label)
    addValue: cc.Label = null;


    _currValue: number = 0;

    _addValue: number = 0;

    _step: number = 0;

    _tempValue: number = 0;

    _isFixed2: boolean = false;
    refresh(title: string, currValue: number, addValue: number, isfixd2: boolean = false) {
        this._isFixed2 = isfixd2;
        this.titleText.string = title;

        this._currValue = currValue;
        this._addValue = addValue;
        this.currValue.string = isfixd2 ? currValue.toFixed(2) : currValue.toString();

        this.addValue.node.active = Math.abs(addValue) < 0.01 ? false : true;

        let s = (addValue >= 0 ? "+" : "-");
        let v = isfixd2 ? Math.abs(addValue).toFixed(2) : Math.abs(addValue).toString();
        this.addValue.string = s + v;
    }

    startAni() {
        cc.tween(this.addValue.node)
            .to(0.15, { x: this.currValue.node.x })
            .call((node) => {
                node.active = false;
            })
            .start();

        cc.tween(this.currValue.node)
            .by(0.3, { scale: 0.2 })
            .by(0.3, { scale: -0.2 })
            .start();

        this.labelAni(this.currValue, this._addValue);
    }

    labelAni(label: cc.Label, num: number) {
        this._step = num / 5;
        this._tempValue = this._currValue;

        let tween = cc.tween()
            .call(() => {
                this._tempValue += this._step;
                this.currValue.string = this._isFixed2 ? this._tempValue.toFixed(2) : Math.floor(this._tempValue).toString();
            })
            .delay(0.06);

        cc.tween(label.node)
            .repeat(5, tween)
            .call(() => {
                this.currValue.string = this._isFixed2 ? (this._currValue + this._addValue).toFixed(2) : (this._currValue + this._addValue).toString();
            })
            .start();
    }
}
