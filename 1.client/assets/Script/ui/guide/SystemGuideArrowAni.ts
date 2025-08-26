import { NodeUtils } from "../../utils/ui/NodeUtils";

const { ccclass, property, menu } = cc._decorator;

/**
 * 系统指引
 */
@ccclass
@menu("Game/guide/SystemGuideArrowAni")
export class SystemGuideArrowAni extends cc.Component {


    start() {

        
        this.test1();


    }

    private test1() {
        NodeUtils.to(this.node , 0.5 , {x : -30 , y:-30} , "" , this.test2 ,null, this);
    }

    private test2() {
        NodeUtils.to(this.node , 0.5 , {x : 0 , y:0} , "" , this.test1 ,null, this);
    }

}