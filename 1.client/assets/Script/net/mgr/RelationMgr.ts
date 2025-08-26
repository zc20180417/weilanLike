/* 
 * 好友协议
 * @Author: BMIU 
 * @Date: 2021-01-08 10:34:24 
 * @Last Modified by: BMIU
 * @Last Modified time: 2021-07-30 15:43:08
 */


import { CHAPTER_NAME, InviteType } from "../../common/AllEnum";
import { EventEnum } from "../../common/EventEnum";
import Debug from "../../debug";
import Game from "../../Game";
import GlobalVal from "../../GlobalVal";
import { EVENT_REDPOINT } from "../../redPoint/RedPointSys";
import { GameEvent } from "../../utils/GameEvent";
import { Handler } from "../../utils/Handler";
import SystemTipsMgr from "../../utils/SystemTipsMgr";
import { GS_PLAZA_RELATION_MSG, GS_RelationAdd, GS_RelationAddEnd, GS_RelationConfirmNotice, GS_RelationDelete, GS_RelationDeleteEnd, GS_RelationFind, GS_RelationFindReturn, GS_RelationFriendState, GS_RelationGetRecommend, GS_RelationInfo, GS_RelationInfo_RelationItem, GS_RelationNewNotice, GS_RelationNextDay, GS_RelationNoticeInfo, GS_RelationNoticeInfo_NoticeItem, GS_RelationRetReward, GS_RelationReward, GS_RelationSendRecommend, GS_RelationTips, GS_RelationUpBountyCooperationLayer, GS_RelationUpDateNotice, GS_RelationUpFace, GS_RelationUpRankScore, GS_RelationUpWarID, RELATIONTIPS } from "../proto/DMSG_Plaza_Sub_Relation";
import BaseNetHandler from "../socket/handler/BaseNetHandler";
import { ActorProp, CMD_ROOT, GS_PLAZA_MSGID, NOTICE_ADDFRIEND_STATE, NOTICE_REWARD_STATE, NOTICE_TYPE, ServerDefine } from "../socket/handler/MessageEnum";

const RELEATION_TAG = "好友";

const TIPS = {
    [RELATIONTIPS.RELATIONTIPS_LIMIT]: "好友达到上限",
    [RELATIONTIPS.RELATIONTIPS_ISFRIEND]: "已经是好友",
    [RELATIONTIPS.RELATIONTIPS_NOFRIEND]: "不存在此好友",
    [RELATIONTIPS.RELATIONTIPS_MAXAWARD]: "今日打赏次数达到上限",
    [RELATIONTIPS.RELATIONTIPS_DBAWARD]: "已经打赏过此好友",
    [RELATIONTIPS.RELATIONTIPS_NORECIVE]: "没有对方的打赏信息",
    [RELATIONTIPS.RELATIONTIPS_MAXRECIVE]: "今日领取已达到上限",
    [RELATIONTIPS.RELATIONTIPS_DBERROR]: "数据库异常",
    [RELATIONTIPS.RELATIONTIPS_NOFIND]: "查询用户失败",
    [RELATIONTIPS.RELATIONTIPS_NORID]: "不存在需要确认的通知",
    [RELATIONTIPS.RELATIONTIPS_MAXFRIEND]: "好友达到上限",
    [RELATIONTIPS.RELATIONTIPS_WAITVALIDATE]: "等待对方好友验证通过",
    [RELATIONTIPS.RELATIONTIPS_MAXRECEIVEREWARD]: "今天打赏次数领取达到上限",
    [RELATIONTIPS.RELATIONTIPS_NOACTORDETAILS]: "无法得到用户详情信息",
    [RELATIONTIPS.RELATIONTIPS_NOGOLD]: "金币不足无法打赏",
    [RELATIONTIPS.RELATIONTIPS_REPEATREQUEST]: "重复申请添加好友,请等待对方验证通过",
    [RELATIONTIPS.RELATIONTIPS_ISPLAYGAME]: "正在游戏房间,无法进行此操作",
    [RELATIONTIPS.RELATIONTIPS_MAX]: "好友达到上限",
}


export default class RelationMgr extends BaseNetHandler {

