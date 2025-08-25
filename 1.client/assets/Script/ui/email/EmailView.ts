// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { BuryingPointMgr, EBuryingPoint } from "../../buryingPoint/BuryingPointMgr";
import { EResPath } from "../../common/EResPath";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { GS_EmailViewTextReturn } from "../../net/proto/DMSG_Plaza_Sub_EMaill";
import { GameEvent } from "../../utils/GameEvent";
import Dialog from "../../utils/ui/Dialog";
import List from "../../utils/ui/List";
import { UiManager } from "../../utils/UiMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class EmailView extends Dialog {
    @property(cc.Node)
    emailNode: cc.Node = null;

    @property(cc.Node)
    tipNode: cc.Node = null;

    @property(List)
    list: List = null;

    private data: any = null;
    private isAllEmailReceiving: boolean = false;

    beforeShow() {
        if (Game.emailMgr.isReqestEmail()) {
            this.onEmailRet();
        } else {
            Game.emailMgr.reqEMailView();
            GameEvent.on(EventEnum.ON_EMAIL_RETURN, this.onEmailRet, this);
        }
        GameEvent.on(EventEnum.ON_EMAIL_RECEIVE, this.onEmailRet, this);
        GameEvent.on(EventEnum.ON_EMAIL_TEXT_RETURN, this.onEmailTextRet, this);
        BuryingPointMgr.post(EBuryingPoint.SHOW_MAIL_VIEW);
    }

    onEmailRet() {
        this.data = Game.emailMgr.getAllUnreceiveEmail();
        if (this.data.length > 0) {
            this.list.array = this.data;
        } else {
            this.emailNode.active = false;
            this.tipNode.active = true;
        }
    }

    onEmailTextRet(data: GS_EmailViewTextReturn) {
        UiManager.showDialog(EResPath.EMAIL_DETAIL_VIEW, data);
        this.onEmailRet();
    }

    private onReciveAllEmail() {
        if (this.isAllEmailReceiving) return;
        this.isAllEmailReceiving = true;
        let dataArr = [...this.data];
        dataArr.forEach((v, k) => {
            if (v.btgoodslistcount > 0) {
                Game.emailMgr.reqEmailPick(v.nemaillid);
            }
        });
        this.isAllEmailReceiving = false;
    }
}
