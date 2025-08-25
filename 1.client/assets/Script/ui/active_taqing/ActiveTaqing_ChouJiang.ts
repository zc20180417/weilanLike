import { ACTIVE_TAQING_PAGE_INDEX } from "../../common/AllEnum";
import { EResPath } from "../../common/EResPath";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import GlobalVal from "../../GlobalVal";
import { GS_FestivalActivityConfig, GS_FestivalActivityConfig_LuckyItem, GS_FestivalActivityConfig_WishItem, GS_FestivalActivityPrivate } from "../../net/proto/DMSG_Plaza_Sub_FestivalActivity";
import { GS_RewardTips_RewardGoods } from "../../net/proto/DMSG_Plaza_Sub_Tips";
import { GS_TroopsInfo_TroopsInfoItem } from "../../net/proto/DMSG_Plaza_Sub_Troops";
import {  GOODS_TYPE } from "../../net/socket/handler/MessageEnum";
import { GameEvent } from "../../utils/GameEvent";
import { Handler } from "../../utils/Handler";
import { MathUtils } from "../../utils/MathUtils";
import { StringUtils } from "../../utils/StringUtils";
import SystemTipsMgr from "../../utils/SystemTipsMgr";
import TweenNum from "../../utils/TweenNum";
import AlertDialog from "../../utils/ui/AlertDialog";
import ImageLoader from "../../utils/ui/ImageLoader";
import { PageView } from "../../utils/ui/PageView";
import { UiManager } from "../../utils/UiMgr";
import GoodsItem, { GoodsItemData } from "../newhand_book/GoodsItem";

const { ccclass, property ,menu } = cc._decorator;

@ccclass
@menu('Game/ui/active-taqing/ActiveTaqing_ChouJiang')
export class ActiveTaqing_ChouJiang extends PageView {

    @property(GoodsItem)
    goodsItems:GoodsItem[] = [];
    
    @property(cc.Label)
    timeLabel:cc.Label = null;

    @property(cc.Sprite)
    progressBar:cc.Sprite = null;

    @property(cc.Node)
    lightNode:cc.Node = null;

    @property(cc.Label)
    quanLabel1:cc.Label = null;
    @property(cc.Label)
    quanLabel2:cc.Label = null;
    @property(cc.Label)
    quanLabel3:cc.Label = null;

    @property(ImageLoader)
    quanImg1:ImageLoader = null;
    @property(ImageLoader)
    quanImg2:ImageLoader = null;
    @property(ImageLoader)
    quanImg3:ImageLoader = null;

    // @property(ImageLoader)
    // towerImg:ImageLoader = null;

    @property(cc.Color)
    quanLabelColor:cc.Color = null;
    
    @property(cc.Label)
    progressValueLabel:cc.Label = null;

    @property(cc.Node)
    xinYuanNode:cc.Node = null;
    
    private _refreshIndexHandler:Handler = new Handler(this.onRefreshIndex , this);
    private _runIndexEndHandler:Handler = new Handler(this.onEndIndex , this);
    private _toIndex:number = 0;
    private _toNums:number = 0;
    private _runing:boolean = false;
    private _config:GS_FestivalActivityConfig;
    private _data:GS_FestivalActivityPrivate;
    private _showTower:GS_TroopsInfo_TroopsInfoItem;

    start() {

    }

    protected addEvent(): void {
        GameEvent.on(EventEnum.ITEM_COUNT_CHANGE , this.onItemChange , this);
        GameEvent.on(EventEnum.ACTIVE_TAQING_CHOUKA_RET , this.refreshLucky , this);
        GameEvent.on(EventEnum.ACTIVE_TAQING_SELECT_WISH_ITEM, this.refreshLucky , this);
    }

    protected removeEvent(): void {
        GameEvent.off(EventEnum.ITEM_COUNT_CHANGE , this.onItemChange , this);
        GameEvent.off(EventEnum.ACTIVE_TAQING_CHOUKA_RET , this.refreshLucky , this);
        GameEvent.off(EventEnum.ACTIVE_TAQING_SELECT_WISH_ITEM, this.refreshLucky , this);
    }

    protected doShow(): void {
        this._config = Game.festivalActivityMgr.getConfig();
        this._data = Game.festivalActivityMgr.getData();
        if (!this._config || !this._config.luckydraw || !this._data) return;
        // this.initRedTower();
        // if (this._showTower) {
        //     this.towerImg.url = EResPath.TOWER_IMG + this._showTower.sz3dpicres;
        // }
        const goodsInfo = Game.goodsMgr.getGoodsInfo(Game.festivalActivityMgr.getLuckyGoodsId());
        if (goodsInfo) {
            this.quanImg1.setPicId(goodsInfo.npacketpicid);
            this.quanImg2.setPicId(goodsInfo.npacketpicid);
            this.quanImg3.setPicId(goodsInfo.npacketpicid);
        }
        this.changeQuan(Game.containerMgr.getItemCount(this._config.luckydraw.ngoodsid));
        this.initLuckyDraw();
        this.refreshLucky();
        this.refreshTime();
        this.schedule(this.refreshTime , 1 , cc.macro.REPEAT_FOREVER );
    }

