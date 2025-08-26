import { EventEnum } from "../../common/EventEnum";
import SysMgr from "../../common/SysMgr";
import Game from "../../Game";
import { GameEvent } from "../../utils/GameEvent";

import { Handler } from "../../utils/Handler";
import SystemTipsMgr from "../../utils/SystemTipsMgr";
import Dialog from "../../utils/ui/Dialog";

const { ccclass, property ,menu} = cc._decorator;

@ccclass
@menu("Game/ui/tips/ReconnectView")
export class ReconnectView extends Dialog {

    @property(cc.Node)
    btn:cc.Node = null;

    @property(cc.Node)
    btn2:cc.Node = null;

    @property(cc.Label)
    des2:cc.Label = null;


    private _timeHandler:Handler;
    private _strs:string[] = ["." , '..' , '...' , ''];
    private _index:number = 0;
    protected addEvent() {

        if (!this._timeHandler) {
            this._timeHandler = new Handler(this.onTimer , this);
        }

        console.log("--------------onEventEnum.RECONNECT_FAIL");
        GameEvent.on(EventEnum.RECONNECT_FAIL , this.onFail , this);
        GameEvent.on(EventEnum.RECONNECT_SUC , this.onSuccess , this);
        SysMgr.instance.doLoop(this._timeHandler , 500 ,0, true);
    }

    private onFail() {
        console.log("--------------onEventEnum.RECONNECT_FAIL  onFail");
        SysMgr.instance.clearTimer(this._timeHandler , true);
        this.des2.string = "重连失败，请检查网络";
        this.btn.active = this.btn2.active = true;
    }

    private onSuccess() {
        this.hide();
        SystemTipsMgr.instance.notice("重连成功");
    }

    private onTimer() {
        this.des2.string = this._strs[this._index % 4];
        this._index ++;
    }

    private goonReconnect() {
        this.btn.active = this.btn2.active = false;
        SysMgr.instance.doLoop(this._timeHandler , 500 , 0,true);
        Game.reconnectMgr.goonReConnect();
    }

    private exit() {
        Game.reconnectMgr.enterLoginScene();
    }

    protected beforeHide() {
        SysMgr.instance.clearTimer(this._timeHandler , true);
    }

    onDestroy() {
        this._timeHandler = null;
    }


}