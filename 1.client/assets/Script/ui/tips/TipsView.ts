// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Dialog from "../../utils/ui/Dialog";

const { ccclass, property } = cc._decorator;

export interface TipsViewData {
    node: cc.Node;
}

@ccclass
export default class TipsView extends Dialog {
    protected data: TipsViewData = null;
    private oldParent: cc.Node = null;
    private oldPos: cc.Vec2 = null;
    private oldSlibingInedx: number = 0;

    public setData(data: TipsViewData): void {
        this.data = data;
    }

    protected beforeShow(): void {
        this.oldParent = this.data.node.parent;
        this.oldPos = this.data.node.getPosition();
        this.oldSlibingInedx = this.data.node.getSiblingIndex();
        let localPos = this.content.convertToNodeSpaceAR(this.data.node.convertToWorldSpaceAR(cc.Vec2.ZERO));
        this.data.node.removeFromParent(false);
        this.data.node.parent = this.content;
        this.data.node.setPosition(localPos);
        let node = new cc.Node();
        node.parent = this.content;
        node.setContentSize(cc.winSize);
        node.addComponent(cc.Button);
        node.on('click', this.hide, this);
    }

    protected beforeHide(): void {
        this.data.node.removeFromParent(false);
        if (this.oldParent && this.oldParent.isValid) {
            this.data.node.parent = this.oldParent;
            this.data.node.setPosition(this.oldPos);
            this.data.node.setSiblingIndex(this.oldSlibingInedx);
        }
    }
}
