import { EActType, ActMach } from "../actMach/ActMach";
import { MoveAction } from "../actMach/MoveAction";
import { DieAction } from "../actMach/DieAction";
import { IdleAction } from "../actMach/IdleAction";
import { AttackAction } from "../actMach/AttackAction";
import SceneObject from "./SceneObject";
import { ObjPool } from "../Recyclable/ObjPool";
import { EComponentType, EFrameCompPriority } from "../comps/AllComp";
import Creature from "./Creature";
import { MathUtils, Rect } from "../../utils/MathUtils";
import { EResPath } from "../../common/EResPath";
import Game from "../../Game";
import { TowerUtil } from "./TowerUtil";
import { ESoType } from "./ESoType";
import QuadTree from "../map/QuadTree";
import SysMgr from "../../common/SysMgr";
import { Handler } from "../../utils/Handler";
import GlobalVal from "../../GlobalVal";
import { NodePool } from "./NodePool";
import { EventEnum } from "../../common/EventEnum";
import AStar from "../map/AStar";
import { MonsterIdleAction } from "../actMach/MonsterIdleAction";
import { SoType } from "./SoType";
import { Monster } from "./Monster";
import { Tower } from "./Tower";
import SoBindEffectComp from "../comps/animation/SoBindEffectComp";
import { IdleAction2 } from "../actMach/IdleAction2";
import { StringUtils } from "../../utils/StringUtils";
import { ECamp, FindTargetType, GAME_TYPE, PropertyId } from "../../common/AllEnum";
import { GameEvent } from "../../utils/GameEvent";
import { HeroTable } from "../../ld/tower/HeroTable";
import LDWalkComp from "../../ld/monster/LDWalkComp";
import { HeroConfig, MonsterConfig } from "../../common/ConfigInterface";
import { MonsterAttackAction } from "../actMach/MonsterAttackAction";
import EftAutoRemoveComp from "../comps/logic/EftAutoRemoveComp";
import CreaturePropMiniComp from "../../ld/prop/CreaturePropMiniComp";
import { SommonObj } from "./SommonObj";
import { MonsterDefeatAction } from "../actMach/MonsterDefeatAction";
import { MonsterOnHitAction } from "../actMach/MonsterOnHitAction";
import { MonsterFlyEnterAction } from "../actMach/MonsterFlyEnterAction";
import { PassiveSkillUtil } from "../../ld/skill/passive/PassiveSkillUtil";
import { MonsterDeathRecoverAction } from "../actMach/MonsterDeathRecoverAction";



export class SoList {
    private _list: any[] = [];
    private _count: number = 0;
    create(type: ESoType): any {
        let so: SceneObject;

        switch (type) {
            case ESoType.SCENE_OBJ:
            case ESoType.EFFECT:
            case ESoType.AMMO:
                so = ObjPool.instance.getObj(SceneObject);
                break;
            case ESoType.CREATURE:
                so = ObjPool.instance.getObj(Creature);
                break;
            case ESoType.SCENE_ITEM:
            case ESoType.MONSTER:
                so = ObjPool.instance.getObj(Monster);
                break;
            case ESoType.SOMMON:
                so = ObjPool.instance.getObj(SommonObj);
                break;
            case ESoType.TOWER:
                so = ObjPool.instance.getObj(Tower);
                break;
            case ESoType.TOWER_TABLE:
                so = ObjPool.instance.getObj(HeroTable);
                break;

            default:
                break;
        }

        so.type = type;
        if (so.renderNode) {
            cc.log("!!!!!!!!!!!!!");
        }

        this._list.push(so);
        this._count++;
        return so;
    }

    remove(so: SceneObject) {
        let index = this._list.indexOf(so);
        if (index != -1) {
            this._list.splice(index, 1);
            this._count--;
            so.dispose();
            return true;
        }
        // cc.log("remove error ,index == -1");
        return false;
    }

    removeAll() {
        let so: SceneObject;
        for (let i = this._count - 1; i >= 0; i--) {
            so = this._list[i];
            so.dispose();
        }
        this._list = [];
        this._count = 0;
    }

    get list(): any[] {
        return this._list;
    }

    get len(): number {
        return this._count;
    }

    getSoByGuid(uid: number): any {
        let so: SceneObject;
        for (let i = this._count - 1; i >= 0; i--) {
            so = this._list[i];
            if (so.id == uid) {
                return so;
            }
        }
        return null;
    }

}

export default class SoManager {
    private static MONSTER_ID: number = 100000000;
    private static TOWER_ID: number = 200000000;
    private static EFT_ID: number = 300000000;
    private static TOWER_TABLE_ID = 400000000;
    private _nodePool: any = {};

    private _monsterActs: any = {};
    private _turretActs: any = {};

    private _sommonList:SoList = new SoList();
    private _monsterList: SoList = new SoList();
    private _towerTableList: SoList = new SoList();
    private _redTowerTableList: SoList = new SoList();
    //private 
    private _towerList: SoList = new SoList();
    private _ammoList: SoList = new SoList();
    private _effectList: SoList = new SoList();
    private _soList: SoList = new SoList();

    private _depthList: any[] = [];
    private _groupDic: any = {};


    //private _monsterCfg: any;
    private _monsterDesCfg: any;
    //private _transformationCfg: any;
    private _quadTree: QuadTree;

    private _normalQuadTree: QuadTree;
    private _pvpQuadTree: QuadTree;
    private _cooperateQuadTree: QuadTree;


    private _sommonContainer: cc.Node;
    private _towerContainer: cc.Node;
    private _monsterContainer: cc.Node;


    private _effectTopContainer: cc.Node;
    private _mapUIContainer: cc.Node;
    private _bloodNode: cc.Node;
    private _effectBottomContainer: cc.Node;
    private _towerTableContainer:cc.Node;
    private _towerTableContainerRed:cc.Node;

