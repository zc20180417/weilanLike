// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { QUALITY_OUTLINE_COLOR } from "../../common/AllEnum";
import { EResPath } from "../../common/EResPath";
import Game from "../../Game";
import { ActiveInfo } from "../../net/mgr/SysActivityMgr";
import TroopsMgr from "../../net/mgr/TroopsMgr";
import { GS_ActorRechargeConfig_QuickRechargeItem } from "../../net/proto/DMSG_Plaza_Sub_Actor";
import { GS_GoodsInfoReturn_GoodsInfo } from "../../net/proto/DMSG_Plaza_Sub_Goods";
import { ACTIVE_TYPE, ActorProp, GOODS_TYPE, SYS_ACTIVE_RERESH_MODE } from "../../net/socket/handler/MessageEnum";
// import { Handler } from "../../utils/Handler";
import { StringUtils } from "../../utils/StringUtils";
import SystemTipsMgr from "../../utils/SystemTipsMgr";
// import AlertDialog from "../../utils/ui/AlertDialog";
import ImageLoader from "../../utils/ui/ImageLoader";
import { NodeUtils } from "../../utils/ui/NodeUtils";
import { UiManager } from "../../utils/UiMgr";
import TapPageItem from "../dayInfoView/TapPageItem";
const { ccclass, property } = cc._decorator;
@ccclass
export default class DailyEquipActiveTapPage extends TapPageItem {
    @property(ImageLoader)
    towerIcon: ImageLoader = null;

    @property(cc.Label)
    towerName: cc.Label = null;

    @property(cc.LabelOutline)
    towerOutLine: cc.LabelOutline = null;

    @property(cc.Label)
    equipName: cc.Label[] = [];

    @property(ImageLoader)
    equipIcon: ImageLoader[] = [];

    @property(cc.Label)
    infoLabels: cc.Label[] = [];

    @property(cc.Label)
    originPrice: cc.Label = null;

    @property(cc.Label)
    rmbPrice: cc.Label = null;

    @property(cc.Label)
    diamond: cc.Label = null;

    @property(cc.Label)
    time: cc.Label = null;

    @property(cc.Button)
    diamondBtn: cc.Button = null;

    @property(cc.SpriteAtlas)
    equipAtlas: cc.SpriteAtlas = null;

    private _cfg: ActiveInfo = null;

    private _rechargeCfg: GS_ActorRechargeConfig_QuickRechargeItem = null;

    private aniEnd: boolean = true;
    private _cacheEquipId: number = -1;

    public refresh() {
        this._cacheEquipId = -1;
        this._cfg = Game.sysActivityMgr.getActivityInfo(ACTIVE_TYPE.DAILY_EQUIP);
        if (!this._cfg || !this._cfg.taskList[0]) return;
        this._rechargeCfg = Game.actorMgr.getChargeConifg(this._cfg.taskList[0].nparam1);
        if (!this._rechargeCfg) return;
        let goodsCfg = Game.goodsMgr.getGoodsInfo(this._rechargeCfg.ngoodsid);
        if (goodsCfg) {
            //炮塔图片
            this.towerIcon.setPicId(goodsCfg.npacketpicid);

            //描述
            this.towerName.string = goodsCfg.szgoodsname + " x" + this._rechargeCfg.ngoodsnum;

            //品质颜色
            this.towerOutLine.color = cc.color(QUALITY_OUTLINE_COLOR[goodsCfg.btquality] || QUALITY_OUTLINE_COLOR["1"]);
        }

        //装备
        let equipCfg: GS_GoodsInfoReturn_GoodsInfo;
        for (let i = 0; i < 3; i++) {
            if (this._rechargeCfg.ngivegoodsid[i]) {
                equipCfg = Game.goodsMgr.getGoodsInfo(this._rechargeCfg.ngivegoodsid[i]);
                if (equipCfg) {
                    if (equipCfg.lgoodstype == GOODS_TYPE.GOODSTYPE_CARD_TROOPSEQUIP) {
                        this._cacheEquipId = equipCfg.lparam[1];
                        let towerInfo = Game.towerMgr.getTroopBaseInfo(equipCfg.lparam[0]);
                        if (towerInfo) {
                            let index = 0;
                            let flag = false;
                            while (!flag && index < 4) {
                                index++;
                                if (towerInfo['nequipid' + index] && towerInfo['nequipid' + index] == equipCfg.lparam[1]) {
                                    flag = true;
                                }
                            }

                            if (index <= 3) {
                                let equioInfo = Game.towerMgr.getEquipItem(equipCfg.lparam[1]);
                                this.equipIcon[i].setSpriteFrame(this.equipAtlas.getSpriteFrame(this._rechargeCfg.ngoodsid + "_0" + (index)));
                                this.infoLabels[i].string = StringUtils.format(TroopsMgr.PROP_TYPE2[index - 1], equioInfo.nlv1addprop / 100);
                            } else {
                                SystemTipsMgr.instance.notice("数据出错，请联系客服");
                            }
                        }
                    } else {
                        this.equipIcon[i].setPicId(equipCfg.npacketpicid);
                        this.infoLabels[i].string = 'x ' + this._rechargeCfg.ngivegoodsnums[i];
                    }
                    this.equipName[i].string = equipCfg.szgoodsname;
                }
            }
        }

        //原价
        this.originPrice.string = "原价 " + this._rechargeCfg.noriginalrmb + " 元";

        //rmb
        this.rmbPrice.string = this._rechargeCfg.nneedrmb + "";

        //钻石
        this.diamond.string = this._rechargeCfg.nneeddiamonds + "";

        let diamond = Game.actorMgr.getProp(ActorProp.ACTOR_PROP_DIAMONDS);
        NodeUtils.enabled(this.diamondBtn, diamond > this._rechargeCfg.nneeddiamonds);
    }

    public update(dt) {
        let time = Game.sysActivityMgr.getActiveRestTime(ACTIVE_TYPE.DAILY_EQUIP);
        this.time.string = (time <= 0 ? "00:00:00" : StringUtils.doInverseTime(time)) + " 后刷新卡片商店";
    }

    public rmbBuy() {
        if (!this._cfg || !this._cfg.item) return;
        if (!this.check()) {
            return;
        }
        Game.sysActivityMgr.joinSysActivity(this._cfg.item.nid, this._cfg.taskList.length > 0 ? this._cfg.taskList[0].btindex : 0, 0);
    }

    public diamondBuy() {
        if (!this._cfg || !this._cfg.item) return;
        if (!this.check()) {
            return;
        }
        Game.sysActivityMgr.joinSysActivity(this._cfg.item.nid, this._cfg.taskList.length > 0 ? this._cfg.taskList[0].btindex : 0, 1);
    }

    public check(): boolean {
        if (this._cacheEquipId !== -1) {
            if (Game.towerMgr.getEquipData(this._cacheEquipId)) {
                SystemTipsMgr.instance.notice("您已经购买过此装备，无法再次购买");
                return false;
            }
        }
        return true;
    }

    public onTipsClick() {
        UiManager.showTopDialog(EResPath.DAILY_EQUIP_ACTIVE_TIPS_VIEW);
    }

    onFreeVideoClick() {
        if (!this.aniEnd) return;
        if (!this._cfg || !this._cfg.item) return;
        this.aniEnd = false;
        this.scheduleOnce(() => {
            this.aniEnd = true;
        }, 1);

        let mode = this._cfg.item.btfvref == 1 ? SYS_ACTIVE_RERESH_MODE.VIDEO : SYS_ACTIVE_RERESH_MODE.DIAMOND;
        Game.sysActivityMgr.refreshActive(this._cfg.item.nid, mode);
    }
}