    private relationInfo: GS_RelationInfo = null;//玩家社交信息

    private noticeInfo: GS_RelationNoticeInfo = null;//通知

    private noticeMap: Map<number, GS_RelationNoticeInfo_NoticeItem> = null;

    private rewardMap: Map<number, boolean> = null;

    private friendMap: Map<number, GS_RelationInfo_RelationItem | GS_RelationAddEnd> = null;

    private recommendInfo: GS_RelationSendRecommend = null;

    private recommendMap: Map<number, boolean> = null;

    private allSend: boolean = false;
    private allRecive: boolean = false;
    private allAgree: boolean = false;

    constructor() {
        super(CMD_ROOT.CMDROOT_PLAZA_MSG, GS_PLAZA_MSGID.GS_PLAZA_MSGID_RELATION);
        this.noticeMap = new Map();
        this.friendMap = new Map();
        this.recommendMap = new Map();
        this.rewardMap = new Map();
    }

    register() {
        this.registerAnaysis(GS_PLAZA_RELATION_MSG.PLAZA_RELATION_INFO, Handler.create(this.onRelationInfo, this), GS_RelationInfo);
        this.registerAnaysis(GS_PLAZA_RELATION_MSG.PLAZA_RELATION_NOTICEINFO, Handler.create(this.onRelationNoticeinfo, this), GS_RelationNoticeInfo);
        this.registerAnaysis(GS_PLAZA_RELATION_MSG.PLAZA_RELATION_FINDRETURN, Handler.create(this.onRelationFindReturn, this), GS_RelationFindReturn);
        this.registerAnaysis(GS_PLAZA_RELATION_MSG.PLAZA_RELATION_ADDEND, Handler.create(this.onRelationAddend, this), GS_RelationAddEnd);
        this.registerAnaysis(GS_PLAZA_RELATION_MSG.PLAZA_RELATION_RETREWARD, Handler.create(this.onRelationRetreWard, this), GS_RelationRetReward);
        this.registerAnaysis(GS_PLAZA_RELATION_MSG.PLAZA_RELATION_TIPS, Handler.create(this.onRelationTips, this), GS_RelationTips);

        this.registerAnaysis(GS_PLAZA_RELATION_MSG.PLAZA_RELATION_NEWNOTICE, Handler.create(this.onRelationNewtips, this), GS_RelationNewNotice);
        this.registerAnaysis(GS_PLAZA_RELATION_MSG.PLAZA_RELATION_SENDRECOMMEND, Handler.create(this.onRelationSendRecommend, this), GS_RelationSendRecommend);
        this.registerAnaysis(GS_PLAZA_RELATION_MSG.PLAZA_RELATION_NEXTDAY, Handler.create(this.onRelationNextDay, this), GS_RelationNextDay);
        this.registerAnaysis(GS_PLAZA_RELATION_MSG.PLAZA_RELATION_DELETEEND, Handler.create(this.onRelationDeleteEnd, this), GS_RelationDeleteEnd);
        this.registerAnaysis(GS_PLAZA_RELATION_MSG.PLAZA_RELATION_UPDATENOTICE, Handler.create(this.onRelationUpdateNotice, this), GS_RelationUpDateNotice);
        this.registerAnaysis(GS_PLAZA_RELATION_MSG.PLAZA_RELATION_FRIENDSTATE, Handler.create(this.onFriendStatus, this), GS_RelationFriendState);

        this.registerAnaysis(GS_PLAZA_RELATION_MSG.PLAZA_RELATION_UPWARID, Handler.create(this.onRelationUpwarid, this), GS_RelationUpWarID);
        this.registerAnaysis(GS_PLAZA_RELATION_MSG.PLAZA_RELATION_UPRANKSCORE, Handler.create(this.onRelationUprankscoke, this), GS_RelationUpRankScore);
        this.registerAnaysis(GS_PLAZA_RELATION_MSG.PLAZA_RELATION_UPFACE, Handler.create(this.onRelationUpface, this), GS_RelationUpFace);
        this.registerAnaysis(GS_PLAZA_RELATION_MSG.PLAZA_RELATION_UPBOUNTYCOOPERATIONLAYER, Handler.create(this.onCooperationLayer, this), GS_RelationUpBountyCooperationLayer);

        GameEvent.on(EventEnum.PLAYER_PROP_CHANGE + ActorProp.ACTOR_PROP_STRENGTH, this.refreshNoticeRedPoints, this);
    }

