// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Dialog from "./Dialog";

const { ccclass, property } = cc._decorator;


export interface AnyDialogData {
    targetBoundingBox: cc.Rect;//目标包围盒，根据包围盒确定窗体位置
};

@ccclass
export default class AnyDialog extends Dialog {
    @property({
        tooltip: "窗体左右边界距target的距离"
    })
    targetLimitWidth: number = 0;

    @property({
        tooltip: "窗体上下边界距target的距离"
    })
    targetLimitHeight: number = 0;

    @property({
        tooltip: "窗体左右边界距离屏幕左右边界的最小距离"
    })
    screenMinLimitWidth: number = 0;

    @property({
        tooltip: "窗体上下边界距离屏幕上下边界的最小距离"
    })
    screenMinLimitHeight: number = 0;

    _targetBoundingBox: cc.Rect = null;

    _contentBoundingBox: cc.Rect = null;

    public setData(data: AnyDialogData) {
        this._targetBoundingBox = data.targetBoundingBox;
        this._contentBoundingBox = this.content.getBoundingBoxToWorld();
        this.fitTarget();
    }

    /**
     * 根据target包围盒和限制距离适配窗体
     */
    private fitTarget() {
        let offsetX = 0, offsetY = 0, tempY;
        if (this._targetBoundingBox.x > cc.winSize.width - this._targetBoundingBox.xMax) {
            //窗体显示在target左侧
            offsetX = this._targetBoundingBox.x - this._contentBoundingBox.xMax - this.targetLimitWidth;
        } else {//窗体显示在target右侧
            offsetX = this._targetBoundingBox.xMax - this._contentBoundingBox.x + this.targetLimitWidth;
        }

        if (this._targetBoundingBox.y > cc.winSize.height - this._targetBoundingBox.yMax) {
            //窗体上边界和target上边界重合  
            offsetY = this._targetBoundingBox.yMax - this._contentBoundingBox.yMax;
            tempY = this.screenMinLimitHeight - this._contentBoundingBox.y;
            if (Math.abs(tempY) < Math.abs(offsetY)) {
                offsetY = tempY;
            }
        } else {//窗体下边界和target下边界重合
            offsetY = this._targetBoundingBox.y - this._contentBoundingBox.y;
            tempY = cc.winSize.height - this.screenMinLimitHeight - this._contentBoundingBox.yMax;
            if (Math.abs(tempY) < Math.abs(offsetY)) {
                offsetY = tempY;
            }
        }

        this.content.x += offsetX;
        this.content.y += offsetY;
    }
}
