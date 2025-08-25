import Game from "../../Game";
import { ZeroMallRewardItems } from "../../net/mgr/ZeroMallMgr";
import BaseItem from "../../utils/ui/BaseItem";
import { GoodsBox } from "../../utils/ui/GoodsBox";
import { GoodsItemData } from "../newhand_book/GoodsItem";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("Game/ui/active/ZeroGoItem")
export class ZeroGoItem extends BaseItem {
    @property(cc.Label)
    dayLabel: cc.Label = null;

    @property(GoodsBox)
    goodList: GoodsBox = null;

    @property(cc.Label)
    tipLabel: cc.Label = null;

    @property(cc.Node)
    cannotGet: cc.Node = null;

    @property(cc.Node)
    getBtn: cc.Node = null;

    @property(cc.Node)
    getedNode: cc.Node = null;


    public setData(data: any, index?: number): void {
        super.setData(data, index);
        if (!data) return;
        let item = data as ZeroMallRewardItems;
        let goodsList: GoodsItemData[] = [];
        let geted = item.flag;
        let len = item.rewardGoods.length;
        for (let i = 0; i < len; i++) {
            let rewardItem = item.rewardGoods[i];
            if (rewardItem.ngoodsid > 0) {
                let goodData: GoodsItemData = {
                    goodsId: rewardItem.ngoodsid,
                    nums: rewardItem.ngoodsnum,
                    showNumWhenOne:true,
                    gray: geted,
                    prefix: "x"
                };
                goodsList.push(goodData);
            }
        }

        this.dayLabel.string = (item.loginDay + 1).toString();
        this.goodList.array = goodsList;
        if (item.loginDay < item.curLoginDay) {
            this.checkGeted(geted);
        }  else {
            this.onCannotGet();
        }

    }

    private onCannotGet() {
        this.tipLabel.node.active = true;
        this.dayLabel.node.active = true;
        this.getBtn.active = this.getedNode.active = false;
    }

    private checkGeted(flag: boolean) {
        // this.cannotGet.active = false;
        this.tipLabel.node.active = false;
        this.dayLabel.node.active = false;
        this.getBtn.active = !flag;
        this.getedNode.active = flag;
    }

    onClick() {
        if (this.data) {
            Game.zeroMallMgr.reqGetReward(this.index);
        }

    }
}