import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { GS_TroopsInfo_TroopsInfoItem } from "../../net/proto/DMSG_Plaza_Sub_Troops";
import { GameEvent } from "../../utils/GameEvent";
import { NodeUtils } from "../../utils/ui/NodeUtils";


const { ccclass, property, menu } = cc._decorator;

//装备类型
export enum EquipLineType {
    NONE,
    NEWGOODS,       //新物品
    BOOK,           //图鉴
    STRENGTHEN,     //强化
}

const BG = {
    SELECTED: "img_qianghua_selected",
    UNSELECTED: "img_qianghua_unselected"
}

@ccclass
@menu("Game/ui/equip/TjEquipLine")
export class TjEquipLine extends cc.Component {

    @property([cc.Node])
    nodeList: cc.Node[] = [];

    @property(cc.Node)
    bgNode: cc.Node = null;

    @property(cc.SpriteAtlas)
    bgAtlas: cc.SpriteAtlas = null;

    private _info: GS_TroopsInfo_TroopsInfoItem;
    private _type: EquipLineType = EquipLineType.NONE;
    private _currIndex: number = null;
    private _selectedBg: cc.SpriteFrame = null;
    private _unselectedBg: cc.SpriteFrame = null;

    start() {
        let children = this.bgNode.children;
        children.forEach(element => {
            element.on('click', this.onClick, this);
        });
    }

    setTowerInfo(info: GS_TroopsInfo_TroopsInfoItem, type: EquipLineType = EquipLineType.NONE) {
        this._type = type;
        this._info = info;
        this.setState();
        this.bgNode.opacity = 0;
        if (EquipLineType.STRENGTHEN == type) {
            this._selectedBg = this.bgAtlas.getSpriteFrame(BG.SELECTED);
            this._unselectedBg = this.bgAtlas.getSpriteFrame(BG.UNSELECTED);
            this.bgNode.children.forEach(element => {
                let sprite = element.getComponent(cc.Sprite);
                sprite.spriteFrame = this._unselectedBg;
            });
            this.onClick(this.bgNode.children[this.getActiveEquipIndex()].getComponent(cc.Button));
            this.bgNode.opacity = 255;
        }
    }

    private setState() {
        let len = this.nodeList.length;
        len = len < 3 ? len : 3;
        for (let i = 0; i < len; i++) {
            NodeUtils.setNodeGray(this.nodeList[i], !Game.towerMgr.checkEquipActive(this._info['nequipid' + (i + 1)]));
        }
    }

    private onClick(button: cc.Button) {
        let index = parseInt(button.node.name);
        switch (this._type) {
            case EquipLineType.BOOK:
                GameEvent.emit(EventEnum.ON_TJ_EQUIP_CLICK, this._info['nequipid' + (index + 1)], index, this.nodeList[index].getChildByName("New Sprite"));
                break;
            case EquipLineType.STRENGTHEN:
                if (Game.towerMgr.checkEquipActive(this._info['nequipid' + (index + 1)])) {
                    this.selectEquip(index);
                    GameEvent.emit(EventEnum.ON_TJ_EQUIP_CLICK, this._info['nequipid' + (index + 1)], index);
                }
                break;
        }
    }

    private selectEquip(index: number) {
        if (this._currIndex !== null && this._currIndex == index) return;
        let sprite: cc.Sprite = null;
        if (this._currIndex !== null) {
            sprite = this.bgNode.children[this._currIndex].getComponent(cc.Sprite);
            sprite.spriteFrame = this._unselectedBg;
        }
        this._currIndex = index;
        sprite = this.bgNode.children[this._currIndex].getComponent(cc.Sprite);
        sprite.spriteFrame = this._selectedBg;
    }

    private getActiveEquipIndex(): number {
        let index = 0;
        for (let i = 0; i <= 2; i++) {
            if (Game.towerMgr.checkEquipActive(this._info['nequipid' + (i + 1)])) {
                index = i;
                break;
            }
        }
        return index;
    }
}