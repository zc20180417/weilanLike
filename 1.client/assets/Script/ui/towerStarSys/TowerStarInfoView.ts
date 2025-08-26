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
import { GS_TroopsInfo_TroopsInfoItem } from "../../net/proto/DMSG_Plaza_Sub_Troops";
import TowerStarTitle from "./towerStarTitle";
import { getRichtextTips, RichTextTipsData, RichTextTipsType } from "../tips/RichTextTipsView";
import TowerStarPropItem2 from "./TowerStarPropItem2";
import List from "../../utils/ui/List";
import { GoodsBox } from "../../utils/ui/GoodsBox";
import { GameEvent, Reply } from "../../utils/GameEvent";

const { ccclass, property , menu } = cc._decorator;

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
@menu("Game/tower/TowerStarInfoView")
export default class TowerStarInfoView extends Dialog {
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


    @property(ImageLoader)
    imageLoader: ImageLoader = null;

    @property(cc.Node)
    bgNode: cc.Node = null;

    // @property(GroupImage)
    // starNum: GroupImage = null;

    // @property(cc.Node)
    // startNode: cc.Node = null;

    _star: number = 0;
    private _totalStar: number = 0;
    private _animationState: cc.AnimationState = null;

    _data: GS_TroopsInfo_TroopsInfoItem = null;

    ///////////////////////////////////
    //           额外属性
    //////////////////////////////////

    ///////////////////////////////////
    //           属性
    //////////////////////////////////

    ///////////////////////////////////
    //          消耗品
    //////////////////////////////////
    @property(ImageLoader)
    materialIco: ImageLoader = null;

    @property(cc.RichText)
    material: cc.RichText = null;

    // @property(cc.Node)
    // materialBg: cc.Node = null;

    @property(cc.Node)
    iconLayout: cc.Node = null;

    ///////////////////////////////////
    //           按钮
    //////////////////////////////////

    // @property(cc.Node)
    // actNode: cc.Node = null;

    @property(cc.Button)
    upStarBtn: cc.Button = null;

    @property(cc.Label)
    upStarBtnLab: cc.Label = null;

    @property(cc.RichText)
    starProgressText: cc.RichText = null;

    @property(cc.Node)
    uiNode: cc.Node = null;

    @property(cc.Animation)
    topStarAni: cc.Animation = null;

    @property(cc.Node)
    unlockNode: cc.Node = null;

    @property(cc.Node)
    lockNode: cc.Node = null;

    @property(List)
    scienceList:List = null;

    @property(GoodsBox)
    goodsBox:GoodsBox = null;

    @property(GroupImage)
    bpLabel:GroupImage = null;

    private _isShowEnd: boolean = false;
    private _waitGuideArrowNode: cc.Node = null;


    start() {
        this.refresh();

    }

    setData(data: any) {
        this._data = data.towerInfo;
    }

    protected afterShow() {
        this._isShowEnd = true;

        if (this._waitGuideArrowNode) {
            GameEvent.emit(EventEnum.SET_GUIDE_NODE, this._waitGuideArrowNode);
        }
    }


    protected addEvent() {
        // GameEvent.on(EventEnum.ACTIVATE_TOWER, this.onActiveRet, this);
        GameEvent.on(EventEnum.UP_STAR_SUCC, this.onUpgrade, this);

        GameEvent.onReturn("get_tower_details_btn", this.onGetBtn, this);
        GameEvent.on(EventEnum.ITEM_COUNT_CHANGE, this.onItemCountChange, this);
    }

    protected afterHide() {
        GameEvent.offReturn("get_tower_details_btn", this.onGetBtn, this);
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

        //解锁状态
        const unlock = Game.towerMgr.isTowerUnlock(this._data.ntroopsid);
        this.unlockNode.active = unlock;
        this.lockNode.active = !unlock;

        //当前星级
        let stars = Game.towerMgr.getStar(this._data.ntroopsid);
        this.currStar.string = stars.toString();



        //星级进度条
        this.refreshStarProgress();

        //////////////////////////////////////////////////  炮塔信息

        let towerMgr = Game.towerMgr;

        //////////////////////////////////////////////////   属性
        this.refreshProp();
        /////////////////////////////// 消耗品
        this.refreshShareGoods();
        /////////////////////////////// 按钮
        // this.refreshActivateBtn(towerMgr.isTowerActive(this._data.ntroopsid));
        this.refreshUpStarBtn();
        this.onItemCountChange(Game.towerMgr.getSharegoodsid(), Game.containerMgr.getItemCount(Game.towerMgr.getSharegoodsid()));
        this.refreshScienceList(stars);
        this.bpLabel.contentStr = Game.towerMgr.getPower(this._data.ntroopsid, stars).toString();
    }

