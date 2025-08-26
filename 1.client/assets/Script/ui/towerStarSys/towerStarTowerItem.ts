// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseItem from "../../utils/ui/BaseItem";
import { UiManager } from "../../utils/UiMgr";
import { EResPath } from "../../common/EResPath";
import Game from "../../Game";
import CatDragonBoneUi from "./CatDragonBoneUi";
import { GS_TroopsInfo_TroopsInfoItem } from "../../net/proto/DMSG_Plaza_Sub_Troops";
import GlobalVal from "../../GlobalVal";
import { GLOBAL_FUNC, TOWER_MASK_BGCOLOR, TOWER_TXT_COLOR } from "../../common/AllEnum";
import TowerStarPageItem from "./towerStarPageItem";
import { EventEnum } from "../../common/EventEnum";
import { ACTIVE_TYPE } from "../../net/socket/handler/MessageEnum";
import SystemTipsMgr from "../../utils/SystemTipsMgr";
import { ACTIVE_HALL_TAP_INDEX } from "../activity/ActiveHallView";
import CommandsFlow from "../tips/CommandsFlow";
import { OpenDialogCommand, SystemGuideCommand } from "../../tips/CheckPushDialogMgr";
import { SystemGuideTriggerType } from "../guide/SystemGuideCtrl";
import TowerStarTitle from "./towerStarTitle";
import { GameEvent } from "../../utils/GameEvent";

const { ccclass, property } = cc._decorator;

const ACTIVE_TITLE = {
    "801": "连续签到30天获得",
    "802": "超能系活动购买"
}

@ccclass
export default class TowerStarTowerItem extends BaseItem {

    @property(CatDragonBoneUi)
    towerIcon: CatDragonBoneUi = null;

    @property(cc.Label)
    towerName: cc.Label = null;

    @property(cc.ProgressBar)
    starPorgress: cc.ProgressBar = null;

    @property(cc.Label)
    starProgressText: cc.Label = null;

    @property(cc.Label)
    starText: cc.Label = null;

    @property(cc.Node)
    canUpStar: cc.Node = null;

    @property(cc.Sprite)
    bg: cc.Sprite = null;

    @property([cc.SpriteFrame])
    bgSpriteFrames: cc.SpriteFrame[] = [];

    @property(cc.Node)
    towerUiRoot: cc.Node = null;

    @property(cc.Node)
    gameUiRoot: cc.Node = null;

    @property(cc.Node)
    textUiRoot: cc.Node = null;

    @property(cc.Node)
    otherLayout: cc.Node = null;

    @property(cc.Button)
    towerBtn: cc.Button = null;

    @property(cc.Node)
    activeIcon: cc.Node = null;

    @property(cc.Animation)
    arrowAni: cc.Animation = null;

    @property(cc.Animation)
    bgAni: cc.Animation = null;

    @property
    enableRegister: boolean = true;

    @property(cc.Label)
    activeTip: cc.Label = null;

    @property(cc.Node)
    activeIco: cc.Node = null;

    @property(cc.Label)
    activeCurr: cc.Label = null;

    @property(cc.Label)
    activeMax: cc.Label = null;

    @property(cc.Node)
    starBg: cc.Node = null;

    @property(cc.Label)
    activeTitle: cc.Label = null;

    @property
    isDetailView: boolean = false;

    @property(cc.Node)
    tipGroup: cc.Node = null;

    @property(TowerStarTitle)
    towerTitle:TowerStarTitle = null;

    private canActive: boolean = false;


    start() {

        GameEvent.on(EventEnum.FASHION_USE, this.onFashionUse, this);
        GameEvent.on(EventEnum.FASHION_CANCEL, this.onFashionCancel, this);
    }

    onDestroy() {
        GameEvent.off(EventEnum.FASHION_USE, this.onFashionUse, this);
        GameEvent.off(EventEnum.FASHION_CANCEL, this.onFashionCancel, this);
    }

    setPageCtrl(ctrl: TowerStarPageItem) {
        this.towerIcon.setPageCtrl(ctrl);
    }

    public setData(data: any, index?: number): void {
        super.setData(data, index);
        if (data) {
            this.refresh();
        }
    }

