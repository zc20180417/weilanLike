// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Dialog from "../../utils/ui/Dialog";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { EResPath } from "../../common/EResPath";
import TowerStarTitle from "./towerStarTitle";
import { GS_TroopsInfo_TroopsInfoItem } from "../../net/proto/DMSG_Plaza_Sub_Troops";
import { BuryingPointMgr, EBuryingPoint } from "../../buryingPoint/BuryingPointMgr";
import { Handler } from "../../utils/Handler";
import ScrollPage from "../../ScrollPage";
import MultiPageView from "../../customComponent/MultiPageView";
import TowerStarMainItem from "./TowerStarMainItem";
import { UiManager } from "../../utils/UiMgr";
import { TujianData, TujianTabIndex } from "../tujian/TuJianView";
import BgScrollAni from "./bgScrollAni";
import GroupImage from "../../utils/ui/GroupImage";
import { GLOBAL_FUNC } from "../../common/AllEnum";
import { Lang, LangEnum } from "../../lang/Lang";
import { GameEvent, Reply } from "../../utils/GameEvent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TowerStarMainView extends Dialog {
    @property(TowerStarTitle)
    towerStarTitle: TowerStarTitle = null;

    @property(cc.Label)
    typeTips: cc.Label = null;

    @property(ScrollPage)
    scrollPage: ScrollPage = null;

    @property(MultiPageView)
    multiPageView: MultiPageView = null;

    @property(TowerStarMainItem)
    towerStarMainItems: TowerStarMainItem[] = [];

    @property(BgScrollAni)
    bgAni: BgScrollAni = null;

    @property(GroupImage)
    starNum: GroupImage = null;

    @property(cc.Label)
    starTips: cc.Label = null;

    @property(cc.Node)
    tujianNode: cc.Node = null;

    @property(cc.Node)
    scienceNode: cc.Node = null;

    @property(cc.Label)
    clickTips: cc.Label = null;

    @property(cc.Node)
    leftRedpoint: cc.Node = null;

    @property(cc.Node)
    rightRedpoint: (cc.Node) = null;

    @property(cc.Widget)
    leftWid:cc.Widget = null;

    @property(cc.Widget)
    rightWid:cc.Widget = null;

    _currPageIndex: number = 0;

    _firstShow: boolean = true;

    _data: GS_TroopsInfo_TroopsInfoItem[][] = null;

    _sortedData: GS_TroopsInfo_TroopsInfoItem[] = [];

    private _isShowEnd: boolean = false;
    private _waitGuide: boolean = false;
    private _redpoints: number[] = [];

    public setData(data: any) {
        this._currPageIndex = 0;
        if (data != undefined && data != null) {
            this._currPageIndex = data;
        }
    }

    start(): void {
        this._data = Game.towerMgr.getTowerStarPageData();
        this.scrollPage.scrollLeftHandler = Handler.create(this.multiPageView.clickNext, this.multiPageView);
        this.scrollPage.scrollRightHandler = Handler.create(this.multiPageView.clickPre, this.multiPageView);

        this.updateRedpointCount();

        this.multiPageView.setData(this._data);
        this.multiPageView.setRefreshHandler(Handler.create(this.onRefreshPage, this));
        this.multiPageView.setMusicPath(EResPath.PAGE_SOUND);
        //默认选中当前段位
        this.multiPageView.selectPage(this._currPageIndex);
        GameEvent.emit(EventEnum.AFTER_SHOW_DIALOG, this.dialogName);

        this.tujianNode.active = Game.globalFunc.isFuncOpened(GLOBAL_FUNC.TUJIAN);
        this.scienceNode.active = Game.globalFunc.isFuncOpened(GLOBAL_FUNC.SCIENCE);
    }

    /**
     * 显示动画播放结束
     */
    protected onShowAniEnd() {
        this.afterShow();
    }

    protected beforeShow() {
        if (cc.winSize.width / cc.winSize.height > 1.79) {
            this.leftWid.left = 40;
            this.rightWid.right = 40;
        }

        BuryingPointMgr.post(EBuryingPoint.SHOW_TOWER_VIEW);
        this.clickTips.string = Lang.getL(LangEnum.TOWER_STAR_CLICK_TIPS);
    }

    protected addEvent() {
        GameEvent.on(EventEnum.ACTIVATE_TOWER, this.onActivateTower, this);
        GameEvent.on(EventEnum.UNLOCK_NEW_TOWER, this.onUnlockNewTower, this);
        GameEvent.on(EventEnum.UP_STAR_SUCC, this.onUpStar, this);
        GameEvent.onReturn("get_tower_item", this.getTowerItemNode, this);
    }

    /**
     * 解锁新炮塔
     * @param towerId 
     */
    private onUnlockNewTower(towerId: number) {
        this.refreshItems();
        this.updateRedpointCount();
    }

    private onActivateTower() {
        this.multiPageView.refreshCurrPage();
    }

    private onUpStar() {
        this.refreshItems();
        this.updateRedpointCount();
        this.updateRedpointVisiable();
        this.updateStar();
    }

    private refreshItems() {
        for (let v of this.towerStarMainItems) {
            if (v.node.active) {
                v.refresh();
            }
        }
    }

    onRefreshPage(index: number, datas: GS_TroopsInfo_TroopsInfoItem[]) {
        // GlobalVal.treatrueArrowAniTime = Date.now();
        this.towerStarTitle.setIndex(index);
        this._sortedData = this.sortTower(datas);
        let offset = Math.max(0, this.towerStarMainItems.length - this._sortedData.length);

        for (let i = 0; i < offset; i++) {
            this.towerStarMainItems[i].setVisiable(false);
        }
        let itemIndex = 0;
        for (let i = 0, len = this._sortedData.length; i < len; i++) {
            itemIndex = i + offset;
            if (this.towerStarMainItems[itemIndex]) {
                this.towerStarMainItems[itemIndex].setVisiable(true);
                this.towerStarMainItems[itemIndex].setData(this._sortedData[i]);
                this.towerStarMainItems[itemIndex].load();
            }
        }
        this._currPageIndex = index;

        //刷新背景
        if (this._sortedData.length) {
            this.bgAni.refreshBg(this._sortedData[this._sortedData.length - 1].btquality + 1, true);
        }

        let towerTypeDesCfg = Game.towerMgr.getTowerTypeDesCfg(index + 1);
        if (towerTypeDesCfg) {
            this.typeTips.string = towerTypeDesCfg["des"];
            this.starTips.string = towerTypeDesCfg["name"] + Lang.getL(LangEnum.TOTAL_STAR);
        }

        this.updateStar();

        this.updateRedpointVisiable();
    }

    onDestroy() {
        super.onDestroy();
        GameEvent.targetOff(this);
        Handler.dispose(this);
    }

    protected afterShow() {
        this._isShowEnd = true;

        if (this._waitGuide) {
            // this.getTowerItemNode();
            let node = this.getTowerItemNode(null);
            node && GameEvent.emit(EventEnum.SET_GUIDE_NODE, node);
        }
    }

    private getTowerItemNode(reply:Reply): any {
        if (!this._isShowEnd) {
            this._waitGuide = true;
            if (reply) {
                return reply(null);
            }
            return null;
        }
        let id = Game.systemGuideCtrl.curItem.param;
        let item = this.getTowerMainItem(id);

        if (!item.isLoaded) {
            item.node.on(TowerStarMainItem.EventType.ON_COMPLETE, () => {
                GameEvent.emit(EventEnum.SET_GUIDE_NODE, item.node);
            }, this);
            if (reply) {
                return reply(null);
            }
            return null;
        }

        this._waitGuide = false;
        if (reply) {
            return reply(item.node);
        }
        return item.node;
    }

    private sortTower(towers: GS_TroopsInfo_TroopsInfoItem[]) {
        let result = Array.from(towers);
        let fightTowerId = Game.towerMgr.getFightTowerID(towers[0].bttype);
        //出战猫咪排在最后面，其他按品质排序
        result.sort((a, b) => {
            if (a.ntroopsid === fightTowerId) return 1;
            if (b.ntroopsid === fightTowerId) return -1;
            return a.btquality - b.btquality;
        });
        return result;
    }

    private onClickScience() {
        UiManager.showDialog(EResPath.SCIENCE_TYPE_VIEW, this._currPageIndex + 1);
    }

    private onClickBook() {
        let data: TujianData = {
            tabIndex: TujianTabIndex.CAT
        }
        UiManager.showDialog(EResPath.TUJIAN_VIEW, data);
    }

    private getTowerMainItem(towerId: number): TowerStarMainItem {
        let info = Game.towerMgr.getTroopBaseInfo(towerId);
        if (this._currPageIndex != info.bttype - 1) {
            this.multiPageView.selectPage(info.bttype - 1);
        }

        let dataList: GS_TroopsInfo_TroopsInfoItem[] = this._sortedData;
        let len = dataList.length;
        let i = 0;
        for (i; i < len; i++) {
            if (dataList[i].ntroopsid == towerId) {
                break;
            }
        }
        let offset = Math.max(0, this.towerStarMainItems.length - this._sortedData.length);
        return this.towerStarMainItems[i + offset];
    }

    private updateRedpointCount() {
        let datas = Game.towerMgr.getTowerStarPageData();
        for (let i = 0, len = datas.length; i < len; i++) {
            this._redpoints[i] = 0;
            for (let j = 0, len = datas[i].length; j < len; j++) {
                let id = datas[i][j].ntroopsid;
                if ((Game.towerMgr.isTowerUnlock(id) && Game.towerMgr.isTowerCanUpStar(id)) ||
                    Game.towerMgr.enableUnlock(id)) {
                    this._redpoints[i] += 1;
                }
            }
        }
    }

    private updateRedpointVisiable() {
        let hasredpoint = false;
        for (let i = 0; i < this._currPageIndex; i++) {
            if (this._redpoints[i]) {
                hasredpoint = true;
            }
        }
        this.leftRedpoint.active = hasredpoint;
        hasredpoint = false;
        for (let i = this._currPageIndex + 1; i < this._data.length; i++) {
            if (this._redpoints[i]) {
                hasredpoint = true;
            }
        }
        this.rightRedpoint.active = hasredpoint;
    }

    private updateStar() {
        this.starNum.contentStr = Game.towerMgr.getTypeAllStar(this._currPageIndex + 1).toString();
    }
}
