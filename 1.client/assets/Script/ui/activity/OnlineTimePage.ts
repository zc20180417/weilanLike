
import Game from "../../Game";
import { ACTIVE_TYPE } from "../../net/socket/handler/MessageEnum";
import { StringUtils } from "../../utils/StringUtils";
import DayLoginPage from "./DayLoginPage";

const { ccclass, property ,menu } = cc._decorator;

@ccclass
@menu("Game/ui/active/OnlineTimePage")
export default class OnlineTimePage extends DayLoginPage {


    @property(cc.Label)
    totalTimeLabel:cc.Label = null;

    constructor() {
        super();
        this.activeType = ACTIVE_TYPE.ONLINE_TIME;
    }

    
   

    updateTime() {
        super.updateTime();
        // let time = Game.sysActivityMgr.getActiveRestTime(ACTIVE_TYPE.DAY_LOGIN);
        // this.timeLabel.string = StringUtils.formatTimeToDHM(time <= 0 ? 0 : time);

        this.totalTimeLabel.string = "当前累计在线时长：" + StringUtils.formatTimeToHM(Game.actorMgr.getOnlineTime());

    }

}