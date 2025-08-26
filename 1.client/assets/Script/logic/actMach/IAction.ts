import { EActType } from "./ActMach";

/**回收接口 */
export interface IAction {
    start(param:any);
    end();
    init();
    cancel();
    canChangeTo(actID:EActType):boolean;
}