// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseItem from "../../utils/ui/BaseItem";
import TapView from "./TapView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TapPageItem extends BaseItem {

    _tapView: TapView = null;

    get tapView() {
        return this._tapView;
    }

    set tapView(value) {
        this._tapView = value;
    }

    private _initialized: boolean = false;
    get initialized(): boolean {
        return this._initialized;
    }
    set initialized(value: boolean) {
        this._initialized = value;
    }

    public init(...args) {
        
    }

    public refresh() {

    }
}
