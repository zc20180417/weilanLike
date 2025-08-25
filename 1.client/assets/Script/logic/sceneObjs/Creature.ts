import SceneObject from "./SceneObject";
import { EActType, ActMach } from "../actMach/ActMach";
import { EComponentType } from "../comps/AllComp";
import { ERecyclableType } from "../Recyclable/ERecyclableType";
import { GameEvent } from "../../utils/GameEvent";
import { EventEnum } from "../../common/EventEnum";
import AnimationComp from "../comps/animation/AnimationComp";
import { CreatureState, ECamp, EDir } from "../../common/AllEnum";
import { IAction } from "../actMach/IAction";
import Utils from "../../utils/Utils";
import CreaturePropMiniComp from "../../ld/prop/CreaturePropMiniComp";

export default class Creature extends SceneObject {

    private _actMach: ActMach;
    private _animationComp: AnimationComp;
    protected _prop:CreaturePropMiniComp;
    
    private _dir:EDir = EDir.RIGHT;


    /**配置表 */
    private _cfg: any;
    /**中心点位置 */
    private _centerPos: cc.Vec2 = cc.Vec2.ZERO;

    


    constructor() {
        super();
        this.key = ERecyclableType.CREATURE;
        this._stateCounts.fill(0);
    }

    refreshPos() {
        super.refreshPos();
        this._centerPos.x = this._pos.x;
        this._centerPos.y = this._rect.center.y;
    }

    setDir(dir:EDir) {
        this._dir = dir;
        this.emit(EventEnum.LD_CREATURE_DIR_CHANGE , this._dir);
    }

    get dir() {
        return this._dir;
    }


    onRecycleUse() {
        this._prop = null;
        this._stateCounts.fill(0);
        super.onRecycleUse();
    }

    resetData() {
        this._actMach = null;
        this._cfg = null;
        this._animationComp = null;
        this._dir = EDir.RIGHT;
        this._state = 0;
        this._prop = null;
        super.resetData();
    }

    giveUp() {
        this._animationComp = null;
        this._centerPos = null;
        super.giveUp();
    }

    dispose() {
        let cfg = this._cfg;
        let x = this.x;
        let y = this.y;

        GameEvent.emit(EventEnum.ON_SO_REMOVE, this, cfg, x, y);
        this._cfg = null;
        super.dispose();
    }

    changeTo(actID: EActType, param?: any) {
        if (!this._actMach) {
            this._actMach = this.getAddComponent(EComponentType.ACTMACH) as ActMach;
        }
        this._actMach.changeTo(actID, param);
    }

    isInAct(actID: EActType): boolean {
        if (!this._actMach) return false;
        return this._actMach.isInAct(actID);
    }

    getCurAction():IAction {
        return this._actMach.getAct();
    }

    setAttachGameObject(obj: cc.Node) {
        super.setAttachGameObject(obj);
    }

    tryRemoveMainBody() {
        if (this._mainBody) {
            this._mainBody.targetOff(this);
        }
        super.tryRemoveMainBody();
    }

    

    get animationComp(): AnimationComp {
        return this._animationComp;
    }

    set cfg(value: any) {
        this._cfg = value;
    }

    get cfg(): any {
        return this._cfg;
    }

    get centerPos() {
        return this._centerPos;
    }


    /**初始化动画组件（有可能是序列帧，也有可能是骨骼动画） */
    initAnimationComp(type: EComponentType) {
        this._animationComp = this.getAddComponent(type);
    }

    //状态位
    private _stateCounts: Array<number> = new Array(32);
    get stateCounts(): Array<number> {
        return this._stateCounts;
    }


    private _state: number = 0;
    get state(): number {
        return this._state;
    }

    public inState(state: CreatureState) {
        return !!(this._state & state);
    }

    /**
     * 修改单位状态
     * @param state  
     * @param addOrDec true:增加状态计数，false:减少单位计数
     */
    public modifyState(state: CreatureState, addOrDec = true) {        
        let index = 0, count = 0;
        while (index < 32) {
            if (Utils.OPTR_ARRAY[index] & state) {
                count = this._stateCounts[index];
                this._stateCounts[index] = addOrDec ? count + 1 : Math.max(count - 1, 0);
                if (addOrDec) {
                    count === 0 && (this._state |= Utils.OPTR_ARRAY[index]);
                } else {
                    count === 1 && (this._state &= ~Utils.OPTR_ARRAY[index]);
                }
            }
            index++;
        }
        this.emit(EventEnum.CREATURE_STATE_CHANGE);
    }
    

    get prop():CreaturePropMiniComp {
        return this._prop;
    }

    set prop(value: CreaturePropMiniComp) {
        this._prop = value;
    }

    


}