    private _refreshTreeHandler: Handler;
    private _refreshDepth: Handler;

    private _maxMonsterID: number = 0;
    private _maxTowerID: number = 0;
    private _maxEftID: number = 0;
    private _maxTowerTableID:number = 0;
    private _gridItems: any = {};
    luobo: Creature;
    _isMonsterVisible: boolean = true;

    constructor() {
        this.init();
    }

    private init() {

        this._monsterActs[EActType.IDLE] = MonsterIdleAction;
        this._monsterActs[EActType.MOVE] = MoveAction;
        this._monsterActs[EActType.DIE] = DieAction;
        this._monsterActs[EActType.ATTACK] = MonsterAttackAction;
        this._monsterActs[EActType.DEFEAT] = MonsterDefeatAction;
        this._monsterActs[EActType.HIT] = MonsterOnHitAction;
        this._monsterActs[EActType.FLY_ENTER] = MonsterFlyEnterAction;
        this._monsterActs[EActType.DEATH_RECOVER] = MonsterDeathRecoverAction;
        this._monsterActs.defaultActID = EActType.IDLE;


        this._turretActs[EActType.IDLE] = IdleAction;
        this._turretActs[EActType.IDLE2] = IdleAction2;
        this._turretActs[EActType.ATTACK] = AttackAction;
        this._turretActs.defaultActID = EActType.IDLE;

        this._maxMonsterID = SoManager.MONSTER_ID;
        this._maxTowerID = SoManager.TOWER_ID;
        this._maxEftID = SoManager.EFT_ID;
        this._maxTowerTableID = SoManager.TOWER_TABLE_ID;
        this._refreshTreeHandler = new Handler(this.refreshTreeHandler, this);
        this._refreshDepth = new Handler(this.refreshDepth, this);
        this._normalQuadTree = new QuadTree(new Rect(0, 0, 720, 1500));
        this._pvpQuadTree = new QuadTree(new Rect(0, 0, 720, 2600));
        this._cooperateQuadTree = new QuadTree(new Rect(0, 0, 720, 1500));

        GameEvent.on(EventEnum.ON_TOWER_LOADED, this.refreshTowerDepth, this);
        GameEvent.on(EventEnum.GAME_PAUSE, this.onGamePause, this);
        GameEvent.on(EventEnum.BEGIN_ITEM_CLICK, this.onBeginItemClick, this);
    }

    setGameType(type: GAME_TYPE) {
        switch (type) {
            case GAME_TYPE.PVP:
                // this._turretActs[EActType.ATTACK] = PvpAttackAction;
                break;
            case GAME_TYPE.COOPERATE:
                // this._turretActs[EActType.ATTACK] = CooperateAttackAction;
                break;

            default:
                this._turretActs[EActType.ATTACK] = AttackAction;
                break;
        }
    }

    initQuadTree(gameType: GAME_TYPE) {
        switch (gameType) {
            case GAME_TYPE.PVP:
                this._quadTree = this._pvpQuadTree;
                break;
            case GAME_TYPE.COOPERATE:
                this._quadTree = this._cooperateQuadTree;
                break;

            default:
                this._quadTree = this._normalQuadTree;
                break;
        }
        //this._quadTree = gameType == GAME_TYPE.PVP ? this._pvpQuadTree : this._normalQuadTree ;
    }

    onGamePause(state: boolean) {
        this._isMonsterVisible = true;
        if (!state) {//恢复
            this.changeMonsterVisible(this._isMonsterVisible, ECamp.BLUE);
        }
    }

    onBeginItemClick() {
        this._isMonsterVisible = !this._isMonsterVisible;
        this.changeMonsterVisible(this._isMonsterVisible, ECamp.BLUE);
    }

    changeMonsterVisible(visible: boolean, camp: ECamp = null) {
        let list: any = this._monsterList.list;
        list.forEach((element: Monster) => {
            if (element && (camp == null || element.camp == camp)) {
                element.visible = visible;
            }
        });
    }



    setContainer(monsterContainer: cc.Node,
        towerContainer: cc.Node,
        effectContainer: cc.Node,
        mapUIContainer: cc.Node,
        sommonContainer: cc.Node,
        effectBottomContainer: cc.Node,
        towerTableContainer:cc.Node , 
        towerTableContainerRed:cc.Node = null) {
        this._monsterContainer = monsterContainer;
        this._towerContainer = towerContainer;
        this._effectTopContainer = effectContainer;
        this._mapUIContainer = mapUIContainer;
        this._sommonContainer = sommonContainer;
        this._effectBottomContainer = effectBottomContainer;
        this._towerTableContainer = towerTableContainer;
        this._towerTableContainerRed = towerTableContainerRed;

        const bloodNode = new cc.Node('bloodNode');
        mapUIContainer.addChild(bloodNode);
        this._bloodNode = bloodNode;
        this.switchDepth(true);
    }

    private _tempPos:cc.Vec2 = cc.Vec2.ZERO;
    getMonsterWorldPos(pos:cc.Vec2):cc.Vec2 {
        return this._monsterContainer.convertToWorldSpaceAR(pos , this._tempPos);
    }

    getMonsterContainer():cc.Node {
        return this._monsterContainer;
    }

    /////////////////////////////////////////////////////////////////////////////form Server
    /////////////////////////////////////////////////////////////////////////////form Server


    /////////////////////////////////////////////////////////////////////////////

    createCityWall(node:cc.Node) {
        let table = this._towerTableList.create(ESoType.SCENE_ITEM);
        table.id = this._maxTowerTableID ++;
        table.type = ESoType.SCENE_ITEM;
        const x = node.x;
        const y = node.y;
        table.addTo(node.parent);
        table.setAttachGameObject(node);
        table.setSize(node.width , node.height);
        table.setPos(x , y);
        table.camp = ECamp.BLUE;
        return table;

    }


