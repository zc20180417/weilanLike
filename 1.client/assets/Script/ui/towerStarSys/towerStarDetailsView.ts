// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Dialog from "../../utils/ui/Dialog";
import { PropType, ItemMoneyType, TowerTypeName } from "../../common/AllEnum";
import Game from "../../Game";
import { UiManager } from "../../utils/UiMgr";
import { EResPath } from "../../common/EResPath";
import { NodeUtils } from "../../utils/ui/NodeUtils";
import { GS_TroopsInfo_TroopsInfoItem } from "../../net/proto/DMSG_Plaza_Sub_Troops";
import { EventEnum } from "../../common/EventEnum";
import TowerStarTowerItem from "./towerStarTowerItem";
import { MatUtils } from "../../utils/ui/MatUtils";
import ImageLoader from "../../utils/ui/ImageLoader";
import TweenNum from "../../utils/TweenNum";
import { Handler } from "../../utils/Handler";
import { GS_FashionInfo_FashionItem } from "../../net/proto/DMSG_Plaza_Sub_Fashion";
import { ActorProp, GOODS_ID } from "../../net/socket/handler/MessageEnum";
import { getRichtextTips, RichTextTipsData, RichTextTipsType } from "../tips/RichTextTipsView";
import { PropData } from "./towerStarLvUpView";
import TowerStarPropItem from "./towerStarPropItem";
import { GameEvent, Reply } from "../../utils/GameEvent";

const { ccclass, property } = cc._decorator;

const COLOR = {
    UNLOCK: "#ea5718",
    LOCK: "#a75f49",
    ACTIVE: 0X0FFF00,
    UNACTIVE: 0XFFFFFF,
    COLOR: 0X000000,
    UNENOUGH: "#ea5718",
    ENOUGH: "#995124"
}

@ccclass
export default class TowerStarDetailsView extends Dialog {


    _data: GS_TroopsInfo_TroopsInfoItem = null;
    ///////////////////////////////////
    //           炮塔信息
    //////////////////////////////////
    @property(TowerStarTowerItem)
    towerStarTowerItem: TowerStarTowerItem = null;

    ///////////////////////////////////
    //           战斗力
    //////////////////////////////////
    @property(cc.Sprite)
    titleSprite: cc.Sprite = null;

    @property(cc.SpriteFrame)
    titleSpriteFrame: cc.SpriteFrame[] = [];

    @property(cc.Label)
    beforePower: cc.Label = null;

    @property(cc.Label)
    afterPower: cc.Label = null;

    @property(cc.Label)
    maxPowerLab: cc.Label = null;

    @property(cc.Node)
    powerLayout: cc.Node = null;
    ///////////////////////////////////
    //           额外属性
    //////////////////////////////////

    @property(cc.Label)
    extraPropOne: cc.Label = null;
    @property(cc.Label)
    extraPropTwo: cc.Label = null;
    @property(cc.Label)
    extraPropThree: cc.Label = null;

    @property(cc.Label)
    extraPropFour: cc.Label = null;

    @property(cc.Label)
    extraProp1: cc.Label = null;
    @property(cc.Label)
    extraProp2: cc.Label = null;
    @property(cc.Label)
    extraProp3: cc.Label = null;

    @property(cc.Label)
    extraProp4: cc.Label = null;

    @property(cc.Sprite)
    equip1: cc.Sprite = null;
    @property(cc.Sprite)
    equip2: cc.Sprite = null;
    @property(cc.Sprite)
    equip3: cc.Sprite = null;

    @property(cc.Node)
    fashionBtn: cc.Node = null;

    @property(cc.Node)
    fashionIco: cc.Node = null;

    @property(cc.Node)
    fashionLine: cc.Node = null;

    @property(cc.SpriteAtlas)
    equipAtlas: cc.SpriteAtlas = null;

    ///////////////////////////////////
    //           属性
    //////////////////////////////////

    @property(cc.Node)
    propOne: cc.Node = null;

    @property(cc.Node)
    propTwo: cc.Node = null;

