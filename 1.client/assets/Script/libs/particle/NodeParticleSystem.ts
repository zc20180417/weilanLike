/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

import { NodeParticleSimulator } from "./NodeParticleSimulator";

/**
 * !#en Enum for emitter modes
 * !#zh 发射模式
 * @enum ParticleSystem.EmitterMode
 */
enum EmitterMode {
    /**
     * !#en Uses gravity, speed, radial and tangential acceleration.
     * !#zh 重力模式，模拟重力，可让粒子围绕一个中心点移近或移远。
     * @property {Number} GRAVITY
     */
    GRAVITY = 0,
    /**
     * !#en Uses radius movement + rotation.
     * !#zh 半径模式，可以使粒子以圆圈方式旋转，它也可以创造螺旋效果让粒子急速前进或后退。
     * @property {Number} RADIUS - Uses radius movement + rotation.
     */
    RADIUS = 1
}

/**
 * !#en Enum for particles movement type.
 * !#zh 粒子位置类型
 * @enum ParticleSystem.PositionType
 */
enum PositionType {
    /**
     * !#en
     * Living particles are attached to the world and are unaffected by emitter repositioning.
     * !#zh
     * 自由模式，相对于世界坐标，不会随粒子节点移动而移动。（可产生火焰、蒸汽等效果）
     * @property {Number} FREE
     */
    FREE = 0,

    /**
     * !#en
     * In the relative mode, the particle will move with the parent node, but not with the node where the particle is. 
     * For example, the coffee in the cup is steaming. Then the steam moves (forward) with the train, rather than moves with the cup.
     * !#zh
     * 相对模式，粒子会跟随父节点移动，但不跟随粒子所在节点移动，例如在一列行进火车中，杯中的咖啡飘起雾气，
     * 杯子移动，雾气整体并不会随着杯子移动，但从火车整体的角度来看，雾气整体会随着火车移动。
     * @property {Number} RELATIVE
     */
    RELATIVE = 1,

    /**
     * !#en
     * Living particles are attached to the emitter and are translated along with it.
     * !#zh
     * 整组模式，粒子跟随发射器移动。（不会发生拖尾）
     * @property {Number} GROUPED
     */
    GROUPED = 2
}

const { ccclass, property, executeInEditMode, playOnFocus } = cc._decorator;

@ccclass
@executeInEditMode
@playOnFocus
export class NodeParticleSystem extends cc.Component {
    /**
     * !#en The Particle emitter lives forever.
     * !#zh 表示发射器永久存在
     * @property {Number} DURATION_INFINITY
     * @default -1
     * @static
     * @readonly
     */
    public static DURATION_INFINITY: -1;

    /**
     * !#en The starting size of the particle is equal to the ending size.
     * !#zh 表示粒子的起始大小等于结束大小。
     * @property {Number} START_SIZE_EQUAL_TO_END_SIZE
     * @default -1
     * @static
     * @readonly
     */
    public static START_SIZE_EQUAL_TO_END_SIZE: -1;

    /**
     * !#en The starting radius of the particle is equal to the ending radius.
     * !#zh 表示粒子的起始半径等于结束半径。
     * @property {Number} START_RADIUS_EQUAL_TO_END_RADIUS
     * @default -1
     * @static
     * @readonly
     */
    public static START_RADIUS_EQUAL_TO_END_RADIUS: -1;

    public static EmitterMode = EmitterMode;

    public static PositionType = PositionType;

    @property(cc.Prefab)
    prefab: cc.Prefab = null;

    private _simulator: NodeParticleSimulator = null;
    private _aspectRatio = 0;
    public get aspectRatio() {
        return this._aspectRatio;
    }
    public set aspectRatio(value) {
        this._aspectRatio = value;
    }

    private _stopped = false;
    public get stopped() {
        return this._stopped;
    }

    public get particleCount() {
        return this._simulator.particles.length;
    }

