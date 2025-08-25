import { ECamp, GAME_TYPE, MonsterDropType, PrizeRollItemData } from "../common/AllEnum";
import { GameCommonConfig, MissionDropConfig } from "../common/ConfigInterface";
import { EResPath } from "../common/EResPath";
import { EventEnum } from "../common/EventEnum";
import Game from "../Game";
import { GameEvent } from "../utils/GameEvent";
import { MathUtils } from "../utils/MathUtils";
import { UiManager } from "../utils/UiMgr";
import { LDBaseGameCtrl } from "./LDBaseGameCtrl";
import { LDSkillStrengthBase } from "./skill/LdSkillManager";
import { HeroBuilding } from "./tower/HeroBuilding";

export class LDMonsterDropCtrl {


    gameCtrl:LDBaseGameCtrl = null;

    private _curDropId:number = 0;
    private _dropList:PrizeRollItemData[] = [];
    private _dropGoodsList:PrizeRollItemData[] = [];
    private _allDropList:PrizeRollItemData[] = [];
    private _allHeroBuilding:HeroBuilding[] = [];
    private _curDropConfig:MissionDropConfig;
    private _gameCommonConfig:GameCommonConfig = null;
    private _addCoin:number = 0;
    private _campId:ECamp = ECamp.BLUE;
    private static COIN_GOODS_ID = 99999;

    constructor(ctrl:LDBaseGameCtrl , campId:ECamp = ECamp.BLUE) {
        this.gameCtrl = ctrl;
        this._campId = campId;
    }

    initMonsterDrop() {
        this._gameCommonConfig = this.gameCtrl.gameCommonConfig;
        this._allHeroBuilding = this.gameCtrl.getHeroBuildingCtrl(this._campId).getAllHeroBuildings();
        this._allDropList.length = 0;
        const len = this._allHeroBuilding.length;
        for (let i = 0; i < len; ++i) {
            this._allDropList[i] = {type:2 , itemID:this._allHeroBuilding[i].heroId };
        }

        this._allDropList.push({type:1 , itemID:LDMonsterDropCtrl.COIN_GOODS_ID});
        GameEvent.on(EventEnum.LD_OPEN_DROPS_BOX , this.onMonsterDrop , this);
    }

    resetMonsterDrop() {
        GameEvent.off(EventEnum.LD_OPEN_DROPS_BOX , this.onMonsterDrop , this);
    }


    onMonsterDrop(dropId:number , campId:ECamp) {
        if (this.gameCtrl.getGameType() == GAME_TYPE.PVP && campId != this._campId) return;
        this._dropList = [];
        this._dropGoodsList = [];
        const dropConfig:MissionDropConfig = Game.gameConfigMgr.getMissionDropConfig(dropId);
        if (!dropConfig) return;
        this._curDropConfig = dropConfig;
        this._addCoin = 0;

        let totalWeight = 0;
        let index = 2;
        for (index = 2; index <= 14; index++) {
            totalWeight += dropConfig['kind' + index];
        }

        const random = MathUtils.randomInt(1 , totalWeight);
        let curWeight = 0;
        for (index = 2; index <= 14; index++) {
            const weight = dropConfig['kind' + index];
            curWeight += weight;
            if (random <= curWeight) {
                break;
            }
        }

        switch (index) {
            case MonsterDropType.SKILL_THREE:
                this.onDropSkillThree();
                break;
            case MonsterDropType.SKILL_TOW:
                this.onDropSkillTwo();
                break;
            case MonsterDropType.SKILL_AAABB:
                this.onDropSkillAAABB();
                break;
            case MonsterDropType.SKILL_AABB:
                this.onDropSkillAABB();
                break;
            case MonsterDropType.SKILL_AAA:
                this.onDropSkillAAA(false);
                break;
            case MonsterDropType.SKILL_AA:
                this.onDropSkillAA(false , 0);
                break;
            case MonsterDropType.COIN_1:
                this.onDropCoin1();
                break;
            case MonsterDropType.COIN_2:
                this.onDropCoin2();
                break;
            case MonsterDropType.COIN_3:
                this.onDropCoin3();
                break;
            case MonsterDropType.COIN_4:
                this.onDropCoin4();
                break;
            case MonsterDropType.SKILL_COIN_4:
                this.onDropSkillAAA(true);
                break;
            case MonsterDropType.SKILL_COIN_5:
                this.onDropSkillAA(true  , 1);
                break;
            case MonsterDropType.SKILL_COIN_6:
                this.onDropSkillAA(true , 2);
                break;
        
            default:
                break;
        }

        UiManager.showDialog(EResPath.LD_PRIZE_ROLL_VIEW , {dropList:this._dropList , 
            coin:this._addCoin , 
            allDropList:this._allDropList , 
            dropGoodsList:this._dropGoodsList});
    }

