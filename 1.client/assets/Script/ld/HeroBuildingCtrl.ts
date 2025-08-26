import { ECamp } from "../common/AllEnum";
import { EventEnum } from "../common/EventEnum";
import { GameEvent } from "../utils/GameEvent";
import { MathUtils } from "../utils/MathUtils";
import { GamePlayerLogicInfo } from "./GamePlayerLogicInfo";
import { LDSkillStrengthBase } from "./skill/LdSkillManager";
import { HeroBuilding } from "./tower/HeroBuilding";

export class HeroBuildingCtrl {

    private activeSkillCount: number = 3;

    private _heroBuildings: HeroBuilding[] = [];
    private _heroBuildingDic: { [key: number]: HeroBuilding } = {};
    private _strengthSkillTimes:number = 0;
    // private _gameCtrl:LDBaseGameCtrl;
    private _playerLogicInfo:GamePlayerLogicInfo; 

    getCampId():ECamp {
        return this._playerLogicInfo.campId;
    }

    //初始化英雄技能构建类列表
    initHeroBuildings(heroIds: number[], playerLogicInfo:GamePlayerLogicInfo) {
        this._playerLogicInfo = playerLogicInfo;
        const len = heroIds.length;
        for (let i = 0 ; i < len; ++i) {
            const heroId = heroIds[i];
            const heroBuild:HeroBuilding = this._heroBuildingDic[heroId] = new HeroBuilding();
            heroBuild.init(heroId , this.getCampId());
            this._heroBuildings.push(heroBuild);
        }
        // this._gameCtrl = gameCtrl;
        GameEvent.on(EventEnum.LD_REFRESH_MAX_LEVEL , this.onRefreshMaxLevel , this);
    }

    //清除英雄技能构建类列表
    clearHeroBuildings() {
        const len = this._heroBuildings.length;
        for (let i = 0; i < len; ++i) {
            this._heroBuildings[i].clear();
        }
        this._heroBuildings.length = 0;
        this._strengthSkillTimes = 0;
        this._heroBuildingDic = {};
        GameEvent.off(EventEnum.LD_REFRESH_MAX_LEVEL , this.onRefreshMaxLevel , this);
    }

    private onRefreshMaxLevel(heroid:number , data:{uid:number, level:number} , campId:ECamp) {
        if (campId !== this.getCampId()) return;
        const heroBuild = this.getHeroBuilding(heroid);
        if (heroBuild) {
            heroBuild.maxLevelHeroUid = data.uid;
        }
    }

    //获取英雄技能构建类
    getHeroBuilding(heroId: number): HeroBuilding {
        return this._heroBuildingDic[heroId];
    }

    getAllHeroBuildings(): HeroBuilding[] {
        return this._heroBuildings;

    }

    getReadyStrengthSkills(heroId:number = 0):LDSkillStrengthBase[] {
        return heroId ? this.getReadyStrengthSkillsByHero(heroId) : this.getReadyActiveStrengthSkillList();
    }

    //获取强化技能列表
    private getReadyActiveStrengthSkillList():LDSkillStrengthBase[] {
        this._strengthSkillTimes ++;
        if (this._strengthSkillTimes < 3) {
            return this.getReadyActiveStrengthSkillListFirst();
        } else if (this._strengthSkillTimes < 10) {
            return this.getReadyActiveStrengthSkillListSecond();
        } else {
            return this.getReadyActiveStrengthSkillListThird();
        }
    }

    /**
     * 获取优先级排序的三个已就绪强化技能列表
     * 优先从最高等级英雄、星级英雄和其他英雄中依次随机选取技能，避免重复英雄技能
     * 最后对结果进行随机打乱
     * @returns 已就绪强化技能数组，最多三个
     */
    private getReadyActiveStrengthSkillListFirst(): LDSkillStrengthBase[] {
        const out: LDSkillStrengthBase[] = [];
        // 获取第一个技能：最高等级英雄
        let readyList = this.collectSkillsByHeroIds(this._playerLogicInfo.getMaxLevelHeros());
        const firstSkill = this.randomGetReadyStrengthSkill(readyList);
        if (!firstSkill) return out;
        out.push(firstSkill);

        // 获取第二个技能：星级英雄，排除第一个技能
        readyList = this.collectSkillsByHeroIds(this._playerLogicInfo.getMaxTotalStarHeros())
            .filter(skill => skill !== firstSkill);
        const secondSkill = this.randomGetReadyStrengthSkill(readyList);
        if (!secondSkill) return out;
        out.push(secondSkill);

        // 获取第三个技能，避免与前两个技能重复英雄
        if (firstSkill.heroId === secondSkill.heroId) {
            // 前两个技能来自同一英雄，排除该英雄
            readyList = [];
            for (const building of this._heroBuildings) {
                if (building.heroId !== firstSkill.heroId) {
                    readyList.push(...building.getReadyActiveStrengthSkillList());
                }
            }
        } else {
            // 否则从所有英雄技能中排除前两个技能
            readyList = [];
            for (const building of this._heroBuildings) {
                readyList.push(...building.getReadyActiveStrengthSkillList());
            }
            readyList = readyList.filter(skill => skill !== firstSkill && skill !== secondSkill);
        }
        const thirdSkill = this.randomGetReadyStrengthSkill(readyList);
        if (thirdSkill) out.push(thirdSkill);

        // 随机打乱结果顺序
        MathUtils.mixItems(out);
        return out;
    }

