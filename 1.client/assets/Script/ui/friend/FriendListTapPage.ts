/*
 * @Author: BMIU 
 * @Date: 2021-01-11 10:43:32 
 * @Last Modified by: BMIU
 * @Last Modified time: 2021-05-20 18:07:17
 */

import { EResPath } from "../../common/EResPath";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { GS_RelationAddEnd, GS_RelationInfo, GS_RelationInfo_RelationItem } from "../../net/proto/DMSG_Plaza_Sub_Relation";
import { RELATION_FRIENDSTATE } from "../../net/socket/handler/MessageEnum";
import { GameEvent, Reply } from "../../utils/GameEvent";
import SystemTipsMgr from "../../utils/SystemTipsMgr";
import BaseItem from "../../utils/ui/BaseItem";
import List from "../../utils/ui/List";
import { UiManager } from "../../utils/UiMgr";
import TapPageItem from "../dayInfoView/TapPageItem";
import FriendListItem from "./FriendListItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FriendListTapPage extends TapPageItem {

    @property(cc.Label)
    totalFriends: cc.Label = null;//"0 / 0"

    @property(List)
    friendList: List = null;

    private friendData: Array<GS_RelationInfo_RelationItem | GS_RelationAddEnd> = null;

    start() {
        GameEvent.on(EventEnum.ON_RELATION_DELETE, this.onFriendDelete, this);
        GameEvent.on(EventEnum.ON_RELATION_ADD, this.onFriendAdded, this);
        GameEvent.onReturn("get_friend_btn", this.getBtn, this);
    }

    onDestroy() {
        GameEvent.targetOff(this);
        GameEvent.offReturn("get_friend_btn", this.getBtn, this);
    }

    getBtn(reply:Reply ,btnName: string): cc.Node {
        let btn: cc.Node;
        if (btnName && btnName.length && btnName[0] === "cathouse") {
            for (let i = 0; i < 4; i++) {
                if (this.friendData[i] &&
                    this.friendData[i].nactordbid !== Game.actorMgr.privateData.nactordbid) {
                    let item = this.friendList.getCell(i) && this.friendList.getCell(i).getComponent(BaseItem) as FriendListItem;
                    if (item && item.getCathouseBtn().active) {
                        btn = item.getCathouseBtn();
                        break;
                    }
                }
            }
        }
        return reply(btn);
    }

    refresh() {
        let relationInfo = Game.relationMgr.getRelationInfo();
        let friendMap = Game.relationMgr.getFriendsData();
        if (!friendMap || !relationInfo) return;
        this.friendData = Array.from(friendMap.values());
        let currFriendNum = this.friendData.length;
        //排序
        let selfData = new GS_RelationInfo_RelationItem();
        let privateData = Game.actorMgr.privateData;
        selfData.nactordbid = privateData.nactordbid;
        selfData.nrankscore = privateData.nrankscore;
        selfData.szname = privateData.szname;
        selfData.szmd5facefile = privateData.szmd5facefile;
        selfData.nlastwarid = Game.sceneNetMgr.getCurWarID();
        selfData.btstate = RELATION_FRIENDSTATE.STATE_ONLINE;
        selfData.btsex = privateData.btsex;
        this.friendData.push(selfData);

        //按降序排序
        this.friendData.sort((a, b) => {
            let s = 0;
            if (a.nrankscore == b.nrankscore) {
                s = a.nlastwarid - b.nlastwarid;
            } else {
                s = a.nrankscore - b.nrankscore;
            }
            return -s;
        });

        this.totalFriends.string = currFriendNum + " / " + relationInfo.ulimitcount;
        this.friendList.array = this.friendData;
        // this.friendList.refresh();
    }

    /**
     * 邀请好友
     */
    private btnInvite() {
        // UiManager.showDialog(EResPath.FRIEND_INVITE_VIEW);
        UiManager.showDialog(EResPath.INVITATION_VIEW);
    }

    /**
     * 一键赠送
     */
    private btnSend() {
        if (!this.friendData) return;
        let tempArr = [];
        this.friendData.forEach((v) => {
            if (!Game.relationMgr.isReward(v.nactordbid) && v.nactordbid !== Game.actorMgr.nactordbid) {
                // Game.relationMgr.relationReward(v.nactordbid, true);
                tempArr.push(v.nactordbid);
            }
        });
        if (tempArr.length == 0) {
            SystemTipsMgr.instance.notice("今日已赠送所有好友体力，快去添加更多好友吧");
        } else {
            Game.relationMgr.relationAllSend(tempArr);
        }
    }

    onFriendDelete() {
        this.refresh();
    }

    onFriendAdded() {
        this.refresh();
    }
}
