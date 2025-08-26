import Game from "../../Game";
import { GS_SysActivityConfig_SysActivityTaskItem, GS_SysActivityPrivate_SysActivityData } from "../../net/proto/DMSG_Plaza_Sub_SysActivity";
import { ACTIVE_TYPE } from "../../net/socket/handler/MessageEnum";
import { Handler } from "../../utils/Handler";
import BaseItem from "../../utils/ui/BaseItem";
import ImageLoader from "../../utils/ui/ImageLoader";
import Utils from "../../utils/Utils";

const { ccclass, property , menu} = cc._decorator;

@ccclass
@menu("Game/ui/active/DayLoginItem")
export default class DayLoginItem extends BaseItem {


    @property(cc.Label)
    dayLabel:cc.Label = null;

    @property(ImageLoader)
    ico:ImageLoader = null;

    @property(cc.Node)
    icoBg:cc.Node = null;

    @property(cc.Label)
    nameLabel:cc.Label = null;

    @property(cc.Label)
    countLabel:cc.Label = null;

    @property(cc.Label)
    xLabel:cc.Label = null;

    @property(cc.Node)
    getdNode:cc.Node = null;

    @property(cc.Node)
    getBtn:cc.Node = null;

    @property(cc.Color)
    getdColor:cc.Color = cc.Color.BLACK;

    @property(cc.Color)
    normalColor:cc.Color = cc.Color.BLACK;

    protected activeType:ACTIVE_TYPE = ACTIVE_TYPE.DAY_LOGIN;
    protected _icoSetTexCb:Handler;

    onLoad() {
        this._icoSetTexCb = new Handler(this.onIcoLoaded , this);
    }

    protected onIcoLoaded() {
        if (this.ico.spriteTarget.node.width > 80 || this.ico.spriteTarget.node.height > 80) {
            this.ico.node.scale = 0.52;
            this.icoBg.active = false;
        } else {
            this.ico.node.scale = 1;
            this.icoBg.active = true;
        }
    }

    onClick() {
        if (this.data && this.data.cfg) {
            Game.sysActivityMgr.joinSysActivity(this.activeType, this.data.cfg.btindex , 1);
        }
    }

    setData(data:any , index:number) {
        super.setData(data, index);
        if (!data) return;
        this.ico.setTexCb(this._icoSetTexCb);
        let item = data.cfg as GS_SysActivityConfig_SysActivityTaskItem;
        let privatedata = data.privateData as GS_SysActivityPrivate_SysActivityData;
        let geted = data.flag;
        let goodsid = item.nparam2;
        let goodsnum = item.nparam3;

        let goodsInfo = Game.goodsMgr.getGoodsInfo(goodsid);
        if (goodsInfo) {
            this.ico.setPicId(goodsInfo.npacketpicid);
            this.nameLabel.string = goodsInfo.szgoodsname;
            this.countLabel.string = goodsnum + '';
        }

        this.dayLabel.string = `第 ${item.btindex + 1} 天`;
        this.getBtn.active = !geted;
        this.getdNode.active = geted;

        if ((privatedata.nmainprogress != item.btindex || Utils.isTimeInToday(privatedata.nlastchangetimes)) && this.getBtn.active) {
            this.getBtn.active = false;
        }

        this.icoBg.opacity = this.ico.node.opacity = geted ? 125 : 255;
        this.xLabel.node.color = this.nameLabel.node.color = this.countLabel.node.color = geted ? this.getdColor : this.normalColor;
        //
        if (privatedata.nmainprogress > item.btindex && !geted) {
            Game.sysActivityMgr.getReward(this.activeType, this.data.cfg.btindex);
        }

    }


}