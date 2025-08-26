// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Dialog from "../../utils/ui/Dialog";
import { PropType, QUALITY_COLOR, Towertype } from "../../common/AllEnum";
import Game from "../../Game";
import { UiManager } from "../../utils/UiMgr";
import ImageLoader from "../../utils/ui/ImageLoader";
import { EResPath } from "../../common/EResPath";
import GroupImage from "../../utils/ui/GroupImage";
import { EventEnum } from "../../common/EventEnum";
import { GS_FashionInfo_FashionItem } from "../../net/proto/DMSG_Plaza_Sub_Fashion";
import { NodeUtils } from "../../utils/ui/NodeUtils";
import { MatUtils } from "../../utils/ui/MatUtils";
import { GS_TroopsInfo_TroopsInfoItem } from "../../net/proto/DMSG_Plaza_Sub_Troops";
import TowerStarTitle from "./towerStarTitle";
import TowerStarPropItem from "./towerStarPropItem";
import { TujianData, TujianTabIndex } from "../tujian/TuJianView";
import { getRichtextTips, RichTextTipsData, RichTextTipsType } from "../tips/RichTextTipsView";
import { GOODS_ID } from "../../net/socket/handler/MessageEnum";
import { GameEvent, Reply } from "../../utils/GameEvent";

const { ccclass, property } = cc._decorator;

const COLOR = {
    UNLOCK: "#ea5718",
    LOCK: "#a75f49",
    ACTIVE: 0X0FFF00,
    UNACTIVE: 0XFFFFFF,
    COLOR: 0X000000,
    UNENOUGH: "#ff0000",
    ENOUGH: "#995124"
}

export interface PropData {
    towerCfg: any,
    propType: any,
    calcEquipAdd: boolean,
    star?: number,
}

@ccclass
export default class TowerStarLvUpView extends Dialog {
    @property(cc.Label)
    towerName: cc.Label = null;

    @property(TowerStarTitle)
    towerStarTitle: TowerStarTitle = null;

    @property(cc.Label)
    currStar: cc.Label = null;

    @property(cc.Node)
    propOne: cc.Node = null;

    @property(cc.Node)
    propTwo: cc.Node = null;

    @property(cc.Node)
    propThree: cc.Node = null;

    @property(cc.Node)
    propFour: cc.Node = null;

    @property(ImageLoader)
    imageLoader: ImageLoader = null;

    @property(cc.Node)
    bgNode: cc.Node = null;

    @property(GroupImage)
    starNum: GroupImage = null;

    @property(cc.Node)
    startNode: cc.Node = null;

    _star: number = 0;
    private _totalStar: number = 0;
    private _animationState: cc.AnimationState = null;

    propStarAniMid() {
        let star = Game.towerMgr.getStar(this._data.ntroopsid);
        this.currStar.string = star.toString();
        Game.soundMgr.playSound(EResPath.STAR_UP);
    }

    propStarAniEnd() {
        this.propOne.getComponent(TowerStarPropItem).startAni();
        this.propTwo.getComponent(TowerStarPropItem).startAni();
        this.propThree.getComponent(TowerStarPropItem).startAni();
        this.propFour.getComponent(TowerStarPropItem).startAni();

        this.scheduleOnce(this.refresh, 0.7);
    }

    _data: GS_TroopsInfo_TroopsInfoItem = null;

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

    ///////////////////////////////////
    //          消耗品
    //////////////////////////////////
    @property(ImageLoader)
    materialIco: ImageLoader = null;

    @property(cc.Label)
    material: cc.Label = null;

    @property(cc.Node)
    materialBg: cc.Node = null;

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

    @property(cc.Node)
    strengthenNode: cc.Node = null;

    @property(cc.ProgressBar)
    starPorgress: cc.ProgressBar = null;

    @property(cc.Label)
    starProgressText: cc.Label = null;

    @property(cc.Label)
    starText: cc.Label = null;

    @property(cc.Node)
    canUpStar: cc.Node = null;

