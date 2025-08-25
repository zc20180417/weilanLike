import SysMgr from "../common/SysMgr";
import { Handler } from "./Handler";
import { NodeUtils } from "./ui/NodeUtils";


const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu('Game/SystemTip2')
export default class SystemTip2 extends cc.Component {


    @property(cc.Node)
    bgNode: cc.Node = null;

    @property({
        type: cc.Label,
        tooltip: '内容Label'
    })
    contentText: cc.Label = null;

    private _isShowing:boolean = false;
    private _fadeOutHandler:Handler = null;
    
    show(info: string) {
        this.node.active = true;
        this.contentText.string = info;
        if (!this._isShowing) {
            this._isShowing = true;
            NodeUtils.fadeTo(this.node , 0.3 , 255);
        }

        if (!this._fadeOutHandler) {
            this._fadeOutHandler = new Handler(this.onFadeOutTimer , this);
        }

        SysMgr.instance.clearTimer(this._fadeOutHandler , true);
        SysMgr.instance.doOnce(this._fadeOutHandler , 1500 , true);
    }

    private onFadeOutTimer() {
        this._isShowing = false;
        NodeUtils.fadeTo(this.node , 0.3 , 0 , this.onHideTimer , this);
    }
   
    private onHideTimer() {
        this.node.active = false;
    }


}