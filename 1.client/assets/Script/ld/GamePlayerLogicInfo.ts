import { ECamp, GAME_TYPE } from "../common/AllEnum";
import { GameCommonConfig, HeroConfig } from "../common/ConfigInterface";
import { EResPath } from "../common/EResPath";
import { EventEnum } from "../common/EventEnum";
import Debug, { TAG } from "../debug";
import Game from "../Game";
import GlobalVal from "../GlobalVal";
import { EComponentType } from "../logic/comps/AllComp";
import Creature from "../logic/sceneObjs/Creature";
import { Tower } from "../logic/sceneObjs/Tower";
import { GameEvent, Reply } from "../utils/GameEvent";
import { MathUtils } from "../utils/MathUtils";
import SystemTipsMgr from "../utils/SystemTipsMgr";
import { UiManager } from "../utils/UiMgr";
import Utils from "../utils/Utils";
import { HeroBuildingCtrl } from "./HeroBuildingCtrl";
import { LDBaseGameCtrl } from "./LDBaseGameCtrl";
import { NormalGameCtrl } from "./NormalGameCtrl";
import { Pos } from "./Pos";
import { HeroTable } from "./tower/HeroTable";
import LdHeroAutoAttackComp from "./tower/LdHeroAutoAttackComp";

export class GamePlayerLogicInfo {

    //可以用来建地块的gx列表
    protected _readyCreateTablePosList:Record<number , number> = {};
    protected _readyCreateTableGxList:number[] = []; 
    protected _callTimes:number = 0;
    protected _strengthenSkillTimes:number = 0;
    protected _createTableCallTimes:number = 0;
    protected _curCallTimes:number = 0;
    protected _createTableTimes:number = 0;
    protected _activeHeroIds:number[] = [];
    protected _heroTableDic:Record<string , HeroTable> = {};
    protected _tableList:HeroTable[] = [];
    protected _canMoveGxList:number[] = [];    
    protected _conflateHeroAddWeight:Record<number , number> = {};
    protected _gameCommonConfig:GameCommonConfig = null;
    protected _heroBuildingCtrl:HeroBuildingCtrl = null;
    protected _maxLevelDic:Record<number , {uid:number , level:number}> = {};
    //已经有英雄台的格子列表
    protected _affectedTable:number[][] = [];
    protected _camp:ECamp = ECamp.BLUE;
    protected _gameCtrl:LDBaseGameCtrl = null;
    protected _coin:number = 0;
    protected _isMirror:boolean = false;


    get campId():ECamp {
        return this._camp;
    }


    get curCallTimes():number {
        return this._curCallTimes;
    }

    get createTableCallTimes():number {
        return this._createTableCallTimes;
    }

    get callConsumeCoin():number {
        return this._gameCommonConfig.callHeroCoins[this._callTimes] || 0;
    }

    get totalCallTimes():number { return this._callTimes };

    get strengthenSkillCoin():number {
        return this._gameCommonConfig.callSkillCoins[this._strengthenSkillTimes] || 0;
    }

    constructor(gameCommonConfig:GameCommonConfig , campId:ECamp ,gameCtrl:LDBaseGameCtrl) {
        this._heroBuildingCtrl = new HeroBuildingCtrl();
        this._gameCommonConfig = gameCommonConfig;
        this._camp = campId;
        this._gameCtrl = gameCtrl;
        this._isMirror = gameCtrl.getGameType() == GAME_TYPE.PVP && campId == ECamp.RED;
    }

   

    enterMap() {
        this.resetDatas();
        this.initActiveHero();
        Game.ldSkillMgr.initCampHurtData(this._camp , this._activeHeroIds);

        this._removeCanMoveGx = false;
        GameEvent.on(EventEnum.ON_TOWER_TOUCH    , this.onHeroTouch , this);
        GameEvent.on(EventEnum.TRY_CALL_TOWER , this.tryCallHero , this);
        GameEvent.on(EventEnum.TRY_STRENGTHEN , this.tryStrengthenSkill , this);
        GameEvent.on(EventEnum.CONFLATE_TOWER , this.onConflateHero , this);
        GameEvent.on(EventEnum.LD_CONFLATE_WEIGHT_CHANGE , this.onConflateHeroWeightChange , this);
        GameEvent.on(EventEnum.REMOVE_TOWER , this.onHeroRemoved , this);
        this.createInitHeroTableItems();
        this.createPlayer();
    }


