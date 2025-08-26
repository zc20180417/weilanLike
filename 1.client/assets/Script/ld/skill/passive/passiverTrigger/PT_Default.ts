import { PassiveTriggerBase } from "./PassiveTriggerBase";

/**
 * 开始就触发
 */
export class PassiveTriggerDefault extends PassiveTriggerBase {

    private _flag:boolean = false;
    onAdd() {
        if (!this._flag) this.onTrigger();
        this._flag = true;
    }

    onRemove(): void {
        // this.onTriggerStop();
    }

}