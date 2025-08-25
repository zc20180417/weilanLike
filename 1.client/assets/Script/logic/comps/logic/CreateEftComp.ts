import SysMgr from "../../../common/SysMgr";
import { Handler } from "../../../utils/Handler";
import { NodeUtils } from "../../../utils/ui/NodeUtils";

const {ccclass,menu,property} = cc._decorator;

@ccclass
@menu("Game/Logic/CreateEftComp")
export class CreateEftComp extends cc.Component {

    @property([cc.Node])
    nodes:cc.Node[] = [];

    private _countMax:number = 3;
    private _count:number = 0;

    show() {
        this.node.active = true;
        this._count = 0;
        this.startEft();
    }

    start() {
    }

    private startEft() {
        for (let i = 0 ; i < this.nodes.length ; i++) {
            this.nodes[i].active = false;
            SysMgr.instance.doOnce(new Handler(this.doEftStartIndex , this , i) , 150 * i);
        }
    }

    private doEftStartIndex(index:number) {
        let node = this.nodes[index];
        node.active = true;
        node.opacity = 255;
        NodeUtils.to(node , 0.33 , {opacity: 0} , "sineIn" , this.onEftEnd , index , this , 0.25 + (0.03 * index ));
    }

    private onEftEnd(index:number) {
        if (index == 2) {
            this._count ++;
            if (this._count < this._countMax) {
                SysMgr.instance.doOnce(new Handler(this.startEft , this) , 250);
            }
        }
    }

    update() {
        
    }

    onDestroy() {
        SysMgr.instance.clearTimerByTarget(this);
    }
    

}