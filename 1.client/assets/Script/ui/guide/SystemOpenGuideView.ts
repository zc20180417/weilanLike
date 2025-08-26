
import { EResPath } from "../../common/EResPath";
import { EventEnum } from "../../common/EventEnum";
import { GameEvent } from "../../utils/GameEvent";

import Dialog from "../../utils/ui/Dialog";
import { UiManager } from "../../utils/UiMgr";
import { HollowOutCircle } from "./HollowOutCircle";

const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("Game/ui/guide/SystemOpenGuideView")
export class SystemOpenGuideView extends Dialog {

    @property(cc.Label)
    nameLabel:cc.Label = null;

    @property(cc.Label)
    infoLabel:cc.Label = null;

    @property(HollowOutCircle)
    hollowOutCircle:HollowOutCircle = null;

    private _data:any;
    private _curArrowNode:cc.Node;
    setData(data: any) {
        this.infoLabel.string = data.des;
        this._data = data;
    }

    protected beforeShow(): void {
        this.blackLayer.opacity = 180;
        this._curArrowNode = GameEvent.dispathReturnEvent(this._data.getPosEvt, this._data.posEvtParam);

        if (this._curArrowNode) {
            let worldPos = this._curArrowNode.convertToWorldSpaceAR(cc.Vec2.ZERO_R);
            let localPos = this.hollowOutCircle.node.convertToNodeSpaceAR(worldPos);
            const wid = this.hollowOutCircle.node.width;
            const hei = this.hollowOutCircle.node.height;
            let centerX = (localPos.x + wid * 0.5) / wid;
            let centerY = (-localPos.y + hei * 0.5) / hei;
            this.hollowOutCircle.setPropertys(centerX , 
                                                centerY , 
                                                Math.max(this._curArrowNode.width , this._curArrowNode.height) / 75 * 0.045 ,
                                                wid,
                                                hei);

        } else {
            this.hollowOutCircle.setPropertys(.5 , .5 , 0);
        }

    }

    protected afterHide(): void {
        GameEvent.emit(EventEnum.SYSTEM_GUIDE_CLICK);
        UiManager.showDialog(EResPath.COOPERATE_VIEW);
    }
}