    @property(cc.Animation)
    arrowAni: cc.Animation = null;

    @property(cc.Node)
    uiNode: cc.Node = null;

    @property(cc.Animation)
    topStarAni: cc.Animation = null;

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
        GameEvent.on(EventEnum.FASHION_CANCEL, this.onFashionUse, this);
        GameEvent.on(EventEnum.FASHION_ACTIVE, this.onFashionActive, this);
        GameEvent.on(EventEnum.EQUIP_UPGRADE, this.onEquipUpgrade, this);


        GameEvent.onReturn("get_tower_details_btn", this.onGetBtn, this);
        GameEvent.onReturn("get_tower_equip", this.onGetEquip, this);

        GameEvent.on(EventEnum.ITEM_COUNT_CHANGE, this.onItemCountChange, this);
    }

    protected afterHide() {
        GameEvent.offReturn("get_tower_details_btn", this.onGetBtn, this);
        GameEvent.offReturn("get_tower_equip", this.onGetEquip, this);
        // TweenNum.kill('refreshCurPower');
        // TweenNum.kill('refreshAfterPower');
        // TweenNum.kill('refreshMaxPower');
    }

    protected onGetEquip(reply:Reply,index: number) {
        if (reply) return reply(this['equip' + index].node);

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
        this.uiNode.active = true;

        this.imageLoader.url = EResPath.TOWER_IMG + Game.towerMgr.get3dpicres(this._data.ntroopsid, this._data);

        this.bgNode.setContentSize(cc.winSize);
        this.bgNode.color = cc.color(QUALITY_COLOR[this._data.btquality + 1] || QUALITY_COLOR["1"]);

        //名称
        this.towerStarTitle.setIndex(this._data.bttype - 1);
        this.towerName.string = this._data.szname;

        //当前星级
        let stars = Game.towerMgr.getStar(this._data.ntroopsid);
        this.currStar.string = stars.toString();

        //星级进度条
        this.refreshStarProgress();

        //星星总数
        this._totalStar = Game.containerMgr.getItemCount(GOODS_ID.EQUIP_UPGRADE_MATERIAL);
        this.starNum.contentStr = (this._totalStar - 1).toString();

        //////////////////////////////////////////////////  炮塔信息

        let haveFashion = Game.fashionMgr.getTowerFashionInfos(this._data.ntroopsid) != null;
        this.fashionBtn.active = this.fashionIco.active = this.fashionLine.active = this.extraProp4.node.active = this.extraPropFour.node.active = haveFashion;

        if (haveFashion) {
            this.refreshFashionValue();
        }

        let towerMgr = Game.towerMgr;

        this.onEquipUpgrade();

        let unlock: boolean = false;
        if (this._flyEquipIndex.indexOf(0) == -1) {
            unlock = towerMgr.getEquipData(this._data.nequipid1) ? true : false;
        }
        this.setPropUnlockState(this.extraPropOne, this.extraProp1, this.equip1, unlock);
        unlock = false;
        if (this._flyEquipIndex.indexOf(1) == -1) {
            unlock = towerMgr.getEquipData(this._data.nequipid2) ? true : false;
        }
        this.setPropUnlockState(this.extraPropTwo, this.extraProp2, this.equip2, unlock);
        unlock = false;
        if (this._flyEquipIndex.indexOf(2) == -1) {
            unlock = towerMgr.getEquipData(this._data.nequipid3) ? true : false;
        }
        this.setPropUnlockState(this.extraPropThree, this.extraProp3, this.equip3, unlock);

        //////////////////////////////////////////////////   属性
        this.refreshProp();
        /////////////////////////////// 消耗品
        this.refreshShareGoods();
        /////////////////////////////// 按钮
        this.refreshActivateBtn(towerMgr.isTowerActive(this._data.ntroopsid));

        this.refreshUpStarBtn();

        this.onItemCountChange(Game.towerMgr.getSharegoodsid(), Game.containerMgr.getItemCount(Game.towerMgr.getSharegoodsid()));

        //装备强化
        this.strengthenNode.active = false;
    }

    /**
     * 刷新激活按钮状态
     */
    refreshActivateBtn(isActive: boolean) {
        this.actingNode.active = isActive;
        this.actNode.active = !isActive;
    }

    /**
     * 刷新升星按钮状态
     * @param isEnough 
     */
    refreshUpStarBtn() {
        let maxCards = Game.towerMgr.getPrivateGoodsNums(this._data.ntroopsid);
        let currCards = Game.containerMgr.getItemCount(this._data.ncardgoodsid);
        let energy = Game.containerMgr.getItemCount(Game.towerMgr.getSharegoodsid());
        let costEnergy = Game.towerMgr.getShareGoodsNums(this._data.ntroopsid);
        let isCardEnough = currCards >= maxCards;
        let isEnergyEnough = energy >= costEnergy;

        if (!isCardEnough) {
            this.upStarBtnLab.spriteFrame = this.cardNotEnough;
        } else if (!isEnergyEnough) {
            this.upStarBtnLab.spriteFrame = isEnergyEnough ? this.upgradeSf : this.notEnoughSf;
        }
        // NodeUtils.enabled(this.upStarBtn, isEnergyEnough);
    }

    /**
     * 激活按钮点击事件
     */
    onActivieClick() {
        if (Game.towerMgr.isTowerActive(this._data.ntroopsid)) return;
        Game.towerMgr.requestActive(this._data.ntroopsid);
    }

    /**
     * 升星按钮点击事件
     */
    onUpStarClick() {
        if (Game.towerMgr.getStar(this._data.ntroopsid) >= Game.towerMgr.getStarMax(this._data.btquality)) return;
        let maxCards = Game.towerMgr.getPrivateGoodsNums(this._data.ntroopsid);
        let currCards = Game.containerMgr.getItemCount(this._data.ncardgoodsid);

        let energy = Game.containerMgr.getItemCount(Game.towerMgr.getSharegoodsid());
        let costEnergy = Game.towerMgr.getShareGoodsNums(this._data.ntroopsid);
        let isCardEnough = currCards >= maxCards;
        let isEnergyEnough = energy >= costEnergy;

        if (!isCardEnough) {
            let data: RichTextTipsData = {
                title: "获得卡片",
                des: getRichtextTips(RichTextTipsType.CARD)
            }

            UiManager.showDialog(EResPath.RICHTEXT_TIPS_VIEW, data);
            return;
        } 

        if (!isEnergyEnough) {
            let data: RichTextTipsData = {
                title: "获得能量",
                des: getRichtextTips(RichTextTipsType.ENERGY)
            }

            UiManager.showDialog(EResPath.RICHTEXT_TIPS_VIEW, data);
            return;
        } 

        Game.towerMgr.requestUpgrade(this._data.ntroopsid);
    }

    maxStarRefresh(max: boolean) {
        if (max) {
            this.iconLayout.active = false;
            this.upStarBtn.node.active = false;
            this.upStarBtnLab.node.active = false;

            this.canUpStar.active = false;
            this.starProgressText.string = "MAX";
            this.starPorgress.progress = 1;
        }
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

        this.refreshStarProgress();
        this.refreshShareGoods();
        this.refreshUpStarBtn();
        this.unschedule(this.refresh);

        if (this._animationState) {
            this._animationState.stop();
            let prestar = Math.max(Game.towerMgr.getStar(this._data.ntroopsid) - 1, 1);
            this.currStar.string = prestar.toString();
            this.propOne.getComponent(TowerStarPropItem).stopAni();
            this.propTwo.getComponent(TowerStarPropItem).stopAni();
            this.propThree.getComponent(TowerStarPropItem).stopAni();
            this.propFour.getComponent(TowerStarPropItem).stopAni();
            this.refreshProp(prestar);
        }
        this._animationState = this.topStarAni.play();
        GameEvent.emit(EventEnum.REFRESH_POWER);
    }

    private onGetBtn(reply:Reply , name:string): cc.Node {
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
            title: equipInfo ? equipInfo.szname : "null", spriteFrame: this.equipAtlas.getSpriteFrame(this._data.ntroopsid + "_0" + index),
            node: node.children[0], index: index
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


    private onItemCountChange(id: number, num: number) {

    }

    private onFashionUse(nid: number) {
        if (!this._data) return;
        this.imageLoader.url = EResPath.TOWER_IMG + Game.towerMgr.get3dpicres(this._data.ntroopsid, this._data);
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

    private onTujianClick() {
        if (this._data) {
            let data: TujianData = {
                tabIndex: TujianTabIndex.CAT,
                subTabIndex: this._data.btquality,
                towerId: this._data.ntroopsid
            }
            UiManager.showDialog(EResPath.TUJIAN_VIEW, data);
        }
    }

    private refreshProp(star?: number) {
        let propCom = this.propOne.getComponent(TowerStarPropItem);
        let propData: PropData = {
            towerCfg: this._data,
            propType: PropType.ATTACH,
            calcEquipAdd: this._flyEquipIndex.indexOf(0) == -1,
            star: star
        };
        propCom.setData(propData);
        propCom.refresh();

        propCom = this.propTwo.getComponent(TowerStarPropItem);
        propData = {
            towerCfg: this._data,
            propType: PropType.OTHER,
            calcEquipAdd: false,
            star: star
        };
        propCom.setData(propData);
        propCom.refresh();

        propCom = this.propThree.getComponent(TowerStarPropItem);
        propData = {
            towerCfg: this._data,
            propType: PropType.RANGE,
            calcEquipAdd: this._flyEquipIndex.indexOf(1) == -1,
            star: star
        };
        propCom.setData(propData);
        propCom.refresh();

        propCom = this.propFour.getComponent(TowerStarPropItem);
        propData = {
            towerCfg: this._data,
            propType: PropType.SPEED,
            calcEquipAdd: this._flyEquipIndex.indexOf(2) == -1,
            star: star
        }
        propCom.setData(propData);
        propCom.refresh();
    }

    private refreshStarProgress() {
        let maxCards = Game.towerMgr.getPrivateGoodsNums(this._data.ntroopsid);
        let currCards = Game.containerMgr.getItemCount(this._data.ncardgoodsid);

        this.starProgressText.string = currCards + "/" + maxCards;
        let progress = currCards / maxCards;
        this.starPorgress.progress = progress > 1 ? 1 : progress;

        //是否显示canUp图标
        let canup: boolean = progress >= 1 ? true : false;

        this.canUpStar.active = canup;
        if (canup) {
            this.arrowAni.play();
        }

        let stars = Game.towerMgr.getStar(this._data.ntroopsid);
        this.starText.string = stars.toString();

        this.maxStarRefresh(stars >= Game.towerMgr.getStarMax(this._data.btquality));
    }

    private refreshShareGoods() {
        let energy = Game.containerMgr.getItemCount(Game.towerMgr.getSharegoodsid());
        let costEnergy = Game.towerMgr.getShareGoodsNums(this._data.ntroopsid);
        this.material.string = energy  + '/' + costEnergy;
        this.material['_forceUpdateRenderData'](true);
        this.materialBg.width = (this.material.node.width * 0.5) + 38;
        this.material.node.color = costEnergy <= energy ? cc.Color.WHITE.fromHEX('#FEFDB9') : cc.Color.WHITE.fromHEX(COLOR.UNENOUGH);
    }

    private setPropUnlockState(propDes: cc.Label, propNum: cc.Label, propIcon: cc.Sprite, unlock: boolean) {
        if (unlock) {
            MatUtils.setNormal(propDes);
            MatUtils.setNormal(propNum);
            MatUtils.setSpriteNormal(propIcon);
        } else {
            MatUtils.setGray(propDes);
            MatUtils.setGray(propNum);
            MatUtils.setSpriteGray(propIcon);
        }
    }
}
