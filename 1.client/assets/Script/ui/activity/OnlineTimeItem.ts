import Game from "../../Game";
import { GS_SysActivityConfig_SysActivityTaskItem, GS_SysActivityPrivate_SysActivityData } from "../../net/proto/DMSG_Plaza_Sub_SysActivity";
import { ACTIVE_TYPE } from "../../net/socket/handler/MessageEnum";
import DayLoginItem from "./DayLoginItem";

const { ccclass, property , menu} = cc._decorator;

@ccclass
@menu("Game/ui/active/OnlineTimeItem")
export default class OnlineTimeItem extends DayLoginItem {


    constructor() {
        super();
        this.activeType = ACTIVE_TYPE.ONLINE_TIME;
    }
    
    protected onIcoLoaded() {
        // if (this.ico.spriteTarget.node.width > 80 || this.ico.spriteTarget.node.height > 80) {
        //     this.ico.node.scale = 0.52;
        //     this.icoBg.active = false;
        // } else {
        //     this.ico.node.scale = 1;
        //     this.icoBg.active = true;
        // }
    }

    // onClick() {
    //     if (this.data && this.data.cfg) {
    //         Game.sysActivityMgr.getReward(this.activeType, this.data.cfg.btindex);
    //     }
    // }

    setData(data:any , index:number) {
        // super.setData(data, index);
        this._data = data;
        this.index = index;
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

        this.dayLabel.string = `累计登录${Math.floor(item.nparam1 / 60)}分钟`;
        this.getBtn.active = !geted;
        this.getdNode.active = geted;

        if (Game.actorMgr.getOnlineTime() < item.nparam1 && this.getBtn.active) {
            this.getBtn.active = false;
        }

        this.icoBg.opacity = this.ico.node.opacity = geted ? 125 : 255;
        this.xLabel.node.color = this.nameLabel.node.color = this.countLabel.node.color = geted ? this.getdColor : this.normalColor;
        //
        // if (privatedata.nmainprogress > item.btindex && !geted) {
        //     Game.sysActivityMgr.getReward(this.activeType, this.data.cfg.btindex);
        // }

    }


}