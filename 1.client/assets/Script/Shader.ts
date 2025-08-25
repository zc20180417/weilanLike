// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

export enum RenderType {
    NONE,
    SPRITE,
    DRAGON,
    SPINE
}

@ccclass
export default class Shader extends cc.Component {
    protected material: cc.Material = null;
    protected render: cc.RenderComponent = null;
    protected renderType: RenderType = RenderType.NONE;
    onLoad() {
        this.render = this.node.getComponent(cc.RenderComponent);
        this.updateRenderType(this.render);
        this.material = this.render.getMaterial(0);
    }

    getRenderType() {
        return this.renderType;
    }

    updateRenderType(render: cc.RenderComponent) {
        if (render instanceof cc.Sprite) {
            this.renderType = RenderType.SPRITE;
        } else if (render instanceof dragonBones.ArmatureDisplay) {
            this.renderType = RenderType.DRAGON;
        } else if (render instanceof sp.Skeleton) {
            this.renderType = RenderType.SPINE;
        }
    }

    updateMaterial() {
        if (this.render && this.render["_updateMaterial"]) {
            this.render["_updateMaterial"]();
        }
    }

    setProperty(name: string, value: any) {
        if (this.material) {
            this.material.setProperty(name, value);
        }
    }

    define(name: string, value: any) {
        if (this.material) {
            this.material.define(name, value);
        }
    }
}
