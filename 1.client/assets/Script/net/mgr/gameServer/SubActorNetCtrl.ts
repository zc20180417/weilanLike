import { Handler } from "../../../utils/Handler";
import { GS_GameActorDestory, GS_GameActorPrivateInfo, GS_GameActorPublicInfo, GS_GameActorVariable, GS_GAME_ACTORINFO_MSG } from "../../proto/DMSG_GameServer_Sub_Actor";
import BaseNetHandler from "../../socket/handler/BaseNetHandler";
import { CMD_ROOT, GS_GAME_MSGID } from "../../socket/handler/MessageEnum";

export default class SubActorNetCtrl extends BaseNetHandler {

    constructor() {
        super(CMD_ROOT.CMDROOT_GAMESERVER_MSG, GS_GAME_MSGID.GS_GAME_MSGID_ACTOR);
    }

    register() {
        this.registerAnaysis(GS_GAME_ACTORINFO_MSG.GAME_ACTOR_PUBLIC, Handler.create(this.onGameActorPublic, this), GS_GameActorPublicInfo);
        this.registerAnaysis(GS_GAME_ACTORINFO_MSG.GAME_ACTOR_PRIVATE, Handler.create(this.onGameActorPrivate, this), GS_GameActorPrivateInfo);
        this.registerAnaysis(GS_GAME_ACTORINFO_MSG.GAME_ACTOR_VARIABLE, Handler.create(this.onGameActorVariable, this), GS_GameActorVariable);
        this.registerAnaysis(GS_GAME_ACTORINFO_MSG.GAME_ACTOR_DESTORY, Handler.create(this.onGameActorDestory, this), GS_GameActorDestory);
    }

    /**玩家公有数据 */
    private onGameActorPublic(data:GS_GameActorPublicInfo) {

    }

    /**玩家私有数据 */
    private onGameActorPrivate(data:GS_GameActorPrivateInfo) {

    }

    /**玩家易变数字属性 */
    private onGameActorVariable(data:GS_GameActorVariable) {

    }

    /**玩家销毁(下线) */
    private onGameActorDestory(data:GS_GameActorDestory) {

    }
}