    private getRandomHero(count:number , filterId:number = 0) {
        const allHeroHuildings:HeroBuilding[] = this._allHeroBuilding;
        let randoms:HeroBuilding[] = [];
        let len = allHeroHuildings.length;
        for (let i = 0; i < len; ++i) {
            const heroBuilding = allHeroHuildings[i];
            if (filterId !== heroBuilding.heroId && heroBuilding.getBeLeftCanActiveSkillCount() >= count) {
                randoms.push(heroBuilding);
            }
        }
        return randoms.length > 0 ? MathUtils.randomGetItemByList(randoms) : null;
    }

    private onDropSkillThree() {
        const randomHero:HeroBuilding = this.getRandomHero(3);
        if (!randomHero) return;
        const prizeRollItemData = {type:2 , itemID:randomHero.heroId , isSelect:true};
        this._dropList[0] = (prizeRollItemData);
        this._dropList[1] = (prizeRollItemData);
        this._dropList[2] = (prizeRollItemData);
        this._dropList[3] = (prizeRollItemData);
        this._dropList[4] = (prizeRollItemData);

        for (let i = 0 ; i < 3; ++i) {
            let skills:LDSkillStrengthBase[] = randomHero.getReadyActiveStrengthSkillList();
            let skill1:LDSkillStrengthBase = MathUtils.randomGetItemByList(skills);
            this._dropGoodsList.push({type:2 , itemID:randomHero.heroId , skillId:skill1.skillID});
            GameEvent.emit(EventEnum.LD_ACTIVE_STRENGTH_SKILL , randomHero.heroId , skill1.skillID);
        }
    }

    private onDropSkillTwo() {
        const randomHero:HeroBuilding = this.getRandomHero(2);
        if (!randomHero) return;
        const prizeRollItemData = {type:2 , itemID:randomHero.heroId , isSelect:true};
        this._dropList[0] = (prizeRollItemData);
        this._dropList[1] = (prizeRollItemData);
        this._dropList[2] = (prizeRollItemData);
        this._dropList[3] = (prizeRollItemData);
        for (let i = 0 ; i < 2; ++i) {
            let skills:LDSkillStrengthBase[] = randomHero.getReadyActiveStrengthSkillList();
            let skill1:LDSkillStrengthBase = MathUtils.randomGetItemByList(skills);
            this._dropGoodsList.push({type:2 , itemID:randomHero.heroId , skillId:skill1.skillID});
            GameEvent.emit(EventEnum.LD_ACTIVE_STRENGTH_SKILL , randomHero.heroId , skill1.skillID);
        }
        if (this._curDropConfig.kind1 > 4) {
            this._dropList.push(this.randomGetOneDrop([randomHero.heroId]));
            MathUtils.mixItems(this._dropList);
        }
    }

    private onDropSkillAAABB() {
        const randomHero1:HeroBuilding = this.getRandomHero(1);
        if (!randomHero1) return;
        const prizeRollItemData1 = {type:2 , itemID:randomHero1.heroId , isSelect:true};
        this._dropList[0] = (prizeRollItemData1);
        this._dropList[1] = (prizeRollItemData1);
        this._dropList[2] = (prizeRollItemData1);

        //A+技能，之后再改
        let skills:LDSkillStrengthBase[] = randomHero1.getReadyActiveStrengthSkillList();
        let skill1:LDSkillStrengthBase = MathUtils.randomGetItemByList(skills);
        this._dropGoodsList.push({type:2 , itemID:randomHero1.heroId , skillId:skill1.skillID});
        GameEvent.emit(EventEnum.LD_ACTIVE_STRENGTH_SKILL , randomHero1.heroId , skill1.skillID);
        

        const randomHero2:HeroBuilding = this.getRandomHero(1 , randomHero1.heroId);
        if (!randomHero2) return;

        const prizeRollItemData2 = {type:2 , itemID:randomHero2.heroId , isSelect:true};
        this._dropList[3] = (prizeRollItemData2);
        this._dropList[4] = (prizeRollItemData2);

        let skills2:LDSkillStrengthBase[] = randomHero2.getReadyActiveStrengthSkillList();
        let skill2:LDSkillStrengthBase = MathUtils.randomGetItemByList(skills2);
        this._dropGoodsList.push({type:2 , itemID:randomHero2.heroId , skillId:skill2.skillID});
        GameEvent.emit(EventEnum.LD_ACTIVE_STRENGTH_SKILL , randomHero2.heroId , skill2.skillID);

        MathUtils.mixItems(this._dropList);
    }

