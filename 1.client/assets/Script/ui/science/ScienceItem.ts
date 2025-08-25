import BaseItem from "../../utils/ui/BaseItem";
import { ScienceItem2 } from "./ScienceItem2";
import TowerStarTitle from "../towerStarSys/towerStarTitle";
import Game from "../../Game";

import { EventEnum } from "../../common/EventEnum";
import AlertDialog from "../../utils/ui/AlertDialog";
import { Handler } from "../../utils/Handler";
import SystemTipsMgr from "../../utils/SystemTipsMgr";
import { GameEvent } from "../../utils/GameEvent";



const { ccclass, menu, property } = cc._decorator;


//线条颜色
const LINE_COLOR = [
    "#95e755",
    "#ffba00",
    "#31b2e8",
    "#6afffa",
    "#9d31e8",
    "#fdda4f",
    "#fbadad",
    "#fbadad",
    "#fbadad"
];

@ccclass
@menu("Game/ui/science/ScienceItem")
export class ScienceItem extends BaseItem {

    // private static common_color: cc.Color = cc.color(255, 227, 55, 255);
    // private static unactive_color: cc.Color = cc.color(255, 255, 255, 255);

    // private _handler: Handler;
    // private _showEft: boolean = false;

    items: ScienceItem2[] = [];

    @property(cc.Sprite)
    bg: cc.Sprite = null;

    @property(cc.SpriteAtlas)
    bgAtlas: cc.SpriteAtlas = null;

    @property(TowerStarTitle)
    titleIcon: TowerStarTitle = null;

    lines: cc.Node[] = [];

    itemBgs: cc.Sprite[] = [];

    @property(cc.Prefab)
    types: cc.Prefab[] = [];

    private _typeNode: cc.Node = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Sprite)
    titleBg: cc.Sprite = null;

    onLoad() {
        GameEvent.on(EventEnum.SCIENCE_RESET, this.onScienceReset, this);
        GameEvent.on(EventEnum.SCIENCE_UPGRADE, this.onScienceUpgrade, this);
    }

    onDestroy() {
        GameEvent.targetOff(this);
    }

    private onScienceUpgrade(nid, level, typeId) {
        if (typeId == this.index + 1) {
            this.refresh();
        }
    }


    setData(data: any, index?: number) {
        let oldIndex = this.index;
        super.setData(data, index);
        //过滤不必要的刷新
        if (oldIndex !== index) {
            this.refresh();
        }
    }

    refresh() {
        // cc.log("======刷新", this.index);
        if (this.index >= this.types.length) return;
        if (this._typeNode) this._typeNode.removeFromParent();
        this._typeNode = cc.instantiate(this.types[this.index]);
        this._typeNode.parent = this.content;
        //线条
        this.lines = this._typeNode.getChildByName("lines").children;

        let children = this._typeNode.getChildByName("item_bg").children;
        //ScienceItem2
        this.itemBgs.length = 0;
        this.items.length = 0;
        for (let i = 0, len = children.length; i < len; i++) {
            let com = children[i].getComponent(ScienceItem2);
            this.items.push(com);
            let com2 = children[i].getComponent(cc.Sprite);
            this.itemBgs.push(com2);
        }

        //title
        this.titleIcon.setIndex(this.index);

        let spriteIndex = this.index + 1;

        //bg
        this.bg.spriteFrame = this.bgAtlas.getSpriteFrame("img_bg_" + spriteIndex);

        //items bg
        let tempSp = this.bgAtlas.getSpriteFrame("img_circle_" + spriteIndex);
        for (let i = 0, len = this.itemBgs.length; i < len; i++) {
            this.itemBgs[i].spriteFrame = tempSp;
        }

        //lines color
        let color = cc.Color.WHITE.fromHEX(LINE_COLOR[this.index]);
        for (let i = 0, len = this.lines.length; i < len; i++) {
            this.lines[i].color = color;
        }

        this.titleBg.spriteFrame = tempSp;

        this.refreshAllItems();
    }

    refreshAllItems() {
        if (!this.data) return;
        let scienceDatas = this.data;
        // let preItemActive: boolean = true;
        for (let i = 0, len = this.items.length; i < len; i++) {
            //前一个科技激活，后一个科技才能激活
            this.items[i].setData(scienceDatas[i], i);
            // preItemActive ? this.items[i].setIconNormal() : this.items[i].setIconGray();
            // let itemData: GS_StrengConfig_StrengItem = scienceDatas[i] as GS_StrengConfig_StrengItem;
            // let scienceData = Game.strengMgr.getStrengData(itemData.nid);
            // preItemActive = scienceData ? true : false;
        }
    }

    getItem(index: number): cc.Node {
        this.items[index].addIco();
        return this.items[index].node;
    }

    private resetClick() {
        AlertDialog.showAlert(`重置需要消耗 ${Game.strengMgr.getResetCost()} 钻石，是否确认要重置？`, new Handler(this.onSelectReset, this));
    }

    private onSelectReset() {
        if (Game.actorMgr.getDiamonds() < Game.strengMgr.getResetCost()) {
            SystemTipsMgr.instance.notice("钻石不足");
            return;
        }
        Game.strengMgr.reqReset(this.index + 1);
    }

    private onScienceReset(type: number) {
        if (type == this.index + 1) {
            this.refreshAllItems();
        }
    }
}