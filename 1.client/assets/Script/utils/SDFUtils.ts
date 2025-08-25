// Copyright 2020 Cao Gaoting<caogtaa@gmail.com>
// https://caogtaa.github.io
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

/*
 * Date: 2021-04-12 19:12:44
 * LastEditors: GT<caogtaa@gmail.com>
 * LastEditTime: 2021-04-12 19:15:20
*/
import { EDT } from "./EDT";

export class SDFUtils {
    protected _edt: EDT;
    protected _maxDist: number = 30;

    private static _instance: SDFUtils = null;
    public static getInstance(): SDFUtils {
        return this._instance || (this._instance = new SDFUtils());
    }

    constructor() {
        this._edt = new EDT;
    }

    public applySDFOutline(src: cc.Node, target: cc.Node) {
        let sz = src.getComponent(cc.Sprite).spriteFrame.getOriginalSize();
        // let sz = sf.getOriginalSize();
        // src.getComponent(cc.Sprite).spriteFrame = sf;
        // let renderNode = this.renderNodes[i];
        let maxDist = this._maxDist;
        // renderNode.width = this.objNode.width = sz.width;
        // renderNode.height = this.objNode.height = sz.height;
        target.width = sz.width;
        target.height = sz.height;
        let texture = this.RenderToMemory(src, null, target, maxDist);

        let result: { texture: cc.RenderTexture, alpha: Uint8ClampedArray } = null;
        result = this._edt.RenderSDF(texture, maxDist);

        let sprite = target.getComponent(cc.Sprite);
        sprite.spriteFrame = new cc.SpriteFrame(result.texture);
        sprite.spriteFrame.setFlipY(true);
        sprite["_updateMaterial"]();
    }

    protected FlushMatProperties(src: cc.Node, sprite: cc.Sprite, sz: cc.Size, useDualChannel: boolean) {
        let mat = sprite.getMaterial(0);

        let tw = sprite.node.width;
        let th = sprite.node.height;
        mat.setProperty("texSize", [tw, th, 1. / tw, 1. / th]);
        mat.setProperty("maxDist", [this._maxDist, 1. / this._maxDist]);
        mat.define("SDF_HI_RES", useDualChannel);
        mat.define("SDF_DUAL_CHANNEL", useDualChannel);

        //@ts-ignore
        // if (mat.getProperty("originTexture") !== undefined) {
        //     mat.setProperty("originTexture", src.getComponent(cc.Sprite).spriteFrame.getTexture());
        // }
    }
    /**
     * 将root节点渲染到target节点上，target节点如果没有sprite组件会自动创建一个并关联内存纹理
     * @param root 
     * @param others 
     * @param target 
     * @param extend 内存纹理相比较原图的扩边大小，上下左右分别多出extend宽度的像素
     * @returns 
     */
    public RenderToMemory(root: cc.Node, others: cc.Node[], target: cc.Node, extend: number = 0): cc.RenderTexture {
        // 使截屏处于被截屏对象中心（两者有同样的父节点）
        let node = new cc.Node;
        node.parent = root;
        node.x = (0.5 - root.anchorX) * root.width;
        node.y = (0.5 - root.anchorY) * root.height;

        let camera = node.addComponent(cc.Camera);
        camera.backgroundColor = new cc.Color(255, 255, 255, 0);        // 透明区域仍然保持透明，半透明区域和白色混合
        camera.clearFlags = cc.Camera.ClearFlags.DEPTH | cc.Camera.ClearFlags.STENCIL | cc.Camera.ClearFlags.COLOR;

        // 设置你想要的截图内容的 cullingMask
        camera.cullingMask = 0xffffffff;

        let success: boolean = false;
        try {
            let globalScale = cc.Vec3.ZERO;
            let worldmat = cc.mat4();
            root.getWorldMatrix(worldmat);
            worldmat.getScale(globalScale);

            let scaleX = globalScale.x;   //this.fitArea.scaleX;
            let scaleY = globalScale.y;   //this.fitArea.scaleY;
            //@ts-ignore
            let gl = cc.game._renderContext;

            let targetWidth = Math.floor(root.width * scaleX + extend * 2);      // texture's width/height must be integer
            let targetHeight = Math.floor(root.height * scaleY + extend * 2);

            // 内存纹理创建后缓存在目标节点上
            // 如果尺寸和上次不一样也重新创建
            let texture: cc.RenderTexture = target["__gt_texture"];
            if (!texture || texture.width != targetWidth || texture.height != target.height) {
                texture = target["__gt_texture"] = new cc.RenderTexture();
                texture.initWithSize(targetWidth, targetHeight, gl.STENCIL_INDEX8);
                texture.packable = false;
                // texture.setFlipY(true);
            }

            camera.alignWithScreen = false;
            // camera.orthoSize = root.height / 2;
            camera.orthoSize = targetHeight / 2;
            camera.targetTexture = texture;

            // 渲染一次摄像机，即更新一次内容到 RenderTexture 中
            camera.render(root);
            if (others) {
                for (let o of others) {
                    camera.render(o);
                }
            }

            let screenShot = target;
            screenShot.active = true;
            screenShot.opacity = 255;

            // screenShot.parent = root.parent;
            // screenShot.position = root.position;
            screenShot.width = targetWidth;     // root.width;
            screenShot.height = targetHeight;   // root.height;
            screenShot.angle = root.angle;

            // fitArea有可能被缩放，截图的实际尺寸是缩放后的
            screenShot.scaleX = 1.0 / scaleX;
            screenShot.scaleY = 1.0 / scaleY;

            let sprite = screenShot.getComponent(cc.Sprite);
            if (!sprite) {
                sprite = screenShot.addComponent(cc.Sprite);
                sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
                sprite.trim = false;
                // sprite.srcBlendFactor = cc.macro.BlendFactor.ONE;
            }

            if (!sprite.spriteFrame) {
                sprite.spriteFrame = new cc.SpriteFrame(texture);
                // sprite.spriteFrame.setFlipY(true);
            }

            success = true;
        } finally {
            camera.targetTexture = null;
            node.removeFromParent();
            // node.destroy();
            if (!success) {
                target.active = false;
            }
        }

        return target["__gt_texture"];
    }
}