    private _refreshTableDepthFrames:number = 0;

    createHeroTable(gx:number , gy:number , camp:ECamp = ECamp.BLUE): HeroTable {
        const tableList = camp == ECamp.RED ? this._redTowerTableList : this._towerTableList;
        let table = tableList.create(ESoType.TOWER_TABLE);
        table.id = this._maxTowerTableID ++;
        table.addTo(camp == ECamp.RED ? this._towerTableContainerRed : this._towerTableContainer);
        table.type = ESoType.TOWER_TABLE;
        table.gx = gx;
        table.gy = gy;
        table.camp = camp;
        table.setAnchorY(0.5);
        table.setSize(87 , 110);
        table.setModelUrl(EResPath.CREATURE_SCENCE + "towerItem");
        this.setGridState(gx, gy, 75, 110, table.id);
        // if (gy > 0) {
        //     this._refreshTableDepthFrames = 3;
            this.refreshTableDepth();
        // }
        return table;
    }

    getHeroTabelByGuid(guid:number , campId:ECamp = ECamp.BLUE):HeroTable {
        return campId == ECamp.RED ? this._redTowerTableList.getSoByGuid(guid) : this._towerTableList.getSoByGuid(guid);
    }

    getAllHeroTables(campId:ECamp):HeroTable[] {
        return  campId == ECamp.RED ? this._redTowerTableList.list : this._towerTableList.list;
    }

    getAllSommons():Monster[] {
        return this._sommonList.list;
    }

    createPlayer(camp:ECamp = ECamp.BLUE): Tower {
        const id = 604;
        let cfg: HeroConfig = Game.gameConfigMgr.getHeroConfig(id);
        if (!cfg) {
            return null;
        }
        let so: Tower = ObjPool.instance.getObj(Tower);
        so.id = id;
        so.type = ESoType.TOWER;
        so.camp = camp;

        let actMach: ActMach = so.getAddComponent(EComponentType.ACTMACH) as ActMach;
        actMach.init(this._turretActs);
        so.addTo(this._towerContainer);
        so.level = 1;
        so.cfg = cfg;
        so.initAnimationComp(EComponentType.ANIMATION);
        so.animationComp.setAngle(GlobalVal.defaultAngle);
        so.animationComp.setLevel(1);
        let modelUrl: string = '';
        modelUrl = EResPath.CREATURE_TOWER + cfg.resName;
        so.setModelUrl(modelUrl);
        so.changeTo(EActType.IDLE2);

        //设置属性
        let prop:CreaturePropMiniComp = so.addComponentByType(EComponentType.LD_CREATURE_PROP) as CreaturePropMiniComp;
        prop.setPropertyBase(PropertyId.ATTACK , cfg.attack);
        prop.setPropertyBase(PropertyId.CRI_RATE , cfg.crit);
        so.prop = prop;
        return so;
    }

    private initMonster(so:Monster , cfg:MonsterConfig , bloodRate: number,uid:number = 0, camp: ECamp = ECamp.BLUE , parent:cc.Node = null) {
        this._depthList.push(so);
        let actMach: ActMach = so.getAddComponent(EComponentType.ACTMACH) as ActMach;
        so.getAddComponent(EComponentType.LD_WALK) as LDWalkComp;
        let propComp:CreaturePropMiniComp = so.getAddComponent(EComponentType.LD_CREATURE_PROP) as CreaturePropMiniComp;
        propComp.setPropertyBase(PropertyId.MAX_HP , Math.floor(cfg.ubasehp * bloodRate));
        propComp.setPropertyBase(PropertyId.SPEED , cfg.uspace);
        propComp.setPropertyBase(PropertyId.ATTACK , cfg.attack);
        propComp.setPropertyBase(PropertyId.CUR_HP_RATIO , bloodRate);

        so.prop = propComp;
        so.id = uid || this._maxMonsterID++;
        so.camp = camp;
        so.needCacheNode = true;
        actMach.init(this._monsterActs);

        if (parent) {
            so.addTo(parent);
        } else {
            if (SoType.isSommon(so)) {
                so.addTo(this._sommonContainer);
            } else {
                so.addTo(this._monsterContainer);
            }
        }

    
        so.cfg = cfg;
        so.name = cfg.szname;
        let scale = cfg.uscale > 0 ? cfg.uscale / 1000 : 1;
        so.scale = scale;
        so.setSize(cfg.hitWid * scale, cfg.hitHei * scale);
        so.initAnimationComp(EComponentType.ANIMATION);
        so.setModelUrl(EResPath.CREATURE_MONSTER + cfg.resName);
        so.changeTo(EActType.IDLE);

        
        this.startRefreshQuadTree();
    }

    /**
     * 创建一个召唤生物
     *
     * @param cfgID 生物的配置ID
     * @param bloodRate 生物的血量比例（0-1）
     * @param camp 生物的阵营，默认为蓝色方（ECamp.BLUE）
     * @returns 返回创建的生物对象（Monster），如果配置ID不存在则返回undefined
     */
    createSommonCreature(cfgID: number, bloodRate: number, camp: ECamp = ECamp.BLUE): SommonObj {
        let cfg: MonsterConfig = Game.monsterManualMgr.getMonsterCfg(cfgID);
        if (!cfg) {
            cc.error("not found monster:" + cfgID);
            return;
        }
        let so: SommonObj = this._sommonList.create(ESoType.SOMMON);
        this.initMonster(so , cfg, bloodRate ,0, camp);
        so.addComponentByType(EComponentType.LD_SOMMON_AUTO);
        so.prop.setPropertyBase(PropertyId.ATTACK , Math.floor(cfg.attack * bloodRate));
        if (!StringUtils.isNilOrEmpty(cfg.bloodPath)) {
            so.addComponentByType(EComponentType.BLOOD);
        }
        return so;
    }

