import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import GlobalVal from "../../GlobalVal";
import { GS_ZeroMallConfig, GS_ZeroMallPrivate } from "../../net/proto/DMSG_Plaza_Sub_ZeroMall";
import { GameEvent } from "../../utils/GameEvent";
import { StringUtils } from "../../utils/StringUtils";
import SystemTipsMgr from "../../utils/SystemTipsMgr";
import List from "../../utils/ui/List";
import TapPageItem from "../dayInfoView/TapPageItem";

const { ccclass, property ,menu } = cc._decorator;

@ccclass
@menu("Game/ui/active/ZeroGoPage")
export default class ZeroGoPage extends TapPageItem {


    @property(List)
    list:List = null;

    @property(cc.Label)
    timeLabel:cc.Label = null;

    @property(cc.Node)
    buyBtn:cc.Node = null;

    @property(cc.Label)
    buyLabel:cc.Label = null;

    private _config:GS_ZeroMallConfig;
    private _private:GS_ZeroMallPrivate;
    private _endTime:number = 0;
    protected onEnable(): void {
        GameEvent.on(EventEnum.ZERO_MALL_CONFIG, this.updateActiveData, this);
        GameEvent.on(EventEnum.ZERO_MALL_DATA, this.updateActiveData, this);
    }

    protected onDisable(): void {
        GameEvent.off(EventEnum.ZERO_MALL_CONFIG, this.updateActiveData, this);
        GameEvent.off(EventEnum.ZERO_MALL_DATA, this.updateActiveData, this);
    }
    
    private updateActiveData() {
       this.refresh();
    }

    public refresh() {
        this._config = Game.zeroMallMgr.getConfig();
        this._private = Game.zeroMallMgr.getPrivate();
        if (!this._config || !this._private) return;
        this.buyBtn.active = this._private.btactive == 0;
        if (this.buyBtn.active) {
            this.buyLabel.string = this._config.ndiamonds.toString();
        }

        this._endTime = Game.actorMgr.privateData.nregtime + this._config.nclosetimes;
        this.list.array = Game.zeroMallMgr.getRewardItems();
        this.updateTime();
        this.schedule(this.updateTime , 1 , cc.macro.REPEAT_FOREVER);
    }

    updateTime() {
        let time = this._endTime - GlobalVal.getServerTime() * 0.001 ;
        this.timeLabel.string = StringUtils.doInverseTime(time <= 0 ? 0 : time) + '后下架';

        if (time <= 0) {
            this.buyBtn.active = false;
        }
    }

    onBuyClick() {
        if (Game.actorMgr.getDiamonds() < this._config.ndiamonds) {
            SystemTipsMgr.instance.notice('钻石不足');
            return;
        }

        if (this._endTime - GlobalVal.getServerTime() * 0.001 <= 0) {
            SystemTipsMgr.instance.notice('活动已结束');
            return;
        }

        Game.zeroMallMgr.reqBuy();
    }

}