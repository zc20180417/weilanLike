

import Dialog from "../utils/ui/Dialog";
import { EResPath } from "../common/EResPath";
import { UiManager } from "../utils/UiMgr";
import Game from "../Game";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SettingView extends Dialog {

    @property(cc.SpriteFrame)
    musicOn: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    musicOff: cc.SpriteFrame = null;

    @property(cc.Sprite)
    musicBtn: cc.Sprite = null;

    @property(cc.Sprite)
    effBtn: cc.Sprite = null;

    @property(cc.Sprite)
    openBoxBtn: cc.Sprite = null;

    @property(cc.Sprite)
    chatTipsBtn: cc.Sprite = null;

    @property(cc.Node)
    logOffNode: cc.Node = null;

    @property(cc.Node)
    personalCenterNode: cc.Node = null;

    @property(cc.Node)
    bgNode:cc.Node = null;

    @property(cc.Node)
    btnNode:cc.Node = null;

    start() {
        this.refreshEffectState(Game.soundMgr.isSoundOn);
        this.refreshMusicState(Game.soundMgr.isMusicOn);
        this.refreshChatTipsState(Game.chatMgr.openChatTip);
        this.refreshOpenBoxState(Game.tipsMgr.openBoxEft);
    }

    onEffectToggleClick() {
        Game.soundMgr.isSoundOn = !Game.soundMgr.isSoundOn;
        this.refreshEffectState(Game.soundMgr.isSoundOn);
    }

    onOpenBoxEftToggleClick() {
        Game.tipsMgr.openBoxEft = !Game.tipsMgr.openBoxEft;
        this.refreshOpenBoxState(Game.tipsMgr.openBoxEft);
    }

    onChatTipsToggleClick() {
        Game.chatMgr.openChatTip = !Game.chatMgr.openChatTip;
        this.refreshChatTipsState(Game.chatMgr.openChatTip);
    }

    refreshEffectState(state: boolean) {
        this.effBtn.spriteFrame = state ? this.musicOn : this.musicOff;
    }

    refreshOpenBoxState(state: boolean) {
        this.openBoxBtn.spriteFrame = state ? this.musicOn : this.musicOff;
    }
    refreshChatTipsState(state: boolean) {
        this.chatTipsBtn.spriteFrame = state ? this.musicOn : this.musicOff;
    }

    onMusicToggleClick() {
        Game.soundMgr.isMusicOn = !Game.soundMgr.isMusicOn;
        this.refreshMusicState(Game.soundMgr.isMusicOn);
    }

    refreshMusicState(state: boolean) {
        this.musicBtn.spriteFrame = state ? this.musicOn : this.musicOff; 
    }

    onPersonCenterClick() {
        // UiManager.showDialog(EResPath.QQ_QUN_VIEW);
    }

    onlogOffClick() {
        // UiManager.showDialog(EResPath.ADDICTION_VIEW);
    }

    onServiceClick() {
        Game.nativeApi.logout();
    }

    onStoryClick() {
        UiManager.showDialog(EResPath.FEED_BACK_VIEW);
    }

    protected beforeShow() {
        if (cc.sys.os !== cc.sys.OS_IOS) {
            this.bgNode.scaleY = 0.70;
            this.personalCenterNode.active = false;
            this.logOffNode.active = false;
            this.btnNode.y = -180;
        }
    }

}
