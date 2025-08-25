
import SceneObject from "../../sceneObjs/SceneObject";
import { EventEnum } from "../../../common/EventEnum";
import { FrameComponent } from "../FrameComponent";
import { EFrameCompPriority } from "../AllComp";
import { ERecyclableType } from "../../Recyclable/ERecyclableType";

/**淡出组件 */
export default class FadeInComp extends FrameComponent {

    private _self:SceneObject;
    private _opacity:number = 0;

    constructor() {
        super();
        this.frameRate = 2;
        this.priority = EFrameCompPriority.MAX;
        this.key = ERecyclableType.FADE_IN_REMOVE;
    }

    added() {
        this._self = this.owner as SceneObject;
        if (this._self.mainBody) {
            this.doStart();
        } else {
            this._self.once(EventEnum.MAIN_BODY_ATTACHED , this.onMainAttached , this);
        }
        super.added();
    }

    removed() {
        if (this._self) 
            this._self.off(EventEnum.MAIN_BODY_ATTACHED , this.onMainAttached , this);

        super.removed();
    }

    private doStart() {
        this._self.mainBody.opacity = 0;
        this._opacity = 0;
    }

    private doRemove() {
        this._self.removeComponent(this);
    }

    private onMainAttached() {
        this.doStart();
    }

    update() {
        if (this._self.mainBody) {
            let remove:boolean = false;
            this._opacity += 15;
            
            if (this._opacity > 255) {
                this._opacity = 255;
                remove = true;
            }

            this._self.mainBody.opacity = this._opacity;
            if (remove) {
                this.doRemove();
            }
        }
    }
}


