import { EventEnum } from "../../common/EventEnum";
import SysMgr from "../../common/SysMgr";
import Game from "../../Game";
import { GameEvent } from "../../utils/GameEvent";
import { Handler } from "../../utils/Handler";
import { CaptureToNative } from "./CaptureToNative";

const { ccclass, property ,menu} = cc._decorator;
@ccclass
@menu("Game/ui/share/ShareView")
export class ShareView extends cc.Component {

    @property(cc.Camera)
    camera:cc.Camera = null;

    @property(cc.Sprite)
    qrImg:cc.Sprite = null;

    @property(CaptureToNative)
    caprure:CaptureToNative = null;


    start() {

        GameEvent.on(EventEnum.QRCODE_IMG , this.onQrImg , this);
        Game.shareMgr.getQrCodeImg();
    }

    private onQrImg(sf:cc.SpriteFrame) {
        this.qrImg.spriteFrame = sf;
        SysMgr.instance.doFrameOnce(new Handler(this.onNextFrame , this) , 3 , true);
    }

    private onNextFrame() {
        if (this.caprure) {
            this.caprure.captureImg();
        }
    }

    onDestroy() {
        GameEvent.off(EventEnum.QRCODE_IMG , this.onQrImg , this);
    }

    
    
}