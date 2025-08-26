
import SysMgr from "../../../../common/SysMgr";
import { Handler } from "../../../../utils/Handler";
import { PassiveTriggerBase } from "./PassiveTriggerBase";

/**
 * CD 到了就触发
 */
export class PT_Cd extends PassiveTriggerBase {

    onAdd() {
        SysMgr.instance.doLoop(Handler.create(this.onTimer , this) , this.cfg.cd , 0);
    }


    onRemove(): void {
        SysMgr.instance.clearTimer(Handler.create(this.onTimer , this));
    }

    private onTimer() {
        //cd到了
        this.onTrigger();
    }

    protected checkCd() {
        this.inCd = false;
    }

}