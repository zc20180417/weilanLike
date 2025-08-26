import BaseNetHandler from "../../net/socket/handler/BaseNetHandler";
import { CMD_ROOT, GS_PLAZA_MSGID, ROOL_TIPS_TYPE } from "../../net/socket/handler/MessageEnum";
import { GS_PLAZA_CHAT_MSG, GS_ChatSystem, GS_ChatNewSystem, GS_ChatPopSystem, GS_ChatPopSystemText, GS_ChatFriend } from "../../net/proto/DMSG_Plaza_Sub_Chat";
import { Handler } from "../../utils/Handler";
import { UiManager } from "../../utils/UiMgr";
import { EResPath } from "../../common/EResPath";
import Debug from "../../debug";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { GS_RelationInfo_RelationItem } from "../../net/proto/DMSG_Plaza_Sub_Relation";
import SystemTipsMgr from "../../utils/SystemTipsMgr";
import { GS_BountyCooperationInviteState } from "../../net/proto/DMSG_Plaza_Sub_BountyCooperation";
import { GS_PvPInviteState } from "../../net/proto/DMSG_Plaza_Sub_PvP";
import { CHAT_COMMON_CMD } from "../../common/AllEnum";
import { LocalStorageMgr } from "../../utils/LocalStorageMgr";
import { EVENT_REDPOINT } from "../../redPoint/RedPointSys";
import { StringUtils } from "../../utils/StringUtils";
import { GameEvent } from "../../utils/GameEvent";

const CHAT_TAG = "消息:";

export class ChatMgr extends BaseNetHandler {
    private _friend:GS_RelationInfo_RelationItem;
    private _openChatTip:boolean = true;
    private systemQueueMaxSize: number = 3;
    private systemQueue: Array<string> = [];

    private _friendChatMap:Map<number , GS_ChatFriend[]> = new Map();
    private _friendChatNewMsgCountMap:{[key:string]:number} = {};
    private _prevDbid:number = 0;
    constructor() {

        super(CMD_ROOT.CMDROOT_PLAZA_MSG, GS_PLAZA_MSGID.GS_PLAZA_MSGID_CHAT);
        let value = LocalStorageMgr.getItem(LocalStorageMgr.CHAT_TIP , false);
        if (value == undefined || (value != 0 && StringUtils.isNilOrEmpty(value))) {
            this._openChatTip = true;
        } else {
            this._openChatTip = value == 1;
        }
    }

    register() {
        this.registerAnaysis(GS_PLAZA_CHAT_MSG.PLAZA_CHAT_SYSTEM, Handler.create(this.onChatSystem, this), GS_ChatSystem);
        this.registerAnaysis(GS_PLAZA_CHAT_MSG.PLAZA_CHAT_NEWSYSTEM, Handler.create(this.onChatNewSystem, this), GS_ChatNewSystem);
        this.registerAnaysis(GS_PLAZA_CHAT_MSG.PLAZA_CHAT_POPSYSTEM, Handler.create(this.onChatPopSystem, this), GS_ChatPopSystem);
        this.registerAnaysis(GS_PLAZA_CHAT_MSG.PLAZA_CHAT_POPSYSTEMTEXT, Handler.create(this.onChatPopSystemText, this), GS_ChatPopSystemText);
        this.registerAnaysis(GS_PLAZA_CHAT_MSG.PLAZA_CHAT_FRIEND, Handler.create(this.onChatPopFriend, this), GS_ChatFriend);

        GameEvent.on(EventEnum.START_LOAD_SCENE, this.startLoadScene, this);
        GameEvent.on(EventEnum.PVP_INVITE_STATE, this.onPvpInviteState, this);
        GameEvent.on(EventEnum.COOPERATE_INVITE_STATE, this.onCooperateInviteState, this);
        GameEvent.on(EventEnum.MODULE_INIT, this.onModuleInit, this);
        GameEvent.on(EventEnum.ADD_ROLL_TIPS, this.onAddRollTips , this);
    }

    getChatList(dbid:number):GS_ChatFriend[] {
        return this._friendChatMap.get(dbid);
    }

