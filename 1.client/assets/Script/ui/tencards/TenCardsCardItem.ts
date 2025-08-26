import { QUALITY_COLOR } from "../../common/AllEnum";
import { EResPath } from "../../common/EResPath";
import Game from "../../Game";
import { GS_GoodsInfoReturn_GoodsInfo } from "../../net/proto/DMSG_Plaza_Sub_Goods";
import { GS_TroopsInfo_TroopsInfoItem } from "../../net/proto/DMSG_Plaza_Sub_Troops";
import { GOODS_ID, GOODS_TYPE } from "../../net/socket/handler/MessageEnum";
import BaseItem from "../../utils/ui/BaseItem";
import ImageLoader from "../../utils/ui/ImageLoader";
import { UiManager } from "../../utils/UiMgr";
import TowerStarTitle from "../towerStarSys/towerStarTitle";

const { ccclass, property } = cc._decorator;

enum TEN_CARD_STATE {
    CLOSE,
    FLIPING,
    OPENED,
}

export interface TenCardsCardItemData {
    goodsid:number;
    towerId: number;
    enableConvert: boolean;
}

@ccclass
export default class TenCardsCardItem extends BaseItem {
    static EventType = {
        ON_FLY_END: "on_fly_end",
        ON_FLIP_END: "on_flip_end",
        ON_FLIP_MID: "on_flip_mid",
        ON_CONVERT_END: 'on_convert_end',
    }

    @property(cc.Label)
    towerName: cc.Label = null;

    @property(ImageLoader)
    towerIcon: ImageLoader = null;

    @property(TowerStarTitle)
    towerType: TowerStarTitle = null;

    @property(cc.Label)
    starLabel: cc.Label = null;

    @property(cc.Node)
    progressGroup: cc.Node = null;

    @property(cc.ProgressBar)
    progress: cc.ProgressBar = null;

    @property(cc.Label)
    progressLabel: cc.Label = null;

    @property(cc.Node)
    canUp: cc.Node = null;

    @property(cc.Animation)
    animation: cc.Animation = null;

    @property(cc.Node)
    newNode: cc.Node = null;

    @property(cc.Node)
    iconNode: cc.Node = null;

    @property(cc.Node)
    bgNode: cc.Node = null;

    @property(cc.Animation)
    light: cc.Animation = null;

    @property(cc.Node)
    lightMask: cc.Node = null;

    @property(cc.Node)
    guangquan: cc.Node = null;

    @property(cc.Node)
    cardNode: cc.Node = null;

    @property(cc.Node)
    normalNode: cc.Node = null;

    @property(ImageLoader)
    normalIcon: ImageLoader = null;

    @property(cc.Label)
    normalName: cc.Label = null;

    @property(cc.Label)
    currCards: cc.Label = null;

    @property(cc.Label)
    maxCards: cc.Label = null;

    private state = TEN_CARD_STATE.CLOSE;
    private _towerCfg:GS_TroopsInfo_TroopsInfoItem;

    private _enableConvert: boolean = false;
    get enableConvert(): boolean {
        return this._enableConvert;
    }
    set enableConvert(value: boolean) {
        this._enableConvert = value;
    }

    onLoad() {
        this.cardNode.active = true;
        this.normalNode.active = false;
    }

    onDestroy() {
        cc.Tween.stopAllByTarget(this);
        this.unscheduleAllCallbacks();
    }

    public refresh() {
        if (this.data) {
            let data = this.data as TenCardsCardItemData;
            let goodsInfo = Game.goodsMgr.getGoodsInfo(data.goodsid);
            if (goodsInfo) {
                let isNew = !Game.towerMgr.isTowerUnlock(data.towerId);
                let towerCfg = Game.towerMgr.getTroopBaseInfo(data.towerId);
                this._towerCfg = towerCfg;
                this.towerName.string = goodsInfo.szgoodsname;

                this.towerIcon.setPicId(goodsInfo.npacketpicid);

                if (towerCfg) {
                    this.towerType.setIndex(towerCfg.bttype - 1);
                    //橙卡显示光圈
                    this.guangquan.active = towerCfg.btquality === 3;
                }

                this.progressGroup.active = false;
                this.newNode.active = false;
                this.refreshProgress(isNew);

                
            }
        }
    }

    private refreshProgress(isNew:boolean) {
        let cardID = this.data.towerId;
        let towerCfg = Game.towerMgr.getTroopBaseInfo(cardID);
        if (!towerCfg) return;
        let towerData = Game.towerMgr.getTroopData(cardID);
        if (!towerCfg) return;
        let starNum = towerData ? towerData.nstarlevel : 1;
        // let
        let currCards = Game.containerMgr.getItemCount(this.data.goodsid);
        let maxCards = Game.towerMgr.getPrivateGoodsNums(cardID);

        this.canUp.active = false;

        this.starLabel.string = starNum.toString();

        if (starNum >= Game.towerMgr.getStarMax(towerCfg.btquality)) {
            this.progress.progress = 1;
            this.progressLabel.string = "MAX";
        } else if (currCards >= maxCards) {
            this.progress.progress = 1;
            this.canUp.active = true;
            this.progressLabel.string = currCards + "/" + maxCards;
        } else {
            this.progress.progress = currCards / maxCards;
            this.progressLabel.string = currCards + "/" + maxCards;
        }

        if (isNew) {
            this.currCards.node.active = true;
            this.maxCards.node.active = true;
            maxCards = towerCfg.nactiveneedcardcount;
            this.currCards.string = currCards.toString();
            this.maxCards.string = "/" + maxCards.toString();
            let currTextColor;
            if (currCards >= maxCards) {
                currTextColor = cc.color(225, 255, 255);
            } else {
                currTextColor = cc.color(225, 0, 0);
                this.currCards.node.getComponent(cc.LabelOutline).enabled = false;
            }
            this.currCards.node.color = currTextColor;
            let quality = towerCfg.btquality + 1;
            this.currCards.node.getComponent(cc.LabelOutline).color = cc.color(QUALITY_COLOR[quality] || QUALITY_COLOR["1"]);
            this.maxCards.node.getComponent(cc.LabelOutline).color = cc.color(QUALITY_COLOR[quality] || QUALITY_COLOR["1"]);

            if (currCards >= maxCards) {
                this.newNode.active = true;
            }
        } else {
            this.currCards.node.active = false;
            this.maxCards.node.active = false;
        }
    }

