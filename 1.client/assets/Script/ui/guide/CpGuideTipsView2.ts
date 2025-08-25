import { EventEnum } from "../../common/EventEnum";
import SysMgr from "../../common/SysMgr";
import { GameEvent } from "../../utils/GameEvent";
import { Handler } from "../../utils/Handler";
import { NodeUtils } from "../../utils/ui/NodeUtils";

const { ccclass, property ,menu} = cc._decorator;

@ccclass
@menu("Game/Logic/CpGuideTipsView2")
export class CpGuideTipsView2 extends cc.Component {

    @property(cc.Label)
    label:cc.Label = null;

    @property(cc.Node)
    bg:cc.Node = null;

    @property(dragonBones.ArmatureDisplay)
    effect:dragonBones.ArmatureDisplay = null;

    @property(cc.Node)
    btnRight:cc.Node = null;

    @property(cc.Node)
    btnLeft:cc.Node = null;

    @property(cc.Node)
    infoNode:cc.Node = null;

    private _isShow:boolean = false;
    onRightClick() {
        this.showOrHide(false);
    }

    protected start(): void {
        GameEvent.on(EventEnum.CP_GUIDE_START , this.onShowGuide , this);
        GameEvent.on(EventEnum.CP_GUIDE_END , this.onHideGuide , this);
    }

    protected onDestroy(): void {
        GameEvent.off(EventEnum.CP_GUIDE_START , this.onShowGuide , this);
        GameEvent.off(EventEnum.CP_GUIDE_END , this.onHideGuide , this);
        SysMgr.instance.clearTimer(Handler.create(this.refreshBgWid, this), true);
    }

    private onShowGuide() {
        this.node.active = false;
    }

    onHideGuide() {
        if (this._isShow) {
            this.node.active = true;
            SysMgr.instance.doFrameOnce(Handler.create(this.refreshBgWid, this), 2, true);
        }
    }

    onLeftClick() {
        this.showOrHide(true);
    }

    reset() {
        this._isShow = false;
    }

    private showOrHide(flag:boolean) {
        this.infoNode.active = this.effect.node.active = flag;
        this.btnRight.active = flag;
        this.btnLeft.active = !flag;
    }

    showInfo(info:string) {
        this.node.active = true;
        this.label.string = info;
        this._isShow = true;
        SysMgr.instance.doFrameOnce(Handler.create(this.refreshBgWid, this), 2, true);
        this.infoNode.opacity = 0;
        NodeUtils.fadeTo(this.infoNode, 0.3, 255);
    }

    private refreshBgWid() {
        this.bg.width = (this.label.node.width >> 1 )+ 50;
    }
   
}