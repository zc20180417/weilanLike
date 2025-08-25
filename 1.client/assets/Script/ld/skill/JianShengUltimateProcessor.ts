import { StrengthSkillType } from "../../common/AllEnum";
import SysMgr from "../../common/SysMgr";
import Game from "../../Game";
import GlobalVal from "../../GlobalVal";
import { ERecyclableType } from "../../logic/Recyclable/ERecyclableType";
import Creature from "../../logic/sceneObjs/Creature";
import { Monster } from "../../logic/sceneObjs/Monster";
import SceneObject from "../../logic/sceneObjs/SceneObject";
import { Handler } from "../../utils/Handler";
import { MathUtils } from "../../utils/MathUtils";
import { StringUtils } from "../../utils/StringUtils";
import { BaseSkillProcessor } from "./BaseSkillProcessor";
import { ReleaseSkillData } from "./LdSkillManager";

export class JianShengUltimateProcessor extends BaseSkillProcessor {
    
    ///////////////////////////////////////////////////////////////
    private _effectList:SceneObject[] = [];
    private _hitTimes:number = 0;
    private _releaseTimes:number = 1;
    private _curReleaseTime:number = 0;
    private _timeScale:number = 1;

    constructor() {
        super();        
        this.key = ERecyclableType.LD_JS_ULTIMATE_PROCESSOR;
    }

    resetData() {
        this._skill = null;
        this._releaseSkillData = null;
        this._effectList.length = 0;
        this._hitTimes = 0;
        this._heroBuilding = null;
        super.resetData();
    }

    setData(releaseSkillData:ReleaseSkillData , target?:Creature) {
        super.setData(releaseSkillData , target);
        if (!this._skill) this.onSkillEnd();
    }

    protected doSkillStart(): void {
        this._curReleaseTime = 0;
        this._releaseTimes = this._skill['releaseTimes'] || 1;
        let addTimes = this._heroBuilding.getCommonStrengthPropValue(this._skillMainId , StrengthSkillType.RELEASE_TIMES , this._releaseSkillData.heroUid);
        const multiple = 1 + (this._heroBuilding.getCommonStrengthPropValue(this._skillMainId , StrengthSkillType.RELEASE_TIMES_MULTIPLE , this._releaseSkillData.heroUid) || 0);
        this._releaseTimes = this._releaseTimes + addTimes * multiple;
        this._timeScale = this._releaseTimes / (this._skill['releaseTimes'] || 1);
        this.doRelease();
    }

    private doRelease() {
        this._curReleaseTime ++;
        this.refreshTarget();
        this.createReleaseEffect();
        if (this._skill.hitTime && this._skill.hitTime > 0) {
            SysMgr.instance.doOnce(Handler.create(this.onHitTimer , this) , this._skill.hitTime );
        } else {
            this.onHitTimer();
        }
        
        const tryEnd = this._curReleaseTime > this._releaseTimes
        const handler = !tryEnd ? Handler.create(this.doRelease , this) : Handler.create(this.onSkillEnd , this);
        const interval = !tryEnd ? this._skill.hitInterval / this._timeScale : 150;

        SysMgr.instance.doOnce(handler , interval);

    }

    private refreshTarget() {
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
        const target = Game.soMgr.findTarget(GlobalVal.tempVec2 , this._skill.range , this._skill.findTargetType , this._releaseSkillData.campId);
        if (target) {
            this.refreshSkillData(target);
        }
    }

    private refreshSkillData(target:SceneObject) {
        this._releaseSkillData.targetId = target.id;
        this._releaseSkillData.sx =  target.x + MathUtils.randomInt(-5 , 5);
        this._releaseSkillData.sy = target.y + MathUtils.randomInt(-5 , 5);
        this._releaseSkillData.tx =  target.x;
        this._releaseSkillData.ty = target.y;
    }

    private onHitTimer() {
        this._hitTimes ++;
        const target = Game.soMgr.getMonsterByGuid(this._releaseSkillData.targetId);
        Game.ldSkillMgr.onSkillHit(target  as Monster, this._releaseSkillData);
        if (this._hitTimes == 1 && this._skill.hitInterval && this._skill.hitInterval > 0 && this._skill.hitCount > 1 && this._skill.hitTotalTime > 0) {
            SysMgr.instance.doLoop(Handler.create(this.onHitTimer , this) , this._skill.hitInterval);
        }
    }

    //假结束
    doSkillEnd() {

    }
        
    /**真结束 */
    private onSkillEnd() {
        cc.log('start time:' , GlobalVal.now);
        super.doSkillEnd();
    }

    private createReleaseEffect() {
        if (!StringUtils.isNilOrEmpty(this._skill.hitRangeEft)) {
            Game.soMgr.createEffect(this._skill.hitRangeEft , this._releaseSkillData.sx, this._releaseSkillData.sy , false);
        }
    }

   
    protected onExitGameScene() {
        this.onSkillEnd();
    }


}