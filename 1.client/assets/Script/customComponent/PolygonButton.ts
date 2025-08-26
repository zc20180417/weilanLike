// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property, requireComponent } = cc._decorator;

@ccclass
@requireComponent(cc.PolygonCollider)
export default class PolygonButton extends cc.Button {
    private _camera: cc.Camera = null;
    private _polygonCollider: cc.PolygonCollider = null;

    onLoad() {
        this.node["_hitTest"] = this._hitTest;

    }

    protected start(): void {
        if (!cc.director.getCollisionManager().enabled) {
            cc.director.getCollisionManager().enabled = true;
        }
    }

    //自定义hitTest
    _hitTest(point, listener) {
        let _htVec3a = new cc.Vec3();
        let _mat4_temp = cc.mat4();
        let cameraPt = _htVec3a;
        this._camera = cc.Camera.findCamera(this);
        if (this._camera) {
            this._camera.getScreenToWorldPoint(point, cameraPt);
        }
        else {
            cameraPt.set(point);
        }

        this["_updateWorldMatrix"]();
        // If scale is 0, it can't be hit.
        if (!cc.Mat4.invert(_mat4_temp, this["_worldMatrix"])) {
            return false;
        }

        let hit = false;
        if (!this._polygonCollider) {
            this._polygonCollider = this.getComponent(cc.PolygonCollider);
        }
        if (this._polygonCollider && cc.Intersection.pointInPolygon(point, this._polygonCollider.world.points)) {
            hit = true;
            if (listener && listener.mask) {
                let mask = listener.mask;
                let parent = this;
                let length = mask ? mask.length : 0;
                // find mask parent, should hit test it
                for (let i = 0, j = 0; parent && j < length; ++i, parent = parent["parent"]) {
                    let temp = mask[j];
                    if (i === temp.index) {
                        if (parent === temp.node) {
                            let comp = parent.getComponent(cc.Mask);
                            if (comp && comp["_enabled"] && !comp["_hitTest"](cameraPt)) {
                                hit = false;
                                break
                            }

                            j++;
                        } else {
                            // mask parent no longer exists
                            mask.length = j;
                            break
                        }
                    } else if (i > temp.index) {
                        // mask parent no longer exists
                        mask.length = j;
                        break
                    }
                }
            }
        }

        return hit;
    }
}
