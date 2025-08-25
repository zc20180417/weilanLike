import { SkillHitRangeType, StrengthSkillType } from "../../common/AllEnum";
import { SkillBlinkAtkDataConfig } from "../../common/ConfigInterface";
import { EventEnum } from "../../common/EventEnum";
import SysMgr from "../../common/SysMgr";
import Game from "../../Game";
import GlobalVal from "../../GlobalVal";
import { EComponentType } from "../../logic/comps/AllComp";
import AnimationComp from "../../logic/comps/animation/AnimationComp";
import { ERecyclableType } from "../../logic/Recyclable/ERecyclableType";
import Creature from "../../logic/sceneObjs/Creature";
import SceneObject from "../../logic/sceneObjs/SceneObject";
import { GameEvent } from "../../utils/GameEvent";
import { Handler } from "../../utils/Handler";
import { MathUtils } from "../../utils/MathUtils";
import { StringUtils } from "../../utils/StringUtils";
import { BaseSkillProcessor } from "./BaseSkillProcessor";
import { LDSkillBase, ReleaseSkillData } from "./LdSkillManager";

export class BlinkToTargetProcessor extends BaseSkillProcessor {
    

    ///////////////////////////////////////////////////////////////

    private _effectList:SceneObject[] = [];
    private _totalTime:number = 0;
    private _hitTimes:number = 0;
    private _angle:number = 0;
    private _blinkAtlData:SkillBlinkAtkDataConfig;
    private _creature:Creature;
    private _releaseTimes:number = 1;
    private _curReleaseTime:number = 0;
    private _timeScale:number = 1;

    private _releaseTime:number = 0;
    private _moveSpeedX:number = 0;
    private _moveSpeedY:number = 0;
    private _opacityValue:number;
    private _moveTime:number = 0;
    private _critAddReleaseTimes:number = 0;

    constructor() {
        super();        
        this.key = ERecyclableType.LD_BLINK_ATK_PROCESSOR;
    }

    resetData() {
        this._skill = null;
        this._releaseSkillData = null;
        this._effectList.length = 0;
        this._totalTime = 0;
        this._hitTimes = 0;
        this._angle = 0;
        this._moveTime = 0;
        this._critAddReleaseTimes = 0;
        this._heroBuilding = null;
        super.resetData();
    }

    protected doSkillStart() {
        this._blinkAtlData = Game.ldSkillMgr.getBlinkAtkDataConfig(this._skill['blinkID'] || 0);
        if (!this._blinkAtlData) return this.onSkillEnd();

        const releaseHero = Game.soMgr.getTowerByGuid(this._releaseSkillData.heroUid);
        if (!releaseHero) return this.onSkillEnd();

        this._curReleaseTime = 0;
        this._creature = Game.soMgr.createCreature(this._blinkAtlData.blinkModel);
        this._creature.setPosNow(releaseHero.x , releaseHero.y);
        this._creature.animationComp.setLevel(1);
        this._creature.opacity = 100;
        this._creature.once(EventEnum.ON_SELF_REMOVE , this.onCreatureRemove , this);

        //位移
        const releaseTime = this._skill['releaseTime'] || 100;
        this._moveSpeedX = (this._releaseSkillData.sx -releaseHero.x) / releaseTime;
        this._moveSpeedY = (this._releaseSkillData.sy -releaseHero.y) / releaseTime;
        this._opacityValue = 160 / releaseTime;
        this._releaseTime = releaseTime;
        
        this._releaseTimes = this._skill['releaseTimes'] || 1;
        this._releaseTimes += this._heroBuilding.getCommonStrengthPropValue(this._skillMainId , StrengthSkillType.RELEASE_TIMES , this._releaseSkillData.heroUid);
        const multiple = 1 + (this._heroBuilding.getCommonStrengthPropValue(this._skillMainId , StrengthSkillType.RELEASE_TIMES_MULTIPLE , this._releaseSkillData.heroUid) || 0);
        this._releaseTimes *= multiple;
        this._timeScale = this._releaseTimes / (this._skill['releaseTimes'] || 1);

        this.moveToTarget();        
    }

    private moveToTarget() {
        SysMgr.instance.doFrameLoop(Handler.create(this.onCreatureMove , this) , 1);
    }

    private onCreatureMove() {
        this._moveTime += GlobalVal.war_MDelta;
        if (this._creature) {
            this._creature.setPosNow(this._creature.x + (this._moveSpeedX * GlobalVal.war_MDelta) , this._creature.y + (this._moveSpeedY * GlobalVal.war_MDelta));
            this._creature.opacity += (this._opacityValue * GlobalVal.war_MDelta);
        }

        if (this._moveTime >= this._releaseTime) {
            SysMgr.instance.clearTimer(Handler.create(this.onCreatureMove , this));

            this._creature.setPosNow(this._releaseSkillData.sx , this._releaseSkillData.sy);
            this._creature.opacity = 255;
            this.doRelease();
        }
    }