    protected tryStrengthenSkill(campId:ECamp = ECamp.BLUE) {
        if (campId !== this._camp) return;
        if (this._callTimes < 5) return SystemTipsMgr.instance.notice('召唤次数不足5次，无法强化技能');
        const consume = this.strengthenSkillCoin;
        if (consume > this.coin) return SystemTipsMgr.instance.notice('金币不足，无法强化技能');
        this._strengthenSkillTimes ++;
        this.coin -= consume;
        GameEvent.emit(EventEnum.LD_TRY_STRENGTH_SKILL , this._camp);
        if (campId == this._gameCtrl.getSelfCamp()) {
            UiManager.showDialog(EResPath.LD_STRENGTH_SKILL_VIEW);
        } 
    }


    protected tryRandomHero(level:number):number {
        let emptyCount = this.calcEmptyTableCount();
        if (level > 1) emptyCount -= 1;
        if (emptyCount == 1) {
            cc.log('剩余最后一个空格，检测是否需要保底让玩家有英雄可以合成');
            //防止场所所有英雄无法合成的保底
            const canConflate = this.checkHaveConflate();
            if (!canConflate) {
                if ((level > 1 && !this.checkHadLevelOneHero()) || level == 1) {
                    //需要保底英雄
                    cc.log('需要保底英雄，等级:' + level);
                    let heroIds = this.getSameLevelHeroIds(level);
                    if (heroIds.length > 0) {
                        return MathUtils.randomGetItemByList(heroIds);
                    }
                }
            }
        }
        const levelHeroes = Object.values(this._tableList)
            .filter(element => element && element.hero && element.hero.level === level)
            .map(element => element.hero.cfg.ntroopsid);

        const totalCount = levelHeroes.length;
        const heroCountDic = levelHeroes.reduce((acc, ntroopsid) => {
            acc[ntroopsid] = (acc[ntroopsid] || 0) + 1;
            return acc;
        }, {} as Record<number, number>);

        let totalWeight = 0;
        const weightList = this._activeHeroIds.map(heroId => {
            const cfg: HeroConfig = Game.gameConfigMgr.getHeroConfig(heroId);
            const callWeight = cfg['callWeight'][level - 1] || 1;
            const correctWeight = cfg['correctWeight'][level - 1] || 1;
            const heroCount = heroCountDic[cfg.ntroopsid] || 0;

            // 权重计算：基础权重的(总数-英雄数) * 矫正权重 次方
            let weight = Math.pow(callWeight, (totalCount - heroCount) * correctWeight);

            const additionalWeight = this._conflateHeroAddWeight[heroId] || 0;
            if (additionalWeight > 0) {
                weight *= (1 + additionalWeight * 0.01);
            }
            weight = Math.floor(weight);

            // console.log(`英雄ID：${heroId}, 名字：${cfg.szname}, 权重：${weight}`);
            totalWeight += weight;
            return { weight: totalWeight, heroId: heroId };
        });
        // console.log('权重总和：' + totalWeight);
        
        const randomWeight = MathUtils.randomInt(1 , totalWeight);
        for (let index = 0; index < weightList.length; index++) {
            const element = weightList[index];
            if (element.weight >= randomWeight) {
                return element.heroId;
            }
        }
        return MathUtils.randomGetItemByList(this._activeHeroIds);
    }


    checkCallHeroCoinEnough():boolean {
        return this.coin >= this.callConsumeCoin;
    }

    checkStrengthenSkillCoinEnough():boolean {
        return this.coin >= this.strengthenSkillCoin && this._callTimes >= 5;
    }

    checkHeroTableFull():boolean {
        let len = this._tableList.length;
        for (let index = 0; index < len; index++) {
            const element = this._tableList[index];
            if (element && element.hero == null) {
                return false;
            }
        }
        return true;
    }

    protected calcEmptyTableCount():number {
        let count = 0;
        let len = this._tableList.length;
        for (let index = 0; index < len; index++) {
            const element = this._tableList[index];
            if (element && element.hero == null) {
                count ++;
            }
        }
        return count;
    }

    protected checkHadLevelOneHero():boolean {
        let len = this._tableList.length;
        for (let index = 0; index < len; index++) {
            const element = this._tableList[index];
            if (element && element.hero && element.hero.level == 1) {
                return true;
            }
        }
        return false;
    }

    protected getSameLevelHeroIds(level:number):number[] {
        let heroIds:number[] = [];
        let len = this._tableList.length;
        for (let index = 0; index < len; index++) {
            const element = this._tableList[index];
            if (element && element.hero && element.hero.level == level) {
                heroIds.push(element.hero.cfg.ntroopsid);
            }
        }
        return heroIds;
    }



    protected _readyConflateHeroId:number = 0;
    protected _readyConflateHeroLevel:number = 0;

