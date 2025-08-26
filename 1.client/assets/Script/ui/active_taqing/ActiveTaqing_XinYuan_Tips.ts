import Game from "../../Game";
import { GS_FestivalActivityConfig_WishItem } from "../../net/proto/DMSG_Plaza_Sub_FestivalActivity";
import { GOODS_TYPE } from "../../net/socket/handler/MessageEnum";
import { Handler } from "../../utils/Handler";
import SystemTipsMgr from "../../utils/SystemTipsMgr";
import Dialog from "../../utils/ui/Dialog";
import List from "../../utils/ui/List";

const { ccclass, property ,menu } = cc._decorator;

@ccclass
@menu('Game/ui/active-taqing/ActiveTaqing_XinYuan_Tips')
export class ActiveTaqing_XinYuan_Tips extends Dialog {


    @property(List)
    list:List = null;

    @property(cc.Node)
    btnNode:cc.Node = null;

    @property(cc.Label)
    btnLabel:cc.Label = null;

    private _selectIndex:number = -1;
    protected beforeShow(): void {
        let config = Game.festivalActivityMgr.getConfig();
        let data = Game.festivalActivityMgr.getData();
        if (!config || !data) return;
        this.btnNode.active = false;
        this.list.selectEnable = true;
        this.list.setSelectedHandler(new Handler(this.onSelect , this));
        let datas = config.luckydraw.wishitemlist;
        let len = datas.length;
        let dataList:any[] = [];
        let dataItemConfig:GS_FestivalActivityConfig_WishItem;
        for (let i = 0 ; i < len ; i++) {
            dataItemConfig = datas[i];
            if (dataItemConfig.ngoodsid > 0) {
                let state = Game.festivalActivityMgr.getXinYuanItemState(dataItemConfig.nid);
                let goodsInfo = Game.goodsMgr.getGoodsInfo(dataItemConfig.ngoodsid);
                let flag = false;
                if (goodsInfo && goodsInfo.lgoodstype == GOODS_TYPE.GOODSTYPE_RES_SKIN) {
                    flag = Game.fashionMgr.getFashionData(goodsInfo.lparam[1]) != null;
                }
                dataList.push({
                    config:datas[i],
                    geted:state.ntimes >= dataItemConfig.nmaxgetcount && dataItemConfig.nmaxgetcount > 0 || flag,
                })
            }
        }

        this.list.array = dataList;
        
    }

    private onSelect(data:any) {
        this._selectIndex = data;
        let selectData = this.list.array[this._selectIndex];
        if (selectData) {
            let flag = Game.festivalActivityMgr.getLuckyValue() >= selectData.config.nwishneednum;
            this.btnLabel.string = flag ? '领 取' : '选 中';
            this.btnNode.active = true;
        }
    }

    onGetClick() {
        if (this._selectIndex == -1) {
            SystemTipsMgr.instance.notice("请选择要换取的道具");
            return;
        }

        let selectData = this.list.array[this._selectIndex];
        let nid = selectData.config.nid;
        let state = Game.festivalActivityMgr.getXinYuanItemState(selectData.nid);

        let goodsInfo = Game.goodsMgr.getGoodsInfo(selectData.ngoodsid);
        let flag = false;
        if (goodsInfo && goodsInfo.lgoodstype == GOODS_TYPE.GOODSTYPE_RES_SKIN) {
            flag = Game.fashionMgr.getFashionData(goodsInfo.lparam[1]) != null;
        }

        if ((state.ntimes >= selectData.nmaxgetcount && selectData.nmaxgetcount > 0) || flag) {
            SystemTipsMgr.instance.notice("该道具已达到领取上限");
            return;
        }

        let flag2 = Game.festivalActivityMgr.getLuckyValue() >= selectData.config.nwishneednum;
        if (flag2) {
            Game.festivalActivityMgr.reqWish(nid);
        } else {
            Game.festivalActivityMgr.selectWish(nid);
        }

        this.hide();
    }
}