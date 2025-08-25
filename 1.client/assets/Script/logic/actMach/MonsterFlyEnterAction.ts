import { BaseAction } from "./BaseAction";
import SysMgr from "../../common/SysMgr";
import { Handler } from "../../utils/Handler";
import GlobalVal from "../../GlobalVal";
import { MathUtils } from "../../utils/MathUtils";
import { EActionName } from "../comps/animation/AnimationComp";
import { EActType } from "./ActMach";
import { CreatureState } from "../../common/AllEnum";
import Game from "../../Game";

export class MonsterFlyEnterAction extends BaseAction {

    private _timerHandler: Handler;
    private _startPos: cc.Vec2;
    private _endPos: cc.Vec2;
    private _startTime:number = 0;
    private _totalTime:number = 0;
    private _jumpZ:number = 200;

    init() {
        this._timerHandler = new Handler(this.onFrame, this);
        
    }

    start(data:{time:number , tox:number , toy:number}) {
        this._startTime = GlobalVal.now;
        this._totalTime = data.time;
        this._startPos = cc.v2(this.owner.x, this.owner.y);
        this._endPos = cc.v2(data.tox, data.toy);

        SysMgr.instance.doFrameLoop(this._timerHandler, 1 ,0);
        this.owner.modifyState(CreatureState.INVINCIBLE , true);
        this.owner.animationComp.playAction(EActionName.HIT , true);
    }

    end() {
        this.owner.addTo(Game.soMgr.getMonsterContainer());

        this.owner.modifyState(CreatureState.INVINCIBLE , false);
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
            this.owner.x = this._endPos.x;
            this.owner.y = this._endPos.y;
            this.end();
            return;
        }
        const t = (GlobalVal.now - this._startTime) / this._totalTime;
        const easedT = MathUtils.sineInOut(t);

        // Linear interpolation for the x and y coordinates
        const newPos = this._startPos.lerp(this._endPos, easedT);

        // Add a sine-based arc for the jump effect
        newPos.y += Math.sin(t * Math.PI) * this._jumpZ;

        this.owner.x = newPos.x;
        this.owner.y = newPos.y;
    }

    canChangeTo(actID: EActType): boolean {
        return false;
    }

    private clearTimer() {
        SysMgr.instance.clearTimer(this._timerHandler);
    }


}