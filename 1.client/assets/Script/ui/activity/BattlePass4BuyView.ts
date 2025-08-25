import Game from "../../Game";
import { BattlePassConfig4 } from "../../net/mgr/BattlePassMgr";
import { StringUtils } from "../../utils/StringUtils";
import Dialog from "../../utils/ui/Dialog";

const { ccclass, property ,menu } = cc._decorator;

@ccclass
@menu('Game/ui/active/BattlePass4BuyView')
export class BattlePass4BuyView extends Dialog {
    @property(cc.RichText)
    titleLabel:cc.RichText = null;

    @property(cc.RichText)
    tipsLabel:cc.RichText = null;

    private _data:BattlePassConfig4;
    private _type:number;
    setData(data:any) {
        if (data) {
            this._data = data.data;
            this._type = data.type;
        }
    }

    protected beforeShow(): void {
        if (this._data) {
            let str = this._type == 1 ? '超值基金':this._type == 2?"豪华基金":'超值+豪华基金';
            let colorStr = this._type == 1 ? "#ff9000" : "#b4070f";
            str = StringUtils.fontColor(str , colorStr);
            this.tipsLabel.string = `确认花费${this._data.baseItem['nrmb' + this._type]}元购买${str}？`;

            // let tipsStr = '购买' + StringUtils.fontColor(str , '#576f74') + '即享' + StringUtils.fontColor(str , '#ff90000') + '所有福利';
            // if (this._type == 1) {
            //     // tipsStr += '\n' + 
            // }

            // this.tipsLabel.string = tipsStr;
        }
    }


    onCancel() {
        this.hide();
    }

    onOkClick() {
        if (this._data) {
            Game.battlePassMgr.reqBattlePass4GetOrder(this._data.baseItem.nid , this._type);
            this.hide();
        }
    }

}