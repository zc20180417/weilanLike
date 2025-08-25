// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseItem from "../../utils/ui/BaseItem";
import Game from "../../Game";
import { QUALITY_BG_COLOR, QUALITY_COLOR, QUALITY_LIGHT_COLOR, QUALITY_OUTLINE_COLOR } from "../../common/AllEnum";
import { GS_GoodsInfoReturn_GoodsInfo } from "../../net/proto/DMSG_Plaza_Sub_Goods";
import { GOODS_TYPE } from "../../net/socket/handler/MessageEnum";
import GlobalVal from "../../GlobalVal";
import ImageLoader from "../../utils/ui/ImageLoader";
import { Handler } from "../../utils/Handler";
import CardQuailtyEffect from "../CardQuailtyEffect";
import { NodeUtils } from "../../utils/ui/NodeUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TreatrueLyoutItem extends BaseItem {

    _delay: number = 0;

    @property(cc.Animation)
    ani: cc.Animation = null;
    //@property(cc.Sprite)
    //iconFrame: cc.Sprite = null;

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
    state: cc.Node = null;

    @property(cc.Animation)
    arrowAni: cc.Animation = null;

    @property(cc.LabelOutline)
    numLabelOutLine: cc.LabelOutline = null;

    @property(cc.Label)
    currCards: cc.Label = null;

    @property(cc.Label)
    maxCards: cc.Label = null;

    @property(cc.Node)
    starIco: cc.Node = null;

    @property(cc.Node)
    maskNode: cc.Node = null;

    @property(cc.Node)
    breathLight: cc.Node = null;

    @property(cc.Node)
    light: cc.Node = null;

    @property(CardQuailtyEffect)
    cardEftComp:CardQuailtyEffect = null;

    grayHad:boolean = false;

    private _dontClick:boolean = false;
    private _clickHandler: Handler = null;
    private _loadEftHandler:Handler = null;
    private _effect:cc.Node = null;
    onLoad() {
        this.scheduleOnce(() => {
            this.ani.play("itemScale");
        }, this._delay);
    }

    setDelay(delay: number) {
        this._delay = delay;
    }

    refresh() {
        if (this.data) {
            let cfg = this.data.itemCfg as GS_GoodsInfoReturn_GoodsInfo;
            if (cfg.lgoodstype == GOODS_TYPE.GOODSTYPE_RES_UPGRADESTAR) {
                //卡片
                this.refreshCardType(this.data);
                
                this.numLabelOutLine.color = cc.Color.BLACK.fromHEX(QUALITY_OUTLINE_COLOR[cfg.btquality + 1] || "#fff");
            } else {
                this.refreshMoneyType(this.data);
                this.numLabelOutLine.color = cc.Color.BLACK.fromHEX(QUALITY_OUTLINE_COLOR[cfg.btquality] || "#fff");
            }
        }
    }

    refreshMoneyType(data: any) {
        this.progressNode.active = false;
        this._dontClick = false;
        this.imageLoader.setPicId(data.itemCfg.npacketpicid);
        if (data.itemCfg.lgoodstype != GOODS_TYPE.GOODSTYPE_CARD_TROOPSEQUIP && data.itemCfg.lgoodstype != GOODS_TYPE.GOODSTYPE_RES_SKIN) {
            this.imageLoader.node.scale = 1.0;
            this.num.string = data.itemCfg.szgoodsname + "x" + data.num;
        } else {
            if (this.grayHad && Game.towerMgr.checkEquipActive(data.itemCfg.lparam[1])) {
                NodeUtils.setNodeGray(this.node , true);
                this._dontClick = true;
            }
            this.num.string = '';
        }
        this.refreshQuality(1);
        this.light.active = false;
        this.breathLight.active = false;
    }

    refreshCardType(data: any) {
        let cfg = this.data.itemCfg as GS_GoodsInfoReturn_GoodsInfo;
        let towerCfg = Game.towerMgr.getTroopBaseInfo(cfg.lparam[0]);
        this.num.string = cfg.szgoodsname + "x" + data.num;
        this.imageLoader.setPicId(cfg.npacketpicid)
        this.refreshQuality(cfg.btquality + 1);
        let isNew = !Game.towerMgr.isTowerUnlock(cfg.lparam[0]);
        this.refreshProgress(isNew);
        this.state.active = isNew;
        this.breathLight.active = false;
        this.light.active = false;
        if (towerCfg.btquality === 2) {
            //紫卡
            this.breathLight.active = true;
            this.breathLight.color = cc.color().fromHEX("#FF96F6");
        } else if (towerCfg.btquality === 3) {
            //橙卡
            this.breathLight.active = true;
            this.light.active = true;
            this.breathLight.color = cc.color().fromHEX("#F7E282");
        } 
        this.cardEftComp.showCardEffect(towerCfg.btquality);
    }

    refreshProgress(isNew: boolean) {
        let cardID = this.data.itemCfg.lparam[0];
        let towerData = Game.towerMgr.getTroopData(cardID);
        let towerCfg = Game.towerMgr.getTroopBaseInfo(cardID);
        let starNum = towerData ? towerData.nstarlevel : 1;
        let maxCards = 0;
        let currCards = Game.containerMgr.getItemCount(towerCfg.ncardgoodsid);

        //星级进度条
        let progress = 0;
        // if (currCards > maxCards) return;

        this.progressNode.active = true;
        this.starLab.string = starNum + '';
        // this.canUp.active = false;
        if (isNew) {//新卡
            this.starLab.node.active = false;
            this.progress.node.active = false;
            this.progressLab.node.active = false;
            this.starIco.active = false;
            this.currCards.node.active = true;
            this.maxCards.node.active = true;
            this.canUp.active = false;

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
            this.currCards.node.getComponent(cc.LabelOutline).color = cc.color(QUALITY_COLOR[towerCfg.btquality + 1] || QUALITY_COLOR["1"]);
            this.maxCards.node.getComponent(cc.LabelOutline).color = cc.color(QUALITY_COLOR[towerCfg.btquality + 1] || QUALITY_COLOR["1"]);
            return;
        }

        maxCards = Game.towerMgr.getPrivateGoodsNums(cardID);

        if (currCards >= maxCards) {
            this.canUp.active = true;
            this.arrowAni.play();
            this.arrowAni.setCurrentTime((Date.now() - GlobalVal.treatrueArrowAniTime) / 1000);
        } else {
            this.canUp.active = false;
        }

        this.starLab.node.active = true;
        this.progress.node.active = true;
        this.progressLab.node.active = true;
        this.starIco.active = true;
        this.currCards.node.active = false;
        this.maxCards.node.active = false;

        if (starNum >= Game.towerMgr.getStarMax(towerCfg.btquality)) {
            this.canUp.active = false;
            this.progress.progress = 1;
            this.progressLab.string = "MAX";
            return;
        }

        progress = currCards / maxCards;
        this.progress.progress = progress > 1 ? 1 : progress;
        this.progressLab.string = currCards + "/" + maxCards;

    }

    refreshNum(num: number) {
        this.num.string = this.data.itemCfg.szgoodsname + "x" + num;
    }

    /**
     * 刷新品质信息
     * @param quality 
     */
    refreshQuality(quality: number) {
        //this.iconFrame.spriteFrame = this.iconFrames[quality - 1];
    }

    setClickHandler(handler: Handler) {
        this._clickHandler = handler;
    }

    onClick() {
        if (this._dontClick) return;
        if (this._clickHandler) this._clickHandler.executeWith(this);
    }

    public onSelect(): void {
        this.maskNode.active = true;
    }

    public unSelect(): void {
        this.maskNode.active = false;
    }

    
}
