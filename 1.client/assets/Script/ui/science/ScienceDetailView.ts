// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { TowerTypeName } from "../../common/AllEnum";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { GS_StrengConfig_LevelItem, GS_StrengConfig_StrengItem, GS_StrengData_StrengData } from "../../net/proto/DMSG_Plaza_Sub_Streng";
import { GameEvent } from "../../utils/GameEvent";
import { StringUtils } from "../../utils/StringUtils";
import Dialog from "../../utils/ui/Dialog";
import ImageLoader from "../../utils/ui/ImageLoader";
import { NodeUtils } from "../../utils/ui/NodeUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ScienceDetailView extends Dialog {

    @property(ImageLoader)
    icon: ImageLoader = null;

    @property(cc.Label)
    title: cc.Label = null;

    @property(cc.Label)
    typeLable: cc.Label = null;

    @property(cc.RichText)
    currDes: cc.RichText = null;

    @property(cc.RichText)
    nextDes: cc.RichText = null;

    @property(cc.Node)
    nextTitle: cc.Node = null;

    @property(cc.Node)
    max: cc.Node = null;

    @property(cc.RichText)
    progress: cc.RichText = null;

    @property(cc.Button)
    upLvBtn: cc.Button = null;

    @property(cc.Node)
    btnNode: cc.Node = null;

    @property(cc.Label)
    countLabel: cc.Label = null;

    @property(cc.Node)
    pre_condition: cc.Node = null;

    private _data: any = null;

    @property(ImageLoader)
    hudiejieIcon: ImageLoader = null;

    setData(data: any) {
        this._data = data;
        this.refresh();
    }

    beforeShow() {
        GameEvent.on(EventEnum.ITEM_COUNT_CHANGE, this.onItemChange, this);
        GameEvent.on(EventEnum.SCIENCE_UPGRADE, this.onScienceUpgrade, this);
    }

    beforeHide() {
        GameEvent.targetOff(this);
    }

    private onScienceUpgrade() {
        this.refresh();
    }

    private onItemChange(id: number, count: number) {
        if (id == Game.strengMgr.getUpgradeGoodsid()) {
            this.refresh();
        }
    }

    private refresh() {
        if (!this._data || !this._data.data) return;
        let data: GS_StrengConfig_StrengItem = this._data.data as GS_StrengConfig_StrengItem;
        let scienceData = Game.strengMgr.getStrengData(data.nid);
        //icon
        this.icon.setPicId(data.npicid);

        if (data.ntroopsid !== 0) {
            let towerCfgs = Game.towerMgr.getTroopBaseInfo(data.ntroopsid);
            if (towerCfgs) {
                this.typeLable.string = "作用喵咪：" + Game.towerMgr.getTowerName(towerCfgs.ntroopsid, towerCfgs);
            }
        } else {
            this.typeLable.string = "作用喵咪：所有" + TowerTypeName[data.btrolecardtype - 1] + "系";
        }

        //进度
        let currLv = (scienceData ? scienceData.nlevel : 0);
        let maxLv = data.btmaxlevel;
        this.progress.string = StringUtils.richTextFormat(currLv.toString(), "#ea5718") + StringUtils.richTextFormat("/" + maxLv, "#ad5b29");

        //名称
        this.title.string = data.szname + "（" + (currLv >= maxLv ? "满" : currLv) + " 级）";

        //描述
        let isMax: boolean = currLv >= maxLv;
        this.nextDes.node.active = !isMax;
        this.nextTitle.active = !isMax;
        //<color=#a75f49>所有单体类喵星人雇佣和升级成本降低</c><color=#ea5718> 0%</color>
        let scienceLevelData: GS_StrengConfig_LevelItem = Game.strengMgr.getLevelCfg(data, currLv);
        if (scienceLevelData && scienceLevelData.btlevel >= 0) {
            let strengValueStr = Game.strengMgr.getEftValueStr(data, scienceLevelData);
            this.currDes.string = StringUtils.richTextFormat(data.szdes, "#a75f49", [strengValueStr], ["#ea5718"]);
        } else {
            this.currDes.string = StringUtils.richTextFormat(data.szdes, "#a75f49", ["0%"], ["#ea5718"]);
        }

        if (this._data.isShow) {//仅仅显示，玩家不可操作
            this.nextTitle.active = false;
            this.nextDes.node.active = false;
            this.max.active = false;
            this.btnNode.active = false;
            this.pre_condition.active = false;
            return;
        }

        let nextLevelData = Game.strengMgr.getLevelCfg(data, currLv + 1);
        if (this.nextDes.node.active) {
            if (nextLevelData && nextLevelData.btlevel >= 0) {
                let strengValueStr = Game.strengMgr.getEftValueStr(data, nextLevelData);
                this.nextDes.string = StringUtils.richTextFormat(data.szdes, "#a75f49", [strengValueStr], ["#ea5718"]);
            } else {
                this.nextDes.string = StringUtils.richTextFormat(data.szdes, "#a75f49");
            }
        }

        //材料
        this.countLabel.string = nextLevelData && (nextLevelData.nupgradegoodsnums + '');

        // if (!scienceData && this._data.index !== 0) {
        //     let cfgs = Game.strengMgr.getStrengItemList(data.btrolecardtype);
        //     if (cfgs && !Game.strengMgr.getStrengData(cfgs[this._data.index - 1].nid)) {
        //         //需要激活前置科技
        //     } else {
        //     }
        // } else {
        // }

        if (!scienceData) {
            if (Game.strengMgr.canActive(data.nid)) {
                this.pre_condition.active = false;
            } else {
                this.pre_condition.active = true;
            }
        } else {
            this.pre_condition.active = false;
        }

        //升级按钮
        this.btnNode.active = (!isMax && !this.pre_condition.active) && nextLevelData != null;
        if (this.btnNode.active) {
            let isEnough: boolean = Game.containerMgr.isEnough(Game.strengMgr.getUpgradeGoodsid(), nextLevelData.nupgradegoodsnums);
            NodeUtils.enabled(this.upLvBtn, isEnough);
        }
        //战斗力
        this.max.active = isMax;

        let goodsInfo = Game.goodsMgr.getGoodsInfo(Game.strengMgr.getUpgradeGoodsid());
        if (goodsInfo) {
            this.hudiejieIcon.setPicId(goodsInfo.npacketpicid);
        }
    }

    private upLvClick() {
        if (!this._data || !this._data.data) return;
        let scienceData: GS_StrengData_StrengData = Game.strengMgr.getStrengData(this._data.data.nid);
        if (scienceData) {
            Game.strengMgr.reqUpLevel(this._data.data.nid);
        } else {
            Game.strengMgr.reqActive(this._data.data.nid);
        }
    }
}
