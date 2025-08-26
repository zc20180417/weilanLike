// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { NodeUtils } from "../utils/ui/NodeUtils";
import TransitionBase from "./TransitionBase";

const { ccclass, property , menu } = cc._decorator;

@ccclass
@menu('Game/LD/TransitionNormal')
export default class TransitionNormal extends TransitionBase {
   
    @property(cc.Node)
    maskNode:cc.Node = null;



    start() {

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
        this.maskNode.width = this.maskNode.height = 4500;
        NodeUtils.to(this.maskNode, 0.5, { width: 100, height: 100 },  "quadOut"  ,()=> {
            this.scheduleOnce(()=>{
                this.onMid();
                this.onHideHalf();
            },0.1);
        } , null , this , 0 , true);

    }

    playShowTransitionAni() {
        NodeUtils.to(this.maskNode, 1.0, { width: 4500, height: 4500 },  "quadOut"  ,()=> {
            this.onShowHalf();
            this.scheduleOnce(()=>{
                this.onEnd();
            },0.5);
        } , null , this , 0 , true);
    }

}