    /**
     * 合成条件参考 onConflateHero 函数：
     * - 英雄等级相同且小于4
     * - 英雄ID相同
     * @param campId 阵营ID
     * @returns 如果存在可合成的英雄返回true，否则返回false
     */
    checkHaveConflate(): boolean {
        const heroLevelCountMap: Record<string, number> = {};
        for (const heroTable of this._tableList) {
            const hero = heroTable?.hero;
            if (hero && hero.level < 4) {
                const heroId = hero?.cfg?.ntroopsid || 0;
                const key = `${heroId}_${hero.level}`;
                heroLevelCountMap[key] = (heroLevelCountMap[key] || 0) + 1;
                if (heroLevelCountMap[key] >= 2) {
                    this._readyConflateHeroId = heroId;
                    this._readyConflateHeroLevel = hero.level;
                    return true;
                }
            }
        }
        return false;
    }


    tryAutoConflate() {
        if (this._readyConflateHeroId == 0) return;
        const heroId = this._readyConflateHeroId;
        const level = this._readyConflateHeroLevel;

        let heroTables = this._tableList.filter((item) => {
            return item.hero && item.hero.cfg.ntroopsid == heroId && item.hero.level == level;
        });

        if (heroTables.length >= 2) {
            let from = heroTables[0];
            let to = heroTables[1];
            this.onConflateHero(from.hero, to.hero , this._camp);
        }

        this._readyConflateHeroId = 0;
        this._readyConflateHeroLevel = 0;
    }


    protected _maxHeroTableCount = 19;

    checkHeroTableIsFull():boolean {
        return this._tableList.length >= this._maxHeroTableCount;
    }

    //尝试召唤一个英雄
    protected tryCallHero(camp:ECamp = ECamp.BLUE) {
        if (camp !== this._camp) return;
        
        const consume = this.callConsumeCoin;
        // const consume = 0;
        if (consume > this.coin) return SystemTipsMgr.instance.notice('金币不足，无法召唤');
        let emptyTable:HeroTable[] = [];
        let len = this._tableList.length;
        for (let index = 0; index < len; index++) {
            const element = this._tableList[index];
            if (element && element.hero == null) {
                emptyTable.push(element);
            }
        }

        len = emptyTable.length;
        if (len == 0) return SystemTipsMgr.instance.notice('当前没有空位可以召唤');
        let heroTable:HeroTable = len == 1 ? emptyTable[0] : MathUtils.randomGetItemByList(emptyTable);

        const heroId = this.tryRandomHero(1);
        
        let hero:Tower = Game.soMgr.createTower(heroId , 1, heroTable.gx , heroTable.gy , this._camp) as Tower;
        heroTable.hero = hero;
        hero.setPosNow(heroTable.x , heroTable.y + 22.5);
        hero.emit(EventEnum.HERO_POS_INIT);

        this.refreshMaxLevelHero(heroId , 1 , hero.id);
        Game.soMgr.createEffect("upgradeLevel", hero.x, hero.y, false);
        this._callTimes ++;
        this._curCallTimes ++;
        if (this._createTableCallTimes > 0 && this._curCallTimes >= this._createTableCallTimes && !this.checkHeroTableIsFull()) {
            this.tryCreateTable();
        }
        this.coin -= consume;
        GameEvent.emit(EventEnum.CALL_HERO_SUCCESS , this._camp);
        const selfCamp = this._gameCtrl.getSelfCamp();
        if (selfCamp != this._camp) {
            GameEvent.emit(EventEnum.NEW_HERO_CREATE , this._camp);
        }
    }

    /**
     * 刷新最大等级英雄信息
     * @param heroId 英雄ID
     * @param level 等级
     * @param uid 英雄UID
     */
    protected refreshMaxLevelHero(heroId:number , level:number ,uid:number) {
        let data = this._maxLevelDic[heroId];
        let changed = false;
        if (!data) {
            data = {uid:uid , level:level};
            this._maxLevelDic[heroId] = data;
            changed = true;
        } else if (level > data.level) {
            data.level = level;
            data.uid = uid;
            changed = true;
        }

        if (changed) {
            GameEvent.emit(EventEnum.LD_REFRESH_MAX_LEVEL , heroId , data , this._camp);
        }
    }

    /**当英雄被移除时，检测要不要刷新改类英雄的最高星英雄ID */
    protected onHeroRemoved(hero:Tower) {
        if (!hero || !hero.cfg || hero.camp !== this._camp) return;
        const uid = hero.id;
        const heroId = hero.cfg.ntroopsid;
        if (this._maxLevelDic[heroId] == undefined || this._maxLevelDic[heroId] == null) {
            console.log('error');
        }
        if (this._maxLevelDic[heroId].uid == uid) {
            this.tryResetMaxLevelHero(heroId);
        }
    }



