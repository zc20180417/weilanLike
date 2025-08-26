import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { GameEvent } from "../../utils/GameEvent";
import List from "../../utils/ui/List";
import TapPageItem from "../dayInfoView/TapPageItem";

const { ccclass, property , menu } = cc._decorator;

@ccclass
@menu('Game/ui/friend/InviteFightView')
export default class InviteFightView extends TapPageItem {

    @property(List)
    list:List = null;

    @property(cc.Node)
    tipsNode:cc.Node = null;

    @property(cc.Node)
    bgNode:cc.Node = null;

    start() {
        GameEvent.on(EventEnum.PVP_INVITE_STATE, this.onInviteState, this);
        GameEvent.on(EventEnum.COOPERATE_INVITE_STATE, this.onInviteState2, this);
    }

    onDestroy() {
        GameEvent.targetOff(this);
    }

    refresh() {
        let array = Game.pvpNetCtrl.getInviteMeList();
        let array2 = Game.cooperateNetCtrl.getInviteMeList();
        let dataList = array.concat(array2);
        let have = dataList.length > 0;
        this.bgNode.active = have;
        this.tipsNode.active = !have;
        this.list.array = dataList;
    }

    private onInviteState() {
        this.refresh();
    }
    
    private onInviteState2() {
        this.refresh();
    }
}