// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import MaskTipsView, { MaskTipsViewData } from "./MaskTipsView";
const { ccclass, property } = cc._decorator;

export interface ItemMaskTipsViewData extends MaskTipsViewData {
    tips: string;
}

@ccclass
export default class ItemMaskTipsView extends MaskTipsView {
    // @property(cc.RichText)
    // tips: cc.RichText = null;

    // @property(cc.Node)
    // tipsNode: cc.Node = null;

    @property(cc.RichText)
    leftTips: cc.RichText = null;

    @property(cc.RichText)
    rightTips: cc.RichText = null;

    @property(cc.Node)
    leftNode: cc.Node = null;

    @property(cc.Node)
    rightNode: cc.Node = null;

    beforeShow() {
        super.beforeShow();
        let data = this.data as ItemMaskTipsViewData;
        // this.tips.string = data.tips;

        // this.tipsNode.setPosition(cc.v2(this.mask.node.x + this.mask.node.width * 0.5, this.mask.node.y));

        let isLeft = this.mask.node.x + this.mask.node.width * 0.5 + this.leftNode.width > cc.winSize.width * 0.5;
        if (isLeft) {
            this.rightNode.active = false;
            this.leftNode.active = true;
            this.leftTips.string = data.tips;
            this.leftNode.setPosition(cc.v2(this.mask.node.x - this.mask.node.width * 0.5, this.mask.node.y));
            this.scheduleOnce(this.refreshHeiLeft , 0.05);
        } else {
            this.leftNode.active = false;
            this.rightNode.active = true;
            this.rightTips.string = data.tips;

            this.rightNode.setPosition(cc.v2(this.mask.node.x + this.mask.node.width * 0.5, this.mask.node.y));
            this.scheduleOnce(this.refreshHeiRight , 0.05);
        }

    }

    private refreshHeiRight() {
        let height = Math.max(this.rightTips.node.height + 20 , 103);
        this.rightNode.height = height;

    }
    private refreshHeiLeft() {
        let height = Math.max(this.leftTips.node.height + 20 , 103);
        this.leftNode.height = height;
    }
}
