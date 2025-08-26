// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import TipsView, { TipsViewData } from "./TipsView";

const { ccclass, property} = cc._decorator;

export interface DiaAndRedPacketTipsViewData extends TipsViewData {
    tips: string;
}

@ccclass
export default class DiaAndRedPacketTipsView extends TipsView {
    @property(cc.Node)
    tipsNode: cc.Node = null;

    @property(cc.RichText)
    tips: cc.RichText = null;

    beforeShow() {
        super.beforeShow();
        let data = this.data as DiaAndRedPacketTipsViewData;
        this.tips.string = data.tips;
        this.tipsNode.setPosition(data.node.position);
    }
}
