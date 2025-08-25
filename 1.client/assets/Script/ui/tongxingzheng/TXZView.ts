// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Game from "../../Game";
import Dialog from "../../utils/ui/Dialog";
import TapView, { TapViewData } from "../dayInfoView/TapView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TXZView extends Dialog {
    @property(TapView)
    tapView: TapView = null;

    @property(cc.Node)
    preNode: cc.Node = null;

    @property(cc.Node)
    nextNode: cc.Node = null;

    private _data: number = null;
    public setData(data: number): void {
        this._data = data;
    }

    protected beforeShow(): void {
        let tapViewData: TapViewData = {
            pageDatas: []
        }
        let configs = Game.battlePassMgr.getBattlePassConfigs();
        let open: boolean = false;
        for (const config of configs) {
            open = Game.battlePassMgr.checkBattlePassItemOpen(config);
            tapViewData.pageDatas.push(open ? config : null);
        }

        this.tapView.init(tapViewData);

        if (this._data !== -1 && this._data !== undefined && tapViewData.pageDatas[this._data]) {
            this.tapView.selectTap(this._data);
        } else {
            this.tapView.selectFirstTap();
        }
    }

    protected addEvent(): void {
        this.tapView.node.on(TapView.EventType.ON_SELECT_FIRST, this.onSelectFirst, this);
        this.tapView.node.on(TapView.EventType.ON_SELECT_LAST, this.onSelectLast, this);
    }

    private onSelectFirst() {
        this.preNode.active = false;
    }

    private onSelectLast() {
        this.nextNode.active = false;
    }

    clickPre() {
        !this.nextNode.active && (this.nextNode.active = true);
        this.tapView.selectPreTap();
    }

    clickNext() {
        !this.preNode.active && (this.preNode.active = true);
        this.tapView.selectNextTap();
    }
}
