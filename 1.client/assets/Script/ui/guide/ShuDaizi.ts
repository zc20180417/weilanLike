const { ccclass, property ,menu} = cc._decorator;
@ccclass
@menu("Game/guide/ShuDaizi")
export class ShuDaizi extends cc.Component {
 
    @property(dragonBones.ArmatureDisplay)
    dragon: dragonBones.ArmatureDisplay = null;

    start() {
        this.dragon.on(dragonBones.EventObject.COMPLETE, this.dragonEventHandler, this);
        this.dragon.on(dragonBones.EventObject.LOOP_COMPLETE, this.dragonEventHandler, this);
        this.resetSchedule();
    }

    private dragonEventHandler(event: any) {
        let animationState = event.animationState;
        if ("idle2" == animationState.name) {
            this.resetSchedule();
            this.dragon.playAnimation("idle", 0);
        }
    }

    resetSchedule() {
        this.scheduleOnce(this.scheduleCallback, 3);
    }

    scheduleCallback() {
        this.dragon.playAnimation("idle2", 1);
    }


}