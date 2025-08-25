import BaseItem from "../../utils/ui/BaseItem";
import Utils from "../../utils/Utils";
import { EShareRecord } from "../share/ShareMgr";

const{ccclass,property,menu} = cc._decorator;

@ccclass
@menu("Game/ui/invitation/InvitationRecordItem")
export class InvitationRecordItem extends BaseItem {

    @property(cc.Label)
    timeLabel:cc.Label = null;

    @property(cc.RichText)
    infoLabel:cc.RichText = null;


    setData(data:any , index?:number) {
        super.setData(data , index);
        if (data) {
            let date = new Date(data.ctime * 1000);
            this.timeLabel.string = date.format("yyyy-MM-dd hh:mm:ss");
            switch (data.status) {
                case EShareRecord.SHARE_AWARD:
                    this.infoLabel.string = "领取分享奖励";
                    break;
                case EShareRecord.INVITATION_AWARD:
                    this.infoLabel.string = "领取邀请任务奖励";
                    break;
                case EShareRecord.INVITATION_FRIEND:
                    this.infoLabel.string = `您的好友 <color=#ea5718> ${data.user_name} </color>受邀加入游戏，目前邀请的玩家数：<color=#249937>${data.num}</color>`;
                    break;
                case EShareRecord.FRIEND_CHARGE:
                    this.infoLabel.string = `您的好友 <color=#ea5718> ${data.user_name} </color>进行了充值，土豪好友人数：<color=#249937>${data.num}</color>`;
                    break;
                case EShareRecord.FRIEND_PASS_WAR:
                    this.infoLabel.string = `您的好友 <color=#ea5718> ${data.user_name} </color>通关了 20 关，高手好友人数：<color=#249937>${data.num}</color>`;
                    break;
            
                default:
                    break;
            }
        }
    }


}