    /**
     * 创建怪物
     *
     * @param cfgID 怪物的配置ID
     * @param bloodRate 怪物的初始血量百分比
     * @param uid 玩家的唯一标识（可选）
     * @param camp 怪物的阵营，默认为ECamp.BLUE
     * @returns 返回创建的怪物对象
     */
    createMonster(cfgID: number, bloodRate: number, uid?: number, camp: ECamp = ECamp.BLUE , parent:cc.Node = null): Monster {
        let cfg: MonsterConfig = Game.monsterManualMgr.getMonsterCfg(cfgID);
        if (!cfg) {
            cc.error("not found monster:" + cfgID);
            return;
        }
        let so: Monster = this._monsterList.create(ESoType.MONSTER);
        this.initMonster(so , cfg, bloodRate , uid , camp , parent);

        if (cfg.props) {
            for (const key in cfg.props) {
                if (Object.prototype.hasOwnProperty.call(cfg.props, key)) {
                    const element = cfg.props[key];
                    so.prop.setPropertyBase(element[0] , element[1]);
                }
            }
        }

        this._quadTree.insert(so);
        let desCfg = this.getMonsterDes(cfgID);
        if (desCfg && desCfg.isBoss) {
            GameEvent.emit(EventEnum.READY_SHOW_BOSS_DES, desCfg);
        }
        if (SoType.isBoss(so)) {
            GameEvent.emit(EventEnum.CREATE_BOSS);
        }
        if (!StringUtils.isNilOrEmpty(cfg.bloodPath)) {
            so.addComponentByType(EComponentType.BLOOD);
        }
        GameEvent.emit(EventEnum.CREATE_MONSTER, so);
        return so;
    }

    /**
     * 变身
     * @param so 
     * @param cfgID 
     */
    changeMonsterModel(so: Creature, cfgID: number) {
        let cfg = Game.monsterManualMgr.getMonsterCfg(cfgID);
        if (!cfg) {
            return;
        }

        so.emit(EventEnum.ON_SO_TRANSFORM);

        let opacity = so.mainBody ? so.mainBody.opacity : 255;

        let actionName = so.animationComp ? so.animationComp.getCurActionName() : null;
        so.removeComponentByType(EComponentType.ANIMATION);
        so.name = cfg.szname;
        (so as Monster).transformCfg = cfg;
        so.setModelUrl(EResPath.CREATURE_MONSTER + cfg.resName);
        so.initAnimationComp(EComponentType.ANIMATION);

        if (so.mainBody) {
            so.mainBody.opacity = opacity;
        }

        if (actionName) {
            so.animationComp.playAction(actionName, true);
        }

        let scale = cfg.uscale > 0 ? cfg.uscale / 1000 : 1;
        so.scale = scale;
    }

    removeMonster(so: Creature) {
        this._quadTree.remove(so);
        let index = this._depthList.indexOf(so);
        if (index != -1) {
            this._depthList.splice(index, 1);
        }

        let flag: boolean;
        flag = this._monsterList.remove(so);
        if (flag && this._monsterList.len == 0) {
            this.stopRefreshQuadTree();
            //GameEvent.emit(EventEnum.MONSTER_CLEAR);
        }
        return flag;
    }

    removeSommon(so: Creature) {
        this._quadTree.remove(so);
        let index = this._depthList.indexOf(so);
        if (index != -1) {
            this._depthList.splice(index, 1);
        }
        this._sommonList.remove(so);
    }

    getAllMonster(): any[] {
        return this._monsterList.list;
    }

    getAllTower(): any[] {
        return this._towerList.list;
    }

    getTowerCount(): number {
        return this._towerList.len;
    }

    getTowerByGuid(uid: number) {
        return this._towerList.getSoByGuid(uid);
    }

    getMonsterByGuid(uid: number): Creature {
        return this._monsterList.getSoByGuid(uid);
    }

    getEnemyByGuid(uid: number): Monster {
        let target = this.getMonsterByGuid(uid);
        return target as Monster;
    }

    getSommonByGuid(uid: number): Monster {
        return this._sommonList.getSoByGuid(uid);
    }

    createUITower(id: number, level: number, gx: number, gy: number,container?:cc.Node ,autoAttack:boolean = false , ): Creature {
        let cfg: HeroConfig = Game.gameConfigMgr.getHeroConfig(id);
        if (!cfg) {
            return null;
        }
        let so: Tower = this._towerList.create(ESoType.TOWER);
        so.needCacheNode = true;
        so.id = this._maxTowerID++;
        so.type = ESoType.TOWER;
        let actMach: ActMach = so.getAddComponent(EComponentType.ACTMACH) as ActMach;
        actMach.init(this._turretActs);
        so.addTo(container || this._towerContainer);
        so.cfg = cfg;
        so.level = level;
        so.gx = gx;
        so.gy = gy;
        so.initAnimationComp(EComponentType.ANIMATION);
        so.animationComp.setAngle(GlobalVal.defaultAngle);
        so.animationComp.setLevel(1);
        let modelUrl: string = '';
        modelUrl = EResPath.CREATURE_TOWER + cfg.resName + '_' + level;
        so.setModelUrl(modelUrl);
        so.changeTo(EActType.IDLE2);
        so.setPosNow(GlobalVal.toMapMidPos(gx), GlobalVal.toMapMidPos(gy));
        if (autoAttack) {
            so.addComponentByType(EComponentType.AUTO_ATTACK);
        } else {
            so.removeComponentByType(EComponentType.AUTO_ATTACK);
        }
        return so;
    }



    createTowerById(id: number, gx: number, gy: number, camp: ECamp = ECamp.BLUE, uid?: number): Creature {
        let type: number = TowerUtil.getType(id);
        let quality = TowerUtil.getQualityID(id);
        let level = TowerUtil.getLevelID(id);
        return this.createTower(TowerUtil.getTowerMainID(type, quality), level, gx, gy, camp, uid);
    }

