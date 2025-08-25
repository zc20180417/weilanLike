// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { GameDataCtrl } from "../../logic/gameData/GameDataCtrl";
import { EMODULE, ItemMoneyType } from "../../common/AllEnum";
import { TowerUtil } from "../../logic/sceneObjs/TowerUtil";
import Game from "../../Game";
import { EventEnum } from "../../common/EventEnum";
import { UiManager } from "../../utils/UiMgr";
import { EResPath } from "../../common/EResPath";
import { GameEvent } from "../../utils/GameEvent";


export default class TowerStarSys extends GameDataCtrl {

    _currTowerStarCfg: Array<any> = null;//炮塔当前升星数据

    _towerTypeArr: Array<any> = null;//炮塔类型数组

    _towerActivate: Array<any> = [];//当前激活的炮塔

    public static _instance: TowerStarSys = null;

    _maxStar: number = 30;//最大星级

    constructor() {
        super();
        this.module = EMODULE.TOWER_STAR_SYS;
    }

    public static getInstance(): TowerStarSys {
        return TowerStarSys._instance = TowerStarSys._instance || new TowerStarSys();
    }

    init() {
        // GameEvent.on(EventEnum.GET_CARD, this.onGetCards, this));
        // // if(!this._currTowerStarCfg){

        // // }
    }

    read() {
        let data = this.readData();
        if (data) {
            this._currTowerStarCfg = data.towerStarCfg;
            this._towerActivate = data.towerActivate;
        } else {
            this._currTowerStarCfg = [];
            let towerCfg = TowerUtil.getAllTowerCfg();
            for (let key in towerCfg) {
                if (towerCfg[key].type !== 0) {//过滤萝卜
                    let data = {
                        mainId: towerCfg[key].type,
                        quality: towerCfg[key].quality,
                        star: 0,
                        isUnlock: false
                    }
                    this._currTowerStarCfg[towerCfg[key].type - 1] = this._currTowerStarCfg[towerCfg[key].type - 1] || [];
                    this._currTowerStarCfg[towerCfg[key].type - 1][towerCfg[key].quality - 1] = data;
                }
            }
        }
        this._towerTypeArr = [
            {
                type: 1,
                name: "单体"
            },
            {
                type: 2,
                name: "范围"
            },
            {
                type: 3,
                name: "减速"
            },
            {
                type: 4,
                name: "分裂"
            },
            {
                type: 5,
                name: "中毒"
            },
            {
                type: 6,
                name: "穿透"
            },
            {
                type: 7,
                name: "收益"
            }
        ];

    }



    write() {
        this.writeData(JSON.stringify({ towerStarCfg: this._currTowerStarCfg, towerActivate: this._towerActivate }));
    }

    /**
     * 获取炮塔碎片
     * @param data 
     */
    onGetCards(data: any) {
        UiManager.showDialog(EResPath.TOWER_STAR_GET_CARD, data);
    }

    /**
     * 获取炮塔当前的星级信息
     */
    getCurrTowerData(): any {
        return this._currTowerStarCfg;
    }

    /**
     * 获取炮塔当前星级信息
     * @param towerId 炮塔ID
     * @returns  炮塔星级
     */
    getTowerCurrStar(mainId: number, quality: number): any {
        return this._currTowerStarCfg[mainId - 1][quality - 1];
    }

    /**
     * 获取炮塔升星配置
     * @param mainId 
     * @param quality 
     * @param star 
     */
    getStarCfg(mainId: number, quality: number, star: number): any {
        if (star > 30) star = 30;
        return TowerUtil.getStarCfg(mainId, quality, star);
    }

    /**
     * 获取炮塔配置
     * @param mainId 
     * @param quality 
     * @param level 
     */
    getTowerCfg(mainId: number, quality: number, level: number = 1) {
        return TowerUtil.getTowerCfg(mainId, quality, level);
    }

    /**
     * 获取某一类型炮塔的总星数
     * @param index 
     */
    getTypeAllStar(index: number) {
        let totalStar = 0;
        this._currTowerStarCfg[index].forEach(element => { totalStar += element.star; });
        return totalStar;
    }

    /**
     * 获取炮塔类型数据
     */
    getTowerTypeArr() {
        return this._towerTypeArr;
    }

    /**
     * 获取炮塔类型名称
     * @param index 
     */
    getTowerTypeByIndex(index: number) {
        return this._towerTypeArr[index].name;
    }

    /**
     * 解锁炮塔
     * @param towerMainId 炮塔ID
     */
    unlockTower(towerMainId: number, quality: number, init: boolean = false) {
        let towerCfg = TowerUtil.getTowerCfg(towerMainId, quality, 1);

        let cfg = this._currTowerStarCfg[towerMainId - 1][quality - 1];
        cfg.isUnlock = true;
        cfg.star = 1;

        if (!this._towerActivate[towerMainId]) {
            this._towerActivate[towerMainId] = quality;
        }

        if (!init) {
            this.onGetCards(towerCfg);
        }
        this.write();
    }

    /**
     * 炮塔是否解锁
     * @param towerMainId 
     * @param quality 
     */
    isUnlockTower(towerMainId: number, quality: number): boolean {
        return this._currTowerStarCfg[towerMainId - 1][quality - 1].isUnlock;
    }

    /**
     * 激活炮塔
     * @param mainId 炮塔ID
     */
    activateTower(mainId: number, quality: number) {
        this._towerActivate[mainId] = quality;
        this.write();
        GameEvent.emit(EventEnum.ACTIVATE_TOWER);
    }

    /**获取当前激活的品质 */
    getActiveQuality(mainId: number): number {
        return this._towerActivate[mainId] || 1;
    }

    /**
     * 炮塔升星
     * @param mainId 炮塔ID
     */
    upStar(mainId: number, quality: number, towerStarCfg: any) {
        if (!Game.itemMgr.isEnough(towerStarCfg.cardID, towerStarCfg.cardconsume, true)
            || !Game.itemMgr.isEnough(Game.towerMgr.getSharegoodsid(), towerStarCfg.itemconsume, true))
            return false;

        Game.itemMgr.deleteItem(towerStarCfg.cardID, towerStarCfg.cardconsume);
        Game.itemMgr.deleteItem(Game.towerMgr.getSharegoodsid(), towerStarCfg.itemconsume);
        this._currTowerStarCfg[mainId - 1][quality - 1].star += 1;

        GameEvent.emit(EventEnum.UP_STAR_SUCC);

        this.write();
        return true;
    }

    /**
     * 是否达到最大星级
     * @param mainId 
     * @param quality 
     */
    isMaxStar(mainId: number, quality: number) {
        return this._currTowerStarCfg[mainId - 1][quality - 1].star === this._maxStar;
    }


    /**
     * 炮塔是否激活
     * @param mainId 
     * @param quality 
     */
    isTowerActivie(mainId: number, quality: number) {
        return this._towerActivate[mainId] == quality;
    }
}
