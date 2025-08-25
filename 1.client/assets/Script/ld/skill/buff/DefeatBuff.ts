import { ECamp } from "../../../common/AllEnum";
import { EActType } from "../../../logic/actMach/ActMach";
import BuffBase from "./BuffBase";

/**
 * 击败BUFF 效果
 */
export class DefeatBuff extends BuffBase {

    onBuffEffect() {
        // console.log('击退效果生效');

        const dy = this.receiver.camp == ECamp.RED ? -1 : 1;
        this.receiver.changeTo(EActType.DEFEAT , { time:this.getBuffTime() , dis:this._config.buffValue * dy });
    }

    onBuffRemove() {
        // console.log('击退效果移除');
        super.onBuffRemove();
    }


}