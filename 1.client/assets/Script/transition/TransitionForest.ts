// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import TransitionBase from "./TransitionBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TransitionForest extends TransitionBase {
    @property(cc.Node)
    topLeaf: cc.Node = null;
    @property(cc.Node)
    downLeaf: cc.Node = null;
    @property(cc.Node)
    leftLeaf: cc.Node = null;
    @property(cc.Node)
    rightLeaf: cc.Node = null;

    topLeafHeight: number = null;

    leftLeafWidth: number = null;


    start() {
        this.topLeafHeight = this.topLeaf.width * this.topLeaf.scaleX;
        this.leftLeafWidth = this.leftLeaf.width * this.leftLeaf.scaleX;
        this.topLeaf.y = cc.winSize.height / 2 + this.topLeafHeight;
        this.downLeaf.y = -cc.winSize.height / 2 - this.topLeafHeight;
        this.leftLeaf.x = -cc.winSize.width / 2 - this.leftLeafWidth;
        this.rightLeaf.x = cc.winSize.width / 2 + this.leftLeafWidth;

        this.onStart();

    }

    /**
     * 过渡动画开始
     */
    protected onStart() {
        this.playHideTransitionAni();
        super.onStart();
    }

    protected afterSceneLaunch() {
        this.playShowTransitionAni();
    }

    playHideTransitionAni() {
        let aniCom = this.node.getComponent(cc.Animation);
        aniCom.play("forestHide");
        cc.tween(this.topLeaf).by(1, { y: -this.topLeafHeight }, { easing: "quadOut" }).start();
        cc.tween(this.downLeaf).by(1, { y: this.topLeafHeight }, { easing: "quadOut" }).start();
        cc.tween(this.leftLeaf).by(1, { x: this.leftLeafWidth }, { easing: "quadOut" }).start();
        cc.tween(this.rightLeaf).by(1, { x: -this.leftLeafWidth }, { easing: "quadOut" }).start();

    }

    playShowTransitionAni() {
        let aniCom = this.node.getComponent(cc.Animation);
        aniCom.play("forestShow");
        cc.tween(this.topLeaf).by(1, { y: this.topLeafHeight }, { easing: "quadIn" }).start();
        cc.tween(this.downLeaf).by(1, { y: -this.topLeafHeight }, { easing: "quadIn" }).start();
        cc.tween(this.leftLeaf).by(1, { x: -this.leftLeafWidth }, { easing: "quadIn" }).start();
        cc.tween(this.rightLeaf).by(1, { x: this.leftLeafWidth }, { easing: "quadIn" }).start();
    }

}
