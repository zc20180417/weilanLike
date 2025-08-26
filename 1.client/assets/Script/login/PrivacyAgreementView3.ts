import { BuryingPointMgr, EBuryingPoint } from "../buryingPoint/BuryingPointMgr";
import { EventEnum } from "../common/EventEnum";
import Game from "../Game";
import { GameEvent } from "../utils/GameEvent";
import { Handler } from "../utils/Handler";
import SystemTipsMgr from "../utils/SystemTipsMgr";
import AlertDialog from "../utils/ui/AlertDialog";
import Dialog from "../utils/ui/Dialog";

const { ccclass, property ,menu} = cc._decorator;
@ccclass
@menu("Game/Login/PrivacyAgreementView3")
export default class PrivacyAgreementView3 extends Dialog {


    public show() {
        super.show();
       
        if (this.blackLayer) {
            this.blackLayer.color = cc.Color.WHITE;
            this.blackLayer.opacity = 255;
            this.blackLayer.setContentSize(cc.winSize);
        }
    }

    protected afterShow() {
        
    }

    protected beforeHide() {

    }

    onOkClick() {
        this.hide(false);
        BuryingPointMgr.postFristPoint(EBuryingPoint.AGREE_YINSI);
        GameEvent.emit(EventEnum.CONFIRM_PRIVACY_AGREEMENT);
    }

    onCancelClick() {
        SystemTipsMgr.instance.showSysTip2("只有同意才能进入游戏");
        // AlertDialog.showAlert('存储权限为游戏运行必备权限，您拒绝存储权限申请将无法进行正常游戏' , new Handler(this.onExitClick , this));
    }

    private onExitClick() {
        cc.game.end();
        // Game.nativeApi.exit();
    }

}