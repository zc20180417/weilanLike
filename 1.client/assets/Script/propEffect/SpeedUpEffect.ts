// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import SysMgr from "../common/SysMgr";
import Game from "../Game";
import { Handler } from "../utils/Handler";
import PropEffectBase from "./PropEffectBase";
import PropScaleAnimation from "./PropScaleAnimation";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SpeedUpEffect extends PropEffectBase {
    @property(cc.Node)
    bgNode: cc.Node = null;

    @property(PropScaleAnimation)
    propScaleAni: PropScaleAnimation = null;

    @property(cc.ParticleSystem)
    fire: cc.ParticleSystem = null;

    play() {
        this.bgNode.width = cc.winSize.width;
        let worldPos = this.startNode ? this.startNode.parent.convertToWorldSpaceAR(this.startNode.position) : cc.Vec3.ZERO;
        let pos = this.node.convertToNodeSpaceAR(worldPos);
        this.propScaleAni.setEffectBase(this);
        this.propScaleAni.play(pos);
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

    end() {
        this.node.active = false;
    }

    stopFireParticle() {
        this.fire.stopSystem();
        SysMgr.instance.doOnce(Handler.create(this.end , this) , 1000);
        //this.scheduleOnce(this.end, 1);
    }

    beforeExistAni() {
        this.fire.resetSystem();
        this.playSound();
        SysMgr.instance.clearTimer(Handler.create(this.end , this));
        SysMgr.instance.clearTimer(Handler.create(this.stopFireParticle , this));
        SysMgr.instance.doOnce(Handler.create(this.stopFireParticle , this) , 10000);
        //this.scheduleOnce(this.stopFireParticle, 10);
    }

    onPause() {
        this.propScaleAni.pause();
        cc.director.getScheduler().pauseTarget(this);
        this.fire.pause();
    }

    onResume() {
        this.propScaleAni.resume();
        cc.director.getScheduler().resumeTarget(this);
        this.fire.resume();
    }

}
