import { TowerTypeName } from "../../common/AllEnum";
import { EResPath } from "../../common/EResPath";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { GS_StrengConfig_LevelItem, GS_StrengConfig_StrengItem, GS_StrengData_StrengData } from "../../net/proto/DMSG_Plaza_Sub_Streng";
import { GameEvent, Reply } from "../../utils/GameEvent";
import { Handler } from "../../utils/Handler";
import { StringUtils } from "../../utils/StringUtils";
import SystemTipsMgr from "../../utils/SystemTipsMgr";
import AlertDialog from "../../utils/ui/AlertDialog";
import Dialog from "../../utils/ui/Dialog";
import GroupImage from "../../utils/ui/GroupImage";
import ImageLoader from "../../utils/ui/ImageLoader";
import { UiManager } from "../../utils/UiMgr";
import { RichTextTipsData, getRichtextTips, RichTextTipsType } from "../tips/RichTextTipsView";
import { ScienceItem2 } from "./ScienceItem2";


const { ccclass, menu, property } = cc._decorator;

@ccclass
@menu("Game/ui/science/ScienceTypeView")
export class ScienceTypeView extends Dialog {

    @property([ScienceItem2])
    items: ScienceItem2[] = [];

    @property([cc.Sprite])
    lines:cc.Sprite[] = [];

    @property(cc.SpriteFrame)
    lockSf:cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    activeSf:cc.SpriteFrame = null;

    //
    @property(ImageLoader)
    icon: ImageLoader = null;

    @property(cc.Label)
    title: cc.Label = null;

    @property(cc.Label)
    typeLable: cc.Label = null;

    @property(cc.RichText)
    currDes: cc.RichText = null;

    @property(cc.RichText)
    lvProgress:cc.RichText = null;

    @property(cc.Label)
    lvLabel:cc.Label = null;

    //

    @property(ImageLoader)
    costIco:ImageLoader = null;

    @property(GroupImage)
    curGoodsCountLabel:GroupImage = null;

    @property(cc.Node)
    lockNode:cc.Node = null;

    @property(cc.Node)
    fullLvNode:cc.Node = null;

    @property(cc.Node)
    upgradeNode:cc.Node = null;

    //未解锁
    @property(cc.Label)
    lockTipLabel:cc.Label = null;
    @property(cc.RichText)
    starProgressLabel:cc.RichText = null;
    @property(cc.Node)
    lockStarNode:cc.Node = null;
    //满级

    //upgrade
    @property(ImageLoader)
    upgradeIco:ImageLoader = null;

    @property(cc.Label)
    curProValue:cc.Label = null;

    @property(cc.Label)
    nextProValue:cc.Label = null;

    @property(cc.Label)
    costValueLabel:cc.Label = null;

    @property(cc.Sprite)
    typeIco:cc.Sprite = null;

    @property(cc.Sprite)
    typeName:cc.Sprite = null;

    @property(cc.SpriteAtlas)
    atlas:cc.SpriteAtlas = null;

    @property(cc.Color)
    labelColor:cc.Color = null;
    
    private _type:number = -1;
    private _dataList:GS_StrengConfig_StrengItem[] = null;
    private _curSelectItem:GS_StrengConfig_StrengItem;
    private _curNextLevelItem:GS_StrengConfig_LevelItem;
    setData(data: any) {
        this._type = data;
        this._dataList = Game.strengMgr.getStrengItemList(this._type);
    }

    beforeShow() {
        GameEvent.on(EventEnum.ITEM_COUNT_CHANGE, this.onItemChange, this);
        GameEvent.on(EventEnum.SCIENCE_UPGRADE, this.onScienceUpgrade, this);
        GameEvent.on(EventEnum.SCIENCE_SELECT_ITEM, this.onSelectItem, this);
        GameEvent.on(EventEnum.SCIENCE_RESET, this.onScienceReset, this);
        GameEvent.onReturn('get_science_item', this.onGetScienceItem, this);
        let goodsInfo = Game.goodsMgr.getGoodsInfo(Game.strengMgr.getUpgradeGoodsid());
        if (goodsInfo) {
            this.costIco.setPicId(goodsInfo.npacketpicid);
        }

        this.curGoodsCountLabel.contentStr = Game.containerMgr.getItemCount(Game.strengMgr.getUpgradeGoodsid()) + "";
        this.typeIco.spriteFrame = this.atlas.getSpriteFrame('tower_type_' + this._type);
        this.typeName.spriteFrame = this.atlas.getSpriteFrame('type_' + this._type);


        this.refresh();
        this.selectDefault();
    }

