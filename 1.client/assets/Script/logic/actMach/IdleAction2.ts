import { BaseAction } from "./BaseAction";
import { EActionName } from "../comps/animation/AnimationComp";
import { EventEnum } from "../../common/EventEnum";


/**
 * 休闲待机
 */
export class IdleAction2 extends BaseAction {

    init() {
        
    }

    start() {
        this.owner.on(EventEnum.ACTION_PLAY_END, this.onPlayEnd, this);
        this.doIdle2Action();
    }

    end() {
        this.owner.off(EventEnum.ACTION_PLAY_END, this.onPlayEnd, this);
        super.end();
    }

    cancel() {
        this.owner.off(EventEnum.ACTION_PLAY_END, this.onPlayEnd, this);
    }

    dispose() {
        this.owner.off(EventEnum.ACTION_PLAY_END, this.onPlayEnd, this);

    }

    private doIdle2Action() {
        // this.owner.animationComp.setAngle(GlobalVal.defaultAngle);
        this.owner.animationComp.playAction(EActionName.IDLE2, false);
    }

    private onPlayEnd(actName: string) {
        if (actName == EActionName.IDLE2) {
            this.end();
        }
    }
}