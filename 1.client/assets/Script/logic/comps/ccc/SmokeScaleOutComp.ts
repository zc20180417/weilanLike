
import BindSoComp from "./BindSoComp";
import SysMgr from "../../../common/SysMgr";
import { Handler } from "../../../utils/Handler";
import { MathUtils } from "../../../utils/MathUtils";


const {ccclass, property , menu} = cc._decorator;

@ccclass
@menu("Game/comp/SmokeScaleOutComp")

export default class SmokeScaleOutComp extends BindSoComp {

    private _scale:number = 0;
    private _handler:Handler;
    private _isRun:boolean = false;
    onLoad() {
        this._handler = new Handler(this.doScale , this);
    }

    onAdd() {
        this._scale = this.node.scale;
        this._isRun = false;
        SysMgr.instance.doOnce(this._handler , MathUtils.randomInt(0 , 200));
    }

    onRemove() {
        SysMgr.instance.clearTimer(this._handler);
        this._isRun = false;
    }

    private doScale() {
        this._isRun = true;
    }

    update() {
        if (this._isRun && this.node.scale > 0) {
            this.node.scale -= 0.02;
        }
    }


}