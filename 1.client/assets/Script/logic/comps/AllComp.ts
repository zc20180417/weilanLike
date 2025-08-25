import { Component } from "./Component";
import { ActMach } from "../actMach/ActMach";
import AnimationComp from "./animation/AnimationComp";
import EftAutoRemoveComp from "./logic/EftAutoRemoveComp";
import SoBindEffectComp from "./animation/SoBindEffectComp";
import { BloodComp } from "./logic/BloodComp";
import FadeOutComp from "./animation/FadeOutComp";
import LigatureSoComp from "./animation/LigatureSoComp";

import FadeInComp from "./animation/FadeInComp";
import MonsterFlyComp from "./logic/MonsterFlyComp";
import { CreatureBubbleComp } from "./ccc/CreatureBubbleComp";

import { CatFaceComp } from "./logic/CatFaceComp";
import { HitHighLightComp } from "./skill/HitHighLightComp";
import MonsterAutoComp from "../../ld/monster/MonsterAutoComp";
import MonsterMoveComp from "../../ld/monster/MonsterMoveComp";
import LDWalkComp from "../../ld/monster/LDWalkComp";
import LdHeroAutoAttackComp from "../../ld/tower/LdHeroAutoAttackComp";
import BuffContainerComp from "../../ld/skill/buff/BuffContainerComp";
import LdDirAmmoComp from "../../ld/skill/LdDirAmmoComp";
import LdParabolicComp from "../../ld/skill/skillComps/LdParabolicComp";
import { HeroTableHurtComp } from "./skill/HeroTableHurtComp";
import LDMonsterTargetAmmo from "../../ld/skill/monsterSkill/LDMonsterTargetAmmo";
import LDSommonAutoComp from "../../ld/monster/LDSommonAutoComp";
import CreaturePropMiniComp from "../../ld/prop/CreaturePropMiniComp";
import { ChargeSkillComp } from "../../ld/skill/skillComps/ChargeSkillComp";
import LdLightningComp from "../../ld/skill/skillComps/LdLightningComp";
import LdTargetAmmoComp from "../../ld/skill/skillComps/LdTargetAmmoComp";

/**组件类型枚举 */
export enum EComponentType {
    NONE,
    WALK,
    ACTMACH,
    RUNAWAY,
    ANIMATION,


    TARGET_AMMO,
    DIR_AMMO,
    FRAME_EFT_AUTO_REMOVE,
    AUTO_ATTACK,
    TOWER_PRO,
    SO_BIND_EFFECT,
    BLOOD,
    FADE_OUT_COMP,
    BUFF,
    LUOBOCOMP,
    /**连线 */
    LIGATURE,
    /**抛物线 */
    PARABOLIC,
    /**回旋镖 */
    BOOMERANG,
    /**萝卜血条 */
    LUOBO_BLOOD,
    /**蛇boss */
    SNAKE_AI,
    FADE_IN_COMP,
    LOGIN_MOVE,
    MOVE_TRANSPOET = 30,
    //YOUZIWANG = 31,
    TRANSFORMATION = 32,
    MONSTER_FLY,
    BUBBLE,
    SINK,
    MONSTER_DIR_AMMO,
    BLOCK_GRID,
    DIAN_SHI_CHENG_JIN,
    MU_BAN,
    ZHI_ZHU_LUAN,
    PVP_START_PATH_TIPS,
    PVP_OTHER_MONSTER_TIPS,
    FLOATING,
    CACTUS_AUTO_BOOM,
    FLLOW_MOVE,
    TO_TOWER_AMMO,
    TOWER_IDLE,
    CAT_FACE,
    HIT_HIGH_LIGHT,
    MONSTER_AUTO,
    MONSTER_MOVE,
    LD_WALK,
    LD_HERO_AUTO,
    LD_DIR_AMMO,
    LD_ROCKET_AMMO,
    LD_PARRABLIC,
    LD_MONSTER_AUTO,
    LD_HERO_TABLE_HURT,
    LD_MONSTER_TARGET_AMMO,
    LD_CREATURE_PROP,
    LD_SOMMON_AUTO,
    LD_CHARGE,
    LD_LIGHTNING,
    LD_TARGET_AMMO,
}

