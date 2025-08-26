
import BaseItem from "../../utils/ui/BaseItem";
import GroupImage from "../../utils/ui/GroupImage";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { StringUtils } from "../../utils/StringUtils";
import { NodeUtils } from "../../utils/ui/NodeUtils";
import { MALL_PRICETYPE, ActorProp, GOODS_ID } from "../../net/socket/handler/MessageEnum";
import ImageLoader from "../../utils/ui/ImageLoader";
import { BuryingPointMgr, EBuryingPoint } from "../../buryingPoint/BuryingPointMgr";
import { GS_MallGoodsList_MallGoodsItem } from "../../net/proto/DMSG_Plaza_Sub_Mall";
import { GameEvent } from "../../utils/GameEvent";


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("Game/ui/shop/SkillShopItem")
export class SkillShopItem extends BaseItem {


    @property(cc.Sprite)
    skillIco: cc.Sprite = null;

    @property(cc.SpriteAtlas)
    atlas: cc.SpriteAtlas = null;

    @property(cc.Label)
    desLabel: cc.Label = null;

    @property(cc.Node)
    freeImg: cc.Node = null;

    @property(cc.Sprite)
    nameImg:cc.Sprite = null;

    @property(GroupImage)
    countGroup: GroupImage = null;

    @property(cc.Node)
    freeNode: cc.Node = null;

    @property(cc.Button)
    buyBtn: cc.Button = null;

    @property(cc.Label)
    curCountLabel: cc.Label = null;

    @property(ImageLoader)
    iconBg: ImageLoader = null;

    @property(ImageLoader)
    priceIco:ImageLoader = null;

    

    private _countStr: string = "已有数量:%s";
    start() {
        GameEvent.on(EventEnum.PLAYER_PROP_CHANGE + ActorProp.ACTOR_PROP_DIAMONDS, this.diamondChange, this);
        GameEvent.on(EventEnum.ITEM_COUNT_CHANGE, this.itemChange, this);
        super.start();

    }

    onDisable() {
        GameEvent.targetOff(this);
    }

    setData(data: GS_MallGoodsList_MallGoodsItem, index?: number) {
        super.setData(data, index);
        if (!this.data) return;
        this.iconBg.setPicId(this.data.npicid);
        this.nameImg.spriteFrame = this.atlas.getSpriteFrame("text_skill_" + this.data.ngoodsid);
        this.desLabel.string = this.data.szdes;

        this.curCountLabel.string = StringUtils.format(this._countStr, Game.containerMgr.getItemCount(this.data.ngoodsid));
        this.freeImg.active = this.freeNode.active = MALL_PRICETYPE.MALL_PRICETYPE_FREEVIDEO == this.data.btpricetype;
        this.priceIco.node.active = this.countGroup.node.active = MALL_PRICETYPE.MALL_PRICETYPE_DIAMONDS == this.data.btpricetype || MALL_PRICETYPE.MALL_PRICETYPE_GOODS == this.data.btpricetype;
        if (MALL_PRICETYPE.MALL_PRICETYPE_DIAMONDS == this.data.btpricetype) {
            this.priceIco.setPicId(Game.goodsMgr.getGoodsInfo(GOODS_ID.DIAMOND).npacketpicid);
            this.countGroup.contentStr = this.data.npricenums + '';
            this.refreshDiamond(Game.actorMgr.getProp(ActorProp.ACTOR_PROP_DIAMONDS));
        } else if (MALL_PRICETYPE.MALL_PRICETYPE_GOODS == this.data.btpricetype) {
            this.priceIco.setPicId(Game.goodsMgr.getGoodsInfo(data.npricegoodsid).npacketpicid);
            this.countGroup.contentStr = this.data.npricenums + '';
            this.refreshDiamond((Game.containerMgr.getItemCount(data.npricegoodsid)));
        } 

    }

    onClick() {
        if (!this.data || !this.data.ngoodsid) return;
        BuryingPointMgr.post(EBuryingPoint.BUY_SKILL_SHOP_INDEX + (this.data.ngoodsid));
        BuryingPointMgr.curShopBuryingType = null;
        if (MALL_PRICETYPE.MALL_PRICETYPE_DIAMONDS == this.data.btpricetype || MALL_PRICETYPE.MALL_PRICETYPE_GOODS == this.data.btpricetype) {
            Game.mallProto.buy(this.data.nrid);
        }
        else if (MALL_PRICETYPE.MALL_PRICETYPE_FREEVIDEO == this.data.btpricetype && Game.mallProto.checkPrivateGoodsTime(this.data.nrid,this.data.btpricetype)) {
            Game.mallProto.getFreeVideoOrder(this.data.nrid);
        }

        // if (this.data.price > 0) {
        //     if (Game.itemMgr.deleteItem(ItemMoneyType.DIAMOND , this.data.price)) {
        //         Game.itemMgr.addItem(this.data.skillID , 1);
        //     }
        // } else {
        //     Game.itemMgr.addItem(this.data.skillID , 1);
        // }
    }

    private itemChange(id: number, count: number) {
        if (this.data && id == this.data.ngoodsid) {
            this.curCountLabel.string = StringUtils.format(this._countStr, count);
        }

        if (this.data && id == this.data.npricegoodsid) {
            this.refreshDiamond(count);
        }
    }

    private diamondChange(newValue: number, oldValue: number) {
        this.refreshDiamond(newValue);
    }

    private refreshDiamond(count: number) {
        if (!this.data || this.data.npricenums == 0) return;
        let isEnough = this.data.npricenums <= count;
        NodeUtils.enabled(this.buyBtn, isEnough);
    }

}