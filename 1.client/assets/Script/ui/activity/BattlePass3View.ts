import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { BattlePassConfig3 } from "../../net/mgr/BattlePassMgr";
import { GS_SceneBattlePass3Private_Item } from "../../net/proto/DMSG_Plaza_Sub_BattlePass";
import { GameEvent } from "../../utils/GameEvent";
import Dialog from "../../utils/ui/Dialog";
import { BattlePass3State } from "./BattlePass3State";
const { ccclass, property ,menu } = cc._decorator;

@ccclass
@menu('Game/ui/active/BattlePass3View')
export class BattlePass3View extends Dialog {

    @property(cc.Prefab)
    state1:cc.Prefab = null;

    @property(cc.Prefab)
    state2:cc.Prefab = null;

    @property(cc.Node)
    rechargeBtn:cc.Node = null;

    @property(cc.Label)
    rechargeLabel:cc.Label = null;

    @property(cc.Node)
    stateContainer:cc.Node = null;

    @property(cc.Label)
    lideNumLabel:cc.Label = null;

    @property(cc.Label)
    jiazhiLabel:cc.Label = null;

    @property([cc.Node])
    labelNodes:cc.Node[] = [];

    private _stateNode:cc.Node = null;
    private _config:BattlePassConfig3;
    private _mode:number = -1;
    protected addEvent(): void {
        GameEvent.on(EventEnum.REFRESH_BATTLE_PASS3 , this.refresh , this);
    }

    protected beforeShow() {
        this.refresh();
    }

    private refresh() {
        let configs = Game.battlePassMgr.getBattlePassConfog3();
        let privateData = Game.battlePassMgr.getBattlePassPrivate3();
        
        if (!configs || !privateData || configs.length == 0 || privateData.uitemcount == 0) return;
        this._config = configs[0];

        let itemPrivate:GS_SceneBattlePass3Private_Item = privateData.items[0];

        if (this._stateNode && (itemPrivate.btmode > 0 && this._mode == 0)) {
            this._stateNode.removeFromParent();
            this._stateNode = null;
        }

        if (!this._stateNode) {
            if (itemPrivate.btmode == 0) {
                this._stateNode = cc.instantiate(this.state1);
            } else {
                this._stateNode = cc.instantiate(this.state2);
            }
            this.stateContainer.addChild(this._stateNode);
        }

        if (this._mode != itemPrivate.btmode) {
            let goodsInfo;
            if (itemPrivate.btmode == 0) {
                this.lideNumLabel.string = '“超值基金”';
                this.jiazhiLabel.string = "￥" + this._config.baseItem.noriginalrmb1;
                this.rechargeLabel.string =  "￥" + this._config.baseItem.nrmb1;
            } else if (itemPrivate.btmode == 1) {
                this.lideNumLabel.string = '“豪华基金”';
                this.jiazhiLabel.string =  "￥" + this._config.baseItem.noriginalrmb2;
                this.rechargeLabel.string =  "￥" + this._config.baseItem.nrmb2;
            } else {
                this.rechargeBtn.active = false;

                this.labelNodes.forEach(element => {
                    element.active = false;
                });
            }
        }

        this._mode = itemPrivate.btmode;
        let comp:BattlePass3State = this._stateNode.getComponent(BattlePass3State);
        if (comp) {
            comp.show(itemPrivate);
        }

        
    }
    
    onRechargeClick() {
        if (this._config) {
            Game.battlePassMgr.reqBattlePass3GetOrder(this._config.baseItem.nid);
        }
    }

}