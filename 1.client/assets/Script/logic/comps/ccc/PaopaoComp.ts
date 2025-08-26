
import { Rect } from "../../../utils/MathUtils";
import SceneObject from "../../sceneObjs/SceneObject";
import EffectEditPro from "./EffectEditPro";

const {ccclass , menu} = cc._decorator;

@ccclass
@menu("Game/comp/PaopaoComp")

export default class PaopaoComp extends EffectEditPro {


    start() {
        this.fadeIn();

    }

    private fadeIn() {
        let self = this;
        cc.tween(this.node).to(0.3,{scale:0.95}).call(function() {
            self.fadeOut();
        }).start();
    }

    private fadeOut() {
        let self = this;
        cc.tween(this.node).to(0.3,{scale:1}).call(function() {
            self.fadeIn();
        }).start();
    }

    setTarget(target:SceneObject) {
        let rect:Rect = target.rect;
        this.node.width = rect.width;
        this.node.height = rect.height;
    }

    onDestroy() {

    }
}