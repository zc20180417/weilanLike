
import { FLOAT_DAMAGE_TYPE } from "../common/AllEnum";
import { Handler } from "../utils/Handler";
import { MathUtils } from "../utils/MathUtils";


const { ccclass, property, menu } = cc._decorator;

// let scaleInit: cc.Vec3 = cc.v3(1.0, 1.0, 1.0);
// let scaleUp: cc.Vec3 = cc.v3(1.15, 1.15, 1.10);
// let scaleDown: cc.Vec3 = cc.v3(0.75, 0.75, 0.75);


// let scaleInit: number = 1.0;
// let scaleUp: number = 1.30;
// let scaleDown: number = 1.0;

@ccclass
@menu("Game/LD/FloatComp")
export class FloatComp extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property(cc.Color)
    normalColor:cc.Color = null;

    @property(cc.Color)
    greenColor:cc.Color = null;

    @property(cc.Color)
    blueClolr:cc.Color = null;

    @property
    xOffsetMin: number = 60;
    @property
    xOffsetMax: number = 100;

    @property
    yOffsetMin: number = 60;
    @property
    yOffsetMax: number = 100;

    @property
    downYOffsetMin:number = 10;

    @property
    downYOffsetMax:number = 20;

    @property
    downXOffsetMin:number = 10;

    @property
    downXOffsetMax:number = 20;

    @property
    scaleInit:number = 1.0;

    @property
    scaleUp:number = 1.30;

    @property
    scaleDown:number = 1.0;

    @property
    scaleUpTime: number = 0.15;

    @property
    holdTime:number = 0.08;

    @property
    scaleDownTime: number = 0.25;

    @property
    moveTime:number = 0.20;

    @property
    isCirt:boolean = false;

    @property
    cirtScaleX:number = 0;
    
    @property
    cirtScaleY:number = 0;

    cirtNode:cc.Node = null;
    _startPos: cc.Vec2;
    private _ctrlPos: cc.Vec2;
    private _endPos: cc.Vec2;
    private _playing: boolean;
    private _endFunc: Handler;
    private _animTime: number;
    private _animDuration: number;

    static dodgeStr:string = '闪避';


    play(value: number, type:FLOAT_DAMAGE_TYPE , endFunc: Handler) {
        if (type == FLOAT_DAMAGE_TYPE.DODGE) {
            this.label.string = FloatComp.dodgeStr;
            this.label.node.color = this.blueClolr;
        } else {
            this.label.string = (value >= 0 ? '' + value : '+' + -value);
            this.label.node.color = value < 0 ? this.greenColor : this.normalColor;
        }

        this.node.active = true;
        this.node.opacity = 255;
        this.node.setScale(this.scaleInit);
        if (this.cirtNode) {
            this.cirtNode.active = true;
        }
        this.refreshCirt();
        
        // 动画参数初始化
        this._animTime = 0;
        this._animDuration = this.scaleUpTime + this.holdTime + this.scaleDownTime + this.moveTime;
        this._startPos = cc.v2(this.node.x, this.node.y);

        let x , downX;
        if (Math.random() > 0.25) {
            const dirX = Math.random() > 0.5 ? -1 : 1;
            x = this.node.x + MathUtils.randomIntReal(this.xOffsetMin , this.xOffsetMax) * dirX;
            downX = x + MathUtils.randomIntReal(this.downXOffsetMin , this.downXOffsetMax) * dirX;
        } else {
            x = this.node.x;
            downX = this.node.x;
        }

        const dirY = Math.random() > 0.95 ? -1 : 1;
        const y = this.node.y + MathUtils.randomIntReal(this.yOffsetMin , this.yOffsetMax) * dirY;
        const downY = y + MathUtils.randomIntReal(this.downYOffsetMin , this.downYOffsetMax);
        this._ctrlPos = cc.v2(x, y);
        this._endPos = cc.v2(downX, downY);
        this._playing = true;
        this._endFunc = endFunc;
        // this.node.opacity = 0;
    }

    private refreshCirt() {
        if (this.cirtNode) {
            this.cirtNode.x = this.node.x - 19;
            this.cirtNode.y = this.node.y;
            this.cirtNode.scaleX = this.scaleInit * this.cirtScaleX;
            this.cirtNode.scaleY = this.scaleInit * this.cirtScaleY;
            // this.cirtNode.opacity = this.node.opacity;
        }
    }

    batchUpdate(dt: number): boolean {
        if (!this._playing) return false;
        this._animTime += dt;
        let t = this._animTime / this._animDuration;
        if (t > 1) t = 1;
    
        // 运动轨迹可继续用贝塞尔或直线插值
        let bezierT = t;
        let pos = this._getBezierPoint(bezierT, this._startPos, this._ctrlPos, this._endPos);
        this.node.x = pos.x;
        this.node.y = pos.y;
    
        // 缩放动画：分为三段，前段 scaleUp，短暂停顿，后段 scaleDown
        let scale = this.scaleInit;
        const scaleUpTime = this.scaleUpTime / this._animDuration;
        const scaleDownTime = this.scaleDownTime / this._animDuration;
        const holdTime = this.holdTime / this._animDuration; // 停顿时间（归一化）
        if (t < scaleUpTime) {
            // 第一段：scaleInit -> scaleUp
            const st = t / scaleUpTime;
            scale = this.scaleInit + (this.scaleUp - this.scaleInit) * this._easeOutBack(st);
        } else if (t < scaleUpTime + holdTime) {
            // 第二段：scaleUp 保持
            scale = this.scaleUp;
        } else if (t < scaleUpTime + holdTime + scaleDownTime) {
            // 第三段：scaleUp -> scaleDown
            const st = (t - scaleUpTime - holdTime) / scaleDownTime;
            scale = this.scaleUp + (this.scaleDown - this.scaleUp) * this._easeIn(st);
        } else {
            scale = this.scaleDown;
        }
        this.node.setScale(scale);
    
        // 不处理透明度
    
        if (t >= 1) {
            this._playing = false;
            if (this._endFunc) {
                this._endFunc.executeWith(this);
            }
            return true;
        }
        return false;
    }

    // OutElastic 缓动函数
    private _easeOutElastic(t: number): number {
        const c4 = (2 * Math.PI) / 3;
        return t === 0
            ? 0
            : t === 1
            ? 1
            : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
    }
    private _easeOutBack(t: number): number {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    }
    private _easeIn(t: number): number {
        return t * t;
    }
    private _getBezierPoint(t: number, p0: cc.Vec2, p1: cc.Vec2, p2: cc.Vec2): cc.Vec2 {
        // 二次贝塞尔插值公式
        const x = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
        const y = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;
        return new cc.Vec2(x, y);
    }
}