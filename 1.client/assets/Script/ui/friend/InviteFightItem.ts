import { EResPath } from "../../common/EResPath";
import SysMgr from "../../common/SysMgr";
import Game from "../../Game";
import GlobalVal from "../../GlobalVal";
import { GS_PvPInviteState } from "../../net/proto/DMSG_Plaza_Sub_PvP";
import { GS_RelationInfo_RelationItem } from "../../net/proto/DMSG_Plaza_Sub_Relation";
import { Handler } from "../../utils/Handler";
import BaseItem from "../../utils/ui/BaseItem";
import GroupImage from "../../utils/ui/GroupImage";
import { UiManager } from "../../utils/UiMgr";
import { HeadComp } from "../headPortrait/HeadComp";

const { ccclass, property ,menu} = cc._decorator;

@ccclass
@menu("Game/ui/friend/InviteFightItem")
export class InviteFightItem extends BaseItem {
    @property(HeadComp)
    headComp:HeadComp = null;

    @property(cc.Label)
    nameLabel:cc.Label = null;

    @property(cc.Label)
    modeLabel:cc.Label = null;

    @property(GroupImage)
    time:GroupImage = null;

    @property(cc.Color)
    color1:cc.Color = null;

    @property(cc.Color)
    color2:cc.Color = null;

    private _handler:Handler;

    public setData(data: any, index?: number): void {
        super.setData(data , index);
        this.clearTimer();
        if (data) {
            let itemData:GS_PvPInviteState = data as GS_PvPInviteState;
            let friendData:GS_RelationInfo_RelationItem = Game.relationMgr.getFriendData(itemData.nmasterdbid);
            if (!friendData) {
                return;
            }

            this.headComp.headInfo = friendData;
            this.nameLabel.string = friendData.szname;
            this.modeLabel.string = data.model == 1 ? '对战模式' : '合作模式';
            this.modeLabel.node.color = data.model == 1 ? this.color2 : this.color1;

            if (!this._handler) {
                this._handler = new Handler(this.onTimer , this);
            }
            this.onTimer();

        }
    }

    protected onDestroy(): void {
        this.clearTimer();
    }

    private clearTimer() {

    }

    private onTimer() {
        if (!this.data) return;
        let leftTime = this.data.endTime - GlobalVal.getServerTime();
        if (leftTime >= 0) {
            this.time.contentStr = `(${Math.floor(leftTime / 1000)})`;
        }
    }

    onJujueClick() {
        if (!this.data) return;
        if (this.data.model == 1) {
            Game.pvpNetCtrl.reqPvPInviteResponse(1 , this.data.nmasterdbid);
        } else {
            Game.cooperateNetCtrl.reqInviteResponse(1 , this.data.nmasterdbid);
        }
    }

    onTongyiClick() {
        if (!this.data) return;
        UiManager.hideDialog(EResPath.FRIEND_VIEW);
        if (this.data.model == 1) {
            UiManager.showDialog(EResPath.INVITE_JOIN_PVP_VIEW , this.data);
        } else {
            UiManager.showDialog(EResPath.COOPERATE_READY_VIEW , this.data);
        }
        //Game.pvpNetCtrl.reqPvPInviteResponse(0 , this.data.nmasterdbid);
    }
}