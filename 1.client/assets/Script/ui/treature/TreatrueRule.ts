// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:


import Game from "../../Game";
import { EResPath } from "../../common/EResPath";

//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
export class ItemDataFormat {
    num: number;
    id: number;
}

export class TreatrueDataFormat {
    id: number;
    data: Array<ItemDataFormat> = [];
}

export enum QUALITY {
    NORMAL = 1,
    BLUE,
    PURPLE,
    ORANGE
}

export default class TreatureRule {

    _towerWeightCfg: any = null;

    _treatrueCfg: any = null;

    init() {
        this._towerWeightCfg = Game.gameConfigMgr.getCfg(EResPath.TOWER_WEIGHT)
        this._treatrueCfg = Game.gameConfigMgr.getCfg(EResPath.TREATRUE);
    }

    getTreatrueCfg(treatrueId: number): any {
        if (!this._treatrueCfg) return null;
        return this._treatrueCfg[treatrueId];
    }

    /**
     * 生成宝箱
     * @param treatrueId 
     */
    genTreatrue(treatrueId: number): TreatrueDataFormat {
        let cfg = this.getTreatrueCfg(treatrueId);
        let treatrueData: TreatrueDataFormat = new TreatrueDataFormat();
        treatrueData.id = treatrueId;
        let moenyData: Array<any> = this.genMoney(cfg);
        let cardData: Array<ItemDataFormat> = this.genCard(cfg);
        treatrueData.data = treatrueData.data.concat(moenyData, cardData);
        return treatrueData;
    }

    /**
     * 生成货币
     * @param treatrueCfg 
     */
    genMoney(treatrueCfg: any): Array<ItemDataFormat> {
        let moenyData: Array<ItemDataFormat> = [];
        let data: ItemDataFormat = null;
        if (treatrueCfg.energyMin > 0) {
            data = new ItemDataFormat();
            data.id = Game.towerMgr.getSharegoodsid();
            data.num = this.randomBetweenMinMax(treatrueCfg.energyMin, treatrueCfg.energyMax);
            moenyData.push(data);
        }
        if (treatrueCfg.slugMin > 0) {
            data = new ItemDataFormat();
            data.id = Game.strengMgr.getUpgradeGoodsid();
            data.num = this.randomBetweenMinMax(treatrueCfg.slugMin, treatrueCfg.slugMax);
            moenyData.push(data);
        }
        return moenyData;
    }

    /**
     * 生成卡片
     * @param treatrueCfg 
     */
    genCard(treatrueCfg: any): Array<ItemDataFormat> {
        let cardData: Array<ItemDataFormat> = [];
        let data: ItemDataFormat = null;

        //第一阶段：随机出每种不同品质的卡片数量
        let qualityData = {
            [QUALITY.NORMAL]: 0,
            [QUALITY.BLUE]: 0,
            [QUALITY.PURPLE]: 0,
            [QUALITY.ORANGE]: 0
        }

        let i = 0;
        while (i < treatrueCfg.totalCards) {
            let quality = this.randomQuality(treatrueCfg);
            qualityData[quality] += 1;
            i++;
        }

        //第二阶段：
        let totalTypeNum = this.randomBetweenMinMax(treatrueCfg.cardMin, treatrueCfg.cardMax);
        let typeData = [];

        for (let k in qualityData) {
            if (qualityData[k] != 0) typeData.push({ quality: parseInt(k), num: 0 });
        }

        let temp = typeData;
        typeData = [];
        while (totalTypeNum - temp.length >= 0) {
            totalTypeNum -= temp.length;
            temp.forEach(element => { element.num += 1; });

            for (let i = 0; i < temp.length; i++) {
                if (qualityData[temp[i].quality] == temp[i].num) {
                    let resultArr = temp.splice(i, 1);
                    typeData = typeData.concat(resultArr);
                    i--;
                }
            }
        }

        while (totalTypeNum > 0) {
            let index = Math.floor(Math.random() * temp.length);
            temp[index].num += 1;
            totalTypeNum--;

            for (let i = 0; i < temp.length; i++) {
                if (qualityData[temp[i].quality] == temp[i].num) {
                    let resultArr = temp.splice(i, 1);
                    typeData = typeData.concat(resultArr);
                    i--;
                }
            }
        }

        typeData = typeData.concat(temp);

        //第三阶段：

        typeData.forEach((element) => {
            let totalNum = qualityData[element.quality];
            let typeNum = element.num;
            let cardNums = [];
            let i = 0, index = 0;
            while (i < totalNum) {
                cardNums[index] = cardNums[index] || 0;
                cardNums[index] += 1;
                index++;
                index %= typeNum;
                i++;
            }

            let cardIds = this.randomCard(element.quality, typeNum);
            i = 0;
            while (i < typeNum) {
                data = new ItemDataFormat();
                data.id = cardIds[i];
                data.num = cardNums[i];
                // cc.log(typeData);
                // cc.log(totalTypeNum)
                cardData.push(data);

                i++;
            }
        });

        return cardData;
    }

    /**
     * 生成附加卡
     * @param treatureId 
     */
    genExtraCard(treatureId: any): ItemDataFormat {
        let treatureCfg = this.getTreatrueCfg(treatureId);
        let quality = this.randomQuality(treatureCfg);
        let cardsId: Array<any> = this.randomCard(quality, 1);
        let num = this.getExtraCardNum(treatureCfg, quality);
        let data = new ItemDataFormat();
        data.id = cardsId[0];
        data.num = num;
        return data;
    }

    /**
     * 获取附加卡数量
     * @param treatrueCfg 
     * @param quality 
     */
    getExtraCardNum(treatrueCfg: any, quality: number) {
        let num = 0;
        switch (quality) {
            case QUALITY.NORMAL:
                num = treatrueCfg.normalExtra;
                break;
            case QUALITY.BLUE:
                num = treatrueCfg.blueExtra;
                break;
            case QUALITY.PURPLE:
                num = treatrueCfg.purpleExtra;
                break;
            case QUALITY.ORANGE:
                num = treatrueCfg.orangeExtra;
                break;

        }
        return num;
    }

    randomBetweenMinMax(min: number, max: number) {
        return Math.floor(Math.random() * Math.abs(max - min) + min);
    }

    randomQuality(treatrueCfg: any): any {
        let rate = 10000 * Math.random();
        let qualityRate = [
            treatrueCfg.normalRate,
            treatrueCfg.blueRate,
            treatrueCfg.purpleRate,
            treatrueCfg.orangeRate
        ];

        let temp = 0;
        for (let i = 0; i < qualityRate.length; i++) {
            temp += qualityRate[i];
            if (rate < temp) {
                return i + 1;
            }
        }
    }

    randomCard(quality: number, num: number): Array<any> {
        let totalWeight = 0;
        let list = [];
        let cardsId = [];

        for (let k in this._towerWeightCfg) {
            let element = this._towerWeightCfg[k];
            if (element.quality == quality) {
                list.push(element);
                totalWeight += element.weight;
            }
        }


        let j = 0;
        while (j < num) {
            let rate = totalWeight * Math.random();
            let tempRate = 0;
            for (let i = 0; i < list.length; i++) {
                tempRate += list[i].weight;
                if (rate < tempRate) {
                    cardsId.push(list[i].id);
                    totalWeight -= list[i].weight;
                    list.splice(i, 1);
                    break;
                }
            }
            j++;
        }
        return cardsId;
    }

}
