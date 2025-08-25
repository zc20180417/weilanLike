
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { GameEvent } from "../../utils/GameEvent";

import List from "../../utils/ui/List";
import { PageView } from "../../utils/ui/PageView";

const{ccclass,property,menu} = cc._decorator;

@ccclass
@menu("Game/ui/invitation/InvitationRecordPage")
export class InvitationRecordPage extends PageView {

    @property(List)
    list:List = null;

    @property(cc.Node)
    tipNode:cc.Node = null;


    onLoad() {

    }


    onDisable() {
        this.list.array = [];
    }

    protected addEvent() {
        GameEvent.on(EventEnum.SHARE_RECORD_GET , this.onRecordData , this);
    }

    protected removeEvent() {
        GameEvent.off(EventEnum.SHARE_RECORD_GET , this.onRecordData , this);
    }

    protected doShow() {
        Game.shareMgr.requestRecord();
        // BuryingPointMgr.post(EBuryingPoint.SHARE_OPEN_RECORD_VIEW);
    }

    private onRecordData(data:any) {
        if (!data || data.status == 5) {
            this.list.array = [];
            this.tipNode.active = true;
        } else {
            this.tipNode.active = false;
            this.list.array = data.info;
        }
    }

}