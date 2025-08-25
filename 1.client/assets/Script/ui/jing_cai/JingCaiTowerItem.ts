// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { QUALITY_COLOR } from "../../common/AllEnum";
import Game from "../../Game";
import { Handler } from "../../utils/Handler";
import SystemTipsMgr from "../../utils/SystemTipsMgr";
import BaseItem from "../../utils/ui/BaseItem";
import { NodeUtils } from "../../utils/ui/NodeUtils";

const { ccclass, property } = cc._decorator;

export enum ICON_TYPE {
    TYPE,
    TOWER,
    COAST
}

export interface TypeData {
    towerid: number;
    gridId: number;
    power: number;
}

export interface TowerData {
    towerid: number;
    power: number;
}

@ccclass
export default class JingCaiTowerItem extends BaseItem {
    @property(cc.Node)
    upNodes: cc.Node[] = [];

    @property(cc.Node)
    downNodes: cc.Node[] = [];

    @property(cc.Sprite)
    typeicon: cc.Sprite = null;

    @property(cc.Sprite)
    towericon: cc.Sprite = null;

    @property(cc.SpriteAtlas)
    gameUi: cc.SpriteAtlas = null;

    @property(cc.Label)
    starLab: cc.Label = null;

    @property(cc.Button)
    btn: cc.Button = null;

    @property(cc.Node)
    towerGroup: cc.Node = null;

    @property(cc.Node)
    typeGroup: cc.Node = null;

    @property(cc.Node)
    coastGroup: cc.Node = null;

    @property(cc.Label)
    coast: cc.Label = null;

    @property(cc.Node)
    selectedBg: cc.Node = null;

    private _clickHandler: Handler = null;
    // private _isUnlock: boolean = true;
    private _iconType: ICON_TYPE = ICON_TYPE.TOWER;
    public setClickHandler(handler: Handler) {
        this._clickHandler = handler;
    }

    public onClick() {
        if (this._clickHandler) this._clickHandler.executeWith(this);
    }

    public refresh() {
        switch (this._iconType) {
            case ICON_TYPE.TOWER:
                this.towerRefresh();
                break;
            case ICON_TYPE.TYPE:
                this.typeRefresh();
                break;
            case ICON_TYPE.COAST:
                this.coastRefresh();
                break;
        }
    }

    private typeRefresh() {
        if (!this.data) return;
        let data = this.data as TypeData;

        this.coastGroup.active = false;
        this.typeGroup.active = true;
        this.towerGroup.active = false;
        this.typeicon.spriteFrame = this.gameUi.getSpriteFrame("type_" + (this.index + 1));
        this.setGray(!data.gridId);
        this.setDownLv(0);
        this.setUpLv(0);
    }

    private towerRefresh() {
        if (!this.data) return;
        this.coastGroup.active = false;
        this.typeGroup.active = false;
        this.towerGroup.active = true;
        // this.starLab.node.active = true;

        let isUnlock = Game.towerMgr.isTowerUnlock(this.data.towerid);
        this.towericon.spriteFrame = this.gameUi.getSpriteFrame(this.data.towerid);
        this.setGray(!isUnlock);
        this.enableClick(isUnlock);

        let battleValue = Game.towerMgr.getPower(this.data.towerid, Game.towerMgr.getStar(this.data.towerid));
        let lv = Game.sceneNetMgr.calcTowerBattleLevel(battleValue, this.data.power);
        this.setDownLv(lv > 3 ? 0 : lv);
        this.setUpLv(0);

        this.starLab.string = isUnlock ? Game.towerMgr.getStar(this.data.towerid) + '' : "0";

        if (this.selectedBg) {
            this.selectedBg.color = cc.Color.BLACK.fromHEX(QUALITY_COLOR[(this.index + 1)] || QUALITY_COLOR["1"]);
        }
    }

    private coastRefresh() {
        if (!this.data) return;
        let data = this.data as TowerData;
        this.typeGroup.active = false;
        this.towerGroup.active = true;
        this.coastGroup.active = true;
        // this.starLab && (this.starLab.node.active = false);

        this.towericon.spriteFrame = this.gameUi.getSpriteFrame(data.towerid.toString());
        let battleValue = Game.towerMgr.getPower(data.towerid, Game.towerMgr.getStar(data.towerid));
        let lv = Game.sceneNetMgr.calcTowerBattleLevel(battleValue, data.power);
        this.setDownLv(lv > 3 ? 0 : lv);
        this.setUpLv(0);
        let info = Game.towerMgr.getTroopBaseInfo(data.towerid);
        let lvData = Game.towerMgr.getLevelData(info, 1);
        this.coast.string = Math.floor(lvData.ncreategold * Game.strengMgr.getBuildCoinRate(info.ntroopsid)) + '';
    }

    public setGray(gray: boolean) {
        NodeUtils.setNodeGray(this.node, gray);
    }

    public enableClick(enable: boolean) {
        this.btn.interactable = enable;
    }

    public setIconType(type: ICON_TYPE) {
        this._iconType = type;
    }

    private setUpLv(lv: number) {
        this.upNodes.forEach((el, index) => {
            el.active = index < lv;
        });
    }

    private setDownLv(lv: number) {
        Game.sceneNetMgr.showBatlleLevel(this.downNodes, lv);
    }

    set setSelected(value: boolean) {
        if (!this.selectedBg) return;
        this.selectedBg.active = value;
        if (value) {
            this.selectedBg.opacity = 100;
            this.fadeIn();
        } else {
            this.selectedBg.stopAllActions();
        }
    }


    private fadeOut() {
        NodeUtils.fadeTo(this.selectedBg, 1.0, 100, this.fadeIn, this);
    }

    private fadeIn() {
        NodeUtils.fadeTo(this.selectedBg, 1.0, 255, this.fadeOut, this);
    }
}