    /**
     * 尝试重置最高等级的英雄
     * @param heroId 英雄ID
     */
    protected tryResetMaxLevelHero(heroId:number) {
        let maxLevel = 0;
        let maxUid = 0;
        for (const key in this._heroTableDic) {
            if (Object.prototype.hasOwnProperty.call(this._heroTableDic, key)) {
                const element = this._heroTableDic[key];
                if (element.hero && element.hero.cfg.ntroopsid == heroId) {
                    if (element.hero.level > maxLevel) {
                        maxLevel = element.hero.level;
                        maxUid = element.hero.id;
                    }
                }
            }
        }
        if (maxLevel > 0) {
            this.refreshMaxLevelHero(heroId , maxLevel , maxUid);
        } else {
            this._maxLevelDic[heroId] = {uid:0 , level:0}
        }
    }


    

    /**
     * 在两座塔之间进行英雄合并
     * @param towerFrom 源塔
     * @param towerTo 目标塔
     */
    protected onConflateHero(heroFrom:Tower , heroTo:Tower , campId:ECamp = ECamp.BLUE) {
        if (campId !== this._camp || heroFrom.camp !== heroTo.camp) return;
        if (heroFrom.gx == heroTo.gx && heroTo.gy == heroFrom.gy) {
            cc.log('onConflateHero error!!!');
        }
        cc.log('onConflateHero:' , heroFrom.gx , heroFrom.gy , heroTo.gx , heroTo.gy , heroFrom.id , heroTo.id);
        const formGridFlag = heroFrom.gx + '_' + heroFrom.gy;
        const toGridFlag = heroTo.gx + '_' + heroTo.gy;

        const level = heroTo.level + 1;
        const formTable = this._heroTableDic[formGridFlag];
        formTable.removeTower();
        const gx = heroTo.gx;
        const gy = heroTo.gy;
        const toTable = this._heroTableDic[toGridFlag];
        if (!toTable) {
            cc.log('error!!!');
        }
        toTable.removeTower();
        let heroId = this.tryRandomHero(level);
        let hero:Tower = Game.soMgr.createTower(heroId , level, gx , gy , this._camp) as Tower;
        hero.setPosNow(toTable.x , toTable.y + 22.5);
        hero.emit(EventEnum.HERO_POS_INIT);
        this.refreshMaxLevelHero(heroId , level , hero.id);
        Game.soMgr.createEffect("upgradeLevel", hero.x, hero.y, false);
        toTable.hero = hero;

        const selfCamp = this._gameCtrl.getSelfCamp();

        if (level == 4) {
            if (selfCamp == campId) {
                UiManager.showDialog(EResPath.LD_STRENGTH_SKILL_VIEW , heroId);
            } else {
                GameEvent.emit(EventEnum.LD_ACTIVE_MAX_STRENGTH_SKILL , heroId , campId);
            }
        } else if (selfCamp != campId) {
            GameEvent.emit(EventEnum.NEW_HERO_CREATE , campId);
        }
    }

    protected onConflateHeroWeightChange(heroId:number , weight:number , campId:ECamp) {
        if (campId !== this._camp) return;
        this._conflateHeroAddWeight[heroId] =  (this._conflateHeroAddWeight[heroId] || 0) +  weight;

    }



    //通过坐标获取英雄
    getHeroByPos(relay:Reply , x:number , y:number):Tower {
        const len = this._tableList.length;
        for (let index = 0; index < len; index++) {
            const element = this._tableList[index];

            GlobalVal.tempRect.x = element.rect.x;
            GlobalVal.tempRect.y = element.y - 30;
            GlobalVal.tempRect.xMax = element.rect.x + element.rect.width;
            GlobalVal.tempRect.yMax = GlobalVal.tempRect.y + element.rect.height;

            if (element && element.hero && MathUtils.containsPoint(GlobalVal.tempRect , x , y )) {
                return relay(element.hero);
            }
        }
        return relay(null);
    }

    protected calcCreateTablePos():[number , number] {
        const gx = MathUtils.randomGetItemByList(this._readyCreateTableGxList);
        const gy = this._readyCreateTablePosList[gx];
        return [gx , gy];

    }


    protected tryCreateTable() {
        this._curCallTimes = 0;
        this._createTableTimes ++;
        this._createTableCallTimes = this._gameCommonConfig.heroTableCallTimes[this._createTableTimes] || -1;
        let [gx , gy] = this.calcCreateTablePos();
        this.createHeroTabelByGridPos(gx , gy);
        GameEvent.emit(EventEnum.CREATE_HERO_TABLE , gx , gy , this._camp);
        if (this._createTableCallTimes == -1) {
            //发个消息出去隐藏UI
        }
    }