    createCreature(url:string):Creature {
        let so: Tower = this._towerList.create(ESoType.TOWER);
        so.needCacheNode = true;
        so.id = this._maxTowerID++;
        so.type = ESoType.TOWER;
        so.addTo(this._towerContainer);
        so.initAnimationComp(EComponentType.ANIMATION);
        so.setModelUrl(EResPath.CREATURE_TOWER + url);
        return so;
    }

    createTower(id: number, level: number, gx: number, gy: number, camp: ECamp = ECamp.BLUE, uid?: number): Creature {
        let cfg: HeroConfig = Game.gameConfigMgr.getHeroConfig(id);
        if (!cfg) {
            return null;
        }
        let so: Tower = this._towerList.create(ESoType.TOWER);
        so.camp = camp;
        so.needCacheNode = true;
        so.id = uid || this._maxTowerID++;
        so.type = ESoType.TOWER;
        let actMach: ActMach = so.getAddComponent(EComponentType.ACTMACH) as ActMach;
        actMach.init(this._turretActs);
        so.addTo(this._towerContainer);
        so.cfg = cfg;
        so.level = level;
        so.gx = gx;
        so.gy = gy;
        this.setGridState(gx, gy, 75, 75, so.id);
        so.initAnimationComp(EComponentType.ANIMATION);
        // so.levelData = null;
        so.animationComp.setAngle(GlobalVal.defaultAngle);
        so.animationComp.setLevel(1);

        let modelUrl: string = '';
        modelUrl = EResPath.CREATURE_TOWER + cfg.resName + '_' + level;
        so.setModelUrl(modelUrl);
        so.changeTo(EActType.IDLE);
        if (!uid) {
            so.addComponentByType(EComponentType.LD_HERO_AUTO);
        }
        //设置属性
        let prop:CreaturePropMiniComp = so.addComponentByType(EComponentType.LD_CREATURE_PROP) as CreaturePropMiniComp;
        prop.setPropertyBase(PropertyId.ATTACK , cfg.attack);
        prop.setPropertyBase(PropertyId.CRI_RATE , cfg.crit);


        so.prop = prop;
        //看看是不是正在放全屏技能
        GameEvent.emit(EventEnum.CREATE_TOWER_ALL, gx, gy, so);
        return so;
    }

    /**创建一个弹道 */
    createAmmo(name: string): SceneObject {
        let so: SceneObject = this._ammoList.create(ESoType.AMMO);
        so.name = name;
        so.needCacheNode = true;

        so.addTo(this._effectTopContainer);
        if (!StringUtils.isNilOrEmpty(name)) {
            so.setModelUrl(EResPath.SCENCE_EFFECT + name);
        }
        so.type = ESoType.AMMO;
        return so;
    }

    /**创建一个特效 */
    createEffect(name: string, posX: number, posY: number, isLoop: boolean, container?: cc.Node): SceneObject {
        let so: SceneObject = this._effectList.create(ESoType.EFFECT);
        so.name = name;
        so.needCacheNode = true;
        so.type = ESoType.EFFECT;
        so.addTo(container || this._effectTopContainer);
        so.id = this._maxEftID++;

        so.setPosNow(posX, posY);
        so.setModelUrl(EResPath.SCENCE_EFFECT + name);

        const comp:EftAutoRemoveComp = so.addComponentByType(EComponentType.FRAME_EFT_AUTO_REMOVE) as EftAutoRemoveComp;
        comp.play(isLoop);
        
        return so;
    }

    /**创建一个UI特效 */
    createUIEffect(name: string, posX: number, posY: number, isLoop: boolean, container: cc.Node): SceneObject {
        let so: SceneObject = new SceneObject();
        so.name = name;
        so.needCacheNode = false;
        so.type = ESoType.EFFECT;
        so.addTo(container);

        so.setPosNow(posX, posY);
        so.setModelUrl(EResPath.SCENCE_EFFECT + name);

        if (!isLoop) {
            so.addComponentByType(EComponentType.FRAME_EFT_AUTO_REMOVE);
        }
        return so;
    }

    createUpgradeLevelEffect(gx: number, gy: number) {
        this.createEffect("upgradeLevel", GlobalVal.toMapMidPos(gx), GlobalVal.toMapPos(gy), false);
    }

    playBindSoEffect(so: SceneObject, name: string, isloop: boolean = false): SceneObject {
        let bind: SoBindEffectComp = so.getAddComponent(EComponentType.SO_BIND_EFFECT);
        return bind.playEffect(name, isloop);
    }

    /**创建一个人畜无害的场景对象 */
    createSo(posX: number, posY: number, isEffect: boolean = false): SceneObject {
        let so: SceneObject = this._soList.create(ESoType.SCENE_OBJ);
        so.needCacheNode = true;
        so.addTo(isEffect ? this._effectTopContainer : this._monsterContainer);
        so.setPosNow(posX, posY);
        so.type = ESoType.SCENE_OBJ;

        if (!isEffect) {
            this._depthList.push(so);
        }


        return so;
    }

    addMapUINode(node: cc.Node) {
        this._mapUIContainer.addChild(node);
    }

    addBlood(node: cc.Node) {
        if (!node.isValid) return;
        this._bloodNode.addChild(node);
    }

    getMonsterDes(id: number): any {
        return this._monsterDesCfg[id];
    }

    /*
    getTransformationCfg(id: number): any {
        return this._transformationCfg[id];
    }
    */

    removeAmmo(so: SceneObject): boolean {
        if (!so) {
            cc.log("error removeAmmo not so");
        }
        return this._ammoList.remove(so);
    }

    removeEffect(so: SceneObject): boolean {
        return this._effectList.remove(so);
    }

