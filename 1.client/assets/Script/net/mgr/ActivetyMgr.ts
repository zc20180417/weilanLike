
import { Handler } from "../../utils/Handler";
import { GS_ActivityNotice, GS_ActivityRequestNotice, GS_PLAZA_ACTIVITY_MSG } from "../proto/DMSG_Plaza_Sub_Activity";
import BaseNetHandler from "../socket/handler/BaseNetHandler";
import { CMD_ROOT, GS_PLAZA_MSGID } from "../socket/handler/MessageEnum";

export default class ActivetyMgr extends BaseNetHandler {


    constructor() {
        super(CMD_ROOT.CMDROOT_PLAZA_MSG, GS_PLAZA_MSGID.GS_PLAZA_MSGID_ACTIVITY);

    }

    register() {
        this.registerAnaysis(GS_PLAZA_ACTIVITY_MSG.PLAZA_ACTIVITY_NOTICE, Handler.create(this.onActivityNotice, this), GS_ActivityNotice);
        
    }

    requestActivityNotice() {
        //(btType);			//类型	(0：活动 1：公告）
        let data:GS_ActivityRequestNotice = new GS_ActivityRequestNotice();
        data.bttype = 1;
        this.send(GS_PLAZA_ACTIVITY_MSG.PLAZA_ACTIVITY_REQUESTNOTICE , data);
    }

    private onActivityNotice(data:GS_ActivityNotice) {
        cc.log(data);
    }
}