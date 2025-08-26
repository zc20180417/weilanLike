import SysMgr from "../common/SysMgr";
import { Handler } from "../utils/Handler";
import { StringUtils } from "../utils/StringUtils";
import Dialog from "../utils/ui/Dialog";
import { NodeUtils } from "../utils/ui/NodeUtils";

export enum TIPS_TYPE {
    DEFAULT = 0,
    MONSTER_LOCK = 1,
}

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("Game/ui/AnyTipsView")
export class AnyTipsView extends Dialog {

    @property(cc.Label)
    titleLabel: cc.Label = null;

    @property(cc.RichText)
    infoLabel: cc.RichText = null;

    @property(cc.Label)
    label: cc.Label = null;

    @property(cc.Node)
    imgList: cc.Node[] = [];

    @property(cc.Node)
    tipNode: cc.Node = null;

    @property(cc.Node)
    imgParent: cc.Node = null;

    private _prePos: cc.Vec2 = cc.Vec2.ZERO;
    private _preParent: cc.Node = null;
    private _canHide: boolean = false;
    private _handler: Handler = new Handler(this.showInfo, this);
    private _img: cc.Node;
    private data: any = null;
    onLoad() {

    }

    setData(data: any) {
        this.data = data;
        let title = data.title;
        let info = data.info;
        let level = data.level;
        let node: cc.Node = data.node;
        this._canHide = false;

        this.titleLabel.node.opacity = 0;
        this.infoLabel.node.opacity = 0;
        this.label.node.opacity = 0;
        this.imgList.forEach(element => {
            element.opacity = 0;
        });

        if (data.type || StringUtils.isNilOrEmpty(title)) {
            this.titleLabel.string = "";
        } else {
            this.titleLabel.string = title + ":";
        }

        this.infoLabel.string = info;
        this._img = node;
        this._preParent = node.parent;
        this._prePos.x = node.x;
        this._prePos.y = node.y;


        this.setBtnEnable(false);
        if (data.changeColor) {
            this._img.color = cc.Color.WHITE;
        }
        NodeUtils.addToParent(node, this.imgParent);
        //node.removeFromParent();
        //this.imgParent.addChild(node);

        let pos: cc.Vec2 = node.getPosition();
        this.tipNode.setPosition(this.data.offset ? pos.add(this.data.offset) : pos);
        this.startShow();

        if (level != undefined) {
            this.label.string = "";
            // if (level == -1) {
            //     this.label.string = '开发中，敬请期待!';
            // } else {
            //     this.label.string = `通关第${level}关后开放`;
            // }
        } else {
            if (data.type) {
                this.label.string = data.progress;
            } else {
                this.label.string = '';
            }
        }
    }

    tryHide() {
        if (!this._canHide) return;
        this.imgParent.removeChild(this._img);
        this._img.x = this._prePos.x;
        this._img.y = this._prePos.y;
        if (this._preParent && this._preParent.isValid) {
            this._preParent.addChild(this._img);
        }
        this.setBtnEnable(true);
        if (this.data.changeColor) {
            this._img.color = this.data.changeColor;
        }
        SysMgr.instance.clearTimer(this._handler, true);
        this.hide();
    }

    private startShow() {
        for (let i = 0; i < 3; i++) {
            let node = this.imgList[i];
            NodeUtils.to(node, 0.1, { opacity: 255 }, 'sineIn', null, null, null, i * 0.05);
        }

        SysMgr.instance.doOnce(this._handler, 200, true);
    }

    private showInfo() {
        this._canHide = true;
        NodeUtils.to(this.titleLabel.node, 0.2, { opacity: 255 }, 'sineIn');
        NodeUtils.to(this.infoLabel.node, 0.2, { opacity: 255 }, 'sineIn');
        NodeUtils.to(this.label.node, 0.2, { opacity: 255 }, 'sineIn');
    }

    private setBtnEnable(flag: boolean) {
        let btnComp = this._img.getComponent(cc.Button);
        if (btnComp) {
            btnComp.interactable = flag;
        }
    }

    onDestroy() {
        this._prePos = null;
    }

}