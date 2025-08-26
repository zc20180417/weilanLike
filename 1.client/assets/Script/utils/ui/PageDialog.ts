import Dialog from "./Dialog";
import { PageViewCtrl } from "./PageViewCtrl";

const { ccclass, property } = cc._decorator;
@ccclass
export class PageDialog extends Dialog {

    @property(PageViewCtrl)
    pageCtrl:PageViewCtrl = null;


    protected _index: number = 0;
    protected _pageDatas:any;

    /**
     * 初始化标签页数据
     */
    protected initPageDatas() {
        //test
        /*
        let data = {
            pageDatas: [
                {},
                {},
            
            ],
            navDatas: [
                {},
                {},
            
            ]
        }
        */
    }

    afterShow() {
        this.initPageDatas();
        this.pageCtrl.init(this._pageDatas);
        this.pageCtrl.selectTap(this._index);
    }

     /**准备释放 */
    protected readyDestroy() {
        //先释放标签页
        this.pageCtrl.readyDestroy();
        super.readyDestroy();
    }
         
}