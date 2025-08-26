// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseItem from "../../utils/ui/BaseItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CharAnimation extends BaseItem {
    @property(cc.Label)
    label: cc.Label = null;

    private _labelNodes: cc.Node[] = [];

    onLoad() {
        // this.label.node.removeFromParent();
        this.label.node.opacity = 0;
    }

    startAnimation() {
        let wordArr = this.splitToWord(this.data || "");
        let wordPos = this.measureWordPos(wordArr);

        let node: cc.Node;
        let label: cc.Label;

        for (let i = 0, len = wordArr.length; i < len; i++) {
            node = cc.instantiate(this.label.node);
            node.parent = this.node;
            node.opacity = 255;
            label = node.getComponent(cc.Label);
            label.string = wordArr[i];
            node.x = wordPos[i];
            this._labelNodes.push(node);
        }

        for (let i = 0, len = this._labelNodes.length; i < len; i++) {
            this._labelNodes[i].active = false;
            cc.tween(this._labelNodes[i]).delay(i * 0.2).set({ active: true, scale: 3 }).to(0.2, { scale: 1 }, { easing: "backOut" }).start();
        }
    }

    /**
     * 将字符串拆分成单词
     * @param words 
     * @returns 
     */
    private splitToWord(words: string): string[] {
        let result;
        let temp = words.split(" ");
        if (temp.length === 1) {
            //中文
            result = Array.from(words);
        } else {
            //英文
            result = temp.map((value, index) => {
                return index !== 0 ? " " + value : value;
            });
        }
        return result;
    }

    /**
     * 测量每个单词的位置
     * @param wordArr 
     * @returns 
     */
    private measureWordPos(wordArr: string[]): number[] {
        this.label.string = wordArr.join("");
        this.label["_forceUpdateRenderData"]();
        let totalLen = this.label.node.width;
        this.label.node.anchorX = 0;
        this.label.node.x = -totalLen * 0.5;
        this.label.string = "";
        this.label["_forceUpdateRenderData"]();
        let startX, endX;
        startX = this.label.node.x;
        let result = [];
        for (let i = 0; i < wordArr.length; i++) {
            this.label.string += wordArr[i];
            this.label["_forceUpdateRenderData"]();
            endX = this.label.node.x + this.label.node.width;
            result[i] = (endX + startX) * 0.5;
            startX = endX;
        }
        this.label.node.anchorX = 0.5;
        this.label.node.setPosition(cc.Vec2.ZERO);
        return result;
    }

    getAnimationTime() {
        return this._labelNodes.length * 0.2;
    }

    stopAnimation() {
        // this.node.removeAllChildren(true);
        for (let v of this._labelNodes) {
            v.destroy();
        }
        this._labelNodes.length = 0;
    }
}
