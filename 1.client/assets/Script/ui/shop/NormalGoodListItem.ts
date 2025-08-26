// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseItem from "../../utils/ui/BaseItem";
import { GS_MallGoodsList_MallGoodsItem, GS_MallPrivateData_MallPrivateData } from "../../net/proto/DMSG_Plaza_Sub_Mall";
import { MALL_LIMITTYPE, ActorProp, MALL_PRICETYPE, GOODS_TYPE, GOODS_ID } from "../../net/socket/handler/MessageEnum";
import { EventEnum } from "../../common/EventEnum";
import { NodeUtils } from "../../utils/ui/NodeUtils";
import Game from "../../Game";
import ImageLoader from "../../utils/ui/ImageLoader";
import { Handler } from "../../utils/Handler";
import { StringUtils } from "../../utils/StringUtils";
import { UiManager } from "../../utils/UiMgr";
import { EResPath } from "../../common/EResPath";
import GlobalVal from "../../GlobalVal";
import { GameEvent } from "../../utils/GameEvent";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("Game/ui/shop/NormalGoodListItem")
export default class NormalGoodListItem extends BaseItem {

    @property(ImageLoader)
    icon: ImageLoader = null;

    @property(cc.Label)
    title: cc.Label = null;

    @property(cc.Label)
    des: cc.Label = null;

    @property(cc.Label)
    limitDes: cc.Label = null;

    @property(cc.Node)
    soldOutNode: cc.Node = null;

    @property(cc.Label)
    num: cc.Label = null;

    @property(cc.Label)
    rmbCoast: cc.Label = null;

    @property(cc.Label)
    diaCoast: cc.Label = null;

    @property(cc.Node)
    freeLabNode: cc.Node = null;

    @property(cc.Node)
    freeNode: cc.Node = null;

    @property(cc.Node)
    diaNode: cc.Node = null;

    @property(cc.Node)
    rmbNode: cc.Node = null;

    @property(cc.Node)
    btnNode: cc.Node = null;

    @property(cc.Node)
    doubleReward: cc.Node = null;

    @property(cc.RichText)
    extraRewardLabel: cc.RichText = null;

    @property(cc.Label)
    timeLab: cc.Label = null;

    @property(cc.Node)
    timeIco: cc.Node = null;

    @property(cc.Label)
    rateDes: cc.Label = null;

    @property(ImageLoader)
    ico:ImageLoader = null;

    @property
    isYaoshi:boolean = false;

    @property(cc.Label)
    activeLabel: cc.Label = null;


    private _onClickCallBack: Handler;

    private isCd: boolean = false;

    private registerRedPoint: boolean = false;
    private registerRedPointType:string = '';
    private rateTipsData:any;

    notEnoughCanClick = false;

    onEnable() {
        this.addEvent();
        // this.refresh();
    }

    setRateTipsData(value:any) {
        this.rateTipsData = value;
    }

    private onWenClick() {
        if (this.rateTipsData) {
            UiManager.showDialog(EResPath.RICHTEXT_TIPS_VIEW , this.rateTipsData);
        }
    }

    public checkIsOpen(func:number) {
        const flag = Game.globalFunc.isFuncOpened(func);
        this.activeLabel.node.active = !flag;
        this.diaNode.active = flag;
        this.diaCoast.node.active = flag;
        this.rmbCoast.node.active = flag;
        this.rmbNode.active = flag;
        this.freeNode.active = flag;
        this.freeLabNode.active = flag;
        this.btnNode.active = flag;
        this.timeLab.node.active = flag;

        if (!flag) {
            if (!this.data) return;
            let data = this.data as GS_MallGoodsList_MallGoodsItem;
            //图标
            if (this.icon) {
                this.icon.setPicId(data.npicid);
            }

            //名称
            if (this.title) {
                this.title.string = data.sztitle;
            }

            //数量
            if (this.num) {
                this.num.string = "x" + data.sboundcount;
            }

            const cfg = Game.globalFunc.getOpenCfg(func);
            this.activeLabel.string = `通关第${Math.floor(cfg.funcOpenCondition / 40)}章解锁`;
        } else {
            this.refresh();
        }
       
    }