    /**
     * !#en Play particle in edit mode.
     * !#zh 在编辑器模式下预览粒子，启用后选中粒子时，粒子将自动播放。
     * @property {Boolean} preview
     * @default false
     */
    private _preview: boolean = false;
    @property
    public get preview(): boolean {
        return this._preview;
    }
    public set preview(value: boolean) {
        this._preview = value;
        this.resetSystem();
        if (!value) {
            this.stopSystem();
        }
        cc["engine"].repaintInEditMode();
    }

    onFocusInEditor() {
        let components = this.getParticleComponents(this.node);
        for (let i = 0; i < components.length; ++i) {
            components[i]._startPreview();
        }
    }

    onLostFocusInEditor() {
        let components = this.getParticleComponents(this.node);
        for (let i = 0; i < components.length; ++i) {
            components[i]._stopPreview();
        }
    }
    /**
     * !#en If set to true, the particle system will automatically start playing on onLoad.
     * !#zh 如果设置为 true 运行时会自动发射粒子。
     * @property playOnLoad
     * @type {boolean}
     * @default true
     */
    @property
    private _playOnLoad = false;
    @property
    public get playOnLoad(): boolean {
        return this._playOnLoad;
    }
    public set playOnLoad(value: boolean) {
        this._playOnLoad = value;
    }

    /**
     * !#en Indicate whether the owner node will be auto-removed when it has no particles left.
     * !#zh 粒子播放完毕后自动销毁所在的节点。
     * @property {Boolean} autoRemoveOnFinish
     */
    @property
    private _autoRemoveOnFinish: boolean = false;
    @property
    public get autoRemoveOnFinish(): boolean {
        return this._autoRemoveOnFinish;
    }
    public set autoRemoveOnFinish(value: boolean) {
        this._autoRemoveOnFinish = value;
    }

    /**
     * !#en Indicate whether the particle system is activated.
     * !#zh 是否激活粒子。
     * @property {Boolean} active
     * @readonly
     */
    get active() {
        return this._simulator.active;
    }

    /**
     * !#en Maximum particles of the system.
     * !#zh 粒子最大数量。
     * @property {Number} totalParticles
     * @default 150
     */
    @property
    private _totalParticles = 150;
    @property
    public get totalParticles() {
        return this._totalParticles;
    }
    public set totalParticles(value) {
        this._totalParticles = value;
    }
    /**
     * !#en How many seconds the emitter wil run. -1 means 'forever'.
     * !#zh 发射器生存时间，单位秒，-1表示持续发射。
     * @property {Number} duration
     * @default ParticleSystem.DURATION_INFINITY
     */
    @property
    private _duration = -1;
    @property
    public get duration() {
        return this._duration;
    }
    public set duration(value) {
        this._duration = value;
    }
    /**
     * !#en Emission rate of the particles.
     * !#zh 每秒发射的粒子数目。
     * @property {Number} emissionRate
     * @default 10
     */
    @property
    private _emissionRate = 10;
    @property
    public get emissionRate() {
        return this._emissionRate;
    }
    public set emissionRate(value) {
        this._emissionRate = value;
    }
    /**
     * !#en Life of each particle setter.
     * !#zh 粒子的运行时间。
     * @property {Number} life
     * @default 1
     */
    @property
    private _life = 1;
    @property
    public get life() {
        return this._life;
    }
    public set life(value) {
        this._life = value;
    }
    /**
     * !#en Variation of life.
     * !#zh 粒子的运行时间变化范围。
     * @property {Number} lifeVar
     * @default 0
     */
    @property
    private _lifeVar = 0;
    @property
    public get lifeVar() {
        return this._lifeVar;
    }
    public set lifeVar(value) {
        this._lifeVar = value;
    }

