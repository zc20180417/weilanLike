import Game from "../../Game";
import { GS_GrowGiftInfo_RewardItem } from "../../net/proto/DMSG_Plaza_Sub_GrowGift";
import { GOODS_ID } from "../../net/socket/handler/MessageEnum";
import BaseItem from "../../utils/ui/BaseItem";
import { NodeUtils } from "../../utils/ui/NodeUtils";
import Utils from "../../utils/Utils";
import GoodsItem, { GoodsItemData } from "../newhand_book/GoodsItem";
import LiCaiGoodsItem, { LiCaiGoodsItemData } from "./LiCaiGoodsItem";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('Game/ui/active/LiCaiItem')
export class LiCaiItem extends BaseItem {

    @property(cc.Label)
    infoLabel: cc.Label = null;

    @property(cc.Button)
    getBtn: cc.Button = null;

    @property(cc.Node)
    getedImg: cc.Node = null;

    @property(cc.Label)
    progress: cc.Label = null;

    @property(cc.Node)
    ungetable: cc.Node = null;

    private _itemData: GS_GrowGiftInfo_RewardItem;

    @property([GoodsItem])
    items: GoodsItem[] = [];

    setData(data: any, index: number) {
        super.setData(data, index);
        this._itemData = data;
        if (data) {
            let privateData = Game.growGiftMgr.getGrowGiftPrivate();

            let currId = Game.sceneNetMgr.getCurWarID();
            let maxId = this._itemData.nwarid;
            this.progress.string = currId + "/" + maxId;
            this.infoLabel.string = `通关冒险模式第${maxId}关可领取`;
            if (currId < maxId || privateData.btbuy === 0) {
                this.getBtn.node.active = false;
                this.getedImg.active = false;
                this.ungetable.active = true;
            } else {
                this.ungetable.active = false;
                let geted = Utils.checkBitFlag(privateData.nflag, index);
                this.getBtn.node.active = !geted;
                this.getedImg.active = geted;
            }

            //奖券
            let itemData: GoodsItemData = {
                goodsId: this._itemData.ngoodsid,
                nums: this._itemData.ngoodsnum,
                prefix:"x"
            }
            this.items[0].setData(itemData);
            //钻石
            itemData = {
                goodsId: GOODS_ID.DIAMOND,
                nums: this._itemData.ndiamonds,
                prefix:"x"
            }
            this.items[1].setData(itemData);
        } else {
            this.getBtn.node.active = false;
            this.ungetable.active = false;
            this.getedImg.active = false;
        }
    }


    onGetClick() {
        Game.growGiftMgr.reqGetGrowGiftAward(this.index);
        cc.log('---------onGetClick-', this.index);
    }


}