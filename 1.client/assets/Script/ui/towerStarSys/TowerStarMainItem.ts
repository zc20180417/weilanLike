// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { TOWER_OUTLINE_COLOR, TOWER_TXT_COLOR } from "../../common/AllEnum";
import { EResPath } from "../../common/EResPath";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { Lang, LangEnum } from "../../lang/Lang";
import { GS_TroopsInfo_TroopsInfoItem } from "../../net/proto/DMSG_Plaza_Sub_Troops";
import { GameEvent } from "../../utils/GameEvent";
import { Handler } from "../../utils/Handler";
import { StringUtils } from "../../utils/StringUtils";
import BaseItem from "../../utils/ui/BaseItem";
import { UiManager } from "../../utils/UiMgr";
import Tower3DPic from "./Tower3DPic";
import Tower3DPicLoader from "./Tower3DPicLoader";

const { ccclass, property } = cc._decorator;

export enum TowerState {
    WAIT_ACTIVE,    //待激活
    CAN_ACTIVE,     //激活
    CAN_UPGRADE,    //升星
}

@ccclass
export default class TowerStarMainItem extends BaseItem {
    static EventType = {
        ON_COMPLETE: "on_complete"
    }

    @property(cc.Node)
    tips: cc.Node = null;

    @property(Tower3DPicLoader)
    tower3DPicLoader: Tower3DPicLoader = null;

    @property(cc.SpriteFrame)
    stateIcons: cc.SpriteFrame[] = [];

    @property(cc.Sprite)
    stateIcon: cc.Sprite = null;

    @property(cc.RichText)
    stateDes: cc.RichText = null;

    private canActive: boolean = false;

    get isLoaded(): boolean {
        return !!this.tower3DPicLoader.tower3DPic;
    }

    public setData(data: any, index?: number) {
        super.setData(data, index);
    }

    onLoad() {
        // this.progressTips.string = Lang.getL(LangEnum.ACTIVE_NEED);

        GameEvent.on(EventEnum.FASHION_USE, this.onFashionUse, this);
        GameEvent.on(EventEnum.FASHION_CANCEL, this.onFashionCancel, this);
        this.tower3DPicLoader.node.on(Tower3DPicLoader.EventType.ON_COMPLETE, this._onLoadComplete, this);
    }

    onDestroy() {
        GameEvent.off(EventEnum.FASHION_USE, this.onFashionUse, this);
        GameEvent.off(EventEnum.FASHION_CANCEL, this.onFashionCancel, this);
        Handler.dispose(this);
    }

    public load() {
        if (!this.data) return;
        this.tips.active = false;
        let data = this.data as GS_TroopsInfo_TroopsInfoItem;
        this.tower3DPicLoader.url = EResPath.TOWER_3D_PIC + Game.towerMgr.get3dpicres(data.ntroopsid, data);
    }

    public refresh() {
        if (!this.data) return;
        if (Game.towerMgr.isTowerUnlock(this.data.ntroopsid)) {
            this.unlock();
        } else {
            this.lock();
        }
    }

    lock() {
        let towerCfg: GS_TroopsInfo_TroopsInfoItem = this.data;
        let currCards = Game.containerMgr.getItemCount(towerCfg.ncardgoodsid);
        let enableActive = currCards >= towerCfg.nactiveneedcardcount;

        //解锁进度
        this.tips.active = true;

        this.updateState(enableActive ? TowerState.CAN_ACTIVE : TowerState.WAIT_ACTIVE, currCards, towerCfg.nactiveneedcardcount);

        this.canActive = enableActive;

        this.tower3DPicLoader.tower3DPic.enableClick = enableActive;
        this.tower3DPicLoader.tower3DPic.setColor(enableActive ? cc.Color.WHITE : cc.Color.BLACK);
    }

    unlock() {
        this.canActive = false;

        this.tower3DPicLoader.tower3DPic.setColor(cc.Color.WHITE);
        this.tower3DPicLoader.tower3DPic.enableClick = true;

        let towerCfg: GS_TroopsInfo_TroopsInfoItem = this.data;
        let maxCards = Game.towerMgr.getPrivateGoodsNums(towerCfg.ntroopsid);
        let currCards = Game.containerMgr.getItemCount(towerCfg.ncardgoodsid);

        this.tower3DPicLoader.tower3DPic.outlineColor = cc.color().fromHEX(TOWER_OUTLINE_COLOR[towerCfg.btquality + 1]);

        let enableShowOutLine = Game.towerMgr.getFightTowerID(towerCfg.bttype) === towerCfg.ntroopsid;

        enableShowOutLine ? this.tower3DPicLoader.tower3DPic.showOutLine() : this.tower3DPicLoader.tower3DPic.hideOutLine();

        if (Game.towerMgr.isTowerCanUpStar(towerCfg.ntroopsid)) {
            this.tips.active = true;
            this.updateState(TowerState.CAN_UPGRADE, currCards, maxCards);
        } else {
            this.tips.active = false;
        }
    }

    private onFashionUse(nid: number) {
        if (!this.data) return;
        let info = Game.fashionMgr.getFashionInfo(nid);
        if (info.ntroopsid == this.data.ntroopsid) {
            this.load();
        }
    }

    private onFashionCancel(nid: number) {
        if (!this.data) return;
        let info = Game.fashionMgr.getFashionInfo(nid);
        if (info.ntroopsid == this.data.ntroopsid) {
            this.load();
        }
    }

    private _onLoadComplete(tower3DPic: Tower3DPic) {
        tower3DPic.clickHandler = Handler.create(this._onClick, this);
        this.refresh();
        this.node.emit(TowerStarMainItem.EventType.ON_COMPLETE, this);
    }

    private _onClick() {
        if (this.canActive) {
            Game.towerMgr.requestActiveNewTower(this.data.ntroopsid);
            return;
        }
        UiManager.showDialog(EResPath.TOWER_STAR_LV_UP_VIEW, { towerInfo: this.data });
    }

    private updateState(state: TowerState, curr: number, max: number) {
        switch (state) {
            case TowerState.CAN_ACTIVE:
                this.stateDes.string = Lang.getL(LangEnum.CAN_ACTIVE) + "  " + curr + "/" + max;
                break;
            case TowerState.WAIT_ACTIVE:
                this.stateDes.string = Lang.getL(LangEnum.WAIT_ACTIVE) + "  " + StringUtils.richTextColorFormat(curr.toString(), "#ff3b3b") + "/" + max;
                break;
            case TowerState.CAN_UPGRADE:
                this.stateDes.string = Lang.getL(LangEnum.CAN_UPGRADE) + "  " + curr + "/" + max;
                break;
        }

        this.stateIcon.spriteFrame = this.stateIcons[state];
    }

    public setVisiable(visiable: boolean) {
        this.node.active = visiable;
        this.tips.active = visiable;
    }
}
