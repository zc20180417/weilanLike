import { RecyclableObj } from "./RecyclableObj";
import { ERecyclableType } from "./ERecyclableType";

export class TestObj extends RecyclableObj {
    
    constructor() {
        super();
        cc.log("create----------");
    }

    key:ERecyclableType = ERecyclableType.TESTOBJ;

    resetData() {
        cc.log("resetData------------");
    }

    giveUp() {
        cc.log("giveUp------------");
    }

    /**回收使用 */
    onRecycleUse() {
        cc.log("onRecycleUse------------");
    }
}