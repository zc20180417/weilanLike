// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import CustomPageNav from "./customPageNav";
import { EventEnum } from "../../common/EventEnum";
import { GameEvent } from "../../utils/GameEvent";
import HornTips from "../HornTips";



const { ccclass, property } = cc._decorator;

const SCROLLDIR = {
    LEFT: 0,
    RIGHT: 1
}


@ccclass
export default class RecyclePageView extends cc.PageView {

    @property(cc.Node)
    navigationNode: cc.Node = null;//导航节点

    @property(cc.Prefab)
    pageItem: cc.Prefab = null;//页面预制体

    @property(cc.Node)
    viewNode: cc.Node = null;


    _navigation: CustomPageNav = null;//导航组件

    pages: Array<cc.Node> = [];//所有实例化页面

    _pageDatas: Array<any> = null;//页面数据

    _navDatas: Array<any> = null;//导航条数据

    _maxPageCount: number = 3;//使用三个页面循环利用

    _currRealPageIndex: number = 0;//当前真实的页面下标

    _lastIndex: number = 0;

    tempPage: cc.Node = null;

    _pageWidth: number = 0;

    _tapLastIndex: number = 0;

    _clickTap: boolean = true;

    /**
     * overwrite
     * @param idx 
     * @param timeInSecond 
     */
    scrollToPage(idx, timeInSecond) {
        if (idx < 0) return;
        this._lastIndex = this.getCurrentPageIndex();
        let index = idx;
        if (idx == 2 && this._lastIndex != 2) {//向右翻页
            this._currRealPageIndex++;
            if (this._currRealPageIndex !== this._pageDatas.length - 1) {
                this.recycleFirstPage();
                this.refreshPage(this.findPageByRealIndex(this._currRealPageIndex + 1), this._currRealPageIndex + 1);
                index = idx - 1;
            }
        } else if (idx == 0 && this._lastIndex != 0) {//向左翻页
            --this._currRealPageIndex;
            if (this._currRealPageIndex !== 0) {
                this.recycleLastPage();
                this.refreshPage(this.findPageByRealIndex(this._currRealPageIndex - 1), this._currRealPageIndex - 1);
                index = idx + 1;
            }
        }
        else {
            this._currRealPageIndex += idx - this.getCurrentPageIndex();
        }
        super.scrollToPage(index, timeInSecond);
        if(this._clickTap){
            this._clickTap=false;
        }else{
            this._tapLastIndex=this._currRealPageIndex;
        }
        this.onPageTuring(this);
        // this.refreshPage(this._currRealPageIndex);


    }

    recycleFirstPage() {
        this.addPage(this.tempPage);
        let page = this.getPages()[0];
        this.removePageAtIndex(0);
        this.tempPage = page;
        this.content.x += page.width;
    }

    recycleLastPage() {
        this.insertPage(this.tempPage, 0);
        let page = this.getPages()[3];
        this.removePageAtIndex(3);
        // this.insertPage(page,0);
        this.tempPage = page;
        this.content.x -= page.width;
    }

    /**
     * 通过标签选择页面
     * @param index 
     */
    selectPageByTap(index: number) {
        if (this._currRealPageIndex == index) return;
        this._tapLastIndex = this._currRealPageIndex;
        this._clickTap=true;
        let dir = index - this._currRealPageIndex > 0 ? SCROLLDIR.RIGHT : SCROLLDIR.LEFT;
        let idx = this.getCurrentPageIndex();
        let toIndx;
        if (index == 0 && idx != 1) {

            this.recycleFirstPage();

        } else if (index == this._pageDatas.length - 1 && idx != 1) {

            this.recycleLastPage();

        }
        toIndx = (dir == SCROLLDIR.RIGHT ? 2 : 0);
        this._currRealPageIndex = (dir == SCROLLDIR.RIGHT ? index - 1 : index + 1);
        this.scrollToPage(toIndx, 0.3);
        this.refreshPages();
    }

    init(data: any) {
        //使用三个页面循环利用
        for (let i = 0; i < this._maxPageCount; i++) {
            let page = cc.instantiate(this.pageItem);
            this.addPage(page);
        }
        this.tempPage = cc.instantiate(this.pageItem);

        this._pageWidth = this.tempPage.width;

        this._currRealPageIndex = 0;

        this.setDatas(data);
        this.refreshPages();

        this._navigation = this.navigationNode.getComponent(CustomPageNav);
        this._navigation.init({ target: this, data: this._navDatas });

        // this.node.on("page-turning", this.onPageTuring, this);
        GameEvent.emit(EventEnum.REFRESH_PAGE, this._currRealPageIndex);
    }

    /**
     * 设置所有页面数据
     * @param data 
     */
    setDatas(data: any) {
        this._pageDatas = data.pageDatas;
        this._navDatas = data.navDatas;
    }


    /**
     * 刷新页面数据
     * @param page
     */
    refreshPage(page, index) {

    }

    /**
     * 刷新所有页面数据
     */
    refreshPages() {
        let start, end;
        if (this._currRealPageIndex == 0) {
            start = 0;
            end = start + 2;
        } else if (this._currRealPageIndex == this._pageDatas.length - 1) {
            end = this._pageDatas.length - 1;
            start = end - 2;
        } else {
            start = this._currRealPageIndex - 1;
            end = start + 2;
        }
        this.refreshPageByRange(start, end);
    }

    /**
     * 刷新start-end范围的页面
     * @param start 
     * @param end 
     */
    refreshPageByRange(start, end) {
        for (let i = start; i <= end; i++) {
            this.refreshPage(this.findPageByRealIndex(i), i);
        }
    }

    /**
     * 通过下标找到页面
     * @param idx 
     */
    findPageByRealIndex(idx) {
        let index = this.getCurrentPageIndex();
        let deta = idx - this._currRealPageIndex;
        let pages = this.getPages();
        return pages[index + deta];
    }

    /**
     * 翻页事件
     * @param pageView  
     */
    onPageTuring(pageView: cc.PageView) {
        // this._navigation.changeNavigationState(this._currRealPageIndex);
        this.refreshPage(this.findPageByRealIndex(this._currRealPageIndex), this._currRealPageIndex);
        GameEvent.emit(EventEnum.REFRESH_PAGE, this._currRealPageIndex);
    }


    /**
     * 获取当前页面位置占总页面的百分比
     */
    getPercentage(): number {
        let deta = this.getLeftBoundaryDeta() + this._currRealPageIndex * this._pageWidth;
        let totalLen = (this._pageDatas.length - 1) * this._pageWidth;
        return this.clamp(deta / totalLen, 0, 1);
    }

    clamp(value: number, min: number, max: number) {
        if (value < min) value = min;
        else if (value > max) value = max;
        return value;
    }

    /**
     * 获取视图与当前页面左边界的距离
     */
    getLeftBoundaryDeta() {
        let currPage = this.findPageByRealIndex(this._currRealPageIndex);
        let pageWorldBox = currPage.getBoundingBoxToWorld();
        let viewBox = this.viewNode.getBoundingBox();
        let worldPos = this.viewNode.parent.convertToWorldSpaceAR(cc.v2(viewBox.x, viewBox.y));
        if (Math.abs(worldPos.x - pageWorldBox.x) < 0.001) return 0;
        return worldPos.x - pageWorldBox.x;
    }

    getLastIndex(): number {
        return this._tapLastIndex;
    }

}
