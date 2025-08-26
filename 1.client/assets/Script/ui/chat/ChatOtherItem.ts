
import { CHAT_COMMON_CMD } from "../../common/AllEnum";
import Game from "../../Game";
import { StringUtils } from "../../utils/StringUtils";
import BaseItem from "../../utils/ui/BaseItem";
import { HeadComp } from "../headPortrait/HeadComp";

const { ccclass, property ,menu} = cc._decorator;

@ccclass
@menu("Game/ui/Chat/ChatOtherItem")
export class ChatOtherItem extends BaseItem {

    @property(HeadComp)
    headCompe:HeadComp = null;

    @property(cc.Label)
    infoLabel:cc.Label = null;

    @property(cc.Node)
    infoBg:cc.Node = null;

    @property(cc.RichText)
    infoLabel2:cc.RichText = null;


    @property(cc.Boolean)
    isSelf: boolean = true;
    onDestroy() {

    }

    setData(data:any) {
        super.setData(data);
        if (!data) return;
        if (!this.isSelf) {
            this.headCompe.headInfo = Game.chatMgr.friend;
        }

        if ((data.szmsg as string).length >= 25) {
            this.infoLabel.node.width = 540;
            this.infoLabel.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
        }
        let richInfo = '';
        if ((data.szmsg as string).charAt(0) == '$') {
            switch (data.szmsg) {
                case CHAT_COMMON_CMD.INVITE_PVP:
                    richInfo = '发出了' + StringUtils.fontColor("对战邀请" , '#62ac15');
                    break;
                case CHAT_COMMON_CMD.CANCEL_PVP:
                    richInfo = '取消了' + StringUtils.fontColor("对战邀请" , '#62ac15');
                    break;
                case CHAT_COMMON_CMD.REFUSE_PVP:
                    richInfo = '拒绝了' + StringUtils.fontColor("对战邀请" , '#62ac15');
                    break;
                case CHAT_COMMON_CMD.INVITE_COOPERATE:
                    richInfo = '发出了' + StringUtils.fontColor("合作邀请" , '#62ac15');
                    break;
                case CHAT_COMMON_CMD.CANCEL_COOPERATE:
                    richInfo = '取消了' + StringUtils.fontColor("合作邀请" , '#62ac15');
                    break;
                case CHAT_COMMON_CMD.REFUSE_COOPERATE:
                    richInfo = '拒绝了' + StringUtils.fontColor("合作邀请" , '#62ac15');
                    break;
                case CHAT_COMMON_CMD.AGREE_PVP:
                    richInfo = '同意了' + StringUtils.fontColor("对战邀请" , '#62ac15');
                    break;
                case CHAT_COMMON_CMD.AGREE_COOPERATE:
                    richInfo = '同意了' + StringUtils.fontColor("合作邀请" , '#62ac15');
                    break;
            
                default:
                    break;
            }
            

        }

        if (!StringUtils.isNilOrEmpty(richInfo)) {
            this.infoBg.active = this.infoLabel.node.active = false;
            this.infoLabel2.node.active = true;
            this.infoLabel2.string = richInfo;
            return;
        }

        this.infoBg.active = this.infoLabel.node.active = true;
        this.infoLabel2.node.active = false;
        this.infoLabel.string = data.szmsg;
        this.infoLabel['_forceUpdateRenderData'](true);

        this.infoBg.width = this.infoLabel.node.width + 24;
        if (this.infoLabel.node.height > 40) {
            this.infoBg.height = this.infoLabel.node.height + 17.72;
            this.node.height = 100 + this.infoBg.height - 53;
        }

    }




}