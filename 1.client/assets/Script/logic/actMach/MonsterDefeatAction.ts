import { BaseAction } from "./BaseAction";
import SysMgr from "../../common/SysMgr";
import { Handler } from "../../utils/Handler";
import GlobalVal from "../../GlobalVal";
import { MathUtils } from "../../utils/MathUtils";
import { EActionName } from "../comps/animation/AnimationComp";
import { EActType } from "./ActMach";

export class MonsterDefeatAction extends BaseAction {

    private _timerHandler: Handler;
    private _dis: number = 0;
    // private _endTime: number = 0;
    private _endY: number = 0;
    private _startY:number = 0;
    private _startTime:number = 0;
    private _totalTime:number = 0;

    init() {
        this._timerHandler = new Handler(this.onFrame, this);
        
    }

    start(data:{time:number , dis:number}) {
        this._startTime = GlobalVal.now;
        this._totalTime = data.time;
        this._startY = this.owner.y;
        this._dis = data.dis;
        this._endY = this._startY + this._dis;
        SysMgr.instance.doFrameLoop(this._timerHandler, 1 ,0);
        this.owner.animationComp.playAction(EActionName.HIT , false);
    }

    end() {
        this.clearTimer();
        super.end();
    }

    cancel() {

        this.clearTimer();
    }

    dispose() {

        this.clearTimer();
        Handler.dispose(this);
    }

    private onFrame() {
        if (GlobalVal.now >= this._startTime + this._totalTime) {
            this.owner.y = this._endY;
            this.end();
            return;
        }
        this.owner.y = this._startY + MathUtils.quadOut((GlobalVal.now - this._startTime) / this._totalTime) * this._dis;
    }

    canChangeTo(actID: EActType): boolean {
        return actID == EActType.DEFEAT || actID == EActType.DIE;
    }

    private clearTimer() {
        SysMgr.instance.clearTimer(this._timerHandler);
    }


}