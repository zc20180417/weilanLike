// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import NavItem from "./NavItem";
import { MathUtils } from "../../utils/MathUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Navigation extends cc.Component {

    @property(cc.Prefab)
    navItem: cc.Prefab = null;

    _currIndex: number = 0;

    _len: number = 0;

    navItems: Array<any> = [];



    public setData(data: any) {
        this._len = data;
    }

    init(data: any) {
        this._len = data;
        let navItemsLen = this.navItems.length;
        let i = 0;
        if (navItemsLen > this._len) {
            for (i = this._len ; i < navItemsLen ; i++) {
                (this.navItems[i] as cc.Node).active = false;
            }
        } else {
            for (i = navItemsLen; i < data; i++) {
                let nav = cc.instantiate(this.navItem);
                let navCom = nav.getComponent(NavItem);
                navCom.onUnselect();
                this.navItems.push(nav);
                this.node.addChild(nav);
            }
        }

        for (i = 0 ; i < data ; i++) {
            (this.navItems[i] as cc.Node).active = true;
        }
    }

    // public instantiateItems() {
    //     if (this.navItems.length > 0) return;
    //     for (let i = 0; i < this._len; i++) {
    //         let nav = cc.instantiate(this.navItem);
    //         let navCom = nav.getComponent(NavItem);
    //         navCom.onUnselect();
    //         this.navItems.push(nav);
    //     }
    // }

    // public addAllItems() {
    //     if (this.node.children.length > 0) return;
    //     for (let i = 0; i < this._len; i++) {
    //         let nav = this.navItems[i];
    //         this.node.addChild(nav);
    //     }
    // }

    selectIndex(index: number) {
        if (this._len < 1) return;
        index = MathUtils.clamp(index, 0, this._len - 1);
        let nav = this.navItems[this._currIndex];
        let navCom: NavItem = nav.getComponent(NavItem);
        navCom.onUnselect();
        this._currIndex = index;
        nav = this.navItems[this._currIndex];
        navCom = nav.getComponent(NavItem);
        navCom.onSelect();
    }

    selectNext() {
        this.selectIndex(this._currIndex + 1);
    }
}
