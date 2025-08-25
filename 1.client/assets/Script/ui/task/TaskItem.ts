import { DayTaskType, GLOBAL_FUNC } from "../../common/AllEnum";
import { EResPath } from "../../common/EResPath";
import Game from "../../Game";
import { GS_GoodsInfoReturn_GoodsInfo } from "../../net/proto/DMSG_Plaza_Sub_Goods";
import { GOODS_TYPE } from "../../net/socket/handler/MessageEnum";
import SystemTipsMgr from "../../utils/SystemTipsMgr";
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseItem from "../../utils/ui/BaseItem";
import ImageLoader from "../../utils/ui/ImageLoader";
import { UiManager } from "../../utils/UiMgr";
import GoodsItem from "../newhand_book/GoodsItem";
import { ShopIndex } from "../shop/ShopView";
import { TASK_STATE } from "./net/TaskMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ManualItem extends BaseItem {

    @property(cc.Label)
    diamondLab: cc.Label = null;

    @property(cc.Sprite)
    progressBar: cc.Sprite = null;

    @property(cc.Label)
    des: cc.Label = null;

    @property(ImageLoader)
    diamondIcon: ImageLoader = null;

    @property(cc.Sprite)
    rewardSprite: cc.Sprite = null;

    @property(cc.Node)
    finished: cc.Node = null;

    @property(cc.Node)
    canGet: cc.Node = null;

    @property(cc.Node)
    canNotGet: cc.Node = null;

    @property(cc.Label)
    currValue: cc.Label = null;

    @property(cc.Label)
    maxValue: cc.Label = null;

    @property(cc.Material)
    normalMat: cc.Material = null;

    @property(cc.Material)
    grayMat: cc.Material = null;

    @property(ImageLoader)
    icon: ImageLoader = null;

    @property(cc.Node)
    rewardNode: cc.Node = null;

    @property(GoodsItem)
    headFrame: GoodsItem = null;

    @property(cc.Label)
    title: cc.Label = null;

    _eventAdded: boolean = false;

    public setData(data: any, index?: number) {
        super.setData(data, index);
        this.refresh();
    }

    public refresh() {
        if (!this.data) return;
        let rewardItemCfg: GS_GoodsInfoReturn_GoodsInfo = Game.goodsMgr.getGoodsInfo(this.data.nrewardgoodsid[0]);
        let taskListCfg = Game.taskMgr.getTaskListCfg(this.data.stasklistid);
        //title
        this.title && (this.title.string = this.data.szname);
        //描述     
        this.des.string = this.data.sztips;
        //进度
        let curValue = taskListCfg ? taskListCfg.unowfinish : 0;
        let maxValue = this.data.ufinishtimes;
        // curValue = curValue > maxValue ? maxValue : curValue;
        this.currValue.string = curValue.toString();
        this.maxValue.string = "/" + maxValue;
        this.progressBar.fillRange = curValue / maxValue;
        //奖励图标
        if (rewardItemCfg) {
            if (this.headFrame && this.rewardNode) {
                if (rewardItemCfg.lgoodstype == GOODS_TYPE.GOODSTYPE_CARD_FURNITURE ||
                    rewardItemCfg.lgoodstype == GOODS_TYPE.GOODSTYPE_CARD_SHOWRES) {
                    //展示头像框和家具
                    this.headFrame.node.active = true;
                    this.rewardNode.active = false;
                    // this.headFrame.setPicId(rewardItemCfg.npacketpicid);
                    this.headFrame.setData({
                        goodsId: rewardItemCfg.lgoodsid,
                        nums: 1,
                    })
                } else {
                    //普通奖励
                    this.headFrame.node.active = false;
                    this.rewardNode.active = true;
                    this.diamondIcon.setPicId(rewardItemCfg.npacketpicid);
                }
            } else {
                //普通资源
                this.diamondIcon.setPicId(rewardItemCfg.npacketpicid);
            }
        } else {
            this.rewardNode && (this.rewardNode.active = false);
            this.headFrame && (this.headFrame.node.active = false);
        }
        //奖励数量
        this.diamondLab.string = this.data.nrewardgoodsnum[0];
        //领取状态
        this.refreshRewardState(taskListCfg);
        //任务图标
        this.icon.setPicId(this.data.npicid);
    }

    private refreshRewardState(taskListCfg: any) {
        // let curValue = taskListCfg ? taskListCfg.unowfinish : 0;
        // let maxValue = this.data.ufinishtimes;

        let taskState = Game.taskMgr.getTaskState(taskListCfg, this.data);

        switch (taskState) {
            case TASK_STATE.FINISHED:
                this.finished.active = true;
                this.canGet.active = false;
                this.canNotGet.active = false;
                this.rewardSprite.setMaterial(0, this.normalMat);
                break;
            case TASK_STATE.UNFINISHED:
                this.finished.active = false;
                this.canGet.active = false;
                this.canNotGet.active = true;
                this.rewardSprite.setMaterial(0, this.normalMat);
                break;
            case TASK_STATE.CANGET:
                this.finished.active = false;
                this.canGet.active = true;
                this.canNotGet.active = false;
                this.rewardSprite.setMaterial(0, this.normalMat);
                break;
        }

        // // curValue = curValue > maxValue ? maxValue : curValue;
        // if (taskListCfg && taskListCfg.ureceivefinish == this.data.ufinishtimes) {//已领取

        // } else if (curValue < maxValue) {//不可领取

        // } else {//可以领取

        // }
    }

    private getReward() {
        Game.taskMgr.finish(this.data.stasklistid);
    }

    onGoClick() {
        if (!this.data) return;
        switch (this.data.ufunctype) {
            case DayTaskType.Ad:
                UiManager.showDialog(EResPath.SHOP_VIEW , ShopIndex.TE_HUI);
                break;
            case DayTaskType.ConsumeDiamond:
                UiManager.showDialog(EResPath.SHOP_VIEW , ShopIndex['YAOSHI'] ? ShopIndex['YAOSHI'] : ShopIndex.TREATRUE);
                break;
            case DayTaskType.HideWar:
                SystemTipsMgr.instance.notice("隐藏关的位置只能自己找！");
                break;
            case DayTaskType.UpgradeTower:
                let index = Game.towerMgr.getFightCanupTowerIndex(Game.towerMgr.getFightTowers());
                UiManager.showDialog(EResPath.TOWER_STAR_MAIN_VIEW, index);
                break;
            case DayTaskType.Pvp:
                if (!Game.globalFunc.checkGlobalFuncState(GLOBAL_FUNC.PVP , true)) {
                    return;
                }
                UiManager.showDialog(EResPath.PVP_MATCH_VIEW);
                break;
            case DayTaskType.Cooperate:
                if (!Game.globalFunc.checkGlobalFuncState(GLOBAL_FUNC.COOPERATE , true)) {
                    return;
                }
                UiManager.showDialog(EResPath.COOPERATE_VIEW);
                break;
            case DayTaskType.War:
                let warID: number = Game.sceneNetMgr.getCurWarID();
                let worldInfo = Game.sceneNetMgr.getChapterByWarID(warID);
                UiManager.showDialog(EResPath.CP_INFO_VIEW, { warID: warID, worldID: worldInfo.nworldid, byType: worldInfo.bttype });
                break;
            case DayTaskType.AddFriend:
                UiManager.showDialog(EResPath.FRIEND_VIEW, 1);
                break;
            case DayTaskType.Chapter:
                if (this.data.ufuncparam0 == 0) {
                    SystemTipsMgr.instance.notice("隐藏关卡无法告知具体位置");
                } else if (this.data.ufuncparam0 >= 1 && this.data.ufuncparam0 <= 7) {
                    UiManager.showDialog(EResPath.CHAPTER_CUPS_VIEW, { mapId: this.data.ufuncparam0, isNight: Game.chapterMgr.getMapNightState(this.data.ufuncparam0 - 1) });
                }
                break;
            case DayTaskType.WarChatBullet:
                let warID2: number = Game.sceneNetMgr.getCurWarID();
                let worldInfo2 = Game.sceneNetMgr.getChapterByWarID(warID2);
                UiManager.showDialog(EResPath.CP_INFO_VIEW, { warID: warID2, worldID: worldInfo2.nworldid, byType: worldInfo2.bttype });
                SystemTipsMgr.instance.notice("通过普通和困难关卡可在该关卡留言1次");
                break;
            case DayTaskType.Challenge:
                if (!Game.globalFunc.checkGlobalFuncState(GLOBAL_FUNC.CHALLENGE , true)) {
                    return;
                }
                UiManager.showDialog(EResPath.CHALLENGE_VIEW);
                break;
            case DayTaskType.Skin:
                let f = Game.fashionMgr.getUnActiveFashionInfo();
                UiManager.showDialog(EResPath.FASHION_VIEW , [f]);
                break;
            case DayTaskType.Equip:
                if (!Game.globalFunc.checkGlobalFuncState(GLOBAL_FUNC.COOPERATE , true)) {
                    return;
                }
                UiManager.showDialog(EResPath.COOPERATE_SHOP);
                break;
            case DayTaskType.Science:
                if (!Game.globalFunc.checkGlobalFuncState(GLOBAL_FUNC.SCIENCE , true)) {
                    return;
                }
                UiManager.showDialog(EResPath.SCIENCE_VIEW);
                break;
            case DayTaskType.GetTower:
                if (!Game.globalFunc.checkGlobalFuncState(GLOBAL_FUNC.REDPACKET , true)) {
                    return;
                }
                UiManager.showDialog(EResPath.TEN_CARDS_VIEW);
                break;
                
            default:
                SystemTipsMgr.instance.notice('该成就无法跳转到具体界面');
                break;
        }
    }
}
