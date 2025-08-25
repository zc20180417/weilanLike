
import SceneObject from "../../sceneObjs/SceneObject";
import Game from "../../../Game";
import { FrameComponent } from "../FrameComponent";
import { EFrameCompPriority } from "../AllComp";
import { ERecyclableType } from "../../Recyclable/ERecyclableType";
import { EventEnum } from "../../../common/EventEnum";

/**淡出组件 */
export default class FadeOutComp extends FrameComponent {

    private _self:SceneObject;
    private _opacity:number = 0;

    constructor() {
        super();
        this.frameRate = 2;
        this.priority = EFrameCompPriority.MAX;
        this.key = ERecyclableType.FADE_OUT_REMOVE;
    }

    added() {
        this._self = this.owner as SceneObject;
        if (this._self.mainBody) {
            this.doStart();
        } else {
            this._self.on(EventEnum.MAIN_BODY_ATTACHED , this.onMainAttached , this);
        }
        super.added();
    }

    removed() {
        if (this._self) 
            this._self.off(EventEnum.MAIN_BODY_ATTACHED , this.onMainAttached , this);

        super.removed();
    }

    private doStart() {
        this._self.mainBody.opacity = 255;
        this._opacity = 255;
    }

    private doRemove() {
        Game.soMgr.removeSo(this.owner as SceneObject);
    }

    private onMainAttached() {
        this.doStart();
    }

    update() {
        if (this._self.mainBody) {
            this._opacity -= 10;
            this._self.mainBody.opacity = this._opacity;
    
            if (this._opacity <= 0) {
                this.doRemove();
            }
        }
    }
}