    refresh(enableAni: boolean = true) {
        if (Game.towerMgr.isTowerUnlock(this.data.ntroopsid)) {
            this.unlock(enableAni);
        } else {
            this.lock();
        }

        this.towerTitle.setIndex(this.data.bttype - 1);
    }

    lock() {
        let towerCfg: GS_TroopsInfo_TroopsInfoItem = this.data;
        let currCards = Game.containerMgr.getItemCount(towerCfg.ncardgoodsid);
        // this.towerIcon.armatureNode.color = cc.color(0x000000);
        this.towerIcon.lock();
        this.towerIcon.setMaskColor(TOWER_MASK_BGCOLOR[towerCfg.btquality + 1] || TOWER_MASK_BGCOLOR["1"]);
        let progress = currCards / towerCfg.nactiveneedcardcount;
        this.towerIcon.setUnlockPercent(progress > 1 ? 1 : progress);
        this.towerIcon.setLevel(Game.fashionMgr.getTowerUseFashionInfo(towerCfg.ntroopsid) ? 4 : 1);
        this.towerIcon.setDragonUrl(Game.towerMgr.getUiModelUrl(towerCfg.ntroopsid, towerCfg));

        //背景
        let bgSp = this.bgSpriteFrames[towerCfg.btquality];
        bgSp = bgSp ? bgSp : this.bgSpriteFrames[this.bgSpriteFrames.length - 1];
        this.bg.spriteFrame = bgSp;

        //对超能系猫咪做特殊处理
        let isSuperTower1: boolean = towerCfg.ntroopsid >= 801 && towerCfg.ntroopsid <= 802;
        let isSuperTower2: boolean = towerCfg.ntroopsid >= 803 && towerCfg.ntroopsid <= 804;

        this.activeTitle.node.active = isSuperTower1;
        this.activeTitle.string = (isSuperTower1 && ACTIVE_TITLE[towerCfg.ntroopsid]) || "";

        this.otherLayout.active = isSuperTower1 || isSuperTower2;

        this.textUiRoot.active = !isSuperTower1;

        this.tipGroup.y = isSuperTower2 ? 20 : 0;

        this.gameUiRoot.active = false;

        //炮塔名称
        this.towerName.string = Game.towerMgr.getTowerName(towerCfg.ntroopsid, towerCfg);
        //当前星级
        this.starText.string = "0";
        //星级进度条

        this.starProgressText.string = 0 + "/" + 1;

        this.starPorgress.progress = 0;

        this.activeIcon && (this.activeIcon.active = false);
        this.activeIco && (this.activeIco.active = true);

        if (this.activeTip) {
            this.activeTip.node.active = true;
            this.activeTip.node.getComponent(cc.LabelOutline).color = cc.color(TOWER_TXT_COLOR[towerCfg.btquality + 1] || TOWER_TXT_COLOR["1"]);
        }
        if (this.activeCurr) {
            this.activeCurr.node.active = true;

            let outLine = this.activeCurr.node.getComponent(cc.LabelOutline);
            if (currCards >= towerCfg.nactiveneedcardcount) {
                outLine.enabled = true;
                outLine.color = cc.color(TOWER_TXT_COLOR[towerCfg.btquality + 1] || TOWER_TXT_COLOR["1"]);
                this.activeCurr.node.color = cc.Color.WHITE.fromHEX("#ffffff");
            } else {
                outLine.enabled = false;
                this.activeCurr.node.color = cc.Color.WHITE.fromHEX("#ff0000");
            }
            this.activeCurr.string = currCards.toString();
        }
        if (this.activeMax) {
            this.activeMax.node.active = true;
            this.activeMax.node.getComponent(cc.LabelOutline).color = cc.color(TOWER_TXT_COLOR[towerCfg.btquality + 1] || TOWER_TXT_COLOR["1"]);
            this.activeMax.string = "/" + towerCfg.nactiveneedcardcount;
        }

        this.starBg && (this.starBg.active = false);
        this.starPorgress.node.active = false;
        this.starProgressText.node.active = false;
        this.starText.node.active = false;
        this.canUpStar.active = false;
        this.towerName.node.active = false;

        if (currCards >= towerCfg.nactiveneedcardcount) {
            this.towerBtn.interactable = true;
            this.canActive = true;
        } else {
            this.towerBtn.interactable = false;
        }
    }

