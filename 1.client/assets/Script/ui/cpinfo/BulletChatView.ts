import Game from "../../Game";
import { StringUtils } from "../../utils/StringUtils";
import SystemTipsMgr from "../../utils/SystemTipsMgr";
import Dialog from "../../utils/ui/Dialog";

const { ccclass, property ,menu} = cc._decorator;

@ccclass
@menu("Game/ui/cpinfo/BulletChatView")
export class BulletChatView extends Dialog {

    @property(cc.EditBox)
    editBox:cc.EditBox = null;

    private _warid:number = -1;
    setData(data:any) {
        this._warid = data;
    }

    onSendClick() {
        let str = this.editBox.string;
        if (StringUtils.isNilOrEmpty(str)) {
            SystemTipsMgr.instance.notice("留言不能为空");
            return;
        }

        if (this._warid && this._warid != -1) {
            Game.bulletChatMgr.reqSendBulletChat(this._warid , str);
        }
        this.hide();
    }
}