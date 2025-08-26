
import { FrameComponent } from "../FrameComponent";
import { EFrameCompPriority } from "../AllComp";
import { ERecyclableType } from "../../Recyclable/ERecyclableType";
import SceneObject from "../../sceneObjs/SceneObject";
import Game from "../../../Game";
import { EventEnum } from "../../../common/EventEnum";
import { BindPointAnchorY } from "../../../common/AllEnum";
import { Point } from "../../../utils/MathUtils";
import EffectEditPro from "../ccc/EffectEditPro";

export default class SoBindEffectComp extends FrameComponent {
    private _allEffect:SceneObject[] = [];
    private _allDic:any = {};
    private _self:SceneObject;
    private _tempVec2:Point = new Point;

    constructor() {
        super();
        this.frameRate = 1;
        this.priority = EFrameCompPriority.BIND_EFFECT;
        this.key = ERecyclableType.BIND_EFFECT;
    }

    added() {
        super.added();
        this._self = this.owner as SceneObject;
    }

    removed() {
        this.removeAllEffect();
        super.removed();
    }

    resetData() {
        this._allEffect = [];
        this._allDic = {};
        this._self = null;
        super.resetData();
    }

    giveUp() {
        this._allEffect = null;
        this._allDic = null;
        this._self = null;
        this._tempVec2 = null;
    }

    update() {
        let len:number = this._allEffect.length;
        if (len <= 0) return;
        let so:SceneObject;
        let pos:cc.Vec2 = this._self.centerPos;
        
        for (let i = len - 1 ; i >= 0 ; i--) {
            so = this._allEffect[i];

            let obj = this._allDic[so.name];
            if (!obj) {
                cc.log("error ! bindEffect");
                continue;
            }


            this.initPos(pos , obj.anchorY);
            so.setPosNow(this._tempVec2.x , this._tempVec2.y);
        }
    }

    playEffect(eftName:string , isLoop:boolean = false , anchorY:number = 0) {
        if (this._allDic[eftName]) {
            return this._allDic[eftName].eft;
        }

        this.initPos(this._self.centerPos , anchorY);
        let eft:SceneObject = Game.soMgr.createEffect(eftName , this._tempVec2.x , this._tempVec2.y , isLoop);
        if (eft.mainBody) {
            let effectEditComp:EffectEditPro = eft.mainBody.getComponent(EffectEditPro);
            if (effectEditComp) {
                anchorY = effectEditComp.anchorY;
                effectEditComp.setTarget(this._self);
            }
        } else {
            eft.once(EventEnum.MAIN_BODY_ATTACHED , this.onEftAttach , this);
        }
        eft.once(EventEnum.ON_SELF_REMOVE , this.onEftRemove , this);
        this._allEffect.push(eft);
        this._allDic[eftName] = {eft:eft , anchorY:anchorY };
        return eft;
    }

    removeEffect(eft:SceneObject) {
        let index = this._allEffect.indexOf(eft);
        if (index != -1) {
            this._allEffect.splice(index , 1);
            this._allDic[eft.name] = null;
            eft.dispose();
        }
    }
    
    private onEftRemove(so:SceneObject) {
        let name = so.name;
        if (this._allEffect) {
            let index = this._allEffect.indexOf(so);
            if (index != -1) {
                this._allEffect.splice(index , 1);
            }
        }
        if (this._allDic) {
            this._allDic[name] = null;
            delete this._allDic[name];
        }
    }

    private onEftAttach(so:SceneObject) {
        Object.values(this._allDic).forEach(element => {
            if (element && element['eft'] == so) {
                let effectEditComp:EffectEditPro = so.mainBody.getComponent(EffectEditPro);
                if (effectEditComp) {
                    element['anchorY'] = effectEditComp.anchorY;
                    this.initPos(this._self.centerPos , element['anchorY']);
                    so.setPosNow(this._tempVec2.x , this._tempVec2.y);
                    effectEditComp.setTarget(this._self);
                }
            }
        })
    }

    private removeAllEffect() {
        let len:number = this._allEffect.length;
        let so:SceneObject;
        for (let i = len - 1 ; i >= 0 ; i--) {
            so = this._allEffect[i];
            so.off(EventEnum.ON_SELF_REMOVE , this.onEftRemove , this);
            so.off(EventEnum.MAIN_BODY_ATTACHED , this.onEftAttach , this);
            so.dispose();
        }

        this._allEffect = [];
        this._allDic = {};
    }

    private initPos(centerPos:cc.Vec2 , anchorY:number) {
        this._tempVec2.x = centerPos.x;
        if (anchorY == BindPointAnchorY.BOTTOM) {
            this._tempVec2.y = this._self.y;
        } else if (anchorY == BindPointAnchorY.CENTER) {
            this._tempVec2.y = centerPos.y;
        } else if (anchorY == BindPointAnchorY.TOP) {
            this._tempVec2.y = this._self.y + this._self.size.height;
        }
    }

}