    /**
     * !#en Start color of each particle.
     * !#zh 粒子初始颜色。
     * @property {cc.Color} startColor
     * @default {r: 255, g: 255, b: 255, a: 255}
     */
    @property
    private _startColor: cc.Color = cc.Color.WHITE;
    @property
    public get startColor(): cc.Color {
        return this._startColor;
    }
    public set startColor(value: cc.Color) {
        this._startColor.a = value.a;
        this._startColor.r = value.r;
        this._startColor.g = value.g;
        this._startColor.a = value.a;
    }
    /**
     * !#en Variation of the start color.
     * !#zh 粒子初始颜色变化范围。
     * @property {cc.Color} startColorVar
     * @default {r: 0, g: 0, b: 0, a: 0}
     */
    @property
    private _startColorVar: cc.Color = cc.Color.BLACK;
    @property
    public get startColorVar(): cc.Color {
        return this._startColorVar;
    }
    public set startColorVar(value: cc.Color) {
        this._startColorVar.a = value.a;
        this._startColorVar.r = value.r;
        this._startColorVar.g = value.g;
        this._startColorVar.a = value.a;
    }

    /**
     * !#en Ending color of each particle.
     * !#zh 粒子结束颜色。
     * @property {cc.Color} endColor
     * @default {r: 255, g: 255, b: 255, a: 0}
     */

    @property
    private _endColor: cc.Color = cc.Color.WHITE;
    @property
    public get endColor(): cc.Color {
        return this._endColor;
    }
    public set endColor(value: cc.Color) {
        this._endColor.a = value.a;
        this._endColor.r = value.r;
        this._endColor.g = value.g;
        this._endColor.a = value.a;
    }
    /**
     * !#en Variation of the end color.
     * !#zh 粒子结束颜色变化范围。
     * @property {cc.Color} endColorVar
     * @default {r: 0, g: 0, b: 0, a: 0}
     */
    @property
    private _endColorVar: cc.Color = cc.Color.BLACK;
    @property
    public get endColorVar(): cc.Color {
        return this._endColorVar;
    }
    public set endColorVar(value: cc.Color) {
        this._endColorVar.a = value.a;
        this._endColorVar.r = value.r;
        this._endColorVar.g = value.g;
        this._endColorVar.a = value.a;
    }

    /**
     * !#en Angle of each particle setter.
     * !#zh 粒子角度。
     * @property {Number} angle
     * @default 90
     */
    @property
    private _angle = 90;
    @property
    public get angle() {
        return this._angle;
    }
    public set angle(value) {
        this._angle = value;
    }
    /**
     * !#en Variation of angle of each particle setter.
     * !#zh 粒子角度变化范围。
     * @property {Number} angleVar
     * @default 20
     */
    @property
    private _angleVar = 20;
    @property
    public get angleVar() {
        return this._angleVar;
    }
    public set angleVar(value) {
        this._angleVar = value;
    }
    /**
     * !#en Start size in pixels of each particle.
     * !#zh 粒子的初始缩放。
     * @property {Number} startScale
     * @default 
     */
    @property
    private _startScale = 1;
    @property
    public get startScale() {
        return this._startScale;
    }
    public set startScale(value) {
        this._startScale = value;
    }
    /**
     * !#en Variation of start size in pixels.
     * !#zh 粒子初始缩放的变化范围。
     * @property {Number} startScaleVar
     * @default 0
     */
    @property
    private _startScaleVar = 0;
    @property
    public get startScaleVar() {
        return this._startScaleVar;
    }
    public set startScaleVar(value) {
        this._startScaleVar = value;
    }
    /**
     * !#en End size in pixels of each particle.
     * !#zh 粒子结束时的缩放。
     * @property {Number} endScale
     * @default 0
     */
    @property
    private _endScale = 0;
    @property
    public get endScale() {
        return this._endScale;
    }
    public set endScale(value) {
        this._endScale = value;
    }
    /**
     * !#en Variation of end size in pixels.
     * !#zh 粒子结束缩放的变化范围。
     * @property {Number} endSizeVar
     * @default 0
     */
    @property
    private _endScaleVar = 0;
    @property
    public get endScaleVar(): number {
        return this._endScaleVar;
    }
    public set endScaleVar(value: number) {
        this._endScaleVar = value;
    }
    /**
     * !#en Start angle of each particle.
     * !#zh 粒子开始自旋角度。
     * @property {Number} startSpin
     * @default 0
     */
    @property
    private _startSpin = 0;
    @property
    public get startSpin() {
        return this._startSpin;
    }
    public set startSpin(value) {
        this._startSpin = value;
    }
    /**
     * !#en Variation of start angle.
     * !#zh 粒子开始自旋角度变化范围。
     * @property {Number} startSpinVar
     * @default 0
     */
    @property
    private _startSpinVar = 0;
    @property
    public get startSpinVar() {
        return this._startSpinVar;
    }
    public set startSpinVar(value) {
        this._startSpinVar = value;
    }
    /**
     * !#en End angle of each particle.
     * !#zh 粒子结束自旋角度。
     * @property {Number} endSpin
     * @default 0
     */
    @property
    private _endSpin = 0;
    @property
    public get endSpin() {
        return this._endSpin;
    }
    public set endSpin(value) {
        this._endSpin = value;
    }
    /**
     * !#en Variation of end angle.
     * !#zh 粒子结束自旋角度变化范围。
     * @property {Number} endSpinVar
     * @default 0
     */
    @property
    private _endSpinVar = 0;
    @property
    public get endSpinVar() {
        return this._endSpinVar;
    }
    public set endSpinVar(value) {
        this._endSpinVar = value;
    }

