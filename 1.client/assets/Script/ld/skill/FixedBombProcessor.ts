
import { StrengthSkillType, ECamp } from "../../common/AllEnum";
import SysMgr from "../../common/SysMgr";
import Game from "../../Game";
import GlobalVal from "../../GlobalVal";
import { EComponentType } from "../../logic/comps/AllComp";
import { ERecyclableType } from "../../logic/Recyclable/ERecyclableType";
import SceneObject from "../../logic/sceneObjs/SceneObject";
import { Handler } from "../../utils/Handler";
import { MathUtils } from "../../utils/MathUtils";
import { BaseSkillProcessor } from "./BaseSkillProcessor";
import LdParabolicComp from "./skillComps/LdParabolicComp";


export default class FixedBombProcessor extends BaseSkillProcessor {
///////////////////////////////////////////////////////////////

    private _releaseTimes:number = 0;
    private _totalReleaseTimes:number = 0;
    // private _curSkill:LDSkillBase | SkillTriggerConfig;
    

    constructor() {
        super();
        this.key = ERecyclableType.FIXED_BOMB_PROCESSOR;
    }

    resetData() {
        this._skill = null;
        this._releaseSkillData = null;
        this._releaseTimes = 0;
        this._skillMainId = 0;
        this._heroBuilding = null;
    }



    protected doSkillStart(): void {
        this._totalReleaseTimes = this._skill['releaseTimes'] || 1;
        this._totalReleaseTimes += this._heroBuilding.getCommonStrengthPropValue(this._skillMainId  , StrengthSkillType.RELEASE_TIMES , this._releaseSkillData.heroUid);
        if (this._skill['releaseTime'] && this._skill['releaseTime'] > 0) {
            SysMgr.instance.doOnce(Handler.create(this.onReleaseTimer , this) , this._skill['releaseTime'] );
        } else {
            this.onReleaseTimer();
        }
    }


    private onReleaseTimer() {
        this._releaseTimes ++;
        const sx = this._releaseSkillData.sx ;
        const sy = this._releaseSkillData.sy ;
        let tox , toy ;
        GlobalVal.tempVec2.x = sx;
        GlobalVal.tempVec2.x = sx;
        let ammoConfig = Game.ldSkillMgr.getAmmoDataConfig(this._skill.ammoID);
        let count = 1 + this._heroBuilding.getCommonStrengthPropValue(this._skillMainId  , StrengthSkillType.SKILL_AMMO_COUNT , this._releaseSkillData.heroUid);
        for (let i = 0 ; i < count ; i++) {
            let ammo:SceneObject = this.createAmmo(ammoConfig.ammoEft);
            let comp:LdParabolicComp = ammo.getAddComponent(EComponentType.LD_PARRABLIC);
            if (this._releaseSkillData.tx == undefined) {

                tox = sx + MathUtils.randomInt(-this._skill.range , this._skill.range);
                toy = sy + MathUtils.randomInt(-this._skill.range , this._skill.range);
                toy = Math.max(toy , 10);

            } else {
                tox = this._releaseSkillData.tx;
                toy = this._releaseSkillData.ty;
            }

            comp.moveTo(this._releaseSkillData ,tox , toy);
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

    private createAmmo(ammoRes:string):SceneObject {
        let ammo:SceneObject = Game.soMgr.createAmmo(ammoRes);
        ammo.setPosNow(GlobalVal.tempVec2.x , GlobalVal.tempVec2.y);
        ammo.id = this._releaseSkillData.uid;
        return ammo;
    }
    
    /**整体结束 */
    // doSkillEnd() {
    //     GameEvent.off(EventEnum.EXIT_GAME_SCENE , this.onExitGameScene , this);
    //     super.doSkillEnd();
    //     this.dispose();
    // }

   

   


    protected onExitGameScene() {
        this.doSkillEnd();
    }
    
    
}