    removeSo(so: SceneObject) {

        switch (so.type) {
            case ESoType.EFFECT:
                this.removeEffect(so);
                break;
            case ESoType.AMMO:
                this.removeAmmo(so);
                break;
            case ESoType.SCENE_OBJ:
                this._soList.remove(so);
                break;
            case ESoType.MONSTER:
                this.removeMonster(so as Creature);
                break;
            case ESoType.SOMMON:
                this.removeSommon(so as Creature);
                break;
            case ESoType.TOWER:
                this.removeTower(so as Creature);
                break;
        
            default:
                break;
        }
    }

    removeTower(so: Creature): boolean {
        (so as Tower).isCreated = false;
        GameEvent.emit(EventEnum.REMOVE_TOWER, so);
        return this._towerList.remove(so);
    }

    removeUITower(so:Creature):boolean {
        return this._towerList.remove(so);
    }


    removeAllSo() {
        this._towerList.removeAll();
        this._monsterList.removeAll();
        this._sommonList.removeAll();
        this._towerTableList.removeAll();
        this._redTowerTableList.removeAll();
        this._ammoList.removeAll();
        this._soList.removeAll();
        this._effectList.removeAll();
        this._gridItems = {};
    }


    clearAll() {
        this.switchDepth(false);
        this.removeAllSo();
        this._depthList.length = 0;
        this._groupDic = {};
        this._gridItems = {};
        if (this._quadTree) {
            this._quadTree.removeAll();
        }
        if (this.luobo) {
            this.luobo = null;
        }
        this._maxMonsterID = SoManager.MONSTER_ID;
        this._maxTowerID = SoManager.TOWER_ID;
        this._maxEftID = SoManager.EFT_ID;
        this._maxTowerTableID = SoManager.TOWER_TABLE_ID;
        this.stopRefreshQuadTree();
        this.clearAllPool();
    }

    switchDepth(flag: boolean) {
        if (flag) {
            SysMgr.instance.registerUpdate(this._refreshDepth, EFrameCompPriority.DEPTH);
        } else {
            SysMgr.instance.unRegisterUpdate(this._refreshDepth);
        }
    }

    getEffectBottomContainer(): cc.Node {
        return this._effectBottomContainer;
    }

    getEffectTopContainer(): cc.Node {
        return this._effectTopContainer;
    }

    get groupDic() {
        return this._groupDic;
    }

    private _tempDic: any = {};

    /**
     * 获取矩形内所有的怪(矩形与矩形相交)
     * @param rect 矩形
     * @param excludeID 排除的id列表
     * @param dontCheckHit 是否要做矩形碰撞检测，如果不做，反回的只是四叉树检测的，可能包涵范围外的
     */
    getRectMonsters(rect: Rect, campId:ECamp ,excludeID?: number[], dontCheckHit: boolean = true): any[] {

        /**防止重复 */
        this._tempDic = {};
        let len = 0;
        if (excludeID) {
            len = excludeID.length;
            for (let i = 0; i < len; i++) {
                this._tempDic[excludeID[i]] = true;
            }
        }

        let soList: SceneObject[] = this._quadTree.retrieve(rect);
        len = soList.length;
        let i = 0;
        let temps: any[] = [];
        let so: SceneObject;
        for (i = len - 1; i >= 0; i--) {
            so = soList[i];
            if ((!GlobalVal.checkSkillCamp || so.camp == campId) && !this._tempDic[so.id] && (dontCheckHit || MathUtils.intersects(so.rect, rect))) {
                temps.push(so);
                this._tempDic[so.id] = true;
            }
        }
        return temps;
    }

    /**
     * 获取矩形内所有的怪(矩形与点相交,怪物只取脚底点)
     * @param rect 
     */
    getRectPointMonsters(rect: Rect, excludeID?: number[]): any[] {
        /**防止重复 */
        this._tempDic = {};
        let len = 0;
        if (excludeID) {
            len = excludeID.length;
            for (let i = 0; i < len; i++) {
                this._tempDic[excludeID[i]] = true;
            }
        }

        let soList: SceneObject[] = this._quadTree.retrieve(rect);
        len = soList.length;
        let i = 0;
        let temps: any[] = [];
        let so: SceneObject;

        for (i = len - 1; i >= 0; i--) {
            so = soList[i];
            if (!this._tempDic[so.id] && rect.containsPoint(so.x, so.y)) {
                temps.push(so);
                this._tempDic[so.id] = true;
            }
        }
        return temps;
    }

    cacheNode(node: cc.Node, name: string) {
        let pool: NodePool = this._nodePool[name];
        if (pool) {
            pool.put(node);
        }
    }

    getPoolNode(url: string): cc.Node {
        let nodePool: NodePool = this._nodePool[url];
        if (!nodePool) {
            nodePool = new NodePool();
            this._nodePool[url] = nodePool;
            return null;
        }

        return nodePool.get();
    }

    /*生物死亡（所有生物死亡都要进这个接口） */
    monsterDie(so: Monster, showDieEft: boolean = true, skillUid: number = -1) {
        so.doDie(showDieEft, skillUid);
    }

    //移除死亡后的怪物
    removeDeadMonster(so: Monster, showDieEft: boolean = true) {
        if (!so.cfg) return;
        //调试
        let debugInfo: string = GlobalVal.getMapTimeStr() + " " + so.getDebugStr() + " 死亡";
        GameEvent.emit(EventEnum.DEBUG_SHOW_INFO, debugInfo);
    
        //死亡特效
        if (showDieEft) {
            let center = so.centerPos;
            this.createEffect("dieEffect", center.x, center.y, false);
        }

        if (SoType.isMonster(so)) {
            this.removeMonster(so);
        } else if (SoType.isSommon(so)) {
            this.removeSommon(so);
        }
    }


    gridIsEmpty(gx: number, gy: number) {
        return this._gridItems[gx + "_" + gy] == null;
    }

