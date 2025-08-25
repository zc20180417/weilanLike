// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


import TapNavItem from "./TapNavItem";
import { BasePageCtrl } from "../../utils/ui/BasePageCtrl";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TapNavigation extends cc.Component {

    _data: any = null;
    _target: BasePageCtrl = null;

    @property(cc.Prefab)
    item: cc.Prefab = null;

    _itmes: Array<cc.Node> = [];

    _currIndex: number = 0;

    get itemLength() {
        let len = 0;
        for (const item of this._itmes) {
            if (item) len++;
        }
        return len;
    }

    init(target: BasePageCtrl, data: any) {
        this._data = data;
        this._target = target;
        for (let i = 0; i < this._data.length; i++) {
            if (!this._data[i]) {
                this._itmes.push(null);
                continue;
            }
            let item = cc.instantiate(this.item);
            let itemCom = item.getComponent(TapNavItem);
            itemCom.setData(this._data[i], i);
            itemCom.setTarget(this);
            itemCom.refresh();
            itemCom.unSelect();
            this.node.addChild(item);
            item.zIndex = i;
            this._itmes.push(item);
        }
    }

    refreshNavState(index: number) {
        let item = this._itmes[this._currIndex];
        let itemCom = null;
        if (item) {
            itemCom = item.getComponent(TapNavItem);
            itemCom.unSelect();
        }
        item = this._itmes[index];
        itemCom = item.getComponent(TapNavItem);
        itemCom.onSelect();
        this._currIndex = index;
    }

    onItemClick(index: number) {
        this._target.selectTap(index);
    }

    /**
     * 获取导航条item
     * @param index 
     * @returns 
     */
    public getNavItem(index: number): cc.Node {
        if (index >= this._itmes.length) return null;
        return this._itmes[index];
    }

    /**
     * 获取导航条itemCom
     * @param index 
     * @returns 
     */
    public getNavItemCom(index: number): TapNavItem {
        if (index >= this._itmes.length) return null;
        return this._itmes[index].getComponent(TapNavItem);
    }

    addNavItem(data: any) {
        let len = this._data.length;
        this._data.push(data);
        let item = cc.instantiate(this.item);
        let itemCom = item.getComponent(TapNavItem);
        itemCom.setData(data, len);
        itemCom.setTarget(this);
        itemCom.refresh();
        itemCom.unSelect();
        this.node.addChild(item);
        item.zIndex = len;
        this._itmes[len] = item;
    }

    public removeNavItem(index: number) {
        if (index < 0 || index >= this._data.length) return;
        if (this._itmes[index]) {
            this._itmes[index].removeFromParent();
            this._itmes[index].destroy();
            this._itmes[index] = null;
        }
    }

    public insertNavItem(index, data: any = {}) {
        if (index < 0 || index >= this._data.length || this._itmes[index]) return;
        this._data[index] = data;
        let item = cc.instantiate(this.item);
        let itemCom = item.getComponent(TapNavItem);
        itemCom.setData(data, index);
        itemCom.setTarget(this);
        itemCom.refresh();
        itemCom.unSelect();
        this.node.addChild(item);
        item.zIndex = index;
        this._itmes[index] = item;
    }
}
