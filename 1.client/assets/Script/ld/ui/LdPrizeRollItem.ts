import { PrizeRollItemData } from "../../common/AllEnum";
import { HeadComp } from "../../ui/headPortrait/HeadComp";
import BaseItem from "../../utils/ui/BaseItem";


const { ccclass, property , menu } = cc._decorator;

@ccclass
@menu("Game/LD/ui/LdPrizeRollItem")
export class LdPrizeRollItem extends BaseItem {


    @property(cc.Node)
    bg: cc.Node = null;

    @property(cc.Color)
    color1:cc.Color = null;

    @property(cc.Color)
    color2:cc.Color = null;

    @property(cc.Node)
    coinNode: cc.Node = null;

    @property(HeadComp)
    headComp:HeadComp = null;


    public setData(data: PrizeRollItemData, index?: number): void {
        if (!data) return;
        this.bg.color = index % 2 == 0 ? this.color1 : this.color2;

        if (data.type == 1) {
            this.coinNode.active = true;
            this.headComp.node.active = false;
        } else {
            this.coinNode.active = false;
            this.headComp.node.active = true;

            const headInfo = {
                nfaceid: data.itemID,
                nfaceframeid: 0,
            }

            this.headComp.headInfo = headInfo;
        }

    }


}