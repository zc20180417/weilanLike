// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Dialog from "../../utils/ui/Dialog";
import { UiManager } from "../../utils/UiMgr";
import { EResPath } from "../../common/EResPath";
import { EventEnum } from "../../common/EventEnum";
import { StringUtils } from "../../utils/StringUtils";
import { GameEvent } from "../../utils/GameEvent";

const { ccclass, property } = cc._decorator;
@ccclass
export default class ToIdentificationView extends Dialog {

    @property(cc.RichText)
    des: cc.RichText = null;

    public addEvent() {
        GameEvent.on(EventEnum.CERTIFICATION_SUCCESS, this.hide, this);
    }

    beforeShow() {
        this.des.string = StringUtils.richTextColorFormat(`根据《国家新闻出版署关于防止未成年人沉迷网络游戏的通知》要求，未实名认证用户在同一设备累计在线时长不得超过`, "#ad5b29")
            + StringUtils.richTextColorFormat("1小时", "#ea5718")
            + StringUtils.richTextColorFormat(`，在`, "#ad5b29")
            + StringUtils.richTextColorFormat("15天", "#ea5718")
            + StringUtils.richTextColorFormat(`内不得重复体验，请尽快完成实名认证体验完整游戏内容`, "#ad5b29");
    }

    private onClick() {
        UiManager.showDialog(EResPath.ADDICTION_VIEW);
    }
}
