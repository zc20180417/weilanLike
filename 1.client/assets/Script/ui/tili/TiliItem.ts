import BaseItem from "../../utils/ui/BaseItem";
import { NodeUtils } from "../../utils/ui/NodeUtils";
import Game from "../../Game";
import { MALL_PRICETYPE, ActorProp, ServerDefine } from "../../net/socket/handler/MessageEnum";
import { EventEnum } from "../../common/EventEnum";
import ImageLoader from "../../utils/ui/ImageLoader";
import { GS_MallGoodsList_MallGoodsItem, GS_MallPrivateData_MallPrivateData } from "../../net/proto/DMSG_Plaza_Sub_Mall";
import { StringUtils } from "../../utils/StringUtils";
import SystemTipsMgr from "../../utils/SystemTipsMgr";
import { BuryingPointMgr, EBuryingPoint } from "../../buryingPoint/BuryingPointMgr";
import GlobalVal from "../../GlobalVal";
import { GameEvent } from "../../utils/GameEvent";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("Game/ui/TiliItem")
export class TiliItem extends BaseItem {

    @property(ImageLoader)
    ico: ImageLoader = null;

    @property(cc.Sprite)
    moneyIco: cc.Sprite = null;

    @property(cc.Label)
    moneyLabel: cc.Label = null;

    @property(cc.Button)
    btn: cc.Button = null;

    @property(cc.SpriteFrame)
    tvSf: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    dmSf: cc.SpriteFrame = null;

    @property(cc.Label)
    title: cc.Label = null;

    @property(cc.Label)
    titleNum: cc.Label = null;

    @property(cc.Label)
    des: cc.Label = null;

    @property(cc.Label)
    time: cc.Label = null;

    @property(cc.Node)
    soldOut: cc.Node = null;

    enableClick: boolean = false;

    start() {
        GameEvent.on(EventEnum.PLAYER_PROP_CHANGE + ActorProp.ACTOR_PROP_DIAMONDS, this.itemChange, this);
        // GameEvent.on(EventEnum.ITEM_COUNT_CHANGE , this.itemChange , this));
        // if (this.data && this.data.price > 0) {
        //     this.refreshDiamond(Game.itemMgr.getItemCount(ItemMoneyType.DIAMOND));
        // }
        if (MALL_PRICETYPE.MALL_PRICETYPE_FREEVIDEO == this.data.btpricetype) {
            GameEvent.on(EventEnum.MALL_UPDATE_PRIVATE_DATA, this.onPrivateData, this);
        }
        super.start();

    }

    onDisable() {
        GameEvent.targetOff(this);
    }

    setData(data: any, index?: number) {
        super.setData(data, index);
        if (!data) return;

        let serverData: GS_MallGoodsList_MallGoodsItem = data as GS_MallGoodsList_MallGoodsItem;
        this.ico.setPicId(serverData.npicid);

        let enabled: boolean = false;

        this.des.string = serverData.sztitle;

        this.time.node.active = false;

        if (MALL_PRICETYPE.MALL_PRICETYPE_DIAMONDS == serverData.btpricetype) {
            this.moneyLabel.string = serverData.npricenums.toString();
            this.title.node.active = false;
            this.moneyIco.spriteFrame = this.dmSf;
            enabled = serverData.npricenums <= Game.actorMgr.getProp(ActorProp.ACTOR_PROP_DIAMONDS);
            NodeUtils.enabled(this.btn, enabled);
        }
        else if (MALL_PRICETYPE.MALL_PRICETYPE_FREEVIDEO == serverData.btpricetype) {
            this.moneyLabel.string = GlobalVal.closeAwardVideo ? "周卡领取" : "免 费";
            let privateData = Game.mallProto.getUpdataPrivateDataById(serverData.nrid);
            this.onPrivateData(privateData);
            this.moneyIco.spriteFrame = this.tvSf;

            if (GlobalVal.closeAwardVideo) {
                this.moneyIco.node.active = false;
                this.moneyLabel.node.x = 115;
            }
        }
    }

    showBtn() {
        this.moneyLabel.node.active = true;
        this.moneyIco.node.active = true;
    }

    hdieBtn() {
        this.moneyLabel.node.active = false;
        this.moneyIco.node.active = false;
    }

    onClick() {
        if (!this.data) return;
        //如果体力是满的，则无则不允许购买
        if (Game.actorMgr.getStrength() >= ServerDefine.MAX_STRENGTH) return SystemTipsMgr.instance.notice("当前体力已满，无需购买体力");

        if (MALL_PRICETYPE.MALL_PRICETYPE_DIAMONDS == this.data.btpricetype) {
            Game.mallProto.buy(this.data.nrid);
            BuryingPointMgr.post(EBuryingPoint['TOUCH_TILI_' + this.index]);
        }
        else if (MALL_PRICETYPE.MALL_PRICETYPE_FREEVIDEO == this.data.btpricetype && Game.mallProto.checkPrivateGoodsTime(this.data.nrid, this.data.btpricetype)) {
            BuryingPointMgr.curShopBuryingType = EBuryingPoint.TOUCH_TILI_FREE_VIDEO;

            if (!Game.signMgr.checkBoughtWeek()) {
                return;
            }

            //BuryingPointMgr.post(EBuryingPoint.TOUCH_TILI_FREE_VIDEO);
            Game.mallProto.getFreeVideoOrder(this.data.nrid);
        }
    }

    private itemChange(newValue: number, oldValue: number) {

        let isEnough = this.data.npricenums <= newValue;
        NodeUtils.enabled(this.btn, isEnough);

    }

    protected onPrivateData(privateData: GS_MallPrivateData_MallPrivateData) {
        let serverData: GS_MallGoodsList_MallGoodsItem = this.data as GS_MallGoodsList_MallGoodsItem;
        if (!serverData || (privateData && privateData.nid != serverData.nrid)) return;
        let times: number = serverData.nlimitbuycount - (privateData ? privateData.nbuycount : 0);
        this.titleNum.string = times + " ";
        let enabled = times > 0 ? true : false;
        // NodeUtils.enabled(this.btn, enabled);

        this.enableClick = Game.mallProto.checkPrivateGoodsTime(this.data.nrid, this.data.btpricetype, false);
        if (enabled) {
            //更新按钮状态
            if (!this.enableClick) {
                this.time.node.active = true;
                this.hdieBtn();
            } else {
                this.time.node.active = false;
                this.showBtn();
            }
        } else {
            this.time.node.active = false;
            this.soldOut.active = true;
            this.btn.node.active=false;
            this.hdieBtn();
        }
    }

    update(dt) {
        if (!this.enableClick) {
            let time = Game.mallProto.getPrivateGoodTime(this.data.nrid);
            if (time > 0) {
                this.time.string = StringUtils.doInverseTime(time);
            } else {
                this.time.node.active = false;
                this.showBtn();
                this.enableClick = false;
            }
        }
    }
}