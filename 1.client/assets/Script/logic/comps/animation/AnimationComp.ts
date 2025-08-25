import { Component } from "../Component";
import SceneObject from "../../sceneObjs/SceneObject";
import { EventEnum } from "../../../common/EventEnum";
import { Handler } from "../../../utils/Handler";
import SysMgr from "../../../common/SysMgr";
import { BaseAnimation } from "../../../utils/effect/BaseAnimation";
import { DragonBonesComp } from "./DragonBonesComp";
import { ERecyclableType } from "../../Recyclable/ERecyclableType";
import Creature from "../../sceneObjs/Creature";

export enum CC_EActionName {
    MOVE,
    IDLE,
    IDLE1,
    IDLE2,
    IDLE3,
    IDLE4,
    ATTACK,
    ATTACK1,
    FORZEN,
    SHOW
}


export enum EActionName {
    MOVE = "move",
    MOVE2 = "move2",
    IDLE = "idle",
    IDLE1 = "idle1",
    IDLE2 = "idle2",
    IDLE3 = "idle3",
    IDLE4 = "idle1-1",
    ATTACK ="attack",
    ATTACK1 ="attack1",
    ATTACK2 ="attack_1_2",
    FORZEN = 'freeze',
    SHOW   = "show",
    GOLD  = "gold",
    HIT  = "onhit",
    DIED  = "die",

    LUOBO_IDLE = "newAnimation_wushang",
    LUOBO_IDLE1 = "newAnimation_1shang",
    LUOBO_IDLE2 = "newAnimation_2shang",
    LUOBO_IDLE3 = "newAnimation_daodi",
    LUOBO_IDLE4 = "newAnimationdaodi2",
    LUOBO_IDLE5 = "newAnimation_med",
    LUOBO_IDLE6 = "newAnimation_med3",
}

export default class AnimationComp extends Component {

    private _actionComp:BaseAnimation;
    protected _actionName:EActionName | string;
    protected _playEndHandler:Handler;
    protected _loopComplete:Handler;

    protected _isLoop:boolean;
    private _scale:number = 1;
    protected _curAngle:number = 0;
    protected _level:number = 0;
    protected _lock:boolean = false;
    
    constructor() {
        super();
        this.key = ERecyclableType.ANIMATION;
        this._playEndHandler = new Handler(this.onPlayEnd , this);
    }

    added() {
        let so:SceneObject = this.owner as SceneObject;
        if (so.mainBody) {
            this.init();
        } else {
            so.on(EventEnum.MAIN_BODY_ATTACHED , this.onMainAttached , this);
        }
    }

    removed() {
        let so:SceneObject = this.owner as SceneObject;
        if (so) 
            so.off(EventEnum.MAIN_BODY_ATTACHED , this.onMainAttached , this);
        //this.resetData();
    }

    resetData() {
        if (this._actionComp) {
            this._actionComp.reset();
        }
        this._actionComp = null;
        this._actionName = null;
        this._curAngle = 0;
        this._loopComplete = null;
        this._lock = false;
        super.resetData();
    }

    giveUp() {
        this._playEndHandler = null;
        super.giveUp();
    }

    getCurActionName():EActionName | string {
        return this._actionName;
    }

    playAction(name:EActionName | string,isLoop:boolean,scale:number = 1) {
        if (!name || this._lock) return;
        this._actionName = name;
        this._isLoop = isLoop;
        this._scale = scale;
        if (!this._actionComp) return;
        this._actionComp.playAction(name,isLoop,scale);

        if (SysMgr.instance.pause) {
            this._actionComp.pause();
        }
    }

    lockAction() {
        this.stopAction();
        this._lock = true;
    }

    unLockAction() {
        this._lock = false;
        this.resumeAction();
    }

    stopAction() {
        if (this._actionComp) {
            this._actionComp.pause();
        }
    }

    resumeAction() {
        if (this._lock) return;
        if (this._actionComp) {
            this._actionComp.resume();
        }
    }

    setAngle(value:number) {
        this._curAngle = value;
        if (this._actionComp) {
            this._actionComp.setAngle(value);
        }
    }

    setRealAngle(value:number) {
        if (this._actionComp) {
            if (this._actionComp.isFrameEffect()) {
                value += 90;
            }
            this.setAngle(value);
        }
    }

    getAngle() {
        return this._curAngle;
    }

    setLevel(level:number) {
        this._level = level;
        if (this._actionComp) {
            this._actionComp.setLevel(level);
        }
    }

    addLoopCompleteEvt() {
        this._loopComplete = new Handler(this.onLoopComplete , this);
        if (this._actionComp) {
            this._actionComp.loopCompleteHandler = this._loopComplete;
        }
    }

    getAttackPos(index:number = 0) {
        if (this._actionComp) {
            return this._actionComp.getAttackPos(index);
        } 
        return cc.Vec2.ZERO_R;
    }

    getAttackPosNode(index:number = 0):cc.Node {
        if (this._actionComp) {
            return this._actionComp.getAttackPosNode(index);
        } 
        return null;
    }

    setTimeScale(value:number) {
        this._actionComp.setTimeScale(value);
    }

    protected onMainAttached() {
        this.init();
    }

    protected init() {
        let so:SceneObject = this.owner as SceneObject;
        if (!so || !so.mainBody) return;
        this._actionComp = so.mainBody.getComponent(BaseAnimation);
        if (!this._actionComp) return;
        this._actionComp.owner = this.owner as Creature;
        this._actionComp.reset();
        this._actionComp.init();
        this._actionComp.playEndHandler = this._playEndHandler;
        if (this._loopComplete ) {
            this._actionComp.loopCompleteHandler = this._loopComplete;
        }
        this.setLevel(this._level);
        this.playAction(this._actionName , this._isLoop , this._scale);
        if (this._curAngle != 0) {
            this.setAngle(this._curAngle);
        }
    }

    protected onPlayEnd() {
        if (this.owner && this.owner['emit']) {
            (this.owner as SceneObject).emit(EventEnum.ACTION_PLAY_END , this._actionName);
        }
    }

    protected onLoopComplete() {
        if (this.owner && this.owner['emit']) {
            (this.owner as SceneObject).emit(EventEnum.LOOP_PLAY_END , this._actionName);
        }
    }
}