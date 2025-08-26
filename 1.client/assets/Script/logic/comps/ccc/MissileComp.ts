import { MathUtils } from "../../../utils/MathUtils";
import BindSoComp from "./BindSoComp";
import Game from "../../../Game";
import GlobalVal from "../../../GlobalVal";
import { EComponentType } from "../AllComp";

/**导弹移动 */
const {ccclass,property, menu} = cc._decorator;
@ccclass
@menu("Game/comp/MissileComp")
export default class MissileComp extends BindSoComp {

    @property(cc.Node)
    fireNode:cc.Node = null;

    private _angle:number = 0;
    private _nodeAngle:number = 0;

    onAdd() {
        this._nodeAngle = this._angle = this.node.angle = 0;
    }

    onRemove() {

    }

    update() {
        /*
        this._angle += 5;
        this._angle = this._angle % 360;
        if (this._angle >= 90 && this._angle <= 270) {
            if (this._nodeAngle > -15) {
                this._nodeAngle -= 1;
            }
        } else {
            if (this._nodeAngle < 15) {
                this._nodeAngle += 1;
            }
        }
        if (this._angle % 40 == 0 ) {
            this.addEffect();
        }
        this.fireNode.angle = this.node.angle = this._nodeAngle;
        
        this._angle += 5;
        if (this._angle % 80 == 0) {
            this.node.scaleY *= -1;
        }
        */
        this._angle += 5;
        if (this._angle % 40 == 0 ) {
            this.addEffect();
        }
    
    }


    private addEffect() {
        GlobalVal.tempVec2.x = 40;
        GlobalVal.tempVec2.y = 0;
        let globalPos:cc.Vec2 = this.fireNode.convertToWorldSpaceAR(GlobalVal.tempVec2);
        GlobalVal.tempVec2 = this.owner.renderNode.parent.convertToNodeSpaceAR(globalPos);
        let effect = Game.soMgr.createEffect("smoke_white_ani_s" , GlobalVal.tempVec2.x , GlobalVal.tempVec2.y , false);
        effect.scale = MathUtils.randomFloat(0.8 , 1.5);
    }
}