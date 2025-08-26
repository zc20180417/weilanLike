// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { BATTLE_PASS_REWARD_MODE } from "../../common/AllEnum";
import Game from "../../Game";
import { GS_SceneBattlePassConfig_PassItem } from "../../net/proto/DMSG_Plaza_Sub_BattlePass";
import { GOODS_TYPE } from "../../net/socket/handler/MessageEnum";
import { StringUtils } from "../../utils/StringUtils";
import BaseItem from "../../utils/ui/BaseItem";
import { NodeUtils } from "../../utils/ui/NodeUtils";
import GoodsItem from "../newhand_book/GoodsItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TXZTapItem extends BaseItem {

    @property(GoodsItem)
    normalGoodsItem: GoodsItem = null;

    @property(cc.Node)
    normalBtnNode: cc.Node = null;

    @property(cc.Node)
    wanmeiNode:cc.Node = null;

    @property(cc.RichText)
    cpLabel: cc.RichText = null;

    @property(cc.Node)
    progressNode:cc.Node = null;

    private _cardLimit: number = 100;                                                                        
    private _otherLimit: number = 60;

    start() {
        
    }

    setData(data: { nid: number, data: GS_SceneBattlePassConfig_PassItem }, index?: number) {
        super.setData(data, index);
        this.refresh();
    }

    private refresh() {
        if (!this.data) return;
        let data = this.data as { nid: number, data: GS_SceneBattlePassConfig_PassItem ,perfectFinishNormalWarCount:number , showProgress:boolean};
        let enableRecive = data.perfectFinishNormalWarCount >= data.data.nfullhpwarcount;
        
        this.progressNode.active = !enableRecive && data.showProgress;

        if (!enableRecive) {
            this.cpLabel.string = StringUtils.fontColor(data.perfectFinishNormalWarCount.toString() , "#f44c5e") + "/" + data.data.nfullhpwarcount;
            this.normalBtnNode.active = data.showProgress;
        }
        let isNormalRecived = Game.battlePassMgr.isNormalItemRecived(this.data.nid, this.index);
        NodeUtils.enabled(this.normalBtnNode.getComponent(cc.Button) , enableRecive);
        if (this.normalBtnNode.active) {
            this.normalBtnNode.active = !isNormalRecived;
        }
        this.wanmeiNode.active = isNormalRecived;
        

        //常规物品
        let isCard = Game.goodsMgr.isCard(data.data.ngoodsid1);
        this.normalGoodsItem.limit = isCard ? this._cardLimit : this._otherLimit;
        this.normalGoodsItem.title.node.y = isCard ? this.normalGoodsItem.titleY - 10 : this.normalGoodsItem.titleY;
        this.normalGoodsItem.bg.node.active = !isCard;
        this.normalGoodsItem.setData({
            goodsId: data.data.ngoodsid1,
            nums: data.data.ngoodsnum1,
            gray: isNormalRecived,
            prefix:"x"
        });
    }

    private normalClick() {
        Game.battlePassMgr.battlePassGetReward(this.data.nid, this.index, BATTLE_PASS_REWARD_MODE.NORMAL);
    }
}
