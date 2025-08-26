

import BuffBase from "./BuffBase"

/**
 * 灼烧
 */
export class BurnBuff extends BuffBase {

    onBuffEffect() {
        console.log('灼烧buff生效');
    }

    onBuffRemove() {
        console.log('灼烧buff移除');
        super.onBuffRemove();
    }



}