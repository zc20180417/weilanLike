// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { PropType, Towertype } from "../../common/AllEnum";
import Game from "../../Game";
import BaseItem from "../../utils/ui/BaseItem";
import { PropData } from "./towerStarLvUpView";


const { ccclass, property , menu } = cc._decorator;

@ccclass
@menu("Game/tower/TowerStarPropItem2")
export default class TowerStarPropItem2 extends BaseItem {

    @property(cc.Sprite)
    propIco: cc.Sprite = null;

    @property(cc.Label)
    currValue: cc.Label = null;

    private _currvalue: number = 0;
    get currvalue() {
        return this._currvalue;
    }

    set currvalue(value) {
        this._currvalue = value;
        this.currValue.string = this._fixed2 ? this._currvalue.toFixed(2) : Math.floor(value).toString();

        if (PropType.RANGE == this.data.propType) {
            this.currValue.string += '格';
        }

    }
    private _fixed2: boolean = false;
    private _cacheX: number = 62;

    refresh() {

        let data: PropData = this.data;
        let towerType = data.towerCfg.bttype;
        let towerCfg = data.towerCfg;
        if (data.propType == PropType.OTHER && (
            towerType != Towertype.SLOWDOWN &&
            towerType != Towertype.POISONING &&
            towerType != Towertype.INCOME)) { this.node.active = false; return; }

        let currValue: number;


        let towerMgr = Game.towerMgr;
        // let maxTowerStarCfg = TowerStarSys.getInstance().getStarCfg(data.towerCfg.type, data.towerCfg.quality, 30);
        let star = data.star ? data.star : towerMgr.getStar(towerCfg.ntroopsid);
        let prop: string = null;
        if (PropType.ATTACH == data.propType) {
            // this.propName.string = "攻击伤害：";
            let addProp = data.calcEquipAdd ? towerMgr.getEquipAddProp(towerCfg.nequipid1) : 0;
            currValue = Math.floor(towerMgr.getAttack(towerCfg.ntroopsid, star) * (1 + addProp));
            this.currvalue = currValue;
            return;
        } else if (PropType.OTHER == data.propType) {
            switch (towerType) {
                case Towertype.SLOWDOWN:
                    // this.propName.string = "控制效果：";
                    prop = "btctr";
                    break;
                case Towertype.POISONING:
                    // this.propName.string = "持续伤害：";
                    prop = "btdot";
                    break;
                case Towertype.INCOME:
                    // this.propName.string = "额外收益：";
                    prop = "btprofit";
                    break;
            }
        } else if (PropType.SPEED == data.propType) {
            // this.propName.string = "射击速度：";
            let addProp = data.calcEquipAdd ? towerMgr.getEquipAddProp(towerCfg.nequipid3) : 0;
            currValue = Math.floor(towerMgr.getUpStarSpeed(towerCfg.ntroopsid, star, 3) * (1 - addProp)) / 1000;
            this._fixed2 = true;
            this.currvalue = currValue;

            return;
        } else {
            // this.propName.string = "射击距离：";
            let addProp = data.calcEquipAdd ? towerMgr.getEquipAddProp(towerCfg.nequipid2) : 0;
            currValue = Math.floor(towerMgr.getUpStarDis(towerCfg.ntroopsid, star, 3) * (1 + addProp));
            this._fixed2 = true;
            this.currvalue = currValue / 75;
            return;
        }
        currValue = towerCfg[prop];
        this.currvalue = currValue;

    }
    
        
    

    
}
