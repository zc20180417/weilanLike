import { EResPath } from "../../common/EResPath";
import { EventEnum } from "../../common/EventEnum";
import GlobalVal from "../../GlobalVal";
import { GameEvent } from "../../utils/GameEvent";
import { Handler } from "../../utils/Handler";
import { UiManager } from "../../utils/UiMgr";
import { GS_GatewaySocketError, GS_GatewayTips, GS_GATEWAY_COMMAND_MSG, GS_KeepActive, GS_MaintenanceNotice, GS_SendHttpFile, GS_ServerCheckActive } from "../proto/DMSG_GatewayServer_Sub_Command";
import BaseNetHandler from "../socket/handler/BaseNetHandler";
import { CMD_ROOT, GS_GATEWAY_MSGID } from "../socket/handler/MessageEnum";

export default class GatewayMgr extends BaseNetHandler {
    constructor() {
        super(CMD_ROOT.CMDROOT_GATEWAY_MSG, GS_GATEWAY_MSGID.GS_GATEWAY_MSGID_COMMAND);
        GameEvent.on(EventEnum.SOCKET_IDLE, this.reqKeepActive, this);
    }

    register() {
        this.registerAnaysis(GS_GATEWAY_COMMAND_MSG.GATEWAY_COMMAND_TIPS, Handler.create(this.onGatewayTips, this), GS_GatewayTips);
        this.registerAnaysis(GS_GATEWAY_COMMAND_MSG.GATEWAY_COMMAND_SOCKETERROR, Handler.create(this.onGatewaySocketError, this), GS_GatewaySocketError);
        this.registerAnaysis(GS_GATEWAY_COMMAND_MSG.GATEWAY_COMMAND_SENDHTTPFILE, Handler.create(this.onSendHttpFile, this), GS_SendHttpFile);
        this.registerAnaysis(GS_GATEWAY_COMMAND_MSG.GATEWAY_COMMAND_MAINTENANCENOTICE, Handler.create(this.onMaintenanceNotice, this), GS_MaintenanceNotice);
        this.registerAnaysis(GS_GATEWAY_COMMAND_MSG.GATEWAY_COMMAND_SERVERCHECKACTIVE, Handler.create(this.serverCheckActive, this), GS_ServerCheckActive);
    }

    /**
     * 服务器检测存活（客户端不需要处理
     * @param data 
     */
    private serverCheckActive(data: GS_ServerCheckActive) {

    }

    /**
     * 请求保持激活
     */
    reqKeepActive() {
        let data: GS_KeepActive = new GS_KeepActive();
        data.ntimer = cc.sys.now() + GlobalVal.timeDifference;
        this.send(GS_GATEWAY_COMMAND_MSG.GATEWAY_COMMAND_KEEPACTIVE, data);
    }

    private onGatewayTips(data: GS_GatewayTips) {
        cc.log('onGatewayTips', data.bttype);
    }

    private onGatewaySocketError(data: GS_GatewaySocketError) {
        cc.log('onGatewaySocketError', data.btservertype , data.nserverid);
    }

    private onSendHttpFile(data: GS_SendHttpFile) {

    }

    private onMaintenanceNotice(data: GS_MaintenanceNotice) {
        UiManager.showDialog(EResPath.NOTICE_WEB_VIEW, data.sznoticeurl);
    }
}