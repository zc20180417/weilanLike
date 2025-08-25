import SysMgr from "../../common/SysMgr";
import { Handler } from "../../utils/Handler";
import { NodeUtils } from "../../utils/ui/NodeUtils";
import { CpGuideTips } from "./CpGuideTips";

const { ccclass, property ,menu} = cc._decorator;

@ccclass
@menu("Game/Logic/CpGuideTipsView")
export class CpGuideTipsView extends cc.Component {

    @property(cc.Node)
    bgNode:cc.Node = null;

    @property(cc.RichText)
    label:cc.RichText = null;

    private _data:CpGuideTips;
    private _handler:Handler = new Handler(this.startShow , this);
    onLoad() {

    }

    onClick() {
        if (this._data) {
            this._data.end();
        }
    }


    initData(data:CpGuideTips) {
        this._data = data;
        this.label.string = data.cfg.info;
        this.node.x = data.cfg.point[0];
        this.node.y = data.cfg.point[1];
       
        SysMgr.instance.doFrameOnce( this._handler, 4 );        
    }

    private startShow() {
        this.node.width = (this.label.node.width >> 1) + 25;
        this.node.height = (this.label.node.height >> 1) + 8;
        this.node.opacity = 0;
        this.node.scale = 0.1;

        NodeUtils.to(this.node , 0.5 , {opacity:255 , scale:1} , 'sineIn');
    }

    startHide() {
        NodeUtils.to(this.node , 0.3 , {opacity:0 , scale:0} , 'sineIn' , this.onHideEnd , null , this);
    }

    private onHideEnd() {
        this._data.onHideEnd();
    }

}