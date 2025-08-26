// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { GS_RelationNewNotice, GS_RelationNoticeInfo_NoticeItem } from "../../net/proto/DMSG_Plaza_Sub_Relation";
import {  NOTICE_TYPE, ServerDefine } from "../../net/socket/handler/MessageEnum";
import { GameEvent } from "../../utils/GameEvent";
import SystemTipsMgr from "../../utils/SystemTipsMgr";
import List from "../../utils/ui/List";
import TapPageItem from "../dayInfoView/TapPageItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FriendNoticeTapPage extends TapPageItem {
    @property(List)
    list: List = null;

    @property(cc.Node)
    bgNode: cc.Node = null;

    @property(cc.Node)
    tipsNode: cc.Node = null;

    @property(cc.Node)
    allRecive: cc.Node = null;

    @property(cc.Node)
    allAgree: cc.Node = null;

    private noticeArray: Array<GS_RelationNoticeInfo_NoticeItem | GS_RelationNewNotice> = null;

    private allReciveNum: number = 0;

    start() {
        GameEvent.on(EventEnum.ON_RELATION_UPDATE_NOTICE, this.onUpdateNotice, this);
        this.onUpdateNotice();
    }

    onDestroy() {
        GameEvent.targetOff(this);
    }

    /**
     * 一键领取
     */
    btnAllRecive() {
        if (!this.noticeArray) return;

        let tiliNum = Game.actorMgr.getStrength();
        if (tiliNum + this.allReciveNum >= ServerDefine.MAX_STRENGTH) {
            SystemTipsMgr.instance.notice("今日领取体力数量已达上限");
            return;
        }

        let tempArr = [];
        for (let v of this.noticeArray) {
            if (v.btnoticetype == NOTICE_TYPE.NOTICE_REWARD) {
                // Game.relationMgr.relationConfirmNotice(v.nrid, NOTICE_REWARD_STATE.REWARD_RECEIVE);
                tempArr.push(v.nrid);
                this.allReciveNum++;
                if (tiliNum + this.allReciveNum >= ServerDefine.MAX_STRENGTH) {
                    SystemTipsMgr.instance.notice("今日领取体力数量已达上限");
                    break;
                }
            }
        }

        if (tempArr.length != 0) {
            Game.relationMgr.relationAllRecive(tempArr);
        }
    }

    /**
     * 一键同意
     */
    btnAllAgree() {
        if (!this.noticeArray) return;
        let tempArr = [];
        this.noticeArray.forEach((v) => {
            if (v.btnoticetype == NOTICE_TYPE.NOTICE_ADDFRIEND) {
                // Game.relationMgr.relationConfirmNotice(v.nrid, NOTICE_ADDFRIEND_STATE.ADDFRIEND_AGREE);
                tempArr.push(v.nrid);
            }
        });
        if (tempArr.length != 0) {
            Game.relationMgr.relationAllAgree(tempArr);
        }
    }

    private onUpdateNotice() {
        let noticeMap = Game.relationMgr.getNoticeMap();
        if (!noticeMap) {
            this.bgNode.active = false;
            this.tipsNode.active = true;
            this.allAgree.active = false;
            this.allRecive.active = false;
            return;
        }
        this.noticeArray = Array.from(noticeMap.values());
        this.list.array = this.noticeArray;
        let showTips = this.noticeArray.length <= 0;
        this.bgNode.active = !showTips;
        this.tipsNode.active = showTips;
        this.allAgree.active = !showTips;
        this.allRecive.active = !showTips;
        // this.list.refresh();
    }
}
