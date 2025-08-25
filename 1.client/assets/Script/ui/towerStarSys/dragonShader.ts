// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { DragonBonesComp } from "../../logic/comps/animation/DragonBonesComp";
import { StringUtils } from "../../utils/StringUtils";


const { ccclass, property, executeInEditMode } = cc._decorator;

@ccclass
export default class DragonShader extends cc.Component {

    dragonMaskMat: cc.Material = null;

    dragonMat: cc.Material = null;

    unlockProgress: number = 0;

    renderCom: cc.RenderComponent = null;

    mat: cc.Material = null;

    maskColor: cc.Color = null;

    _dragonCom: DragonBonesComp = null;

    public enableUpdate: boolean = false;

    setMaskColor(color: string) {
        if (StringUtils.isNilOrEmpty(color)) {
            this.maskColor = cc.Color.RED;
        } else {
            this.maskColor = cc.color(color);
        }
    }

    setDragonMaskMat(mat: cc.Material) {
        this.dragonMaskMat = mat;
    }

    setDragonMat(mat: cc.Material) {
        this.dragonMat = mat;
    }

    setUnlockProgress(progress: number) {
        this.unlockProgress = progress;
    }

    showMask(premultiAlpha: boolean) {
        if (!this.renderCom) {
            this._dragonCom = this.node.getComponent(DragonBonesComp);
            if (!this._dragonCom) return;
            this.renderCom = this._dragonCom.dragon;
        }
        if (!this.maskColor) {
            this.maskColor = cc.Color.RED;
        }
        this.renderCom.setMaterial(0, this.dragonMaskMat);
        this.mat = this.renderCom.getMaterial(0);
        let localY = (this._dragonCom.topY - this._dragonCom.bottomY) * this.unlockProgress + this._dragonCom.bottomY;
        let worldY = this.node.convertToWorldSpaceAR(cc.v2(0, localY));
        if (this.mat) {
            this.mat.setProperty("u_progressY", worldY.y);
            this.mat.setProperty("u_maskColor", this.maskColor);
            this.mat.define("PREMULTI_ALPHA", premultiAlpha);
        }
        //原生平台需要手动更新材质
        if (this.renderCom._updateMaterial) {
            this.renderCom._updateMaterial();
        }
        this.enableUpdate = true;
    }

    hideMask() {
        this.enableUpdate = false;
        if (!this.renderCom) {
            this._dragonCom = this.node.getComponent(DragonBonesComp);
            if (!this._dragonCom) return;
            this.renderCom = this._dragonCom.dragon;
        }
        this.renderCom.setMaterial(0, this.dragonMat);
    }

    public update(dt) {
        if (!this.enableUpdate) return;
        if (this.mat && this.renderCom) {
            let localY = (this._dragonCom.topY - this._dragonCom.bottomY) * this.unlockProgress + this._dragonCom.bottomY;
            let worldY = this.node.convertToWorldSpaceAR(cc.v2(0, localY));
            this.mat.setProperty("u_progressY", worldY.y);
            if (this.renderCom._updateMaterial) {
                this.renderCom._updateMaterial();
            }
        }
    }

}
