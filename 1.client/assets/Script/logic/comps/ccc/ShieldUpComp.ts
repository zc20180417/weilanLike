import { EventEnum } from "../../../common/EventEnum";
import SysMgr from "../../../common/SysMgr";
import LDWalkComp from "../../../ld/monster/LDWalkComp";
import { Handler } from "../../../utils/Handler";
import { Monster } from "../../sceneObjs/Monster";
import { EComponentType } from "../AllComp";
import { CC_EActionName, EActionName } from "../animation/AnimationComp";
import BindSoComp from "./BindSoComp";

/**
 * 举盾怪（菠萝战士）
 */
const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("Game/comp/ShieldUpComp")
export class ShieldUpComp extends BindSoComp {


    @property({
        tooltip:"休闲待机移动时间"
    })
    idleTime:number = 3000;

    @property({
        tooltip:"举盾移动时间"
    })
    shieldUpTime:number = 3000;

    @property({
        tooltip:"举盾移动速度相对原始速度的百分比值"
    })
    shieldUpSpeedRate:number = 0.3;

    @property({
        tooltip:"举盾伤害减免值，万分比"
    })
    shieldUpReduceRate:number = 7500;

    @property({
        tooltip:"举盾动作",
        type:cc.Enum(CC_EActionName),

    })
    shieldUpAction:CC_EActionName = CC_EActionName.MOVE;


    private _onIdleTimer:Handler;
    private _onShieldUpTimer:Handler;
    private _damageDeepened:number = 0;
    private _frozen:boolean = false;
    private _state:number = 0;
    
    constructor() {
        super();
        this._onIdleTimer = new Handler(this.doIdle , this);
        this._onShieldUpTimer = new Handler(this.doShieldUp , this);
    }

    private _baseSpeed:number = 0;
    private _walkComp:LDWalkComp = null;
    
    onAdd() {
        this._baseSpeed = (this.owner as Monster).cfg.uspace;
        this._walkComp = this.owner.getComponent(EComponentType.LD_WALK);
        this._damageDeepened = 0;
        this._state = 0;
        this.owner.on(EventEnum.MONSTER_FROZEN , this.onFrozen , this);
        this.doIdle();
    }


    onRemove() {
        SysMgr.instance.clearTimer(this._onShieldUpTimer , false);
        SysMgr.instance.clearTimer(this._onIdleTimer , false);
        this.owner.off(EventEnum.MONSTER_FROZEN , this.onFrozen , this);
    }

    private doIdle() {
        this._state = 0;
        this._walkComp.setSpeed(this._baseSpeed);
        (this.owner as Monster).damageReduction -= this._damageDeepened;
        this.onFrozen(this._frozen);
        SysMgr.instance.doOnce(this._onShieldUpTimer , this.idleTime , false);
    }

    private doShieldUp() {
        this._state = 1;
        (this.owner as Monster).damageReduction += this.shieldUpReduceRate;
        this._damageDeepened = this.shieldUpReduceRate;
        this._walkComp.setSpeed(this._baseSpeed * this.shieldUpSpeedRate);
        this.onFrozen(this._frozen);
        SysMgr.instance.doOnce(this._onIdleTimer , this.shieldUpTime , false);
    }

    private onFrozen(flag:boolean) {
        this._frozen = flag;
        if (!flag) {
            let actionName = this._state == 1 ? EActionName[CC_EActionName[this.shieldUpAction]] : EActionName.MOVE;
            (this.owner as Monster).animationComp.playAction(actionName , true);
        }
    }

}