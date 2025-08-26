// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { StringUtils } from "../utils/StringUtils";

const { ccclass, property, executeInEditMode } = cc._decorator;

@ccclass
@executeInEditMode
export default class FlexLabel extends cc.Component {
    @property(cc.Label)
    label: cc.Label = null;

    @property({
        min: 2,
    })
    maxNum: number = 5;

    @property
    _string: string = "flexlabel";

    @property
    get string(): string {
        return this._string;
    }

    set string(value: string) {
        value = value || "";
        if (value == this._string) return;
        this._string = value;
        this.onStringChange();
    }

    onLoad() {
        this.onStringChange();
    }

    private onStringChange() {
        if (this._string.length > this.maxNum) {
            this.label.string = this._string.substring(0, this.maxNum - 1) + "...";
        } else {
            this.label.string = this._string;
        }
    }
}
