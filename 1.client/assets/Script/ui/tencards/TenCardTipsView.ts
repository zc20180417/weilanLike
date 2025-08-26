// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { QUALITY_BG_COLOR } from "../../common/AllEnum";
import Game from "../../Game";
import { GS_TroopsInfo_TroopsInfoItem } from "../../net/proto/DMSG_Plaza_Sub_Troops";
import { StringUtils } from "../../utils/StringUtils";
import Dialog from "../../utils/ui/Dialog";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TenCardTipsView extends Dialog {

    @property(cc.RichText)
    nameDes: cc.RichText = null;

    @property(cc.RichText)
    rateDes: cc.RichText = null;

    public setData(data: any): void {
        let desArr = this.formatRateInfo(data || "");
        this.nameDes.string = desArr[0];
        this.rateDes.string = desArr[1];
    }

    private formatRateInfo(info: string) {
        let infoArr = info.split("|");
        let nameResult = "";
        let rateResult = "";
        let rowArr, rate, color, name,towerCfg:GS_TroopsInfo_TroopsInfoItem;
        for (let v of infoArr) {
            if(!v)continue;
            rowArr = v.split("_");
            towerCfg=Game.towerMgr.getTroopBaseInfo(rowArr[0]);
            name= towerCfg?towerCfg.szname + '碎片':"";
            color = towerCfg ? QUALITY_BG_COLOR[towerCfg.btquality+1]:QUALITY_BG_COLOR[1];
            rate = (parseInt(rowArr[1]) * 0.01).toFixed(2) + "%";
            nameResult += StringUtils.richTextColorFormat(name, color) + "\n";
            rateResult += StringUtils.richTextColorFormat(rate, color) + "\n";
        }
        return [nameResult, rateResult];
    }
}
