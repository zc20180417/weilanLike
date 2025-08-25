import { BaseAction } from "./BaseAction";
import { EActionName } from "../comps/animation/AnimationComp";

export class MonsterIdleAction extends BaseAction {

    start() {
        this.owner.animationComp.playAction(EActionName.IDLE , true);
    }

}