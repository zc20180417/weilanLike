import { EResPath } from "../../common/EResPath";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";

import { GS_SysActivityPrivate_SysActivityData, GS_SysActivityConfig_SysActivityItem } from "../../net/proto/DMSG_Plaza_Sub_SysActivity";
import { ACTIVE_TYPE, GOODS_TYPE } from "../../net/socket/handler/MessageEnum";
import { GameEvent } from "../../utils/GameEvent";
import Dialog from "../../utils/ui/Dialog";
import ImageLoader from "../../utils/ui/ImageLoader";
import { UiManager } from "../../utils/UiMgr";
import GoodsItem, { GoodsItemData } from "../newhand_book/GoodsItem";
import { TujianData, TujianTabIndex } from "../tujian/TuJianView";

const { ccclass, property, menu } = cc._decorator;
/**
 * 每日首冲
 */
@ccclass
@menu("Game/ui/active/EveryDayRechargeView")
export class EveryDayRechargeView extends Dialog {

    @property(cc.Node)
    btnNode: cc.Node = null;

    @property(cc.Label)
    btnLabel:cc.Label = null;

    @property([cc.Toggle])
    toggles:cc.Toggle[] = [];

    @property(ImageLoader)
    towerImg:ImageLoader = null;

    @property(cc.Sprite)
    towerNameBg:cc.Sprite = null;

    @property(cc.Sprite)
    rewardBg:cc.Sprite = null;

    @property(cc.Sprite)
    bg:cc.Sprite = null;

    @property(cc.Label)
    towerNameLabel:cc.Label = null;

    @property([cc.Color])
    goodsNameColors:cc.Color[] = [];

    @property([cc.Color])
    towerNameColors:cc.Color[] = [];

    @property([cc.Color])
    towerNameOutLineColors:cc.Color[] = [];

    @property([cc.SpriteFrame])
    rewardBgSfs:cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    bgSfs:cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    towerNameSfs:cc.SpriteFrame[] = [];

    @property(GoodsItem)
    goodsItems: GoodsItem[] = [];


    private _cfgList: any[] = [];
    private _privateDataList: GS_SysActivityPrivate_SysActivityData[] = [];
    private _selectIndex:number = -1;
    private _priceList:number[] = [];
    private _goodsItems:any[] = [];
    private _towerIds:number[] = [];
    private _x0:number = 0;

    onLoad() {
        this._x0 = this.toggles[0].node.x;
    }

    protected beforeShow(): void {

        GameEvent.on(EventEnum.ACTIVE_CLOSE, this.activeClose, this);
        GameEvent.on(EventEnum.UPDATE_ACTIVE_DATA, this.updateActive, this);
        this.refresh();
    }

    private refresh() {
        this._cfgList = [];
        this._priceList = [];
        this._goodsItems = [];
        this._towerIds = [];
        this._selectIndex = -1;
        this.initCfg(ACTIVE_TYPE.EVERY_DAY_RECHARGE_6);
        this.toggles[0].node.active = !!this._cfgList[0];
        this.initCfg(ACTIVE_TYPE.EVERY_DAY_RECHARGE_30);
        this.toggles[1].node.active = !!this._cfgList[1];

        if (!this.toggles[0].node.active) {
            this.toggles[1].node.x = this._x0;
        }

        if (!this._cfgList[0] && !this._cfgList[1]) return;
        this.initPrice();
        if (this.toggles[0].node.active) {
            this.selectIndex(0);
        } else {
            this.selectIndex(1);
        }
    }

    onToggle() {
        let index = this.toggles[0].isChecked ? 0 : 1;
        this.selectIndex(index);
    }

    private onTowerClick() {
        let towerId = this._towerIds[this._selectIndex];
        if (towerId > 0) {
            let towerInfo = Game.towerMgr.getTroopBaseInfo(towerId);
            if (towerInfo) {
                let data: TujianData = {
                    tabIndex: TujianTabIndex.CAT,
                    subTabIndex: towerInfo.btquality,
                    towerId: towerId,
                    isSkin:false
                }
                UiManager.showDialog(EResPath.TUJIAN_VIEW, data);
            }
        }
    }

