import Creature from "./Creature";
import { ESoType } from "./ESoType";
import { MONSTER_TYPE, MONSTER_SHAPE, SCENETHING_TYPE } from "../../net/socket/handler/MessageEnum";
import SceneObject from "./SceneObject";

export class SoType {

    static GOLD_ITEM_ID1 = 401;
    static GOLD_ITEM_ID2 = 406;

    static isMonster(so:Creature):boolean {
        return so.type == ESoType.MONSTER ;
    }

    static isSommon(so:SceneObject):boolean {
        return so.type == ESoType.SOMMON ;
    }
    static isHeroTable(so:SceneObject):boolean {
        return so.type == ESoType.TOWER_TABLE ;
    }

    static isTower(so:SceneObject):boolean {
        return so.type == ESoType.TOWER;
    }
    /**是否是场景物件（包含传送门） */
    static isSceneItem(so:SceneObject):boolean {
        return so.type == ESoType.SCENE_ITEM;
    }
    /**是否是传送门 */
    static isTransport(so:Creature):boolean {
        return SoType.isSceneItem(so) && so.cfg && so.cfg.bttype == SCENETHING_TYPE.SCENETHING_TYPE_PORTAL;
    }
    /**是炸弹 */
    static isBomb(so:Creature,cfg?:any):boolean {
        let checkCfg = cfg || so.cfg;
        return SoType.isSceneItem(so) && checkCfg && checkCfg.bttype == SCENETHING_TYPE.SCENETHING_TYPE_BOMB;
    }
    
    /**是否是金库 */
    static isGoldItem(so:Creature,cfg?:any):boolean {
        let checkCfg = cfg || so.cfg;
        return SoType.isSceneItem(so) && checkCfg && (checkCfg.nthingid == this.GOLD_ITEM_ID1 || checkCfg.nthingid == this.GOLD_ITEM_ID2);
    }

    /**是否是普通场景物件 (包含炸弹)*/
    static isCommonSceneItem(so:Creature):boolean {
        return SoType.isSceneItem(so) && so.cfg && (so.cfg.bttype == SCENETHING_TYPE.SCENETHING_TYPE_GOODS || so.cfg.bttype == SCENETHING_TYPE.SCENETHING_TYPE_BOMB);
    }
    /**是否是BOSS */
    static isBoss(so:Creature):boolean {
        return SoType.isMonster(so) && so.cfg && so.cfg.bttype == MONSTER_TYPE.MONSTER_TYPE_BOSS;
    }

    /**是否是BOSS 或精英*/
    static isBossOrElite(so:Creature):boolean {
        return SoType.isMonster(so) && so.cfg && so.cfg.bttype == MONSTER_TYPE.MONSTER_TYPE_BOSS || so.cfg.bttype == MONSTER_TYPE.MONSTER_TYPE_ELITE;
    }
    /**是否是普通怪 */
    static isSmall(so:Creature):boolean {
        return SoType.isMonster(so) && so.cfg && so.cfg.btshapetype == MONSTER_SHAPE.MONSTER_SHAPE_NORMAL;
    }
    /**是否是远程怪*/
    static isRemote(so:Creature):boolean {
        return SoType.isMonster(so) && so.cfg && so.cfg.btshapetype == MONSTER_SHAPE.MONSTER_SHAPE_REMOTE; 
    }
    /**是否是飞行怪*/
    static isFly(so:Creature):boolean {
        return SoType.isMonster(so) && so.cfg && so.cfg.btshapetype == MONSTER_SHAPE.MONSTER_SHAPE_FLY; 
    }

    static isSpeed(so:Creature):boolean {
        return SoType.isMonster(so) && so.cfg && so.cfg.btshapetype == MONSTER_SHAPE.MONSTER_SHAPE_SPEED;
    }

    static isRou(so:Creature):boolean {
        return SoType.isMonster(so) && so.cfg && so.cfg.btshapetype == MONSTER_SHAPE.MONSTER_SHAPE_MEAT;
    }

    static isNormal(so:Creature):boolean {
        return SoType.isMonster(so) && so.cfg && so.cfg.bttype == MONSTER_TYPE.MONSTER_TYPE_NORMAL;
    }

    static isElite(so:Creature):boolean {
        return SoType.isMonster(so) && so.cfg && so.cfg.bttype == MONSTER_TYPE.MONSTER_TYPE_ELITE;
    }

}