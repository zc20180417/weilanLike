
import { EventEnum } from "../../../common/EventEnum";
import SysMgr from "../../../common/SysMgr";
import GlobalVal from "../../../GlobalVal";
import { STATUS_TYPE } from "../../../net/socket/handler/MessageEnum";
import { Handler } from "../../../utils/Handler";
import { Monster } from "../../sceneObjs/Monster";
import { EComponentType } from "../AllComp";
import RunAwayComp from "../logic/RunAwayComp";
import BindSoComp from "./BindSoComp";

/**跳着走的怪 */
const {ccclass, property , menu} = cc._decorator;
@ccclass
@menu("Game/comp/JumpMoveComp")

export class JumpMoveComp extends BindSoComp {

    @property({
        tooltip:"跳跃间隔，毫秒"
    })
    jumpInterval:number = 3000;

    @property({
        tooltip:"跳跃次数"
    })
    jumpCountMax:number = 1;

    @property({
        tooltip:"跳跃单次时间"
    })
    jumpActionTime:number = 1000;

    @property({
        tooltip:"跳跃高度"
    })
    jumpHei:number = 100;

    private _jumpCount:number = 0;
    private _onStandEndTimer:Handler;
    private _onJumpEndTimer:Handler;
    private _runAwary:RunAwayComp;
    private _self:Monster;
    private _updateHandler:Handler;
    private _isJump:boolean = false;
    private _jumpTime:number = 0;
    private _offsetY:number = 0;
    
    constructor() {
        super();

        this._onStandEndTimer = new Handler(this.onStandEndTimer , this);
        this._onJumpEndTimer = new Handler(this.onJumpEndTimer , this);
        this._updateHandler = new Handler(this.updateJump , this);
    }

    onAdd() {
        this._self = this.owner as Monster;
        this._offsetY = this._self.offsetY;
        this._self.on(EventEnum.MONSTER_FLY , this.onFly , this);
        if (this._self.getComponent(EComponentType.MONSTER_FLY) == null) {
            this.onStandEndTimer();
        }
        this._self.setSistanceStatus(STATUS_TYPE.STATUS_FLOATING , true);
    }

    onRemove() {
        SysMgr.instance.clearTimer(this._onStandEndTimer);
        SysMgr.instance.clearTimer(this._onJumpEndTimer);
        SysMgr.instance.unRegisterUpdate(this._updateHandler);
        this._self.off(EventEnum.MONSTER_FLY , this.onFly , this);
        this._runAwary = null;
        this._jumpCount = 0;
    }

    onDestroy() {
        this._onStandEndTimer = null;
    }

    private onFly(fly:boolean) {
        if (!fly) {
            this.doStand();
        } else {
            this.stopJump();
        }
    }

    private stopJump() {
        if (!this._isJump) return;
        this._isJump = false;
        this._jumpCount = 0;
        let tx = this._self.y - this._self.offsetY;
        this._self.offsetY = this._offsetY;
        this._self.setPosNow(this._self.x, tx + this._self.offsetY); 
        SysMgr.instance.unRegisterUpdate(this._updateHandler );
        SysMgr.instance.clearTimer(this._onJumpEndTimer );
    }

    private onStandEndTimer() {
        this.initSelfRunAwary();
        if (this._runAwary) {
            this._runAwary.goon();
        }
        this._isJump = true;
        this._jumpTime = 0;
        SysMgr.instance.registerUpdate(this._updateHandler , 1);
        SysMgr.instance.doOnce(this._onJumpEndTimer , this.jumpActionTime);
    }


    private onJumpEndTimer() {
        this._jumpCount ++;
        if (this._jumpCount >= this.jumpCountMax) {
            this.doStand();
        }
    }

    private doStand() {
        this.stopJump();
        this.initSelfRunAwary();
        this._runAwary.stop();
        SysMgr.instance.doOnce(this._onStandEndTimer , this.jumpInterval);
    }

    private initSelfRunAwary() {
        if (!this._runAwary) {
            this._runAwary = (this.owner.getComponent(EComponentType.RUNAWAY) as RunAwayComp);
        }
    }

    private updateJump() {
        this._jumpTime += GlobalVal.war_MDelta;
        let r = this._jumpTime / this.jumpActionTime;
        if (r > 1) r = 1;
        let v =  Math.sin(r * Math.PI) * this.jumpHei;
        let tx = this._self.y - this._self.offsetY;
        this._self.offsetY = this._offsetY + v; 
        this._self.setPosNow(this._self.x, tx + this._self.offsetY); 
    }

}