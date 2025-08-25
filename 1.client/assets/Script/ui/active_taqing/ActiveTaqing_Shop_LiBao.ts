
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import GlobalVal from "../../GlobalVal";
import { GS_FestivalActivityConfig, GS_FestivalActivityPrivate, GS_FestivalActivityConfig_ExchangeItem, GS_FestivalActivityPrivate_ReceiveItem } from "../../net/proto/DMSG_Plaza_Sub_FestivalActivity";
import { GameEvent } from "../../utils/GameEvent";
import { StringUtils } from "../../utils/StringUtils";
import List from "../../utils/ui/List";
import { PageView } from "../../utils/ui/PageView";


const { ccclass, property ,menu } = cc._decorator;

@ccclass
@menu('Game/ui/active-taqing/ActiveTaqing_Shop_LiBao')
export class ActiveTaqing_Shop_LiBao extends PageView {


    @property(cc.Label)
    timeLabel:cc.Label = null;

    @property(List)
    list:List = null;

    private _config:GS_FestivalActivityConfig;
    private _data:GS_FestivalActivityPrivate;
    // show(data:any) {
    //     super.show(data);

        
    // }
    

    /**子类继承，标签页面板显示 */
    protected doShow() {
        this.list.node.width = cc.winSize.width * 0.5 - this.list.node.x;
        this._config = Game.festivalActivityMgr.getConfig();
        this._data = Game.festivalActivityMgr.getData();
        if (!this._config || !this._config.data3 || !this._data) return;
        this.refreshTime();
        this.schedule(this.refreshTime , 60 , cc.macro.REPEAT_FOREVER );
        this.refreshList();
        
    }

    private refreshList() {
        let datas = this._config.data3;
        if (datas) {
            let len = datas.length;
            let dataList:any[] = [];
            for (let i = 0 ; i < len ; i++) {
                dataList.push({
                    config:datas[i],
                    state:Game.festivalActivityMgr.getShopItemState(datas[i].nid),
                });
            }
            dataList.sort(this.sortTask);
            this.list.array = dataList;
        }

        // this.diamondLabel.contentStr = Game.festivalActivityMgr.getExchangeGoodsCount() + '';
    }
    
    

    /**子类继承，标签页面板关闭 */
    protected doHide() {
        this.unschedule(this.refreshTime);
    }

    /**子类继承，添加事件 */
    protected addEvent() {
        GameEvent.on(EventEnum.ACTIVE_TAQING_MALL_RET , this.refreshList , this);
    }
    /**子类继承，移除事件 */
    protected removeEvent() {
        GameEvent.off(EventEnum.ACTIVE_TAQING_MALL_RET , this.refreshList , this);
    }

    private refreshTime() {
        let endTime = this._config.ntimeclose;
        let d = endTime - GlobalVal.getServerTimeS();
        this.timeLabel.string = `本次活动礼包可购买时间还剩下：` + StringUtils.getCeilTime(d);
    }

    private sortTask(a:any , b:any):number {
        let flagA = a.state.ntimes >= a.config.nlimitbuynum;
        let flagB = b.state.ntimes >= b.config.nlimitbuynum;

        if (flagA != flagB) {
            if (flagA) {
                return 1;
            }

            if (flagB) {
                return -1;
            }
        }
        return a.config.usortid - b.config.usortid;
    }
}