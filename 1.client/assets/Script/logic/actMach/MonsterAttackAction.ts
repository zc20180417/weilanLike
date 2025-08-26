
import { EActType } from "./ActMach";
import { BaseAction } from "./BaseAction";
import { LDSkillBase, ReleaseSkillData } from "../../ld/skill/LdSkillManager";
import GlobalVal from "../../GlobalVal";
import SysMgr from "../../common/SysMgr";
import { Handler } from "../../utils/Handler";
import { SKILLTYPE } from "../../net/socket/handler/MessageEnum";
import Game from "../../Game";
import SceneObject from "../sceneObjs/SceneObject";
import { EComponentType } from "../comps/AllComp";

import LDMonsterTargetAmmoComp from "../../ld/skill/monsterSkill/LDMonsterTargetAmmo";
import { MathUtils } from "../../utils/MathUtils";
import Creature from "../sceneObjs/Creature";
import { SoType } from "../sceneObjs/SoType";
import { ESoType } from "../sceneObjs/ESoType";
import { ChargeSkillComp } from "../../ld/skill/skillComps/ChargeSkillComp";


//状态基类
export class MonsterAttackAction extends BaseAction {

    private _startTime:number;
    private _skill:LDSkillBase;
    private _releaseSkillData:ReleaseSkillData;
    private _hitCount:number = 0;
    private _releaseTime:number = 0;
    private _isAmmoSkill:boolean;

    /**初始化 */
    init() {

    }
    /**开始 */
    start(param:ReleaseSkillData) {
        this._hitCount = 0;
        this._releaseTime = 0;
        this._startTime = GlobalVal.now;
        this._releaseSkillData = param;
        this._skill = param.skill as LDSkillBase;
        this._isAmmoSkill = this.isAmmoSkill();
        const scale = this._skill.actionScale > 0 ? this._skill.actionScale / 100 : 1;

        this.owner.animationComp.playAction(this._skill.actionName , this._skill.actionLoop == 1 ? true : false , scale);

        SysMgr.instance.doOnce(Handler.create(this.end , this) , this._skill.actionTime);
        if (this._skill.releaseTime == 0) {
            this.onReleaseTime();
        } else {
            SysMgr.instance.doOnce(Handler.create(this.onReleaseTime , this) , this._skill.releaseTime);
        }

        if (!this._isAmmoSkill) {
            SysMgr.instance.doOnce(Handler.create(this.onHitTimer , this) , this._skill.hitTime);
        }
    }

    private isAmmoSkill():boolean {
        return this._skill.skillType == SKILLTYPE.SKILLTYPE_TARGETTRAJECTORY || this._skill.skillType == SKILLTYPE.SKILLTYPE_DIRECTTRAJECTORY;
    }

    /**
     * 释放技能
     * @returns 
     */
    private onReleaseTime() {
        this._releaseTime ++;
        if (this._isAmmoSkill) {
            this.onCreateAmmo();
        } else if (this._skill.skillType == SKILLTYPE.SKILLTYPE_CHARGEE) {
            this.doChargeSkill();
        }

        if (this._releaseTime >= this._skill.releaseTimes) return;
        SysMgr.instance.doOnce(Handler.create(this.onReleaseTime , this) , this._skill.hitInterval);
    }

    private onHitTimer() {
        switch(this._skill.skillType) {
            case SKILLTYPE.SKILLTYPE_TARGET:
            case SKILLTYPE.SKILLTYPE_CHARGEE:
                if ((this.owner as Creature).type == ESoType.MONSTER ) {
                    Game.ldSkillMgr.monsterSkillHit(this._releaseSkillData);
                } else {
                    Game.ldSkillMgr.onSkillHit(null , this._releaseSkillData);
                }
                break;
        }

        this._hitCount ++;
        if (this._hitCount >= this._skill.hitCount) return;
        SysMgr.instance.doOnce(Handler.create(this.onHitTimer , this) , this._skill.hitInterval);
        
    }

    private onCreateAmmo() {
        const ammoDataConfig = Game.ldSkillMgr.getAmmoDataConfig(this._skill.ammoID);
        if (ammoDataConfig) {
            GlobalVal.tempVec2.x = this.owner.x;
            GlobalVal.tempVec2.y = this.owner.y + this.owner.size.height / 2;
            const ammo = this.createAmmo(ammoDataConfig.ammoEft);
            this.checkFilp(ammo , MathUtils.getAngle(GlobalVal.tempVec2.x , GlobalVal.tempVec2.y , this._releaseSkillData.tx , this._releaseSkillData.ty));
            const ammoComp = ammo.getAddComponent(EComponentType.LD_MONSTER_TARGET_AMMO) as LDMonsterTargetAmmoComp;
            ammoComp.moveTo(this._skill , ammoDataConfig , this._releaseSkillData);
        }
    }

    private createAmmo(ammoRes:string):SceneObject {
        let ammo:SceneObject = Game.soMgr.createAmmo(ammoRes);
        ammo.setPosNow(GlobalVal.tempVec2.x , GlobalVal.tempVec2.y);
        ammo.id = this._releaseSkillData.uid;
        return ammo;
    }

    private checkFilp(eft:SceneObject , angle:number) {
        if (angle>= 90 && angle <= 270) {
            eft.scaleX = -1;
            eft.rotation = angle - 180;
        } else {
            eft.scaleX = 1;
            eft.rotation = angle;
        }
    }

    //
    private doChargeSkill() {
        const comp:ChargeSkillComp = this.owner.getAddComponent(EComponentType.LD_CHARGE) as ChargeSkillComp;
        GlobalVal.tempVec2.x = this._releaseSkillData.tx;
        GlobalVal.tempVec2.y = this._releaseSkillData.ty;

        const temp:cc.Vec2 = cc.v2(this.owner.x , this.owner.y);
        let dir = cc.v2(0 , 0);
        dir = GlobalVal.tempVec2.sub(temp , dir);
        dir.normalizeSelf();
        comp.startCharge(this._skill , dir , this._releaseSkillData);
    }

    /**结束 */
    end() {
        SysMgr.instance.clearTimerByTarget(this);
        super.end();
    }

    /**取消 */
    cancel() {
        SysMgr.instance.clearTimerByTarget(this);
    }

    canChangeTo(actID:EActType):boolean {
        return true;
    }

    dispose() {
        Handler.dispose(this);
    }
}