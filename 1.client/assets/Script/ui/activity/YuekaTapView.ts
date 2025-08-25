import { BuryingPointMgr, EBuryingPoint } from "../../buryingPoint/BuryingPointMgr";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import GlobalVal from "../../GlobalVal";
import { GS_SignMonthCardPrivate } from "../../net/proto/DMSG_Plaza_Sub_Sign";
import { GameEvent } from "../../utils/GameEvent";
import Dialog from "../../utils/ui/Dialog";
import { YuekaState2 } from "./YuekaState2";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("Game/ui/yueka/YuekaView")
export class YuekaView extends Dialog {

    @property([cc.Prefab])
    statePrefabs: cc.Prefab[] = [];
    @property(cc.Label)
    timeLabel: cc.Label = null;

    @property(cc.Node)
    contentNode: cc.Node = null;

    private _curNode: cc.Node = null;
    private _curState: number = -1;

    
    onLoad() {

        GameEvent.on(EventEnum.REFRESH_MONTH_CARD, this.refreshMonthCard, this);
    }

    onDestroy() {

            GameEvent.off(EventEnum.REFRESH_MONTH_CARD, this.refreshMonthCard, this);

    }

    protected beforeShow(){
        BuryingPointMgr.post(EBuryingPoint.SHARE_YUE_KA_VIEW);
        this.refreshMonthCard();
    }

    private showState(state: number) {
        if (this._curState != state) {
            if (this._curNode) {
                this._curNode.active = false;
                this._curNode = null;
            }
            this._curNode = cc.instantiate(this.statePrefabs[state]);
            this.contentNode.addChild(this._curNode);
        }

        this.timeLabel.node.active = false;
        if (state == 1) {
            let comp = this._curNode.getComponent(YuekaState2);
            comp.show();

            //计算剩余天数
            let data: GS_SignMonthCardPrivate = Game.signMgr.getMonthCardPrivate();
            if (data) {
                this.timeLabel.node.active = true;
                let now = GlobalVal.getServerTime() * 0.001;
                let delta = data.nexpiretimes - now;
                delta = delta < 0 ? 0 : delta;
                this.timeLabel.string = "月卡剩余 : " + Math.ceil(delta / 60 / 60 / 24).toString() + "天";
            }
        }
    }

    private refreshMonthCard() {
        let data: GS_SignMonthCardPrivate = Game.signMgr.getMonthCardPrivate();
        let state: number = 0;
        if (data) {
            if (GlobalVal.getServerTime() >= data.nexpiretimes * 1000) {
                state = 0;
            } else {
                state = 1;
            }
        }
        this.showState(state);
    }

}