    private onDropSkillAABB() {
        const randomHero1:HeroBuilding = this.getRandomHero(1);
        if (!randomHero1) return;
        const prizeRollItemData1 = {type:2 , itemID:randomHero1.heroId , isSelect:true};
        this._dropList[0] = (prizeRollItemData1);
        this._dropList[1] = (prizeRollItemData1);

        let skills:LDSkillStrengthBase[] = randomHero1.getReadyActiveStrengthSkillList();
        let skill1:LDSkillStrengthBase = MathUtils.randomGetItemByList(skills);
        this._dropGoodsList.push({type:2 , itemID:randomHero1.heroId , skillId:skill1.skillID});
        GameEvent.emit(EventEnum.LD_ACTIVE_STRENGTH_SKILL , randomHero1.heroId , skill1.skillID);
        

        const randomHero2:HeroBuilding = this.getRandomHero(1 , randomHero1.heroId);
        if (!randomHero2) return;

        const prizeRollItemData2 = {type:2 , itemID:randomHero2.heroId , isSelect:true};
        this._dropList[2] = (prizeRollItemData2);
        this._dropList[3] = (prizeRollItemData2);

        let skills2:LDSkillStrengthBase[] = randomHero2.getReadyActiveStrengthSkillList();
        let skill2:LDSkillStrengthBase = MathUtils.randomGetItemByList(skills2);
        this._dropGoodsList.push({type:2 , itemID:randomHero2.heroId , skillId:skill2.skillID});
        GameEvent.emit(EventEnum.LD_ACTIVE_STRENGTH_SKILL , randomHero2.heroId , skill2.skillID);

        if (this._curDropConfig.kind1 > 4) {
            const other = this.randomGetOneDrop([randomHero1.heroId , randomHero2.heroId] );
            this._dropList[4] = (other);
        }
        MathUtils.mixItems(this._dropList);
    }

    private onDropSkillAAA(addCoin:boolean) {
        const randomHero1:HeroBuilding = this.getRandomHero(1);
        if (!randomHero1) return;
        const prizeRollItemData1 = {type:2 , itemID:randomHero1.heroId , isSelect:true};
        this._dropList[0] = (prizeRollItemData1);
        this._dropList[1] = (prizeRollItemData1);
        this._dropList[2] = (prizeRollItemData1);
        //A+技能，之后再改
        let skills:LDSkillStrengthBase[] = randomHero1.getReadyActiveStrengthSkillList();
        let skill1:LDSkillStrengthBase = MathUtils.randomGetItemByList(skills);
        this._dropGoodsList.push({type:2 , itemID:randomHero1.heroId , skillId:skill1.skillID});
        GameEvent.emit(EventEnum.LD_ACTIVE_STRENGTH_SKILL , randomHero1.heroId , skill1.skillID);

        if (addCoin) {
            const prizeRollItemData2 = {type:1 , itemID:LDMonsterDropCtrl.COIN_GOODS_ID , isSelect:true};
            this._dropList[3] = (prizeRollItemData2);
            this._dropList[4] = (prizeRollItemData2);
            this._addCoin = this._gameCommonConfig.drop4;
            this._coinStr = '少量金币';
            this._dropGoodsList.push({type:1 , itemID:LDMonsterDropCtrl.COIN_GOODS_ID , count:this._addCoin, coinTitle:this._coinStr});
        } else {
            const other1 = this.randomGetOneDrop([randomHero1.heroId] );
            this._dropList[3] = (other1);
            if (this._curDropConfig.kind1 > 4) {
                const other2 = this.randomGetOneDrop([randomHero1.heroId , other1.itemID] );
                this._dropList[4] = (other2);
            }
        }
        
        MathUtils.mixItems(this._dropList);
    }

    private onDropSkillAA(addCoin:boolean , coinType:number) {
        const randomHero1:HeroBuilding = this.getRandomHero(1);
        if (!randomHero1) return;
        const prizeRollItemData1 = {type:2 , itemID:randomHero1.heroId , isSelect:true};
        this._dropList[0] = (prizeRollItemData1);
        this._dropList[1] = (prizeRollItemData1);
        let skills:LDSkillStrengthBase[] = randomHero1.getReadyActiveStrengthSkillList();
        let skill1:LDSkillStrengthBase = MathUtils.randomGetItemByList(skills);
        this._dropGoodsList.push({type:2 , itemID:randomHero1.heroId , skillId:skill1.skillID});
        GameEvent.emit(EventEnum.LD_ACTIVE_STRENGTH_SKILL , randomHero1.heroId , skill1.skillID);

        if (addCoin) {
            const prizeRollItemData2 = {type:1 , itemID:LDMonsterDropCtrl.COIN_GOODS_ID , isSelect:true};
            this._dropList[2] = (prizeRollItemData2);
            this._dropList[3] = (prizeRollItemData2);

            if (coinType == 1) {
                this._dropList[4] = (prizeRollItemData2);
                this._coinStr = '适量金币';
                this._addCoin = this._gameCommonConfig.drop3;
            } else if (coinType == 2) {
                if (this._curDropConfig.kind1 > 4) {
                    const other3 = this.randomGetOneDrop([randomHero1.heroId , LDMonsterDropCtrl.COIN_GOODS_ID] );
                    this._dropList[4] = (other3);
                }
                this._coinStr = '少量金币';
                this._addCoin = this._gameCommonConfig.drop4;
            }

            this._dropGoodsList.push({type:1 , itemID:LDMonsterDropCtrl.COIN_GOODS_ID , count:this._addCoin , coinTitle:this._coinStr});

        } else {

            const other1 = this.randomGetOneDrop([randomHero1.heroId] );
            this._dropList[2] = (other1);
            const other2 = this.randomGetOneDrop([randomHero1.heroId , other1.itemID] );
            this._dropList[3] = (other2);
            if (this._curDropConfig.kind1 > 4) {
                const other3 = this.randomGetOneDrop([randomHero1.heroId , other1.itemID  ,other2.itemID] );
                this._dropList[4] = (other3);
            }
        }

        MathUtils.mixItems(this._dropList);
    }