/**刷新的组件优先级枚举 */
export enum EFrameCompPriority {
    MIN = 1,
    LOGIN_MOVE = 2,
    WALK = 10,
    BIND_EFFECT = 9,
    AMMO = 15,
    PARABOLIC = 16,
    AUTO_ATTACK = 20,
    LIGATURE = 25,
    DEPTH = 30,
    SNAKE_AI = 31,
    SINK,
    HIT_HIGH_LIGHT,
    MAX = 100,
}

export class AllComp {
    private static _instance:AllComp = null;
    static get instance():AllComp {
        if (!AllComp._instance) {
            AllComp._instance = new AllComp();
        }
        return AllComp._instance;
    }

    init() {
        this.registerComp(EComponentType.ACTMACH , ActMach);
        this.registerComp(EComponentType.ANIMATION , AnimationComp);
        this.registerComp(EComponentType.FRAME_EFT_AUTO_REMOVE , EftAutoRemoveComp);
        this.registerComp(EComponentType.SO_BIND_EFFECT , SoBindEffectComp);
        this.registerComp(EComponentType.BLOOD , BloodComp);
        this.registerComp(EComponentType.FADE_OUT_COMP , FadeOutComp);
        this.registerComp(EComponentType.BUFF , BuffContainerComp);
        this.registerComp(EComponentType.LIGATURE , LigatureSoComp);

        this.registerComp(EComponentType.FADE_IN_COMP , FadeInComp);
        this.registerComp(EComponentType.MONSTER_FLY , MonsterFlyComp);
        this.registerComp(EComponentType.BUBBLE , CreatureBubbleComp);

        this.registerComp(EComponentType.CAT_FACE , CatFaceComp);
        this.registerComp(EComponentType.HIT_HIGH_LIGHT , HitHighLightComp);
        this.registerComp(EComponentType.MONSTER_AUTO , MonsterAutoComp);
        this.registerComp(EComponentType.MONSTER_MOVE , MonsterMoveComp);
        this.registerComp(EComponentType.LD_WALK , LDWalkComp);
        this.registerComp(EComponentType.LD_HERO_AUTO , LdHeroAutoAttackComp);
        this.registerComp(EComponentType.LD_DIR_AMMO , LdDirAmmoComp);
        this.registerComp(EComponentType.LD_PARRABLIC , LdParabolicComp);
        this.registerComp(EComponentType.LD_HERO_TABLE_HURT , HeroTableHurtComp);
        this.registerComp(EComponentType.LD_MONSTER_TARGET_AMMO , LDMonsterTargetAmmo);
        this.registerComp(EComponentType.LD_CREATURE_PROP , CreaturePropMiniComp);
        this.registerComp(EComponentType.LD_SOMMON_AUTO , LDSommonAutoComp);
        this.registerComp(EComponentType.LD_CHARGE , ChargeSkillComp);
        this.registerComp(EComponentType.LD_LIGHTNING , LdLightningComp);
        this.registerComp(EComponentType.LD_TARGET_AMMO , LdTargetAmmoComp);
        
    }

    getCompClass(type:EComponentType) {
        return this.m_compDic[type];
    }

    setPvpComp() {

        this.baseNetGameComp();
    }

    setCooperateComp() {

        this.baseNetGameComp();
    }

    resetComp() {
        this.registerComp(EComponentType.LIGATURE , LigatureSoComp);
        this.registerComp(EComponentType.BUFF , BuffContainerComp);
    }

    private baseNetGameComp() {

        this.registerComp(EComponentType.BUFF , BuffContainerComp);

    }

    private m_compDic:any = {};
    private registerComp<T extends Component>(type:EComponentType, compClass:{new(): T}) {
        this.m_compDic[type] = compClass;
    }


}