    unlock(enableAni: boolean = true) {
        this.canActive = false;
        let towerCfg: GS_TroopsInfo_TroopsInfoItem = this.data;
        // let towerStarCfg = towerStarSys.getStarCfg(this.data.mainId, this.data.quality, this.data.star);
        let stars = Game.towerMgr.getStar(this.data.ntroopsid);

        this.textUiRoot.active = true;
        this.starPorgress.node.active = true;
        this.gameUiRoot.active = true;
        this.otherLayout.active = false;

        this.tipGroup.y = 0;

        this.starBg && (this.starBg.active = true);
        this.starPorgress.node.active = true;
        this.starProgressText.node.active = true;
        this.starText.node.active = true;
        this.canUpStar.active = true;
        this.towerName.node.active = true;

        this.towerBtn.interactable = true;
        if (enableAni) {
            this.towerIcon.unlock();
        } else {
            this.towerIcon.unlockWithoutAni();
        }
        this.towerIcon.hideMask();
        this.towerIcon.setLevel(Game.fashionMgr.getTowerUseFashionInfo(towerCfg.ntroopsid) ? 4 : 1);
        this.towerIcon.setDragonUrl(Game.towerMgr.getUiModelUrl(towerCfg.ntroopsid, towerCfg));
        //背景
        let bgSp = this.bgSpriteFrames[towerCfg.btquality];
        bgSp = bgSp ? bgSp : this.bgSpriteFrames[this.bgSpriteFrames.length - 1];
        this.bg.spriteFrame = bgSp;
        //炮塔图标

        //炮塔名称
        this.towerName.string = Game.towerMgr.getTowerName(towerCfg.ntroopsid, towerCfg);
        this.towerName.node.getComponent(cc.LabelOutline).color = cc.color(TOWER_TXT_COLOR[towerCfg.btquality + 1] || TOWER_TXT_COLOR["1"]);
        //当前星级
        this.starText.string = stars.toString();

        //星级进度条
        let maxCards = Game.towerMgr.getPrivateGoodsNums(towerCfg.ntroopsid);
        let currCards = Game.containerMgr.getItemCount(towerCfg.ncardgoodsid);

        this.starProgressText.string = currCards + "/" + maxCards;
        let progress = currCards / maxCards;
        this.starPorgress.progress = progress > 1 ? 1 : progress;

        //是否显示canUp图标
        let canup: boolean = progress >= 1 ? true : false;

        this.canUpStar.active = canup;
        if (canup) {
            this.arrowAni.play();
            this.arrowAni.setCurrentTime((Date.now() - GlobalVal.treatrueArrowAniTime) / 1000);
        }

        if (stars >= Game.towerMgr.getStarMax(towerCfg.btquality)) {
            this.maxStarRefresh();
        }

        let isActive: boolean = Game.towerMgr.isTowerActive(towerCfg.ntroopsid);
        this.activeIcon && (this.activeIcon.active = isActive);

        this.activeIco && (this.activeIco.active = false);
        this.activeCurr && (this.activeCurr.node.active = false);
        this.activeMax && (this.activeMax.node.active = false);
        this.activeTip && (this.activeTip.node.active = false);
    }

    refreshAniNode(delay: number) {
        this.unschedule(this.playBgAni);
        this.scheduleOnce(this.playBgAni, delay);
    }

    playBgAni() {
        this.bgAni.play();
    }

    getTowerUiRoot(): cc.Node {
        return this.towerUiRoot;
    }

    getGameUiRoot(): cc.Node {
        return this.gameUiRoot;
    }

    getTextUiRoot(): cc.Node {
        return this.textUiRoot;
    }

    getOtherUiRoot(): cc.Node {
        return this.otherLayout;
    }

    onClick() {
        if (this.canActive) {
            // UiManager.showDialog(EResPath.TOWER_STAR_NEW_CARDS_VIEW, this.data);
            Game.towerMgr.requestActiveNewTower(this.data.ntroopsid);
            return;
        }
        // this._target.selectIndex(this._index);
        UiManager.showDialog(EResPath.TOWER_STAR_LV_UP_VIEW, { towerInfo: this.data });
        // GameEvent.emit("yongbing-" + this.data.ntroopsid, false);
    }

