import { IAction } from "./IAction";
import { ActMach, EActType } from "./ActMach";
import Creature from "../sceneObjs/Creature";


//状态基类
export class BaseAction implements IAction {

    public machine:ActMach;
    public owner:Creature;
    public notBreakAct:boolean;
    public actID:EActType;
    /**初始化 */
    init() {

    }
    /**开始 */
    start(param:any) {

    }
    /**结束 */
    end() {
        if (this.machine)
            this.machine.onActSelfEnd(this);
    }
    /**取消 */
    cancel() {

    }

    canChangeTo(actID:EActType):boolean {
        return true;
    }

    dispose() {
        
    }
}