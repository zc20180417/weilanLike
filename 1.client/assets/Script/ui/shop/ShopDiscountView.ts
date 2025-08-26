// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { BuryingPointMgr, EBuryingPoint } from "../../buryingPoint/BuryingPointMgr";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { GameEvent } from "../../utils/GameEvent";
import { StringUtils } from "../../utils/StringUtils";
import SystemTipsMgr from "../../utils/SystemTipsMgr";
import Dialog from "../../utils/ui/Dialog";
import ShopDiscountItem from "./ShopDiscountItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ShopDiscountView extends Dialog {
    @property(ShopDiscountItem)
    items: ShopDiscountItem[] = [];

    @property(cc.Node)
    freeBtn: cc.Node = null;

    @property(cc.Node)
    videoFreeBtn: cc.Node = null;

    @property(cc.Node)
    diamonFreeNode:cc.Node = null;

    @property(cc.Label)
    diamonLabel:cc.Label = null;

    @property(cc.Label)
    time: cc.Label = null;

    @property(dragonBones.ArmatureDisplay)
    action: dragonBones.ArmatureDisplay = null;

    private enableUpdate: boolean = true;
    private freeBtnClicked: boolean = false;
    private videoBtnClicked: boolean = false;
    private aniEnd: boolean = true;
    beforeShow() {
        GameEvent.on(EventEnum.ON_DISCOUNT_PRIVATE_DATA, this.onPrivateData, this);

        let startNode:cc.Node = GameEvent.dispathReturnEvent("get_btn" , 'discount');
        if (startNode) {
            this.startPos = startNode.convertToWorldSpaceAR(cc.Vec2.ZERO_R);
            this.startPos.x -= cc.winSize.width >> 1;
            this.startPos.y -= cc.winSize.height >> 1;
        }
        BuryingPointMgr.post(EBuryingPoint.SHOW_SALE_VIEW);
        this.action.on(dragonBones.EventObject.FRAME_EVENT, this.aniComplete, this);
        this.refresh();
    }

    refresh(enableAni: boolean = false) {
        let dataMap = Game.discountMgr.getPrivateMap();
        if (!dataMap) {
            this.items.forEach(el => {
                el.node.active = false;
            });
            this.time.node.active = false;
            this.freeBtn.active = false;
            this.videoFreeBtn.active = false;
            this.diamonFreeNode.active = false;
            //自动刷新一次
            Game.discountMgr.disCountTimeRefresh();
            return;
        }

        let dataArr = Array.from(dataMap.values());
        for (let i = 0; i < this.items.length; i++) {
            // this.items[i].setData(dataArr[i]);
            // this.items[i].refresh();
            if (dataArr[i]) {
                this.items[i].setData(dataArr[i]);
                enableAni ? this.items[i].refreshWithAni(0.25 * i) : this.items[i].refresh();
                // this.items[i].refresh();
            } else {
                this.items[i].node.active = false;
            }
        }

        let dicountInfo = Game.discountMgr.getDiscountInfo();
        let privateData = Game.discountMgr.getPrivateData();

        this.freeBtn.active = !privateData || privateData.nfreerefcount < dicountInfo.nfreecount;
        this.videoFreeBtn.active = !this.freeBtn.active && dicountInfo.nrefdiamonds == 0;
        this.diamonFreeNode.active = !this.freeBtn.active && dicountInfo.nrefdiamonds > 0;
        if (dicountInfo.nrefdiamonds > 0) {
            this.diamonLabel.string = dicountInfo.nrefdiamonds.toString();
        }
    }

    onPrivateData() {
        this.enableUpdate = true;
        this.refresh(true);
    }

    update(dt) {
        if (!this.enableUpdate) return;
        Game.discountMgr.caculLeftTime();
        let t = Game.discountMgr.getLeftTime();

        if (t == 0) {
            this.enableUpdate = false;
            Game.discountMgr.disCountTimeRefresh();
        }

        let timeStr = StringUtils.doInverseTime(t);
        this.time.string = timeStr;
    }

    onFreeClick() {
        if (!this.aniEnd) return;
        this.freeBtnClicked = true;
        this.action.playAnimation("newAnimation", 1);
    }

    onFreeVideoClick() {
        if (!this.aniEnd) return;
        let dicountInfo = Game.discountMgr.getDiscountInfo();
        let privateData = Game.discountMgr.getPrivateData();
        if (privateData.nfreevideorefcont >= dicountInfo.nfreevideocount) {
            return SystemTipsMgr.instance.notice("今日的立即刷新次数已经用完");
        }
        this.videoBtnClicked = true;
        this.action.playAnimation("newAnimation", 1);
    }

    aniComplete() {
        this.aniEnd = true;
        if (this.freeBtnClicked) {
            this.freeBtnClicked = false;
            Game.discountMgr.disCountFreeRefresh();
        } else if (this.videoBtnClicked) {
            this.videoBtnClicked = false;
            Game.discountMgr.disCountFreeVideoRefresh();
        }
    }
}
