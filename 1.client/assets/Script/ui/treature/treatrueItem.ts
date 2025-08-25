
import BaseItem from "../../utils/ui/BaseItem";
import { QUALITY_LIGHT_COLOR, QUALITY_BG_COLOR, QUALITY_OUTLINE_COLOR, QUALITY_COLOR } from "../../common/AllEnum";
import Game from "../../Game";
import { GameEvent } from "../../utils/GameEvent";
import { EventEnum } from "../../common/EventEnum";
import { GS_GoodsInfoReturn_GoodsInfo } from "../../net/proto/DMSG_Plaza_Sub_Goods";
import { GOODS_TYPE } from "../../net/socket/handler/MessageEnum";
import { NodeUtils } from "../../utils/ui/NodeUtils";
import ImageLoader from "../../utils/ui/ImageLoader";
import TowerStarTitle from "../towerStarSys/towerStarTitle";
import { EResPath } from "../../common/EResPath";
import SoundManager from "../../utils/SoundManaget";
import CharAnimation from "./CharAnimation";


const { ccclass, property } = cc._decorator;

@ccclass
export default class TreatrueItem extends BaseItem {
    @property(cc.Label)
    title: cc.Label = null;

    @property(ImageLoader)
    imageLoader: ImageLoader = null;

    @property(cc.Label)
    starLab: cc.Label = null;

    @property(cc.Label)
    progressLab: cc.Label = null;

    @property(cc.Node)
    progressNode: cc.Node = null;

    @property(cc.ProgressBar)
    progress: cc.ProgressBar = null;

    @property(cc.Node)
    canUp: cc.Node = null;

    @property(cc.Label)
    num: cc.Label = null;

    @property(cc.Node)
    guanquan: cc.Node = null;

    @property(cc.Node)
    bg: cc.Node = null;

    @property(cc.Node)
    light: cc.Node = null;

    @property(cc.LabelOutline)
    nameOutLine: cc.LabelOutline = null;

    @property(cc.Node)
    state: cc.Node = null;

    @property(cc.Label)
    currCards: cc.Label = null;

    @property(cc.Label)
    maxCards: cc.Label = null;

    @property(cc.Node)
    starIco: cc.Node = null;

    @property(TowerStarTitle)
    towerStarTitle: TowerStarTitle = null;

    @property(cc.Node)
    titleCircle: cc.Node = null;

    @property(cc.Node)
    normalNode: cc.Node = null;

    @property(cc.Node)
    goldNode: cc.Node = null;

    @property(cc.Node)
    goldProgress: cc.Node = null;

    @property(cc.ProgressBar)
    goldProgresss: cc.ProgressBar[] = [];

    @property(ImageLoader)
    towerIcon: ImageLoader = null;

    @property(CharAnimation)
    charAnimation: CharAnimation = null;

    @property(cc.Label)
    charLabel: cc.Label = null;

    @property(cc.Node)
    goldBg: cc.Node = null;

    @property(cc.Animation)
    animation: cc.Animation = null;

    @property(cc.Node)
    goldLight: cc.Node = null;

    @property(cc.Node)
    goldFrontBg: cc.Node = null;

    @property({
        type: cc.AudioClip
    })
    pinkAudio: cc.AudioClip = null;

    @property({
        type: cc.AudioClip
    })
    yellowAudio: cc.AudioClip = null;

    _isShowLight: boolean = false;
    private _aniEnd: boolean = true;
    private _quality:number = 0;
    public get aniEnd(): boolean {
        return this._aniEnd;
    }

    onEnable() {
        this.towerIcon.node.on(ImageLoader.EventType.ON_IMAGE_LOADED, this.onCardLoaded, this);
    }

    onDisable() {
        this.towerIcon.node.off(ImageLoader.EventType.ON_IMAGE_LOADED, this.onCardLoaded, this);
    }

    refresh(isShowLight: boolean) {
        if (this.data) {
            this._aniEnd = false;
            this._isShowLight = isShowLight;
            let cfg = this.data.itemCfg as GS_GoodsInfoReturn_GoodsInfo;
            if (cfg.lgoodstype == GOODS_TYPE.GOODSTYPE_RES_UPGRADESTAR) {
                //卡片
                this.refreshCardType(this.data);
            } else {
                //货币
                this.refreshMoneyType(this.data);
            }
        }
    }


