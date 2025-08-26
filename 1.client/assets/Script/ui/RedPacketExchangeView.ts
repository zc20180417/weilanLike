// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { BuryingPointMgr, EBuryingPoint } from "../buryingPoint/BuryingPointMgr";
import { GLOBAL_FUNC } from "../common/AllEnum";
import { EResPath } from "../common/EResPath";
import { EventEnum } from "../common/EventEnum";
import Game from "../Game";
import { GOODS_ID } from "../net/socket/handler/MessageEnum";
import { GameEvent } from "../utils/GameEvent";
import Dialog from "../utils/ui/Dialog";
import ImageLoader from "../utils/ui/ImageLoader";
import List from "../utils/ui/List";
import { UiManager } from "../utils/UiMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RedPacketExchangeView extends Dialog {
    @property(cc.Label)
    money: cc.Label = null;

    // @property(RedPacketExchangeItem)
    // items: RedPacketExchangeItem[] = [];

    @property(List)
    list: List = null;

    @property(ImageLoader)
    redPacketIco: ImageLoader = null;

    @property(cc.Node)
    turntable: cc.Node = null;

    protected addEvent() {
        GameEvent.on(EventEnum.ITEM_COUNT_CHANGE, this.onMoneyChange, this);
        GameEvent.on(EventEnum.EXCHANGE_UP_PRIVATE_DATA, this.onRefreshPrivateData, this);
    }


    beforeShow() {

        let num = Game.containerMgr.getItemCount(GOODS_ID.REDPACKET);
        this.money.string = num + '';

        let info = Game.goodsMgr.getGoodsInfo(GOODS_ID.REDPACKET);
        info && this.redPacketIco.setPicId(info.npacketpicid);

        this.onRefreshPrivateData();

        let node: cc.Node = GameEvent.dispathReturnEvent("get_btn", 'hongbaoduihuan');
        if (node) {
            this.startPos = node.getPosition();
        }

        this.turntable.active = Game.globalFunc.isFuncOpenAndCanShow(GLOBAL_FUNC.TURN_TABLE);
        
        BuryingPointMgr.post(EBuryingPoint.SHOW_EXCHANGE_VIEW);
    }

    onMoneyChange(id: number, num: number) {
        if (id === GOODS_ID.REDPACKET) {
            this.money.string = (num) + '';
        }
    }

    private onRefreshPrivateData() {
        let data = Game.exchangeMgr.getExchangGoodsList();
        this.list.array = data || [];
    }

    clickTurntable() {
        UiManager.showDialog(EResPath.TURN_TABLE);
    }

    // private onGetBtn(name: string): cc.Node {
    //     if (name == "red_exchange") {
    //         let len = this.items.length;
    //         let item: RedPacketExchangeItem;
    //         for (let i = 0; i < len; i++) {
    //             item = this.items[i];
    //             if (item && item.data && item.data.nawardtype == EXCHANGE_GOODS_TYPE.ALI_REDPACKET) {
    //                 return item.btn.node;
    //             }
    //         }
    //     }
    // }
}
