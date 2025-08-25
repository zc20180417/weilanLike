// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property, executeInEditMode } = cc._decorator;

@ccclass
@executeInEditMode
export default class RotationParticle extends cc.Component {
    @property
    _startRotationX: number = 0;
    @property
    get startRotationX(): number {
        return this._startRotationX;
    }
    set startRotationX(value) {
        this._startRotationX = value || 0;
        this.particle["startRotationX"] = this._startRotationX;
    }

    @property
    _startRotationXVar: number = 0;
    @property
    get startRotationXVar(): number {
        return this._startRotationXVar;
    }
    set startRotationXVar(value) {
        this._startRotationXVar = value || 0;
        this.particle["startRotationXVar"] = this._startRotationXVar;
    }

    @property
    _endRotationX: number = 0;
    @property
    get endRotationX(): number {
        return this._endRotationX;
    }
    set endRotationX(value) {
        this._endRotationX = value || 0;
        this.particle["endRotationX"] = this._endRotationX;
    }

    @property
    _endRotationXVar: number = 0;
    @property
    get endRotationXVar(): number {
        return this._endRotationXVar;
    }
    set endRotationXVar(value) {
        this._endRotationXVar = value || 0;
        this.particle["endRotationXVar"] = this._endRotationXVar;
    }


    @property
    _startRotationY: number = 0;
    @property
    get startRotationY(): number {
        return this._startRotationY;
    }
    set startRotationY(value) {
        this._startRotationY = value || 0;
        this.particle["startRotationY"] = this._startRotationY;
    }

    @property
    _startRotationYVar: number = 0;
    @property
    get startRotationYVar(): number {
        return this._startRotationYVar;
    }
    set startRotationYVar(value) {
        this._startRotationYVar = value || 0;
        this.particle["startRotationYVar"] = this._startRotationYVar;
    }

    @property
    _endRotationY: number = 0;
    @property
    get endRotationY(): number {
        return this._endRotationY;
    }
    set endRotationY(value) {
        this._endRotationY = value || 0;
        this.particle["endRotationY"] = this._endRotationY;
    }

    @property
    _endRotationYVar: number = 0;
    @property
    get endRotationYVar(): number {
        return this._endRotationYVar;
    }
    set endRotationYVar(value) {
        this._endRotationYVar = value || 0;
        this.particle["endRotationYVar"] = this._endRotationYVar;
    }

    @property
    _resistance: number = 0;//阻力系数
    @property
    get resistance(): number {
        return this._resistance;
    }

    set resistance(value) {
        this._resistance = value || 0;
        this.particle["resistance"] = this._resistance;
    }

    particle: cc.ParticleSystem = null;

    onLoad() {
        this.particle = this.node.getComponent(cc.ParticleSystem);
        if (!this.particle) cc.error("RotationParticle 需要挂在具有 cc.ParticleSystem 组件的节点上");
        // cc.log(this.particle["startRotationX"]);
        this.particle["startRotationX"] = this.startRotationX;
        this.particle["startRotationXVar"] = this.startRotationXVar;
        this.particle["endRotationX"] = this.endRotationX;
        this.particle["endRotationXVar"] = this.endRotationXVar;

        this.particle["startRotationY"] = this.startRotationY;
        this.particle["startRotationYVar"] = this.startRotationYVar;
        this.particle["endRotationY"] = this.endRotationY;
        this.particle["endRotationYVar"] = this.endRotationYVar;

        this.particle["resistance"] = this._resistance;
    }

    public resetSystem() {
        if (this.particle) {
            this.particle.resetSystem();
        }
    }

}
