import { EventEnum } from "../../../common/EventEnum";
import Game from "../../../Game";
import { GameEvent } from "../../../utils/GameEvent";
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import MonsterLayoutItem from "./MonsterLayoutItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MonsterLayoutBase extends cc.Component {
    @property(MonsterLayoutItem)
    items: MonsterLayoutItem[] = [];

    data: any = null;

    _currIndex: number = -1;

    public setData(data: any) {
        this._currIndex = -1;
        this.data = data;
    }
    public refresh() {
        for (let i = 0, len = this.items.length; i < len; i++) {
            let com = this.items[i];
            com.setData(this.data[i], i);
            com.setTarget(this);
            com.refresh();
        }
    }

    public onSelectItem(index: number = 0) {
        if (this._currIndex != -1) {
            this.items[this._currIndex].unSelect();
        }
        this._currIndex = index;
        this.items[this._currIndex].onSelect();
    }
}