    @property(cc.Node)
    propThree: cc.Node = null;

    @property(cc.Node)
    propFour: cc.Node = null;


    ///////////////////////////////////
    //          消耗品
    //////////////////////////////////
    @property(ImageLoader)
    materialIco: ImageLoader = null;

    @property(cc.Label)
    material: cc.Label = null;

    @property(cc.Node)
    iconLayout: cc.Node = null;


    ///////////////////////////////////
    //           按钮
    //////////////////////////////////

    @property(cc.Node)
    actNode: cc.Node = null;

    @property(cc.Button)
    upStarBtn: cc.Button = null;

    @property(cc.Sprite)
    upStarBtnLab: cc.Sprite = null;

    @property(cc.SpriteFrame)
    upgradeSf: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    notEnoughSf: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    cardNotEnough: cc.SpriteFrame = null;

    @property(cc.Node)
    actingNode: cc.Node = null;

    @property(cc.Label)
    energyLabel: cc.Label = null;

    @property(ImageLoader)
    energyIcon: ImageLoader = null;

    @property(cc.Node)
    strengthenNode: cc.Node = null;

    @property(cc.Label)
    hudiejieLab: cc.Label = null;

    @property(ImageLoader)
    hudiejieIcon: ImageLoader = null;

    private _isShowEnd: boolean = false;
    private _waitGuideArrowNode: cc.Node = null;
    private _flyEquipIndex: number[] = [];
    private _tweenBattleValue: boolean = false;

    start() {
        this.refresh();
        this.initEquipIco();
    }

    setData(data: any) {
        this._data = data.towerInfo;
        this._flyEquipIndex = data.flyEquipIndex || [];
    }

    protected afterShow() {
        this._isShowEnd = true;

        if (this._waitGuideArrowNode) {
            GameEvent.emit(EventEnum.SET_GUIDE_NODE, this._waitGuideArrowNode);
        }
    }


    protected addEvent() {
        GameEvent.on(EventEnum.ACTIVATE_TOWER, this.onActiveRet, this);
        GameEvent.on(EventEnum.UP_STAR_SUCC, this.onUpgrade, this);
        GameEvent.on(EventEnum.FLY_EQUIP_END, this.onFlyEquipEnd, this);
        GameEvent.on(EventEnum.FASHION_USE, this.onFashionUse, this);
        GameEvent.on(EventEnum.FASHION_ACTIVE, this.onFashionActive, this);
        GameEvent.on(EventEnum.EQUIP_UPGRADE, this.onEquipUpgrade, this);


        GameEvent.onReturn("get_tower_details_btn", this.onGetBtn, this);
        GameEvent.onReturn("get_tower_equip", this.onGetEquip, this);

        GameEvent.on(EventEnum.ITEM_COUNT_CHANGE, this.onItemCountChange, this);
    }

    protected afterHide() {
        GameEvent.offReturn("get_tower_details_btn", this.onGetBtn, this);
        GameEvent.offReturn("get_tower_equip", this.onGetEquip, this);
        TweenNum.kill('refreshCurPower');
        TweenNum.kill('refreshAfterPower');
        TweenNum.kill('refreshMaxPower');
    }

    protected onGetEquip(reply:Reply ,index: number) {
        if (reply) {
            return reply(this['equip' + index].node);
        }
        return this['equip' + index].node;
    }

    private onFlyEquipEnd() {
        if (this._flyEquipIndex.length == 0) {
            return;
        }

        this._flyEquipIndex.forEach(element => {
            let equipNode: cc.Node = this.onGetEquip(null , element + 1);
            if (equipNode) {
                cc.tween(equipNode).
                    to(0.2, { scale: 0.7 }).
                    to(0.2, { scale: 0.6 }).
                    to(0.2, { scale: 0.7 }).
                    to(0.2, { scale: 0.6 }).
                    to(0.2, { scale: 0.7 }).
                    to(0.2, { scale: 0.6 }).
                    start();
            }
            this._tweenBattleValue = true;
        });
        this._flyEquipIndex.length = 0;
        this.refresh();

    }

