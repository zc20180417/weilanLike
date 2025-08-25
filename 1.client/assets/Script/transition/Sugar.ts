// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { GS_ChatPopSystemText } from "../net/proto/DMSG_Plaza_Sub_Chat";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Sugar extends cc.Component {

    @property(cc.Vec2)
    offset: cc.Vec2 = cc.Vec2.ZERO;

    private originScale: number = 0;

    onLoad() {
        if (this.checkOutOfScreen()) {
            this.node.destroy();
            return;
        }
    }

    checkOutOfScreen() {
        let width = cc.winSize.width, height = cc.winSize.height;
        let screenBox = cc.rect(0, 0, width, height);
        let sugarBox = this.node.getBoundingBoxToWorld();
        return !screenBox.intersects(sugarBox);
    }

    public playStartAni() {
        this.originScale = this.node.scale;
        this.node.scale = 0;
        cc.tween(this.node).to(1, { scale: this.originScale }, { easing: "cubicInOut" }).start();
        cc.tween(this.node).by(1, { angle: 360 }).repeatForever().start();
    }

    public playEndAni() {
        let width = cc.winSize.width, height = cc.winSize.height;
        // let sugarBox = this.node.getBoundingBoxToWorld();
        let worldPos = this.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
        let screenCenterPos = cc.v2(width * 0.5, height * 0.5);
        let intersctPos = null;
        let sugarWidth = this.node.width * 1.5;
        let sugarPos = cc.v2(worldPos.x + this.offset.x, worldPos.y + this.offset.y);
        let rayDir = sugarPos.sub(screenCenterPos).normalize();
        let leftTop = cc.v2(0, height).addSelf(cc.v2(-sugarWidth, sugarWidth));
        let rightTop = cc.v2(width, height).addSelf(cc.v2(sugarWidth, sugarWidth));
        let leftBottom = cc.v2(-sugarWidth, -sugarWidth);
        let rightBottom = cc.v2(width, 0).addSelf(cc.v2(sugarWidth, -sugarWidth));
        let segmentDir = null;

        //上边界
        segmentDir = rightTop.sub(leftTop);
        intersctPos = this.lineIntersectLine(sugarPos, rayDir, leftTop, segmentDir);

        //左边界
        if (!intersctPos) {
            segmentDir = leftTop.sub(leftBottom);
            intersctPos = this.lineIntersectLine(sugarPos, rayDir, leftBottom, segmentDir);
        }
        //下边界
        if (!intersctPos) {
            segmentDir = leftBottom.sub(rightBottom);
            intersctPos = this.lineIntersectLine(sugarPos, rayDir, rightBottom, segmentDir);
        }
        //右边界
        if (!intersctPos) {
            segmentDir = rightBottom.sub(rightTop);
            intersctPos = this.lineIntersectLine(sugarPos, rayDir, rightTop, segmentDir);
        }

        if (intersctPos) {
            let localPos = this.node.parent.convertToNodeSpaceAR(intersctPos);
            cc.tween(this.node).to(0.8, { position: localPos }, { easing: "sineIn" }).start();
        }
    }

    /**
     * 获取射线和线段的交点
     * @param rayPos 
     * @param rayDir 
     * @param segmentPos 
     * @param segmentDir 
     */
    lineIntersectLine(rayPos: cc.Vec2, rayDir: cc.Vec2, segmentPos: cc.Vec2, segmentDir: cc.Vec2): cc.Vec2 {
        let t2 = (rayDir.x * (segmentPos.y - rayPos.y) + rayDir.y * (rayPos.x - segmentPos.x)) / (segmentDir.x * rayDir.y - segmentDir.y * rayDir.x);

        let t1 = (segmentPos.x + segmentDir.x * t2 - rayPos.x) / rayDir.x;
        let intersctPos = null;

        if (t1 > 0 && t2 >= 0 && t2 <= 1) {
            intersctPos = cc.v2(rayPos.x + rayDir.x * t1, rayPos.y + rayDir.y * t1);
        }
        return intersctPos;
    }
}
