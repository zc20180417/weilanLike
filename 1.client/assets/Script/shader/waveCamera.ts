// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Utils from "../utils/Utils";
import WaveShader from "./waveShader";

const { ccclass, property } = cc._decorator;

@ccclass
export default class WaveCamera extends cc.Component {

    @property(cc.Node)
    mapNode: cc.Node = null;

    @property(cc.Node)
    seaNode: cc.Node = null;

    @property(cc.Sprite)
    seaSprite: cc.Sprite = null;

    @property(cc.Camera)
    seaCamera: cc.Camera = null;

    @property(WaveShader)
    waveShader: WaveShader = null;

    @property(cc.Node)
    headNode: cc.Node = null;

    _seaTexture: cc.RenderTexture = null;


    onLoad() {
        this.seaSprite.node.width = cc.winSize.width;
        this.seaSprite.node.height = cc.winSize.height;
        // this.testNode.setContentSize(cc.winSize);

        this._seaTexture = Utils.createTexture();
        let sp = new cc.SpriteFrame();
        sp.setFlipY(true);
        this.seaSprite.spriteFrame = sp;
        this.seaCamera.targetTexture = this._seaTexture;
        this.seaSprite.spriteFrame.setTexture(this._seaTexture);
    }

    update() {
        // this.updatePos();
    }


    lateUpdate() {
        this.updatePos();
        // this.renderSea();
    }
    

    updatePos() {
        let nodePos = this.mapNode.convertToNodeSpaceAR(cc.Vec2.ZERO);

        let tempX = 0;
        if (nodePos.x < 0) {
            tempX = cc.winSize.width / 2;
            // this.testCamera.node.x = tempX;
            // this.testSprite.node.x = tempX;
        } else if (nodePos.x > this.mapNode.width - cc.winSize.width) {
            tempX = this.mapNode.width - cc.winSize.width + cc.winSize.width / 2;
            // this.testCamera.node.x = tempX;
            // this.testSprite.node.x = tempX;
        } else {
            tempX = nodePos.x + cc.winSize.width / 2
            // this.testCamera.node.x = tempX;
            // this.testSprite.node.x = tempX;
            this.waveShader.setOffsetX(nodePos.x / cc.winSize.width);
        }
        // tempX = parseFloat(tempX.toFixed(4));
        this.seaSprite.node.x = tempX;
        this.seaCamera.node.x = tempX;
        //更新摄像机的位置
        // cc.log(this.seaCamera.node.x, this.seaSprite.node.x);

    }


}
