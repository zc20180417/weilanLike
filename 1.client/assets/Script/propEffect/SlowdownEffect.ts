// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import SysMgr from "../common/SysMgr";
import Game from "../Game";
import GlobalVal from "../GlobalVal";
import { Handler } from "../utils/Handler";
import PropEffectBase from "./PropEffectBase";
import PropScaleAnimation from "./PropScaleAnimation";
import Rain from "./Rain";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SlowdownEffect extends PropEffectBase {
    @property(cc.Node)
    bgNode: cc.Node = null;

    @property(PropScaleAnimation)
    propScaleAni: PropScaleAnimation = null;

    @property(cc.ParticleSystem)
    leafParticle: cc.ParticleSystem = null;

    @property(cc.ParticleSystem)
    rainParticle: cc.ParticleSystem = null;

    @property(Rain)
    rain: Rain = null;

    play() {
        this.bgNode.width = cc.winSize.width;
        let worldPos = this.startNode ? this.startNode.parent.convertToWorldSpaceAR(this.startNode.position) : cc.Vec3.ZERO;
        let pos = this.node.convertToNodeSpaceAR(worldPos);
        this.propScaleAni.setEffectBase(this);
        this.propScaleAni.play(pos);
        this.leafParticle.resetSystem();
        // SysMgr.instance.pause = true;
    }

    iconAniEnd() {
        // this.node.active = false;
        // Game.soMgr.createEffect("addheart", GlobalVal.catPos.x, GlobalVal.catPos.y, false);
        //cc.log('---------onMagicSkillRelease-- false' , this.skillId);
        SysMgr.instance.pauseGame('magicSkill_' + this.skillId , false);
        let cfg = Game.skillMgr.getMagicSkill(this.skillId);
        SysMgr.instance.doOnce(Handler.create(this.releaseSkill , this) , cfg.delay);
        //this.scheduleOnce(this.releaseSkill, cfg.delay * 0.001);
        // this.scheduleOnce(this.playRainAni, 1);
    }


    playRainAni() {
        this.playSound();
        this.rain.play();
        this.rainParticle.resetSystem();
        SysMgr.instance.doOnce(Handler.create(this.stopRainAni , this) , 6000);
        //this.scheduleOnce(this.stopRainAni, 6);
    }

    stopRainAni() {
        this.rain.stop();
        this.rainParticle.stopSystem();
        SysMgr.instance.doOnce(Handler.create(this.end , this) , 500);
        //this.scheduleOnce(this.end, 0.5);
    }

    end() {
        this.node.active = false;
    }

    beforeExistAni() {
        SysMgr.instance.clearTimer(Handler.create(this.end , this));
        SysMgr.instance.clearTimer(Handler.create(this.stopRainAni , this));
        this.playRainAni();
    }

    onPause() {
        this.rain.pause();
        this.propScaleAni.pause();
        let scheduler = cc.director.getScheduler();
        scheduler.pauseTarget(this);
        //该方法为插件扩展方法
        this.leafParticle.pause();
        this.rainParticle.pause();
    }

    onResume() {
        this.rain.resume();
        this.propScaleAni.resume();
        let scheduler = cc.director.getScheduler();
        scheduler.resumeTarget(this);
        //该方法为插件扩展方法
        this.leafParticle.resume();
        this.rainParticle.resume();
    }

}