    protected doHide(): void {
        TweenNum.kill("run_index");
        if (this._runing) {
            this.onEndIndex();
        }
        this.stopShake(this.xinYuanNode);
        this.unschedule(this.refreshTime);
    }

    onDestroy(): void {
        TweenNum.kill("run_index");
    }

    private _curIndex = 0;

    onOnceClick() {
        this.onChouJiang(1);
        // this.startEffect(MathUtils.randomInt(0 , 10));
    }

    onTenClick() {
        this.onChouJiang(2);
    }

    onManyClick() {
        this.onChouJiang(3);
    }

    onWenClick() {
        let exchangegoodsid = Game.festivalActivityMgr.getExChangeGoodsId();
        let goodsInfo = Game.goodsMgr.getGoodsInfo(exchangegoodsid);
        let nameStr = goodsInfo ? goodsInfo.szgoodsname : '';
        let str = '抽奖池：' + '\r\n' + 
        '通过消耗抽奖券进行抽奖获得道具奖励，一次性五十连抽可以获得九折优惠哦！幸运值达到300时可以自选一个红色猫咪或者橙色皮肤作为奖励！（一张抽奖券=25钻石）';
        str += `\r\n        道具            	        换算概率
        橙色自选碎片*5		            0.77%
        紫色自选碎片*5		            1.16%
        ${nameStr}*1		                            21.60%
        ${nameStr}*5		                            3.96%
        招财券*1		                        3.93%
        核弹轰炸*1		                    5.49%
        全屏冰冻*1		                    6.26%
        极速攻击*1		                    7.82%
        全屏减速*1		                    11.75%
        急救包*1		                        15.67%
        能量*500	                        21.60%`
        UiManager.showDialog(EResPath.ACTIVE_TAQING_CHOU_JIANG_TIPS , str);
    }

    onBoxClick() {
        UiManager.showDialog(EResPath.ACTIVE_TAQING_XINYUAN_TIPS);
    }

    private startEffect(toIndex:number = 0) {
        this.lightNode.active = true;
        const quanCount = MathUtils.randomInt(2 , 5);
        const toIndexValue = toIndex + quanCount * 10;
        const time = quanCount * 800;
        this._toIndex = toIndex;
        this._runing = true;
        TweenNum.to(this._curIndex , toIndexValue , time / 1000 , this._refreshIndexHandler , "run_index" ,this._runIndexEndHandler , 'sineInOut' );
    }

    private onEndIndex() {
        console.log('onEndIndex');
        this._runing = false;
        this._curIndex = this._toIndex;
        if (!this._curLuckyData) return;
        let data:GS_RewardTips_RewardGoods = new GS_RewardTips_RewardGoods(); 
        data.sgoodsid = this._curLuckyData.ngoodsid;
        data.sgoodsnum = this._toNums;
        Game.tipsMgr.showNewGoodsView([data])
    }

    private onRefreshIndex(value:number) {
        let index = Math.floor(value) % 10;
        const temp = this.goodsItems[index];
        this.lightNode.x = temp.node.x;
        this.lightNode.y = temp.node.y;
    }

    private onItemChange(id:number , count:number) {
        if (this._config && this._config.luckydraw && id == this._config.luckydraw.ngoodsid) {
            this.changeQuan(count);
        }
    }

    private changeQuan(value:number) {
        this.quanLabel1.string = value + '/' + this._config.luckydraw.ngoodsnum1;
        this.quanLabel2.string = value + '/' + this._config.luckydraw.ngoodsnum10;
        this.quanLabel3.string = value + '/' + this._config.luckydraw.ngoodsnum50;

        this.quanLabel1.node.color = value >= this._config.luckydraw.ngoodsnum1 ? this.quanLabelColor : cc.Color.RED;
        this.quanLabel2.node.color = value >= this._config.luckydraw.ngoodsnum10 ? this.quanLabelColor : cc.Color.RED;
        this.quanLabel3.node.color = value >= this._config.luckydraw.ngoodsnum50 ? this.quanLabelColor : cc.Color.RED;

    }

    private checkRuning():boolean {
        if (this._runing) {
            SystemTipsMgr.instance.notice("正在抽奖中，请稍后");
            return true;
        }
        return false;
    }

