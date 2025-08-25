// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { NewSeviceRankType } from "../../common/AllEnum";
import Game from "../../Game";
import { GS_NewSeviceRankingConfig_RewardItem } from "../../net/proto/DMSG_Plaza_Sub_NewSeviceRanking";
import BaseItem from "../../utils/ui/BaseItem";
import GoodsItem, { GoodsItemData } from "../newhand_book/GoodsItem";

const { ccclass, property ,menu } = cc._decorator;

@ccclass
@menu('Game/ui/active/NewSeviceRankRewardItem')
export default class NewSeviceRankRewardItem extends BaseItem {
    @property(cc.Sprite)
    rankBg: cc.Sprite = null;

    @property(cc.SpriteFrame)
    rankBgs: cc.SpriteFrame[] = [];

    @property(cc.Label)
    rankLab: cc.Label = null;

    @property(cc.Label)
    rankLab4_100: cc.Label = null;

    @property(cc.Node)
    rankLab100: cc.Node = null;

    @property(GoodsItem)
    goodsItem: GoodsItem = null;

    private goodsItems:GoodsItem[] = [];

    start() {
        
    }

    setData(data: any, index: number) {
        super.setData(data, index);
        this.refresh();
    }

    refresh() {
        if (!this.data) return;
        let data = this.data as GS_NewSeviceRankingConfig_RewardItem;
        let matchCfg = Game.newSevicerankMgr.getRankConfig(NewSeviceRankType.COMMON_WAR);
        if (!matchCfg) return;
        this.rankBg.node.active = false;
        this.rankLab4_100.node.active = false;
        this.rankLab100.active = false;
        //列表排名
        if (this.index <= 2) {
            this.rankBg.node.active = true;
            this.rankLab.string = "";
            this.rankBg.spriteFrame = this.rankBgs[this.index];
        } else if (data.nminranking <= 100) {
            this.rankLab4_100.node.active = true;
            if (data.nminranking == data.nmaxranking) {
                this.rankLab4_100.string = data.nmaxranking + "名";
            } else {
                this.rankLab4_100.string = data.nminranking + "-" + data.nmaxranking + "名";
            }
        } else  {
            this.rankLab100.active = true;
        }

        if (this.goodsItems.length == 0) {
            this.goodsItems.push(this.goodsItem);
        }

        //奖励
        let index = 0;
        let len = matchCfg.base.ngoodsids.length;
        for (let i = 0; i < len; i++) {
            if (data.ngoodsnums[i] > 0) {
                if (!this.goodsItems[index]) {
                    let itemNode = cc.instantiate(this.goodsItem.node);
                    this.goodsItem.node.parent.addChild(itemNode);
                    this.goodsItems[index] = itemNode.getComponent(GoodsItem);
                }
                this.goodsItems[index].node.active = true;
                let itemdata: GoodsItemData = {
                    goodsId: matchCfg.base.ngoodsids[i],
                    nums: data.ngoodsnums[i],
                    prefix: "  x",
                    showNumWhenOne:true
                }
                this.goodsItems[index].setData(itemdata);
                index ++;
            }
        }

        len = this.goodsItems.length;
        if (index < len) {
            for (let i = index ; i < len ; i++) {
                this.goodsItems[i].node.active = false;
            }
        }
    }
}