    /**
     * 召唤物寻找移动路径，优先避开阻挡，尽量沿横向移动，遇阻时尝试垂直绕行。
     *
     * @param sx 起始点x坐标
     * @param sy 起始点y坐标
     * @param tx 目标点x坐标
     * @param ty 目标点y坐标
     * @returns 返回路径点数组，包含起点和终点，中间点为绕行路径
     * 算法说明：
     * - 首先判断起点到终点的直线路径是否有阻挡，无阻挡则直接返回终点。
     * - 若有阻挡，则优先尝试横向移动到下一个格子，若高度不同则垂直绕行。
     * - 若遇到特殊情况（如连续横向点），会删除多余路径点。
     * - 最多迭代20次，防止死循环。
     */
    public sommonFindMovePath(sx: number, sy: number, tx: number, ty: number): Pos[] {
        const path: Pos[] = [Pos.getPos(sx, sy)];
        let currentX = sx;
        let currentY = sy;

        const tGx = this.getGridX(tx);
        const tGy = this.getGridY(ty);

        const MAX_ITERATIONS = 20;
        let iterationCount = 0;
        let isMovingDown = false; // 状态：跟踪是否正在向下/水平移动

        while (iterationCount++ < MAX_ITERATIONS) {
            const currentGx = this.getGridX(currentX);
            const currentGy = this.getGridY(currentY);

            if (!this.checkBlockByGrid(currentGx, currentGy, tGx, tGy)) {
                path.push(Pos.getPos(tx, ty));
                break;
            }

            if (currentGx === tGx) {
                path.push(Pos.getPos(tx, ty));
                break;
            }

            const direction = tGx > currentGx ? 1 : -1;
            const nextGx = currentGx + direction;
            const nextTopGy = this._readyCreateTablePosList[nextGx];

            if (nextTopGy > currentGy) {
                // 准备向上移动
                if (isMovingDown) {
                    // 如果之前是向下移动，现在要向上，则清理路径
                    this._prunePathForUphill(path, currentY);
                }
                const { newX, newY } = this._planMoveUp(currentGx, nextTopGy, direction, path);
                currentX = newX;
                currentY = newY;
                isMovingDown = false;
            } else {
                // 水平或向下移动
                const { newX, newY } = this._planMoveHorizontal(nextGx, currentY, path);
                currentX = newX;
                currentY = newY;
                isMovingDown = true;
            }
        }

        return this._smoothPath(path); // 最后仍然可以进行一次通用平滑处理
    }

    /**
     * 当从下坡/平地转为上坡时，清理路径中多余的水平移动点。
     * @param path 路径数组
     * @param currentY 当前的高度
     */
    protected _prunePathForUphill(path: Pos[], currentY: number): void {
        // 从后向前遍历，删除所有在当前高度的连续路径点
        for (let i = path.length - 1; i >= 1; i--) {
            if (path[i].y === currentY && path[i - 1].y === currentY) {
                path.splice(i, 1);
            }
        }
    }

    /**
     * 路径平滑处理，移除多余的拐点。
     * 这里实现一个简单的共线点移除算法。
     * @param path 原始路径
     */
    protected _smoothPath(path: Pos[]): Pos[] {
        if (path.length < 3) {
            return path;
        }

        const smoothedPath: Pos[] = [path[0]];
        for (let i = 1; i < path.length - 1; i++) {
            const p1 = smoothedPath[smoothedPath.length - 1];
            const p2 = path[i];
            const p3 = path[i + 1];

            // 检查 p1, p2, p3 是否共线
            // 通过斜率判断：(y2 - y1) * (x3 - x2) === (y3 - y2) * (x2 - x1)
            // 为避免浮点数精度问题，使用乘法代替除法
            const isCollinear = (p2.y - p1.y) * (p3.x - p2.x) === (p3.y - p2.y) * (p2.x - p1.x);

            if (!isCollinear) {
                smoothedPath.push(p2);
            }
        }
        smoothedPath.push(path[path.length - 1]);

        return smoothedPath;
    }

    /**
     * 规划向上移动的路径点
     */
    protected _planMoveUp(currentGx: number, nextTopGy: number, direction: number, path: Pos[]): { newX: number, newY: number } {
        // 1. 移动到当前格子边缘
        let midX = this.getGridCenterX(currentGx) + direction * NormalGameCtrl.HALF_GRID_WID;
        // 2. 垂直上升到目标平台高度
        let midY = this.getGridTop(nextTopGy - 1);
        path.push(Pos.getPos(midX, midY));

        // 3. 水平移动到下一个格子的中心
        midX += direction * NormalGameCtrl.HALF_GRID_WID;
        path.push(Pos.getPos(midX, midY));

        return { newX: midX, newY: midY };
    }

