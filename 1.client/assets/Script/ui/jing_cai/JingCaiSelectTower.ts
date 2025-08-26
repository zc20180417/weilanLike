// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { ActorProp } from "../../net/socket/handler/MessageEnum";
import { GameEvent } from "../../utils/GameEvent";
import { Handler } from "../../utils/Handler";
import SystemTipsMgr from "../../utils/SystemTipsMgr";
import { NodeUtils } from "../../utils/ui/NodeUtils";
import JingCaiTowerItem, { ICON_TYPE, TowerData } from "./JingCaiTowerItem";

const { ccclass, property } = cc._decorator;

export interface JingCaiSelectTowerData {
    type: number;
    power: number;
    coast: number;
    active: boolean;
    item: JingCaiTowerItem;
}

@ccclass
export default class JingCaiSelectTower extends cc.Component {
    @property(JingCaiTowerItem)
    towerItems: JingCaiTowerItem[] = [];

    @property(cc.Node)
    mask: cc.Node = null;

    @property(cc.Node)
    btnNode: cc.Node = null;

    @property(cc.Label)
    coast: cc.Label = null;

    @property(cc.Node)
    diaNode: cc.Node = null;

    @property(cc.Node)
    freeNode: cc.Node = null;

    private _clickHandler: Handler = null;
    private _data: JingCaiSelectTowerData = null;
    private _itemParent: cc.Node = null;
    private _oldPos: cc.Vec2 = null;
    onEnable() {
        GameEvent.on(EventEnum.BOUNTY_SET_TROOPS, this.onSetTower, this);
        GameEvent.on(EventEnum.BOUNTY_OPEN_GRID, this.onOpenGrid, this);
        // GameEvent.on(EventEnum.PLAYER_PROP_CHANGE + ActorProp.ACTOR_PROP_DIAMONDS, this.refreshDiamond, this));
    }

    onDisable() {
        GameEvent.targetOff(this);
    }

    public setClickHandler(handler: Handler) {
        this._clickHandler = handler;
    }

    public setData(data: JingCaiSelectTowerData) {
        this._data = data;
    }

    public refresh() {
        if (!this._data) return;
        let towerCfgs = Game.towerMgr.getTowerInfoListByType(this._data.type);
        let hasUnlockTower: boolean = false;
        if (!towerCfgs) return;
        for (let i = 0, len = this.towerItems.length; i < len; i++) {
            if (i < towerCfgs.length) {
                let towerData: TowerData = {
                    power: this._data.power,
                    towerid: towerCfgs[i].ntroopsid
                }
                this.towerItems[i].node.active = true;
                this.towerItems[i].selectedBg.active = true;
                this.towerItems[i].setIconType(ICON_TYPE.TOWER);
                this.towerItems[i].setData(towerData, i);
                this.towerItems[i].setClickHandler(this._clickHandler);
                this.towerItems[i].refresh();
                this.towerItems[i].setSelected = this._data.item.data.towerid == towerCfgs[i].ntroopsid;
            } else {
                this.towerItems[i].node.active = false;
                this.towerItems[i].selectedBg.active = false;
            }
            hasUnlockTower = hasUnlockTower || Game.towerMgr.isTowerUnlock(towerCfgs[i].ntroopsid);
        }

        this.towerItems.forEach(el => {
            el.enableClick(this._data.active && hasUnlockTower);
        });

        this.btnNode.active = !this._data.active && hasUnlockTower;
        this.coast.string = this._data.coast.toString();
        this.diaNode.active = this._data.coast > 0;
        this.freeNode.active = this._data.coast <= 0;

        this._itemParent = this._data.item.node.parent;
        this._oldPos = this._data.item.node.getPosition();
        let worldPos = this._data.item.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
        let localPos = this.node.convertToNodeSpaceAR(worldPos);
        this._data.item.node.removeFromParent();
        this._data.item.node.parent = this.node;
        this._data.item.node.setPosition(localPos);
        this._data.item.enableClick(false);
    }

    private onClick() {
        this._data.item.node.removeFromParent();
        this._data.item.node.parent = this._itemParent;
        this._data.item.node.setPosition(this._oldPos);
        this._data.item.enableClick(true);
        this.show(false);
    }

    public show(visiable: boolean) {
        this.mask.active = visiable;
        this.node.active = visiable;
    }

    public reqOpenGrid() {
        if (!this._data) return;
        if (this._data.coast > Game.actorMgr.getProp(ActorProp.ACTOR_PROP_DIAMONDS)) {
            SystemTipsMgr.instance.notice("钻石不足");
        } else {
            Game.bountyMgr.reqOpenGrid(this._data.type + 1);
        }
    }

    public onOpenGrid(index: number) {
        if (this._data.type + 1 == index) {
            this._data.active = true;

            this.towerItems.forEach(el => {
                el.enableClick(this._data.active);
            });

            this.btnNode.active = !this._data.active;
        }
    }

    private onSetTower(type: number, towerid: number) {
        if (this._data.type + 1 == type) {
            this.towerItems.forEach(el => {
                el.setSelected = el.data.towerid == towerid;
            });
        }
    }
}