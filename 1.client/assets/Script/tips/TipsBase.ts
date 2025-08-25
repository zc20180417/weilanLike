// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import SystemTipsMgr from "../utils/SystemTipsMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TipsBase extends cc.Component {
    private _systemTipsMgr: SystemTipsMgr = null;
    private _worldBoundingBox: cc.Rect = null;
    private _isShowed: boolean = false;
    private _startOffsetY: number = 120;
    // private _showTime: number = 4;
    private _showAndHideAniTime: number = 0.4;
    private _moveUpAniTime: number = 0.2;
    private _moveDownAniTime: number = 0.2;
    private _endPosY: number = 0;
    private _vecticalTag: number = 1;
    @property({
        tooltip: '显示时间'
    })
    time: number = 4;

    @property({
        tooltip: "提示的右边界与屏幕右边界的偏移"
    })
    offsetX: number = 0;

    public setSystemTipsMgr(systemTipsMgr: SystemTipsMgr) {
        this._systemTipsMgr = systemTipsMgr;
    }

    public show() {
        this._worldBoundingBox = this.node.getBoundingBoxToWorld();
        this.node.x += cc.winSize.width - this._worldBoundingBox.x + this.offsetX;
        this.node.y += this._startOffsetY - this.node.y;
        this._endPosY = this.node.y;
        let self = this;
        cc.tween(this.node).by(this._showAndHideAniTime, { x: -this._worldBoundingBox.width }, { easing: "backOut" })
            .call(() => {
                self._isShowed = true;
                self._systemTipsMgr.onCommentTipsShow(self.node);
                self.scheduleOnce(self.hide, self.time);
            })
            .start();
    }

    public hide() {
        let self = this;
        cc.tween(this.node).by(this._showAndHideAniTime, { x: this._worldBoundingBox.width }, { easing: "backIn" })
            .call(() => {
                self._systemTipsMgr.onCommentTipsHide(self.node);
            })
            .start();
    }

    public moveUp(offsetY: number) {
        cc.Tween.stopAllByTarget(this.node);
        this._endPosY += offsetY;
        cc.tween(this.node).tag(this._vecticalTag).to(this._moveUpAniTime, { y: this._endPosY }, { easing: "backOut" }).start();
    }

    public moveDown(offsetY) {
        cc.Tween.stopAllByTarget(this.node);
        this._endPosY -= offsetY;
        cc.tween(this.node).tag(this._vecticalTag).to(this._moveUpAniTime, { y: this._endPosY }, { easing: "backOut" }).start();
    }

    public isShowed(): boolean {
        return this._isShowed;
    }
}
