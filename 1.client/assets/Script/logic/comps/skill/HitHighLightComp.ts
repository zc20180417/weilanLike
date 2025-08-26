import { EventEnum } from "../../../common/EventEnum";
import GlobalVal from "../../../GlobalVal";
import HSL from "../../../shader/HSL";
import { ERecyclableType } from "../../Recyclable/ERecyclableType";
import SceneObject from "../../sceneObjs/SceneObject";
import { EFrameCompPriority } from "../AllComp";
import { FrameComponent } from "../FrameComponent";

export class HitHighLightComp extends FrameComponent {

    private static TIME:number = 120;
    private static HALF_PI = Math.PI;
    private static BRIGHTNESS = 0.15;
    private _startTime:number = 0;
    private _endTime:number = 0;
    private _hsl:HSL;
    constructor() {
        super();
        this.frameRate = 1;
        this.priority = EFrameCompPriority.HIT_HIGH_LIGHT;
        this.key = ERecyclableType.HIT_HIGH_LIGHT;
    }   

    added() {
        super.added();
        this._hsl = null;
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
        if (this._hsl) {
            this._hsl.color = cc.Color.WHITE;
            this._hsl.brightness = 0;
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
        this._endTime = this._startTime + HitHighLightComp.TIME;
    }

    update() {
        if (GlobalVal.now >= this._endTime) {
            this.owner.removeComponent(this);
            return;
        }

        if (!this._hsl) {
            return;
        }

        const curTime = GlobalVal.now - this._startTime;
        const brightness =  Math.sin(curTime / HitHighLightComp.TIME * HitHighLightComp.HALF_PI) * HitHighLightComp.BRIGHTNESS;
        this._hsl.brightness = brightness;
        // (this.owner as SceneObject).opacity = 150;
    }


    private init() {
        let so:SceneObject = this.owner as SceneObject;
        if (so.mainBody) {
            const hsls = so.mainBody.getComponentsInChildren(HSL);
            this._hsl = hsls[0];
            if (this._hsl) {
                this._hsl.color = cc.Color.RED;
            }
        }
        
    }

    private onMainBodyAttached() {
        this.init();

    }

    
}