import { INetHandler } from "./INetHandler";
import SocketManager from "../SocketManager";
import { Handler } from "../../../utils/Handler";
import { EventEnum } from "../../../common/EventEnum";
import { GameEvent } from "../../../utils/GameEvent";

export default class BaseNetHandler implements INetHandler {

    protected _mainID: number = -1;
    protected _rootID: number = -1;
    protected _socketMgr: SocketManager;
    constructor(rootID: number, mainID: number = 0) {
        this._mainID = mainID;
        this._rootID = rootID;
        this._socketMgr = SocketManager.instance;
        this.register();
        GameEvent.on(EventEnum.EXIT_GAME,this.exitGame, this);
        GameEvent.on(EventEnum.SOCKET_ON_ERROR,this.onSocketError, this);
    }

    /**注册所有的解析配置 */
    register() {

    }

    send(subID: number, data: any) {
        this._socketMgr.sendData(this._rootID, this._mainID, subID, data);
    }

    name(): string {
        return "BaseNetHandler";
    }

    protected exitGame() {

    }

    protected onSocketError() {
        
    }

    /**注册解析结构和返回回调 */
    protected registerAnaysis(subID: number, handle: Handler, c: any) {
        this._socketMgr.registerHandler(this._rootID, this._mainID, subID, handle, c);
    }
}