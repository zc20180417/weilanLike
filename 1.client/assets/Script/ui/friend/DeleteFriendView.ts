// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { GS_RelationInfo_RelationItem } from "../../net/proto/DMSG_Plaza_Sub_Relation";
import { GameEvent } from "../../utils/GameEvent";
import Dialog from "../../utils/ui/Dialog";
import { HeadComp, HeadInfo } from "../headPortrait/HeadComp";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DeleteFriendView extends Dialog {

    @property(HeadComp)
    userIcon: HeadComp = null;

    @property(cc.Label)
    userName: cc.Label = null;

    private userData: GS_RelationInfo_RelationItem = null;

    private addedEvent: boolean = false;

    setData(user: GS_RelationInfo_RelationItem) {
        if (!user) return;
        this.userData = user;
    }

    beforeShow() {
        if (!this.userData) return;
        GameEvent.on(EventEnum.ON_RELATION_DELETE, this.onFriendDelete, this);

        // let friendData = Game.relationMgr.getFriendData(this.userId);
        this.userIcon.isSelf=false;
        
        let headInfo:HeadInfo={
            nfaceframeid:this.userData.nfaceframeid,
            nfaceid:this.userData.nfaceid,
            szmd5facefile:this.userData.szmd5facefile
        };
        this.userIcon.headInfo=headInfo;
        // this.userIcon.setFaceFile(friendData.szmd5facefile);

        this.userName.string = this.userData.szname;
    }

    btnConfirm() {
        if (!this.userData) return;
        Game.relationMgr.releationDelete(this.userData.nactordbid);
    }

    btnCancel() {
        this.hide();
    }

    private onFriendDelete() {
        this.hide();
    }
}
