// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Dialog from "../../utils/ui/Dialog";

const { ccclass, property } = cc._decorator;

export interface MaskTipsViewData {
    node: cc.Node;
}

@ccclass
export default class MaskTipsView extends Dialog {
    @property(cc.Mask)
    mask: cc.Mask = null;

    protected data: MaskTipsViewData = null;

    public setData(data: MaskTipsViewData): void {
        this.data = data;
    }

    protected beforeShow(): void {
        this.mask.type = cc.Mask.Type.RECT;
        let boundingBox = this.data.node.getBoundingBoxToWorld();
        let localPos = this.node.convertToNodeSpaceAR(boundingBox.center);
        this.mask.node.setPosition(localPos);
        this.mask.node.setContentSize(boundingBox.size);
        let node = new cc.Node();
        node.parent = this.content;
        node.setContentSize(cc.winSize);
        node.addComponent(cc.Button);
        node.on('click', this.hide, this);
    }
}   
