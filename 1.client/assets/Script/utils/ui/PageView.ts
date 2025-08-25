/**
 * 标签页面板里的标签页
 */
const { ccclass, property } = cc._decorator;
@ccclass
export class PageView extends cc.Component {

    protected _pageData:any;

    /**释放 */
    onDestroy() {
        this.removeEvent();
    }

    /**标签页显示，在pageViewCtrl里调用 */
    show(data:any) {
        this._pageData = data;
        this.addEvent();
        this.node.active = true;
        this.doShow();
    }

    /**标签页关闭，在pageViewCtrl里调用 */
    hide() {
        this.node.active = false;
        this.doHide();
        this.removeEvent();
        this._pageData = null;
    }

    /**子类继承，标签页面板显示 */
    protected doShow() {

    }
    /**子类继承，标签页面板关闭 */
    protected doHide() {

    }
    /**子类继承，添加事件 */
    protected addEvent() {

    }
    /**子类继承，移除事件 */
    protected removeEvent() {

    }


}