    maxStarRefresh() {
        this.canUpStar.active = false;
        this.starProgressText.string = "MAX";
        this.starPorgress.progress = 1;
    }

    public registerRedPoint() {
        if (!this.enableRegister) return;
        if (!this.data) return;
        let towerCfg: GS_TroopsInfo_TroopsInfoItem = this.data;
        Game.redPointSys.registerRedPoint("yongbing-" + towerCfg.ntroopsid, this.bgAni.node);
    }

    public unregisterRedPoint() {
        if (!this.enableRegister) return;
        if (!this.data) return;
        let towerCfg: GS_TroopsInfo_TroopsInfoItem = this.data;
        Game.redPointSys.unregisterRedPoint("yongbing-" + towerCfg.ntroopsid, this.bgAni.node);
    }

    onEnable() {
        this.registerRedPoint();
    }

    onDisable() {
        this.unregisterRedPoint();
    }

    private onFashionUse(nid: number) {
        if (!this.data) return;
        let info = Game.fashionMgr.getFashionInfo(nid);
        if (info.ntroopsid == this.data.ntroopsid) {
            this.refresh(this.isDetailView);
        }
    }

    private onFashionCancel(nid: number) {
        if (!this.data) return;
        let info = Game.fashionMgr.getFashionInfo(nid);
        if (info.ntroopsid == this.data.ntroopsid) {
            this.refresh(this.isDetailView);
        }
    }

    private gotoActive() {
        let towerCfg: GS_TroopsInfo_TroopsInfoItem = this.data;
        switch (towerCfg.ntroopsid) {
            case 801://雷神
                if (Game.globalFunc.isFuncOpened(GLOBAL_FUNC.SIGN)
                    && Game.globalFunc.canShowFunc(GLOBAL_FUNC.SIGN)) {
                    UiManager.showDialog(EResPath.ACTIVE_HALL_VIEW, ACTIVE_HALL_TAP_INDEX.SIGN);
                } else {
                    SystemTipsMgr.instance.notice("活动还未开始，敬请期待");
                }
                break;
            case 802://钢铁侠
                if (Game.globalFunc.isFuncOpened(GLOBAL_FUNC.ACTIVITE)
                    && Game.globalFunc.canShowFunc(GLOBAL_FUNC.ACTIVITE)
                    && !Game.sysActivityMgr.isActivityFinished(ACTIVE_TYPE.GANGTIEXIA)) {
                    UiManager.showDialog(EResPath.ACTIVE_GANGTIEXIA_VIEW);
                } else {
                    SystemTipsMgr.instance.notice("活动还未开始，敬请期待");
                }
                break;
            case 803:
                if (Game.globalFunc.isFuncOpenAndCanShow(GLOBAL_FUNC.PVP)) {
                    CommandsFlow.addCommand(new OpenDialogCommand(EResPath.PVP_MATCH_VIEW));
                    if (GlobalVal.mindTips803) {
                        GlobalVal.mindTips803 = false;
                        CommandsFlow.addCommand(new SystemGuideCommand(SystemGuideTriggerType.PVP_SHOP));
                    }
                    CommandsFlow.startCommand();
                } else {
                    let cfg = Game.globalFunc.getOpenCfg(GLOBAL_FUNC.PVP);
                    SystemTipsMgr.instance.notice("通过 " + cfg.funcOpenCondition + " 关开放竞技模式，才能使用竞技点兑换猫咪");
                }
                break;
            case 804:
                if (Game.globalFunc.isFuncOpenAndCanShow(GLOBAL_FUNC.COOPERATE)) {
                    CommandsFlow.addCommand(new OpenDialogCommand(EResPath.COOPERATE_VIEW));
                    if (GlobalVal.mindTips804) {
                        GlobalVal.mindTips804 = false;
                        CommandsFlow.addCommand(new SystemGuideCommand(SystemGuideTriggerType.COOP_SHOP));
                    }
                    CommandsFlow.startCommand();
                } else {
                    let cfg = Game.globalFunc.getOpenCfg(GLOBAL_FUNC.COOPERATE);
                    SystemTipsMgr.instance.notice("通过 " + cfg.funcOpenCondition + " 关开放合作模式，才能使用合作积分兑换猫咪");
                }
                break;
        }
    }
}
