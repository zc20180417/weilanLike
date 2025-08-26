// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Dialog from "../../utils/ui/Dialog";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GuideToClickBtnView extends Dialog {
    private _btnNode: cc.Node = null;
    setData(btnNode: cc.Node) {
        this._btnNode = btnNode;
    }

    beforeShow() {
        if (this._btnNode) {
            let worldPos = this._btnNode.convertToWorldSpaceAR(cc.Vec2.ZERO);
            let localPos = this.content.convertToNodeSpaceAR(worldPos);
            this._btnNode = cc.instantiate(this._btnNode);
            this._btnNode.setPosition(localPos);
            this._btnNode.parent = this.content;
            this._btnNode.on("click", () => {
                this.hide();
            });
        }
    }
}