    /**
     * !#en Source position of the emitter.
     * !#zh 发射器位置。
     * @property {Vec2} sourcePos
     * @default cc.Vec2.ZERO
     */
    @property
    private _sourcePos = cc.Vec2.ZERO;
    @property
    public get sourcePos() {
        return this._sourcePos;
    }
    public set sourcePos(value) {
        this._sourcePos = value;
    }

    /**
     * !#en Variation of source position.
     * !#zh 发射器位置的变化范围。（横向和纵向）
     * @property {Vec2} posVar
     * @default cc.Vec2.ZERO
     */
    @property
    private _posVar = cc.Vec2.ZERO;
    @property
    public get posVar() {
        return this._posVar;
    }
    public set posVar(value) {
        this._posVar = value;
    }

    /**
     * !#en Particles movement type.
     * !#zh 粒子位置类型。
     * @property {ParticleSystem.PositionType} positionType
     * @default ParticleSystem.PositionType.FREE
     */
    @property({
        type: cc.Enum(PositionType)
    })
    private _positionType: PositionType = PositionType.FREE;
    @property({
        type: cc.Enum(PositionType)
    })
    public get positionType(): PositionType {
        return this._positionType;
    }
    public set positionType(value: PositionType) {
        this._positionType = value;
    }

    /**
     * !#en Particles emitter modes.
     * !#zh 发射器类型。
     * @property {ParticleSystem.EmitterMode} emitterMode
     * @default ParticleSystem.EmitterMode.GRAVITY
     */
    @property({
        type: cc.Enum(EmitterMode)
    })
    private _emitterMode: EmitterMode = EmitterMode.GRAVITY;
    @property({
        type: cc.Enum(EmitterMode)
    })
    public get emitterMode(): EmitterMode {
        return this._emitterMode;
    }
    public set emitterMode(value: EmitterMode) {
        this._emitterMode = value;
    }

    // GRAVITY MODE

