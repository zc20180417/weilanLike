

import SceneObject from "../../sceneObjs/SceneObject";
import { EventEnum } from "../../../common/EventEnum";
import Creature from "../../sceneObjs/Creature";
import LigatureComp from "../ccc/LigatureComp";
import Game from "../../../Game";
import { ERecyclableType } from "../../Recyclable/ERecyclableType";
import { Component } from "../Component";
import { EComponentType } from "../AllComp";
import { MathUtils } from "../../../utils/MathUtils";
import { GS_SkillInfo_SkillInfoItem, GS_SkillInfo_SkillLevel } from "../../../net/proto/DMSG_Plaza_Sub_Troops";
import { Tower } from "../../sceneObjs/Tower";
import { Handler } from "../../../utils/Handler";
import GlobalVal from "../../../GlobalVal";
import { Monster } from "../../sceneObjs/Monster";
import SysMgr from "../../../common/SysMgr";
import LdHeroAutoAttackComp from "../../../ld/tower/LdHeroAutoAttackComp";

export default class LigatureSoComp extends Component {

    protected _target:Creature = null;
    protected _effect:SceneObject = null;
    protected _ligatureComp:LigatureComp = null;
    protected _effectName:string = "";
    protected _self:Tower;
    protected _curSkillLevelData:GS_SkillInfo_SkillLevel;
    protected _curSkill:GS_SkillInfo_SkillInfoItem;
    protected _refreshAttackPosHandler:Handler;
    protected _refreshDamageHandler:Handler;
    protected _damageValue:number;
    protected _skillUid:number;
    protected _addDamageRate:number = 0;
    protected _hitTimes:number = 1;
    protected _addCount:number = 0;
    protected _addRate:number = 0;
    protected _addRateMax:number = 0;
    protected _addStack:number = 0;

    constructor() {
        super();
        this.key = ERecyclableType.LIGATURE;
        this._refreshDamageHandler = new Handler(this.onRefreshDamage , this);
    }

    added() {
        this._self = this.owner as Tower;
        this._self.on(EventEnum.LEVEL_CHANGE , this.onLevelChange , this);
    }

    removed() {
        this.removeEffect();
        SysMgr.instance.clearTimer(this._refreshDamageHandler ,false);
        this._effectName = "";
        this._self.off(EventEnum.LEVEL_CHANGE , this.onLevelChange , this);
    }

    resetData() {
        this._addCount = 0;
        this._addRate = 0;
        this._addRateMax = 0;
        super.resetData();
    }

    giveUp() {
        super.giveUp();
    }

    end() {
        if (!this._effect || !this._effect.mainBody) return;
        this._ligatureComp = this._effect.mainBody.getComponent(LigatureComp);
        if (this._ligatureComp) {
            this._ligatureComp.setTarget(null);
        }
    }

    /**
     * 
     * @param skill 
     * @param levelData 
     * @param target 
     * @param damageValue 
     * @param skillUid 
     * @param addStack 
     */
    setData(skill:GS_SkillInfo_SkillInfoItem , levelData:GS_SkillInfo_SkillLevel , target:Creature ,damageValue:number ,skillUid:number , addStack:number) {
        this._curSkill = skill;
        this._curSkillLevelData = levelData;
        this._target = target;
        // cc.log('----------  setData  --this._target:' , (this._target as Monster).name);
        this._damageValue = damageValue;
        this._skillUid = skillUid;
        this._addDamageRate = 0;
        this._hitTimes = 1;
        this._addStack = addStack / 10000;
        this.onLevelChange();
    }

    setAtkPos( handler:Handler) {
        this._refreshAttackPosHandler = handler;
    }

    onHitTimer() {
        if (!this._target) return;
        this._hitTimes ++;
        if (this._addRate > 0 && (this._hitTimes % this._addCount) == 0 && this._addDamageRate < this._addRateMax) {
            this._addDamageRate += this._addStack > 0 ? this._addRate * (1 + this._addStack) : this._addRate;
            //cc.log('---------this._addDamageRate:' , this._addDamageRate , this._addStack , this._addRate * (1 + this._addStack) , this._addRate);
            //cc.log('---------cd' , this._self.attackSpeed);
        }
        Game.ldSkillMgr.onHit(this._target as Monster , this._curSkill , this._curSkillLevelData ,this._damageValue, this._skillUid , this._addDamageRate);
    }
    
    protected onMainAttached() {
        this.init();
    }

    protected init() {
        if (!this._target) return;
        let center = this._target.centerPos;
        let p = this._refreshAttackPosHandler.execute();
        GlobalVal.tempVec2.x = p.x; 
        GlobalVal.tempVec2.y = p.y; 
        let dis = MathUtils.getDistance(GlobalVal.tempVec2.x , GlobalVal.tempVec2.y , center.x , center.y);
        this._effect.mainBody.width = dis;
        this._effect.mainBody.angle = MathUtils.getAngle(GlobalVal.tempVec2.x , GlobalVal.tempVec2.y , center.x , center.y);
        this._ligatureComp = this._effect.mainBody.getComponent(LigatureComp);
        if (this._ligatureComp) {
            // cc.log('-------init----this._target:' , (this._target as Monster).name);
            const autoAttack = this.owner.getComponent(EComponentType.LD_HERO_AUTO) as LdHeroAutoAttackComp;
            if (autoAttack.getTarget() != this._target) {
                autoAttack.resetTarget(this._target);
            }
            this._ligatureComp.setOwnerAutoAtkComp(autoAttack);
            this._ligatureComp.setGetPosHandler(this._refreshAttackPosHandler);
            this._ligatureComp.setTarget(this._target);
        }
    }

    protected removeEffect() {
        if (this._effect) {
            if (!this._effect.mainBody) {
                this._effect.off(EventEnum.MAIN_BODY_ATTACHED , this.onMainAttached , this);
            }
            Game.soMgr.removeEffect(this._effect);
            this._effect = null;
        }
        this._ligatureComp = null;
    }

    protected onLevelChange() {
        this._curSkillLevelData = Game.towerMgr.getSkillLevelData(this._curSkill , this._self.levelData.btskilllevel);
        this._addCount = this._curSkillLevelData.uskillparam0;
        this._addRate = this._curSkillLevelData.uskillparam1 * 100;
        this._addRateMax = this._curSkillLevelData.uskillparam2 * 100;
        this.initEft(this._curSkillLevelData.szattackeft);
        SysMgr.instance.doFrameOnce(this._refreshDamageHandler , 1 ,false);
    }

    protected onRefreshDamage() {

    }

    protected initEft(effectName:string) {
        if (this._effectName != effectName) {
            this.removeEffect();
            this._effectName = effectName;
        }

        if (!this._effect){
            let p = this._refreshAttackPosHandler.execute();
            this._effect = Game.soMgr.createEffect(this._effectName , p.x , p.y , true);
            if (!this._effect.mainBody) {
                this._effect.once(EventEnum.MAIN_BODY_ATTACHED , this.onMainAttached , this);
            } else {
                this.init();
            }
        }

        if (this._ligatureComp) {
            const autoAttack = this.owner.getComponent(EComponentType.LD_HERO_AUTO) as LdHeroAutoAttackComp;
            if (autoAttack.getTarget() != this._target) {
                autoAttack.resetTarget(this._target);
            }
            this._ligatureComp.setTarget(this._target);
        }
    }
}