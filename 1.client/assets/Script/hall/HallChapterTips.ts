
import { Handler } from "../utils/Handler";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("Game/Hall/HallChapterTips")
export class HallChapterTips extends cc.Component {

    @property(cc.Node)
    maskNode: cc.Node = null;

    @property(cc.Node)
    bookEffectNode: cc.Node = null;

    // private _startParent: cc.Node = null;
    // private _startNode: cc.Node = null;
    private _initY: number = 0;

    showTip(endHandler: Handler) {
        this.node.active = true;

        this.maskNode.active = true;
        this.node.opacity = 0;
        if (this._initY == 0) {
            this._initY = this.node.y;
        }
        let tween = cc.tween(this.node)
            .to(0.5, { y: this._initY + 15 }, { easing: "sineOut" })
            .delay(0.1)
            .to(0.5, { y: this._initY }, { easing: "sineIn" });
        cc.tween(this.node)
            .to(0.3, { opacity: 255 })
            .repeat(5, tween)
            .to(0.3, { opacity: 0 })
            .call(() => {
                this.node.active = false;
                this.maskNode.active = false;
                endHandler.execute();
                // if (this._startNode && this._startNode.isValid) {
                //     let worldPos = this._startNode.convertToWorldSpaceAR(cc.Vec2.ZERO);
                //     let localPos = this._startParent.convertToNodeSpaceAR(worldPos);
                //     this._startNode.removeFromParent();
                //     this._startParent.addChild(this._startNode);
                //     this._startNode.setPosition(localPos);
                // }
            }).
            start();
    }

    // private onTouch() {

    // }

}