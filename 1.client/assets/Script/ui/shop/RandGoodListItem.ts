// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseItem from "../../utils/ui/BaseItem";
import { GS_MallListGoodsList_MallListGoodsItem, GS_MallPrivateData_MallPrivateData, GS_MallRandListGoodsList_MallRandListGoodsItem } from "../../net/proto/DMSG_Plaza_Sub_Mall";
import { NodeUtils } from "../../utils/ui/NodeUtils";
import Game from "../../Game";
import { ActorProp, GOODS_ID, GOODS_TYPE, MALL_LIMITTYPE, MALL_PRICETYPE } from "../../net/socket/handler/MessageEnum";
import { EventEnum } from "../../common/EventEnum";
import { EResPath } from "../../common/EResPath";
import ImageLoader from "../../utils/ui/ImageLoader";
import { StringUtils } from "../../utils/StringUtils";
import GlobalVal from "../../GlobalVal";
import { Handler } from "../../utils/Handler";
import { UiManager } from "../../utils/UiMgr";
import { SKIN_QUALITY_COLOR } from "../../common/AllEnum";
import { GameEvent } from "../../utils/GameEvent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RandGoodListItem extends BaseItem {
    @property(ImageLoader)
    icon: ImageLoader = null;
    // @property(cc.Label)
    // title: cc.Label = null;
    @property(cc.Label)
    rmbCoast: cc.Label = null;

    @property(cc.Label)
    diaCoast: cc.Label = null;

    @property(cc.Label)
    freeLabel: cc.Label = null;

    @property(cc.Label)
    timeLabel: cc.Label = null;

    @property(cc.Node)
    timeNode: cc.Node = null;

    @property(cc.Label)
    num: cc.Label = null;

    @property(cc.Node)
    soldOutNode: cc.Node = null;

    @property(cc.Node)
    freeNode: cc.Node = null;

    @property(cc.Node)
    diaNode: cc.Node = null;

    @property(cc.Node)
    rmbNode: cc.Node = null;

    @property(cc.Node)
    btnNode: cc.Node = null;

    @property(cc.Label)
    des: cc.Label = null;

    @property(cc.Label)
    title: cc.Label = null;

    @property(cc.Node)
    disCountNode: cc.Node = null;

    @property(cc.Label)
    disCountLabel: cc.Label = null;

    _enableUpdateTime: boolean = null;

    private _onClickCallBack: Handler;
    onEnable() {
        this.addEvent();
        // this.refresh();
    }

    onDisable() {
        GameEvent.targetOff(this);
    }

    addEvent() {
        GameEvent.on(EventEnum.MALL_UPDATE_PRIVATE_DATA, this.onUpdatePrivateData, this);
    }

    public refresh() {
        if (!this.data) return;

        let data = this.data as GS_MallRandListGoodsList_MallRandListGoodsItem;
        // this.icon.url = EResPath.TOWER_IMG + Game.towerMgr.get3dpicres(this._currTowerCfg.ntroopsid, this._currTowerCfg);
        //图标
        if (this.icon) {
            this.icon.setPicId(data.npicid);
        }

        //物品数量
        if (this.num) {
            this.num.string = "x" + data.sboundcount.toString();
        }

        //描述
        if (this.des) {
            this.des.string = data.szdes;
        }

        //标题
        if (this.title) {
            this.title.string = data.sztitle;
            this.title.node.color = cc.color(SKIN_QUALITY_COLOR[data.btquality] || "#fff");
        }

        if (!StringUtils.isNilOrEmpty(data.szdes)) {
            let btnComp = this.icon.node.getComponent(cc.Button);
            if (!btnComp) {
                btnComp = this.icon.node.addComponent(cc.Button);
            }
            this.icon.node.on('click', this.onIcoClick, this);
        }

        switch (this.data.btpricetype) {
            case MALL_PRICETYPE.MALL_PRICETYPE_FREEVIDEO:
                this.freeRefresh();
                break;
            case MALL_PRICETYPE.MALL_PRICETYPE_DIAMONDS:
                this.diaRefresh();
                break;
            case MALL_PRICETYPE.MALL_PRICETYPE_RMB:
                this.rmbRefresh();
                break;
        }

        this.refreshSoldOut();
        this.refreshTimeDes();
    }

    setClickCallBack(handler: Handler) {
        this._onClickCallBack = handler;
    }

    private onIcoClick() {
        let btnComp = this.icon.node.getComponent(cc.Button);
        if (btnComp) {
            if (!btnComp.interactable) {
                return;
            }
        }

        if (this.data && !StringUtils.isNilOrEmpty(this.data.szdes)) {
            let offset = cc.Vec2.ZERO;
            UiManager.showDialog(EResPath.ANY_TIPS_VIEW, { title: this.data.sztitle, info: this.data.szdes, node: this.icon.node, offset: offset });
        }
    }

    private diaRefresh() {
        this.diaNode && (this.diaNode.active = true);
        this.diaCoast && (this.diaCoast.node.active = true);
        this.rmbNode && (this.rmbNode.active = false);
        this.rmbCoast && (this.rmbCoast.node.active = false);
        this.freeNode && (this.freeNode.active = false);
        this.freeLabel && (this.freeLabel.node.active = false);
        this.disCountNode && (this.disCountNode.active = false);
        this.btnNode.active = true;
        //扣除物品数量
        if (this.diaCoast) {
            this.diaCoast.string = this.data.npricenums.toString();
        }

        let diamond = Game.actorMgr.getProp(ActorProp.ACTOR_PROP_DIAMONDS);
        let isEnough = this.data.npricenums <= diamond;
        this.refreshBtnState(isEnough);
        // this.refreshBtnState();
    }

    private rmbRefresh() {
        this.diaNode && (this.diaNode.active = false);
        this.diaCoast && (this.diaCoast.node.active = false);
        this.rmbNode && (this.rmbNode.active = true);
        this.rmbCoast && (this.rmbCoast.node.active = true);
        this.freeNode && (this.freeNode.active = false);
        this.freeLabel && (this.freeLabel.node.active = false);
        this.disCountNode && (this.disCountNode.active = false);

        this.btnNode.active = true
        if (this.rmbCoast) {
            this.rmbCoast.string = " ¥ " + this.data.npricenums.toString();
        }
    }

    private freeRefresh() {
        this.diaNode && (this.diaNode.active = false);
        this.diaCoast && (this.diaCoast.node.active = false);
        this.rmbNode && (this.rmbNode.active = false);
        this.rmbCoast && (this.rmbCoast.node.active = false);
        this.freeNode && (this.freeNode.active = true);
        this.freeLabel && (this.freeLabel.node.active = true);
        this.disCountNode && (this.disCountNode.active = false);
        this.btnNode.active = true
    }


    private refreshBtnState(isEnough: boolean) {
        NodeUtils.enabled(this.btnNode.getComponent(cc.Button), isEnough);
    }

    private onClick() {
        if (this._onClickCallBack) {
            this._onClickCallBack.execute();
        }

        if (MALL_PRICETYPE.MALL_PRICETYPE_FREEVIDEO == this.data.btpricetype) {
            Game.mallProto.getFreeVideoOrder(this.data.nrid);
            // this.diamondBtnNode && (this.diamondBtnNode.active = false);
            // this.freeBtnNode.active = false;
            // this.soldOutNode.active = true;
        } else if (MALL_PRICETYPE.MALL_PRICETYPE_DIAMONDS == this.data.btpricetype) {
            Game.mallProto.buy(this.data.nrid);
        } else if (MALL_PRICETYPE.MALL_PRICETYPE_RMB == this.data.btpricetype) {
            Game.mallProto.rmbBuy(this.data.nrid);
        } else if (MALL_PRICETYPE.MALL_PRICETYPE_GOODS == this.data.btpricetype) {
            Game.mallProto.buy(this.data.nrid);
        }
    }

    update(dt: number) {
        if (!this._enableUpdateTime) return;
        this.refreshTimeDes();
    }

    private refreshSoldOut() {
        let tagData = Game.mallProto.getRandGoodTagCfg(this.data.utagid);
        let privateData = Game.mallProto.getUpdataPrivateDataById(this.data.utagid);
        if (!privateData) return;
        if (this.soldOutNode) {
            if (tagData.nlimitbuycount <= privateData.nbuycount) {
                this.soldOutNode.active = true;
                this.btnNode.active = false;

                this.diaNode && (this.diaNode.active = false);
                this.diaCoast && (this.diaCoast.node.active = false);
                this.rmbNode && (this.rmbNode.active = false);
                this.rmbCoast && (this.rmbCoast.node.active = false);
                this.freeNode && (this.freeNode.active = false);
                this.freeLabel && (this.freeLabel.node.active = false);
            } else {
                this.soldOutNode.active = false;
            }
        }
    }

    private refreshTimeDes() {
        let data = this.data as GS_MallRandListGoodsList_MallRandListGoodsItem;
        let tagData = Game.mallProto.getRandGoodTagCfg(data.utagid);
        let enableShowTime: boolean = true;
        let times: number = 0;
        switch (tagData.btlimittype) {
            case MALL_LIMITTYPE.MALL_LIMITTYPE_DAY:
                times = StringUtils.getTimesByDay();
                break;
            case MALL_LIMITTYPE.MALL_LIMITTYPE_WEEK:
                times = StringUtils.getTimesByWeek();
                break;
            case MALL_LIMITTYPE.MALL_LIMITTYPE_MONTH:
                times = StringUtils.getTimesByMonth();
                break;
            case MALL_LIMITTYPE.MALL_LIMITTYPE_NULL:
            case MALL_LIMITTYPE.MALL_LIMITTYPE_MAX:
                enableShowTime = false;
                break;
        }
        //时间
        if (this.timeNode) {
            if (enableShowTime) {
                this._enableUpdateTime = true;
                this.timeNode.active = true;
                let now = GlobalVal.getServerTime() / 1000;
                let dt = now - times / 1000;
                this.timeLabel.string = StringUtils.doInverseTime(Math.abs(dt));
            } else {
                this.timeNode.active = false;
                this._enableUpdateTime = false;
            }
        }
    }

    private onUpdatePrivateData(privateData: GS_MallPrivateData_MallPrivateData) {
        if (!this.data || (privateData && this.data.utagid != privateData.nid)) return;
        this.refresh();
    }

}
