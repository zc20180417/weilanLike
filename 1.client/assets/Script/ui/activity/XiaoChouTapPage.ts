// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { BuryingPointMgr, EBuryingPoint } from "../../buryingPoint/BuryingPointMgr";
import { EResPath } from "../../common/EResPath";
import Game from "../../Game";
import { ActiveInfo } from "../../net/mgr/SysActivityMgr";
import { GS_ActorRechargeConfig_QuickRechargeItem } from "../../net/proto/DMSG_Plaza_Sub_Actor";
import { GS_SysActivityNew_SysActivityNewTaskItem } from "../../net/proto/DMSG_Plaza_Sub_SysActivity";
import { ACTIVE_TYPE, SYSTEM_ACTIVE_TYPE } from "../../net/socket/handler/MessageEnum";
import { Handler } from "../../utils/Handler";
import { StringUtils } from "../../utils/StringUtils";
import SystemTipsMgr from "../../utils/SystemTipsMgr";
import GroupImage from "../../utils/ui/GroupImage";
import ImageLoader from "../../utils/ui/ImageLoader";
import { UiManager } from "../../utils/UiMgr";
import TapPageItem from "../dayInfoView/TapPageItem";
import { TujianData, TujianTabIndex } from "../tujian/TuJianView";
import SkinLoader, { SKIN_ANI_TYPE } from "./SkinLoader";

const { ccclass, property } = cc._decorator;

const SKIN_BG_DIR = "textures/ui/active/skin/";

@ccclass
export default class XiaoChouTapPage extends TapPageItem {
    @property(GroupImage)
    originCoast: GroupImage = null;

    @property(cc.Label)
    coast: cc.Label = null;

    @property(cc.RichText)
    time: cc.RichText = null;

    // @property(cc.Sprite)
    // skinName: cc.Sprite = null;

    @property(ImageLoader)
    skinName: ImageLoader = null;

    @property(ImageLoader)
    skinBg: ImageLoader = null;

    @property(SkinLoader)
    skin: SkinLoader = null;

    @property(cc.SpriteAtlas)
    gameUi: cc.SpriteAtlas = null;

    @property(cc.SpriteAtlas)
    activeUi: cc.SpriteAtlas = null;

    @property(cc.Sprite)
    headIcon: cc.Sprite = null;

    @property(cc.Node)
    btnNode: cc.Node = null;

    private _cfg: ActiveInfo = null;
    private _bgPath: string = null;
    private _rechargeCfg: GS_ActorRechargeConfig_QuickRechargeItem = null;
    onDestroy() {
        //Game.resMgr.removeLoad(this._bgPath, Handler.create(this.onBgLoaded, this));
        Handler.dispose(this);
    }

    refresh() {
        BuryingPointMgr.post(EBuryingPoint.SHARE_XIAO_CHOU_ACTIVITY_VIEW);
        this._cfg = Game.sysActivityMgr.getActivityInfo(ACTIVE_TYPE.DISCOUNT_SKIN);
        this.btnNode.active = false;
        if (!this._cfg) return;
        if (this._cfg.item.bttype == SYSTEM_ACTIVE_TYPE.BUY && this._cfg.taskList[0]) {
            this._rechargeCfg = Game.actorMgr.getChargeConifg(this._cfg.taskList[0].nparam1);
            if (!this._rechargeCfg || !this._rechargeCfg.sztitle) return;
            this.btnNode.active = true;
            //名称
            let fastionInfo = Game.fashionMgr.getTowerFashionInfos(this.getTowerId(this._rechargeCfg.sztitle));
            // this.skinName.spriteFrame = this.activeUi.getSpriteFrame(this._rechargeCfg.sztitle + "_name");
            fastionInfo && this.skinName.setPicId(fastionInfo[0].nuinameshowpicid);
            //头像
            this.headIcon.spriteFrame = this.gameUi.getSpriteFrame(this._rechargeCfg.sztitle);

            let bgStr = this._rechargeCfg.sztitle;
            if (this._rechargeCfg.sztitle == 'skin_7_1_1') {
                bgStr = 'skin_6_1_1';
            }

            this.skinBg.url = SKIN_BG_DIR + bgStr + "_bg";


            //骨骼动画
            this.skin.setSkinPath(this._rechargeCfg.sztitle, SKIN_ANI_TYPE.SHOW);

            //原价
            this.originCoast.contentStr = this._rechargeCfg.noriginalrmb.toString();

            //现价
            this.coast.string = this._rechargeCfg.nneedrmb.toString();
        }
    }

    private buyClick() {
        if (!this._cfg || !this._cfg.item || !this._cfg.taskList) return;
        if (!this._rechargeCfg || !this._rechargeCfg.sztitle) return;
        let towerId = this.getTowerId(this._rechargeCfg.sztitle);
        let infos = Game.fashionMgr.getTowerFashionInfos(towerId);
        if (!Game.towerMgr.isTowerUnlock(towerId)) {
            return SystemTipsMgr.instance.notice("需要先激活猫咪才能购买");
        } else if (!infos || Game.fashionMgr.getFashionData(infos[0].nid)) {
            return SystemTipsMgr.instance.notice("您已经购买过此皮肤，无需再次购买");
        }
        let taskList: GS_SysActivityNew_SysActivityNewTaskItem = this._cfg.taskList[0];
        Game.sysActivityMgr.joinSysActivity(ACTIVE_TYPE.DISCOUNT_SKIN, taskList ? taskList.btindex : 0);
    }

    update(dt) {
        let time = Game.sysActivityMgr.getActiveRestTime(ACTIVE_TYPE.DISCOUNT_SKIN);
        this.time.string = StringUtils.richTextColorFormat("剩余时间：  " + (time <= 0 ? "00:00:00" : StringUtils.doInverseTime(time)), "#ff0000");
    }

    private getTowerId(skinName: string) {
        let arr = skinName.split("_");//skin_1_1_1
        return parseInt(arr[1] + "0" + arr[2]);
    }

    private onSkinClick() {
        if (!this._cfg || !this._cfg.item || !this._cfg.taskList) return;
        if (!this._rechargeCfg || !this._rechargeCfg.sztitle) return;
        let towerId = this.getTowerId(this._rechargeCfg.sztitle);
        let towerInfo = Game.towerMgr.getTroopBaseInfo(towerId);
        if (towerInfo) {
            let data: TujianData = {
                tabIndex: TujianTabIndex.CAT,
                subTabIndex: towerInfo.btquality,
                towerId: towerId,
                isSkin: true,
            }
            UiManager.showDialog(EResPath.TUJIAN_VIEW, data);
        }
    }
}
