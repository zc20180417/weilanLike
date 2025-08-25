import { EResPath } from "../../common/EResPath";
import { EventEnum } from "../../common/EventEnum";
import SceneMgr from "../../common/SceneMgr";
import SysMgr from "../../common/SysMgr";
import Game from "../../Game";
import { GameEvent } from "../../utils/GameEvent";
import { Handler } from "../../utils/Handler";
import { LocalStorageMgr } from "../../utils/LocalStorageMgr";
import { UiManager } from "../../utils/UiMgr";
import SocketManager from "./SocketManager";

export class ReconnectMgr {

    private logStr = "---------------------------->ReconnectMgr:";

    private _reconnectCount: number = 0;
    constructor() {
        GameEvent.on(EventEnum.SOCKET_ON_ERROR, this.onSocketError, this);
        GameEvent.on(EventEnum.ON_GAME_SHOW, this.onGameShow, this);
    }

    goonReConnect() {
        this._reconnectCount = 0;
        this.onTimer();
    }

    readyReConnect() {
        //cc.log(this.logStr , 'readyReConnect');
        SysMgr.instance.clearTimer(Handler.create(this.onTimer, this), true);
        SysMgr.instance.doOnce(Handler.create(this.onTimer, this), 500, true);
    }

    enterLoginScene(reconnect: boolean = true) {
        //cc.log(this.logStr , 'enterLoginScene');
        UiManager.removeAll();
        if (Game.curLdGameCtrl) {
            GameEvent.emit(EventEnum.DO_EXIT_MAP , false , true);
        }

        if (!reconnect) {
            LocalStorageMgr.setItem('loginwx', '', false);
        }

        GameEvent.emit(EventEnum.EXIT_GAME);
        SceneMgr.instance.loadScene("Loading");
        // Game.nativeApi.switchAccount();
    }

    private reConnect() {
        //cc.log(this.logStr , 'reConnect');
        //重连
        SysMgr.instance.clearTimer(Handler.create(this.onTimer, this), true);
        GameEvent.on(EventEnum.SOCKET_CONNECTED, this.onSocketConnected, this);
        SocketManager.instance.reConnect();
    }

    private onSocketError() {
        GameEvent.off(EventEnum.SOCKET_CONNECTED, this.onSocketConnected, this);
        //cc.log(this.logStr , 'onSocketError' , "curScene:" + SceneMgr.instance.curScene);
        if (SceneMgr.instance.curScene == "Loading") {
            //SystemTipsMgr.instance.notice("连接服务器失败,请检查网络");
            return;
        }
        UiManager.showDialog(EResPath.RECONNECT_VIEW);
        this.readyReConnect();
    }

    private onTimer() {
        this._reconnectCount++;
        if (this._reconnectCount > 10) {
            //this.enterLoginScene();
            GameEvent.emit(EventEnum.RECONNECT_FAIL);
            return;
        }
        //cc.log(this.logStr , 'onTimer');
        this.reConnect();
    }

    /**
     * 从后台回来，检测是否掉线了
     */
    private onGameShow() {
        console.log(this.logStr, 'onGameShow', 'isConnected:' + (SocketManager.instance.isConnected ? "true" : "false"), "nactordbid:" + Game.actorMgr.nactordbid);
        //掉线了
        if (Game.actorMgr.nactordbid > 0 && !SocketManager.instance.isConnected) {
            this.onSocketError();
        }
    }

    /**
     * socket链接成功，重新登录
     */
    private onSocketConnected() {
        //cc.log(this.logStr , 'onSocketConnected' , "nactordbid:" + Game.actorMgr.nactordbid);
        SysMgr.instance.clearTimer(Handler.create(this.onTimer, this), true);
        GameEvent.off(EventEnum.SOCKET_CONNECTED, this.onSocketConnected, this);
        if (Game.actorMgr.nactordbid == 0) {
            return;
        }
        this._reconnectCount = 0;
        //cc.log(this.logStr , 'doPlazaLogin' , "nactordbid:" + Game.actorMgr.nactordbid , 'loginKey:' + Game.actorMgr.loginKey , 'reconnectionid:' + Game.actorMgr.reconnectionid );
        Game.loginMgr.doPlazaLogin(Game.actorMgr.nactordbid, Game.actorMgr.loginKey, Game.actorMgr.reconnectionid);
        GameEvent.emit(EventEnum.RECONNECT_SUC);
    }

}