import { SkillAmmoDataConfig, SkillTriggerConfig } from "../../../common/ConfigInterface";
import { EventEnum } from "../../../common/EventEnum";
import Game from "../../../Game";
import GlobalVal from "../../../GlobalVal";
import { EFrameCompPriority } from "../../../logic/comps/AllComp";
import { FrameComponent } from "../../../logic/comps/FrameComponent";
import { ERecyclableType } from "../../../logic/Recyclable/ERecyclableType";
import { Monster } from "../../../logic/sceneObjs/Monster";
import SceneObject from "../../../logic/sceneObjs/SceneObject";
import { MathUtils } from "../../../utils/MathUtils";
import { StringUtils } from "../../../utils/StringUtils";
import { LDSkillBase, ReleaseSkillData } from "../LdSkillManager";



export default class LdTargetAmmoComp extends FrameComponent {

    protected _isRun:boolean = false;
    protected _speed:number = 0.1;
    protected _preTime:number = 0;
    protected _skill:LDSkillBase | SkillTriggerConfig ;
    protected _releaseSkillData:ReleaseSkillData;
    protected _dirPos:cc.Vec2;
    protected _endPos:cc.Vec2 = cc.Vec2.ZERO;
    protected _startPos:cc.Vec2 = cc.Vec2.ZERO;
    protected _dis:number = 0;
    protected _target:Monster;
    protected _self:SceneObject;
    protected _ammoDataConfig:SkillAmmoDataConfig;
    private _updateMoveFunc:Function;

    constructor() {
        super();
        this.frameRate = 1;
        this.priority = EFrameCompPriority.PARABOLIC;
        this.key = ERecyclableType.LD_TARGET_AMMO;
    }

    giveUp() {
        this._skill = null;
        this._dirPos = null;
        this._endPos = null;
        this._startPos = null;
        super.giveUp();
    }

    resetData() {

        this._dirPos = null;
        this._self = null;
        super.resetData();
    }

    moveTo(releaseSkillData:ReleaseSkillData) {
        if (!releaseSkillData) {
            cc.log("skill is null");
            return;
        }
        
        this.clearData();
        this._target = Game.soMgr.getMonsterByGuid(releaseSkillData.targetId) as Monster;
        if (this._target) {
            this._target.once(EventEnum.ON_SELF_REMOVE , this.onTargetRemove , this);
        } 

        this._releaseSkillData = releaseSkillData;
        this._skill = releaseSkillData.skill;
        this._ammoDataConfig = Game.ldSkillMgr.getAmmoDataConfig(this._skill.ammoID);
        this._speed = this._ammoDataConfig.speed / 1000;
        this._isRun = true;
        this._preTime = GlobalVal.now;

        if (this._ammoDataConfig.trackType == 0) {
            this._updateMoveFunc = this.normalUpdate;
        } else if (this._ammoDataConfig.trackType) {
            this._state = 0;
            this._updateMoveFunc = this.daoDanUpdate;
        }
    }

    private onTargetRemove(target:SceneObject) {
        if (this._target === target) {
            this._endPos.x = target.centerPos.x;
            this._endPos.y = target.centerPos.y;
            this._target = null;
        }
    }
    
    added() {
        super.added();
        this._self = this.owner as SceneObject;
    }

    removed() {
        if (this._target) {
            this._target.off(EventEnum.ON_SELF_REMOVE , this.onTargetRemove , this);
            this._target = null;
        }
        super.removed();
    }

    update() {
        if (!this._isRun) return;
        this._updateMoveFunc.call(this);
    }

    private normalUpdate() {
        this._startPos.x = this._self.x;
        this._startPos.y = this._self.y;

        if (this._target) {
            this._endPos.x = this._target.centerPos.x;
            this._endPos.y = this._target.centerPos.y;
        }

        this._dirPos = this._endPos.sub(this._startPos ,  this._dirPos).normalizeSelf();
        this._dis = MathUtils.getDistance(this._startPos.x , this._startPos.y , this._endPos.x , this._endPos.y);
        const moveDis = GlobalVal.war_MDelta * this._speed;
        if (moveDis >= this._dis) {
            this._self.setPosNow(this._endPos.x , this._endPos.y);
            this.end();
            return;
        }

        let x = this._startPos.x + this._dirPos.x * moveDis;
        let y = this._startPos.y + (this._dirPos.y * moveDis);
        this._self.setPosNow(x , y);
    }


   

