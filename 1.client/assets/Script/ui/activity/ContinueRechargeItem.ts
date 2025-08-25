
import Game from "../../Game";
import { GS_SysActivityConfig_SysActivityTaskItem, GS_SysActivityPrivate_SysActivityData } from "../../net/proto/DMSG_Plaza_Sub_SysActivity";
import { ACTIVE_TYPE } from "../../net/socket/handler/MessageEnum";
import BaseItem from "../../utils/ui/BaseItem";
import { GoodsBox } from "../../utils/ui/GoodsBox";
import { GoodsItemData } from "../newhand_book/GoodsItem";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("Game/ui/active/ContinueRecharge/ContinueRechargeItem")
export class ContinueRechargeItem extends BaseItem {

    @property(cc.Label)
    dayLabel: cc.Label = null;

    @property(GoodsBox)
    goodList: GoodsBox = null;

    @property(cc.Label)
    tipLabel: cc.Label = null;

    @property(cc.Label)
    rechargeProgress: cc.Label = null;

    @property(cc.Node)
    cannotGet: cc.Node = null;

    @property(cc.Node)
    getBtn: cc.Node = null;

    @property(cc.Node)
    getedNode: cc.Node = null;



    public setData(data: any, index?: number): void {
        super.setData(data, index);
        if (!data) return;
        let item = data.cfg as GS_SysActivityConfig_SysActivityTaskItem;
        let privateData = data.privateData as GS_SysActivityPrivate_SysActivityData;
        let goodsList: GoodsItemData[] = [];
        let geted = data.flag;
        for (let i = 1; i < 5; i++) {
            if (item['nparam' + (i * 2)] > 0) {
                let goodData: GoodsItemData = {
                    goodsId: item['nparam' + (i * 2)],
                    nums: item['nparam' + (i * 2 + 1)],
                    gray: geted,
                    prefix: "x"
                };
                goodsList.push(goodData);
            }
        }

        this.dayLabel.string = (item.btindex + 1).toString();
        this.goodList.array = goodsList;
        this.tipLabel.string = `累计充值${item.nparam1}元`;
        if (item.btindex < privateData.nmainprogress) {
            this.rechargeProgress.string = item.nparam1 + '/' + item.nparam1;
            this.checkGeted(geted);
        } else if (item.btindex == privateData.nmainprogress) {
            this.rechargeProgress.string = privateData.nsubprogress + '/' + item.nparam1;
            if (privateData.nsubprogress < item.nparam1) {
                this.onCannotGet();
            } else {
                this.checkGeted(geted);
            }
        } else {
            this.onCannotGet();
            this.rechargeProgress.string = 0 + '/' + item.nparam1;
        }

    }

    private onCannotGet() {
        this.cannotGet.active = true;
        this.getBtn.active = this.getedNode.active = false;
    }

    private checkGeted(flag: boolean) {
        this.cannotGet.active = false;
        this.getBtn.active = !flag;
        this.getedNode.active = flag;
    }

    onClick() {
        if (this.data && this.data.cfg) {
            Game.sysActivityMgr.getReward(ACTIVE_TYPE.CONTINUE_RECHARGE, this.data.cfg.btindex);
        }

    }


}