    private refreshScienceList(stars: number) {
        const normalList = Game.towerMgr.getTowerScienceNormals(this._data.ntroopsid);
        const specialList = Game.towerMgr.getTowerScienceSpecail(this._data.ntroopsid);
        const normalDatas:any[] = [];
        const specialDatas:any[] = [];

        normalList.forEach(element => {
            normalDatas.push({
                data: element,
                troopsId: this._data.ntroopsid,
                star:stars,
            })
        });

        specialList.forEach(element => {
            specialDatas.push({
                data: element,
                troopsId: this._data.ntroopsid,
                star:stars,
            })
        });

        this.scienceList.array = normalDatas;
        this.goodsBox.array = specialDatas;
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
            this.upStarBtnLab.string = '卡片不足';
        } else if (!isEnergyEnough) {
            this.upStarBtnLab.string = isEnergyEnough ? '升星' : '能量不足';
        }
        // NodeUtils.enabled(this.upStarBtn, isEnergyEnough);
    }



    /**
     * 升星按钮点击事件
     */
    onUpStarClick() {
        const unlock = Game.towerMgr.isTowerUnlock(this._data.ntroopsid);
        if (!unlock) {
            UiManager.hideAll();
            UiManager.showDialog(EResPath.SHOP_VIEW);
            return;
        }

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
            this.starProgressText.node.active = false;
        
        }
    }

    /**
     * 激活炮塔返回
     * @param data 
     */
    // onActiveRet(data: any) {
    //     this.refreshActivateBtn(true);
    // }

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

            this.refreshProp(prestar);
        }
        this._animationState = this.topStarAni.play();
        GameEvent.emit(EventEnum.REFRESH_POWER);
    }

    private onGetBtn(reply:Reply, name:string): cc.Node {
        let node = null;
        if (name == 'upgrade') {
            node = this.upStarBtn.node;
        } else if (name == 'active') {
            // node = this.actNode;
        } 
        if (this._isShowEnd) {
            return reply(node);
        } else {
            this._waitGuideArrowNode = node;
            return reply(null);
        }

    }


    


    private onItemCountChange(id: number, num: number) {

    }











    private refreshProp(star?: number) {
        let propCom = this.propOne.getComponent(TowerStarPropItem2);
        let propData: PropData = {
            towerCfg: this._data,
            propType: PropType.ATTACH,
            calcEquipAdd: false,
            star: star
        };
        propCom.setData(propData);
        propCom.refresh();

        propCom = this.propTwo.getComponent(TowerStarPropItem2);
        propData = {
            towerCfg: this._data,
            propType: PropType.SPEED,
            calcEquipAdd: false,
            star: star
        };
        propCom.setData(propData);
        propCom.refresh();

        propCom = this.propThree.getComponent(TowerStarPropItem2);
        propData = {
            towerCfg: this._data,
            propType: PropType.RANGE,
            calcEquipAdd: false,
            star: star
        };
        propCom.setData(propData);
        propCom.refresh();
    }

    private refreshStarProgress() {
        let maxCards = Game.towerMgr.getPrivateGoodsNums(this._data.ntroopsid);
        let currCards = Game.containerMgr.getItemCount(this._data.ncardgoodsid);

        this.starProgressText.string = currCards + "/" + maxCards;
        let progress = currCards / maxCards;

        //是否显示canUp图标
        // let canup: boolean = progress >= 1 ? true : false;

        // this.canUpStar.active = canup;
        // if (canup) {
        //     this.arrowAni.play();
        // }

        let stars = Game.towerMgr.getStar(this._data.ntroopsid);
        // this.starText.string = stars.toString();
        this.maxStarRefresh(stars >= Game.towerMgr.getStarMax(this._data.btquality));
    }

    private refreshShareGoods() {
        let energy = Game.containerMgr.getItemCount(Game.towerMgr.getSharegoodsid());
        let costEnergy = Game.towerMgr.getShareGoodsNums(this._data.ntroopsid);
        this.material.string = energy  + '/' + costEnergy;
        // this.material['_forceUpdateRenderData'](true);
        // this.materialBg.width = (this.material.node.width * 0.5) + 38;
        this.material.node.color = costEnergy <= energy ? cc.Color.WHITE.fromHEX('#FEFDB9') : cc.Color.WHITE.fromHEX(COLOR.UNENOUGH);
    }

    private onPrevClick() {
        if (this._data) {
            const data = Game.towerMgr.getNextOrPrevTower(this._data , false);
            this._data = data;
            this.refresh();
        }
    }

    private onNextClick() {
        if (this._data) {
            const data = Game.towerMgr.getNextOrPrevTower(this._data);
            this._data = data;
            this.refresh();
        }
    }

    private onWenClick() {
        UiManager.showDialog(EResPath.TOWER_INFO_TIPS , this._data);
    }

}
