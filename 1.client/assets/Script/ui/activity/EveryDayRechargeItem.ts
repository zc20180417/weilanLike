import Game from "../../Game";
import { GOODS_TYPE } from "../../net/socket/handler/MessageEnum";
import { Handler } from "../../utils/Handler";
import BaseItem from "../../utils/ui/BaseItem";
import ImageLoader from "../../utils/ui/ImageLoader";
import CardQuailtyEffect from "../CardQuailtyEffect";

const { ccclass, property, menu } = cc._decorator;
/**
 * 物品列表
 */
@ccclass
@menu("Game/ui/active/EveryDayRechargeItem")
export class EveryDayRechargeItem extends BaseItem {
    @property(cc.Sprite)
    bg: cc.Sprite = null;

    @property([cc.SpriteFrame])
    bgs: cc.SpriteFrame[] = [];

    @property(cc.Label)
    numLabel:cc.Label = null;

    @property(ImageLoader)
    ico:ImageLoader = null;

    private _cardEftComp:CardQuailtyEffect = null;
    start() {
        this.ico.setTexCb(new Handler(this.onSetTex , this));
    }

    private onSetTex() {
        if (this.ico.node.height > 100) {
            this.node.width = 80;
        }

        if (this._cardEftComp) {
            this._cardEftComp.node.scale = this.ico.node.scale;
        }
    }

    setData(data:any , index:number) {
        super.setData(data , index);
        if (!data) return;

        let goodsCfg = Game.goodsMgr.getGoodsInfo(this.data.goodsId);
        let showEft = false;
        if (goodsCfg) {
            if (goodsCfg.lgoodstype == GOODS_TYPE.GOODSTYPE_RES_UPGRADESTAR || goodsCfg.lgoodstype == GOODS_TYPE.GOODSTYPE_RES_SKIN) {
                this.ico.sizeIsRaw = true;
                this.ico.limitMaxWid = 140;
                this.ico.limitMaxHeight = 140;
                this.node.height = 140;

                if (!this._cardEftComp) {
                    let eftNode:cc.Node = new cc.Node();
                    this._cardEftComp = eftNode.addComponent(CardQuailtyEffect);
                    eftNode.x = this.ico.node.x;
                    eftNode.y = this.ico.node.y;
                    this.ico.node.parent.addChild(eftNode);
                }

                this._cardEftComp.showCardEffect(goodsCfg.btquality);
                // this.ico.setTexCb(new Handler(this.onIcoLoaded , this));
                showEft = true;
            } else {
                this.ico.imageWidth = this.ico.imageHeight = 73;
                this.ico.limitMaxHeight = 60;
                this.ico.limitMaxWid = 100;
                this.ico.node.height = 73;
                this.node.height = 73;
                this.ico.sizeIsRaw = false;
            }

            this.ico.setPicId(goodsCfg.npacketpicid);
            this.numLabel.string = goodsCfg.szgoodsname + " x" +  this.data.nums;
            this.bg && (this.bg.spriteFrame = this.bgs[cc['math'].clamp(goodsCfg.btquality, 0, this.bgs.length - 1)]);
            if (!showEft && this._cardEftComp) {
                this._cardEftComp.showCardEffect(0);
            }
            
        }
    }



}