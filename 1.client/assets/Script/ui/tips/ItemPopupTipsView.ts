// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import TipsView, { TipsViewData } from "./TipsView";

const { ccclass, property } = cc._decorator;

export interface ItemPopupData extends TipsViewData {
    tips: string;
}

@ccclass
export default class ItemPopupTipsView extends TipsView {
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
        let data = this.data as ItemPopupData;
        // this.tips.string = data.tips;
        let box = data.node.getBoundingBox();
        let isLeft = box.xMax + this.leftNode.width > cc.winSize.width * 0.5;
        if (isLeft) {
            this.rightNode.active = false;
            this.leftNode.active = true;
            this.leftNode.y = box.y + box.height * 0.5;
            this.leftNode.x = box.xMin;
            this.leftTips.string = data.tips;
        } else {
            this.leftNode.active = false;
            this.rightNode.active = true;
            this.rightNode.y = box.y + box.height * 0.5;
            this.rightNode.x = box.xMax;
            this.rightTips.string = data.tips;
        }
    }
}
