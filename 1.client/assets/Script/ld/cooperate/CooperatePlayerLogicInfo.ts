import { ECamp } from "../../common/AllEnum";
import { GameCommonConfig } from "../../common/ConfigInterface";
import Game from "../../Game";
import { MathUtils } from "../../utils/MathUtils";
import { GamePlayerLogicInfo } from "../GamePlayerLogicInfo";
import { LdCooperateCtrl } from "../LdCooperateCtrl";

export class CooperatePlayerLogicInfo extends GamePlayerLogicInfo {

    private _initTableGridPosList:number[][] = [ [1 , 4] , [0 , 3] , [1 , 3] , [2 , 3] , [0 , 2] , [1 , 2] , [2 , 2]];
    private _maxGridX:number = 8;
    private _canCreateTablePosList:number[][] = []


    constructor(gameCommonConfig:GameCommonConfig , camp:ECamp , ctrl:LdCooperateCtrl) {
        super(gameCommonConfig , camp , ctrl);
        this._leadingRolePos = [camp == ECamp.BLUE ? 16.5 : (800 - 16.5) , -22];
        this._maxHeroTableCount = 16;
        for (let i = 0 ; i < 3 ; i++) {
            for (let j = 0 ; j < 6 ; j++) {
                if ( i == 2 && j > 3) break;
                this._canCreateTablePosList.push([i , j]);
            }
        }
    }

    protected createInitHeroTableItems() {
        let pos:number[] = [];
        let posX:number = 0;
        let posY:number = 0;

        for (let i = 0; i < 7 ; ++i) {
            pos = this._initTableGridPosList[i];
            posX = pos[0];
            posY = pos[1];
            this.createHeroTabelByGridPos(posX , posY);
        }
    }

    protected createHeroTabelByGridPos(gx:number , gy:number) {
        this._affectedTable.push([gx , gy]);
        gx = this._camp == ECamp.COOPERATE ? this._maxGridX - gx : gx;
        const table = Game.soMgr.createHeroTable(gx , gy , this._camp);
        table.setPosNow(this.getGridCenterX(gx) , this.getGridCenterY(gy));
        this._tableList.push(table);
        this._heroTableDic[gx + '_' + gy] = table;
    }

    protected calcCreateTablePos():[number , number] {
        const posList = this.getCanCreateTablePosList();
        const pos = MathUtils.randomGetItemByList(posList);
        if (this._heroTableDic[pos[0] + '_' + pos[1]]) {
            console.log('error');
        }
        return [pos[0] , pos[1]];
    }

    /**
     * 获取当前可创建新台子的台子坐标数组
     * @returns number[][]
     */
    private getCanCreateTablePosList(): number[][] {
        const result: number[][] = [];
        const directions = [
            [0, 1], [1, 0], [0, -1], [-1, 0], // 四方向
        ];
        // 用字符串表示坐标方便查重
        const affectedSet = new Set(this._affectedTable.map(([x, y]) => `${x},${y}`));
        const canCreateSet = new Set(this._canCreateTablePosList.map(([x, y]) => `${x},${y}`));
        for (const [x, y] of this._affectedTable) {
            for (const [dx, dy] of directions) {
                const nx = x + dx;
                const ny = y + dy;
                const key = `${nx},${ny}`;
                if (!canCreateSet.has(key)) continue; // 不是可建台子格子
                if (affectedSet.has(key)) continue; // 已建立台子
                result.push([nx, ny]);
            }
        }
        // 去重
        const uniqueResult: number[][] = [];
        const resultSet = new Set();
        for (const pos of result) {
            const key = `${pos[0]},${pos[1]}`;
            if (!resultSet.has(key)) {
                uniqueResult.push(pos);
                resultSet.add(key);
            }
        }
        return uniqueResult;
    }

}