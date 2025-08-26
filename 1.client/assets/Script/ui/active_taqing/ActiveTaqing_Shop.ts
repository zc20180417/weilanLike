

import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import GlobalVal from "../../GlobalVal";
import { GS_FestivalActivityConfig, GS_FestivalActivityConfig_ExchangeItem, GS_FestivalActivityPrivate, GS_FestivalActivityPrivate_ReceiveItem } from "../../net/proto/DMSG_Plaza_Sub_FestivalActivity";
import { GS_GoodsInfoReturn_GoodsInfo } from "../../net/proto/DMSG_Plaza_Sub_Goods";
import { GameEvent } from "../../utils/GameEvent";
import { StringUtils } from "../../utils/StringUtils";
import SystemTipsMgr from "../../utils/SystemTipsMgr";
import ImageLoader from "../../utils/ui/ImageLoader";
import List from "../../utils/ui/List";
import { PageView } from "../../utils/ui/PageView";



const { ccclass, property ,menu } = cc._decorator;

@ccclass
@menu('Game/ui/active-taqing/ActiveTaqing_Shop')
export class ActiveTaqing_Shop extends PageView {


    


    @property(cc.Label)
    timeLabel:cc.Label = null;

    @property(List)
    list:List = null;

    @property(ImageLoader)
    ico:ImageLoader = null;
    private _config:GS_FestivalActivityConfig;
    private _data:GS_FestivalActivityPrivate;
    private _goodsInfo:GS_GoodsInfoReturn_GoodsInfo;

    protected start(): void {
        // this.list.setClickHandler(Handler.create(this.onItemClick , this);
    }

    /**子类继承，标签页面板显示 */
    protected doShow() {
        this.list.node.width = cc.winSize.width * 0.5 - this.list.node.x;
        this._config = Game.festivalActivityMgr.getConfig();
        this._data = Game.festivalActivityMgr.getData();
        if (!this._config || !this._config.data2 || !this._data) return;
        this._goodsInfo = Game.goodsMgr.getGoodsInfo(Game.festivalActivityMgr.getExChangeGoodsId());
        this.refreshTime();
        this.schedule(this.refreshTime , 60 , cc.macro.REPEAT_FOREVER );
        this.refreshList();
        // this.refreshExchangeGoodsCount(this._config.nexchangegoodsid , );
    }

    private refreshList() {
        let datas = this._config.data2;
        if (datas) {
            let len = datas.length;
            let dataList:any[] = [];
            for (let i = 0 ; i < len ; i++) {
                dataList.push({
                    config:datas[i],
                    state:Game.festivalActivityMgr.getExchangeShopItemState(datas[i].nid),
                    goodsInfo:this._goodsInfo,
                });
            }
            dataList.sort(this.sortTask);
            this.list.array = dataList;
        }

        // this.goodsCountLabel.contentStr = Game.festivalActivityMgr.getExchangeGoodsCount() + '';
    }
    
    private onItemClick(data:any) {
        if (!data) return;
        let config:GS_FestivalActivityConfig_ExchangeItem = data.config;
        let state:GS_FestivalActivityPrivate_ReceiveItem = data.state;
        if (config && state) {
            if (config.nlimitbuynum <= state.ntimes) {
                SystemTipsMgr.instance.notice("该商品已达到购买上限");
                return;
            }
        }
        Game.festivalActivityMgr.reqBuyExchangeGoods(config.nid);
    }

    /**子类继承，标签页面板关闭 */
    protected doHide() {
        this.unschedule(this.refreshTime);
    }

    /**子类继承，添加事件 */
    protected addEvent() {
        GameEvent.on(EventEnum.ACTIVE_TAQING_EXCHANGE_RET , this.refreshList , this);
        
    }
    /**子类继承，移除事件 */
    protected removeEvent() {
        GameEvent.off(EventEnum.ACTIVE_TAQING_EXCHANGE_RET , this.refreshList , this);
    }

    

    private refreshTime() {
        let endTime = this._config.ntimeclose;
        let d = endTime - GlobalVal.getServerTimeS();
        this.timeLabel.string = `本次可兑换的时间还剩下：` + StringUtils.getCeilTime(d);
    }

    private sortTask(a:any , b:any):number {
        return a.config.usortid - b.config.usortid;
    }

    




}