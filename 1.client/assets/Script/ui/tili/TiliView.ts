import Dialog from "../../utils/ui/Dialog";
import List from "../../utils/ui/List";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { StringUtils } from "../../utils/StringUtils";
import SysMgr from "../../common/SysMgr";
import { Handler } from "../../utils/Handler";
import { TAGID } from "../../net/mgr/MallProto";
import { ActorProp, ServerDefine } from "../../net/socket/handler/MessageEnum";
import { UiManager } from "../../utils/UiMgr";
import { EResPath } from "../../common/EResPath";
import { BuryingPointMgr, EBuryingPoint } from "../../buryingPoint/BuryingPointMgr";
import GroupImage from "../../utils/ui/GroupImage";
import { GameEvent } from "../../utils/GameEvent";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("Game/ui/TiliView")
export class TiliView extends Dialog {

    @property(List)
    list: List = null;

    @property(cc.Label)
    countLabel: cc.Label = null;

    @property(cc.Label)
    timeLabel: cc.Label = null;

    @property(cc.Sprite)
    progressImg: cc.Sprite = null;

    @property(cc.Node)
    timeDes: cc.Node = null;

    @property(GroupImage)
    diamond: GroupImage = null;

    addEvent() {
        GameEvent.on(EventEnum.PLAYER_PROP_CHANGE + ActorProp.ACTOR_PROP_STRENGTH, this.itemChange, this);
        GameEvent.on(EventEnum.PLAYER_PROP_CHANGE + ActorProp.ACTOR_PROP_LASTADDSTRENGTIME, this.onAddTimeChange, this);
        GameEvent.on(EventEnum.PLAYER_PROP_CHANGE + ActorProp.ACTOR_PROP_DIAMONDS, this.diamondChange, this);
    }

    protected beforeShow() {
        this.onTiliChange(Game.actorMgr.getStrength());
        this.onAddTimeChange(Game.actorMgr.getProp(ActorProp.ACTOR_PROP_LASTADDSTRENGTIME), 0);

        //this.list.setClickHandler(Handler.create(this.onItemClick, this);
        BuryingPointMgr.post(EBuryingPoint.SHOW_TILI_SHOP);
        let serverData = Game.mallProto.getGoodListByTagId(TAGID.TILI);
        this.list.array = serverData;

        let diamond = Game.actorMgr.getProp(ActorProp.ACTOR_PROP_DIAMONDS);
        this.diamond.contentStr = diamond + '';
    }

    protected beforeHide() {
        SysMgr.instance.clearTimer(Handler.create(this.onTimer, this), true);
        Handler.dispose(this);
    }

    private diamondChange(newValue: number, oldValue: number) {
        this.diamond.contentStr = newValue.toString();

    }

    private itemChange(newValue: number, oldValue: number) {
        this.onTiliChange(newValue, true);
    }

    private onTiliChange(count: number, wihtAni: boolean = false) {
        this.countLabel.string = count + "/" + ServerDefine.MAX_STRENGTH;
        let isMax = count == ServerDefine.MAX_STRENGTH;
        this.timeLabel.node.active = !isMax;
        this.timeDes.active = !isMax;
        let range = count / ServerDefine.MAX_STRENGTH;
        if (wihtAni) {
            cc.Tween.stopAllByTarget(this.progressImg);
            cc.tween(this.progressImg).to(0.5, { fillRange: range }, { easing: "quartOut" }).start();
        } else {
            this.progressImg.fillRange = range;
        }
    }

    private onTimer() {
        this.timeLabel.string = StringUtils.doInverseTime(Game.actorMgr.getNextAddStrengthTime() / 1000);
    }

    private onAddTimeChange(newValue: number, oldValue: number) {
        SysMgr.instance.clearTimer(Handler.create(this.onTimer, this), true);
        if (newValue != -1) {
            SysMgr.instance.doLoop(Handler.create(this.onTimer, this), 100, 0,true);
            this.onTimer();
        }
    }

    onPlayClick() {
        let warID: number = Game.sceneNetMgr.getCurWarID();
        let worldInfo = Game.sceneNetMgr.getChapterByWarID(warID);
        UiManager.showDialog(EResPath.CP_INFO_VIEW, { warID: warID, worldID: worldInfo.nworldid, byType: worldInfo.bttype });
        this.hide();
    }

}