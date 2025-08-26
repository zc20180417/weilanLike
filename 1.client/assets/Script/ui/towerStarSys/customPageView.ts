// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

import CustomPageNav from "./customPageNav"

interface PageViewData {
    pageDatas: any;
    navDatas: any;
}

@ccclass
export default class CustomPageView extends cc.Component {

    @property(cc.PageView)
    pageView: cc.PageView = null;//页面视图

    @property(cc.Node)
    navigationNode: cc.Node = null;//导航节点

    @property(cc.Prefab)
    pageItem: cc.Prefab = null;//页面预制体

    _navigation: CustomPageNav = null;//导航组件

    _navComName: string = "";//导航组件的名称


    pages: Array<cc.Node> = [];//所有实例化页面

    _pageDatas: Array<any> = null;//页面数据

    _navDatas: Array<any> = null;//导航条数据

    _maxPageCount: number = 3;//使用三个页面循环利用

    _currRealPageIndex: number = 0;//当前真实的页面下标

    _lastIndex: number = 0;

    init(data: PageViewData) {
        // //重写scrollToPage
        // this.pageView.scrollToPage=function(idx, timeInSecond) {
        //     if(!this.tempPage)this.tempPage=cc.instantiate(this.getPages()[0]);
        //     if (idx == 2) {
        //         this.addPage(this.tempPage);
        //         let page = this.getPages()[0];
        //         this.removePageAtIndex(0);
        //         this.tempPage=page;
        //         this.content.x += 400;
        //         super.scrollToPage(idx - 1, timeInSecond);
        //     } else if (idx == 0) {
        //         this.insertPage(this.tempPage,0);
        //         let page=this.getPages()[3];
        //         this.removePageAtIndex(3);
        //         // this.insertPage(page,0);
        //         this.tempPage=page;
        //         this.content.x-=400;
        //         super.scrollToPage(idx+1,timeInSecond);
        //     }
        //     else {
        //         super.scrollToPage(idx, timeInSecond);
        //     }
        // }
        this.setDatas(data);
        // this._currRealPageIndex = 0;
        this._navigation = this.navigationNode.getComponent(CustomPageNav);
        this._navigation.init({ target: this, data: this._navDatas });

        this.node.on("page-turning", this.onPageTuring, this);

        // for (let i = 0; i < this._maxPageCount; i++) {
        //     let page = cc.instantiate(this.pageItem);
        //     // this.pages.push(page);
        //     this.pageView.addPage(page);
        // }
    }

    getPageView(): cc.PageView {
        return this.pageView;
    }

    /**
     * 设置所有页面数据
     * @param data 
     */
    setDatas(data: PageViewData) {
        this._pageDatas = data.pageDatas;
        this._navDatas = data.navDatas;
        this.refreshPages();
    }

    /**
     * 设置某页的数据
     * @param pageIndex 
     * @param data 
     */
    setData(pageIndex: number, data: any) {
        this._pageDatas[pageIndex] = data;
        this.refreshPage(pageIndex);
    }

    /**
     * 翻页事件
     * @param pageView  
     */
    onPageTuring(pageView: cc.PageView) {
        let pageIndex: number = pageView.getCurrentPageIndex();
        // if (pageIndex == 0) {//向左翻页
        //     this._currRealPageIndex--;
        //     if (this._currRealPageIndex > 0) {
        //         this.leftPageTurn();
        //     }
        // } else if (pageIndex == 2) {//向右翻页
        //     this._currRealPageIndex++;
        //     if (this._currRealPageIndex < this._pageDatas.length - 1) {
        //         this.rightPageTurn();
        //     }
        // } else if (this._lastIndex == 2) {
        //     this._currRealPageIndex--;
        // } else if (this._lastIndex == 0) {
        //     this._currRealPageIndex++;
        // }

        // this._lastIndex = pageIndex;

        this._navigation.changeNavigationState(pageIndex);
        this.refreshPage(pageIndex);
    }

    // leftPageTurn() {
    //     let lastPage = this.pageView.getPages()[2];
    //     this.pageView.removePageAtIndex(2);
    //     this.pageView.insertPage(lastPage, 0);
    //     this.pageView.scrollToPage(1, 0);
    //     this.refreshPage(this._currRealPageIndex-1);
    // }

    // rightPageTurn() {
    //     let firstPage = this.pageView.getPages()[0];
    //     this.pageView.removePageAtIndex(0);
    //     this.pageView.insertPage(firstPage, 2);
    //     this.pageView.scrollToPage(1, 0);
    //     this.refreshPage(this._currRealPageIndex+1);
    // }



    /**
     * 刷新页面数据
     * @param pageIndex 页面下标
     */
    refreshPage(pageIndex: number) {
        
    }

    /**
     * 刷新所有页面数据
     */
    refreshPages() {

    }

    onDestroy() {
        this.node.off("page-turing", this.onPageTuring, this);
    }

}