    onFashionClick() {
        if (!this._data) return;
        let infos: GS_FashionInfo_FashionItem[] = Game.fashionMgr.getTowerFashionInfos(this._data.ntroopsid);
        if (!infos || infos.length == 0) return;
        UiManager.showDialog(EResPath.FASHION_VIEW, infos);
    }

    /**
     * 刷新界面所有UI
     */
    refresh() {
        //////////////////////////////////////////////////  炮塔信息

        let haveFashion = Game.fashionMgr.getTowerFashionInfos(this._data.ntroopsid) != null;
        this.fashionBtn.active = this.fashionIco.active = this.fashionLine.active = this.extraProp4.node.active = this.extraPropFour.node.active = haveFashion;

        if (haveFashion) {
            this.refreshFashionValue();
        }

        this.towerStarTowerItem.setData(this._data);
        this.towerStarTowerItem.refresh();
        this.titleSprite.spriteFrame = this.titleSpriteFrame[this._data.bttype - 1];
        let towerMgr = Game.towerMgr;
        //当前星级
        let star = towerMgr.getStar(this._data.ntroopsid);


        //星级进度条
        let maxCards = towerMgr.getPrivateGoodsNums(this._data.ntroopsid);
        let currCards = Game.containerMgr.getItemCount(this._data.ncardgoodsid);

        //////////////////////////////////////////////////  战斗文本

        //当前战斗力
        let currPower = towerMgr.getPower(this._data.ncardgoodsid, star, this._flyEquipIndex);
        if (this._tweenBattleValue) {
            let currValue = this.getNum(this.beforePower.string);
            TweenNum.to(currValue, currPower, 0.3, Handler.create(this.refreshCurPower, this), 'refreshCurPower');
        } else {
            this.beforePower.string = currPower.toString();
        }

        let afterPower = towerMgr.getPower(this._data.ntroopsid, star + 1, this._flyEquipIndex);
        //升级后战斗力
        if (this._tweenBattleValue) {
            let currValue = this.getNum(this.afterPower.string);
            TweenNum.to(currValue, afterPower, 0.3, Handler.create(this.refreshAfterPower, this), 'refreshAfterPower');
        } else {
            this.afterPower.string = afterPower.toString();
        }

        if (this._tweenBattleValue) {
            let currValue = this.getNum(this.maxPowerLab.string);
            TweenNum.to(currValue, currPower, 0.3, Handler.create(this.refreshMaxPower, this), 'refreshMaxPower');
        } else {
            this.maxPowerLab.string = currPower.toString();
        }
        this._tweenBattleValue = false;
        //////////////////////////////////////////////////  额外属性

        // let troopInfo = towerMgr.getTroopInfo();
        // if (troopInfo) {
        //     let equipInfo :any;
        //     let equipData :any;
        //     let equipId:number = 0;
        //     for (let i = 1 ; i <= 3 ; i++ ) {
        //         equipId = this._data['nequipid' + i];
        //         equipInfo = towerMgr.getEquipItem(equipId);
        //         equipData = towerMgr.getEquipData(equipId);
        //         this['extraProp' + i].string = equipData ? Math.floor(equipData.naddprop / 100) + "%" :
        //                                         equipInfo ? Math.floor(equipInfo.nlv1addprop / 100) + "%" : "0%";

        //     }
        // }
        this.onEquipUpgrade();

        let unlock: boolean = false;
        if (this._flyEquipIndex.indexOf(0) == -1) {
            unlock = towerMgr.getEquipData(this._data.nequipid1) ? true : false;
        }

        if (unlock) {
            MatUtils.setNormal(this.extraPropOne);
            MatUtils.setNormal(this.extraProp1);
            MatUtils.setSpriteNormal(this.equip1);

        } else {
            MatUtils.setGray(this.extraPropOne);
            MatUtils.setGray(this.extraProp1);
            MatUtils.setSpriteGray(this.equip1);
        }

        unlock = false;
        if (this._flyEquipIndex.indexOf(1) == -1) {
            unlock = towerMgr.getEquipData(this._data.nequipid2) ? true : false;
        }

        if (unlock) {
            MatUtils.setNormal(this.extraPropTwo);
            MatUtils.setNormal(this.extraProp2);
            MatUtils.setSpriteNormal(this.equip2);
        } else {
            MatUtils.setGray(this.extraPropTwo);
            MatUtils.setGray(this.extraProp2);
            MatUtils.setSpriteGray(this.equip2);
        }

        unlock = false;
        if (this._flyEquipIndex.indexOf(2) == -1) {
            unlock = towerMgr.getEquipData(this._data.nequipid3) ? true : false;
        }

        if (unlock) {
            MatUtils.setNormal(this.extraPropThree);
            MatUtils.setNormal(this.extraProp3);
            MatUtils.setSpriteNormal(this.equip3);
        } else {
            MatUtils.setGray(this.extraPropThree);
            MatUtils.setGray(this.extraProp3);
            MatUtils.setSpriteGray(this.equip3);
        }
        //////////////////////////////////////////////////   属性

        let propCom = this.propOne.getComponent(TowerStarPropItem);
        let propData: PropData = {
            towerCfg: this._data,
            propType: PropType.ATTACH,
            calcEquipAdd: this._flyEquipIndex.indexOf(0) == -1
        };
        propCom.setData(propData);
        propCom.refresh();

        propCom = this.propTwo.getComponent(TowerStarPropItem);
        propData = {
            towerCfg: this._data,
            propType: PropType.OTHER,
            calcEquipAdd: false
        };
        propCom.setData(propData);
        propCom.refresh();

        propCom = this.propThree.getComponent(TowerStarPropItem);
        propData = {
            towerCfg: this._data,
            propType: PropType.RANGE,
            calcEquipAdd: this._flyEquipIndex.indexOf(1) == -1
        };
        propCom.setData(propData);
        propCom.refresh();

        propCom = this.propFour.getComponent(TowerStarPropItem);
        propData = {
            towerCfg: this._data,
            propType: PropType.SPEED,
            calcEquipAdd: this._flyEquipIndex.indexOf(2) == -1
        }
        propCom.setData(propData);
        propCom.refresh();

        /////////////////////////////// 消耗品
        let isCardsEnough = currCards >= maxCards;
        let goodsInfo = Game.goodsMgr.getGoodsInfo(towerMgr.getSharegoodsid());
        if (goodsInfo) {
            this.materialIco.setPicId(goodsInfo.npacketpicid);
        }

        let energy = Game.containerMgr.getItemCount(towerMgr.getSharegoodsid());
        let costEnergy = towerMgr.getShareGoodsNums(this._data.ntroopsid);
        let isEnergyEnough = costEnergy <= energy;
        this.material.string = costEnergy.toString();
        this.material.node.color = isEnergyEnough ? cc.Color.WHITE.fromHEX(COLOR.ENOUGH) : cc.Color.WHITE.fromHEX(COLOR.UNENOUGH);

        /////////////////////////////// 按钮
        let isActive: boolean = towerMgr.isTowerActive(this._data.ntroopsid);
        this.refreshActivateBtn(isActive);

        this.refreshUpStarBtn(isCardsEnough, isEnergyEnough);

        if (star >= towerMgr.getStarMax(this._data.btquality)) {
            this.maxStarRefresh();
        }

        this.onItemCountChange(Game.towerMgr.getSharegoodsid(), Game.containerMgr.getItemCount(Game.towerMgr.getSharegoodsid()));

        let info = Game.goodsMgr.getGoodsInfo(towerMgr.getSharegoodsid());
        if (info) {
            this.energyIcon.setPicId(info.npacketpicid);
        }

        //蝴蝶结
        this.onItemCountChange(GOODS_ID.EQUIP_UPGRADE_MATERIAL, Game.containerMgr.getItemCount(GOODS_ID.EQUIP_UPGRADE_MATERIAL));
        let goodInfo = Game.goodsMgr.getGoodsInfo(GOODS_ID.EQUIP_UPGRADE_MATERIAL);
        if (goodInfo) {
            this.hudiejieIcon.setPicId(goodInfo.npacketpicid);
        }
        //装备强化
        // let enableStrengthen: boolean = false;
        // for (let i = 3; i >= 1; i--) {
        //     if (Game.towerMgr.checkEquipActive(this._data["nequipid" + i])) {
        //         enableStrengthen = true;
        //         break;
        //     }
        // }
        this.strengthenNode.active = false;
    }

