import Dialog from "../../utils/ui/Dialog";
import Game from "../../Game";
import { UiManager } from "../../utils/UiMgr";
import { EResPath } from "../../common/EResPath";
import { ActorProp } from "../../net/socket/handler/MessageEnum";
import { NodeUtils } from "../../utils/ui/NodeUtils";
import GlobalVal from "../../GlobalVal";
import { BuryingPointMgr, EBuryingPoint } from "../../buryingPoint/BuryingPointMgr";
import { GameEvent } from "../../utils/GameEvent";
import { EventEnum } from "../../common/EventEnum";
import { GAME_TYPE } from "../../common/AllEnum";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("Game/ui/CpMenuView")
export default class CpMenuView extends Dialog {

    @property(cc.Label)
    label: cc.Label = null;

    @property(cc.Button)
    reStartBtn: cc.Button = null;

    @property(cc.Node)
    hideNode: cc.Node = null;

    @property(cc.Node)
    normalNode: cc.Node = null;

    @property(cc.Label)
    hideLab: cc.Label = null;

    @property(cc.SpriteFrame)
    musicOn: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    musicOff: cc.SpriteFrame = null;

    @property(cc.Sprite)
    musicBtn: cc.Sprite = null;

    @property(cc.SpriteFrame)
    effOn: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    effOff: cc.SpriteFrame = null;

    @property(cc.Sprite)
    effBtn: cc.Sprite = null;

    @property(cc.Node)
    txtBounty:cc.Node = null;

    @property(cc.Node)
    txtHard:cc.Node = null;

    onGoon() {
        this.hide();
    }

    start() {
        this.refreshEffectState(Game.soundMgr.isSoundOn);
        this.refreshMusicState(Game.soundMgr.isMusicOn);
    }


    onReStart() {
        if (!this.checkCanReStart()) {
            return this.hide();
        }
        if (GlobalVal.mindRestart) {
            return UiManager.showDialog(EResPath.EXIT_CP_TIPS);
        }
        this.hide();
        Game.curGameCtrl.reStart(false);
        BuryingPointMgr.postWar(EBuryingPoint.TOUCH_MENU_RESTART);
    }

    onExit() {
        this.hide();
        BuryingPointMgr.postWar(EBuryingPoint.EXIT_WAR);
        BuryingPointMgr.postWar(EBuryingPoint.TOUCH_MENU_EXIT);
        GameEvent.emit(EventEnum.DO_EXIT_MAP);
    }

    onBuy() {
        UiManager.showDialog(EResPath.SKILL_SHOP_VIEW);
    }

    setData(data: any) {
        if (!data) return;

        let str = data.str;
        let type = data.type;

        if (type == GAME_TYPE.BOUNTY) {
            this.txtBounty.active = true;
            this.label.node.active = false;
        } else {
            this.label.string = str;
            this.hideLab.string = str;

            if (type == GAME_TYPE.HARD) {
                this.txtHard.active = true;
            }
        }

        if (Game.sceneNetMgr.isHideWar(GlobalVal.curMapCfg.nwarid)) {
            this.hideNode.active = true;
            this.normalNode.active = false;
        } else {
            this.hideNode.active = false;
            this.normalNode.active = true;
        }
    }

    beforeShow() {
        if (!this.checkCanReStart()) {
            NodeUtils.enabled(this.reStartBtn, false);
        }
    }

    afterShow() {
        if (!Game.curGameCtrl || !Game.curGameCtrl.curMissonData) {
            this.hide();
        }
    }

    private checkCanReStart(): boolean {
        if (!Game.curGameCtrl) return false;
        if (Game.curGameCtrl.curMissonData) {
            return Game.actorMgr.getStrength() >= Game.curGameCtrl.curMissonData.uopenneedstrength;
        }

        return false;
    }

    onEffectToggleClick() {
        Game.soundMgr.isSoundOn = !Game.soundMgr.isSoundOn;
        this.refreshEffectState(Game.soundMgr.isSoundOn);
    }

    refreshEffectState(state: boolean) {
        this.effBtn.spriteFrame = state ? this.effOn : this.effOff;
    }

    onMusicToggleClick() {
        Game.soundMgr.isMusicOn = !Game.soundMgr.isMusicOn;
        this.refreshMusicState(Game.soundMgr.isMusicOn);
    }

    refreshMusicState(state: boolean) {
        this.musicBtn.spriteFrame = state ? this.musicOn : this.musicOff;
    }


}
