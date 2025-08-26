// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseItem from "../../utils/ui/BaseItem";
import { PropType, Towertype } from "../../common/AllEnum";
import Game from "../../Game";
import { MathUtils } from "../../utils/MathUtils";
import { PropData } from "./towerStarLvUpView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TowerStarPropItem extends BaseItem {

    @property(cc.Label)
    propName: cc.Label = null;

    @property(cc.Label)
    currValue: cc.Label = null;

    @property(cc.Label)
    addValue: cc.Label = null;

    private _currvalue: number = 0;
    get currvalue() {
        return this._currvalue;
    }

    set currvalue(value) {
        this._currvalue = value;
        this.currValue.string = this._fixed2 ? this._currvalue.toFixed(2) : Math.floor(value).toString();
    }
    private _fixed2: boolean = false;

    private _addvalue: number = 0;

    private _cacheX: number = 62;

    refresh() {
        this.addValue.node.active = true;
        this.addValue.node.x = this._cacheX;
        let data: PropData = this.data;
        let towerType = data.towerCfg.bttype;
        let towerCfg = data.towerCfg;
        if (data.propType == PropType.OTHER && (
            towerType != Towertype.SLOWDOWN &&
            towerType != Towertype.POISONING &&
            towerType != Towertype.INCOME)) { this.node.active = false; return; }

        let currValue: number;
        let totalValue: number;
        let addValueStr: string;

        let towerMgr = Game.towerMgr;
        // let maxTowerStarCfg = TowerStarSys.getInstance().getStarCfg(data.towerCfg.type, data.towerCfg.quality, 30);
        let star = data.star ? data.star : towerMgr.getStar(towerCfg.ntroopsid);
        let prop: string = null;
        if (PropType.ATTACH == data.propType) {
            this.propName.string = "攻击伤害：";

            let addProp = data.calcEquipAdd ? towerMgr.getEquipAddProp(towerCfg.nequipid1) : 0;
            currValue = Math.floor(towerMgr.getAttack(towerCfg.ntroopsid, star) * (1 + addProp));
            let value = Math.floor(towerMgr.getAttack(towerCfg.ntroopsid, MathUtils.clamp(star + 1, 1, towerMgr.getStarMax(towerCfg.btquality))) * (1 + addProp));
            this._addvalue = Math.max(0, value - currValue);
            // addValueStr = "+" + (value ? this._addvalue : "");
            // addValueStr = (value ? this._addvalue : "").toString();
            // addValueStr = addValueStr ? "+" + addValueStr : "";
            addValueStr = this._addvalue ? "+" + this._addvalue : "";
            this.currvalue = currValue;
            // this.currValue.string = currValue.toString();
            this.addValue.string = addValueStr;
            // this.addValue.node.active = value - currValue == 0 ? false : true;
            return;
        } else if (PropType.OTHER == data.propType) {
            switch (towerType) {
                case Towertype.SLOWDOWN:
                    this.propName.string = "控制效果：";
                    prop = "btctr";
                    break;
                case Towertype.POISONING:
                    this.propName.string = "持续伤害：";
                    prop = "btdot";
                    break;
                case Towertype.INCOME:
                    this.propName.string = "额外收益：";
                    prop = "btprofit";
                    break;
            }
        } else if (PropType.SPEED == data.propType) {
            this.propName.string = "射击速度：";

            let addProp = data.calcEquipAdd ? towerMgr.getEquipAddProp(towerCfg.nequipid3) : 0;
            currValue = Math.floor(towerMgr.getUpStarSpeed(towerCfg.ntroopsid, star, 3) * (1 - addProp)) / 1000;
            let value = Math.floor(towerMgr.getUpStarSpeed(towerCfg.ntroopsid, MathUtils.clamp(star + 1, 1, towerMgr.getStarMax(towerCfg.btquality)), 3) * (1 - addProp)) / 1000;
            this._addvalue = Math.max(value - currValue, 0);
            // addValueStr = (value ?  : "");
            addValueStr = Math.abs(this._addvalue) < 0.01 ? "" : this._addvalue.toFixed(2);
            this._fixed2 = true;
            this.currvalue = currValue;
            this.addValue.string = addValueStr;
            // this.addValue.node.active = Math.abs(this._addvalue) < 0.01 ? false : true;
            return;
        } else {
            this.propName.string = "射击距离：";

            let addProp = data.calcEquipAdd ? towerMgr.getEquipAddProp(towerCfg.nequipid2) : 0;
            currValue = Math.floor(towerMgr.getUpStarDis(towerCfg.ntroopsid, star, 3) * (1 + addProp));
            let value = Math.floor(towerMgr.getUpStarDis(towerCfg.ntroopsid, MathUtils.clamp(star + 1, 1, towerMgr.getStarMax(towerCfg.btquality)), 3) * (1 + addProp));
            this._addvalue = Math.max(value - currValue, 0);
            // addValueStr = (value ? this._addvalue : "").toString();
            addValueStr = this._addvalue ? "+" + this._addvalue : "";
            this.currvalue = currValue;
            // this.currValue.string = currValue.toString();
            this.addValue.string = addValueStr;
            return;
        }
        currValue = towerCfg[prop];
        this.currvalue = currValue;
        this.addValue.string = "";
    }

    startAni() {
        this.stopAni();
        cc.tween(this.addValue.node)
            .set({ x: this._cacheX, active: true })
            .to(0.15, { x: this.currValue.node.x })
            .call((node) => {
                node.active = false;
            })
            .start();

        cc.tween(this.currValue.node)
            .set({ scale: 1 })
            .by(0.3, { scale: 0.3 })
            .by(0.3, { scale: -0.3 })
            .start();

        cc.tween().target(this).to(0.3, { currvalue: this.currvalue + this._addvalue }).start();
    }

    stopAni() {
        cc.Tween.stopAllByTarget(this.addValue.node);
        cc.Tween.stopAllByTarget(this.currValue.node);
        cc.Tween.stopAllByTarget(this);
    }
}
