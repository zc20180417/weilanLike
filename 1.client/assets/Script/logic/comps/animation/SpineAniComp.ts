
import { Handler } from "../../../utils/Handler";
import { EventEnum } from "../../../common/EventEnum";
import SysMgr from "../../../common/SysMgr";
import { BaseAnimation } from "../../../utils/effect/BaseAnimation";
import { EActionName } from "./AnimationComp";
import { StringUtils } from "../../../utils/StringUtils";
import { GameEvent } from "../../../utils/GameEvent";
import SkeletonEx from "../../../utils/SkeletonEx";
import GlobalVal from "../../../GlobalVal";


const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("effect/SpineAniComp")
export class SpineAniComp extends BaseAnimation {

    @property(SkeletonEx)
    skeleon: SkeletonEx = null;
    @property([SkeletonEx])
    skeleonList: SkeletonEx[] = [];

    @property([cc.Node])
    attackPos: cc.Node[] = [];//枪口位置

    protected _curName: string = "";
    protected _curAnimationStates: dragonBones.AnimationState[] = [];
    protected _attackNode: cc.Node = null;
    protected _aniCompletedHandler: Handler = null;
    protected _currLevel: number = null;
    protected _actionTimeScale: number = 1;
    protected _dblen:number = 0; 

    reset() {
        this._actionTimeScale = 1;
        this._curName = "";
        this._cacheData.name = '';
    }

    protected onLoad(): void {
        this._dblen = this.skeleonList.length;
        if (this._dblen == 0 && this.skeleon) {
            this.skeleonList.push(this.skeleon);
            this._dblen = 1;
        }
    }

    start() {
        this.skeleonList[0].setEndListener((event, ...args)=> {
            this.onEndEvent(event, args);
        } );
        this.skeleonList[0].setCompleteListener((event, ...args)=> {
            this.onCompleteEvent(event, args);
        } );

        GameEvent.on(EventEnum.TIME_SPEED, this.onTimeSpeedChange, this);
        this._animationInfo.clear();
        this.initAnimationInfo(this._animationInfo ,  this.skeleonList[0]);
        this.onTimeSpeedChange(SysMgr.instance.warSpeed);

        if (!StringUtils.isNilOrEmpty(this._cacheData.name)) {
            this.playAction(this._cacheData.name, this._cacheData.loop , this._cacheData.scale , false);
        }
    }

    protected onEndEvent(event, args) {
        if (this._playEndHandler != null) {
            this._curName = "";
            this._playEndHandler.executeWith(event);
        }
        if (this._aniCompletedHandler) {
            this._aniCompletedHandler.executeWith(event);
        }
    }

    protected onCompleteEvent(event , args) {
        if (this._loopCompleteHandler != null) {
            this._loopCompleteHandler.executeWith(event);
        }
    }

    private _cacheData:{name:string , loop:boolean , scale:number , checkRepeat:boolean} = {name:'', loop:false , scale:1, checkRepeat:true};

    playAction(actionType: string,  isLoop: boolean, scale = 1, checkRepeat: boolean = true) {
        let name = this.getAnimationName(actionType);       
        if (checkRepeat && this._cacheData.name == name && this._cacheData.loop == isLoop && scale == this._cacheData.scale) return;
        this._cacheData.name = name;
        this._cacheData.loop = isLoop;
        this._cacheData.scale = scale;
        this._cacheData.checkRepeat = checkRepeat;
        // cc.log('this._animationInfo.get(name) == undefined:' , this._animationInfo.get(name) == undefined , this._animationInfo.get(name) == null , this._animationInfo.get(name))
        if (StringUtils.isNilOrEmpty(name) || this._animationInfo.get(name) == undefined) {
            return;
        }

        this._actionTimeScale = scale;
        const toScale = scale * (this._timeScale || 1);
        if (scale == 4) {
            cc.log(1);
        }
        this.skeleonList.forEach(element => {
            element.setAnimation(0, name, isLoop);
            element.timeScale = toScale;
        });
    }

    play() {
        this.refreshTimeScale();
    }

    pause() {
        this.skeleonList.forEach(element => {
            element.paused = true;
        });
    }

    resume() {
        this.refreshTimeScale();
        this.skeleonList.forEach(element => {
            element.paused = false;
        });
    }

    set playEndHandler(value: Handler) {
        this._playEndHandler = value;
    }

    set loopCompleteHandler(value: Handler) {
        this._loopCompleteHandler = value;
    }

    set aniCompletedHandler(value: Handler) {
        this._aniCompletedHandler = value;
    }



    setAngle(angle: number) {
        
    }

    public setLevel(level: number) {
       
    }

    

    public setCurrLevel(level: number) {
        this._currLevel = level;
    }

    public setOriginAngle(angle: number) {

    }

    protected onTimeSpeedChange(value: number) {
        this.skeleonList.forEach(element => {
            element.timeScale = value * this._timeScale * this._actionTimeScale;
        });

    }

    protected refreshTimeScale() {
        this.skeleonList.forEach(element => {
            element.timeScale = GlobalVal.warSpeed * this._timeScale * this._actionTimeScale;
        });
    }

    setTimeScale(value: number) {
        super.setTimeScale(value);
        this.refreshTimeScale();
    }

    onDestroy() {
        GameEvent.off(EventEnum.TIME_SPEED, this.onTimeSpeedChange, this);
    }

    /**
     * 获取枪口位置
     */
    getAttackPos(index:number = 0): cc.Vec2 {
        let attackNode = this.getAttackPosNode(index);
        let pos = attackNode.convertToWorldSpaceAR(cc.Vec2.ZERO_R);
        // cc.log("枪口位置", pos.x, pos.y);
        return this.node.parent.convertToNodeSpaceAR(pos);
    }

    getAttackPosNode(index:number = 0): cc.Node {
        const level = index > 0 ? index - 1 : this._currLevel - 1;
        if (this.attackPos && this.attackPos[level]) {
            return this.attackPos[level];
        }
        return this.node;
    }

    setColor(color: cc.Color) {
        this.skeleonList.forEach(element => {
            element.node.color = color
        });;
    }

    enableBtn(enable: boolean) {
        let btn = this.node.getComponent(cc.Button);
        btn.enabled = enable;
    }


    /**
     * 获取动画名称
     * @param actionType 
     */
    public getAnimationName(actionType: string): string {
        let name = "";
        switch (actionType) {
            case EActionName.MOVE:
                name = 'run';
                break;
        }
        if (StringUtils.isNilOrEmpty(name)) {
            name = actionType;
        }
        return name;
    }

    public getArmature(): any {
        return null;
    }

    private _animationInfo:Map<string , {name:string , duration:number}>  = new Map<string , {name:string , duration:number}> ();
    private initAnimationInfo(animationInfo: any, sp: sp.Skeleton) {
        if (!sp) return;
        for (let animation of sp.skeletonData.getRuntimeData().animations as sp.spine.Animation[]) {
            animationInfo.set(animation.name , {
                name: animation.name,
                duration: animation.duration
            });

        }
    }
}