    refreshMoneyType(data: any) {
        this.normalNode.active = true;
        this.goldNode.active = false;
        this.light.active = this._isShowLight;
        this.progressNode.active = false;
        this.title.string = data.itemCfg.szgoodsname;
        this.num.string = "x" + data.num;
        this.imageLoader.setPicId(this.data.itemCfg.npacketpicid)
        this.imageLoader.node.scale = 1;
        this.titleCircle.active = false;
        this.towerStarTitle.node.active = false;
        this._quality = data.itemCfg.btquality;
        this.refreshQuality();
        this.animation.play();
    }

    refreshCardType(data: any) {
        let cfg = this.data.itemCfg as GS_GoodsInfoReturn_GoodsInfo;
        let isNew = !Game.towerMgr.isTowerUnlock(cfg.lparam[0]);
        let towerCfg = Game.towerMgr.getTroopBaseInfo(cfg.lparam[0]);
        this._quality = cfg.btquality + 1;
        this.goldNode.active = towerCfg.btquality >= 2;
        this.normalNode.active = !this.goldNode.active;
        if (towerCfg.btquality >= 2) {
            let outLine = this.charLabel.node.getComponent(cc.LabelOutline);
            outLine && (outLine.color = cc.color(QUALITY_OUTLINE_COLOR[this._quality] || "#fff"))
            this.goldBg.color = cc.color(QUALITY_BG_COLOR[this._quality] || "#fff");
            this.charAnimation.node.active = false;
            this.towerIcon.node.active = false;
            this.goldProgress.active = false;
            this.goldLight.active = false;
            this.towerIcon.url = EResPath.TOWER_IMG + towerCfg.sz3dpicres;
        } else {
            this.titleCircle.active = true;
            this.towerStarTitle.node.active = true;
            this.light.active = this._isShowLight;
            this.title.string = cfg.szgoodsname;
            this.num.string = "x" + data.num;
            this.imageLoader.setPicId(cfg.npacketpicid);
            this.refreshQuality();

            if (towerCfg) {
                this.towerStarTitle.setIndex(towerCfg.bttype - 1);
            }
            this.refreshProgress(isNew);
            this.state.active = isNew;
            this.animation.play();
        }
    }

    private onCardLoaded() {
        let cfg = this.data.itemCfg as GS_GoodsInfoReturn_GoodsInfo;
        let towerCfg = Game.towerMgr.getTroopBaseInfo(cfg.lparam[0]);
        //播放音效
        if (towerCfg.btquality === 2) {
            SoundManager.instance.isSoundOn && cc.audioEngine.playEffect(this.pinkAudio, false);
        } else if (towerCfg.btquality === 3) {
            SoundManager.instance.isSoundOn && cc.audioEngine.playEffect(this.yellowAudio, false);
        }

        let delay = 0;
        //背景动画
        cc.tween(this.goldBg)
            .set({ opacity: 0 })
            .to(0.3, { opacity: 255 })
            .call(() => {
                this.frameEventBgOpacityToMax();
            })
            .to(0.2, { opacity: 0 })
            .start();

        //前景动画
        cc.tween(this.goldFrontBg)
            .set({ opacity: 200 })
            .to(0.5, { opacity: 0 }, { easing: "cubicOut" })
            .start();

        //炮塔动画
        cc.tween(this.towerIcon.node)
            .set({ active: true, color: cc.Color.BLACK, scale: 3, opacity: 0 })
            .parallel(
                cc.tween().to(0.5, { scale: 1, opacity: 255 }, { easing: "cubicOut" }),
                cc.tween().to(0.5, { opacity: 255 })
            )
            .to(0.3, { color: cc.Color.WHITE })
            .start();

        delay = 0.5;

        //光圈
        cc.tween(this.goldLight)
            .delay(delay)
            .set({ active: true, scale: 0 })
            .to(0.3, { scale: 3 })
            .start();

        delay = 0.8;

        //名称
        cc.tween(this.charAnimation.node).delay(delay).set({ active: true }).call(() => {
            this.charAnimation.setData(cfg.szgoodsname);
            this.charAnimation.stopAnimation();
            this.charAnimation.startAnimation();
            delay = this.charAnimation.getAnimationTime();
            let self = this;
            cc.tween(this.goldProgress).delay(delay).set({ active: true }).delay(0.8).call(() => {
                self._aniEnd = true;
            }).start();
            //进度条动画
            cc.tween(this.goldProgresss[0]).delay(delay).set({ progress: 0 }).to(0.5, { progress: towerCfg.btattackhurt / 10 }, { easing: "quadOut" }).start();
            cc.tween(this.goldProgresss[1]).delay(delay).set({ progress: 0 }).delay(0.1).to(0.5, { progress: towerCfg.btattackdist / 10 }, { easing: "quadOut" }).start();
            cc.tween(this.goldProgresss[2]).delay(delay).set({ progress: 0 }).delay(0.2).to(0.5, { progress: towerCfg.btattackspeed / 10 }, { easing: "quadOut" }).start();
            cc.tween(this.goldProgresss[3]).delay(delay).set({ progress: 0 }).delay(0.3).to(0.5, { progress: towerCfg.btctr / 10 }, { easing: "quadOut" }).start();
        }).start();
    }