    private _curType:number = -1;
    private onChouJiang(index:number) {
        if (this.checkRuning()) return;
        const value = [this._config.luckydraw.ngoodsnum1 , this._config.luckydraw.ngoodsnum10 , this._config.luckydraw.ngoodsnum50];
        const count = Game.containerMgr.getItemCount(this._config.luckydraw.ngoodsid);
        const useValue = value[index - 1];
        this._curType = index;
        if (count < useValue) {
            const goodsInfo = Game.goodsMgr.getGoodsInfo(this._config.luckydraw.ngoodsid);
            if (goodsInfo) {

                // const diamondVaue = (useValue - count) * this._config.luckydraw.nticketprice;
                const str = `当前您的${goodsInfo.szgoodsname}数量不足${useValue}张，是否去兑换${goodsInfo.szgoodsname}?`;
                AlertDialog.showAlert(str , Handler.create(this.onOkCallBack , this));
            }
            return;
        }
        Game.festivalActivityMgr.reqLuckyDraw(this._curType);
    }

    private onOkCallBack() {
        console.log('----onOkCallBack:' , this._curType);
        // Game.festivalActivityMgr.reqLuckyDraw(this._curType);
        GameEvent.emit(EventEnum.ACTIVE_TAQING_PAGE_CHANGE , ACTIVE_TAQING_PAGE_INDEX.SHOP_EXCHANGE);
    }

    private initRedTower() {
        this._showTower = null;
        const list = this._config.luckydraw.wishitemlist;
        if (list) {
            const len = list.length;
            let item:GS_FestivalActivityConfig_WishItem;
            let quality:number = -1;
            for (let i = 0 ; i < len ; i++) {
                item = list[i];
                let goodsInfo = Game.goodsMgr.getGoodsInfo(item.ngoodsid);
                if (goodsInfo && goodsInfo.lgoodstype == GOODS_TYPE.GOODSTYPE_RES_UPGRADESTAR && goodsInfo.btquality > quality) {
                    this._showTower = Game.towerMgr.getTroopBaseInfo(goodsInfo.lparam[0]);
                    quality = goodsInfo.btquality;
                }
            }
        }
    }

    private initLuckyDraw() {
        const list = this._config.luckydraw.luckyitemlist;
        if (list && list.length > 0) {
            let item:GS_FestivalActivityConfig_LuckyItem;
            for (let i = 0 ; i < 10 ; i++) {
                item = list[i];
                if (item.ngoodsid > 0) {
                    let goodsData:GoodsItemData = {
                        goodsId:item.ngoodsid,
                        nums:item.ngoodsnum,
                        showNumWhenOne:true,
                        prefix:"x",
                    }
                    this.goodsItems[i].setData(goodsData , i);
                }
            }
        } 
    }

    private refreshLucky(nid:number = 0 , nums:number = 0) {
        const wishId = Game.festivalActivityMgr.getSelectWishId();
        let wishItem = null;
        if (wishId > 0) {
            wishItem = Game.festivalActivityMgr.getWishItem(wishId);
        }
        const total = wishItem ? wishItem.nwishneednum : 300;
        // let count = 
        const curValue = Game.festivalActivityMgr.getLuckyValue();
        this.progressBar.fillRange = curValue / total;
        this.progressValueLabel.string = curValue + '/' + total;
        if (nid > 0) {
            let index = this.clacIndex(nid);
            this.startEffect(index);
            this._toNums = nums;
        }

        if (curValue >= total) {
            this.doShake(this.xinYuanNode);
        } else {
            this.stopShake(this.xinYuanNode);
        }
    }

    private refreshTime() {
        let endTime = this._config.ntimeclose;
        let d = endTime - GlobalVal.getServerTimeS();
        this.timeLabel.string = StringUtils.formatTimeToDHMS(d);
    }

    private _curLuckyData:GS_FestivalActivityConfig_LuckyItem;
    private clacIndex(nid:number):number {
        let list = this._config.luckydraw.luckyitemlist;
        for (let i = 0 , len = list.length ; i < len ; i++) {
            if (list[i].nid == nid) {
                this._curLuckyData = list[i];
                return i;
            }
        }
        return -1;
    }

    protected doShake(node:cc.Node) {
        let tween = cc.tween(node);

        tween.to(0.1 , {angle:-10});
        tween.to(0.1 , {angle:10});
        tween.to(0.1 , {angle:-10});
        tween.to(0.1 , {angle:10});
        tween.to(0.1 , {angle:0});

        let self = this;
        tween.call(()=> {
            let tempTween = cc.tween(node);
            tempTween.delay(1).call(()=> {
                self.doShake(node);
            }).start();
        })
        tween.start();
    }

    protected stopShake(node:cc.Node) {
        node.stopAllActions();
        // node.scale = 1;
        node.angle = 0;
    }
}