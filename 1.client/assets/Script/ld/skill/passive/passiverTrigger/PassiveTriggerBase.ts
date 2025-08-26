

import { PassiveSkillConfig } from "../../../../common/ConfigInterface";
import Debug, { TAG } from "../../../../debug";
import GlobalVal from "../../../../GlobalVal";
import Creature from "../../../../logic/sceneObjs/Creature";


import { PassiveSkillBase } from "../PassiveSkillBase";

export class PassiveTriggerBase {

    
    protected owner:Creature;
    protected cfg:PassiveSkillConfig;
    protected skill:PassiveSkillBase;
    protected triggerTimes:number = 0;
    //是否在cd中
    protected inCd:boolean = false;
    //是否超出限制次数
    protected exceedingLimits:boolean = false;
    private _checkCdFunc:Function;
    protected _nextTriggerTime:number = 0;
    protected _cd:number = 0;
    setData(owner:Creature , cfg:PassiveSkillConfig , skill:PassiveSkillBase) {
        this.owner = owner; 
        this.cfg = cfg;
        this.skill = skill;
        this._checkCdFunc = cfg.cd > 0 ? this.checkCd : this.none;
        this._cd = cfg.cd > 0 ? cfg.cd : 0;
    }

    onAdd() {


    }

    onRemove() {

    }

    onReset() {
        this.triggerTimes = 0;
        this._nextTriggerTime = GlobalVal.now  + this._cd;
        // Debug.logWar('PassiveTriggerBase onReset :' , this.cfg.id , this.owner.timer.frameIndex , this._cd , this._nextTriggerFrame );
    }


    protected onTrigger(param?:any):boolean {
        
        this._checkCdFunc();
        // Debug.logWar('onTrigger:' , this.inCd, this.exceedingLimits);
        if (this.skill && !this.inCd && !this.exceedingLimits) {
            this.skill.onTrigger(param);

            if (this.cfg.limitCount > 0 && this.cfg.limitType == 1) {
                this.triggerTimes ++;
                this.checkLimit();
                this.checkRemove();
            }
            return true;
        } 
        return false;
    }

    protected onTriggerStop() {
        this.skill.onTriggerStop();
    }

    protected checkCd() {
        this.inCd =  GlobalVal.now < this._nextTriggerTime;
        // Debug.logWar('checkCd:' , this._nextTriggerTime , 'this.inCd:' , this.inCd , GlobalVal.now);
        if (!this.inCd) {
            this._nextTriggerTime = GlobalVal.now + this._cd;
            Debug.log(TAG.SKILL ,  '_nextTriggerTime:' , this._nextTriggerTime , GlobalVal.now  , this._cd);
        }
    }

    protected checkLimit() {
        this.exceedingLimits = this.triggerTimes >= this.cfg.limitCount;
    }

    protected checkRemove() {

    }

    private none() {};

}