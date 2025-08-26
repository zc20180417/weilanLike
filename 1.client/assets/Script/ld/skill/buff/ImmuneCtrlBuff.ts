
import BuffBase from "./BuffBase";

/**
 * 免疫控制
 */
export class ImmuneCtrlBuff extends BuffBase {

    onBuffEffect() {
        console.log('控制免疫buff生效');
    }

    onBuffRemove() {
        console.log('控制免疫buff移除');
        super.onBuffRemove();
    }



}