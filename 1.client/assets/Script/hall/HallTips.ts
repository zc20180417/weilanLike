import SysMgr from "../common/SysMgr";
import { Handler } from "../utils/Handler";
import { NodeUtils } from "../utils/ui/NodeUtils";

const {ccclass, property , menu} = cc._decorator;

@ccclass
@menu("Game/Hall/HallTips")
export class HallTips extends cc.Component {

    @property(cc.Label)
    titleLabel:cc.Label = null;

    @property(cc.Label)
    infoLabel:cc.Label = null;

    @property(cc.Label)
    label:cc.Label = null;

    @property(cc.Node)
    imgList:cc.Node[] = [];

    @property(cc.Node)
    tipNode:cc.Node = null;

    @property(cc.Node)
    tipParent:cc.Node = null;

    @property(cc.Node)
    imgParent:cc.Node = null;

    private _preParent:cc.Node = null;
    private _canHide:boolean = false;
    private _handler:Handler = new Handler(this.showInfo , this);
    private _img:cc.Node;
    onLoad() {

    }

    showTip(title:string , info:string , node:cc.Node , level:number) {
        this._canHide = false;
        this.tipParent.active = true;

        this.titleLabel.node.opacity = 0;
        this.infoLabel.node.opacity = 0;
        this.label.node.opacity = 0;
        this.imgList.forEach(element => {
            element.opacity = 0;
        });

        this.titleLabel.string = title + ":";
        this.infoLabel.string = info;
        this._img = node;
        this._preParent = node.parent;
        node.removeFromParent();
        this.imgParent.addChild(node);
        let pos:cc.Vec2 = node.getPosition();
        this.tipNode.setPosition(pos.x , pos.y);
        this.startShow();

        if (level == -1) {
            this.label.string = '开发中，敬请期待!';
        } else {
            this.label.string = `通关第${level}关后开放`;
        }
    }

    tryHide() {
        if (!this._canHide) return;
        if (!this.tipParent.active) return;
        this.imgParent.removeChild(this._img);
        this._preParent.addChild(this._img )
        this.tipParent.active = false;
        SysMgr.instance.clearTimer(this._handler , true);
    }

    private startShow() {
        for (let i = 0 ; i < 3 ;i++) {
            let node = this.imgList[i];
            NodeUtils.to(node , 0.1 , {opacity:255} , 'sineIn' , null , null , null , i * 0.05);
        }

        SysMgr.instance.doOnce(this._handler , 200 , true);
    }

    private showInfo() {
        this._canHide = true;
        NodeUtils.to(this.titleLabel.node , 0.2 , {opacity:255} , 'sineIn');
        NodeUtils.to(this.infoLabel.node , 0.2 , {opacity:255} , 'sineIn');
        NodeUtils.to(this.label.node , 0.2 , {opacity:255} , 'sineIn');
    }
}