    /**
     * 规划水平或向下移动的路径点
     */
    protected _planMoveHorizontal(nextGx: number, currentY: number, path: Pos[]): { newX: number, newY: number } {
        const newX = this.getGridCenterX(nextGx);
        path.push(Pos.getPos(newX, currentY));
        return { newX: newX, newY: currentY };
    }

    protected checkBlockByGrid(sGx:number , sGy:number , tGx:number , tGy:number):boolean {
        const minGx = Math.min(sGx, tGx);
        const maxGx = Math.max(sGx, tGx);
        const minGy = Math.min(sGy, tGy);
        const maxGy = Math.max(sGy, tGy);
        // 检查路径区间内是否有阻挡
        for (let gx = minGx; gx <= maxGx; gx++) {
            for (let gy = minGy; gy <= maxGy; gy++) {
                if (this._heroTableDic[`${gx}_${gy}`] != null) {
                    return true;
                }
            }
        }
        return false;
    }


    checkHaveBlock(sx:number , sy:number , tx:number , ty:number):boolean {
        const sGx = this.getGridX(sx);
        const sGy = this.getGridY(sy);
        const tGx = this.getGridX(tx);
        const tGy = this.getGridY(ty);
        return this.checkBlockByGrid(sGx , sGy , tGx , tGy);
    }


    /**
     * 在二维网格上寻找从指定位置移动到目标位置的路径。
     *
     * @param x 起始位置的 x 坐标。
     * @param y 起始位置的 y 坐标。
     * @param halfWid 物体宽度的一半。
     * @returns 返回从起始位置到目标位置的路径，路径上的每一个点都是一个 Pos 对象。
     * 算法说明：
     * - 每次优先向目标纵向靠近，若遇到阻挡则尝试横向绕行。
     * - 横向绕行时根据格子高度调整路径点。
     * - 最多迭代20次，防止死循环。
     */
    /**
     * 寻找宽体物体的移动路径。
     * @param x 起始x坐标
     * @param y 起始y坐标
     * @param halfWid 物体半宽
     * @returns 路径点数组
     */
    public findMovePath(x: number, y: number, halfWid: number): Pos[] {
        const path: Pos[] = [Pos.getPos(x, y)];
        const MAX_ITERATIONS = 20;
        let iterationCount = 0;

        // 约束物体半宽，确保其在合理范围内
        const constrainedHalfWid = Math.min(Math.max(halfWid, 10), NormalGameCtrl.HALF_GRID_WID - 5);

        while (iterationCount++ < MAX_ITERATIONS) {
            // 1. 查找当前位置下，物体覆盖范围内的最高“地面”
            const groundInfo = this._findHighestGroundInBodyRange(x, constrainedHalfWid);
            const { gx: currentGx, gy: currentMaxGy } = groundInfo;

            // 2. 计算并添加垂直下落到“地面”的路径点
            const targetY = this.getGridTop(currentMaxGy - 1);
            path.push(Pos.getPos(x, targetY));

            // 3. 如果已在最底层，则寻路结束
            if (currentMaxGy <= 1) break;

            // 4. 规划下一步的移动（包括横向和纵向）
            const movePlan = this._planNextMove(x, targetY, currentGx, currentMaxGy, constrainedHalfWid);
            path.push(...movePlan.pathSegment);

            // 5. 更新当前坐标，为下一次迭代做准备
            x = movePlan.nextPos.x;
            y = movePlan.nextPos.y;
        }

        if (iterationCount >= MAX_ITERATIONS) {
            Debug.warn(TAG.DEFAULT, 'findMovePath exceeded maximum iterations');
        }
        return path;
    }

    /**
     * 查找物体覆盖范围内的最高地面及其坐标。
     * @param x 物体中心x坐标
     * @param halfWid 物体半宽
     * @returns 最高地面的格子坐标 { gx, gy }
     */
    protected _findHighestGroundInBodyRange(x: number, halfWid: number): { gx: number, gy: number } {
        const leftX = x - halfWid + 1;
        const rightX = x + halfWid - 1;
        const centerGx = this.getGridX(x);
        const leftGx = this.getGridX(leftX);
        const rightGx = this.getGridX(rightX);

        let highestGx = centerGx;
        let highestGy = this._readyCreateTablePosList[centerGx] || 0;

        const leftGy = this._readyCreateTablePosList[leftGx] || 0;
        if (leftGy > highestGy) {
            highestGy = leftGy;
            highestGx = leftGx;
        }

        const rightGy = this._readyCreateTablePosList[rightGx] || 0;
        if (rightGy > highestGy) {
            highestGy = rightGy;
            highestGx = rightGx;
        }

        return { gx: highestGx, gy: highestGy };
    }

