// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ShaderHelper from "./ShaderHelper";


const { ccclass, property } = cc._decorator;

@ccclass
export default class WaveTransitionShader extends ShaderHelper {

    @property
    waveOffsetX: number = 0;

    onLoad() {
        super.onLoad();
        // this.mat.setProperty("waveOffsetX", this.waveOffsetX);
    }

    update(dt) {
        let worldPos = this.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
        worldPos.x += this.waveOffsetX;
        this.mat.setProperty("srcPos", worldPos);
    }
}
