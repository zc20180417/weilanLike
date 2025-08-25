import { EResPath } from "../common/EResPath";
import { EventEnum } from "../common/EventEnum";
import Game from "../Game";
import { GameEvent } from "../utils/GameEvent";
import SystemTipsMgr from "../utils/SystemTipsMgr";
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Dialog from "../utils/ui/Dialog";
import { UiManager } from "../utils/UiMgr";

const { ccclass, property } = cc._decorator;
2
const QUESTION = `
关于反馈
1.反馈问题后，开发组的答复会通过游戏中的邮件回复给您

关于兑换
1.商品兑换是免邮费的，发货时间为每周一，兑换时请填写好电话和地址

关于视频
1.首次点击视频时会加载视频内容，可能需要一些时间
2.免视频次数：VIP免视频点击直接就跳过视频

关于游戏内容
1.关卡卡住时可以先过关，等猫咪强了再回头打，想一次性完美还是很难的
2.钻石主要用途还是提升猫咪等级，购买体力和道具不宜消耗过多钻石
`;

@ccclass
export default class FeedBackView extends Dialog {

    @property(cc.EditBox)
    msg: cc.EditBox = null;

    protected afterShow() {
        GameEvent.on(EventEnum.FEED_BACK_SUCC, this.onFeedBackSucc, this);
    }

    private onFeedBackSucc() {
        this.hide();
    }

    private feedBack() {
        if (this.msg.string === "") return SystemTipsMgr.instance.notice("输入信息不能为空");
        Game.actorMgr.reqFeedBack(this.msg.string);
    }

    private clickQuestion() {
        UiManager.showDialog(EResPath.QUESTION_VIEW, QUESTION);
    }

}
