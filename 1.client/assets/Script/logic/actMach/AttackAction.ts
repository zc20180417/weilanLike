import { BaseAction } from "./BaseAction";
import Creature from "../sceneObjs/Creature";
import { EActType } from "./ActMach";
import { EventEnum } from "../../common/EventEnum";
import AnimationComp, { EActionName } from "../comps/animation/AnimationComp";
import { EComponentType } from "../comps/AllComp";
import Game from "../../Game";
import { MathUtils } from "../../utils/MathUtils";
import GlobalVal from "../../GlobalVal";
import SysMgr from "../../common/SysMgr";
import { Handler } from "../../utils/Handler";
import { SKILLTYPE } from "../../net/socket/handler/MessageEnum";
import { LightningSkillProcessor } from "../comps/skill/LightningSkillProcessor";
import { GameEvent } from "../../utils/GameEvent";
import { LDSkillBase, ReleaseSkillData } from "../../ld/skill/LdSkillManager";
import { HeroBuilding } from "../../ld/tower/HeroBuilding";
import { StrengthSkillType } from "../../common/AllEnum";
import { AmmoSkillProcessor } from "../../ld/skill/AmmoSkillProcessor";
import { ObjPool } from "../Recyclable/ObjPool";
import { BaseSkillProcessor } from "../../ld/skill/BaseSkillProcessor";
import { BlinkToTargetProcessor } from "../../ld/skill/BlinkToTargetProcessor";
import { SkillBlinkAtkDataConfig } from "../../common/ConfigInterface";
import { NodeUtils } from "../../utils/ui/NodeUtils";
import { JianShengUltimateProcessor } from "../../ld/skill/JianShengUltimateProcessor";
import { SommonSkillProcessor } from "../../ld/skill/SommonSkillProcessor";

export class AttackAction extends BaseAction {

    private _skill:LDSkillBase;
    private _animationComp:AnimationComp;
    private _startPos:cc.Vec2 = cc.Vec2.ZERO;
    private _onReleaseTime:Handler;
    private _angle:number;
    private _attacktimes:number = 0;
    private _atkActionPlayEnd:boolean = false;
    private _releaseSkillData:ReleaseSkillData;
    private _target:Creature;
    private _addReleaseTime:number = 0;
    private _heroBulid:HeroBuilding;
    private _curProcessor:BaseSkillProcessor;
    private _waitProcrssorEnd:boolean = false;

    init() {
        this._onReleaseTime = new Handler(this.onReleaseTime , this);
        this.owner.on(EventEnum.ACTION_PLAY_END , this.onActionPlayEnd , this);
        this.owner.on(EventEnum.MAIN_BODY_ATTACHED , this.onMainBodyAttached , this);
        GameEvent.on(EventEnum.GAME_PAUSE , this.onGamePause , this);
        this._animationComp = this.owner.getComponent(EComponentType.ANIMATION);
    }

    start(param:ReleaseSkillData) {
        this._releaseSkillData = param;
        this._waitProcrssorEnd = false;
        this._skill = Game.ldSkillMgr.getSkillCfg(param.skillID);
        this._angle = MathUtils.getAngle(param.sx , param.sy , param.tx , param.ty);
        this._attacktimes = 0;
        this._atkActionPlayEnd = false;
        this._heroBulid = Game.ldNormalGameCtrl.getHeroBuildingCtrl(this.owner.camp).getHeroBuilding(param.heroId);
        this.doSkill();
    }

    canChangeTo(actID:EActType):boolean {
        if (actID == EActType.ATTACK) {
            return true;
        }
        return false;
    }

    end() {

        if (this.owner.mainBody) {
            NodeUtils.setColor(this.owner.mainBody , cc.Color.WHITE);
        }

        this.clear();
        super.end();
    }

    protected clear() {
        if (this._target) {
            this._target.off(EventEnum.ON_SELF_REMOVE , this.onSoRemove , this);
        }

        if (this._skill && this._skill.releaseTime > 0) {
            SysMgr.instance.clearTimer(this._onReleaseTime );
        } 

        if (this._curProcessor) {
            this._curProcessor.doSkillEnd();
            this._curProcessor = null;
        }

        this._waitProcrssorEnd = false;
        this._skill = null;
        this._target = null;
    }

    cancel() {
        this.clear();
        SysMgr.instance.clearTimerByTarget(this);
    }

    dispose() {
        SysMgr.instance.clearTimerByTarget(this);
        this.owner.off(EventEnum.ACTION_PLAY_END , this.onActionPlayEnd , this);
        this.owner.off(EventEnum.MAIN_BODY_ATTACHED , this.onMainBodyAttached , this);
        GameEvent.off(EventEnum.GAME_PAUSE , this.onGamePause , this);
        this._onReleaseTime = null;
        this._skill = null;
        this._target = null;
        this._startPos = null;
        this._animationComp = null;
        Handler.dispose(this);
    }

    private onGamePause(boo:boolean) {
        if (boo) {
            this._animationComp.stopAction();
        } else {
            this._animationComp.resumeAction();
        }
    }

    onSkillProcessorEnd(proccessor:BaseSkillProcessor) {
        if (this._curProcessor == proccessor) {
            this._waitProcrssorEnd = false;
            this._curProcessor = null;
            this.tryEnd();
        }
    }

    private onSoRemove(target:Creature) {
        if (this._target == target) {
            this.end();
            this._target = null;
        }
    }

