
import { BUY_COUNT_TYPE } from "../../common/AllEnum";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { GS_BountyConfig, GS_BountyData } from "../../net/proto/DMSG_Plaza_Sub_Bounty";
import { GS_BountyCooperationConfig, GS_BountyCooperationPrivate } from "../../net/proto/DMSG_Plaza_Sub_BountyCooperation";
import { GameEvent } from "../../utils/GameEvent";
import SystemTipsMgr from "../../utils/SystemTipsMgr";
import Dialog from "../../utils/ui/Dialog";

const {ccclass, property , menu} = cc._decorator;

@ccclass
@menu("Game/ui/bounty/SelectBuyCountView")
export default class SelectBuyCountView extends Dialog {

    @property(cc.Label)
    txt1:cc.Label = null;

    @property(cc.Label)
    txt2:cc.Label = null;

    private _count:number = 0;
    private _type:BUY_COUNT_TYPE;


    public setData(data: any): void {
        this._type = data;
    }

    beforeShow() {

        // let diamond = 0;
        
        // if (this._type == BUY_COUNT_TYPE.BOUNTRY) {
        //     let cfg:GS_BountyConfig = Game.bountyMgr.getBountyCfg();
        //     let data:GS_BountyData = Game.bountyMgr.getBountData();
        //     if (cfg) {
        //         this._count = cfg.udaybuycount - data.ndaybuycount;
        //         diamond = cfg.udaybuyneeddiamonds;
        //     } else {
        //         this._count = 0;
        //     }
        // } else if (this._type == BUY_COUNT_TYPE.COOPERATE) {
        //     let cfg2:GS_BountyCooperationConfig = Game.cooperateNetCtrl.getConfig();
        //     let data2:GS_BountyCooperationPrivate = Game.cooperateNetCtrl.getPrivateData();
        //     if (cfg2) {
        //         this._count = cfg2.data1 ? cfg2.data1[0].btdaybuycount - data2.ndaybuycount : 0;
        //         diamond = cfg2.data1 ? cfg2.data1[0].nbuydiamonds : 0;
        //     } else {
        //         this._count = 0;
        //     }
        // }

        // this.txt1.string = `确定花费 ${diamond}钻 购买1次挑战次数？`;
        // this.txt2.string = `剩余购买次数：${this._count}`;

    }   

    onOkClick() {   
        // if (this._type == BUY_COUNT_TYPE.BOUNTRY) {
        //     let cfg:GS_BountyConfig = Game.bountyMgr.getBountyCfg();
        //     if (!cfg) {
        //         SystemTipsMgr.instance.notice('数据错误');
        //         return;
        //     }
        //     if (this._count <= 0) {
        //         SystemTipsMgr.instance.notice('已达到当日购买次数上限，无法购买');
        //         return;
        //     }
    
        //     if (Game.actorMgr.getDiamonds() < cfg.udaybuyneeddiamonds) {
        //         SystemTipsMgr.instance.notice('钻石不足');
        //         return;
        //     }
    
        //     Game.bountyMgr.reqBuyCount();
        // } else {
        //     GameEvent.emit(EventEnum.COOPERATE_BUY_COUNT);
        // }

        this.hide();
    }

    onCancelClick() {
        this.hide();
    }

}
