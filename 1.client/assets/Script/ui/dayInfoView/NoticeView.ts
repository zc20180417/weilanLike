

import { EventEnum } from "../../common/EventEnum";
import HttpControl from "../../net/http/HttpControl";
import { GameEvent } from "../../utils/GameEvent";
import { StringUtils } from "../../utils/StringUtils";
import Dialog from "../../utils/ui/Dialog";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NoticeView extends Dialog {


    @property(cc.RichText)
    infoLabel:cc.RichText = null;

    onClick() {

    }

    addEvent() {
        GameEvent.on(EventEnum.ON_NOTICE_INFO , this.onInfo , this);
    }

    beforeShow() {
        HttpControl.requestNotice();
    }

    private onInfo(info:string) {
        //info = '2021年3月9日更新内容如下<br/> <br><br/> BUG与优化<br/> 1.修复石榴王不吐籽的bug<br/> 2.调整40关之后的部分关卡难度<br/> 3.屏蔽关卡视频翻倍的功能<br/> 4.每日免费看视频获得钻石次数次数由3次改为5次<br/> 5.稍微增加钻石宝箱出橙卡的概率，由40%提升至50%<br/> 6.限时关卡增加双倍速度的功能<br/> 7.非绿色猫咪（蓝、紫、橙）的放置/升级消耗的喵币调低（即更强了）<br/> <br><br/> 新功能<br/> 1.新功能-猫咪装备，打折屋小概率刷出猫咪装备，提升猫咪属性<br/> 2.新功能-怪物图鉴，消灭一定数量的怪物可以解锁对应怪物的图鉴，获得奖励<br/> <br><br/> <br><br/> 《猎果奇兵》玩家交流群：547351850 每周发放群礼包码，交流过关技巧<br/> <br><br/> 后续还会更新对战模式，猫咪公寓，以及更多的关卡和水果怪物，敬请期待吧！<br/> <br><br/> 游戏还在开发阶段，如果遇到问题和BUG，可以在游戏设置的“问题反馈”中反馈给我们，也可以加Q群反馈，祝您游戏愉快<br/>';
        info = StringUtils.replace(info , "<div>" , "");
        info = StringUtils.replace(info , "</div>" , "");
        info = StringUtils.replace(info , "<p>" , "<br/>");
        info = StringUtils.replace(info , "</p>" , "");
        info = StringUtils.replace(info , "<br>" , "");

        this.infoLabel.string = info;
    }

    onDestroy() {

    }

}