    /**
     * 根据当前状态规划下一步的移动路径。
     * @param currentX 当前x
     * @param currentY 当前y
     * @param currentGx 当前所在格子x
     * @param currentGy 当前所在格子y
     * @param halfWid 物体半宽
     * @returns 包含路径片段和下一步坐标的对象
     */
    protected _planNextMove(currentX: number, currentY: number, currentGx: number, currentGy: number, halfWid: number): { pathSegment: Pos[], nextPos: { x: number, y: number } } {
        const nearestGx = this.findCanMoveGx(currentX);
        const direction = nearestGx > currentGx ? 1 : -1;
        const nextGx = currentGx + direction;
        const nextGy = this._readyCreateTablePosList[nextGx] || 0;

        const baseX = this.getGridCenterX(currentGx);
        const nextX = currentX + NormalGameCtrl.GRID_WID * direction;
        let adjustedX: number;
        let pathSegment: Pos[] = [];
        let nextPos = { x: nextX, y: currentY };

        if (nextGy > currentGy) { // 走向更高的平台
            adjustedX = baseX + (direction * NormalGameCtrl.HALF_GRID_WID) - (direction * halfWid);
            const newY = this.getGridTop(nextGy - 1);
            pathSegment.push(Pos.getPos(adjustedX, currentY));
            pathSegment.push(Pos.getPos(adjustedX, newY));
            pathSegment.push(Pos.getPos(nextX, newY));
            nextPos = { x: nextX, y: newY };
        } else if (nextGy < currentGy) { // 走向更低的平台
            adjustedX = baseX + (direction * NormalGameCtrl.HALF_GRID_WID) + (direction * halfWid);
            pathSegment.push(Pos.getPos(adjustedX, currentY));
            nextPos = { x: adjustedX, y: currentY };
        } else { // 走向等高平台
            // 直接横向移动，无需额外路径点，只更新坐标
            nextPos = { x: nextX, y: currentY };
        }

        return { pathSegment, nextPos };
    }

    protected findCanMoveGx(x:number):number {
        //从this._canMoveGxList里寻找最近的gx
        //假如有两个相同距离的gx，则取x距离较近的那个gx
        let minDis = 999999;
        let resultGx = -1;
        const len = this._canMoveGxList.length;
        for (let index = 0; index < len; index++) {
            const element = this._canMoveGxList[index];
            const dis = Math.abs(x - this.getGridCenterX(element));
            if (dis < minDis) {
                minDis = dis;
                resultGx = element;
            }
        }
        return resultGx;
    }



    protected createInitHeroTableItems() {
        for (let i = 0; i < NormalGameCtrl.TOWER_COL ; ++i) {
            this.createHeroTabelByGridPos(i , 0);
            this._readyCreateTableGxList.push(i);
            this._canMoveGxList.push(i);
        }
    }

    protected _leadingRolePos:number[] = [360 , -170];


    protected _leadingRole:Creature;
    protected createPlayer() {
        this._leadingRole = Game.soMgr.createPlayer(this._camp);
        this._leadingRole.setPosNow(this._leadingRolePos[0], this._gameCtrl.mirrorY(this._leadingRolePos[1] , this._camp));
        this._leadingRole.scale = 1.5;
        const heroAuto = this._leadingRole.addComponentByType(EComponentType.LD_HERO_AUTO) as LdHeroAutoAttackComp;
        heroAuto.isLeadingRole = true;
        this._leadingRole.emit(EventEnum.HERO_POS_INIT);

    }

    get leadingRole():Creature {
        return this._leadingRole;
    }

    getGridX(x:number):number {
        return this._gameCtrl.getGridX(x)
    }

    getGridY(y:number):number {
       return this._gameCtrl.getGridY(y , this._camp);

    }

    protected getGridCenterX(gx:number):number {
        return this._gameCtrl.getGridCenterX(gx);
    }

    protected getGridCenterY(gy:number):number {
        return this._gameCtrl.getGridCenterY(gy , this._camp);

    }
    
    getGridTop(gy:number):number {
        return this._gameCtrl.getGridTop(gy , this._camp);
    }


