
import { EResPath } from "../common/EResPath";
import { EventEnum } from "../common/EventEnum";
import Game from "../Game";
import GlobalVal from "../GlobalVal";
import { GS_RelationInfo_RelationItem } from "../net/proto/DMSG_Plaza_Sub_Relation";
import { HeadComp } from "../ui/headPortrait/HeadComp";
import { GameEvent } from "../utils/GameEvent";
import { StringUtils } from "../utils/StringUtils";
import Dialog from "../utils/ui/Dialog";
import { UiManager } from "../utils/UiMgr";

const { ccclass, property ,menu} = cc._decorator;

@ccclass
@menu("Game/ui/tips/PvpTipsInfo")
export default class PvpTipsInfo extends Dialog {

    @property(HeadComp)
    headComp:HeadComp = null;

    @property(cc.Label)
    nameLabel:cc.Label = null;

    @property(cc.RichText)
    infoLabel:cc.RichText = null;

    @property(cc.Label)
    timeLabel:cc.Label = null;

    private _data:any;
    setData(data:any) {
        this._data = data;
    }

    protected beforeShow(): void {
        if (this._data) {

            let friendData:GS_RelationInfo_RelationItem = Game.relationMgr.getFriendData(this._data.nmasterdbid);
            if (!friendData) {
                return;
            }

            this.headComp.headInfo = friendData;
            this.nameLabel.string = friendData.szname;
            let model:string = this._data.model == 1 ? '对战邀请' : '合作邀请';
            this.infoLabel.string = '向你发出' + StringUtils.fontColor(model , '#5c971f');


            this.schedule(this.onTimer , 0.2);
        }
    }

    private onTimer() {
        if (!this._data) return;
        let leftTime = (this._data.endTime - GlobalVal.getServerTime()) * 0.001;
        this.timeLabel.string = StringUtils.doInverseTime(leftTime);
    }

    onCancelClick() {
        if (!this._data) return;
        if (this._data.model == 1) {
            Game.pvpNetCtrl.reqPvPInviteResponse(1 , this._data.nmasterdbid);
        } else {
            Game.cooperateNetCtrl.reqInviteResponse(1 , this._data.nmasterdbid);
        }
        this.hide();
    }


    onOkClick() {
        if (!this._data) return;
        this.hide();
        GameEvent.emit(EventEnum.DO_EXIT_MAP);
        if (this._data.model == 1) {
            UiManager.showDialog(EResPath.INVITE_JOIN_PVP_VIEW , this._data);
        } else {
            UiManager.showDialog(EResPath.COOPERATE_READY_VIEW , this._data);
        }
    }


}