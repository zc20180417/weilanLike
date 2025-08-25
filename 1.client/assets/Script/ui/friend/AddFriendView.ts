// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { GameEvent } from "../../utils/GameEvent";
import { StringUtils } from "../../utils/StringUtils";
import SystemTipsMgr from "../../utils/SystemTipsMgr";
import Dialog from "../../utils/ui/Dialog";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AddFriendView extends Dialog {

    @property(cc.EditBox)
    userIdEditBox: cc.EditBox = null;

    @property(cc.Label)
    myId: cc.Label = null;

    beforeShow() {
        GameEvent.on(EventEnum.ON_RELATION_ADD, this.onRelationAdded, this);

        this.myId.string = "我的账号 ID：" + Game.actorMgr.nactordbid;
    }

    onRelationAdded() {
        this.hide();
    }

    private btnAdd() {
        let userId = this.userIdEditBox.string;
        if (StringUtils.isNilOrEmpty(userId)) {
            SystemTipsMgr.instance.notice("请输入您要查找的用户ID");
            return;
        }
        if (userId == Game.actorMgr.nactordbid.toString()) {
            return SystemTipsMgr.instance.notice("不能添加自己为好友");
        }

        Game.relationMgr.relationFind(parseInt(this.userIdEditBox.string));
        // Game.relationMgr.relationAdd(parseInt(this.userIdEditBox.string));
    }

    private btnCopy() {

    }
}
