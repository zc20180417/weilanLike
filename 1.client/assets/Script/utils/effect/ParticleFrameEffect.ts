// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import FrameEffect from "./FrameEffect";

const { ccclass, property ,menu} = cc._decorator;

@ccclass
@menu("effect/ParticleFrameEffect")
export default class ParticleFrameEffect extends FrameEffect {

    @property(cc.ParticleSystem)
    particle: cc.ParticleSystem = null;

    private _playFrameCount = 0;
    private _showState: number = -1;
    onLoad() {

    }

    play() {
        this.node.setScale(0.7);
        this.particle.resetSystem();
        this._showState = 1;
        this._playFrameCount = 0;
    }

    stop() {
        this._showState = -1;
    }

    update(dt: number) {
        if (this._showState == -1) return;
        if (this._showState == 1) {
            this._playFrameCount++;
            if (this._playFrameCount > 2) {
                // this.node.opacity = 255;
                this._showState = 2;
            }
        }
        if (this.particle.stopped) {
            // this.node.opacity = 0;
            //cc.log("粒子结束")
            if (this._playEndHandler != null) {
                this._playEndHandler.execute();
            }
        }
    }
}