    private _controlPos:cc.Vec2 = cc.Vec2.ZERO;
    private _curveLength:number = 0;
    private _stateTime1:number = 300;
    private _curveProgress:number = 0;
    private _toProgress:number = 0;
    private _state:number = 0;
    private _totalTime:number = 0;
    private daoDanUpdate() {
        if (this._state === 0) {
            // 悬停阶段，导弹保持当前位置，旋转固定
            const moveTime = GlobalVal.now - this._preTime;
            // this._self.rotation = 90;
            this.checkFilp(90);
            if (moveTime >= this._stateTime1) {
                this._state = 1;
                this._preTime = GlobalVal.now;
                // this._prevOffsetX = 0;
    
                // 初始化起点和终点
                this._startPos.x = this._self.x;
                this._startPos.y = this._self.y;
                if (this._target) {
                    this._endPos.x = this._target.centerPos.x;
                    this._endPos.y = this._target.centerPos.y;
                }
    
                // 计算拐点（控制点），取起点和终点中点，向水平方向偏移固定距离形成曲线
                const midX = (this._startPos.x + this._endPos.x) / 2;
                const midY = (this._startPos.y + this._endPos.y) / 3;

                // 计算水平偏移距离，限制最大值
                const horizontalOffset = Math.max(200, Math.abs(this._endPos.x - this._startPos.x) / 2);

                // 根据目标相对起点的位置决定偏移方向
                const offsetDirection = this._endPos.x > this._startPos.x ? -1 : 1;

                // 拐点坐标，向左或向右偏移
                this._controlPos = cc.v2(midX + horizontalOffset * offsetDirection, midY);
    
                // 记录曲线运动总长度（近似用分段折线长度）
                const distStartToControl = MathUtils.getDistance(this._startPos.x, this._startPos.y, this._controlPos.x, this._controlPos.y);
                const distControlToEnd = MathUtils.getDistance(this._controlPos.x, this._controlPos.y, this._endPos.x, this._endPos.y);
                this._curveLength = distStartToControl + distControlToEnd;
                this._toProgress = distStartToControl / this._curveLength;
    
                // 记录当前曲线进度（0~1）
                this._curveProgress = 0;
            }
        } else if (this._state === 1) {
            if (!this._controlPos) {
                // 防御性处理，确保_controlPos存在
                this._state = 2;
                return;
            }
    
            // 计算每帧移动距离
            const moveDis = GlobalVal.war_MDelta * this._speed ;
    
            // 计算当前曲线进度增量
            const deltaProgress = moveDis / this._curveLength;
            this._curveProgress += deltaProgress;
    
            if (this._curveProgress < this._toProgress) {
                // 贝塞尔曲线二次公式：B(t) = (1-t)^2 * P0 + 2(1-t)t * P1 + t^2 * P2
                const t = this._curveProgress;
                const oneMinusT = 1 - t;
    
                const x = oneMinusT * oneMinusT * this._startPos.x + 2 * oneMinusT * t * this._controlPos.x + t * t * this._endPos.x;
                const y = oneMinusT * oneMinusT * this._startPos.y + 2 * oneMinusT * t * this._controlPos.y + t * t * this._endPos.y;
    
                this._self.setPosNow(x, y);
            } else {
                // 曲线运动结束，切换到直线运动状态
                this._state = 2;
                this._preTime = GlobalVal.now;
                // 当前位置作为直线起点
                this._startPos.x = this._self.x;
                this._startPos.y = this._self.y;
            }
        } else if (this._state === 2) {
            // 直线运动阶段，导弹直线飞向目标
            if (this._target) {
                this._endPos.x = this._target.centerPos.x;
                this._endPos.y = this._target.centerPos.y;
            }
            this._dirPos = this._endPos.sub(this._startPos, this._dirPos).normalizeSelf();
            this._dis = MathUtils.getDistance(this._startPos.x, this._startPos.y, this._endPos.x, this._endPos.y);
            // this.checkFilp(MathUtils.getAngle(this._startPos.x, this._startPos.y, this._endPos.x, this._endPos.y));
            this._speed += 0.02;
            const moveDis = GlobalVal.war_MDelta * this._speed;
            if (moveDis >= this._dis) {
                this._self.setPosNow(this._endPos.x, this._endPos.y);
                this.end();
                return;
            }
    
            const x = this._startPos.x + this._dirPos.x * moveDis;
            const y = this._startPos.y + this._dirPos.y * moveDis;
            this._self.setPosNow(x, y);
    
            // 更新起点为当前点，保证下一帧计算正确
            this._startPos.x = x;
            this._startPos.y = y;
        }
    }

    private checkFilp(angle:number) {
        
        if (this._ammoDataConfig.dontRotate == 1) return;
        if (angle>= 90 && angle <= 270) {
            this._self.scaleX = -1;
            this._self.rotation = angle - 180;
        } else {
            this._self.scaleX = 1;
            this._self.rotation = angle;
        }
    }
    

    protected checkHit() {
        this._releaseSkillData.tx = this._self.x;
        this._releaseSkillData.ty = this._self.y;
        Game.ldSkillMgr.onSkillHit(this._target , this._releaseSkillData);
    }

    protected end() {
        if (this.owner) {
            if (!StringUtils.isNilOrEmpty(this._skill.hitRangeEft)) {
                Game.soMgr.createEffect(this._skill.hitRangeEft , this._endPos.x , this._endPos.y , false);
            }

            this.clearData();
            this.checkHit();
            Game.soMgr.removeAmmo(this.owner as SceneObject);
        }
    }

    protected clearData() {
        this._isRun = false;
    }
    
}