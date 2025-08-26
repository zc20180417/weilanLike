// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { BuryingPointMgr, EBuryingPoint } from "../buryingPoint/BuryingPointMgr";
import { EResPath } from "../common/EResPath";
import { EventEnum } from "../common/EventEnum";
import SysMgr from "../common/SysMgr";
import Game from "../Game";
import GlobalVal from "../GlobalVal";
import { GameEvent } from "../utils/GameEvent";

import { Handler } from "../utils/Handler";
import SystemTipsMgr from "../utils/SystemTipsMgr";
import Dialog from "../utils/ui/Dialog";
import GroupImage from "../utils/ui/GroupImage";


const { ccclass, property } = cc._decorator;

@ccclass
export default class BackToLifeView extends Dialog {

    @property(cc.Node)
    bgs: cc.Node[] = [];

    // @property(cc.Button)
    // diaBtn: cc.Button = null;

    @property(GroupImage)
    time: GroupImage = null;

    @property(cc.Node)
    zhizhuNode:cc.Node = null;

    // @property(cc.Label)
    // diamondLabel:cc.Label = null;

    @property(cc.Node)
    hpNodes:cc.Node[] = [];

    @property(cc.Node)
    timeNodes:cc.Node[] = [];

    @property(cc.Node)
    tvNode:cc.Node = null;

    @property(cc.SpriteFrame)
    zhouKaFuhuoSf:cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    tvFuHuoSf:cc.SpriteFrame = null;

    @property(cc.Sprite)
    fuhuoSp:cc.Sprite = null;

    @property(cc.Node)
    icoTv:cc.Node = null;

    @property(cc.Node)
    zhoukaTxt:cc.Node = null;

    @property(cc.Node)
    huoNode:cc.Node = null;

    protected timeNum: number = 6;

    private data: any = null;

    setData(data: any) {
        this.data = data;
    }

    beforeShow() {
        let halfWidth = cc.winSize.width * 0.5;
        let halfHeight = cc.winSize.height * 0.5;
        this.bgs.forEach((v) => {
            v.width = halfWidth;
            v.height = halfHeight;
        });

        this.hpNodes.forEach(element => {
            element && (element.active = !this.data.isTime);
        });
        this.timeNodes.forEach(element => {
            element && (element.active = this.data.isTime);
        });

        this.fuhuoSp.spriteFrame = GlobalVal.closeAwardVideo ? this.zhouKaFuhuoSf:this.tvFuHuoSf;
        this.icoTv.active = !GlobalVal.closeAwardVideo;

        if (this.data.isTime) {
            this.zhoukaTxt.active = GlobalVal.closeAwardVideo;
        }

        this.huoNode && (this.huoNode.x = GlobalVal.closeAwardVideo ? -77.524 : -71.467);

        // this.diamondLabel.string = Game.curGameCtrl.curMissonData.nfullhpneeddiamonds + '';

        // let isEnough = Game.actorMgr.getProp(ActorProp.ACTOR_PROP_DIAMONDS) >= Game.curGameCtrl.curMissonData.nfullhpneeddiamonds;
        // NodeUtils.enabled(this.diaBtn, isEnough);
        this.updateTime();
        GameEvent.on(EventEnum.DO_REVIVE, this.onRevive, this);
        BuryingPointMgr.post(EBuryingPoint.SHOW_RECV_VIEW);

        this.playSound1();

        SysMgr.instance.doLoop(Handler.create(this.playSound1 , this) , 2400 ,0, true);
        SysMgr.instance.doLoop(Handler.create(this.playSound2 , this) , 4350 ,0, true);
        SysMgr.instance.doOnce(Handler.create(this.playSound2 , this) , 1500 , true);

        if (this.tvNode) {
            this.tvNode.active = Game.curGameCtrl.curMissonData.btfvstate == 1;
        }

    }

    afterShow() {
        //倒计时10秒
        this.moveZhiZhu();
        this.schedule(this.updateTime, 1, this.timeNum);
    }

    private onRevive() {
        this.hide();
    }

    updateTime() {
        this.timeNum--;
        if (this.timeNum < 0) {
            this.timeEnd();
            return;
        }
        this.time.contentStr = this.timeNum.toString();
    }

    private timeEnd() {
        this.hide();
        GameEvent.emit(EventEnum.DO_FAIL);
    }

    private onFreeClick() {
        if (this.data.warId == null) return;

        if (!Game.signMgr.checkBoughtWeek()) {
            return;
        }

        this.unschedule(this.updateTime);
        Game.sceneNetMgr.reqFullUpByFreeVideo(this.data.warId);
    }

    private onDiaClick() {
        if (this.data.warId == null) return;

        if (Game.actorMgr.getDiamonds() < Game.curGameCtrl.curMissonData.nfullhpneeddiamonds) {
            SystemTipsMgr.instance.notice('钻石不足');
            return;
        }

        this.unschedule(this.updateTime);
        Game.sceneNetMgr.reqFullUpByDia(this.data.warId);
        BuryingPointMgr.postWar(EBuryingPoint.RECIVE_DIAMOND);
    }

    onCloseClick() {
        this.hide();
        GameEvent.emit(EventEnum.DO_FAIL);
    }

    onDestroy() {
        this.unschedule(this.updateTime);
        Handler.dispose(this);
    }

    private moveZhiZhu() {
        let tween = cc.tween(this.zhizhuNode);

        tween.to(1.0 , {y:-72} , { easing: "sineIn" });
        tween.to(1.0 , {y:-44});
        let self = this;
        tween.call(()=> {
            let tempTween = cc.tween(self.zhizhuNode);
            tempTween.delay(0.5).call(()=> {
                self.moveZhiZhu();
            }).start();
        })

        tween.start();
    }

    private playSound1() {
        Game.soundMgr.playSound(EResPath.REVICE_CAT_SOUND1);
    }

    private playSound2() {
        Game.soundMgr.playSound(EResPath.REVICE_CAT_SOUND2);
    }

    protected beforeHide() {
        SysMgr.instance.clearTimerByTarget(this , true);
    }

}
