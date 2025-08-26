
import BindSoComp from "./BindSoComp";
import { NodeUtils } from "../../../utils/ui/NodeUtils";
import Game from "../../../Game";
import SysMgr from "../../../common/SysMgr";
import { Handler } from "../../../utils/Handler";
import { MathUtils } from "../../../utils/MathUtils";

const {ccclass, property , menu} = cc._decorator;

@ccclass
@menu("Game/comp/FloatTypeComp")

export default class FloatTypeComp extends BindSoComp {

    private _scale:number;
    private _angle:number;

    onLoad() {
        
    }

    onAdd() {

        this._scale = MathUtils.randomFloat(0.7 , 1.2);
        this._angle = MathUtils.randomInt(-30 , 30);
        let x = MathUtils.randomInt(-10 , 10);
        let y = MathUtils.randomInt(-10 , 10);

        this.node.x += x;
        this.node.y += y;

        this.action_1();
        
    }

    onRemove() {
        this.node.stopAllActions();
        SysMgr.instance.clearTimerByTarget(this);
    }

    private onEnd() {
        Game.soMgr.removeAmmo(this.owner);
    }


    private action_1() {
        this.node.scale = this._scale * 0.8;
        NodeUtils.scaleTo(this.node,0.1,this._scale,this.onTweenEnd_1 ,this,"elasticOut");
    }

    private onTweenEnd_1() {
        if (Math.random() > 0.3) {
            SysMgr.instance.doOnce(Handler.create(this.onTimerEnd_1 , this) , 150);
        } else {
            SysMgr.instance.doOnce(Handler.create(this.onEnd , this) , 250);
        }

    }

    private onTimerEnd_1() {
        NodeUtils.scaleTo(this.node,0.1,this._scale * 0.8,this.onEnd ,this);
    }

}