    getGridTower(gx: number, gy: number): any {
        let id = this._gridItems[gx + "_" + gy];
        if (id && id >= SoManager.TOWER_ID) {
            return this.getTowerByGuid(id);
        }
        return null;
    }

    getGridTowerPvp(gx: number, gy: number): any {
        let id = this._gridItems[gx + "_" + gy];
        if (id && id > 0)
            return this.getTowerByGuid(id);
        return null;
    }

    getRangeGridTowers(gx: number, gy: number, range: number): Tower[] {
        let towers: Tower[] = [];
        for (let i = gx - range; i <= gx + range; i++) {
            for (let j = gy - range; j <= gy + range; j++) {
                if (i != gx || j != gy) {
                    let tower = Game.soMgr.getGridTower(i, j);
                    if (tower) {
                        towers.push(tower);
                    }
                }
            }
        }
        return towers;
    }

    getRangeGridTowersPvp(gx: number, gy: number, range: number): Tower[] {
        let towers: Tower[] = [];
        for (let i = gx - range; i <= gx + range; i++) {
            for (let j = gy - range; j <= gy + range; j++) {
                if (i != gx || j != gy) {
                    let tower = Game.soMgr.getGridTowerPvp(i, j);
                    if (tower) {
                        towers.push(tower);
                    }
                }
            }
        }
        return towers;
    }

    /**设置格子是否被占用 */
    setGridState(gx: number, gy: number, width: number, height: number, id: number, changeGridData: boolean = false , removeOther:boolean = false) {
        // if (!Game.curGameCtrl) return;
        let xLen = width ? Math.ceil(width / GlobalVal.GRID_SIZE) : 1;
        let yLen = height ? Math.ceil(height / GlobalVal.GRID_SIZE) : 1;
        for (let i = gx; i < gx + xLen; i++) {
            for (let j = gy; j < gy + yLen; j++) {

                if (removeOther && !this.gridIsEmpty(i , j)) {
                    let tower = this.getGridTower(i , j);
                    if (tower) {
                        this.removeTower(tower);
                    }
                }

                this._gridItems[i + "_" + j] = id;

                if (changeGridData) {
                    this.changeAStarData(i, j, id);
                }
            }
        }


        GameEvent.emit(EventEnum.GRID_STATE_CHANGE);
    }

    private _red: cc.Color = new cc.Color(255, 0, 0, 125);
    private _green: cc.Color = new cc.Color(0, 255, 0, 125);
    private changeAStarData(gx: number, gy: number, obj: any) {
        if (obj) {
            AStar.getInstance().setBlock(gx, gy);
        } else {
            AStar.getInstance().setCanWalk(gx, gy);
        }

        if (GlobalVal.isTest) {
            // Game.skillMgr.graph.clear();
            // for (let i = 0; i < 13; i++) {
            //     for (let j = 0; j < 9; j++) {
            //         Game.skillMgr.graph.fillColor = AStar.getInstance().isBlock(i, j) ? this._red : this._green;
            //         Game.skillMgr.graph.fillRect(GlobalVal.toMapPos(i), GlobalVal.toMapPos(j), GlobalVal.GRID_SIZE, GlobalVal.GRID_SIZE);
            //     }
            // }
        }

    }

    private clearAllPool() {
        for (const key in this._nodePool) {
            if (this._nodePool.hasOwnProperty(key)) {
                const element = this._nodePool[key];
                element.clear();
            }
        }
    }

    private clearPool(url: string) {
        let nodePool: NodePool = this._nodePool[url];
        if (nodePool) {
            nodePool.clear();
        }
    }

    private isRun: boolean = false;
    private startRefreshQuadTree() {
        if (this.isRun) return;
        this.isRun = true;
        SysMgr.instance.doFrameLoop(this._refreshTreeHandler, 2);
        // if (CC_DEBUG) {
        //     SysMgr.instance.doFrameLoop(Handler.create(this.onRefreshGs , this), 1);
        // }
    }

    private stopRefreshQuadTree() {
        this.isRun = false;
        SysMgr.instance.clearTimer(this._refreshTreeHandler);
        // if (CC_DEBUG) {
        //     SysMgr.instance.clearTimer(Handler.create(this.onRefreshGs , this));
        // }
    }

    /**刷新4叉树 */
    private refreshTreeHandler() {
        this._quadTree.refresh();
        // Game.ldSkillMgr.graphMoveLine && Game.ldSkillMgr.graphMoveLine.clear();
    }

    private onRefreshGs() {
        if (!Game.ldSkillMgr.graph) return;
        Game.ldSkillMgr.graph.clear();

        //draw all so
        this._monsterList.list.forEach(element => {
            Game.ldSkillMgr.graph.fillRect(element.rect.x , element.rect.y , element.rect.width , element.rect.height);
        });
        this._towerTableList.list.forEach(element => {
            Game.ldSkillMgr.graph.fillRect(element.rect.x , element.rect.y , element.rect.width , element.rect.height);
        });
        this._ammoList.list.forEach(element => {
            Game.ldSkillMgr.graph.fillRect(element.rect.x , element.rect.y , element.rect.width , element.rect.height);
        });

        this._sommonList.list.forEach(element => {
            Game.ldSkillMgr.graph.fillRect(element.rect.x , element.rect.y , element.rect.width , element.rect.height);
        });

    }

    private refreshTableDepth() {
        this._towerTableList.list.sort((a: any, b: any) => {
            if (a.gy == b.gy) {
                return b.gx - a.gx;
            }
            return a.gy - b.gy;
        });

        const len = this._towerTableList.len;
        for (let i = 0; i < len; i++) {
            let so = this._towerTableList.list[i];
            if (so && so.renderNode) {
                so.renderNode.zIndex = 10000 - i;
            } else {
                cc.log('!!!!!!!!!!!refreshTableDepth error');
            }
        };
    }

