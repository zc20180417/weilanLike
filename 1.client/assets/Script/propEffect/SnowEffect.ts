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
export default class SnowEffect extends PropEffectBase {
    @property(cc.Node)
    iceNode: cc.Node = null;

    @property(cc.Node)
    leftTopIce: cc.Node = null;

    @property(cc.Node)
    leftBottomIce: cc.Node = null;

    @property(cc.Node)
    rightTopIce: cc.Node = null;

    @property(cc.Node)
    rightBottomIce: cc.Node = null;

    @property(cc.Node)
    snowNode: cc.Node = null;

    @property(cc.ParticleSystem)
    snowBackParticle: cc.ParticleSystem = null;
    @property(cc.ParticleSystem)
    snowMidParticle: cc.ParticleSystem = null;
    @property(cc.ParticleSystem)
    snowFrontParticle: cc.ParticleSystem = null;

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
        // SysMgr.instance.pause = true;

    }

    iconAniEnd() {
        // this.node.active = false;
        // Game.soMgr.createEffect("addheart", GlobalVal.catPos.x, GlobalVal.catPos.y, false);
        //cc.log('---------onMagicSkillRelease-- false' , this.skillId);
        SysMgr.instance.pauseGame('magicSkill_' + this.skillId , false);
        let cfg = Game.skillMgr.getMagicSkill(this.skillId);
        SysMgr.instance.doOnce(Handler.create(this.releaseSkill , this) , cfg.delay);
        //this.scheduleOnce(this.releaseSkill, cfg.delay*0.001);
        // this.scheduleOnce(this.playRainAni, 1);
    }

    end() {
        this.iceNode.active = false;
        this.snowNode.active = false;
        this.node.active = false;
    }

    beforeExistAni() {
        this.playSound();
        //冰块动画
        this.iceNode.active = true;
        this.iceNode.stopAllActions();
        let width = cc.winSize.width, height = cc.winSize.height;
        this.leftTopIce.setContentSize(cc.size(width * 0.5, height * 0.5));
        this.leftTopIce.setPosition(cc.v2(-width * 0.5, 0));

        this.leftBottomIce.setContentSize(cc.size(width * 0.5, height * 0.5));
        this.leftBottomIce.setPosition(cc.v2(-width * 0.5, -height * 0.5));

        this.rightTopIce.setContentSize(cc.size(width * 0.5, height * 0.5));
        this.rightTopIce.setPosition(cc.Vec2.ZERO);

        this.rightBottomIce.setContentSize(cc.size(width * 0.5, height * 0.5));
        this.rightBottomIce.setPosition(cc.v2(0, -height * 0.5));

        this.iceNode.opacity = 0;
        cc.tween(this.iceNode)
            .to(1, { opacity: 200 }, { easing: "cubicOut" })
            .start();

        //雪花动画
        this.snowNode.active = true;
        this.snowBackParticle.resetSystem();
        this.snowMidParticle.resetSystem();
        this.snowFrontParticle.resetSystem();

        SysMgr.instance.doOnce(Handler.create(this.stopSnowAni , this) , 4500);
        //this.scheduleOnce(this.stopSnowAni, 4.5);
    }

    stopSnowAni() {
        this.snowBackParticle.stopSystem();
        this.snowMidParticle.stopSystem();
        this.snowFrontParticle.stopSystem();
        cc.tween(this.iceNode)
            .to(1, { opacity: 0 }, { easing: "cubicIn" })
            .call(this.end, this)
            .start();
    }

    onPause(){
        cc.director.getActionManager().pauseTarget(this.iceNode);
        cc.director.getScheduler().pauseTarget(this);
        this.propScaleAni.pause();
        this.snowBackParticle.pause();
        this.snowMidParticle.pause();
        this.snowFrontParticle.pause();
    }

    onResume(){
        cc.director.getActionManager().resumeTarget(this.iceNode);
        cc.director.getScheduler().resumeTarget(this);
        this.propScaleAni.resume();
        this.snowBackParticle.resume();
        this.snowMidParticle.resume();
        this.snowFrontParticle.resume();
    }

}