    private getReadyActiveStrengthSkillListSecond(): LDSkillStrengthBase[] {
        let out:LDSkillStrengthBase[] = [];
        let totalStarHeroIds = this._playerLogicInfo.getMaxTotalStarHeros();
        const maxSkillHeroIds = this.getMaxSkillHeroIds();
        //技能1 召唤总星数最高英雄技能50%|技能数量最高英雄技能50%召唤总星数最高英雄技能50%技能数量最高英雄技能50%(拥有6技能英雄不再此列，技能数量最高英雄技能50%)
        //技能2 全随机技能
        //技能3 如果技能1和技能2为同一英雄，则排除该英雄随机技能
        maxSkillHeroIds.forEach(element => {
            if (!totalStarHeroIds.includes(element)) {
                totalStarHeroIds.push(element);
            }
        });
        let readyList = this.collectSkillsByHeroIds(totalStarHeroIds);
        const firstSkill = this.randomGetReadyStrengthSkill(readyList);
        if (!firstSkill) return out;
        out.push(firstSkill);
        
        readyList = [];
        for (const building of this._heroBuildings) {
            readyList.push(...building.getReadyActiveStrengthSkillList());
        }
        let index = readyList.indexOf(firstSkill);
        if (index != -1) {
            readyList.splice(index, 1)
        }

        const secondSkill = this.randomGetReadyStrengthSkill(readyList);
        if (!secondSkill) return out;
        out.push(secondSkill);

        // 获取第三个技能，避免与前两个技能重复英雄
        if (firstSkill.heroId === secondSkill.heroId) {
            // 前两个技能来自同一英雄，排除该英雄
            readyList = [];
            for (const building of this._heroBuildings) {
                if (building.heroId !== firstSkill.heroId) {
                    readyList.push(...building.getReadyActiveStrengthSkillList());
                }
            }
        } else {
            // 否则从所有英雄技能中排除前两个技能
            index = readyList.indexOf(secondSkill);
            if (index != -1) {
                readyList.splice(index, 1)
            }
        }
        const thirdSkill = this.randomGetReadyStrengthSkill(readyList);
        if (thirdSkill) out.push(thirdSkill);
        // 随机打乱结果顺序
        MathUtils.mixItems(out);
        return out;
    }

    private getReadyActiveStrengthSkillListThird(): LDSkillStrengthBase[] {
        let out:LDSkillStrengthBase[] = [];
        let readyList = [];
        for (const building of this._heroBuildings) {
            readyList.push(...building.getReadyActiveStrengthSkillList());
        }

        let firstSkill = this.randomGetReadyStrengthSkill(readyList);
        if (!firstSkill) return out;
        out.push(firstSkill);
        readyList.splice(readyList.indexOf(firstSkill), 1);

        let secondSkill = this.randomGetReadyStrengthSkill(readyList);
        if (!secondSkill) return out;
        out.push(secondSkill);
        
        // 获取第三个技能，避免与前两个技能重复英雄
        if (firstSkill.heroId === secondSkill.heroId) {
            // 前两个技能来自同一英雄，排除该英雄
            readyList = [];
            for (const building of this._heroBuildings) {
                if (building.heroId !== firstSkill.heroId) {
                    readyList.push(...building.getReadyActiveStrengthSkillList());
                }
            }
        } else {
            readyList.splice(readyList.indexOf(secondSkill), 1);
        }

        const thirdSkill = this.randomGetReadyStrengthSkill(readyList);
        if (thirdSkill) out.push(thirdSkill);
        // 随机打乱结果顺序
        MathUtils.mixItems(out);
        return out;

    }

    private collectSkillsByHeroIds(heroIds: number[]): LDSkillStrengthBase[] {
        const skills: LDSkillStrengthBase[] = [];
        for (const heroId of heroIds) {
            const heroBuild = this.getHeroBuilding(heroId);
            if (heroBuild) skills.push(...heroBuild.getReadyActiveStrengthSkillList());
        }
        return skills;
    }

    /**
     * 获取指定英雄的已就绪技能强度数组
     * @param heroId 英雄ID
     * @returns 已就绪技能强度数组
     */
    private getReadyStrengthSkillsByHero(heroId:number):LDSkillStrengthBase[] {
        let readyList = this.getHeroBuilding(heroId).getReadyActiveStrengthSkillList();
        let out:LDSkillStrengthBase[] = [];
        while(readyList.length > 0 && out.length < this.activeSkillCount) {
            const skill = this.randomGetReadyStrengthSkill(readyList);
            if (!skill) break;
            out.push(skill);
            readyList.splice(readyList.indexOf(skill), 1); 
        }
        return out;
    }

    private randomGetReadyStrengthSkill(readyList:LDSkillStrengthBase[]): LDSkillStrengthBase {
        let totalWeight = 0;
        readyList.forEach(element => {
            totalWeight += (element.baseWeight || 1);
        });

        let random = MathUtils.randomInt(1, totalWeight);
        const len = readyList.length;
        for (let i = 0; i < len; ++i) {
            const skill = readyList[i];
            random -= (skill.baseWeight || 1);
            if (random <= 0) {
                return skill;
            }
        }
        return null;
    }

    /**
     * 获取拥有最大技能数量的英雄ID数组
     *
     * @returns 拥有最大技能数量的英雄ID数组
     */
    private getMaxSkillHeroIds():number[] {
        let heroIds:number[] = [];
        let count = -1;
        this._heroBuildings.forEach(element => {
            const len = element.strengthSkillList.length;
            if (count < len && len < 6) {
                heroIds = [element.heroId];
                count = len;
            } else if (count === len) {
                heroIds.push(element.heroId);
            }

        });

        return heroIds;
    }
















































































































































































































































































































































































}