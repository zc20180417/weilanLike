// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { QUALITY_BG_COLOR } from "../../common/AllEnum";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BgScrollAni extends cc.Component {
    bgHeight: number = null;//背景高度
    bgWidth: number = null;

    bgMoveSpeed: cc.Vec2 = null;//背景从底部移动到顶部的时间

    globalOriginPos: cc.Vec2 = null;

    firstBg: cc.Node = null;
    secondBg: cc.Node = null;

    rightBoundary: number = null;
    topBoundary: number = null;

    // LIFE-CYCLE CALLBACKS
    @property([cc.Node])
    bgNodes: [cc.Node] = [null];

    bgNodesArr: Array<Array<cc.Node>> = [];

    @property([cc.SpriteFrame])
    bgSpriteFrame: [cc.SpriteFrame] = [null];

    @property(cc.Node)
    background: cc.Node = null;

    @property(cc.Node)
    foreground: cc.Node = null;

    _quality: number = 1;

    onLoad() {
        this.bgHeight = 900;
        this.bgWidth = 1500;

        this.bgMoveSpeed = cc.v2(50, 80);

        this.globalOriginPos = this.node.convertToNodeSpaceAR(cc.Vec2.ZERO);

        for (let i = 0; i < 2; i++) {
            this.bgNodesArr.push([]);
            for (let j = 0; j < 2; j++) {
                this.bgNodesArr[i].push(this.bgNodes[i * 2 + j]);
            }
        }

        let pos = cc.v2(this.globalOriginPos.x - this.bgWidth, this.globalOriginPos.y);
        //第一行背景坐标初始化
        this.bgNodesArr[0][0].setPosition(cc.v2(pos));
        this.bgNodesArr[0][1].setPosition(this.globalOriginPos);

        //第二行背景坐标初始化
        this.bgNodesArr[1][0].setPosition(cc.v2(pos.x, pos.y - this.bgHeight));
        this.bgNodesArr[1][1].setPosition(cc.v2(this.globalOriginPos.x, this.globalOriginPos.y - this.bgHeight));

        this.rightBoundary = 1;
        this.topBoundary = 0;

        this.foreground && (this.foreground.opacity = 0);
    }

    refreshBg(quality: number, widthTransition: boolean = false) {
        if (widthTransition && this.foreground && this.background) {
            this.foreground.color = this.background.color;
            this.background.color = cc.color().fromHEX(QUALITY_BG_COLOR[quality.toString()]);
            this.foreground.opacity = 255;
            cc.Tween.stopAllByTarget(this.foreground);
            cc.tween(this.foreground).to(0.3, { opacity: 0 }).start();
        }

        if (quality > this.bgSpriteFrame.length) return;
        let spriteFrame = this.bgSpriteFrame[quality - 1];
        for (let i = 0, len = this.bgNodes.length; i < len; i++) {
            let children = this.bgNodes[i].children;
            let sprite: cc.Sprite = null;
            for (let j = 0, jLen = children.length; j < jLen; j++) {
                sprite = children[j].getComponent(cc.Sprite);
                sprite.spriteFrame = spriteFrame;
            }
        }
    }

    updateBgAni(dt) {
        let detaPos = cc.v2(dt * this.bgMoveSpeed.x, dt * this.bgMoveSpeed.y);

        for (let i = 0, len = this.bgNodes.length; i < len; i++) {
            this.bgNodes[i].x += detaPos.x;
            this.bgNodes[i].y += detaPos.y;
        }

        //右边界检测
        if (this.bgNodesArr[this.topBoundary][this.rightBoundary].x >= this.globalOriginPos.x + cc.winSize.width) {
            let x = this.bgNodesArr[this.topBoundary][(this.rightBoundary + 1) % 2].x - this.bgWidth;
            this.bgNodesArr[this.topBoundary][this.rightBoundary].x = x;
            this.bgNodesArr[(this.topBoundary + 1) % 2][this.rightBoundary].x = x;
            this.rightBoundary = (this.rightBoundary + 1) % 2;
        }


        //上边界检测
        if (this.bgNodesArr[this.topBoundary][this.rightBoundary].y >= this.globalOriginPos.y + cc.winSize.height) {
            let y = this.bgNodesArr[(this.topBoundary + 1) % 2][this.rightBoundary].y - this.bgHeight;
            this.bgNodesArr[this.topBoundary][this.rightBoundary].y = y;
            this.bgNodesArr[this.topBoundary][(this.rightBoundary + 1) % 2].y = y;
            this.topBoundary = (this.topBoundary + 1) % 2;
        }
    }

    update(dt) {
        this.updateBgAni(dt);
    }

    // update (dt) {}
}
