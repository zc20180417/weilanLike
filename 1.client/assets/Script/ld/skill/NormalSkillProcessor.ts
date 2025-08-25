import { SkillHitRangeType, StrengthSkillType } from "../../common/AllEnum";
import { EventEnum } from "../../common/EventEnum";
import SysMgr from "../../common/SysMgr";
import Game from "../../Game";
import { ERecyclableType } from "../../logic/Recyclable/ERecyclableType";
import SceneObject from "../../logic/sceneObjs/SceneObject";
import { Handler } from "../../utils/Handler";
import { MathUtils } from "../../utils/MathUtils";
import { StringUtils } from "../../utils/StringUtils";
import { BaseSkillProcessor } from "./BaseSkillProcessor";

export class NormalSkillProcessor extends BaseSkillProcessor {
    

    ///////////////////////////////////////////////////////////////

    private _effect:SceneObject;
    private _totalTime:number = 0;
    private _hitTimes:number = 0;
    private _angle:number = 0;

    constructor() {
        super();        
        this.key = ERecyclableType.NORMAL_SKILL_PROCESSOR;
    }

    resetData() {
        this._skill = null;
        this._releaseSkillData = null;
        this._effect = null;
        this._totalTime = 0;
        this._hitTimes = 0;
        this._angle = 0;
        this._heroBuilding = null;
        super.resetData();
    }

    protected doSkillStart() {
        if (this._skill.hitRangeType == SkillHitRangeType.RANDOM_ANGLE_RECT) {
            //随机角度
            const range = this._skill.hitRangeValue1;
            const angle = MathUtils.randomInt(0 , 360);
            const rotation = MathUtils.angle2Radian(angle);
            this._angle = angle;
            this._releaseSkillData.tx = this._releaseSkillData.sx + Math.cos(rotation) * range;
            this._releaseSkillData.ty = this._releaseSkillData.sy + Math.sin(rotation) * range;
        }
        this.createReleaseEffect();
        if (this._skill.hitTime && this._skill.hitTime > 0) {
            SysMgr.instance.doOnce(Handler.create(this.onHitTimer , this) , this._skill.hitTime );
        } else {
            this.onHitTimer();
        }

        if (this._skill.hitTotalTime &&  this._skill.hitTotalTime > 0) {
            this._totalTime = this._skill.hitTotalTime;
            if (this._heroBuilding) {
                this._totalTime += this._heroBuilding.getCommonStrengthPropValue(this._releaseSkillData.skillID , StrengthSkillType.DURATION , this._releaseSkillData.heroUid);
            } 
            SysMgr.instance.doOnce(Handler.create(this.doSkillEnd , this) , this._totalTime);
        }

    }

    private onHitTimer() {
        this._hitTimes ++;
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
            this._effect = Game.soMgr.createEffect(releaseEff , this._releaseSkillData.sx, this._releaseSkillData.sy , this._skill.releaseEffectLoop === 1);
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