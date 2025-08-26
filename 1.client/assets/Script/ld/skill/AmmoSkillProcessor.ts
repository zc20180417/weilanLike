import { ECamp, StrengthSkillType } from "../../common/AllEnum";
import { SkillAmmoDataConfig, SkillTriggerConfig } from "../../common/ConfigInterface";
import { EventEnum } from "../../common/EventEnum";
import SysMgr from "../../common/SysMgr";
import Game from "../../Game";
import GlobalVal from "../../GlobalVal";
import { EComponentType } from "../../logic/comps/AllComp";
import { ERecyclableType } from "../../logic/Recyclable/ERecyclableType";
import SceneObject from "../../logic/sceneObjs/SceneObject";
import { SKILLTYPE } from "../../net/socket/handler/MessageEnum";
import { GameEvent } from "../../utils/GameEvent";
import { Handler } from "../../utils/Handler";
import { MathUtils } from "../../utils/MathUtils";
import { StringUtils } from "../../utils/StringUtils";
import { BaseSkillProcessor } from "./BaseSkillProcessor";
import LdDirAmmoComp from "./LdDirAmmoComp";
import { LDSkillBase } from "./LdSkillManager";
import LdTargetAmmoComp from "./skillComps/LdTargetAmmoComp";

export class AmmoSkillProcessor extends BaseSkillProcessor {
    

    ///////////////////////////////////////////////////////////////

    private _effect:SceneObject;
    private _angle:number = 0;
    private _releaseTimes:number = 0;
    private _totalReleaseTimes:number = 0;
    private _ammoDataConfig:SkillAmmoDataConfig;
    private _ammoAngle:number = 0;


    constructor() {
        super();
        this.key = ERecyclableType.DIR_AMMO_PROCESSOR;
    }

    resetData() {
        this._skill = null;
        this._releaseSkillData = null;
        this._effect = null;
        this._releaseTimes = 0;
        this._angle = 0;
        this._skillMainId = 0;
        this._ammoAngle = 0;
        this._heroBuilding = null;
    }

    protected doSkillStart(): void {
        this._totalReleaseTimes = this._skill['releaseTimes'] || 1;
        if (this._skill['releaseTimesRandom'] && this._skill['releaseTimesRandom'].length > 0) {
            this._totalReleaseTimes = MathUtils.randomInt(this._skill['releaseTimesRandom'][0] , this._skill['releaseTimesRandom'][1]);
        }
        this._totalReleaseTimes += (this._heroBuilding?.getCommonStrengthPropValue(this._skillMainId  , StrengthSkillType.RELEASE_TIMES , this._releaseSkillData.heroUid) || 0);
        this._ammoDataConfig = Game.ldSkillMgr.getAmmoDataConfig(this._skill.ammoID);
        this.createReleaseEffect();
        if (this._skill.hitTotalTime && this._skill.hitTotalTime > 0) {
            SysMgr.instance.doOnce(Handler.create(this.doSkillEnd , this) , this._skill['hitTotalTime'] );
        }
        GameEvent.on(EventEnum.REFRESH_HUOJIAN_POS , this.onRefreshTargetX , this);
        if (this._skill['releaseTime'] && this._skill['releaseTime'] > 0) {
            SysMgr.instance.doOnce(Handler.create(this.onReleaseTimer , this) , this._skill['releaseTime'] );
        } else {
            this.onReleaseTimer();
        }
    }

    private onRefreshTargetX(skillID:number , posX:number , posY:number , campId:ECamp) {
        if (campId == this._releaseSkillData.campId && this._skill.skillID == skillID) {
            this._releaseSkillData.tx = posX;
            this._releaseSkillData.ty = posY;
        }
    }

    private offsetList:number[][] = [[0 , 0] , [-30 , 0] , [30 , 0]];

