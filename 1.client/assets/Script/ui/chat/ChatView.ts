import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { GS_ChatFriend } from "../../net/proto/DMSG_Plaza_Sub_Chat";
import { GS_RelationInfo_RelationItem } from "../../net/proto/DMSG_Plaza_Sub_Relation";
import { RELATION_FRIENDSTATE } from "../../net/socket/handler/MessageEnum";
import { GameEvent } from "../../utils/GameEvent";
import { StringUtils } from "../../utils/StringUtils";
import SystemTipsMgr from "../../utils/SystemTipsMgr";
import Dialog from "../../utils/ui/Dialog";
import { ChatList } from "./ChatList";

const { ccclass, property ,menu} = cc._decorator;

@ccclass
@menu("Game/ui/Chat/ChatView")
export class ChatView extends Dialog {

    @property(cc.EditBox)
    editBox:cc.EditBox = null;

    @property(cc.Node)
    sendNode:cc.Node = null;

    @property(cc.Node)
    shuruNode:cc.Node = null;

    @property(ChatList)
    chatList:ChatList = null;

    @property(cc.RichText)
    nameLabel:cc.RichText = null;

    private _wid = 825;

    private _data:GS_RelationInfo_RelationItem;
    private _dbid:number = 0;
    public setData(data: any): void {
        this._data = data;
        Game.chatMgr.friend = this._data;
    }


    protected onHideAniEnd(): void {
        super.onHideAniEnd();
        Game.chatMgr.friend = null;
    }

    protected addEvent(): void {
        GameEvent.on(EventEnum.CHAT_NEW_MSG , this.onNewMsg , this);
    }

    protected beforeShow(): void {
        let halfWid = cc.winSize.width * 0.5;
        this.startPos = cc.v2(-halfWid - this._wid , 0);
        this.endPos = cc.v2(-halfWid , 0);

        if (this._data) {
            let onLineState = RELATION_FRIENDSTATE.STATE_OFFLINE == this._data.btstate ? '离线' : '在线';
            onLineState = StringUtils.richTextSizeFormat(onLineState , 32);
            this.nameLabel.string = this._data.szname + StringUtils.fontColor("（" + onLineState + "）" , '#ea5718');

            this.chatList.array = Game.chatMgr.getChatList(this._data.nactordbid);
        }
    }

    private onNewMsg(friendid:number , data:GS_ChatFriend) {
        if (friendid == this._data.nactordbid) {
            this.chatList.addNew(data);
        }
    }

    onSendClick() {
        let info = this.editBox.string;
        if (StringUtils.isNilOrEmpty(info)) {
            SystemTipsMgr.instance.notice('请输入聊天内容');
            return;
        }

        if (RELATION_FRIENDSTATE.STATE_OFFLINE == this._data.btstate ) {
            SystemTipsMgr.instance.notice('当前好友不在线，消息发送失败');
            return;
        }

        Game.chatMgr.reqSendChat(this._data.nactordbid , this.editBox.string);
        this.editBox.string = '';
    }

}