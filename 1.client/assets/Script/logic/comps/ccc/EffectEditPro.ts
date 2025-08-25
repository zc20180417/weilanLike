import { BindPointAnchorY } from "../../../common/AllEnum";
import SceneObject from "../../sceneObjs/SceneObject";

const {ccclass, property , menu} = cc._decorator;
@ccclass
@menu("Game/comp/EffectEditPro")
export default class EffectEditPro extends cc.Component {

    @property({
        type:cc.Enum(BindPointAnchorY),
        tooltip:"对齐方式，添加在目标身上的位置"
    })
    anchorY:BindPointAnchorY = 0;

    setTarget(target:SceneObject) {
        
    }

}