    /**刷新怪物景深 */
    private refreshDepth() {
        let len = this._depthList.length;
        if (len < 2) return;
        this._depthList.sort((a: any, b: any) => {
            if (a.y == b.y) {
                return b.x - a.x;
            }
            return a.y - b.y;
        });
        let so: Creature;
        let groupIdx: number = -1;
        for (let i = 0; i < len; i++) {
            so = this._depthList[i];
            if (so.renderNode && so.cfg) {
                if (so['groupID'] && so['groupID'] > 0) {
                    if (groupIdx == -1) {
                        groupIdx = 10000 - i;
                    }
                    so.renderNode.zIndex = groupIdx;
                } else {
                    so.renderNode.zIndex = 10000 - i;
                }
            }
        }

        if (this._refreshTableDepthFrames > 0) {
            this._refreshTableDepthFrames --;
            this.refreshTableDepth();
        }

    }

    private refreshTowerDepth(tower:Tower) {
        if (tower.getParent() !== this._towerContainer) return;
        let len = this._towerList.len;
        if (len < 2) return;
        let list: Tower[] = this._towerList.list;
        list.sort((a: Tower, b: Tower) => {
            if (a.gy == b.gy) {
                return a.gx - b.gx;
            }
            return a.gy - b.gy;
        });

        let so: Creature;
        for (let i = 0; i < len; i++) {
            so = list[i];
            if (so && so.renderNode) {
                so.renderNode.zIndex = 10000 - i;
            } else {
                cc.log('!!!!!!!!!!!refreshTowerDepth error');
            }
        }
    }


    /**初始化配置表 */
    initCfgs() {
        this._monsterDesCfg = Game.gameConfigMgr.getCfg(EResPath.MONSTER_DES);
    }

    private _tempRect:Rect = new Rect();

    /**
     * 
     * @param pos 位置坐标
     * @param range 范围
     * @param findTargetType 寻怪类型
     * @param excludeIds 排除的id列表
     * @returns 
     */
    findTarget(pos:cc.Vec2, range:number , findTargetType:FindTargetType ,campId:ECamp,  excludeIds:number[] = null):Creature {
        this._tempRect.init(pos.x - range , pos.y - range , range * 2 , range * 2);
        let allMonster:Monster[] = Game.soMgr.getRectMonsters(this._tempRect , campId);
        let len:number = allMonster.length;
        let monster:Monster;
        this.sortMonster(allMonster , findTargetType , pos);
        if (excludeIds ) {
            if (excludeIds.length > allMonster.length) {
                excludeIds = null;
            }
        }

        for (let i = 0 ; i < len ; i++) {
            monster = allMonster[i];
            if (excludeIds && excludeIds.indexOf(monster.id) != -1) {
                continue;
            }
            if (monster.cfg && MathUtils.p2RectDis(monster.rect , pos) <= range) {
                return monster;
            }
        }
        return null;
    }

    findTargetByRect(rect:Rect , findTargetType:FindTargetType ,campId:ECamp, excludeIds:number[] = null):Creature {

        let allMonster:Monster[] = Game.soMgr.getRectMonsters(rect , campId);
        let len:number = allMonster.length;
        let monster:Monster;
        this.sortMonster(allMonster , findTargetType);
        if (excludeIds ) {
            if (excludeIds.length > allMonster.length) {
                excludeIds = null;
            }
        }

        for (let i = 0 ; i < len ; i++) {
            monster = allMonster[i];
            if (excludeIds && excludeIds.indexOf(monster.id) != -1) {
                continue;
            }
            if (monster.cfg && MathUtils.intersects(monster.rect , rect)) {
                return monster;
            }
        }
        return null;
    }

    private sortMonster(monsterList:Monster[] , findTargetType:FindTargetType , pos:cc.Vec2 = null) {
        let len = this._monsterList.len;
        if (len < 2) return;

        const randomTieBreaker = () => (MathUtils.seedRandomConst() > 0.5 ? 1 : -1);

        switch (findTargetType) {
            case FindTargetType.BLOOD_MIN:
                monsterList.sort((a, b) => {
                    const diff = a.prop.getPropertyValue(PropertyId.MAX_HP) - b.prop.getPropertyValue(PropertyId.MAX_HP);
                    return diff !== 0 ? diff : randomTieBreaker();
                });
                break;
            case FindTargetType.BLOOD_MAX:
                monsterList.sort((a, b) => {
                    const diff = b.prop.getPropertyValue(PropertyId.MAX_HP) - a.prop.getPropertyValue(PropertyId.MAX_HP);
                    return diff !== 0 ? diff : randomTieBreaker();
                });
                break;
            case FindTargetType.DISCOUNT:
                monsterList.sort((a, b) => {
                    const diff = a.y - b.y;
                    return diff !== 0 ? diff : randomTieBreaker();
                });
                break;
            case FindTargetType.RANDOM:
                monsterList.sort(() => randomTieBreaker());
                break;
            case FindTargetType.BLOOD_RATE_MIN:
                monsterList.sort((a, b) => {
                    const aRate = a.prop.hp.value / a.prop.getPropertyValue(PropertyId.MAX_HP);
                    const bRate = b.prop.hp.value / b.prop.getPropertyValue(PropertyId.MAX_HP);
                    const diff = aRate - bRate;
                    return diff !== 0 ? diff : randomTieBreaker();
                });
                break;
            case FindTargetType.DISCOUNT_SELF:
                if (pos == null) {
                    monsterList.sort((a, b) => a.y - b.y);
                } else {
                    monsterList.forEach(m => {
                        m.tempValue = MathUtils.getDistance(m.x, m.y, pos.x, pos.y);
                    });
                    monsterList.sort((a, b) => {
                        const diff = a.tempValue - b.tempValue;
                        return diff !== 0 ? diff : randomTieBreaker();
                    });
                }
                break;
            default:
                break;
        }
    }

    

    ///////////////////////////////////////

}
