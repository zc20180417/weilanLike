/*
 * @Author: BMIU 
 * @Date: 2021-01-11 11:14:06 
 * @Last Modified by: BMIU
 * @Last Modified time: 2021-07-14 20:05:19
 */


import { EResPath } from "../../common/EResPath";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import GlobalVal from "../../GlobalVal";
import { GS_RelationInfo_RelationItem } from "../../net/proto/DMSG_Plaza_Sub_Relation";
import { ACTOR_SEX, RELATION_FRIENDSTATE } from "../../net/socket/handler/MessageEnum";
import { GameEvent } from "../../utils/GameEvent";
import { StringUtils } from "../../utils/StringUtils";
import BaseItem from "../../utils/ui/BaseItem";
import { UiManager } from "../../utils/UiMgr";
import { HeadComp, HeadInfo } from "../headPortrait/HeadComp";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FriendListItem extends BaseItem {
    @property(cc.SpriteFrame)
    rankBgs: cc.SpriteFrame[] = [];

    @property(cc.Label)
    rankLab: cc.Label = null;

    @property(HeadComp)
    userIcon: HeadComp = null;

    @property(cc.Label)
    userName: cc.Label = null;

    @property(cc.Label)
    powerNum: cc.Label = null;

    @property(cc.Label)
    lastLoginTime: cc.Label = null;

    @property(cc.Label)
    chapterName: cc.Label = null;

    @property(cc.Label)
    chapterNum: cc.Label = null;

    @property(cc.Node)
    tili: cc.Node = null;

    @property(cc.Node)
    delete: cc.Node = null;

    @property(cc.SpriteFrame)
    itemBgs: cc.SpriteFrame[] = [];

    @property(cc.Sprite)
    itemBg: cc.Sprite = null;

    @property(cc.SpriteFrame)
    boy: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    girl: cc.SpriteFrame = null;

    @property(cc.Sprite)
    sexy: cc.Sprite = null;

    @property(cc.Sprite)
    randBg: cc.Sprite = null;

    @property(cc.Node)
    online: cc.Node = null;

    @property(cc.Node)
    houseBtn: cc.Node = null;

    @property(cc.Node)
    redPointNode:cc.Node = null;

    @property(cc.Label)
    countLabel:cc.Label = null;
    setData(data: any, index?: number) {
        super.setData(data, index);

        if (this.data) {
            let data = this.data as GS_RelationInfo_RelationItem;
            GameEvent.targetOff(this);
            GameEvent.on(EventEnum.ON_RELATION_RETREWARD + data.nactordbid, this.onRelationRetReward, this);
            GameEvent.on(EventEnum.CHAT_REFRESH_NEW_MSG_COUNT, this.onChatMsg, this);
        }

        this.refresh();
    }

    onDestroy() {
        GameEvent.targetOff(this);
    }

    refresh() {
        if (!this.data) return;
        let data = this.data as GS_RelationInfo_RelationItem;

        //段位
        // this.rankIcon.setRankLv(Game.actorMgr.getPvpRankIndex(data.nrankscore));

        if (data.nactordbid == Game.actorMgr.nactordbid) {//自己
            this.itemBg.spriteFrame = this.itemBgs[1];
            this.tili.active = false;

            this.delete.active = false;
            this.userIcon.isSelf = true;
        } else {//好友
            this.itemBg.spriteFrame = this.itemBgs[0];
            this.tili.active = !Game.relationMgr.isReward(data.nactordbid);
            this.delete.active = true;
            this.userIcon.isSelf = false;
        }

        let headInfo: HeadInfo = {
            nfaceframeid: data.nfaceframeid,
            nfaceid: data.nfaceid,
            szmd5facefile: data.szmd5facefile
        };
        this.userIcon.headInfo = headInfo;
        // this.userIcon.setFaceFile(data.szmd5facefile);

        this.userName.string = data.szname;

        //排名
        if (this.index <= 2) {
            this.rankLab.string = "";
            // this.rankBgs
            this.randBg.spriteFrame = this.rankBgs[this.index];
        } else {
            this.randBg.spriteFrame = this.rankBgs[3];
            this.rankLab.string = this.index + 1 + "";
        }

        if (data.btstate == RELATION_FRIENDSTATE.STATE_OFFLINE) {//离线
            let now = GlobalVal.getServerTime() / 1000;
            let time = now - data.nlastonlinetime;
            this.lastLoginTime.string = "最后登录：" + StringUtils.getCeilTime(time) + "前";
            this.lastLoginTime.node.active = true;
            this.online.active = false;
        } else {//在线
            // this.lastLoginTime.string = "在线";
            this.online.active = true;
            this.lastLoginTime.node.active = false;
        }

        this.chapterNum.string = "第" + data.nlastwarid + "关";

        this.chapterName.string = Game.relationMgr.getChapterName(data.nlastwarid);

        // this.houseBtn.active = data.nlastwarid >= 20;
        this.houseBtn.active = data.nactordbid != Game.actorMgr.nactordbid;

        //性别
        // this.sexy.spriteFrame = data.btsex == 1 ? this.boy : this.girl;
        // if (data.btsex == 1) {
        //     this.sexy.spriteFrame = this.boy;
        // } else if (data.btsex == 2) {
        //     this.sexy.spriteFrame = this.girl;
        // }
        if (data.btsex == ACTOR_SEX.ACTOR_SEX_BOY) {
            this.sexy.spriteFrame = this.boy;
        } else if (data.btsex == ACTOR_SEX.ACTOR_SEX_GIRL) {
            this.sexy.spriteFrame = this.girl;
        } else {
            this.sexy.spriteFrame = null;
        }
        //段位
        let rankCfg = Game.actorMgr.getPvpRankRewardCfg(Game.actorMgr.getPvpRankIndex(data.nrankscore));
        this.powerNum.string = rankCfg ? rankCfg.szname : "";

        if (!Game.chatMgr.openChatTip) {
            let count = Game.chatMgr.getChatCount(data.nactordbid);
            this.redPointNode.active =  count > 0;
            this.countLabel.string = count.toString();
        }
    }

    private btnSend() {
        if (!this.data) return;
        let data = this.data as GS_RelationInfo_RelationItem;
        Game.relationMgr.relationReward(data.nactordbid);
    }

    private btnDelete() {
        if (!this.data) return;
        let data = this.data as GS_RelationInfo_RelationItem;
        // Game.relationMgr.releationDelete(data.nactordbid);
        UiManager.showDialog(EResPath.FRIEND_DELETE_VIEW, data);
    }

    private onCatHouse() {
        // if (this.data.nactordbid == Game.actorMgr.nactordbid) {
        //     Game.catHouseMgr.enterHouse();
        //     UiManager.hideDialog(EResPath.FRIEND_VIEW);
        // } else {
        //     Game.catHouseMgr.requestGetFriendHouse(this.data.nactordbid);
        // }

        UiManager.showDialog(EResPath.CHAT_VIEW , this.data);
    }

    private onRelationRetReward() {
        this.tili.active = false;
    }

    private onChatMsg(id:number , count:number) {
        // if (this._data && this._data.nactordbid == id && !Game.chatMgr.openChatTip) {
        //     this.redPointNode.active = count > 0;
        //     this.countLabel.string = count.toString();
        // }
    }

    public getCathouseBtn(): cc.Node {
        return this.houseBtn;
    }
}