    /**
     * 巨量金币
     */
    private onDropCoin1() {
        const coinItem = {type:1 , itemID:LDMonsterDropCtrl.COIN_GOODS_ID , isSelect:true};
        for (let index = 0; index < this._curDropConfig.kind1; index++) {   
            this._dropList[index] = coinItem;
        }
        this._coinStr = '巨量金币';
        this._addCoin = this._gameCommonConfig.drop1;
        this._dropGoodsList.push({type:1 , itemID:LDMonsterDropCtrl.COIN_GOODS_ID , skillId:0 , count:this._addCoin , coinTitle:this._coinStr});
    }

    /**
     * 大量金币
     */
    private onDropCoin2() {
        const coinItem = {type:1 , itemID:LDMonsterDropCtrl.COIN_GOODS_ID , isSelect:true};
        for (let index = 0; index < 4; index++) {   
            this._dropList[index] = coinItem;
        }

        if (this._curDropConfig.kind1 > 4) {
            const other = this.randomGetOneDrop([LDMonsterDropCtrl.COIN_GOODS_ID] );
            this._dropList[4] = (other);
        }
        this._coinStr = '大量金币';
        this._addCoin = this._gameCommonConfig.drop2;
        this._dropGoodsList.push({type:1 , itemID:LDMonsterDropCtrl.COIN_GOODS_ID , skillId:0 , count:this._addCoin , coinTitle:this._coinStr});
    }   

    /**
     * 适量金币
     */
    private onDropCoin3() {
        const coinItem = {type:1 , itemID:LDMonsterDropCtrl.COIN_GOODS_ID , isSelect:true};
        for (let index = 0; index < 3; index++) {   
            this._dropList[index] = coinItem;
        }

        let filterIds = [LDMonsterDropCtrl.COIN_GOODS_ID]

        for (let i = 3 ; i < this._curDropConfig.kind1 ; i++) {
            const other = this.randomGetOneDrop(filterIds);
            this._dropList[i] = (other);
            filterIds.push(other.itemID)
        }
        this._coinStr = '适量金币';
        this._addCoin = this._gameCommonConfig.drop3;
        this._dropGoodsList.push({type:1 , itemID:LDMonsterDropCtrl.COIN_GOODS_ID , skillId:0 , count:this._addCoin, coinTitle:this._coinStr});
    }

    private onDropCoin4() {
        const coinItem = {type:1 , itemID:LDMonsterDropCtrl.COIN_GOODS_ID , isSelect:true};
        for (let index = 0; index < 2; index++) {   
            this._dropList[index] = coinItem;
        }

        let filterIds = [LDMonsterDropCtrl.COIN_GOODS_ID]

        for (let i = 2 ; i < this._curDropConfig.kind1 ; i++) {
            const other = this.randomGetOneDrop(filterIds);
            this._dropList[i] = (other);
            filterIds.push(other.itemID)
        }
        this._coinStr = '少量金币';
        this._addCoin = this._gameCommonConfig.drop4;
        this._dropGoodsList.push({type:1 , itemID:LDMonsterDropCtrl.COIN_GOODS_ID , skillId:0 , count:this._addCoin, coinTitle:this._coinStr});
    }

    private randomGetOneDrop(filterIds:number[]):PrizeRollItemData {
        let list:PrizeRollItemData[] = [];

        this._allDropList.forEach(element => {
            if (!filterIds.includes(element.itemID)) {
                list.push(element);
            }
        });

        let random = MathUtils.randomGetItemByList(list);
        return { type:random?.type || 0 , itemID:random?.itemID || 0 , isSelect:false };
    }

    private _coinStr = '';



}