    setOpenChatTipState(value:number) {
        LocalStorageMgr.setItem(LocalStorageMgr.CHAT_TIP , value , false);
    }

    get friend():GS_RelationInfo_RelationItem {
        return this._friend;
    }

    set friend(value:GS_RelationInfo_RelationItem) {
        this._friend = value;
        if (value) {
            this.clearChatCount(value.nactordbid);
            this.checkRedPointCount();
        }
    }
    
    get openChatTip() : boolean {
        return this._openChatTip;
    }
    
    set openChatTip(value:boolean) {
        this._openChatTip = value;
        this.setOpenChatTipState(this._openChatTip ? 1 : 0);
    }

    //////////////////////////////////////////////////////////////

    reqSendChat(friendid:number , info:string) {

        if (Game.actorMgr.checkDontSpeak()) {
            SystemTipsMgr.instance.notice("您已被禁言，请联系客服处理");
            return;
        }

        let data:GS_ChatFriend = new GS_ChatFriend();
        data.nrecvactordbid = friendid;
        data.nactordbid = Game.actorMgr.nactordbid;
        data.szmsg = info + '1';
        this.send(GS_PLAZA_CHAT_MSG.PLAZA_CHAT_FRIEND , data);
    }

    clearChatCount(dbid:number) {
        this._friendChatNewMsgCountMap[dbid] = 0;
        GameEvent.emit(EventEnum.CHAT_REFRESH_NEW_MSG_COUNT , dbid , 0);
    }

    getChatCount(dbid:number):number {
        return this._friendChatNewMsgCountMap[dbid] || 0;
    }

    inviteCooperate(data:GS_BountyCooperationInviteState) {
        this.pushChatData1( data , CHAT_COMMON_CMD.INVITE_COOPERATE);
    }

    invitePvp(data:GS_PvPInviteState) {
        this.pushChatData1( data , CHAT_COMMON_CMD.INVITE_PVP);
    }

    private startLoadScene() {
        UiManager.hideDialog(EResPath.ROLL_TIPS_VIEW);
        this.systemQueue.length = 0;
    }

    private onModuleInit(moduleid:number) {
        if (moduleid == GS_PLAZA_MSGID.GS_PLAZA_MSGID_ACTOR) {
            if (this._prevDbid != 0 && this._prevDbid != Game.actorMgr.nactordbid) {
                this._friendChatMap.clear();
                this._friendChatNewMsgCountMap = {};
            }
            this._prevDbid = Game.actorMgr.nactordbid;
        }
    }

    private rex1:RegExp = /\&lt;/g;
    private rex2:RegExp = /\&gt;/g;
    private rex3:RegExp = /\&amp;/g; 

    private onChatSystem(data: GS_ChatSystem) {
        Debug.log(CHAT_TAG, "系统消息", data);
        if (data.bttype == ROOL_TIPS_TYPE.NOTSHOW_IN_GAMESCENE && this.isInGameScene()) return;
        let str = data.szbuffer.readStCharString(data.slen);
        str = str.replace(this.rex1 , "<").replace(this.rex2 , ">").replace(this.rex3 , "&");
        if (this.systemQueue.length < this.systemQueueMaxSize && !!str) {
            this.systemQueue.push(str);
            UiManager.showTopDialog(EResPath.ROLL_TIPS_VIEW);
        }
    }

    private onAddRollTips(str:string) {
        if (this.systemQueue.length < this.systemQueueMaxSize && !!str) {
            this.systemQueue.push(str);
            UiManager.showTopDialog(EResPath.ROLL_TIPS_VIEW);
        }
    }

    public getSystemQueue(): Array<string> {
        return this.systemQueue;
    }

    private onChatNewSystem(data: GS_ChatNewSystem) {
        if (data.bttype == ROOL_TIPS_TYPE.NOTSHOW_IN_GAMESCENE && this.isInGameScene()) return;

        Debug.log(CHAT_TAG, "新系统消息", data);
    }

    private onChatPopSystem(data: GS_ChatPopSystem) {
        Debug.log(CHAT_TAG, "弹出提示系统消息", data);
    }

