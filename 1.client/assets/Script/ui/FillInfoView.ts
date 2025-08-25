// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EventEnum } from "../common/EventEnum";
import FlexLabel from "../customComponent/FlexLabel";
import Game from "../Game";
import { CS_ExchangeListView_ExchangeGoods } from "../net/proto/DMSG_Plaza_Sub_Exchange";
import { GameEvent } from "../utils/GameEvent";
import { StringUtils } from "../utils/StringUtils";
import SystemTipsMgr from "../utils/SystemTipsMgr";
import Dialog from "../utils/ui/Dialog";

const { ccclass, property } = cc._decorator;
export enum EXCHANGE_TYPE {
    REDPACKET = 1,//红包兑换
    TURNTABLE = 2,//转盘兑换
};

@ccclass
export default class FillInfoView extends Dialog {
    @property(cc.EditBox)
    userName: cc.EditBox = null;

    @property(cc.EditBox)
    phone: cc.EditBox = null;

    @property(FlexLabel)
    province: FlexLabel = null;

    @property(FlexLabel)
    city: FlexLabel = null;

    @property(FlexLabel)
    county: FlexLabel = null;

    @property(cc.EditBox)
    detailAddress: cc.EditBox = null;

    _areCode: number = null;

    _data: CS_ExchangeListView_ExchangeGoods = null;
    type: number = null;//兑换类型
    setData(data: any) {
        this._data = data.data;
        this.type = data.type;
    }

    beforeShow() {
        GameEvent.on(EventEnum.JAVA_REEGIONALISM_RETURN, this.onJavaEnterResult2, this);
        switch (this.type) {
            case EXCHANGE_TYPE.REDPACKET:
                GameEvent.on(EventEnum.EXCHANGE_UP_PRIVATE_DATA, this.onUpprivateData, this);
                break;
            case EXCHANGE_TYPE.TURNTABLE:
                GameEvent.on(EventEnum.TURNTABLE_EXCHANGE_SUCC, this.onTurntableExchangeSucc, this);
                break;
        }
    }

    private onJavaEnterResult2(ZipCode, province, city, county) {
        this.city.string = city || province;
        this.province.string = province;
        this.county.string = county;
        this._areCode = ZipCode;
    }

    private submit() {
        if (StringUtils.isNilOrEmpty(this.userName.string)) return SystemTipsMgr.instance.notice("姓名不能为空！");
        let reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
        if (!this.phone.string.match(reg)) {
            return SystemTipsMgr.instance.notice("请填写正确的手机号码");
        }
        if (StringUtils.isNilOrEmpty(this.province.string)) return SystemTipsMgr.instance.notice("请选择省区！");
        if (StringUtils.isNilOrEmpty(this.city.string)) return SystemTipsMgr.instance.notice("请选择市区！");
        if (StringUtils.isNilOrEmpty(this.county.string)) return SystemTipsMgr.instance.notice("请选择县区！");
        if (StringUtils.isNilOrEmpty(this.detailAddress.string)) return SystemTipsMgr.instance.notice("请填写详细地址！");

        let detailAddress = this.province.string + this.city.string + this.county.string + this.detailAddress.string;
        detailAddress = StringUtils.trim(detailAddress);
        if (detailAddress.length > 64) {
            detailAddress = detailAddress.slice(detailAddress.length - 63 , detailAddress.length);
        }

        switch (this.type) {
            case EXCHANGE_TYPE.REDPACKET:
                let data = this._data as CS_ExchangeListView_ExchangeGoods;
                Game.exchangeMgr.exchangeGoods(data.nrid, this.phone.string, this.userName.string, this._areCode, detailAddress);
                break;
            case EXCHANGE_TYPE.TURNTABLE:
                Game.turnTableMgr.writeInfo(this._areCode, this.userName.string, this.phone.string, detailAddress)
                break;
        }

    }

    private selectAddress() {
        if (cc.sys.isNative) {
            Game.nativeApi.toSelectReegionalism();
        }
    }

    private onUpprivateData(data: any) {
        this.hide();
    }

    private onTurntableExchangeSucc() {
        this.hide();
    }

}
