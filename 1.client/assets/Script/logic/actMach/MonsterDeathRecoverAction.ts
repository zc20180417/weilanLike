import { BaseAction } from "./BaseAction";
import { EActionName } from "../comps/animation/AnimationComp";
import SysMgr from "../../common/SysMgr";
import { Handler } from "../../utils/Handler";
import { EActType } from "./ActMach";
export class MonsterDeathRecoverAction extends BaseAction {
    
    start(param:any) {
        this.owner.animationComp.playAction(EActionName.IDLE , false , 1.0);
        SysMgr.instance.doOnce(Handler.create(this.onEndTime , this), param.time || 500);
    }

    canChangeTo(actID: EActType): boolean {
        return actID == EActType.DIE;
    }

    cancel(): void {
        SysMgr.instance.clearTimerByTarget(this);
        super.cancel();
    }

    onEndTime() {
        this.end();
    }
}