// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GlobalVal from "../GlobalVal";
import PropEffectBase from "./PropEffectBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PropScaleAnimation extends cc.Component {
    private propEffectBase: PropEffectBase = null;
    private scaleOrFly: boolean = null;

    setEffectBase(effect: PropEffectBase) {
        this.propEffectBase = effect;
    }

    play(pos: cc.Vec3, scaleOrFly: boolean = true) {
        //cc.log('-------------play');
        this.scaleOrFly = scaleOrFly;
        this.node.scale = 0.2;
        this.node.position = pos;
        this.node.opacity = 255;
        this.node.stopAllActions();
        cc.tween(this.node).to(0.5, { scale: 1, eulerAngles: cc.v3(0, 360, 0), position: cc.Vec2.ZERO_R }, { easing: "cubicOut" }).call(this.playExpandAni, this).start();
    }

    playExpandAni() {
        //cc.log('-------------playExpandAni');
        this.node.stopAllActions();
        cc.tween(this.node)
            .by(0.05, { position: cc.v2(-5, -5) })
            .by(0.05, { position: cc.v2(5, -5) })
            .by(0.05, { position: cc.v2(5, 5) })
            .by(0.05, { position: cc.v2(-5, 5) })

            .by(0.05, { position: cc.v2(-5, 5) })
            .by(0.05, { position: cc.v2(5, 5) })
            .by(0.05, { position: cc.v2(5, -5) })
            .by(0.05, { position: cc.v2(-5, -5) })
            .call(this.playExistAni, this).start();
    }

    playExistAni() {
        //cc.log('-------------playExistAni');
        this.scaleOrFly ? this.playExistAniWithScale() : this.playExistAniWithFly();
    }

    playExistAniWithScale() {
        //cc.log('-------------playExistAniWithScale');
        this.beforeExistAni();
        cc.tween(this.node)
            .to(0.5, { scale: 4, opacity: 0 }, { easing: "cubicOut" })
            .call(this.end, this)
            .start();
    }

    playExistAniWithFly() {
        if (!GlobalVal.heartPos)  {
            GlobalVal.heartPos = cc.Vec2.ZERO;
        }
        let endPos = this.node.parent.convertToNodeSpaceAR(GlobalVal.heartPos);
        this.beforeExistAni();
        cc.tween(this.node)
            .to(0.5, { scale: 0.1, position: endPos }, { easing: "cubicIn" })
            .call(this.end, this)
            .start();
    }

    beforeExistAni() {
        //cc.log('-------------beforeExistAni');
        this.propEffectBase.beforeExistAni();
    }

    end() {
        //cc.log('-------------end');
        this.node.opacity = 0;
        this.propEffectBase.iconAniEnd();
    }

    public pause() {
        cc.director.getActionManager().pauseTarget(this.node);
    }

    public resume() {
        cc.director.getActionManager().resumeTarget(this.node);
    }
}       
