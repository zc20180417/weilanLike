import { ECamp } from "../common/AllEnum";
import { GS_SkillInfo_SkillInfoItem, GS_SkillInfo_SkillLevel } from "../net/proto/DMSG_Plaza_Sub_Troops";
import { Monster } from "./sceneObjs/Monster";

/**联网副本接口 */
export interface INetGame {

    /**创建怪物 */
    tryCreateMonster(pos: number, monsterId: number, x: number, y: number, bloodRatio: number, camp: ECamp): number

    /**获取怪物id */
    getMonsterUidBase(camp: ECamp, path: number): number

    /**受击 */
    tryHit(target: Monster, 
        skill: GS_SkillInfo_SkillInfoItem, 
        levelData: GS_SkillInfo_SkillLevel, 
        attackValue: number, 
        skillUid: number,
        penetrateAddDamage: number, 
        damageIndex: number);

    /**buff受击 */
    tryBuffDamage(targetUid: number, skillUid: number, damage: number, damageIndex: number);

    /**检测圆形伤害 */
    checkHitCircle(pos: cc.Vec2, range: number, attackValue: number, skillUid: number, skill: GS_SkillInfo_SkillInfoItem,
        levelData: GS_SkillInfo_SkillLevel, damageIndex: number, camp: ECamp);

    /**检测扇形伤害 */
    checkSector(pos: cc.Vec2, range: number, angle: number, attackValue: number, angleTotal: number, skillUid: number,
        skill: GS_SkillInfo_SkillInfoItem, levelData: GS_SkillInfo_SkillLevel, damageIndex: number, camp: ECamp);

    /**直线型伤害 */
    checkHitLine(pos: cc.Vec2, wid: number, range: number, rotation: number, attackValue: number, skillUid: number, skill: GS_SkillInfo_SkillInfoItem,
        levelData: GS_SkillInfo_SkillLevel, penetrateAddDamage: number, damageIndex: number, camp: ECamp);

    /**空地攻击 */
    tryHitEmpty(tx: number, ty: number, skill: GS_SkillInfo_SkillInfoItem, levelData: GS_SkillInfo_SkillLevel, attackValue: number, skillUid: number);
    
}