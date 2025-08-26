import { BaseAction } from "./BaseAction";
import { EComponentType } from "../comps/AllComp";
import { Handler } from "../../utils/Handler";
import { EActionName } from "../comps/animation/AnimationComp";
import LDWalkComp from "../../ld/monster/LDWalkComp";
import { EventEnum } from "../../common/EventEnum";
import { CreatureState } from "../../common/AllEnum";


export class MoveAction extends BaseAction {

    private _walkComp:LDWalkComp;
    private _moveEndHandler:Handler;
    private _moveEndParam:any;

    init() {
        this._walkComp = this.owner.getAddComponent(EComponentType.LD_WALK) as LDWalkComp;
        this._walkComp.setHandler(new Handler(this.onMoveEnd , this));
    }

    start(param:any) {
        if (!param) return;
        if (!this._walkComp) {
            cc.log('error moveTo , not walkComp');
            return;
        }

        //this._param = param;
        this.owner.animationComp.playAction(EActionName.MOVE,true);
        this._moveEndHandler = param.endHandler;
        this._moveEndParam = param.endParam;
        if (param.path) {
            this._walkComp.moveTo(param.path);
        } 
        this.owner.on(EventEnum.CREATURE_STATE_CHANGE , this.onStateChange , this);
    }

    end(): void {
        this.owner.off(EventEnum.CREATURE_STATE_CHANGE , this.onStateChange , this);
        super.end();
    }

    private onStateChange() {
        if (!this.owner.inState(CreatureState.DONT_MOVE)) {
            this.owner.animationComp.playAction(EActionName.MOVE,true);
        }
    }

    cancel() {
        if (this._walkComp) {
            this._walkComp.stopMove();
        }
    }

    dispose() {
        this._walkComp = null;
        this._moveEndHandler = null;
        this._moveEndParam = null;
    }

    private onMoveEnd(isSuccess:boolean) {
        if (isSuccess) {
            this.end();
        }

        let endFunc = this._moveEndHandler;
        let endParam = this._moveEndParam;
        this._moveEndHandler = null;
        this._moveEndParam = null;

        if (endFunc != null ) {
            endFunc.executeWith(isSuccess, endParam);
        }
    }
}