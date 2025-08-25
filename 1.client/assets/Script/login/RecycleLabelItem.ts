// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseItem from "../utils/ui/BaseItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RecycleLabelItem extends BaseItem {
    @property(cc.Label)
    content: cc.Label = null;

    public setData(data: any, index?: number) {
        super.setData(data, index);
        if (this.data) {
            this.content.string = this.data;
        }
    }
}
