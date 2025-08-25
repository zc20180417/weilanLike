import { BaseAction } from "./BaseAction";
import { EActionName } from "../comps/animation/AnimationComp";
import SysMgr from "../../common/SysMgr";
import { Handler } from "../../utils/Handler";
export class MonsterOnHitAction extends BaseAction {

    private _timerHandler: Handler;
    private _time: number;

    init() {
        this._timerHandler = new Handler(this.end, this);
        
    }

    start(time: number) {
        this._time = time;
        this.owner.animationComp.playAction(EActionName.HIT, false);
        this.clearTimer();
        SysMgr.instance.doOnce(this._timerHandler, this._time);
    }

    end() {
        super.end();
        this.clearTimer();
    }

    cancel() {
        this.clearTimer();
    }

    dispose() {
        this.clearTimer();
        Handler.dispose(this);
    }

    private clearTimer() {
        SysMgr.instance.clearTimer(this._timerHandler);
    }
}