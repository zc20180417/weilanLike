
import { CreatureState } from "../../../../common/AllEnum";
import SysMgr from "../../../../common/SysMgr";
import Game from "../../../../Game";
import { EActType } from "../../../../logic/actMach/ActMach";
import { Monster } from "../../../../logic/sceneObjs/Monster";
import { Handler } from "../../../../utils/Handler";
import { PassiveSkillBase } from "../PassiveSkillBase";

export class PS_DeathRecovery extends PassiveSkillBase {


    private _totalTime:number = 0;
    //每毫秒恢复的血量
    private _recoverValue:number = 0;

    onTrigger(param?:any) {
        this.owner.modifyState(CreatureState.DEATH_RECOVER , true);
        this._totalTime = this.cfg.paramValue2[0];
        this._recoverValue = this.cfg.paramValue1[0] / this._totalTime;
        this.owner.changeTo(EActType.DEATH_RECOVER , {time:this._totalTime});

        SysMgr.instance.doOnce(Handler.create(this.onRecoverEnd , this) , this._totalTime);
        SysMgr.instance.doLoop(Handler.create(this.onRecover , this) , 500);
    }

    private onRecover() {
        this.owner.modifyState(CreatureState.DEATH_RECOVER , false);
        Game.ldSkillMgr.addHp(this.owner as Monster , this._recoverValue * 500);
    }


    onRemove(): void {
        super.onRemove();
        this.owner.modifyState(CreatureState.DEATH_RECOVER , false);
        SysMgr.instance.clearTimerByTarget(this);
    }

    private onRecoverEnd() {
        SysMgr.instance.clearTimer(Handler.create(this.onRecover , this));
        this.owner.modifyState(CreatureState.DEATH_RECOVER , false);
    }


    
}