// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Dialog from "../../utils/ui/Dialog";

const { ccclass, property } = cc._decorator;

@ccclass
export default class QuestionTipsView extends Dialog {
    @property(cc.RichText)
    des: cc.RichText = null;

    private data: string = "";
    public setData(data: any): void {
        this.data = data;
    }

    protected afterShow(): void {
        this.des.string = this.data || "";
    }
}