    protected _removeCanMoveGx:boolean = false;
    protected createHeroTabelByGridPos(gx:number , gy:number) {
        this._affectedTable.push([gx , gy]);
        const table = Game.soMgr.createHeroTable(gx , gy , this._camp);
        table.setPosNow(this.getGridCenterX(gx) , this.getGridCenterY(gy));
        this._tableList.push(table);
        this._heroTableDic[gx + '_' + gy] = table;
        this._readyCreateTablePosList[gx] = gy + 1;
        if (gy > 0) {
            Utils.removeFromArray(this._canMoveGxList , gx);
            if (this._canMoveGxList.length < 4 && !this._removeCanMoveGx) {
                this._removeCanMoveGx = true;
                this._canMoveGxList.forEach(element => {
                    Utils.removeFromArray(this._readyCreateTableGxList , element);
                });

            }
            if (gy >= 3) {
                Utils.removeFromArray(this._readyCreateTableGxList , gx);
            }
        }
    }

    getEmptyGridTopYByGx(gx:number):number {
        const gy = this._readyCreateTablePosList[gx];
        if (gy) {
            return this.getGridTop(gy - 1);
        }
        return 0;
    }


    clearMap() {
        if (this._leadingRole) {
            this._leadingRole.dispose();
            this._leadingRole = null;
        }
        this._heroBuildingCtrl.clearHeroBuildings();
        this._coin = 0;
        GameEvent.targetOff(this);
    }

    addCoin(value:number , camp?:ECamp) {
        if (camp == this._camp) {
            this.coin += (Math.floor( + value)) ;
        }
    }

    
    protected initActiveHero() {
        this._activeHeroIds = [104 , 202 , 801 , 205];
        // this._activeHeroIds = [202 ];
        // if (this._camp == ECamp.RED)
            // this._activeHeroIds = [205];
        // else 
        //     this._activeHeroIds = [202];

        this._heroBuildingCtrl.initHeroBuildings(this._activeHeroIds , this);
    }

    getHeroBuildingCtrl():HeroBuildingCtrl {
        return this._heroBuildingCtrl;
    }


    protected onHeroTouch(so:Tower , onlyHelp:boolean = false) {
        Game.soundMgr.playSound(EResPath.TowerSelect);
        Debug.log(TAG.DEFAULT , '点击了英雄');
    }

    protected resetDatas() {
        this._callTimes = 0;
        this._curCallTimes = 0;
        this._createTableTimes = 0;
        this._strengthenSkillTimes = 0;
        this._createTableCallTimes = this._gameCommonConfig.heroTableCallTimes[0];
        this._tableList.length = 0;
        this._heroTableDic = {};
        this._affectedTable = [];
        this._readyCreateTableGxList = [];
        this._canMoveGxList = [];
        this._readyCreateTablePosList = {};
        this._maxLevelDic = {};
        this._conflateHeroAddWeight = {};
        this._leadingRole = null;
    }

    // 设置属性的setter方法，用于设置gold属性的值
    set coin(value: number) {
        this._coin = value;
        GameEvent.emit(EventEnum.LD_COIN_CHANGE , value , this._camp);
    }

    get coin(): number {
        return this._coin;
    }

    getHeroTable(gx:number , gy:number):HeroTable {
        return this._heroTableDic[gx + "_" + gy];
    }

    getMaxLevelHeros():number[] {
        let heroIds = [];
        let tempLevel = 0;

        for (const key in this._heroTableDic) {
            if (Object.prototype.hasOwnProperty.call(this._heroTableDic, key)) {
                const element = this._heroTableDic[key];
                const heroId = element?.hero?.cfg?.ntroopsid || 0;
                if (heroId > 0 && element.hero.level > tempLevel) {
                    tempLevel = element.hero.level;
                    heroIds = [heroId];
                } else if (heroId > 0 && element.hero.level == tempLevel && !heroIds.includes(heroId)) {
                    heroIds.push(heroId);
                }
            }
        }
        return heroIds;
    }

    getMaxTotalStarHeros(): number[] {
        let heroIds = [];
        let tempLevel = 0;
        let levelDic:Record<number , number> = {};
        for (const key in this._heroTableDic) {
            if (Object.prototype.hasOwnProperty.call(this._heroTableDic, key)) {
                const element = this._heroTableDic[key];
                if (element && element.hero ) {
                    let level = levelDic[element.hero.cfg.ntroopsid] || 0;
                    level += element.hero.level;
                    levelDic[element.hero.cfg.ntroopsid] = level;
                }
            }
        }

        for (const key in levelDic) {
            if (Object.prototype.hasOwnProperty.call(levelDic, key)) {
                const element = levelDic[key];
                if (element > tempLevel) {
                    heroIds = [Number(key)];
                    tempLevel = element;
                } else if (element == tempLevel) {
                    heroIds.push(Number(key));
                }

            }
        }
        return heroIds;
    }











}