// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;
import CustomPageNav from "./customPageNav"
import TowerStarNavItem from "./towerStarNavItem"
import { NodeUtils } from "../../utils/ui/NodeUtils";


@ccclass
export default class TowerStarNavigation extends CustomPageNav {

    @property(cc.Node)
    imgLayout: cc.Node = null;

    @property(cc.Node)
    txtLayout: cc.Node = null;

    @property(cc.Node)
    selectBg: cc.Node = null;

    _itemWidth: number = 0;

    _enableAutoScroll: boolean = true;

    _totalWidth: number = 0;

    init(data: any) {
        this._itemWidth = cc.winSize.width / data.data.length;
        this.selectBg.width = this._itemWidth;
        this._totalWidth = (data.data.length - 1) * this._itemWidth;

        super.init(data);

        this._target.node.on("scroll-ended", this.pageScrollEnd, this);
    }

    setAutoScroll(autoScroll: boolean) {
        this._enableAutoScroll = autoScroll;
    }

    refreshNavs() {

        this._navItems = this._navItems || [];
        let pageLen = this._navItems.length;
        let dataLen = this._navDatas.length;

        if (pageLen > dataLen) {//删除多余的导航项
            let tempArr = this._navItems.splice(dataLen, pageLen - dataLen);
            tempArr.forEach(node => node.destroy());
        }
        let i = 0;
        while (i < dataLen) {//更新页面数据
            if (this._navItems[i]) {
                let navItemCom: TowerStarNavItem = this._navItems[i].getComponent("towerStarNavItem");
                navItemCom.setData(this._navDatas[i]);
                navItemCom.refresh();
            } else {
                let navItem = cc.instantiate(this.navItem);
                this.addItem(navItem, i);
            }
            i++;
        }
    }

    refreshNav(pageIndex: number) {
        let navItemCom = this._navItems[pageIndex].getComponent("towerStarNavItem");
        navItemCom.setData(this._navDatas[pageIndex]);
        navItemCom.refresh();
    }

    addItem(navItem: cc.Node, index: number) {
        this._navItems.push(navItem);
        let navItemCom: TowerStarNavItem = navItem.getComponent("towerStarNavItem");
        let node = navItemCom.getImgRoot();
        node.width = this._itemWidth;
        this.imgLayout.addChild(node);
        node = navItemCom.getTxtRoot();
        node.width = this._itemWidth;
        node.removeFromParent();
        this.txtLayout.addChild(node);

        navItemCom.setTarget(this);
        navItemCom.setData(this._navDatas[index],index);
        navItemCom.refresh();
    }

    update(dt) {
        if (this._enableAutoScroll) {
            this.autoScroll();
        }
    }

    autoScroll() {
        let percent = this._target.getPercentage();
        // cc.log(percent);
        this.selectBg.x = -cc.winSize.width * 0.5 + percent * this._totalWidth;
        this.updateNavigationLab();
    }

    updateNavigationLab(){
        let percent=this._target.getPercentage();
        let idx=percent*(this._navDatas.length-1);
        let idxFloor=Math.floor(idx);
        let idxCeil=Math.ceil(idx);
        let item:cc.Node;
        let selectBgBox=this.selectBg.getBoundingBox();
        let itemBox;
        item=this._navItems[idxFloor];
        itemBox=item.getBoundingBox();
        item.getComponent("towerStarNavItem").updateColor(Math.abs(selectBgBox.x-itemBox.x)/this._itemWidth);
        item=this._navItems[idxCeil];
        itemBox=item.getBoundingBox();
        item.getComponent("towerStarNavItem").updateColor(Math.abs(selectBgBox.x-itemBox.x)/this._itemWidth);
    }

    pageScrollEnd() {
        this._enableAutoScroll = true;
    }

    changeNavigationState(pageIndex: number) {
        if (this._selectedIndex == pageIndex) return;
        let tox = -cc.winSize.width *0.5 + pageIndex * this._itemWidth;
        if (Math.abs(pageIndex - this._selectedIndex) == 1) {
            NodeUtils.to(this.selectBg , 0.1 , {x:tox} , "cubicOut");
        } else {
            this.selectBg.x=tox;
        }
        this._enableAutoScroll=false;
        this._navItems[this._target.getLastIndex()].getComponent("towerStarNavItem").updateColor(1);
        this._navItems[pageIndex].getComponent("towerStarNavItem").updateColor(0);
        this._selectedIndex=pageIndex;
    }
}