    /**
     * !#en Gravity of the emitter.
     * !#zh 重力。
     * @property {Vec2} gravity
     * @default cc.Vec2.ZERO
     */
    @property
    private _gravity = cc.Vec2.ZERO;
    @property
    public get gravity() {
        return this._gravity;
    }
    public set gravity(value) {
        this._gravity = value;
    }
    /**
     * !#en Speed of the emitter.
     * !#zh 速度。
     * @property {Number} speed
     * @default 180
     */
    @property
    private _speed = 180;
    @property
    public get speed() {
        return this._speed;
    }
    public set speed(value) {
        this._speed = value;
    }
    /**
     * !#en Variation of the speed.
     * !#zh 速度变化范围。
     * @property {Number} speedVar
     * @default 50
     */
    @property
    private _speedVar = 50;
    @property
    public get speedVar() {
        return this._speedVar;
    }
    public set speedVar(value) {
        this._speedVar = value;
    }
    /**
     * !#en Tangential acceleration of each particle. Only available in 'Gravity' mode.
     * !#zh 每个粒子的切向加速度，即垂直于重力方向的加速度，只有在重力模式下可用。
     * @property {Number} tangentialAccel
     * @default 80
     */
    @property
    private _tangentialAccel = 80;
    @property
    public get tangentialAccel() {
        return this._tangentialAccel;
    }
    public set tangentialAccel(value) {
        this._tangentialAccel = value;
    }
    /**
     * !#en Variation of the tangential acceleration.
     * !#zh 每个粒子的切向加速度变化范围。
     * @property {Number} tangentialAccelVar
     * @default 0
     */
    @property
    private _tangentialAccelVar = 0;
    @property
    public get tangentialAccelVar() {
        return this._tangentialAccelVar;
    }
    public set tangentialAccelVar(value) {
        this._tangentialAccelVar = value;
    }
    /**
     * !#en Acceleration of each particle. Only available in 'Gravity' mode.
     * !#zh 粒子径向加速度，即平行于重力方向的加速度，只有在重力模式下可用。
     * @property {Number} radialAccel
     * @default 0
     */
    @property
    private _radialAccel = 0;
    @property
    public get radialAccel() {
        return this._radialAccel;
    }
    public set radialAccel(value) {
        this._radialAccel = value;
    }
    /**
     * !#en Variation of the radial acceleration.
     * !#zh 粒子径向加速度变化范围。
     * @property {Number} radialAccelVar
     * @default 0
     */
    @property
    private _radialAccelVar = 0;
    @property
    public get radialAccelVar() {
        return this._radialAccelVar;
    }
    public set radialAccelVar(value) {
        this._radialAccelVar = value;
    }

    /**
     * !#en Indicate whether the rotation of each particle equals to its direction. Only available in 'Gravity' mode.
     * !#zh 每个粒子的旋转是否等于其方向，只有在重力模式下可用。
     * @property {Boolean} rotationIsDir
     * @default false
     */
    @property
    private _rotationIsDir = false;
    @property
    public get rotationIsDir() {
        return this._rotationIsDir;
    }
    public set rotationIsDir(value) {
        this._rotationIsDir = value;
    }

    // RADIUS MODE

