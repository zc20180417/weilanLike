// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import SysMgr from "../common/SysMgr";
import Game from "../Game";
import FrameEffect from "../utils/effect/FrameEffect";
import { Handler } from "../utils/Handler";
import PropEffectBase from "./PropEffectBase";
import PropScaleAnimation from "./PropScaleAnimation";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BombEffect extends PropEffectBase {
    @property(FrameEffect)
    bombOneAni: FrameEffect = null;

    @property(FrameEffect)
    bombTwoAni: FrameEffect = null;

    @property(cc.Node)
    bgNode: cc.Node = null;

    @property(PropScaleAnimation)
    propScaleAni: PropScaleAnimation = null;

    play() {
        this.bgNode.width = cc.winSize.width;
        let worldPos = this.startNode ? this.startNode.parent.convertToWorldSpaceAR(this.startNode.position) : cc.Vec3.ZERO;
        let pos = this.node.convertToNodeSpaceAR(worldPos);
        this.propScaleAni.setEffectBase(this);
        this.propScaleAni.play(pos);
        this.bombOneAni.playEndHandler || (this.bombOneAni.playEndHandler = Handler.create(this.endHandlerOne, this));
        this.bombTwoAni.playEndHandler || (this.bombTwoAni.playEndHandler = Handler.create(this.endHandlerTwo, this));

        // SysMgr.instance.pause = true;
    }

    endHandlerOne() {
        this.bombOneAni.node.active = false;

    }

    endHandlerTwo() {
        this.bombTwoAni.node.active = false;
        SysMgr.instance.pauseGame('magicSkill_' + this.skillId , false);
        this.end();
    }

    iconAniEnd() {
        // this.node.active = false;
        // Game.soMgr.createEffect("addheart", GlobalVal.catPos.x, GlobalVal.catPos.y, false);
        let cfg = Game.skillMgr.getMagicSkill(this.skillId);
        //this.scheduleOnce(this.releaseSkill, cfg.delay * 0.001);
        SysMgr.instance.doOnce(Handler.create(this.releaseSkill , this) , cfg.delay );
        // this.scheduleOnce(this.playRainAni, 1);
    }

    beforeExistAni() {
        this.playSound();
        this.bombTwoAni.playEndHandler = null;
        SysMgr.instance.clearTimer(Handler.create(this.playBombTwoAni , this));
        //cc.log('---------onMagicSkillRelease-- false' , this.skillId);
        SysMgr.instance.pauseGame('magicSkill_' + this.skillId , false);
        this.bombOneAni.node.active = true;
        this.bombOneAni.play();
        //this.scheduleOnce(this.playBombTwoAni, 0.72);
        SysMgr.instance.doOnce(Handler.create(this.playBombTwoAni , this) , 720 );
    }

    playBombTwoAni() {
        this.bombTwoAni.playEndHandler || (this.bombTwoAni.playEndHandler = Handler.create(this.endHandlerTwo, this));
        this.bombTwoAni.node.active = true;
        this.bombTwoAni.play();
    }

    end() {
        this.node.active = false;
    }

    onPause() {
        cc.director.getScheduler().pauseTarget(this);
        this.propScaleAni.pause();
    }

    onResume() {
        cc.director.getScheduler().resumeTarget(this);
        this.propScaleAni.resume();
    }

}
