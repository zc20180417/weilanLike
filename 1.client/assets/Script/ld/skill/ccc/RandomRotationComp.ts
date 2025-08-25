import { MathUtils } from "../../../utils/MathUtils";


const {ccclass, property , menu} = cc._decorator;
@ccclass
@menu("Game/comp/RandomRotationComp")
export class RandomRotationComp extends cc.Component {

    @property
    randomOffsetX:number = 0;

    @property
    randomOffsetY:number = 0;

    @property(cc.Node)
    showNode:cc.Node = null;


    protected onEnable(): void {
        this.showNode.angle = Math.random() * 360;
        this.showNode.x =  MathUtils.randomIntReal(-this.randomOffsetX , this.randomOffsetX);
        this.showNode.y =  MathUtils.randomIntReal(-this.randomOffsetY , this.randomOffsetY);
    }

}