import { EResPath } from "../../common/EResPath";
import { EventEnum } from "../../common/EventEnum";
import SysMgr from "../../common/SysMgr";
import Game from "../../Game";
import GlobalVal from "../../GlobalVal";
import { BattlePassConfig4 } from "../../net/mgr/BattlePassMgr";
import { GS_SceneBattlePass4Private_Item } from "../../net/proto/DMSG_Plaza_Sub_BattlePass";
import { GS_GoodsInfoReturn_GoodsInfo } from "../../net/proto/DMSG_Plaza_Sub_Goods";
import { GOODS_TYPE } from "../../net/socket/handler/MessageEnum";
import { GameEvent } from "../../utils/GameEvent";
import { Handler } from "../../utils/Handler";
import { StringUtils } from "../../utils/StringUtils";
import Dialog from "../../utils/ui/Dialog";
import ImageLoader from "../../utils/ui/ImageLoader";
import List from "../../utils/ui/List";
import { UiManager } from "../../utils/UiMgr";
import { BattlePassBuyState } from "./BattlePassBuyState";
const { ccclass, property ,menu } = cc._decorator;

@ccclass
@menu('Game/ui/active/BattlePass4View')
export class BattlePass4View extends Dialog {


    @property(ImageLoader)
    towerImg1:ImageLoader = null;
    @property(ImageLoader)
    towerImg2:ImageLoader = null;
    @property(cc.Label)
    towerName1:cc.Label = null;
    @property(cc.Label)
    towerName2:cc.Label = null;
    @property(cc.Label)
    pirceLabel1:cc.Label = null;
    @property(cc.Label)
    pirceLabel2:cc.Label = null;
    @property(cc.Prefab)
    state2:cc.Prefab = null;

    @property(cc.Node)
    rechargeBtn:cc.Node = null;

    @property(cc.Node)
    rechargeLabel:cc.Node = null;

    @property(cc.Label)
    timeLabel:cc.Label = null;

    @property(List)
    list:List = null;

    @property(cc.Node)
    normalNode:cc.Node = null;

    private _buyNode:cc.Node = null;
    private _endTime:number = 0;
    private _config:BattlePassConfig4;
    private _handler:Handler;
    private _state:number = 1;
    private _state2:BattlePassBuyState;
    private _cardGoodsCfg1:GS_GoodsInfoReturn_GoodsInfo;
    private _cardGoodsCfg2:GS_GoodsInfoReturn_GoodsInfo;
    private _normalGoodsCfg2:GS_GoodsInfoReturn_GoodsInfo;
    private _normalGoodsCfg1:GS_GoodsInfoReturn_GoodsInfo;
    private _itemPrivate:GS_SceneBattlePass4Private_Item;
    protected beforeShow() {
        this.showNormalState();
    }

    private refresh() {
        let config = Game.battlePassMgr.getBattlePassConfog4();
        if (!config) return;
        this._itemPrivate = Game.battlePassMgr.getBattlePassPrivate4Item(config.baseItem.nid);
        if (!this._itemPrivate) return;
        this._config = config;
        this._endTime = Game.actorMgr.privateData.nchannelopentimes + (this._config.baseItem.nstartday + this._config.baseItem.nvalidday) * StringUtils.dayTime;
        

        this.onTimer();

        let passItems = config.passItems;
        let dataList = [];
        let passItem;
        for (let i = 0 ; i < passItems.length ; i++) {
            passItem = passItems[i];
            dataList.push({ config: config , itemData:passItem , stateData: this._itemPrivate });

            if (!this._cardGoodsCfg1) {
                let goodsCfg = Game.goodsMgr.getGoodsInfo(passItem.ngoodsid2);
                if (goodsCfg && goodsCfg.lgoodstype == GOODS_TYPE.GOODSTYPE_RES_UPGRADESTAR ) {
                    this._cardGoodsCfg1 = goodsCfg;
                } else {
                    this._normalGoodsCfg1 = goodsCfg;
                }
            }
            if (!this._cardGoodsCfg2) {
                let goodsCfg = Game.goodsMgr.getGoodsInfo(passItem.ngoodsid3);
                if (goodsCfg && goodsCfg.lgoodstype == GOODS_TYPE.GOODSTYPE_RES_UPGRADESTAR ) {
                    this._cardGoodsCfg2 = goodsCfg;
                } else {
                    this._normalGoodsCfg2 = goodsCfg;
                }
            }
        }

        if (this._cardGoodsCfg1) {
            this.setTowerInfo(1 , this._cardGoodsCfg1);
        }

        if (this._cardGoodsCfg2) {
            this.setTowerInfo(2 , this._cardGoodsCfg2);
        }

        this.pirceLabel1.string = this._config.baseItem.noriginalrmb1.toString();
        this.pirceLabel2.string = this._config.baseItem.noriginalrmb2.toString();
        this.list.array = dataList;


        if (!this._handler) {
            this._handler = new Handler(this.onTimer , this);
        }
        SysMgr.instance.doLoop(this._handler , 1000 ,0, true);
        

        this.rechargeLabel.active = this.rechargeBtn.active = (this._itemPrivate.btmodeflag & 0x1) == 0 || (this._itemPrivate.btmodeflag & 0x2) == 0;
    }
    
    onTimer() {
        let dtime = this._endTime - (GlobalVal.getServerTime() * 0.001);
        let dtimeStr = StringUtils.formatTimeToDHMS(dtime); 
        this.timeLabel.string = `${dtimeStr}`;
    }

    onDestroy(): void {
        super.onDestroy();
        SysMgr.instance.clearTimer(this._handler , true);
        this._handler = null;
    }
    
    onRechargeClick() {
        this.tryShowBuyState();
    }

    onWenClick() {
        let str = '本次活动持续时间为期15天。在活动结束前，您可以通过使用周卡特权对遗漏的日期进行补签以便领取错过的奖励！';
        UiManager.showDialog(EResPath.JING_CAI_TIPS_VIEW , str);
    }

    onBackClick() {
        if (this._state == 1) {
            this.hide();
        } else  {
            this.showNormalState();
        }
    }

    private showNormalState() {
        this._state = 1;

        GameEvent.on(EventEnum.REFRESH_BATTLE_PASS4 , this.refresh , this);
        this.normalNode.active = true;
        if (this._state2) {
            this._state2.hide();
        }
        this.refresh();
    }

    private tryShowBuyState() {
        if (!this._itemPrivate || !this._config) return;
        if (this._buyNode) {
            this.showBuyState();
        } else {
            this._buyNode = cc.instantiate(this.state2);
            this._state2 = this._buyNode.getComponent(BattlePassBuyState);
            this.normalNode.parent.addChild(this._buyNode);
            this.showBuyState();
        }
    }

    private showBuyState() {
        this._state = 2;
        GameEvent.off(EventEnum.REFRESH_BATTLE_PASS4 , this.refresh , this);
        this.normalNode.active = false;
        this._state2.show(this._config , this._itemPrivate , this._cardGoodsCfg1 , this._cardGoodsCfg2 ,this._normalGoodsCfg1 , this._normalGoodsCfg2);
    }

    private setTowerInfo(index:number , goodsInfo:GS_GoodsInfoReturn_GoodsInfo) {
        const towerId = goodsInfo.lparam[0];
        const tower = Game.towerMgr.getTroopBaseInfo(towerId);
        if (towerId) {
            this['towerImg' + index].url = EResPath.TOWER_IMG + Game.towerMgr.get3dpicres(towerId, tower);
            this['towerName' + index].string = tower.szname;
        }
    }
}