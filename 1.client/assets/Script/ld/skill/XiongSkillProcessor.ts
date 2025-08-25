
import { EventEnum } from "../../common/EventEnum";
import SysMgr from "../../common/SysMgr";
import Game from "../../Game";
import { EComponentType } from "../../logic/comps/AllComp";
import SoBindEffectComp from "../../logic/comps/animation/SoBindEffectComp";
import BindSoComp from "../../logic/comps/ccc/BindSoComp";
import { ERecyclableType } from "../../logic/Recyclable/ERecyclableType";
import Creature from "../../logic/sceneObjs/Creature";
import SceneObject from "../../logic/sceneObjs/SceneObject";
import { Handler } from "../../utils/Handler";
import { StringUtils } from "../../utils/StringUtils";
import { BaseSkillProcessor } from "./BaseSkillProcessor";

export class XiongSkillProcessor extends BaseSkillProcessor {
    

    ///////////////////////////////////////////////////////////////

    private _effect:SceneObject;
    private _totalTime:number = 0;
    private _hitTimes:number = 0;
    private _angle:number = 0;
    private _owner:Creature;

    constructor() {
        super();        
        this.key = ERecyclableType.LD_XIONG_PROCESSOR;
    }

    resetData() {
        this._skill = null;
        this._releaseSkillData = null;
        this._effect = null;
        this._totalTime = 0;
        this._hitTimes = 0;
        this._angle = 0;
        this._heroBuilding = null;
        this._owner = null;
        super.resetData();
    }

    protected doSkillStart() {
        if (this._releaseSkillData.triggerCreatureId && this._releaseSkillData.triggerCreatureId > 0) {
            this._owner = Game.soMgr.getSommonByGuid(this._releaseSkillData.triggerCreatureId);
        }

        if (!this._owner) {
            this.doSkillEnd();
            return ;
        }

        this._owner.once(EventEnum.ON_SELF_REMOVE , this.onOwnerRemove , this);

        if (this._skill.hitTime && this._skill.hitTime > 0) {
            SysMgr.instance.doOnce(Handler.create(this.onHitTimer , this) , this._skill.hitTime );
        } else {
            this.onHitTimer();
        }

        if (this._skill.hitTotalTime &&  this._skill.hitTotalTime > 0) {
            this._totalTime = this._skill.hitTotalTime;
            SysMgr.instance.doOnce(Handler.create(this.doSkillEnd , this) , this._totalTime);
        }

        this.createReleaseEffect();

    }

    private onOwnerRemove() {
        this.doSkillEnd();
    }

    private onHitTimer() {
        this._hitTimes ++;
        this._releaseSkillData.tx = this._owner.x;
        this._releaseSkillData.ty = this._owner.y;
        this._releaseSkillData.sx = this._owner.x;
        this._releaseSkillData.sy = this._owner.y;
        Game.ldSkillMgr.onSkillHit(null , this._releaseSkillData);
        if (this._hitTimes == 1 && this._skill.hitInterval && this._skill.hitInterval > 0 && this._totalTime > 0) {
            SysMgr.instance.doLoop(Handler.create(this.onHitTimer , this) , this._skill.hitInterval);
        }
    }
        
    /**整体结束 */
    doSkillEnd() {
        if (this._effect) {
            this._effect.off(EventEnum.ON_SELF_REMOVE , this.onEffectRemoved , this); 
            Game.soMgr.removeEffect(this._effect);
            this._effect = null;
        }
        super.doSkillEnd();
    }

    private createReleaseEffect() {
        let newEft = this._heroBuilding.getNewEft(this._skillMainId);
        let releaseEff = StringUtils.isNilOrEmpty(newEft) ? this._skill.releaseEffect : newEft;
        if (!StringUtils.isNilOrEmpty(releaseEff)) {
            const bindSoComps:SoBindEffectComp = this._owner.getAddComponent(EComponentType.SO_BIND_EFFECT) as SoBindEffectComp;

            this._effect = bindSoComps.playEffect(releaseEff , true);
            this._effect.once(EventEnum.ON_SELF_REMOVE , this.onEffectRemoved , this); 
            if (this._angle > 0) {
                this._effect.rotation = this._angle;
            }
        }
    }

    private onEffectRemoved(so:SceneObject) {
        if (this._effect == so) {
            this._effect = null;
            if (!this._skill.hitTotalTime || this._skill.hitTotalTime <= 0) {
                this.doSkillEnd();
            }
        }
    }


    protected onExitGameScene() {
        if (this._effect) {
            this._effect.off(EventEnum.ON_SELF_REMOVE , this.onEffectRemoved , this); 
        }
        this.doSkillEnd();
    }


}