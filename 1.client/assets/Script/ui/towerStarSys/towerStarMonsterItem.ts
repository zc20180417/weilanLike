// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseItem from "../../utils/ui/BaseItem";
// import TowerStarPageItem from "./towerStarPageItem"
const {ccclass, property} = cc._decorator;

@ccclass
export default class TowerStarMonsterItem extends BaseItem {

    refresh() {
        
    }


    onClick() {
        // this._target.selectIndex(this._index);
        
    }

}