    private selectDefault() {
        if (!this._dataList) return;
        let scienceDatas = this._dataList;
        let tempData:GS_StrengConfig_StrengItem;
        for (let i = this.items.length - 1; i >= 0; i--) {
            tempData = scienceDatas[i];
            if (tempData && Game.strengMgr.getStrengData(tempData.nid)) {
                this.onSelectItem(tempData);
                return;
            } 
        }

        if (tempData) {
            this.onSelectItem(tempData);
        }
    }


    onUpgradeClick() {
        if (!this._curSelectItem) return;
        let scienceData: GS_StrengData_StrengData = Game.strengMgr.getStrengData(this._curSelectItem.nid);
        if (scienceData) {
            Game.strengMgr.reqUpLevel(this._curSelectItem.nid);
        } else {
            Game.strengMgr.reqActive(this._curSelectItem.nid);
        }
    }


    onResetClick() {
        AlertDialog.showAlert(`重置需要消耗 ${Game.strengMgr.getResetCost()} 钻石，是否确认要重置？`, new Handler(this.onSelectReset, this));
    }


    private onSelectReset() {
        if (Game.actorMgr.getDiamonds() < Game.strengMgr.getResetCost()) {
            SystemTipsMgr.instance.notice("钻石不足");
            return;
        }
        Game.strengMgr.reqReset(this._type);
    }

    onBackClick() {
        this.hide();
    }


    private refresh() {
        this.refreshAllItems();
    }

    private onScienceUpgrade(id:number , level:number, rolecardtype:number) {
        if (rolecardtype == this._type) {
            this.refresh();
        }

        if (this._curSelectItem && this._curSelectItem.nid == id) {
            this.onSelectItem(this._curSelectItem);
        }
    }

    private onItemChange(id: number, count: number) {
        if (id == Game.strengMgr.getUpgradeGoodsid()) {
            this.curGoodsCountLabel.contentStr = count + '';

            if (this._curNextLevelItem) {
                this.costValueLabel.node.color = this._curNextLevelItem.nupgradegoodsnums > Game.containerMgr.getItemCount(Game.strengMgr.getUpgradeGoodsid()) ? cc.Color.RED : this.labelColor;
            }
        }
    }

    private refreshAllItems() {
        if (!this._dataList) return;
        let scienceDatas = this._dataList;
        for (let i = 0, len = this.items.length; i < len; i++) {
            //前一个科技激活，后一个科技才能激活
            if (scienceDatas[i]) {
                this.items[i].setData(scienceDatas[i], i);
            } else {
                this.items[i].node.active = false;
                this.lines[i - 1].node.active = false;
            }
        }
    }

    private onScienceReset(type:number) {
        if (type == this._type) {
            this.refresh();

            if (this._curSelectItem) {
                this.onSelectItem(this._curSelectItem);
            }
        }
    }

