import PolygonButton from "../customComponent/PolygonButton";

const { ccclass, property , menu } = cc._decorator;

@ccclass
@menu('Game/Hall/ChapterBookBtn')
export class ChapterBookBtn extends PolygonButton {
 
    @property(cc.Node)
    bindNode:cc.Node = null;

    _updateState () {
        super._updateState();
        if (!this.bindNode) return;
        let state = this._getButtonState();
        /*
        NORMAL: 0,
        HOVER: 1,
        PRESSED: 2,
        DISABLED: 3,
        */
        let color:cc.Color;
        if (state == 0) {
            color = this.normalColor;
        } else if (state == 1) {
            color = this.hoverColor;
        } else if (state == 2) {
            color = this.pressedColor;
        } else {
            color = this.disabledColor;
        }

        this.bindNode.color = color;
    }

}