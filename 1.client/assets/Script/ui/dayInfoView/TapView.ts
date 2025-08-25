// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


import { EResPath } from "../../common/EResPath";
import { Handler } from "../../utils/Handler";
import { MathUtils } from "../../utils/MathUtils";
import ResManager from "../../utils/res/ResManager";
import { BasePageCtrl } from "../../utils/ui/BasePageCtrl";
import TapPageItem from "./TapPageItem";

const { ccclass, property } = cc._decorator;

export interface TapViewData {
    pageDatas?: any[];
    navDatas?: any[];
}

@ccclass
export default class TapView extends BasePageCtrl {

    public static EventType = {
        ON_SELECT_FIRST: "on-select-first",
        ON_SELECT_LAST: "on-select-last",
        ON_SELECT_TAB: 'on-select-tab'
    }

    @property([cc.Prefab])
    pageItem: [cc.Prefab] = [null];

    @property(cc.Node)
    content: cc.Node = null;

    @property({
        tooltip: '是否使用配置表'
    })
    useConfig: boolean = false;

    @property({
        tooltip: "配置字段名称"
    })
    configName: string = "";

    private _pages: Array<cc.Node> = [];
    private _config: string[] = null;
    private _loadHanler: Handler = null;
    // private _isLoading: boolean = false;
    private _currLoadingPath: string = "";
    private _currArgs: any = null;
    protected onLoad(): void {
        this._loadHanler = Handler.create(this._onTapViewLoaded, this);
    }

    onDestroy() {
        for (let i = 0, len = this._pages.length; i < len; i++) {
            if (this._currIndex == i) {
                continue;
            } else if (this._pages[i]) {
                this._pages[i].isValid && this._pages[i].destroy();
                this.useConfig && ResManager.instance.decRef(this._config[i]);
            }
        }
        Handler.dispose(this);
    }

    public init(data: any) {
        this._data = data.pageDatas;
        if (this.useConfig) {
            //使用配置表
            let cfg = ResManager.instance.getCfg(EResPath.TAB_VIEW_CFG);
            this._config = (cfg && cfg[this.configName]) || [];
        } else {
            for (let i = 0; i < this.pageItem.length; i++) {
                if (!this._data[i]) {
                    this._pages.push(null);
                    continue;
                }

                let page = cc.instantiate(this.pageItem[i]);
                let pageCom = page.getComponent(TapPageItem);
                pageCom.setData(this._data[i], i);
                //pageCom.refresh();
                pageCom.tapView = this;
                this._pages.push(page);
            }
        }
        this.navigation && this.navigation.init(this, data.navDatas);
    }



    public selectPreTap(...args) {
        let index = this.getFirstNoNullPageIndex(MathUtils.clamp(this._currIndex - 1, 0, this._data.length - 1), 0);
        if (index !== -1 && index !== this._currIndex) {
            // this.node.emit(TapView.EventType.ON_SELECT_FIRST);
            this.selectTap(index, ...args);
        }
    }

    public selectNextTap(...args) {
        let index = this.getFirstNoNullPageIndex(MathUtils.clamp(this._currIndex + 1, 0, this._data.length - 1), this._data.length - 1);
        if (index !== -1 && index !== this._currIndex) {
            // this.node.emit(TapView.EventType.ON_SELECT_LAST);
            this.selectTap(index, ...args);
        }
    }

    public selectFirstTap(...args) {
        let index = this.getFirstNoNullPageIndex(0, this._data.length - 1);
        if (index != -1) {
            this.selectTap(index, ...args);
        }
    }

    public selectTap(index: number, ...args) {
        if (index < 0 ||
            index >= this._data.length ||
            (this._currIndex != -1 && this._currIndex == index)) return;

        if (this.useConfig) {
            this._asyncSelectTap(index, ...args);
        } else {
            this._syncSelectTap(index, ...args);
        }
    }

    private _syncSelectTap(index: number, ...args) {
        this.content.removeAllChildren();
        let page = this._pages[index];
        if (!page) return;
        this.content.addChild(page);
        let pageCom = page.getComponent(TapPageItem);
        this.checkPageInitialized(pageCom,...args);
        pageCom.refresh();
        this._currIndex = index;
        this.navigation && this.navigation.refreshNavState(index);

        let i = this.getFirstNoNullPageIndex(MathUtils.clamp(index + 1, 0, this._data.length - 1), this._data.length - 1);
        if (i === -1 || i === index) {
            this.node.emit(TapView.EventType.ON_SELECT_LAST);
        }
        i = this.getFirstNoNullPageIndex(MathUtils.clamp(index - 1, 0, this._data.length - 1), 0);
        if (i === -1 || i === index) {
            this.node.emit(TapView.EventType.ON_SELECT_FIRST);
        }

        this.node.emit(TapView.EventType.ON_SELECT_TAB, index);
    }

