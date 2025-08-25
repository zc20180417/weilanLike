// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Dialog from "../../utils/ui/Dialog";
import { UiManager } from "../../utils/UiMgr";
import { EResPath } from "../../common/EResPath";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GetCardView extends Dialog {

    _newCardList: Array<any> = [];

    _currTowerData: any = null;

    setData(data: any) {
        this._newCardList = data;
    }

    start() {
        super.start();

        this.refresh();
    }

    refresh() {
        this._currTowerData = this._newCardList.shift();

    }

    onClick() {
        UiManager.hideDialog(this);

        if (this._newCardList.length > 0) {
            UiManager.showDialog(EResPath.TOWER_STAR_GET_CARD, this._newCardList);
        }

    }

}