    protected onSocketError() {
        this.exitGame();
    }

    protected exitGame() {
        this.relationInfo = null;//玩家社交信息

        this.noticeInfo = null;//通知

        this.noticeMap.clear();

        this.rewardMap.clear();

        this.friendMap.clear();

        this.recommendInfo = null;

        this.recommendMap.clear();

        this.allSend = false;
        this.allRecive = false;
        this.allAgree = false;
    }

    /**
     * 更新用户最新关卡数据
     * @param data GS_RelationUpWarID
     */
    onRelationUpwarid(data: GS_RelationUpWarID) {
        Debug.log(RELEATION_TAG, "更新用户最新关卡数据", data);
        let friend = this.friendMap.get(data.nfrienddbid);
        if (friend) {
            friend.nlastwarid = data.nlastwarid;
        }
    }

    /**
     * 更新用户最新积分
     * @param data GS_RelationUpRankScore
     */
    onRelationUprankscoke(data: GS_RelationUpRankScore) {
        Debug.log(RELEATION_TAG, "更新用户最新积分", data);
        let friend = this.friendMap.get(data.nfrienddbid);
        if (friend) {
            friend.nrankscore = data.nrankscore;
        }
    }

    /**
     * 更新用户头像
     * @param data GS_RelationUpFace
     */
    onRelationUpface(data: GS_RelationUpFace) {
        Debug.log(RELEATION_TAG, "更新用户头像", data);
        let friend = this.friendMap.get(data.nfrienddbid);
        if (friend) {
            friend.nfaceframeid = data.nfaceframeid;
            friend.nfaceid = data.nfaceid;
        }
    }

    /**
     * 玩家社交信息
     * @param data GS_RelationInfo
     */
    onRelationInfo(data: GS_RelationInfo) {
        Debug.log(RELEATION_TAG, "玩家社交信息", data);
        this.relationInfo = data;
        if (this.relationInfo.item) {
            this.relationInfo.item.forEach((v) => {
                this.friendMap.set(v.nactordbid, v);
            });
        }
        this.relationInfo.rewardactordbid.forEach((v) => {
            if (v !== 0) {
                this.rewardMap.set(v, true);
            }
        });
    }

    /**
     * 玩家社交通知信息
     * @param data GS_RelationNoticeInfo
     */
    onRelationNoticeinfo(data: GS_RelationNoticeInfo) {
        Debug.log(RELEATION_TAG, "玩家社交通知信息", data);
        this.noticeInfo = data;
        if (this.noticeInfo.item) {
            //好友通知在前，打赏在后
            this.noticeInfo.item.forEach((v) => {
                if (v.btstate == NOTICE_ADDFRIEND_STATE.ADDFRIEND_UNKNOWN || v.btstate == NOTICE_REWARD_STATE.REWARD_UNKNOWN) {
                    this.noticeMap.set(v.nrid, v);
                }
            });
        }

        this.refreshNoticeRedPoints();
    }

    /**
     * 查找用户返回
     * @param data GS_RelationFindReturn
     */
    onRelationFindReturn(data: GS_RelationFindReturn) {
        Debug.log(RELEATION_TAG, "查找用户返回", data);
        if (data) {
            this.relationAdd(data.nactordbid);
        }
    }

    /**
     * 添加好友确认
     * @param data GS_RelationAddEnd
     */
    onRelationAddend(data: GS_RelationAddEnd) {
        Debug.log(RELEATION_TAG, "添加好友确认", data);
        this.friendMap.set(data.nactordbid, data);
        SystemTipsMgr.instance.notice("加好友成功");
        GameEvent.emit(EventEnum.ON_RELATION_ADD, data.nactordbid);
    }

