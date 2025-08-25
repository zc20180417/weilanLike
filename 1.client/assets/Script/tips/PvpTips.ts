
import { EResPath } from "../common/EResPath";
import { EventEnum } from "../common/EventEnum";
import Game from "../Game";
import { GS_PvPInviteState } from "../net/proto/DMSG_Plaza_Sub_PvP";
import { GS_RelationInfo_RelationItem } from "../net/proto/DMSG_Plaza_Sub_Relation";
import { HeadComp } from "../ui/headPortrait/HeadComp";
import { GameEvent } from "../utils/GameEvent";
import BaseItem from "../utils/ui/BaseItem";
import { UiManager } from "../utils/UiMgr";
import TipsBase from "./TipsBase";


const { ccclass, property } = cc._decorator;

@ccclass
export default class PvpTips extends BaseItem {


    @property(HeadComp)
    headComp:HeadComp = null;

    setData(data:any) {
        super.setData(data);
        if (data) {
            let friendData:GS_RelationInfo_RelationItem = Game.relationMgr.getFriendData(this._data.nmasterdbid);
            if (!friendData) {
                return;
            }

            GameEvent.on(EventEnum.PVP_INVITE_STATE, this.onInviteState, this);
            GameEvent.on(EventEnum.COOPERATE_INVITE_STATE, this.onInviteState, this);
            this.headComp.headInfo = friendData;
        }
    }

    onDestroy() {
        GameEvent.off(EventEnum.PVP_INVITE_STATE, this.onInviteState, this);
        GameEvent.off(EventEnum.COOPERATE_INVITE_STATE, this.onInviteState, this);
    }

    private onInviteState(data:GS_PvPInviteState) {
        if (this._data && this._data.nmasterdbid == data.nmasterdbid && data.btstate > 0) {
            this.doHide();
        }
    }

    private onClick() {
        // if (!SceneMgr.instance.isInHall()) {
        //     SystemTipsMgr.instance.notice("请先退出到大厅或选关场景才能打开好友对战邀请");
        //     return;
        // }

        UiManager.showDialog(EResPath.FIGHT_INFO_TIPS , this._data);
        
    }

    private doHide() {
        let tips = this.node.getComponent(TipsBase);
        if (tips) {
            tips.hide();
        }
    }
}

