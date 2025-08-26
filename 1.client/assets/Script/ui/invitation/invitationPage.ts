import { BuryingPointMgr, EBuryingPoint } from "../../buryingPoint/BuryingPointMgr";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { GameEvent } from "../../utils/GameEvent";
import List from "../../utils/ui/List";
import { PageView } from "../../utils/ui/PageView";
import { EShareTarget, EShareTaskState } from "../share/ShareMgr";

const{ccclass,property} = cc._decorator;

@ccclass
export default class invitationPage extends PageView {

    @property(cc.Sprite)
    qrImg:cc.Sprite = null;

    @property(List)
    list:List = null;

    @property(cc.Node)
    getAwardLabel:cc.Node = null;

    @property([cc.Node])
    hideNodes:cc.Node[] = [];

    onLoad() {
        
    }

    addEvent() {
        GameEvent.on(EventEnum.QRCODE_IMG , this.onQrImg , this);
        GameEvent.on(EventEnum.SHARE_TASK_STATE , this.onTaskState , this);
        GameEvent.on(EventEnum.SHARE_AWARD_GET , this.onGetAwarded , this);
    }

    removeEvent() {
        GameEvent.targetOff(this);
    }

    doShow() {
        Game.shareMgr.requestTaskState();
        Game.shareMgr.getQrCodeImg();
        //this.list.array = Game.shareMgr.getTaskState();
        BuryingPointMgr.post(EBuryingPoint.SHARE_OPEN_TASK_VIEW);
    }

    doHide() {

    }

    onFriendClick() {
        Game.shareMgr.shareImg(EShareTarget.friend , '测试' , '测试分享给好友' , null);
        BuryingPointMgr.post(EBuryingPoint.SHARE_CLICK_SHARE);
    }

    onCircleClick() {
        Game.shareMgr.shareImg(EShareTarget.circle , '测试' , '测试分享朋友圈' , null);
        BuryingPointMgr.post(EBuryingPoint.SHARE_CIRCLE);
    }

    private onTaskState() {
        let array:any[] = Game.shareMgr.getTaskState();
        if (!array) {
            array = [];
        }
        array.sort((a:any , b:any):number => {
            if (Number(a.task_status) != Number(b.task_status)) {
                if (Number(a.task_status) == EShareTaskState.FINISH) {
                    return 1;
                }
    
                if (Number(b.task_status) == EShareTaskState.FINISH) {
                    return -1;
                }
    
                if (Number(b.task_status) == EShareTaskState.COMPLETE) {
                    return 1;
                }
            }
            return 0;
        })
        this.list.array = array;
        this.onGetAwarded(Game.shareMgr.getShareRewardState() == 1);
    }

    private onQrImg(sf:cc.SpriteFrame) {
        if (this.qrImg && this.qrImg.node.isValid) {
            this.qrImg.spriteFrame = sf;
        }
    }

    private onGetAwarded(flag:boolean) {
        this.getAwardLabel.active = flag;
        this.hideNodes.forEach(element => {
            element.active = !flag;
        });
    }
}