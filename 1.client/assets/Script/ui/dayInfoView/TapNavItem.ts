// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseItem from "../../utils/ui/BaseItem";
import TapNavigation from "./TapNavigation";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TapNavItem extends BaseItem {

    _target: TapNavigation = null;

    setTarget(target: TapNavigation) {
        this._target = target;
    }

    refresh() {
       
    }

    onSelect() {
        
    }

    unSelect() {
        
    }

    onClick() {
        this._target.onItemClick(this.index);
    }
}