    public refresh() {
        if (!this.data) return;
        let data = this.data as GS_MallGoodsList_MallGoodsItem;

        //至尊宝箱需要注册红点  
        // if (!this.registerRedPoint && this.data && MALL_PRICETYPE.MALL_PRICETYPE_FREE_GOODS == this.data.btpricetype && !this.isYaoshi) {
        //     this.registerRedPoint = true;
        // }

        if (!StringUtils.isNilOrEmpty(this.registerRedPointType) && !this.registerRedPoint) {
            this.registerRedPoint = true;
            Game.redPointSys.registerRedPoint(this.registerRedPointType, this.btnNode);
        }

        //图标
        if (this.icon) {
            this.icon.setPicId(data.npicid);
        }

        //名称
        if (this.title) {
            this.title.string = data.sztitle;
        }

        //数量
        if (this.num) {
            this.num.string = "x" + data.sboundcount;
        }

        this.refreshRateDes();

        //描述
        if (!StringUtils.isNilOrEmpty(data.szdes)) {
            if (this.des)
                this.des.string = data.szdes;
            let btnComp = this.icon.node.getComponent(cc.Button);
            if (!btnComp) {
                btnComp = this.icon.node.addComponent(cc.Button);
            }
            this.icon.node.on('click', this.onIcoClick, this);
        }

        //跨天时这些节点需要重新显示
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
            case MALL_PRICETYPE.MALL_PRICETYPE_FREE_DIAMONDS:
                this.freeDiamondsRefresh();
                break;
            case MALL_PRICETYPE.MALL_PRICETYPE_FREE_GOODS:
                this.freeGoodsRefresh();
                GameEvent.on(EventEnum.ITEM_COUNT_CHANGE , this.onItemChange , this);
                break;
            case MALL_PRICETYPE.MALL_PRICETYPE_GOODS:
                this.goodsRefresh();
                GameEvent.on(EventEnum.ITEM_COUNT_CHANGE , this.onItemChange , this);
                break;
        }

        //限制次数
        let times: number = Game.mallProto.getGoodsRestBuyCount(data.nrid);
        if (this.limitDes && MALL_LIMITTYPE.MALL_LIMITTYPE_NULL != data.btlimittype) {
            this.limitDes.node.active = true;
            let desStr = "";
            // let isLimited: boolean = data.nlimitbuycount != 0;
            switch (data.btlimittype) {
                case MALL_LIMITTYPE.MALL_LIMITTYPE_DAY:
                    desStr = "今日剩余次数: " + times;
                    break;
                case MALL_LIMITTYPE.MALL_LIMITTYPE_WEEK:
                    desStr = "本周剩余次数: " + times;
                    break;
                case MALL_LIMITTYPE.MALL_LIMITTYPE_MONTH:
                    desStr = "本月剩余次数: " + times;
                    break;
                case MALL_LIMITTYPE.MALL_LIMITTYPE_LIFE:
                    break;
            }
            this.limitDes.string = desStr;
        }

        //是否处于cd中
        this.isCd = Game.mallProto.getPrivateGoodTime(data.nrid) > 0;
        if (this.isCd) {
            this.showTimeLab();
        } else {
            this.timeLab && (this.timeLab.node.active = false);
            this.timeIco && (this.timeIco.active = false);
        }

        //是否售罄
        if (this.soldOutNode) {
            if (MALL_LIMITTYPE.MALL_LIMITTYPE_NULL != data.btlimittype && times <= 0) {
                this.limitDes && (this.limitDes.node.active = false);
                this.soldOutNode.active = true;
                this.btnNode.active = false;
                this.diaNode.active = false;
                this.diaCoast.node.active = false;
                this.rmbCoast.node.active = false;
                this.rmbNode.active = false;
                this.freeNode.active = false;
                this.freeLabNode.active = false;
                this.timeLab && (this.timeLab.node.active = false);
                this.timeIco && (this.timeIco.active = false);
            } else {
                this.soldOutNode.active = false;
            }
        }