    private doSkill() {
        if (!this._skill) {
            this.onEndTime();
            return;
        }
        if (this._skill.skillType == SKILLTYPE.SKILLTYPE_LIGHTNING) {
            this._target = Game.soMgr.getMonsterByGuid(this._releaseSkillData.targetId);
            if (!this._target) {
                this.onEndTime();
                return;
            }
            this._target.on(EventEnum.ON_SELF_REMOVE , this.onSoRemove , this);
        }
        
        let key = 'ATTACK';
        Object.keys(EActionName).forEach(element => {
            if (EActionName[element] == this._skill.actionName) {
                key = element;
            }
        });

        this._animationComp.playAction(EActionName[key] as unknown as EActionName , this._skill.actionLoop === 1);
        if (this._skill.skillType === SKILLTYPE.SKILLTYPE_BLINK_TARGET || this._skill.releaseTime == 0) {
            this.onReleaseTime();
        } else {
            SysMgr.instance.doOnce(this._onReleaseTime , this._skill.releaseTime);
        }



        this._atkActionPlayEnd = this._skill.actionLoop === 1;
    }


    private onReleaseTime() {
        this._attacktimes ++;

        this._addReleaseTime = this._heroBulid ? this._heroBulid.getCommonStrengthPropValue(this._skill.skillMainID , StrengthSkillType.RELEASE_TIMES , this.owner.id) : 0;

        this.initAttackPos();
        switch(this._skill.skillType) {
            case SKILLTYPE.SKILLTYPE_TARGETTRAJECTORY:
                this.createTargetAmmo();
                break;
            case SKILLTYPE.SKILLTYPE_DIRECTTRAJECTORY:
                this.createDirAmmo();
                break;
            case SKILLTYPE.SKILLTYPE_LIGHTNING:
                this.releaseLightning();
                break;
            case SKILLTYPE.SKILLTYPE_BLINK_TARGET:
                this.releaseBlinkToTarget();
                break;
            case SKILLTYPE.SKILLTYPE_JIAN_SHENG:
                this.releaseJianShengUltimateSkill();
                break;
            case SKILLTYPE.SKILLTYPE_SUMMON:
                this.releaseSommonSkill();
                break;
        }
        this.tryEnd();
    }

    private onActionPlayEnd(actName:string) {
        if (actName == EActionName.ATTACK || actName == EActionName.ATTACK1 || actName == EActionName.ATTACK2) {
            this._atkActionPlayEnd = true;
            this.tryEnd();
        }
    }

    private onMainBodyAttached() {
        //this._attackPos = null;
        //this._floatPos = null;
    }

    private onEndTime() {
        this.end();
    }

    private tryEnd() {
        if (this._attacktimes == 0 || this._atkActionPlayEnd == false || this._waitProcrssorEnd) {
            return;
        }
        this.end();
    }

    private createTargetAmmo() {
        
    }

    private createDirAmmo() {
        let processor:AmmoSkillProcessor = ObjPool.instance.getObj(AmmoSkillProcessor);
        const pos = this.getAttackPos();
        this._releaseSkillData.sx = pos.x;
        this._releaseSkillData.sy = pos.y;
        processor.action = this;
        this._curProcessor = processor;
        this._waitProcrssorEnd = true;
        processor.setData(this._releaseSkillData);
    }


    private getAttackPos(index:number = 0):cc.Vec2 {
        if (this._animationComp) {
            return this._animationComp.getAttackPos(index);
        }
        return cc.Vec2.ZERO_R;
    }

    private initAttackPos() {
        //this._attackPos = this.initPos(this._attackPos , "attackPos");
        let pos = this._animationComp.getAttackPos();
        GlobalVal.tempVec2.x = pos.x;
        GlobalVal.tempVec2.y = pos.y;
    }

    private releaseLightning() {
        this._waitProcrssorEnd = false;
        let processor:LightningSkillProcessor = ObjPool.instance.getObj(LightningSkillProcessor);
        const pos = this.getAttackPos(1);

        this._releaseSkillData.sx = pos.x;
        this._releaseSkillData.sy = pos.y;
        this._releaseSkillData.skill = this._skill;
        processor.setData(this._releaseSkillData , this._target);
        if (this._target) {
            this._target.off(EventEnum.ON_SELF_REMOVE , this.onSoRemove , this);
        }
        if (this._addReleaseTime > 0) {
            let ids = [this._target.id];
            for (let i = 0; i < this._addReleaseTime; i++) {
                const target = Game.soMgr.findTarget(this.owner.pos , this._skill.range , this._skill.findTargetType , this.owner.camp , ids);
                if (target) {
                    let processor:LightningSkillProcessor = ObjPool.instance.getObj(LightningSkillProcessor);
                    processor.setData(this._releaseSkillData , target);
                }
            }
        }
    }  

    private releaseBlinkToTarget() {
        let blinkAtkData:SkillBlinkAtkDataConfig = Game.ldSkillMgr.getBlinkAtkDataConfig(this._skill.blinkID);
        if (blinkAtkData) {
            this._waitProcrssorEnd = true;
            let processor:BlinkToTargetProcessor = ObjPool.instance.getObj(BlinkToTargetProcessor);
            processor.action = this;
            processor.setData(this._releaseSkillData);
            this._curProcessor = processor;

            if (this.owner.mainBody) {
                NodeUtils.setColor(this.owner.mainBody , cc.Color.YELLOW);
            }
        } else {
            this.end();
        }
    }

    private releaseJianShengUltimateSkill() {
        this._waitProcrssorEnd = false;
        let processor:JianShengUltimateProcessor = ObjPool.instance.getObj(JianShengUltimateProcessor);
        processor.action = this;
        processor.setData(this._releaseSkillData);
        this._curProcessor = processor;
    }
    
    private releaseSommonSkill() {
        this._waitProcrssorEnd = false;
        let processor:SommonSkillProcessor = ObjPool.instance.getObj(SommonSkillProcessor);
        processor.action = this;
        processor.setData(this._releaseSkillData);
        this._curProcessor = processor;
    }
}