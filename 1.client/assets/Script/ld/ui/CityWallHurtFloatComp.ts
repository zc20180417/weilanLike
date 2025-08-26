import { Handler } from "../../utils/Handler";
import { MathUtils } from "../../utils/MathUtils";



const { ccclass, property, menu } = cc._decorator;


@ccclass
@menu("Game/LD/CityWallHurtFloatComp")
export class CityWallHurtFloatComp extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property(cc.Color)
    normalColor:cc.Color = null;

    @property(cc.Color)
    greenColor:cc.Color = null;

    @property
    offsetY:number = 0;

    @property
    scaleUpTime: number = 0.15;




    play(value: number, endFunc: Handler) {
        this.label.string = (value >= 0 ? '+' + value : '-' + -value);
        this.node.active = true;
        this.node.opacity = 255;
        // this.node.setScale(this.scaleInit);

        this.label.node.color = value > 0 ? this.greenColor : this.normalColor;

        const y = this.node.y + this.offsetY;
        let self = this;
        cc.tween(this.node).to(this.scaleUpTime , { y:y  }, { easing: 'sineIn' }).
                         call(() => {
                            endFunc.executeWith(self);
                        }).start();

    }



}