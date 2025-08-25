
import { Handler } from "../../../utils/Handler";
import { EventEnum } from "../../../common/EventEnum";
import SysMgr from "../../../common/SysMgr";
import { BaseAnimation } from "../../../utils/effect/BaseAnimation";
import { EActionName } from "./AnimationComp";
import { StringUtils } from "../../../utils/StringUtils";
import { GameEvent } from "../../../utils/GameEvent";


const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("effect/DragonBonesComp")
export class DragonBonesComp extends BaseAnimation {

    @property(dragonBones.ArmatureDisplay)
    dragon: dragonBones.ArmatureDisplay = null;
    @property([dragonBones.ArmatureDisplay])
    dragonList: dragonBones.ArmatureDisplay[] = [];

    @property
    lv1ChangHand: boolean = false;//是否交换左右手
    @property
    lv2ChangHand: boolean = false;
    @property
    lv3ChangHand: boolean = false;

    @property([cc.Node])
    attackPos: cc.Node[] = [];//枪口位置

    @property(cc.Vec2)
    offset: cc.Vec2 = cc.Vec2.ZERO;//炮塔展示界面偏移

    @property
    topY: number = 0;

    @property
    bottomY: number = 0;

    @property({
        type: [cc.Float],
        tooltip: "攻击动作每级的速度"
    })
    attackTimeScale: number[] = [];

    protected _curName: string = "";
    // protected _armature: any;
    protected _armatures: any[] = [];
     
    protected _curAnimationStates: dragonBones.AnimationState[] = [];
    protected _animationNames: any[] = [];
    protected _attackNode: cc.Node = null;

    protected _aniCompletedHandler: Handler = null;
    protected _catDragonBoneUiHandler: Handler = null;

    protected _attackAniName: string = null;
    protected _idleAniName: string = null;
    protected _idle2AniName: string = null;
    protected _currLevel: number = null;

    protected lastAttackAniName: string = "";

    protected _boneAngle: number = 0;
    protected _originAngle: number = 0;
    // protected _attackTimeScale: number = 1;
    protected _actionTimeScale: number = 1;
    protected _checkWuqiVisible: boolean = false;
    protected _curActionType: string = '';

    protected _dblen:number = 0; 
    reset() {
        this._boneAngle = 0;
        this._originAngle = 0;
        // this._attackTimeScale = 1;
        this._actionTimeScale = 1;
        this._curName = "";
        this.lastAttackAniName = "";
        this._curActionType = '';
    }

    protected onLoad(): void {
        this._dblen = this.dragonList.length;
        if (this._dblen == 0 && this.dragon) {
            this.dragonList.push(this.dragon);
            this._dblen = 1;
        }
    }

    start() {
        this.dragonList[0].on(dragonBones.EventObject.COMPLETE, this.dragonEventHandler, this);
        this.dragonList[0].on(dragonBones.EventObject.LOOP_COMPLETE, this.dragonEventHandler, this);
        GameEvent.on(EventEnum.TIME_SPEED, this.onTimeSpeedChange, this);
        this.initArmatures();
        this._animationNames = this.dragonList[0].getAnimationNames(this._armatures[0].name);
        this.refreshAniName();
        this.onTimeSpeedChange(SysMgr.instance.warSpeed);
        if (this._originAngle != 0) {
            this.setAngle(this._originAngle);
        }

        if (this._catDragonBoneUiHandler) {
            this._catDragonBoneUiHandler.execute();
        }

        if (!StringUtils.isNilOrEmpty(this._curActionType)) {
            this.playAction(this._curActionType, this._isLoop);
        }
    }

    protected dragonEventHandler(event: any) {
        if (event.type == dragonBones.EventObject.COMPLETE) {
            if (this._playEndHandler != null) {
                this._curName = "";
                this._playEndHandler.executeWith(event);
            }
        } else if (event.type == dragonBones.EventObject.LOOP_COMPLETE) {
            if (this._loopCompleteHandler != null) {
                this._loopCompleteHandler.executeWith(event);
            }
        }

        if (this._aniCompletedHandler) {
            this._aniCompletedHandler.executeWith(event);
        }
    }

    playAction(actionType: string, isLoop: boolean = true , scale: number = 1) {
        let name = this.getAnimationName(actionType);
        // if (this._curName == name) {
        //     return;
        // }
        this._isLoop = isLoop;
        this._curActionType = actionType;
        if (!this._armatures || this._armatures.length == 0) {
            return;
        }

        if (!this.dragonList || this.dragonList.length == 0) {
            return;
        }


        this._actionTimeScale = scale;
        

        if (this._checkWuqiVisible) {
            this.refreshWuqiVisible(this._currLevel);
        }

        this.refreshTimeScale();
        if (this._animationNames.indexOf(name) != -1) {
            this._curName = name;
            this._curAnimationStates.length = 0;
            this.dragonList.forEach(element => {
                this._curAnimationStates.push(element.playAnimation(name, isLoop ? 0 : 1));
            });
        } else if (actionType == EActionName.SHOW) {
            this._curAnimationStates.length = 0;
            this.pause();
        }
    }

    play() {
        this.refreshTimeScale();
        if (this._curAnimationStates.length > 0) {
            this._curAnimationStates.forEach(element => {
                element.play();
            });
        }
    }

