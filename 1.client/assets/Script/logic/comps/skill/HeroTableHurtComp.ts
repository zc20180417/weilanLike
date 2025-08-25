import { EventEnum } from "../../../common/EventEnum";
import GlobalVal from "../../../GlobalVal";
import { ERecyclableType } from "../../Recyclable/ERecyclableType";
import SceneObject from "../../sceneObjs/SceneObject";
import { EFrameCompPriority } from "../AllComp";
import { FrameComponent } from "../FrameComponent";

export class HeroTableHurtComp extends FrameComponent {

    private static TIME:number = 300;
    private static HALF_PI = Math.PI;
    private _startTime:number = 0;
    private _endTime:number = 0;
    private _redNode:cc.Node;
    constructor() {
        super();
        this.frameRate = 1;
        this.priority = EFrameCompPriority.HIT_HIGH_LIGHT;
        this.key = ERecyclableType.LD_HEROTABLE_HURT;
    }   

    added() {
        super.added();
        this._redNode = null;
        let so:SceneObject = this.owner as SceneObject;
        if (so.mainBody) {
            this.init();
        } else {
            so.once(EventEnum.MAIN_BODY_ATTACHED , this.onMainBodyAttached , this);
        }
    }

    removed() {
        this._startTime = 0;
        this._endTime = 0;
        let so:SceneObject = this.owner as SceneObject;

        if (this._redNode) {
            this._redNode.opacity = 0;
        }

        if (so) {
            so.off(EventEnum.MAIN_BODY_ATTACHED , this.onMainBodyAttached , this);
        }
        super.removed();
    }

    giveUp() {
       
    }

    start() {
        this._startTime = GlobalVal.now;
        this._endTime = this._startTime + HeroTableHurtComp.TIME;
    }

    update() {
        if (GlobalVal.now >= this._endTime) {
            this.owner.removeComponent(this);
            return;
        }

        if (!this._redNode) {
            return;
        }

        const curTime = GlobalVal.now - this._startTime;
        const brightness =  Math.sin(curTime / HeroTableHurtComp.TIME * HeroTableHurtComp.HALF_PI) * 255;
        this._redNode.opacity = brightness;
    }


    private init() {
        let so:SceneObject = this.owner as SceneObject;
        if (so.mainBody) {
            this._redNode = so.mainBody.getChildByName('hitNode');
        }
        
    }

    private onMainBodyAttached() {
        this.init();
    }

    
}