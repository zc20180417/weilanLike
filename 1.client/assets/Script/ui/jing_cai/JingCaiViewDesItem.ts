// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { GS_BountyData_TaskInfo } from "../../net/proto/DMSG_Plaza_Sub_Bounty";
import BaseItem from "../../utils/ui/BaseItem";
import ImageLoader from "../../utils/ui/ImageLoader";

const { ccclass, property } = cc._decorator;

@ccclass
export default class JingCaiViewDesItem extends BaseItem {
    @property(ImageLoader)
    skillIcon: ImageLoader = null;

    @property(cc.Label)
    des: cc.Label = null;

    public refresh() {
        if (!this.data) return;
        let data = this.data as GS_BountyData_TaskInfo;
        this.skillIcon.setPicId(data.npicid);
        this.des.string = data.szdes;
    }
}
