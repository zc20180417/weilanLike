// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Dialog from "../../utils/ui/Dialog";
import { QUALITY_BG_COLOR } from "../../common/AllEnum";
import BgScrollAni from "../towerStarSys/bgScrollAni";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import GlobalVal from "../../GlobalVal";
import { GS_RewardTips, GS_RewardTips_RewardGoods } from "../../net/proto/DMSG_Plaza_Sub_Tips";
import { BuryingPointMgr, EBuryingPoint } from "../../buryingPoint/BuryingPointMgr";
import TreatrueItem from "./treatrueItem";
import TreatrueLyoutItem from "./treatrueLayoutItem";
import { GOODS_ID, GOODS_TYPE } from "../../net/socket/handler/MessageEnum";
import { Handler } from "../../utils/Handler";
import { GS_GoodsInfoReturn_GoodsInfo } from "../../net/proto/DMSG_Plaza_Sub_Goods";
import { UiManager } from "../../utils/UiMgr";
import { EResPath } from "../../common/EResPath";
import LoadingTips from "../tips/LoadingTips";
import { GameEvent } from "../../utils/GameEvent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TreatureView extends Dialog {

    treatureDragonBone: dragonBones.ArmatureDisplay = null;

    @property(cc.Prefab)
    boxPrefabs: cc.Prefab[] = [];

    @property(cc.Node)
    singleItemLayer: cc.Node = null;

    @property(cc.Node)
    topLayer: cc.Node = null;

    @property(cc.Node)
    bottomLayer: cc.Node = null;

    _layerMax: number = 5;

    isTreatrueOpened = false;

    isOpeing = false;

    _data: any = null;

    _currItemIdx: number = -1;

    _isShowedAllItem: boolean = false;

    @property(cc.Prefab)
    treatrueItemPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    layoutItem: cc.Prefab = null;

    @property(BgScrollAni)
    bgScrollAni: BgScrollAni = null;

    @property(cc.Node)
    maskNode: cc.Node = null;

    @property(cc.Node)
    titleShowAllItem: cc.Node = null;

    @property(cc.Node)
    btnNode: cc.Node = null;

    @property(cc.Button)
    clickLayerBtn: cc.Button = null;

    @property(cc.Node)
    bgMask: cc.Node = null;

    @property(cc.Node)
    bgNode: cc.Node = null;

    @property(cc.Node)
    lightCircle: cc.Node = null;

    @property(cc.Node)
    btnAdd: cc.Node = null;

    @property(cc.Node)
    btnGet: cc.Node = null;

    @property(cc.Node)
    tipsNode: cc.Node = null;

    @property(cc.Node)
    frontMask: cc.Node = null;

    private _lastQuality: number = 1;

    private _treatrueQuality: number = 1;

    private _treatrueData: any[] = [];

    private _layoutItems: Array<any> = [];

    private _allTreatrueData: any[] = [];

    private _currItem: TreatrueItem = null;
    private _hasHuDieJie: boolean = false;

    protected beforeShow() {

        this.initData();
        BuryingPointMgr.post(EBuryingPoint.SHOW_AWARD_BOX_VIEW);
    }

    initData() {
        this.initTreatrueData(this._data.goodslist, this._data.urewardgoodsitemcount)
        this._allTreatrueData = this._treatrueData.slice();

        let dropInfo = Game.goodsMgr.getGoodsInfo(this._data.ndropboxid);
        if (dropInfo) {
            this._treatrueQuality = dropInfo.btquality;
            let prefab = this._data.ndropboxid == 94 ? this.boxPrefabs[this.boxPrefabs.length - 1] : this.boxPrefabs[this._treatrueQuality] || this.boxPrefabs[this.boxPrefabs.length - 1];
            let node = cc.instantiate(prefab);
            this.content.addChild(node);
            this.treatureDragonBone = node.getComponent(dragonBones.ArmatureDisplay);
            this.treatureDragonBone.on(dragonBones.EventObject.COMPLETE, this.animationComplete, this);
            this.treatureDragonBone.playAnimation("idle1", 1);

            this.refreshQuality(this._treatrueQuality);
        }
    }

    protected addEvent() {
        GameEvent.on(EventEnum.TREATRUE_BG_OPACITY_TO_MAX, this.updateBgAni, this);
        GameEvent.on(EventEnum.SHOW_LIGHT_CIRCLE, this.showLightCircle, this);
        GameEvent.on(EventEnum.GET_ADD_REWARD, this.onAddReward, this);
    }

    showLightCircle(isShow: boolean) {
        this.lightCircle.active = isShow;
    }

    updateBgAni(quality: number, color: string) {
        this.bgScrollAni.refreshBg(quality);

        this.bgNode.color = cc.color().fromHEX(color);
    }

    animationComplete(event) {
        switch (event.animationState.name) {
            case "idle2":
                this.onTreatrueOpened();
                break;
            case "idle1":
                this.treatureDragonBone.playAnimation("idle", -1);
                break;
        }
    }

    /**
     * 宝箱开启动画结束
     */
    onTreatrueOpened() {
        this.maskNode.color = cc.color().fromHEX("#ECFFFD");
        this.maskNode.opacity = 230;
        cc.tween(this.maskNode)
            .to(0.02, { opacity: 255 })
            .call(() => {
                this.isTreatrueOpened = true;
                this.isOpeing = false;
                this.treatureDragonBone.node.active = false;
                this.maskNode.opacity = 0;
                if (!Game.tipsMgr.openBoxEft) {
                    this._isShowedAllItem = true;
                    this.showAllItem();
                } else {
                    this.showNextItem();
                }
            })
            .start();
    }

    setData(data: any) {
        this._data = data;
    }

    /**
     * 显示下一个物品
     */
    showNextItem() {
        if (this._currItem && !this._currItem.aniEnd) return;
        let itemData = this._treatrueData;
        if (itemData && !this._isShowedAllItem) {
            if (++this._currItemIdx < itemData.length) {
                this.showSingleItem(itemData[this._currItemIdx]);
            } else {
                this.singleItemLayer.active = false;
                this._isShowedAllItem = true;
                this.titleShowAllItem.active = true;
                this.clickLayerBtn.interactable = false;
                this.showAllItem();
            }
        }
    }

    /**
     * 显示所有物品
     */
    showAllItem() {
        this.frontMask.active = true;
        GlobalVal.treatrueArrowAniTime = Date.now();
        let itemData = this._allTreatrueData;
        for (let i = 0; i < itemData.length; i++) {
            this.addItemToTopBottomLayer(itemData[i], 0.06 * i);
        }
        this.scheduleOnce(() => {
            this.btnNode.active = true;
        }, itemData.length * 0.05);

        this.showBtn();
        this.bgMask.opacity = 0;
        this.bgMask.color = cc.color(QUALITY_BG_COLOR[this._treatrueQuality + 1] || "#fff");
        cc.tween(this.bgMask)
            .to(0.3, { opacity: 255 })
            .call(() => {
                this.refreshQuality(this._treatrueQuality);
            })
            .to(0.1, { opacity: 0 })
            .start();

        this.tipsNode.active = this._hasHuDieJie;
    }

    addItemToTopBottomLayer(data: any, delay: number = 0): any {
        let item = cc.instantiate(this.layoutItem);
        this._layoutItems.push(item);
        let com = item.getComponent("treatrueLayoutItem");
        com.setData(data);
        com.setDelay(delay);
        com.refresh();
        com.setClickHandler(Handler.create(this.onLayoutItemClick, this));
        if (this.topLayer.childrenCount >= this._layerMax) {
            this.bottomLayer.addChild(item);
        } else {
            this.topLayer.addChild(item);
        }
        return item;
    }

    /**
     * 显示单个物品
     * @param data 
     */
    showSingleItem(data: any) {
        this.frontMask.active = false;
        let item = null, com = null;
        this.singleItemLayer.removeAllChildren();
        item = cc.instantiate(this.treatrueItemPrefab);
        this.singleItemLayer.addChild(item);
        // item.opacity = 0;
        com = item.getComponent("treatrueItem");
        com.setData(data);
        com.refresh(this._lastQuality != data.btquality);

        this._lastQuality = data.btquality;
        this._currItem = com;
    }

    /**
     * 打开箱子
     */
    openTreatrue() {
        if (!this.treatureDragonBone) return this.hide();
        if (this.isOpeing && this.treatureDragonBone.animationName == "idle2") return;
        this.isOpeing = true;
        this.treatureDragonBone.playAnimation("idle2", 1);
    }

    onClick() {

        this.showLightCircle(false);

        if (this.isTreatrueOpened) {
            this.showNextItem();
        } else {
            this.openTreatrue();
        }
    }

    btnRecive() {
        this.hide();
        // let newCardList: Array<any> = [];
        // let data = this._treatrueData.data;
        // for (let i = 0, len = data.length; i < len; i++) {
        //     if (data[i].itemCfg.type == ItemType.MONEY) continue;
        //     let type = TowerUtil.getTypeByMainID(data[i].itemCfg.id);
        //     let quality = TowerUtil.getQualityByMainID(data[i].itemCfg.id);
        //     if (!Game.towerStarSys.isUnlockTower(type, quality)) {
        //         newCardList.push(data[i].itemCfg);
        //     }
        // }
        // UiManager.hideDialog();

        // if (newCardList.length > 0) {
        //     UiManager.showDialog(EResPath.TOWER_STAR_GET_CARD, newCardList);
        // }
        // Game.towerMgr.showNextNewTower();
    }

    btnExtra() {
        if (!Game.signMgr.checkBoughtWeek()) {
            return;
        }
        Game.mallProto.reqGetAddFreeVideoOrder();
    }

    /**
     * 刷新品质信息
     * @param quality (0~)
     */
    refreshQuality(quality: number) {
        this.updateBgAni(quality + 1, QUALITY_BG_COLOR[quality + 1] || "#fff");
    }

    afterHide() {
        LoadingTips.hideLoadingTips(LoadingTips.TREATUR_VIEW);
        GameEvent.emit(EventEnum.ON_GETED_CARD);
        Handler.dispose(this);
    }

    private onAddReward(data: GS_RewardTips) {
        cc.log('--------------------------->onAddReward');
        this._data = data;
        this.initTreatrueData(data.goodslist, this._data.urewardgoodsitemcount);

        data.goodslist.forEach(element => {
            let treatureData = this.getTreatureData(element.sgoodsid);
            if (treatureData) {
                treatureData.num += element.sgoodsnum;
            } else {
                let cfg = Game.goodsMgr.getGoodsInfo(element.sgoodsid);
                this._allTreatrueData.push({ itemCfg: cfg, num: element.sgoodsnum });
            }
        });

        this._currItemIdx = -1;
        this._isShowedAllItem = false;
        this.singleItemLayer.active = true;
        this.titleShowAllItem.active = false;
        this.clickLayerBtn.interactable = true;
        this.topLayer.removeAllChildren();
        this.bottomLayer.removeAllChildren();
        this._layoutItems.length = 0;
        this.showNextItem();
    }

    private getTreatureData(goodsid: number): any {
        let len = this._allTreatrueData.length;
        for (let i = 0; i < len; i++) {
            if (this._allTreatrueData[i].itemCfg.lgoodsid == goodsid) {
                return this._allTreatrueData[i];
            }
        }
        return null;
    }

    private initTreatrueData(goodslist: GS_RewardTips_RewardGoods[], urewardgoodsitemcount: number) {
        this.hideBtn();
        this._treatrueData = [];

        for (let i = 0; i < urewardgoodsitemcount; i++) {
            let element = goodslist[i];
            let cfg = Game.goodsMgr.getGoodsInfo(element.sgoodsid);
            this._treatrueData.push({ itemCfg: cfg, num: element.sgoodsnum });
            if (element.sgoodsid === GOODS_ID.EQUIP_UPGRADE_MATERIAL) {
                this._hasHuDieJie = true;
            }
        }

        //根据品质排序
        this._treatrueData.sort((one, two) => {
            return one.itemCfg.btquality - two.itemCfg.btquality;
        });
    }

    private showBtn() {
        this.btnGet.active = true;
        if (this._data.btfreevideomulit == 0 && this._data.ufreevideogoodsitemcount == 0) {
            this.btnGet.x = 0;
        } else {
            this.btnAdd.active = true;
            this.btnGet.x = 226;
        }
    }

    private hideBtn() {
        this.btnGet.active = false;
        this.btnAdd.active = false;
    }

    private onLayoutItemClick(item: TreatrueLyoutItem) {
        if (item.data) {
            let cfg = item.data.itemCfg as GS_GoodsInfoReturn_GoodsInfo;
            if (cfg.lgoodstype == GOODS_TYPE.GOODSTYPE_RES_UPGRADESTAR) {
                let towerInfo = Game.towerMgr.getTroopBaseInfo(cfg.lparam[0]);
                if (!towerInfo) {
                    return;
                }
                if (Game.towerMgr.isTowerUnlock(towerInfo.ntroopsid)) {
                    UiManager.showTopDialog(EResPath.TOWER_STAR_LV_UP_VIEW , {towerInfo:towerInfo});
                } else {
                    UiManager.showTopDialog(EResPath.TOWER_STAR_MAIN_VIEW , towerInfo.bttype - 1);
                }
            }
        }
    }
}
