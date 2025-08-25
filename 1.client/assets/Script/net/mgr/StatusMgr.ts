import BaseNetHandler from "../socket/handler/BaseNetHandler";
import { CMD_ROOT, GS_PLAZA_MSGID } from "../socket/handler/MessageEnum";
import { GS_PLAZA_STATUS_MSG, GS_StatusInfo, GS_StatusInfo_StautsItem } from "../proto/DMSG_Plaza_Sub_Status";
import { Handler } from "../../utils/Handler";
import { GameEvent } from "../../utils/GameEvent";
import { EventEnum } from "../../common/EventEnum";

export class StatusMgr extends BaseNetHandler {
 
    private _statusDic:{ [key: string]: GS_StatusInfo_StautsItem; } = {};
    constructor() {
        super(CMD_ROOT.CMDROOT_PLAZA_MSG , GS_PLAZA_MSGID.GS_PLAZA_MSGID_STATUS);
    }

    register() {        
        this.registerAnaysis(GS_PLAZA_STATUS_MSG.PLAZA_STATUS_INFO , Handler.create(this.onStatusInfo , this) , GS_StatusInfo);
    }

    private onStatusInfo(data:GS_StatusInfo) {
        data.statuslist.forEach(element => {
            this._statusDic[element.nstatusid] = element;
        });

        GameEvent.emit(EventEnum.MODULE_INIT , GS_PLAZA_MSGID.GS_PLAZA_MSGID_STATUS);
    }

    /**获取一个状态 */
    getStatus(id:number):GS_StatusInfo_StautsItem {
        return this._statusDic[id];
    }
}