    private _asyncSelectTap(index: number, ...args) {
        if (!this._data[index]) return;
        if (this._pages[index]) {
            this._syncSelectTap(index, ...args);
        } else {
            if (this._currLoadingPath) {
                ResManager.instance.removeLoad(this._currLoadingPath, this._loadHanler);
            }
            this._currArgs = args;
            ResManager.instance.loadRes(this._config[index], cc.Prefab, this._loadHanler);
            this._currLoadingPath = this._config[index];
        }
    }

    private _onTapViewLoaded(prefab, path) {
        ResManager.instance.addRef(path);
        this._currLoadingPath = "";
        let index = this._config.indexOf(path);
        let page = cc.instantiate(prefab);
        let pageCom = page.getComponent(TapPageItem);
        pageCom.setData(this._data[index], index);
        //pageCom.refresh();
        pageCom.tapView = this;
        this._pages[index] = page;
        this._syncSelectTap(index, ...this._currArgs);
        this._currArgs = null;
    }

    public refreshCurrTap(data?: any) {
        let page = this._pages[this._currIndex];
        if (!page) return;
        let pageCom = page.getComponent(TapPageItem);
        if (data) {
            pageCom.setData(data);
        }
        // this.checkPageInitialized(pageCom);
        pageCom.refresh();
    }

    get curIndex(): number {
        return this._currIndex;
    }

    readyDestroy() {
        this._pages.forEach(element => {
            element && element.destroy();
        });
    }

    getPages(): cc.Node[] {
        return this._pages;
    }

    getSize() {
        return this._data.length;
    }

    addPage(pageData: any = {}, navData: any = {}) {
        let len = this._data.length;
        if (len < this.pageItem.length) {
            this.navigation && this.navigation.addNavItem(navData);
            this._data.push(pageData);

            if (!this.useConfig) {
                let page = cc.instantiate(this.pageItem[len]);
                let pageCom = page.getComponent(TapPageItem);
                pageCom.setData(pageData, len);
                //pageCom.refresh();
                pageCom.tapView = this;
                this._pages[len] = page;
            }
        }
    }

    public insertPage(index, pageData: any = {}, navData: any = {}) {
        if (index < 0 || index >= this._data.length) return;
        let page: cc.Node;
        let pageCom: TapPageItem;
        if (this._pages[index]) {
            pageCom = this._pages[index].getComponent(TapPageItem);
            pageCom.refresh();
            return;
        }

        this._data[index] = pageData;
        this.navigation && this.navigation.insertNavItem(index, navData);
        if (!this.useConfig) {
            page = cc.instantiate(this.pageItem[index]);
            pageCom = page.getComponent(TapPageItem);
            pageCom.setData(this._data[index], index);
            pageCom.tapView = this;
            this._pages[index] = page;
        }
    }

    public removePage(index: number) {
        if (index < 0 || index >= this._data.length || !this._pages[index]) return;
        if (this._pages[index]) {
            this._pages[index].removeFromParent();
            this._pages[index].destroy();
            this._pages[index] = null;
            this._data[index] = null;
        }

        this.navigation && this.navigation.removeNavItem(index);

        let nextIndex = this.getFirstNoNullPageIndex(MathUtils.clamp(index + 1, 0, this._data.length - 1), this._data.length - 1);
        if (nextIndex == -1) {
            nextIndex = this.getFirstNoNullPageIndex(MathUtils.clamp(index - 1, 0, this._data.length - 1), 0);
        }

        if (nextIndex != -1) {
            this.selectTap(nextIndex);
        }
    }

    private getFirstNoNullPageIndex(start: number, end: number) {
        let index = -1;
        if (start > end) {
            for (let i = start; i >= end; i--) {
                if (this._data[i]) {
                    index = i;
                    break;
                }
            }
        } else {
            for (let i = start; i <= end; i++) {
                if (this._data[i]) {
                    index = i;
                    break;
                }
            }
        }
        return index;
    }

    private checkPageInitialized(pageCom: TapPageItem, ...args) {
        if (!pageCom.initialized) {
            pageCom.init(...args);
            pageCom.initialized = true;
        }
    }
}
