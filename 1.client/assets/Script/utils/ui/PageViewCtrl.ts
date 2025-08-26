

import { BasePageCtrl } from "./BasePageCtrl";
import { PageView } from "./PageView";

/**
 * 标签页面板
 */
const { ccclass, property,menu } = cc._decorator;
@ccclass
@menu("Game/utls/PageViewCtrl")
export class PageViewCtrl extends BasePageCtrl {

    @property([PageView])
    pages: PageView[] = [];

    @property([cc.Prefab])
    pageNode:cc.Prefab[] = [];

    private _curPage:PageView;
    onLoad() {
        if (this.pageNode.length > 0) {

        }
    }

    init(data: any) {
        this._data = data.pageDatas;
        if (this.navigation) {
            this.navigation.init(this, data.navDatas);
        }
    }

    selectTap(index: number) {
        if (this._currIndex != -1 && this._currIndex == index) return;
        if (this._curPage) {
            this._curPage.hide();
            this._curPage = null;
        }

        this.initPage(index);
        let page = this.pages[index];
        if (!page) {
            return;
        }
        page.show(this._data ? this._data[index] : null);

        this._curPage = page;
        this._currIndex = index;
        if (this.navigation) {
            this.navigation.refreshNavState(index);
        }
    }

    refreshCurrTap() {

    }

    get curIndex(): number {
        return this._currIndex;
    }

    readyDestroy() {
        if (this._curPage) {
            this._curPage.hide();
        }

        this.pages.forEach(element => {
            if (element) {
                element.node.destroy();
            }
        });
    }

    private initPage(index:number) {
        if (!this.pages[index] && this.pageNode[index]) {
            let pageNode = cc.instantiate(this.pageNode[index]);
            if (pageNode) {
                this.node.addChild(pageNode);
                let page = pageNode.getComponent(PageView);
                this.pages[index] = page;
            }

        }
    }
}