        if (this.isYaoshi) {
            this.onItemChange(this.data.ngoodsid , 1);
        }
    }

    setRegisterRedPointType(type:string) {
        this.registerRedPointType = type;
    }

    private addEvent() {
        GameEvent.on(EventEnum.MALL_UPDATE_PRIVATE_DATA, this.onPrivateData, this);
        if (this.rateDes) {
            GameEvent.on(EventEnum.UP_DROPBOX_DATA, this.refreshRateDes, this);
        }

        if (this.isYaoshi) {
            GameEvent.on(EventEnum.ITEM_COUNT_CHANGE , this.onItemChange , this);
        }
    }

    private onItemChange(id: number, num: number) {
        if (!this.data) return;
        if (id == this.data.ngoodsid) {
            this.des.node.active = true;
            this.des.string = "当前拥有:" + Game.containerMgr.getItemCount(id);
        } else if (id == this.data.npricegoodsid) {
            if (MALL_PRICETYPE.MALL_PRICETYPE_FREE_GOODS == this.data.btpricetype) {
                this.freeGoodsRefresh();
            } else if (MALL_PRICETYPE.MALL_PRICETYPE_GOODS == this.data.btpricetype) {
                this.goodsRefresh();
            }
        }
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
            UiManager.showDialog(EResPath.ANY_TIPS_VIEW, { title: this.data.sztitle, info: this.data.szdes, node: this.icon.node });
        }
    }

    private diaRefresh() {
        this.diaNode.active = true;
        this.diaCoast.node.active = true;
        this.rmbCoast.node.active = false;
        this.rmbNode.active = false;
        this.freeNode.active = false;
        this.freeLabNode.active = false;
        this.btnNode.active = true;
        //扣除物品数量
        this.diaCoast.string = this.data.npricenums.toString();
        this.refreshDiamond();
    }

    private goodsRefresh() {
        this.diaNode.active = true;
        this.diaCoast.node.active = true;
        this.rmbCoast.node.active = false;
        this.rmbNode.active = false;
        this.freeNode.active = false;
        this.freeLabNode.active = false;
        this.btnNode.active = true;
        //扣除物品数量
        this.diaCoast.string = "x " + this.data.npricenums.toString();
        if (this.ico && this.data.npricegoodsid > 0) {
            let goodsInfo = Game.goodsMgr.getGoodsInfo(this.data.npricegoodsid);
            if (goodsInfo) {
                this.ico.setPicId(goodsInfo.npacketpicid);
            }
        }
        let isEnough = Game.containerMgr.isEnough(this.data.npricegoodsid , this.data.npricenums);
        if (this.notEnoughCanClick) {
            this.btnNode.opacity = isEnough ? 255 : 125;
        } else {
            NodeUtils.enabled(this.btnNode.getComponent(cc.Button), isEnough);
        }
        
    }

    private rmbRefresh() {
        this.diaNode.active = false;
        this.diaCoast.node.active = false;
        this.rmbCoast.node.active = true;
        this.freeNode.active = false;
        this.freeLabNode.active = false;
        this.btnNode.active = true;

        //将价格改为领取
        if (GlobalVal.setRechargeFree) {
            this.rmbNode.active = false;
            this.rmbCoast.string = '领 取';
            // this.rmbCoast.node.x = -260;
        } else {
            this.rmbNode.active = true;
            this.rmbCoast.string = this.data.npricenums.toString();
        }


        //首冲翻倍
        if (this.doubleReward) {
            this.doubleReward.active = !Game.mallProto.isInNormallBuyHistory(this.data.nrid);
            this.extraRewardLabel.node.active = true;
            this.extraRewardLabel.string = "<color=#AD5B29>首充获得<color> <color=#ea5718>" + (this.data.sboundcount * 2) + "钻<color> ";
        }

        //额外赠送
        if (this.doubleReward && !this.doubleReward.active && this.extraRewardLabel) {
            this.extraRewardLabel.node.active = this.data.ngivegoodsnum[0] > 0;
            this.extraRewardLabel.string = "<color=#AD5B29>额外赠送<color> <color=#ea5718>" + this.data.ngivegoodsnum[0] + "钻<color> ";
        }
    }

    private freeRefresh() {
        this.diaNode.active = false;
        this.diaCoast.node.active = false;
        this.rmbCoast.node.active = false;
        this.rmbNode.active = false;
        this.freeNode.active = true;
        this.freeLabNode.active = true;
        this.btnNode.active = true;

        if (GlobalVal.closeAwardVideo) {
            this.freeNode.active = false;
            this.freeLabNode.getComponent(cc.Label).string = "周卡领取";
            this.freeLabNode.x = this.btnNode.x;
        }
    }

    private freeDiamondsRefresh() {
        this.rmbCoast.node.active = false;
        this.rmbNode.active = false;
        this.freeNode.active = false;
        this.btnNode.active = true;
        let isCd: boolean = Game.mallProto.getPrivateGoodTime(this.data.nrid) > 0;
        this.diaCoast.node.active = this.diaNode.active = isCd;
        this.freeLabNode.active = !isCd;
        this.diaCoast.string = this.data.npricenums.toString();
        if (isCd) {
            this.refreshDiamond();
        } else {
            NodeUtils.enabled(this.btnNode.getComponent(cc.Button), true);
        }
    }

    private freeGoodsRefresh() {
        this.rmbCoast.node.active = false;
        this.rmbNode.active = false;
        this.freeNode.active = false;
        this.btnNode.active = true;
        let isCd: boolean = Game.mallProto.getPrivateGoodTime(this.data.nrid) > 0;
        this.diaCoast.node.active = this.diaNode.active = isCd;
        this.freeLabNode.active = !isCd;
        this.diaCoast.string = "x " + this.data.npricenums.toString();
        if (isCd) {
            if (this.ico && this.data.npricegoodsid > 0) {
                let goodsInfo = Game.goodsMgr.getGoodsInfo(this.data.npricegoodsid);
                if (goodsInfo) {
                    this.ico.setPicId(goodsInfo.npacketpicid);
                }
            }
            let isEnough = Game.containerMgr.isEnough(this.data.npricegoodsid , this.data.npricenums);
            if (this.notEnoughCanClick) {
                this.btnNode.opacity = isEnough ? 255 : 125;
            } else {
                NodeUtils.enabled(this.btnNode.getComponent(cc.Button), isEnough);
            }
            
        } else {
            NodeUtils.enabled(this.btnNode.getComponent(cc.Button), true);
        }
    }

    private onClick() {
        if (!this.data) return;
        if (this._onClickCallBack) {
            this._onClickCallBack.execute();
        }

        if (MALL_PRICETYPE.MALL_PRICETYPE_FREEVIDEO == this.data.btpricetype && Game.mallProto.checkPrivateGoodsTime(this.data.nrid, this.data.btpricetype)) {
            if (!Game.signMgr.checkBoughtWeek()) {
                return;
            }
            Game.mallProto.getFreeVideoOrder(this.data.nrid);
        } else if (MALL_PRICETYPE.MALL_PRICETYPE_DIAMONDS == this.data.btpricetype && Game.mallProto.checkPrivateGoodsTime(this.data.nrid, this.data.btpricetype)) {
            Game.mallProto.buy(this.data.nrid);
        } else if (MALL_PRICETYPE.MALL_PRICETYPE_RMB == this.data.btpricetype) {
            Game.mallProto.rmbBuy(this.data.nrid);
        } else if (MALL_PRICETYPE.MALL_PRICETYPE_FREE_DIAMONDS == this.data.btpricetype
            || MALL_PRICETYPE.MALL_PRICETYPE_GOODS == this.data.btpricetype 
            || MALL_PRICETYPE.MALL_PRICETYPE_FREE_GOODS == this.data.btpricetype) {
            
            if (this.notEnoughCanClick &&
                (MALL_PRICETYPE.MALL_PRICETYPE_GOODS == this.data.btpricetype ||
                (MALL_PRICETYPE.MALL_PRICETYPE_FREE_GOODS == this.data.btpricetype && Game.mallProto.getPrivateGoodTime(this.data.nrid) > 0))) {
                let isEnough = Game.containerMgr.isEnough(this.data.npricegoodsid , this.data.npricenums);
                if (!isEnough) {
                    Game.mallProto.selectBuyKey(this.data.npricegoodsid);
                    return;
                }
            }
                
            
            
            Game.mallProto.buy(this.data.nrid); 
        } 

        // if (Game.mallProto.getPrivateGoodTime(this.data.nrid) <= 0) {
        //     //特殊处理，如果有多个免费的再说！
        //     BuryingPointMgr.post(EBuryingPoint.TOUCH_ZHIZUN_BOX_FREE);
        // }
    }

    private refreshDiamond() {
        let diamond = Game.actorMgr.getProp(ActorProp.ACTOR_PROP_DIAMONDS);
        if (this.ico) {
            this.ico.setPicId(Game.goodsMgr.getGoodsInfo(GOODS_ID.DIAMOND).npacketpicid);
        }
        // this.itemChange(diamond, diamond);
        // if (this.isFreeItem() && Game.mallProto.getPrivateGoodTime(this.data.nrid) <= 0) return;
        let isEnough = this.data.npricenums <= diamond;
        NodeUtils.enabled(this.btnNode.getComponent(cc.Button), this.notEnoughCanClick ? true : isEnough);
    }

    private onPrivateData(privateData: GS_MallPrivateData_MallPrivateData) {
        if (!this.data || (privateData && this.data.nrid != privateData.nid)) return;
        this.refresh();
    }

    onDisable() {
        GameEvent.targetOff(this);
    }

    update(dt: number) {
        if (!this.data) return;
        if (this.isCd) {
            let time = Game.mallProto.getPrivateGoodTime(this.data.nrid);
            if (time > 0) {
                if (MALL_PRICETYPE.MALL_PRICETYPE_FREE_DIAMONDS == this.data.btpricetype || MALL_PRICETYPE.MALL_PRICETYPE_FREE_GOODS == this.data.btpricetype) {
                    this.timeLab.string = StringUtils.doInverseTime(time) + '后免费开启';
                } else {
                    this.timeLab && (this.timeLab.string = StringUtils.doInverseTime(time));
                }
            } else {
                this.timeLab && (this.timeLab.node.active = false);
                this.timeIco && (this.timeIco.active = false);
                switch (this.data.btpricetype) {
                    case MALL_PRICETYPE.MALL_PRICETYPE_FREEVIDEO:
                        this.freeRefresh();
                        break;
                    case MALL_PRICETYPE.MALL_PRICETYPE_DIAMONDS:
                        this.diaRefresh();
                        break;
                    case MALL_PRICETYPE.MALL_PRICETYPE_GOODS:
                        this.goodsRefresh();
                        break;
                    case MALL_PRICETYPE.MALL_PRICETYPE_RMB:
                        this.rmbRefresh();
                        break;
                    case MALL_PRICETYPE.MALL_PRICETYPE_FREE_DIAMONDS:
                        this.freeDiamondsRefresh();
                        break;
                    case MALL_PRICETYPE.MALL_PRICETYPE_FREE_GOODS:
                        this.freeGoodsRefresh();
                        break;
                }
                this.isCd = false;
            }
        }
    }

    showTimeLab() {
        let isfreeItem = MALL_PRICETYPE.MALL_PRICETYPE_FREE_DIAMONDS == this.data.btpricetype || MALL_PRICETYPE.MALL_PRICETYPE_FREE_GOODS == this.data.btpricetype;
        this.diaNode.active = isfreeItem;
        this.diaCoast.node.active = isfreeItem;
        // if (isfreeItem) {
        //     this.diaCoast.string = this.data.npricenums.toString();
        //     this.refreshDiamond();
        // }
        this.rmbCoast.node.active = false;
        this.rmbNode.active = false;
        this.freeNode.active = false;
        this.freeLabNode.active = false;
        this.timeLab && (this.timeLab.node.active = true);
        this.timeIco && (this.timeIco.active = true);
    }

    refreshRateDes() {
        if (!this.data) return;
        let data = this.data as GS_MallGoodsList_MallGoodsItem;
        //宝箱保底次数
        if (this.rateDes) {
            this.rateDes.string = "";
            let goodInfo = Game.goodsMgr.getGoodsInfo(data.ngoodsid);
            if (goodInfo) {
                if (goodInfo.lgoodstype == GOODS_TYPE.GOODSTYPE_BOX) {
                    let dropBoxInfo = Game.goodsMgr.getDropBoxInfo(goodInfo.lparam[0]);
                    let dropBoxPrivateData = Game.goodsMgr.getDropBoxData(goodInfo.lparam[0]);
                    let count = 0;
                    if (dropBoxInfo) {
                        if (dropBoxPrivateData) {
                            count = dropBoxInfo.usecuritycount - dropBoxPrivateData.ncount;
                            this.rateDes.string = count <= 1 ? "本次抽取必出橙卡碎片" : "再抽" + count + "次必出橙卡碎片";
                        } else {
                            this.rateDes.string = "再抽" + dropBoxInfo.usecuritycount + "次必出橙卡碎片";
                        }
                    }
                }
            }
        }
    }

    onDestroy() {
        if (this.registerRedPoint) {
            Game.redPointSys.unregisterRedPoint(this.registerRedPointType, this.btnNode);
        }
    }
}
