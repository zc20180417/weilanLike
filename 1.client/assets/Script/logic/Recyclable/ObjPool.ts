import { IRecyclable } from "./IRecyclable";
import { RecyclableObj } from "./RecyclableObj";
import { ERecyclableType } from "./ERecyclableType";
import SceneObject from "../sceneObjs/SceneObject";
import Creature from "../sceneObjs/Creature";
import SoBindEffectComp from "../comps/animation/SoBindEffectComp";
import EftAutoRemoveComp from "../comps/logic/EftAutoRemoveComp";
import { BloodComp } from "../comps/logic/BloodComp";
import FadeOutComp from "../comps/animation/FadeOutComp";
import MonsterFlyComp from "../comps/logic/MonsterFlyComp";
import { Monster } from "../sceneObjs/Monster";
import AnimationComp from "../comps/animation/AnimationComp";
import FadeInComp from "../comps/animation/FadeInComp";
import { CreatureBubbleComp } from "../comps/ccc/CreatureBubbleComp";


import LDWalkComp from "../../ld/monster/LDWalkComp";
import MonsterMoveComp from "../../ld/monster/MonsterMoveComp";
import LdHeroAutoAttackComp from "../../ld/tower/LdHeroAutoAttackComp";
import { AmmoSkillProcessor } from "../../ld/skill/AmmoSkillProcessor";
import { LightningSkillProcessor } from "../comps/skill/LightningSkillProcessor";
import { NormalSkillProcessor } from "../../ld/skill/NormalSkillProcessor";
import FixedBombProcessor from "../../ld/skill/FixedBombProcessor";
import { HeroTableHurtComp } from "../comps/skill/HeroTableHurtComp";
import { BlinkToTargetProcessor } from "../../ld/skill/BlinkToTargetProcessor";
import { Tower } from "../sceneObjs/Tower";
import { JianShengUltimateProcessor } from "../../ld/skill/JianShengUltimateProcessor";
import { XiongSkillProcessor } from "../../ld/skill/XiongSkillProcessor";
import CreaturePropMiniComp from "../../ld/prop/CreaturePropMiniComp";
import { SommonObj } from "../sceneObjs/SommonObj";
import { ChargeSkillComp } from "../../ld/skill/skillComps/ChargeSkillComp";
import LdLightningComp from "../../ld/skill/skillComps/LdLightningComp";
import LdTargetAmmoComp from "../../ld/skill/skillComps/LdTargetAmmoComp";

export class ObjPool {
    
    private static _instance:ObjPool = null;

    static get instance():ObjPool {
        if (ObjPool._instance == null) {
            ObjPool._instance = new ObjPool();
        }
        return ObjPool._instance;
    }

    private poolDic:any = {};
    private poolTypeDic:any = {};
    private countDic:any = {};
    private m_maxCount = 128;

    init() {
        this.registerPoolType(SceneObject ,ERecyclableType.SCENEOBJ);
        this.registerPoolType(Creature ,ERecyclableType.CREATURE);
        this.registerPoolType(Monster ,ERecyclableType.MONSTER);
        this.registerPoolType(SommonObj ,ERecyclableType.SOMMON);
        this.registerPoolType(Tower ,ERecyclableType.TOWER);
        this.registerPoolType(AnimationComp ,ERecyclableType.ANIMATION);
        this.registerPoolType(FadeInComp ,ERecyclableType.FADE_IN_REMOVE);
        this.registerPoolType(SoBindEffectComp , ERecyclableType.BIND_EFFECT);
        this.registerPoolType(EftAutoRemoveComp , ERecyclableType.EFT_AUTO_REMOVE);
        this.registerPoolType(BloodComp , ERecyclableType.BLOOD);
        this.registerPoolType(FadeOutComp , ERecyclableType.FADE_OUT_REMOVE);
        this.registerPoolType(MonsterFlyComp , ERecyclableType.MONSTER_FLY);
        this.registerPoolType(CreatureBubbleComp , ERecyclableType.BUBBLE);

        this.registerPoolType(LDWalkComp , ERecyclableType.LD_WALK);
        this.registerPoolType(MonsterMoveComp , ERecyclableType.LD_MONSTER_MOVE);
        this.registerPoolType(LdHeroAutoAttackComp , ERecyclableType.LD_HERO_AUTO);
        this.registerPoolType(AmmoSkillProcessor , ERecyclableType.DIR_AMMO_PROCESSOR);
        this.registerPoolType(LightningSkillProcessor , ERecyclableType.LIGATURE_PROCESSOR);
        this.registerPoolType(NormalSkillProcessor , ERecyclableType.NORMAL_SKILL_PROCESSOR);
        this.registerPoolType(FixedBombProcessor , ERecyclableType.FIXED_BOMB_PROCESSOR);
        this.registerPoolType(HeroTableHurtComp , ERecyclableType.LD_HEROTABLE_HURT);
        this.registerPoolType(CreaturePropMiniComp , ERecyclableType.LD_CREATURE_PROP);
        this.registerPoolType(BlinkToTargetProcessor , ERecyclableType.LD_BLINK_ATK_PROCESSOR);
        this.registerPoolType(JianShengUltimateProcessor , ERecyclableType.LD_JS_ULTIMATE_PROCESSOR);
        this.registerPoolType(XiongSkillProcessor , ERecyclableType.LD_XIONG_PROCESSOR);
        this.registerPoolType(ChargeSkillComp , ERecyclableType.LD_CHARGE);
        this.registerPoolType(LdLightningComp , ERecyclableType.LD_LIGHRNING);
        this.registerPoolType(LdTargetAmmoComp , ERecyclableType.LD_TARGET_AMMO);

    }

    /**注册对象池类型 */
    registerPoolType<T extends IRecyclable>(objClass:{new(): T} , type:ERecyclableType , count?:number) {
        this.poolTypeDic[objClass.toString()] = type;
        if (count)
            this.countDic[type] = count;
    }

    /**回收对象 */
    recycleObj(obj:IRecyclable) {
        let type = obj.key;
        let poolList:any[] = this.poolDic[type];
        if (!poolList) {
            poolList = [];
            this.poolDic[type] = poolList;
        }

        let count = this.countDic[type] || this.m_maxCount;
        if (poolList.length >= count) {
            obj.giveUp();
            obj = null;
            return;
        }

        if (poolList.indexOf(obj) == -1) {
            obj.resetData();
            poolList.push(obj);
        } else {
            cc.log("!!!!!!!!!!!");
        }

        
    }

    /**获取对象 */
    getObj<T extends IRecyclable>(objClass:{new(): T}): any {
        let type:ERecyclableType = this.poolTypeDic[objClass.toString()];
        let poolList:any[] = this.poolDic[type];
        if (!poolList || poolList.length < 1) {
            return new objClass();
        }

        let obj:IRecyclable = poolList.pop();
        obj.onRecycleUse();
        return obj;
    }

    /**释放某一类型对象池 */
    clearPool(type:ERecyclableType) {
        let list:RecyclableObj[] = this.poolDic[type]
        if (!list || list.length == 0) return;
        let len:number = list.length;
        for (let i = len - 1 ; i >= 0 ; i--) {
            list[i].giveUp();
        }
    }

    getObjs<T extends IRecyclable>(objClass:{new(): T}): any {
        let type:ERecyclableType = this.poolTypeDic[objClass.toString()];
        let poolList:any[] = this.poolDic[type];
        return poolList;
    }
}