    refreshProgress(isNew: boolean = false) {
        let cardID = this.data.itemCfg.lparam[0];
        let towerCfg = Game.towerMgr.getTroopBaseInfo(cardID);
        let towerData = Game.towerMgr.getTroopData(cardID);
        if (!towerCfg) return;
        let starNum = towerData ? towerData.nstarlevel : 1;
        // let
        let maxCards = 0;
        let currCards = Game.containerMgr.getItemCount(towerCfg.ncardgoodsid);

        this.progressNode.active = true;

        if (isNew) {//新卡
            this.canUp.active = false;
            this.starLab.node.active = false;
            this.progress.node.active = false;
            this.progressLab.node.active = false;
            this.starIco.active = false;
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
            this.currCards.node.getComponent(cc.LabelOutline).color = cc.color(QUALITY_COLOR[this._quality] || QUALITY_COLOR["1"]);
            this.maxCards.node.getComponent(cc.LabelOutline).color = cc.color(QUALITY_COLOR[this._quality] || QUALITY_COLOR["1"]);
            return;
        }

        maxCards = Game.towerMgr.getPrivateGoodsNums(cardID);

        this.starLab.node.active = true;
        this.progress.node.active = true;
        this.progressLab.node.active = true;
        this.starIco.active = true;
        this.canUp.active = false;
        this.currCards.node.active = false;
        this.maxCards.node.active = false;

        this.starLab.string = starNum + '';

        if (starNum >= Game.towerMgr.getStarMax(towerCfg.btquality)) {
            this.progress.progress = 1;
            this.progressLab.string = "MAX";
            return;
        }

        if (currCards >= maxCards) {
            this.progress.progress = 1;
            this.canUp.active = true;
            this.progressLab.string = currCards + "/" + maxCards;
        } else {
            NodeUtils.labelCountingAni(
                this.progressLab,
                Math.max(currCards - this.data.num, 0),
                this.data.num,
                (currValue) => {
                    this.progress.progress = currValue / maxCards > 1 ? 1 : currValue / maxCards;
                },
                (currValue) => {
                    this.progress.progress = currValue / maxCards > 1 ? 1 : currValue / maxCards;
                    if (currValue >= maxCards) {
                        this.canUp.active = true;
                    }
                },
                "",
                "/" + maxCards);
        }

    }

    animationEnd() {
        this._aniEnd = true;
    }

    frameEventBgOpacityToMax() {
        GameEvent.emit(EventEnum.TREATRUE_BG_OPACITY_TO_MAX, this._quality, QUALITY_BG_COLOR[this._quality] || "#fff");
    }

    /**
     * 刷新品质信息
     * @param quality 
     */
    refreshQuality() {
        let color = cc.color(QUALITY_LIGHT_COLOR[this._quality] || "#fff");
        this.guanquan.children.forEach((v, k) => {
            v.color = color;
        });
        this.bg.color = cc.color(QUALITY_BG_COLOR[this._quality] || "#fff");
        this.nameOutLine.color = cc.color(QUALITY_OUTLINE_COLOR[this._quality] || "#fff");
        if (this._quality > 2) {
            GameEvent.emit(EventEnum.SHOW_LIGHT_CIRCLE, true);
            this.guanquan.active = true;
        } else {
            this.guanquan.active = false;
        }
    }
}
