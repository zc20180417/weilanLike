import Game from "../../Game";
import GlobalVal from "../../GlobalVal";
import { GS_SceneBattlePass4Config_PassItem } from "../../net/proto/DMSG_Plaza_Sub_BattlePass";
import { GOODS_TYPE } from "../../net/socket/handler/MessageEnum";
import SystemTipsMgr from "../../utils/SystemTipsMgr";
import BaseItem from "../../utils/ui/BaseItem";
import { NodeUtils } from "../../utils/ui/NodeUtils";
import Utils from "../../utils/Utils";
import GoodsItem, { GoodsItemData } from "../newhand_book/GoodsItem";

const { ccclass, property ,menu } = cc._decorator;

@ccclass
@menu('Game/ui/active/BattlePass4Item')
export class BattlePass4Item extends BaseItem {


    @property(cc.Label)
    titleLabel:cc.Label = null;

    @property(cc.Node)
    getBtn:cc.Node = null;

    @property(cc.Label)
    getBtnLabel:cc.Label = null;

    @property(GoodsItem)
    goodsItem1:GoodsItem = null;

    @property(GoodsItem)
    goodsItem2:GoodsItem = null;

    @property(GoodsItem)
    goodsItem3:GoodsItem = null;

    @property(cc.Node)
    imgLightNode:cc.Node = null;

    @property(cc.Node)
    imgLightParent:cc.Node = null;

    @property(cc.Node)
    tvNode:cc.Node = null;

    private lightNodes:cc.Node[] = [];
    private _cardLimit: number = 90;                                                                        
    private _otherLimit: number = 60;
    onLoad() {
        this.lightNodes[0] = this.imgLightNode;
    }

    private canGetIndexs:number[] = [];
    private isCards:boolean[] = [];
    public setData(data:any , index?:number) {
        super.setData(data , index);
        if (!this.data) return;
        let itemData = data.itemData as GS_SceneBattlePass4Config_PassItem;
        this.titleLabel.string = `${itemData.nday + 1}`;
        this.hideFrameEffect();
        let progressValue = Game.actorMgr.getChannelOpenDays() - data.config.baseItem.nstartday;
        let geted = Utils.checkBitFlag(data.stateData.nflag1 , index);
        let geted2 = Utils.checkBitFlag(data.stateData.nflag2 , index);
        let geted3 = Utils.checkBitFlag(data.stateData.nflag3 , index);
        const buyed1 = (data.stateData.btmodeflag & 0x1) != 0;
        const buyed2 = (data.stateData.btmodeflag & 0x2) != 0;
        this.setGoodsItemData(this.goodsItem1 , itemData.ngoodsid1 , itemData.ngoodsnum1 , geted , geted, 0);
        this.setGoodsItemData(this.goodsItem2 , itemData.ngoodsid2 , itemData.ngoodsnum2 , geted2 , geted2 || !buyed1, 1);
        this.setGoodsItemData(this.goodsItem3 , itemData.ngoodsid3 , itemData.ngoodsnum3 , geted3 , geted3 || !buyed2, 2);
    

        if (progressValue < itemData.nday) {
            this.getBtn.active = false;
            this.tvNode.active = false;
            this.getBtnLabel.node.active = false;
            this.grayGoodsItem(true);
            NodeUtils.enabled(this.getBtn.getComponent(cc.Button) , false);
        } else {
            this.grayGoodsItem(false);
            let state = 1;
            this.canGetIndexs.length = 0;
            this.canGetIndexs.push(geted ? 0:1);
            this.canGetIndexs.push(!geted2 && buyed1 ? 1:0);
            this.canGetIndexs.push(!geted3 && buyed2 ? 1:0);
            
            for (let i = 0 ; i < 3 ;i++) {
                if (this.canGetIndexs[i] == 1) {
                    state = 0;
                    break;
                }
            }
            
            if (state == 0) {
                this.getBtn.active = true;
                this.getBtnLabel.node.active = true;
                if (progressValue == itemData.nday || Utils.checkBitFlag(data.stateData.nsignflag , index)) {
                    this.tvNode.active = false;
                    this.getBtnLabel.node.x = 62;
                    this.getBtnLabel.string = "领取";
                    this.checkCanGetItem();
                } else {
                    if (GlobalVal.closeAwardVideo) {
                        this.getBtnLabel.string = "周卡补签";
                    } else {
                        this.tvNode.active = true;
                        this.getBtnLabel.node.x = 75;
                        this.getBtnLabel.string = "补签";
                    }
                }
                this.getBtnLabel.fontSize = state == 0 ? 44 : 36;
                NodeUtils.enabled(this.getBtn.getComponent(cc.Button) , true);
            } else  {
                this.getBtn.active = false;
                this.tvNode.active = false;
                this.getBtnLabel.node.active = false;
            }
        }
    }