    /**
     * 更新打赏
     * @param data GS_RelationRetReward
     */
    onRelationRetreWard(data: GS_RelationRetReward) {
        Debug.log(RELEATION_TAG, "更新打赏", data);
        this.rewardMap.set(data.nactordbid, true);
        GameEvent.emit(EventEnum.ON_RELATION_RETREWARD + data.nactordbid);
        if (this.allSend) {
            this.allSend = false;
            SystemTipsMgr.instance.notice("全部赠送成功");
        } else {
            SystemTipsMgr.instance.notice("赠送成功");
        }
    }

    /**
     * 提示信息
     * @param data GS_RelationTips
     */
    onRelationTips(data: GS_RelationTips) {
        Debug.log(RELEATION_TAG, "提示信息", data);
        // if(data.stipsid===RELATIONTIPS.RELATIONTIPS_WAITVALIDATE){//成功发送好友申请
        //     this.recommendMap.set()
        // }
        switch (data.stipsid) {
            case RELATIONTIPS.RELATIONTIPS_NOFRIEND:
                SystemTipsMgr.instance.notice("用户不存在");
                break;
            case RELATIONTIPS.RELATIONTIPS_LIMIT:
                SystemTipsMgr.instance.notice("对方好友数量已满，无法添加新好友");
            case RELATIONTIPS.RELATIONTIPS_MAXFRIEND:
                SystemTipsMgr.instance.notice("好友数量已满，无法添加更多好友");
                break;
            case RELATIONTIPS.RELATIONTIPS_WAITVALIDATE:
            case RELATIONTIPS.RELATIONTIPS_REPEATREQUEST:
                SystemTipsMgr.instance.notice("已成功发送添加好友请求");
                break;
            case RELATIONTIPS.RELATIONTIPS_NOFRIEND:
                SystemTipsMgr.instance.notice("找不到此玩家，请检查用户ID是否正确");
                break;
            default:
                SystemTipsMgr.instance.notice(TIPS[data.stipsid]);
                break;
        }
    }

    /**
     * 服务器下发新通知
     * @param data GS_RelationNewNotice
     */
    onRelationNewtips(data: GS_RelationNewNotice) {
        Debug.log(RELEATION_TAG, "服务器下发新通知", data);
        //剔除已经确认过的消息
        if (data.btstate !== 0) return;

        let notice = this.noticeMap.get(data.nrid);
        notice = notice ? notice : new GS_RelationNoticeInfo_NoticeItem();
        notice.nrid = data.nrid;
        notice.btnoticetype = data.btnoticetype;
        notice.btstate = data.btstate;
        // notice.nsenddbid = data.nsenddbid;
        // notice.szsendname = data.szsendname;
        notice.szmd5facefile = data.szsendmd5facefile;
        notice.nfaceid = data.nsendfaceid;
        notice.nfaceframeid = data.nsendfaceframeid;
        // notice.nrecivedbid = data.nrecivedbid;
        // notice.szrecivename = data.szrecivename;
        // notice.szrecivemd5facefile = data.szrecivemd5facefile;
        // notice.nrecivefaceid = data.nrecivefaceid;
        // notice.nrecivefaceframeid = data.nrecivefaceframeid;

        if (data.nsenddbid == Game.actorMgr.nactordbid) {
            notice.btinfotype = 1;
            notice.nactordbid = data.nrecivedbid;
            notice.szname = data.szrecivename;
            notice.nfaceid = data.nrecivefaceid;
            notice.nfaceframeid = data.nrecivefaceframeid;
        } else {
            notice.btinfotype = 0;
            notice.nactordbid = data.nsenddbid;
            notice.szname = data.szsendname;
            notice.nfaceid = data.nsendfaceid;
            notice.nfaceframeid = data.nsendfaceframeid;
        }

        notice.nstrength = data.nstrength;
        this.noticeMap.set(data.nrid, notice);
        this.refreshNoticeRedPoints();
    }

    /**
     * 下发推荐好友
     * @param data GS_RelationSendRecommend
     */
    onRelationSendRecommend(data: GS_RelationSendRecommend) {
        Debug.log(RELEATION_TAG, "下发推荐好友", data);
        this.recommendInfo = data;
        this.recommendMap.clear();
        GameEvent.emit(EventEnum.ON_RELATION_RECOMMEND);
    }

