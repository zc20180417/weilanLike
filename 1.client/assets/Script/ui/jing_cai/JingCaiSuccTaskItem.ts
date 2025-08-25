// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Game from "../../Game";
import { GS_BountyOpenWar_WarTaskData } from "../../net/proto/DMSG_Plaza_Sub_Bounty";
import BaseItem from "../../utils/ui/BaseItem";
import ImageLoader from "../../utils/ui/ImageLoader";
import { MatUtils } from "../../utils/ui/MatUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class JingCaiSuccTaskItem extends BaseItem {
    @property(ImageLoader)
    icon: ImageLoader = null;

    @property(cc.Label)
    num: cc.Label = null;

    @property(cc.Label)
    des: cc.Label = null;


    setData(data:any) {
        if (!data) return;
        let task:GS_BountyOpenWar_WarTaskData = data.task;
        let state = data.state;

        this.des.string = task.szdes;

        let goodsData = Game.goodsMgr.getGoodsInfo(task.nrewardgoodsid);
        if (goodsData) {
            this.icon.setPicId(goodsData.npacketpicid);
        }

        this.num.string = '+' + task.nrewardgoodsnums;

        if (state == 0) {
            MatUtils.setGray(this.icon.spriteTarget);
            MatUtils.setGray(this.num);
            MatUtils.setGray(this.des);
        }
    }

    public refresh() {

    }
}
