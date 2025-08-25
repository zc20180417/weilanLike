import { EResPath } from "../../common/EResPath";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { BattlePassConfig4 } from "../../net/mgr/BattlePassMgr";
import { GS_SceneBattlePass4Private_Item } from "../../net/proto/DMSG_Plaza_Sub_BattlePass";
import { GS_GoodsInfoReturn_GoodsInfo } from "../../net/proto/DMSG_Plaza_Sub_Goods";
import { GameEvent } from "../../utils/GameEvent";
import ImageLoader from "../../utils/ui/ImageLoader";
import { NodeUtils } from "../../utils/ui/NodeUtils";
import { UiManager } from "../../utils/UiMgr";
import CardQuailtyEffect from "../CardQuailtyEffect";

const { ccclass, property ,menu } = cc._decorator;

@ccclass
@menu('Game/ui/active/BattlePassBuyState')
export class BattlePassBuyState extends cc.Component {

    @property(cc.Node)
    btn0:cc.Node = null;
    @property(cc.Node)
    btn1:cc.Node = null;
    @property(cc.Node)
    btn2:cc.Node = null;

    @property(cc.Label)
    pirce0:cc.Label = null;
    @property(cc.Label)
    pirce1:cc.Label = null;
    @property(cc.Label)
    pirce2:cc.Label = null;

    @property(cc.Label)
    towerGoodsName1:cc.Label = null;
    @property(cc.Label)
    towerGoodsName2:cc.Label = null;

    @property(cc.RichText)
    towerGoodsName1_1:cc.RichText = null;
    @property(cc.RichText)
    towerGoodsName2_1:cc.RichText = null;

    @property(ImageLoader)
    goodsImg1:ImageLoader = null;

    @property(ImageLoader)
    goodsImg2:ImageLoader = null;

    @property(ImageLoader)
    card0:ImageLoader = null;
    @property(ImageLoader)
    card1:ImageLoader = null;
    @property(ImageLoader)
    card2:ImageLoader = null;
    @property(ImageLoader)
    card4:ImageLoader = null;
    
    @property(CardQuailtyEffect)
    cardEffect:CardQuailtyEffect = null;

    private _item:GS_SceneBattlePass4Private_Item;
    private _config:BattlePassConfig4;
    onLoad() {

    }

    show(config:BattlePassConfig4 , 
        item:GS_SceneBattlePass4Private_Item , 
        goodsid1:GS_GoodsInfoReturn_GoodsInfo , 
        goodsid2:GS_GoodsInfoReturn_GoodsInfo , 
        goodsid1_1:GS_GoodsInfoReturn_GoodsInfo , 
        goodsid2_1:GS_GoodsInfoReturn_GoodsInfo) {
        this.node.active = true;
        this._item = item;
        this._config = config;
        
        this.pirce0.string = config.baseItem.nrmb1 + '元';
        this.pirce1.string = config.baseItem.nrmb2 + '元';
        this.pirce2.string = config.baseItem.nrmb3 + '元';
        this.checkBtnState();
        
        GameEvent.on(EventEnum.REFRESH_BATTLE_PASS4 , this.onRefresh , this);

        if (goodsid1) {
            this.card0.setPicId(goodsid1.npacketpicid);
            this.card2.setPicId(goodsid1.npacketpicid);
            this.towerGoodsName1.string = goodsid1.szgoodsname + 'X1';
            this.towerGoodsName1_1.string = `“<color=#b48207>${goodsid1.szgoodsname}</c>”X1`;
        }
        if (goodsid2) {
            this.card1.setPicId(goodsid2.npacketpicid);
            this.card4.setPicId(goodsid2.npacketpicid);
            this.towerGoodsName2.string = goodsid2.szgoodsname + 'X1';
            this.towerGoodsName2_1.string = `“<color=#b48207>${goodsid2.szgoodsname}</c>”X1`;
        }

        if (goodsid1_1) {
            this.goodsImg1.setPicId(goodsid1_1.npacketpicid);
        }
        if (goodsid2_1) {
            this.goodsImg2.setPicId(goodsid2_1.npacketpicid);
        }

    }

    private checkBtnState() {
        const buyed1 = (this._item.btmodeflag & 0x1) != 0;
        const buyed2 = (this._item.btmodeflag & 0x2) != 0;
        if (buyed1) {
            this.pirce0.string = '已购买';
            NodeUtils.setNodeGray(this.btn0 , true);
            NodeUtils.setNodeGray(this.pirce0.node , true);
            this.btn0.getComponent(cc.Button).enabled = false;
        }
        if (buyed2) {
            this.pirce1.string = '已购买';
            NodeUtils.setNodeGray(this.btn1 , true);
            NodeUtils.setNodeGray(this.pirce1.node , true);
            this.btn1.getComponent(cc.Button).enabled = false;
        }
        // this.pirce0.node.active = this.btn0.active = 
        // this.pirce1.node.active = this.btn1.active = (this._item.btmodeflag & 0x2) == 0;
        this.pirce2.node.active = this.btn2.active = !buyed1 && !buyed2;
        this.cardEffect.showCardEffect(this.btn2.active ? 3 : 0);
        this.cardEffect.node.scaleX = 1.34;
        this.cardEffect.node.scaleY = 1.61;
    }

    private onRefresh() {
        let config = Game.battlePassMgr.getBattlePassConfog4();
        if (!config) return;
        this._item = Game.battlePassMgr.getBattlePassPrivate4Item(config.baseItem.nid);
        if (!this._item) return;
        this.checkBtnState();
    }

    hide() {
        GameEvent.off(EventEnum.REFRESH_BATTLE_PASS4 , this.onRefresh , this);
        this.node.active = false;
    }

    protected onDestroy(): void {
        GameEvent.off(EventEnum.REFRESH_BATTLE_PASS4 , this.onRefresh , this);
    }

    onPirceClick0() {
        this.reqBuy(1);
    }

    onPirceClick1() {
        this.reqBuy(2);
    }

    onPirceClick2() {
        this.reqBuy(3);
    }

    private reqBuy(type:number) {
        if (this._config) {
            UiManager.showDialog(EResPath.BATTLEPASS4_BUY_VIEW , {data:this._config , type});
            // Game.battlePassMgr.reqBattlePass4GetOrder(this._config.baseItem.nid , type)
        }
    }
}