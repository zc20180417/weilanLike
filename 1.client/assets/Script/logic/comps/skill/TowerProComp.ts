import { Component } from "../Component";
import Game from "../../../Game";
import { Tower } from "../../sceneObjs/Tower";
import { EventEnum } from "../../../common/EventEnum";
import { GS_TroopsEquipData_ActiveEquipItem, GS_TroopsEquipInfo_EquipItem, GS_TroopsInfo, GS_TroopsInfo_TroopsInfoItem } from "../../../net/proto/DMSG_Plaza_Sub_Troops";
import { EComponentType } from "../AllComp";
import LdHeroAutoAttackComp from "../../../ld/tower/LdHeroAutoAttackComp";

export default class TowerProComp extends Component {

    /**增加的伤害系数（科技针对塔等级增加的伤害系数+塔星级增加的系数+科技光环增加的系数） */
    addHurtValue:number = 0;
    /**增加的攻击距离 */
    addRangeDist:number = 0;

    /**等级范围内全塔类型伤害增强 */
    protected _rangeDeepenHurtSelfValue:number = 0;
    /**等级范围内全塔类型射速增强 */
    protected _rangeAttackSpeedSelfValue:number = 0;
    /**等级范围内全塔类型攻击距离增强 */
    protected _rangeDistSelfValue:number = 0;
    /**全范围内全塔类型伤害增强 */
    protected _deepenHurtSelfValue:number = 0;
    /**全范围内全相同塔伤害增强 */
    protected _deepenHurtSelfTowerValue:number = 0;

    /**针对自身等级伤害增强 */
    protected _hurtSelfLevelValue = 0;

    protected _cfg:GS_TroopsInfo_TroopsInfoItem = null;
    protected _mainID:number = 0;

    protected _level:number = 0;
    protected _star:number = 1;

    protected _attack:number = 0;
    protected _damageValue:number = 0;

    protected _self:Tower;
    protected _autoAttackComp:LdHeroAutoAttackComp;
    //装备加伤害系数
    protected _starAddHurt:number = 0;
    //装备加攻击距离
    protected _starAddDis:number = 0;
    //装备加攻击速度
    protected _starAddSpeed:number = 0;
    //皮肤加的伤害加深
    protected _fashionAddHurt:number = 0;

    //技能增加伤害
    private _skillAddHurt:number = 0;

    /**增强buffid */
    protected _strengBuffId:number = 0;
    /**增强buff效果值 */
    protected _strengBuffValue:number = 0;

    getStrengBuff():any {
        if (this._strengBuffId == 0) return null;
        return {buffId:this._strengBuffId , value:this._strengBuffValue};
    }

    resetData() {
        this._rangeDeepenHurtSelfValue = 0;
        this._rangeAttackSpeedSelfValue = 0;
        this._rangeDistSelfValue = 0;
        this._deepenHurtSelfValue = 0;
        this._deepenHurtSelfTowerValue = 0;
        this._starAddSpeed = 0;
        this._starAddHurt = 0;
        this._starAddDis = 0;
        this._hurtSelfLevelValue = 0;
        this.addHurtValue = 0;
        this.addRangeDist = 0;
        this._skillAddHurt = 0;
        this._strengBuffId = 0;
        this._strengBuffValue = 0;
        super.resetData();
    }

    added() {
        this._self = this.owner as Tower;
        this.initBaseData();
        this._self.on(EventEnum.LEVEL_CHANGE , this.refresh , this);
        this._autoAttackComp = this._self.getComponent(EComponentType.LD_HERO_AUTO);
        this.refresh();
    }

    removed() {
        this._self.off(EventEnum.LEVEL_CHANGE , this.refresh , this);
        this._self = null;
        this._cfg = null;
        this._autoAttackComp = null;
        super.removed();
    }

    refresh() {
        this._level = this._self.level;
        this._damageValue = Math.floor(this._attack * this._self.levelData.nhurtper / 10000);
        this._fashionAddHurt = Game.fashionMgr.getTowerFashionAddHurtPer(this._cfg.ntroopsid);
        this.refreshHurtValue();
    }

    get mainID():number {
        return this._mainID;
    }

    get attack():number {
        return this._attack;
    }

    get damageValue():number {
        return this._damageValue;
    }

    get level():number {
        return this._level;
    }

    /**
     * 计算基础数值
     */
    protected initBaseData() {
        this._cfg = this._self.cfg;
        this._star = Game.curLdGameCtrl ? Game.curLdGameCtrl.getTowerStar(this._cfg.ntroopsid) : 1;
        if (this._star == 0) {
            this._star = 1;
        }
        this._attack = Game.towerMgr.getAttack(this._cfg.ntroopsid , this._star);

        let equipInfo:GS_TroopsEquipInfo_EquipItem;
        let equipData:GS_TroopsEquipData_ActiveEquipItem;
        let equipid:number = 0;
        this._starAddHurt = this._starAddDis = this._starAddSpeed = 0;

        for (let i = 1 ; i <= 3 ; i++) {
            equipid = this._cfg['nequipid' + i];
            equipInfo = Game.towerMgr.getEquipItem(equipid);
            if (equipInfo) {
                equipData = Game.towerMgr.getEquipData(equipid);
                if (equipData) {
                    this.addEquipProp(equipInfo.btproptype , equipData.naddprop);
                }
            }
        }
    }

    protected addEquipProp(proptype:number , value:number) {
        switch (proptype) {
            case 0:
                this._starAddHurt += value;
                break;
            case 1:
                this._starAddSpeed += (value / 10000);
            break;
            case 2:
                this._starAddDis += (value / 10000);
            break;
        }
    }

    protected refreshHurtValue() {
        this.addHurtValue = this._rangeDeepenHurtSelfValue + 
                            this._hurtSelfLevelValue + 
                            this._starAddHurt + 
                            this._deepenHurtSelfValue + 
                            this._fashionAddHurt + 
                            this._skillAddHurt +
                            this._deepenHurtSelfTowerValue;
    }


}