    /**
     * 跨天清理打赏等数据
     * @param data GS_RelationNextDay
     */
    onRelationNextDay(data: GS_RelationNextDay) {
        Debug.log(RELEATION_TAG, "跨天清理打赏等数据", data);
        this.rewardMap.clear();
    }

    /**
     * 删除好友确认
     * @param data GS_RelationDeleteEnd
     */
    onRelationDeleteEnd(data: GS_RelationDeleteEnd) {
        Debug.log(RELEATION_TAG, "删除好友确认", data);
        if (data.btstate == 0) {//删除好友
            SystemTipsMgr.instance.notice("成功删除好友");
        } else {//被删除
            let friend = this.friendMap.get(data.ndeleteactordbid);
            if (friend) {
                SystemTipsMgr.instance.notice(friend.szname + "与你解除了好友关系");
            }
        }
        this.friendMap.delete(data.ndeleteactordbid);
        GameEvent.emit(EventEnum.ON_RELATION_DELETE, data);
    }

    /**
     * 服务器更新一条通知
     * @param data GS_RelationUpDateNotice
     */
    onRelationUpdateNotice(data: GS_RelationUpDateNotice) {
        Debug.log(RELEATION_TAG, "服务器更新一条通知", data);
        let notice = this.noticeMap.get(data.nrid);
        if (notice) {
            if (notice.btnoticetype == NOTICE_TYPE.NOTICE_REWARD) {
                SystemTipsMgr.instance.notice("领取成功");
            } else if (notice.btstate == NOTICE_ADDFRIEND_STATE.ADDFRIEND_AGREE) {
                if (this.allAgree) {
                    this.allAgree = false;
                    SystemTipsMgr.instance.notice("已全部同意好友申请");
                } else {
                    SystemTipsMgr.instance.notice("你们已成为游戏好友");
                }
            }
        }
        this.noticeMap.delete(data.nrid);
        this.refreshNoticeRedPoints();
        GameEvent.emit(EventEnum.ON_RELATION_UPDATE_NOTICE, data);
    }

    private onCooperationLayer(data:GS_RelationUpBountyCooperationLayer) {
        let friendData = this.getFriendData(data.nfrienddbid);
        if (friendData) {
            friendData.nbountycooperationlayer = data.nbountycooperationlayer;
        }
    }

    /**
     * 好友状态更新
     * @param data GS_RelationFriendState
     */
    onFriendStatus(data: GS_RelationFriendState) {
        Debug.log(RELEATION_TAG, "好友状态更新", data);
        // this.rewardMap && this.rewardMap.clear();
        let friend = this.friendMap.get(data.nfriendid);
        if (friend) {
            friend.btstate = data.btstate;
        }
    }

    /**
     * 查找用户
     * @param actorId number
     */
    relationFind(actorId: number) {
        let data = new GS_RelationFind();
        data.nactordbid = actorId;
        this.send(GS_PLAZA_RELATION_MSG.PLAZA_RELATION_FIND, data);
    }

    /**
     * 添加好友
     * @param actorId number
     */
    relationAdd(actorId: number) {
        let data = new GS_RelationAdd();
        data.nactordbid = actorId;
        this.send(GS_PLAZA_RELATION_MSG.PLAZA_RELATION_ADD, data);
    }

    /**
     * 打赏好友
     * @param actorId number
     */
    relationReward(actorId: number) {
        let data = new GS_RelationReward();
        data.nactordbid = actorId;
        this.send(GS_PLAZA_RELATION_MSG.PLAZA_RELATION_REWARD, data);
    }

    /**
     * 一键送
     * @param friends Array<any>
     */
    relationAllSend(friends: Array<any>) {
        if (!friends) return;
        this.allSend = true;
        friends.forEach(el => {
            this.relationReward(el);
        });
    }

    /**
     * 确认通知
     * @param nrid number
     * @param state number
     */
    relationConfirmNotice(nrid: number, state: number) {
        let data = new GS_RelationConfirmNotice();
        data.nrid = nrid;
        data.btnewstate = state;
        this.send(GS_PLAZA_RELATION_MSG.PLAZA_RELATION_CONFIRMNOTICE, data);
    }

