import Game from "../../Game";
import { EVENT_REDPOINT } from "../../redPoint/RedPointSys";
import BaseItem from "../../utils/ui/BaseItem";
import { NodeUtils } from "../../utils/ui/NodeUtils";
import GoodsItem, { GoodsItemData } from "../newhand_book/GoodsItem";

const { ccclass, property ,menu } = cc._decorator;

@ccclass
@menu('Game/ui/active-taqing/ActiveTaqing_SignItem')
export class ActiveTaqing_SignItem extends BaseItem {

    @property(cc.Label)
    dayLabel:cc.Label = null;

    @property(cc.Label)
    btnLabel:cc.Label = null;

    @property(cc.Node)
    tvImg:cc.Node = null;

    @property(cc.Node)
    yiqianNode:cc.Node = null;

    @property([GoodsItem])
    goodsItems:GoodsItem[] = [];

    @property(cc.Color)
    preColor:cc.Color = null;

    

    @property(cc.Color)
    curDayColor:cc.Color = null;

    @property(cc.Color)
    nextColor:cc.Color = null;

    @property(cc.Color)
    signColor:cc.Color = null;

    @property(cc.Color)
    curDayBtnLabelColor:cc.Color = null;

    @property(cc.Color)
    preBtnLabelColor:cc.Color = null;

    @property(cc.Sprite)
    bg1:cc.Sprite = null;
    @property(cc.Sprite)
    bg2:cc.Sprite = null;

    @property(cc.SpriteFrame)
    curDayBg1Sf:cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    curDayBg2Sf:cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    normalBg1Sf:cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    normalBg2Sf:cc.SpriteFrame = null;

    @property
    buqianX:number = 0;
    @property
    centerX:number = 0;

    private _gray:boolean = false;
    /*
    rewards:[this._sign.rewarditemlist[i * 2] , this._sign.rewarditemlist[i * 2 + 1]],
                    flag:this._data.nsignday[i],
                    curDay:this._curDay,
                    */
    /**
     * 
     * @param data 
     * @param index 
     */
    setData(data:any , index:number) {

        this.clearRedPoint();

        super.setData(data , index);
        if (!data) return;
        Game.redPointSys.registerRedPointSub(EVENT_REDPOINT.FESTIVAL_ACTIVE_SIGN_ITEM , this.index.toString() , this.bg2.node);
        this.dayLabel.string = `第${index + 1}天`;
        this.yiqianNode.active = data.flag;
        this.bg2.node.active = this.tvImg.active = this.btnLabel.node.active = !data.flag;

        let goodsLen = this.goodsItems.length;
        for (let i = 0 ; i < goodsLen ; i++) {
            let reward = data.rewards[i];
            if (reward && reward.ngoodsid > 0) {
                let goodsItemData:GoodsItemData = {
                    goodsId:reward.ngoodsid,
                    nums:reward.ngoodsnum,
                    prefix:"x",
                    showGou:data.flag == 1,
                    gray:data.flag == 1,
                }
                this.goodsItems[i].setData(goodsItemData);
            }
        }


        if (!data.flag) {
            if (index < data.curDay) {
                this.btnLabel.string = '补签';
                this.btnLabel.node.x = this.buqianX;
                this.btnLabel.node.color = this.preBtnLabelColor || this.preColor;
                this.dayLabel.node.color = this.preColor;
                this.setGoodsNameColor(this.preColor);
                this.resetGray();
            } else if (index == data.curDay) {
                this.tvImg.active = false;
                this.btnLabel.string = '点击签到';
                this.btnLabel.node.x = this.centerX;

                if (index != 6) {
                    this.btnLabel.node.color = this.signColor;
                    this.dayLabel.node.color = this.curDayColor;
                    this.setGoodsNameColor(this.curDayColor);
                }

                this.resetGray();

            } else {
                this.tvImg.active = false;
                this.btnLabel.string = '待签到';
                this.btnLabel.node.x = this.centerX;

                const btn = this.bg2.node.getComponent(cc.Button);
                if (btn) {
                    btn.transition = cc.Button.Transition.NONE;
                    btn.interactable = false;
                }
                NodeUtils.setNodeGray(this.node , true);
                this._gray = true;
            }
        }

        if (index != 6) {
            this.bg1.spriteFrame = index < data.curDay ? this.normalBg1Sf : this.curDayBg1Sf;
            this.bg2.spriteFrame = index < data.curDay ? this.normalBg2Sf : this.curDayBg2Sf;
        }

    }

    private setGoodsNameColor(color:cc.Color) {
        this.goodsItems.forEach(element => {
            element.title.node.color = color;
        });
    }

    onClick() {
        if (!this.data) return;
        Game.festivalActivityMgr.reqSignReward(this.index);
    }

    private resetGray() {
        if (this._gray) {
            this.bg2.node.getComponent(cc.Button).interactable = true;
            NodeUtils.setNodeGray(this.node , false);
        }
    }

    private clearRedPoint() {
        if (this._data) {
            Game.redPointSys.unregisterRedPointSub(EVENT_REDPOINT.FESTIVAL_ACTIVE_SIGN_ITEM , this.index.toString() , this.bg2.node);
        }
    }

    onDestroy() {
       this.clearRedPoint();
    }

}