    private initCfg(activeType:ACTIVE_TYPE) {
        let cfg = Game.sysActivityMgr.getActivityInfo(activeType);
        let privateData = Game.sysActivityMgr.getPrivateData(activeType);

        if (!cfg || !privateData || !cfg.taskList || cfg.taskList.length == 0 || Game.sysActivityMgr.isSubTaskFinished(activeType , 0)) {
            this._cfgList.push(null);
            return;
        }

        this._cfgList.push(cfg);
        this._privateDataList.push(privateData);
    }

    private selectIndex(index:number) {
        if (this._selectIndex == index) return;
        this._selectIndex = index;
        this.toggles[index].isChecked = true;

        let towerId = this._towerIds[index];
        let bgIndex = 0;
        if (towerId > 0) {

            let towerInfo = Game.towerMgr.getTroopBaseInfo(towerId);
            if (towerInfo) {
                this.towerNameLabel.string = towerInfo.szname;
                bgIndex = towerInfo.btquality >= 3 ? 1 : 0;

                this.towerImg.url = EResPath.TOWER_IMG + towerInfo.sz3dpicres;
            }
        }

        this.bg.spriteFrame = this.bgSfs[bgIndex];
        this.rewardBg.spriteFrame = this.rewardBgSfs[bgIndex];
        this.towerNameBg.spriteFrame = this.towerNameSfs[bgIndex];

        this.btnLabel.string = this._priceList[index] + ' 元';
        let items:any[] = this._goodsItems[index];
        let len = Math.min(this.goodsItems.length , items.length);
        for (let i = 0; i < len; i++) {
            const element = this.goodsItems[i];
            element.setData(items[i]);
            element.des.node.color = this.goodsNameColors[bgIndex];
        }

        this.towerNameLabel.node.color = this.towerNameColors[bgIndex];
        this.towerNameLabel.node.getComponent(cc.LabelOutline).color = this.towerNameOutLineColors[bgIndex];
    }

    onClick() {
        let cfg = this._cfgList[this._selectIndex];
        if (cfg) {
            Game.sysActivityMgr.joinSysActivity(cfg.item.nid , 0);
        }
    }

    private activeClose(nid: number) {
        if (nid == ACTIVE_TYPE.EVERY_DAY_RECHARGE_6 || nid == ACTIVE_TYPE.EVERY_DAY_RECHARGE_30) {
            this.refresh();
            if (!this._cfgList[0] && !this._cfgList[1]) {
                this.hide();
            }
        }
    }

    private updateActive(nid: number) {
        if (nid == ACTIVE_TYPE.EVERY_DAY_RECHARGE_6 || nid == ACTIVE_TYPE.EVERY_DAY_RECHARGE_30) {
            this.refresh();
            if (!this._cfgList[0] && !this._cfgList[1]) {
                this.hide();
            }
        }
    }


    private initPrice() {
        for (let i = 0 ; i < this._cfgList.length ; i++) {
            let cfg = this._cfgList[i];
            if (cfg) {
                let taskItem = cfg.taskList[0];
                let rechargeCfg = Game.actorMgr.getChargeConifg(taskItem.nparam1);
                if (rechargeCfg) {
                    this._priceList[i] = rechargeCfg.nneedrmb;


                    let items:GoodsItemData[] = [];
                    items[0] = {
                        goodsId:rechargeCfg.ngoodsid,
                        nums:rechargeCfg.ngoodsnum,
                    }

                    let len = rechargeCfg.ngivegoodsid.length;
                    for (let j = 0 ; j < len ; j++) {
                        if (rechargeCfg.ngivegoodsid[j] > 0) {
                            items.push({
                                goodsId:rechargeCfg.ngivegoodsid[j],
                                nums:rechargeCfg.ngivegoodsnums[j],
                                prefix: "x"
                            })

                            
                        }
                    }

                    let goodsInfo = Game.goodsMgr.getGoodsInfo(rechargeCfg.ngoodsid);
                    if (goodsInfo ) {
                        if (goodsInfo.lgoodstype == GOODS_TYPE.GOODSTYPE_RES_UPGRADESTAR) {
                            this._towerIds[i] = goodsInfo.lparam[0];
                        } else if (goodsInfo.lgoodstype == GOODS_TYPE.GOODSTYPE_RES_SKIN) {
                            this._towerIds[i] = goodsInfo.lparam[0];
                        }
                    }

                    this._goodsItems[i] = items;
                }
            }
        }
    }

}