    /**
     * 刷新激活按钮状态
     */
    refreshActivateBtn(isActive: boolean) {
        // this.actImg.spriteFrame = isActive ? this.actingSf : this.actSf;
        this.actingNode.active = isActive;
        this.actNode.active = !isActive;
    }

    /**
     * 刷新升星按钮状态
     * @param isEnough 
     */
    refreshUpStarBtn(isCardEnough: boolean, isEnergyEnough: boolean) {
        if (!isCardEnough) {
            this.upStarBtnLab.spriteFrame = this.cardNotEnough;
        } else if (!isEnergyEnough) {
            this.upStarBtnLab.spriteFrame = isEnergyEnough ? this.upgradeSf : this.notEnoughSf;
        }
        NodeUtils.enabled(this.upStarBtn, isCardEnough && isEnergyEnough);
    }

    /**
     * 激活按钮点击事件
     */
    onActivieClick() {
        // let towerStarSys = TowerStarSys.getInstance();
        // let isActive: boolean = towerStarSys.isTowerActivie(this._data.mainId, this._data.quality);
        // if (!isActive) {
        //     towerStarSys.activateTower(this._data.mainId, this._data.quality);
        //     
        // }
        if (Game.towerMgr.isTowerActive(this._data.ntroopsid)) return;
        Game.towerMgr.requestActive(this._data.ntroopsid);
    }