    /**
     * 
     * @param starPos （world)
     * @param endPos （world)
     */
    public fly(starPos: cc.Vec2, endPos: cc.Vec2, delay: number = 0) {
        starPos = this.node.parent.convertToNodeSpaceAR(starPos);
        endPos = this.node.parent.convertToNodeSpaceAR(endPos);
        this.node.setPosition(starPos);
        cc.Tween.stopAllByTarget(this);
        cc.tween(this.node).delay(delay).call(() => {
            this.animation.play("scale");
        }).to(0.6, { position: endPos }, { easing: "quartOut" }).call(() => {
            this.node.emit(TenCardsCardItem.EventType.ON_FLY_END);
        }).start();
    }

    public playFlip(delay: number = 0) {
        this.state = TEN_CARD_STATE.FLIPING;
        this.scheduleOnce(() => {
            let towerCfg = Game.towerMgr.getTroopBaseInfo(this.data.towerId);
            if (towerCfg && towerCfg.btquality >= 2) {
                this.light.node.active = true;
                this.light.node.color = cc.color().fromHEX(this.getLightColor(towerCfg.btquality));
                this.lightMask.color = this.light.node.color;
                this.light.play();
                this.light.setCurrentTime(Date.now() * 0.001);
                this.animation.play("hightQualityFlip");
            }
            else {
                this.animation.play("flip");
            }
        }, delay);
    }

    private getLightColor(quality:number) {
        let value = "#FF96F6";
        switch (quality) {
            case 2:
                value = "#FF96F6"
                break;
            case 3:
                value = "#F7E282"
                break;
            case 4:
                value = "#ff898e"
                break;
        
            default:
                break;
        }
        return value;
    }

    private onFlipMid() {
        this.node.emit(TenCardsCardItem.EventType.ON_FLIP_MID, this.data.towerId);
    }

    private onFlipEnd() {
        this.state = TEN_CARD_STATE.OPENED;
        // let goodsInfo = Game.goodsMgr.getGoodsInfo(this.data.goodsid);
        this.progressGroup.active = Game.towerMgr.isTowerUnlock(this.data.towerId);
        this.node.emit(TenCardsCardItem.EventType.ON_FLIP_END);
    }

    public hide() {
        this.bgNode.active = true;
        this.iconNode.active = false;
        this.node.scale = 0;
        this.guangquan.active = false;
        this.light.node.active = false;
        this.state = TEN_CARD_STATE.CLOSE;
    }

    public onClick() {
        if (this.state === TEN_CARD_STATE.CLOSE) {
            this.playFlip();
        } else if (this.state ==  TEN_CARD_STATE.OPENED) {

            if (!this._towerCfg) {
                return;
            }
            if (Game.towerMgr.isTowerUnlock(this._towerCfg.ntroopsid)) {
                UiManager.showTopDialog(EResPath.TOWER_STAR_LV_UP_VIEW , {towerInfo:this._towerCfg});

            } else {
                UiManager.showTopDialog(EResPath.TOWER_STAR_MAIN_VIEW , this._towerCfg.bttype - 1);
            }
            
        }
    }

    public enableFlip() {
        return this.state === TEN_CARD_STATE.CLOSE;
    }

    public convertToHuDieJie() {
        if (!this.data) return false;
        let goodsInfo = Game.goodsMgr.getGoodsInfo(this.data.goodsid);
        let towerCfg = Game.towerMgr.getTroopBaseInfo(this.data.towerId);
        if (goodsInfo && towerCfg) {
            if (this.data.enableConvert) {
                cc.Tween.stopAllByTarget(this.node);
                cc.tween(this.node).to(0.2, { scale: 0 }).call(() => {
                    let convertInfo = Game.towerMgr.getCardConvertInfo(towerCfg.btquality);
                    this.normalNode.active = true;
                    this.cardNode.active = false;
                    let goodsInfo = Game.goodsMgr.getGoodsInfo(convertInfo.nswitchgoodsid || GOODS_ID.EQUIP_UPGRADE_MATERIAL);
                    this.normalIcon.setPicId(goodsInfo.npacketpicid);
                    this.normalName.string = goodsInfo.szgoodsname + " x" + convertInfo.nswitchgoodsnum;
                }).to(0.2, { scale: 1 }).call(() => {
                    this.node.emit(TenCardsCardItem.EventType.ON_CONVERT_END);
                }).start();
                return true;
            }
        }
        return false;
    }
}
