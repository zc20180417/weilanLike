import { EventEnum } from "../../common/EventEnum";
import SysMgr from "../../common/SysMgr";
import Game from "../../Game";
import { Handler } from "../../utils/Handler";
import { EActionName } from "../comps/animation/AnimationComp";
import { Monster } from "../sceneObjs/Monster";
import { EActType } from "./ActMach";
import { BaseAction } from "./BaseAction";

export class DieAction extends BaseAction {
    
    private _time:number;
    private _showDieEft:boolean;
    
    start(param:any) {
        this._time = param.time || 500;
        this._showDieEft = param.showDieEft || false;
        this.owner.animationComp.playAction(EActionName.DIED , false , 1.0);
        SysMgr.instance.doOnce(Handler.create(this.onDeadTime , this), this._time);
    }

    canChangeTo(actID: EActType): boolean {
        return false;
    }

    cancel(): void {
        SysMgr.instance.clearTimerByTarget(this);
        super.cancel();
    }

    onDeadTime() {
        this.owner.emit(EventEnum.CREATURE_DIE_CHECK);
        Game.soMgr.removeDeadMonster(this.owner as Monster , this._showDieEft);
    }
}