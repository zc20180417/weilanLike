
import BindSoComp from "./BindSoComp";
import { NodeUtils } from "../../../utils/ui/NodeUtils";
import Game from "../../../Game";
import FrameEffect from "../../../utils/effect/FrameEffect";


const {ccclass, property , menu} = cc._decorator;

@ccclass
@menu("Game/comp/FjLineComp")

export default class FjLineComp extends BindSoComp {

    @property(cc.Node)
    scaleNode:cc.Node = null;

    @property(FrameEffect)
    frameEffect:FrameEffect = null;

    onLoad() {

    }

    onAdd() {
        this.scaleNode.stopAllActions();
        this.scaleNode.scaleX = 1;
        this.scaleNode.height = 0;
        NodeUtils.to(this.scaleNode , 0.1 , {height:1000} ,"sineOut", this.onTweenEnd , null , this);
        
        this.frameEffect.play();
    }

    onRemove() {
        this.scaleNode.stopAllActions();
    }

    private onEnd() {
        Game.soMgr.removeEffect(this.owner);
    }

    private onTweenEnd() {
        NodeUtils.to(this.scaleNode , 0.4 , {scaleX:0} , "sineOut" , this.onEnd ,null, this);
    }


}