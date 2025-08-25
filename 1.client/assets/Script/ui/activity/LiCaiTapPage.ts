import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { GameEvent } from "../../utils/GameEvent";
import List from "../../utils/ui/List";
import TapPageItem from "../dayInfoView/TapPageItem";

const { ccclass, property ,menu } = cc._decorator;

@ccclass
@menu('Game/ui/active/LiCaiView')
export default class LiCaiTapPage extends TapPageItem {

    @property(cc.Node)
    buyBtn:cc.Node = null;

    @property(List)
    list:List = null;

    @property(cc.Label)
    priceLabel:cc.Label = null;


    onLoad(){
        GameEvent.on(EventEnum.GROWGIFT_PRIVATE_REFRESH , this.onRefresh , this);
    }

    onDestroy(){
        GameEvent.targetOff(this);
    }

    refresh(){
        // this.curWarLabe.string = `当前冒险模式：${StringUtils.fontColor(Game.sceneNetMgr.getCurWarID().toString() , "#e85350")} 关`;
        
        let privateData = Game.growGiftMgr.getGrowGiftPrivate();
        if (privateData) {
            this.buyBtn.active = privateData.btbuy == 0;
        }

        let info = Game.growGiftMgr.getGrowGiftInfo();
        if (info && info.uitemcount > 0) {
            this.priceLabel.string = '¥ ' + info.nrmb;
        }

        if (info && info.uitemcount > 0) {
            this.list.array = info.rewardlist;

            let index = Game.growGiftMgr.startGetIndex;
            if (index != -1 && index >= 5) {
                this.list.setStartIndex(index);
            }
        }
    }

    private onBuy() {
        Game.growGiftMgr.reqBuyGrowGift();
    }

    private onRefresh() {
        let privateData = Game.growGiftMgr.getGrowGiftPrivate();
        if (privateData) {
            this.buyBtn.active = privateData.btbuy == 0;
            this.list.refresh();
        }
    }

}