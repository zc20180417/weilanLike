import { EResPath } from "../common/EResPath";
import { EventEnum } from "../common/EventEnum";
import Game from "../Game";
import GlobalVal from "../GlobalVal";
import { GameEvent } from "../utils/GameEvent";
import { MathUtils } from "../utils/MathUtils";
import { UiManager } from "../utils/UiMgr";

export enum EBeginBuff {
    ADD_INIT_COIN = 1,          //开局加金币n
    FREE_SKILL = 2	,           //随机免费道具n个
    REDUCE_MONSTER_BLOOD = 3,   //怪物血量减少n%
    ADD_TIME = 4,               //游戏时间增加n秒
    ADD_ATTACK = 5,             //增加所有猫咪攻击力n%
    ADD_DROP_COIN = 6,          //怪物死亡后，额外获得喵币n%
    ADD_SCENE_COIN = 7,         //破坏景物，额外获得喵币n%
    //8	*任务限制时间增加n%，“100秒摧毁全部景物”变为“120秒摧毁全部”
}

/**
 * 开局buff
 */
export class BeginBuffCtrl {

    private _curBuff:any = null;
    private _buffCfg:any = {};
    //怪物血量减少
    private _reduceMonsterBlood:number = 0;
    //增加的攻击力
    private _addAttack:number = 0;
    //增加怪物掉落金币
    private _addDropRate:number = 0;
    //增加场景物件掉落
    private _addSceneCoin:number = 0;
    //增加游戏时间
    private _addGameTime:number = 0;

    private _addLostItems:any[] = [];


    constructor() {
        this._buffCfg[1] = {type:1 , quality:1, value:600 , info:"开局金币+600"};
        this._buffCfg[2] = {type:1 , quality:2, value:1200, info:"开局金币+1200"};
        this._buffCfg[3] = {type:1 , quality:3, value:1800, info:"开局金币+1800"};

        this._buffCfg[4] = {type:2 , quality:1,  value:1,info:"随机免费道具1个"};
        this._buffCfg[5] = {type:2 , quality:2,  value:2,info:"随机免费道具2个"};
        this._buffCfg[6] = {type:2 , quality:3,  value:3,info:"随机免费道具3个"};

        this._buffCfg[7] = {type:3 , quality:1,  value:1000,info:"怪物血量-10%"};
        this._buffCfg[8] = {type:3 , quality:2,  value:1500,info:"怪物血量-15%"};
        this._buffCfg[9] = {type:3 , quality:3,  value:2000,info:"怪物血量-20%"};

        this._buffCfg[10] = {type:4 , quality:1,  value:20000,info:"游戏时间+20秒"};
        this._buffCfg[11] = {type:4 , quality:2,  value:40000,info:"游戏时间+40秒"};
        this._buffCfg[12] = {type:4 , quality:3,  value:60000,info:"游戏时间+60秒"};

        this._buffCfg[13] = {type:5 , quality:1,  value:1000,info:"猫咪攻击力+10%"};
        this._buffCfg[14] = {type:5 , quality:2,  value:1500,info:"猫咪攻击力+15%"};
        this._buffCfg[15] = {type:5 , quality:3,  value:2000,info:"猫咪攻击力+20%"};

        this._buffCfg[16] = {type:6 , quality:1,  value:1000,info:"怪物掉落金币+10%"};
        this._buffCfg[17] = {type:6 , quality:2, value:1500,info:"怪物掉落金币+15%"};
        this._buffCfg[18] = {type:6 , quality:3,  value:2000,info:"怪物掉落金币+20%"};

        this._buffCfg[19] = {type:7 , quality:1,  value:1000,info:"物件掉落金币+10%"};
        this._buffCfg[20] = {type:7 , quality:2,  value:1500,info:"物件掉落金币+15%"};
        this._buffCfg[21] = {type:7 , quality:3,  value:2000,info:"物件掉落金币+20%"};
    }

