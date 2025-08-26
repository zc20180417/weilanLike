// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Utils from "../utils/Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ScrollBg extends cc.Component {
    @property(cc.Node)
    bgs: cc.Node[] = [];

    @property
    speedX: number = 1600;

    protected rearIndex: number = 0;

    onLoad() {
        this.rearIndex = this.bgs.length - 1;
    }

    update(dt) {
        let offsetX = dt * this.speedX;

        this.bgs.forEach(el => {
            el.x += offsetX;
        });

        if (Utils.isOutOfScreen(this.bgs[this.rearIndex])) {
            this.bgs[this.rearIndex].x = this.bgs[0].x - this.bgs[0].width;
            this.rearIndex = this.rearIndex - 1 < 0 ? this.bgs.length - 1 : this.rearIndex - 1;
        }
    }

}
