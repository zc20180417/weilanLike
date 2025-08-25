// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Dialog from "../utils/ui/Dialog";
import Game from "../Game";
import { ActorProp } from "../net/socket/handler/MessageEnum";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BindingView extends Dialog {
    @property(cc.EditBox)
    phoneNum: cc.EditBox = null;

    @property(cc.EditBox)
    verificationCode: cc.EditBox = null;

    onLoad() {
        super.onLoad();
        let phoneNumber = Game.actorMgr.getProp(ActorProp.ACTOR_PROP_PHONE);
        this.phoneNum.string = phoneNumber || "";
        this.verificationCode.string = "";
    }

    onVerificationClick() {

    }

    onBindClick() {
        Game.actorMgr.bindPhone(this.phoneNum.string, this.verificationCode.string, "123456", "123456");
    }
}
