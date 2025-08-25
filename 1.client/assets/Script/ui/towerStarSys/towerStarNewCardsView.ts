
import { QUALITY_COLOR } from "../../common/AllEnum";
import { EResPath } from "../../common/EResPath";
import Game from "../../Game";
import { GS_TroopsInfo_TroopsInfoItem } from "../../net/proto/DMSG_Plaza_Sub_Troops";
import SoundManager from "../../utils/SoundManaget";
import Dialog from "../../utils/ui/Dialog";
import ImageLoader from "../../utils/ui/ImageLoader";
import { UiManager } from "../../utils/UiMgr";
import { ROLECARDS } from '../../net/socket/handler/MessageEnum';
import { GameEvent } from '../../utils/GameEvent';
import { EventEnum } from '../../common/EventEnum';
import { SystemGuideTriggerType } from '../guide/SystemGuideCtrl';

const { ccclass, property } = cc._decorator;

@ccclass
export default class TowerStarNewCardView extends Dialog {
    @property(ImageLoader)
    towerIco: ImageLoader = null;

    @property(cc.Label)
    towerName: cc.Label = null;

    @property(cc.Label)
    towerDes: cc.Label = null;

    @property(cc.ProgressBar)
    attack: cc.ProgressBar = null;

    @property(cc.ProgressBar)
    dis: cc.ProgressBar = null;

    @property(cc.ProgressBar)
    speed: cc.ProgressBar = null;

    @property(cc.Node)
    bgNode: cc.Node = null;

    @property(cc.Node)
    bgAniNode: cc.Node = null;

    @property(cc.ProgressBar)
    ctrlProgress: cc.ProgressBar = null;

    @property(cc.Label)
    ctrlName: cc.Label = null;

    @property(cc.ParticleSystem)
    left: cc.ParticleSystem = null;

    @property(cc.ParticleSystem)
    right: cc.ParticleSystem = null;

    @property(cc.Animation)
    lights: cc.Animation[] = [];

    private soundId: number = -1;

    private towerCfg: GS_TroopsInfo_TroopsInfoItem = null;

    setData(data: number) {
        this.towerCfg = Game.towerMgr.getTroopBaseInfo(data);
    }

    start() {
        UiManager.showMask();

        this.scheduleOnce(() => {
            UiManager.hideMask();
        }, 1);

        this.refresh();

        this.bgAniNode.active = false;

        this.bgNode.opacity = 0;
        cc.tween(this.bgNode).to(0.25, { opacity: 255 }).start();

        //播放音效
        SoundManager.instance.playSound(EResPath.CP_SUCC);
    }

    afterShow() {
        this.bgAniNode.active = true;
        this.left.resetSystem();
        this.right.resetSystem();
        let halfH = cc.winSize.height * 0.5;
        this.lights.forEach((v) => {
            v.node.active = true;
            v.node.y = halfH;
            v.play();
        });
    }

    afterHide() {
        SoundManager.instance.stopSound(this.soundId);

        if (this.towerCfg && 
            this.towerCfg.bttype != ROLECARDS.ROLECARDS_SUPER &&
            Game.towerMgr.getFightTowerID(this.towerCfg.bttype) < this.towerCfg.ntroopsid &&
            UiManager.checkShowDialog(EResPath.TOWER_STAR_MAIN_VIEW , this.towerCfg.bttype - 1)) {
                GameEvent.emit(EventEnum.SYSTEM_GUIDE_TRIGGER, SystemGuideTriggerType.GET_NEW_HIGH_TOWER , this.towerCfg.ntroopsid);
        }
    
    }

    refresh() {

        this.towerIco.url = EResPath.TOWER_IMG + Game.towerMgr.get3dpicres(this.towerCfg.ntroopsid, this.towerCfg);

        this.bgNode.setContentSize(cc.winSize);
        this.bgNode.color = cc.color(QUALITY_COLOR[this.towerCfg.btquality + 1] || QUALITY_COLOR["1"]);

        //名称
        // this.title.getComponent(TowerTitleItem).refresh(this.towerCfg.bttype);

        this.towerName.string = Game.towerMgr.getTowerName(this.towerCfg.ntroopsid, this.towerCfg);

        this.towerDes.string = this.towerCfg.szdes2;

        let progress = 0, maxValue = 10;
        progress = this.towerCfg.btattackhurt / maxValue;
        this.attack.progress = progress;

        progress = this.towerCfg.btattackdist / maxValue;
        this.dis.progress = progress;

        progress = this.towerCfg.btattackspeed / maxValue;
        this.speed.progress = progress;

        let name = "";
        this.ctrlName.node.active = true;
        this.ctrlProgress.node.active = true;
        if (this.towerCfg.btprofit > 0) {
            progress = this.towerCfg.btprofit / maxValue;
            name = "收益：";
        } else if (this.towerCfg.btdot > 0) {
            progress = this.towerCfg.btdot / maxValue;
            name = "毒伤：";
        } else if (this.towerCfg.btctr > 0) {
            progress = this.towerCfg.btctr / maxValue;
            name = "控制：";
        } else {
            this.ctrlName.node.active = false;
            this.ctrlProgress.node.active = false;
        }
        this.ctrlProgress.progress = progress;
        this.ctrlName.string = name;
    }
}