    private onChatPopSystemText(data: GS_ChatPopSystemText) {
        Debug.log(CHAT_TAG, "弹出纯文本的系统消息", data);
    }

    private onChatPopFriend(data:GS_ChatFriend) {
        this.pushChat(data);
        if (data.nrecvactordbid == Game.actorMgr.nactordbid && (!this.friend || this.friend.nactordbid != data.nactordbid )) {
            let value = this._friendChatNewMsgCountMap[data.nactordbid] || 0;
            value ++;
            this._friendChatNewMsgCountMap[data.nactordbid] = value;

            if (this.openChatTip) {
                if (value == 1) {
                    //show tips
                    SystemTipsMgr.instance.showCommentTips(EResPath.CHAT_TIPS , Game.relationMgr.getFriendData(data.nactordbid));
                } else {
                    GameEvent.emit(EventEnum.CHAT_REFRESH_NEW_MSG_COUNT , data.nactordbid , value);
                }
            } else {
                this.checkRedPointCount();
                
            }
            
        }
    }

    private pushChat(data:GS_ChatFriend) {
        let otherId = data.nactordbid == Game.actorMgr.nactordbid ? data.nrecvactordbid : data.nactordbid;
        let chatList = this._friendChatMap.get(otherId) || [];
        if (chatList.length == 0) {
            this._friendChatMap.set(otherId , chatList);
        }
       
        chatList.push(data);
        GameEvent.emit(EventEnum.CHAT_NEW_MSG , otherId , data);
    }

    private isInGameScene(): boolean {
        let scene = cc.director.getScene();
        return scene && (scene.name == "MainScene" || scene.name == "PvPScene");
    }

    /////////
    private onPvpInviteState(data:GS_PvPInviteState) {
        if (data.btstate == 3) return;
        if (data.btstate == 1) {
            this.pushChatData1(data , CHAT_COMMON_CMD.CANCEL_PVP);
        } else if (data.btstate == 2) {
            this.pushChatData2(data , CHAT_COMMON_CMD.REFUSE_PVP);
        } else if (data.btstate == 4) {
            this.pushChatData2(data , CHAT_COMMON_CMD.AGREE_PVP);
        }
    }

    private pushChatData2(data:GS_PvPInviteState | GS_BountyCooperationInviteState , cmd:CHAT_COMMON_CMD) {
        let chatData:GS_ChatFriend = new GS_ChatFriend();
        chatData.nactordbid = data.nactordbid;
        chatData.nrecvactordbid = data.nmasterdbid;
        chatData.szmsg = cmd;
        this.pushChat(chatData);
    }

    private pushChatData1(data:GS_PvPInviteState | GS_BountyCooperationInviteState , cmd:CHAT_COMMON_CMD) {
        let chatData:GS_ChatFriend = new GS_ChatFriend();
        chatData.nactordbid = data.nmasterdbid;
        chatData.nrecvactordbid = data.nactordbid;
        chatData.szmsg = cmd;
        this.pushChat(chatData);
    }

    private onCooperateInviteState(data:GS_BountyCooperationInviteState) {
        if (data.btstate == 3) return;
        if (data.btstate == 1) {
            this.pushChatData1(data , CHAT_COMMON_CMD.CANCEL_COOPERATE);
        } else if (data.btstate == 2) {
            this.pushChatData2(data , CHAT_COMMON_CMD.REFUSE_COOPERATE); 
        } else if (data.btstate == 4) {
            this.pushChatData2(data , CHAT_COMMON_CMD.AGREE_COOPERATE);
        } 
    }

    private checkRedPointCount() {
        let value = 0;
        for (const key in this._friendChatNewMsgCountMap) {
            if (Object.prototype.hasOwnProperty.call(this._friendChatNewMsgCountMap, key)) {
                const element = this._friendChatNewMsgCountMap[key];
                value += element;
                GameEvent.emit(EventEnum.CHAT_REFRESH_NEW_MSG_COUNT , key , element);
            }
        }

        Game.redPointSys.setRedPointNum(EVENT_REDPOINT.FRIENDCHAT , value);
        Game.redPointSys.setRedPointNum(EVENT_REDPOINT.FRIENDLIST , value);

    }

}