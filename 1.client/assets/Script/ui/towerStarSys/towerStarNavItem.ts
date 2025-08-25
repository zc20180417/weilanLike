// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseItem from "../../utils/ui/BaseItem";
import TowerStarNavigation from "./towerStarNavigation"
import HornTips from "../HornTips";
const { ccclass, property } = cc._decorator;

@ccclass
export default class TowerStarNavItem extends BaseItem {

    @property(cc.Node)
    imgLayoutRoot: cc.Node = null;

    @property(cc.Node)
    txtLayoutRoot: cc.Node = null;


    @property(cc.Label)
    selectLab: cc.Label = null;

    @property(cc.Label)
    unselectLab: cc.Label = null;

    _target: TowerStarNavigation = null;//导航条

    setTarget(target: any) {
        this._target = target;
    }

    refresh() {
        this.selectLab.string = this.data.name;
        this.unselectLab.string = this.data.name;
    }

    onSelect() {

    }

    unSelect() {

    }

    updateColor(percent: number) {
        this.selectLab.node.opacity=(1-percent)*255;
        this.unselectLab.node.opacity=percent*255;
    }

    onClick() {
        let index = this.index;
        this._target.selectIndex(index);
    }

    getImgRoot(): cc.Node {
        return this.imgLayoutRoot;
    }

    getTxtRoot(): cc.Node {
        return this.txtLayoutRoot;
    }

}
