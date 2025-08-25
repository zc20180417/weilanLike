// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Game from "../../Game";
import Dialog from "../../utils/ui/Dialog";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AddictionTipsView extends Dialog {


    private strList = [
        '【防沉迷】亲爱的玩家，根据国家新闻出版署 发布的《关于防止未成年人沉迷网络游戏的通 知》《关于进一步严格管理切实防止未成年人 沉迷网络游戏的通知》，'
        + '未成年玩家仅可在周 五、周六、周日和法定节假日每日的20时至21 时登录游戏。 \r\n请合理安排游戏时间，注意休息哦',
        '本次单笔消费超过50元，当前操作将超出单次 充值限额。根据国家新闻出版署发布的《关于防止未成年 人沉迷网络游戏的通知》《关于进一步严格管 理切实防止未成年人沉迷网络游戏的通知》' +
        '。8周岁至16周岁（含8周岁，不含16周岁）游 戏充值单次不超过50元，每月累计不超过200 元。请合理安排，适度消费。',
        '本次单笔消费超过100元，当前操作将超出单 次充值限额。根据国家新闻出版署发布的《关于防止未成年 人沉迷网络游戏的通知》《关于进一步严格管 理切实防止未成年人沉迷网络游戏的通知》 16周岁至18周岁（含16周岁，不含18周岁）游 戏充值单次不超过100元，每月累计不超过400 元。请合理安排，适度消费。',
        '未成年人消费限制说明\r\n'+
        '根据国家新闻出版署《关于防止未成年人沉迷 网络游戏的通知》，对于未成年玩家充值进行 以下保护：' +  
        '1.8周岁以下（不含）无法进行游戏充值。 ' +
        '2.8周岁至16周岁（含8周岁，不含16周岁）单 次不超过50元，每月累计不超过200元。' + 
        '3.16周岁至18周岁（含16周岁，不含18周岁） 单次不超过100元，每月累计不超过400元。'
    ]
    @property(cc.RichText)
    des: cc.RichText = null;

    public setData(data: any): void {
        this.des.string = this.strList[data];
    }

    onClick() {
        Game.nativeApi.exit();
    }
}