    pause() {
        if (this._curAnimationStates.length > 0) {
            this._curAnimationStates.forEach(element => {
                element.play();
            });
        } else if (this.dragon) {
            this.dragon.timeScale = 0;
        }
    }

    resume() {
        this.refreshTimeScale();
        if (this._curAnimationStates.length > 0) {
            this._curAnimationStates.forEach(element => {
                element.play();
            });
        }
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

    set catDragonBoneUiHandler(value: Handler) {
        this._catDragonBoneUiHandler = value;
    }

    setAngle(angle: number) {
        this._originAngle = angle;
        if (angle > 270) {
            angle -= 360;
        }
        if (!this._armatures || this._armatures.length == 0) return;
       
        const bool = angle >= 90 && angle <= 270 ? true : false;
        this.owner && (this.owner.scaleX = bool ? -1 : 1);
        // this._armatures.forEach(element => {
        //     element.flipX = bool;
        //     element.invalidUpdate();
        // });


        // if (!this._bone || !this._hand) return;
        // this._boneAngle = this._angle / 2;
        // this._angle = this._angle - this._boneAngle;
        // let rotation = MathUtils.angle2Radian(this._angle);
        // this._hand.offset.rotation = rotation;
        // if (this._hand1) {
        //     this._hand1.offset.rotation = rotation;
        // }
        // let boneRotation = MathUtils.angle2Radian(this._boneAngle);
        // this._bone.offset.rotation = boneRotation;
        // this._armature.invalidUpdate();
    }

    public setLevel(level: number) {
        this.refreshWuqiVisible(level);
        this._currLevel = level;
        if (level > 1) {
            //在播放下一个动作的时候再刷新一下武器的visible
            this._checkWuqiVisible = true;
        }
        this.lastAttackAniName = this._attackAniName;
        this.refreshAniName();
    }

    protected refreshWuqiVisible(level: number) {
        this._armatures.forEach(element => {
            let slot1: dragonBones.Slot = element.getSlot('wuqi1');
            if (!slot1) return;
            let slot2: dragonBones.Slot = element.getSlot('wuqi2');
            let slot3: dragonBones.Slot = element.getSlot('wuqi3');
            let slot4: dragonBones.Slot = element.getSlot('wuqi4');

            if (slot1 && slot2 && slot3) {
                slot1.displayIndex = level == 1 ? 0 : -1;
                slot2.displayIndex = level == 2 ? 0 : -1;
                slot3.displayIndex = level == 3 ? 0 : -1;
            } else {
                slot1.displayIndex = level - 1;
            }

            if (slot4) {
                slot4.displayIndex = level == 4 ? 0 : -1;
            }
        });
        this._checkWuqiVisible = false;
    }

    public setCurrLevel(level: number) {
        this._currLevel = level;
    }

    public setOriginAngle(angle: number) {
        this._originAngle = angle;
    }

    protected onTimeSpeedChange(value: number) {
        if (this.dragon) {
            this.dragon.timeScale = value * this._timeScale * this._actionTimeScale;
        }
    }

    protected refreshTimeScale() {
        if (this.dragon) {
            this.dragon.timeScale = SysMgr.instance.warSpeed * this._timeScale * this._actionTimeScale;
        }
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
    /**
     * 获取枪的旋转角度
     */
    getGunAngle(): number {
        return this._originAngle;
    }

    isFlipX() {
        return this._armatures[0].flipX;
    }

    setColor(color: cc.Color) {
        this.dragon.node.color = color;
    }

    enableBtn(enable: boolean) {
        let btn = this.node.getComponent(cc.Button);
        btn.enabled = enable;
    }

    /**
     * 刷新动画相应等级动画名称
     */
    refreshAniName() {
        //攻击动画的命名格式attack_{等级}
        //休闲动画1命名格式idle_{等级}_1
        //休闲动画2命名格式idle_{等级}_2

        //更新攻击动画
        for (let i = this._currLevel; i >= 1; i--) {
            if (this._animationNames.indexOf("attack_" + i) != -1) {
                this._attackAniName = "attack_" + i;
                break;
            }
        }

        //更新休闲动画2
        let index = 1;
        for (let i = this._currLevel; i >= 1; i--) {
            if (this._animationNames.indexOf("idle_" + i + "_2") != -1) {
                this._idle2AniName = "idle_" + i + "_2";
                index = i;
                break;
            }
        }
        //更新休闲动画1
        if (this._animationNames.indexOf("idle_" + index + "_1") != -1) {
            this._idleAniName = "idle_" + index + "_1";
        }

    }

    /**
     * 获取动画名称
     * @param actionType 
     */
    public getAnimationName(actionType: string): string {
        let name = "";
        switch (actionType) {
            case EActionName.ATTACK:
                name = this._attackAniName;
                break;
            case EActionName.IDLE:
                name = this._idleAniName;
                break;
            case EActionName.IDLE2:
                name = this._idle2AniName;
                break;
        }

        if (StringUtils.isNilOrEmpty(name)) {
            name = actionType;
        }
        return name;
    }

    public getArmature(): any {
        return this.dragonList[0].armature();
    }

    protected initArmatures() {
        if (!this._armatures || this._armatures.length == 0) {
            this.dragonList.forEach(element => {
                this._armatures.push(element.armature());
            });
        }

    }
}