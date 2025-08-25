// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EResPath } from "../../common/EResPath";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import TroopsMgr from "../../net/mgr/TroopsMgr";
import { GS_TroopsEquipData_ActiveEquipItem, GS_TroopsInfo_TroopsInfoItem } from "../../net/proto/DMSG_Plaza_Sub_Troops";
import { GameEvent } from "../../utils/GameEvent";
import { Handler } from "../../utils/Handler";
import Dialog from "../../utils/ui/Dialog";
import ImageLoader from "../../utils/ui/ImageLoader";
import { NodeUtils } from "../../utils/ui/NodeUtils";
import { EquipLineType, TjEquipLine } from "../equip/TjEquipLine";
import EquipLvItem from "./EquipLvItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TowerStarEquipmentView extends Dialog {
    @property(cc.Node)
    equipNode: cc.Node = null;

    @property(ImageLoader)
    icon: ImageLoader = null;

    @property(cc.Label)
    equipName: cc.Label = null;

    @property(cc.Label)
    equipDes: cc.Label = null;

    @property(cc.Label)
    totalMaterial: cc.Label = null;

    @property(cc.Label)
    coastMaterial: cc.Label = null;

    @property(cc.Button)
    upgradeBtn: cc.Button = null;

    @property(ImageLoader)
    totalIco: ImageLoader = null;

    @property(ImageLoader)
    coastIco: ImageLoader = null;

    @property(cc.Label)
    currProp: cc.Label = null;

    @property(cc.Label)
    nextProp: cc.Label = null;

    @property(cc.Label)
    currPropTitle: cc.Label = null;

    @property(cc.Label)
    nextPropTitle: cc.Label = null;

    @property(cc.Node)
    maxGroup: cc.Node = null;

    @property(cc.Node)
    maxLabel: cc.Node = null;

    @property(cc.Prefab)
    lvItem: cc.Prefab = null;

    private _towerCfg: GS_TroopsInfo_TroopsInfoItem = null;
    private _currEquipId: number = null;
    private _lvItems: EquipLvItem[] = [];
    private _currEquipIndex: number = -1;
    setData(data: GS_TroopsInfo_TroopsInfoItem) {
        this._towerCfg = data;
    }

    addEvent() {
        GameEvent.on(EventEnum.ON_TJ_EQUIP_CLICK, this.onEquipSelected, this);
        GameEvent.on(EventEnum.EQUIP_UPGRADE, this.onEquipUpgrade, this);
        GameEvent.on(EventEnum.ITEM_COUNT_CHANGE, this.onItemChange, this);
    }

    beforeShow() {
        if (this._towerCfg) {
            //炮塔图标
            this.icon.url = EResPath.TOWER_IMG + Game.towerMgr.get3dpicres(this._towerCfg.ntroopsid, this._towerCfg);

            //装备
            Game.resMgr.loadRes(EResPath.TJ_EQUIP_LINE + this._towerCfg.ntroopsid
                , cc.Prefab, Handler.create(this.onEquipLineLoaded, this));
        }
    }

    afterHide() {
        if (this._towerCfg) {
            Game.resMgr.removeLoad(EResPath.TJ_EQUIP_LINE + this._towerCfg.ntroopsid, Handler.create(this.onEquipLineLoaded, this));
            Handler.dispose(this);
        }
    }

    private onEquipLineLoaded(resData: cc.Prefab, path: string) {
        Game.resMgr.addRef(path);
        if (!this._towerCfg || path != EResPath.TJ_EQUIP_LINE + this._towerCfg.ntroopsid) return;
        let node = cc.instantiate(resData);
        this.equipNode.addChild(node);

        let tjEquipLine: TjEquipLine = node.getComponent(TjEquipLine);
        if (tjEquipLine) {
            let nodes = tjEquipLine.nodeList;
            let node: cc.Node = null;
            for (let i = 0, len = nodes.length; i < len; i++) {
                if (Game.towerMgr.checkEquipActive(this._towerCfg['nequipid' + (i + 1)])) {
                    node = cc.instantiate(this.lvItem);
                    this._lvItems[i] = node.getComponent(EquipLvItem);
                    nodes[i].addChild(node);
                }
            }
            let equipData = null;
            for (let i = 0; i < 3; i++) {
                equipData = Game.towerMgr.getEquipData(this._towerCfg['nequipid' + (i + 1)]);
                equipData && this.refreshLvItem(i, equipData);
            }

            tjEquipLine.setTowerInfo(this._towerCfg, EquipLineType.STRENGTHEN);
        }
    }

    private onEquipSelected(equipId: number, index: number) {
        this._currEquipId = equipId;
        this._currEquipIndex = index;
        let equipInfo = Game.towerMgr.getEquipItem(equipId);
        let equipData = Game.towerMgr.getEquipData(equipId);
        if (!equipInfo || !equipData) return;

        //最大等级
        let isMax: boolean = equipData.nlv >= equipInfo.umaxlv;
        this.maxGroup.active = !isMax;
        this.maxLabel.active = isMax;

        this.equipName.string = equipInfo.szname + (isMax ? "（满级）" : "");
        this.equipDes.string = equipInfo.szdes;

        this.refreshLvItem(index, equipData);

        //物品图标
        let materialId = equipData.nupneedgoodsid1;
        let goodsInfo = Game.goodsMgr.getGoodsInfo(materialId);
        if (goodsInfo) {
            this.totalIco.setPicId(goodsInfo.npacketpicid);
            this.coastIco.setPicId(goodsInfo.npacketpicid);
        }

        //物品数量
        let totalNum = Game.containerMgr.getItemCount(materialId);
        this.refreshMaterial(totalNum, equipData.nupneedgoodsnum1);

        //属性
        this.nextProp.string = "+" + Math.floor((equipData.nnextaddprop - equipData.naddprop) / 100) + "%";

        this.currProp.string = "+" + Math.floor(equipData.naddprop / 100) + "%";

        //属性名称
        this.currPropTitle.string = TroopsMgr.PROP_TYPE[index];
        this.nextPropTitle.string = TroopsMgr.PROP_TYPE[index];

    }

    private onEquipUpgrade(equipId: number) {
        if (equipId !== equipId) return;
        let equipInfo = Game.towerMgr.getEquipItem(equipId);
        let equipData = Game.towerMgr.getEquipData(equipId);

        if (!equipData || !equipInfo) return;
        //物品数量
        let totalNum = Game.containerMgr.getItemCount(equipData.nupneedgoodsid1);
        this.refreshMaterial(totalNum, equipData.nupneedgoodsnum1);
        //属性
        this.nextProp.string = "+" + Math.floor((equipData.nnextaddprop - equipData.naddprop) / 100) + "%";

        this.currProp.string = "+" + Math.floor(equipData.naddprop / 100) + "%";

        //最大等级
        let isMax: boolean = equipData.nlv >= equipInfo.umaxlv;
        this.maxGroup.active = !isMax;
        this.maxLabel.active = isMax;

        this.equipName.string = equipInfo.szname + (isMax ? "（满级）" : "");

        this.refreshLvItem(this._currEquipIndex, equipData);
    }

    private onItemChange(id: number, newValue: number, oldValue: number) {
        let equipData = Game.towerMgr.getEquipData(this._currEquipId);
        if (!equipData || equipData.nupneedgoodsid1 !== id) return;
        this.refreshMaterial(newValue, equipData.nupneedgoodsnum1);
    }

    private refreshMaterial(totalValue: number, coastValue: number) {
        this.totalMaterial.string = " " + totalValue + " ";
        this.coastMaterial.string = " " + coastValue + " ";

        NodeUtils.enabled(this.upgradeBtn, coastValue <= totalValue);
    }

    private clickStrengthen() {
        if (this._currEquipId === null) return;
        Game.towerMgr.reqUpgradeEquipLv(this._currEquipId);
    }

    private refreshLvItem(index: number, equipData: GS_TroopsEquipData_ActiveEquipItem) {
        if (this._lvItems[index]) {
            this._lvItems[index].setString("Lv." + equipData.nlv);
        }
    }
}