    /**
     * !#en Starting radius of the particles. Only available in 'Radius' mode.
     * !#zh 初始半径，表示粒子出生时相对发射器的距离，只有在半径模式下可用。
     * @property {Number} startRadius
     * @default 0
     */
    @property
    private _startRadius = 0;
    @property
    public get startRadius() {
        return this._startRadius;
    }
    public set startRadius(value) {
        this._startRadius = value;
    }
    /**
     * !#en Variation of the starting radius.
     * !#zh 初始半径变化范围。
     * @property {Number} startRadiusVar
     * @default 0
     */
    @property
    private _startRadiusVar = 0;
    @property
    public get startRadiusVar() {
        return this._startRadiusVar;
    }
    public set startRadiusVar(value) {
        this._startRadiusVar = value;
    }
    /**
     * !#en Ending radius of the particles. Only available in 'Radius' mode.
     * !#zh 结束半径，只有在半径模式下可用。
     * @property {Number} endRadius
     * @default 0
     */
    @property
    private _endRadius = 0;
    @property
    public get endRadius() {
        return this._endRadius;
    }
    public set endRadius(value) {
        this._endRadius = value;
    }
    /**
     * !#en Variation of the ending radius.
     * !#zh 结束半径变化范围。
     * @property {Number} endRadiusVar
     * @default 0
     */
    @property
    private _endRadiusVar = 0;
    @property
    public get endRadiusVar() {
        return this._endRadiusVar;
    }
    public set endRadiusVar(value) {
        this._endRadiusVar = value;
    }
    /**
     * !#en Number of degress to rotate a particle around the source pos per second. Only available in 'Radius' mode.
     * !#zh 粒子每秒围绕起始点的旋转角度，只有在半径模式下可用。
     * @property {Number} rotatePerS
     * @default 0
     */
    @property
    private _rotatePerS = 0;
    @property
    public get rotatePerS() {
        return this._rotatePerS;
    }
    public set rotatePerS(value) {
        this._rotatePerS = value;
    }
    /**
     * !#en Variation of the degress to rotate a particle around the source pos per second.
     * !#zh 粒子每秒围绕起始点的旋转角度变化范围。
     * @property {Number} rotatePerSVar
     * @default 0
     */
    @property
    private _rotatePerSVar = 0;
    @property
    public get rotatePerSVar() {
        return this._rotatePerSVar;
    }
    public set rotatePerSVar(value) {
        this._rotatePerSVar = value;
    }

    startPreview() {
        if (!CC_EDITOR) return;
        if (this.preview) {
            this.resetSystem();
        }
    }

    stopPreview() {
        if (!CC_EDITOR) return;
        if (this.preview) {
            this.resetSystem();
            this.stopSystem();
            cc["engine"].repaintInEditMode();
        }
        if (this["_previewTimer"]) {
            clearInterval(this["_previewTimer"]);
        }
    }

    onLoad() {
        this._aspectRatio = 1;
        this._simulator = new NodeParticleSimulator(this);
        if (!CC_EDITOR && this.playOnLoad) {
            this.resetSystem();
        }
    }



    onDestroy() {
        this._simulator.clear();
        
        if (this.autoRemoveOnFinish) {
            this.autoRemoveOnFinish = false;    // already removed
        }
    }

    lateUpdate(dt) {
        if (this.prefab && !this._simulator.finished) {
            this._simulator.step(dt);
        }
    }

    /**
     * !#en Stop emitting particles. Running particles will continue to run until they die.
     * !#zh 停止发射器发射粒子，发射出去的粒子将继续运行，直至粒子生命结束。
     * @method stopSystem
     * @example
     * // stop particle system.
     * myParticleSystem.stopSystem();
     */
    stopSystem() {
        this._stopped = true;
        this._simulator.stop();
    }

    /**
     * !#en Kill all living particles.
     * !#zh 杀死所有存在的粒子，然后重新启动粒子发射器。
     * @method resetSystem
     * @example
     * // play particle system.
     * myParticleSystem.resetSystem();
     */
    resetSystem() {
        this._stopped = false;
        this._simulator.reset();
    }

    /**
     * !#en Whether or not the system is full.
     * !#zh 发射器中粒子是否大于等于设置的总粒子数量。
     * @method isFull
     * @return {Boolean}
     */
    isFull() {
        return (this.particleCount >= this.totalParticles);
    }

    finishedSimulation() {
        if (CC_EDITOR) {
            if (this.preview && !this.active && !cc["engine"].isPlaying) {
                this.resetSystem();
            }
            return;
        }
        this.resetSystem();
        this.stopSystem();
        if (this.autoRemoveOnFinish && this._stopped) {
            this.node.destroy();
        }
    }
    getParticleComponents(node: cc.Node) {
        let parent = node.parent, comp = node.getComponent(cc.ParticleSystem);
        if (!parent || !comp) {
            return node.getComponentsInChildren(cc.ParticleSystem);
        }
        return this.getParticleComponents(parent);
    }
}