    /*
    testBuff() {
        this.reset();
        let buffList:any[] = [];
        let index = MathUtils.randomInt(1 , 21);
        buffList[0] = this._buffCfg[index];
        index = MathUtils.randomInt(1 , 21);
        buffList[1] = this._buffCfg[index];
        UiManager.showDialog(EResPath.BEGIN_BUFF_DIALOG , buffList);
    }
    */

    tryShowBuff():boolean {
        this.reset();
        let battleData = Game.sceneNetMgr.getBattleData();
        if (battleData && battleData.ntoplostwarid == GlobalVal.curMapCfg.nwarid && battleData.nlostcount > GlobalVal.curMapCfg.nlostcount) {
            for (let i = 0 ; i < GlobalVal.curMapCfg.nlostaddgoodsids.length ; i++) {
                if (GlobalVal.curMapCfg.nlostaddgoodsids[i] > 0) {
                    this._addLostItems.push({ id:GlobalVal.curMapCfg.nlostaddgoodsids[i] , num : GlobalVal.curMapCfg.nlostaddgoodsnums[i] });
                }
            }

            if (GlobalVal.curMapCfg.nlostaddattackper > 0) {
                UiManager.showDialog(EResPath.BEGIN_BUFF_DIALOG , GlobalVal.curMapCfg.nlostaddattackper);
                return true;
            }
        }
        
        if (this._addLostItems.length > 0) {
            GameEvent.emit(EventEnum.BEGIN_ADD_LOSE_ITEM);
        }
        return false;
    }

    selectBuff(buff:any) {
        this._curBuff = buff;
        this.initBuff();
        GameEvent.emit(EventEnum.SELECT_BEGIN_BUFF , this._curBuff);
    }

    toString(buff:any) {
        let str = buff ? 'type:' + EBeginBuff[buff.type] + "value:" + buff.value : "什么都没选";
        return str;
    }

    getInfo(buff:any) {

    }

    get reduceMonsterBlood():number {
        return this._reduceMonsterBlood;
    }

    get addAttack():number {
        return this._addAttack;
    }

    get addDropRate():number {
        return this._addDropRate;
    }

    get addSceneCoin():number {
        return this._addSceneCoin;
    }

    get addGameTime():number {
        return this._addGameTime;
    }

    get addLostItems():any[] {
        return this._addLostItems;
    }

    getLostItemCount(id:number):number {
        let len = this._addLostItems.length;
        for (let i = 0 ; i < len ; i++) {
            if (this._addLostItems[i].id == id) {
                return this._addLostItems[i].num;
            }
        }
        return 0;
    }

    private initBuff() {
        if (!this._curBuff) return;
        switch (this._curBuff.type) {
            case EBeginBuff.ADD_INIT_COIN:
                //开局加金币
                Game.cpMgr.addGold(this._curBuff.value);
                break;
            case EBeginBuff.ADD_TIME:
                //开局加时间
                this._addGameTime = this._curBuff.value;
                GameEvent.emit(EventEnum.ADD_MAP_TIME, this._curBuff.value);
                break;
            case EBeginBuff.REDUCE_MONSTER_BLOOD:
                //怪物血量减少
                this._reduceMonsterBlood = this._curBuff.value / 10000;
                break;
            case EBeginBuff.ADD_ATTACK:
                //增加的攻击力
                this._addAttack = this._curBuff.value / 1000;
                break;
            case EBeginBuff.ADD_DROP_COIN:
                //增加怪物掉落金币
                this._addDropRate = this._curBuff.value / 10000;
                break;
            case EBeginBuff.ADD_SCENE_COIN:
                //增加场景物件掉落
                this._addSceneCoin = this._curBuff.value / 10000;
                break;
            default:
                break;
        }
    }

    reset() {
        this._curBuff = null;
        this._reduceMonsterBlood = 0;
        this._addAttack = 0;
        this._addDropRate = 0;
        this._addSceneCoin = 0;
        this._addLostItems.length = 0;
    }

    

}