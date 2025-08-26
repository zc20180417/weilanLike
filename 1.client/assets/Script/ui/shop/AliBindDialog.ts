import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { EXCHANGE_GOODS_TYPE } from "../../net/mgr/ExchangeMgr";
import { CS_ExchangeListView_ExchangeGoods, GS_ExchangeUpPrivateData } from "../../net/proto/DMSG_Plaza_Sub_Exchange";
import { GameEvent } from "../../utils/GameEvent";
import { StringUtils } from "../../utils/StringUtils";
import SystemTipsMgr from "../../utils/SystemTipsMgr";
import Dialog from "../../utils/ui/Dialog";

const { ccclass, property , menu } = cc._decorator;
@ccclass
@menu("Game/ui/shop/AliBindDialog")
export class AliBindDialog extends Dialog {

    @property(cc.EditBox)
    accountEditBox:cc.EditBox = null;

    @property(cc.EditBox)
    nameEditBox:cc.EditBox = null;


    private _data:CS_ExchangeListView_ExchangeGoods;
    setData(data:any) {
        this._data = data;
    }

    addEvent() {

        GameEvent.on(EventEnum.EXCHANGE_UP_PRIVATE_DATA , this.onUpdate , this);
    }

    onBindClick() {
        if (!this._data || this._data.nawardtype != EXCHANGE_GOODS_TYPE.ALI_REDPACKET) {
            SystemTipsMgr.instance.notice("数据错误");
            return;
        }
        if (StringUtils.isNilOrEmpty(this.nameEditBox.string)) {
            SystemTipsMgr.instance.notice("请输入真实姓名");
            return;
        }
        if (StringUtils.isNilOrEmpty(this.accountEditBox.string)) {
            SystemTipsMgr.instance.notice("请输入支付宝账号");
            return;
        }

        Game.exchangeMgr.exchangeAliPay(this._data.nrid , this.nameEditBox.string , this.accountEditBox.string);
       
    }

    private onUpdate(data:GS_ExchangeUpPrivateData) {
        if (this._data && data.nrid == this._data.nrid) {
            this.hide();
        }
    }
}