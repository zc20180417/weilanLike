// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


import Game from "../../Game";
import { GS_RelationSendRecommend_RecommendFriend } from "../../net/proto/DMSG_Plaza_Sub_Relation";
import { ACTOR_SEX } from "../../net/socket/handler/MessageEnum";
import { GameEvent } from "../../utils/GameEvent";
import { StringUtils } from "../../utils/StringUtils";
import BaseItem from "../../utils/ui/BaseItem";
import { HeadComp, HeadInfo } from "../headPortrait/HeadComp";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RecommendListItem extends BaseItem {
    @property(HeadComp)
    userIcon: HeadComp = null;

    @property(cc.Label)
    userName: cc.Label = null;

    @property(cc.SpriteFrame)
    boy: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    girl: cc.SpriteFrame = null;

    @property(cc.Sprite)
    sexy: cc.Sprite = null;

    @property(cc.Label)
    area: cc.Label = null;

    @property(cc.Node)
    state: cc.Node = null;

    @property(cc.Node)
    add: cc.Node = null;

    setData(data: any, index?: number) {
        super.setData(data, index);
        this.refresh();
    }

    onDestroy() {
        GameEvent.targetOff(this);
    }

    refresh() {
        if (!this.data) return;
        let data = this.data as GS_RelationSendRecommend_RecommendFriend;

        this.userIcon.isSelf = false;

        let headInfo: HeadInfo = {
            nfaceframeid: data.nfaceframeid,
            nfaceid: data.nfaceid,
            szmd5facefile: data.szmd5facefile
        };
        this.userIcon.headInfo = headInfo;
        // this.userIcon.showOther();
        // this.userIcon.setFaceFile(data.szmd5facefile);

        this.userName.string = StringUtils.getShowName(data.szname, 10);

        if (data.btsex == ACTOR_SEX.ACTOR_SEX_BOY) {
            this.sexy.spriteFrame = this.boy;
        } else if (data.btsex == ACTOR_SEX.ACTOR_SEX_GIRL) {
            this.sexy.spriteFrame = this.girl;
        } else {
            this.sexy.spriteFrame = null;
        }
        // this.sexy.spriteFrame = data.btsex == 0 ? this.boy : this.girl;

        this.area.string = "地区：" + (data.szarea || "未知");

        this.add.active = true;
        this.state.active = false;
    }

    btnAdd() {
        if (!this.data || !this.add.active) return;
        let data = this.data as GS_RelationSendRecommend_RecommendFriend;
        // UiManager.showDialog(EResPath.FRIEND_INVITE_VIEW);
        Game.relationMgr.relationAdd(data.nactordbid);
        this.add.active = false;
        this.state.active = true;
    }
}
