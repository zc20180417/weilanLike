// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { BuryingPointMgr, EBuryingPoint } from "../../buryingPoint/BuryingPointMgr";
import { GLOBAL_FUNC } from "../../common/AllEnum";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { GS_SignConfig, GS_SignPrivateInfo } from "../../net/proto/DMSG_Plaza_Sub_Sign";
import { GameEvent, Reply } from "../../utils/GameEvent";
import TapPageItem from "../dayInfoView/TapPageItem";
import SignTapItem from "./SignTapItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SignTapView extends TapPageItem {
    @property(cc.Node)
    layout: cc.Node = null;



    private _items: SignTapItem[] = [];

    onLoad(): void {
        let children = this.layout.children;
        for (const node of children) {
            this._items.push(node.getComponent(SignTapItem));
        }

        GameEvent.on(EventEnum.ON_SIGN_PRIVATEINFO, this.onSignInfo, this);
        GameEvent.on(EventEnum.ON_SIN_CONFIG, this.onSignCfg, this);
        GameEvent.onReturn("get_sign_btn", this.onGetSignItem, this);
        // GameEvent.emit(EventEnum.SHOW_SIGN_TAB_VIEW);
    }

    start() {
        super.start();
        Game.globalFunc.tryStartSystemGuide(GLOBAL_FUNC.DAILY_CP);
    }

    public refresh() {
        let cfg: GS_SignConfig = Game.signMgr.getSignConfig();
        if (!cfg) return;
        if (cfg && cfg.reward) {
            let len: number = this._items.length;
            for (let i = 0; i < this._items.length; i++) {
                if (cfg.reward[i]) {
                    this._items[i].node.active = true;
                    this._items[i].setData(cfg.reward[i], i);
                } else {
                    this._items[i].node.active = false;
                }
            }
        }

        this.onSignInfo(Game.signMgr.getSignInfo());
    }

    protected beforeShow() {
        BuryingPointMgr.post(EBuryingPoint.SHOW_SIGN_VIEW);
    }

    private onSignCfg() {
        this.refresh();
    }

    private onSignInfo(data: GS_SignPrivateInfo) {
        if (!data) return;
        let cfg: GS_SignConfig = Game.signMgr.getSignConfig();
        if (!cfg) return;
        if (cfg && cfg.reward) {
            for (let i = 0; i < this._items.length; i++) {
                if (cfg.reward[i]) this._items[i].refreshState(data.btcheckindex, data.btsigncount);
            }
        }
    }

    protected onGetSignItem(reply:Reply, str: string): cc.Node {
        return reply(this._items[0].node);
    }

    onDestroy() {
        GameEvent.off(EventEnum.ON_SIGN_PRIVATEINFO, this.onSignInfo, this);
        GameEvent.off(EventEnum.ON_SIN_CONFIG, this.onSignCfg, this);
        GameEvent.offReturn("get_sign_btn", this.onGetSignItem, this);
    }
}
