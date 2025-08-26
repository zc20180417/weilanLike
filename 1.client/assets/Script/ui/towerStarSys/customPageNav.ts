// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

import CustomPageView from "./customPageView"
import BaseItem from "../../utils/ui/BaseItem"
import TowerStarPageView from "./towerStarPageView";
import RecyclePageView from "./RecyclePageView";

interface NavData {
    target: CustomPageView;
    data: any;
}



@ccclass
export default class CustomPageNav extends cc.Component {

    @property(cc.Prefab)
    navItem: cc.Prefab = null;

    _navItems: Array<cc.Node> = null;

    _target: RecyclePageView = null;//目标滚动页面视图

    _navDatas: Array<any> = null;

    _selectedIndex: number = 0;

    _initIndex:number = 0;

    init(data: any) {
        this._target = data.target;
        this._navDatas = data.data;
        this.refreshNavs();
        // this.selectIndex(this._initIndex);
    }

    setTarget(target: RecyclePageView) {
        this._target = target;
    }

    setDatas(navDatas: any) {
        this._navDatas = navDatas;
    }

    /**
     * 设置某页导航条数据
     * @param pageIndex 
     * @param data 
     */
    setData(pageIndex: number, data: any) {
        this._navDatas[pageIndex] = data;
    }

    /**
     * 刷新某页导航条
     * @param pageIndex 
     */
    refreshNav(pageIndex: number) {

    }

    /**
     * 刷新所有导航条数据
     */
    refreshNavs() {

    }

    /**
     * 通过导航条选中page
     * @param pageIndex 页面下标
     */
    selectIndex(pageIndex: number) {
        // let pageView = this._target;
        
        // let dx:number = 0;
        // if (this._selectedIndex != -1 && Math.abs(this._selectedIndex - pageIndex) > 1) { 
        //     dx = this._selectedIndex > pageIndex ? 1 : -1;
        //     pageView.content.x = -(pageIndex * 1216 + 1216 * dx) - 608;
        // }

        // pageView.setCurrentPageIndex(pageIndex);
        this._target.selectPageByTap(pageIndex);
        this.changeNavigationState(pageIndex);
    }

    /**
     * 改变导航条的状态
     * @param pageIndex 页面下标
     */
    changeNavigationState(pageIndex: number) {
        // if (this._selectedIndex == pageIndex) return;
        // let currNavItemCom:BaseItem;
        // if (this._selectedIndex != -1) {
        //     currNavItemCom = this._navItems[this._selectedIndex].getComponent(BaseItem);
        //     currNavItemCom.selected = false;
        // }
        // currNavItemCom=this._navItems[pageIndex].getComponent(BaseItem);
        // currNavItemCom.selected = true;
        // this._selectedIndex=pageIndex;

    }

    getSelectIndex():number{
        return this._selectedIndex;
    }


}