    /**
     * 一键领取
     * @param nridArr array<number>
     */
    relationAllRecive(nridArr: Array<number>) {
        if (!nridArr) return;
        nridArr.forEach(el => {
            this.relationConfirmNotice(el, NOTICE_REWARD_STATE.REWARD_RECEIVE);
        });
    }

    /**
     * 全部同意
     * @param nridArr array<number>
     */
    relationAllAgree(nridArr: Array<number>) {
        if (!nridArr) return;
        nridArr.forEach(el => {
            this.relationConfirmNotice(el, NOTICE_ADDFRIEND_STATE.ADDFRIEND_AGREE);
        });
    }


    /**
     * 删除好友
     * @param actorId number
     */
    releationDelete(actorId: number) {
        let data = new GS_RelationDelete();
        data.nactordbid = actorId;
        this.send(GS_PLAZA_RELATION_MSG.PLAZA_RELATION_DELETE, data);
    }

    /**
     * 获取推荐好友
     */
    relationGetRecommend() {
        let data = new GS_RelationGetRecommend();
        this.send(GS_PLAZA_RELATION_MSG.PLAZA_RELATION_GETRECOMMEND, data);
    }


    getRelationInfo(): GS_RelationInfo {
        return this.relationInfo;
    }

    /**
     * 获取好友信息
     * @param actorId number
     */
    getFriendData(actorId: number): GS_RelationInfo_RelationItem {
        return this.friendMap.get(actorId);
    }

    /**
     * 获取所有好友信息
     */
    getFriendsData(): Map<number, GS_RelationInfo_RelationItem> {
        return this.friendMap;
    }

    getRecommendInfo(): GS_RelationSendRecommend {
        return this.recommendInfo;
    }

    getNoticeMap(): Map<number, GS_RelationNoticeInfo_NoticeItem | GS_RelationNewNotice> {
        return this.noticeMap;
    }

    /**
     * 是否打赏过
     * @param userId number
     */
    isReward(userId: number): boolean {
        return this.rewardMap.get(userId);
    }

    /**
     * 获取章节名称
     * @param warId number
     */
    public getChapterName(warId: number): string {
        // Game.sceneNetMgr.getPlayWorldID() > 0 ?  Game.sceneNetMgr.getPlayWorldID() - 1 : Game.sceneNetMgr.getCurWorldID() - 1;
        // let currWarId = GlobalVal.curMapCfg ? GlobalVal.curMapCfg.nwarid : Game.sceneNetMgr.getCurWarID();
        let currWorldInfo = Game.sceneNetMgr.getChapterByWarID(warId);
        let chapterId = 1;
        if (currWorldInfo) {
            chapterId = currWorldInfo.nworldid;
        }
        return CHAPTER_NAME[chapterId];
    }

    /**
     * 刷新好友通知红点
     */
    private refreshNoticeRedPoints() {
        //体力无限或体力满时，领取体力的通知不计入红点
        let value = Game.actorMgr.getInfiniteStrength();
        let enableShowStrengthRedPoints: boolean = true;
        if ((value > 0 && value * 1000 > GlobalVal.getServerTime())
            || Game.actorMgr.getStrength() >= ServerDefine.MAX_STRENGTH) {
            enableShowStrengthRedPoints = false;
        }

        let num = 0;
        if (!enableShowStrengthRedPoints) {
            let noticeArr = Array.from(this.noticeMap.values());
            noticeArr.forEach(v => {
                if (v.btnoticetype != NOTICE_TYPE.NOTICE_REWARD) num++;
            });
        } else {
            num = this.noticeMap.size;
        }

        let node = Game.redPointSys.findRedPointNode(EVENT_REDPOINT.FRIEND_NOTICE);
        if (node) {
            node.setRedPointNum(num);
        }
    }


    private _inviteFlags:any = {};
    setFriendInviteFlag(flag:boolean , type:InviteType) {
        this._inviteFlags[type] = flag;

        let realFlag = this._inviteFlags[InviteType.COOPERATE] || this._inviteFlags[InviteType.PVP];

        let node = Game.redPointSys.findRedPointNode(EVENT_REDPOINT.FRIEND_PVP);
        if (node) {
            node.setRedPointNum(realFlag ? 1 : 0);
        }
    }

}
