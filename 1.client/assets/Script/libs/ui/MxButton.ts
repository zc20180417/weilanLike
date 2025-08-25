import { ESoundEftName } from "../../common/AllEnum";
import SoundManager from "../../utils/SoundManaget";


const { ccclass, property, menu } = cc._decorator;


enum EBtnSound {
    CLICK_COMMON,
    CLICK_UPGRADE,
    CUI_LIAN,
    QIANG_HUA,
    CHONG_ZHU,
}

/**
 * 按钮
 */
@ccclass
@menu("Game/utls/MxButton")
export class MxButton extends cc.Button {

    @property({
        type: cc.Enum(EBtnSound)
    })
    soundEftName: EBtnSound = EBtnSound.CLICK_COMMON;

    @property({
        displayName: "点击CD(s)",

    })
    cd: number = 0;

    private _inCD: boolean = false;

    _onTouchBegan(event) {
        if (this._inCD) return;
        if (!this.interactable) {
            SoundManager.instance.playSound(ESoundEftName.CLICK_ERROR);
        } else if (this.enabledInHierarchy) {
            SoundManager.instance.playSound(ESoundEftName[EBtnSound[this.soundEftName]]);
        }
        super['_onTouchBegan'](event);
        if (this.cd) {
            this._inCD = true;
            this.scheduleOnce(this.onCDEnd, this.cd);
        }
    }

    protected onEnable(): void {
        super.onEnable();
        this._inCD = false;
    }

    protected onDisable(): void {
        super.onDisable();
        this.unschedule(this.onCDEnd);
    }

    private onCDEnd() {
        this._inCD = false;
    }
}