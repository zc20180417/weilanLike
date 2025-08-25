import SysMgr from "../../common/SysMgr";
import { Handler } from "../../utils/Handler";
import Dialog from "../../utils/ui/Dialog";
import { NodeUtils } from "../../utils/ui/NodeUtils";
import { getRichtextTips, RichTextTipsType } from "../tips/RichTextTipsView";
import BoxInScreen from "../utils/BoxInScreen";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("Game/ui/equip/EquipTipsView")
export class EquipTipsView extends Dialog {

    @property(cc.Label)
    nameLabel: cc.Label = null;

    @property(cc.RichText)
    infoLabel: cc.RichText = null;

    @property(cc.Node)
    imgList: cc.Node[] = [];

    @property(cc.Sprite)
    ico: cc.Sprite = null;

    //@property(cc.Node)
    //tipNode: cc.Node = null;

    @property(cc.Node)
    imgParent: cc.Node = null;

    @property(BoxInScreen)
    cardBox: BoxInScreen = null;

    @property(cc.Graphics)
    line: cc.Graphics = null;

    @property(cc.Node)
    points: cc.Node[] = [];

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
        //let info = data.info;
        let node: cc.Node = data.node;
        this._canHide = false;

        this.imgList.forEach(element => {
            element.opacity = 0;
        });

        this.infoLabel.string = getRichtextTips(RichTextTipsType.EQUIP);
        this._img = node;
        this._preParent = node.parent;
        this._prePos.x = node.x;
        this._prePos.y = node.y;

        this.nameLabel.string = title;
        this.ico.spriteFrame = data.spriteFrame;

        this.setBtnEnable(false);

        NodeUtils.addToParent(node, this.imgParent);

        let pos: cc.Vec2 = node.getPosition();
        let box = node.getBoundingBox();
        this.content.setPosition(box.xMax, pos.y + 20);

        //画线
        this.cardBox.updateLayout();
        pos = this.line.node.convertToNodeSpaceAR(this.points[0].convertToWorldSpaceAR(cc.Vec2.ZERO));
        this.line.moveTo(pos.x, pos.y);
        pos = this.line.node.convertToNodeSpaceAR(this.points[1].convertToWorldSpaceAR(cc.Vec2.ZERO));
        this.line.lineTo(pos.x, pos.y);
        pos = this.line.node.convertToNodeSpaceAR(this.points[2].convertToWorldSpaceAR(cc.Vec2.ZERO));
        this.line.lineTo(pos.x, pos.y);
        this.line.stroke();

        this.startShow();
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
        SysMgr.instance.clearTimer(this._handler, true);
        this.hide();
    }

    private startShow() {
        for (let i = 0; i < this.imgList.length; i++) {
            let node = this.imgList[i];
            NodeUtils.to(node, 0.1, { opacity: 255 }, 'sineIn', null, null, null, i * 0.05);
        }

        SysMgr.instance.doOnce(this._handler, this.imgList.length * 50, true);
    }

    private showInfo() {
        this._canHide = true;
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