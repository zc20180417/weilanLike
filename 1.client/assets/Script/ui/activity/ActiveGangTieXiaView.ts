// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EResPath } from "../../common/EResPath";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { GS_ActorRechargeConfig_QuickRechargeItem } from "../../net/proto/DMSG_Plaza_Sub_Actor";
import { GS_SysActivityConfig_SysActivityItem, GS_SysActivityPrivate_SysActivityData } from "../../net/proto/DMSG_Plaza_Sub_SysActivity";
import { ACTIVE_TYPE, ActorProp } from "../../net/socket/handler/MessageEnum";
import { GameEvent } from "../../utils/GameEvent";
import Dialog from "../../utils/ui/Dialog";
import ImageLoader from "../../utils/ui/ImageLoader";
import { UiManager } from "../../utils/UiMgr";
import { TujianData, TujianTabIndex } from "../tujian/TuJianView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ActiveGangTieXiaView extends Dialog {
    @property(cc.Node)
    buyNode: cc.Node = null;

    @property(cc.Node)
    tiyan: cc.Node = null;

    @property(cc.Label)
    pirceLabel:cc.Label = null;

    @property(ImageLoader)
    pirceIco:ImageLoader = null;

    private _cfg: any = null;
    private _privateData: GS_SysActivityPrivate_SysActivityData = null;

    beforeShow() {
        GameEvent.on(EventEnum.ACTIVE_CLOSE, this.activeClose, this);

        this._cfg = Game.sysActivityMgr.getActivityInfo(ACTIVE_TYPE.GANGTIEXIA);
        this._privateData = Game.sysActivityMgr.getPrivateData(ACTIVE_TYPE.GANGTIEXIA);
        let taskList = this._cfg.taskList;
        if (!taskList || !this._cfg || !this._privateData) {
            this.tiyan.active = false;
            this.buyNode.active = false;
            return;
        }

        //快充配置
        let chargeCfg:GS_ActorRechargeConfig_QuickRechargeItem = Game.actorMgr.getChargeConifg( this._cfg.taskList[0].nparam1);
        this.pirceLabel.string = chargeCfg.btbuytype == 1 ?  chargeCfg.nneedgoodsnum.toString() : chargeCfg.nneedrmb.toString();
        if (chargeCfg.btbuytype == 1) {
            const goodsInfo = Game.goodsMgr.getGoodsInfo(chargeCfg.nneedgoodsid);
            if (goodsInfo) {
                this.pirceIco.setPicId(goodsInfo.npacketpicid);
            }
            const count = Game.containerMgr.getItemCount(chargeCfg.nneedgoodsid);
            this.pirceLabel.node.color = count >= chargeCfg.nneedgoodsnum ? cc.Color.BLACK.fromHEX('#7F341B') : cc.Color.RED;
        }

    }

    afterHide() {
        GameEvent.targetOff(this);
    }

    private activeClose(nid: number) {
        let item: GS_SysActivityConfig_SysActivityItem = this._cfg.item as GS_SysActivityConfig_SysActivityItem;
        if (!item || item.nid !== nid) return;
        this.buyNode.active = false;
        this.tiyan.active = false;
    }

    private buy() {
        if (!this._cfg || !this._cfg.taskList) return;
        Game.sysActivityMgr.joinSysActivity(ACTIVE_TYPE.GANGTIEXIA, 0);
    }

    private gotoCheckPoint() {
        let item: GS_SysActivityConfig_SysActivityItem = this._cfg.item as GS_SysActivityConfig_SysActivityItem;
        Game.sceneNetMgr.reqEnterExperienceWar(item.njumpwarid);
    }

    onClick() {
        let towerInfo = Game.towerMgr.getTroopBaseInfo(802);
        if (towerInfo) {
            let data: TujianData = {
                tabIndex: TujianTabIndex.CAT,
                subTabIndex: towerInfo.btquality,
                towerId: 802,
            }
            UiManager.showDialog(EResPath.TUJIAN_VIEW, data);
        }
    }
}