    /**
     * 升星按钮点击事件
     */
    onUpStarClick() {
        // if (TowerStarSys.getInstance().isMaxStar(this._data.mainId, this._data.quality)) return;
        // if (TowerStarSys.getInstance().upStar(this._data.mainId, this._data.quality, this._towerStarCfg)) {
        //     UiManager.showDialog(EResPath.TOWER_STAR_LV_UP_VIEW, {
        //         towerCfg: this._towerCfg,
        //         towerStarCfg: this._towerStarCfg,
        //         nextTowerStarCfg: this._nextTowerStarCfg
        //     });
        //     this.refresh();
        // }
        if (Game.towerMgr.getStar(this._data.ntroopsid) >= Game.towerMgr.getStarMax(this._data.btquality)) return;
        Game.towerMgr.requestUpgrade(this._data.ntroopsid);
    }

    maxStarRefresh() {
        this.iconLayout.active = false;
        this.powerLayout.active = false;
        this.maxPowerLab.node.active = true;
        this.upStarBtn.node.active = false;
        this.upStarBtnLab.node.active = false;
    }

    /**
     * 激活炮塔返回
     * @param data 
     */
    onActiveRet(data: any) {
        this.refreshActivateBtn(true);
    }

    /**
     * 升级炮塔返回
     * @param data 
     */
    onUpgrade(data: any) {
        UiManager.showDialog(EResPath.TOWER_STAR_LV_UP_VIEW, {
            towerCfg: this._data,
        });
        this.refresh();
        GameEvent.emit(EventEnum.REFRESH_POWER);
    }

    private onGetBtn(reply:Reply,name:string): cc.Node {
        let node = null;
        if (name == 'upgrade') {
            node = this.upStarBtn.node;
        } else if (name == 'active') {
            node = this.actNode;
        } else if (name == 'skin') {
            node = this.fashionBtn;
        }
        if (this._isShowEnd) {
            return reply(node);
        } else {
            this._waitGuideArrowNode = node;
            return reply(null);
        }
    }

