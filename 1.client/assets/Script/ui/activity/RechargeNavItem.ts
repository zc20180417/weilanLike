// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import TapNavItem from "../dayInfoView/TapNavItem";

const { ccclass, property } = cc._decorator;

export interface RechargeNavItemData {
    title: string;
}

@ccclass
export default class RechargeNavItem extends TapNavItem {

    @property(cc.Label)
    txtOn: cc.Label = null;

    @property(cc.Node)
    bgOn: cc.Node = null;

    @property(cc.Label)
    txtOff: cc.Label = null;

    setData(data: RechargeNavItemData, index?: number) {
        super.setData(data, index);
        this.txtOff.string = data.title;
        this.txtOn.string = data.title;
    }

    public onSelect() {
        this.bgOn.active = true;
        this.txtOn.node.active = true;
        this.txtOff.node.active = false;
    }

    public unSelect() {
        this.bgOn.active = false;
        this.txtOn.node.active = false;
        this.txtOff.node.active = true;
    }
}
