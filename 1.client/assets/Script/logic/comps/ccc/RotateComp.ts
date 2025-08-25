import SysMgr from "../../../common/SysMgr";

const {ccclass, property , menu} = cc._decorator;

@ccclass
@menu("Game/comp/RotateComp")

export default class RotateComp extends cc.Component {

    @property(cc.Integer)
    delta:number = 0;

    update() {
        this.node.angle += (this.delta * SysMgr.instance.speed);
    }
}