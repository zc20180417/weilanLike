import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { GameEvent } from "../../utils/GameEvent";

const { ccclass, property ,menu} = cc._decorator;

@ccclass
@menu("Game/ui/cpinfo/BulletChatSwitch")
export class BulletChatSwitch extends cc.Component {


    @property(cc.Node)
    openNode:cc.Node = null;

    @property(cc.Node)
    hideNode:cc.Node = null;

    start() {
        this.refreshBtnState();
    }

    onClick() {
        let value = Game.bulletChatMgr.isOpen ? 0 : 1;
        GameEvent.emit(EventEnum.ON_BULLET_CHAT_SWITCH , value);
        this.refreshBtnState();
    }

    private refreshBtnState() {
        this.openNode.active = Game.bulletChatMgr.isOpen;
        this.hideNode.active = !Game.bulletChatMgr.isOpen;
    }
}