import { EventEnum } from "../../../common/EventEnum";
import SysMgr from "../../../common/SysMgr";
import Game from "../../../Game";
import MathUtil from "../../../logic/map/MathUtil";
import { Monster } from "../../../logic/sceneObjs/Monster";
import { Tower } from "../../../logic/sceneObjs/Tower";
import { GameEvent } from "../../../utils/GameEvent";
import { Handler } from "../../../utils/Handler";
import { MathUtils } from "../../../utils/MathUtils";
import { LDSkillStrengthBase } from "../LdSkillManager";
import { HeroUltimateSkillBase } from "./HeroUltimateSkillBase";

export class HuoJianUltimateSkill extends HeroUltimateSkillBase {

    private _posX:number = 360;
    private _posY:number = 1000;
    private _dir:number = 1;
    private _target:Monster;

    onActiveSkill(skill: LDSkillStrengthBase): void {
        super.onActiveSkill(skill);
        if (!this._skill) return;

        this.doReleaseSkill();
    }


    protected doReleaseSkill() {
        const allHero = Game.soMgr.getAllTower();
        const len = allHero.length;
        let hero:Tower;
        this._dir = MathUtils.seedRandomConst() > 0.5 ? 1 : -1;

        const target = Game.soMgr.findTarget(cc.Vec2.ZERO_R , 2000 , this._skill.findTargetType , this.heroBuild.campId);
        this._posX = target? target.x : this._posX;
        this._posY = target? target.y : 1000;
        this._target = target as Monster;
        if (target) {
            target.once(EventEnum.ON_SELF_REMOVE , this.onTargetRemove , this);
        }

        for (let i = 0 ; i < len; i++) {
            hero = allHero[i];
            if (hero?.cfg?.ntroopsid === this._heroId && hero.camp == this.heroBuild.campId) {
                hero.getCurAction().cancel();
                Game.ldSkillMgr.releaseSkill(hero, null , this._posX , this._posY , this._skill);
            }
        }

        SysMgr.instance.doOnce(Handler.create(this.doReleaseSkill , this) , this._skill.cd);
        SysMgr.instance.doLoop(Handler.create(this.onRefreshPosX , this) , 30);

        SysMgr.instance.doLoop(Handler.create(this.tryAddShootTimes , this) , 400);
        SysMgr.instance.doOnce(Handler.create(this.onSkillEnd , this) , this._skill.hitTotalTime);
    }

    private onTargetRemove(target:Monster) {
        if (this._target === target) {
            this._target = null;
        }
    }

    private tryAddShootTimes() {
        const allHero = Game.soMgr.getAllTower();
        allHero.forEach(element => {
            if (element?.cfg?.ntroopsid === this._heroId) {
                element.emit(EventEnum.LD_ADD_SHOOT_TIMES );
            }
        });

    }

    private onRefreshPosX() {
        if (this._target && this._target.isDied) {
            this.removeTarget();
        }

        if (!this._target || !this._target.isDied) {
            this._target = Game.soMgr.findTarget(cc.Vec2.ZERO_R , 2000 , this._skill.findTargetType , this.heroBuild.campId) as Monster;
            if (this._target) {
                this._target.once(EventEnum.ON_SELF_REMOVE , this.onTargetRemove , this);
            }
        }

        if (this._target) {
            this._posX = this._target.x;
            this._posY = this._target.y;

        } else {
            this._posX += this._dir * 10;
            if (this._dir > 0 && this._posX > 700) {
                this._dir = -1;
            }
    
            if (this._dir < 0 && this._posX < 80) {
                this._dir = 1;
            }
            this._posY = 1000;
        }
        GameEvent.emit(EventEnum.REFRESH_HUOJIAN_POS , this._skill.skillID , this._posX , this._posY , this.heroBuild.campId);
    }

    private removeTarget() {
        if (this._target) {
            this._target.off(EventEnum.ON_SELF_REMOVE , this.onTargetRemove , this);
            this._target = null;
        }
    }

    private onSkillEnd() {
        this.removeTarget();
        SysMgr.instance.clearTimer(Handler.create(this.tryAddShootTimes , this));
        SysMgr.instance.clearTimer(Handler.create(this.onRefreshPosX , this));
    }

    
}