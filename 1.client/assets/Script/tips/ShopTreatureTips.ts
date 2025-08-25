// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseItem from "../utils/ui/BaseItem";
import ImageLoader from "../utils/ui/ImageLoader";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ShopTreatureTips extends BaseItem {
    @property(ImageLoader)
    icon: ImageLoader = null;

    public setData(data: any) {
        if (!data) return;
        super.setData(data);
        //图标
        this.icon.setPicId(data);
    }
}