    private onReleaseTimer() {
        this._releaseTimes ++;
        let sx = this._releaseSkillData.sx;
        let sy = this._releaseSkillData.sy;
        if (this._ammoDataConfig.randomX > 0) {
            sx += MathUtils.randomInt(-this._ammoDataConfig.randomX , this._ammoDataConfig.randomX);
        }

        if (this._ammoDataConfig.randomY > 0) {
            const dy = this._releaseSkillData.campId == ECamp.RED ? -1 : 1; 
            sy += (this._ammoDataConfig.randomY * dy);
        }


        let angle = 0;
        if(this._ammoDataConfig.randomAngle == 0) {
            angle = MathUtils.getAngle(sx , sy , this._releaseSkillData.tx , this._releaseSkillData.ty);
            //有角度
            if (this._skill.hitRangeValue1 > 0) {
                const startAngle = angle - ((this._totalReleaseTimes - 1) * this._skill.hitRangeValue1 ) * 0.5;
                angle = startAngle + (this._releaseTimes - 1) * this._skill.hitRangeValue1;
            }
        }

        let count = 1 + (this._heroBuilding?.getCommonStrengthPropValue(this._skillMainId  , StrengthSkillType.SKILL_AMMO_COUNT , this._releaseSkillData.heroUid) || 0);

        const ammoCompType = EComponentType.LD_DIR_AMMO;
        const ammoEft = this._heroBuilding?.getAmmoEft(this._skillMainId , this._releaseSkillData.heroUid);

        for (let i = 0 ; i < count ; i++) {
            GlobalVal.tempVec2.x = sx + this.offsetList[i][0];
            GlobalVal.tempVec2.y = sy + this.offsetList[i][1];
            let ammo:SceneObject = this.createAmmo(ammoEft || this._ammoDataConfig.ammoEft);

            if (this._ammoDataConfig.randomAngle == 1) {
                angle = (MathUtils.randomInt(this._skill.hitRangeValue1 , this._skill.hitRangeValue2) + 360) % 360;
            }

            this.checkFilp(ammo , angle);

            if (this._skill.skillType == SKILLTYPE.SKILLTYPE_DIRECTTRAJECTORY) {
                let dirAmmoComp:LdDirAmmoComp = ammo.getAddComponent(ammoCompType);
                let toPos = GlobalVal.tempVecRight.rotate(MathUtils.angle2Radian(angle)).normalize();
                // dirAmmoComp.setCamp(this._releaseSkillData.campId);
                dirAmmoComp.moveTo(toPos , this._skill ,this._releaseSkillData , angle);
            } else if (this._skill.skillType == SKILLTYPE.SKILLTYPE_TARGETTRAJECTORY) {
                let targetAmmoComp:LdTargetAmmoComp = ammo.getAddComponent(EComponentType.LD_TARGET_AMMO);
                targetAmmoComp.moveTo(this._releaseSkillData );
            }

        }

        if (this._releaseTimes < this._totalReleaseTimes) {
            if (this._skill.hitInterval > 0) {
                SysMgr.instance.doOnce(Handler.create(this.onReleaseTimer , this) , this._skill.hitInterval);
            } else {
                this.onReleaseTimer();
            }
        } else {
            this.doSkillEnd();
        }

    }

    private checkFilp(eft:SceneObject , angle:number) {
        if (this._ammoDataConfig.dontRotate == 1) return;
        if (angle>= 90 && angle <= 270) {
            eft.scaleX = -1;
            eft.rotation = angle - 180;
        } else {
            eft.scaleX = 1;
            eft.rotation = angle;
        }
    }

    private createAmmo(ammoRes:string):SceneObject {
        let ammo:SceneObject = Game.soMgr.createAmmo(ammoRes);
        ammo.setPosNow(GlobalVal.tempVec2.x , GlobalVal.tempVec2.y);
        ammo.id = this._releaseSkillData.uid;
        return ammo;
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

    protected createReleaseEffect() {
        let newEft = this._heroBuilding?.getNewEft(this._skillMainId);
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
            
        }
    }


    protected onExitGameScene() {
        if (this._effect) {
            this._effect.off(EventEnum.ON_SELF_REMOVE , this.onEffectRemoved , this); 
        }
        this.doSkillEnd();
    }


}