    onClick() {
        if (!this.data) return;
        let curday = Game.actorMgr.getChannelOpenDays() - this.data.config.baseItem.nstartday;
        if (curday -  this.data.config.baseItem.nvaliday > 0) {
            SystemTipsMgr.instance.notice('活动已结束');
            return;
        }
        let progressValue = curday;
        if (progressValue != this.data.itemData.nday && !Utils.checkBitFlag(this.data.stateData.nsignflag , this.index)) {
            if (!Game.signMgr.checkBoughtWeek()) {
                return;
            }
            Game.battlePassMgr.reqBattlePass4GetSignFv(this.data.config.baseItem.nid , this.index);
        } else {
            Game.battlePassMgr.reqBattlePass4GetReward(this.data.config.baseItem.nid , this.index);
        }
    }

    private checkCanGetItem() {
        const len = this.canGetIndexs.length;
        let index = 0;
        for (let i = 0 ; i < len ; i++) {
            if (this.canGetIndexs[i] == 1) {
                let light = this.getLightNode(index);
                light.active = true;
                let rewardItem = this['goodsItem' + (i + 1)].node;
                light.x = rewardItem.x;
                light.y = rewardItem.y;

                if (this.isCards[i]) {
                    light.width = 83;
                    light.height = 105;
                } else {
                    light.width = light.height = 88;
                }

                this['goodsItem' + (i + 1)].showCardEffect = false;
                index ++;
            }
        }
    }

    private getLightNode(index:number):cc.Node {
        if (index < this.lightNodes.length) {
            return this.lightNodes[index];
        }

        let light = cc.instantiate(this.imgLightNode);
        this.imgLightParent.addChild(light);
        this.lightNodes.push(light);
        return light;
    }

    private hideFrameEffect() {
        this.lightNodes.forEach(element => {
            element.active = false;
        });
    }

    private setGoodsItemData(goodsItem:GoodsItem , goodsid:number , num:number , geted:boolean ,gray:boolean , index:number) {
        let goodsCfg = Game.goodsMgr.getGoodsInfo(goodsid);
        if (!goodsCfg) return;
        let isCard = Game.goodsMgr.isCard(goodsid);
        goodsItem.limit = isCard ? this._cardLimit : this._otherLimit;
        goodsItem.title.node.y = isCard ? goodsItem.titleY - 10 : goodsItem.titleY;
        goodsItem.bg.node.active = !isCard;
        if (goodsItem.mask2) {
            goodsItem.mask2.width = isCard ? 67 : 73;
            goodsItem.mask2.height = isCard ? 90 : 74;
        }
        let goodsData:GoodsItemData = {
            goodsId:goodsid,
            nums:num,
            showGou:geted,
            gray:gray,
            prefix:"x",
        }
        goodsItem.showCardEffect = false;
        goodsItem.setData(goodsData);
        this.isCards[index] = isCard;
    }

    private grayGoodsItem(flag:boolean) {
        NodeUtils.setNodeGray(this.goodsItem3.node , flag);
        NodeUtils.setNodeGray(this.goodsItem1.node , flag);
        NodeUtils.setNodeGray(this.goodsItem2.node , flag);
    }
}