    private doRelease() {
        this._curReleaseTime ++;
        this.refreshToPos();
        
        (this._creature.getAddComponent(EComponentType.ANIMATION) as AnimationComp).playAction(this._blinkAtlData.blinkAtkAction , false , (this._blinkAtlData.scale / 100) * this._timeScale);

        if (this._skill.hitTime && this._skill.hitTime > 0) {
            SysMgr.instance.doOnce(Handler.create(this.onHitTimer , this) , this._skill.hitTime );
        } else {
            this.onHitTimer();
        }
        if (this._skill.hitTotalTime &&  this._skill.hitTotalTime > 0) {
            this._totalTime = this._skill.hitTotalTime;
            if (this._heroBuilding) {
                this._totalTime += this._heroBuilding.getCommonStrengthPropValue(this._skillMainId , StrengthSkillType.DURATION , this._releaseSkillData.heroUid);
            } 
            SysMgr.instance.doOnce(Handler.create(this.onSkillEnd , this) , this._totalTime);
        }

        const handler = this._releaseTimes > 1 && this._curReleaseTime <= this._releaseTimes ? Handler.create(this.doRelease , this) : Handler.create(this.onSkillEnd , this);
        SysMgr.instance.doOnce(handler , (this._blinkAtlData.atkTime / this._timeScale));
    }

    private refreshToPos() {
        if (this._releaseSkillData.targetId > 0) {
            const target = Game.soMgr.getMonsterByGuid(this._releaseSkillData.targetId);
            if (target) {
                this.refreshSkillData(target);
            } else {
                this.resetTarget();
            }
        }
    }

    private resetTarget() {
        GlobalVal.tempVec2.x = this._releaseSkillData.sx;
        GlobalVal.tempVec2.y = this._releaseSkillData.sy;
        const target = Game.soMgr.findTarget(GlobalVal.tempVec2 , this._skill.hitRangeValue1 , this._skill.findTargetType , this._releaseSkillData.campId);
        if (target) {
            this.refreshSkillData(target);
        }
    }

    private refreshSkillData(target:SceneObject) {
        this._releaseSkillData.targetId = target.id;
        const flipX = target.x > this._releaseSkillData.sx ? false : true;
        this._angle = flipX ? 180 : 0;
        this._releaseSkillData.tx =  flipX ? this._releaseSkillData.sx - 1 : this._releaseSkillData.sx + 1;
        this._releaseSkillData.ty = this._releaseSkillData.sy;
        this._creature.animationComp.setAngle(this._angle);
    }

    private onHitTimer() {
        this.createReleaseEffect();
        this._hitTimes ++;
        const isCrit = Game.ldSkillMgr.onSkillHit(null , this._releaseSkillData);
        if (isCrit) {
            const critAddReleaseTimes = this._heroBuilding.getCommonStrengthPropValue(this._skillMainId , StrengthSkillType.CRITICAL_ADD_RELEASE_TIMES , this._releaseSkillData.heroUid);
            const limitTimes = this._heroBuilding.getCommonStrengthPropLimit(this._skillMainId , StrengthSkillType.CRITICAL_ADD_RELEASE_TIMES , this._releaseSkillData.heroUid);
            if (critAddReleaseTimes > 0 && (limitTimes == 0 || this._critAddReleaseTimes < limitTimes)) {
                this._critAddReleaseTimes ++;
                this._releaseTimes += critAddReleaseTimes;
            }
        }

    }

    //假结束
    doSkillEnd() {

    }

    private onCreatureRemove(so:SceneObject) {
        if (this._creature === so) {
            this._creature = null;
        }
    }
        
    /**真结束 */
    private onSkillEnd() {
        const len = this._effectList.length;
        if (len > 0) {
            for (let i = len - 1 ; i >= 0 ; i --) {
                this._effectList[i].off(EventEnum.ON_SELF_REMOVE , this.onEffectRemoved , this); 
                Game.soMgr.removeEffect(this._effectList[i]);
            }
            this._effectList.length = 0;
        }

        if (this._creature) {
            this._creature.off(EventEnum.ON_SELF_REMOVE , this.onCreatureRemove , this);
            this._creature.getAddComponent(EComponentType.FADE_OUT_COMP);
            // Game.soMgr.removeTower(this._creature);
            this._creature = null;
        }

        GameEvent.off(EventEnum.EXIT_GAME_SCENE , this.onExitGameScene , this);
        super.doSkillEnd();
        this.dispose();
    }

    private createReleaseEffect() {
        let newEft = this._heroBuilding.getNewEft(this._skillMainId);
        let releaseEff = StringUtils.isNilOrEmpty(newEft) ? this._skill.releaseEffect : newEft;
        if (!StringUtils.isNilOrEmpty(releaseEff)) {
            let effect = Game.soMgr.createEffect(releaseEff , this._releaseSkillData.sx, this._releaseSkillData.sy , this._skill.releaseEffectLoop === 1);
            effect.once(EventEnum.ON_SELF_REMOVE , this.onEffectRemoved , this); 
            if (this._angle > 0) {
                effect.rotation = this._angle;
            }
            this._effectList.push(effect);
        }
    }

    private onEffectRemoved(so:SceneObject) {
        const index = this._effectList.indexOf(so);
        if (index != -1) {
            this._effectList.splice(index , 1);
            // if (!this._skill.hitTotalTime || this._skill.hitTotalTime <= 0) {
            //     this.onSkillEnd();
            // }
        }
    }


    protected onExitGameScene() {
        const len = this._effectList.length;
        for (let i = 0 ; i < len ; i ++) {
            let effect = this._effectList[i];
            effect.off(EventEnum.ON_SELF_REMOVE , this.onEffectRemoved , this); 
        }

        if (this._creature) {
            this._creature.off(EventEnum.ON_SELF_REMOVE , this.onCreatureRemove , this);
        }

        this.onSkillEnd();
    }


}