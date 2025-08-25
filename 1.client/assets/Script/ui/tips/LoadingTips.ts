import { EResPath } from "../../common/EResPath";
import SysMgr from "../../common/SysMgr";
import { Handler } from "../../utils/Handler";
import Dialog from "../../utils/ui/Dialog";
import { UiManager } from "../../utils/UiMgr";

const { ccclass, property ,menu} = cc._decorator;

@ccclass
@menu('Game/ui/tips/LoadingTips')
export default class LoadingTips extends Dialog {

    static TREATUR_VIEW:string = 'TREATUR_VIEW';
    private static _dic:any = {};
    private static _isShow:boolean = false;

    static showLoadingTips(flag:string) {
        LoadingTips._dic[flag] = true;
        if (!LoadingTips._isShow) {
            LoadingTips._isShow = true;
            UiManager.showTopDialog(EResPath.LOADING_TIPS);
        }
    }

    static hideLoadingTips(flag:string) {
        if (!LoadingTips._dic[flag] || !LoadingTips._isShow) return;
        LoadingTips._dic[flag] = false;

        let doHide:boolean = true;
        Object.values(LoadingTips._dic).forEach(element => {
            if (element) {
                doHide = false;
            }
        });

        if (doHide) {
            LoadingTips._isShow = false;
            UiManager.hideDialog(EResPath.LOADING_TIPS);
        }
    }



    @property(cc.Node)
    frameNode:cc.Node[] = [];


    private _index:number = 0;
    private _len:number = 0;

    private _handler:Handler;

    onLoad() {
        this._handler = new Handler(this.onTimer , this);
        this._len = this.frameNode.length;
    }

    protected beforeShow() {
        this.setIndex(0);
        SysMgr.instance.doFrameLoop(this._handler , 4);
    }


    private setIndex(index:number) {
        this._index = index;
        let count:number = 0;
        for (let i = index ; i > index - this._len ; i--) {
            let node = this.frameNode[i < 0 ? i + this._len : i];
            node.opacity = 255 - count * 15;
            count ++;
        }
    }

    private onTimer() {
        this._index ++;
        if (this._index >= this._len) this._index = 0;
        this.setIndex(this._index);
    }


    protected beforeHide() {
        SysMgr.instance.clearTimer(this._handler);
    }

    onDestroy() {

    }

}
