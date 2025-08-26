// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Game from "../../Game";
import GlobalVal from "../../GlobalVal";
import TipsMgr from "../../net/mgr/TipsMgr";
import { GS_RelationNewNotice, GS_RelationNoticeInfo_NoticeItem } from "../../net/proto/DMSG_Plaza_Sub_Relation";
import { ActorProp, NOTICE_ADDFRIEND_STATE, NOTICE_REWARD_STATE, NOTICE_TYPE, ServerDefine } from "../../net/socket/handler/MessageEnum";
import SystemTipsMgr from "../../utils/SystemTipsMgr";
import BaseItem from "../../utils/ui/BaseItem";
import ImageLoader from "../../utils/ui/ImageLoader";
import { HeadComp, HeadInfo } from "../headPortrait/HeadComp";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FriendNoticeItem extends BaseItem {
    @property(HeadComp)
    userIcon: HeadComp = null;

    @property(cc.Label)
    userName: cc.Label = null;

    @property(cc.Label)
    tips: cc.Label = null;

    @property(cc.Node)
    friendGroup: cc.Node = null;

    @property(cc.Node)
    rewardGroup: cc.Node = null;

    @property(cc.Label)
    tili: cc.Label = null;

    start() {
        if (!this.data) {
            this.friendGroup.active = false;
            this.rewardGroup.active = false;
            return;
        }

        // this.refresh();
    }

    setData(data: any, index?: number) {
        super.setData(data, index);
        this.refresh();
    }

    private refresh() {
        if (!this.data) return;
        let data = this.data as GS_RelationNoticeInfo_NoticeItem;
        // let friendData = Game.relationMgr.getFriendData(data.nsenddbid);
        this.userIcon.isSelf = false;
        //头像		
        let headInfo: HeadInfo = {
            nfaceframeid: data.nfaceframeid,
            nfaceid: data.nfaceid,
            szmd5facefile: data.szmd5facefile
        };
        this.userIcon.headInfo = headInfo;

        //名称
        this.userName.string = data.szname;

        if (data.btnoticetype == NOTICE_TYPE.NOTICE_ADDFRIEND) {//添加好友
            this.friendGroup.active = true;
            this.rewardGroup.active = false;
            this.tips.string = "想要加你为好友，每日互赠体力";
        } else {//打赏
            this.friendGroup.active = false;
            this.rewardGroup.active = true;
            //体力
            this.tili.string = "+" + data.nstrength;
            this.tips.string = "赠送你一点体力，快来领取吧";
        }
    }

    private btnRecive() {
        let tiliNum = Game.actorMgr.getStrength();
        if (tiliNum >= ServerDefine.MAX_STRENGTH) {
            SystemTipsMgr.instance.notice("当前体力已满，无需领取体力");
            return;
        }
        this.confirmNotice(NOTICE_REWARD_STATE.REWARD_RECEIVE);
    }

    private btnIgnore() {
        this.confirmNotice(NOTICE_ADDFRIEND_STATE.ADDFRIEND_REFUSE);
    }

    private btnAgree() {
        this.confirmNotice(NOTICE_ADDFRIEND_STATE.ADDFRIEND_AGREE);
    }

    private confirmNotice(state: NOTICE_ADDFRIEND_STATE | NOTICE_REWARD_STATE) {
        if (!this.data) return;
        let data = this.data as GS_RelationNoticeInfo_NoticeItem | GS_RelationNewNotice;
        Game.relationMgr.relationConfirmNotice(data.nrid, state);
    }
}