    private initEquipIco() {
        if (!this._data) return;
        this.equip1.spriteFrame = this.equipAtlas.getSpriteFrame(this._data.ntroopsid + "_01");
        this.equip2.spriteFrame = this.equipAtlas.getSpriteFrame(this._data.ntroopsid + "_02");
        this.equip3.spriteFrame = this.equipAtlas.getSpriteFrame(this._data.ntroopsid + "_03");
    }

    private onEquipTouch(evt: cc.Event.EventTouch, data: any) {
        let index = Number(data);
        let node: cc.Node = evt.target;
        let equipId = this._data['nequipid' + index];
        let equipInfo = Game.towerMgr.getEquipItem(equipId);
        let icoData = {
            title: equipInfo ? equipInfo.szname : "null",
            spriteFrame: this.equipAtlas.getSpriteFrame(this._data.ntroopsid + "_0" + index),
            node: node.children[0],
            index: index
        };
        if (!node || !node.parent) return;
        UiManager.showDialog(EResPath.EQUIP_TIPS_VIEW, icoData);
    }

    private getNum(str: String): number {
        let num = Number(str);
        if (isNaN(num)) {
            num = 0;
        }
        return num;
    }

    private refreshCurPower(value: number) {
        this.beforePower.string = value.toString();
    }

    private refreshAfterPower(value: number) {
        this.afterPower.string = value.toString();
    }

    private refreshMaxPower(value: number) {
        this.maxPowerLab.string = value.toString();
    }

    private onItemCountChange(id: number, num: number) {
        if (id == Game.towerMgr.getSharegoodsid()) {
            this.energyLabel.string = num.toString();
        } else if (GOODS_ID.EQUIP_UPGRADE_MATERIAL == id) {
            this.hudiejieLab.string = num.toString();
        }
    }

    private onFashionUse(nid: number) {
        if (!this._data) return;
        /*
        let info = Game.fashionMgr.getFashionInfo(nid);
        if (info.ntroopsid == this._data.ntroopsid) {
            this.towerStarTowerItem.refresh();
        }
        */
    }

    private onFashionActive(nid: number) {
        if (!this._data) return;
        let info = Game.fashionMgr.getFashionInfo(nid);
        if (info.ntroopsid == this._data.ntroopsid) {
            this.refreshFashionValue();
        }
    }

    private refreshFashionValue() {
        let addHurtPer = Game.fashionMgr.getTowerFashionAddHurtPer(this._data.ntroopsid);
        let noActiveFashion = addHurtPer <= 0;
        NodeUtils.setNodeGray(this.fashionIco, noActiveFashion);
        NodeUtils.setNodeGray(this.extraPropFour.node, noActiveFashion);
        NodeUtils.setNodeGray(this.extraProp4.node, noActiveFashion);
        this.extraProp4.string = ((noActiveFashion ? Game.fashionMgr.getTowerFashionAddHurtPerTotal(this._data.ntroopsid) : addHurtPer) / 100) + "%";
    }

    private clickEnergy() {
        let data: RichTextTipsData = {
            des: getRichtextTips(RichTextTipsType.ENERGY),
            title: "获取能量"
        }
        UiManager.showDialog(EResPath.RICHTEXT_TIPS_VIEW, data);
    }

    private clickStrengthen() {
        UiManager.showDialog(EResPath.TOWER_STAR_EQUIPMENT_VIEW, this._data);
    }

    private clickHuDieJie() {
        UiManager.showDialog(EResPath.HU_DIE_JIE_TIPS_VIEW);
    }

    private onEquipUpgrade() {
        let troopInfo = Game.towerMgr.getTroopInfo();
        if (troopInfo) {
            let equipInfo: any;
            let equipData: any;
            let equipId: number = 0;
            for (let i = 1; i <= 3; i++) {
                equipId = this._data['nequipid' + i];
                equipInfo = Game.towerMgr.getEquipItem(equipId);
                equipData = Game.towerMgr.getEquipData(equipId);
                this['extraProp' + i].string = equipData ? Math.floor(equipData.naddprop / 100) + "%" :
                    equipInfo ? Math.floor(equipInfo.nlv1addprop / 100) + "%" : "0%";

            }
        }
    }
}