    private onSelectItem(item:GS_StrengConfig_StrengItem) {
        this._curSelectItem = item;
        this.icon.setPicId(item.npicid);
        this.title.string = item.szname;
        let scienceData = Game.strengMgr.getStrengData(item.nid);
        let currLv = (scienceData ? scienceData.nlevel : 0);
        let maxLv = item.btmaxlevel;
        this.lvLabel.string = "Lv." + currLv;
        this.lvProgress.string = StringUtils.fontColor(currLv + '' , "#ea5718") + "/" + maxLv;
        this.typeLable.string = Game.strengMgr.getTypeStr(item.bttype);
        this.currDes.string = item.szdes;
        let scienceLevelData: GS_StrengConfig_LevelItem;
        this._curNextLevelItem = null;
        if (currLv > 0) {
            scienceLevelData = Game.strengMgr.getLevelCfg(item, currLv);
        }

        if (scienceLevelData && scienceLevelData.btlevel >= 0) {
            let strengValueStr = Game.strengMgr.getEftValueStr(item, scienceLevelData);
            this.currDes.string = StringUtils.richTextFormat(item.szdes, "#a75f49", [strengValueStr], ["#ea5718"]);
        } else {
            this.currDes.string = StringUtils.richTextFormat(item.szdes, "#a75f49", ["0" + Game.strengMgr.getEftSuffixString(item.bttype)], ["#ea5718"]);
        }

        if (currLv >= maxLv) {
            this.lockNode.active = this.upgradeNode.active =  false;
            this.fullLvNode.active = true;
            
            // this.proValueLabel.string = Game.strengMgr.getEftValueStr(item , scienceLevelData);
        } else if (!Game.strengMgr.canActive(item.nid)) {
            this.fullLvNode.active = this.upgradeNode.active =  false;
            this.lockNode.active = true;

            let activeStarCount = Game.strengMgr.getActiveStarCountById(item.nid);
            let curStarCount = Game.towerMgr.getTypeAllStar(item.btrolecardtype);
            let flag = curStarCount < activeStarCount;
            this.lockStarNode.active = this.starProgressLabel.node.active = flag;
            if (flag) {
                this.lockTipLabel.string = `解锁需要${TowerTypeName[item.btrolecardtype - 1]}系猫咪总星数`;
                this.starProgressLabel.string = StringUtils.fontColor(curStarCount + '' , "#ea5718") + "/" + activeStarCount;
            } else {
                this.lockTipLabel.string = "前置科技尚未激活";
            }
        } else {
            this.fullLvNode.active = this.lockNode.active =  false;
            this.upgradeNode.active = true;
            this.curProValue.string = scienceLevelData ? Game.strengMgr.getEftValueStr(item , scienceLevelData) : 0 + Game.strengMgr.getEftSuffixString(item.bttype);

            let nextLevelData = Game.strengMgr.getLevelCfg(item, currLv + 1);
            this.nextProValue.string = Game.strengMgr.getEftValueStr(item , nextLevelData);
            let goodsInfo = Game.goodsMgr.getGoodsInfo(Game.strengMgr.getUpgradeGoodsid());
            if (goodsInfo) {
                this.upgradeIco.setPicId(goodsInfo.npacketpicid);
            }
            this._curNextLevelItem = nextLevelData;
            let costValue = nextLevelData ? nextLevelData.nupgradegoodsnums : 0;
            this.costValueLabel.string = costValue + '';
            
            this.costValueLabel.node.color = costValue > Game.containerMgr.getItemCount(Game.strengMgr.getUpgradeGoodsid()) ? cc.Color.RED : this.labelColor;

        }
    }

    private onGetScienceItem(reply:Reply , tag: string): cc.Node {
        if (!this._dataList || this._dataList.length == 0) {
            return reply(this.items[0].node);
        }
        let id = Number(tag);
        let len = this._dataList.length;
        let item: GS_StrengConfig_StrengItem;
        for (let i = 0 ; i < len ; i++) {
            item = this._dataList[i];
            if (item.nid == id) {
                return reply(this.items[i].node);
            }
        }

        return reply(this.items[0].node);
    }


    protected afterHide() {
        GameEvent.emit(EventEnum.SCIENCE_VIWE_EXIT);
        GameEvent.targetOff(this);
    }

    onAddSlug() {
        let data: RichTextTipsData = {
            title: "获得铃铛",
            des: getRichtextTips(RichTextTipsType.LING_DANG)
        }

        UiManager.showDialog(EResPath.RICHTEXT_TIPS_VIEW, data);
    }

    onDestroy() {
        super.onDestroy();
    }
}