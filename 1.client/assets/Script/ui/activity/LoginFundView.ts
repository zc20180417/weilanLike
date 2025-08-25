import { EventEnum } from "../../common/EventEnum";
import SysMgr from "../../common/SysMgr";
import Game from "../../Game";
import GlobalVal from "../../GlobalVal";
import { GS_SceneBattlePass2Config_BaseItem } from "../../net/proto/DMSG_Plaza_Sub_BattlePass";
import { GameEvent } from "../../utils/GameEvent";
import { Handler } from "../../utils/Handler";
import { StringUtils } from "../../utils/StringUtils";
import Dialog from "../../utils/ui/Dialog";
import { LoginFundState } from "./LoginFundState";
const { ccclass, property ,menu } = cc._decorator;

@ccclass
@menu('Game/ui/active/LoginFundView')
export class LoginFundView extends Dialog {

    @property(cc.Prefab)
    state1:cc.Prefab = null;

    @property(cc.Prefab)
    state2:cc.Prefab = null;

    @property(cc.Label)
    timeLabel:cc.Label = null;

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
    private _config:GS_SceneBattlePass2Config_BaseItem;
    private _mode:number = -1;
    private _handler:Handler;
    protected addEvent(): void {
        GameEvent.on(EventEnum.REFRESH_BATTLE_PASS2 , this.refresh , this);
    }

    protected beforeShow() {
        this.refresh();
    }

    private refresh() {
        this._config = Game.battlePassMgr.getCurBattlePass2ConfigItem();
        let privateData = Game.battlePassMgr.getCurBattlePass2Private(this._config);

        if (!this._config || !privateData) return;

        if (this._stateNode && (privateData.btmode > 0 && this._mode == 0)) {
            this._stateNode.removeFromParent();
            this._stateNode = null;
        }

        if (!this._stateNode) {
            if (privateData.btmode == 0) {
                this._stateNode = cc.instantiate(this.state1);
            } else {
                this._stateNode = cc.instantiate(this.state2);
            }
            this.stateContainer.addChild(this._stateNode);
        }

        if (this._mode != privateData.btmode) {
            let goodsInfo;
            if (privateData.btmode == 0) {
                this.lideNumLabel.string = '“超值基金”';
                this.jiazhiLabel.string = "￥" + this._config.noriginalrmb1;
                this.rechargeLabel.string =  "￥" + this._config.nrmb1;
            } else if (privateData.btmode == 1) {
                this.lideNumLabel.string = '“豪华基金”';
                this.jiazhiLabel.string =  "￥" + this._config.noriginalrmb2;
                this.rechargeLabel.string =  "￥" + this._config.nrmb2;
            } else {
                this.rechargeBtn.active = false;

                this.labelNodes.forEach(element => {
                    element.active = false;
                });
            }
        }

        this._mode = privateData.btmode;
        let comp:LoginFundState = this._stateNode.getComponent(LoginFundState);
        if (comp) {
            comp.show(privateData);
        }


        this.onTimer();
        SysMgr.instance.doLoop(this._handler , 60000 , 0 ,true);
        
        
    }

    onTimer() {
        let dtime = this._config.nendtime - (GlobalVal.getServerTime() * 0.001);
        let dtimeStr = StringUtils.getCeilTime(dtime); 
        this.timeLabel.string = `距离活动结束：${dtimeStr}`;
    }

    onDestroy(): void {
        super.onDestroy();
        if (this._handler) {

            SysMgr.instance.clearTimer(this._handler , true);
        }

    }
    
    onRechargeClick() {
        Game.battlePassMgr.battlePass2GetOrder(this._config.nid);
    }

}